import { Composer, Markup, Scenes, deunionize } from 'telegraf';
import { message } from 'telegraf/filters';
import { IBotContext } from '../context/context.interface';
import { goroskopgeneratorScene } from './goroskopgenerator.scene';
let dataRegexp = "^\s*(3[01]|[12][0-9]|0?[1-9])\.(1[012]|0?[1-9])\.((?:19|20)\d{2})\s*$"

const signHandler = new Composer<IBotContext>();
signHandler.on(message("text"), async ctx => {
    ctx.session.sign = ctx.message.text;
    return ctx.wizard.next();
});

const birthdayHandler = new Composer<IBotContext>();
birthdayHandler.on(message("text"), async ctx => {
    ctx.session.birthday = ctx.message.text;
    return ctx.wizard.next();
});

const birthtimeHandler = new Composer<IBotContext>();
birthtimeHandler.on(message("text"), async ctx => {
    ctx.session.birthtime = ctx.message.text;
    return ctx.wizard.next();
});
birthtimeHandler.action("next", async ctx => {
    return ctx.wizard.next();
});

//NameHandler
const nameHandler = new Composer<IBotContext>();
nameHandler.on(message("text"), async ctx => {
    ctx.session.name = ctx.message.text;
    return ctx.wizard.next();
});
//Birthplace Handler
const birthplaceHandler = new Composer<IBotContext>();
birthplaceHandler.on(message("text"), async ctx => {
    ctx.session.birthplace = ctx.message.text;
    return ctx.wizard.next();
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
            ]).oneTime()
        );
        return ctx.wizard.next();
    },
    signHandler,
    async ctx => {
        console.log(`scene Cursor: ${ctx.wizard.cursor}`);
        await ctx.reply(
            'Укажите дату своего рождения в формате (01.01.2024)'
        );
        return ctx.wizard.next();
    },
    birthdayHandler,
    async ctx => {
        console.log(`scene Cursor: ${ctx.wizard.cursor}`);
        await ctx.reply(`Ваша дата рождения ${ctx.session.birthday}`);
        await ctx.reply(
            'Укажи время рождения в формате 12-30 (если знаете, если не знаете - можете пропустить)',
            Markup.inlineKeyboard([
                Markup.button.callback("Не знаю, пропустите этот шаг", "next")
            ])
        );
        return ctx.wizard.next();
    },
    birthtimeHandler,
    async ctx => {
        console.log(`Step: ${ctx.wizard.cursor}`);
        await ctx.reply(
            'Укажите свое полное имя (пример - Анастасия)',
        );
        return ctx.wizard.next();
    },
    nameHandler,
    async ctx => {
        await ctx.reply(
            'Укажите свое место рождения (пример - Москва)',
        );
        return ctx.wizard.next();
    },
    birthplaceHandler,
    async ctx => {
        await ctx.scene.leave();
        await ctx.scene.enter(goroskopgeneratorScene.id);
    }
)