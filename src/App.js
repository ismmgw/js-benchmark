import React, { Fragment } from 'react';
import hardFunc from './Buisnes/hardFunc';
import testWorker from './Workers/testWorker';
import WebWorker from './Workers/WebWorker';
import { Loader } from './Components/Loader';
import './App.css';

//const MAX_I = 1300000000;

class App extends React.Component {

    state = {
        calcHardOnGoing: false,
        calcWorkOnGoing: false,
        calcHardResult: null,
        calcWorkResult: null,
        calcHardTime: null,
        calcWorkTime: null,
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
            calcWorkOnGoing: false,
            calcWorkResult: 'ОШИБКА В ВОРКЕРЕ',
            calcWorkTime: '',
        });
    };

    handleClick = (functionName) => () => {
        const inputValue = this.inputState.current.value;
        this[functionName](inputValue);
    };

    handleWorkerResult = (e) => {
        this.setState({
            calcWorkOnGoing: false,
            calcWorkResult: e.data.res,
            calcWorkTime: e.data.time,
        });
    };

    calculateHard = (iterations) => {
        this.setState({ calcHardOnGoing: true }, () => {
            setTimeout(() => {
                const startTime = performance.now();
                const calcHardResult = hardFunc(iterations);
                const calcHardTime = performance.now() - startTime;
                this.setState({
                    calcHardResult,
                    calcHardTime,
                    calcHardOnGoing: false,
                });
            }, 0);
        });
    };

    calculateInWorker = (iterations) => {
        this.setState({ calcWorkOnGoing: true });
        this.worker.postMessage([iterations, 'Понеслась!!!']);
    };

    calculateHardAndWorker = (iterations) => {
        this.calculateInWorker(iterations);
        this.calculateHard(iterations);
    };

    render() {
        return (
            <div className="App">
                <h1>Сравнение блокирующих и не блокирующих вычислений</h1>
                <div className="columns" >
                    <div>
                        <div><h2>Блокирующе вычисление</h2></div>
                        <div>Результат вычислений: {this.state.calcHardResult}</div>
                        <div>Время вычислений: {this.state.calcHardTime}</div>
                    </div>
                    <div>
                        <div className="vs" >VS</div>
                        {this.state.calcHardTime && this.state.calcWorkTime &&
                        <div>разница в {(this.state.calcWorkTime / this.state.calcHardTime).toFixed(1)} раз</div>
                        }
                    </div>
                    <div>
                        <div><h2>Вычисление в воркере</h2></div>
                        <div>Результат вычислений: {this.state.calcWorkResult}</div>
                        <div>Время вычислений: {this.state.calcWorkTime}</div>
                    </div>
                </div>
                <div>
                    <label htmlFor="count">Кол-во итераций</label>
                    <input type="number" ref={this.inputState} name="count" defaultValue="10000000"/>
                </div>
                <div className="columns">
                    <div>
                        <button
                            onClick={this.handleClick('calculateHard')}
                        >
                            Начать тяжёлые вычисления
                        </button>
                    </div>
                    <div>
                        <button
                            onClick={this.handleClick('calculateHardAndWorker')}
                        >
                            Начать оба вычисления одновременно
                        </button>
                    </div>
                    <div>
                        <button
                            onClick={this.handleClick('calculateInWorker')}
                        >
                            Начать тяжёлые вычисления в воркере
                        </button>
                    </div>
                </div>
                {(this.state.calcHardOnGoing || this.state.calcWorkOnGoing) &&
                    <div>
                        Тяжёлые вычисления в процессе<Loader/>
                    </div>
                }
            </div>
        );
    }
}

export default App;
