var gridSize = 25;
var gameTestCharge;
var looping = true;
var showFieldLinesCheckBox, showFieldVectorsCheckBox, showEquipotentialLinesCheckBox, showVoltageCheckBox, createTestChargeCheckBox, createGridCheckBox, createWallsCheckBox, snapChargeToGridCheckBox, showPopUp, fullscreen;

// const k = 8.99 * Math.pow(10, 9) adjusted because all charges are in micro coulombs;
const k = 8990;


function setup()
{
  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES);
  frameRate(60);
  fullscreen = false;
  showPopUp = false;

  //select('canvas').attribute('oncontextmenu', 'rightClick(true);return false;');
  document.getElementById("defaultCanvas0").setAttribute("oncontextmenu", "rightClick(true);return false");
  document.getElementById("menu").setAttribute("oncontextmenu", "return false");
  //oncontextmenu="rightClick(true);return false;"
  createPreset("single");
}

function draw()
{
  background(0);
  moveKeys();
  displayDataFromMenu();
  displayCharges();
  //displayFrameRate();
}



function displayDataFromMenu()
{
  noPositiveCharges = true;
  for (var charge of charges)
  {
    if (charge.charge > 0)
    {
      noPositiveCharges = false;
    }
  }

  snapChargeToGrid = snapChargeToGridCheckBox;

  if (snapChargeToGridCheckBox)
  {
     select("#createGrid").checked(true);
  }

  if (createGridCheckBox)
  {
    displayGrid();
  }

  if (showVoltageCheckBox)
  {
    displayVoltage();
  }

  if (showEquipotentialLinesCheckBox)
  {
    displayEquipotentialLines();
  }

  if (showFieldLinesCheckBox)
  {
    displayFieldLines();
  }

  if (showFieldVectorsCheckBox)
  {
    displayFieldVectors();
  }

  if (createTestChargeCheckBox)
  {
    noCursor();
    displayTestCharges();
  }
  else
  {
    cursor();
  }

  if (createWallsCheckBox)
  {
    displayWalls();
  }
}

function createDataFromMenu()
{
  getDataFromMenu();
  if (showVoltageCheckBox)
  {
    createVoltageMap();
  }
  if (showFieldLinesCheckBox)
  {
    createFieldLines();
  }
  if (showFieldVectorsCheckBox)
  {
    createFieldVectors();
  }
  if (showEquipotentialLinesCheckBox)
  {
    showEquipotentialLinesAt = [];
  }
}



function netForceAtPoint(position)
{
  for (var charge of charges)
  {
    var chargePosition = createVector(charge.position.x, charge.position.y);

    //F = KQ / (r^2)
    var kq = charge.charge  * k;
    var r = p5.Vector.dist(position, chargePosition) / gridSize;
    var rSquared = Math.pow(r,2);
    var force = kq / rSquared;

    var theta = chargePosition.sub(position).heading();
    var forceX = force * cos(theta);
    var forceY = force * sin(theta);

    var forceVectors = createVector(forceX, forceY).mult(-1);
    charge.force = forceVectors;
  }

  prevoiusFinalVector = finalVector;
  finalVector = createVector(0,0);

  for (var charge of charges)
  {
    finalVector.add(charge.force);
  }

  // if (finalVector.mag() == Infinity)
  // {
  //   console.log("Infinity");
  // }
  return finalVector;
}









function mouseReleased()
{
  if (mouseButton === LEFT && !createTestChargeCheckBox)
  {
    var chargeClicked;
    var mousePosition = createVector(mouseX, mouseY);
    for (var i = charges.length - 1; i >= 0; i--)
    {
      charges[i].selected = false;
      charges[i].dragging = false;
      var distance = mousePosition.dist(charges[i].position);
      if (distance < (chargeSize/2) && chargeClicked == null)
      {
        chargeClicked = charges[i];
      }
    }
    if (chargeClicked != null && !chargeClicked.dragging)
    {
      chargeClicked.selected = true;
    }



    //rightClick(false);
  }
  else if(!createTestChargeCheckBox)
  {
    //rightClick(true);
  }
  else
  {
    //rightClick(false);
    testCharges.push(new TestCharge(createVector(mouseX, mouseY), 0.000005));
  }
  rightClick(false);

  for (var i = charges.length - 1; i >= 0; i--)
  {
    charges[i].dragging = false;
  }

  if (showEquipotentialLinesCheckBox)
  {
    showEquipotentialLinesAt.push(createVector(mouseX, mouseY));
  }
}







function roundToNearestGrid(number)
{
  return Math.round(number / gridSize) * gridSize;
}

function floorToNearestGrid(number)
{
  return Math.floor(number / gridSize) * gridSize;
}



