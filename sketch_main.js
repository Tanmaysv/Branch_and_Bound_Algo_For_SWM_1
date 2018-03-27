var vertices = [];                     //0-BASED INDEXINGS
var map_vertices = [];                 //MAPS THE MAP-ID OF A BIN TO ITS BIN-ID....1-BASED INDEXING
var counter = 1;  //to maintain ID of each node
var cost_info = "";
var N = 4;
var final_path = [];
var final_res = Number.MAX_VALUE;
var config = {
        apiKey: "AIzaSyC1TTTZSYb-RF9QsAhFb2WwwlhbJrzgeDI",
        authDomain: "bandbswm.firebaseapp.com",
        databaseURL: "https://bandbswm.firebaseio.com",
        projectId: "bandbswm",                                      //FIREBASE INITIALIZATION CODE
        storageBucket: "bandbswm.appspot.com",
        messagingSenderId: "251417649853"
      };
firebase.initializeApp(config);
	var database = firebase.database();
	var fill_info = 0;
	
	
	
	//console.log(fill_info["bin1"]);





var tick = 5;
function feed_image(){


		//var url_ip = document.getElementById("entered-url")
		
		//var entered_url = url_ip.value;
		var entered_url = localStorage["url_ip"];
		var canvas = document.getElementById("myCanvas");




		
        var ctx = canvas.getContext("2d");
        var img = document.getElementById("scream");
        img.src = entered_url;
        ctx.canvas.width = img.width;
        ctx.canvas.height = img.height;
        var width = ctx.canvas.width;
        var height = ctx.canvas.height;
        var offsetX = 0.5;   // center x
		var offsetY = 0.5;   // center y
		drawImageProp(ctx, img, 0, 0, width, height, offsetX, offsetY);
        if(tick > 0){
        	tick = tick - 1;
        	feed_image();
        }



}


function setup(){
	
	var canvas = document.getElementById("myCanvas");
	var ctx = canvas.getContext("2d");
	canvas.addEventListener("mousedown", mouseClick, false);
	
}

function no_nodes(){


		//N =	document.getElementById("no_of_nodes").value;
		N = localStorage["N"];
		for(var i = 1; i <= N; i++){

			document.getElementById("bin" + i).style.display = "block";
			for(var j = N; j <= 9 ; j++){
					document.getElementById("label" + j + "" + i).style.display = "none";
					document.getElementById("bin" + i).elements["e" + j].style.display = "none";

			}
 
		}




}

function insert(){
	




	for(var i = 1; i <= N; i++){                    // i === bin id, j === edge number
			
		var cost_array = [];

		for(var j =1; j <N ; j++){
			//var t = j-1;
			if(j<i){			
				cost_array[j] = document.getElementById("bin" + i).elements["e" + j].value;		
			}
			else{
				cost_array[j+1] =  document.getElementById("bin" + i).elements["e" + j].value;		
			}

		}
		/*var v = {

			x : Math.floor((Math.random() * 1000) + 1),
			y : Math.floor((Math.random() * 500) + 1),
			id : counter,
			cost : [cost_array[0], cost_array[1], cost_array[2], cost_array[3], cost_array[4]]
		};*/
		var v = vertices[i-1]; 
		v.cost = cost_array;  //edited
			//counter++;
		
	}

	
	algo(N);
		
}


function mouseClick(e){

	if(counter > N){
		return;
	}



	var color_array = {r : Math.floor((Math.random() * 128) + (Math.random() * 127) + 1), g: Math.floor((Math.random() * 128) + (Math.random() * 127) + 1), b : Math.floor((Math.random() * 128) + (Math.random() * 127) + 1)};
	//var color_array = {r : Math.floor((Math.random() * 255) + 1), g: Math.floor((Math.random() * 255) + 1), b : Math.floor((Math.random() * 255) + 1) };
	
	var canvas = document.getElementById("myCanvas");
	var ctx = canvas.getContext("2d");
 	

	var x;
	var y;
	if (e.pageX || e.pageY) { 
	  x = e.pageX;
	  y = e.pageY;
	}
	else { 
	  x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft; 
	  y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop; 
	} 
	x -= canvas.offsetLeft;
	y -= canvas.offsetTop;
	var fill_info;
	var v = {

		x : x,
		y : y,
		id : counter,
		map_id : null,
		color : color_array,
		cost : null,
		fill_level : fill_info

	}
	database.ref("/bin_info/bin" + counter + "/").once('value').then(function(snap){
			
		fill_info = snap.val();
		v.fill_level = fill_info;	
		if(counter > N){

			color_equiv_id();


		}

	});
			



	
	vertices.push(v);
	counter++;


	ctx.fillStyle = "rgb(" + color_array.r + "," + color_array.g + "," + color_array.b + ")";
	ctx.fillRect(x ,y, 16, 16);

	//fill(color_array.r, color_array.g, color_array.b);
	//stroke(255);
	//ellipse(v.x, v.y, 16, 16);

	


}

