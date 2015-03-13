console.log("Loading background page...");
var matchedNumbers = [];

document.addEventListener('DOMContentLoaded', function () {
  
  //when "Compare" button is pressed
  document.getElementById("compareButton").addEventListener('click', function(){
    
    //get both inserted list of numbers
    var availableNumbers = document.getElementById('availableNumbers').value;
    var missingNumbers = document.getElementById('missingNumbers').value;

    //regular expression for numbers
    var numberPattern = /\d+/g;

    //save all numbers in the inserted values using the regular expression
    var identifiedAvailableNumbers = availableNumbers.match( numberPattern );
    var identifiedMissingNumbers = missingNumbers.match( numberPattern );

    //compare both lists
    matchedNumbers = compareStickers(identifiedAvailableNumbers, identifiedMissingNumbers);

    //sort matched numbers (smaller to bigger)
    matchedNumbers.sort(function(a, b){return a-b});

    /* show result */ 

    //fade out current boxes
    $('#content').animate({opacity: 0.0}, 2000, 'linear', function(){
      //switch value of leftside (remove textbox, add new textbox with string)
      $('#leftside').css({"display":"none"});
      $('#newLeftside').css("display","table");

      //prepare array with matched numbers to be displayed
      var preparedmatchedNumbers = prepareResult(matchedNumbers);

      //add result to rightside
      if(matchedNumbers.length > 0){
        $('#stringMatchedNumbers').text("Matched numbers !");
        $('#missingNumbers').val(preparedmatchedNumbers);
        //$('#missingNumbers').attr("readonly","readonly"); //avoid edition
      }else{
        $('#stringMatchedNumbers').text("No matched numbers !");
        $('#missingNumbers').val(":(");
      }
      
      //fade in boxes with new values
      $('#content').animate({opacity: 1},1000,'linear', function(){
        //change button "Compare" to "New Search"
        $('#compareButton').css("display","none");
        $('#newSearch').css("display","inline");
      });
    });
  });

 

  //When "New Search" button is pressed
  document.getElementById("newSearch").addEventListener('click', function(){

    //hide result screen and display insert screen
    $('#content').animate({opacity: 0.0}, 2000, 'linear', function(){ 
      //clean available numbers box
      $('#availableNumbers').val("");

      //change lefside appearance
      $('#newLeftside').css("display","none");
      $('#leftside').css({"display":"initial"});

      // clean missing numbers box
      $('#missingNumbers').val("");
    });

    //fade in boxes with new values
    $('#content').animate({opacity: 1},1000,'linear', function(){
      //$('#newSearch').replaceWith($('#compareButton'));
      $('#newSearch').css({"display":"none"});
      $('#compareButton').css({"display":"initial"}); 
    });

  });

});

//when Chrome Extension button is clicked
chrome.browserAction.onClicked.addListener(function(activeTab)
{
  openletMeCompareThatForYou();
});

function openletMeCompareThatForYou(){
   var newURL = "letMeCompareThatForYou.html";
   chrome.tabs.create({ url: newURL }, function (tab){
   	console.log("Opening Extension...");
   });
}

function compareStickers(availableNumbers, missingNumbers){
  var finalStickers = [];

  for (i = 0; i < availableNumbers.length; i++) { 
    var isAvailable = availableNumbers.indexOf(missingNumbers[i]);
    if(isAvailable > -1){
      console.log("Looks like we have a match here !");
      finalStickers.push(missingNumbers[i]);
    }
  }

  return finalStickers;
}

function prepareResult(array){
  console.log("AQUI!");
  var result = "";
  var spacer = " - ";

  for(i=0; i < array.length; i++){
    result += array[i];
    result += spacer;
  }

  //remove last spacer
  result = result.substring(0, result.length - 3);
  return result;
}
