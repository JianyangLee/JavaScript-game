function Pipe() {
  this.bottom = 150;
  this.top = random(height - this.bottom);
  this.x = width;
  this.w = 20;
  this.speed = 3;

  this.highlight = false;

  this.hits = function(bird) {
    if (
      bird.x + bird.radius > this.x &&
      bird.x - bird.radius < this.x + this.w
    ) {
      if (
        bird.y - bird.radius < this.top ||
        bird.y + bird.radius > this.top + this.bottom
      ) {
        this.highlight = true;
        return true;
      } else {
        bird.score += 1;
      }
    }
    this.highlight = false;

    return false;
  };

  this.show = function() {
    fill(255);
    if (this.highlight) {
      fill(255, 0, 0);
    }
    rect(this.x, 0, this.w, this.top);
    rect(
      this.x,
      this.top + this.bottom,
      this.w,
      height - this.top - this.bottom
    );
  };

  this.update = function() {
    this.x -= this.speed;
  };

  this.offScreen = function() {
    return this.x < -this.w;
  };
}
