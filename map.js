var character = new Object();
var address;
var information;
var informationArray;
var xPos = 10;
var yPos = 330;
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var image = document.getElementById("person");
var inventory = [];
var inventoryContainer = document.getElementById("inventoryContent");

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
	if((xPos+yPos)%500===0) {
		let randN = Math.floor(Math.random() * 3);
		if (randN == 0) {
			let randN = Math.floor(Math.random() * 3);
			if (randN == 0) {
				addToInventory("Algiz rune");   //This will damage everything in the room
			}
			else if (randN == 1) {
				addToInventory("Mannaz rune");  //This will double the amount of gold the character can hold
			}
			else {
				addToInventory("Dagaz rune");   //This will full heal the characters health and mana
			}  
		}
		else if (randN == 1) {
			character.healthPotions++;  
		}
		else {
			character.manaPotions++;   
		}
	}
}

function addToInventory(item) {
	inventory.push(item);
	inventoryContainer.innerText=inventory.toString();
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
		character.maxHealth = 100;
		character.health = 100;
		character.maxMana = 0;
		character.mana = 0;
		character.weapon = "Sword";
	}
	if (character.gameClass == "ranger") {
		character.maxHealth = 75;
		character.health = 75;
		character.maxMana = 15;
		character.mana = 15;
		character.weapon = "Long Bow";
	}
	if (character.gameClass == "mage") {
		character.maxHealth = 50;
		character.health = 50;
		character.maxMana = 50;
		character.mana = 50;
		character.weapon = "Staff";
	}
	character.healthPotions = 0;
	character.manaPotions = 0;
	
	if (character.boosters[2]) {
		character.maxHealth = character.maxHealth*(.9);
		character.health = character.health*(.9);
	}
}

function attack() {
	// const location = character.locat;
	// let x = parseInt(location.split(",")[0]) - 1;
	// let y = parseInt(location.split(",")[1]) - 1;
	// if(map[x-1][y] === "X"
	// 	|| map[x][y-1] === "X"
	// 	|| map[x][y+1] === "X"
	// 	|| map[x+1][y] === "X"){
	// 	alert("attack");
	// } else {
	// 	alert("no enemies near");
	// }
	ctx.beginPath();
	ctx.rect(xPos+22,yPos+25,10,10);
	ctx.fillStyle="red";
	ctx.fill();
}