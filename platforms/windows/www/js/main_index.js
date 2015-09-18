var RLAB = RLAB || {};     
RLAB.CLIENT = RLAB.CLIENT || {};

RLAB.CLIENT.INDEX = ( function() {

    // Private variables
    // token parameters
    var _isUsedToken = false;
    var _tokenId = null;
    var  _tokenInfo = null;
    // lab parameters
    var _id = null;
    var _username = null;
    var _experiment_id = null;
    var _startTime = null;
    var _stopTime = null;
    var _slot_time = -1 ; // Minutes
    
    // Private methods
    
    function _checkTokenParameter(onErrorCheckingToken){
		var ok = false;
        var parametersCount = RLAB.UTIL.getParametersCount();
        if (parametersCount == 1){
            _isUsedToken = true;
            _tokenId = RLAB.UTIL.getParameter("token_id");
            if (_tokenId != null){
                _tokenInfo = RLAB.SERVICES.TOKENS.getTokenInfo(_tokenId);
                if (_tokenInfo == null){
                    if (!RLAB.SERVICES.TOKENS.getInvocationStatus()){
                        // Invalid token
                        // 1) Network error with web service
                        // 2) Not valid token
                        // Update UI
                        onErrorCheckingToken("Invalid token: " + RLAB.SERVICES.TOKENS.getInvocationMessage());
                    }
                } else {
                    // Valid token
                    ok = true;
                    // Get the information from token
                    _id = _tokenInfo.systemId;
                    _username = _tokenInfo.user;
                    _experiment_id = _tokenInfo.experimentId;
                    _startTime = parseFloat(_tokenInfo.startDate);
                    _stopTime = parseFloat(_tokenInfo.stopDate);
                    _slot_time = (_stopTime - _startTime)/1000/60 ; // Minutes 
                }
            }
        } else {
            // Update UI
            onErrorCheckingToken("Invalid parameters to access to the laboratory/experiment");
        }
        return ok;
    }
    
    function _getTokenInfo(){
        return _tokenInfo;
    }
    
    function _getTokenId(){
        return _tokenId;
    }
	
	function _redirectToExperiment(){
		// Access to the experiment...
        window.location = "checks.html?token_id=" +  _tokenId;
	}
    
    // PUBLIC API
    return {
        checkTokenParameter: _checkTokenParameter,
        getTokenInfo: _getTokenInfo,
        getTokenId: _getTokenId,
		redirectToExperiment: _redirectToExperiment
    };
              
}()); // End of namespace rlab.services.token