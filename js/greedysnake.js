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
var BARRIERS=new Array();//cell can't crash,including snake's body temporarily
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
		addBarrier(2,0);
		addBarrier(1,0);
		addBarrier(0,0);
		drawSnake(snake,bodyColor);
		
		tmpSnake=new Array();
		tmpSnake.push({x:5,y:5});
		tmpSnake.push({x:4,y:5});
		tmpSnake.push({x:3,y:5});
		addBarrier(5,5);
		addBarrier(4,5);
		addBarrier(3,5);
		robot1=createSnake(tmpSnake);
		t=setInterval(robot1.walk,100);
		robot1.setTimer(t);
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
		default:break;
	}
	if (isDie())
	{
		clearInterval(timer);
		alert("you died");
	}
	addBarrier(snake[0].x,snake[0].y);
	if (!isEatFood())
	{
		tmp=snake.pop();
		drawCell(tmp.x,tmp.y,null);
		deleteBarrier(tmp.x,tmp.y);
	}else
	{
		initFood();
	}
	drawSnake(snake,bodyColor);
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
	if(isBarrier(head.x,head.y))
	{
		return true;
	}else
	{
		return false;
	}
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
function oppositeDirection(d)
{
	switch(d)
	{
		case 'r':return 'l';break;
		case 'l':return 'r';break;
		case 'u':return 'd';break;
		case 'd':return 'u';break;
		default:return null;break;
	}
}
function isBarrier(x,y)
{
	if(x>=0&&x<COLS&&y>=0&&y<ROWS)
	{
		var pos=y*COLS+x;
		if(BARRIERS[pos])
		{
			return true;
		}else
		{
			return false;
		}
	}else
	{
		return true;
	}
}
function addBarrier(x,y)
{
	var pos=y*COLS+x;
	if(!BARRIERS[pos])
		BARRIERS[pos]=true;
}
function deleteBarrier(x,y)
{
	var pos=y*COLS+x;
	if(BARRIERS[pos])
		BARRIERS[pos]=false;
}
function createSnake(snake)
{
	var robotSnake=new Object;
	robotSnake.snake=snake;
	robotSnake.direction="r";
	robotSnake.color="green";
	robotSnake.viewDistance=20;
	robotSnake.timer=null;
	drawSnake(robotSnake.snake,robotSnake.color);
	robotSnake.setTimer=function(t)
	{
		robotSnake.timer=t;
	}
	robotSnake.isEatFood=function()
	{
		if(robotSnake.snake[0].x==food.x&&robotSnake.snake[0].y==food.y)
		{
			return true;
		}
		return false;
	}
	robotSnake.isGoingDie=function(d)
	{
		switch(d)
		{
			case 'u':
				if (isBarrier(robotSnake.snake[0].x,robotSnake.snake[0].y-1)) return true;
				break;
			case 'd':
				if (isBarrier(robotSnake.snake[0].x,robotSnake.snake[0].y+1)) return true;
				break;
			case 'l':
				if (isBarrier(robotSnake.snake[0].x-1,robotSnake.snake[0].y)) return true;
				break;
			case 'r':
				if (isBarrier(robotSnake.snake[0].x+1,robotSnake.snake[0].y)) return true;
				break;
			default:break;
		}
	}
	robotSnake.chooseDirection=function()
	{
		var directions=new Object;
		directions['r']=true;
		directions['l']=true;
		directions['u']=true;
		directions['d']=true;
		directions[oppositeDirection(robotSnake.direction)]=false;
		var canSurviveDirectionNum=0;
		for (var d in directions)
		{
			if(robotSnake.isGoingDie(d))
			{
				directions[d]=false;
			}else
			{
				canSurviveDirectionNum+=1;
			}
		}
		//no direction can survice
		if(!canSurviveDirectionNum)
		{
			clearInterval(robotSnake.timer);
			alert("robot snake died");
			return;
		}
		var distance=Math.sqrt(Math.pow(robotSnake.snake[0].x-food.x,2)+Math.pow(robotSnake.snake[0].y-food.y,2));
		if(distance<=robotSnake.viewDistance)
		{
			if(robotSnake.snake[0].x!=food.x)
			{
				if(robotSnake.snake[0].x<food.x)
				{
					if (directions['r']) 
					{
						robotSnake.direction='r';
						return;
					}
				}
				if(robotSnake.snake[0].x>food.x)
				{
					if (directions['l']) 
					{
						robotSnake.direction='l';
						return;
					}
				}
			}else
			{
				if(robotSnake.snake[0].y<food.y)
				{
					if (directions['d']) 
					{
						robotSnake.direction='d';
						return;
					}
				}
				if(robotSnake.snake[0].y>food.y)
				{
					if (directions['u']) 
					{
						robotSnake.direction='u';
						return;
					}
				}
			}
		}else
		{
			//when food out of view
			//if original direction is safe then keep the direction
			if(directions[robotSnake.direction]) 
			{
				return;
			}
			//choose one direction which can survice
			for (var x in directions)
			{
				if (directions[x])
				{
					robotSnake.direction=x;
					return;
				}
			}
		}
	}
	robotSnake.walk=function()
	{
		robotSnake.chooseDirection();
		switch (robotSnake.direction)
		{
			case "u":
				robotSnake.snake.unshift({x:robotSnake.snake[0].x,y:robotSnake.snake[0].y-1});
				break;
			case "d":
				robotSnake.snake.unshift({x:robotSnake.snake[0].x,y:robotSnake.snake[0].y+1});			
				break;
			case "l":
				robotSnake.snake.unshift({x:robotSnake.snake[0].x-1,y:robotSnake.snake[0].y});			
				break;
			case "r":
				robotSnake.snake.unshift({x:robotSnake.snake[0].x+1,y:robotSnake.snake[0].y});			
				break;	
			default:break;
		}
		addBarrier(robotSnake.snake[0].x,robotSnake.snake[0].y);
		if (!robotSnake.isEatFood())
		{
			tmp=robotSnake.snake.pop();
			drawCell(tmp.x,tmp.y,null);
			deleteBarrier(tmp.x,tmp.y);
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
	for (var i=0;i<ROWS*COLS;i++) BARRIERS[i]=false;
	drawMap();
	initSnake();
	initFood();
	timer=setInterval(walk,100);
	document.onkeydown=function(event)
	{
		var event = event || window.event;
        keydown(event.keyCode);
		return false;
	}
}
window.onload=load();
