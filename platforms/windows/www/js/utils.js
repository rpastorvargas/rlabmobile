var RLAB = RLAB || {};     

RLAB.UTIL = ( function() {
    
    function _getParameter(paramName) {
      var searchString = window.location.search.substring(1),
          i, index, paramNameInString, val, params = searchString.split("&");
    
      for (i=0;i<params.length;i++) {
		index = params[i].indexOf("=");
		paramNameInString = params[i].substring(0,index);
        if (paramNameInString == paramName) {
			val = params[i].substring(index+1, params[i].length);
        	return unescape(val);
        }
      }
	  
	  /*for (i=0;i<params.length;i++) {
        val = params[i].split("=");
        if (val[0] == paramName) {
          return unescape(val[1]);
        }
      }*/
	  
      return null;
    }
    
    function _getParametersCount(){
        var searchString = window.location.search.substring(1);
        var _number = 0;
        if (searchString.length>0){
            var params = searchString.split("&");
            _number = params.length;
        }
        return _number;
    }
    
    return {
        getParameter: _getParameter,
        getParametersCount: _getParametersCount,
    };
}()); // End of namespace rlab.util