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

var chars = data.split("");

var part1 = -1;
var part2 = 0;
var checksize = 4;
for(var i = 0; i < chars.length-4; i++){
	
	var good = true;
	var map = {};
	for(var c = 0; c < checksize; c++){
		if(map[chars[i+c]] == true){good = false; break;}
		map[chars[i+c]] = true;
	}
	if(good){
		if(part1 == -1){
			part1 = i+4;
			checksize = 14;
		}else{
			part2 = i+14;
			break;
		}
	}
}

console.log("Answer for part 1; "+part1);
console.log("Answer for part 2; "+part2);
