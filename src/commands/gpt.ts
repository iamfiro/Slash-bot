import { Command } from "octajs/dist/package/command";
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
    const topic = interaction.options.getString('메시지');
    if (!topic) return interaction.editReply('❌ 메시지는 비워둘수 없습니다');
    const { data } = await axios.post('http://api.onhost.kr:26120/create', {
      key: process.env.GPT_TOKEN,
      messages: [
        { role: "system", content: "You are a helpful assistant, you must speak in 500 characters or less and If there are important words, surround them with two asterisks (e.g. Valorant is an FPS game from **Riot Games**) and When using strikethrough, surround the message with ~~" },
        { role: "user", content: topic }
      ]
    });
    const msg = data.choices[0].message.content;
    await interaction.editReply(`${msg}\n||Model: ${data.model}||`);
  },
};

export default GPTCommand;