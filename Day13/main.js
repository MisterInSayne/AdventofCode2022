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

var packet = data.split("\r\n\r\n");
var _DEBUG = false;

function compare(left, right){
	if(_DEBUG)console.log("processing "+left+" vs "+right);
	if(!Array.isArray(left) || !Array.isArray(right)){
		if(!Array.isArray(left) && !Array.isArray(right)){
			if(_DEBUG)console.log("compare "+left+" vs "+right);
			if(left < right){
				return 1;
			}else if(left == right){
				return 0;
			}else{
				return -1;
			}
		}else if(!Array.isArray(left)){
			if(_DEBUG)console.log("convert left "+left+" to ["+left+"]");
			left = [left];
		}else {
			if(_DEBUG)console.log("convert right "+right+" to ["+right+"]");
			right = [right];
		}
	}
	
	for(var i = 0; i < left.length; i++){
		if(i == right.length)return -1;
		var c = compare(left[i], right[i]);
		if(c == 0)continue;
		if(c == 1)return 1;
		return -1;
	}
	if(right.length > i)return 1;
	return 0;
}

var part1 = 0;
var part2 = 0;
var diva = [[2]];
var divb = [[6]];
var packets = [diva,divb];
for(var i = 0; i < packet.length; i++){
//for(var i = 2; i < 3; i++){
	var pair = packet[i].split("\r\n");
	var left = JSON.parse(pair[0]);
	var right = JSON.parse(pair[1]);
	packets.push(left);
	packets.push(right);
	var c = compare(left, right);
	if(_DEBUG)console.log((i+1)+" returned "+c);
	if(c == 1){ part1 += (i+1); }
}

console.log("Answer for part 1; "+part1);



packets.sort((a, b) => {return 0-compare(a, b);});
//console.log(packets);

part2 = (packets.indexOf(diva)+1)*(packets.indexOf(divb)+1);
console.log("Answer for part 2; "+part2);

// 3307 is too low.
// 5742 is too high.