var dir = "";


function algo(N){


	//converting individual cost arrays into one cost matrix grid(N X N)
	var act_N = 0;
	for(var i = 0; i < N; i++){   //i starts from 0 since vertices array is 0-based
		if(vertices[i].fill_level >=75){
			act_N++;
			map_vertices[act_N] = vertices[i].id;         //ID MANIPULATION TO TAKE FILL_LEVEL INTO ACCOUNT AND CONSIDER ONLY FILLED BINS
		}
	}
	var temp = ++act_N;  //TO MAKE 1-BASED INDEXING OF THE COST-MATRIX
	act_N--;
	var cost_matrix = []
	
	for (var i = 0; i < temp ; i++) {
	  cost_matrix[i] = [];
	}

	

	for(var i =1; i <= act_N; i++){

		for(var j =1; j <=act_N; j++){

			if(i == j){
				cost_matrix[i][j] = 0;
				continue;
			}
			cost_matrix[i][j] = vertices[map_vertices[i] - 1].cost[map_vertices[j]] //HERE, i,j === MAP-ID OF BINs...THEREFORE, IT HAS TO BE CONVERTED TO BIN-ID

		}

	}//COST MATRIX CREATED
	
	main_algo(cost_matrix, act_N);





}




/* 
function draw(){


	while(counter < N){

		return;

	}

	//background(51);
	dir = "";


	var reached = [];
	var unreached = [];
	
	for(var i =0; i < vertices.length ; i++){        //since initially, all of the nodes are unreached
		unreached.push(vertices[i]);
	}   

	reached.push(unreached[0]);  //picking up a random starting point and putting it in our reached array !!!PROBLEM!!!

	unreached.splice(0,1);       //removing that starting point from the unreached array
	


	//MAIN ALGO STARTS HERE

	while(unreached.length > 0){
		var record = Number.MAX_VALUE;   //to evaluate the minimum of all the distances from our curr_index to the evaluated dest_index
		var curr_index;
		var dest_index;
		//var v1;
		//var v2;


		for(var i =0; i < reached.length ; i++){                //two for loops----for every element in the reached array, we loop over all elements of the unreached array

			for(var j = 0; j < unreached.length; j++){

				var v1 = reached[i];
				var v2 = unreached[j];

				//var d = dist(v1.x, v1.y, v2.x, v2.y);               //the dist() function will calculate thr edge weights based on the cartesian co-ordinates of that node in the canvas
				
				var d = v1.cost[v2.id];

				if(d < record){

					record = d;
					curr_index = i;	                        
					dest_index = j;

				}

			}

		}                               //at the end of these two loops..we get the indexes of the 
		stroke(255);
		
		line(reached[curr_index].x, reached[curr_index].y, unreached[dest_index].x, unreached[dest_index].y);

		dir = dir +  reached[curr_index].id + " -> " + unreached[dest_index].id + "<br/>";	

		reached.push(unreached[dest_index]);             // Now that we have found that nearest node, we add dt node into reaached array and remove from our unreached array
		unreached.splice(dest_index,1);
		

		if(unreached.length == 0){

			line(reached[0].x, reached[0].y, reached[reached.length-1].x, reached[reached.length -1].y);
			dir = dir +  reached[reached.length-1].id + " -> " + reached[0].id  + "<br/>";
			writeIntodiv1();		


		}

	}

	for(var i =0; i < vertices.length; i++){

		var color_array = {r : 0, g: 0, b : 0};

		if(i == 0)color_array = {r : 255, g : 0, b : 0};
		if(i == 1)color_array = {r : 0, g : 255, b : 0};
		if(i == 2)color_array = {r : 0, g : 0, b : 255};
		if(i == 3)color_array = {r : 0, g : 0, b : 0};
		
		




		 

	}
	

}
*/

function writeIntodiv1(){

	document.getElementById('directions').innerHTML = dir;


}

function writeIntodiv2(){

	document.getElementById("cost_info").innerHTML = cost_info;
	

}

