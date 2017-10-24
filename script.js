var maxVal=100;
var canvas;
var ctx;
var width=20;
var emptyhighlight;
var memory=[];
var highlightmemory=[];
var currentstage=0;
var tickTimer;
var tackTimer;
var currentPeriod=1000;
var started=0;
var anime;
var insertionSortTimeouts=[];
var insertionSortArray, storedarray;
var currenti=0;
var nexttimeout=0;

function initialize() {
	(document.getElementById("first stage")).style="display: none;";
        (document.getElementById("second stage")).style="display: block;";
}

function algorithmLauncher() {
        
        (document.getElementById("second stage")).style="display: none;";
        (document.getElementById("third stage")).style="display: block;";
        var temp1,temp2;
        //obtaining initial parameters
        var N = (document.getElementById("Ninput")).value;
        var d0 = (document.getElementById("N1input")).value;
        var d1 = (document.getElementById("N2input")).value;
        var arraytosort = [];
        var initialarray = [];
        var bars;
        
        // setting up defauls if variables did not fullfill the criteria
        if (N<10 || N>30 || N == ""){

            N=10;

        }
        N=parseInt(N,10);
		console.log(N);
        if (d0 == "") {
            d0=Math.floor(N/2);
        } else {
            d0=parseInt(d0,10);
            if (d0 > N/2 || d0 < 2){
                d0=Math.floor(N/2);
            }
        }
        d0=parseInt(d0,10);
		console.log(d0)
        
        if (d1 == "") {
            d1=2;
        } else {
            d1=parseInt(d1,10);
            if (d1 > d0 || d1 < 2){
                d1=2;
            }
        }
        d1=parseInt(d1,10);
		console.log(d1)
        
        // setting up random array of length N
        for (i = 0; i < N; i++) { 

            arraytosort.push(Math.floor(Math.random()*maxVal));

        }

        initialarray=arraytosort.slice();
        
        //setting up visualisation
        canvas = document.getElementById("main");
        ctx = canvas.getContext('2d');
        canvas.width=N*width;
        canvas.height=200;
        
        //setting up default highlight
        emptyhighlight=Array(N).fill("");
               
        draw(arraytosort);
        	
		shellsortanimationdata(arraytosort,[d0,d1,1],memory,highlightmemory);
		arraytosort=initialarray;
		draw(arraytosort);
		console.log(memory);
		
	
	//	
		
}

function draw_initial(){
	if (started == 1) {
		return
	}
	var	array=memory[0];
	draw(array);
}

function do_step(){
	if (started == 1){
		return;}
	currentPeriod=1000/document.getElementById("set_speed").value;
	console.log("test");
	if (currentstage < memory.length-1){
		shellsortstep();

	} else if ((currentstage == memory.length-1) && (currenti == 0)){
		storedarray=memory[currentstage].slice();
		draw(memory[currentstage]);
		insertionsortstep();
	} else {
		insertionsortstep();
	}
		
	

}

function shellsortstep(){
	tickTimer=setTimeout(function tick() {
		draw(memory[currentstage],highlightmemory[currentstage]);
			tackTimer=setTimeout(function tack() {
				draw(memory[currentstage+1],highlightmemory[currentstage]);
				currentstage++;
				if (currentstage==memory.length-1){
					storedarray=memory[currentstage].slice();
					stop();
				}
			},currentPeriod);
},currentPeriod);

}

function insertionsortstep(){
	unsortedList=storedarray.slice();
    var len = unsortedList.length;
	var leftmove=0;
	var i = currenti;
	var tmp = unsortedList[i]; //Copy of the current element. 
	nexttimeout+=currentPeriod+50;
	insertionSortTimeouts.push(setTimeout(moveelementup,nexttimeout,tmp,i));
	/*Check through the sorted part and compare with the number in tmp. If large, shift the number*/
	var leftmove=0;
	for (var j = i - 1; j >= 0 && (unsortedList[j] > tmp); j--) {
	//Shift the number
		nexttimeout+=currentPeriod+50;
		insertionSortTimeouts.push(setTimeout(moveelementright,nexttimeout,unsortedList[j],j));
		leftmove+=1;
		unsortedList[j + 1] = unsortedList[j];			
	}
	//Insert the copied number at the correct position
	//in sorted part. 
	nexttimeout+=currentPeriod+50;
	console.log(i,j,leftmove);	
	insertionSortTimeouts.push(setTimeout(moveelementleft,nexttimeout,tmp,i,leftmove));
	console.log(i-j);
	nexttimeout+=currentPeriod+50;
	insertionSortTimeouts.push(setTimeout(moveelementdown,nexttimeout,tmp,j+1));
	unsortedList[j + 1] = tmp;
	currenti++;
	storedarray=unsortedList.slice();
	nexttimeout=0;

}

