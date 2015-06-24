$(document).ready(function() {

  $("#eq").css('cursor', 'pointer');
  $("#eq").click(startQuestions);
  $("#abox").hide();
  $("#abox").keypress(function (e){
    if (e.which == 13)
    {
      checkAnswer($("#abox").val());
    }
  });
  readCookie();

});
var min = 2;
var max = 9;
var solved = 0;
var op1 = 0;
var op2 = 0;
var ongoingRound = false;
var seconds = 0;
var mili = 0;

// launches the first question.
function startQuestions()
{
  if (ongoingRound)
    return;

  solved = 0;
  seconds = 0;
  mili = 0;
  ongoingRound = true;
  $("#abox").show();
  $("#abox").val("");
  $("#eq").css({"background-color": "#ffffff", "font-size": "80px", "font-family": "\"HelveticaNeue\", \"Helvetica Neue\", Helvetica, Arial, sans-serif"});
  $("#eq").html("");
  //console.log("starting questions....");
  getQuestion();
  window.setTimeout(endQuestions, 30000);
  displayElapsed();
}

function getQuestion()
{
  //console.log("get question.")
  op1 = getRanInt(min, max);
  op2 = getRanInt(min, max);
  $("#eq").html(op1 + " <span class=\"operator\">x</span> " + op2);
}


function checkAnswer(a)
{
  //console.log("check answer.");
  if (op1 * op2 == a)
  {
    getQuestion();
    $("#abox").val("");
    solved += 1;
  }
}

// http://stackoverflow.com/questions/4959975/
// generate-random-value-between-two-numbers-in-javascript
function getRanInt(a,b)
{
    return Math.floor(Math.random()*(b-a+1)+a);
}

// display # solved in 30 seconds
function endQuestions()
{
  //console.log("time up");
  $("#abox").hide();
  $("#eq").css({"background-color": "#ebebeb", "font-size": "80px"});
  $("#eq").html(solved + " <span class=\"solved\">solved</span>");
  $("#timestats").html("click the box to start again.");
  ongoingRound = false;

  var b = getCookie("best");
  if (b == "" || b.toString() < solved)
  {
    document.cookie="best="+solved;
    readCookie();
  }
}

function displayElapsed()
{
  if(!ongoingRound)
    return;

  window.setTimeout(displayElapsed, 100);
  mili += 1;
  if (mili == 10)
  {
    seconds += 1;
    mili = 0;
  }
  time = seconds + "." + mili;
  $("#timestats").html(time + " out of 30 seconds.");
}

function readCookie()
{
  var best = getCookie("best");
  if (best == "")
    best = "0";
  $("#morestats").html("<p> High Score </p><p class=\"high\">" + best + "</p>");
}

// http://www.w3schools.com/js/js_cookies.asp
function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
    }
    return "";
}
