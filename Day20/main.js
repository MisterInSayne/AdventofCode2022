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

var data = inputData.split("\r\n");

class numb {
	constructor(n, id) {
		this.n = n;
		this.id = id;
	}
	
	link(nData){
		this.prev = nData[(this.id+data.length-1)%data.length];
		this.next = nData[(this.id+data.length+1)%data.length];
	}
	
	changePos(diff){
		diff = diff%(data.length-1);
		if(diff == 0)return;
		this.prev.next = this.next;
		this.next.prev = this.prev;
		//if(diff < 0)diff--;
		var dir = (diff < 0)?"prev":"next";
		var opdir = (diff > 0)?"prev":"next";
		var pos = this;
		var norm = diff/Math.abs(diff);
		while(diff != 0){
			pos = pos[dir];
			diff -= norm;
		}
		pos[dir][opdir] = this;
		this[dir] = pos[dir];
		pos[dir] = this;
		this[opdir] = pos;
	}
	
	getPos(diff){
		if(diff == 0)return this;
		diff = diff%data.length;
		var dir = (diff < 0)?"prev":"next";
		var pos = this;
		var norm = diff/Math.abs(diff);
		while(diff != 0){
			pos = pos[dir];
			diff -= norm;
		}
		return pos;
	}
	
}

var part1 = 0;
var part2 = 0;


function generateNumbers(key){
	var nData = [];
	for(var i = 0; i < data.length; i++){
		nData[i] = new numb(Number(data[i])*key, i);
	}
	for(var i = 0; i < nData.length; i++){
		nData[i].link(nData);
	}
	return nData;
}


function printNumbs(numbers, cn){
	var print = [];
	var pnum = numbers[0];
	for(var i = 0; i < numbers.length; i++){
		print.push(pnum.n);
		pnum = pnum.next;
	}
	console.log("moving "+cn+" new: "+print);
}

function findCoordinates(key=1, loops=1){
	var numbers = generateNumbers(key);
	var coord = [];
	var found = 0;
	var l = numbers.length
	for(var k = 0; k < loops; k++){
		for(var i = 0; i < numbers.length; i++){
			var curr = numbers[i];
			if(curr.n == 0){
				found = curr.id;
			}else{
				curr.changePos(curr.n);
			}
			//printNumbs(numbers, curr.n);
		}
	}
	coord.push(numbers[found].getPos(1000).n);
	coord.push(numbers[found].getPos(2000).n);
	coord.push(numbers[found].getPos(3000).n);
	//console.log(coord);
	return coord[0]+coord[1]+coord[2];
}


part1 = findCoordinates();
console.log("Answer for part 1; "+part1);
part2 = findCoordinates(811589153,10);
console.log("Answer for part 2; "+part2);

//11037