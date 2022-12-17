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

var pair = data.split("\r\n");


var part1 = 0;
var part2 = 0;
for(var i = 0; i < pair.length; i++){
	
}



console.log("Answer for part 1; "+part1);
console.log("Answer for part 2; "+part2);