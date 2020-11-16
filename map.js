var livingEntities = [];
var character = new Object();
var address;
var information;
var informationArray;
var paused = false; // for the enemies to move i use a timer that can be paused, and this variable is so i can also stop the users movements
var floor = 1;
var stairsActive = false;
var level = 1; //the level(room) that the player is on currently
var levelContainer = document.getElementById("levelContent");
var startxPos = 670;
var startyPos = 360;
var spawnSide = "";
var xPos; //the X coordinate of the character
var yPos; //the Y coordinate of the character
character.position=[xPos,yPos];//for more continutity of entites
var facing = "right"; //direction player last moved, used for directing
var canvas = document.getElementById("myCanvas"); //the canvas that is the map
var ctx = canvas.getContext("2d"); //canvas editor
var inventory = {}; //the inventory array of the character
var goldContainer = document.getElementById("goldContent");
var coalContainer = document.getElementById("coalContent");
var points = 0;
var pointsContainer = document.getElementById("pointsContent");
var inventoryMap = [];
const person = new Image(); // the image of the player
person.src='./Stick_Person.png';
const coin = new Image();
coin.src='./coin.png';
const redPotion= new Image();
redPotion.src='./red_potion.png';
const bluePotion= new Image();
bluePotion.src='./blue_potion.png';
const greenPotion = new Image();
greenPotion.src='./green_potion.png';
const coal = new Image();
coal.src='./coal.png';
const numAlgiz = 5;
const numMannaz = 5;
const numDagaz = 5;
const numGoldCoins = 5;
const numCoal = 5;
const heightPixels = 700;
const widthPixels = 1400;
const stepPixels = 10;
const numOfRows = heightPixels/stepPixels;
const numOfColumns = widthPixels/stepPixels;
var curSpell;

function initializeGame() {
	addToLivingEntities(character);
	createCharacter();
	createMap();
	spawnEnemies();
	initializeInventory();
	pause();
	chooseSpell();
	checkIfRoomClear();
}


function loadNewRoom() {
	level++;
	drawLevel();
	inventoryMap = [];
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	createMap();
	spawnEnemies();
	initializeInventory();
	chooseSpell();
	//pause();
	checkIfRoomClear();
}


//function is unnecessary unless we create a map more complicated than one big room
//the only thing it does rn is spawn the character
function createMap() {
	// ctx.beginPath();
	// ctx.rect(startxPos,startyPos,20,40);
	// ctx.fillStyle="white";
	// ctx.fill();
	// ctx.drawImage(person,startxPos,startyPos,20,40);
	drawPlayer(startxPos,startyPos);
	xPos = startxPos;
	yPos = startyPos;
}

function drawPlayer(x,y){
	ctx.beginPath();
	ctx.rect(x,y,20,40);
	ctx.fillStyle="white";
	ctx.fill();
	ctx.drawImage(person,x,y,20,40);
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
	}else if(e.keyCode == '83'){ // s key
		castSpell();
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
		updateStartPos(spawnSide);
	}
	
	if (stairsActive) {
		//left
		//1280
		//0 - 90
		if ((yPos >= 0  && yPos <= 90) && xPos == 1280) {
			loadNewRoom();
			spawnSide = "top";
			floor++;
			stairsActive = false;
		}
		//bottom
		//1290 - 1380
		//100
		else if ((xPos >= 1290  && xPos <= 1380) && yPos == 100) {
			loadNewRoom();
			spawnSide = "left";
			floor++;
			stairsActive = false;
		}
	}
	
	facing=direction;
	// alert(clearPath("down"));
	if(!paused){
		if(direction=="right" && clearPath(character, direction)){ //&& xPos!=1370
			ctx.clearRect(xPos,yPos,20,40);
			//ctx.drawImage(person,xPos+stepPixels,yPos,20,40);
			drawPlayer(xPos+stepPixels,yPos);
			xPos+=stepPixels;
		}
		else if(direction=="left" && clearPath(character, direction)){ //&& xPos!=stepPixels 
			ctx.clearRect(xPos,yPos,20,40); 
			//ctx.drawImage(person,xPos-stepPixels,yPos,20,40);
			drawPlayer(xPos-stepPixels,yPos);
			xPos-=stepPixels;
		}
		else if(direction=="down" && clearPath(character, direction)){ //&& yPos!=640
			ctx.clearRect(xPos,yPos,20,40);
			//ctx.drawImage(person,xPos,yPos+stepPixels,20,40);
			drawPlayer(xPos,yPos+stepPixels);
			yPos+=stepPixels;
		}
		else if(direction=="up" && clearPath(character, direction)){ //&& yPos!=stepPixels
			ctx.clearRect(xPos,yPos,20,40); // exactly person sized
			//ctx.drawImage(person,xPos,yPos-stepPixels,20,40);
			drawPlayer(xPos,yPos-stepPixels);
			yPos-=stepPixels;
		}
		//drawHealthBar(enemyAdjacent("up"));
		character.position=[xPos,yPos]
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
	collectObjects();
	drawInventoryMap();
}

