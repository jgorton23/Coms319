var livingEntities = [];
var character = new Object();
var address;
var information;
var informationArray;
var paused = false; // for the enemies to move i use a timer that can be paused, and this variable is so i can also stop the users movements
var level = 1; //the level(room) that the player is on currently
var startxPos = 670;
var startyPos = 360;
var spawnSide = "";
var xPos = 10; //the X coordinate of the character
var yPos = 330; //the Y coordinate of the character
character.position=[xPos,yPos];//for more continutity of entites
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
	pause();
	checkIfRoomClear();
}


function loadNewRoom() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	createMap();
	spawnEnemies();
	initializeInventory();
	pause();
	checkIfRoomClear();
}


//function is unnecessar unless we create a map more complicated than one big room
//the only thing it does rn is spawn the character
function createMap() {
	ctx.drawImage(person,startxPos,startyPos,20,40);
	xPos = startxPos;
	yPos = startyPos;
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
		checkIfRoomClear();
	}
}

//function to use a potion of 2 different types
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
	if (livingEntities.length == 1)	{
		//top door
		//630 - 750
		//10
		if ((xPos >= 630  && xPos <= 750) && yPos == 10) {
			loadNewRoom();
			spawnSide = "top";
		}
		//left door
		//10
		//310 - 430
		else if ((yPos >= 310  && yPos <= 430) && xPos == 10) {
			loadNewRoom();
			spawnSide = "left";
		}
		//right door
		//1370
		//310 - 430
		else if ((yPos >= 310  && yPos <= 430) && xPos == 1370) {
			loadNewRoom();
			spawnSide = "right";
		}
		//bottom door
		//630 - 750
		//650
		else if ((xPos >= 630  && xPos <= 750) && yPos == 650) {
			loadNewRoom();
			spawnSide = "bottom";
		}
		updateStartPos();
	}
	
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
	character.position=[xPos,yPos]
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
	if(direction=="right" && (xPos==1380 || enemyAdjacent("right")!=null)) {
		return false;
	}else if(direction == "left" && (xPos==0 || enemyAdjacent("left")!=null)) {
		return false;
	}else if(direction == "down" && (yPos==660 || enemyAdjacent("down")!=null)) {
		return false;
	}else if(direction =="up" && (yPos==0 || enemyAdjacent("up")!=null)) {
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
						return livingEntities[i];
					}
				}
			}else if(direction=="left"){
				if(livingEntities[i].position[0]==xPos-20){
					if(livingEntities[i].position[1]<yPos+40 && livingEntities[i].position[1]>yPos-40){
						return livingEntities[i];
					}
				}
			}else if(direction=="up"){
				if(livingEntities[i].position[0]<xPos+20 && livingEntities[i].position[0]>xPos-20){
					if(livingEntities[i].position[1]==yPos-40){
						return livingEntities[i];
					}
				}
			}else if(direction=="down"){
				if(livingEntities[i].position[0]<xPos+20 && livingEntities[i].position[0]>xPos-20){
					if(livingEntities[i].position[1]==yPos+40){
						return livingEntities[i];
					}
				}
			}
		}
	}
	return null;
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

//function to add an entity to the array
function addToLivingEntities(entity) {
	livingEntities.push(entity);
}

function checkIfRoomClear() {
	if (livingEntities.length == 1) {
		createDoors();
	}
}

