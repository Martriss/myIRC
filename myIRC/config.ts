const clc = require('cli-color');

export const textLength = clc.getStrippedLength;

export const TERMINAL_WIDTH:number = clc.windowSize.width;
export const MAX_CLIENT_WIDTH:number = Math.min(70, TERMINAL_WIDTH);
export const LEFT_PADDING:string = ' '.repeat(Math.floor((TERMINAL_WIDTH - MAX_CLIENT_WIDTH) / 2));

export const SERVER_INFO_COLOR = clc.yellow;
