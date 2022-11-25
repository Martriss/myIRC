import connectDB from './connectionDB';

export async function banUser(username: string, adminName: string, duration: number, reason: string): Promise<boolean> {
    // Connexion DB
    let connection;
    try {
        connection = await connectDB();
    } catch (error) {
        console.log(`Catch ${error}`);
        return false;
    }
    // Retrouver user_id selon username
    const [user] = await connection.execute(`SELECT user_id FROM users WHERE name='${username}';`);
    const { user_id } = user[0];
    // Retrouver admin_id(user_id) selon adminName
    const [admin] = await connection.execute(`SELECT user_id FROM users WHERE name='${adminName}';`);
    const admin_id: number = admin[0].user_id;
    // Insert du ban dans la DB
    try {
        const [rows] = await connection.execute(`INSERT INTO bans (user_id, admin_id, reason, banned_at, unbanned_at) VALUES (${user_id}, ${admin_id}, '${reason}', CURRENT_TIMESTAMP(), DATE_ADD(CURRENT_TIMESTAMP(), INTERVAL ${duration} SECOND));`);
    } catch (error) {
        console.log(`Catch ${error}`);
        await connection.end();
        return false;
    }
    // Déconnexion DB
    await connection.end();
    return true;
}

export async function isBan(username: string): Promise<boolean> {
    // Connexion DB
    let connection;
    try {
        connection = await connectDB();
    } catch (error) {
        console.log(`Catch ${error}`);
        return false;
    }
    // Requête sql qui renvoie le dernier ban d'un user
    const [rows] = await connection.execute(`SELECT unbanned_at FROM bans NATURAL JOIN users WHERE users.name='${username}' ORDER BY banned_at DESC LIMIT 1;`);
    // Test si la date limite du ban est atteinte
    if (rows[0] !== undefined) {
        if (rows[0].unbanned_at > new Date()) {
            await connection.end();
            return true;
        }
    }
    // Déconnexion DB
    await connection.end();
    return false;
}

export async function isBanDate(username: string): Promise<any> {
    // Connexion DB
    let connection;
    try {
        connection = await connectDB();
    } catch (error) {
        console.log(`Catch ${error}`);
        return false;
    }
    // Requête sql qui renvoie le dernier ban d'un user
    const [rows] = await connection.execute(`SELECT unbanned_at FROM bans NATURAL JOIN users WHERE users.name='${username}' ORDER BY banned_at DESC LIMIT 1;`);
    // Test si la date limite du ban est atteinte
    if (rows[0] !== undefined) {
        if (rows[0].unbanned_at > new Date()) {
            await connection.end();
            return rows[0].unbanned_at;
        }
    }
    // Déconnexion DB
    await connection.end();
    return null;
}

export async function unbanUser(username: string): Promise<boolean> {
    // Connexion DB
    let connection;
    try {
        connection = await connectDB();
    } catch (error) {
        console.log(`Catch ${error}`);
        return false;
    }
    // Update de la colonne ubanned_at avec date courante
    if (await isBan(username)) {
        try {
            const [rows] = await connection.execute(`UPDATE bans NATURAL JOIN users SET unbanned_at=CURRENT_TIMESTAMP() WHERE users.name='${username}' AND unbanned_at > CURRENT_TIMESTAMP();`);
        } catch (error) {
            console.log(`Catch ${error}`);
            await connection.end();
            return false;
        }
    }
    // Déconnexion DB
    await connection.end();
    return true;
}
