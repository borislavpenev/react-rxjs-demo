import React, { useEffect } from 'react';
import { Subject } from 'rxjs';
import logo from './logo.svg';
import './App.css';

import { useObservable } from './observable/useObservable';
import UniqueObservable from './observable/UniqueObservable';

const monitorObservable = new Subject()
const monitorTitles = ["Temperature", "Air Pressure", "Humidity"];

function App() {
  const displayObjects = useObservable(monitorObservable, []);

  useEffect(() => {
    const uniqueObservable = new UniqueObservable(monitorObservable).subscribe();

    return uniqueObservable.unsubscribe;
  }, [])

  const systemsUi = monitorTitles.map((title, i) => (
    <div className="system" key={i}>
      <span className="title">{title} : {displayObjects.length <= i ? "" : displayObjects[i]}</span>
    </div>
  ))
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        {systemsUi}
      </header>
    </div>
  );
}

export default App;
