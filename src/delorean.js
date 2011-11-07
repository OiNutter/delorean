var Delorean = Class.create({
	version: '<%= VERSION %>',
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
				maxEvents:3,
				dateFormat: 'd M Y',
				date:{
					size:9,
					weight:'bold',
					font:'Helvetica',
					color:'#333'
				},
				event:{
					size:9,
					weight:'bold',
					font:'Helvetica',
					color:'#fff',
					fill:'#999',
					border:'#ccc'
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
		
		this.width = parseFloat($(element).getWidth());
 		this.height = parseFloat($(element).getHeight());
 		
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
  		 
 		//draw time line
 		this.timeline = this.paper.path('M' + this.startPos + " " + (this.height/2) + "L" + this.finishPos + " " + (this.height/2));
 		this.timeline.attr('stroke',this.options.color);
 		
 	},
 	plotMarkers: function(){
 		
 		var labels = $A([]),
 			dates = $A([]),
 			x,
 			y1 = ((this.height/2)-(this.options.height/2)),
 			y2 = ((this.height/2)+(this.options.height/2)),
 			range = (this.finish - this.start),
 			inc,
 			alt = false,
 			textY;
 		
 		//group dates
 		this.dates.each(function(tick,i){				 	
				if(dates.indexOf(tick.date.getTime())==-1){
					dates.push(tick.date.getTime());
					labels.push($A([tick]));
				} else {
					labels[dates.indexOf(tick.date.getTime())].push(tick);
				}
			
		},this);
 		
 		this.labels = this.paper.set();
 		
 		//plot start and finish markers
 		start = this.drawLabel(this.options.padding.left,y1,y2,labels.first(),alt);
 		finish = this.drawLabel(this.width-this.options.padding.right,(labels.length%2==0) ? y2 : y1,(labels.length%2==0) ? y1 : y2,labels.last(),(dates.length%2==0));
 		
 		this.labels.push(start);
 		this.labels.push(finish);
  		startBox = start.getBBox();
  		finishBox = finish.getBBox();
  		this.startPos = Math.round((startBox.x+(startBox.width/2)));
  		this.finishPos = Math.round((finishBox.x+(finishBox.width/2)));
 		inc = range/(this.finishPos - this.startPos);
 		
 		
 		dates.each(function(date,i){
 			x = this.startPos + Math.round(((date-this.start.getTime()) / inc));
 			textY = (alt) ? y1 : y2;
 			dateY = (alt) ? y2 : y1;
 			this.paper.path("M" + x + " " + y1 + "L" + x + " " + y2);
 			 			
 			if(i!=0 && i!=dates.length-1)
 				this.labels.push(this.drawLabel(x,dateY,textY,labels[i],alt));
 			
 			alt = !alt;
 		},this);
 	},
 	drawLabel: function(x,dateY,textY,dates,alt){
 		
 		var date = dates.first().date,
 			dateLabel,
 			eventLabel,
 			label,
 			yMod = (alt) ? 1 : -1,
 			i,
 			y,
 			lBox,
 			returnLabel = this.paper.set(),
 			moreBox = this.paper.set();
 			
 
 		
 		//draw date label
 		dateLabel = this.paper.text(x,dateY,this.formatDate(date,this.options.dateFormat)).attr({"fill":this.options.date.color,"text-anchor":"middle",'font-size':this.options.date.size,'font-weight':this.options.date.weight,'font-family':this.options.date.font});
 		returnLabel.push(dateLabel);
 		
 		//get event labels
 		for(i=0;i<dates.length;i++){
 				
 				if(i==this.options.maxEvents-1 && dates.length>this.options.maxEvents){
 					label = this.paper.set();
 					y = dateY + (yMod*((i+1)*(dateLabel.getBBox().height + 11)));
 					eventLabel = this.paper.text(x,y,"More...").attr({"fill":(dates[i].textColor && i<this.options.maxEvents-1) ? dates[i].textColor : this.options.event.color,"text-anchor":"middle",'font-size':this.options.event.size,'font-weight':this.options.event.weight,'font-family':this.options.event.font});
 					label.push(eventLabel);
 					lBox = eventLabel.getBBox();
 					label.push(this.paper.rect(lBox.x-4,lBox.y-4,lBox.width+8,lBox.height+8).attr({"stroke":this.options.event.border,"fill":'#fff'}));
 	 				label.push(this.paper.rect(lBox.x-2,lBox.y-2,lBox.width+4,lBox.height+4).attr({"fill":dates[i].color || this.options.event.fill,"stroke-opacity":0}));
 	 				eventLabel.toFront();
 	 				returnLabel.push(label);
 	 				label.attr("cursor","pointer");
 	 				label.mouseover(this.showMore.bind(moreBox,this,returnLabel));
 					label.mouseout(this.hideMore.bind(moreBox,this));
 				}

 				label = this.paper.set();
	 				
 				if(i < this.options.maxEvents-1 || dates.length<=this.options.maxEvents)
 					y = dateY + (yMod*((i+1)*(dateLabel.getBBox().height + 11)));
 				else
 					y = (dateY-(yMod*this.options.height)) - (yMod*((i-this.options.maxEvents + 1.5)*(dateLabel.getBBox().height + 11)));
 				
 				eventLabel = this.paper.text(x,y,dates[i].label).attr({"fill":(dates[i].textColor && i<this.options.maxEvents-1) ? dates[i].textColor : this.options.event.color,"text-anchor":"middle",'font-size':this.options.event.size,'font-weight':this.options.event.weight,'font-family':this.options.event.font});
 				label.push(eventLabel);
 				lBox = eventLabel.getBBox();
 				label.push(this.paper.rect(lBox.x-4,lBox.y-4,lBox.width+8,lBox.height+8).attr({"stroke":this.options.event.border,"fill":'#fff'}));
 				label.push(this.paper.rect(lBox.x-2,lBox.y-2,lBox.width+4,lBox.height+4).attr({"fill":dates[i].color || this.options.event.fill,"stroke-opacity":0}));
				eventLabel.toFront();
 				 				
 				if(i<this.options.maxEvents-1 || dates.length<=this.options.maxEvents)
 					returnLabel.push(label);
 				else
 					moreBox.push(label);
 			
 		}
 		
 		moreBox.hide();
 		
 		this.positionLabel(returnLabel,dateLabel.getBBox().height,alt);
 		this.positionLabel(moreBox,dateLabel.getBBox().height,!alt);
 		return returnLabel;
 		 		
 	},
 	positionLabel: function(label,lineHeight,alt){
 		var lBox = label.getBBox(),
 			x = 0,
 			y = Math.round((alt?(lineHeight/2)+2: -((lineHeight/2)+2)));
 		
 		
 		
 		if(lBox.x<this.options.padding.left)
 			x = this.options.padding.left - lBox.x;
 		else if((lBox.x+lBox.width) > (this.width - this.options.padding.right))
			x = (this.width-this.options.padding.right)-(lBox.width+lBox.x);
 		
 		label.translate(x,y);
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
 		
 	},
 	showMore: function(timeline,current){
 		timeline.labels.forEach(function(label){
 			if(current!=label)
 				label.attr("fill-opacity",1/3);
 		});
 		this.show();
 	},
 	hideMore: function(timeline){
 		timeline.labels.forEach(function(label){
 			label.attr("fill-opacity",1);
 		});
 		this.hide();
 	}
 	
});