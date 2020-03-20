import React, {Component} from 'react';
import Node from './Node/Node';

import './AlgorithmVisualizer.css';

export default class AlgorithmVisualizer extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        return (
            <div>
                Foo
                <Node></Node>
            </div>
        )
    }
}