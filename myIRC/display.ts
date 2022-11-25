import {
    LEFT_PADDING, MAX_CLIENT_WIDTH, SERVER_INFO_COLOR, TERMINAL_WIDTH, textLength,
} from './config';
import {
    getConnectedTitleImage, getSmallConnectedTitleImage, getSmallTitleImage, getTitleImage,
} from './images';

const clc = require('cli-color');

function clearScreen():void {
    process.stdout.write(clc.erase.screenLeft);
    process.stdout.write(clc.erase.screenRight);
    process.stdout.write(clc.reset);
}

export function delay(milliseconds: number) {
    const timeInitial : Date = new Date();
    let timeNow : Date = new Date();
    for (let i = 0; +timeNow - +timeInitial < milliseconds; i += 1) {
        timeNow = new Date();
    }
}

function getLastWord(text:string):number {
    let endOfLastWordIndex:number = 0;
    for (let i = 0; i < MAX_CLIENT_WIDTH - 4; i += 1) {
        if (text[i] === ' ') endOfLastWordIndex = i;
    }
    if (endOfLastWordIndex !== 0) return endOfLastWordIndex + 1;
    return MAX_CLIENT_WIDTH;
}

function centerDisplay(content:string):void {
    // console.log(LEFT_PADDING + content);
    process.stdout.write(`${LEFT_PADDING + content}\n`);
}

export function displayLine(line:string, align?:string):void {
    if (textLength(line) > MAX_CLIENT_WIDTH) {
        displayLine(line.slice(0, getLastWord(line)), align);
        displayLine(line.slice(getLastWord(line)), align);
        return;
    }
    if (!align) {
        centerDisplay(line + ' '.repeat(MAX_CLIENT_WIDTH - textLength(line)));
        return;
    }
    let leftBlankLen:number = 0;
    if (align === 'right') leftBlankLen = Math.max(0, Math.floor(MAX_CLIENT_WIDTH - textLength(line)));
    else if (align === 'center') leftBlankLen = Math.floor((MAX_CLIENT_WIDTH - textLength(line)) / 2);
    else return;
    centerDisplay(' '.repeat(leftBlankLen) + line);
}

export function displayOwnCommand(command:string, rejected?:boolean) {
    const nbLinesInput = Math.ceil(command.length / TERMINAL_WIDTH);
    for (let i = 0; i < nbLinesInput; i += 1) {
        process.stdout.write(clc.move.up(1));
        process.stdout.write(clc.erase.line);
    }
    process.stdout.write(clc.move.lineBegin);
    displayLine((rejected) ? clc.red(command) : command);
}

export function displayOwnMessage(message:string, room:string = '#main', isPM?:boolean) {
    const nbLinesInput = Math.ceil(message.length / TERMINAL_WIDTH);
    for (let i = 0; i < nbLinesInput; i += 1) {
        process.stdout.write(clc.move.up(1));
        process.stdout.write(clc.erase.line);
    }
    process.stdout.write(clc.move.lineBegin);
    if (isPM) {
        displayLine(clc.magenta(`You@${room}: ${message}`), 'right');
        return;
    }
    if (room === '#main') {
        displayLine(`${clc.green('You')}: ${message}`, 'right');
    } else {
        displayLine(`${clc.cyan(`!${room}/`)}${clc.green('You')}: ${message}`, 'right');
    }
}

export function displayMessage(sender:string, message:string, room:string, isPM?:boolean) {
    if (isPM) {
        displayLine(clc.magenta(`${sender}@You: ${message}`));
    } else if (room === '#main') {
        displayLine(`${clc.blue(sender)}: ${message}`);
    } else {
        displayLine(`${clc.cyan(`!${room}/`)}${clc.blue(sender)}: ${message}`);
    }
}

export function displayAdminMessage(sender:string, message:string, room:string, isPM?:boolean) {
    if (isPM) {
        displayLine(clc.magenta(`${clc.red(sender)}@You: ${message}`));
    } else if (room === '#main') {
        displayLine(`${clc.red(sender)}: ${message}`);
    } else {
        displayLine(`${clc.cyan(`!${room}/`)}${clc.red(sender)}: ${message}`);
    }
}

function displayImage(lines:string[], align?:string) {
    // get the length of the longest string in the image
    const maxImgWidth:number = Math.max(...lines.map((line:string) => textLength(line)));
    const blankAmount:number = Math.max(0, MAX_CLIENT_WIDTH - maxImgWidth);
    if (align === 'right') {
        lines.forEach((line) => {
            centerDisplay(' '.repeat(blankAmount) + line);
        });
    } else if (align === 'center') {
        lines.forEach((line) => {
            centerDisplay(' '.repeat(Math.floor(blankAmount / 2)) + line);
        });
    } else {
        lines.forEach((line) => {
            centerDisplay(line);
        });
    }
}

export function serverInfo(message:string) {
    displayLine(SERVER_INFO_COLOR(`[server] ${message}`));
}

export function secondaryServerInfo(message:string, server?:boolean) {
    displayLine(clc.blackBright(`${(server) ? '[server] ' : ''}${message}`));
}

export function displayIntro() {
    clearScreen();
    if (MAX_CLIENT_WIDTH < 60) {
        displayImage(getSmallTitleImage(), 'center');
    } else {
        displayImage(getTitleImage(), 'center');
    }
    displayLine('Welcome to ETNA RELAY CHAT !');
    displayLine('--register: Create a new account');
    displayLine('--login: Log into your account');
    displayLine('');
    process.stdout.write(clc.move.up(1));
}

function clearLogin() {
    for (let i = 0; i < 4; i += 1) {
        process.stdout.write(clc.move.up(1));
        process.stdout.write(clc.erase.line);
    }
    displayLine('Connect to the server :');
    displayLine('');
    displayLine('');
    process.stdout.write(clc.move.up(2));
}

export function moveCursor(pos:string) {
    if (pos === 'login') {
        clearLogin();
    }
    if (pos === 'password') {
        process.stdout.write(clc.move.right(1));
    }
    if (pos === 'start') {
        process.stdout.write(clc.move.lineBegin);
        process.stdout.write(clc.move.right(LEFT_PADDING.length));
    }
}

export function displayLoggedIn(easter?:boolean) {
    clearScreen();
    if (MAX_CLIENT_WIDTH < 60) {
        displayImage(getSmallConnectedTitleImage(), 'center');
    } else {
        displayImage((easter) ? getConnectedTitleImage(true) : getConnectedTitleImage(), 'center');
    }
    displayLine('Connection successful !');
    displayLine('Your are logged in the server !');
    displayLine('Use --help to get a list of commands');
}

export function loginCommandError(message:string = 'Wrong command. Use --login or --register') {
    // clearLogin();
    secondaryServerInfo(message);
    process.stdout.write(clc.move.up(2));
    process.stdout.write(clc.erase.line);
    moveCursor('start');
}

export function resetPasswordDisplay(login:string, error:string = 'Password must be 200 characters or less. Try again') {
    clearScreen();
    displayImage(getTitleImage(), 'center');
    displayLine('Connect to the server :');
    displayLine(`Login: ${login}`);
    displayLine('');
    secondaryServerInfo(error);
    process.stdout.write(clc.move.up(2));
    process.stdout.write(clc.move.lineBegin);
}

export function resetLoginDisplay(error:string = 'Login can contain at most 9 characters. Try again') {
    clearScreen();
    displayImage(getTitleImage(), 'center');
    displayLine('Connect to the server :');
    displayLine('');
    displayLine('');
    secondaryServerInfo(error);
    process.stdout.write(clc.move.up(3));
    process.stdout.write(clc.move.lineBegin);
}
