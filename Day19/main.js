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

var _DEBUG = 0;
var _TIMER = 0;

var blueprintData = data.split("\r\n");


var part1 = 0;
var part2 = 0;
var blueprints = [];
for(var i = 0; i < blueprintData.length; i++){
	var regout = /Blueprint (?:\d+): Each ore robot costs (\d+) ore. Each clay robot costs (\d+) ore. Each obsidian robot costs (\d+) ore and (\d+) clay. Each geode robot costs (\d+) ore and (\d+) obsidian./m.exec(blueprintData[i]);
	blueprints.push([[Number(regout[1]),0,0,0], [Number(regout[2]),0,0,0], [Number(regout[3]), Number(regout[4]),0,0], [Number(regout[5]),0,Number(regout[6]),0]]);
}

//console.log(blueprints);

function canProduce(robot, robots){ return !(robot > 1 && robots[robot-1] == 0); }
function timeToBuy(robot, items, robots){
	var time = 0;
	for(var i = 0; i < items.length; i++){
		if(items[i] >= robot[i])continue;
		var t = Math.ceil((robot[i]-items[i])/robots[i]);
		if(t > time)time = t;
	}
	return time;
}

var lowest = [0,0];
function findFastest(items, robots, blueprint, cap, minutes){
	var highest = items[3]+(robots[3]*minutes);
	for(var b = blueprint.length-1; b >=0 ; b--){
		if(cap[b] <= robots[b])continue;
		if(canProduce(b, robots)){
			var time = timeToBuy(blueprint[b], items, robots)+1;
			if(time > minutes-1)continue;
			if(b != 3 && robots[3] == 0 && minutes-time < lowest[0])continue;
			var nItems = items.slice();
			var nRobots = robots.slice();
			for(var i = 0; i < nItems.length; i++){nItems[i] += (nRobots[i]*time)-blueprint[b][i];}
			nRobots[b]++;
			var geo = findFastest(nItems, nRobots, blueprint, cap, minutes-time);
			if(b == 3 && robots[3]==0){
				if((lowest[0] <= minutes-time && lowest[1] < geo) || (lowest[0] < minutes-time && lowest[1] <= geo)){
					lowest = [minutes-time, geo];
					if(_DEBUG)console.log("New lowest: "+lowest);
				}
			}
			if(geo > highest)highest = geo;
		}
	}
	
	return highest;
}

function findWorst(blueprint){
	var time = 0;
	var ore = 0;
	var clay = 0;
	var clayG = 0;
	var obs = 0;
	var obsG = 0;
	while(obs < blueprint[3][2] || ore < blueprint[3][0]){
		if(ore > blueprint[2][0] && clay > blueprint[2][1] && obs+Math.max(0,obsG*(blueprint[3][2]-ore)) < blueprint[3][2]){
			ore -= blueprint[2][0]; clay -= blueprint[2][1]; obsG++;
		}else if(ore > blueprint[1][0] && clay+Math.max(0,clayG*(blueprint[2][1]-ore)) < blueprint[2][1]){ ore -= blueprint[1][0]; clayG++;}
		ore++;
		clay += clayG;
		obs += obsG;
		time++;
	}
	if(_DEBUG)console.log("slowest to produce a geode is "+time+" minute.");
	if(_DEBUG)console.log("having "+obsG+" obs robots, "+obs+" obs, "+clayG+" Clay robots, "+clay+" clay and "+ore+" ore");
	if(_DEBUG)console.log("Needing "+blueprint[3][0]+" ore and "+blueprint[3][2]+" obs.");
	return time;
}

function getBestBluePrint(minutes, bpMax=blueprints.length){
	var geodes = [];
	bpMax = Math.min(blueprints.length, bpMax);
	for(var i = 0; i < bpMax; i++){
		
		if(_TIMER)console.log();
		if(_TIMER)console.log("Processing blueprint "+i);
		var t0 = performance.now();
		var cap = [Math.max(blueprints[i][1][0], blueprints[i][2][0], blueprints[i][3][0]), blueprints[i][2][1], blueprints[i][3][2], 100000000000];
		//console.log(cap);
		var slowest = findWorst(blueprints[i]);
		lowest = [minutes-slowest,(minutes-slowest)]
		if(_DEBUG)console.log("Slowest that will produce is in "+slowest+" minutes.");
		var output = findFastest([0, 0, 0, 0], [1, 0, 0, 0], blueprints[i], cap, minutes);
		
		var t1 = performance.now();
		if(_TIMER)console.log("Generated "+output+" geodes.");
		if(_TIMER)console.log("Calculations took "+(Math.round(t1-t0)/1000)+" seconds");
		geodes.push(output);
	}
	if(_TIMER)console.log();
	if(_DEBUG)console.log("All blueprints processed. Geode list; "+geodes);
	return geodes;
}

function calcPartOne(geodes){
	var out = 0;
	for(var i = 0; i < geodes.length; i++){ out += geodes[i]*(i+1); }
	return out;
}

function calcPartTwo(geodes){
	var out = 1;
	for(var i = 0; i < geodes.length; i++){ out *= geodes[i]; }
	return out;
}

if(_TIMER)console.log("Starting timer.");
var t0 = performance.now();
part1 = calcPartOne(getBestBluePrint(24));
var t1 = performance.now();
if(_TIMER)console.log("Calculations took "+(Math.round(t1-t0)/1000)+" seconds");
if(_TIMER)console.log();
console.log("Answer for part 1; "+part1);
if(_TIMER)console.log();
if(_TIMER)console.log("---------------------------------------");
if(_TIMER)console.log("Starting timer.");
t0 = performance.now();
part2 = calcPartTwo(getBestBluePrint(32, 3));
t1 = performance.now();
if(_TIMER)console.log("Calculations took "+(Math.round(t1-t0)/1000)+" seconds");
if(_TIMER)console.log();
console.log("Answer for part 2; "+part2);