function color_equiv_id(){

	var r;
	var g;
	var b;

	var table = document.getElementById("color_info");
	//table.style.border = "1px solid black";
	var head = table.insertRow(0);
	//head.style.border = "1px solid black";
	var cell1 = head.insertCell(0);
	//cell1.style.border = "1px solid black";
	var cell2 = head.insertCell(1);
	//cell2.style.border = "1px solid black";
	var cell3 = head.insertCell(2);
	//cell3.style.border = "1px solid black";
	cell1.innerHTML = "COLOR";
	cell2.innerHTML = "BIN ID";
	cell3.innerHTML = "FILL LEVEL(%) AS FETCHED FROM THE CLOUD IN REAL-TIME";
	/*firebase.initializeApp(config);
	var database = firebase.database();
	var fill_info;
	database.ref("/bin_info").once('value').then(function(snap){
			
		fill_info = snap.val();


	});
	*/

	//var x = document.createElement("TABLE");

	for(var i = 1; i <= N; i++){
		var v = vertices[i-1];
		head = table.insertRow(i);
		//head.style.border = "1px solid black";
		cell1 = head.insertCell(0);
		//cell1.style.border = "1px solid black";

		cell2 = head.insertCell(1);
		//cell2.style.border = "1px solid black";

		cell3 = head.insertCell(2);
		//cell3.style.border = "1px solid black";
		r = v.color.r;
		g = v.color.g;
		b = v.color.b;
		cell1.style.background = "rgb(" +r+ "," + g + "," + b + ")";
		cell2.innerHTML = v.id; 
		
		
		cell3.innerHTML = v.fill_level;


	}


}



function main_algo(cost_matrix, act_N){

	var final_path = [];
	var curr_path = [];
	var verify = document.getElementById("info_verify");
	var text = "";
	var temp = ++act_N;
	act_N--;
	var visited = [];
	/*for(var i = 1; i < temp;i++ ){

		for(var j = 1 ; j < temp; j++){

			text = text + cost_matrix[i][j] + " ";
			
		}

	text = text + "<br>"


	}
	*/
	//end of for loops
	//verify.innerHTML = text;


	var curr_bound = 0;
	for (var i=1; i<=act_N; i++){
        	curr_bound += (parseInt(firstMin(cost_matrix, i, act_N)) + parseInt(secondMin(cost_matrix, i, act_N)));

	}
	curr_bound = (curr_bound % 2 == 1)? curr_bound/2 + 1 :curr_bound/2;

	visited[1] = true;
	for(var i =2; i <= act_N; i++){

		visited[i] = false;

	}

	curr_path[0] = 1;
	TSPRec(cost_matrix, curr_bound, 0, 1, curr_path, final_path, act_N, visited);
	conv_final_path(final_path);                //convert map_id final path to bin_id final path using map_vertices array
	draw_lines(final_path, act_N);	

	var path = "<br>";
	for(var i = 0; i <act_N ; i++){

		path += final_path[i]  + " -> ";                  //HERE, FINAL_PATH CONSISTS OF MAP_ID INSTEAD OF BIN_ID..HENCE, IT NEEDS MANIPULATION
	}
	path +=  final_path[act_N] + "<br>" + "Total Cost for taking the above path : " + final_res;
	verify.innerHTML = path;

    
}



function TSPRec(cost_matrix, curr_bound, curr_weight,level,curr_path, final_path, act_N, visited)
{
    // base case is when we have reached level N which
    // means we have covered all the nodes once
    if (level==act_N)
    {
        // check if there is an edge from last vertex in
        // path back to the first vertex
        if (cost_matrix[curr_path[level-1]][curr_path[0]] != 0)
        {
            // curr_res has the total weight of the
            // solution we got
            var curr_res = parseInt(curr_weight) +
                    parseInt(cost_matrix[curr_path[level-1]][curr_path[0]]);
 
            // Update final result and final path if
            // current result is better.
            if (curr_res < final_res)
            {
                copyToFinal(curr_path, final_path, act_N);
                final_res = curr_res;
            }     
        }
        return;
    }
 
    // for any other level iterate for all vertices to
    // build the search space tree recursively
    for (var i=1; i<=act_N; i++)
    {
        // Consider next vertex if it is not same (diagonal
        // entry in adjacency matrix and not visited
        // already)
        if (cost_matrix[curr_path[level-1]][i] != 0 &&
            visited[i] == false)
        {
            var temp = curr_bound;
            curr_weight += parseInt(cost_matrix[curr_path[level-1]][i]);
                        
            // different computation of curr_bound for
            // level 2 from the other levels
            if (level==1){
              curr_bound -= ((firstMin(cost_matrix, curr_path[level-1], act_N) +
                             firstMin(cost_matrix, i, act_N))/2);
            }
            else{
              curr_bound -= ((secondMin(cost_matrix, curr_path[level-1], act_N) +
                             firstMin(cost_matrix, i, act_N))/2);
            }
 
            // curr_bound + curr_weight is the actual lower bound
            // for the node that we have arrived on
            // If current lower bound < final_res, we need to explore
            // the node further
            if (curr_bound + curr_weight < final_res)             //THIS IS WHERE THE BOUNDING HAPPENS
            {
                curr_path[level] = i;
                visited[i] = true;
 
                // call TSPRec for the next level
                TSPRec(cost_matrix, curr_bound, curr_weight, parseInt(level)+1,
                       curr_path, final_path, act_N, visited);
            }
 
            // Else we have to prune the node by resetting
            // all changes to curr_weight and curr_bound
            curr_weight -= cost_matrix[curr_path[level-1]][i];
            curr_bound = temp;
 
            // Also reset the visited array
            for(var j = 1; j <= act_N; j++){
            	visited[j] = false;
            }
            for (var j=0; j<=level-1; j++)
                visited[curr_path[j]] = true;
        }
    }
}





