import React, { Fragment } from 'react';
import testWorker from './Workers/testWorker';
import WebWorker from './Workers/WebWorker';
import { Loader } from './Components/Loader';
import './App.css';

//const MAX_I = 1300000000;

class App extends React.Component {

  state = {
    calculatingOnGoing: false,
    calculatingResult: null,
    calculatingTime: null,
  };

  worker = null;

  constructor(props) {
    super(props);
    this.inputState = React.createRef();
  }

  componentDidMount() {
    this.worker = new WebWorker(testWorker);
    this.worker.onmessage = this.handleWorkerResult;
    this.worker.onerror = this.handleWorkerError;
  }

  handleWorkerError = (e) => {
      this.setState({
          calculatingOnGoing: false,
          calculatingResult: 'ОШИБКА В ВОРКЕРЕ',
          calculatingTime: '',
      });
  };

  handleClick = (functionName) => () => {
    const inputValue = this.inputState.current.value;
    this.setState({ calculatingOnGoing: true }, () => {
        setTimeout(() => this[functionName](this.onEndCalculating, inputValue), 0);
    });
  };

  handleWorkerResult = (e) => {
      this.onEndCalculating(e.data.res, e.data.time);
  };

  onEndCalculating = (res, time) => {
    this.setState({
        calculatingOnGoing: false,
        calculatingResult: res,
        calculatingTime: time,
    });
  };

  calculateHard = (cb, val) => {
    const startTime = performance.now();
    let res = 0;
    for (let i = 0; i < val; i++) {
      res += 1;
      res += res % 2;
    }
    const endTime = performance.now() - startTime;
    console.log('i here ', endTime);
    cb(res, endTime);
  };

  calculateHardThisTimeout = (cb, val) => {
      const startTime = Date.now();
      let res = 0;
      let i = 0;

      function tick() {
          setTimeout(() => {
              res += 1;
              res += res % 2;
              i++;
              if (i < val) {
                  return tick();
              }
              cb(res, Date.now() - startTime);
          }, 0);
      }

      tick();
  };

  calculateInWorker = (cb, val) => {
      this.worker.postMessage([val, 'Понеслась!!!']);
  };

  render() {
    return (
        <div className="App">
            {this.state.calculatingResult !== null &&
                <Fragment>
                    <div>Результат вычислений: {this.state.calculatingResult}</div>
                    <div>Время вычислений: {this.state.calculatingTime}</div>
                </Fragment>
            }
            {this.state.calculatingOnGoing ?
                <div>
                    Тяжёлые вычисления в процессе<Loader />
                </div>
                :
                <Fragment>
                  <div>
                      <label htmlFor="count" >Кол-во итераций</label>
                      <input type="number" ref={this.inputState} name="count" defaultValue="10000000"/>
                  </div>
                  <div>
                    <button
                      onClick={this.handleClick('calculateHard')}
                    >
                        Начать тяжёлые вычисления
                    </button>
                  </div>
                    {/*{<div>
                    <button
                      onClick={this.handleClick('calculateHardThisTimeout')}
                    >
                      Начать тяжёлые вычисления c таймаутами
                    </button>
                  </div>*/}
                  <div>
                      <button
                          onClick={this.handleClick('calculateInWorker')}
                      >
                          Начать тяжёлые вычисления в воркере
                      </button>
                  </div>
                </Fragment>
            }
        </div>
    );
  }
}

export default App;
