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

var monkeydata = data.split("\r\n\r\n");



var monkey = [];
var monkeyb = [];
var inspects = [];
var inspectsb = [];
var lcd = 1;
for(var i = 0; i < monkeydata.length; i++){
	var mlines = monkeydata[i].split("\r\n");
	var mid = Number(mlines[0].slice(7,8));
	var mitems = mlines[1].slice(18).split(", ");
	var mitemsb = mlines[1].slice(18).split(", ");
	for(var mi = 0; mi < mitems.length; mi++){
		mitems[mi] = Number(mitems[mi]);
		mitemsb[mi] = Number(mitemsb[mi]);
	}
	var mop = mlines[2].slice(23,24);
	var mopn = Number(mlines[2].slice(25));
	if(mlines[2].slice(25) == "old")mopn = "old";
	var mdiv = Number(mlines[3].slice(21));
	var mtrue = Number(mlines[4].slice(29));
	var mfalse = Number(mlines[5].slice(30));
	lcd *= mdiv;
	monkey[mid] = {
		"items": mitems,
		"op": mop,
		"opnr": mopn,
		"div": mdiv,
		"t": mtrue,
		"f": mfalse
	}
	monkeyb[mid] = {
		"items": mitemsb,
		"op": mop,
		"opnr": mopn,
		"div": mdiv,
		"t": mtrue,
		"f": mfalse
	}
	inspects[mid] = 0;
	inspectsb[mid] = 0;
}

var rounds = 20;
//console.log(monkey);
for(var r = 0; r < rounds; r++){
	for(var m = 0; m < monkey.length; m++){
		//console.log(monkey[m].items);
		while(monkey[m].items.length > 0){
			inspects[m]++;
			var item = monkey[m].items.shift();
			if(monkey[m].op == "*"){
				if(monkey[m].opnr == "old"){
					item *= item;
				}else{
					item *= monkey[m].opnr;
				}
			}else{
				item += monkey[m].opnr;
			}
			item = Math.floor(item/3);
			
			if(item%monkey[m].div == 0){
				monkey[monkey[m].t].items.push(item);
			}else{
				monkey[monkey[m].f].items.push(item);
			}
		}
	}
}



inspects.sort(function(a, b) {return b - a;});
//console.log(inspects);
var part1 = inspects[0]*inspects[1];

console.log("Answer for part 1; "+part1);


rounds = 10000;


//console.log(monkey);
for(var r = 0; r < rounds; r++){
	for(var m = 0; m < monkeyb.length; m++){
		//console.log(monkey[m].items);
		while(monkeyb[m].items.length > 0){
			inspectsb[m]++;
			var item = monkeyb[m].items.shift();
			if(item > lcd) item = (item%lcd);
			if(monkeyb[m].op == "*"){
				if(monkeyb[m].opnr == "old"){
					item *= item;
				}else{
					item *= monkeyb[m].opnr;
				}
			}else{
				item += monkeyb[m].opnr;
			}
			if(item%monkeyb[m].div == 0){
				monkeyb[monkeyb[m].t].items.push(item);
			}else{
				monkeyb[monkeyb[m].f].items.push(item);
			}
		}
	}
	//if(r == 1 || r == 20 || r == 1000 || r == 2000 || r == 3000)console.log(inspectsb);
}
//console.log(monkeyb);

inspectsb.sort(function(a, b) {return b - a;});
//console.log(inspectsb);
var part2 = inspectsb[0]*inspectsb[1];
console.log("Answer for part 2; "+part2);

// 17692755969 - too low

