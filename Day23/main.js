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

var data = inputData.split("\r\n");


var part1 = 0;
var part2 = 0;

var sides = [[[-1,0],[-1,-1],[-1,1]],[[1,0],[1,-1],[1,1]],[[0,-1],[-1,-1],[1,-1]],[[0,1],[-1,1],[1,1]]];
var aSides = [[-1,0],[1,0],[0,-1],[0,1],[-1,-1],[1,-1],[-1,1],[1,1]];
var cSides = [[-1,0],[1,0],[0,-1],[0,1]];
var map = {};
var elves = [];
var cycle = 0;
class Elf{
	constructor(x, y){ this.origin = [x, y]; }
	reset(){this.resetPos();}
	resetPos(){[this.x, this.y] = this.origin;}
	getPos(){return [this.x, this.y];}
	setPos(x,y){this.x = x; this.y = y;}
	setPos(arr){[this.x, this.y] = arr;}
	
	isAlone(){
		var e = 0;
		for(var a = 0; a < 8; a++){
			if(map[[this.x+aSides[a][0], this.y+aSides[a][1]]])e++;
		}
		return (e == 0);
	}
	
	proposeMove(){
		if(this.isAlone()){return false;}
		for(var s = 0; s < 4; s++){
			var e = 0;
			for(var si = 0; si < 3; si++){
				if(map[[this.x+sides[(s+cycle)%4][si][0], this.y+sides[(s+cycle)%4][si][1]]]){
					e++;
					break;
				}
			}
			if(e == 0)return [this.x+cSides[(s+cycle)%4][0], this.y+cSides[(s+cycle)%4][1]];
		}
		return false;
	}
}


for(var i = 0; i < data.length; i++){
	var line = data[i].split("");
	for(var l = 0; l < line.length; l++){
		if(line[l] == "#"){
			elves.push(new Elf(i, l));
		}
	}
}

function countSmallSquare(){
	var min = [10000000,10000000];
	var max = [-10000000,-10000000];
	for(var e = 0; e < elves.length; e++){
		var coord = elves[e].getPos();
		if(coord[0] < min[0])min[0] = coord[0];
		if(coord[1] < min[1])min[1] = coord[1];
		if(coord[0] > max[0])max[0] = coord[0];
		if(coord[1] > max[1])max[1] = coord[1];
	}
	return (((max[0]+1)-min[0])*((max[1]+1)-min[1]))-elves.length;
}

function runSimulation(rounds){
	for(var e = 0; e < elves.length; e++){
		elves[e].reset();
	}
	//printMap();
	var changed = 1;
	cycle = 0;
	while(changed > 0 && cycle < rounds){
		changed = 0;
		map = {};
		var moves = {};
		for(var e = 0; e < elves.length; e++){
			map[elves[e].getPos()] = true;
		}
		
		for(var e = 0; e < elves.length; e++){
			var cord = elves[e].proposeMove();
			if(!cord)continue;
			if(moves[cord]){
				moves[cord].push(e);
			}else{
				moves[cord] = [cord, e];
			}
		}
		
		var moveList = Object.keys(moves);
		for(var i = 0; i < moveList.length; i++){
			if(moves[moveList[i]].length > 2)continue;
			elves[moves[moveList[i]][1]].setPos(moves[moveList[i]][0]);
			changed++;
		}
		//console.log(moveList);
		//printMap();
		cycle++;
	}
	
	return cycle;
}

function printMap(){
	console.log();
	var primap = {};
	var min = [1000,1000];
	var max = [-1000,-1000];
	for(var e = 0; e < elves.length; e++){
		var coord = elves[e].getPos();
		if(coord[0] < min[0])min[0] = coord[0];
		if(coord[1] < min[1])min[1] = coord[1];
		if(coord[0] > max[0])max[0] = coord[0];
		if(coord[1] > max[1])max[1] = coord[1];
		primap[coord] = true;
	}
	for(var x = min[0]-1; x < max[0]+2; x++){
		var out = "";
		for(var y = min[1]-1; y < max[1]+2; y++){
			if(primap[[x, y]]){out += "#";}else{out+=".";}
		}
		console.log(out);
	}
}
runSimulation(10);
part1 = countSmallSquare();
console.log();
console.log("Answer for part 1; "+part1);
part2 = runSimulation(Number.MAX_SAFE_INTEGER);
console.log("Answer for part 2; "+part2);