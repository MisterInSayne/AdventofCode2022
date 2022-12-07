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

var elves = data.split("\r\n\r\n");


var callist = [];
for(var i = 0; i < elves.length; i++){
	var calories = elves[i].split("\r\n");
	var total = 0;
	for(var c = 0; c < calories.length; c++){
		total += Number(calories[c]);
	}
	callist.push(total);
}

callist.sort(function(a, b){return b - a});


console.log("----------------------------------");
console.log("The top 3 is: ");
console.log("1: "+callist[0]);
console.log("2: "+callist[1]);
console.log("3: "+callist[2]);
console.log("----------------------------------");
console.log("Answer for part 1 is: " +callist[0]);
console.log("----------------------------------");
console.log("Answer for part 2 is: " +(callist[0]+callist[1]+callist[2]));
console.log("----------------------------------");