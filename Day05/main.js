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

var [header,body] = data.split("\r\n\r\n");
var crates = header.split("\r\n");
var instruction = body.split("\r\n");

var stackamount = Number(crates[crates.length-1].slice(-2, -1));
var stack = [];
var stackp2 = [];
for(var i = 0; i < stackamount; i++){ stack[i] = []; stackp2[i] = []; }

for(var i = 0; i < crates.length-1; i++){
	for(var s = 0; s < stackamount; s++){
		var cr = crates[i].slice(1+(s*4), 2+(s*4));
		if(cr == " ")continue;
		stack[s].push(cr);
		stackp2[s].push(cr);
	}
}

//console.log(stack);
var part1 = "";
var part2 = "";

for(var i = 0; i < instruction.length; i++){
	var [_, amm, pos, to] = instruction[i].match(/move (\d+) from (\d+) to (\d+)/);
	//console.log("Move "+amm+" from  "+pos+"  to  "+to);
	amm = Number(amm);
	pos = Number(pos)-1;
	to = Number(to)-1;
	stackp2[to] = stackp2[pos].slice(0, amm).concat(stackp2[to]);
	stackp2[pos] = stackp2[pos].slice(amm);
	
	for(var a = 0; a < amm; a++){
		stack[to].unshift(stack[pos].shift());
	}
}

for(var s = 0; s < stackamount; s++){
	part1 += stack[s][0];
	part2 += stackp2[s][0];
}


console.log("-----------------");
//console.log(stack);

console.log("Answer for part 1; "+part1);
console.log("Answer for part 2; "+part2);