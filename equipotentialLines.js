var equiPoints;
var equiLines;
var showEquipotentialLinesAt = [];


function displayEquipotentialLines()
{
  createEquipotentialLines();
  // for (var i = 0; i < equiLines.length; i++)
  // {
  //   //equiLines[i].display();
  // }
}



function createEquipotentialLines()
{
  equiPoints = [];
  // for (var y = 0; y < height; y+=10)
  // {
  //   for (var x = 0; x < width; x+=10)
  //   {
  //     noStroke();
  //     fill(50);
  //     var netForce = round(netForceAtPoint(createVector(x, y)).mag());
  //     if ((netForce % 10) === 0 && netForce != 0)
  //     {
  //       textSize(8);
  //       text(netForce.toString(),x,y);
  //       //equiPoints.push({force: netForce, position: createVector(x, y)});
  //     }
  //   }
  // }

  // for (var i = 0; i < equiPoints.length; i++)
  // {
  //   equiPoints[i]
  // }

  push();
  //stroke(255);
  strokeWeight(5);
  var mouseForce = voltageAtPoint(mouseX, mouseY);

  textSize(12);
  if (mouseForce > 0)
  {
    stroke("rgb(255,0,0)");
  }
  else if (mouseForce < 0)
  {
    stroke("rgb(0,0,255)");
  }
  else
  {
    stroke(255);
  }

  point(mouseX,mouseY);

  for (var y = 0; y < height; y+=5)
  {
    for (var x = 0; x < width; x+=5)
    {

      var netForce = voltageAtPoint(x, y);
      if ((netForce >= mouseForce * 0.95 && netForce <= mouseForce * 1.05) || (netForce <= mouseForce * 0.95 && netForce >= mouseForce * 1.05))
      {
        textSize(8);

        point(x,y);
        //equiPoints.push(createVector(x, y));
      }
      // if (netForce == 0)
      // {
      //     point(x, y);
      // }
    }
  }


  for (var i = 0; i < showEquipotentialLinesAt.length; i++)
  {
    var mouseForce = voltageAtPoint(showEquipotentialLinesAt[i].x, showEquipotentialLinesAt[i].y);
    if (mouseForce > 0)
    {
      stroke("rgb(255,0,0)");
    }
    else if (mouseForce < 0)
    {
      stroke("rgb(0,0,255)");
    }
    else
    {
      stroke(255);
    }

    for (var y = 0; y < height; y+=5)
    {
      for (var x = 0; x < width; x+=5)
      {
        var netForce = voltageAtPoint(x, y);
        if ((netForce >= mouseForce * 0.95 && netForce <= mouseForce * 1.05) || (netForce <= mouseForce * 0.95 && netForce >= mouseForce * 1.05))
        {
          //console.log(map(voltageAtPoint(mouseX, mouseY)));
          point(x,y);
        }
      }
    }
  }
  pop();

}


class EquiLine
{
  constructor(EquiLinePoints)
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
