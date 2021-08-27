// Timer and end value
var TargetDate = "05/15/2030 01:0 PM";
BackColor = false;
ForeColor = false;
var CountActive = true;
CountStepper = -1;
LeadingZero = true;
DisplayFormat = "%%D%% &nbsp; %%H%% &nbsp; %%M%% &nbsp; %%S%% ";
FinishMessage = "<br/><em>This is a placeholder website. More soon, maybe.</em>";
var demo = false;

// Babel style
var repeater
var letterIndex = [0, 0, 0, 0]
function permute (place)
{
    line = document.getElementById(place).textContent
    for ( i=0 ; i< letterIndex.length;i++)
    {
        line = line.replaceAt(letterIndex[i], String.fromCharCode(Math.floor((Math.random()*25)+97)))
    }
    document.getElementById(place).textContent = line;
}
function unpermute(term,eyedee)
{
    document.getElementById(eyedee).innerHTML = term;
}
function start(place)
{
  demo = true;
  line = document.getElementById(place).textContent
  for (i=0;i<letterIndex.length;i++)
  {
    id = Math.floor((Math.random() * line.length) + 1);
    letterIndex[i] = id;
  }
  repeater=setInterval(function(){permute(place)}, 50);
}
function end(place)
{
  demo = false;
  clearInterval(repeater)
  document.getElementById(place).textContent = "Oh, hello there.";
}
String.prototype.replaceAt=function(index, replacement)
{
    return this.substr(0, index) + replacement+ this.substr(index + replacement.length);
}
