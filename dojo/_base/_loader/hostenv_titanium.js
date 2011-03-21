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
    xhr.send = function(data) {
        return _xhr.send(data);
    };
    xhr.setRequestHeader = _xhr.setRequestHeader;
    xhr.getResponseHeader = _xhr.getResponseHeader;
    xhr.setTimeout = _xhr.setTimeout;
    xhr.abort = _xhr.abort;

    _xhr.onerror = _xhr.onload = function() {
        Ti.API.info('onload or onerror start');
        xhr.responseText = _xhr.responseText;
        /*try {
            xhr.responseXML = _xhr.responseXML;
        } catch(e) {}*/
        xhr.status = _xhr.status;
        Ti.API.info('onload or onerror end');
    };

    _xhr.onreadystatechange = function() {
        xhr.readyState = _xhr.readyState;
    };
    xhr.readyState = _xhr.readyState;

    xhr.open = function(method, url, async, user, password) { //Ti.API.info('xhr.open()');
        var ret = _xhr.open(method, url, async);

        // Headers must be added *after* the XHR is opened, with Titanium.
        //if (args.hasOwnProperty('user') && args.hasOwnProperty('password')) { Ti.API.info('adding auth to obj');
        if (user && password) {
            var authstr = 'Basic ' + Ti.Utils.base64encode(user + ':' + password);

            _xhr.setRequestHeader('Authorization', authstr);
        }

        return ret;
    };



    return xhr;
};

dojo._isDocumentOk = function(http){ 
    var stat = http.status || 0;
    return (stat >= 200 && stat < 300) || // Boolean
        stat == 304 ||			// allow any 2XX response code
        stat == 1223 ||			// get it out of the cache
		                        // Internet Explorer mangled the status code
        !stat; // OR we're Titanium/browser chrome/chrome extension requesting a local file
}


dojo._loadUri = function(uri){ Ti.API.info('_loadUri("'+uri+'")');
    // The worst hacks, for the worst hacks.
    
    var removeSubstr = function(haystack, needle) {
        return haystack.split(needle).join('');
    };
    //alert(dojoConfig.tiBaseDir + '/' + uri.split('./').join(''));
    var baseDir = dojoConfig.tiBaseDir;
    if (uri.indexOf('./../dojox/') === 0) {
        baseDir = dojoConfig.tiBaseDirDojox;
        uri = removeSubstr(uri, './../dojox/');
    }
    var ok = require(baseDir + '/' + removeSubstr(removeSubstr(uri, './'), '.js'));
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


