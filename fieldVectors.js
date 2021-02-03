var fieldVectors = [];


function createFieldVectors()
{
  fieldVectors = [];
  for (var y = 0; y < height; y+=25)
  {
    for (var x = 0; x < width; x+=25)
    {
      var location = createVector(x, y);
      var draw = true;
      for (var charge of charges)
      {
        var distance = p5.Vector.dist(location, charge.position);
        if (distance < chargeSize)
        {
          draw = false;
        }
      }
      if (draw)
      {
        fieldVectors.push(new FieldVector(location));
      }
    }
  }
}

function showForceVectorsOnMouse()
{
  var start = createVector(mouseX, mouseY);
  let draw = true;
  for (var charge of charges)
  {
    var distance = p5.Vector.dist(start, charge.position);
    if (distance < chargeSize/5)
    {
      draw = false;
    }
  }
  var force = netForceAtPoint(start).div(400);
  var end = p5.Vector.add(start, force);
  var color = "rgba(250,250,250,1)";
  var angle = force.heading();
  var scale = force.mag() / 100;

  if (draw)
  {
    createArrow(start, end, angle, color, scale);
  }




  // var end = p5.Vector.add(start, createVector(force.x, 0));
  // var color = "rgba(250,250,250,1)";
  // var angle = createVector(force.x, 0).heading();
  // var scale = force.mag() / 100;
  //
  // createArrow(start, end, angle, color, scale);
  //
  //
  // var end = p5.Vector.add(start, createVector(0, force.y));
  // var color = "rgba(250,250,250,1)";
  // var angle = createVector(0, force.y).heading();
  // var scale = force.mag() / 100;
  //
  // createArrow(start, end, angle, color, scale);


}

function displayFieldVectors()
{
  //showForceVectorsOnMouse();

  for (var i = 0; i < fieldVectors.length; i++)
  {
    fieldVectors[i].display();
  }
}

function createArrow(start, end, angle, color, scale)
{
  push();
    stroke(color);
    strokeWeight(scale * 4);
    noFill();
    line(start.x, start.y, end.x, end.y);


    translate(end.x, end.y)
    rotate(angle);
    fill(color);


    triangle(0, 0, -10 * scale, -5 * scale, -10 * scale, 5 * scale);
  pop();
}

class FieldVector
{
  constructor(location)
  {
    this.location = location;
    this.force = netForceAtPoint(location).div(400);
    this.end = p5.Vector.add(this.location, this.force);

    // if (voltageAtPoint(location.x, location.y) < 0)
    // {
    //   this.end = this.location;
    //   this.location = p5.Vector.sub(this.location, this.force);
    //
    // }
    this.color = "rgba(250, 250, 250, 1)";

    this.display = function()
    {
      var forceMag = this.force.mag();
      var scale = forceMag / 100;
      if (forceMag > 1)
      {
        createArrow(this.location, this.end, this.force.heading(), this.color, scale);
      }
    }
  }
}
