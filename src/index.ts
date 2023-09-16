import Octa, { ALL_INTENTS } from "octajs";
import "dotenv/config";

const bot = new Octa(
  {
    token:
      "MTEzNDQ4ODMxMTE3NjY0MjYyMQ.GNqnPv.r0fqZaZQI6acaU25X4lYvoR8EhpJaLxMPHkT6g",
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
