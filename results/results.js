
var labels;
var $feedback;

function displayResults() {

  $feedback = document.getElementById("feedback");
  $summary = document.getElementById("summary");
  labels = ['number', 'problem', 'answer', 'split', 'error'];

  var problems = sessionStorage.getItem("problems").split(",");
  var inputs = sessionStorage.getItem("inputs").split(",");
  var answers = sessionStorage.getItem("answers").split(",");
  var splits = sessionStorage.getItem("splits").split(",");

  var avgSplit = 0;
  var avgError = 0;

  var information = [];
  for (var q = 0; q < problems.length; q++) {
    /* feed some information */

    var equation = problems[q] + " = " + answers[q];  // a + b = c
    var split = (splits[q] / 1000);      // 11.3

    /* calculate percent error */
    var a = Math.abs(answers[q] - inputs[q]);       // |Theoretical - Experimental|
    var error = (a / answers[q]) * 100;             // over Theoretical * 100

    information.push(q + 1);
    information.push(equation);
    information.push(inputs[q]);
    information.push(split.toFixed(2) + "s");
    information.push(error.toFixed(1) + "%");

    avgSplit += split;
    avgError += error;
  }

  /* display */
  for (var i = 0; i < problems.length; i++) {
    var tr = document.createElement('tr');

    for (var j = 0; j < labels.length; j++) {

      var td = document.createElement('td');
      var index = i * labels.length + j;

      td.appendChild(document.createTextNode(information[index]));
      td.classList.add(labels[j]);
      tr.appendChild(td);
    }
    $feedback.appendChild(tr);
  }

  /* summary */
  avgSplit /= problems.length;
  avgError /= problems.length;

  var sumRow = document.createElement('tr');  // summary row
  var label = document.createElement('td');

  label.setAttribute("colspan", "3");
  label.appendChild(document.createTextNode("Averages: "));

  var splAvg = document.createElement('td');
  var errAvg = document.createElement('td');

  splAvg.appendChild(document.createTextNode(avgSplit.toFixed(2) + "s"));
  errAvg.appendChild(document.createTextNode(avgError.toFixed(1) + "%"));

  label.classList.add(labels[0]);
  splAvg.classList.add(labels[labels.length - 2]);
  errAvg.classList.add(labels[labels.length - 1]);

  sumRow.appendChild(label);
  sumRow.appendChild(splAvg);
  sumRow.appendChild(errAvg);

  $summary.appendChild(sumRow);
}
