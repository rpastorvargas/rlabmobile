// JavaScript Document
function makeCanvas(){

	var canvas1 = document.getElementById('canvas1');
	var cxt1 = canvas1.getContext('2d');
	
	cxt1.font = '32pt Arial';
	cxt1.fillSytle = 'DeepSkyBlue';
	cxt1.strokeStyle = 'black';
	
	cxt1.fillText('I love HTML5',45, 150);
	cxt1.strokeText('I love HTML5',45, 150);
}