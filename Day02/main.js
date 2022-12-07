const fs = require('fs')
const { performance } = require('perf_hooks');

console.clear();

var _DEBUG = false;

var files = ['Input.txt', 'Example.txt'];
var file = 0;
var data = null;
console.log("Using: "+files[file]);
try {
	data = fs.readFileSync(files[file], 'utf8');
} catch (err) {
	console.error(err)
}

var round = data.split("\r\n");

var mapone = {'A':0, 'B':1, 'C':2};
var maptwo = {'X':0, 'Y':1, 'Z':2};
var maploss = {'A':3, 'B':1, 'C':2};
var mapwin = {'A':2, 'B':3, 'C':1};

var score = 0;
var scoreptwo = 0;
for(var i = 0; i < round.length; i++){
	var [pone, ptwo] = round[i].split(" ");
	score += maptwo[ptwo]+1;
	if(mapone[pone] == maptwo[ptwo]){
		if(_DEBUG)console.log("draw");
		score += 3;
	}else if(mapone[pone] == (maptwo[ptwo]+1)%3){
		if(_DEBUG)console.log("loss");
	}else{
		if(_DEBUG)console.log("win");
		score += 6;
	}
	if(ptwo == "X"){ scoreptwo += maploss[pone]; } else
	if(ptwo == "Y"){ scoreptwo += mapone[pone]+4; } else
	if(ptwo == "Z"){ scoreptwo += mapwin[pone]+6; }
}

console.log("Answer for part 1: "+score);
console.log("Answer for part 2: "+scoreptwo);
