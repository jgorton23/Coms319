var character = new Object();

function createCharacter(){
	character.name = document.getElementById("name").value;
	if (document.getElementById("warrior").checked == true) {
		character.gameClass = "warrior";
	}
	if (document.getElementById("ranger").checked == true) {
		character.gameClass = "ranger";
	}
	if (document.getElementById("mage").checked == true) {
		character.gameClass = "mage";
	}
	character.boosters = [false, false, false, false, false];
	if (document.getElementById("boost1").checked == true) {
		character.boosters[0] = true;
	}
	if (document.getElementById("boost2").checked == true) {
		character.boosters[1] = true;
	}
	if (document.getElementById("boost3").checked == true) {
		character.boosters[2] = true;
	}
	if (document.getElementById("boost4").checked == true) {
		character.boosters[3] = true;
	}
	if (document.getElementById("boost5").checked == true) {
		character.boosters[4] = true;
	}
	
	alert("Your new character is: " + character.name + " who is a " + character.gameClass + " and you have these boosters activated: " + getBoosters());
}

function getBoosters() {
	output = "";
	for (i = 0; i < character.boosters.length; i++) {
		if ((i == character.boosters.length-1) && (character.boosters[i] == true)) {
			output += (i+1);
		}
		else if (character.boosters[i] == true) {
			output += (i+1) + ", ";
		}
	}
	return output;
}