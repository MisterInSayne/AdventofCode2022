const fs = require('fs')
const { performance } = require('perf_hooks');

console.clear();

var files = ['Input.txt', 'Example.txt', 'Example2.txt', 'Example3.txt'];
var file = 0;
var inputData = null;
console.log("Using: "+files[file]);
try {
	inputData = fs.readFileSync(files[file], 'utf8');
} catch (err) {
	console.error(err)
}
var _DEBUG = 0;

var dat = inputData.split("\r\n\r\n");
var data = dat[0].split("\r\n");
var instrD = (dat[1]+"P").match(/\d+[a-zA-Z]/g);

var part1 = 0;
var part2 = 0;

var sideSize = 4;
if(file == 0) sideSize = 50;

var start = [0,-1];
function findStart(){
	var row = data[0].split("");
	for(var c = 0; c < row.length; c++){if(row[c] == " ")continue;start[1]=c;break;}
}
findStart();

var instructions = []
for(var i = 0; i < instrD.length; i++){
	var [n, l] = instrD[i].match(/\d+|[a-zA-Z]/g);
	instructions[i] = [Number(n), l];
}
var cube = {};
var sides = {"U":["R","F","L","B"], "F":["R", "D", "L", "U"], "D":["R", "B", "L", "F"], "B":["R", "U", "L", "D"], "L":["U", "F", "D", "B"], "R":["D", "F", "U", "B"]}
var sideList = ["U", "F", "L", "R", "B", "D"];
var dirR = [">", "v", "<", "^"];
var dirV = [[0,1], [1,0], [0,-1], [-1,0]];
class Side {
	constructor(name, inpos){
		this.name = name;
		this.pos = inpos;
		if(_DEBUG>1)console.log("Creating "+this.name+" from pos "+this.pos);
		this.map = [];
		this.outmap = [];
		this.tracemap2D = [];
		this.tracemap3D = [];
		this.flatConnections = [];
		this.cubeConnections = [];
		this.populateSide();
		cube[this.name] = this;
		this.testSideData();
	}
	
	populateSide(){
		for(var x = 0; x < sideSize; x++){
			this.map[x] = [];
			this.outmap[x] = [];
			this.tracemap2D[x] = [];
			this.tracemap3D[x] = [];
			var row = data[this.pos[0]+x].split("");
			for(var y = 0; y < sideSize; y++){
				this.map[x][y] = (row[this.pos[1]+y]==".")?1:2;
				this.outmap[x][y] = row[this.pos[1]+y];
				this.tracemap2D[x][y] = row[this.pos[1]+y];
				this.tracemap3D[x][y] = row[this.pos[1]+y];
			}
		}
	}
	
	testSideData(){
		var nameadd = 0;
		if(this.name == "R" || this.name == "L"){
			nameadd = -((start[0]-this.pos[0])/sideSize);
		}else{
			nameadd = -((start[1]-this.pos[1])/sideSize);
		}
		var row = data[this.pos[0]].split("");
		if(row.length > this.pos[1]+sideSize && row[this.pos[1]+sideSize] != " "){
			if(!cube[sides[this.name][(4+nameadd)%4]]){
				if(_DEBUG>1)console.log(this.name+" has right available. "+sides[this.name][(4+nameadd)%4]);
				new Side(sides[this.name][(4+nameadd)%4], [this.pos[0], this.pos[1]+sideSize]);
			}
		}
		if(this.pos[1]-sideSize >= 0 && row[this.pos[1]-sideSize] != " "){
			if(!cube[sides[this.name][(6+nameadd)%4]]){
				if(_DEBUG>1)console.log(this.name+" has left available. "+sides[this.name][(6+nameadd)%4]);
				new Side(sides[this.name][(6+nameadd)%4], [this.pos[0], this.pos[1]-sideSize]);
			}
		}
		if(data.length > this.pos[0]+sideSize){
			row = data[this.pos[0]+sideSize].split("");
			if(row.length > this.pos[1] && row[this.pos[1]] != " "){
				if(!cube[sides[this.name][(5+nameadd)%4]]){
					if(_DEBUG>1)console.log(this.name+" has bottom available. "+sides[this.name][(5+nameadd)%4]);
					new Side(sides[this.name][(5+nameadd)%4], [this.pos[0]+sideSize, this.pos[1]]);
				}
			}
		}
	}
	
