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
				dateFormat: 'd M Y',
				text:{
					size:9,
					weight:'bold',
					font:'Helvetica',
					color:'#333'
				}	
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
 		
 		this.dates=dates.sort(function(a,b){
 			return a.date - b.date;
 		});
 		
 		this.start = this.options.start || this.dates.first().date;
 		this.finish = this.options.finish || this.dates.last().date;
 		
 		
		this.paper = Raphael(element);
		this.plotMarkers();
		this.drawTimeLine();

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
 		this.timeline = this.paper.path('M' + this.startPos + " " + (this.paper.height/2) + "L" + this.finishPos + " " + (this.paper.height/2));
 		this.timeline.attr('stroke',this.options.color);
 		
 	},
 	plotMarkers: function(){
 		
 		var markers=this.paper.set(),
 			label,
 			x,
 			y1 = ((this.paper.height/2)-(this.options.height/2)),
 			y2 = ((this.paper.height/2)+(this.options.height/2)),
 			range = (this.finish - this.start),
 			inc,
 			alt = false,
 			textY,
 			labelTxt,
 			lBox;
 	
 		//plot start and finish markers
 		
 		start = this.drawLabel(this.options.padding.left,y1,this.dates.first(),alt);
 		finish = this.drawLabel(this.paper.width-this.options.padding.right,(this.dates.length%2==0) ? y2 : y1,this.dates.last(),(this.dates.length%2==0));
 		  		
  		startBox = start.getBBox();
  		finishBox = finish.getBBox();
  		this.startPos = Math.round((startBox.x+(startBox.width/2)));
  		this.finishPos = Math.round((finishBox.x+(finishBox.width/2)));
 		inc = range/(this.finishPos - this.startPos);
  		  		
 		this.dates.each(function(tick,i){
 			
 				x = this.startPos + Math.round(((tick.date-this.start) / inc));
 				textY = (alt) ? y2 : y1;
 				labelTxt = this.formatDate(tick.date,this.options.dateFormat) + "\n" + tick.label; 
 				
 				markers.push(this.paper.path("M" + x + " " + y1 + "L" + x + " " + y2));
 				markers[i].attr('stroke',tick.color || this.options.color);
 				
 				if(i!=0 && i!=this.dates.length-1)
 					label = this.drawLabel(x,textY,tick,alt);
 				 				
 				alt = !alt;
 			
 		},this);
 		
 	},
 	drawLabel: function(x,y,date,alt){
 		labelTxt = this.formatDate(date.date,this.options.dateFormat) + "\n" + date.label; 
 		label =  this.paper.text(x,y,labelTxt).attr({"fill":date.textColor || this.options.text.color,"text-anchor":"middle",'font-size':this.options.text.size,'font-weight':this.options.text.weight,'font':this.options.text.font});
 		
 		lBox = label.getBBox();
 		
 		label.translate(0,Math.round((alt?(lBox.height/2)+2: -((lBox.height/2)+2))));
 		
 		if(lBox.x<this.options.padding.left)
 			label.attr("x",this.options.padding.left+(lBox.width/2));
 		else if((lBox.x+lBox.width) > (this.paper.width - this.options.padding.right))
			label.attr("x",(this.paper.width-this.options.padding.right)-(lBox.width/2));

 		return label;
 	},
 	formatDate: function(date,format){
 		
 		var months = ['January','February','March','April','May','June','July','August','September','October','November','December'],
 			days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
 		
 		switch(format){
 			case 'd/m/Y' : return date.getDate() + "/" + date.getMonth() + "/" + date.getYear(); break;
 			case 'm/d/Y' : return date.getMonth() + "/" + date.getDate() + "/" + date.getYear(); break;
 			case 'Y-m-d' : return date.getFullYear() + "-" + date.getMonth() + "/" + date.getDate(); break;
 			case 'd M Y' : return date.getDate() + " " + months[date.getMonth()].substr(0,3) + " " + date.getFullYear(); break;  
 			case 'd F Y' : return date.getDate() + " " + months[date.getMonth()] + " " + date.getFullYear(); break;
 			case 'D d M y': return days[date.getDaydate.getDate()].substr(0,3) + " " + months[date.getMonth()].substr(0,3) + " " + date.getFullYear().substr(2); break;
 			case 'l d M y': return days[date.getDaydate.getDate()] + " " + months[date.getMonth()].substr(0,3) + " " + date.getFullYear().substr(2); break;
 			case 'l d F y': return days[date.getDaydate.getDate()] + " " + months[date.getMonth()] + " " + date.getFullYear().substr(2); break;
 			default: return date;
 		} 		
 		
 	}
});