import { MAX_CLIENT_WIDTH, textLength } from './config';

const clc = require('cli-color');

const orange = clc.xterm(208);
const white = clc.xterm(15);
const brown = clc.xterm(130);

const imageCollection:any = {
    easter: [ // source : Shanaka Dias https://www.asciiart.eu/movies/star-wars
        '                       .-.',
        '                      |_:_|',
        '                     /(_Y_)\\',
        `${clc.red('.           ')}        ( \\/M\\/ )`,
        `${clc.red(" '.         ")}      _.'-/'-'\\-'._`,
        `${clc.red("   ':       ")}    _/.--'[[[[]'--.\\_`,
        `${clc.red("     ':     ")}   /_'  : |::\\"| :  '.\\`,
        `${clc.red("       ':   ")}  //   ./ |oUU| \\.'  :\\`,
        `${clc.red("         ': ")} _:'..' \\_|___|_/ :   :|`,
        `${clc.red("           '")}:.  .'  |_[___]_|  :.':\\`,
        '            [::\\ |  :  | |  :   ; : \\',
        "             '-'   \\/'.| |.' \\  .;.' |",
        "             |\\_    \\  '-'   :       |",
        '             |  \\    \\ .:    :   |   |',
        "             |   \\    | '.   :    \\  |",
        '             /       \\   :. .;       |',
        '            /     |   |  :__/     :  \\\\',
        '           |  |   |    \\:   | \\   |   ||',
        '          /    \\  : :  |:   /  |__|   /|',
        "          |     : : :_/_|  /'._\\  '--|_\\",
        "          /___.-/_|-'   \\  \\",
        "                         '-'",
    ],
    feather: [ // source : ejm https://www.asciiart.eu/miscellaneous/feathers
        `${clc.blue('(`/\\')}`,
        `${clc.blue('`=\\/\\')}     ${clc.green('ETNA')}`,
        `${clc.blue(' `=\\/\\')}    ${clc.green('RELAY')}`,
        `${clc.blue('  `=\\/')}    ${clc.green('CHAT')}`,
        `${clc.blue('     \\')}`,
    ],
    sleeping_cat: [ // source : Felix Lee https://www.asciiart.eu/animals/cats
        '      |\\      _,,,---,,_',
        "ZZZzz /,`.-'`'    -.  ;-;;,_",
        "     |,4-  ) )-,_. ,\\ (  `'-'",
        "    '---''(_/--'  `-'\\_)",
    ],
    cat: [ // source : Hayley Jane Wakenshaw https://www.asciiart.eu/animals/cats
        '  ^~^  ,',
        " ('Y') )",
        ' /   \\/ ',
        '(\\|||/) ',
    ],
    cat2: [ // source : Hayley Jane Wakenshaw https://ascii.co.uk/art/cats
        '          /|_',
        '         /  ,\\',
        `      .-'   _,'   ${clc.green('ETNA')}`,
        `     / _   |      ${clc.green('RELAY')}`,
        `    /   )_ |      ${clc.green('CHAT')}`,
        ",=='`.____)_)",
    ],
    cat3: [ // source : KAT https://www.asciiart.eu/animals/cats
        '                                 /^--^\\',
        `                                 \\____/                 ${clc.green('ETNA')}`,
        `                                /      \\                ${clc.green('RELAY')}`,
        `                               |        |               ${clc.green('CHAT')}`,
        '                                \\__  __/',
        '|^|^|^|^|^|^|^|^|^|^|^|^|^|^|^|^|^/ /^|^|^|^|^|^|^|^|^|^|^|^|^|^|^|^|^|^|',
        '| | | | | | | | | | | | | | | | |/ /| | | | | | | | | | | | | | | | | | |',
        '#################################\\ \\#####################################',
        '| | | | | | | | | | | | | | | | | \\/| | | | | | | | | | | | | | | | | | |',
        '|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|',
    ],
    cats: [ // source : KAT https://www.asciiart.eu/animals/cats
        '                    /^--^\\     /^--^\\     /^--^\\',
        `                    \\____/     \\____/     \\____/      ${clc.green('ETNA')}`,
        `                   /      \\   /      \\   /      \\     ${clc.green('RELAY')}`,
        `                  |        | |        | |        |    ${clc.green('CHAT')}`,
        '                   \\__  __/   \\__  __/   \\__  __/',
        '|^|^|^|^|^|^|^|^|^|^|^\\ \\^|^|^|^/ /^|^|^|^|^\\ \\^|^|^|^|^|^|^|^|^|^|^|^|',
        '| | | | | | | | | | | |\\ \\| | |/ /| | | | | | \\ \\ | | | | | | | | | | |',
        '######################/ /######\\ \\###########/ /#######################',
        '| | | | | | | | | | | \\/| | | | \\/| | | | | |\\/ | | | | | | | | | | | |',
        '|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|',
    ],
    cats2: [ // source : KAT https://www.asciiart.eu/animals/cats
        `  ${white('/^--^\\')}     ${orange('/^--^\\')}     ${white('/^--')}${brown('^\\')}            `,
        `  ${white('\\____/')}     ${orange('\\____/')}     ${orange('\\_')}${white('___/')}      ${clc.green('ETNA')}  `,
        ` ${white('/      \\')}   ${orange('/      \\')}   ${orange('/')}${white('      \\')}     ${clc.green('RELAY')} `,
        `${white('|        |')} ${orange('|        |')} ${white('|        ')}${orange('|')}    ${clc.green('CHAT')}  `,
        ` ${white('\\__  __/')}   ${orange('\\__  __/')}   ${brown('\\__')}${white('  __/')}           `,
        `|^|^${white('\\ \\')}^|^|^|^${orange('/ /')}^|^|^|^|^${white('\\ \\')}^|^|^|^|^|^|^`,
        `| | |${white('\\ \\')}| | |${orange('/ /')}| | | | | |${white('\\ ')}${brown('\\')}| | | | | | `,
        `#####${white('/ /')}#####${orange('\\ \\')}###########${white('/ ')}${brown('/')}############`,
        `| | |${white('\\/')} | | | ${orange('\\/')}| | | | | |${white('\\/')} | | | | | | `,
        '|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_',
    ],
    cat32: [ // source : KAT https://www.asciiart.eu/animals/cats
        `             ${orange('/^--^\\')}                       `,
        `             ${orange('\\____/')}                 ${clc.green('ETNA')}  `,
        `            ${orange('/      \\')}                ${clc.green('RELAY')} `,
        `           ${orange('|        |')}               ${clc.green('CHAT')}  `,
        `            ${orange('\\__  __/')}                      `,
        `|^|^|^|^|^|^|^${orange('/ /')}^|^|^|^|^|^|^|^|^|^|^|^|^`,
        `| | | | | | |${orange('/ /')}| | | | | | | | | | | | | `,
        `#############${orange('\\ \\')}##########################`,
        `| | | | | | | ${orange('\\/')}| | | | | | | | | | | | | `,
        '|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_',
    ],
};

