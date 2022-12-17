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

function findFastestRoute(fromV, toV, steps, prev){
	if(steps < 1)return 50;
	//if(links[fromV] != undefined && links[fromV][toV] != undefined)return links[fromV][toV];
	if(valves[fromV].links.includes(toV))return 1;
	var shortest = []
	prev.push(fromV);
	for(var l = 0; l < valves[fromV].links.length; l++){
		if(prev.includes(valves[fromV].links[l]))continue;
		shortest.push(findFastestRoute(valves[fromV].links[l],toV,steps-1,prev.slice()));
	}
	if(shortest.length == 0)return 50;
	shortest.sort(function(a, b) {return a - b;});
	return shortest[0]+1;
}

var links = {};
var valvenames = Object.keys(valves);


for(var i = 0; i < valvenames.length; i++){
	links[valvenames[i]] = {};
	for(var v = 0; v < valvenames.length; v++){
		if(i == v)continue;
		links[valvenames[i]][valvenames[v]] = findFastestRoute(valvenames[i],valvenames[v],50,[]);
	}
}
//console.log(links);

var valvesWithFlow = [];
for(var i = 0; i < valvenames.length; i++){
	if(valves[valvenames[i]].flow == 0)continue;
	valvesWithFlow.push(valvenames[i]);
}


function findRoute(v, opened, minutes){
	var out = 0;
	if(v != 'AA'){
		opened.push(v);;
		minutes--;
		out += valves[v].flow*minutes;
	}
	if(minutes > 1){
		var outputs = [];
		for(var i = 0; i < valvesWithFlow.length; i++){
			if(valvesWithFlow[i] == v)continue;
			if(minutes-links[v][valvesWithFlow[i]] < 1)continue;
			if(opened.includes(valvesWithFlow[i]))continue;
			outputs.push(findRoute(valvesWithFlow[i], opened.slice(), minutes-links[v][valvesWithFlow[i]]));
		}
		
		if(outputs.length > 0){
			outputs.sort(function(a, b) {return b - a;});
			out += outputs[0];
		}
	}
	return out;
}


console.log(valvesWithFlow);

function findDoubleRoute(pos, min, opened){
	if(opened.length == valvesWithFlow.length)return 0;
	var outputs = [];
	var x = 2;
	if(opened.length == 0)x = 1;
	for(var p = 0; p < x; p++){
		if(min[p] < 3)continue;
		for(var i = 0; i < valvesWithFlow.length; i++){
			if(opened.includes(valvesWithFlow[i]))continue;
			if(min[p]-links[pos[p]][valvesWithFlow[i]] < 3)continue;
			if(opened.length < 2){
				if(opened.length == 0){
					console.log("checking route "+valvesWithFlow[i]);
				}else{
					console.log("Person "+p+" checking route "+opened[0]+"->"+valvesWithFlow[i]);
				}
			}
			var npos = [pos[0], pos[1]];
			var nmin = [min[0], min[1]];
			npos[p] = valvesWithFlow[i];
			nmin[p] -= links[pos[p]][valvesWithFlow[i]]+1;
			var pout = valves[valvesWithFlow[i]].flow*nmin[p];
			var nopened = opened.slice();
			nopened.push(valvesWithFlow[i]);
			var o = pout+findDoubleRoute(npos, nmin, nopened);
			outputs.push(o);
			if(opened.length == 0){
				console.log("Best: "+o);
			}
		}
	}
	if(outputs.length == 0){ return 0; }
	outputs.sort(function(a, b) {return b - a;});
	return outputs[0];
}

part1 = findRoute('AA', [], 30);
console.log("Answer for part 1; "+part1);
part2 = findDoubleRoute(['AA', 'AA'], [26, 26], []);
console.log("Answer for part 2; "+part2);
