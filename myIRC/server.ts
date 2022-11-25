/* eslint-disable for-direction */
/* eslint-disable max-len */
import { Server } from 'socket.io';
import {
    SocketData, ClientToServerEvents, ServerToClientEvents,
} from './socketInterfaces';
import { exportDataBetweenDates, exportDataFromUser } from '../src/exportData';
import {
    storeConnection, storeConv, storeDisconnection, storeMsg,
} from '../src/storeData';
import { register, login, loginAdmin } from '../src/authentification';
import { updatePwd } from '../src/updateUser';
import { banUser, unbanUser, isBanDate } from '../src/banUsers';

const { instrument } = require('@socket.io/admin-ui');

const io = new Server<
ClientToServerEvents,
ServerToClientEvents,
SocketData
>(3000, {
    cors: {
        origin: ['https://admin.socket.io'],
        credentials: true,
    },
});

interface UserType {
    userID: string[];
    username: string;
}
const rooms:any = {};
const users:UserType[] = [];

console.log('Listening on port 3000..');

function userIndex(name:string):number {
    for (let i = 0; i < users.length; i += 1) {
        if (users[i].username === name) return i;
    }
    return -1;
}

function userAdding(id:string, name:string):void {
    let user = userIndex(name);
    if (user !== -1) {
        users[user].userID.push(id);
        return;
    }
    user = users.push({
        userID: [],
        username: name,
    });
    user -= 1;
    users[user].userID.push(id);
}

