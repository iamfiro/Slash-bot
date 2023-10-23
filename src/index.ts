import Octa, { ALL_INTENTS } from "octajs";
import "dotenv/config";
import { existsSync, lstatSync, mkdirSync, readdirSync } from "fs";
import { join } from "path";
import { ActivityType } from "discord.js";
const IGNORE_FILES = [".DS_Store", ".env", "README.md"];

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

process.on("uncaughtException", function (err) {
  console.log("Caught exception: ", err);
});

export const octabot = new Octa(
  {
    token: process.env.TOKEN!,
    showLogo: false,
    catchError: true,
  },
  {
    intents: ALL_INTENTS,
  }
);

async function loadCommand(dirpath: string[] = []) {
  if (dirpath.length == 0)
    if (!existsSync(join(__dirname, "commands"))) {
      mkdirSync(join(__dirname, "commands"), {
        recursive: true,
      });
      return;
    }

  // console.log("[COMMAND] Working on ", dirpath.join("/"));
  const NOW_DIR = join(__dirname, "commands", ...dirpath);
  const DIR = readdirSync(NOW_DIR);

  for (const file of DIR) {
    if (IGNORE_FILES.includes(file)) continue;
    // Folder
    if (lstatSync(join(NOW_DIR, file)).isDirectory()) {
      await loadCommand([...dirpath, file]);
      continue;
    }
    // Load file
    const { default: Command } = await import(
      "./commands/" +
        dirpath.join("/") +
        "/" +
        file.split(".").slice(0, -1).join(".")
    );
    octabot.command(Command);
    console.log("[COMMAND] Register command", [...dirpath, file].join("/"));
  }
}
async function loadEvents(dirpath: string[] = []) {
  if (dirpath.length == 0)
    if (!existsSync(join(__dirname, "events"))) {
      mkdirSync(join(__dirname, "events"), {
        recursive: true,
      });
      return;
    }

  // console.log("[EVENT] Working on", dirpath.join("/"));
  const NOW_DIR = join(__dirname, "events", ...dirpath);
  const DIR = readdirSync(NOW_DIR);

  for (const file of DIR) {
    if (IGNORE_FILES.includes(file)) continue;
    // Folder
    if (lstatSync(join(NOW_DIR, file)).isDirectory()) {
      await loadEvents([...dirpath, file]);
      continue;
    }
    // Load file
    const { default: Event } = await import(
      "./events/" +
        dirpath.join("/") +
        "/" +
        file.split(".").slice(0, -1).join(".")
    );
    octabot.event(Event);
    console.log("[EVENT] Register event", [...dirpath, file].join("/"));
  }
}

loadCommand()
  .then(() => loadEvents())
  .then(() => {
    octabot.start();
    const InstanceID = Math.floor(Math.random() * (99999 - 10000) + 10000);
    setInterval(() => {
      console.log(`알림 | 인스턴스 ${InstanceID}번 실행중`);
    }, 30000);
  });

octabot.runRawJob((bot) => {
  bot.user?.setPresence({
    activities: [
      {
        name: "0.2.0-beta",
        type: ActivityType.Playing,
      },
    ],
    status: "online",
  });
});
