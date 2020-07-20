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

  if (noPositiveCharges)
  {
    forceVector.mult(-1);
  }
  // if (charges[lineOrigin.charge].charge < 0)
  // {
  //   forceVector.mult(-1);
  // }

  var differenceInVectorAngles = null;
  var mag;
  if (prevoiusFinalVector != null)
  {
    var minVectorSize = 3;
    var maxVectorSize = chargeSize/2;

    //differenceInVectorAngles = Math.abs(degrees(prevoiusFinalVector.angleBetween(forceVector)));
    differenceInVectorAngles = Math.abs(degrees(prevoiusFinalVector.angleBetween(forceVector)));

    mag = maxVectorSize * Math.pow(0.97, differenceInVectorAngles);
    forceVector.setMag(constrain(mag, minVectorSize ,maxVectorSize));
  }

  var forceVectorFinalPosition = p5.Vector.add(forceVector, position);


  var vectorToChargeDistance = p5.Vector.dist(forceVectorFinalPosition, charges[0].position);

  var startingPointIsInsideNegativeCharge = false;
  for (var i = 0; i < charges.length; i++)
  {

    var distanceFromVectorToCharge = p5.Vector.dist(position, charges[i].position);
    //if (distanceFromVectorToCharge < (chargeSize/2) && charges[i].charge != 0 && i != lineOrigin.charge)
    if (distanceFromVectorToCharge < (chargeSize/2) && charges[i].charge != 0)
    {
      startingPointIsInsideNegativeCharge = true;
    }
  }

  var windowSize = createVector(width, height).mag();

  //if (!startingPointIsInsideNegativeCharge && vectorToChargeDistance < windowSize && differenceInVectorAngles >= 1 && differenceInVectorAngles <= 175)
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

    for (var i = 0; i < chargeDistances.length; i++)
    {
      if (chargeDistances[i] == closestChargeDistance && closestChargeDistance < 100)
      {
        var halfWayPoint = points[points.length - 1].add(charges[i].position).div(2);
        points.push(halfWayPoint);

        halfWayPoint = points[points.length - 1].add(charges[i].position).div(2);
        points.push(halfWayPoint);

        points.push(p5.Vector.add(charges[i].position, createVector(1, 0)));
      }
    }

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
        point.rotate(362/times);
      }
  }

  fieldLineArrows = [];
  for (var i = 0; i < fieldLines.length; i++)
  {
    for (var a = 0; a < fieldLines[i].length; a++)
    {
      if (fieldLines[i][a] != null)
      {
        for (var s = 25; s < fieldLines[i][a].fieldLinePoints.length; s+=25)
        {
          var arrowPosition = fieldLines[i][a].fieldLinePoints[s];
          var arrowAngle = netForceAtPoint(arrowPosition).heading();
          if (charges[i].charge != 0 && !noPositiveCharges)
          {
            fieldLineArrows.push(new FieldLineArrow(arrowPosition, arrowAngle + 180));
          }
          else
          {
            fieldLineArrows.push(new FieldLineArrow(arrowPosition, arrowAngle));
          }
        }
      }
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
      finally
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


class FieldLineArrow
{
  constructor(position, direction)
  {
    this.position = position;
    this.direction = direction;

    this.display = function()
    {
      push();
        stroke(255);
        translate(position.x, position.y)
        rotate(direction);
        fill(255);
        triangle(0, 0, -10, -5, -10, 5);
      pop();
    }
  }
}
