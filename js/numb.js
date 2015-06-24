$(document).ready(function() {

  $("#eq").css('cursor', 'pointer');
  $("#eq").click(startQuestions);
  $("#timestats").hide();
  $("#abox").hide();
  $("#abox").keypress(function (e){
    if (e.which == 13)
    {
      checkAnswer($("#abox").val());
    }
  });

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
  $("#timestats").show();
  $("#abox").show();
  $("#eq").css({"background-color": "#ffffff", "font-size": "80px", "font-family": "\"HelveticaNeue\", \"Helvetica Neue\", Helvetica, Arial, sans-serif"});
  $("#eq").html("");
  console.log("starting questions....");
  getQuestion();
  window.setTimeout(endQuestions, 30000);
  displayElapsed();
}

function getQuestion()
{
  console.log("get question.")
  op1 = getRanInt(min, max);
  op2 = getRanInt(min, max);
  $("#eq").html(op1 + " <span class=\"operator\">x</span> " + op2);
}


function checkAnswer(a)
{
  console.log("check answer.");
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
  console.log("time up");
  $("#abox").hide();
  $("#eq").css({"background-color": "#ebebeb", "font-size": "80px"});
  $("#eq").html(solved + " <span class=\"solved\">solved</span>");
  $("#timestats").html("click the box to start again.");
  ongoingRound = false;
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
