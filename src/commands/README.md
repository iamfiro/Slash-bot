# Commands Directory

파일이 이 폴더 안 어디에 있던 등록 됩니다. (예 : `commands/abc/def/ghi/jk.ts`)

예시 코드 입니다. name은 무조건 대소문자 이여야 하며 디스코드 커맨드의 이름이기도 합니다. 또한 description은 필수 값 입니다.
options는 JSON이며 key로는 option의 id가 들어가며 디스코드에서 명령어에 주어지는 인자값의 이름이기도 합니다.

```ts
import type { Command } from "octajs/dist/package/command";

const PingCommand: Command = {
  name: "ping",
  description: "You say ping, I say pong!",
  async executes(bot, interaction) {
    interaction.reply("Pong!");
  },
};

export default PingCommand;
```
