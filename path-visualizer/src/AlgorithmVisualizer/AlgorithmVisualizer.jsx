import React, { Component } from 'react';
import Node from './Node/Node';
import {dijkstra, getNodesInShortestPathOrder} from './Algorithms/dijkstra';

import './AlgorithmVisualizer.css';

var START_NODE_ROW = 10;
var START_NODE_COL = 15;
var FINISH_NODE_ROW = 10;
var FINISH_NODE_COL = 35;

export default class PathfindingVisualizer extends Component {
    constructor() {
        super();
        this.state = {
            grid: [],
            mouseIsPressed: false,
        };
    }


    moveStartUp(dir) {
        if (dir == 0) {
            START_NODE_ROW += 1;
        } else if (dir == 1) {
            START_NODE_ROW -= 1;
        }
        else if (dir == 2) {
            START_NODE_COL += 1;
        }
        else if (dir == 3) {
            START_NODE_COL -= 1;
        }
        
        const grid = getInitialGrid();
        this.setState({ grid });
    }

    moveEndUp(dir) {
        if (dir == 0) {
            FINISH_NODE_ROW += 1;
        } else if (dir == 1) {
            FINISH_NODE_ROW -= 1;
        }
        else if (dir == 2) {
            FINISH_NODE_COL += 1;
        }
        else if (dir == 3) {
            FINISH_NODE_COL -= 1;
        }

        const grid = getInitialGrid();
        this.setState({ grid });
    }
    moveStartDown() {
        alert(START_NODE_COL);
        START_NODE_ROW += 1;
        alert(START_NODE_COL);
        const grid = getInitialGrid();
        this.setState({ grid });
    }
    moveStartLeft() {
        alert(START_NODE_COL);
        START_NODE_ROW += 1;
        alert(START_NODE_COL);
        const grid = getInitialGrid();
        this.setState({ grid });
    }
    moveStartRight() {
        alert(START_NODE_COL);
        START_NODE_ROW += 1;
        alert(START_NODE_COL);
        const grid = getInitialGrid();
        this.setState({ grid });
    }

    componentDidMount() {
        const grid = getInitialGrid();
        this.setState({grid});
    }

    handleMouseDown(row, col) {
        const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
        this.setState({grid: newGrid, mouseIsPressed: true});
    }

    handleMouseEnter(row, col) {
        if (!this.state.mouseIsPressed) return;
        const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
        this.setState({grid: newGrid});
    }

    handleMouseUp() {
        this.setState({mouseIsPressed: false});
    }

    animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder) {
        for (let i = 0; i <= visitedNodesInOrder.length; i++) {
            if (i === visitedNodesInOrder.length) {
                setTimeout(() => {
                    this.animateShortestPath(nodesInShortestPathOrder);
                }, 10 * i);
                return;
            }
            setTimeout(() => {
                const node = visitedNodesInOrder[i];
                document.getElementById(`node-${node.row}-${node.col}`).className =
                    'node node-visited';
            }, 10 * i);
        }
    }

    animateShortestPath(nodesInShortestPathOrder) {
        for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
            setTimeout(() => {
                const node = nodesInShortestPathOrder[i];
                document.getElementById(`node-${node.row}-${node.col}`).className =
                    'node node-shortest-path';
            }, 50 * i);
        }
    }

    visualizeDijkstra() {
        const {grid} = this.state;
        const startNode = grid[START_NODE_ROW][START_NODE_COL];
        const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
        const visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
        const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
        this.animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
    }

    reset() {
        const grid = getInitialGrid();
        this.setState({grid});
    }

    render() {
        const {grid, mouseIsPressed} = this.state;

        return (
            <>
                <button onClick={() => this.visualizeDijkstra()}>
                    Visualize Dijkstra's Algorithm
                </button>

                <button onClick={() => this.componentDidMount()}>
                    Reset
                </button>

                <button onClick={() => this.moveStartUp(1)}>
                    Move Start Node Up
                </button>

                <button onClick={() => this.moveStartUp(0)}>
                    Move Start Node Down
                </button>
                        
                <button onClick={() => this.moveStartUp(2)}>
                    Move Start Node Right
                </button>

                <button onClick={() => this.moveStartUp(3)}>
                    Move Start Node Left
                </button>




                <button onClick={() => this.moveEndUp(1)}>
                    Move End Node Up
                </button>

                <button onClick={() => this.moveEndUp(0)}>
                    Move End Node Down
                </button>

                <button onClick={() => this.moveEndUp(2)}>
                    Move End Node Right
                </button>

                <button onClick={() => this.moveEndUp(3)}>
                    Move End Node Left
                </button>

                

                <div className="grid">
                    {grid.map((row, rowIdx) => {
                        return (
                            <div key={rowIdx}>
                                {row.map((node, nodeIdx) => {
                                    const {row, col, isFinish, isStart, isWall} = node;
                                    return (
                                        <Node
                                            key={nodeIdx}
                                            col={col}
                                            isFinish={isFinish}
                                            isStart={isStart}
                                            isWall={isWall}
                                            mouseIsPressed={mouseIsPressed}
                                            onMouseDown={(row, col) => this.handleMouseDown(row, col)}
                                            onMouseEnter={(row, col) =>
                                                this.handleMouseEnter(row, col)
                                            }
                                            onMouseUp={() => this.handleMouseUp()}
                                            row={row}></Node>
                                    );
                                })}
                            </div>
                        );
                    })}
                </div>
            </>
        );
    }
}
const getInitialGrid = () => {
    const grid = [];
    for (let row = 0; row < 20; row++) {
        const currentRow = [];
        for (let col = 0; col < 50; col++) {
            currentRow.push(createNode(col, row));
        }
        grid.push(currentRow);
    }
    return grid;
};
const createNode = (col, row) => {
    return {
        col,
        row,
        isStart: row === START_NODE_ROW && col === START_NODE_COL,
        isFinish: row === FINISH_NODE_ROW && col === FINISH_NODE_COL,
        distance: Infinity,
        isVisited: false,
        isWall: false,
        previousNode: null,
    };
};
const getNewGridWithWallToggled = (grid, row, col) => {
    const newGrid = grid.slice();
    const node = newGrid[row][col];
    const newNode = {
        ...node,
        isWall: !node.isWall,
    };
    newGrid[row][col] = newNode;
    return newGrid;
};