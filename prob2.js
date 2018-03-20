/* Canvas Setting */
var c = document.getElementById("board");
var ctx = c.getContext("2d");
var width = 600;
var height = 600;
var blank = 100;

/* Ladder Value */
var numPerson;
var ladderHandleArray;

function init(){

    do {
        numPerson = parseInt(prompt("Please enter Number of Person (2 ~ 12)", 6));
    } while(isNaN(numPerson) || numPerson > 12 || numPerson < 2);

    ladderHandleArray = new Array(numPerson);
    for (i = 0; i < numPerson; i++) {
        ladderHandleArray[i] = new Array(numPerson);
        for (j = 0; j < numPerson; j++) {
            ladderHandleArray[i][j] = 
                new LadderHandle(blank + i * (width - blank * 2) / (numPerson - 1),
                        blank + j * (width - blank * 2) / (numPerson - 1))
        }
    }

	c.addEventListener("mousedown", mouseDownListener, false);
}

// Canvas Loop
function updateBoard(){
	// board fill color
	ctx.fillStyle = "#ffcc66";
	ctx.fillRect(0, 0, width, height);

    ctx.lineWidth = 1;
    // Draw Line
	ctx.strokeStyle = "#333300";
    ctx.fillStyle = "#333300";
    
	for (i = 0; i < numPerson; i++) { 
        var xPos = blank + i * (width - blank * 2) / (numPerson - 1);
		ctx.beginPath();
		ctx.moveTo(xPos, blank);
		ctx.lineTo(xPos, height - blank);
		ctx.stroke();
	}

    // Draw Handle
	for (i = 0; i < numPerson; i++) {
        for (j = 0; j < numPerson; j++) {
            ctx.beginPath();
            ctx.strokeStyle = "#FFFFFF";

            var handle = ladderHandleArray[i][j]
            ctx.fillStyle = handle.color;
    
            ctx.arc(handle.xPos,
                    handle.yPos,
                    ladderHandleSize,
                    0, 2*Math.PI);
            ctx.fill();
            ctx.stroke();
        }
    }

    // Draw Handle
	for (i = 0; i < numPerson; i++) {
        for (j = 0; j < numPerson; j++) {
            ctx.lineWidth = 2;
            

            var handle = ladderHandleArray[i][j]
            if (!handle.match) continue;
            ctx.strokeStyle = handle.color;
            
            ctx.beginPath();
            ctx.moveTo(handle.xPos, handle.yPos);
            ctx.lineTo(ladderHandleArray[handle.pair[0]][handle.pair[1]].xPos, 
                       ladderHandleArray[handle.pair[0]][handle.pair[1]].yPos);
            ctx.stroke();
        }
    }

    ctx.font = "30px Comic Sans MS";
    ctx.lineWidth = 3;
    ctx.strokeStyle = "black";
    ctx.fillStyle = "white";

    // Draw Upper Number
	for (i = 0; i < numPerson; i++) { 
        var xPos = blank + i * (width - blank * 2) / (numPerson - 1);
        ctx.strokeText((i + 1).toString(), xPos - 10, 70);
        ctx.fillText((i + 1).toString(), xPos - 10, 70);
    }

    ctx.strokeStyle = "red";
    // Draw Down Number
    for (i = 0; i < numPerson; i++) { 
        var xPos = blank + i * (width - blank * 2) / (numPerson - 1);
        ctx.strokeText((i + 1).toString(), xPos - 10, 550);
        ctx.fillText((i + 1).toString(), xPos - 10, 550);
    }

    // Draw dragging line
	if (dragging == true)
	{
        ctx.lineWidth = 2;
        ctx.strokeStyle = "white";
        
		ctx.beginPath();
		ctx.moveTo(ladderHandleArray[dragX][dragY].xPos, ladderHandleArray[dragX][dragY].yPos);
		ctx.lineTo(mouseX, mouseY);
		ctx.stroke();

	}

	setTimeout(updateBoard, 20);
}

/* Drag and Drop */
var dragging = false;
var dragX;
var dragY;
var mouseX;
var mouseY;

