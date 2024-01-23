import { Telegraf, Scenes } from 'telegraf';
import { IConfigService } from './config/config.interface';
import { ConfigService } from './config/config.service';
import { IBotContext } from './context/context.interface';
import { Command } from './commands/command.class';
import { userformScene } from './scenes/userform.scene';
import { goroskopgeneratorScene } from './scenes/goroskopgenerator.scene';
import LocalSession from 'telegraf-session-local';
import TelegrafI18n from 'i18n-telegraf';

const i18n = new TelegrafI18n({
    defaultLanguage: 'ru',
    allowMissing: false, // Default true
    directory: "./locales"
  })
  
class Bot {
    bot: Telegraf<IBotContext>;
    stage: Scenes.Stage<IBotContext>;
    commands: Command[] = [];

    constructor(private readonly configService: IConfigService) {
        this.bot = new Telegraf<IBotContext>(this.configService.get("BOT_TOKEN"), { handlerTimeout: 120_000 });
        this.bot.use( i18n.middleware() );
        this.stage = new Scenes.Stage<IBotContext>([userformScene, goroskopgeneratorScene], { default: userformScene.id });
        this.bot.use( new LocalSession({ database: "session.json" }).middleware() );
        this.bot.use(this.stage.middleware());
    }
    init() {
        this.bot.start( ctx => ctx.scene.enter(userformScene.id) );

        if (process.env.environment == "PRODUCTION") {
            this.bot.launch({ webhook: { 
                domain: this.configService.get("WEBHOOK_DOMAIN"), 
                port: +this.configService.get("PORT") || 8000 },
            }).then(() => {
                console.info(`The bot ${bot.bot.botInfo?.username} is running on server`);
              });
        } else { //running bot locally
            this.bot.launch().then(() => {
                console.info(`The bot ${bot.bot.botInfo?.username} is running locally`);
            });
        }

    }
}

const bot = new Bot(new ConfigService());
bot.init();

process.once("SIGINT", () => bot.bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.bot.stop("SIGTERM"));
