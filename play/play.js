var operations = ["+", "-", "&times", "&divide"];
var intermittent = 2000;

var operation;
var integersOnly;
var settings;

var inputs = [];
var splits = [];
var answers = [];

var sTime, $sTime;
var tTime, $tTime;

var $answer;

function setup() {

  /* set options */
  settings = parseQuery(location.search);

  operation = operations[settings.op];
  integersOnly = settings.ia;

  if (!operation) // something went wrong
    document.location.replace("../index.html");

  /* set up timers */
  setInterval(update, 33);

  sTime = new Timer();
  sTime.setFormat("M:ss:mm");

  tTime = new Timer();
  tTime.setFormat("M:ss:mm");

  $tTime = document.getElementById("tTime");
  $sTime = document.getElementById("sTime");
  $answer = document.getElementById("a");

  /* display first problem */
  newProblem();
}

function newProblem() {

  var x = Math.floor(Math.random() * 100) + 1;
  var y = Math.floor(Math.random() * 100) + 1;

  var $op = document.getElementById('op');
  var $x = document.getElementById('x');
  var $y = document.getElementById('y');

  answers.push(calculateAnswer(x, y, settings.op));

  $op.innerHTML = operation;
  $x.innerHTML = x;
  $y.innerHTML = y;

  $answer.value = "";
  $answer.disabled = false;
  $answer.focus();

  sTime.reset();
  sTime.start();
  tTime.start();
}


function keyEnter(event) {

  if (!((event.keyCode >= 48 && event.keyCode <= 57 && !event.shiftKey) || // numeric row
      (event.keyCode >= 96 && event.keyCode <= 105) || // num pad
      (event.keyCode == 110 || event.keyCode == 190) || // decimal
      (event.keyCode == 8 || event.keyCode == 116))) // backspace & f5
    event.preventDefault();

  if (event.keyCode == 27) // clear input
    $answer.value = "";

  /* they've confirmed an answer */
  if (event.keyCode != 13)
    return;

  $answer.disabled = true;

  sTime.stop();
  tTime.stop();
  splits.push(sTime.getTimeElapsed(false));
  inputs.push(event.target.value);

  animate($sTime, ["timeAlert", "timeInitial"], [250, 250], 4);

  if (answers.length >= 2) {
    /* end game */

    sessionStorage.clear();
    sessionStorage.setItem("inputs", inputs);
    sessionStorage.setItem("splits", splits);
    sessionStorage.setItem("answers", answers);
    window.location.replace("../results/index.html");
  } else {
    /* another one */
    setTimeout(newProblem, intermittent);
  }
}

function calculateAnswer(x, y, op) {

  switch (op) {

    case '0':
      return x + y;

    case '1':
      return x - y;

    case '2':
      return x * y;

    case '3':
      return x / y;
  }
}

function update() {

  $tTime.innerHTML = tTime.getTimeElapsed(true);
  $sTime.innerHTML = sTime.getTimeElapsed(true);
}

/**
 * @author: cmatskas
 */
function parseQuery(url) {
  var urlParams = {};
  url.replace(
    new RegExp("([^?=&]+)(=([^&]*))?", "g"),
    function($0, $1, $2, $3) {
      urlParams[$1] = $3;
    }
  );

  return urlParams;
}
