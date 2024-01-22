import { Markup, Telegraf } from "telegraf";
import { IBotContext } from "../context/context.interface";
import { Command } from "./command.class";

export class StartCommand extends Command {
    constructor(bot: Telegraf<IBotContext>) {
        super(bot);
    }

    handle(): void {
        this.bot.start( ctx => {
            console.log(ctx.session);
            ctx.reply(
                ctx.i18n.t('greeting')
            );
        });
    }
}