function createPreset(kind)
{

  removeAllCharges();

  var centerXRounded = floorToNearestGrid((width/2) - (chargeSize/2)) - 100;
  var centerYRounded = floorToNearestGrid((height/2) - (chargeSize/2));
  var center = createVector(centerXRounded,centerYRounded);

  if (kind == "single")
  {
    createCharge(center, 5);
  }
  else if (kind == "dipole")
  {
    createCharge(createVector(center.x - 75, center.y), -4);
    createCharge(createVector(center.x + 75, center.y), 4);
  }
  else if (kind == "square")
  {
    createCharge(createVector(center.x - 100, center.y - 99), 5);
    createCharge(createVector(center.x + 100, center.y - 100), 5);
    createCharge(createVector(center.x - 101, center.y + 100), 5);
    createCharge(createVector(center.x + 100, center.y + 105), 5);
  }
  else if (kind == "shield")
  {
    var radius = 100;
    var times = 10;
    var origin = createVector(center.x, center.y);

    let point = createVector(radius,radius);
    for (var a = 0; a < times; a++)
    {
      createCharge(createVector(point.x + origin.x, point.y + origin.y), 2);
      point = p5.Vector.add(point, createVector(0,0));
      point.rotate(360/times);
    }
    createCharge(createVector(center.x, center.y), -2);
  }
  else if (kind == "row")
  {
    for (var i = 0; i < 4; i++)
    {
      createCharge(createVector(center.x + (i * (chargeSize + 35)) - 150, center.y + i), 4);
    }
  }
  else if (kind == "dipole row")
  {
    for (var i = 0; i < 4; i++)
    {
      createCharge(createVector(center.x + (i * (chargeSize + 35)) - 150, center.y - 100 + i), 4);
      createCharge(createVector(center.x + (i * (chargeSize + 35)) - 150, center.y + 100 + i), -4);
    }
  }
  createDataFromMenu();
}






function displayFrameRate()
{
  push();
    noStroke();
    fill(100);
    textSize(20);
    text(round(frameRate()),10,25);
  pop();
}



function getDataFromMenu()
{
  showFieldLinesCheckBox = select("#fieldLines").checked();
  showFieldVectorsCheckBox = select("#fieldVectors").checked();
  showEquipotentialLinesCheckBox = select("#equi").checked();
  showVoltageCheckBox = select("#voltage").checked();
  createTestChargeCheckBox = select("#testCharge").checked();
  createGridCheckBox = select("#createGrid").checked();
  //createWallsCheckBox = select("#walls").checked();
  snapChargeToGridCheckBox = select("#snapChargesToGrid").checked();
}

function keyPressed()
{
  var chargeSelected = false;
  for (var i = 0; i < charges.length; i++)
  {
    if (charges[i].selected)
    {
      chargeSelected = true;
      if (keyCode === DELETE)
      {
        removeCharge(i);
      }
      if (keyCode === 107)
      {
        // plus key pressed
        charges[i].slider.value(charges[i].slider.value() + 1);
      }
      if (keyCode === 109)
      {
        // minus key pressed
        charges[i].slider.value(charges[i].slider.value() - 1);
      }
    }
  }
  if (!chargeSelected)
  {
    if (keyIsDown(SHIFT) && keyIsDown(187))
    {
      createCharge(createVector(mouseX,mouseY),5);
    }
    if (keyIsDown(SHIFT) && keyIsDown(189))
    {
      createCharge(createVector(mouseX,mouseY),-5);
    }
  }

  if (!chargeSelected && keyCode == 109)
  {
    createCharge(createVector(mouseX,mouseY),-5);
  }
  if (!chargeSelected && keyCode == 107)
  {
    createCharge(createVector(mouseX,mouseY),5);
  }
  createDataFromMenu();
}

function moveKeys()
{
  // for (var charge of charges)
  // {
  //   if (charge.selected)
  //   {
  //     if (keyIsDown(RIGHT_ARROW))
  //     {
  //       charge.position.x += 3;
  //     }
  //     if (keyIsDown(LEFT_ARROW))
  //     {
  //       charge.position.x -= 3;
  //     }
  //     if (keyIsDown(DOWN_ARROW))
  //     {
  //       charge.position.y += 3;
  //     }
  //     if (keyIsDown(UP_ARROW))
  //     {
  //       charge.position.y -= 3;
  //     }
  //   }
  // }
}


function doubleClicked()
{
  if (!createTestChargeCheckBox)
  {
    var notTouching = true;
    var mousePosition = createVector(mouseX, mouseY);
    for (var charge of charges)
    {
      var distance = mousePosition.dist(charge.position);
      if (distance < chargeSize)
      {
        notTouching = false;
      }
    }
    if (notTouching && mouseX < windowWidth - (200 + chargeSize))
    {
      createCharge(mousePosition);

    }
  }
}



