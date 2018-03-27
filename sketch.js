var vertices = [];

function setup(){
	var canvas = createCanvas(640, 360);
	canvas.id('mainCanvas');
}

function mousePressed(){

	var v = createVector(mouseX, mouseY);
	vertices.push(v);
}

function draw(){
	background(51);


	for(var i =0; i < vertices.length; i++){
		 fill(255);
		 stroke(255);
		 ellipse(vertices[i].x, vertices[i].y, 16, 16);

	}

}
