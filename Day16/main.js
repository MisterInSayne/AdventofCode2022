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

var inputData = data.split("\r\n");


var part1 = 0;
var part2 = 0;

var valves = {};
for(var i = 0; i < inputData.length; i++){
	//console.log(inputData[i]);
	var valvedata = /Valve (\w\w) has flow rate=(-?\d+); tunnels? leads? to valves? (.*)/g.exec(inputData[i]);
	//console.log(valvedata);
	var name = valvedata[1];
	var flow = Number(valvedata[2]);
	var links = valvedata[3].split(", ");
	valves[name] = {flow: flow, links: links};
}

//console.log(valves);
console.log("Generating maps and data.");

function findFastestRoute(fromV, toV, steps, prev){
	if(steps < 1)return 30;
	//if(links[fromV] != undefined && links[fromV][toV] != undefined)return links[fromV][toV];
	if(valves[fromV].links.includes(toV))return 1;
	var shortest = []
	prev.push(fromV);
	for(var l = 0; l < valves[fromV].links.length; l++){
		if(prev.includes(valves[fromV].links[l]))continue;
		shortest.push(findFastestRoute(valves[fromV].links[l],toV,steps-1,prev.slice()));
	}
	if(shortest.length == 0)return 30;
	shortest.sort(function(a, b) {return a - b;});
	return shortest[0]+1;
}

var links = {};
var valvenames = Object.keys(valves);
console.log("Generating fastest route map.");

for(var i = 0; i < valvenames.length; i++){
	links[valvenames[i]] = {};
	for(var v = 0; v < valvenames.length; v++){
		if(i == v)continue;
		links[valvenames[i]][valvenames[v]] = findFastestRoute(valvenames[i],valvenames[v],30,[]);
	}
}
//console.log(links);



var valvesWithFlow = [];
for(var i = 0; i < valvenames.length; i++){
	if(valves[valvenames[i]].flow == 0)continue;
	valvesWithFlow.push(valvenames[i]);
}

console.log("Generating Nodes.");
var Nodes = {};


function getAllNodes(v){
	var flow = valves[v].flow;
	var node = {};
	
	for(var i = 0; i < valvesWithFlow.length; i++){
		if(valvesWithFlow[i] == v)continue;
		//if(opened.includes(valvesWithFlow[i]))continue;
		var min = links[v][valvesWithFlow[i]];
		node[valvesWithFlow[i]] = {t: min+1, mul: valves[valvesWithFlow[i]].flow};
	}
	return node;
}



for(var i = 0; i < valvesWithFlow.length; i++){
	Nodes[valvesWithFlow[i]] = getAllNodes(valvesWithFlow[i]);
}
Nodes['AA'] = getAllNodes('AA');

//console.log(Nodes);
var testP = [];
var Path = {};
Path[testP] = {t:0, add: 0, mul: 0};
var Paths = [];

function getAllPaths(v, opened){
	
	for(var i = 0; i < valvesWithFlow.length; i++){
		if(valvesWithFlow[i] == v)continue;
		if(opened.includes(valvesWithFlow[i]))continue;
		if(Path[opened].t+Nodes[v][valvesWithFlow[i]].t > 30)continue;
		var nopen = opened.slice();
		nopen.push(valvesWithFlow[i]);
		Path[nopen] = {
			't':Path[opened].t+Nodes[v][valvesWithFlow[i]].t,
			'add':Path[opened].add+(Nodes[v][valvesWithFlow[i]].t*Path[opened].mul), 
			'mul':Path[opened].mul+Nodes[v][valvesWithFlow[i]].mul,
			'path':nopen
		};
		Paths.push(Path[nopen]);
		getAllPaths(valvesWithFlow[i], nopen);
	}
}
console.log("Generating routes.");
//for(var i = 0; i < valvesWithFlow.length; i++){}
getAllPaths('AA', []);

//console.log(Path);
function calcRoute(r, minutes){ return r.add + ((minutes-r.t)*r.mul);}

console.log("Found "+Paths.length+" routes.");
console.log("Finding best route.");
function findRoute(minutes){
	Paths.sort(function(a, b) {return (b.add + ((minutes-b.t)*b.mul)) - (a.add + ((minutes-a.t)*a.mul));});
	//console.log(Paths);
	return calcRoute(Paths[0], minutes);
}

function testOverlap(arra, arrb){
	for(var i = 0; i < arra.length; i++){
		if(arrb.includes(arra[i]))return true;
	}
	return false;
}

function findDoubleRoute(minutes, topx=0){
	Paths.sort(function(a, b) {return (b.add + ((minutes-b.t)*b.mul)) - (a.add + ((minutes-a.t)*a.mul));});
	var highest = 0;
	if(topx == 0)topx = Paths.length;
	topx = Math.min(topx, Paths.length);
	for(var p = 0; p < topx; p++){
		//if(p%10 == 0 && p > 0)console.log(p+" top so far: "+highest);
		//if(Paths[p].path.length > valvesWithFlow.length-2)continue;
		//if(Paths[p].path.length < 3)continue;
		for(var o = p+1; o < topx; o++){
			//if(Paths[o].path.length > valvesWithFlow.length-2)continue;
			//if(Paths[o].path.length < 3)continue;
			if(testOverlap(Paths[p].path, Paths[o].path))continue;
			var calc = calcRoute(Paths[p], minutes)+calcRoute(Paths[o], minutes);
			if(calc > highest){
				console.log("new highest; "+calc);
				highest = calc;
			}
		}
	}
	return highest;
}



part1 = findRoute(30);
console.log("Answer for part 1; "+part1);

part2 = findDoubleRoute(26, 2000);
console.log("Answer for part 2; "+part2);
