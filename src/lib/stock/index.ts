import rand from "./rand";

export type StockState =
  | "STAY"
  | "HIGH"
  | "HIGHER"
  | "DUCKSANG"
  | "LOW"
  | "LOWER"
  | "DUCKLACK"
  | "SANGJANGPAEJI"; // 상장 패지

const continueX = [3, 4, 10]; // 상태에 대한 가중치
const pricenGenMulti = [0.3, 0.4, 1]; // 특정 상태에 대한 곱값
const genRandMulti = 0.2; // 모든 생성 값에 대한 곱값
const EVENT_REQUIRE_MIN = 5; // event가 발생하기 위한 최소 시간
const EVENT_REQUIRE_MAX = 10; // event가 발생하기 위한 최대 시간
const STAY_STAY_SECOND = 60 * 5; // STAY상태를 유지하는 최소 시간
const PRICE_GEN_MIN = 10; // 주가 변동 최소값
const PRICE_GEN_MAX = 50; // 주가 변동 최대값

export type EventTypes = "NEWSTATE" | "TICK";
export type NewStateProps = StockState;
export type TickProps = {
  tick: number;
  state: StockState;
  price: number;
};

type State = {
  name: string;
  price: number;
  color: string;

  history: number[];
  timeHistory: string[];
  maxHistory: number;

  state: StockState;
  stateTick: number;
  stateContinue: number;
  stateContinueLimit: number;

  // interval: NodeJS.Timeout;
  intervalMS: number;

  runningTick: number;
  speedMultiplier: number;
  stayPrice: number;
};

export class Stock {
  name: string;
  price: number;
  color: string;

  history: number[] = [];
  timeHistory: string[] = [];
  maxHistory: number = 100;

  state: StockState = "STAY";
  stateTick: number = 0;
  stateContinue: number = 0;
  stateContinueLimit: number = 11;

  // interval: NodeJS.Timeout;
  intervalMS: number = 50;

  runningTick: number = 0;
  speedMultiplier: number = 1;
  stayPrice: number = 1000;

  stopper: (() => void) | null = null;

  listeners: { [key: string]: any[] } = {};

