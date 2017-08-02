/**
 * Created by renecortez on 5/1/17.
 */
$(document).ready(function () {
    'use strict';

    var isStrict = false;
    var isOn = false;
    var hasStarted = false;
    var sequence = [];
    var round = 0;
// user input (inclusive 0-3)
    var press = -1;
// howl object to play sound according to button press
    var btnData = {
        'tl': new Howl({src: ['audio/simonSound1.mp3']}),
        'tr': new Howl({src: ['audio/simonSound2.mp3']}),
        'br': new Howl({src: ['audio/simonSound3.mp3']}),
        'bl': new Howl({src: ['audio/simonSound4.mp3']})
    };
    var errorSound=new Howl({urls:["audio/scream.mp3"]});
    var winSound=new Howl({urls:["audio/cheering.mp3"]});

    //event listener of the 4 buttons
    $("#handheld").on("mousedown",".clickable",function(event) {
        //only if start button has been pressed
        //hasStarted sets true
        if (hasStarted) {
            var id = event.target.id;

            switch (id) {
                case "tl":
                    press = 0;
                    break;
                case "tr":
                    press = 1;
                    break;
                case "br":
                    press = 2;
                    break;
                case "bl":
                    press = 3;
                    break;
            }
        }
    });

    $("#slider-box").click(function(){
        isOn = !isOn;
        $("#slider").toggleClass("on");
        if(!isOn){
            //turning off the game
            $("#indicator").removeClass("ind-on");
            isStrict=false;
            resetGame();
            display("");
        }else{
            //turning on the game
            display("--");
        }
    });

    $("#strict-btn").click(function(){
        //switching strict mode
        if(isOn){
            isStrict = !isStrict;
            $("#indicator").toggleClass("ind-on");
        }
    });

    $("#start-btn").click(function(){
        //start the game
        if(isOn) {
            startGame();
        }
    });
    //function to reset the game, but not start
    function resetGame(){
        hasStarted = false;
        press = -1;
        sequence = [];
        round = 0;
        display ("--");
        setTimeout(function(){
            $("#handheld div").removeClass("clickable");
        },500);
    }

    //function to start the game
    function startGame(){
        $("#handheld div").addClass("clickable");
        sequence = [];
        press = -1;
        hasStarted = true;
        //adding the first entry to our sequence
        addRandomNumber();
        //starting iteration through the sequence
        iterateThrough();
        round = 1;
        display(round);
    }

    //function to display data about game
    function display(data){
        if(data === ""){
            $("#display").text("");
        }else{
            //display 2 characters string prepending 0-s if needed
            data="00"+data;
            data=data.substring(data.length-2);
            $("#display").text(data);
            //"blinking" effect
            setTimeout(function(){
                $("#display").css("color","#ccc");
            },300);
            setTimeout(function(){
                $("#display").css("color","#2ECC40");
            },600);

        }
    }

    //adding random number in range 0-3 inclusive
    function addRandomNumber(){
        var index = Math.floor(Math.random() * 4);
        sequence.push(index);
    }

    function iterateThrough(){

        if(hasStarted){
            //make the buttons unclickable during simon's sequence
            $("#handheld div").removeClass("clickable");
            playSequence(0);
            //after playing the sequence - wait user input
            checkInput(0);
        }
    }

    //make button clickable for player's sequence
    function playSequence(i){
        if(i >= sequence.length || !hasStarted){
            $("#handheld div").addClass("clickable");
            return;
        }
        playTune(sequence[i]);
        setTimeout(function(){playSequence(i+1)},800);
    }

    //play tune from the sequence
    function playTune(index){
        var id=null;
        switch(index){
            case 0:
                id="tl";
                break;
            case 1:
                id="tr";
                break;
            case 2:
                id="br";
                break;
            case 3:
                id="bl";
                break;
        }
        btnData[id].play();
        //effect to when pressing the button
        $("#"+id).addClass("clickeffect");
        setTimeout(function(){
            $("#"+id).removeClass("clickeffect");
        }, 400);
    }

    //when player whens
    function celebrate(){
        setTimeout(function(){
            winSound.play();
        }, 500);

        resetGame();
        display("**");
        $("#handheld div").addClass("clickeffect");
        setTimeout(function(){
            $("#handheld div").removeClass("clickeffect");
        }, 3000);
    }

    //get user input and compare it to the according sequence entry
    function checkInput(i){
        if(hasStarted){
            //if all the sequence has been reproduced without mistakes
            if(i >= sequence.length){
                round++;
                //after passing level 20 - you are a winner!
                if(round > 20){
                    celebrate();
                    return;
                }
                display(round);
                //new entry to the sequence
                addRandomNumber();
                $("#handheld div").removeClass("clickable");
                //play the sequence again(including the new entry)
                setTimeout(function(){iterateThrough();},1500);
                return true;
            }
            //waiting user input
            if(press === undefined|| press < 0){
                setTimeout(function(){checkInput(i)}, 100);
            }else{//got input

                var temp = press;
                press = -1;

                //the input was wrong
                if(temp !== sequence[i]){

                    display("!!");
                    errorSound.play();

                    $("#handheld div").removeClass("clickable");
                    setTimeout(function(){
                        display(round);
                        $("#handheld div").addClass("clickable");
                    },1500);
                    //restart the game in case of strict mode
                    if(isStrict)
                        setTimeout(function(){startGame();},1500);
                    //if normal mode - repeat the sequence(without adding new entry)
                    else
                        setTimeout(function(){iterateThrough();},1500);
                    return false;
                }
                //correct input
                else{
                    //play according sound
                    playTune(temp);
                    //get the next user input
                    setTimeout(function(){checkInput(i+1)},100);
                }
            }
        }
    }
});