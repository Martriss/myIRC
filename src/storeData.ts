import connectDB from './connectionDB';

export async function storeMsg(room: string, time: Date, username: string, message: string): Promise<boolean> {
    // Connexion DB
    let connection;
    try {
        connection = await connectDB();
    } catch (error) {
        console.log('Catch ' + error);
        return false;
    }
    time = new Date(time);
    message = message.replace('\'', '\\\'');
    // Retrouver user_id selon username
    const [user] = await connection.execute(`SELECT user_id FROM users WHERE name='${username}';`);
    const user_id: number = user[0].user_id;
    // Retrouver conv_id selon conv_name(room)
    const [conv] = await connection.execute(`SELECT conv_id FROM conversations WHERE conv_name='${room}';`);
    const conv_id: number = conv[0].conv_id;
    // Formatter date typescript en date mysql
    const timeDB: string = time.toISOString().slice(0, 19).replace('T', ' ');
    // Exécuter requête sql d'insertion
    try {
        const [rows] = await connection.execute(`INSERT INTO messages (content, send_at, user_id, conv_id) VALUES ('${message}', '${timeDB}', ${user_id}, ${conv_id});`);
    } catch (error) {
        console.log('Catch ' + error);
        await connection.end();
        return false;
    }
    // Déconnexion DB
    await connection.end();
    return true;
}

export async function storeConv(name: string): Promise<boolean> {
    let connection;
    try {
        connection =  await connectDB();
    } catch (error) {
        console.log('Catch ' + error);
        return false;
    }
    
    const [conv_exist] = await connection.execute(`SELECT * FROM conversations WHERE conv_name = '${name}'`);

    if (typeof conv_exist[0] === 'undefined') {
        try {
            const [rows] = await connection.execute(`INSERT INTO conversations (conv_name, created_at) VALUES ('${name}', CURRENT_TIMESTAMP());`);
        } catch (error) {
            console.log('Catch ' + error);
            await connection.end();
            return false;
        }
    }

    await connection.end();
    return true;
}

export async function storeConnection(username: string, room: string): Promise<boolean> {
    let connection;
    try {
        connection =  await connectDB();
    } catch (error) {
        console.log('Catch ' + error);
        return false;
    }

    const [user] = await connection.execute(`SELECT user_id FROM users WHERE name='${username}';`);
    const user_id: number = user[0].user_id;

    const [conv] = await connection.execute(`SELECT conv_id FROM conversations WHERE conv_name='${room}';`);
    const conv_id: number = conv[0].conv_id;

    try {
        const [rows] = await connection.execute(`INSERT INTO connections (connected_at, user_id, conv_id) VALUES (CURRENT_TIMESTAMP(), ${user_id}, ${conv_id});`);
    } catch (error) {
        console.log('Catch ' + error);
        await connection.end();
        return false;
    }

    await connection.end();
    return true;
}

export async function storeDisconnection(username: string, room: string): Promise<boolean> {
    let connection;
    try {
        connection =  await connectDB();
    } catch (error) {
        console.log('Catch ' + error);
        return false;
    }

    const [user] = await connection.execute(`SELECT user_id FROM users WHERE name='${username}';`);
    const user_id: number = user[0].user_id;

    const [conv] = await connection.execute(`SELECT conv_id FROM conversations WHERE conv_name='${room}';`);
    const conv_id: number = conv[0].conv_id;

    try {
        const [rows] = await connection.execute(`UPDATE connections SET disconnected_at = CURRENT_TIMESTAMP() WHERE user_id = ${user_id} AND conv_id = ${conv_id} AND ISNULL(disconnected_at);`);
    } catch (error) {
        console.log('Catch ' + error);
        await connection.end();
        return false;
    }

    await connection.end();
    return true;
}
