import { LEFT_PADDING } from './config';

const readline = require('readline-sync');

export function pressEnterKey(prompt:string = LEFT_PADDING):void {
    readline.question(prompt, { hideEchoBack: true, mask: '' });
}

export function getHiddenInput(query:string = ''):string {
    return readline.question(query, { hideEchoBack: true });
}

export function getLoginInput(query:string = ''):string {
    return readline.question(query);
}
