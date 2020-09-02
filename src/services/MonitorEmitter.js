import Emitter from './Emitter';

class MonitorEmitter {
  constructor(systemType, sub) {
    this.timerRunnable = true;
    this.timerId = null;
    this.systemType = systemType;

    Emitter.on(systemType, (value) => {
      sub.next(value);
    })
  }

  start = () => {
    this.timerRunnable = true;
    this.startEmitData();
  }

  stop = () => {
    this.timerRunnable = false;

    if (!this.timerId) {
      return;
    }

    clearTimeout(this.timerId);
  }

  startEmitData = () => {
    if (!this.timerRunnable) {
      return;
    }

    const delay = this.getTimeoutDelay();

    this.timerId = setTimeout(
      () => {
        const randomString = this.getRandomString();

        Emitter.emit(this.systemType, randomString);

        this.startEmitData();
      }, delay
    )
  }

  getRandomString = () => {
    return this.getRandomNumber(100, 200).toString();
  }

  getTimeoutDelay = () => {
    return this.getRandomNumber(100, 2000);
  }

  getRandomNumber = (min, max) => {
    return Math.floor(Math.random() * Math.floor(max)) + min;
  }
}

export default MonitorEmitter;