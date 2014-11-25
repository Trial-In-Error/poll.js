var numberText = {
	hundred : "Hundra",
	thousand : "K",
	tenthousand : "10K",
	hundredthousand : "100K"
}

var textformat = {
		numberShorten : function(value){
			var length = value.toString().length;
			if(value < 100){
				return [1,numberText.hundred];
			}else if(value < 1000){
				return [100,numberText.hundred];
			}else if (value < 10000){
				return [1000,numberText.thousand];
			}else if (value < 100000){
				return [10000,numberText.tenthousand];
			}else if (value < 100000){
				return [100000,numberText.hundredthousand];
			}
		}
		
}

String.prototype.trunc = String.prototype.trunc ||
      function(n){
          return this.length>n ? this.substr(0,n-1)+'...' : this.toString();
      };