function secondMin(cost_matrix, i, act_N)
{
    var first = Number.MAX_VALUE; 
    var	second = Number.MAX_VALUE;
    for (var j=1; j<=N; j++)
    {
        if (i == j)
            continue;
 
        if (cost_matrix[i][j] <= first)
        {
            second = first;
            first = cost_matrix[i][j];
        }
        else if (cost_matrix[i][j] <= second &&
                 cost_matrix[i][j] != first)
            second = cost_matrix[i][j];
    }
    return parseInt(second);
}

function firstMin(cost_matrix, i, act_N)
{
    var min = Number.MAX_VALUE;
    for (var k=1; k<=N; k++)
        if (cost_matrix[i][k]<min && i != k)
            min = cost_matrix[i][k];
    return parseInt(min);
}

function copyToFinal(curr_path, final_path, act_N)
{
    for (var i=0; i<act_N; i++)
        final_path[i] = curr_path[i];
    final_path[act_N] = curr_path[0];
}

function draw_lines(final_path, act_N){
	var v1;
	var v2;

	
	for(var i =0; i < act_N; i++){
		v1 = vertices[final_path[i]-1];
		v2 = vertices[final_path[i + 1]-1];
		var c = document.getElementById("myCanvas");
		var ctx = c.getContext("2d");
		ctx.lineWidth=5;
		ctx.beginPath();
		ctx.moveTo(v1.x,v1.y);
		ctx.lineTo(v2.x, v2.y);
		ctx.stroke();

	}



}
function conv_final_path(final_path){

	for(var i = 0; i <final_path.length; i++){
		final_path[i] = map_vertices[final_path[i]];
	}
}

function drawImageProp(ctx, img, x, y, w, h, offsetX, offsetY) {

    if (arguments.length === 2) {
        x = y = 0;
        w = ctx.canvas.width;
        h = ctx.canvas.height;
    }

    // default offset is center
    offsetX = typeof offsetX === "number" ? offsetX : 0.5;
    offsetY = typeof offsetY === "number" ? offsetY : 0.5;

    // keep bounds [0.0, 1.0]
    if (offsetX < 0) offsetX = 0;
    if (offsetY < 0) offsetY = 0;
    if (offsetX > 1) offsetX = 1;
    if (offsetY > 1) offsetY = 1;

    var iw = img.width,
        ih = img.height,
        r = Math.min(w / iw, h / ih),
        nw = iw * r,   // new prop. width
        nh = ih * r,   // new prop. height
        cx, cy, cw, ch, ar = 1;

    // decide which gap to fill    
    if (nw < w) ar = w / nw;                             
    if (Math.abs(ar - 1) < 1e-14 && nh < h) ar = h / nh;  // updated
    nw *= ar;
    nh *= ar;
		// calc source rectangle
    cw = iw / (nw / w);
    ch = ih / (nh / h);

    cx = (iw - cw) * offsetX;
    cy = (ih - ch) * offsetY;

    // make sure source rectangle is valid
    if (cx < 0) cx = 0;
    if (cy < 0) cy = 0;
    if (cw > iw) cw = iw;
    if (ch > ih) ch = ih;

    // fill image in dest. rectangle
    ctx.drawImage(img, cx, cy, cw, ch,  x, y, w, h);
}