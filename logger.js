/* jshint node: true */

//return current timestamp in formatted string
var timestamp = function(){
	var padder = function(val, n){
		n = n || 2;
		while(val.toString().length < n){ val = '0'+val; }
		return val;
	};
	
	//get current date/time
	var date = new Date();
	
	//return formatted string
	return [
		padder(date.getHours()),
		padder(date.getMinutes()),
		padder(date.getSeconds()),
		padder(date.getMilliseconds(), 3)
	].join(':');
};

//timestamped log
var logger = function(){
	console.log.call(console, timestamp() + " -- " + [].join.call(arguments, " - "));
};

//return requesting IP address
function ipParse(req){
	return req.headers['x-forwarded-for'] || req.connection.remoteAddress;
}

//return decoded URL
function returnUrl(req){ return decodeURIComponent(req.url); }

var returnValue = {
    log: logger,
	timestamp: timestamp,
	ip: ipParse,
	url: returnUrl
};

var colorPolyfillNames = [ 
    'red', 'green', 'yellow',
    'blue', 'magenta', 'cyan', 
    'white', 'gray', 'dim'
];

colorPolyfillNames.forEach(function(name){
    returnValue[name] = function(){
        return returnValue;
    };
});

//create exports
module.exports = returnValue;
