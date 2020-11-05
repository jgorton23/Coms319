var livingEntities = [];
var character = new Object();
var address;
var information;
var informationArray;
var level = 1; //the level(room) that the player is on currently
var xPos = 10; //the X coordinate of the character
var yPos = 330; //the Y coordinate of the character
var facing = "right"; //direction player last moved, used for directing
var canvas = document.getElementById("myCanvas"); //the canvas that is the map
var ctx = canvas.getContext("2d"); //canvas editor
var inventory = []; //the inventory array of the character
var inventoryContainer = document.getElementById("inventoryContent");
const person = new Image(); // the image of the player
person.src='./Stick_Person.png';
const numAlgiz = 5;
const numMannaz = 5;
const numDagaz = 5;
const inventoryMap = [];
const heightPixels = 700;
const widthPixels = 1400;
const stepPixels = 10;
const numOfRows = heightPixels/stepPixels;
const numOfColumns = widthPixels/stepPixels;

function initializeGame() {
	addToLivingEntities(character);
	createCharacter();
	createMap();
	spawnEnemies();
	initializeInventory();
}

//function is unnecessar unless we create a map more complicated than one big room
//the only thing it does rn is spawn the character
function createMap() {
	ctx.drawImage(person,xPos,yPos,20,40);
	//ctx.drawImage(image, 50, 330);
	// for(var i=0; i<(widthPixels); i+=stepPixels){
	// 	for(var j=0; j<heightPixels; j+=stepPixels){
	// 		if(i==0 || j==0 || i==widthPixels-stepPixels || j==heightPixels-stepPixels){
	// 			ctx.beginPath();
	// 			ctx.rect(i,j,stepPixels,stepPixels);
	// 			ctx.fillStyle="black";
	// 			ctx.fill();
	// 		}
	// 	}
	// }
}

//function that checks for arrow key presses
document.onkeydown = checkKey;
function checkKey(e) {

	e = e || window.event;

	if (e.keyCode == '38') {// up arrow
		move("up");
	}else if (e.keyCode == '40') {// down arrow
		move("down");
	}else if (e.keyCode == '37') {// left arrow
		move("left");
	}else if (e.keyCode == '39') {// right arrow
		move("right");
	}else if (e.keyCode == '66') {// B key
		useRune();
	}else if (e.keyCode == '77') {// m key
		usePotion("health");
	}else if (e.keyCode == '78') {// n key
		usePotion("mana");
	}else if (e.keyCode == '32') {// space bar
		attack();
	}
}

function usePotion(type){
	if(type=="health" && character.healthPotions!=0){
		character.healthPotions--;
		character.health = character.maxHealth;
		document.getElementById("healthBar").setAttribute("value",100);
	}
	else if(type=="mana" && character.manaPotions!=0){
		character.manaPotions--;
		character.mana = character.maxMana;
		document.getElementById("manaBar").setAttribute("value",100);
	}
}

