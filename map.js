var character = new Object();
var address;
var information;
var informationArray;
var xPos = 10;
var yPos = 330;
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var image = document.getElementById("person");
// var mapElem1;
// var mapElem2;
// var mapElem3;
// var mapElem4;
// var mapElem5;
// var mapString;
// var i;
// var j;
// var locationString;
// var map = [
//     ['#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#'],
//     ['#', '_', '_', '_', '_', '_', '_', '_', '_', '_', '#'],
//     ['#', '_', '_', '_', '_', '_', '_', '_', '_', '_', '#'],
//     ['#', '_', '_', '_', '_', '_', '_', '_', '_', '_', '#'],
//     ['#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#']
// ];

function initializeGame() {
	createCharacter();
	createMap();
}

//function that draws the border of the map, currectly just the edge, but could be changed once we make the 
//map randomly generated. I think it's best to store the locations of the walls in a 2d array, then instead of checking if 
//the values of i and j are along the edge of the canvas, check if htey are in the array
function createMap() {
	ctx.drawImage(image,xPos,yPos);
	//ctx.drawImage(image, 50, 330);
	for(var i=0;i<(1400);i+=10){
		for(var j=0;j<700;j+=10){
			if(i==0 || j==0 || i==1390 || j==690){
				ctx.beginPath();
				ctx.rect(i,j,10,10);
				ctx.fillStyle="black";
				ctx.fill();
			}
		}
	}
	
	// locationString = character.locat;
	// i = locationString.split(",")[0];
	// j = locationString.split(",")[1];
	// map[i-1][j-1] = "O";

	// mapElem1 = document.getElementById("mapP1")
	// mapElem2 = document.getElementById("mapP2")
	// mapElem3 = document.getElementById("mapP3")
	// mapElem4 = document.getElementById("mapP4")
	// mapElem5 = document.getElementById("mapP5")
	// for (i = 0; i < map.length; i++) {
	// 	mapString = "";
	// 	for (j = 0; j < map[i].length; j++) {
	// 		mapString += String(map[i][j]);
	// 	} 
	// 	if (i == 0) {
	// 		mapElem1.innerHTML = mapString;
	// 	}
	// 	if (i == 1) {
	// 		mapElem2.innerHTML = mapString;
	// 	}	
	// 	if (i == 2) {
	// 		mapElem3.innerHTML = mapString;
	// 	}	
	// 	if (i == 3) {
	// 		mapElem4.innerHTML = mapString;
	// 	}	
	// 	if (i == 4) {
	// 		mapElem5.innerHTML = mapString;
	// 	}			
	// }
}

//function that checks for arrow key presses
document.onkeydown = checkKey;
function checkKey(e) {

	e = e || window.event;

	if (e.keyCode == '38') {
		// up arrow
		//alert("up pressed");
		move("up");
	}
	else if (e.keyCode == '40') {
		// down arrow
		//alert("down pressed");
		move("down");
	}
	else if (e.keyCode == '37') {
		// left arrow
		//alert("left pressed");
		move("left");
	}
	else if (e.keyCode == '39') {
		// right arrow
		// alert("right pressed");
		move("right");
	}

}

//function that handles arrow key presses
function move(direction){
	// ctx.font = "30px Arial";
	// ctx.fillText("MOVE RIGHT", 10, 50);
	if(direction=="right" && xPos!=1370){
		ctx.clearRect(xPos,yPos,22,44);
		ctx.drawImage(image,xPos+10,yPos);
		xPos+=10;
	}
	else if(direction=="left" && xPos!=10){
		ctx.clearRect(xPos,yPos,22,44);
		ctx.drawImage(image,xPos-10,yPos);
		xPos-=10;
	}
	else if(direction=="down" && yPos!=640){
		ctx.clearRect(xPos,yPos,22,44);
		ctx.drawImage(image,xPos,yPos+10);
		yPos+=10;
	}
	else if(direction=="up" && yPos!=10){
		ctx.clearRect(xPos,yPos,22,44);
		ctx.drawImage(image,xPos,yPos-10);
		yPos-=10;
	}
}

function createCharacter(){
    address = window.location.href;
	information = address.split("?")[1];
	informationArray = String(information).split("&");
	character.locat = "3,6";
	character.boosters = [false, false, false, false, false];
	for (var i = 0; i <informationArray.length; i++) {
		if (informationArray[i].substring(0, 4) == "name") {
			character.name = informationArray[i].substring(5, informationArray[i].length).replace("+", " ");
		}
		if (informationArray[i].substring(0, 5) == "class") {
			character.gameClass = informationArray[i].substring(6, informationArray[i].length).replace("+", " ");
		}
		if (informationArray[i].substring(0, 3) == "EHB") {
			character.boosters[0] = true;
		}
		if (informationArray[i].substring(0, 3) == "EDB") {
			character.boosters[1] = true;
		}
		if (informationArray[i].substring(0, 3) == "CHD") {
			character.boosters[2] = true;
		}
		if (informationArray[i].substring(0, 3) == "CDD") {
			character.boosters[3] = true;
		}
		if (informationArray[i].substring(0, 3) == "MMB") {
			character.boosters[4] = true;
		}
	}
	
	if (character.gameClass == "warrior") {
		character.health = 100;
		character.mana = 0;
		character.weapon = "Sword";
	}
	if (character.gameClass == "ranger") {
		character.health = 75;
		character.mana = 15;
		character.weapon = "Long Bow";
	}
	if (character.gameClass == "mage") {
		character.health = 50;
		character.mana = 50;
		character.weapon = "Staff";
	}
}

function attack() {
alert("attack");
}