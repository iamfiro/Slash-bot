import { Command } from "octajs";
import { Stock } from "../../lib/stock";
import { ChartJSNodeCanvas } from "chartjs-node-canvas";
import { AttachmentBuilder } from "discord.js";

const ALL_STOCKS: Stock[] = [
  new Stock({
    name: "3SungJunJa",
    color: "#ff0000",
    price: 100000,
    speedMultiplier: 1,
    intervalMS: 150,
    maxHistory: 500,
  }),
];

const width = 1920 / 3; //px
const height = 1080 / 3; //px
const backgroundColour = "white"; // Uses https://www.w3schools.com/tags/canvas_fillstyle.asp
const chartJSNodeCanvas = new ChartJSNodeCanvas({
  width,
  height,
  backgroundColour: backgroundColour,
});

const chartViewCommand: Command = {
  name: "주식보기",
  description: "테슽",
  async executes(bot, int) {
    const STOCK_TO_RENDER = ALL_STOCKS[0];
    const image = await chartJSNodeCanvas.renderToBuffer({
      type: "line",
      data: {
        labels: STOCK_TO_RENDER.timeHistory,
        datasets: [STOCK_TO_RENDER.genDataset(STOCK_TO_RENDER.history)],
      },
    });
    await int.reply({
      files: [new AttachmentBuilder(image).setName("chart.png")],
      content: "테슽",
    });
  },
};

export default chartViewCommand;
