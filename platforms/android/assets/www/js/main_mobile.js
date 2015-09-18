var RLAB = RLAB || {};     
RLAB.CLIENT = RLAB.CLIENT || {};

RLAB.CLIENT.MOBILE = ( function() {

    // Private variables
    var _lab_id = null;
	var _lab_experiment_id = null;
	var _labAccess = false;
	var _experimentAccess = false;
	
    // Private methods
    function _checkLabParameters(onErrorCheckingLabParameters){
		var ok = false;
		var parametersCount = RLAB.UTIL.getParametersCount();
		if (parametersCount == 1){
            _lab_id = RLAB.UTIL.getParameter("lab_id");
			if (_lab_id == null){
                onErrorCheckingLabParameters("Invalid Laboratory reference.");
			} else {
				ok = _checkLabInfo();
				if (ok){
					_labAccess = ok;	
				} else {
					onErrorCheckingLabParameters("Invalid Laboratory reference: Lab do not exist.");
				}
				
			}
        } else if (parametersCount == 2){
			_lab_id = RLAB.UTIL.getParameter("lab_id");
			_lab_experiment_id = RLAB.UTIL.getParameter("lab_experiment_id");
			if (_lab_id == null || _lab_experiment_id == null){
				onErrorCheckingLabParameters("Invalid Laboratory/Experiment reference.");
			} else {
				ok = _checkLabInfo();
				if (ok){
					// Check for experiment info
					ok = _checkExperimentInfo();
					if (ok){
						_experimentAccess = ok;
					} else {
						onErrorCheckingLabParameters("Invalid Experiment reference: Experiment do not exist.");
					}
				} else {
					onErrorCheckingLabParameters("Invalid Laboratory reference: Lab do not exist.");
				}			
			}
		} else {
			if (lab_config != null & typeof lab_config == "object"){
				_lab_id = lab_config.lab_id;
				_lab_experiment_id  = lab_config.lab_experiment_id;
				// Check for lab info
				if (_lab_id == null){
                	onErrorCheckingLabParameters("Invalid Laboratory reference from config file.");
				} else {
					ok = _checkLabInfo();
					if (ok){
						// Look for experiment_id
						if (_lab_experiment_id != null && !(_lab_experiment_id == "")){
							var ok = _checkExperimentInfo();
							_experimentAccess = ok;
							if (!ok) {
								onErrorCheckingLabParameters("Invalid Experiment reference from config file: Experiment do not exist.");
							}
						} else {
							// Only lab access
							_labAccess = ok;
						}
					} else {
						onErrorCheckingLabParameters("Invalid Laboratory reference from config file: Lab do not exist.");
					}
				}
			} else {
            	onErrorCheckingLabParameters("Invalid parameters to access to the laboratory/experiment");
			}
        }
		
		
        return ok;
    }
	
    
	function _checkLabInfo(){
		var _ok = false;
		if (_lab_id != null){
			var lab_info = RLAB.SERVICES.SYSTEMS.getSystemInfo(_lab_id);
			_ok = (lab_info != undefined || lab_info != null);
		}
		return _ok;
	}
	
	function _checkExperimentInfo(){
		var _ok = false;
		if (_lab_id != null && _lab_experiment_id != null){
			var exp_info = RLAB.SERVICES.SYSTEMS.getExperimentInfo(_lab_id, _lab_experiment_id);
			_ok = (exp_info != undefined || exp_info != null);
		}
		return _ok;
	}
	
	
    function _getLabId(){
        return _lab_id;
    }
    
    function _getLabExperimentId(){
        return _lab_experiment_id;
    }
	
	function _goToLoginPage(){
		if (_labAccess){
			localStorage.setItem("lab_id", _lab_id);
			window.location = "login_related.html?action=lab";   
		} else if (_experimentAccess){
			localStorage.setItem("lab_id", _lab_id);
			localStorage.setItem("lab_experiment_id",  _lab_experiment_id);
			window.location = "login_related.html?action=lab"; 
		}
	}
    
    // PUBLIC API
    return {
        checkLabParameters: _checkLabParameters,
        getLabId: _getLabId,
        getLabExperimentId: _getLabExperimentId,
		goToLoginPage: _goToLoginPage
    };
              
}()); // End of namespace rlab.client.mobile
