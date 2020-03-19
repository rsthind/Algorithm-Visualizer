import React, {Component} from "react";
import ReactDOM from 'react-dom';
import './BFS.css';

export default class BFS extends React.Component {
    constructor(props) {
        super(props);

        this.handleMouseMove = this.handleMouseMove.bind(this);

        this.state = {
            hexSize: 25,
            hexOrigin: {x: 400, y: 300}
        }
    }

    componentWillMount() {
        let hexParamters = this.getHexParameters();
        this.setState({
            canvasSize: {canvasWidth: 800, canvasHeight: 600},
            hexParamters: hexParamters
        })
    }

    componentDidMount() {
        const {canvasWidth, canvasHeight} = this.state.canvasSize;
        this.canvasHex.width = canvasWidth;
        this.canvasHex.height = canvasHeight;
        this.canvasCoordinates.width = canvasWidth;
        this.canvasCoordinates.height = canvasHeight;
        this.getCanvasPosition(this.canvasCoordinates);
        this.drawHexes();
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (nextState.currentHex !== this.state.currentHex) {
            const {q, r, s, x, y} = nextState.currentHex;
            const {canvasWidth, canvasHeight} = this.state.canvasSize;
            const ctx = this.canvasCoordinates.getContext("2d");
            ctx.clearRect(0, 0, canvasWidth, canvasHeight);
            let currentDistanceLine = nextState.currentDistanceLine;
            for (let i = 0; i <= currentDistanceLine.length - 1; i++) {
                if (i == 0) {
                    this.drawHex(this.canvasCoordinates, this.Point(currentDistanceLine[i].x, currentDistanceLine[i].y), "black", 1, "red");
                } else {
                    this.drawHex(this.canvasCoordinates, this.Point(currentDistanceLine[i].x, currentDistanceLine[i].y), "black", 1, "grey");
                }
            }
            //this.drawNeighbors(this.Hex(q, r, s));
            this.drawHex(this.canvasCoordinates, this.Point(x, y), "black", 1, "grey");
            return true;
        }
        return false;
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

    drawHex(canvasID, center, lineColor, width, fillColor) {
        for (let i = 0; i < 4; i++) {
            let start = this.getHexCornerCoord(center, i);
            let end = this.getHexCornerCoord(center, i +1);
            this.fillHex(canvasID, center, fillColor);
            this.drawLine(canvasID, start, end, lineColor, width)
        }
    }

    drawLine(canvasID, start, end, color, width) {
        const ctx = canvasID.getContext("2d");
        ctx.beginPath();
        ctx.moveTo(start.x, start.y);
        ctx.strokeStyle = color;
        ctx.lineWidth = width;
        ctx.lineTo(end.x, end.y);
        ctx.stroke();
        ctx.closePath();
    }

    drawHexes() {
        const {canvasWidth, canvasHeight} = this.state.canvasSize;
        const {hexWidth, hexHeight, vertDist, horizDist} = this.state.hexParamters;
        const hexOrigin = this.state.hexOrigin;
        let qLeftSide = Math.round(hexOrigin.x/hexWidth) * 4;
        let qRightSide = Math.round(canvasWidth - hexOrigin.x) /hexWidth * 2;
        let rTopSide = Math.round(hexOrigin.y/(hexHeight/2));
        let rBottomSide = Math.round(canvasHeight - hexOrigin.y) / (hexHeight / 2);

        var p = 0;
        for (let r = 0; r <= rBottomSide; r++) {
            if (r % 2 == 0 && r !== 0) {
                p++;
            }
            for (let q = -qLeftSide; q <= qRightSide; q++) {
                const {x, y} = this.hexToPixel(this.Hex(q-p, r));
                if ((x > hexWidth/2 && x < canvasWidth - hexWidth/2) && (y > hexHeight/2 && y < canvasHeight - hexHeight/2)) {
                    this.drawHex(this.canvasHex, this.Point(x, y), "black", 1 ,"grey");
                    //this.drawHexCoordinates(this.canvasHex, this.Point(x, y), this.Hex(q-p, r, -(q-p) - r));
                }
            }
        }
        var n = 0;
        for (let r = -1; r >= -rTopSide; r--) {
            if (r%2 !== 0) {
                n++;
            }
            for (let q = -qLeftSide; q <= qRightSide; q++) {
                const {x, y} = this.hexToPixel(this.Hex(q+n, r));
                if ((x > hexWidth/2 && x < canvasWidth - hexWidth/2) && (y > hexHeight/2 && y < canvasHeight - hexHeight/2)) {
                    this.drawHex(this.canvasHex, this.Point(x, y), "black", 1 ,"grey");
                    //this.drawHexCoordinates(this.canvasHex, this.Point(x, y), this.Hex(q+n, r, -(q+n) - r));
                }
            }
        }
    }

    hexToPixel(h) {
        let hexOrigin = this.state.hexOrigin;
        let x = this.state.hexSize * 3/2 * (h.q) + hexOrigin.x;
        let y = this.state.hexSize * 3/2 * h.r + hexOrigin.y;
        return this.Point(x, y)
    }

    Hex(q, r, s) {
        return {q: q, r: r, s: s}
    }

    drawHexCoordinates(canvasID, center, h) {
        const ctx = canvasID.getContext("2d");
        ctx.fillText(h.q, center.x + 6, center.y);
        ctx.fillText(h.r, center.x - 3, center.y + 15);
        ctx.fillText(h.s, center.x-12, center.y);
    }

    getHexParameters() {
        let hexHeight = this.state.hexSize * 2;
        let hexWidth =  hexHeight;
        let vertDist = hexHeight;
        let horizDist = hexWidth;
        return {hexWidth, hexHeight, vertDist, horizDist}
    }

    handleMouseMove(e) {
        const {left, right, top, bottom} = this.state.canvasPosition;
        const {canvasWidth, canvasHeight} = this.state.canvasSize;
        const {hexWidth, hexHeight, vertDist, horizDist} = this.state.hexParamters;
        console.log(e.pageX, e.pageY);
        let offsetX = e.pageX - left;
        let offsetY = e.pageY - top;
        const {q, r, s} = this.cubeRound(this.pixeltoHex(this.Point(offsetX, offsetY)));
        const {x, y} = this.hexToPixel(this.Hex(q, r, s));
        this.getDistanceLine(this.Hex(0, 0, 0), this.Hex(q, r, s));
        console.log(this.state.currentDistanceLine);
        if ((x > hexWidth /2 && x < canvasWidth - hexWidth/2) && (y > hexHeight /2 && y < canvasHeight - hexHeight/2)) {
            this.setState({
                currentHex: {q, r, s, x, y}
            })
        }
    }

    getCanvasPosition(canvasID) {
        let rect = canvasID.getBoundingClientRect();
        this.setState({
            canvasPosition: {left: rect.left, right: rect.right, top: rect.top, bottom: rect.bottom}
        })
    }

    pixeltoHex(p) {
        let size = this.state.hexSize;
        let origin = this.state.hexOrigin;
        let q = ((p.x - origin.x) * 2/3 / size);
        let r = (p.y - origin.y) * 2/3 / size;
        return this.Hex(q, r, -q-r);
    }

    cubeRound(cube) {
        var rx = Math.round(cube.q)
        var ry = Math.round(cube.r)
        var rz = Math.round(cube.s)

        var x_diff = Math.abs(rx - cube.q)
        var y_diff = Math.abs(ry - cube.r)
        var z_diff = Math.abs(rz - cube.s)

        if (x_diff > y_diff && x_diff > z_diff) {
            rx = -ry-rz;
        } else if (y_diff > z_diff) {
            ry = -rx-rz;
        } else {
            rz = -rx-ry;
        }

        return this.Hex(rx, ry, rz)
    }

    cubeDirections(direction) {
        const cubeDirection = [this.Hex(1, 0, -1), this.Hex(0, -1, 1), this.Hex(-1, 0, 1), this.Hex(0, 1, -1)];
        return cubeDirection[direction];

    }
    cubeAdd(a, b) {
        return this.Hex(a.q + b.q, a.r + b.r, a.s + b.s);
    }

    cubeSubstract(hexA, hexB) {
        return this.Hex(hexA.q - hexB.q, hexA.r - hexB.r, hexA.s - hexB.s);
    }

    getCubeNeighbor(h, direction) {
        return this.cubeAdd(h, this.cubeDirections(direction))
    }

    drawNeighbors(h) {
        for (let i = 0; i < 4; i++) {
            const {q, r, s} = this.getCubeNeighbor(this.Hex(h.q, h.r, h.s), i);
            const {x, y} = this.hexToPixel(this.Hex(q, r, s));
            this.drawHex(this.canvasCoordinates, this.Point(x, y), "red", 2);
        }
    }

    cubeDistance(hexA, hexB) {
        const {q, r, s} = this.cubeSubstract(hexA, hexB);
        return (Math.abs(q) + Math.abs(r) + Math.abs(s)) / 2;
    }

    linearInt(a, b, t) {
        return (a + (b - a) * t)
    }

    cubeLinearInt(hexA, hexB, t) {
        return this.Hex(this.linearInt(hexA.q, hexB.q, t), this.linearInt(hexA.r, hexB.r, t), this.linearInt(hexA.s, hexB.s, t));
    }

    getDistanceLine(hexA, hexB) {
        let dist = this.cubeDistance(hexA, hexB);
        var arr = [];
        for (let i = 0; i <= dist; i++) {
            let center = this.hexToPixel(this.cubeRound(this.cubeLinearInt(hexA, hexB, 1.0/dist * i)));
            arr = [].concat(arr, center);
        }
        this.setState({
            currentDistanceLine: arr
        })
    }

    fillHex(canvasID, center, fillColor) {
        let c0 = this.getHexCornerCoord(center, 0);
        let c1 = this.getHexCornerCoord(center, 1);
        let c2 = this.getHexCornerCoord(center, 2);
        let c3 = this.getHexCornerCoord(center, 3);
        const ctx = canvasID.getContext("2d");
        ctx.beginPath();
        ctx.fillStyle = fillColor;
        ctx.globalAlpha = 0.1;
        ctx.moveTo(c0.x, c0.y);
        ctx.lineTo(c1.x, c1.y);
        ctx.lineTo(c2.x, c2.y);
        ctx.lineTo(c3.x, c3.y);
        ctx.closePath();
        ctx.fill();
    }

    render() {
        return (
            <div className="BFS">
                <canvas ref ={canvasHex => this.canvasHex = canvasHex }></canvas>
                <canvas ref={canvasCoordinates => this.canvasCoordinates = canvasCoordinates} onMouseMove = {this.handleMouseMove}></canvas>
            </div>
        )
    }
}