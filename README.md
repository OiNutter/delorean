Delorean
========

Delorean is a simple javascript widget for drawing a sequence of events on a timeline using SVG.

Usage
-----

To use delorean you need to include the Prototype and Raphaël libraries in your code, along with the delorean library:

    <script type="text/javascript" src="path/to/prototype.js"></script>
    <script type="text/javascript" src="path/to/raphael.js"></script>
    <script type="text/javascript" src="path/to/delorean.js"></script> 
    
You will also need a div element on the page for delorean to draw the timeline onto.

    <div id="timeline"></div>
    
Then all you need to do is create a new delorean object:

    var timeline = new Delorean(element,events[,options]);
    
The arguments are as follows:

- `element` \- defines the div on page where the timeline will be rendered.
- `events` \- the array of event objects to be displayed. The format of these is detailed below
- `options` \- optional argument providing new options to override the inbuilt defaults.

Events
------

The events argument should be an array of objects that each define an event. Each event should contain the following properties:

- `date` \- A javascript date object that defines when the event takes place.
- `label` \- A string defining the label to be displayed on the time line.

It can also have 2 optional parameters:

- `color` \- A string defining a hex ref for the background colour of the element on the timeline.
- `textColor` \- A string defining a hex ref for the text colour of the element on the timeline.

###Example###

    [
        {
            date: new Date('2011-01-01'),
            label: 'Happy New Year'
        },
        {
            date: new Date('2011-12-25'),
            label: 'Merry Christmas',
            color: '#0f0',
            textColor:'#f00'
        }
    ]

Options
-------

The default options are:

    {
        stroke:'1px', //The stroke width of the actual timeline
        color:'#666', //The stroke colour of the actual timeline
        padding:20, //The distance from the edges that the timeline will be drawn
        height:20, //The height of the line markers
        start:null, //Defines the start date for the timeline, if null will detect earliest date to be displayed
        finish:null, //Defines the end date for the timeline, if null will detect latest date to be displayed
        maxEvents:3, //Sets the maximum number of events to be stacked before using the More... button
        dateFormat: 'd M Y', //Sets the format for the dates to be displayed in
        date:{ //Defines the font style for the date label
                size:9, 
                weight:'bold',
                font:'Helvetica',
                color:'#333'
             },
        event:{ //Defines the font style and default appearance of the event boxes
                size:9,
                weight:'bold',
                font:'Helvetica',
                color:'#fff',
                fill:'#999',
                border:'#ccc'
            }
    }