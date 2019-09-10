// A wall, you cannot see past it
class Boundary {
  constructor(id, x1, y1, x2, y2) {
    this.id = id // id of the wall, to be able to render the fragments (cf. Particle)
    this.a = createVector(x1, y1)
    this.b = createVector(x2, y2)
  }
  
  show(w) {
    stroke(100, 100, 255)
    strokeWeight(w)
    line(this.a.x, this.a.y, this.b.x, this.b.y)
  }
}