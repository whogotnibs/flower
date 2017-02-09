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
const DEGENERATION_INTERVAL = 1000;
const SAVE_TIME_INTERVAL = 1000;
const DAY_IN_MILLIS = (1000*60*60*24);
const DEATH_RATE = DAY_IN_MILLIS;
var seenGame = false;
var seenDeath = false;
var degenerationTimer;
var saveTimeTimer;
var dateOfDeath;

$(document).ready(function() {
  getHealth();

  checkTime();

  setUpCheats();

  skip();

  // start function on click
  $('.continue').click(clickedContinue);

  // when the water button is clicked the plants health will go up by +1
  $('.water').click(clickedWater);

  // every interval the plant's health will go down by -1
  console.log("Starting timers");
  degenerationTimer = setInterval(degeneration, DEGENERATION_INTERVAL);
  saveTimeTimer = setInterval(saveTime, SAVE_TIME_INTERVAL);
  // making the health bar
  createRectangles();

  // filling the rest of the health bar
  createRemainingRectangles();

  // animating the flower based on its health
  pixelArt();

});

function getHealth() {
  var storedHealth = localStorage.getItem("health");
  health = parseFloat(storedHealth);
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
  $(document).keypress(function (event) {
    if (event.which == 48) {
      // 0
      health = 0;
      localStorage.setItem('health',0);
      console.log("ded...");
    }
  });
  $(document).keypress(function (event) {
    if (event.which == 49) {
      // 1
      health = 1;
      localStorage.setItem('health',1);
      console.log("1 life...");
    }
  });
  $(document).keypress(function (event) {
    if (event.which == 50) {
      // 2
      localStorage.clear();
      console.log("localStorage cleared...");
    }
  });
}

//this makes it so that if the player has let the plant die they can only ever
//see the death screen. u cant bring *this* flower back to life
function skip() {
  var seenDeath = localStorage.getItem('seenDeath');
  var seenGame = localStorage.getItem('seenGame');
  if (seenDeath == 'true') {
    console.log("Showing death...");
    // show the death screen
    $('.start, .continue').hide() ;
    $('.plant, .health, .water').hide() ;
    $('.death').show();
  }
  //the player skips the instructions if they have already started
  //the life of their flower
  else if (seenGame == 'true') {
    console.log("Showing game...");
    // show the game screen
    $('.start, .continue').hide() ;
    $('.plant, .health, .water').show() ;
    $('.death').hide();
  }
  //otherwise the game starts from the instruction screen
  else {
    console.log("Showing instructions...");
    // show the intro screen
    $('.start, .continue').show() ;
    $('.plant, .health, .water').hide() ;
    $('.death').hide();
  }
  localStorage.setItem('seenDeath', seenDeath);
  localStorage.setItem('seenGame', seenGame);
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

  //record that the user has already read the instructions
  seenGame = 'true';
  localStorage.setItem('seenGame', seenGame);
}

function clickedWater() {
  health++;

  updatePixelArt();

  //the plants health maxs out at 5
  if (health >= 5) {
    health = 5;
  }
  localStorage.setItem('health', health);
}

function degeneration() {
  health -= DEGENERATION_INTERVAL / DEATH_RATE;//DAY_IN_MILLIS;

  updatePixelArt();
  $('.rectangle').remove();
  createRectangles();
  createRemainingRectangles();

  console.log(health);

  //when the plant health reaches 0 the death message will be displayed
  if (health <= 0) {
    die()
  }
    localStorage.setItem('health', health);
    localStorage.setItem('seenDeath', seenDeath);
}

function die() {
  health = 0;
  seenDeath = 'true';

  clearInterval(degenerationTimer);
  clearInterval(saveTimeTimer);

  $('.start, .continue').css({ 
    display: 'none'
  });
  $('.plant, .health, .water').css({ 
    display: 'none'
  });
  $('.death').css({ 
    display: 'block'
  });

  // var date = new Date();
  // dateOfDeath = date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();
  // $('.death').append(dateOfDeath)
}

function createRectangles() {
  // create an array to store our rectangles
  rectangles = new Array(TOTAL_HEALTH);

  // loop through the (empty) array, putting rectangles in it
  // based on the plants health
  for (var i = 0; i < Math.ceil(health); i++) {

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
  var rect = $('<div class="rectangle"></div>'); 

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
    backgroundColor: 'skyblue',
  }); 


  // Finally, we RETURN the div we created from the function
  // So that whoever called this function can do something with it
  return rect;
}

function createRemainingRectangles() {
  // create an array to store the remaining rectangles in the health bar
  remainingRectangles = new Array(TOTAL_HEALTH);

  // loop through the (empty) array, putting rectangles in it
  // based on the plants lost health
  for (var i = 0; i < (TOTAL_HEALTH - Math.ceil(health)); i++) {

    // Make a rectangle
    var emptyRect = emptyRectangle(15, 15);

    // put it in the array and add it to the body
    remainingRectangles[i] = emptyRect;
    $('.health').append(remainingRectangles[i]);
  }
}

function emptyRectangle (w, h) {
  // First we create the div that will be the rectangle using jQuery
  var emptyRect = $('<div class="rectangle"></div>'); 

  // We can store properties in our rectangle object by just adding
  // them explicitly.
  emptyRect.w = w;
  emptyRect.h = h;

  // Then we set up the CSS of the div so that it looks like a rectangle
  // in the location we want it.
  emptyRect.css({ 
    display: 'inline-block',
    width: emptyRect.w + 'px',
    height: emptyRect.h + 'px', 
    margin: '15px',
    backgroundColor: 'lightgrey',
  }); 

  // Finally, we RETURN the div we created from the function
  // So that whoever called this function can do something with it
  return emptyRect;
}

function pixelArt() {
  //using health to create the images source string
  var imageSource = "images/plant" + Math.ceil(health) + ".png";
  var image = $('<img id="plant_image" src="' + imageSource + '">');
  $('.plant').append(image);

}


function updatePixelArt() {
  //using health to create the images source string
  var imageSource = "images/plant" + Math.ceil(health) + ".png";
  $('#plant_image').attr({
    src: imageSource
  })
}


function saveTime () {
  localStorage.setItem('time', Date.now());
}

function checkTime () {
  var storedTime = localStorage.getItem("time");
  storedTime = parseInt(storedTime);
  if (isNaN(storedTime)) {
    // If the value we got back from localStorage is NOT a number
    // we want to default to a value of 3 for our counter
    storedTime = Date.now();
  }
  var elapsedTime = Date.now() - storedTime;
  health -= (elapsedTime / DEGENERATION_INTERVAL / DEATH_RATE)

  console.log('elapsed time:', elapsedTime)
}
