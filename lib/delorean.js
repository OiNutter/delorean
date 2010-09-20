var Delorean = Class.create({
	initialize: function(element,dates,options){
		//check element exists
		if(!$(element))
			throw new Error('Element does not exist: '  + element);
		
		this.options = {
				stroke:'1px',
				color:'#ccc'				
		};
		
		//merge specified options with defaults;
 		this.extendOptions(this.options,options || {});
 		
		this.paper = Raphael(element);
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
 	}
});