var character = new Object();
var address;
var information;
var informationArray;
var mapElem1;
var mapElem2;
var mapElem3;
var mapElem4;
var mapElem5;
var mapString;
var i;
var j;
var locationString;
var map = [
    ['#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#'],
    ['#', '_', '_', '_', '_', '_', '_', '_', '_', '_', '#'],
    ['#', '_', '_', '_', '_', '_', '_', '_', '_', '_', '#'],
    ['#', '_', '_', '_', '_', '_', '_', '_', '_', '_', '#'],
    ['#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#']
];

function initializeGame() {
	createCharacter();
	createMap();
}

function createMap() {
	locationString = character.locat;
	i = locationString.split(",")[0];
	j = locationString.split(",")[1];
	map[i-1][j-1] = "O";
	
	mapElem1 = document.getElementById("mapP1")
	mapElem2 = document.getElementById("mapP2")
	mapElem3 = document.getElementById("mapP3")
	mapElem4 = document.getElementById("mapP4")
	mapElem5 = document.getElementById("mapP5")
	for (i = 0; i < map.length; i++) {
		mapString = "";
		for (j = 0; j < map[i].length; j++) {
			mapString += String(map[i][j]);
		} 
		if (i == 0) {
			mapElem1.innerHTML = mapString;
		}
		if (i == 1) {
			mapElem2.innerHTML = mapString;
		}	
		if (i == 2) {
			mapElem3.innerHTML = mapString;
		}	
		if (i == 3) {
			mapElem4.innerHTML = mapString;
		}	
		if (i == 4) {
			mapElem5.innerHTML = mapString;
		}			
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
