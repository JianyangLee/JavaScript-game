/*
  Inspired from Daniel Shiffman's Coding Challenge #145: 2D Raycasting
  https://youtu.be/TOEi6T2mtHo
  
  You control a Particle using the Arrow Keys
  The objective is to get to the End: the green point on the top right
  
  The Particle has an array of Rays pointing in front of it
  Each Ray checks if it intersects with a wall, and return a point at the intersection of the closest wall (Boundary object)
  These points are used to render the visual field
  Collision detection is implemented for horizontal and vertical walls
*/
let show = false;
let particle;
let walls = [];
const w = 4;
let end;
let level2;

function setup() {
  createCanvas(800, 600);
  walls = loadLevel(1, w);
  particle = new Particle(25, 25);
  end = { pos: createVector(775, 25), diameter: 16 };
}

function draw() {
  background(0);

  // Uncomment next line to see the walls. CAREFUL, IT'S CHEATING!
  if (show)
    for (let wall of walls) {
      wall.show(w);
    }

  // Most of the code is related to the update method of the particle
  particle.update(walls, w);

  // Draws the End (the green point on the top right) and checks collision with the particle
  drawEnd();
  checkEnd();
}

function drawEnd() {
  noStroke();
  fill(100, 255, 100);
  ellipse(end.pos.x, end.pos.y, end.diameter);
}

function checkEnd() {
  if (particle.pos.dist(end.pos) < particle.diameter / 2 + end.diameter / 2) {
    goLevel2();
  }
}

// keyPressed and keyReleased are used to control the movement of the particle
function keyPressed() {
  switch (keyCode) {
    case UP_ARROW:
      particle.go("up", true);
      break;
    case DOWN_ARROW:
      particle.go("down", true);
      break;
    case RIGHT_ARROW:
      particle.go("right", true);
      break;
    case LEFT_ARROW:
      particle.go("left", true);
      break;
    case ENTER:
      show = true;
      break;
  }
}

function keyReleased() {
  switch (keyCode) {
    case UP_ARROW:
      particle.go("up", false);
      break;
    case DOWN_ARROW:
      particle.go("down", false);
      break;
    case RIGHT_ARROW:
      particle.go("right", false);
      break;
    case LEFT_ARROW:
      particle.go("left", false);
      break;
    case ENTER:
      show = false;
      break;
  }
}