//function that handles arrow key presses
function move(direction){
	facing=direction;
	// alert(clearPath("down"));
	if(direction=="right" && clearPath(direction)){ //&& xPos!=1370
		ctx.clearRect(xPos,yPos,20,40);
		//ctx.clearRect(xPos-10,yPos-10,42,70);
		ctx.drawImage(person,xPos+stepPixels,yPos,20,40);
		xPos+=stepPixels;
	}
	else if(direction=="left" && clearPath(direction)){ //&& xPos!=stepPixels 
		ctx.clearRect(xPos,yPos,20,40); 
		//ctx.clearRect(xPos-10,yPos-10,42,70);
		ctx.drawImage(person,xPos-stepPixels,yPos,20,40);
		xPos-=stepPixels;
	}
	else if(direction=="down" && clearPath(direction)){ //&& yPos!=640
		ctx.clearRect(xPos,yPos,20,40);
		//ctx.clearRect(xPos-10,yPos-10,42,70);
		ctx.drawImage(person,xPos,yPos+stepPixels,20,40);
		yPos+=stepPixels;
	}
	else if(direction=="up" && clearPath(direction)){ //&& yPos!=stepPixels
		ctx.clearRect(xPos,yPos,20,40); // exactly person sized
		//ctx.clearRect(xPos-10,yPos-10,42,70); //bigger rectangle to erase attack
		ctx.drawImage(person,xPos,yPos-stepPixels,20,40);
		yPos-=stepPixels;
	}
	if((xPos+yPos)%500===0) {
		let randN = Math.floor(Math.random() * 3);
		if (randN == 0) {
			/*
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
			*/
		}
		else if (randN == 1) {
			character.healthPotions++;
		}
		else {
			character.manaPotions++;
		}
	}
	let row = yPos/stepPixels;
	let col = xPos/stepPixels;
	console.log(yPos, row, xPos, col);
	if(character.currentRune === "") {
		if (inventoryMap[row][col] === 101) {
			inventoryMap[row][col] = 0;
			character.currentRune = "Algiz rune";   //This will damage everything in the room
		} else if (inventoryMap[row][col] === 102) {
			inventoryMap[row][col] = 0;
			character.currentRune = "Mannaz rune";  //This will double the amount of gold the character is holding
		} else if (inventoryMap[row][col] === 103) {
			inventoryMap[row][col] = 0;
			character.currentRune = "Dagaz rune";   //This will full heal the characters health and mana
		}
	} else {
		if (inventoryMap[row][col] === 101 && window.confirm("Change Rune?")) {
			inventoryMap[row][col] = 0;
			character.currentRune = "Algiz rune";   //This will damage everything in the room
			console.log(character.currentRune)
		} else if (inventoryMap[row][col] === 102 && window.confirm("Change Rune?")) {
			inventoryMap[row][col] = 0;
			character.currentRune = "Mannaz rune";  //This will double the amount of gold the character is holding
		} else if (inventoryMap[row][col] === 103 && window.confirm("Change Rune?")) {
			inventoryMap[row][col] = 0;
			character.currentRune = "Dagaz rune";   //This will full heal the characters health and mana
		}
	}
	drawInventoryMap();
}

//a function that verifies a players ability to move
function clearPath(direction){
	if(direction=="right" && (xPos==1380 || enemyAdjacent("right"))) {
		return false;
	}else if(direction == "left" && (xPos==0 || enemyAdjacent("left"))) {
		return false;
	}else if(direction == "down" && (yPos==660 || enemyAdjacent("down"))) {
		return false;
	}else if(direction =="up" && (yPos==0 || enemyAdjacent("up"))) {
		return false;
	}
	return true;
}

//function that tells if an enemy is adjacent, useful for verifying ability to move, and attack
function enemyAdjacent(direction){
	for(var i = 0; i < livingEntities.length; i++){
		if(livingEntities[i].id!=null){
			if(direction=="right"){
				if(livingEntities[i].position[0]==xPos+20){
					if(livingEntities[i].position[1]<yPos+40 && livingEntities[i].position[1]>yPos-40){
						return true;
					}
				}
			}else if(direction=="left"){
				if(livingEntities[i].position[0]==xPos-20){
					if(livingEntities[i].position[1]<yPos+40 && livingEntities[i].position[1]>yPos-40){
						return true;
					}
				}
			}else if(direction=="up"){
				if(livingEntities[i].position[0]<xPos+20 && livingEntities[i].position[0]>xPos-20){
					if(livingEntities[i].position[1]==yPos-40){
						return true;
					}
				}
			}else if(direction=="down"){
				if(livingEntities[i].position[0]<xPos+20 && livingEntities[i].position[0]>xPos-20){
					if(livingEntities[i].position[1]==yPos+40){
						return true;
					}
				}
			}
		}
	}
	return false;
}

