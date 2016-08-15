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
var food=null;
var direction="r";//u for up;d for down;l for left;r for right
var timer=null;
var robot=null;
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
		drawSnake(snake,bodyColor);
		
		tmpSnake=new Array();
		tmpSnake.push({x:5,y:5});
		tmpSnake.push({x:4,y:5});
		tmpSnake.push({x:3,y:5});
		robot1=createSnake(tmpSnake);
		t=setInterval(robot1.walk,500);
}
//draw the snake,draw the head first,then draw the body
function drawSnake(snakebody,snakecolor)
{
		drawCell(snakebody[0].x,snakebody[0].y,headColor);
		for (var i=1;i<snakebody.length;i++)
		{
			xx=snakebody[i].x;
			yy=snakebody[i].y;
			drawCell(xx,yy,snakecolor);
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
	if (!isEatFood())
	{
		tmp=snake.pop();
		drawCell(tmp.x,tmp.y,null);
	}else
	{
		initFood();
	}
	drawSnake(snake,bodyColor);
	if (isDie())
	{
		clearInterval(timer);
		alert("you died");
	}
}
function isEatFood()
{
	if(snake[0].x==food.x&&snake[0].y==food.y)
	{
		return true;
	}
	return false;
}
function isDie()
{
	//is snake crashed the boundary
	head=snake[0];
	if(!(head.x>=0&&head.x<=COLS-1&&head.y>=0&&head.y<=ROWS-1))
	{
		return true;
	}
	//is snake bite itself
	for (var i=1;i<snake.length;i++)
	{
		if(head.x==snake[i].x&&head.y==snake[i].y)
		{
			return true;
		}
	}
	return false;
}
function initFood()
{
	do
	{	
		foodx=getRandomNum(0,COLS-1);
		foody=getRandomNum(0,ROWS-1);
		food={x:foodx,y:foody};
	}while(food in snake);
	drawCell(food.x,food.y,"red");
}
function getRandomNum(min,max)
{   
	var range = max - min;   
	var rand = Math.random();   
	return(min + Math.round(rand * range));   
}
function keydown(key)
{
	switch (key)
	{
		//37 left arrow
		case 37:
			if (direction!="r"&&direction!="l") direction="l";
			break;
		//38 up arrow
		case 38:
			if (direction!="u"&&direction!="d") direction="u";
			break;
		//right arrow
		case 39:
			if (direction!="r"&&direction!="l") direction="r";
			break;
		//down arrow
		case 40:
			if (direction!="u"&&direction!="d") direction="d";
			break;
		default:break;
	}
}
function createSnake(snake)
{
	var robotSnake=new Object;
	robotSnake.snake=snake;
	robotSnake.direction="r";
	robotSnake.color="green";
	drawSnake(robotSnake.snake,robotSnake.color);
	robotSnake.isEatFood=function()
	{
		if(robotSnake.snake[0].x==food.x&&robotSnake.snake[0].y==food.y)
		{
			return true;
		}
		return false;
	}
	robotChangeDirection=function()
	{

	}
	robotSnake.walk=function()
	{

		switch (robotSnake.direction)
		{
			case "u":
				robotSnake.snake.unshift({x:robotSnake.snake[0].x,y:robotSnake.snake[0].y-1});
				break;
			case "d":
				robotSnake.snake.unshift({x:robotSnake.snake[0].x,y:robotSnake.snake[0].y+1});			
				break;
			case"l":
				robotSnake.snake.unshift({x:robotSnake.snake[0].x-1,y:robotSnake.snake[0].y});			
				break;
			case "r":
				robotSnake.snake.unshift({x:robotSnake.snake[0].x+1,y:robotSnake.snake[0].y});			
				break;	
		}
		if (!robotSnake.isEatFood())
		{
			tmp=robotSnake.snake.pop();
			drawCell(tmp.x,tmp.y,null);
		}else
		{
			initFood();
		}
		drawSnake(robotSnake.snake,robotSnake.color);
	}

	return robotSnake;
}
function load()
{
	element=document.getElementById("canvas");
	dc=element.getContext("2d");
	drawMap();
	initSnake();
	initFood();
	timer=setInterval("walk();",100);
	document.onkeydown=function(event)
	{
		var event = event || window.event;
        keydown(event.keyCode);
		return false;
	}
}
window.onload=load();
