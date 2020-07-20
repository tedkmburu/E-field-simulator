var points = [];
var fieldLines = [];
var fieldLineArrows = [];
var fieldLinesPerCoulomb = 4;
var prevoiusFinalVector, finalVector;
var noPositiveCharges = true;

function getFieldLinePoints(x, y, lineOrigin)
{
  var position = createVector(x,y);
  forceVector = netForceAtPoint(position);

  forceVector.setMag(chargeSize/2);

  var forceVectorFinalPosition = p5.Vector.add(forceVector, position);


  var vectorToChargeDistance = p5.Vector.dist(forceVectorFinalPosition, charges[0].position);

  var startingPointIsInsideNegativeCharge = false;
  for (var i = 0; i < charges.length; i++)
  {
    var distanceFromVectorToCharge = p5.Vector.dist(position, charges[i].position);

    if (distanceFromVectorToCharge < (chargeSize/2) && charges[i].charge != 0)
    {
      startingPointIsInsideNegativeCharge = true;
    }
  }

  var windowSize = createVector(width, height).mag();

  if (!startingPointIsInsideNegativeCharge && vectorToChargeDistance < windowSize)
  {
    try
    {
      points.push(position);
      getFieldLinePoints(forceVectorFinalPosition.x, forceVectorFinalPosition.y, {charge: lineOrigin.charge, origin: lineOrigin.origin});
    }
    catch (e)
    {
      //console.log(e);
    }
  }
  else
  {
    points.unshift(charges[lineOrigin.charge].position);

    var chargeDistances = [];
    for (var i = 0; i < charges.length; i++)
    {
      chargeDistances.push(charges[i].position.dist(points[points.length - 1]));
    }
    var closestChargeDistance = Math.min(...chargeDistances);

    fieldLines[lineOrigin.charge][lineOrigin.origin] = new FieldLine(points);
    points = [];
  }
}



function createFieldLines()
{
  fieldLines = [];
  for (var i = 0; i < charges.length; i++)
  {
      fieldLines[i] = [];

      var radius = 15;
      var times = Math.abs(charges[i].charge) * fieldLinesPerCoulomb;
      var origin = charges[i].position;

      let point = createVector(radius,radius);
      for (var a = 0; a < times; a++)
      {
        getFieldLinePoints(point.x + origin.x, point.y + origin.y, {charge: i, origin: a});

        point = p5.Vector.add(point, createVector(0,0));
        point.rotate(360/times);
      }
  }
}


function displayFieldLines()
{
  for (var i = 0; i < fieldLines.length; i++)
  {
    for (var a = 0; a < fieldLines[i].length; a++)
    {
      try
      {
        if (fieldLines[i][a] != null)
        {
          fieldLines[i][a].display();
        }
      }
      catch (e)
      {

      }

    }
  }
  for (var i = 0; i < fieldLineArrows.length; i++)
  {
    fieldLineArrows[i].display();
  }
}





class FieldLine
{
  constructor(fieldLinePoints)
  {
    this.fieldLinePoints = fieldLinePoints;

    this.display = function()
    {
      if (this.fieldLinePoints.length > 0)
      {
        beginShape();
        //beginShape(POINTS);
          noFill();
          stroke(255);
          for (var i = 0; i < this.fieldLinePoints.length; i++)
          {
            curveVertex(this.fieldLinePoints[i].x, this.fieldLinePoints[i].y);
          }
        endShape();
      }
    }
  }
}
