const fs = require('fs')
const { performance } = require('perf_hooks');

console.clear();

var files = ['Input.txt', 'Example.txt', 'Example2.txt'];
var file = 0;
var inputData = null;
console.log("Using: "+files[file]);
try {
	inputData = fs.readFileSync(files[file], 'utf8');
} catch (err) {
	console.error(err)
}
var _DEBUG = 1;
var data = inputData.split("\r\n");


var part1 = 0;
var part2 = 0;

var dir = {">":0,"v":1,"<":2,"^":3};
var next = {">":"2","v":"2","<":"2","^":"2","2":"3","3":"4","4":"5"};
var mapsize = {x:data.length-2, y:data[0].length-2};
var blizzards = [];
class Blizzard{
	constructor(x, y, s){
		this.x = x;
		this.y = y;
		this.dir = dir[s];
		this.s = s;
	}
	getPos(c){
		switch(this.dir){
			case 0: return [this.x, (this.y+c)%mapsize.y]; break;
			case 1: return [(this.x+c)%mapsize.x, this.y]; break;
			case 2: return [this.x, (((this.y-c)%mapsize.y)+mapsize.y)%mapsize.y]; break;
			case 3: return [(((this.x-c)%mapsize.x)+mapsize.x)%mapsize.x, this.y]; break;
		}
	}
}

function mapBlizzards(c){
	var map = {};
	for(var b = 0; b < blizzards.length; b++){
		var pos = blizzards[b].getPos(c);
		if(!map[pos]){
			map[pos] = blizzards[b].s;
		}else{
			map[pos] = next[map[pos]];;
		}
	}
	return map;
}

for(var i = 1; i < data.length-1; i++){
	for(var y = 1; y < data[i].length-1; y++){
		if(data[i].charAt(y) == ".")continue;
		blizzards.push(new Blizzard(i-1, y-1, data[i].charAt(y)));
	}
}

var start = [-1, 0];
var end = [mapsize.x, mapsize.y-1];
function printMap(c){
	console.log();
	var map = mapBlizzards(c);
	console.log("#."+("#".repeat(mapsize.y)));
	for(var x = 0; x < mapsize.x; x++){
		var out = "#";
		for(var y = 0; y < mapsize.y; y++){
			if(map[[x,y]]){out+=map[[x,y]];}else{out+=".";}
		}
		console.log(out+"#");
	}
	console.log(("#".repeat(mapsize.y))+".#");
}

var move = [[0,1], [1,0], [0,-1], [-1,0]];
function findPath(fromPos, toPos, startCycle){
	var paths = [fromPos];
	var cycles = startCycle;
	while(cycles < 2000){
		var map = mapBlizzards(cycles);
		var newPaths = [];
		var pathMap = {};
		for(var i = 0; i < paths.length; i++){
			var pos = paths[i];
			for(var m = 0; m < 4; m++){
				var npos = [pos[0]+move[m][0],pos[1]+move[m][1]];
				if(npos[0] == toPos[0] && npos[1] == toPos[1])return cycles;
				if(npos[0] < 0 || npos[1] < 0 || npos[0] >= mapsize.x || npos[1] >= mapsize.y)continue;
				if(pathMap[npos] == true)continue;
				if(map[npos])continue;
				pathMap[npos] = true;
				newPaths.push(npos);
			}
			if(!map[pos] && !pathMap[pos]){
				pathMap[pos] = true;
				newPaths.push(pos);
			}
		}
		paths = newPaths;
		cycles++;
	}
}

part1 = findPath(start.slice(), end.slice(), 1);
console.log();
console.log("Answer for part 1; "+part1);
var part1half = findPath(end.slice(), start.slice(), part1);
console.log("Minutes to go back; "+(part1half-part1)+" ("+part1half+" total)");
part2 = findPath(start.slice(), end.slice(), part1half);
console.log("Answer for part 2; "+part2);