function collectObjects() {
	let row = yPos / stepPixels;
	let col = xPos / stepPixels;
	console.log(yPos, row, xPos, col);
	if (inventoryMap[row][col] === 104) {
		inventoryMap[row][col] = 0;
		addToInventory("Gold");
		addPoints(100);
	}
	if (inventoryMap[row][col] === 105) {
		inventoryMap[row][col] = 0;
		addToInventory("Coal");
		addPoints(50);
	}
	if (character.currentRune === "") {
		if (inventoryMap[row][col] === 101) {
			inventoryMap[row][col] = 0;
			character.currentRune = "Algiz rune";   //This will damage everything in the room
			addPoints(200);
		} else if (inventoryMap[row][col] === 102) {
			inventoryMap[row][col] = 0;
			character.currentRune = "Mannaz rune";  //This will double the amount of gold the character is holding
			inventory["Gold"] *= 2;
			drawInventory();
			addPoints(200);
		} else if (inventoryMap[row][col] === 103) {
			inventoryMap[row][col] = 0;
			character.currentRune = "Dagaz rune";   //This will full heal the characters health and mana
			addPoints(200);
		}
	} else {
		if (inventoryMap[row][col] === 101 && window.confirm("Change Rune?")) {
			inventoryMap[row][col] = 0;
			character.currentRune = "Algiz rune";   //This will damage everything in the room
			console.log(character.currentRune);
			addPoints(200);
		} else if (inventoryMap[row][col] === 102 && window.confirm("Change Rune?")) {
			inventoryMap[row][col] = 0;
			character.currentRune = "Mannaz rune";  //This will double the amount of gold the character is holding
			inventory["Gold"] *= 2;
			drawInventory();
			addPoints(200);
		} else if (inventoryMap[row][col] === 103 && window.confirm("Change Rune?")) {
			inventoryMap[row][col] = 0;
			character.currentRune = "Dagaz rune";   //This will full heal the characters health and mana
			addPoints(200);
		}
	}
}

//a function that verifies a players ability to move
function clearPath(entity, direction){
	if(direction=="right" && (entity.position[0]==1380 || enemyAdjacent(entity, "right")!=null)) {
		return false;
	}else if(direction == "left" && (entity.position[0]==0 || enemyAdjacent(entity, "left")!=null)) {
		return false;
	}else if(direction == "down" && (entity.position[1]==660 || enemyAdjacent(entity, "down")!=null)) {
		return false;
	}else if(direction =="up" && (entity.position[1]==0 || enemyAdjacent(entity, "up")!=null)) {
		return false;
	}
	return true;
}

