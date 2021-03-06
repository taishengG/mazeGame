var canvas = $('canvas'),
    width = canvas.width,
	maze_cells = {},
	start_cell = {},
	end_cell = {},
	visitRooms = [],
	roomsLine = [],
	start_col,
	start_row,
	maze
	
function $(str){
	return document.getElementById(str)
}


jQuery('#map1').click(function(){
    var obj = $('canvas');
    maze_cells = {};
    start_cell = {};
    visitRooms = [];
    roomsLine = [];
    maze = new Maze(obj,30,30);
                      jQuery(this)
                      .removeClass('btn-light')
                      .addClass('btn-info')
                      .siblings().addClass('btn-light');
});

jQuery('#map2').click(function(){
                      var obj = $('canvas');
                      maze_cells = {};
                      start_cell = {};
                      visitRooms = [];
                      roomsLine = [];
                      maze = new Maze(obj,20,20);
                      jQuery(this)
                      .removeClass('btn-light')
                      .addClass('btn-info')
                      .siblings().addClass('btn-light');
                      });

jQuery('#map3').click(function(){
                      var obj = $('canvas');
                      maze_cells = {};
                      start_cell = {};
                      visitRooms = [];
                      roomsLine = [];
                      maze = new Maze(obj,10,10);
                      jQuery(this)
                      .removeClass('btn-light')
                      .addClass('btn-info')
                      .siblings().addClass('btn-light');
                      });

