import { Command } from "octajs/dist/package/command";
import { EmbedBuilder } from 'discord.js'
import { DecreseBalance, IncreseBalance } from "../../../db/economy";

const errorHandling = new EmbedBuilder()
  .setTitle("❌ 처리중 오류가 발생했습니다")
  .setDescription("잠시만 기다려주세요")
  .setColor("Red");

const PingCommand: Command = {
  name: "가위바위보",
  description: "봇과 가위바위보를 하여 최대 2배 보상을 받으세요",
  options: {
    베팅금액: {
      description: "가위바위보에 베팅할 금액을 입력해주세요",
      required: true,
      type: "Integer",
    },
    선택: {
        description: "가위바위보에 베팅할 금액을 입력해주세요",
        required: true,
        type: "String",
        choices: [
            {
              name: "가위 ✌",
              value: "1",
            },
            {
              name: "바위 🌚",
              value: "2",
            },
            {
                name: "보 📃",
                value: "3",
            },
        ],
    },
  },
  async executes(_, interaction) {
    await interaction.deferReply();
    const choice = interaction.options.getString("선택");

    const random = Math.floor(Math.random() * 3) + 1;
    console.log(random.toString(), choice)
    // if((random.toString() === "1" && choice === "3") || (random.toString() === '2' && choice === "1") || (random.toString() === '2' && choice === "3") || (random.toString() === '3' && choice === "2")) {
    //     DecreseBalance(interaction.user.id, interaction.options.getInteger("베팅금액") || 0).then(async (result: boolean) => {
    //         if(result) {
    //             const loseEmbed = new EmbedBuilder()
    //             .setTitle("😥 아쉽습니다")
    //             .setDescription(`<@${interaction.user.id}>님이 가위바위보에서 패배하셨습니다!`)
    //             .setColor("Red")
    //             .setFields(
    //                 { name: "봇", value: random === 1 ? "가위 ✌" : random === 2 ? "바위 🌚" : "보 📃", inline: true },
    //                 { name: "VS", value: '🌐', inline: true},
    //                 { name: "사용자", value: choice === "1" ? "가위 ✌" : "보 📃", inline: true },
    //             )
    //             await interaction.editReply({ embeds: [loseEmbed] });
    //         } else {
    //             await interaction.editReply({ embeds: [errorHandling] });
    //         }
    //     });
        
    // } else if(random.toString() === choice) {
    //     IncreseBalance(interaction.user.id, (interaction.options.getInteger("베팅금액") || 0) / 2).then(async (result: boolean) => {
    //         if(result) {
    //             const winEmbed = new EmbedBuilder()
    //             .setTitle("🎉 축하합니다!")
    //             .setColor("Yellow")
    //             .setDescription(`<@${interaction.user.id}>님이 가위바위보에서 비기셨습니다!`)
    //             .setFields(
    //                 { name: "봇", value: random === 1 ? "가위 ✌" : random === 2 ? "바위 🌚" : "보 📃", inline: true },
    //                 { name: "VS", value: '🌐', inline: true},
    //                 { name: "사용자", value: choice === "1" ? "가위 ✌" : choice === "2" ? "바위 🌚" : "보 📃", inline: true },
    //             )
    //             await interaction.editReply({ embeds: [winEmbed] });
    //         } else {
    //             await interaction.editReply({ embeds: [errorHandling] });
    //         }
    //     });
    // } else {
    //     IncreseBalance(interaction.user.id, interaction.options.getInteger("베팅금액") || 0).then(async (result: boolean) => {
    //         if(result) {
    //             const winEmbed = new EmbedBuilder()
    //             .setTitle("🎉 축하합니다!")
    //             .setColor("Green")
    //             .setDescription(`<@${interaction.user.id}>님이 가위바위보에서 이기셨습니다!`)
    //             .setFields(
    //                 { name: "봇", value: random === 1 ? "가위 ✌" : random === 2 ? "바위 🌚" : "보 📃", inline: true },
    //                 { name: "VS", value: '🌐', inline: true},
    //                 { name: "사용자", value: choice === "1" ? "가위 ✌" : choice === "2" ? "바위 🌚" : "보 📃", inline: true },
    //             )
    //             await interaction.editReply({ embeds: [winEmbed] });
    //         } else {
    //             await interaction.editReply({ embeds: [errorHandling] });
    //         }
    //     });
    // }
    if(random.toString() === choice) {
        IncreseBalance(interaction.user.id, (interaction.options.getInteger("베팅금액") || 0) / 2).then(async (result: boolean) => {
            if(result) {
                const winEmbed = new EmbedBuilder()
                .setTitle("🎉 축하합니다!")
                .setColor("Yellow")
                .setDescription(`<@${interaction.user.id}>님이 가위바위보에서 비기셨습니다!`)
                .setFields(
                    { name: "봇", value: random === 1 ? "가위 ✌" : random === 2 ? "바위 🌚" : "보 📃", inline: true },
                    { name: "VS", value: '🌐', inline: true},
                    { name: "사용자", value: choice === "1" ? "가위 ✌" : choice === "2" ? "바위 🌚" : "보 📃", inline: true },
                )
                await interaction.editReply({ embeds: [winEmbed] });
            } else {
                await interaction.editReply({ embeds: [errorHandling] });
            }
        });
    } else if((random.toString() === "1" && choice === "3") || (random.toString() === '2' && choice === "1") || (random.toString() === '3' && choice === "2")) {
        DecreseBalance(interaction.user.id, interaction.options.getInteger("베팅금액") || 0).then(async (result: boolean) => {
            if(result) {
                const loseEmbed = new EmbedBuilder()
                .setTitle("😥 아쉽습니다")
                .setDescription(`<@${interaction.user.id}>님이 가위바위보에서 패배하셨습니다!`)
                .setColor("Red")
                .setFields(
                    { name: "봇", value: random === 1 ? "가위 ✌" : random === 2 ? "바위 🌚" : "보 📃", inline: true },
                    { name: "VS", value: '🌐', inline: true},
                    { name: "사용자", value: choice === "1" ? "가위 ✌" : choice === "2" ? "바위 🌚" : "보 📃", inline: true },
                )
                await interaction.editReply({ embeds: [loseEmbed] });
            } else {
                await interaction.editReply({ embeds: [errorHandling] });
            }
        });
        
    }else {
        IncreseBalance(interaction.user.id, interaction.options.getInteger("베팅금액") || 0).then(async (result: boolean) => {
            if(result) {
                const winEmbed = new EmbedBuilder()
                .setTitle("🎉 축하합니다!")
                .setColor("Green")
                .setDescription(`<@${interaction.user.id}>님이 가위바위보에서 이기셨습니다!`)
                .setFields(
                    { name: "봇", value: random === 1 ? "가위 ✌" : random === 2 ? "바위 🌚" : "보 📃", inline: true },
                    { name: "VS", value: '🌐', inline: true},
                    { name: "사용자", value: choice === "1" ? "가위 ✌" : choice === "2" ? "바위 🌚" : "보 📃", inline: true },
                )
                await interaction.editReply({ embeds: [winEmbed] });
            } else {
                await interaction.editReply({ embeds: [errorHandling] });
            }
        });
    }
  },
};

export default PingCommand;