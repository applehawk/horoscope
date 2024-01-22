import { Telegraf } from "telegraf";
import { IBotContext } from "../context/context.interface";

interface ISceneContext {     
}

export abstract class Scene {
    constructor(public bot: Telegraf<IBotContext>) { }
    
    abstract enter(): void;
    abstract leave(): void;
}

export abstract class SequenceScene {
    constructor(public bot: Telegraf<IBotContext>) { }
}