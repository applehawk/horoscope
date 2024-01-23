import { Composer, Markup, Scenes } from 'telegraf';
import { message } from 'telegraf/filters';
import { IBotContext } from '../context/context.interface';

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const goroskopgeneratorScene = new Scenes.WizardScene<IBotContext>(
    'goroskopgenerator',
    async (ctx) => {
        await ctx.replyWithPhoto({ source: "resources/image.png" } );
        await ctx.reply(`Мне нужно немного времени, чтобы составить твой гороскоп (2-3 минуты). \nЯ анализирую 312 параметров и использую опыт лучших астрологов мира! \nСкоро гороскоп будет готов!`);
        
        await sleep(6000);
        await ctx.reply(`⌛️ Загружаем все параметры`)

        await sleep(10000);
        await ctx.reply(`⌛️ Анализируем данные`)

        await sleep(15000);
        await ctx.reply(`⌛️ Составляем гороскоп`)

        await sleep(10000);
        await ctx.reply(`⌛️ Твой персональный гороскоп будет готов через 1 минуту!`)

        await sleep(60*1000);
        await ctx.reply(ctx.i18n.t('horoscope_example', { 'Имя полное': ctx.session.name } ));
        return ctx.wizard.next();
    },
    async (ctx) => {
        return ctx.scene.leave();
    }
);