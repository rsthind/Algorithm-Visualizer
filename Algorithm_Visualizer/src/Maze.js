var canvas;
var context;

function draw() {
    context.fillStyle = '#FF0000' //red
    context.beginPath();
    context.rect(10, 10, 50, 50);
    context.closePath();
    context.fill();
}

function init() {
    canvas = document.getElementById("myCanvas");
    context = canvas.getContext("2d");
    draw();
}

init();
