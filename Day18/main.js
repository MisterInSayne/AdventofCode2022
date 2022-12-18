const fs = require('fs')
const { performance } = require('perf_hooks');

console.clear();

var files = ['Input.txt', 'Example.txt', 'Example2.txt'];
var file = 0;
var data = null;
console.log("Using: "+files[file]);
try {
	data = fs.readFileSync(files[file], 'utf8');
} catch (err) {
	console.error(err)
}

var coordData = data.split("\r\n");


var part1 = 0;
var part2 = 0;

var pixMap = {};
var pixList = [];
var minC = [100000,100000,100000];
var maxC = [0,0,0];
for(var i = 0; i < coordData.length; i++){
	var [tx,ty,tz] = coordData[i].split(",");
	var coords = [Number(tx),Number(ty),Number(tz)];
	if(coords[0] < minC[0])minC[0] = coords[0];
	if(coords[1] < minC[1])minC[1] = coords[1];
	if(coords[2] < minC[2])minC[2] = coords[2];
	if(coords[0] > maxC[0])maxC[0] = coords[0];
	if(coords[1] > maxC[1])maxC[1] = coords[1];
	if(coords[2] > maxC[2])maxC[2] = coords[2];
	pixMap[coords] = true;
	pixList.push(coords);
}

var max = 10000;
var sides = [[0,0,1],[0,0,-1],[0,1,0],[0,-1,0],[1,0,0],[-1,0,0]];
var done = [];

function calcP1(){
	var count = 0;
	for(var i = 0; i < pixList.length; i++){
		for(var s = 0; s < sides.length; s++){
			var testCord = [pixList[i][0]+sides[s][0], pixList[i][1]+sides[s][1], pixList[i][2]+sides[s][2]];
			if(!pixMap[testCord]){
				count++;
			}
		}
	}
	return count;
}

var outsideMap = {};
function floodOutside(){ flood([minC[0]-1, minC[1]-1, minC[2]-1]);  }
function flood(coord){
	for(var s = 0; s < sides.length; s++){
		var testCord = [coord[0]+sides[s][0], coord[1]+sides[s][1], coord[2]+sides[s][2]];
		if(outsideMap[testCord] == true)continue;
		if(pixMap[testCord] == true){
			part2++;
			continue;
		}
		if(testCord[0] <= minC[0]-2 || testCord[0] >= maxC[0]+2)continue;
		if(testCord[1] <= minC[1]-2 || testCord[1] >= maxC[1]+2)continue;
		if(testCord[2] <= minC[2]-2 || testCord[2] >= maxC[2]+2)continue;
		outsideMap[testCord] = true;
		flood(testCord);
	}
}

part1 = calcP1(true);
console.log("Answer for part 1; "+part1);
floodOutside();
console.log("Answer for part 2; "+part2);
