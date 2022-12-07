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

var instr = data.split("\r\n");


var part1 = 0;
var part2 = 0;

var folder = {'size':0, 'dirs':[]};
var currentlevel = []

function adddir(folder, path, name){
	if(path.length > 0){
		folder[path[0]] = adddir(folder[path[0]], path.slice(1), name);
	}else{
		folder[name] = {'size':0, 'dirs':[]};
		folder.dirs.push(name);
	}
	return folder;
}
function addfile(folder, path, name, size){
	if(path.length > 0){
		folder.size += size;
		folder[path[0]] = addfile(folder[path[0]], path.slice(1), name, size);
	}else{
		folder.size += size;
		folder[name] = size;
	}
	return folder;
}

for(var i = 0; i < instr.length; i++){
	var inf = instr[i].split(" ");
	if(inf[0] == "$"){
		if(inf[1] == "cd"){
			if(inf[2] == ".."){
				currentlevel.pop();
			}else if(inf[2] == "/"){
				continue;
			}else{
				currentlevel.push(inf[2]);
			}
		}
	}else if(inf[0] == "dir"){
		folder = adddir(folder, currentlevel, inf[1]);
	} else {
		folder = addfile(folder, currentlevel, inf[1], Number(inf[0]));
	}
}
console.log(folder);
var min = folder.size-40000000;
var part2 = 70000000;

function searchFolders(curfolder){
	for(var i = 0; i < curfolder.dirs.length; i++){
		searchFolders(curfolder[curfolder.dirs[i]]);
	}
	if(curfolder.size < 100000){
		part1 += curfolder.size;
	}
	if(curfolder.size < part2 && curfolder.size > min){
		part2 = curfolder.size;
	}
}

searchFolders(folder);

console.log("Answer for part 1; "+part1);
console.log("Answer for part 2; "+part2);