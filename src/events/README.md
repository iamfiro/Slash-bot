# Events Directory

파일이 이 폴더 안 어디에 있던 등록 됩니다. (예 : `events/abc/def/ghi/jk.ts`)

예시 코드 입니다. EventListener의 Template type은 json안에 들어 있는 type과 같게 해야 합니다.

```ts
import type { EventListener } from "octajs";
const event: EventListener<"ready"> = {
  type: "ready",
  listener(bot, client) {
    console.log("Bot is ready!");
  },
};

export default event;
```
