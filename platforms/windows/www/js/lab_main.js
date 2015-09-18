var experimentsForLabListApp = angular.module('experimentsForLabListApp', []);
experimentsForLabListApp.controller("experimentsForLabListAppCtrl", ["$scope", "$window", function($scope,$window){
    
    // Variables
    $scope.user = "None";
    $scope.lab_id = null;
	$scope.lab_experiment_id = null;
    $scope.experiments = null;
	$scope.no_experiments = false;
    $scope.lab_isAlive = false;
	$scope.sessions_openned = 0;
    $scope.error = "";
  
    // Load data from localstorage
	if (localStorage.lab_id != null){
		// Get user info
		var info = JSON.parse(localStorage.labs_info);
		$scope.user = info.user;
		$scope.pass = info.pass;
		// Get Lab info
		$scope.lab_id = localStorage.lab_id;
		$scope.lab_info = RLAB.SERVICES.SYSTEMS.getSystemInfo($scope.lab_id);
		
		// Get Alive system
		$scope.lab_isAlive = RLAB.SERVICES.SYSTEMS.STATUS.isAlive($scope.lab_id);
		// Get openned sessions
		var sessions = RLAB.SERVICES.SESSIONS.getOpenSessionsForSystem($scope.lab_id);
		if (sessions != null){
			$scope.sessions_openned = sessions.length;
		} else {
			$scope.sessions = 0;
			// Warning the error
		}
			
		// Get lab experiments !!!!
		$scope.experiments = RLAB.SERVICES.SYSTEMS.getExperiments($scope.lab_id);
        if (!Array.isArray($scope.experiments)){
			if (typeof $scope.experiments === "object" && 
				$scope.experiments["xsi:nil"] != "true"
				){
                // Only one experiment
                $scope.experiments = [$scope.experiments];
		    } else {
                // No experiments
				$scope.no_experiments = true;
                var exp_null = new Object();
                exp_null.experiment_name = "No experiments available...";
                $scope.experiments = [exp_null];
		    }
       }
	   // If lab_experiment_id is got, then filter the list
	   if (localStorage.getItem("lab_experiment_id") != null){
	   		if (!$scope.no_experiments){
				var _labExperimentId = localStorage.getItem("lab_experiment_id");
				// Filter the array finding the experiment id;
				var _selectedExperiment = $scope.experiments.filter(function(experiment) {
      				if(experiment.id == _labExperimentId) {
        				return experiment;
					}
      			});
				if (_selectedExperiment != null && _selectedExperiment.length==1 ){
					$scope.experiments = [_selectedExperiment[0]];
				}
			}
	   }
	}
    
    $scope.logout = function(){
        // Delete data from login
        if (localStorage.labs_info != null){
            localStorage.removeItem("labs_info");
            $window.location.href = "login_related.html?action=lab"; 
        }
    }
	
    // Controller Functions
    $scope.loadExperiments = function(id){
        
    }

    $scope.checkLabStatus = function(id){
        if (id!=null){
            $scope.lab_isAlive = RLAB.SERVICES.SYSTEMS.STATUS.isAlive(id);
        }
    }
	
	$scope.getOpennedSessions = function(id){
		if (id != null){
			
		}
	}
    
    
    $scope.toExperiment = function(experiment){
        // Generate token
        // Slot time? ==> maximun defined in the experiment
        RLAB.SERVICES.TOKENS.generateToken($scope.user, $scope.pass, $scope.lab_id, 
        							experiment.id,experiment.slot_time,
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

