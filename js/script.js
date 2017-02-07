/*

Web Plant
Thomas Bell

Keep your plant alive by watering it.
Your plant will keep track of its status even when the browser is closed.

*/

// these are the rectangles that will represent the plant's health
var rectangles = [];
const TOTAL_HEALTH = 5;
var health = 3;
//interval of health degeneration (milliseconds)
var interval = 1000*60;
var seenInstructions = false;

$(document).ready(function() {

  getHealth();

  setUpCheats();

  instructions();

// start function on click
  $('.continue').click(clickedContinue);

  // when the water button is clicked the plants health will go up by +1
  $('.water').click(clickedWater);

  // every interval the plant's health will go down by -1
  degeneration();
  setInterval(degeneration, interval);

  createRectangles();

});

function getHealth() {
  var storedHealth = localStorage.getItem("health");
  health = parseInt(storedHealth);
  if (isNaN(health)) {
    // If the value we got back from localStorage is NOT a number
    // we want to default to a value of 3 for our counter
    health = 3;
  }
}

function setUpCheats() {
  $(document).keypress(function (event) {
    if (event.which == 53) {
      // 5
      health = 5;
      localStorage.setItem('health',5);
      console.log("Cheat!");
    }
  });
}

function instructions() {
  seenInstructions = localStorage.getItem('seenInstructions');
  if (seenInstructions == undefined) {
    console.log("Showing instructions...");
    seenInstructions = true;
    // show the instructions
    $('.start, .continue').show() ;
    ;
  }
  else {
    seenInstructions = true;
    // show the game's main divs
    $('.plant, .health, .water').show() ;
    $('.start, .continue').hide() ;
  }
}

function clickedContinue() {
  // hide starting divs
  $('.start, .continue').css({ 
    display: 'none'
  });

  // show the game's main divs
  $('.plant, .health, .water').css({ 
    display: 'block'
  });
}

function clickedWater() {
  health++;

  //the plants health maxs out at 5
  if (health >= 5) {
    health = 5;
  }
  localStorage.setItem('health', health);
  }

function degeneration() {
  health--;

  //when the plant health reaches 0 the death message will be displayed
  if (health <= 0) {
    $('.start, .continue').css({ 
      display: 'none'
    });
    $('.plant, .health, .water').css({ 
      display: 'none'
    });
    $('.death').css({ 
      display: 'block'
    });
  }
  localStorage.setItem('health', health);
}

function createRectangles () {
  // create an array to store our rectangles
  rectangles = new Array(TOTAL_HEALTH);

  // loop through the (empty) array, putting rectangles in it
  for (var i = 0; i < TOTAL_HEALTH; i++) {

    // Make a rectangle
    var rect = rectangle(15, 15);

    // put it in the array and add it to the body
    rectangles[i] = rect;
    $('.health').append(rectangles[i]);
  }
}

// rectangle(w, h)
//
// A function to create a filled div with dimensions of w by h
//
// Returns the div created as a jQuery object
function rectangle (w, h) {
  // First we create the div that will be the rectangle using jQuery
  var rect = $('<div></div>'); 

  // We can store properties in our rectangle object by just adding
  // them explicitly.
  rect.w = w;
  rect.h = h;

  // Then we set up the CSS of the div so that it looks like a rectangle
  // in the location we want it.
  rect.css({ 
    display: 'inline-block',
    width: rect.w + 'px',
    height: rect.h + 'px', 
    margin: '15px',
    backgroundColor: 'lightblue',
  }); 


  // Finally, we RETURN the div we created from the function
  // So that whoever called this function can do something with it
  return rect;
}