io.on('connection', (socket:any) => {
    socket.on('register', async (username:string, password:string, callback:Function) => {
        const done:boolean = await register(username, password);
        if (!done) {
            callback(false);
        } else {
            callback(true);
        }
    });

    socket.on('login', async (username:string, password:string, callback:Function) => {
        const done:boolean = await login(username, password);
        if (!done) {
            callback(false);
        } else {
            callback(true);
        }
    });

    socket.on('loginAdmin', async (username:string, password:string, callback:Function) => {
        const done:boolean = await loginAdmin(username, password);
        if (!done) {
            callback(false);
        } else {
            callback(true);
        }
    });

    socket.on('def-login', (pseudo:string) => {
        socket.data.username = pseudo;
        socket.data.rooms = [];
        userAdding(socket.id, socket.data.username);
        console.log(`${socket.data.username} connected on socket: ${socket.id}`);
    });

    socket.on('send-message', (message:string, room:string = '') => {
        if (room === '') {
            socket.broadcast.emit('receive-message', socket.data.username, message, '');
        } else if (rooms[room] && rooms[room].includes(socket.data.username)) {
            socket.to(room).emit('receive-message', socket.data.username, message, room);
            const date = new Date();
            date.setUTCHours(date.getUTCHours() + 1);
            storeMsg(room, date, socket.data.username, message);
        } else {
            socket.to(socket.id).emit('receive-pm', 'server', "You're not in this room");
        }
    });

    socket.on('send-pm', (recipient:string, message:string) => {
        let index:number = userIndex(recipient);
        if (index === -1) io.to(socket.id).emit('receive-pm', 'Server', 'User not found');
        else for (const id of users[index].userID) socket.to(id).emit('receive-pm', socket.data.username, message);
        index = userIndex(socket.data.username);
        if (index === -1) io.to(socket.id).emit('receive-pm', 'Server', 'User not found');
        else for (const id of users[index].userID) socket.to(id).emit('receive-pm', recipient, message);
    });

    socket.on('join-room', async (room:string, callback:Function) => {
        if (socket.data.rooms && socket.data.rooms.includes(room)) {
            callback(`Already in ${room}`);
            return;
        }
        socket.join(room);
        if (rooms[room]) {
            rooms[room].push(socket.data.username);
            if (socket.data.rooms) {
                socket.data.rooms.push(room);
            } else {
                socket.data.rooms = [room];
            }
        } else {
            rooms[room] = [socket.data.username];
            await storeConv(room);
            if (socket.data.rooms) {
                socket.data.rooms.push(room);
            } else {
                socket.data.rooms = [room];
            }
        }
        console.log(`${socket.data.username}:${socket.id} joined ${room}`);
        storeConnection(socket.data.username, room);

        socket.to(room).emit('receive-message', room, `${socket.data.username} joined ${room}`, room);

        callback(`Joined ${room}`);
    });

    socket.on('leave-room', (room:string, callback:Function) => {
        if (rooms[room] && rooms[room].includes(socket.data.username)) {
            storeDisconnection(socket.data.username, room);
            if (socket.data.rooms.length > 1) {
                socket.data.rooms.splice(socket.data.rooms.indexOf(room), 1);
                const indexInList:number = rooms[room].indexOf(socket.data.username);
                rooms[room].splice(indexInList, 1);
                socket.leave(room);
            } else if (socket.data.rooms[0] !== '#main') {
                socket.data.rooms.splice(socket.data.rooms.indexOf(room), 1);
                const indexInList:number = rooms[room].indexOf(socket.data.username);
                rooms[room].splice(indexInList, 1);
                socket.leave(room);
                callback('join-main');
            } else {
                socket.data.rooms.splice(socket.data.rooms.indexOf(room), 1);
                const indexInList:number = rooms[room].indexOf(socket.data.username);
                rooms[room].splice(indexInList, 1);
                socket.leave(room);
                socket.disconnect();
            }
            console.log(`${socket.data.username} left ${room}, still in ${socket.data.rooms}`);
        } else {
            callback('You are not a member of this room');
        }
        callback(`Left ${room}`);
    });

    socket.on('room-list', (callback:Function) => {
        console.log(`sending ${socket.data.username} the list of rooms`);
        callback(`List of rooms : ${Object.keys(rooms).join(', ')}`);
    });

    socket.on('room-info', (room:string, callback:Function) => {
        if (rooms[room] && rooms[room].includes(socket.data.username)) {
            let uniqueRoomUsersList:string[] = [];

            uniqueRoomUsersList = rooms[room].filter((value:string, i:number) => rooms[room].indexOf(value) === i);

            console.log(uniqueRoomUsersList);

            console.log(`sending ${socket.data.username} the members of ${room}`);
            callback(`Members of ${room} : ${uniqueRoomUsersList.join(', ')}.`);
        } else {
            console.log(`User ${socket.data.username} tried to get the members of ${room} but is not a member.`);
            callback(`You are not a member of ${room}.`);
        }
    });

    socket.on('user-info', (user:string, callback:Function) => {
        const index = userIndex(user);
        if (index === -1) {
            callback(`${user} is not online.`);
            return;
        }
        const RoomLists:any[] = users[index].userID.map((socketId:string) => {
            const socketTarget = io.sockets.sockets.get(socketId);
            if (socketTarget) {
                return socketTarget.data.rooms;
            }
            return '';
        });
        let uniqueRoomList:string[] = [];
        RoomLists.forEach((list:string[]) => {
            uniqueRoomList = uniqueRoomList.concat(list);
        });

        uniqueRoomList = uniqueRoomList.filter((value, i) => uniqueRoomList.indexOf(value) === i);

        console.log(uniqueRoomList);
        callback(`${user} is online in rooms : ${uniqueRoomList.join(', ')}`);

        for (const loggedUser of users) {
            if (loggedUser.username === user) {
                callback(`User ${user} is online.`);
                return;
            }
        }
        callback(`${user} is not online.`);
    });

    socket.on('disconnect', () => {
        for (let i = 0; i < users.length; i += 1) {
            for (let j = 0; j < users[i].userID.length; j += 1) {
                if (users[i].userID[j] === socket.id) {
                    for (const room of socket.data.rooms) {
                        storeDisconnection(socket.data.username, room);
                        for (let p = 0; p < rooms[room].length; p += 1) {
                            if (rooms[room][p] === socket.data.username) {
                                rooms[room].splice(p, 1);
                                break;
                            }
                        }
                        socket.leave(room);
                    }
                    users[i].userID.splice(j, 1);
                    if (users[i].userID.length === 0) users.splice(i, 1);
                    return;
                }
            }
        }
        console.log(`${socket.data.username} has left the server.`);
    });

    socket.on('export-between-dates', async (beginDate: Date, endDate:Date, path:string) => {
        beginDate = new Date(beginDate);
        endDate = new Date(endDate);
        io.to(socket.id).emit('receive-export-date', await exportDataBetweenDates(beginDate, endDate), path ?? './', beginDate, endDate);
    });

    socket.on('export-from-user', async (username: string, path:string) => {
        io.to(socket.id).emit('receive-export-user', await exportDataFromUser(username), path ?? './', username);
    });

    socket.on('change-pwd', async (username:string, password:string, callback:Function) => {
        const done:boolean = await updatePwd(username, password);
        if (!done) {
            callback(false);
        } else {
            callback(true);
        }
    });
    socket.on('ban', async (username:string, time:number, reason:string, callback:Function) => {
        const done:boolean = await banUser(username, socket.data.username, time, reason);
        if (!done) {
            callback(false);
        } else {
            const index:number = userIndex(username);
            if (index !== -1) {
                for (const id of users[index].userID) {
                    socket.to(id).emit('receive-ban', time, reason);
                }
            }
            callback(true);
        }
    });

    socket.on('unban', async (username:string, callback:Function) => {
        const done:boolean = await unbanUser(username);
        if (!done) callback(false);
        else callback(true);
    });

    socket.on('isban', async (username:string, callback:Function) => {
        const done:any = await isBanDate(username);
        callback(done);
    });
});

instrument(io, { auth: false });
