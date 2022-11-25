function argumentsAssembly(arg:string[]): string {
    let argUnite: string = arg[0];
    for (let i = 1; i < arg.length; i++) {
        argUnite += ' ' + arg[i];
    }

    return argUnite;
}

function argumentWithSpace(arg: string): string[] {
    const soupArg: string[] = arg.split('\"');
    const trueArg: string[] = [];
    let j = 0;
    for (let i = 1; i < (soupArg.length - 1); i += 2) {
        trueArg[j] = soupArg[i];
        j++;
    }

    return trueArg;
}

export function argumentsReorganization(arg: string[]): string[] {
    if (typeof arg[0] === 'undefined') {
        return arg;
    }
    const unificate: string = argumentsAssembly(arg);
    let validArg: string[] = [unificate.split(' ')[0]];
    if (unificate.split('\"')[0] === unificate)
        return arg;
    const longArg: string[] = argumentWithSpace(unificate);
    for (let i = 0; i < longArg.length; i++) {
        validArg[i + 1] = longArg[0];
    }

    return validArg;
}