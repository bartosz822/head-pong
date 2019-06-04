let video;
let poseNet;
let poses = [];

let cx = 100; 
let cy = 0;
let xspeed = 4;
let yspeed = 2;
let r = 15;

let length = 100;
let rectStart = 0
let movment = 10;

let threshold = 5;

let score = 0;

function setup() {
  let cnv = createCanvas(600, 600);
  const x = (windowWidth - width) / 2;
  const y = (windowHeight - height) / 2;
  cnv.position(x, y);
  noCursor();
  video = createCapture(VIDEO); 
  video.size(640, 480);

  // Create a new poseNet method with a single detection
  poseNet = ml5.poseNet(
    video, 
    { 
      imageScaleFactor: 0.3,
      outputStride: 16,
      flipHorizontal: false,
      minConfidence: 0.5,
      detectionType: 'single',
      multiplier: 0.50,
     },
     modelReady
     );
  // This sets up an event that fills the global variable "poses"
  // with an array every time new poses are detected
  poseNet.on('pose', function(results) {
    poses = results;
    if (poses[0] && poses[0].pose) {
      const points = poses[0].pose;
      const diff =points.leftEye.y - points.rightEye.y;
      if (diff > threshold) {
        if (rectStart > 0) {
          rectStart -= movment;
        }
      } else if (diff < -threshold) {
        if (rectStart < width - length) {
          rectStart += movment;
        }
      }
    }
  });
  // Hide the video element, and just show the canvas
  video.hide();
  noLoop();
}

function modelReady() {
  select('#status').html('Model Loaded');
  loop();
}

function draw() {
  background(0);
  ellipse(cx, cy, r*2, r*2); //bouncing ball
  cx += xspeed;
  cy += yspeed;
  if (cx >= width-r || cx <= r) {
    xspeed = xspeed*(-1);
  }
  if (cy <= 0) {
    yspeed = yspeed*(-1)
  }
  if (cy >= height+r) {
    xspeed = 0;
    yspeed = 0;
  }
  if (cy >= (height-(r*2)) && cx >= rectStart && cx <= (rectStart+length)) {
    yspeed = yspeed*(-1)
    xspeed = xspeed*(-1)
    score +=1;
    redrawScore();
  }
  if (cy  > height - r - 5) {
    alert('You loose');
    reset();
  }
  rect(rectStart, height - 11, length, 10); //bar
}

function redrawScore(){
  select('#score').html('Score: ' + score);
}

function reset(){
  score = 0;
  cx = 100; 
  cy = 0;
  xspeed = 4;
  yspeed = 2;
  redrawScore();
}