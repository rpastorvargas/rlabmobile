// JavaScript Document

// RLABVar Javascript object

function RLABVar(name,description,module,system,
				 type,value,maxRange,minRange,units,time,
				 logging,interactive,isViewAssociated){
	this.units = units;
	// Depends on value type
	this.maxRange = maxRange;
	// Depends on value type
	this.minRange = minRange;
	// boolean
	this.interactive = interactive;
	// String
	this.name = name;
	// String
	this.description = description;
	// java type --> javascript?
	this.type = type;
	// Depends on type
	this.value = value;
	// boolean
	this.logging = false;
	// long
	this.time = time;
	// string
	this.moduleName = module; // SG_MODULE
	// string
	this.fullQualifiedSystemName = system; // --> //62.204.199.218/MAGLEV"
	//boolean
	this.isViewAssociated = isViewAssociated;
	
}

function RLABVar(){
	// String
	this.units = "N/A";
	// Depends on value type
	this.maxRange = 10.0;
	// Depends on value type
	this.minRange = 0.0;
	// boolean
	this.interactive = false;
	// String
	this.name = "n/a";
	// String
	this.description = "n/a";
	// java type --> javascript?
	this.type = "java.lang.Double";
	// Depends on type
	this.value = 0.0;
	// boolean
	this.logging = false;
	// long
	this.time = 0;
	// string
	this.moduleName = "N/A"; // SG_MODULE
	// string
	this.fullQualifiedSystemName = "N/A"; // --> //62.204.199.218/MAGLEV"
	//boolean
	this.isViewAssociated = false;
}

RLABVar.prototype.toXML = function(){
}