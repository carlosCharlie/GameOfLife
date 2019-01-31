/*
author: carlosCharlie
https://github.com/carlosCharlie
A Conway's Game of Life implementation.
*/

//actual state
let matrix;
//next state
let newMatrix;

let interval;
let clicked=false;

//defaultOptions
let size = 20;
let speed = 80;
let cellsMin = 2;
let cellsMax = 3;

function copyMatrix(oldMatrix){
    let newM = [];
    for(i=0;i<oldMatrix.length;i++){
        let row = [];
        for(j=0;j<oldMatrix.length;j++)
            row.push(oldMatrix[i][j]);
        newM.push(row);
    }

    return newM;
}

//create the initial matrix
function init(n){
    
    let contentDisplay = "";
    $("#content").empty();
    matrix = [];
    newMatrix = [];
    for(i = 0; i < n; i++){
        let row = [];

        for(j = 0; j < n; j++){
            let circle = $('<div class="circle" id="'+i+"-"+j+'"></div>');
            circle.i = i;
            circle.j = j;
            circle.on("click",()=>{
                matrix[circle.i][circle.j]=true;
                clicked=true;
                render();
            })
            $("#content").append(circle);
            row.push(false);
        }
        
        matrix.push(row); 
        contentDisplay+=" 1fr";   
    }

    $("#content").css("grid-template-columns",contentDisplay);
    $("#content").css("grid-template-rows",contentDisplay);
    $("#content").height($("#content").width());
    render();
}

//refresh the html
function render(){
    for(i = 0; i < matrix[0].length; i++)
        for(j = 0; j<matrix[0].length; j++)
            if(matrix[i][j])
                $("#"+i+"-"+j).css("background-color","#ff9610");
            else
                $("#"+i+"-"+j).css("background-color","#221236");
}
//get the adjacent cells number
function adCells(i,j){
    
    let n = 0;
    //up
    if(i>0 && matrix[i-1][j]) n++;
    //left
    if(j>0 && matrix[i][j-1]) n++;
    //down
    if(i<matrix[0].length-1 && matrix[i+1][j]) n++;
    //right
    if(j<matrix[0].length-1 && matrix[i][j+1]) n++;
   
    //up left
    if(i>0 && j>0 && matrix[i-1][j-1]) n++;
    //up right
    if(i>0 && j<matrix[0].length-1 && matrix[i-1][j+1]) n++;
    //down left
    if(i<matrix[0].length-1 && j>0 && matrix[i+1][j-1])n++;
    //down right
    if(i<matrix[0].length-1 && j<matrix[0].length-1 && matrix[i+1][j+1])n++;

    return n;
}

//calculates the new state
function calculate(){
    newMatrix = copyMatrix(matrix);

    for(i = 0; i < matrix[0].length; i++)
        for(j = 0; j<matrix[0].length; j++){
            let cells = adCells(i,j);
            if(cells<cellsMin || cells >cellsMax) 
                newMatrix[i][j]=false;
            if(cells == cellsMax)
                newMatrix[i][j]=true;
        }
    matrix=newMatrix;
}

$(function(){

    $("#content").css("visibility","hidden");
    //html default values
    $("#size").val(size);
    $("#min").val(cellsMin);
    $("#max").val(cellsMax);
    $("#speed").val(speed);

    $("#create").on("click",function(){
        
        clicked = false;

        $("#content").css("visibility","visible");

        $(this).css("display","none");
        $("#start").css("display","block");

        clearInterval(interval);
        cellsMax = $("#max").val();
        cellsMin = $("#min").val();
        speed = $("#speed").val();
        init($("#size").val());
    })
    $("#start").on("click",function(){

        if(!clicked)
            alert("Select some circles");
        else{
            $(this).css("display","none");
            $("#stop").css("display","block");
            clearInterval(interval);
            loop();
        }
    })

    $("#stop").on("click",function(){

        $(this).css("display","none");
        $("#create").css("display","block");

        clearInterval(interval);

    })

    init(size);
    render();

})

//the main loop
function loop(){
    interval = setInterval(function(){
        calculate();
        render();
    }, speed);
}