  constructor(props: {
    name: string;
    price: number;
    history?: number[];
    color: string;
    state?: StockState;
    stateTick?: number;
    intervalMS?: number;
    maxHistory?: number;
    stateContinueLimit?: number;
    speedMultiplier?: number;
  }) {
    this.name = props.name;
    this.price = props.price;
    this.stayPrice = props.price;
    this.color = props.color;
    if (typeof props.history != "undefined") this.history = props.history;
    if (typeof props.state != "undefined") this.state = props.state;
    if (typeof props.stateTick != "undefined") this.stateTick = props.stateTick;
    if (typeof props.intervalMS != "undefined")
      this.intervalMS = props.intervalMS;
    if (typeof props.maxHistory != "undefined")
      this.maxHistory = props.maxHistory;
    if (typeof props.stateContinueLimit != "undefined")
      this.stateContinueLimit = props.stateContinueLimit;
    if (typeof props.speedMultiplier != "undefined")
      this.speedMultiplier = props.speedMultiplier;
    this.intervaler();
  }
  intervaler() {
    let running = true;
    const t = async () => {
      while (running) {
        await new Promise((resolve) =>
          setTimeout(resolve, this.intervalMS / this.speedMultiplier)
        );
        await this.nextTick();
      }
    };
    setTimeout(t, 0);
    this.stopper = () => {
      running = false;
      this.stopper = null;
    };
  }
  fitHistory() {
    while (this.history.length > this.maxHistory) this.history.shift();
    while (this.timeHistory.length > this.maxHistory) this.timeHistory.shift();
  }
  stay() {
    this.state = "STAY";
    this.stateTick = 0;
    this.stayPrice = this.price;
  }
  genStateIndex() {
    let chance = [87, 10, 3];
    let data = rand(0, 100);
    let sum = 0;
    for (let i = 0; i < chance.length; i++) {
      sum += chance[i];
      if (data <= sum) return i;
    }
    return chance.length - 1;
  }
  genHighState() {
    const index = this.genStateIndex();

    this.state = ["HIGH", "HIGHER", "DUCKSANG"][index] as any;
    const continueValue = continueX[index];
    this.stateContinue += continueValue;
  }
  genLowState() {
    const index = this.genStateIndex();

    this.state = ["LOW", "LOWER", "DUCKLACK"][index] as any;
    const continueValue = continueX[index];
    this.stateContinue -= continueValue;
  }
  randState() {
    // 10번 가격이 올라가면 가격을 낮춰야함
    if (this.stateContinue >= this.stateContinueLimit) {
      this.emit("NEWSTATE", this.state);
      return this.genLowState();
    }
    // 10번 가격이 내려가면 가격을 올려야함
    if (this.stateContinue <= -this.stateContinueLimit) {
      this.emit("NEWSTATE", this.state);
      return this.genHighState();
    }
    // 0.05초(this.intervalMS)마다 가격의 변동이 생김

    let change = false;

    // 15분 이상 STAY면 상태를 바꿈
    if (this.stateTick >= this.milisecond2tick(1000 * 60 * EVENT_REQUIRE_MAX))
      change = true;
    if (
      this.stateTick >= this.milisecond2tick(1000 * 60 * EVENT_REQUIRE_MIN) && // 3분 이상 STAY
      rand(0, 9000) <= 1 // 평균 6.5분
    )
      change = true;

    if (change) {
      this.stateTick = 0; // 새로운 상태를 유지한 시간을 0tick으로 변경
      // 50%의 확률로 상태를 변화 시킴
      this.emit("NEWSTATE", this.state);
      if (rand(0, 100) < 50) this.genHighState();
      else this.genLowState();
    }
  }
  sec2tick(sec: number) {
    return (sec * 1000) / this.intervalMS;
  }
  milisecond2tick(ms: number) {
    return ms / this.intervalMS;
  }
  tick2second(tick: number) {
    return (tick * this.intervalMS) / 1000;
  }
  tick2milisecond(tick: number) {
    return tick * this.intervalMS;
  }
  state2index() {
    if (this.state == "HIGH") return 0;
    if (this.state == "HIGHER") return 1;
    if (this.state == "DUCKSANG") return 2;
    if (this.state == "LOW") return 0;
    if (this.state == "LOWER") return 1;
    if (this.state == "DUCKLACK") return 2;
    return 0;
  }
  genDiffPrice() {
    return (
      rand(-PRICE_GEN_MIN * 0.1, PRICE_GEN_MAX) *
      continueX[this.state2index()] *
      genRandMulti *
      pricenGenMulti[this.state2index()]
    );
  }
  maxSecondByState() {
    if (this.state.includes("DUCK")) return 2;
    if (this.state.includes("ER")) return 10;
    return 30;
  }
  nextState() {
    this.stateTick++;

    if (
      this.state == "STAY" &&
      this.stateTick <= this.sec2tick(STAY_STAY_SECOND)
    )
      return; // STAY상태면 10초 이상 유지
    else if (this.state != "STAY" && this.stateTick <= this.sec2tick(10))
      return; // 특정 상태를 최소 10초는 유지
    else if (
      this.state != "STAY" &&
      this.stateTick >= this.sec2tick(this.maxSecondByState())
    )
      this.stay(); // 특정 상태를 최대 30초 동안 유지
    else this.randState(); // STAY상태면 randState호출
  }
  nextStayPrice() {
    this.price += rand(-50, 50);
    const diff = this.price - this.stayPrice;
    if (diff < -3000) this.price += rand(50, 200);
    if (diff > 3000) this.price -= rand(50, 200);
  }
  nextHighPrice() {
    this.price += this.genDiffPrice();
  }
  nextLowPrice() {
    this.price -= this.genDiffPrice();
  }
  nextPrice() {
    if (this.state == "STAY") this.nextStayPrice();
    if (["HIGH", "HIGHER", "DUCKSANG"].includes(this.state))
      this.nextHighPrice();
    if (["LOW", "LOWER", "DUCKLACK"].includes(this.state)) this.nextLowPrice();
  }
  genDataset(history?: number[]) {
    return {
      label: this.name,
      data: history || this.history,
      fill: false,
      borderColor: [this.color],
      borderWidth: 1,
      tension: 0.1,
      pointStyle: "line",
      pointBorderWidth: 0,
      pointBackgroundColor: "trasperent",
      pointHitRadius: 0,
    };
  }
  async genPicture(history?: number[], timeHistory?: string[]) {
    if (typeof history == "undefined") history = [...this.history];
    if (typeof timeHistory == "undefined") timeHistory = [...this.timeHistory];
    return {
      type: "line",
      data: {
        labels: [timeHistory],
        datasets: [this.genDataset(history)],
      },
    };
  }
  pad2(n: number) {
    return n < 10 ? "0" + n : n;
  }
  genTimeStrByTick() {
    const second = this.tick2second(this.runningTick);
    const minute = Math.floor(second / 60);
    const hour = Math.floor(minute / 60);
    return `${this.pad2(hour)}:${this.pad2(minute % 60)}:${this.pad2(
      Math.floor(second % 60)
    )}`;
  }
  nextTick() {
    this.emit("TICK", {
      tick: this.runningTick,
      state: this.state,
      price: this.price,
    });
    this.runningTick++;
    // 상장패지 시에는 주가가 더이상 변하지 않음

    if (this.runningTick == Number.MAX_SAFE_INTEGER) this.runningTick = 0;

    if (this.state == "SANGJANGPAEJI") return;
    this.nextState();
    this.nextPrice();
    this.fitHistory();

    this.price = Math.round(this.price);
    this.history.push(this.price);
    const d = new Date();
    const timeStr = `${this.pad2(d.getHours())}:${this.pad2(
      d.getMinutes()
    )}:${this.pad2(d.getSeconds())}`;
    // this.timeHistory.push(this.timeHistory.includes(timeStr) ? "" : timeStr);
    this.timeHistory.push(timeStr);

    if (this.runningTick > 0 && this.runningTick % 100 == 0) {
      this.genPicture([...this.history], [...this.timeHistory]);
    }

    // -100원 이하면 상장 패지
    if (this.price <= -100) {
      this.state = "SANGJANGPAEJI";
      console.log("SANGJANGPAEJI");
      this.emit("NEWSTATE", "SANGJANGPAEJI");
    }
  }

