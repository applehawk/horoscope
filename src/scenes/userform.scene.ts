import { Composer, Markup, Scenes, deunionize } from 'telegraf';
import { message } from 'telegraf/filters';
import { IBotContext } from '../context/context.interface';
import { goroskopgeneratorScene } from './goroskopgenerator.scene';
import { Message } from 'telegraf/typings/core/types/typegram';
let dataRegexp = "^\s*(3[01]|[12][0-9]|0?[1-9])\.(1[012]|0?[1-9])\.((?:19|20)\d{2})\s*$"

const birthtimeHandler = new Composer<IBotContext>();
birthtimeHandler.action("next", async (ctx, next) => {
	ctx.wizard.next()
    if (typeof ctx.wizard.step === 'function') {
        return ctx.wizard.step(ctx, next)
    }
});

export const userformScene = new Scenes.WizardScene<IBotContext>(
    'userform',
    async ctx => {
        ctx.reply(
            ctx.i18n.t('greeting'),
            Markup.keyboard([
                ["Весы", "Козерог", "Телец"], // Row1 with 2 buttons
                ["Лев", "Дева", "Скорпион"], // Row2 with 2 buttons
                ["Водолей", "Рыбы", "Стрелец"],
                ["Близнецы", "Овен", "Рак"] // Row3 with 3 buttons
            ]).oneTime().resize()
        );
        console.log(ctx.wizard);
        return ctx.wizard.next();
    },
    async ctx => {
        ctx.session.sign = (ctx.message as Message.TextMessage).text
        await ctx.reply(
            'Укажите дату своего рождения в формате (01.01.2024)'
        );
        return ctx.wizard.next();
    },
    async ctx => {
        ctx.session.birthday = (ctx.message as Message.TextMessage)?.text
        await ctx.reply(`Ваша дата рождения ${ctx.session.birthday}`);

        await ctx.reply(
            'Укажи время рождения в формате 12-30 (если знаете, если не знаете - можете пропустить)',
            Markup.inlineKeyboard([
                Markup.button.callback("Не знаю, пропустите этот шаг", "next")
            ])
        )
        return ctx.wizard.next();
    }, 
    birthtimeHandler,
    async ctx => {
        ctx.session.birthtime = (ctx.message as Message.TextMessage)?.text
        await ctx.reply(
            'Укажите свое полное имя (пример - Анастасия)',
        );
        return ctx.wizard.next();
    },
    async ctx => {
        ctx.session.name = (ctx.message as Message.TextMessage)?.text
        await ctx.reply(
            'Укажите свое место рождения (пример - Москва)',
        );
        return ctx.wizard.next();
    },
    async ctx => {
        ctx.session.birthplace = (ctx.message as Message.TextMessage)?.text
        await ctx.scene.leave();
        await ctx.scene.enter(goroskopgeneratorScene.id);
    }
)