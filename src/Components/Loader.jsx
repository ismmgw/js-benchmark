import React, { Component } from 'react';

export class Loader extends Component {

    static defaultProps = {};

    state = { loaderState: '' };
    timerId = null;

    componentDidMount() {
        this.timer();
    }

    timer = () => {
        this.timerId = setTimeout(() => {
            this.setState({ loaderState: this.state.loaderState.length < 3 ? this.state.loaderState + '.' : '' }, () => {
                this.timer();
            });
        }, 400)
    };

    componentWillUnmount() {
        clearTimeout(this.timerId);
    }

    render() {
        return (
            <span>
                {this.state.loaderState}
            </span>
        );
    }
}
