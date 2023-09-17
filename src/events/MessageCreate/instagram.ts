import { EventListener } from "octajs";

const eventListener: EventListener<"messageCreate"> = {
  type: "messageCreate",
  async listener(bot, message) {
    if (message.channelId !== "1143112595268698154") return;
    if (message.attachments.size === 0) {
      message.delete();
      return;
    }

    // Thread 생성과 message 생성은 병행 가능
    (async () => {
      await message.react("🤣");
      await message.react("😐");
      await message.react("🙁");
      await message.react("😫");
      await message.react("😡");
    })();

    const t = new Date();
    const threadName =
      message.content === ""
        ? `${
            message.author.username
          } - ${t.getFullYear()}년 ${t.getMonth()}월 ${t.getDay()}일 ${t.getHours()}시 ${t.getMinutes()}분`
        : message.content;
    await message.startThread({
      name: threadName,
    });
  },
};

export default eventListener;
