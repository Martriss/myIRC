/* eslint-disable max-len */
import { io, Socket } from 'socket.io-client';
import * as handle from './commands';
import { LEFT_PADDING } from './config';
import {
    displayMessage, displayIntro, displayLoggedIn, moveCursor, secondaryServerInfo, loginCommandError, resetPasswordDisplay, resetLoginDisplay, displayOwnCommand, displayOwnMessage, displayAdminMessage,
} from './display';
import { getHiddenInput, getLoginInput } from './input';
import { ServerToClientEvents, ClientToServerEvents } from './socketInterfaces';
import { pathToWrite, dateString2 } from '../src/exportData';

const fs = require('fs');
const repl = require('node:repl');

const PORT:number = 3000;
let socket: Socket <ServerToClientEvents, ClientToServerEvents> = io(`http://localhost:${PORT}`);
if (typeof process.argv[2] !== 'undefined')
    socket = io(`http://${process.argv[2]}:${PORT}`);

let username = '';

const shortcuts:any = {
    '@': '--pm ',
    '!': '--room-msg ',
};

const commands:any = {
    '--help': handle.Help,
    '--pm': handle.PM,
    '--join': handle.Join,
    '--leave': handle.Leave,
    '--room-list': handle.RoomList,
    '--room-info': handle.RoomInfo,
    '--room-msg': handle.RoomMessage,
    '--user-info': handle.UserInfo,
    '--export': handle.ExportUser,
};

const easterList:string[] = ['vador', 'darkvador', 'vader'];

function sendMsg(): Promise<void> {
    return new Promise((resolve) => {
        if (easterList.includes(username.toLowerCase())) {
            displayLoggedIn(true);
        } else {
            displayLoggedIn();
        }
        const r = repl.start({
            prompt: '',
            completer: (line:string) => {
                const completions = Object.keys(commands);
                const hits = completions.filter((c:any) => c.startsWith(line));
                return [hits.length ? hits : completions, line];
            },
            eval: (answer:string) => {
                answer = answer.replace('\n', '');
                if (answer[0] in shortcuts) {
                    answer = `${shortcuts[answer[0]]}${answer.slice(1)}`;
                }
                if (answer.substring(0, 2) !== '--') {
                    handle.RoomMessage(socket, ['#main'].concat(answer.split(' ')));
                } else {
                    const command:string = answer.split(' ')[0].toLowerCase();
                    const commandArgs:string[] = answer.split(' ').slice(1);

                    if (command === '--export') commandArgs[1] = username;
                    if (commands[command]) {
                        displayOwnCommand([command].concat(commandArgs).join(' '));
                        commands[command](socket, commandArgs);
                    } else {
                        displayOwnCommand([command].concat(commandArgs).join(' '), true);
                        secondaryServerInfo(`${command} is not a command. Use --help for a list of commands.`);
                    }
                }
                resolve();
            },
        });
        r.on('.exit', () => {
            r.close();
            process.exit();
        });
        r.on('SIGINT', () => {
            r.close();
            process.exit();
        });
        r.on('SIGTERM', () => {
            r.close();
            process.exit();
        });
    });
}

// function getUsername():Promise<string> {
//     return new Promise<string>((resolve) => {
//         moveCursor('login');
//         const r = repl.start({
//             prompt: `${LEFT_PADDING}Login : `,
//             // eslint-disable-next-line arrow-body-style
//             eval: (username:string) => {
//                 if (username.length - 1 <= 9) {
//                     r.close();
//                     resolve(username.replace('\n', ''));
//                     userName = username.replace('\n', '');
//                 } else {
//                     resetLoginDisplay();
//                     process.stdin.write('');
//                 }
//             },
//         });
//         r.on('.exit', () => {
//             r.close();
//             process.exit();
//         });
//         r.on('SIGINT', () => {
//             r.close();
//             process.exit();
//         });
//         r.on('SIGTERM', () => {
//             r.close();
//             process.exit();
//         });
//     });
// }

function getLogin():Promise<string> {
    moveCursor('login');
    return new Promise<string>((resolve) => {
        let login:string = getLoginInput(`${LEFT_PADDING}Login : `);
        while (login.length > 9) {
            resetLoginDisplay();
            login = getHiddenInput(`${LEFT_PADDING}Password : `);
        }
        resolve(login);
    });
}

function getPass(login:string = ''):Promise<string> {
    return new Promise<string>((resolve) => {
        let password:string = getHiddenInput(`${LEFT_PADDING}Password : `);
        while (password.length > 200) {
            resetPasswordDisplay(login);
            password = getHiddenInput(`${LEFT_PADDING}Password : `);
        }
        resolve(password);
    });
}