	connectSides(){
		for(var s = 0; s < sides[this.name].length; s++){
			var ns = s;
			if(this.name == "R" || this.name == "L"){
				ns = ((s+4)-((start[0]-this.pos[0])/sideSize))%4;
			}else{
				ns = ((s+4)-((start[1]-this.pos[1])/sideSize))%4;
			}
			this.cubeConnections[s] = cube[sides[this.name][ns]];
			for(var o = 0; o < sideList.length; o++){
				if(sideList[o] == this.name)continue;
				if(cube[sideList[o]].pos[0] == this.pos[0]+(dirV[s][0]*sideSize) && cube[sideList[o]].pos[1] == this.pos[1]+(dirV[s][1]*sideSize)){
					this.flatConnections[s] = cube[sideList[o]];
					break;
				}
			}
		}
	}
	
	clearMap(){
		for(var x = 0; x < sideSize; x++){
			this.tracemap3D[x] = this.outmap[x].slice();
		}
	}
	
	connectLoops(){
		for(var s = 0; s < sides[this.name].length; s++){
			if(!this.flatConnections[s]){
				if(this.flatConnections[(s+2)%4]){
					this.flatConnections[s] = this.flatConnections[(s+2)%4].getFurthest((s+2)%4, this.name);
				}
			}
		}
	}
	
	getFurthest(dir, not){
		if(this.flatConnections[dir] && this.flatConnections[dir].name != not)return this.flatConnections[dir].getFurthest(dir, not);
		return this;
	}
	
	print(){
		console.log();
		console.log("Map "+this.name+" pos "+this.pos);
		for(var x = 0; x < sideSize; x++){
			console.log(this.outmap[x].join(""));
		}
		var out = "";
		var out3d = "";
		for(var i = 0; i < 4; i++){
			out += dirR[i]+(this.flatConnections[i]?this.flatConnections[i].name:"X")+" ";
			out3d += dirR[i]+(this.cubeConnections[i]?this.cubeConnections[i].name:"X")+" ";
		}
		console.log(out);
		console.log(out3d);
	}
	
	getPos(pos){ return this.map[pos[0]][pos[1]]; }
	getWorldPos(pos){ return [this.pos[0]+pos[0], this.pos[1]+pos[1]];}
	getLine(x, get3D=false){ if(get3D)return this.tracemap3D[x].join(""); return this.tracemap2D[x].join("");}
	rotate(pos, diff){
		if(diff <= 0){return pos;} 
		return this.rotate([(sideSize-1)-pos[1], pos[0]], diff-1);
	}
	unrotate(pos, diff){
		if(diff <= 0){return pos;} 
		return this.unrotate([pos[1], (sideSize-1)-pos[0]], diff-1);
	}
	getCubePos(fromSide, pos, dir){
		var ndir = (this.cubeConnections.indexOf(fromSide)+2)%4;
		var npos = this.rotate(pos, dir);
		npos[1] = (sideSize-1)-npos[1];
		npos = this.unrotate(npos, ndir);
		return [npos, ndir, this.map[npos[0]][npos[1]]];
	}
	
