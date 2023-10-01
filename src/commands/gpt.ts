import type { Command } from "octajs/dist/package/command";
import { EmbedBuilder } from 'discord.js'
import axios from "axios";
const GPTCommand: Command = {
  name: "gpt",
  description: "GPT가 응답해줘요!",
  options: {
    메시지: {
      description: "메시지",
      required: true,
      minLength: 0,
      maxLength: 100,
      type: "String",
    },
  },
  async executes(bot, interaction) {
    await interaction.deferReply();
    const topic = interaction.options.getString('메시지') || '';
    if(topic === '') return await interaction.editReply('❌ 메시지는 비워둘수 없습니다')
    axios({
        method: 'post',
        url: 'http://api.onhost.kr:26120/create',
        data: {
            "key": process.env.GPT_TOKEN,
            "messages": [
                {
                    "role": "user",
                    "content": `${topic}. 단 500자가 넘지 않게 말해줘`
                }
            ]
        }
    }).then(async (data: any) => {
        var msg = (data.data.choices[0].message.content)
        await interaction.editReply(`\`\`\`${msg}\`\`\`\n(${data.data.model})`)
    })
  },
};

export default GPTCommand;