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
            visitedNodes: [],
            wallNodes: []
        };
    }

    componentDidMount() {
        const grid = getInitialGrid();
        this.setState({
            grid: grid,
            visitedNodes: grid
        });
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


    handleKeyDown(row, col, e){
        const nodeInitial = this.state.grid[row][col];
        let rowNew = row;
        let colNew = col;
        if(nodeInitial.isSelected){
            if(e.keyCode === 37){
                colNew -= 1;
            }
            else if(e.keyCode === 38){
                rowNew -= 1;
            }
            else if(e.keyCode === 39){
                colNew += 1;
            }
            else if(e.keyCode === 40){
                rowNew += 1;

            }
            if(nodeInitial.isStart){
                START_NODE_ROW = rowNew;
                START_NODE_COL = colNew;
            }
            else if(nodeInitial.isFinish){
                FINISH_NODE_ROW = rowNew;
                FINISH_NODE_COL = colNew;
            }
        }
        const grid = getInitialGrid();
        const node = grid[rowNew][colNew];
        const newNode = {
            ...node,
        };
        newNode.isSelected = true;
        if(node.isStart){
            document.getElementById(`node-${newNode.row}-${newNode.col}`).className =
                'node node-highlightedStart';
            newNode.isStart = true;
        }
        else if(node.isFinish){
            document.getElementById(`node-${newNode.row}-${newNode.col}`).className =
                'node node-highlightedFinish';
            newNode.isFinish = true;
        }
        grid[rowNew][colNew] = newNode;
        this.setState({
            grid: grid,
            visitedNodes: grid
        });
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
        if(startNode.isSelected || finishNode.isSelected){
            alert("Make sure you deselect the nodes before visualizing!");
            return;
        }
        const visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
        const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
        this.setState({
            visitedNodes: visitedNodesInOrder
        });
        this.animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
    }

    reset() {
        for(let i = 0;i<this.state.visitedNodes.length;i++){
            const node = this.state.visitedNodes[i];
            if(node.isStart){
                document.getElementById(`node-${node.row}-${node.col}`).className =
                    'node node-start';
            }
            else if(node.isFinish){
                document.getElementById(`node-${node.row}-${node.col}`).className =
                    'node node-finish';
            }
            else {
                document.getElementById(`node-${node.row}-${node.col}`).className =
                    'node node';
            }
        }
    }

    render() {
        const {grid, mouseIsPressed} = this.state;

        return (
            <>
                <button onClick={() => this.visualizeDijkstra()}>
                    Visualize BFS
                </button>

                <button onClick={() => this.reset()}>
                    Reset Grid
                </button>



                <div className="grid">
                    {grid.map((row, rowIdx) => {
                        return (
                            <div key={rowIdx}>
                                {row.map((node, nodeIdx) => {
                                    const {row, col, isFinish, isStart, isWall, isSelected} = node;
                                    return (
                                        <Node
    key={nodeIdx}
    col={col}
    isFinish={isFinish}
    isStart={isStart}
    isWall={isWall}
    isSelected = {isSelected}
    mouseIsPressed={mouseIsPressed}
    onMouseDown={(row, col) => this.handleMouseDown(row, col)}
    onMouseEnter={(row, col) =>
        this.handleMouseEnter(row, col)
    }
    onMouseUp={() => this.handleMouseUp()}
    onKeyDown = {(row, col, e) => this.handleKeyDown(row, col, e)}
    row={row}/>
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
        isSelected: !node.isSelected
    };
    if(node.isStart){
        if(newNode.isSelected) {
            document.getElementById(`node-${newNode.row}-${newNode.col}`).className =
                'node node-highlightedStart';
        }
        else{
            document.getElementById(`node-${newNode.row}-${newNode.col}`).className =
                'node node-start';
        }
    }
    if(node.isFinish){
        if(newNode.isSelected) {
            document.getElementById(`node-${newNode.row}-${newNode.col}`).className =
                'node node-highlightedFinish';
        }
        else{
            document.getElementById(`node-${newNode.row}-${newNode.col}`).className =
                'node node-finish';
        }
    }
    newGrid[row][col] = newNode;
    return newGrid;
};