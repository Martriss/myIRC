import { argumentsReorganization } from '../src/argumentFactory';
import { displayOwnMessage, secondaryServerInfo, serverInfo } from './display';
import { dateString2 } from '../src/exportData';

export function Message(socket:any, message:string) {
    socket.emit('send-message', message);
    displayOwnMessage(message);
}

export function PM(socket:any, arg:string[]) {
    const recipient:string = arg[0];
    const message:string = arg.slice(1).join(' ');
    socket.emit('send-pm', recipient, message);
    displayOwnMessage(message, recipient, true);
}

export function Join(socket:any, arg:string[]) {
    const roomName:string = arg[0];
    socket.emit('join-room', roomName, (message:string) => {
        if (message.length > 0) { secondaryServerInfo(message); }
    });
}

export function Leave(socket:any, arg:string[]) {
    const roomName:string = arg[0];
    socket.emit('leave-room', roomName, (message:string) => {
        if (message === 'join-main') {
            socket.emit('join-room', '#main', (msg:string) => {
                if (msg.length > 0) { secondaryServerInfo(msg); }
            });
        } else secondaryServerInfo(message);
    });
}

export function RoomList(socket:any, arg:string[]) {
    if (arg.length > 0) {
        secondaryServerInfo("The room-list command doesn't take arguments");
    }
    socket.emit('room-list', (message:string) => {
        secondaryServerInfo(message);
    });
}

export function RoomInfo(socket:any, arg:string[]) {
    const roomName:string = arg[0];
    socket.emit('room-info', roomName, (message:string) => {
        secondaryServerInfo(message);
    });
}

export function UserInfo(socket:any, arg:string[]) {
    const userName:string = arg[0];
    socket.emit('user-info', userName, (message:string) => {
        secondaryServerInfo(message);
    });
}

export function RoomMessage(socket:any, arg:string[]) {
    if (arg.length >= 2) {
        const roomname:string = arg.shift() ?? '';
        const message:string = arg.join(' ');
        socket.emit('send-message', message, roomname);
        displayOwnMessage(message, roomname);
    } else {
        secondaryServerInfo('Error when trying to execute room-msg command.');
        secondaryServerInfo('room-msg :--room-msg roomName message');
    }
}

export function modifyPwd(socket:any, arg:string[]) {
    if (arg.length >= 2) {
        const user:string = arg[0];
        const password:string = arg.slice(1).join(' ');
        if (password.length <= 200) {
            socket.emit('change-pwd', user, password, (result:boolean) => {
                if (!result) {
                    console.error('Cannot change password.');
                } else {
                    secondaryServerInfo('Password changed !');
                }
            });
        } else {
            secondaryServerInfo('Password must be less than 200 characters.');
        }
    } else {
        secondaryServerInfo('Error trying to execute modify-password command.');
        secondaryServerInfo('modify-password :--modify-password userToChange newPassword');
    }
}
export function ban(socket:any, arg:string[]) {
    if (arg.length >= 3) {
        const user:string = arg[0];
        const time:string = arg[1];
        const reason:string = arg.slice(2).join(' ');
        if (Number.isNaN(+time)) {
            console.error('Wrong use of the command : wrong attribute time');
        } else {
            socket.emit('ban', user, +time, reason, (result:boolean) => {
                if (!result) {
                    console.error('User not found');
                } else {
                    serverInfo(`${user} is banned and kicked !`);
                }
            });
        }
    } else {
        console.error('Error trying to execute ban command.');
        console.error('ban :--ban userToBan durationInSeconds reasons');
    }
}

export function unban(socket:any, arg:string[]) {
    if (arg.length === 1) {
        const user = arg[0];
        socket.emit('unban', user, (result:boolean) => {
            if (!result) {
                console.error('Banned user not found');
            } else {
                console.log(`${user} is unbanned !`);
            }
        });
    } else {
        console.error('Error trying to execute unban command.');
        console.error('unban :--unban userToUnban');
    }
}
export function isban(socket:any, arg:string[]) {
    if (arg.length === 1) {
        const user = arg[0];
        socket.emit('isban', user, (result:any) => {
            if (result === false) {
                console.error('Connection error');
            } else if (result === null) {
                console.log(`${user} is not banned.`);
            } else {
                console.log(`${user} is banned until ${dateString2(new Date(result))} !`);
            }
        });
    } else {
        console.error('Error when trying to execute isban command.');
        console.error('isban :--isban userToCheck');
    }
}

