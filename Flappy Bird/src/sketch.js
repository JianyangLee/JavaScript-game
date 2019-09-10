var bird;
var pipes = [];

function setup() {
  scoreElem = createDiv("Score : 0");
  scoreElem.position(20, 20);
  scoreElem.id = "score";
  scoreElem.style("font-weight", "bold");
  scoreElem.style("color", "white");

  createCanvas(400, 600);
  bird = new Bird();
  pipes.push(new Pipe());
}

function draw() {
  background(0);
  bird.update();
  bird.show();

  if (frameCount % 100 == 0) {
    pipes.push(new Pipe());
  }

  if (frameCount % 50 == 0) {
    this.bird.score++;
    scoreElem.html("Score : " + this.bird.score);
  }

  for (var i = pipes.length - 1; i >= 0; i--) {
    pipes[i].show();
    pipes[i].update();

    if (pipes[i].hits(bird)) {
      console.log("HIT");

      scoreElem.style("color", "red");
      scoreElem.html("Game Over. Final score : " + this.bird.score);
      noLoop();
    }

    if (pipes[i].offScreen()) {
      pipes.splice(i, 1);
    }
  }
}

function keyPressed() {
  if (key == " ") {
    bird.up();
  } else if (keyCode === ENTER) {
    clear();
    this.pipes = [];
    scoreElem.remove();
    this.setup();
    loop();
  }
}
