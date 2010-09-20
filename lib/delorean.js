var Delorean = Class.create({
	initialize: function(element,dates,options){
		//check element exists
		if(!$(element))
			throw new Error('Element does not exist: '  + element);
		
		this.options = {
				stroke:'1px',
				color:'#666',
				padding:20,
				height:20,
				start:null,
				finish:null,
				dateFormat: 'd M Y'
		};
		
		//merge specified options with defaults;
 		this.extendOptions(this.options,options || {});
 		
 		//turn padding into object
 		if(Object.isNumber(this.options.padding)){
 			this.options.padding = {
 					top:this.options.padding,
 					right: this.options.padding,
 					left: this.options.padding,
 					bottom: this.options.padding
 			};
 		}
 		
 		this.start = this.options.start || dates.first().date;
 		this.finish = this.options.finish || dates.last().date;
 		
 		console.log('start',this.start);
 		console.log('finish',this.finish);
 		
 		this.dates = dates;
		this.paper = Raphael(element);
		this.drawTimeLine();
		this.plotMarkers();
		box = this.paper.getBBox();
		console.log(box);
	},
	extendOptions: function(destination,source){
		var property,prop;
		for (property in source){
			if(Object.values(destination[property]).length>0 && Object.values(source[property]).length>0){
				for(prop in source[property])
 			 		destination[property][prop] = source[property][prop];
 			 } else {
 			 	destination[property] = source[property];
 			 }
 		}
		return destination;
 	},
 	drawTimeLine: function(){
 
 		var timeline,
 			startMark,
 			finishMark;
 		 
 		//draw time line
 		this.timeline = this.paper.path('M' + this.options.padding.left + " " + (this.paper.height/2) + "L" + ((this.paper.width*0.9) - this.options.padding.right) + " " + (this.paper.height/2));
 		this.timeline.attr('stroke',this.options.color);
 		
 		
 		//draw start and finish markers
 		if(this.options.start!=null){
 			startMark = this.paper.path('M' + this.options.padding.left + " " + ((this.paper.height/2)-(this.options.height/2)) + "L" + this.options.padding.left + " " + ((this.paper.height/2)+(this.options.height/2)));
 			startMark.attr('stroke',this.options.color);
 		}
 		if(this.options.finish !=null){
 			finishMark = this.paper.path('M' + (this.paper.width - this.options.padding.right) + " " + ((this.paper.height/2)-(this.options.height/2)) + "L" + (this.paper.width - this.options.padding.right) + " " + ((this.paper.height/2)+(this.options.height/2)));
 			finishMark.attr('stroke',this.options.color);
 		}
 	},
 	plotMarkers: function(){
 		
 		var markers=this.paper.set(),
 			label,
 			x,
 			y1 = ((this.paper.height/2)-(this.options.height/2)),
 			y2 = ((this.paper.height/2)+(this.options.height/2)),
 			range = (this.finish - this.start),
 			tBox = this.timeline.getBBox(),
 			inc = range/tBox.width,
 			alt = false,
 			textY,
 			labelTxt,
 			lBox;
 		
 		console.log('range',range);
 		console.log('width',tBox.width);
 		console.log('inc',inc);
 		
 		dates.each(function(tick,i){
 			
 			x = this.options.padding.left + Math.round(((tick.date-this.start) / inc));
 			textY = (alt) ? y2 : y1;
 			labelTxt = this.formatDate(tick.date,this.options.dateFormat) + "\n" + tick.label; 
 			
 			markers.push(this.paper.path("M" + x + " " + y1 + "L" + x + " " + y2));
 			markers[i].attr('stroke',this.options.color);
 			label = this.paper.text(x,textY,labelTxt).attr({"text-anchor":"middle",'font-size':9,'font-weight':'bold','font':'Helvetica'});
 			lBox = label.getBBox();
 			label.translate(0,(alt?(lBox.height/2)+2: -((lBox.height/2)+2)));
 			
 			alt = !alt;
 		},this);
 		 		
 	},
 	formatDate: function(date,format){
 		
 		var months = ['January','February','March','April','May','June','July','August','September','October','November','December'],
 			days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
 		
 		switch(format){
 			case 'd/m/Y' : return date.getDate() + "/" + date.getMonth() + "/" + date.getYear(); break;
 			case 'm/d/Y' : return date.getMonth() + "/" + date.getDate() + "/" + date.getYear(); break;
 			case 'Y-m-d' : return date.getYear() + "-" + date.getMonth() + "/" + date.getDate(); break;
 			case 'd M Y' : return date.getDate() + " " + months[date.getMonth()].substr(0,3) + " " + date.getYear(); break;  
 			case 'd F Y' : return date.getDate() + " " + months[date.getMonth()] + " " + date.getYear(); break;
 			case 'D d M y': return days[date.getDaydate.getDate()].substr(0,3) + " " + months[date.getMonth()].substr(0,3) + " " + date.getYear().substr(2); break;
 			case 'l d M y': return days[date.getDaydate.getDate()] + " " + months[date.getMonth()].substr(0,3) + " " + date.getYear().substr(2); break;
 			case 'l d F y': return days[date.getDaydate.getDate()] + " " + months[date.getMonth()] + " " + date.getYear().substr(2); break;
 			default: return date;
 		} 		
 		
 	}
});