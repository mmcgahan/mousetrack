 * File:        mousetrack.js
 * Version:     1.0
 * Author:      Michael McGahan (mwmlabs.com)
 * Info:        mwmlabs.com/post/mousetrack-js

This is a skeleton jQuery script (not yet plugin) for polling mouse position
and populating a js object with the results, including time stamps and
participant id for JSON consumption by a backend data collection system

# Result() data object

This is a 'class' for result object, containing all point-wise data

This class has no methods, only properties, which keeps the JSON
representation simple and clean.

Attributes:
* participant_id: unique id of participant (researcher-assigned)
* num_points: helper count of the number of recorded datapoints.
This is redundant with len(mouse_pos.x), len(mouse_pos.y) and len(time_stamp)
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
