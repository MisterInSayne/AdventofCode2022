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

var pair = data.split("\r\n");


var part1 = 0;
var part2 = 0;
for(var i = 0; i < pair.length; i++){
	var [left,right] = pair[i].split(",");
	var [lmin,lmax] = left.split("-");
	var [rmin,rmax] = right.split("-");
	lmin = Number(lmin);
	lmax = Number(lmax);
	rmin = Number(rmin);
	rmax = Number(rmax);
	if((lmin <= rmin && lmax >= rmax) || (lmin >= rmin && lmax <= rmax)){
		part1++;
		part2++;
		continue;
	}
	var min = Math.max(lmin, rmin);
	var max = Math.min(lmax, rmax);
	
	if(max >= min){
		part2++;
		//console.log(pair[i] + " overlap is; " + min + "-"+max);
	}
	
}

console.log("Answer for part 1; "+part1);
console.log("Answer for part 2; "+part2);