function mouseDragged()
{
  var chargeDragged = null;
  for (var charge of charges)
  {
    if (charge.dragging)
    {
      chargeDragged = charge;
    }
  }

  if (chargeDragged == null)
  {
    var mousePosition = createVector(mouseX, mouseY);
    for (var i = charges.length - 1; i >= 0; i--)
    {
      charges[i].dragging = false;
      var distance = mousePosition.dist(charges[i].position);
      if (distance < (chargeSize/2) && chargeDragged == null)
      {
        chargeDragged = charges[i];
        chargeDragged.dragging = true;
      }
    }
    if (chargeDragged != null && chargeDragged.dragging)
    {
      if (snapChargeToGrid)
      {
        chargeDragged.x = constrain(roundToNearestGrid(mouseX), 0, width);
        chargeDragged.y = constrain(roundToNearestGrid(mouseY), 0, height);
        chargeDragged.position = createVector(roundToNearestGrid(mouseX), roundToNearestGrid(mouseY));
      }
      else
      {
        chargeDragged.x = constrain(mouseX,0,width);
        chargeDragged.y = constrain(mouseY,0,height);
        chargeDragged.position = createVector(mouseX, mouseY);
      }
      chargeDragged.dragging = true;
    }
  }
  else
  {
    for (var i = charges.length - 1; i >= 0; i--)
    {
      charges[i].selected = false;
    }
    if (snapChargeToGrid)
    {
      chargeDragged.x = constrain(roundToNearestGrid(mouseX), 0, width);
      chargeDragged.y = constrain(roundToNearestGrid(mouseY), 0, height);
      chargeDragged.position = createVector(roundToNearestGrid(mouseX), roundToNearestGrid(mouseY));
    }
    else
    {
      chargeDragged.x = constrain(mouseX,0,width);
      chargeDragged.y = constrain(mouseY,0,height);
      chargeDragged.position = createVector(mouseX, mouseY);
    }
    chargeDragged.dragging = true;
  }

  // if (createWallsCheckBox)
  // {
  //   var wallThere = false;
  //   for (var wall of walls)
  //   {
  //     if (wall.x == floorToNearestGrid(mouseX) && wall.y == floorToNearestGrid(mouseY))
  //     {
  //         wallThere = true;
  //     }
  //   }
  //   if (!wallThere)
  //   {
  //     walls.push(new Wall(floorToNearestGrid(mouseX), floorToNearestGrid(mouseY), 1, 1));
  //   }
  //
  // }
}

function displayGrid()
{
  push();
    stroke("rgba(255, 255, 255, 0.15)");
    for (var x = 0; x <= windowWidth; x+= gridSize)
    {
      line(x, 0, x, windowHeight);
    }
    for (var y = 0; y < windowHeight; y+= gridSize)
    {
      line(0, y, windowWidth, y);
    }
  pop();
}

function toggleFullscreen()
{
  var elem = document.documentElement;
  fullscreen = window.innerHeight == screen.height;
  if (!fullscreen)
  {
    if (elem.requestFullscreen)
    {
      elem.requestFullscreen();
    }
    else if (elem.mozRequestFullScreen)
    { /* Firefox */
      elem.mozRequestFullScreen();
    }
     else if (elem.webkitRequestFullscreen)
    { /* Chrome, Safari and Opera */
      elem.webkitRequestFullscreen();
    }
    else if (elem.msRequestFullscreen)
    { /* IE/Edge */
      elem.msRequestFullscreen();
    }
    document.getElementById("fullscreen").className = "fas fa-compress";
  }
  else
  {
    if (document.exitFullscreen)
    {
      document.exitFullscreen();
    }
    else if (document.mozCancelFullScreen)
    { /* Firefox */
      document.mozCancelFullScreen();
    }
    else if (document.webkitExitFullscreen)
    { /* Chrome, Safari and Opera */
      document.webkitExitFullscreen();
    }
    else if (document.msExitFullscreen)
    { /* IE/Edge */
      document.msExitFullscreen();
    }
    document.getElementById("fullscreen").className = "fas fa-expand";
  }
}

function toggleBurger()
{
  var menu = document.getElementById("menu").style;

  menu.transition = "0.5s right ease";

  if (menu.right == "0px")
  {
    menu.right = "-230px";
  }
  else
  {
    menu.right = "0px";
  }
}

function togglePopUp()
{
    let popup = document.getElementById("popup");
    if (showPopUp)
    {
      popup.style.visibility = "hidden";
      showPopUp = false;
    }
    else
    {
      popup.style.visibility = "visible";
      showPopUp = true;
    }

}

function windowResized()
{
  resizeCanvas(windowWidth - 280, windowHeight);
}
