import React, {Component} from "react";
import ReactDOM from 'react-dom';
import './BFS.css';

export default class BFS extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            hexSize: 20
        }
    }

    componentWillMount() {
        this.setState({
            canvasSize: {canvasWidth: 800, canvasHeight: 600}
        })
    }

    componentDidMount() {
        const {canvasWidth, canvasHeight} = this.state.canvasSize;
        this.canvasHex.width = canvasWidth;
        this.canvasHex.height = canvasHeight;
        this.drawHexes();
    }

    getHexCornerCoord(center, i) {
        let angle_deg = 90 * i + 45;
        let angle_rad = Math.PI / 180 * angle_deg;
        let x = center.x + this.state.hexSize * Math.cos(angle_rad);
        let y = center.y + this.state.hexSize * Math.sin(angle_rad);
        return this.Point(x, y);
    }

    Point(x, y) {
        return {x: x, y: y}
    }

    drawHex(canvasID, center) {
        for (let i = 0; i < 4; i++) {
            let start = this.getHexCornerCoord(center, i);
            let end = this.getHexCornerCoord(center, i +1);

            this.drawLine(canvasID, {x: start.x, y: start.y}, {x: end.x, y: end.y})
        }
    }

    drawLine(canvasID, start, end) {
        const ctx = canvasID.getContext("2d");
        ctx.beginPath();
        ctx.moveTo(start.x, start.y);

        ctx.lineTo(end.x, end.y);
        ctx.stroke();
        ctx.closePath();
    }

    drawHexes() {
        for (let r = 0; r <=4; r++) {
            for (let q = 0; q <= 4; q++) {
                let center = this.hexToPixel(this.Hex(q, r));
                this.drawHex(this.canvasHex, center);
                console.log(center);
            }
        }
    }

    hexToPixel(h) {
        let x = this.state.hexSize * Math.sqrt(2) * (h.q);
        let y = this.state.hexSize * 3/2 * h.r;
        return this.Point(x, y)
    }

    Hex(q, r) {
        return {q: q, r: r}
    }

    drawHexCoordinates(canvasID, center, h) {
        const ctx = canvasID.getContext("2d");
    }

    render() {
        return (
            <div className="BFS">
                <canvas ref ={canvasHex => this.canvasHex = canvasHex }></canvas>
            </div>
        )
    }
}