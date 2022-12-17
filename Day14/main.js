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

var _DEBUG = false;
var instruction = data.split("\r\n");

var minmax = [[0,10000000], [0,500]];
function toCoord(str){
	var [y, x] = str.split(",");
	if(Number(x) < minmax[0][0])minmax[0][0] = Number(x);
	if(Number(x) > minmax[1][0])minmax[1][0] = Number(x);
	if(Number(y) < minmax[0][1])minmax[0][1] = Number(y);
	if(Number(y) > minmax[1][1])minmax[1][1] = Number(y);
	return [Number(x), Number(y)];
}

function testCol(pos){return testCol(pos[0], pos[1]);}
function testCol(x, y){
	for(var l = 0; l < lines.length; l++){
		if((lines[l].vert && y == lines[l].start[1] && (x >= lines[l].start[0] && x <= lines[l].end[0])) || (!lines[l].vert &&x == lines[l].start[0] && (y >= lines[l].start[1] && y <= lines[l].end[1]))){
			return true;
		}
	}
	for(var s = 0; s < sand.length; s++){
		if(sand[s][0] == x && sand[s][1] == y){return true;}
	}
	return false;
}

function testWall(x, y){
	for(var l = 0; l < lines.length; l++){
		if((lines[l].vert && y == lines[l].start[1] && (x >= lines[l].start[0] && x <= lines[l].end[0])) || (!lines[l].vert &&x == lines[l].start[0] && (y >= lines[l].start[1] && y <= lines[l].end[1]))){
			return true;
		}
	}
	return false;
}
function testSand(x, y){
	for(var s = 0; s < sand.length; s++){
		if(sand[s][0] == x && sand[s][1] == y){return true;}
	}
	return false;
}



function printChunk(fromx, fromy, tox, toy){
	for(var x = fromx; x <= tox; x++){
		var out = "";
		for(var y = fromy; y <= toy; y++){
			if(x == sandstart[0] && y == sandstart[1]){out += "+"; continue;}
			if(testWall(x, y)){out += "#";}else if(testSand(x, y)){out += "s";}else{out += ".";}
		}
		console.log(out);
	}
}

function spawnSand(pos){
	sand.push([pos[0],pos[1],false]);
}

var move = [[1,0],[1,-1],[1,1]];
function moveSand(pos){
	for(var m = 0; m < 3; m++){
		if(testCol(pos[0]+move[m][0],pos[1]+move[m][1]))continue;
		return [pos[0]+move[m][0],pos[1]+move[m][1], false];
	}
	pos[2] = true;
	return pos;
}

function simulateSand(){
	for(var s = 0; s < sand.length; s++){
		if(sand[s][2])continue;
		sand[s] = moveSand(sand[s]);
	}
}

function isDone(){
	for(var s = 0; s < sand.length; s++){
		if(sand[s][2])continue;
		if(sand[s][0] > minmax[1][0]){
			end = true;
			return true;
		}
	}
	return false;
}

function canSpawn(){
	for(var s = 0; s < sand.length; s++){
		if(sand[s][0] == sandstart[0] && sand[s][1] == sandstart[1]){
			return false;
		}
	}
	return true;
}

function calcRest(){
	var out = 0;
	for(var s = 0; s < sand.length; s++){
		if(sand[s][2])out++;
	}
	return out;
}

var part1 = 0;
var part2 = 0;

var sandstart = [0,500];
var lines = [];
for(var i = 0; i < instruction.length; i++){
	var parts = instruction[i].split(" -> ");
	for(var p = 0; p < parts.length-1; p++){
		var pa = toCoord(parts[p]);
		var pb = toCoord(parts[p+1]);
		if(pa[0] <= pb[0] && pa[1] <= pb[1]){
			lines.push({start: pa, end: pb, vert: (pa[1] == pb[1])});
		}else{
			lines.push({start: pb, end: pa, vert: (pa[1] == pb[1])});
		}
	}
}

if(_DEBUG)console.log(lines);
if(_DEBUG)console.log(minmax);

var sand = [];
var steps = 1000000;
var end = false;
//for(var s = 0; s < steps; s++){
var s = 0;
while(!isDone() && s < steps){
	if(_DEBUG)console.log();
	if(_DEBUG)console.log("Processing step "+(s+1));
	if(_DEBUG)console.log();
	spawnSand(sandstart);
	simulateSand();
	if(_DEBUG)printChunk(minmax[0][0]-1, minmax[0][1]-1, minmax[1][0]+2, minmax[1][1]+1);
	if(_DEBUG)console.log();
	if(_DEBUG)console.log("----------------------------------");
	s++;
}

console.log("Done: "+isDone()+" Steps: "+s);
part1 = calcRest();
console.log("Answer for part 1; "+part1);
//_DEBUG = true;
lines.push({start: [minmax[1][0]+2, -100000], end: [minmax[1][0]+2, 100000], vert: false});

while(canSpawn() && s < steps){
	if(_DEBUG)console.log();
	if(_DEBUG)console.log("Processing step "+(s+1));
	if(_DEBUG)console.log();
	spawnSand(sandstart);
	simulateSand();
	if(_DEBUG)printChunk(minmax[0][0]-1, minmax[0][1]-10, minmax[1][0]+2, minmax[1][1]+10);
	if(_DEBUG)console.log();
	if(_DEBUG)console.log("----------------------------------");
	s++;
}

console.log("Done: "+(!canSpawn())+" Steps: "+s);
//console.log(minmax);
part2 = calcRest();
console.log("Answer for part 2; "+part2);