var charges = [];
var chargeSize = 40;
var snapChargeToGrid = false;

function createCharge(position, charge)
{
  if (charge != null)
  {
    charges.push(new Charge(position.x, position.y, charge))
  }
  else
  {
    charges.push(new Charge(position.x, position.y, 0))
    charges[charges.length - 1].selected = true;
  }
}

function displayCharges()
{
  for (var i = 0; i < charges.length; i++)
  {
    charges[i].display();
    if (charges[i].dragging)
    {
      createDataFromMenu();
    }
  }
}

function removeCharge(i)
{
  charges[i].selected = false;
  charges[i].slider.style("visibility", "hidden");
  charges[i].slider.remove();

  charges.splice(i,1);

  createDataFromMenu();
}

function removeAllCharges()
{
  var times = charges.length;
  for (var i = times - 1; i >= 0; i--)
  {
    removeCharge(i);
  }
  charges = [];
}

function sliderChanged()
{
  createDataFromMenu();
}

class Charge
{
  constructor(x, y, charge)
  {
    this.x = x;
    this.y = y;
    this.position = createVector(x,y);
    this.charge = charge;
    this.selected = false;
    this.dragging = false;
    this.force = null;
    this.slider = createSlider(-10, 10, charge, 1);

    this.slider.style("zIndex", "999");
    this.slider.style("visibility", "hidden");
    this.slider.addClass("slider");
    this.slider.input(sliderChanged);
    this.slider.changed(sliderChanged);


    this.display = function()
    {
      if (this.selected)
      {
        this.slider.position(this.x - 75, this.y + (chargeSize/2) + 10, "fixed");
        this.charge = this.slider.value();
      }


      push();
        if (this.selected)
        {
          stroke(255);
          this.slider.style("visibility", "visible");
        }
        else
        {
          stroke(color(0,0,0,255/2));
          this.slider.style("visibility", "hidden");
        }

        if (this.charge > 0){fill("rgba(255,0,0,1)");}
        else if (this.charge == 0){fill("rgba(85,85,85,0.75)");}
        else {fill("rgba(0,0,255,1)");}
        ellipse(this.x, this.y, chargeSize, chargeSize);

        textSize(16);
        fill("#ffffff");
        noStroke();
        if (this.charge > 0)
        {
          text("+" + this.charge, this.x - ((this.charge.toString().length + 1.5) * 4), this.y + 7);
        }
        else
        {
          text(this.charge, this.x - ((this.charge.toString().length) * 4), this.y + 7);
        }
      pop();
    }
  }
}
