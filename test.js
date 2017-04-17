var points = [];
var metricPerPixel;
var refLen;
var lineLen;
var img = new Image();
$(document).ready(function (){
	var canvas = $("#picCanvas");
	var cxt = canvas.get()[0].getContext('2d');
	cxt.strokeStyle = "#f00";
	cxt.lineWidth = 3;
	
	Init();
	drawLines();
	$("#iptfileupload").change(function (){
		points = [];
        cxt.clearRect(0, 0, 400, 400);
        if (typeof FileReader === 'undefined') {
            alert('Your browser does not support FileReader...');
            return;
        }
        var reader = new FileReader();

        reader.onload = function (e) {    
			
            var cxt = document.getElementById("picCanvas").getContext("2d")
			
            img.src = this.result;
            img.onload = function () {
            cxt.drawImage(img, 0, 0);
            }
        }
        reader.readAsDataURL(document.getElementById(this.id).files[0]);
        
		
	});
	
	$(".form-control").change(function (){
		var refObject=$(".form-control").find("option:selected").val();
		
		if(refObject === "8.5"||refObject ==="2.5"){
			$("#reflen").val(refObject);
			$("#reflen").attr("disabled","disabled");
		}
		else{
			$("#reflen").removeAttr("disabled");		
			
			$("#reflen").focus();
		}
	});
	
	$("#cal").click(function (){
		if(points.length<2){
			alert("Please choose reference in picture");
		}
		refLen = $("#reflen").val();
		lineLen = calReferLine(x1,y1,x2,y2);
		metricPerPixel = refLen/lineLen;
	});
});
function Init(){
	picInit();
	staInit();
}
function picInit(){
    var cxt = document.getElementById("picCanvas").getContext("2d")
    img.src = "1.jpg";
    img.onload = function () {
		cxt.drawImage(img, 0, 0);
    }
}
function staInit(){
	points = [];
	var refInit =$(".form-control").val(0);
	var refObject=$(".form-control").find("option:selected").val();
		
		if(refObject === "8.5"||refObject ==="2.5"){
			$("#reflen").val(refObject);
			$("#reflen").attr("disabled","disabled");
		}
		else{
			$("#reflen").removeAttr("disabled");		
			
			$("#reflen").focus();
		}
}
function calReferLine(x1,y1,x2,y2){
	var calX = x2-x1;
	var calY = y2-y1;
	var dist = Math.sqrt(calX * calX + calY * calY);
	return dist;
}

function drawLines(){
	var canvas = document.getElementById("picCanvas");
	var cxt = canvas.getContext("2d");
	
	var moveX,
    moveY,
    toX,
    toY,
	endX,
	endY;

	function getCanvasPosX(canvas,e){	
		var rect = canvas.getBoundingClientRect(); 
		return e.clientX - rect.left * (canvas.width / rect.width);

	}
	function getCanvasPosY(canvas,e){
		var rect = canvas.getBoundingClientRect(); 
		return  e.clientY - rect.top * (canvas.height / rect.height);
	}


	canvas.addEventListener('mousedown', function (e) {
		moveX = getCanvasPosX(canvas,e);
		moveY = getCanvasPosY(canvas,e);
		//img.onload = function () {
		//	cxt.drawImage(img, 0, 0);
		//}
		canvas.addEventListener('mousemove', drawLine);
		points.push({
			x: moveX,
			y: moveY
		});
	
	})
	canvas.addEventListener('mouseup', function (e) {
		endX = getCanvasPosX(canvas,e);
		endY = getCanvasPosY(canvas,e);
		//img.onload = function () {
		//	cxt.drawImage(img, 0, 0);
		//}
		points.push({
			x: endX,
			y: endY
		});
		canvas.removeEventListener('mousemove', drawLine);
	
	})

	function drawLine(e) {
		toX = getCanvasPosX(canvas,e);
		toY = getCanvasPosY(canvas,e);
	
		cxt.clearRect(0, 0, 400, 400);		
		cxt.drawImage(img, 0, 0);		
		cxt.beginPath();
		cxt.moveTo(moveX, moveY);
		cxt.lineTo(toX, toY);
		for(var i=1;i<points.length;i+=2){
			cxt.moveTo(points[i-1].x,points[i-1].y);
			cxt.lineTo(points[i].x,points[i].y);
	
		}	
		cxt.closePath();
		cxt.stroke();	
	}}
