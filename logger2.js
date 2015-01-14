/* jshint node: true */
var util = require('util');

// note: Apparently, reset is 0. I still need to test that

// console colors
// https://gist.github.com/catdad/3cf37a65c2d5660d858e
var color = {
    red:     [31, 39],
    green:   [32, 39],
    yellow:  [33, 39],
    blue:    [34, 39],
    magenta: [35, 39],
    cyan:    [36, 39],
    white:   [37, 39],
    gray:    [90, 39],
    dim:     [2, 22]
};

function getColorFunction(colorObj){
    var col = '\x1b[' + colorObj[0] + 'm',
        reset = '\x1b[' + colorObj[1] + 'm';
//    var col = '\u001b[' + colorObj[0] + 'm',
//        reset = '\u001b[' + colorObj[1] + 'm';
    
    return function(str){
        return col + str + reset;
    };
}
 
for (var key in color) {
    color[key] = getColorFunction(color[key]);
}

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
var logString = function() {
    return util.format.apply(util, arguments);
};

//return requesting IP address
function ipParse(req){
	return req.headers['x-forwarded-for'] || req.connection.remoteAddress;
}

//return decoded URL
function returnUrl(req){ return decodeURIComponent(req.url); }

function Logger(colorKey){
    // use a white default if no key is specified
    if (!color[colorKey]) { colorKey = 'white'; }
    
    this.log = function(){
        var str = logString.apply(undefined, arguments);
        console.log(color.cyan(timestamp()), '--', color[colorKey](str));
        
        return this;
    };
    this.timestamp = function(){
        return timestamp();
    };
    this.ip = ipParse;
    this.url = returnUrl;
    this.ln = function() { 
        console.log('');
    };
    
    var that = this;
    
    // augment the object with color formatters
    function colorLoggerGenerator(key) {
        return function(){
            return new Logger(key);
        };
    }
    
    for (var key in color) {
        that[key] = colorLoggerGenerator(key);
    }
}

//create exports
module.exports = new Logger();