function expandFence(image:string[]):string[] {
    const lineLength = textLength(image[0]);
    let rightFence = Math.floor((MAX_CLIENT_WIDTH - lineLength) / 2);
    let leftFence = 0;
    if (rightFence % 2 !== 0) {
        leftFence = MAX_CLIENT_WIDTH - lineLength - rightFence;
    } else {
        rightFence -= 1;
        leftFence = MAX_CLIENT_WIDTH - lineLength - rightFence;
    }
    for (let i = 0; i < rightFence; i += 1) {
        image[0] = ` ${image[0]}`;
        image[1] = ` ${image[1]}`;
        image[2] = ` ${image[2]}`;
        image[3] = ` ${image[3]}`;
        image[4] = ` ${image[4]}`;
        if (i % 2 !== 0) {
            image[5] = `|${image[5]}`;
            image[6] = `|${image[6]}`;
            image[7] = `#${image[7]}`;
            image[8] = `|${image[8]}`;
            image[9] = `|${image[9]}`;
        } else {
            image[5] = `^${image[5]}`;
            image[6] = ` ${image[6]}`;
            image[7] = `#${image[7]}`;
            image[8] = ` ${image[8]}`;
            image[9] = `_${image[9]}`;
        }
    }
    for (let i = 0; i < leftFence; i += 1) {
        image[0] = `${image[0]} `;
        image[1] = `${image[1]} `;
        image[2] = `${image[2]} `;
        image[3] = `${image[3]} `;
        image[4] = `${image[4]} `;
        if (i % 2 === 0) {
            image[5] = `${image[5]}|`;
            image[6] = `${image[6]}|`;
            image[7] = `${image[7]}#`;
            image[8] = `${image[8]}|`;
            image[9] = `${image[9]}|`;
        } else {
            image[5] = `${image[5]}^`;
            image[6] = `${image[6]} `;
            image[7] = `${image[7]}#`;
            image[8] = `${image[8]} `;
            image[9] = `${image[9]}_`;
        }
    }
    return image;
}

export function colorImage(image:string[], color:string):string[] {
    const colors:any = {
        blue: clc.blue,
        green: clc.green,
        red: clc.red,
        yellow: clc.yellow,
        white: clc.white,
        grey: clc.blackBright,
    };
    const coloredImage:string[] = image.map((line:string) => colors[color](line));
    return coloredImage;
}

export function getEasterImage():string[] {
    return imageCollection.easter;
}

export function getTitleImage():string[] {
    return colorImage(expandFence(imageCollection.cat32), 'grey');
}

export function getSmallTitleImage():string[] {
    return colorImage(imageCollection.cat2, 'grey');
}

export function getSmallConnectedTitleImage():string[] {
    return colorImage(imageCollection.cat2, 'green');
}

export function getConnectedTitleImage(easter?:boolean):string[] {
    if (easter) {
        return getEasterImage();
    }
    return colorImage(expandFence(imageCollection.cats2), 'grey');
}

// function main() {
//     const image:string[] = imageCollection.cats2;
//     const image2:string[] = imageCollection.cat32;
//     console.log('----------------------------------------------');
//     for (let i = 0; i < image.length; i += 1) {
//         const line:string = image[i];
//         console.log(`${i} : ${textLength(line)}`);
//     }
//     console.log('----------------------------------------------');
//     for (let i = 0; i < image2.length; i += 1) {
//         const line:string = image2[i];
//         console.log(`${i} : ${textLength(line)}`);
//     }
//     const minImgWidth:number = Math.min(...image.map((line:string) => textLength(line)));
//     const maxImgWidth:number = Math.max(...image.map((line:string) => textLength(line)));

//     console.log(`max : ${maxImgWidth}`);
//     console.log(`min : ${minImgWidth}`);
// }
