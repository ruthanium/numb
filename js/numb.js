$(document).ready(function() {
  $("#settings").hide();
  $("#eq").css('cursor', 'pointer');
  $("#beq").css('cursor', 'pointer');
  $("#eq").click(startQuestions);
  $("#beq").click(function() {
    if (ongoingRound)
    {
      $("#settings").hide();
      return;
    }

    $("#settings").toggle();
  });
  $("#minbox").change(setRange);
  $("#maxbox").change(setRange);
  $("#abox").hide();
  $("#abox").keypress(function (e){
    if (e.which == 13)
    {
      checkAnswer($("#abox").val());
    }
  });
  readCookie();

  $(".but").click(handleButtonPress);

});

var min = 2;
var max = 9;
var solved = 0;
var op1 = 0;
var op2 = 0;
var operator = "*";
var ongoingRound = false;
var seconds = 0;
var mili = 0;
var multb = true;
var addb = false;
var subb = false;
var divb = false;
var incorrect = 0;
var chartMax = 50;

// launches the first question.
function startQuestions()
{
  if (ongoingRound)
    return;

  // ensure that the parameters for a run are valid.
  if (!addb && !subb && !multb && !divb)
  {
    alert("At least one operator must be selected!");
    return;
  }
  if(min >= max || (min + 2) >= max)
  {
    alert("The min and max number are invalid. They have been reset to the default.");
    min = 2;
    $("#minbox").val(2);
    max = 9;
    $("#maxbox").val(9);
    return;
  }

  solved = 0;
  incorrect = 0;
  seconds = 0;
  mili = 0;
  ongoingRound = true;
  $("#abox").show();
  $("#settings").hide();
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

  var op_choices = [];
  if (addb)
    op_choices.push("+");
  if (subb)
    op_choices.push("-");
  if (multb)
    op_choices.push("x");
  if (divb)
    op_choices.push("/");
  op = getRanInt(1,op_choices.length);
  operator = op_choices[op-1];

  $("#eq").html(op1 + " <span class=\"operator\">" + op_choices[op-1] + "</span> " + op2);
}


function checkAnswer(a)
{
  //console.log("check answer.");
  ans = 0;
  if (operator == "x")
    ans = op1 * op2;
  if (operator == "+")
    ans = op1 + op2;
  if (operator == "-")
    ans = op1 - op2;
  if (operator == "/")
    ans = op1 / op2;

  if (ans == a)
  {
    getQuestion();
    $("#abox").val("");
    solved += 1;
  }
  else
    incorrect += 1;
}


function handleButtonPress()
{
  if (ongoingRound)
  {
    $("#settings").hide();
    return;
  }

  $(this).toggleClass("button-primary");
  var id = $(this).attr('id');

  if (id == "subb")
    subb = !subb;
  if (id == "addb")
    addb = !addb;
  if (id == "multb")
    multb = !multb;
  if (id == "divb")
    divb = !divb;
}

function setRange()
{
  if (ongoingRound)
  {
    $("#settings").hide();
    return;
  }
  min = parseInt($("#minbox").val());
  max = parseInt($("#maxbox").val());

}

// display # solved in 30 seconds
function endQuestions()
{
  //console.log("time up");
  $("#abox").hide();
  //$("#eq").css({"font-size": "80px"});
  var acc = 0;
  if (solved + incorrect != 0)
  {
    acc = (solved)/(solved+incorrect);
    acc = acc.toPrecision(2);
  }
  $("#eq").html('<div id="uppereq" class="six columns offset-by-three">'+solved+'</div><div id="lowereq" class="six columns offset-by-three">solved<p class="reduced">accuracy: '+acc+'</p></div>');
  //$("#eq").html(solved + " <span class=\"solved\">solved</span>");
  $("#timestats").html("click the box to start again.");
  ongoingRound = false;

  // update high score and past score cookie information as needed
  var b = getCookie("best");
  if (b == "" || b.toString() < solved)
  {
    document.cookie="best="+solved;
    readCookie();
  }

  var b = getCookie("pastScores");
  var arr = [];
  if (b != "")
  {
    arr = JSON.parse(b);
  }
  if (arr.length == chartMax)
    arr.shift();
  arr.push(solved);
  document.cookie="pastScores="+JSON.stringify(arr);

  // update chart
  tick({val:solved});
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
  $("#morestats").html("<p style=\"margin-bottom:10px;\"> Personal Best </p><p class=\"high\">" + best + "</p>");
}

function getLatestScores()
{
    b = getCookie("pastScores");
    var arr = []
    if (b != "")
      arr = JSON.parse(b);

    var pastScores = [];
    for (var i = 0; i < arr.length; i++)
    {
      pastScores.push({val: arr[i]});
    }

    return pastScores;
}

// update function for the line chart
function tick(latest)
{
    console.log("tick");
    console.log(latest);
    //console.log("SENT: " + sentcount + " DROPPED: " + droppedcount);

    // add the latest data point
    data.push(latest);

    // redraw the line
    svg.selectAll(".line")
        .attr("d", line)
        .attr("transform", null);


    // slide the line left
    if (data.length > chartMax)
    {
      // pop the old data point off the front
      data.shift();
      //allscores.transition().attr("transform", "translate(" + x(data.attempt) + ")");
      allscores.transition().attr("d", line);
    }
}

// http://www.w3schools.com/js/js_cookies.asp, can replace with JSON.stringify probably
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
// http://stackoverflow.com/questions/4959975/
// generate-random-value-between-two-numbers-in-javascript
function getRanInt(a,b)
{
    return Math.floor(Math.random()*(b-a+1)+a);
}
