const fs = require('fs')
const { performance } = require('perf_hooks');

console.clear();

var files = ['Input.txt', 'Example.txt'];
var file = 0;
var inputData = null;
console.log("Using: "+files[file]);
try {
	inputData = fs.readFileSync(files[file], 'utf8');
} catch (err) {
	console.error(err)
}

var _DEBUG = false;

var data = inputData.split("\r\n");

function isNumber(value){return typeof value === 'number' && isFinite(value);}
var part1 = 0;
var part2 = 0;
var monkeys = {};

class Monkey {
	constructor(n, val) {
		this.name = n;
		this.setVal(val);
		this.isHumn = (n == 'humn');
		this.humnSide = [false, false, false];
	}
	
	setVal(val){
		this.val = val;
		this.math = val.split(" ");
		this.isN = (this.math.length == 1);
		this.n = Number(val);
		this.eMath = "monkeys['"+this.math[0]+"'].getVal()"+this.math[1]+"monkeys['"+this.math[2]+"'].getVal()";
	}
	
	getVal(recalc=false){
		if(this.isN)return this.n;
		if(!this.isCalc || recalc){
			var out = eval(this.eMath);
			this.cn = out;
			this.isCalc = true;
			return out;
		}else{
			return this.cn;
		}
	}
	
	traceHumn(){
		if(this.isHumn)return true;
		if(this.isN)return false;
		if(monkeys[this.math[0]].traceHumn()){ this.humnSide[0] = true; this.isHumn = true; }
		if(monkeys[this.math[2]].traceHumn()){ this.humnSide[2] = true; this.isHumn = true; }
		if(this.humnSide[0] && this.humnSide[2])console.log("You're fucked.");
		return this.isHumn;
	}
	
	getPart2(val=0){
		if(_DEBUG)console.log("testing "+this.name+" with val "+val);
		if(this.name == "humn")return val;
		var humnside = (this.humnSide[0])?0:2;
		var mnkyside = (this.humnSide[0])?2:0;
		var monkeySide = monkeys[this.math[mnkyside]].getVal();
		if(_DEBUG)console.log("Monkey side is "+monkeySide);
		
		var get = 0;
		switch(this.math[1]){
			case "==": get = monkeySide; break;
			case "*": get = val/monkeySide; break;
			case "/": get = (mnkyside)?val*monkeySide:monkeySide/val; break;
			case "+": get = val-monkeySide; break;
			case "-": get = (humnside)?monkeySide-val:monkeySide+val; break;
			
		}
		if(_DEBUG)console.log("Calc is "+((humnside)?monkeySide:get)+" "+this.math[1]+" "+((mnkyside)?monkeySide:get)+" = "+ val);
		return monkeys[this.math[humnside]].getPart2(get)
	}
}

for(var i = 0; i < data.length; i++){
	var [name, val] = data[i].split(': ');
	monkeys[name] = new Monkey(name, val);
}


part1 = monkeys["root"].getVal();
console.log("Answer for part 1; "+part1);

monkeys["root"].setVal(monkeys["root"].math[0]+" == "+monkeys["root"].math[2]);
monkeys["root"].traceHumn();

part2 = monkeys["root"].getPart2(0);
console.log("Answer for part 2; "+part2);

//2338714872588.7305 ?? too low.