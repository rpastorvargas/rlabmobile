var experimentAccessApp = angular.module('experimentAccessApp', []);
experimentAccessApp.controller("experimentAccessAppCtrl", ["$scope", "$window", function($scope,$window){
    
    // Variables
    $scope.lab_id = null;
	$scope.lab_experiment_id = null;
    $scope.user = null;
	$scope.pass = null;
    $scope.error = "";
	
	// Calculated vars
	$scope.lab_name = null;
	$scope.lab_description = null;
	$scope.experiment_name = null;
	$scope.experiment_description = null;
	$scope.experiment_slot_time = 0;
	$scope.lab_isAlive = false;
  
    // Load data from localstorage
	if (localStorage.labs_info != null){
		var info = JSON.parse(localStorage.labs_info);
		$scope.lab_id = info.lab_id;
		$scope.lab_experiment_id = info.lab_experiment_id;
		$scope.user = info.user;
		$scope.pass = info.pass;
		// Get Lab info
		var lab_info = RLAB.SERVICES.SYSTEMS.getSystemInfo($scope.lab_id);
		if (lab_info != null){
			$scope.lab_name = lab_info.name;
			$scope.lab_description = lab_info.description;
		}
		// Get experiment info
		var experiment_info = RLAB.SERVICES.SYSTEMS.getExperimentInfo($scope.lab_id, $scope.lab_experiment_id);
		if (experiment_info != null){
			$scope.experiment_name = experiment_info.experiment_name;
			$scope.experiment_description = experiment_info.experiment_description;
			$scope.experiment_slot_time = experiment_info.slot_time;
		}
		// Get lab is alive
		$scope.lab_isAlive =  RLAB.SERVICES.SYSTEMS.STATUS.isAlive($scope.lab_id);
	}
    
    $scope.logout = function(){
        // Delete data from login
        if (localStorage.labs_info != null){
            localStorage.removeItem("labs_info");
            $window.location.href = "login_related.html?action=experiment"; 
        }
    }
	
    $scope.checkLabStatus = function(id){
        if (id!=null){
            $scope.lab_isAlive = RLAB.SERVICES.SYSTEMS.STATUS.isAlive(id);
        }
    }
    
    $scope.toExperiment = function(){
        // Generate token
        // Slot time? ==> maximun defined in the experiment
        RLAB.SERVICES.TOKENS.generateToken($scope.user, $scope.pass, 
									$scope.lab_id, 
        							$scope.lab_experiment_id,
									$scope.experiment_slot_time,
        							$scope.generateTokenCallSuccess, 
        							$scope.generateTokenCallError);
    }

    $scope.generateTokenCallSuccess = function(tokenId){
        if (tokenId != null){
            var _url = "checks.html?token_id="+ tokenId;
			// Check for HTTPs!!!
			if (window.location.protocol == "https:"){
				var pathArray = window.location.pathname.split('/');;
				pathArray[pathArray.length-1] = _url;
				_url = "http://" + window.location.hostname + pathArray.join('/');
			}
            $window.location.href = _url; 
        } else {
            $scope.error = RLAB.SERVICES.TOKENS.getInvocationMessage();
        }
		
    }

    $scope.generateTokenCallError = function(message){
		$scope.error = RLAB.SERVICES.TOKENS.getInvocationMessage();
    }
    
}]);

