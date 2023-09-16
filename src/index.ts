import Octa, { ALL_INTENTS } from "octajs";
import "dotenv/config";

const bot = new Octa(
  {
    token: process.env.TOKEN!,
    showLogo: false,
    catchError: true,
  },
  {
    intents: ALL_INTENTS,
  }
);
bot
  .event({
    type: "ready",
    listener(bot, client) {
      console.log("[Bot]" + bot.user?.username + " is ready!");
    },
  })
  .start();
