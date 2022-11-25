interface ServerToClientEvents {
    noArg: () => void;
    basicEmit: (a: number, b: string, c: Buffer) => void;
    withAck: (d: string, callback: (e: number) => void) => void;
    'receive-message': (sender:string, message:string, room:string) => void;
    'receive-pm': (sender:string, message:string, own?:boolean) => void;
    'error': (error:string) => void;
    'receive-ban': (time:number, reason:string) => void;
    'receive-export-date': (allData:any, path:string, beginDate: Date, endDate: Date) => void;
    'receive-export-user': (allData: any, path: string, userName:string) => void;
}

interface ClientToServerEvents {
    'def-login': (login:string) => void;
    'register' : (username:string, password:string, callback:Function) => void;
    'login' : (username:string, password:string, callback:Function) => void;
    'send-message': (message:string, room?:string) => void;
    'send-pm' : (recipient:string, message:string) => void;
    'join-room': (room:string, callback:Function) => void;
    'leave-room': (room:string, callback:Function) => void;
    'room-list': (callback:Function) => void;
    'room-info': (room:string, callback:Function) => void;
    'user-info': (username:string, callback:Function) => void;
    'ban': (username:string, time:number, reason:string, callback:Function) => void;
    'unban' : (username:string, callback:Function) => void;
    'isban' : (username:string, callback:Function) => void;
    'quit': (callback:Function) => void;
    'export-between-dates': (beginDate: Date, endDate:Date, path:string) => void;
    'export-from-user': (username: string, path:string) => void;
    'loginAdmin' : (username:string, password:string, callback:Function) => void;
    'change-pwd' : (username:string, password:string, callback:Function) => void;

}

interface SocketData {
    username: string;
    rooms: string[];
}

export {
    ServerToClientEvents, ClientToServerEvents, SocketData,
};