// function getPassword():Promise<string> {
//     return new Promise<string>((resolve) => {
//         // moveCursor('password');
//         const r = repl.start({
//             prompt: `${LEFT_PADDING}Password : `,
//             eval: (password:string) => {
//                 if (password.length - 1 <= 200) {
//                     r.close();
//                     resolve(password.replace('\n', ''));
//                 } else {
//                     console.error('password must be 200 caracters or less. Try again');
//                 }
//             },
//         });
//     });
// }

function getPage():Promise<string> {
    return new Promise<string>((resolve) => {
        displayIntro();
        const r = repl.start({
            prompt: '',
            completer: (line:string) => {
                const completions = '--login --register'.split(' ');
                const hits = completions.filter((c) => c.startsWith(line));
                return [hits.length ? hits : completions, line];
            },
            eval: (cmd:string) => {
                cmd = cmd.replace('\n', '');
                if (cmd.toLowerCase().startsWith('--register')) {
                    r.close();
                    resolve(cmd);
                } else if (cmd.toLowerCase().startsWith('--login')) {
                    r.close();
                    resolve(cmd);
                } else {
                    loginCommandError();
                }
            },
        });
        r.on('.exit', () => {
            r.close();
            process.exit();
        });
        r.on('SIGINT', () => {
            r.close();
            process.exit();
        });
        r.on('SIGTERM', () => {
            r.close();
            process.exit();
        });
    });
}

function isBanned(name : string):Promise<any> {
    return new Promise<string>((resolve) => {
        socket.emit('isban', name, (result:any) => {
            resolve(result);
        });
    });
}

function auth():Promise<string> {
    return new Promise<string>((resolve) => {
        getPage().then((cmd:string) => {
            getLogin().then((pseudo:string) => {
                getPass(pseudo).then((password:string) => {
                    if (cmd === '--register') {
                        socket.emit('register', pseudo, password, (result:boolean) => {
                            if (!result) {
                                console.error('username already taken, try again');
                                resolve(auth());
                            }
                            resolve(pseudo);
                        });
                    } else {
                        isBanned(pseudo).then((isban:any) => {
                            if (isban === false) {
                                console.error('error connexion to db');
                                resolve(auth());
                            } else if (isban === null) {
                                socket.emit('login', pseudo, password, (result:boolean) => {
                                    if (!result) {
                                        console.error('wrong username or password, try again');
                                        resolve(auth());
                                    }
                                    resolve(pseudo);
                                });
                            } else {
                                console.error(`${pseudo} is banned until ${dateString2(new Date(isban))} !`);
                                resolve(auth());
                            }
                        });
                    }
                });
            });
        });
    });
}

socket.on('connect', () => {
    auth().then((pseudo:string) => {
        username = pseudo;
        socket.emit('def-login', username);
        socket.emit('join-room', '#main', () => {
            secondaryServerInfo('Joined main room');
        });
        sendMsg();

        socket.on('receive-message', (sender:string, message:string, room:string, isAdmin?:boolean) => {
            if (isAdmin) {
                displayAdminMessage(sender, message, room);
            } else {
                displayMessage(sender, message, room);
            }
        });

        socket.on('disconnect', (reason) => {
            if (reason === 'io server disconnect') {
            // the disconnection was initiated by the server, you need to reconnect manually
                console.log('Server is not up');
                process.exit();
                // socket.connect();
            }
        });

        socket.on('receive-pm', (sender:string, message:string, own?:boolean) => {
            if (own) {
                console.log('');
                displayOwnMessage(message, sender, true);
            } else {
                displayMessage(sender, message, 'pm', true);
            }
        });

        socket.on('receive-export-user', (allData: any, path: string, userName: string) => {
            if (allData.length === 0) {
                console.log('Aucune donnée à exporter.');
            } else {
                const writeTo = pathToWrite(path);
                const firstLine = `#Export data from ${userName}\n`;
                fs.writeFileSync(writeTo, firstLine);
                const secondLine = 'RoOm,Hour,User,Content\n';
                fs.appendFileSync(writeTo, secondLine);
                for (const data of allData) {
                    if (typeof data.messages !== 'undefined') {
                        for (const one of data.messages) {
                            const date = new Date(one.send_at);
                            const dateFormated = dateString2(date);
                            const oneRow = `${one.conv_name},${dateFormated},${one.user_name},${one.content}\n`;
                            fs.appendFileSync(writeTo, oneRow);
                        }
                    }
                }
                console.log('Exportation terminée');
            }
        });
    });
});

socket.on('receive-ban', (time:number, reason:string) => {
    console.error(`Scallywag ! You were ban for ${time} seconds for ${reason}. You can start to count : ${time}...${time - 1}...${time - 2}...`);
    socket.disconnect();
    process.exit();
});

process.on('SIGINT', () => {
    socket.disconnect();
    process.exit();
});

process.on('SIGTERM', () => {
    socket.disconnect();
    process.exit();
});
