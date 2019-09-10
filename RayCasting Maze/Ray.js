/*
  A Ray is linked to the particle, with an offset angle
  It goes straights and limits the vision of the particle to the first wall it hits
*/
class Ray {
  constructor(pos, dir, angle) {
    this.pos = pos // Position
    this.parentDir = dir // Direction
    this.relativeDir = p5.Vector.fromAngle(angle) // Offset angle from the particle direction
    this.dir = p5.Vector.fromAngle(this.parentDir.heading() + angle) // Actual angle
  }
  
  update() {
    // Set the ray direction (angle) from the direction of the Particle, and the ray offset
    const parentAngle = this.parentDir.heading()
    const relativeAngle = this.relativeDir.heading()
    this.dir = p5.Vector.fromAngle(parentAngle + relativeAngle)
  }
  
  show() {
    stroke(255)
    push()
    translate(this.pos.x, this.pos.y)
    line(0, 0, this.dir.x * 50, this.dir.y * 50)
    pop()
  }
  
  cast(wall) {
    // Checks if the ray intersects with a wall
    // If it does, check where and return the point
    const x1 = wall.a.x
    const y1 = wall.a.y
    const x2 = wall.b.x
    const y2 = wall.b.y
    
    const x3 = this.pos.x
    const y3 = this.pos.y
    const x4 = this.pos.x + this.dir.x
    const y4 = this.pos.y + this.dir.y
    
    const den1 = (x1 - x2) * (y3 - y4)
    const den2 = (y1 - y2) * (x3 - x4)
    const den = den1 - den2
    if (den === 0) return null
    
    const t1 = (x1 - x3) * (y3 - y4)
    const t2 = (y1 - y3) * (x3 - x4)
    const t = (t1 - t2) / den
    
    const u1 = (x1 - x2) * (y1 - y3)
    const u2 = (y1 - y2) * (x1 - x3)
    const u = - (u1 - u2) / den
    
    if (t > 0 && t < 1 && u > 0) {
      const pt = createVector()
      pt.x = x1 + t * (x2 - x1)
      pt.y = y1 + t * (y2 - y1)
      return pt
    } else {
      return null
    }
  }
}