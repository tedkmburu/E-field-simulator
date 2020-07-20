var testChargeDiameter = 10;
var testCharges = [];

//q = 5 micro coulombs;
var testChargeCharge = 0.000005;

function displayTestCharges()
{
  if (createTestChargeCheckBox)
  {
    push();
      fill(255);
      noStroke()
      ellipse(mouseX, mouseY, testChargeDiameter, testChargeDiameter);
      fill(0);
    pop();
  }
  for (var i = 0; i < testCharges.length; i++)
  {
    if (testCharges[i] != null)
    {
      if (testCharges[i].opacity == 0)
      {
        //removeTestCharge(i);
      }
      else
      {

        let touchingCharge = false;
        for (var a = 0; a < charges.length; a++)
        {

          var distance = p5.Vector.dist(testCharges[i].position, charges[a].position);
          if (distance - (testChargeDiameter/2) < chargeSize/2 && charges[a].charge != 0)
          {

            touchingCharge = true;
          }
          // if (testCharges[i].position.x > width || testCharges[i].position.x < 0 || testCharges[i].position.y > height || testCharges[i].position.y < 0)
          // {
          //   testCharges[i].moving = false;
          //   removeTestCharge(i);
          // }
        }
        if (touchingCharge)
        {
          testCharges[i].moving = false;
          testCharges[i].velocity = createVector(0,0);
          testCharges[i].acceleration = createVector(0,0);
        }
        else
        {
          testCharges[i].moving = true;
        }
        testCharges[i].move();
        testCharges[i].display();
      }

      //testCharges[i].checkWallCollision();
    }
  }
}

function displayGameTestCharges()
{
  gameTestCharge.move();
  gameTestCharge.display();
  gameTestCharge.checkWallCollision();
}

function createTestChargeMap()
{
  testCharges = [];
  for (var y = 0; y < height; y+=50)
  {
    for (var x = 0; x < width; x+=50)
    {
      testCharges.push(new TestCharge(createVector(x, y), testChargeCharge));
    }
  }
}


function removeTestCharge(i)
{
  //testCharges.splice(i,1);
  testCharges[i].show = false;
  testChargeDiameter[i] = null;
}


class TestCharge
{
  constructor(position, charge)
  {
    this.position = position;
    this.velocity = createVector(0, 0);
    this.acceleration = createVector(0, 0);
    this.opacity = 1;

    this.moving = true;
    this.show = true;
    this.trail = [this.position];
    this.frames = 0;
    this.charge = charge;
    if (this.charge > 0)
    {
      this.color = "rgba(255,0,0," + this.opacity.toString() + ")";
    }
    else if (this.charge < 0)
    {
      this.color = "rgba(0,0,255," + this.opacity.toString() + ")";
    }
    else
    {
      this.color = "rgba(50,50,50," + this.opacity.toString() + ")";
    }


    //q = 5 micro coulombs;
    var q = 0.000005;



    this.display = function()
    {
      if (this.show)
      {
        push();
          stroke("rgba(0,0,0,0.5)");
          //this.color = "rgba(255,0,0," + this.opacity.toString() + ")";
          fill(this.color);
          ellipse(this.position.x, this.position.y, testChargeDiameter, testChargeDiameter);
        pop();

        if (gameTestCharge != null)
        {
          if (gameTestCharge.moving == true)
          {
            push();
              noStroke();
              fill(255)
              for (var i = 0; i < this.trail.length; i++)
              {
                ellipse(this.trail[i].x, this.trail[i].y, 2, 2);
              }
            pop();
          }
        }
        }


    }

    this.move = function()
    {
      var force = netForceAtPoint(this.position);

      if (force.mag() != Infinity && this.moving)
      {
       // F  = qE
       // ma = qE
       // a  = (qE)/m
       // m would be 1
       this.acceleration = force.mult(this.charge);
       this.velocity.add(this.acceleration);
       this.position.add(this.velocity);
      }
      else if (!this.moving)
      {
        //this.opacity = constrain(this.opacity - 0.005, 0, 1);
      }

      if (gameTestCharge != null)
      {
        if (gameTestCharge.moving == true)
        {

          this.frames++;
          if (this.frames > 10)
          {
            this.trail.push(createVector(this.position.x, this.position.y));
            this.frames = 0;
          }
        }
      }




    }

    this.checkWallCollision = function()
    {
      for (var i = 0; i < walls.length; i++)
      {
        if (collideRectCircle(walls[i].x, walls[i].y, walls[i].width * gridSize, walls[i].height * gridSize, this.position.x, this.position.y, testChargeDiameter))
        {
          this.velocity = createVector(0, 0);
        }
      }
    }


    this.reset = function()
    {
      this.position = createVector(200, 200);
      this.velocity = createVector(0, 0);
      this.acceleration = createVector(0, 0);
      this.opacity = 1;
      this.color ="rgba(255,0,0," + this.opacity.toString() + ")";
      this.moving = true;
      this.show = true;
      this.trail = [this.position];
    }
  }
}


// class GameTestCharge extends TestCharge
// {
//   constructor(asdf)
//   {
//     super(position, velocity, acceleration, opacity, color, moving, show);
//     this.asdf = asdf;
//
//     //q = 5 micro coulombs;
//     var q = 0.000005;
//
//
//     this.display = function()
//     {
//       if (this.show)
//       {
//         push();
//           stroke(0);
//           this.color = "rgba(255,0,0," + this.opacity.toString() + ")";
//           fill(this.color);
//           ellipse(this.position.x, this.position.y, testChargeDiameter, testChargeDiameter);
//         pop();
//       }
//
//     }
//
//     this.move = function()
//     {
//        var force = netForceAtPoint(this.position);
//
//        if (force.mag() != Infinity && force.mag() != 0 && this.moving)
//        {
//          //console.log(force.toString());
//          force.mult(q);
//
//          this.acceleration = (force);
//          this.velocity.add(this.acceleration);
//          this.position.add(this.velocity);
//        }
//        else if (!this.moving)
//        {
//           //this.opacity = constrain(this.opacity - 0.005, 0, 1);
//        }
//     }
//
//     this.checkWallCollision = function()
//     {
//       for (var i = 0; i < walls.length; i++)
//       {
//         if (collideRectCircle(walls[i].x, walls[i].y, walls[i].width * gridSize, walls[i].height * gridSize, this.position.x, this.position.y, testChargeDiameter))
//         {
//           this.velocity = createVector(0, 0);
//         }
//       }
//     }
//
//
//     this.reset = function()
//     {
//       this.position = createVector(200, 200);
//       this.velocity = createVector(0, 0);
//       this.acceleration = createVector(0, 0);
//       this.opacity = 1;
//       this.color ="rgba(255,0,0," + this.opacity.toString() + ")";
//       this.moving = true;
//       this.show = true;
//     }
//   }
// }
