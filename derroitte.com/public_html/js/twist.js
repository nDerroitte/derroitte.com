// Scramble effect applied to the site title "Natan Derroitte".
// On hover, a few letters are randomly permuted; on mouse-out, the
// original title is restored.
document.addEventListener("DOMContentLoaded", function () {
  var el = document.getElementById("hero-name");
  if (!el) return;

  var original = el.textContent;        // restored on mouse-out
  var SCRAMBLE_COUNT = 9;               // how many letters scramble at once
  var letterIndex = [];                 // positions currently scrambled
  var repeater = null;

  function replaceAt(str, index, replacement) {
    return str.substr(0, index) + replacement + str.substr(index + replacement.length);
  }

  function randomChar() {
    return String.fromCharCode(Math.floor(Math.random() * 26) + 97); // a-z
  }

  function permute() {
    var line = el.textContent;
    for (var i = 0; i < letterIndex.length; i++) {
      line = replaceAt(line, letterIndex[i], randomChar());
    }
    el.textContent = line;
  }

  function start() {
    // all positions except the first character
    var positions = [];
    for (var p = 1; p < original.length; p++) positions.push(p);
    // shuffle, then keep SCRAMBLE_COUNT distinct positions
    for (var i = positions.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = positions[i]; positions[i] = positions[j]; positions[j] = tmp;
    }
    letterIndex = positions.slice(0, Math.min(SCRAMBLE_COUNT, positions.length));
    repeater = setInterval(permute, 50);
  }

  function end() {
    clearInterval(repeater);
    el.textContent = original;
  }

  el.addEventListener("mouseover", start, false);
  el.addEventListener("mouseout", end, false);
});
