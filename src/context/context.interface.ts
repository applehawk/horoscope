import I18n from "telegraf-i18n";
import { Context, Composer, Scenes } from "telegraf";

export interface SessionData extends Scenes.WizardSession {
    courseLike: boolean;
    language: string;
    sign: string;
    birthday: string;
    birthtime: string;
    birthplace: string;
    name: string;
}

export interface IBotContext extends Context {
    i18n: I18n;
    session: SessionData;

	// declare scene type
	scene: Scenes.SceneContextScene<IBotContext, Scenes.WizardSessionData>;
	// declare wizard type
	wizard: Scenes.WizardContextWizard<IBotContext>;
}