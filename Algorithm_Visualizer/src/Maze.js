var canvas;
var context;

var WIDTH = 1200;
var HEIGHT = 800;

tileW = 20;
tileH = 20;

tileRowCount = 25;
tileColumnCount = 40;

var tiles = [];
for (c = 0; c < tileColumnCount; c++) {
    tiles[c] = [];
    for (r = 0; r < tileRowCount; r++) {
        tiles[c][r] = {x: c*(tileW + 3), y: r*(tileH + 3), state: 'e'}; //state is e for empty
    }
}
tiles[0][0].state = 's'; //start
tiles[tileColumnCount - 1][tileRowCount - 1].state = 'f'; //finish

function rect(x, y, w, h, state) {
    if (state == 's') {
        context.fillStyle = '#00FF00' //green
    } else if (state == 'f') {
        context.fillStyle = '#FF0000' //red
    } else if (state == 'e' ){
        context.fillStyle = '#AAAAAA'; //gray
    } else if (state == 'w') {
        context.fillStyle = '#0000FF' //blue
    }

    context.beginPath();
    context.rect(x, y, w, h);
    context.closePath();
    context.fill();
}

function clear() {
    context.clearRect(0, 0, WIDTH, HEIGHT)
}

function draw() {
    clear();

    for (c = 0; c < tileColumnCount; c++) {
        for (r = 0; r < tileRowCount; r++) {
            rect(tiles[c][r].x, tiles[c][r].y, tileW, tileH, tiles[c][r].state);
        }
    }
}

function init() {
    canvas = document.getElementById("myCanvas");
    //canvas.mousedown = myDown;
    context = canvas.getContext("2d");
    return setInterval(draw, 10); //run function with timer
}

function myDown(e) {

    x = e.pageX - canvas.offsetLeft;
    y = e.pageY - canvas.offsetTop;

    for (c = 0; c < tileColumnCount; c++) {
        for (r = 0; r < tileRowCount; r++) {
            if (c*(tileW + 3) < x && x < c*(tileW + 3) + tileW && r*(tileH + 3) < y && y < r*(tileH + 3)+tileH) {
                if (tiles[c][r].state == 'e') {
                    tiles[c][r].state = 'w'; //wall
                } else if (tiles[c][r].state == 'w') {
                    tiles[c][r].state = 'e'; //empty
                }
            }
        }
    }
}

init();
canvas.onmousedown = myDown;
