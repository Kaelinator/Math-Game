function Timer() {

  this.isTiming = false;
  this.timeLedger = [];
  this.format = null;
}

Timer.prototype.start = function() {

  if (!this.isTiming) {

    this.timeLedger.push(new Date().getTime());
    this.isTiming = true;
  }
};

Timer.prototype.stop = function() {

  if (this.isTiming) {

    this.timeLedger.push(new Date().getTime());
    this.isTiming = false;
  }
};

Timer.prototype.reset = function() {

  this.isTiming = false;
  this.timeLedger = [];
};

Timer.prototype.setFormat = function(format) {
  /*
   *  M = minutes
   *  s = seconds
   *  m = milliseconds
   */

  var arr = Array.from(format);

  var parsed = {

    data: ["", "", ""],
    count: [0, 0, 0],

    template: ""
  };

  for (var i = 0; i < arr.length; i++) {
    switch (arr[i]) {

      case 'M':

        parsed.data[0] += "0";
        parsed.count[0]++;
        parsed.template = parsed.template.parseMerge('M');
        break;

      case 's':

        parsed.data[1] += "0";
        parsed.count[1]++;
        parsed.template = parsed.template.parseMerge('s');
        break;

      case 'm':

        parsed.data[2] += "0";
        parsed.count[2]++;
        parsed.template = parsed.template.parseMerge('m');
        break;

      default:
        parsed.template += arr[i];
        break;
    }
  }

  this.format = parsed;
};

Timer.prototype.getTimeElapsed = function(f) {

  var l = this.timeLedger.length;
  var total = 0;

  /* add up previous splits */
  for (var t = 0; t < l; t++)
    total += (t % 2 !== 0) ? this.timeLedger[t] - this.timeLedger[t-1] : 0;

  /* add on current time */
  if (this.isTiming)
    total += new Date().getTime() - this.timeLedger[l-1];

  if (this.format && f) {

    var d = new Date(total);

    var ms = d.getMilliseconds();
    var s = d.getSeconds();
    var m = d.getMinutes();

    var formatted = this.format.template;

    formatted = formatted.replace('M', (this.format.data[0] + m).slice(-this.format.count[0]));
    formatted = formatted.replace('s', (this.format.data[1] + s).slice(-this.format.count[1]));
    formatted = formatted.replace('m', (ms + this.format.data[2] ).slice(0, this.format.count[2]));

    return formatted;
  }

  return total;
};

String.prototype.parseMerge = function(char) {

  if (this.endsWith(char))
    return this;

  return this.concat(char);
};
