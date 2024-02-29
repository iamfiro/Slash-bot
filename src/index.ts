import Octa, { ALL_INTENTS } from "octajs";
import "dotenv/config";
import { existsSync, lstatSync, mkdirSync, readdirSync } from "fs";
import { join } from "path";
import { ActivityType, Client, Embed, EmbedBuilder, TextChannel } from "discord.js";
import axios from "axios";
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
    })
    setInterval(() => {
        setValorantStatus(bot)
    }, 1000 * 60 * 15);
    setInterval(() => {
        setValorantEsport(bot)
    }, 1000 * 60 * 60 * 12);
});

async function setValorantStatus(bot: Client<boolean>) {
    let EmbedContainer = [] as any;

    bot.channels.fetch("1212581168835338290").then(async (channel) => {
        if (channel?.isTextBased()) {
            (channel as TextChannel as any).bulkDelete(3, true).then(async () => {
                await axios.get("https://api.henrikdev.xyz/valorant/v1/status/kr").then(async (res) => {
                    const KRIncidentStatus = res.data.data.incidents.length === 0;
                    const KRMaintenanceStatus = res.data.data.maintenances.length === 0;
                    const KRFields = [] as any;
            
                    if(!KRMaintenanceStatus) {
                        res.data.data.incidents.map((incident: any, idx: number) => {
                            const date = new Date(incident.created_at)
                            KRFields.push({ 
                                name: incident.titles[0].content,
                                value: `${incident.updates[0].translations[0].content}\n**${date.toLocaleString()}**`,
                            })
                        })
                    }
            
                    if(!KRIncidentStatus) {
                        res.data.data.incidents.map((incident: any, idx: number) => {
                            const date = new Date(incident.created_at)
                            KRFields.push({ 
                                name: `${incident.titles[0].content} - ${date.toLocaleString()}`,
                                value: `${incident.updates[0].translations[0].content}\n`,
                            })
                        })
                    }
            
                    const Embed = new EmbedBuilder()
                        .setAuthor({ name: "VALORANT" })
                        .setTitle("KR 서버 상태")
                        .setColor(KRIncidentStatus && KRMaintenanceStatus ? 'Green' : 'Red')
                        .setFields(KRFields.length === 0 ? { name: '이슈 없음', value: '현재 KR 서버에 발생한 문제가 없습니다.' } : KRFields)
                        .setFooter({ text: `${new Date(Date.now()).toLocaleTimeString()} 업데이트` })
            
                    EmbedContainer.push(Embed)
                })
            
                await axios.get("https://api.henrikdev.xyz/valorant/v1/status/ap").then(async (res) => {
                    const APIncidentStatus = res.data.data.incidents.length === 0;
                    const APMaintenanceStatus = res.data.data.maintenances.length === 0;
                    const APFields = [] as any;
            
                    if(!APMaintenanceStatus) {
                        res.data.data.incidents.map((incident: any, idx: number) => {
                            const date = new Date(incident.created_at)
                            APFields.push({ 
                                name: incident.titles[0].content,
                                value: `${incident.updates[0].translations[0].content}\n**${date.toLocaleString()}**`,
                            })
                        })
                    }
            
                    if(!APIncidentStatus) {
                        res.data.data.incidents.map((incident: any, idx: number) => {
                            const date = new Date(incident.created_at)
                            APFields.push({ 
                                name: `${incident.titles[0].content} - ${date.toLocaleString()}`,
                                value: `${incident.updates[0].translations[0].content}\n`,
                            })
                        })
                    }
            
                    const Embed = new EmbedBuilder()
                        .setAuthor({ name: "VALORANT" })
                        .setTitle("ASIA 서버 상태")
                        .setColor(APIncidentStatus && APMaintenanceStatus ? 'Green' : 'Red')
                        .setFields(APFields.length === 0 ? { name: '이슈 없음', value: '현재 ASIA 서버에 발생한 문제가 없습니다.' } : APFields)
                        .setFooter({ text: `${new Date(Date.now()).toLocaleTimeString()} 업데이트` })
            
                    EmbedContainer.push(Embed)
                })
            
                await axios.get("https://api.henrikdev.xyz/valorant/v1/status/eu").then(async (res) => {
                    const EUIncidentStatus = res.data.data.incidents.length === 0;
                    const EUMaintenanceStatus = res.data.data.maintenances.length === 0;
                    const EUFields = [] as any;
            
                    if(!EUMaintenanceStatus) {
                        res.data.data.incidents.map((incident: any, idx: number) => {
                            const date = new Date(incident.created_at)
                            EUFields.push({ 
                                name: incident.titles[0].content,
                                value: `${incident.updates[0].translations[0].content}\n**${date.toLocaleString()}**`,
                            })
                        })
                    }
            
                    if(!EUIncidentStatus) {
                        res.data.data.incidents.map((incident: any, idx: number) => {
                            const date = new Date(incident.created_at)
                            EUFields.push({ 
                                name: `${incident.titles[0].content} - ${date.toLocaleString()}`,
                                value: `${incident.updates[0].translations[0].content}\n`,
                            })
                        })
                    }
            
                    const Embed = new EmbedBuilder()
                        .setAuthor({ name: "VALORANT" })
                        .setTitle("EU 서버 상태")
                        .setColor(EUIncidentStatus && EUMaintenanceStatus ? 'Green' : 'Red')
                        .setFields(EUFields.length === 0 ? { name: '이슈 없음', value: '현재 EU 서버에 발생한 문제가 없습니다.' } : EUFields)
                        .setFooter({ text: `${new Date(Date.now()).toLocaleTimeString()} 업데이트` })
            
                    EmbedContainer.push(Embed)
                })
            
                bot.channels.fetch("1212581168835338290").then((channel) => {
                    if (channel?.isTextBased()) {
                        (channel as TextChannel).send({ embeds: EmbedContainer })
                    }
                })
            })
        }
    });
}

