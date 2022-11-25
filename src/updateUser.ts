import connectDB from './connectionDB';

const passwordHash = require('password-hash');

const mysql = require('mysql2/promise');

export async function updatePwd(username: string, newpassword: string) {
    const hashedPassword = passwordHash.generate(newpassword);
    let connection;
    try {
        connection = await connectDB();
    } catch (error) {
        console.log(`Catch ${error}`);
        return false;
    }
    try {
        const [rows] = await connection.execute(`UPDATE users SET password='${hashedPassword}' WHERE name='${username}'`);
        await connection.end();
        return true;
    } catch (error) {
        // console.log('Catch ' + error);
        await connection.end();
        return false;
    }
}

export async function updateName(username: string, newName: string) {
    let connection;
    try {
        connection = await connectDB();
    } catch (error) {
        console.log(`Catch ${error}`);
        return false;
    }
    try {
        const [rows] = await connection.execute(`UPDATE users SET name='${newName}' WHERE name='${username}'`);
        await connection.end();
        return true;
    } catch (error) {
        // console.log('Catch ' + error);
        await connection.end();
        return false;
    }
}
