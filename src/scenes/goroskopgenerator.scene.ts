import { Composer, Markup, Scenes } from 'telegraf';
import { message } from 'telegraf/filters';
import { IBotContext } from '../context/context.interface';

export const goroskopgeneratorScene = new Scenes.WizardScene<IBotContext>(
    'goroskopgenerator',
    async (ctx) => {
        ctx.replyWithPhoto({ source: "resources/image.png" } );
        ctx.reply(`Мне нужно немного времени, чтобы составить твой гороскоп (2-3 минуты). \nЯ анализирую 312 параметров и использую опыт лучших астрологов мира! \nСкоро гороскоп будет готов!`);
        return ctx.wizard.next();
    },
    async (ctx) => {
        return ctx.wizard.next();
    },
    async (ctx) => {
        return ctx.scene.leave();
    }
);