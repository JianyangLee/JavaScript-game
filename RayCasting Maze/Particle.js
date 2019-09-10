/*
  Main object of the sketch
  The Particle has an array of Ray objects
  It is what you control
  What you see is its visual field
*/
class Particle {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.nextPos = this.pos.copy();
    this.dir = createVector(mouseX, mouseY).normalize(); // Direction
    this.step = createVector(0, 0); //Decides the next position

    // "this.directions" keeps track of the keys pressed
    this.directions = { up: false, down: false, right: false, left: false };
    this.range = 200; // How far can the visual field go
    this.diameter = 16;
    this.collide = false;

    this.rays = [];
    let raysFor360Deg = 3600; // Concentration of rays normalized to 360 degrees
    let angle = 70; // Angle of the visual field
    for (let a = -angle / 2; a < angle / 2; a += 360 / raysFor360Deg) {
      this.rays.push(new Ray(this.pos, this.dir, radians(a)));
    }

    // Array keeping track of where the rays hit, to render the vidual field
    this.shape = [];
  }

  /******************************************************************
    GENERAL UPDATE FUNCTION
  ******************************************************************/
  update(walls, w) {
    this.getVelocities();
    this.getNextPosition();
    this.checkCollision(walls, w);
    this.updatePosition();
    for (let ray of this.rays) {
      ray.update();
    }
    this.look(walls);
    this.show(w);
  }

  /******************************************************************
    MOVEMENT
  ******************************************************************/
  // SET DIRECTIONS ACCORDING TO THE KEY PRESSED
  go(direction, boolean) {
    this.directions[direction] = boolean;
  }

  // CHANGE STEP ACCORDING TO DIRECTION
  getVelocities() {
    // Get velocity
    if (this.directions.up) {
      this.step = createVector(0, -2);
    } else if (this.directions.down) {
      this.step = createVector(0, 2);
    } else if (this.directions.right) {
      this.step = createVector(2, 0);
    } else if (this.directions.left) {
      this.step = createVector(-2, 0);
    } else {
      this.step = createVector(0, 0);
    }

    // Get angular velocity
    /* if (this.directions.right) {
      this.angleVel = this.maxAngleVel;
    } else if (this.directions.left) {
      this.angleVel = -this.maxAngleVel;
    } else {
      this.angleVel = 0;
    } */
  }

  // GET THE NEXT POSITION ACCORDING TO THE DIRECTION PRESSED
  getNextPosition() {
    // Update direction
    //this.dir.rotate(this.angleVel);
    this.dir.x = mouseX - this.pos.x;
    this.dir.y = mouseY - this.pos.y;
    this.dir.normalize();

    // Get next position, that will be checked for collision before being applied
    //const step = this.dir.copy().mult(this.vel);
    this.nextPos = this.pos.copy().add(this.step);
  }

  // UPDATE THE POSITION DEPENDING ON COLLISIONS
  updatePosition() {
    if (!this.collide) {
      this.pos.x = this.nextPos.x;
      this.pos.y = this.nextPos.y;
    }
  }

  // CHECK COLLISION BETWEEN THE PARTICLE AND THE WALLS
  checkCollision(walls, w) {
    this.collide = false;
    const dMax = this.diameter / 2 + w / 2; // Distance under which there is collision
    const pos = this.nextPos;

    for (let wall of walls) {
      // Vertical wall
      if (wall.a.x === wall.b.x) {
        // Check if the x position makes a collision possible
        if (abs(pos.x - wall.a.x) < dMax) {
          // Check if the y position makes a collision possible
          const yMin = min(wall.a.y, wall.b.y);
          const yMax = max(wall.a.y, wall.b.y);
          if (yMin < pos.y + dMax && pos.y < yMax + dMax) {
            this.collide = true;
          }
        }
      } else {
        // Horizontal wall
        // Check if the y position makes a collision possible
        if (abs(pos.y - wall.a.y) < dMax) {
          // Check if the x position makes a collision possible
          const xMin = min(wall.a.x, wall.b.x);
          const xMax = max(wall.a.x, wall.b.x);
          if (xMin < pos.x + dMax && pos.x < xMax + dMax) {
            this.collide = true;
          }
        }
      }
    }
  }

  /******************************************************************
    RAY CASTING
  ******************************************************************/
  // CAST THE RAYS TO THE WALLS
  look(walls) {
    // Array keeping track of where the rays hit, to render the vidual field
    this.shape = [];

    for (let ray of this.rays) {
      // Each ray checks the closest point at which is intersects with a wall
      // It is initialized to render a visual field corresponding to the Particle range (this.range)
      let closest = this.pos.copy().add(ray.dir.mult(this.range));
      let record = this.range;
      let wallHitId = null; // We need to know which wall the ray hit to render correctly

      for (let wall of walls) {
        // For each wall, check if the ray intersects and return where (or null)
        let pt = ray.cast(wall);
        if (pt) {
          // If the ray intersects the wall, get the distance between them
          const d = p5.Vector.dist(this.pos, pt);
          if (d < record) {
            // Keep track of which wall intersection is the closest to the particle
            closest = pt;
            wallHitId = wall.id;
            record = d;
          }
        }
      }

      // Add the closest wall intersection to the "shape" array, to later render the visual field
      // Note that if no wall was intersected closer than the particle range, the point declared here will be the end of the visual field of the particle, and wallHitId will be null
      const point = {
        pos: createVector(closest.x, closest.y),
        wallHitId
      };
      this.shape.push(point);
    }
  }

  // DISPLAYS THE PARTICLE AND THE VISUAL FIELD
  show(w) {
    // Initialize variables to highlight the walls in the visual field
    // "highlight" is an array of fragments
    // A "fragment" is a series of points on the same wall
    // Each "fragment" will be rendered as a white stroke (with vertices)
    let highlight = [];
    let fragmentId = 0;

    // Draw the vision (grey area) and prepare the "highlight" array
    noStroke();
    fill(100);

    beginShape();
    vertex(this.pos.x, this.pos.y);

    for (let i = 0; i < this.shape.length; i++) {
      // Set the vertex for the vision
      const p = this.shape[i];
      vertex(p.pos.x, p.pos.y);

      // Build an array of arrays, to highlight the walls
      if (i === 0) {
        // Initialize with the first point if i = 0
        highlight[fragmentId] = [];
        highlight[fragmentId].push(p.pos);
        continue;
      } else if (p.wallHitId === null) {
        // Skip to the next point if it doesn't hit a wall
        // So that the end of the visual field is not white, if there is no wall here
        continue;
      } else if (p.wallHitId !== this.shape[i - 1].wallHitId) {
        // Create a new fragment if the wall hit changes
        // So that there is no white stroke linking these two points
        fragmentId++;
        highlight[fragmentId] = [];
      }

      // Wether it is a new fragment or not, push the position in the fragment
      highlight[fragmentId].push(p.pos);
    }

    vertex(this.pos.x, this.pos.y);
    endShape();
    //console.log(highlight);
    // Draw the end of the rays on the walls
    stroke(255);
    strokeWeight(w);
    noFill();

    for (let fragment of highlight) {
      // Make a stroke for each fragment
      beginShape();
      for (let pos of fragment) {
        vertex(pos.x, pos.y);
      }
      endShape();
    }

    // Draw the particle
    noStroke();
    fill(255);

    ellipse(this.pos.x, this.pos.y, this.diameter);
  }
}
