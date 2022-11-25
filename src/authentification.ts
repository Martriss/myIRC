import connectDB from './connectionDB';
import { isBan } from './banUsers';

const mysql = require('mysql2/promise');
const passwordHash = require('password-hash');

export async function register(name: string, password: string): Promise<boolean> {
    const hashedPassword = passwordHash.generate(password);
    let connection;
    try {
        connection = await connectDB();
    } catch (error) {
        console.log(`Catch ${error}`);
        return false;
    }
    try {
        const [rows] = await connection.execute(`INSERT INTO users (name, password, created_at) VALUES ('${name}', '${hashedPassword}', CURRENT_TIMESTAMP());`);
        await connection.end();
        return true;
    } catch (error) {
        // console.log('Catch ' + error);
        await connection.end();
        return false;
    }
}

export async function login(name: string, password: string): Promise<boolean> {
    let connection;
    try {
        connection = await connectDB();
    } catch (error) {
        console.log(`Catch ${error}`);
        return false;
    }
    if (await isBan(name)) {
        await connection.end();
        return false;
    }
    const [rows] = await connection.execute(`SELECT password FROM users WHERE name='${name}';`);
    await connection.end();
    if (typeof rows[0] !== 'undefined') {
        return passwordHash.verify(password, rows[0].password);
    }
    return false;
}

export async function loginAdmin(name: string, password: string): Promise<boolean> {
    let connection;
    try {
        connection = await connectDB();
    } catch (error) {
        console.log(`Catch ${error}`);
        return false;
    }

    const [rows] = await connection.execute(`SELECT password FROM users WHERE name='${name}' AND isAdmin='1';`);
    await connection.end();
    if (typeof rows[0] !== 'undefined') {
        return passwordHash.verify(password, rows[0].password);
    }
    return false;
}
