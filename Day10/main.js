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

var instruction = data.split("\r\n");


var part1 = 0;
var part2 = 0;

var x = 1;
var c = 1;
var nextC = 20;
var CRT = "";

for(var i = 0; i < instruction.length; i++){
	if(c%40 >= x && c%40 <= x+2){ CRT += "#"; }else{ CRT += "." }
	c++;
	if(instruction[i] != "noop"){
		if(c%40 >= x && c%40 <= x+2){ CRT += "#"; }else{ CRT += "." }
		c++;
	}
	
	if(c > nextC){
		part1 += nextC*x;
		console.log("Cycle "+nextC+": x="+x+", add="+(x*nextC)+" sig="+part1);
		nextC += 40;
	}
	if(instruction[i] != "noop") x += Number(instruction[i].slice(4));
}

console.log(x);

console.log("Answer for part 1; "+part1);
console.log("Answer for part 2; ");

for(var i = 0; i < 6; i++){
	console.log(CRT.slice(40*i,(40*i)+40));
}