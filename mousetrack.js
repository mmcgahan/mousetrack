/*
 * File:        mousetrack.js
 * Version:     1.0
 * Author:      Michael McGahan (mwmlabs.com)
 * Info:        mwmlabs.com/post/mousetrack-js

This is a skeleton jQuery script (not yet plugin) for polling mouse position
and populating a js object with the results, including time stamps and
participant id for JSON consumption by a backend data collection system
 */

function Result() {
    /*
    'Class' for result object, containing all point-wise data

    This class has no methods, only properties, which keeps the JSON
    representation simple and clean.

    Attributes:
    * participant_id: unique id of participant (researcher-assigned)
    * num_points: helper count of the number of recorded datapoints.
        This is redundant with len(mouse_pos.x), len(mouse_pos.y) and
        len(time_stamp)
    * mouse_pos: Point object with separate arrays of x and y values
    * time_stamp: array of time stamp for each point

    The JSON representation:

    result = {
        participant_id: 'string',
        num_points: int,
        mouse_pos: {
            x: [int,int,...],
            y: [int,int,...]
        },
        time_stamp: [int,int,...]
    }

    */
    this.participant_id = null;
    this.num_points = 0;
    this.mouse_pos = {
        "x" : [],
        "y" : []
    };
    this.time_stamp = [];
}

$(function() {
    // jQuery

    // intialize variables
    var curMouseX = 0;
    var curMouseY = 0;
    var startTime = new Date();
    var timeLimit = 0;
    var tid;
    // set data polling interval in ms - this can be set by form input as well
    var freq = 1000;

    var results = new Result();

    /*
    Interface setup - jQuery UI (optional)

    In general, you want to have a start button - a 'play' icon works well
    and is easy to set up with jQuery UI
    */
    $(".run").button({
        icons: {
                primary: "ui-icon-play"
            }
    });

    /*
    Mouse position listener

    This event listener continuously sets the curMouseX and curMouseY variables
    to the current mouse position as a *percentage* of the left, right, top,
    and bottom halves of the screen, i.e. -100 to 100 for each axis.
    */
    $(document).mousemove(function(e){
        curMouseX = Math.round((e.clientX - $(this).width()/2)/($(this).width())*2*100);
        curMouseY = Math.round(-((e.clientY - $(this).height()/2))/($(this).height())*2*100);
    });

    // record mouse position and timestamp in seconds
    function recordMouse() {
        var now = new Date();
        var curTime = String(Math.round((now - startTime)/100));
        curTime = curTime.split("");
        curTime.splice(curTime.length-1,0,".");
        curTime = curTime.join("");
        results.mouse_pos.x.push(curMouseX);
        results.mouse_pos.y.push(curMouseY);
        results.time_stamp.push(Math.floor((now - startTime)/100)*100);
        results.num_points++;
        if (timeLimit > 0 && (now - startTime) > timeLimit) {
            stopRun();
        }
    }

    function startRun() {
        // start new run & initialize new 'results' object
        startTime = new Date();
        recordMouse();
        tid = setInterval(recordMouse, freq);
        if ($("#t_limit").val() !== "") {
            // if a time limit is set (in seconds), set the global timeLimit variable
            timeLimit = $("#t_limit").val()*1000;
        }
        // reset the results object
        results = new Result();
        results.participant_id = $("#participant_id").val();
    }

    function stopRun() {
        // to be called when you want to stop the timer
        // stop the recordMouse() timer
        clearInterval(tid);
        submitRun(results);
    }

    function submitRun(data) {
        // submits Results object to backend data processor. Success indicates data is recorded
        $.ajax({
            type: 'POST',
            url: document.URL,
            data: JSON.stringify(data),
            dataType: 'json',
            contentType: 'application/json',
            success: function(response) {
                runSubmitted = true;
            },
            error: function(jqXHR, textStatus, errorThrown){
                $("body").html(errorThrown + jqXHR.responseText);
            }
        });
    }

    $("#startRun").click(function() {
        if ($("#participant_id").val() !== "") {
            startRun();
        }
    });
    $("#stopRun").click(function() {
        stopRun();
    });

});
