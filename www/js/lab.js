// JavaScript Document

// Object Lab definition !!!
var Lab = function Lab(ip,rest_port,id){
	this.ip = ip;
	this.rest_port = rest_port;
	this.id = id;
	
	// get Methods
	lab.prototype.getIp = function (){ return this.ip; }
}