export function HelpAdmin(socket:any, arg:string[]) {
    const commandsHelp:any = {
        pm: 'pm :--pm recipient message',
        join: 'join :--join roomName',
        leave: 'leave :--leave roomName',
        'room-list': 'room-list :--room-list',
        'room-info': 'room-info :--room-info roomName',
        'room-msg': 'room-msg :--room-msg roomName message',
        'user-info': 'user-info :--user-info userName',
        'modify-password': 'modify-password :--modify-password userToChange newPassword',
        ban: 'ban :--ban userToBan durationInSeconds reason',
        unban: 'unban :--unban userToUnban',
        isban: 'isban :--isban userToCheck',
        export: 'export :--export -d <begin date> <end date> [<path>]\n  --export -u <username> [<path>]',
    };

    if (arg.length > 0) {
        const command:string = arg[0];
        if (commandsHelp[command]) {
            secondaryServerInfo(commandsHelp[command]);
        } else {
            secondaryServerInfo(`The command ${command} doesn't exist.`);
            secondaryServerInfo('Use --help to see the available commands.');
        }
    } else {
        for (const command in commandsHelp) {
            if (Object.prototype.hasOwnProperty.call(commandsHelp, command)) {
                secondaryServerInfo(commandsHelp[command]);
            }
        }
    }
}

export function Ban(socket:any, arg:string[]) {
    const userName:string = arg.shift() ?? '';
    const reason:string = arg.join(' ');
    socket.emit('ban', userName, reason, (result:string) => {
        serverInfo(result);
    });
}

export function Help(socket:any, arg:string[]) {
    const commandsHelp:any = {
        pm: 'pm :--pm recipient message',
        join: 'join :--join roomName',
        leave: 'leave :--leave roomName',
        'room-list': 'room-list :--room-list',
        'room-info': 'room-info :--room-info roomName',
        'room-msg': 'room-msg :--room-msg roomName message',
        'user-info': 'user-info :--user-info userName',
        export: 'export :--export [path]',
    };
    if (arg.length > 0) {
        const command:string = arg[0];
        if (commandsHelp[command]) {
            secondaryServerInfo(commandsHelp[command]);
        } else {
            secondaryServerInfo(`The command ${command} doesn't exist.`);
            secondaryServerInfo('Use --help to see the available commands.');
        }
    } else {
        for (const command in commandsHelp) {
            if (Object.prototype.hasOwnProperty.call(commandsHelp, command)) {
                secondaryServerInfo(commandsHelp[command]);
            }
        }
    }
}

export function Export(socket:any, arg:string[]) {
    arg = argumentsReorganization(arg);
    if (arg[0] === '-d') {
        if (arg.length < 3) {
            secondaryServerInfo('Wrong use.\n --export -d <begin date> <end date> [<path>]');
        } else {
            let beginDate = new Date(arg[1]);
            let endDate = new Date(arg[2]);
            if (beginDate.toString() === 'Invalid Date' || endDate.toString() === 'Invalid Date') {
                secondaryServerInfo('Invalid date');
                secondaryServerInfo('Export aborted');
            } else {
                if ((beginDate.valueOf() - endDate.valueOf()) > 0) {
                    const tmpDate: Date = beginDate;
                    beginDate = endDate;
                    endDate = tmpDate;
                }
                socket.emit('export-between-dates', beginDate, endDate, arg[3]);
            }
        }
    } else if (arg[0] === '-u') {
        // console.log('try to use -u');
        if (arg.length < 2) {
            console.error('Wrong usage.\n --export -u <username> [<path>]');
        } else {
            socket.emit('export-from-user', arg[1] ?? socket.data.username, arg[2]);
        }
    } else {
        console.error('Wrong use.\n  --export -d <begin date> <end date> [<path>]\n  --export -u <username> [<path>]');
    }
}

export function ExportUser(socket:any, arg:string[]) {
    socket.emit('export-from-user', arg[1], arg[0]);
}
