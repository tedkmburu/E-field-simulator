var voltageMap = [];
var voltageBlockSize = 10;

function displayVoltage()
{
  // for (var charge of charges)
  // {
  //   var color = "rgba(255,0,0," + Math.abs(charge.charge / 10) + ")";
  //   if (charge.charge < 0)
  //   {
  //       color = "rgba(0,0,255," + Math.abs(charge.charge / 10) + ")";
  //   }
  //   if (charge.charge == 0)
  //   {
  //       color = "rgba(0,0,0,0)";
  //   }
  //   //createGradient(charge.position, Math.abs(charge.charge) * 20, color);
  //   var voltage = (voltageAtPoint(charge.x - 5, charge.y - 5) + voltageAtPoint(charge.x + 5, charge.y - 5) + voltageAtPoint(charge.x - 5, charge.y + 5) + voltageAtPoint(charge.x + 5, charge.y + 5)) / 4;
  //   createGradient(charge.position, Math.abs(voltage) / 1000, color);
  // }

  for (var y = 0; y < height; y+=voltageBlockSize)
  {
    for (var x = 0; x < width; x+=voltageBlockSize)
    {
      let voltageColor = voltageMap[y/voltageBlockSize][x/voltageBlockSize];

      push();
        if (voltageColor.levels[3] > 20)
        {
          fill(voltageColor);
          noStroke();
          //stroke(100);
          rect(x, y,voltageBlockSize,voltageBlockSize);
        }
        else {
          //console.log(voltageColor);
        }
      pop();
    }
  }
}

function createGradient(position, radius, color)
{
  var ctx = document.getElementById('defaultCanvas0').getContext("2d");
  var grd = ctx.createRadialGradient(position.x, position.y, 0, position.x, position.y, radius);
  grd.addColorStop(0, color);
  grd.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = grd;
  ctx.fillRect(position.x - (width / 2), position.y - (height / 2), width, height);
}

function createVoltageMap()
{
  var voltageBlockSize = 10;

  for (var y = 0; y < height; y+=voltageBlockSize)
  {
    voltageMap[y/voltageBlockSize] = [];
    for (var x = 0; x < width; x+=voltageBlockSize)
    {
      var voltage = voltageAtPoint(x + (voltageBlockSize/2), y + (voltageBlockSize/2))
      var intensity = Math.round(map(Math.abs(voltage), 0, 15475, 0, 200));

      var r = 0;
      var g = 0;
      var b = 0;
      var a = intensity/6;

      if (voltage > 0)
      {
        r = intensity;
      }
      else if (voltage < 0)
      {
        b = intensity;
      }
      var voltageColor = color(r, g, b, a);
      voltageMap[y/voltageBlockSize][x/voltageBlockSize] = voltageColor;
    }
  }
}

function voltageAtPoint(x, y)
{
  var position = createVector(x,y);

  var voltage = 0;

  for (charge of charges)
  {
    //V = KQ / r
    var kq = charge.charge * k;
    var r = p5.Vector.dist(position, charge.position) / gridSize;
    var v = kq / r;

    voltage += v;
  }

  // if (voltage == Infinity)
  // {
  //   console.log("Infinity");
  // }
  return voltage;
}