//function that tells if an enemy is adjacent, useful for verifying ability to move, and attack
function enemyAdjacent(entity, direction){
	for(var i = 0; i < livingEntities.length; i++){
		if(livingEntities[i]!=entity){
			if(direction=="right"){
				if(livingEntities[i].position[0]==entity.position[0]+20){
					if(livingEntities[i].position[1]<entity.position[1]+40 && livingEntities[i].position[1]>entity.position[1]-40){
						return livingEntities[i];
					}
				}
			}else if(direction=="left"){
				if(livingEntities[i].position[0]==entity.position[0]-20){
					if(livingEntities[i].position[1]<entity.position[1]+40 && livingEntities[i].position[1]>entity.position[1]-40){
						return livingEntities[i];
					}
				}
			}else if(direction=="up"){
				if(livingEntities[i].position[0]<entity.position[0]+20 && livingEntities[i].position[0]>entity.position[0]-20){
					if(livingEntities[i].position[1]==entity.position[1]-40){
						return livingEntities[i];
					}
				}
			}else if(direction=="down"){
				if(livingEntities[i].position[0]<entity.position[0]+20 && livingEntities[i].position[0]>entity.position[0]-20){
					if(livingEntities[i].position[1]==entity.position[1]+40){
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
				// ctx.beginPath();
				// ctx.rect(col*stepPixels,row*stepPixels,stepPixels,stepPixels);
				// ctx.fillStyle="blue";
				// ctx.fill();
				ctx.drawImage(bluePotion,col*stepPixels,row*stepPixels,15,20);
			}
			if (inventoryMap[row][col] === 102) {
				// ctx.beginPath();
				// ctx.rect(col*stepPixels,row*stepPixels,stepPixels,stepPixels);
				// ctx.fillStyle="pink";
				// ctx.fill();
				ctx.drawImage(redPotion,col*stepPixels,row*stepPixels,15,20)
			}
			if (inventoryMap[row][col] === 103) {
				// ctx.beginPath();
				// ctx.rect(col*stepPixels,row*stepPixels,stepPixels,stepPixels);
				// ctx.fillStyle="green";
				// ctx.fill();
				ctx.drawImage(greenPotion,col*stepPixels,row*stepPixels,15,20);
			}
			if (inventoryMap[row][col] === 104) {
				// ctx.beginPath();
				// ctx.rect(col*stepPixels,row*stepPixels,stepPixels,stepPixels);
				// ctx.fillStyle="yellow";
				// ctx.fill();
				ctx.drawImage(coin,col*stepPixels,row*stepPixels,15,20);
			}
			if (inventoryMap[row][col] === 105) {
				// ctx.beginPath();
				// ctx.rect(col*stepPixels,row*stepPixels,stepPixels,stepPixels);
				// ctx.fillStyle="gray";
				// ctx.fill();
				ctx.drawImage(coal,col*stepPixels,row*stepPixels,20,20);
			}
		}
	}
}

function addToInventory(item) {
	inventory[item] += 1;
	drawInventory();
}

function drawInventory() {
	let string = "";
	string += "Gold: " + inventory["Gold"] + "\n";
	string += "Coal: " + inventory["Coal"];
	//inventoryContainer.innerText=string;
	let gold = "Gold: " + inventory["Gold"];
	let coal = "Coal: " + inventory["Coal"];
	goldContainer.innerText=gold;
	coalContainer.innerText=coal;
}

function drawLevel() {
	levelContainer.innerText=level;
}

function addPoints(value) {
	points += value;
	pointsContainer.innerText=points;
}

//function to add an entity to the array
function addToLivingEntities(entity) {
	livingEntities.push(entity);
}

function checkIfRoomClear() {
	if (livingEntities.length == 1) {
		if (level == 2*floor ) {
			createStairs();
		}
		else {
			createDoors();
		}
	}
}

//function to remove an entity from the array
function removeLivingEntity(entity){
	var temp = [];
	ctx.clearRect(entity.position[0],entity.position[1],20,44);
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
	if(!paused){
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
			document.getElementById("manaBar").setAttribute("value", 100)
			document.getElementById("healthBar").setAttribute("value", 100)
		}
		character.currentRune = "";
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
	for (let i = 0; i < numGoldCoins; i++) {
		let row = Math.floor(Math.random() * numOfRows);
		let col = Math.floor(Math.random() * numOfColumns);
		console.log(row, col, "104");
		inventoryMap[row][col] = 104;
	}
	for (let i = 0; i < numCoal; i++) {
		let row = Math.floor(Math.random() * numOfRows);
		let col = Math.floor(Math.random() * numOfColumns);
		console.log(row, col, "105");
		inventoryMap[row][col] = 105;
	}
	inventory["Gold"] = 0;
	inventory["Coal"] = 0;
	drawInventoryMap();
	drawInventory();
}

//function spawns enemies in the map
function spawnEnemies(){
	var numEnemies=3;
	for(var i = 1; i < numEnemies; i++){
		//create enemies and give them stats
		var enemy = new Object();
		enemy.id=i;
		enemy.position=getRandomPosition();
		enemy.strength=level;
		enemy.health=100;
		enemy.type="closeRange";
		//add them to the array of living entites
		addToLivingEntities(enemy);
		//draw person with red rectangle to symbolize bad guy
		drawEnemy(enemy.position[0],enemy.position[1]);
		drawHealthBar(enemy);
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
//funtion casts a spell on the enemy standing next to the player
function castSpell(){
	if(!paused && character.mana >= 10){
		// ctx.beginPath();
		if(facing == "up"){
			var enemy=enemyAdjacent(character, "up");
			enemy.health = attackSpell(curSpell, enemy);
			document.getElementById("manaBar").setAttribute("value", 100*(character.mana/character.maxMana))
			// ctx.clearRect(enemy.position[0],enemy.position[1],1,1)
			ctx.clearRect(enemy.position[0],enemy.position[1]+40,20,4);
			drawHealthBar(enemy);
			if(enemy.health<=0){
				removeLivingEntity(enemy);
			}
		}
		else if(facing == "right"){
			var enemy=enemyAdjacent(character, "right");
			enemy.health = attackSpell(curSpell, enemy);
			document.getElementById("manaBar").setAttribute("value", 100*(character.mana/character.maxMana))
			// ctx.clearRect(enemy.position[0],enemy.position[1],1,1)
			ctx.clearRect(enemy.position[0],enemy.position[1]+40,20,4);
			drawHealthBar(enemy);
			if(enemy.health<=0){
				removeLivingEntity(enemy);
			}
		}
		else if(facing == "left"){
			var enemy=enemyAdjacent(character, "left");
			enemy.health = attackSpell(curSpell, enemy);
			document.getElementById("manaBar").setAttribute("value", 100*(character.mana/character.maxMana))
			// ctx.clearRect(enemy.position[0],enemy.position[1],1,1)
			ctx.clearRect(enemy.position[0],enemy.position[1]+40,20,4);
			drawHealthBar(enemy);
			if(enemy.health<=0){
				removeLivingEntity(enemy);
			}
		}
		else if(facing == "down"){
			var enemy=enemyAdjacent(character, "down");
			enemy.health = attackSpell(curSpell, enemy);
			document.getElementById("manaBar").setAttribute("value", 100*(character.mana/character.maxMana))
			// ctx.clearRect(enemy.position[0],enemy.position[1],1,1)
			ctx.clearRect(enemy.position[0],enemy.position[1]+40,20,4);
			drawHealthBar(enemy);
			if(enemy.health<=0){
				removeLivingEntity(enemy);
			}
		}

	}
}

function attackSpell(num, curEnemy){
	if(num === "1" && character.mana >= 5){
		curEnemy.health-=20;
		character.mana -= 5;
		// ctx.rect(enemy.position[0],enemy.position[1],1,1);
		// ctx.fillStyle="red";
		// ctx.fill();
		return curEnemy.health;
	} else if (num === "2" && character.mana >= 3){
		curEnemy.health -=15;
		character.mana -=3;
		// ctx.rect(enemy.position[0],enemy.position[1],1,1);
		// ctx.fillStyle="blue";
		// ctx.fill();
		return curEnemy.health;
	} else if (num === "3" && character.mana >= 10){
		curEnemy.health -=25;
		character.mana -=10;
		// ctx.rect(enemy.position[0],enemy.position[1],1,1);
		// ctx.fillStyle="brown";
		// ctx.fill();
		return curEnemy.health;
	}
	return curEnemy.health;
}

function chooseSpell(){
	if(level === 1) {
		curSpell = "1";
	} else if (level === 2 && window.confirm("Change Spell?")){
		curSpell = window.prompt("1. Fireball Attack\n" +
			"2. Ice Attack\n" + "Choose Spell: ");

	} else if(level >= 3 && window.confirm("Change Spell?")){
		curSpell = window.prompt("1. Fireball Attack\n" +
			"2. Ice Attack\n" +
			"3. Ground Attack\n" + "Choose Spell: ");
	}

	if(curSpell === "1" || curSpell === "Fireball Attack"){
		curSpell = "1";
		alert("Your Current Spell is Fireball Attack");
	} else if (curSpell === "2" || curSpell === "Ice Attack"){
		curSpell = "2";
		alert("Your Current Spell is Ice Attack");
	} else if (curSpell === "3" || curSpell === "Ground Attack"){
		curSpell = "3";
		alert("Your Current Spell is Ground Attack");
	}
}

//function attacks an enemy standing directly next to player, will add functionality for archer later
function attack() {
	if(!paused){
		if(facing=="up"){
			var enemy=enemyAdjacent(character, "up");
			enemy.health-=10;
			ctx.clearRect(enemy.position[0],enemy.position[1]+40,20,4);
			drawHealthBar(enemy);
			if(enemy.health<=0){
				removeLivingEntity(enemy);
			}
		}else if(facing=="right"){
			var enemy=enemyAdjacent(character, "right");
			enemy.health-=10;
			ctx.clearRect(enemy.position[0],enemy.position[1]+40,20,4);
			drawHealthBar(enemy);
			if(enemy.health<=0){
				removeLivingEntity(enemy);
			}
		}else if(facing=="left"){
			var enemy=enemyAdjacent(character, "left");
			enemy.health-=10;
			ctx.clearRect(enemy.position[0],enemy.position[1]+40,20,4);
			drawHealthBar(enemy);
			if(enemy.health<=0){
				removeLivingEntity(enemy);
			}
		}else if (facing=="down"){
			var enemy=enemyAdjacent(character, "down");
			enemy.health-=10;
			ctx.clearRect(enemy.position[0],enemy.position[1]+40,20,4);
			drawHealthBar(enemy);
			if(enemy.health<=0){
				removeLivingEntity(enemy);
			}
		}
	}
}

function createStairs() {
	//top door
	stairsActive = true;
	ctx.beginPath();
	ctx.rect(1300,0,100,100);
	ctx.fillStyle="gray";
	ctx.fill();
}

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

function updateStartPos(spawnSideArg) {
	if (spawnSideArg == "top"){
		startxPos = 650;
		startyPos = 0;
	}
	else if (spawnSideArg == "left") {
		startxPos = 0;
		startyPos = 340;
	}
	else if (spawnSideArg == "right") {
		startxPos = 1390;
		startyPos = 340;
	}
	else if (spawnSideArg == "bottom") {
		startxPos = 650;
		startyPos = 690;
	}
}

//function that pauses and starts a timer that controls the enemies' moves
var q=0;//just to test the timer, can be removed anytime, or kept
function pause(){
	if(document.getElementById("timer").value=="Resume"){
		document.getElementById("timer").value="Pause";
		paused=false;
		document.getElementById("overlay").style.display = "none";
		timer=setInterval(function updateGame(){
			document.getElementById("here").innerHTML=q++; //also just to test timer
			for(var i = 0; i < livingEntities.length; i++){
				if(livingEntities[i]!=character){
					if(livingEntities[i]==enemyAdjacent(character, "right") || livingEntities[i]==enemyAdjacent(character, "left") || livingEntities[i]==enemyAdjacent(character, "up") || livingEntities[i]==enemyAdjacent(character, "down")){
						enemyAttack();
					}
					else{
						enemyMove(livingEntities[i]);
					}
				}
				if(character.health === 0){
					window.location.href = "gameOver.html";
				}
			}
		},250);
	}else{
		document.getElementById("timer").value="Resume";
		clearInterval(timer);
		paused=true;
		document.getElementById("overlay").style.display = "block";
	}
}

//function that does damage to the player when an enemy hits them
function enemyAttack(){
	character.health -= 5;
	document.getElementById("healthBar").setAttribute("value",100*(character.health/character.maxHealth));
}

function goToNextFloor(){
	floor++;
	loadNewRoom();
}

//function that allows enemies to move toward the user to attack
function enemyMove(enemy){
	var direction;
	var secondaryDirection;
	if(character.position[0]-enemy.position[0]==0){//if x coordinate is equal
		if(character.position[1]-enemy.position[1]<0){//if enemy is below
			direction="up";
		}else{//if enemy is above
			direction="down";
		}
	}else if(character.position[1]-enemy.position[1]==0){//if y coorinate is equal
		if(character.position[0]-enemy.position[0]<0){ //if enemy is to the right
			direction="left";
		}else{//if enemy is to the left
			direction="right";
		}
	}else if(character.position[0]-enemy.position[0]<0){//if enemy is to the right
		if(Math.floor(Math.abs(character.position[0]-enemy.position[0])/Math.abs(character.position[1]-enemy.position[1]))>1){//if enemy is more right than above or below
			direction="left";
		}else{
			if(character.position[1]-enemy.position[1]<0){//if enemy is more below
				direction="up";
			}else{//if enemy is more above
				direction="down";
			}
		}
	}else if(character.position[0]-enemy.position[0]>0){//if enemy is to the left
		if(Math.floor((character.position[0]-enemy.position[0])/Math.abs(character.position[1]-enemy.position[1]))>1){//if enemy is more left than above or below
			direction="right";
		}else{
			if(character.position[1]-enemy.position[1]<0){//if enemy is more below
				direction="up";
			}else{//if enemy is more above
				direction="down";
			}
		}
	}
	if(direction=="right" && clearPath(enemy, direction)){ //change clear path function to accept a 2nd parameter of entity, so that clear path checks per user/enemy
		ctx.clearRect(enemy.position[0],enemy.position[1],20,44);
		//ctx.clearRect(xPos-10,yPos-10,42,70);
		//ctx.drawImage(person,xPos+stepPixels,yPos,20,40);
		drawEnemy(enemy.position[0]+10,enemy.position[1]);
		enemy.position[0]+=stepPixels;
		drawHealthBar(enemy);
	}
	else if(direction=="left" && clearPath(enemy, direction)){
		ctx.clearRect(enemy.position[0],enemy.position[1],20,44);
		//ctx.clearRect(xPos-10,yPos-10,42,70);
		drawEnemy(enemy.position[0]-10,enemy.position[1]);
		enemy.position[0]-=stepPixels;
		drawHealthBar(enemy);
	}
	else if(direction=="down" && clearPath(enemy, direction)){
		ctx.clearRect(enemy.position[0],enemy.position[1],20,44);
		//ctx.clearRect(xPos-10,yPos-10,42,70);
		drawEnemy(enemy.position[0],enemy.position[1]+10);
		enemy.position[1]+=stepPixels;
		drawHealthBar(enemy);
	}
	else if(direction=="up" && clearPath(enemy, direction)){
		ctx.clearRect(enemy.position[0],enemy.position[1],20,44);// exactly person sized
		//ctx.clearRect(xPos-10,yPos-10,42,70); //bigger rectangle to erase attack
		drawEnemy(enemy.position[0],enemy.position[1]-10);
		enemy.position[1]-=stepPixels;
		drawHealthBar(enemy);
	}
}

function drawEnemy(x,y){
	ctx.beginPath();
	ctx.rect(x,y,20,40);
	ctx.fillStyle="white";
	ctx.fill();
	ctx.drawImage(person,x,y,20,40);
	ctx.beginPath();
	ctx.lineWidth = "1";
	ctx.strokeStyle = "red";
	ctx.rect(x+2, y+2, 16, 36);
	ctx.stroke();
}

function drawHealthBar(enemy){
	var x = enemy.health/5
	ctx.beginPath();
	ctx.rect(enemy.position[0],enemy.position[1]+40,x,4);
	ctx.fillStyle="red";
	ctx.fill();
}

module.exports = updateStartPos;