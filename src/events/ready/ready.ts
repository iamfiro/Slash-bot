import type { EventListener } from "octajs";
const event: EventListener<"ready"> = {
  type: "ready",
  listener(bot, client) {
    console.log("Bot is ready!");
  },
};

export default event;
