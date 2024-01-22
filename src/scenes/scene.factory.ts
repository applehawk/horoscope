import { Scenes, Context } from 'telegraf';
import { IBotContext } from '../context/context.interface';

type NextSceneFunction = (ctx: IBotContext) => Promise<string | undefined>;
type AdvancedStep = (ctx: IBotContext, doneCallback: () => Promise<void>, next: () => Promise<void>) => Promise<void> | undefined;

const unwrapCallback = async (ctx: IBotContext, nextScene: NextSceneFunction) : Promise<void> => {
    const nextSceneId = await Promise.resolve(nextScene(ctx));
    if (nextSceneId !== undefined) {
      await ctx.scene.enter(nextSceneId, ctx.scene.state);
    } else {
      await ctx.scene.leave();
    }
  };

export const composeWizardScene = (...advancedSteps: AdvancedStep[]) => (
    /**
     * Branching extension enabled sceneFactory
     * @param sceneType {string}
     * @param nextScene {function} - async func that returns nextSceneType
     */
    function createWizardScene(sceneType: string, nextScene: (ctx: IBotContext) => Promise<string | undefined>) {
      return new Scenes.WizardScene(
        sceneType,
        ...advancedSteps.map((stepFn) => async (ctx: IBotContext, next: any) => {
          /** ignore user action if it is neither message, nor callbackQuery */
          if (!ctx.message && !ctx.callbackQuery) return undefined;
          return stepFn(ctx, () => unwrapCallback(ctx, nextScene), next);
        }),
      );
    }
  );