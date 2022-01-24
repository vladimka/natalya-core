declare type ContextFunction = (ctx: Object, query: string) => string;
export default class Context {
    steps: Array<ContextFunction>;
    currentStep: number;
    storage: Object;
    name: string;
    constructor(name: any, ...steps: any[]);
    nextStep(text: any): {
        state: string;
        answer: string;
    };
}
export {};
