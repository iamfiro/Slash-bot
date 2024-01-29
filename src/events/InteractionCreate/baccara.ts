import type { EventListener } from "octajs";
import prisma from "../../lib/prisma";
import { EmbedBuilder, TextChannel, userMention } from "discord.js";
import { fstat, fsync, readFile, writeFile } from "fs";

let time = 1; // 1이 10초

const event: EventListener<"interactionCreate"> = {
    type: "interactionCreate",
    async listener(bot, interaction) {
        setInterval(async () => {
            // discord baccara system
        }, 1000)
    }
}

export default event;