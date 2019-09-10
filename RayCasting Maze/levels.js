// Function to create all the walls of a level
function loadLevel(lvl, w) {
  let walls = [];
  let nextWallId = 0;

  // Function to make 1 wall
  function makeWall(x1, y1, x2, y2) {
    walls.push(new Boundary(nextWallId, x1, y1, x2, y2));
    nextWallId++;
  }

  // Function to make a series a walls
  function makeWalls(coordinates) {
    const c = coordinates;
    if (c.length < 2) return;
    for (let i = 0; i < c.length - 1; i++) {
      makeWall(c[i][0], c[i][1], c[i + 1][0], c[i + 1][1]);
    }
  }

  // Borders of the window
  const [x1, y1, x2, y2] = [w / 2, w / 2, width - w / 2, height - w / 2];
  makeWalls([[x1, y1], [x2, y1], [x2, y2], [x1, y2], [x1, y1]]);

  /************************************************************
    PART 1
  ************************************************************/
  // First Room
  makeWalls([[100, 50], [100, 100], [50, 100]]);

  // First cul-de-sac
  makeWalls([[150, 0], [150, 150], [50, 150], [50, 100]]);

  // First corridor
  makeWall(0, 200, 100, 200);
  makeWalls([[150, 200], [200, 200], [200, 50]]);

  /************************************************************
    PART 2
  ************************************************************/
  // Sub-part 2.1
  makeWalls([[50, 250], [50, 550], [200, 550], [200, 600]]);
  makeWall(100, 250, 100, 500);
  makeWall(150, 250, 150, 500);
  makeWalls([[200, 200], [200, 500], [100, 500]]);

  // Sub-part 2.2
  makeWalls([[400, 50], [500, 50], [500, 200]]);
  makeWalls([[450, 100], [450, 200], [600, 200]]);
  makeWall(550, 50, 550, 150);

  /************************************************************
    PART 3
  ************************************************************/
  makeWall(250, 0, 250, 50);
  makeWall(300, 100, 300, 150);
  makeWall(350, 100, 350, 200);
  makeWalls([[250, 100], [250, 200], [400, 200]]);
  makeWalls([[300, 50], [400, 50], [400, 150]]);

  /************************************************************
    PART 4
  ************************************************************/

  makeWalls([[300, 300], [350, 300], [350, 350], [300, 350], [300, 300]]);
  makeWalls([[450, 300], [500, 300], [500, 350], [450, 350], [450, 300]]);
  makeWalls([[450, 450], [500, 450], [500, 500], [450, 500], [450, 450]]);
  makeWalls([[300, 450], [350, 450], [350, 500], [300, 500], [300, 450]]);

  /************************************************************
    PART 5
  ************************************************************/
  // Sub-part 5.1
  makeWall(600, 250, 600, 550);
  makeWalls([[650, 250], [700, 250], [700, 300], [650, 300], [650, 250]]);
  makeWalls([[650, 350], [750, 350], [750, 200]]);

  // Sub-part 5.2
  makeWalls([[650, 500], [750, 500], [750, 550], [650, 550], [650, 500]]);
  makeWalls([[650, 500], [650, 400], [800, 400]]);
  makeWall(700, 450, 750, 450);

  /************************************************************
    LAST PART
  ************************************************************/
  makeWall(750, 0, 750, 50);
  makeWalls([[700, 50], [700, 100], [800, 100]]);
  makeWalls([[650, 0], [650, 150], [750, 150]]);
  makeWalls([[600, 50], [600, 200], [750, 200], [750, 150]]);

  return walls;
}

function goLevel2() {
  level2 = document.querySelector("#level2");
  let nextLevel = document.createElement("iframe");
  nextLevel.setAttribute("style", "border: none");
  nextLevel.setAttribute("allow", "autoplay");

  level2.appendChild(nextLevel);
  noLoop();
}
