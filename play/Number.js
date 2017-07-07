
function getNumbers(pool) {

  var xIndex = Math.floor(Math.random() * pool.length);
  var yIndex = Math.floor(Math.random() * pool[xIndex].compatible.length);

  return {

    a: pool[xIndex].n,
    b: pool[xIndex].compatible[yIndex]
  };
}

function calculateAnswer(x, y, op) {

  switch (op) {

    case "0":
      return x + y;

    case "1":
      return x - y;

    case "2":
      return x * y;

    case "3":
      return x / y;
  }
}

function generatePool(type, operator, xMin, xMax, yMin, yMax) {

  var pool = [];

  if (numberType >= 2 || (numberType == 1 && settings.op == 1) ||
      settings.op == 0 || settings.op == 2) {

    /* all numbers will suffice */
    // console.log("all numbers will suffice");

    for (var x = +xMin; x < +xMax; x++) {

      var xPool = {
        n: x,
        compatible: []
      };

      for (var y = +yMin; y < +yMax; y++)
        if (y !== 0) // don't break maths!
          xPool.compatible.push(y);

      if (xPool.compatible.length > 0)
        pool.push(xPool);
    }

  } else if (settings.op == 3) {
    /* natrual number & integer division */

    // console.log("natrual number & integer division");

    for (var a = +xMin; a < +xMax; a++) {

      var aPool = {
        n: a,
        compatible: []
      };

      for (var b = +yMin; b < +yMax; b++) {

        if (b == 0) // don't break maths!
          continue;

        if (b > a / 2) // break before unnecessary loops
          break;

        if (a % b == 0 && b != 1 && b != -1) // even division
          aPool.compatible.push(b);
      }

      if (aPool.compatible.length > 0)
        pool.push(aPool);
    }

  } else {
    /* natural number subtraction */

    // console.log("natural number subtraction");

    for (var p = +xMin; p < +xMax; p++) {

      var pPool = {
        n: p,
        compatible: []
      };

      for (var q = p; q >= +yMin; q--)
        if (q !== 0)  // don't break maths!
          pPool.compatible.push(q);

      if (pPool.compatible.length > 0)
        pool.push(pPool);
    }

  }

  return (pool.length < 1) ? -1 : pool;
}
