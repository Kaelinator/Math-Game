var OPERATIONS = ["+", "-", "\u00d7", "\u00f7"];
var NUMBER_TYPES = ["n", "i", "r"];
var INTERMITTENT = 2000;

var settings;
var operation;
var numberType;

var problems = [];
var inputs = [];
var splits = [];
var answers = [];
var pool; // list of possible numbers

var sTime, tTime; // split time & total time
var xMin, xMax; // x bounds
var yMin, yMax; // y bounds

var $x, $op, $y;
var $pCount, $answer;
var $sTime, $tTime;

function setup() {

  /* set options */
  settings = parseQuery(location.search);

  operation = OPERATIONS[settings.op];
  numberType = NUMBER_TYPES.indexOf(settings.nt);

  /* set bounds */
  xMin = settings.xmn;
  xMax = settings.xmx;

  yMin = settings.ymn;
  yMax = settings.ymx;

  if (numberType === 0) {

    /* make sure they are all natural numbers */
    xMin = (xMin < 0) ? 0 : xMin;
    xMax = (xMax < 0) ? 0 : xMax;
    yMin = (yMin < 0) ? 0 : yMin;
    yMax = (yMax < 0) ? 0 : yMax;
  }

  if (numberType === -1 || !operation || !xMin || !xMax || !yMin || !yMax) // something went wrong
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

  $x = document.getElementById("x");
  $op = document.getElementById("op");
  $y = document.getElementById("y");

  $answer = document.getElementById("a");
  $pCount = document.getElementById("problem-count");

  pool = generatePool(numberType, settings.op, xMin, xMax, yMin, yMax);

  if (!pool || pool === -1)  // no compatible questions
    document.location.replace("../index.html");

  /* display first problem */
  newProblem();
}

function newProblem() {

  var nums = getNumbers(pool);

  problems.push(nums.a + " " + operation + " " + nums.b);
  answers.push(calculateAnswer(nums.a, nums.b, settings.op));

  /* display */
  $op.innerHTML = operation;
  $x.innerHTML = nums.a;
  $y.innerHTML = nums.b;
  $pCount.innerHTML = "#" + answers.length;

  /* prepare answer textbox */
  $answer.value = "";
  $answer.disabled = false;
  $answer.focus();

  /* set times */
  sTime.reset();
  sTime.start();
  tTime.start();
}

function keyEnter(event) {

  console.log(event.keyCode);

  if (!((event.keyCode >= 48 && event.keyCode <= 57 && !event.shiftKey) || // numeric row
  (event.keyCode >= 96  && event.keyCode <= 105) || // num pad
  (event.keyCode == 110 || event.keyCode == 190) || // decimal
  (event.keyCode == 8   || event.keyCode == 116) || // backspace & f5
  (event.keyCode == 189)))
    event.preventDefault(); // get rid of the input

  if (event.keyCode == 27) // ESC - clear input
    $answer.value = "";

  /* they've confirmed an answer */
  if (event.keyCode != 13) // ENTER
    return;

  $answer.disabled = true;

  sTime.stop();
  tTime.stop();
  splits.push(sTime.getTimeElapsed(false));
  inputs.push(event.target.value);

  animate($sTime, ["timeAlert", "timeInitial"], [INTERMITTENT / 8, INTERMITTENT / 8], 4);

  if (answers.length >= settings.c)
    endGame(); // last problem
  else
    setTimeout(newProblem, INTERMITTENT); // another one
}

function update() {

  $tTime.innerHTML = tTime.getTimeElapsed(true);
  $sTime.innerHTML = sTime.getTimeElapsed(true);
}

function endGame() {

  sessionStorage.clear(); // remove previous game

  /* populate storage */
  sessionStorage.setItem("problems", problems);
  sessionStorage.setItem("inputs", inputs);
  sessionStorage.setItem("splits", splits);
  sessionStorage.setItem("answers", answers);

  window.location.replace("../results/index.html"); // direct them to the results
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