	walkFlat(steps, pos, dir){
		if(_DEBUG>0)console.log(this.name+" "+steps+": "+pos);
		if(steps == 0)return [this.name, pos];
		this.tracemap2D[pos[0]][pos[1]] = dirR[dir];
		if((pos[0]+dirV[dir][0] >= sideSize || pos[0]+dirV[dir][0] < 0 || pos[1]+dirV[dir][1] >= sideSize || pos[1]+dirV[dir][1] < 0) && this.flatConnections[dir]){
			if(this.flatConnections[dir].getPos([pos[0]-(dirV[dir][0]*(sideSize-1)),pos[1]-(dirV[dir][1]*(sideSize-1))]) == 2)return [this.name, pos];
			return this.flatConnections[dir].walkFlat(steps-1,[pos[0]-(dirV[dir][0]*(sideSize-1)),pos[1]-(dirV[dir][1]*(sideSize-1))], dir);
		}
		if(this.map[(pos[0]+dirV[dir][0]+sideSize)%sideSize][(pos[1]+dirV[dir][1]+sideSize)%sideSize] == 2)return [this.name, pos];
		return this.walkFlat(steps-1, [(pos[0]+dirV[dir][0]+sideSize)%sideSize,(pos[1]+dirV[dir][1]+sideSize)%sideSize], dir);
	}
	
	walkCube(steps, pos, dir){
		if(_DEBUG>0)console.log(this.name+" "+steps+": "+pos);
		if(steps == 0)return [this.name, pos, dir];
		this.tracemap3D[pos[0]][pos[1]] = dirR[dir];
		if((pos[0]+dirV[dir][0] >= sideSize || pos[0]+dirV[dir][0] < 0 || pos[1]+dirV[dir][1] >= sideSize || pos[1]+dirV[dir][1] < 0)){
			var [npos, ndir, loc] = this.cubeConnections[dir].getCubePos(this, pos.slice(), dir);
			if(loc == 2)return [this.name, pos, dir];
			return this.cubeConnections[dir].walkCube(steps-1, npos, ndir);
		}
		if(this.map[pos[0]+dirV[dir][0]][pos[1]+dirV[dir][1]] == 2)return [this.name, pos, dir];
		return this.walkCube(steps-1,[pos[0]+dirV[dir][0],pos[1]+dirV[dir][1]], dir);
	}
	
}

new Side("U", start);
for(var i = 0; i < sideList.length; i++){cube[sideList[i]].connectSides();}
for(var i = 0; i < sideList.length; i++){cube[sideList[i]].connectLoops();}
if(_DEBUG>3)for(var i = 0; i < sideList.length; i++){cube[sideList[i]].print();}
if(_DEBUG>2)console.log();
//console.log(cube);

function printMap(get3D=false){
	console.log();
	for(var bx = 0; bx < 4; bx++){
		for(var x = 0; x < sideSize; x++){
			var out = "";
			for(var y = 0; y < 4; y++){
				var found = false;
				for(var s = 0; s < 6; s++){
					if(cube[sideList[s]].pos[0] == bx*sideSize && cube[sideList[s]].pos[1] == y*sideSize){
						found = true;
						out += cube[sideList[s]].getLine(x,get3D);
						break;
					}
				}
				if(!found)out += " ".repeat(sideSize);
			}
			console.log(out);
		}
	}
}

var end = [0,0];
function tracePath(flat){
	var pos = [0,0];
	var side = "U";
	var dir = 0;
	var max = instructions.length;
	//console.log(max);
	for(var i = 0; i < max; i++){
		var [w, d] = instructions[i];
		if(_DEBUG>1)console.log(instructions[i]);
		if(flat){
			[side, pos] = cube[side].walkFlat(w, pos, dir);
		}else{
			[side, pos, dir] = cube[side].walkCube(w, pos, dir);
		}
		if(_DEBUG>0)console.log("ended side "+side+" at local pos "+pos);
		if(d == 'P'){ break; }
		if(d == 'R'){dir++;}else{dir--;}
		dir = (dir+4)%4;
	}
	if(_DEBUG>=0)console.log("ended side "+side+" at local pos "+pos);
	end = cube[side].getWorldPos(pos);
	if(_DEBUG>=0)console.log("ended at pos "+end+" with dir "+dir);
	return (1000*(end[0]+1))+(4*(end[1]+1))+dir;
}


part1 = tracePath(true);

if(_DEBUG>3)printMap();

console.log();
console.log("Answer for part 1; "+part1);
console.log();
part2 = tracePath(false);
if(_DEBUG>3)printMap(true);
if(_DEBUG>0)console.log();
console.log("Answer for part 2; "+part2);

//193047 too high.
// 100314 too high...