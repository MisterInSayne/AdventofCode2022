const fs = require('fs')
const { performance } = require('perf_hooks');

console.clear();

var files = ['Input.txt', 'Example.txt'];
var file = 1;
var data = null;
console.log("Using: "+files[file]);
try {
	data = fs.readFileSync(files[file], 'utf8');
} catch (err) {
	console.error(err)
}

var dataLn = data.split("\r\n");

function calcDist(fromPos, toPos){
	return Math.abs(fromPos[0]-toPos[0])+Math.abs(fromPos[1]-toPos[1])
}

var part1 = 0;
var part2 = 0;
//var reg =  /Sensor at x=(-?\d+), y=(-?\d+): closest beacon is at x=(-?\d+), y=(-?\d+)/g;

var sensor = [];
for(var i = 0; i < dataLn.length; i++){
	var sensorData = /Sensor at x=(-?\d+), y=(-?\d+): closest beacon is at x=(-?\d+), y=(-?\d+)/g.exec(dataLn[i]);
	var pos = [Number(sensorData[2]), Number(sensorData[1])];
	var beacon = [Number(sensorData[4]), Number(sensorData[3])];
	var dist = calcDist(pos, beacon);
	sensor.push({p: pos, b: beacon, d: dist});
}

//console.log(sensor);

function findCoverage(row){
	var lines = [];
	for(var s = 0; s < sensor.length; s++){
		var prox = (sensor[s].d-Math.abs(row-sensor[s].p[0]));
		//console.log("Beacon "+i+" with x "+pos[0]+" and dist "+dist+": "+prox);
		if(prox >= 0) lines.push([sensor[s].p[1]-prox, sensor[s].p[1]+prox]);
	}
	var cap = 0;
	while(cap < 1000){
		var changed = false;
		for(var l = 0; l < lines.length; l++){
			for(var o = l+1; o < lines.length; o++){
				if(Math.max(lines[l][0], lines[o][0]) <= Math.min(lines[l][1], lines[o][1])+1){
					//console.log("Merging "+lines[l]+" with "+lines[o]);
					lines[l][0] = Math.min(lines[l][0], lines[o][0]);
					lines[l][1] = Math.max(lines[l][1], lines[o][1]);
					lines.splice(o, 1)
					changed = true;
					break;
				}
			}
			if(changed)break;
		}
		if(!changed)break;
		cap++;
	}
	return lines;
}

function calcP1(lines){
	var out = 0;
	for(var l = 0; l < lines.length; l++){
		out += lines[l][1]-lines[l][0];
		if(lines[l][0] > 0)out++;
	}
	
	return out;
}

function isCovered(pos, lines){
	for(var l = 0; l < lines.length; l++){
		if(lines[l][0] <= pos && lines[l][1] >= pos)return true;
	}
	return false;
}

function isSensor(row, pos){
	for(var s = 0; s < sensor.length; s++){
		if(sensor[s].p[1] == pos && sensor[s].p[0] == row)return true;
	}
	return false;
}

function isBeacon(row, pos){
	for(var s = 0; s < sensor.length; s++){
		if(sensor[s].b[1] == pos && sensor[s].b[0] == row)return true;
	}
	return false;
}

function printCover(row, min, max, lines){
	var out = "";
	for(var i = min; i <= max; i++){
		if(isSensor(row, i)){
			out += "S";
		}else if(isBeacon(row, i)){
			out += "B";
		}else if(isCovered(i, lines)){
			out += "#";
		}else{
			out += "-";
		}
	}
	var numb = "";
	if(row < 0){ numb += "-"; }else{ numb += " "; }
	if(Math.abs(row) < 100) numb += "0";
	if(Math.abs(row) < 10) numb += "0";
	console.log(numb+Math.abs(row)+": "+out);
}




var testRow = 10;
if(file == 0)testRow = 2000000;
console.log("Testing row "+testRow);
var cover = findCoverage(testRow);
//printCover(testRow, -10, 40, cover);
part1 = calcP1(cover);
console.log("Answer for part 1; "+part1);


var max = 20;
if(file == 0)max = 4000000;
var found = [];
for(var r = 0; r < max; r++){
	var cover = findCoverage(r);
	if(file == 1)printCover(r, 0, 20, cover);
	if(cover.length > 1){
		//console.log(cover);
		found = [r, cover[0][1]+1];
		if(file == 0)break;
	}
}

console.log("Found spot at "+found);

part2 = (4000000*found[1])+found[0];

console.log("Answer for part 2; "+part2);