function mouseDownListener(evt) {
    var canvasBlank = c.getBoundingClientRect();
    mouseX = (evt.clientX - canvasBlank.left) * (c.width / canvasBlank.width);
    mouseY = (evt.clientY - canvasBlank.top) * (c.height / canvasBlank.height);
    
    var i;

	for (i = 0; i < numPerson; i++) {
        for (j = 0; j < numPerson; j++) {
            if (ladderHandleArray[i][j].HitTest(mouseX, mouseY)) {
                dragging = true;
                dragX = i;
                dragY = j;

                var handle = ladderHandleArray[i][j];

                if (handle.match == true) {
                    ladderHandleArray[handle.pair[0]][handle.pair[1]].match = false;
                    ladderHandleArray[handle.pair[0]][handle.pair[1]].color = "#FFFFFF";
                    handle.match = false;
                    handle.color = "#FFFFFF";
                }

                i = numPerson;
                j = numPerson;
            }
        }
    }

    if (dragging) {
        window.addEventListener("mousemove", mouseMoveListener, false);
        window.addEventListener("mouseup", mouseUpListener, false);
    }
}

function mouseMoveListener(evt) {
    var canvasBlank = c.getBoundingClientRect();
    mouseX = (evt.clientX - canvasBlank.left) * (c.width / canvasBlank.width);
    mouseY = (evt.clientY - canvasBlank.top) * (c.height / canvasBlank.height);
}

function mouseUpListener(evt) {
    window.removeEventListener("mousemove", mouseMoveListener, false);
    window.removeEventListener("mouseup", mouseUpListener, false);
    dragging = false;

    var canvasBlank = c.getBoundingClientRect();
    mouseX = (evt.clientX - canvasBlank.left) * (c.width / canvasBlank.width);
    mouseY = (evt.clientY - canvasBlank.top) * (c.height / canvasBlank.height);
    
    var i;

	for (i = 0; i < numPerson; i++) {
        for (j = 0; j < numPerson; j++) {
            if (ladderHandleArray[i][j].HitTest(mouseX, mouseY)) {
                if (dragX != i) {
                    // console.log(dragX + "," + dragY + "," + i + "," + j + ",");

                    var handle = ladderHandleArray[i][j];

                    if (handle.match == true) {
                        var handle2 = ladderHandleArray[handle.pair[0]][handle.pair[1]];
                        if (handle2.match) {
                            if (ladderHandleArray[handle2.pair[0]][handle2.pair[1]].match) {
                                ladderHandleArray[handle2.pair[0]][handle2.pair[1]].match = false;
                                ladderHandleArray[handle2.pair[0]][handle2.pair[1]].color = "#FFFFFF";
                            }
                            handle2.match = false;
                            handle2.color = "#FFFFFF";
                        }
                        
                        
                    }
                    var color = getRandomColor();

                    handle.pair = [dragX, dragY];
                    handle.match = true;
                    handle.color = color

                    ladderHandleArray[dragX][dragY].pair = [i, j];
                    ladderHandleArray[dragX][dragY].match = true;
                    ladderHandleArray[dragX][dragY].color = color;

                    i = numPerson;
                    j = numPerson;

                    findAll();
                }
            }
        }
    }
}

// ladder
var ladderHandleSize = 10;
function LadderHandle(_xPos, _yPos) {
	this.xPos = _xPos;
    this.yPos = _yPos;
    this.color = "#FFFFFF"
    
    this.match = false;
    this.pair = [0, 0];
}

LadderHandle.prototype.HitTest = function(cx, cy) {
    return ((cx > this.xPos - ladderHandleSize) && (cx < this.xPos + ladderHandleSize)
        && (cy > this.yPos - ladderHandleSize) && (cy < this.yPos + ladderHandleSize));
}

// Utils

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

// Find Where
function findLocation(xPos, yPos) {

    if (yPos == numPerson) return xPos;
    var ladder = ladderHandleArray[xPos][yPos];

    if (!ladder.match) {
        return findLocation(xPos, yPos + 1);
    } else {
        // console.log(xPos + " + " + yPos + " + " + ladder.pair[0] + " + " + ladder.pair[1]);
        return findLocation(ladder.pair[0], ladder.pair[1] + 1);
    }
}

function findAll() {
    for (i = 0; i < numPerson; i++) {
        console.log((i + 1) + " --> " + (findLocation(i, 0) + 1) + " ;");
    }    
}


init();
updateBoard();
findAll();
