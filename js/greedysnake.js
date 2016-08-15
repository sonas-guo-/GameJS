var dc=null;
var BLOCK=20;
var ROWS=40;
var COLS=40;
var snake=new Array();
var snakeLength=3;
var headColor="black";
var bodyColor="gray";
var backgroundColor="white";
var boarderColor="gray";
var direction="r";//u for up;d for down;l for left;r for right
function drawMap()
{
	dc.clearRect(0,0,BLOCK*COLS,BLOCK*ROWS);
	//draw the grid
	//horizontal lines
	for (var i=0;i<=ROWS;i++)
	{
		dc.beginPath();
		dc.moveTo(0,i*BLOCK);
		dc.lineTo(BLOCK*COLS,i*BLOCK);
		dc.strokeStyle=boarderColor;
		dc.stroke();
	}
	//vertical lines
	for (var i=0;i<=COLS;i++)
	{
		dc.beginPath();
		dc.moveTo(i*BLOCK,0);
		dc.lineTo(i*BLOCK,BLOCK*ROWS);
		dc.strokeStyle=boarderColor;
		dc.stroke();
	}
	
}
//initialize snake's body and draw it
function initSnake()
{
		snake.push({x:2,y:0});
		snake.push({x:1,y:0});
		snake.push({x:0,y:0});
		drawSnake();
}
//draw the snake,draw the head first,then draw the body
function drawSnake()
{
		drawCell(snake[0].x,snake[0].y,headColor);
		for (var i=1;i<snake.length;i++)
		{
			xx=snake[i].x;
			yy=snake[i].y;
			drawCell(xx,yy,bodyColor);
		}
}
//draw one cell,if color is null then only draw the boarder
function drawCell(x,y,color)
{
	dc.clearRect(x*BLOCK,y*BLOCK,BLOCK,BLOCK);
	if(color!=null)
	{
		dc.fillStyle=color;
		dc.fillRect(x*BLOCK,y*BLOCK,BLOCK,BLOCK);		
	}else
	{
		dc.strokeStyle="gray";
		dc.strokeRect(x*BLOCK,y*BLOCK,BLOCK,BLOCK);
	}
}
//choose one direction to walk	
function walk()
{
	switch (direction)
	{
		case "u":
			snake.unshift({x:snake[0].x,y:snake[0].y-1});
			break;
		case "d":
			snake.unshift({x:snake[0].x,y:snake[0].y+1});			
			break;
		case "l":
			snake.unshift({x:snake[0].x-1,y:snake[0].y});			
			break;
		case "r":
			snake.unshift({x:snake[0].x+1,y:snake[0].y});			
			break;	
	}
	tmp=snake.pop();
	drawCell(tmp.x,tmp.y,null);
	drawSnake();
}
function load()
{
	element=document.getElementById("canvas");
	dc=element.getContext("2d");
	drawMap();
	initSnake();
	timer=setInterval("walk();",1000);
}
window.onload=load();
