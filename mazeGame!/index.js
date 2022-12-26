const { Engine, Render, Runner, World, Bodies, Body, Events } = Matter;

const cellsHorizontal = 23  ;
const cellsVertical = 18  ;


const width = window.innerWidth - 4;
const height = window.innerHeight - 4;

const unitLengthX = width / cellsHorizontal;
const unitLengthY = height / cellsVertical;

const countDown = document.querySelector('#count-down');

const engine = Engine.create();
engine.world.gravity.y = 0;
const {world} = engine;
const render = Render.create({  
  element: document.body,
  engine: engine,
  options: {
    wireframes: false,
    width,
    height
  }
});
Render.run(render);
Runner.run(Runner.create(), engine);


// Walls
const walls = [
  Bodies.rectangle(width / 2, 0, width, 4, {isStatic: true }),
  Bodies.rectangle(width / 2, height, width, 4, {isStatic: true }),
  Bodies.rectangle(0, height / 2, 4, height, {isStatic: true }),
  Bodies.rectangle(width, height / 2, 4, height, {isStatic: true })
];

World.add(world, walls);

// Maze generation
const shuffle = (arr) => {
  let counter = arr.length;

  while(counter > 0 ){
    const index = Math.floor(Math.random() * counter);

    counter--;

    let temp = arr[counter];
    arr[counter] = arr[index];
    arr[index] = temp;
  }

  return arr;
};


// Algorithm
const grid = Array(cellsVertical).fill(null).map(() => Array(cellsHorizontal).fill(false));

const verticals = Array(cellsVertical).fill(null).map(() => Array(cellsHorizontal - 1).fill(false));

const horizontals = Array(cellsVertical - 1).fill(null).map(() => Array(cellsHorizontal).fill(false));

const startRow = Math.floor(Math.random()* cellsVertical); 
const startColumn = Math.floor(Math.random()* cellsHorizontal); 

const stepThroughCell = (row, column) => {
  //If i have visited the cell at [row][column] then return.
  if(grid[row][column]){
    return;
  }

  //Mark the grid as being visited.
  grid[row][column] = true; 

  //Assemble a randomly-ordered list  of neighbors
  const neighbors = shuffle([
    [row - 1, column, 'up'],
    [row, column + 1, 'right'],
    [row + 1, column, 'down'],
    [row, column - 1, 'left']
  ]);
  //For each neighbour...
  for(let neighbor of neighbors){
    const [nextRow, nextColumn, direction] = neighbor;

    //See if that neighbor is out of bounds
    if(nextRow < 0 || nextRow >= cellsVertical || nextColumn < 0 || nextColumn >= cellsHorizontal ){
      continue;
    }

    //If we have visited the neighbor continue to the next neighbor
    if(grid[nextRow][nextColumn]) {
      continue;
    }

    //Remove a wall from either horizontals or verticals
    if(direction === 'left'){
      verticals[row][column - 1] = true;
    } else if (direction === 'right'){
      verticals[row][column] = true;
    } else if (direction === 'up'){
      horizontals[row - 1][column] = true;
    } else  if(direction === 'down'){
      horizontals[row][column] = true;
    }

    stepThroughCell(nextRow, nextColumn);
  }

  //Visit the next cell
  
};

stepThroughCell(startRow, startColumn);



horizontals.forEach((row, rowIndex) => {
  row.forEach((open, columnIndex) => {
    if(open){
      return;
    }

    const wall = Bodies.rectangle(
      columnIndex * unitLengthX + unitLengthX / 2,
      rowIndex * unitLengthY + unitLengthY,
      unitLengthX,
      5, 
      {
        label: 'wall',
        isStatic:true,
        render: {
          fillStyle:'#ff3c38'
          // fillStyle:'#14fcee'
          // fillStyle:'#ff3c38'
          // fillStyle:'#8c1492'
          // fillStyle:'#6699cc'
        }
      }
    );
    World.add(world, wall);
  });
});

verticals.forEach((row, rowIndex) => {
  row.forEach((open, columnIndex) => {
    if(open){
      return;
    }

    const wall = Bodies.rectangle(
      columnIndex * unitLengthX + unitLengthX,
      rowIndex * unitLengthY + unitLengthY / 2,
      5,
      unitLengthY, 
      {
        label: 'wall',
        isStatic:true, 
        render: {
          index: - 1,
          fillStyle: '#ff3c38'
          // fillStyle: '#14fcee'
          // fillStyle: '#ff3c38'
          // fillStyle: '#8c1492'
          // fillStyle: '#6699cc'
        }
      }
    );
    World.add(world, wall);
  });
});

// Goal
const goal = Bodies.rectangle(
    width - unitLengthY * 0.5,
    height - unitLengthY * 0.5,
    unitLengthX * 0.9,
    unitLengthY * 1, 
    {
      label: 'goal',
      isStatic: true,
      render: {
        fillStyle: '#f4f4f4',
        // fillStyle: '#e6e6fa'
        // fillStyle: '#14fcee'
        // fillStyle: '#ff3c38'
      }
    }
);

World.add(world, goal);

// Ball
const ball = Bodies.circle(
  unitLengthX * 0.5, 
  unitLengthY * 0.5,
  unitLengthX * 0.2,
  {
    label : 'ball',
    render: {
      fillStyle: '#f4f4f',
      index: 2
      // fillStyle: '#14fcee'
      // fillStyle: '#ff3c38'
    }
  }
);

World.add(world, ball);

document.addEventListener('keydown', (event) => {
 const { x, y } = ball.velocity;
  if(ball.velocity.x > 6|| ball.velocity.y > 6||ball.velocity.x <  -6||ball.velocity.y < -6){
    return;
  };
  if(event.key === 'ArrowUp' || event.key === 'w' ){
    Body.setVelocity(ball, { x , y : y - 5 });
  }
  if(event.key === 'ArrowRight' || event.key === 'd' ){
    Body.setVelocity(ball, { x : x + 5 , y });
  }
  if(event.key === 'ArrowDown' || event.key === 's' ){
    Body.setVelocity(ball, { x, y : y + 5 });
  }
  if(event.key === 'ArrowLeft' || event.key === 'a' ){
    Body.setVelocity(ball, { x : x - 5 , y });
  }
});

// Events.on(engine, 'collisionStart', (event) => {
//   event.pairs.forEach((collision) => {

//     const labels = ['ball', 'goal'];

//     if(labels.includes(collision.bodyA.label) && labels.includes(collision.bodyB.label)){

//       document.querySelector('#win').classList.remove('hidden')

//       world.gravity.y = 1;
//       world.bodies.forEach(body => { 
//         if(body.label === 'wall') {
//           Body.setStatic(body, false);
//         }
//       });
//     }
//   });  
// });