function Maze(obj,col,row){
    this.col = col || 10;
    this.row = row || 10;
    this.canvas = obj.getContext('2d');
    this.init();
}
Maze.prototype = {
	init : function(){
        this.cell = (width - 2) / this.col;
		for(var i = 0 ; i < this.row ; i++){
			maze_cells[i] = [];
			for(var j = 0; j < this.col ; j++){
				maze_cells[i].push({
					'x' : j,  
					'y' : i,
					'top' : false,
					'bottom' : false,
					'left' : false,
					'right' : false,
					'isVisited' : false,
					'g' : 0,
					'h' : 0,
					'f' : 0
				})
			}
		}
		start_cell = {'x' : 0, 'y' : 0 };
		start_row = start_cell.x;
		start_col = start_cell.y;
		visitRooms.push(start_cell)
		roomsLine.push(start_cell)
		maze_cells[0][0].isVisited = true;
		maze_cells[0][0].top = true;
		maze_cells[this.row-1][this.col-1].bottom = true;
		this.calcCells(0,0,maze_cells);
		this.drawCells();
		maze_cells[0][0].top = false;
		maze_cells[this.row-1][this.col-1].bottom = false;
		this.drawRect(start_col,start_row);
		this.bindEvent();
		
	},
	calcCells : function(x,y,arr){
		var neighbors = [];
		if(x-1 >=0 && !maze_cells[x-1][y].isVisited){
			neighbors.push({'x' : x-1 ,'y' : y})
		}
		if(x+1 < this.row && !maze_cells[x+1][y].isVisited){
			neighbors.push({'x' : x+1 ,'y' : y})
		}
		if(y-1 >=0 && !maze_cells[x][y-1].isVisited){
			neighbors.push({'x' : x ,'y' : y-1})
		}
		if(y+1 <this.col && !maze_cells[x][y+1].isVisited){
			neighbors.push({'x' : x ,'y' : y+1})
		}
		if(neighbors.length>0){ //相邻房间有未访问房间
		    var current = {'x' : x , 'y' : y};
			var next = neighbors[Math.floor(Math.random() * neighbors.length)];
			maze_cells[next.x][next.y].isVisited = true;
			visitRooms.push({'x' : next.x , 'y' : next.y})
			roomsLine.push({'x' : next.x , 'y' : next.y});
			this.breakWall(current,next);
			this.calcCells(next.x,next.y,arr)
		}else{
			var next = roomsLine.pop();
			if(next != null){
				this.calcCells(next.x,next.y,arr)
			}
		}
	},
	breakWall : function(cur,next){
		if(cur.x < next.x){
			maze_cells[cur.x][cur.y].bottom = true;
			maze_cells[next.x][next.y].top = true;
		}
		if(cur.x > next.x){
			maze_cells[cur.x][cur.y].top = true;
			maze_cells[next.x][next.y].bottom = true;
		}
		if(cur.y < next.y){
			maze_cells[cur.x][cur.y].right = true;
			maze_cells[next.x][next.y].left = true;
		}
		if(cur.y > next.y){
			maze_cells[cur.x][cur.y].left = true;
			maze_cells[next.x][next.y].right = true;
		}
	},
	drawCells : function(){
		var ctx = this.canvas,   //canvas对象
		    w = this.cell;
			console.log(ctx)
		ctx.clearRect(0,0,$('canvas').width,$('canvas').height)
		ctx.beginPath();
		ctx.save();
		ctx.translate(1,1)
		ctx.strokeStyle = '#FFFFFF';
		ctx.lineWidth = 2;
		for(var i in maze_cells){ //i 为 row
		    var len = maze_cells[i].length;
			for( var j = 0; j < len; j++){
				var cell = maze_cells[i][j];
				i = parseInt(i);    
				console.log(typeof i)
				if(!cell.top){
					ctx.moveTo(j*w,i*w);
					ctx.lineTo((j+1)*w ,i*w);
				}
				if(!cell.bottom){
					ctx.moveTo(j*w,(i+1)*w);
					ctx.lineTo((j+1)*w ,(i+1)*w)
				}
				if(!cell.left){
					ctx.moveTo(j*w,i*w);
					ctx.lineTo(j*w,(i+1)*w )
				}
				if(!cell.right){
					ctx.moveTo((j+1)*w,i*w);
					ctx.lineTo((j+1)*w,(i+1)*w)
				}
			}
		}
		ctx.stroke();
		ctx.restore();
		this.drawOffset();
	},
	drawRect : function(col,row){
		var ctx = this.canvas;
		ctx.save();
		ctx.clearRect(0,0,canvas.width,canvas.height);
		ctx.drawImage($('offset'),0,0)
		ctx.translate(2,2)
		ctx.fillStyle = '#ff0000';
		ctx.fillRect(col*this.cell,row*this.cell,this.cell-2,this.cell-2);
		ctx.restore();
	},
	drawOffset : function(){
		var offsetCanvas = document.createElement('canvas');
		offsetCanvas.id = 'offset';
		document.body.appendChild(offsetCanvas);
		offsetCanvas.width = $('canvas').width;
		offsetCanvas.height = $('canvas').height;
		var offset = $('offset').getContext('2d');
		offset.clearRect(0,0,$('canvas').width,$('canvas').height)
		offset.drawImage($('canvas'),0,0,offsetCanvas.width,offsetCanvas.height);
		$('offset').style.display ='none'
	},
	bindEvent :　function(){
	  
	}
}

maze = new Maze($('canvas'),10,10)
var move = function(direction){
	switch (direction) {
		case 'left' :
		   event.preventDefault();
		   if(maze_cells[start_row][start_col].left){
			   start_col --;
		   }
		   break;
		case 'up' :
		   event.preventDefault();
		   if(maze_cells[start_row][start_col].top){
			   start_row --;
		   }
		   break;
		case 'right' :
		   event.preventDefault();
		   if(maze_cells[start_row][start_col].right){
			   start_col ++
		   }
		   break;
		case 'down' :
		   event.preventDefault();
		   if(maze_cells[start_row][start_col].bottom){
			   start_row ++;
		   }
		   break;
	}
	maze.drawRect(start_col,start_row);
	if(start_col == (maze.col - 1)  && start_row == ( maze.row - 1)){
        //maze.drawRect(start_col,start_row);
        setTimeout(function(){alert('You Win!!!'); window.location.reload(true);}, 1);
        
        
	}
};
