
var ACCURACY_WEIGHT = 1.15;
var SPLIT_WEIGHT = 1;

var labels;
var $feedback;

function displayResults() {

  $feedback = document.getElementById("feedback");
  $summary = document.getElementById("summary");
  labels = ['number', 'problem', 'answer', 'split', 'accuracy'];

  var problems = sessionStorage.getItem("problems").split(",");
  var inputs = sessionStorage.getItem("inputs").split(",");
  var answers = sessionStorage.getItem("answers").split(",");
  var splits = sessionStorage.getItem("splits").split(",");

  var avgSplit = 0;
  var avgAccuracy = 0;

  var minDistance = 100;
  var maxDistance = 0;

  var information = [];
  for (var q = 0; q < problems.length; q++) {
    /* feed some information */

    var equation = problems[q] + " = " + (Math.round(answers[q] * 1000) / 1000);  // a + b = c
    var split = (splits[q] / 1000);      // 11.3

    /* calculate percent accuracy */
    var accuracy = ((answers[q] == 0) ? 1 : answers[q]) / ((inputs[q] == 0) ? 1 : inputs[q]);
    accuracy = (accuracy > 1) ? 1 / accuracy : accuracy; // ensure a number between 0 & 1
    accuracy *= 100;

    var distance = euclideanDistance(split, accuracy);

    information.push(q + 1);
    information.push(equation);
    information.push(inputs[q]);
    information.push(split.toFixed(2) + "s");
    information.push(accuracy.toFixed(1) + "%");
    information.push(distance);

    minDistance = (distance < minDistance) ? distance : minDistance;
    maxDistance = (distance > maxDistance) ? distance : maxDistance;

    avgSplit += split;
    avgAccuracy += accuracy;
  }

  /* display */
  for (var i = 0; i < problems.length; i++) {
    var tr = document.createElement('tr');

    for (var j = 0; j < labels.length + 1; j++) {

      var index = i * (labels.length + 1) + j;

      if (j < labels.length) {

        var td = document.createElement('td');
        td.appendChild(document.createTextNode(information[index]));
        td.classList.add(labels[j]);
        tr.appendChild(td);
      } else {

        var r = map(information[index], minDistance, maxDistance, 255, 82);
        var g = map(information[index], minDistance, maxDistance, 255, 183);
        var b = map(information[index], minDistance, maxDistance, 255, 136);

        tr.style["background-color"] = rgbToHex(r, g, b);
      }
    }
    $feedback.appendChild(tr);
  }

  /* summary */
  avgSplit /= problems.length;
  avgAccuracy /= problems.length;

  var sumRow = document.createElement('tr');  // summary row
  var label = document.createElement('td');

  label.setAttribute("colspan", "3");
  label.appendChild(document.createTextNode("Averages: "));

  var splAvg = document.createElement('td');
  var errAvg = document.createElement('td');

  splAvg.appendChild(document.createTextNode(avgSplit.toFixed(2) + "s"));
  errAvg.appendChild(document.createTextNode(avgAccuracy.toFixed(1) + "%"));

  label.classList.add(labels[0]);
  splAvg.classList.add(labels[labels.length - 2]);
  errAvg.classList.add(labels[labels.length - 1]);

  sumRow.appendChild(label);
  sumRow.appendChild(splAvg);
  sumRow.appendChild(errAvg);

  $summary.appendChild(sumRow);
}

function euclideanDistance(split, accuracy) {

  var idealSplit = 0 * SPLIT_WEIGHT;
  var idealAccuracy = 100 * ACCURACY_WEIGHT;

  accuracy *= ACCURACY_WEIGHT;
  split *= SPLIT_WEIGHT;

  return 1 / (Math.pow(idealSplit - split, 2) + Math.pow(idealAccuracy - accuracy, 2));
}

function map(value, low1, high1, low2, high2) {
    return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
}

function rgbToHex(r, g, b) {
  var rgb = b | (g << 8) | (r << 16);
  return "#" + (0x1000000 | rgb).toString(16).substring(1);
}
