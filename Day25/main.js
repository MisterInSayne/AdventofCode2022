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


var part1 = 0;
var val = {"=":-2,"-":-1,"0":0,"1":1,"2":2};
var rVal = {'-2':"=",'-1':"-",0:"0",1:"1",2:"2"};
var snafuRange = [];

function addSnafu(n, i){
	var nN = (snafuRange[i]?snafuRange[i]:0)+n;
	if(nN > 2){
		nN -= 5;
		addSnafu(1, i+1);
	}else if(nN < -2){
		nN += 5;
		addSnafu(-1, i+1);
	}
	snafuRange[i] = nN;
}

for(var i = 0; i < data.length; i++){
	//var numb = data[i].split("");
	var total = 0;
	for(var n = 0; n < data[i].length; n++){
		var c = data[i].charAt(data[i].length-(n+1));
		total += Math.max(5**n, 1)*val[c];
		addSnafu(val[c], n);
	}
	//console.log(data[i]+" is "+total);
	part1 += total;
}
//console.log(snafuRange);
console.log("Number total is "+part1);

var answer = "";
for(var s = 0; s < snafuRange.length; s++){
	answer = rVal[snafuRange[s]]+answer;
}

console.log("Answer for Day 25; "+answer);