  saveState(): State {
    return {
      color: this.color,
      history: this.history,
      intervalMS: this.intervalMS,
      maxHistory: this.maxHistory,
      name: this.name,
      price: this.price,
      runningTick: this.runningTick,
      speedMultiplier: this.speedMultiplier,
      state: this.state,
      stateContinue: this.stateContinue,
      stateContinueLimit: this.stateContinueLimit,
      stateTick: this.stateTick,
      stayPrice: this.stayPrice,
      timeHistory: this.timeHistory,
    };
  }
  loadState(state: State) {
    this.color = state.color;
    this.history = state.history;
    this.intervalMS = state.intervalMS;
    this.maxHistory = state.maxHistory;
    this.name = state.name;
    this.price = state.price;
    this.runningTick = state.runningTick;
    this.speedMultiplier = state.speedMultiplier;
    this.state = state.state;
    this.stateContinue = state.stateContinue;
    this.stateContinueLimit = state.stateContinueLimit;
    this.stateTick = state.stateTick;
    this.stayPrice = state.stayPrice;
    this.timeHistory = state.timeHistory;
    if (this.stopper) this.stopper();
    this.intervaler();
  }

  on(event: EventTypes, callback: any) {
    if (!this.listeners[event]) this.listeners[event] = [];
    this.listeners[event].push({
      callback,
      type: "on",
    });
  }
  once(event: EventTypes, callback: any) {
    if (!this.listeners[event]) this.listeners[event] = [];
    this.listeners[event].push({
      callback,
      type: "once",
    });
  }
  off(event: EventTypes, callback: any) {
    if (!this.listeners[event]) return;
    this.listeners[event] = this.listeners[event].filter(
      (listener) => listener.callback != callback
    );
  }
  emit(event: EventTypes, ...args: any[]) {
    if (!this.listeners[event]) return;
    this.listeners[event].forEach((listener) => {
      listener.callback(...args);
      if (listener.type == "once") this.off(event, listener.callback);
    });
  }
}
