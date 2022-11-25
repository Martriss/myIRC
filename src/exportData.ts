import connectDB from './connectionDB';

const fs = require('fs');

export function formatedString(str: string): string {
    if (str.length < 2) {
        const tmpStr = '0' + str;
        return tmpStr;
    }

    return str;
}

export function pathToWrite(path: string): string {
    const dateNow = new Date(Date.now());
    const dateNowString = dateString1(dateNow);
    const nameFile = 'log_' + dateNowString + '.csv';
    const pathFile = path + nameFile;

    return pathFile;
}

export function dateString1(theDate: Date) {
    const dateNowString = formatedString(theDate.getDate().toString()) + '-' + formatedString(theDate.getMonth().toString()) + '-' + theDate.getFullYear() + '_' + formatedString(theDate.getHours().toString()) + ':' + formatedString(theDate.getMinutes().toString()) + ':' + formatedString(theDate.getSeconds().toString());

    return dateNowString;
}

export function dateString2(theDate: Date) {
    const dateNowString = formatedString(theDate.getDate().toString()) + '-' + formatedString(theDate.getMonth().toString()) + '-' + theDate.getFullYear() + ' ' + formatedString(theDate.getHours().toString()) + ':' + formatedString(theDate.getMinutes().toString()) + ':' + formatedString(theDate.getSeconds().toString());

    return dateNowString;
}

export async function exportDataBetweenDates(beginDate: Date, endDate: Date): Promise<any> {
    let connection;
    try {
        connection = await connectDB();
    } catch (error) {
        console.log('Catch ' + error);
        return false;
    }
    beginDate = new Date(beginDate);
    endDate = new Date(endDate);

    const [allData] = await connection.execute(`SELECT conversations.conv_name, users.name as user_name, content, send_at FROM conversations NATURAL JOIN messages INNER JOIN users ON messages.user_id = users.user_id WHERE send_at BETWEEN '${beginDate.toISOString()}' AND '${endDate.toISOString()}' ORDER BY conv_name, send_at;`);
    await connection.end();
   
    return allData;
}

export async function exportDataFromUser(username: string): Promise<any> {
    let connection;
    try {
        connection = await connectDB();
    } catch (error) {
        console.log('Catch ' + error);
        return false;
    }

    const [allData] = await connection.execute(`SELECT name, connected_at, disconnected_at, conv_id FROM connections NATURAL JOIN users WHERE users.name = '${username}' ORDER BY connected_at;`);

    for (const data of allData) {
        const beginDate = new Date(data.connected_at);
        const endDate = new Date(data.disconnected_at);
        [data.messages] = await connection.execute(`SELECT conv_name, name as user_name, content, send_at FROM conversations NATURAL JOIN messages INNER JOIN users ON messages.user_id=users.user_id WHERE conv_id=${data.conv_id} AND send_at BETWEEN '${beginDate.toISOString()}' AND '${endDate.toISOString()}';`);
    }

    await connection.end();

    // for (const data of allData) {
    //     console.log(data);
    // }

    return allData;
}
