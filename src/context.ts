// const debug = require('debug')('natalya:context');
import debug from 'debug';
const log = debug('natalya:core');

type ContextFunction = (ctx: Object, query: string) => string;

export default class Context{
    public steps: Array<ContextFunction>;
    public currentStep: number;
    public storage: Object;
    public name: string;

    constructor(name, ...steps){
        this.steps = steps;
        this.currentStep = 0;
        this.storage = {};
        this.name = name;
    }

    nextStep(text){
        if(text == '@start@'){
            log('Запущен контекст: %s', this.name);
        }

        let answer = this.steps[this.currentStep](this.storage, text);
        log('Шаг: %i', this.currentStep);

        if(this.currentStep >= this.steps.length - 1){
            this.currentStep = 0;
            log('Контекст "%s" завершён', this.name);
            return { state : 'ended', answer }
        }

        this.currentStep++;

        return { state : 'running', answer };
    }
}