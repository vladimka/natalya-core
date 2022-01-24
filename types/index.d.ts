import Context from "./context";
declare class InitializationError extends Error {
    constructor(msg: any);
}
interface ISession {
    sid: number;
    currentContext: Context | null;
}
declare class Brains {
    sinonimsFile: string;
    answersFile: string;
    sinonims: Object;
    answers: Object;
    contexts: Object;
    sessions: Array<ISession>;
    constructor(sinonimsFile?: string, answersFile?: string);
    getSession(id: any): ISession;
    tokenize(text: any): any;
    startContext(contextName: any, sid: any): any;
    processAnswer(key: any, sid: any): any;
    getAnswer(queryObj: any): string;
    loadConfiguration(): void;
    addSession(sid: any): void;
    removeSession(sid: any): void;
}
export { Brains, InitializationError };
