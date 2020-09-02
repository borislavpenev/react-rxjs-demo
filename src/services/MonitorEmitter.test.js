import { Subject } from 'rxjs';
import MonitorEmitter from './MonitorEmitter';

import '@testing-library/jest-dom/extend-expect';

test('returned value shouldn`t be null', (done) => {
  const observable = new Subject();
  observable.subscribe((value) => {
    emitter.stop();
    expect(value).toBeDefined();
    expect(value).not.toBeNull();
    done();
  })

  const emitter = new MonitorEmitter('anyString', observable);
  emitter.start();
});

test('emit system data in 100-2000 ms', (done) => {
    const observable = new Subject();
    observable.subscribe((value) => {
      emitter.stop();
      const endTime = new Date().getTime();
      const delay = endTime - startTime;
      expect(delay).toBeLessThanOrEqual(2000);
      expect(delay).toBeGreaterThanOrEqual(100);
      done();
    })

    const emitter = new MonitorEmitter("randomData", observable);
    const startTime = new Date().getTime();
    emitter.start();
});

test('MonitorEmitter: after stop there shouldn`t be any message', (done) => {
    let timerId = null;

    const observable = new Subject();
    observable.subscribe(() => {
      if (timerId) {
        clearTimeout(timerId);
      }

      throw new Error("Test failed. Emitter didn't stop");
    })

    const emitter = new MonitorEmitter("type", observable);
    emitter.start();

    setTimeout(() => {
      emitter.stop();

      timerId = setTimeout(() => {
        expect(1).toBe(1);
        done();
      }, 2000);
    }, 90);
});