async function setValorantEsport(bot: Client<boolean>) {

    bot.channels.fetch("1212599013581258832").then(async (channel) => {
        if (channel?.isTextBased()) {
            (channel as TextChannel as any).bulkDelete(5, true).then(async () => {
                await axios.get("https://api.henrikdev.xyz/valorant/v1/esports/schedule").then(async (res): Promise<void> => {
                    const data = res.data.data.filter((data: any) => data.state === "unstarted")
                    data.map((data: any, idx: number) => {
                        if(idx > 4) return;
                        const esYear = data.date.substr(0, 4)
                        const esMonth = data.date.substr(5, 2)
                        const esDay = data.date.substr(8, 2)
                        const esHour = data.date.substr(11, 2)

                        bot.channels.fetch("1212599013581258832").then((channel): void => {
                            if (channel?.isTextBased()) {
                                (channel as TextChannel).send({ embeds: [
                                    new EmbedBuilder()
                                        .setAuthor({ name: `${data.league.region} - ${data.tournament.season}` })
                                        .setTitle(data.league.name)
                                        .setDescription(`${esYear}년 ${esMonth}월 ${esDay}일 ${esHour}시 예정`)
                                        .setThumbnail(data.league.icon)
                                        .setColor('Yellow'),
                                    new EmbedBuilder()
                                        .setAuthor({ name: `팀 #1` })
                                        .setColor('Red')
                                        .setTitle(data.match.teams[0].name)
                                        .setThumbnail(data.match.teams[0].icon)
                                        .setFields([
                                            {
                                                name: '우승 횟수',
                                                value: `${data.match.teams[1].game_wins}회`,
                                            },
                                            {
                                                name: '대회 전적',
                                                value: `${data.match.teams[0].record.wins}승 ${data.match.teams[0].record.losses}패`,
                                            },
                                        ]),
                                    new EmbedBuilder()
                                        .setAuthor({ name: `팀 #2` })
                                        .setColor('Blue')
                                        .setTitle(data.match.teams[1].name)
                                        .setThumbnail(data.match.teams[1].icon)
                                        .setFields([
                                            {
                                                name: '우승 횟수',
                                                value: `${data.match.teams[1].game_wins}회`,
                                            },
                                            {
                                                name: '대회 전적',
                                                value: `${data.match.teams[1].record.wins}승 ${data.match.teams[1].record.losses}패`,
                                            },
                                        ]),
                                ] })
                            }
                        });
                    })
                })
            })
        }
    });
}