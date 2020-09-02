import { Subject, combineLatest } from "rxjs";
import MonitorEmitter from "../services/MonitorEmitter";

class UniqueObservable {
  constructor(obj) {
    this.NA = 'N/A';
    this.monitorSubjects = [new Subject(), new Subject(), new Subject()]
    this.returnObject = obj;
    this.previousValues = ['', '', ''];
    this.emittersArray = [];
    this.timers = {};
    this.lastSentDate = new Date().getTime();

    this.listenToMonitoring();
  }

  subscribe = () => {
    this.monitorSubjects.forEach((monitorSubject, index) => {
      this.runEmitter(index.toString(), monitorSubject);
    })

    return this;
  }

  unsubscribe = () => {
    this.emittersArray.forEach((emitter) => emitter.stop);
    this.emittersArray.length = 0;

    Object.entries(this.timers).filter(timerId => !!timerId).forEach(([, timerId]) => clearTimeout(timerId));
  }

  runEmitter = (type, obj) => {
    const emitter = new MonitorEmitter(type, obj);
    emitter.start();

    this.emittersArray.push(emitter);
  }

  listenToMonitoring = () => {
    combineLatest(this.monitorSubjects).subscribe(
      (newValues) => {
        const skipUpdate = this.checkNAValues(newValues);
        const currentDate = new Date().getTime();
        //skip emitting if last emit was less than 100ms ago
        if (skipUpdate || currentDate - this.lastSentDate < 100) {
            return;
        }

        this.returnObject.next(newValues);
        this.lastSentDate = currentDate;
      }
    );
  }

  checkNAValues = (newValues) => {
    let skipUpdate = false;

    newValues.forEach((prop, index) => {
      //Display object should only be emitted when one of the systems sends a new value, but not N/A
      if (prop !== this.previousValues[index] && prop === this.NA) {
        skipUpdate = true;
      }
      if (prop === this.previousValues[index] || prop === this.NA) {
        return;
      }

      const timerId = this.timers[index.toString()];

      if (timerId) {
        clearTimeout(timerId);
      }

      //If a value is not received from a specific system for more than 1000ms, its reading should be 'N/A'
      this.timers[index.toString()] = setTimeout(() => {
        this.monitorSubjects[index].next(this.NA);
      }, 1000);
    })

    this.previousValues = newValues;

    return skipUpdate;
  }
}

export default UniqueObservable;