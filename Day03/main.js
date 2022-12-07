const fs = require('fs')
const { performance } = require('perf_hooks');

console.clear();

var files = ['Input.txt', 'Example.txt'];
var file = 0;
var data = null;
console.log("Using: "+files[file]);
try {
	data = fs.readFileSync(files[file], 'utf8');
} catch (err) {
	console.error(err)
}

var rucksack = data.split("\r\n");

var alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

var alphmap = {};
for(var i = 0; i < alphabet.length; i++){
	alphmap[alphabet[i]] = i+1;
}

var totalpart1 = 0;
for(var i = 0; i < rucksack.length; i++){
	var left = rucksack[i].slice(0,rucksack[i].length/2).split('');
	var right = rucksack[i].slice(rucksack[i].length/2);
	//console.log(left +" - "+ right);
	for(var l = 0; l < left.length; l++){
		if(right.includes(left[l])){
			//console.log("found: "+left[l]);
			totalpart1 += alphmap[left[l]];
			break;
		}
	}
}
console.log("----------------------------------");
console.log("Answer for part 1: "+totalpart1);
console.log("----------------------------------");


var totalpart2 = 0;
var lettermap = {};
for(var i = 0; i < rucksack.length; i++){
	var letters = rucksack[i].split('');
	var foundmap = {};
	for(var l = 0; l < letters.length; l++){
		if(foundmap[letters[l]] == null){
			foundmap[letters[l]] = true;
			if(lettermap[letters[l]] == null){
				lettermap[letters[l]] = 1;
			}else{
				lettermap[letters[l]]++;
				if(lettermap[letters[l]] == 3){
					totalpart2 += alphmap[letters[l]];
					break;
				}
			}
		}
	}
	
	if((i+1)%3 == 0){
		lettermap = {};
	}
}

console.log("Answer for part 2: "+totalpart2);