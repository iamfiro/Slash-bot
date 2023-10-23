import type { EventListener } from "octajs";
import prisma from "../../lib/prisma";

const USER_INTERVALS: { [key: string]: NodeJS.Timeout } = {};

const event: EventListener<"voiceStateUpdate"> = {
  type: "voiceStateUpdate",
  async listener(bot, newState, oldState) {
    let member = oldState.member;
    
    if (newState.channelId === null) {
      console.log('들어옴')
      // User Joins a voice channel
      if (member && !member.user.bot)
        USER_INTERVALS[member.id] = setInterval(async () => {
          console.log('interval 실행')
          // Give user xp
          try {
            console.log('xp 지급')
            await prisma.userLevel.update({
              where: {
                userId: member!.id,
              },
              data: {
                xp: {
                  increment: 3,
                },
              },
            });
          } catch (e) {}
        }, 1000 * 30 * 1);
    }
    else if (oldState.channelId === null) {
      console.log('나감')
      // User leaves a voice channel
      if (member) {
        if (typeof USER_INTERVALS[member.id] != "undefined") {
          clearInterval(USER_INTERVALS[member.id]);
          delete USER_INTERVALS[member.id];
        }
      }
    }
  },
};

export default event;