function drawInventoryMap() {
	for (let row = 0; row < numOfRows; row++) {
		inventoryMap.push([]);
		for (let col = 0; col < numOfColumns; col++) {
			if (inventoryMap[row][col] === 101) {
				ctx.beginPath();
				ctx.rect(col*stepPixels,row*stepPixels,stepPixels,stepPixels);
				ctx.fillStyle="blue";
				ctx.fill();
			}
			if (inventoryMap[row][col] === 102) {
				ctx.beginPath();
				ctx.rect(col*stepPixels,row*stepPixels,stepPixels,stepPixels);
				ctx.fillStyle="orange";
				ctx.fill();
			}
			if (inventoryMap[row][col] === 103) {
				ctx.beginPath();
				ctx.rect(col*stepPixels,row*stepPixels,stepPixels,stepPixels);
				ctx.fillStyle="pink";
				ctx.fill();
			}
		}
	}
}

function addToInventory(item) {
	inventory.push(item);
	inventoryContainer.innerText=inventory.toString();
}

function addToLivingEntities(entity) {
	livingEntities.push(entity);
}

function useRune() {
	if (character.currentRune == "Algiz rune") { //This will damage everything in the room
		for (let ind = 0; ind < livingEntities.length; ind++) {
			livingEntities[ind].health -= 10;
		}
	}
	else if (character.currentRune == "Mannaz rune") { //This will double the amount of gold the character is holding
		character.gold *= 2;
	}
	else if (character.currentRune == "Dagaz rune") { //This will full heal the characters health and mana
		character.health = character.maxHealth;
		character.mana = character.maxMana;
	}
	character.currentRune = "";
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
	character.healthPotions = 1;
	character.manaPotions = 1;
	
	if (character.boosters[2]) {
		character.maxHealth = character.maxHealth*(.9);
		character.health = character.health*(.9);
	}
	character.gold = 10;
	character.currentRune = "";
}

function initializeInventory() {
	for (let row = 0; row < numOfRows; row++) {
		inventoryMap.push([]);
		for (let col = 0; col < numOfColumns; col++) {
			inventoryMap[row].push(0);
		}
	}
	for (let i = 0; i < numAlgiz; i++) {
		let row = Math.floor(Math.random() * numOfRows);
		let col = Math.floor(Math.random() * numOfColumns);
		console.log(row, col, "101");
		inventoryMap[row][col] = 101;
	}
	for (let i = 0; i < numMannaz; i++) {
		let row = Math.floor(Math.random() * numOfRows);
		let col = Math.floor(Math.random() * numOfColumns);
		console.log(row, col, "102");
		inventoryMap[row][col] = 102;
	}
	for (let i = 0; i < numDagaz; i++) {
		let row = Math.floor(Math.random() * numOfRows);
		let col = Math.floor(Math.random() * numOfColumns);
		console.log(row, col, "103");
		inventoryMap[row][col] = 103;
	}
	drawInventoryMap();
}

function spawnEnemies(){
	//alert("spawn called");
	var numEnemies=3+(level/2);
	for(var i = 1; i < numEnemies; i++){
		var enemy = new Object();
		var x = Math.floor(Math.random() * 135);
		var y = Math.floor(Math.random() * 65);
		enemy.id=i;
		enemy.position=[10*x,10*y];
		enemy.strength=level;
		enemy.health=100;
		enemy.type="closeRange";
		addToLivingEntities(enemy);
		ctx.drawImage(person,enemy.position[0],enemy.position[1],20,40);
		// Red rectangle
		ctx.beginPath();
		ctx.lineWidth = "1";
		ctx.strokeStyle = "red";
		ctx.rect(enemy.position[0]+2, enemy.position[1]+2, 16, 36);
		ctx.stroke();
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
	if(facing=="up"){
		ctx.rect(xPos+6,yPos-10,stepPixels,stepPixels);
	}else if(facing=="right"){
		ctx.rect(xPos+22,yPos+25,stepPixels,stepPixels);
	}else if(facing=="left"){
		ctx.rect(xPos-10,yPos+25,stepPixels,stepPixels);
	}else if (facing=="down"){
		ctx.rect(xPos+6,yPos+50,stepPixels,stepPixels);
	}	
	ctx.fillStyle="red";
	ctx.fill();
}