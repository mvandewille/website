  function Cell(i, j)
  {
    this.col = i;
    this.row = j;
    this.type = "passage"
    this.counter = Number.MAX_SAFE_INTEGER;
    this.f;
    this.g;
    this.h;
    this.parent;

    //Sets Cell object as a wall
    this.setWall = function()
    {
      this.type = "wall";
    }

    //Sets Cell object as a passage
    this.setPassage = function()
    {
      this.type = "passage";
    }

    this.setStart = function()
    {
      this.type = "start";
    }

    this.setEnd = function()
    {
      this.type = "end";
    }

    /*
    Function to find the neighbors of a frontier cell to create a passage
    Neighbors of a cell are cells of distance 2 that are within the grid and are EMPTY
    */
    this.neighbors = function()
    {
      var neighborArr = [];
      if (this.col - 2 >= 0 && cellGrid[this.col - 2][this.row].type == "passage")
      {
        neighborArr.push(cellGrid[this.col-2][this.row]);
      }
      if (this.col + 2 < clientWidth && cellGrid[this.col + 2][this.row].type == "passage")
      {
        neighborArr.push(cellGrid[this.col + 2][this.row]);
      }
      if (this.row - 2 >= 0 && cellGrid[this.col][this.row - 2].type == "passage")
      {
        neighborArr.push(cellGrid[this.col][this.row - 2]);
      }
      if (this.row + 2 < clientHeight && cellGrid[this.col][this.row + 2].type == "passage")
      {
        neighborArr.push(cellGrid[this.col][this.row + 2]);
      }
      return neighborArr;
    }

    /*
    Function to retrive the frontier cells for a given cell.
    Frontier cells are cells of distance 2 that are within the grid and are WALL
    */
    this.frontiers = function()
    {
      var frontierArr = [];
      if (this.col - 2 >= 0 && cellGrid[(this.col - 2)][this.row].type == "wall")
      {
        frontierArr.push(cellGrid[this.col - 2][this.row]);
      }
      if (this.col + 2 < clientWidth && cellGrid[(this.col + 2)][this.row].type == "wall")
      {
        frontierArr.push(cellGrid[this.col + 2][this.row]);
      }
      if (this.row - 2 >= 0 && cellGrid[this.col][this.row - 2].type == "wall")
      {
        frontierArr.push(cellGrid[this.col][this.row - 2]);
      }
      if (this.row + 2 < clientHeight && cellGrid[this.col][this.row + 2].type == "wall")
      {
        frontierArr.push(cellGrid[this.col][this.row + 2]);
      }
      return frontierArr;
    }

    /*
    Function to retrive the surrounding cells. Unlike neighbors() this returns cells at a distance of 1 that
    are within the grid and are EMPTY/passage
    */
    this.surrounding = function()
    {
      var surroundingArr = [];
      if (this.col - 1 >= 0 && (cellGrid[(this.col - 1)][this.row].type == "passage" || cellGrid[(this.col - 1)][this.row].type == "start" || cellGrid[(this.col - 1)][this.row].type == "end"))
      {
        surroundingArr.push(cellGrid[this.col - 1][this.row]);
      }
      if (this.col + 1 < clientWidth && (cellGrid[(this.col + 1)][this.row].type == "passage" || cellGrid[(this.col + 1)][this.row].type == "start" || cellGrid[(this.col + 1)][this.row].type == "end"))
      {
        surroundingArr.push(cellGrid[this.col + 1][this.row]);
      }
      if (this.row - 1 >= 0 && (cellGrid[this.col][this.row - 1].type == "passage" || cellGrid[this.col][this.row - 1].type == "start" || cellGrid[this.col][this.row - 1].type == "end"))
      {
        surroundingArr.push(cellGrid[this.col][this.row - 1]);
      }
      if (this.row + 1 < clientHeight && (cellGrid[this.col][this.row + 1].type == "passage" || cellGrid[this.col][this.row + 1].type == "start" || cellGrid[this.col][this.row + 1].type == "end"))
      {
        surroundingArr.push(cellGrid[this.col][this.row + 1]);
      }
      return surroundingArr
    }

    this.markVisited = function(cell)
    {
      this.visited = true;
      if (this.type != "start" && this.type != "end")
      {
        grid[this.col][this.row].style.background = "#b5d6ff"
      }
    }
  }