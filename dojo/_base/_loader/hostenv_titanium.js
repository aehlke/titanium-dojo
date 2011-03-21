/*
 * Titanium host environment
 */

if(dojo.config["baseUrl"]){
	dojo.baseUrl = dojo.config["baseUrl"];
}else{
	dojo.baseUrl = "./";
}

dojo._name = 'titanium';

/*=====
dojo.isSpidermonkey = {
	// summary: Detect spidermonkey 
};
=====*/

dojo.isTitanium = true;
//dojo.isBrowser = false;
dojo.exit = function(exitcode){ 
	quit(exitcode); 
}

if(typeof print == "function"){
	console.debug = print;
}



dojo._xhrObj = function(args){ Ti.API.info('_xhrObj()'); Ti.API.info(args);
    var _xhr = Ti.Network.createHTTPClient(args);

    // Our wrapper XHR object. We're going to override the open method.
    var xhr = {};
    xhr.send = _xhr.send;
    xhr.setRequestHeader = _xhr.setRequestHeader;
    xhr.setTimeout = _xhr.setTimeout;
    xhr.abort = _xhr.abort;

    xhr.open = function(method, url, async, user, password) { Ti.API.info('xhr.open()');
        var ret = _xhr.open(method, url, async);

        // Headers must be added *after* the XHR is opened, with Titanium.
        //if (args.hasOwnProperty('user') && args.hasOwnProperty('password')) { Ti.API.info('adding auth to obj');
        if (user && password) { Ti.API.info('adding auth to obj');
            var authstr = 'Basic ' + Ti.Utils.base64encode(user + ':' + password);
            Ti.API.info(authstr);

            _xhr.setRequestHeader('Authorization', authstr);
        }

        return ret;
    };


    return xhr;
}



dojo._loadUri = function(uri){ Ti.API.info('_loadUri("'+uri+'")');
	// spidermonkey load() evaluates the contents into the global scope (which
	// is what we want).
	// TODO: sigh, load() does not return a useful value. 
	// Perhaps it is returning the value of the last thing evaluated?
	//var ok = load(uri);
    var removeSubstr = function(haystack, needle) {
        return haystack.split(needle).join('');
    };
    //alert(dojoConfig.tiBaseDir + '/' + uri.split('./').join(''));
    var ok = require(dojoConfig.tiBaseDir + '/' + removeSubstr(removeSubstr(uri, './'), '.js'));
    //var ok = require(uri);
	// console.log("spidermonkey load(", uri, ") returned ", ok);
	return 1;
}

//Register any module paths set up in djConfig. Need to do this
//in the hostenvs since hostenv_browser can read djConfig from a
//script tag's attribute.
if(dojo.config["modulePaths"]){
	for(var param in dojo.config["modulePaths"]){
		dojo.registerModulePath(param, dojo.config["modulePaths"][param]);
	}
}


dojo.require('dojo._base.xhr');