function reset(){
	stop();
	currentstage=0;
	storedarray=[];
	currenti=0;
    (document.getElementById("third stage")).style="display: none;";
    (document.getElementById("first stage")).style="display: block;";
	canvas=null;
	ctx=null;
	memory=[];
	highlightmemory=[];
}

function draw(array,highlight = emptyhighlight){
    N=array.length;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (i = 0; i < N; i++) { 

        ctx.beginPath();
        ctx.rect(width*i,canvas.height-array[i],width,array[i]);
        if (highlight[i] == 'o'){
            ctx.fillStyle = "orange";
            ctx.fill();
        }else if (highlight[i] == 'b'){
            ctx.fillStyle = "blue";
            ctx.fill();
        } else {
            ctx.fillStyle = "red";
            ctx.fill();
        }
            
    }
}

function shellsortanimationdata(arraytosort,dn,memory,highlightmemory){
    var N=arraytosort.length;
    var tempArray=[],i=0;
    for (separator = 0; separator<dn.length;separator++){
        for (j = 0; j<dn[separator]; j++){
            i=j;
			memory.push(arraytosort.slice());
			highlightmemory.push(Array(N).fill(""));
			tempArray=[];
            while (i<N){
				highlightmemory[highlightmemory.length-1][i]='o';
				tempArray.push(arraytosort[i]);
				i+=dn[separator];
            }
			insertionSort(tempArray);
			i=j;
			while (i<N){
				arraytosort[i]=tempArray[(i-j)/dn[separator]];
				i+=dn[separator];
            }
			
        }
    }
}

function start(){
currentPeriod=1000/document.getElementById("set_speed").value;

if (started == 1){
	return;
}
if ((currentstage==memory.length-1)){
		console.log("startinsertion");
		startinsertion();
		return;
	}
	started=1;	
	tickTimer=setTimeout(function tick() {
		draw(memory[currentstage],highlightmemory[currentstage]);
			tackTimer=setTimeout(function tack() {
				draw(memory[currentstage+1],highlightmemory[currentstage]);
				currentstage++;
				tickTimer=setTimeout(tick, currentPeriod);
				if (currentstage==memory.length-1){
					storedarray=memory[currentstage].slice();
					stop();
					startinsertion();
				}
			},currentPeriod);
},currentPeriod);
}

function startinsertion(){
	started=1;
	insertionsortanimation();
}

function stop(){
	if (started == 1) {
		clearTimeout(tickTimer);
		clearTimeout(tackTimer);
		for (var i=0; i<insertionSortTimeouts.length;i++){
			clearTimeout(insertionSortTimeouts[i]);
		}
		clearTimeout(anime);
		nexttimeout=0;
		if (currentstage == memory.length-1){
			console.log("drawing");
			draw(storedarray);
		}
		started=0;
	}
	}

function insertionSort(unsortedList) {  
    var len = unsortedList.length;
    for (var i = 1; i < len; i++) {
        var tmp = unsortedList[i]; //Copy of the current element. 
        /*Check through the sorted part and compare with the number in tmp. If large, shift the number*/
        for (var j = i - 1; j >= 0 && (unsortedList[j] > tmp); j--) {
            //Shift the number
            unsortedList[j + 1] = unsortedList[j];
        }
        //Insert the copied number at the correct position
        //in sorted part. 
        unsortedList[j + 1] = tmp;
    }
}

