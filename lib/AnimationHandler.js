
function animate(element, classes, timing, count) {

  var l = classes.length;
  if (l != timing.length)
    return;

  var animationTime = 0;
  for (var i = 0; i < l; i++)
    animationTime += timing[i];

  for (i = 0; i < count; i++) {
    var loopTime = 0;
    for (var j = 0; j < l; j++) {

      var oClass = classes[(j - 1) < 0 ? (l - 1) : (j - 1)];
      var time = (loopTime += timing[j]) + (animationTime * i);
      setTimeout(changeClass.bind(this, element, oClass, classes[j]), time);
    }
  }
}

function changeClass(element, oldClass, newClass) {

  element.classList.add(newClass);
  element.classList.remove(oldClass);
}
