var menu = document.getElementById("contextMenu");

// function toggleMenu()
// {
//   menu.transition = "0.5s right ease";
//
//   if (menu.right == "0px")
//   {
//     menu.right = "-240px";
//   }
//   else
//   {
//     menu.right = "0px";
//   }
// }


function saveAsPNG()
{
  var d = new Date();
  var date = d.toLocaleDateString();
  var time = d.toLocaleTimeString();
  saveCanvas(date + " " + time, 'png');
}




function rightClick(show)
{

  if (show)
  {
    menu.style.top = mouseY + "px";
    menu.style.left = mouseX + "px";

    menu.innerHTML = "<li onclick='createCharge(createVector(" + mouseX + "," + mouseY + "))'>Add Charge</li>";


    var chargeSelected;
    var mousePosition = createVector(mouseX, mouseY);

    for (var i = 0; i < charges.length; i++)
    {
      var distance = mousePosition.dist(charges[i].position);
      if (distance < (chargeSize/2))
      {
        chargeSelected = i;
      }

    }
    if (chargeSelected != null)
    {
      menu.innerHTML = "<li onclick='removeCharge(" + chargeSelected + ");'>Delete Charge</li>";
    }


    if (looping)
    {
      menu.innerHTML += "<li onclick='looping = false;noLoop()'>noLoop()</li>";
    }
    else
    {
      menu.innerHTML += "<li onclick='looping = true;loop()'>loop()</li>";
    }
    menu.innerHTML += "<li onclick='location.reload()'>Refresh</li>";
    menu.innerHTML += "<li onclick='saveAsPNG()'>Save as PNG</li>";

    menu.style.display = "block";
  }
  else
  {
    menu.style.display = "none";
  }
}
