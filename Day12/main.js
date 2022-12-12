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

var mapdata = data.split("\r\n");


var part1 = 0;
var part2 = 0;
var map = [];
var start = [];
var end = [];
var size = mapdata.length;
var width = mapdata[0].length;

var p2queue = [];
for(var i = 0; i < mapdata.length; i++){
	map[i] = [];
	for(var p = 0; p < mapdata[i].length; p++){
		var h = mapdata[i].charCodeAt(p)-96;
		if(h < 0){
			if(h == -13){
				h = 1;
				start = [i, p];
			}else{
				h = 27;
				end = [i, p];
			}
		}
		var p2s = 1000;
		if(h ==1){p2queue.push([i, p]); p2s = 0; }
		map[i][p] = {'h': h, 's':1000, 'p2s':p2s };
	}
}

map[start[0]][start[1]].s = 0;
var queue = [start];
var side = [[1, 0], [-1,0], [0,1], [0,-1]];
while(queue.length > 0){
	var pos = queue.shift();
	//console.log(pos);
	var step = map[pos[0]][pos[1]].s+1;
	var h = map[pos[0]][pos[1]].h;
	for(var s = 0; s < 4; s++){
		var next = [pos[0]-side[s][0], pos[1]-side[s][1]];
		if(next[0] < 0 || next[0] >= size || next[1] < 0 || next[1] >= width)continue;
		if(map[next[0]][next[1]].s <= step)continue;
		if(map[next[0]][next[1]].h > h+1)continue;
		map[next[0]][next[1]].s = step;
		if(queue.includes(map[next[0]][next[1]]))continue;
		queue.push([next[0],next[1]]);
	}
}

part1 = map[end[0]][end[1]].s;
console.log("Answer for part 1; "+part1);

while(p2queue.length > 0){
	var pos = p2queue.shift();
	//console.log(pos);
	var step = map[pos[0]][pos[1]].p2s+1;
	var h = map[pos[0]][pos[1]].h;
	for(var s = 0; s < 4; s++){
		var next = [pos[0]-side[s][0], pos[1]-side[s][1]];
		if(next[0] < 0 || next[0] >= size || next[1] < 0 || next[1] >= width)continue;
		if(map[next[0]][next[1]].p2s <= step)continue;
		if(map[next[0]][next[1]].h > h+1)continue;
		map[next[0]][next[1]].p2s = step;
		if(p2queue.includes(map[next[0]][next[1]]))continue;
		p2queue.push([next[0],next[1]]);
	}
}

part2 = map[end[0]][end[1]].p2s;
console.log("Answer for part 2; "+part2);