function moveelementup(el,pos){
	dist = 20*canvas.height/currentPeriod;
	step=0;
	anime=setTimeout(function move() {
		ctx.clearRect(width*pos,canvas.height-el-dist*step,width,el);
		step=step+1;
		if (canvas.height-el-dist*step>0) {
			ctx.fillRect(width*pos,canvas.height-el-dist*step,width,el);
		}
		anime=setTimeout(move,20);
		if (canvas.height-el-dist*step<=0){			
			ctx.fillRect(width*pos,0,width,el);
			clearTimeout(anime);
		};
		
	},20);	
	
	

}

function moveelementright(el,pos){
	dist = 20*width/currentPeriod;
	step=0;
	
	anime=setTimeout(function move() {
		ctx.clearRect(width*pos,canvas.height-el,2*width,el);
		step=step+1;
		if (dist*step<width) {
			ctx.fillRect(width*pos+dist*step,canvas.height-el,width,el);
		}
		anime=setTimeout(move,20);
		if (dist*step>=width){	
			ctx.fillRect(width*(pos+1),canvas.height-el,width,el);
			clearTimeout(anime);
		};
		
	},20);	
}

function moveelementleft(el,pos,n){
	dist = 20*width*n/currentPeriod;
	step=0;
	
	anime=setTimeout(function move() {
		ctx.clearRect(0,0,canvas.width,el);
		step=step+1;
		if (dist*step<n*width) {
			ctx.fillRect(width*pos-n*dist*step,0,width,el);
		}
		anime=setTimeout(move,20);
		if (dist*step*n>=n*width){
			ctx.clearRect(0,0,canvas.width,el);			
			ctx.fillRect(width*(pos-n),0,width,el);
			clearTimeout(anime);
		};
	},20);	
}


function moveelementdown(el,pos){
	dist = 20*canvas.height/currentPeriod;
	step=0;
	anime=setTimeout(function move() {
		ctx.clearRect(width*pos,dist*step,width,el);
		step=step+1;
		if (el+dist*step<canvas.height) {
			ctx.fillRect(width*pos,dist*step,width,el);
		}
		anime=setTimeout(move,20);
		if (el+dist*step>=canvas.height){			
			ctx.fillRect(width*pos,canvas.height-el,width,el);
			clearTimeout(anime);
		};
		
	},20);	
	
	

}



function insertionsortanimation(){
	unsortedList=storedarray.slice();
    var len = unsortedList.length;
	var leftmove=0;
	for (var i = currenti; i < len; i++) {
		var tmp = unsortedList[i]; //Copy of the current element. 
		insertionSortTimeouts.push(setTimeout(setArray,nexttimeout,unsortedList.slice()));
		insertionSortTimeouts.push(setTimeout(setParameter,nexttimeout,i));
		nexttimeout+=currentPeriod+50;
		insertionSortTimeouts.push(setTimeout(moveelementup,nexttimeout,tmp,i));
		/*Check through the sorted part and compare with the number in tmp. If large, shift the number*/
		var leftmove=0;
			for (var j = i - 1; j >= 0 && (unsortedList[j] > tmp); j--) {
				//Shift the number
				nexttimeout+=currentPeriod+50;
				insertionSortTimeouts.push(setTimeout(moveelementright,nexttimeout,unsortedList[j],j));
				leftmove+=1;
				unsortedList[j + 1] = unsortedList[j];			
		}
		//Insert the copied number at the correct position
		//in sorted part. 
		nexttimeout+=currentPeriod+50;
		console.log(i,j,leftmove);	
		insertionSortTimeouts.push(setTimeout(moveelementleft,nexttimeout,tmp,i,leftmove));
		console.log(i-j);
		nexttimeout+=currentPeriod+50;
		insertionSortTimeouts.push(setTimeout(moveelementdown,nexttimeout,tmp,j+1));
		unsortedList[j + 1] = tmp;
		
		
	}
}
function setParameter(newparameter) {
	console.log("changing",newparameter);
	currenti=newparameter;		
	console.log(currenti);
}
function setArray(newarray) {
	storedarray = newarray.slice();
	console.log(storedarray);
}
	
