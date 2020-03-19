var canvas;
var context;
var output;

var WIDTH = 1200;
var HEIGHT = 800;

tileW = 20;
tileH = 20;

tileRowCount = 25;
tileColumnCount = 40;

boundX = 0;
boundY = 0;

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
        context.fillStyle = '#00FF00' //green - start
    } else if (state == 'f') {
        context.fillStyle = '#FF0000' //red - finish
    } else if (state == 'e' ){
        context.fillStyle = '#AAAAAA'; //gray - not visited
    } else if (state == 'w') {
        context.fillStyle = '#0000FF' //blue - wall
    } else if (state == 'x') {
        context.fillStyle = '#000000' //black - shortest path
    } else  {
        context.fillStyle = '#FFFF00' //yellow - visited areas
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

function check(xLoc, yLoc, Xqueue, Yqueue) {
    //checking empty neighbors
    if (xLoc > 0) {
        if (tiles[xLoc - 1][yLoc].state == 'e') {
            Xqueue.push(xLoc - 1);
            Yqueue.push(yLoc);
            tiles[xLoc - 1][yLoc].state = tiles[xLoc][yLoc].state + 'l'; //going left
        }
    }
    if (xLoc < tileColumnCount - 1) {
        if (tiles[xLoc + 1][yLoc].state == 'e') {
            Xqueue.push(xLoc + 1);
            Yqueue.push(yLoc);
            tiles[xLoc + 1][yLoc].state = tiles[xLoc][yLoc].state + 'r'; //going right
        }
    }
    if (yLoc > 0) {
        if (tiles[xLoc][yLoc - 1].state == 'e') {
            Xqueue.push(xLoc);
            Yqueue.push(yLoc - 1);
            tiles[xLoc][yLoc - 1].state = tiles[xLoc][yLoc].state + 'u'; //going up
        }
    }
    if (yLoc < tileRowCount - 1) {
        if (tiles[xLoc][yLoc + 1].state == 'e') {
            Xqueue.push(xLoc);
            Yqueue.push(yLoc + 1);
            tiles[xLoc][yLoc + 1].state = tiles[xLoc][yLoc].state + 'd'; //going down
        }
    }
}

function solveBFS() {
    var Xqueue = [0];
    var Yqueue = [0];

    var pathFound = false;

    var xLoc;
    var yLoc;

    while (Xqueue.length > 0 && !pathFound) {
        xLoc = Xqueue.shift();
        yLoc = Yqueue.shift();

        //checking for finish on neighbors
        if (xLoc > 0) {
            if (tiles[xLoc - 1][yLoc].state == 'f') {
                pathFound = true;
            }
        }
        if (xLoc < tileColumnCount - 1) {
            if (tiles[xLoc + 1][yLoc].state == 'f') {
                pathFound = true;
            }
        }
        if (yLoc > 0) {
            if (tiles[xLoc][yLoc - 1].state == 'f') {
                pathFound = true;
            }
        }
        if (yLoc < tileRowCount - 1) {
            if (tiles[xLoc][yLoc + 1].state == 'f') {
                pathFound = true;
            }
        }

        //checking empty neighbors
        check(xLoc, yLoc, Xqueue, Yqueue);
    }

    if (!pathFound) {
        output.innerHTML = "No Solution";
    } else {
        output.innerHTML = "Solved";
        var path = tiles[xLoc][yLoc].state;
        var pathLength = path.length;
        var currX = 0;
        var currY = 0;
        for (var i = 0; i < pathLength - 1; i++) {
            if (path.charAt(i+1) == 'u') {
                currY -= 1;
            }
            if (path.charAt(i+1) == 'd') {
                currY += 1;
            }
            if (path.charAt(i+1) == 'r') {
                currX += 1;
            }
            if (path.charAt(i+1) == 'l') {
                currX -= 1;
            }
            tiles[currX][currY].state = 'x';
        }
    }
}

function findBiggestIndex(queue) {
    var biggestIndex = 0;
    for (var i = 0; i < queue.length; i++) {
        if (queue[i][0] + queue[i][1] > queue[biggestIndex][0] + queue[biggestIndex][1]) {
            biggestIndex = i;
        }
    }
    return biggestIndex;
}
function solveA() {
    var queue = [[0, 0]];

    var pathFound = false;

    var xLoc;
    var yLoc;

    while (queue.length > 0 && !pathFound) {
        //xLoc = Xqueue.shift();
        //yLoc = Yqueue.shift();

        var index = findBiggestIndex(queue);
        xLoc = queue[index][0];
        yLoc = queue[index][1];

        queue.splice(index, 1);

        //checking for finish on neighbors
        if (xLoc > 0) {
            if (tiles[xLoc - 1][yLoc].state == 'f') {
                pathFound = true;
            }
        }
        if (xLoc < tileColumnCount - 1) {
            if (tiles[xLoc + 1][yLoc].state == 'f') {
                pathFound = true;
            }
        }
        if (yLoc > 0) {
            if (tiles[xLoc][yLoc - 1].state == 'f') {
                pathFound = true;
            }
        }
        if (yLoc < tileRowCount - 1) {
            if (tiles[xLoc][yLoc + 1].state == 'f') {
                pathFound = true;
            }
        }

        //checking empty neighbors
        if (xLoc > 0) {
            if (tiles[xLoc - 1][yLoc].state == 'e') {
                queue.push([xLoc - 1, yLoc]);
                tiles[xLoc - 1][yLoc].state = tiles[xLoc][yLoc].state + 'l'; //going left
            }
        }
        if (xLoc < tileColumnCount - 1) {
            if (tiles[xLoc + 1][yLoc].state == 'e') {
                queue.push([xLoc + 1, yLoc]);
                tiles[xLoc + 1][yLoc].state = tiles[xLoc][yLoc].state + 'r'; //going right
            }
        }
        if (yLoc > 0) {
            if (tiles[xLoc][yLoc - 1].state == 'e') {
                queue.push([xLoc, yLoc] - 1);
                tiles[xLoc][yLoc - 1].state = tiles[xLoc][yLoc].state + 'u'; //going up
            }
        }
        if (yLoc < tileRowCount - 1) {
            if (tiles[xLoc][yLoc + 1].state == 'e') {
                queue.push([xLoc, yLoc + 1]);
                tiles[xLoc][yLoc + 1].state = tiles[xLoc][yLoc].state + 'd'; //going down
            }
        }
    }

    if (!pathFound) {
        output.innerHTML = "No Solution";
    } else {
        output.innerHTML = "Solved";
        var path = tiles[xLoc][yLoc].state;
        var pathLength = path.length;
        var currX = 0;
        var currY = 0;
        for (var i = 0; i < pathLength - 1; i++) {
            if (path.charAt(i+1) == 'u') {
                currY -= 1;
            }
            if (path.charAt(i+1) == 'd') {
                currY += 1;
            }
            if (path.charAt(i+1) == 'r') {
                currX += 1;
            }
            if (path.charAt(i+1) == 'l') {
                currX -= 1;
            }
            tiles[currX][currY].state = 'x';
        }
    }
}

function reset() {
    for (c = 0; c < tileColumnCount; c++) {
        tiles[c] = [];
        for (r = 0; r < tileRowCount; r++) {
            tiles[c][r] = {x: c*(tileW + 3), y: r*(tileH + 3), state: 'e'}; //state is e for empty
        }
    }
    tiles[0][0].state = 's'; //start
    tiles[tileColumnCount - 1][tileRowCount - 1].state = 'f'; //finish

    output.innerHTML = '';
}

function init() {
    canvas = document.getElementById("myCanvas");
    context = canvas.getContext("2d");
    output = document.getElementById("outcome");
    return setInterval(draw, 10); //run function with timer
}

function myMove(e) {
    x = e.pageX - canvas.offsetLeft;
    y = e.pageY - canvas.offsetTop;

    for (c = 0; c < tileColumnCount; c++) {
        for (r = 0; r < tileRowCount; r++) {
            if (c*(tileW + 3) < x && x < c*(tileW + 3) + tileW && r*(tileH + 3) < y && y < r*(tileH + 3)+tileH) {
                if (tiles[c][r].state == 'e' && (c != boundX) || r != boundY) {
                    tiles[c][r].state = 'w'; //wall
                    boundX = c;
                    boundY = r;
                } else if (tiles[c][r].state == 'w' && (c != boundX) || r != boundY) {
                    tiles[c][r].state = 'e'; //empty
                    boundX = c;
                    boundY = r;
                }
            }
        }
    }

}

function myDown(e) {
    canvas.onmousemove = myMove;

    x = e.pageX - canvas.offsetLeft;
    y = e.pageY - canvas.offsetTop;

    for (c = 0; c < tileColumnCount; c++) {
        for (r = 0; r < tileRowCount; r++) {
            if (c*(tileW + 3) < x && x < c*(tileW + 3) + tileW && r*(tileH + 3) < y && y < r*(tileH + 3)+tileH) {
                if (tiles[c][r].state == 'e') {
                    tiles[c][r].state = 'w'; //wall
                    boundX = c;
                    boundY = r;
                } else if (tiles[c][r].state == 'w') {
                    tiles[c][r].state = 'e'; //empty
                    boundX = c;
                    boundY = r;
                }
            }
        }
    }
}

function myUp() {
    canvas.onmousemove = null;
}

init();
canvas.onmousedown = myDown;
canvas.onmouseup = myUp;
