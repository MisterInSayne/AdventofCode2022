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
var _DEBUG = 1;

var pushdata = data.split("");

var part1 = 0;
var part2 = 0;

function getTop(arr){
	var high = 0; 
	for(var i = 0; i < arr.length; i++){
		if(arr[i].length > high)high = arr[i].length;
	}
	return high;
}

function getBottom(arr){
	var low = 100000000; 
	for(var i = 0; i < arr.length; i++){
		if(arr[i].length < low)low = arr[i].length;
	}
	return low;
}


var pattern = [[[0,0,0,0],[1,1,1,1]],[[1,0,1],[2,3,2]],[[0,0,0],[1,1,3]],[[0],[4]],[[0,0],[2,2]]];

function calcTower(rocks){
	var repeat = [];
	var foundGoodRepeat = false;
	var stripped = 0;
	var towers = [[],[],[],[],[],[],[]];
	var s = 0;
	var sl = pushdata.length;
	for(var r = 0; r < rocks; r++){
		var p = r%5;
		var y = getTop(towers)+3;
		var x = 2;
		var rest = false;
		while(!rest){
			if(pushdata[s%sl] == "<"){
				if(x > 0){
					var blocked = false;
					for(var i = 0; i < pattern[p][0].length; i++){
						for(var iy = pattern[p][0][i]; iy < pattern[p][1][i]; iy++){
							if(towers[(x-1)+i].length > y+iy && towers[(x-1)+i][y+iy] == 1)blocked = true;
						}
					}
					if(!blocked)x--;
				}
			}else{
				if(x < 7-pattern[p][0].length){
					var blocked = false;
					for(var i = 0; i < pattern[p][0].length; i++){
						for(var iy = pattern[p][0][i]; iy < pattern[p][1][i]; iy++){
							if(towers[x+1+i].length > y+iy && towers[x+1+i][y+iy] == 1)blocked = true;
						}
					}
					if(!blocked)x++;
				}
			}
			
			for(var i = 0; i < pattern[p][0].length; i++){
				if(y+pattern[p][0][i] == 0){rest = true; }
				if(towers[x+i].length >= y+pattern[p][0][i] && towers[x+i][y+pattern[p][0][i]-1] == 1){
					rest = true;
				}
			}
			
			if(rest){
				for(var i = 0; i < pattern[p][0].length; i++){
					for(var tl = towers[x+i].length; tl < y+pattern[p][0][i]; tl++){ towers[x+i][tl] = 0; }
					for(var iy = y+pattern[p][0][i]; iy < y+pattern[p][1][i]; iy++){ towers[x+i][iy] = 1; }
				}
				var bottom = getBottom(towers);
				for(var t = 0; t < towers.length; t++){
					towers[t].splice(0, bottom);
				}
				stripped += bottom;
			}else{
				y--;
			}
			s++;
			if(!foundGoodRepeat){
				if(s%sl == 0){
					var pre = "";
					if(_DEBUG >= 2)for(var i = Math.max(1, Math.floor(s/10)); i < 10000000; i *= 10){ pre += " ";}
					if(_DEBUG >= 2)console.log(pre+s+"; x: "+x+" y: "+y+" p: "+p);
					var found = false;
					for(var i = 0; i < repeat.length; i++){
						if(repeat[i].x == x && repeat[i].y == y && repeat[i].p == p){
							found = true;
							repeat[i].f++;
							repeat[i].s.push(s);
							repeat[i].r.push(r);
							repeat[i].strip.push(stripped);
							if(repeat[i].f > 3){
								if(_DEBUG >= 1)console.log("Found repeat!");
								if(_DEBUG >= 2)console.log("repeats at "+ repeat[i].s.toString());
								var cycle = (repeat[i].s[1]-repeat[i].s[0]);
								if(_DEBUG >= 2)console.log("Proper repeat: "+(repeat[i].s[0] + (cycle*2) == repeat[i].s[2]));
								if(_DEBUG >= 2)console.log("Cycle calculated as: "+cycle);
								if(_DEBUG >= 2)console.log("Strips are at "+ repeat[i].strip.toString());
								var stripcycle = (repeat[i].strip[1]-repeat[i].strip[0]);
								if(_DEBUG >= 2)console.log("Proper strip: "+(repeat[i].strip[0] + (stripcycle*2) == repeat[i].strip[2]));
								if(_DEBUG >= 2)console.log("Stripcycle calculated as: "+stripcycle);
								if(_DEBUG >= 2)console.log("Rocks are at "+ repeat[i].r.toString());
								var rockcycle = (repeat[i].r[1]-repeat[i].r[0]);
								if(_DEBUG >= 2)console.log("Proper rock: "+(repeat[i].r[0] + (rockcycle*2) == repeat[i].r[2]));
								if(_DEBUG >= 2)console.log("Rockcycle calculated as: "+rockcycle);
								
								foundGoodRepeat = true;
								
								stripped += (Math.floor((rocks-r)/rockcycle))*stripcycle;
								s += Math.floor((rocks-r)/rockcycle)*cycle;
								r += Math.floor((rocks-r)/rockcycle)*rockcycle;
								break;
							}
						}
					}
					if(!found){
						repeat.push({s:[s], strip: [stripped], r:[r], x:x, y:y, p:p, f:1});
					}
				}
			}
		}
		if(rocks == 1000000000000 && r%1000 == 0 && r > 0){
			var pre = "";
			for(var i = Math.max(1, Math.floor(r/10)); i < 10000000000; i *= 10){ pre += "0";}
			console.log("0."+pre+r.toString().replace(/0+$/g, "")+"% done.");
		}
	}
	
	if(rocks == 1000000000000)console.log("100% done.");
	return stripped+getTop(towers);
}



part1 = calcTower(2022);
console.log("Answer for part 1; "+part1);
part2 = calcTower(1000000000000);
console.log("Answer for part 2; "+part2);