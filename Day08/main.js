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

var lines = data.split("\r\n");


var part1 = 0;
var part2 = 0;
var grid = [];
var spottedgrid = [];
for(var i = 0; i < lines.length; i++){
	grid[i] = lines[i].split('');
	spottedgrid[i] = [];
	for(var l = 0; l < grid[i].length; l++){
		grid[i][l] = Number(grid[i][l]);
		spottedgrid[i][l] = false;
	}
}

var fl = grid.length;
var l = fl-1;
for(var x = 0; x < fl; x++){
	var left = -1;
	var	right = -1;
	var	top = -1;
	var	bottom = -1;
	for(var y = 0; y < fl; y++){
		if(grid[x][y] > left){left = grid[x][y]; if(!spottedgrid[x][y])part1++; spottedgrid[x][y] = true;}
		if(grid[x][l-y] > right){right = grid[x][l-y]; if(!spottedgrid[x][l-y])part1++; spottedgrid[x][l-y] = true;}
		if(grid[y][x] > top){top = grid[y][x]; if(!spottedgrid[y][x])part1++; spottedgrid[y][x] = true;}
		if(grid[l-y][x] > bottom){bottom = grid[l-y][x]; if(!spottedgrid[l-y][x])part1++; spottedgrid[l-y][x] = true;}
	}
}

//console.log(grid.length+' x '+grid[0].length);
//console.log(spottedgrid);

console.log("Answer for part 1; "+part1);

//var sceneGrid = [];
for(var x = 0; x < fl; x++){
	//sceneGrid[x] = [];
	for(var y = 0; y < fl; y++){
		var max = grid[x][y];
		var score = 1;
		var add = 0;
		for(var i = y+1; i < fl; i++){ add++; if(grid[x][i] >= max)break; }
		score *= add; add = 0; 
		for(var i = y-1; i >= 0; i--){ add++; if(grid[x][i] >= max)break; }
		score *= add; add = 0;
		for(var i = x+1; i < fl; i++){ add++; if(grid[i][y] >= max)break; }
		score *= add; add = 0;
		for(var i = x-1; i >= 0; i--){ add++; if(grid[i][y] >= max)break; }
		score *= add; 
		if(score > part2)part2 = score;
		//sceneGrid[x][y] = score;
	}
}
//console.log(sceneGrid);

console.log("Answer for part 2; "+part2);