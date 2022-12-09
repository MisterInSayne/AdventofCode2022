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

var instruction = data.split("\r\n");

var ropelength = 10;

var posR = new Array(ropelength);
for(var i = 0; i < ropelength; i++){ posR[i] = [0,0]; }
var tagsp1 = {};
var tagsp2 = {};
var vecs = {'U':[1,0],'D':[-1,0],'L':[0,-1],'R':[0,1]};
for(var i = 0; i < instruction.length; i++){
	var steps = Number(instruction[i].slice(2));
	var vec = vecs[instruction[i].slice(0,1)];
	for(var s = 0; s < steps; s++){
		posR[0][0] += vec[0];
		posR[0][1] += vec[1];
		for(var r = 1; r < ropelength; r++){
			var diff = [posR[r-1][0]-posR[r][0], posR[r-1][1]-posR[r][1]];
			if(Math.abs(diff[0]) > 1 || Math.abs(diff[1]) > 1){
				//too much distance!
				if(diff[0] != 0)posR[r][0] += diff[0]/Math.abs(diff[0]);
				if(diff[1] != 0)posR[r][1] += diff[1]/Math.abs(diff[1]);
			}
		}
		tagsp1[posR[1][0]+"-"+posR[1][1]] = true;
		tagsp2[posR[ropelength-1][0]+"-"+posR[ropelength-1][1]] = true;
	}
}

console.log("Answer for part 1; "+Object.keys(tagsp1).length);
console.log("Answer for part 2; "+Object.keys(tagsp2).length);