//function to remove an entity from the array
function removeLivingEntity(entity){
	var temp = [];
	ctx.clearRect(entity.position[0],entity.position[1],20,40);
	var x = livingEntities.length;
	for(var i = 0;i < x; i++){
		temp.push(livingEntities.shift());
		if(temp[temp.length-1]==entity){
			temp.pop();
		}
	}
	livingEntities=temp;
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

function addPoints() {

}

//function spawns enemies in the map
function spawnEnemies(){
	var numEnemies=6+(level/2);
	for(var i = 1; i < numEnemies; i++){
		//create enemies and give them stats
		var enemy = new Object();
		enemy.id=i;
		enemy.position=getRandomPosition();
		enemy.strength=level;
		enemy.health=10;
		enemy.type="closeRange";
		//add them to the array of living entites
		addToLivingEntities(enemy);
		//draw person with red rectangle to symbolize bad guy
		ctx.drawImage(person,enemy.position[0],enemy.position[1],20,40);
		ctx.beginPath();
		ctx.lineWidth = "1";
		ctx.strokeStyle = "red";
		ctx.rect(enemy.position[0]+2, enemy.position[1]+2, 16, 36);
		ctx.stroke();
	}
}

//function to ensure no enemies overlap on spawn with eachother or with character
function getRandomPosition(){
	var x = Math.floor(Math.random() * 135);
	var y = Math.floor(Math.random() * 65);
	for(var i = 0; i < livingEntities.length;i++){
		if(livingEntities[i].position[0]/10>x-2 && livingEntities[i].position[0]/10<x+2){
			if(livingEntities[i].position[1]/10>y-4 && livingEntities[i].position[1]/10<y+4){
				return getRandomPosition();
			}		
		}
	}
	return [x*10,y*10];
}

//function attacks an enemy standing directly next to player, will add functionality for archer later
function attack() {
	if(facing=="up"){
		var enemy=enemyAdjacent("up");
		enemy.health-=10;
		if(enemy.health==0){
			removeLivingEntity(enemy);
		}
	}else if(facing=="right"){
		var enemy=enemyAdjacent("right");
		enemy.health-=10;
		if(enemy.health==0){
			removeLivingEntity(enemy);
		}
	}else if(facing=="left"){
		var enemy=enemyAdjacent("left");
		enemy.health-=10;
		if(enemy.health==0){
			removeLivingEntity(enemy);
		}
	}else if (facing=="down"){
		var enemy=enemyAdjacent("down");
		enemy.health-=10;
		if(enemy.health==0){
			removeLivingEntity(enemy);
		}
	}	
}

<<<<<<< HEAD
function createDoors() {
	//top door
	ctx.beginPath();
	ctx.rect(650,0,100,10);
	ctx.fillStyle="brown";
	ctx.fill();
	//left door
	ctx.beginPath();
	ctx.rect(0,340,10,100);
	ctx.fillStyle="brown";
	ctx.fill();
	//right door
	ctx.beginPath();
	ctx.rect(1390,340,10,100);
	ctx.fillStyle="brown";
	ctx.fill();
	//bottom door
	ctx.beginPath();
	ctx.rect(650,690,100,10);
	ctx.fillStyle="brown";
	ctx.fill();
}

function updateStartPos() {
	if (spawnSide == "top"){
		startxPos = 650;
		startyPos = 0;
	}
	else if (spawnSide == "left") {
		startxPos = 0;
		startyPos = 340;
	}
	else if (spawnSide == "right") {
		startxPos = 1390;
		startyPos = 340;
	}
	else if (spawnSide == "bottom") {
		startxPos = 650;
		startyPos = 690;
	}
}

=======
//function that pauses and starts a timer that controls the enemies' moves
>>>>>>> 989a8c25b63e333372c259c06c34913e3ce94c96
function pause(){
	if(document.getElementById("timer").value=="Resume"){
		document.getElementById("timer").value="Pause";
		var q=100;//just to test the timer, can be removed anytime, or kept
		timer=setInterval(function updateGame(){
			document.getElementById("here").innerHTML=q--; //also just to test timer
			for(var i = 0; i < livingEntities.length; i++){
				if(livingEntities[i]==enemyAdjacent("right") || livingEntities[i]==enemyAdjacent("left") || livingEntities[i]==enemyAdjacent("up") || livingEntities[i]==enemyAdjacent("down")){
					enemyAttack();
				}
				else{
					enemyMove();
				}
			}
		},1000);
	}else{
		document.getElementById("timer").value="Resume";
		clearInterval(timer);
	}
}

function enemyAttack(){
	character.health -= character.health/10;
	document.getElementById("healthBar").setAttribute("value",100*(character.health/character.maxHealth));
}

function enemyMove(){

}