# WeAre

octajs를 활용해 생성된 프로젝트 입니다. octajs로 디스코드JS의 봇을 활용한 코드를 실행하려면 아래와 같이 하면 됩니다. 기본적으로 `src/commands`에 있는 명령어들은 자동으로 등록됩니다.

```ts
octabot.runRawJob((bot) => {
  bot.on("ready", () => {});
});
```
