let AtomsNumber = 3;
let AtomsColors = ['red', 'yellow', 'yellow', 'green','blue', 'yellow', 'purple'];

let _width  = 600;
let _height = 400;

let posX = _width / 4;
let posY = _height / 4;

let angle = 0; //RADIANS!! --> 0 == 6.28
let dist = 3;
let line_size  = 0.1;
let ISO = false;

let points = [];
let pointsAtoms = [];

function makeGrid(_a, _b, _c, rows, cols, zett, points){
  for (let i = 0; i < rows; i++){
  for (let j = 0; j < cols; j++){
  for (let k = 0; k < zett; k++){
    let cor_x = (j*_a.x + i*_b.x + k*_c.x);
    let cor_y = (j*_a.y + i*_b.y + k*_c.y);
    let cor_z = (j*_a.z + i*_b.z + k*_c.z);
    let a_b = createVector(cor_x, cor_y, cor_z);
    points.push(a_b);
  }}}
}

function putAtoms(Atoms, _a, _b, _c, rows, cols, zett, pointsAtoms){
  const biggestNum = findMax(Atoms);
  for (let u = 0; u < Atoms.length; u++) {
  let pointsAtom = [];
  for (let i = 0; i < rows; i++){
  for (let j = 0; j < cols; j++){
  for (let k = 0; k < zett; k++){
    let cor_x = (j*_a.x + i*_b.x + k*_c.x) + Atoms[u].x;
    let cor_y = (j*_a.y + i*_b.y + k*_c.y) + Atoms[u].y;
    let cor_z = (j*_a.z + i*_b.z + k*_c.z) + Atoms[u].z;
    let a_b = createVector(cor_x, cor_y, cor_z);
    if (a_b.x > biggestNum || a_b.y > biggestNum || a_b.z > biggestNum){}
    else{pointsAtom.push(a_b);}
  }}}
  pointsAtoms.push(pointsAtom);
  }
}

function proj3D(points, projected){
///////////////////////////////////////////#
  const rotationZ = [                    //#
    [cos(angle), -sin(angle), 0],        //#
    [sin(angle), cos(angle), 0],         //#
    [0, 0, 1],                           //#
  ];                                     //#
                                         //#
  const rotationX = [                    //#
    [1, 0, 0],                           //#
    [0, cos(angle), -sin(angle)],        //#
    [0, sin(angle), cos(angle)],         //#
  ];                                     //#
                                         //#
  const rotationY = [                    //#
    [cos(angle), 0, sin(angle)],         //#	
    [0, 1, 0],                           //#
    [-sin(angle), 0, cos(angle)],        //#
  ];                                     //#
///////////////////////////////////////////#
  for (let i = 0; i < points.length; i++) {
    let rotated;
    rotated = matmul(rotationY, points[i]);
    //rotated = matmul(rotationX, rotated);
    //rotated = matmul(rotationZ, rotated);
    
    let z;
    if (ISO) {z = 1/dist;} else {
      z = 1 / (dist - rotated.z);
    } 

    const projection = [
      [z, 0, 0],
      [0, z, 0],
    ]; 

    let projected2d = matmul(projection, rotated);
    projected2d.mult(200);
    
    projected[i] = projected2d;
  }
}

function makeSpheres(projected, sz, clr=255){
  for (let i = 0; i < projected.length; i++) {
    stroke(clr);
    strokeWeight(sz);
    noFill();
    const v = projected[i];
    point(v.x, v.y);
  }
}

function connect(i, j, points) {
  const a = points[i];
  const b = points[j];
  strokeWeight(line_size);
  stroke(255);
  line(a.x, a.y, b.x, b.y);
}

function makeConnections(projected){
  for (let k = 0; k < zett; k++){
  for (let i = 0; i < zett * rows    ; i+=zett){
  for (let j = 0; j < zett * (cols-1); j+=zett){
    connect(k + i*cols + j, k + i*cols + j+zett, projected);
  }}}

  for (let k = 0; k < zett; k++){
  for (let i = 0; i < zett * (rows-1); i+=zett){
  for (let j = 0; j < zett * cols    ; j+=zett){
    connect(k + j + i*cols, k + j + (i+zett)*cols, projected);
  }}}

  for (let k = 0; k < zett-1; k++){
  for (let i = 0; i < zett * rows; i+=zett){
  for (let j = 0; j < zett * cols; j+=zett){
    connect(k + i*cols + j, k + i*cols + j + 1 , projected);
  }}}
}

function findMax(Atoms){
  let maxNum = 1;
  for (let atom=0; atom < AtomsNumber; atom++){
    let atomCoor = Atoms[atom].array()
       let coorMax = Math.max(...atomCoor);
       if (coorMax > maxNum){
         maxNum = coorMax;
       }
  }
  return maxNum;
}

///////////////////////////////////////////////////////////////////////
////////////////////////////// MAIN CODE //////////////////////////////
///////////////////////////////////////////////////////////////////////
let checkbox;

let rows = 2; //Y --> DOWN-WARDS
let cols = 2; //X --> RIGHT-WARDS
let zett = 2; //Z --> IN-WARDS

function setup() {
  var canvas = createCanvas(_width, _height);
  canvas.parent('sketch-holder');
  
  checkbox = createCheckbox('ISOMETRIC', false);
  checkbox.changed(myCheckedEvent);

  let _a = createVector(3.186737, 0, 0);
  let _b = createVector(-1.593369, 2.759796, 0);
  let _c = createVector(0, 0, 23.189237);
  
  makeGrid(_a, _b, _c, rows, cols, zett, points);
  
  let r1 = createVector(0.0, 1.839864, 11.594615);
  let r2 = createVector(0.0, 0.0, 13.183303);
  let r3 = createVector(1.593369, 0.919932, 10.005937);
  let Atoms = [r1, r2, r3];
  dist = 2*findMax(Atoms) + 1;

  putAtoms(Atoms, _a, _b, _c, rows, cols, zett, pointsAtoms);

}

function draw() {
  background(0);
  translate(posX, posY);

  let projected = [];
  proj3D(points, projected);
  makeSpheres(projected, 1);

  for (let atom = 0; atom < AtomsNumber; atom++){
    let projectedAtoms = [];
    proj3D(pointsAtoms[atom], projectedAtoms);
    makeSpheres(projectedAtoms, 16, AtomsColors[atom]);
  }

  // Connecting
  makeConnections(projected);
  
  if (mouseIsPressed === true) {
    if (mouseButton === CENTER) {
      posX = mouseX;
      posY = mouseY;
      }
    if (mouseButton === LEFT) {
      angle = mouseX/_width;
      }
  }
}


function mouseWheel(event) {
  dist += event.delta / 100;
}

function myCheckedEvent() {
  if (checkbox.checked()) {
    ISO = true;
  } else {
    ISO = false;
  }
}