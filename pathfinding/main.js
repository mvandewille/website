//Const variables that are used to determine the type of a display element.
//These consts are used as IDs for the div elements in the draw_area.
const EMPTY = "empty";
const WALL = "wall";
const START = "start";
const END = "end";
const ALL = "all";

//Width and height measured in cells inside of the draw_area.
const clientWidth = 17;
const clientHeight = 13;

//Width and height of cells
const cellSpec = "45px";

//Building the 2D array that contains the display elements.
var grid = new Array(clientWidth);
build2DArray(grid);

//Building the 2D array that contains the logic elements.
var cellGrid = new Array(clientWidth);
build2DArray(cellGrid);

var algorSelected = false;
var currentAlgor = "";

var startPlaced = false;
var placingStart = false;
var endPlaced = false;
var placingEnd = false;
var placingWall = false;

//Display variable that represents the contents of the console window.
var disp = document.getElementById("display");

//Unitialized variables used during pathfinding.
var startpoint;
var endpoint;

// GRID INIT
initGrid();

  //Pathfinding algorithms/////////////////////////

  //Method for A* pathfinding algorithm

  //Uses the Manhattan Distance approximation as heuristic value.
  function astar() {

    //1.  Initialize the open list
    var openList = [];

    //2.  Initialize the closed list
    //put the starting node on the open 
    //list (you can leave its f at zero)
    var closedList = [];
    startpoint.f = 0;
    startpoint.g = 0;
    openList.push(startpoint); 
    //3.  while the open list is not empty

    var branch = setInterval(searchTree, 50);
    
      function searchTree()
      {
        if (openList.length == 0)
        {
          clearInterval(branch);
          astar2();
          return;
        }
        //a) find the node with the least f on 
        //the open list, call it "min"
        var min = openList[0];
        for (var i = 0; i < openList.length; i ++)
        {
          if (openList[i].h < min.h)
          {
            min = openList[i];
          }
        }

        //div for coloring gradient
        var div = grid[min.col][min.row];

        //b) pop min off the open list
        openList.splice(openList.indexOf(min), 1);

        //c) generate min's 8 successors
        var paths = min.surrounding();
        if (paths.indexOf(startpoint) != -1)
        {
          paths.splice(paths.indexOf(startpoint), 1);
        }
        for (var i = 0; i < paths.length; i++)
        {
          //and set their parents to min
          var successor = paths[i];

          // i) if successor is the goal, stop search
          if (successor.type == "end")
          {
            if (div.style.backgroundColor == "white")
              {
                div.style.backgroundColor = getColorCode(min.counter + 1, startpoint.counter);
              }
            successor.parent = min;
            clearInterval(branch);
            astar2();
            return;
          }

          // successor.g = q.g + distance between successor and q
          var dist = min.g + 1;

          // successor.h = distance from goal to successor
          // For the heuristic value we will be using Manhattan distance rather than Euclidean or Diagonal
          var heur = Math.abs(successor.col - endpoint.col) + Math.abs(successor.row - endpoint.row);

          //calculate potential f cost for successor
          var totalCost = dist + heur;

          //if a node with the same position as 
          //successor is in the OPEN list which has a 
          //lower f than successor, skip this successor
          var inOpen = false;
          for (var j = 0; j < openList.length; j++)
          {
            if (openList.length != 0 && successor.col == openList[j].col && successor.row == openList[j].row && totalCost > openList[j].f)
            {
              inOpen = true;
            }
          }

          //if a node with the same position as 
          //successor  is in the CLOSED list which has
          //a lower f than successor, skip this successor
          var inClosed = false;
          for (var k = closedList.length - 1; k >= 0; k--)
          {
            if (closedList.length != 0 && successor.col == closedList[k].col && successor.row == closedList[k].row && totalCost > closedList[k].f)
            {
              inClosed = true;
            }
          }
          if (!inOpen && !inClosed)
          {
            successor.parent = min;
            successor.g = dist;
            successor.h = heur;
            successor.f = totalCost;
            openList.push(successor);

          }
        }
        closedList.push(min)
        if (div.style.backgroundColor == "white")
        {
          div.style.backgroundColor = getColorCode(min.counter + 1, startpoint.counter);
        }
        div.onmouseover = null;
        div.onmouseout = null;
      }

    function astar2()
    {
      var cur = endpoint;
      var path = [];
      while (cur.type != "start")
      {
        path.push(cur);
        cur = cur.parent;
      }

      var iterator = path.length - 1;
      var displayAlgo = setInterval(displayAstar, 150);
      function displayAstar()
      {
        if (iterator < 0)
        {
          clearInterval(displayAlgo);
          createConsoleMsg("Visualization completed successfully");
        }
        else
        {
          path[iterator].markVisited();
          iterator --;
        }
      }
    }
  }

  function djikstra()
  {
    var list = assignValues();
    var openList = [];
    var closedList = [];
    var pathLength = startpoint.counter;
    startpoint.counter = 0;
    openList.push(startpoint);

    var branch = setInterval(dijkstraBranch, 50);
    function dijkstraBranch()
    {
        if (openList.length == 0)
        {
          clearInterval(branch);
          dijkstra2();
          return;
        }

        var min = openList[0];
        for (var i = 0; i < openList.length; i ++)
        {
          if (openList[i].h < min.h)
          {
            min = openList[i];
          }
        }

        var div = grid[min.col][min.row];
        openList.splice(openList.indexOf(min), 1);

        var paths = min.surrounding();
        if (paths.indexOf(startpoint) != -1)
        {
          paths.splice(paths.indexOf(startpoint), 1);
        }

        for (var i = 0; i < paths.length; i++)
        {
          var successor = paths[i];

        if (successor.type == "end")
        {
          if (div.style.backgroundColor == "white")
            {
              div.style.backgroundColor = getColorCode(pathLength - (min.counter + 1), pathLength);
            }
          successor.parent = min;
          clearInterval(branch);
          dijkstra2();
          return;
        }

        var dist = min.counter + 1;

        var inOpen = false;
        for (var j = 0; j < openList.length; j++)
        {
          if (openList.length != 0 && successor.col == openList[j].col && successor.row == openList[j].row && dist > openList[j].counter)
          {
            inOpen = true;
          }
        }

        var inClosed = false;
        for (var k = closedList.length - 1; k >= 0; k--)
        {
          if (closedList.length != 0 && successor.col == closedList[k].col && successor.row == closedList[k].row && dist > closedList[k].counter)
          {
            inClosed = true;
          }
        }
        if (!inOpen && !inClosed)
        {
          successor.parent = min;
          successor.counter = dist;
          openList.push(successor);
        }
      }
      closedList.push(min)
      if (div.style.backgroundColor == "white")
      {
        div.style.backgroundColor = getColorCode(pathLength - (min.counter + 1), pathLength);
      }
      div.onmouseover = null;
      div.onmouseout = null;
    }

    function dijkstra2()
    {
      var path = [];
      var cur = endpoint;
      while (cur.type != "start")
      {
        path.push(cur);
        cur = cur.parent;
      }

      var iterator = path.length - 1;
      var displayDijkstra = setInterval(pathDisplay, 150);
      function pathDisplay()
      {
        if (iterator < 0)
        {
          clearInterval(displayDijkstra);
          createConsoleMsg("Visualization completed successfully.");
        }
        else
        {
          path[iterator].markVisited();
          iterator --;
        }
      }
    }
  }

  function sample()
  {
    var mainCellList = assignValues();
    iterator = 0;
    var assignCounter = setInterval(findPath, 50);
    function findPath()
    {
      if (mainCellList[iterator].type == "start") 
      {
        clearInterval(assignCounter);
        samplePart2();
      }
      var cur = mainCellList[iterator];
      if (mainCellList[iterator] != startpoint && mainCellList[iterator] != endpoint)
      {
        var div = grid[cur.col][cur.row];
        if (div.style.backgroundColor == "white")
        {
          div.style.backgroundColor = getColorCode(cur.counter + 1, startpoint.counter);
        }
        div.onmouseover = null;
        div.onmouseout = null;
      }
      iterator++;
    }
    function samplePart2()
    {
      var cur = startpoint;
      var displayPath = setInterval(sample_loop, 150)
      function sample_loop()
      {
        var paths = [];
        paths = cur.surrounding();
        for (var i = 0; i < paths.length; i++)
        {
          if (paths[i].counter == Number.MAX_SAFE_INTEGER)
          {
            paths.splice(i, 1);
            i = -1;
          }
        }
        var next_node = paths[0];
        for (var i = 0; i < paths.length; i++)
        {
          if (paths[i].counter <= next_node.counter)
          {
            next_node = paths[i];
          }
        }
        cur = next_node;
        if (next_node.type != "end")
        {
          next_node.markVisited();
        }
        else
        {
          clearInterval(displayPath);
        }
      }
    }
  }

  function assignValues()
  {
    mainCellList = [];
    endpoint.counter = 0;
    mainCellList.push(endpoint);

    var iterator = 0;
    while (iterator < mainCellList.length)
    {
      var cur = mainCellList[iterator];
      var surrounding = mainCellList[iterator].surrounding();
      for (var i = 0; i < surrounding.length; i++)
      {
        for (var j = 0; j < mainCellList.length; j++)
        {
          if ((surrounding[i].col != mainCellList[j].col || surrounding[i].row != mainCellList[j].row) && mainCellList.indexOf(surrounding[i]) == -1)
          {
            surrounding[i].counter = cur.counter + 1;
            mainCellList.push(surrounding[i]);
          }
        }
      }
      iterator ++;
    }
    return mainCellList;
  }
  /////////////////////////////////////////////////

  /*
  Fills the draw area with a grid of interactive divs.
  */
  function initGrid() {
    var e = document.getElementById("draw_area");
    for (var y = 0; y < clientHeight; y++) {
      var row = document.createElement("div");
      row.className = "row";
      row.style.maxHeight = 47;
      row.style.verticalAlign = "top";
      for (var x = 0; x < clientWidth; x++) {
        var cell = document.createElement("div");
        cell.style.width = cellSpec;
        cell.style.height = cellSpec;
        cell.style.borderStyle = "solid";
        cell.style.borderColor = "#808080";
        cell.style.borderWidth = "thin";
        cell.style.background = "white";
        cell.style.textALign = "center";
        cell.id = EMPTY;
        cell.style.display = "inline-block";
        cell.style.verticalAlign = "top";
        cell.onclick = function() { placeNewCell(this); };
        setHighlight(cell);
        row.appendChild(cell);
        grid[x][y] = cell;
        cellGrid[x][y] = new Cell(x, y);
        cellGrid[x][y].setCounter = Number.MAX_SAFE_INTEGER;
      }
      e.appendChild(row);
    }
    //Used for debugging
    //console.log(cellGrid);
  }

  /*
    Takes an array as an argument and builds a 2D array. 
  */
  function build2DArray(arr) {
    for (var i = 0; i < arr.length; i++) {
      arr[i] = new Array(clientHeight);
    }
  }

  /*
    Syncs up div grid with cellGrid, used to push changes in the cellGrid to the UI
  */
  function pushToUI()
  {
    for (var i = 0; i < clientWidth; i++)
    {
      for (var j = 0; j < clientHeight; j++)
      {
        if (cellGrid[i][j].type == "wall")
        {
          grid[i][j].id = WALL;
          grid[i][j].style.background = "#808080";
        }
        if (cellGrid[i][j].type == "passage")
        {
          grid[i][j].id = EMPTY;
          grid[i][j].style.background = "white";
        }
      }
    }
  }

  /*
    Searches all cells in the grid and clears them based on an arugment.
  */
  function clearCells(toBeCleared) {
    for (var i = 0; i < clientWidth; i++) {
      for (var j = 0; j < clientHeight; j++) {
        var curDiv = grid[i][j];
        var curCell = cellGrid[i][j];
        if (toBeCleared != ALL) {
          if (curDiv.id == toBeCleared) {
            curDiv.style.background = "white";
            curDiv.id = EMPTY;
            curDiv.innerHTML = "";
            curCell.counter = Number.MAX_SAFE_INTEGER;
            setHighlight(curDiv);
            curCell.setPassage();
            curCell.visited = false;
            curCell.f = null;
            curCell.g = null;
            curCell.h = null;
            curCell.parent = null;
          }
        } else {
          if (curDiv.id == WALL || curDiv.id == START || curDiv.id == END || curDiv.id == EMPTY) {
            curDiv.style.background = "white";
            curDiv.id = EMPTY;
            curDiv.innerHTML = "";
            curCell.setPassage();
            curCell.counter = Number.MAX_SAFE_INTEGER;
            curCell.visited = false;
            curCell.f = null;
            curCell.g = null;
            curCell.h = null;
            curCell.parent = null;
            curDiv.onmouseover = function () { this.style.backgroundColor = "#D3D3D3"; };
            curDiv.onmouseout = function  () { this.style.backgroundColor = getBackgroundColor(this); };
          }
        }
      }
    }
  }

  /*
    Clears all cells in the grid by calling 'searchCells()' with ALL as an argument
  */
  function clearAll() {
    clearCells(ALL);
  }
  
  /*
    Edits a cell on both grids and turns it into either a start or end point, or a wall.
  */
  function placeNewCell(thisCell) {
    var tempLoc = getLocation(thisCell);
    var col = tempLoc[0];
    var row = tempLoc[1];
    if (placingWall) {
      thisCell.style.background = "#808080";
      thisCell.id = WALL;
      cellGrid[col][row].setWall();
    } else if (placingStart) {
      clearCells(START);
      thisCell.style.background = "#009000";
      thisCell.id = START;
      cellGrid[col][row].setStart();
      startpoint = cellGrid[col][row];
      startPlaced = true;
    } else if (placingEnd) {
      clearCells(END);
      thisCell.style.background = "#AD000C";
      thisCell.id = END;
      cellGrid[col][row].setEnd();
      endpoint = cellGrid[col][row];
      endPlaced = true;
    }
  }



  /*
  Main run function for pathfinding. 
  */
  function run() {
    var statusMsg = "";
    var final = "";
    var node;
    var content = document.createElement("p");
    content.setAttribute("id", "msg");

    if (!algorSelected || !startPlaced || !endPlaced) {
      statusMsg += "Could not start visualization"

      if (!algorSelected) {
        statusMsg += ", please select an algorithm"
      }

      if (!startPlaced) {
        statusMsg += ", please place a start point"
      }

      if (!endPlaced) {
        statusMsg += ", please place an end point"
      }

      node = document.createTextNode(statusMsg);
      content.style.color = "red";

    } else if (algorSelected && startPlaced && endPlaced) {
      var checkPath = assignValues();
      if (checkPath.indexOf(startpoint) == -1)
      {
        statusMsg += "Invalid grid/maze - no path exists"
        node = document.createTextNode(statusMsg);
        content.style.color = "red";
        content.appendChild(node);
        disp.appendChild(content);
        document.getElementById("console_area").scrollTop = disp.scrollHeight;
        return;
      }
      statusMsg += "Beginning visualization..."
      node = document.createTextNode(statusMsg); 

      if (currentAlgor == "A*") 
      {
        assignValues();
        astar();
      }

      if (currentAlgor == "Dijkstra")
      {
        djikstra();
      }

      if (currentAlgor == "Sample")
      {
        sample();
      }
      startPlaced = false;
      endPlaced = false;
    }
    content.appendChild(node);
    disp.appendChild(content);
    document.getElementById("console_area").scrollTop = disp.scrollHeight;
  }

  /*
  Algorithm selection indication.
  */
  function selectAlgorithm(msg) {
    if (msg == "A*") {
      createConsoleMsg("A* algorithm selected");
      currentAlgor = msg;
    }
    else if (msg == "Dijkstra") {
      createConsoleMsg("Dijkstra's algorithm selected");
      currentAlgor = msg;
    }
    else if (msg == "Sample") {
      createConsoleMsg("Sample algorithm selected");
      currentAlgor = msg;
    }
  }

  /*
    Generates a random maze.
  */
  function generateRand() {
    clearAll();
    var statusMsg ="";
    var final = "";
    var node;
    var content = document.createElement("p");
    content.setAttribute("id", "msg");

    statusMsg += "Generating Random Maze...";
    node = document.createTextNode(statusMsg);
    content.appendChild(node);
    disp.appendChild(content);
    document.getElementById("console_area").scrollTop = disp.scrollHeight;

    runningRandGenerator = true;

    //Start with a Grid full of Cells in state Blocked.
    for (var i = 0; i < clientWidth; i++) {
      for (var j = 0; j < clientHeight; j++) {
        var curDiv = grid[i][j];
        var curCell = cellGrid[i][j];
        curDiv.style.background = "#808080";
        curDiv.id = WALL;
        setHighlight(curDiv);
        curCell.setWall();
      }
    }

    //Pick a random Cell, set it to state Passage and Compute its frontier cells. 
    var allFrontierCells = [];
    var cur = cellGrid[Math.floor(Math.random() * clientWidth/2) * 2][Math.floor(Math.random() * clientHeight/2) * 2];
    cur.setPassage();
    setHighlight(cur);
    var frontierTemp = cur.frontiers();
    for (var i = 0; i < frontierTemp.length; i++)
    {
      allFrontierCells.push(frontierTemp[i]);
    }

    /* While the list of frontier cells is not empty:
          1. Pick a random frontier cell from the list of frontier cells.
          2. Pick a random neighbor and connect the frontier cell with the neighbor by setting the cell in-between to state Passage. 
             Compute the frontier cells of the chosen frontier cell and add them to the frontier list. 
             Remove the chosen frontier cell from the list of frontier cells.
    */
    while (allFrontierCells.length != 0)
    {
      var curNeighbor;
      cur = allFrontierCells[Math.floor(Math.random() * allFrontierCells.length)];
      var tempNeighbors = [];
      tempNeighbors = cur.neighbors();
      curNeighbor = tempNeighbors[Math.floor(Math.random() * tempNeighbors.length)];

      allFrontierCells.splice(allFrontierCells.indexOf(cur), 1);
      frontierTemp = cur.frontiers();
      for (var i = 0; i < frontierTemp.length; i++)
      {
        if (allFrontierCells.indexOf(frontierTemp[i]) == -1)
          allFrontierCells.push(frontierTemp[i]);
      }

      if (cur.row == curNeighbor.row)
      {
        var passage = cellGrid[((cur.col + curNeighbor.col)/2)][cur.row];
      }
      if (curNeighbor.col == cur.col)
      {
        var passage = cellGrid[cur.col][((cur.row + curNeighbor.row)/2)];
      }
      cur.setPassage();
      passage.setPassage();
    }
    pushToUI();
  }

  /*
    Creates a message and displays it in the console.
  */
  function createConsoleMsg(msg) {
    var statusMsg = msg;
    var node;
    var content = document.createElement("p");
    content.setAttribute("id", "msg");

    node = document.createTextNode(statusMsg);
    content.appendChild(node);
    disp.appendChild(content);
    document.getElementById("console_area").scrollTop = disp.scrollHeight;
  }

  /*
    Modifies booleans for use with the Start and End point buttons as well
    as the place walls button.
  */
  function setStart() {
    placingStart = true;
    placingEnd = false;
    placingWall = false;
  }

  function setEnd() {
    placingStart = false;
    placingEnd = true;
    placingWall = false;
  }

  function useWall() {
    placingStart = false;
    placingEnd = false;
    placingWall = true;
  }

  /*
    Sets the selected algorithm.
  */
  function setAlgor(algor) {
    algorSelected = true;
    selectAlgorithm(algor);
  }

  /*
    Function to get grid column and row for a given div in the div grid
  */
  function getLocation(div) {
    var cellCol;
    var cellRow;
    var cur = grid[0][0];
    var neighborArr = [];
    for (var i = 0; i < clientWidth; i++)
    {
      for (var j = 0; j < clientHeight; j++)
      {
        cur = grid[i][j];
        if (div === cur)
        {
          cellCol = i;
          cellRow = j;
          return [cellCol, cellRow];
        }
      }
    }
  }

  /*
    Sets the background color of a cell based on its id. Used with the setHighlight() function
    to create a highlighted cursor effect on the grid.
  */
  function getBackgroundColor(thisCell) {
    if (thisCell.id == EMPTY) {
      var loc = getLocation(thisCell);
      if (cellGrid[loc[0]][loc[1]].visited == true)
      {
        return "#b5d6ff";
      }
      return "white";
    } else if (thisCell.id == WALL) {
      return "#808080";
    } else if (thisCell.id == START) {
      return "#009000";
    } else {
      return "#AD000C";
    }
  }

  /*
    Changes the onmouseover and onmouseout properties of a cell it takes as an argument.
    Used to create a highlighted cursor effect on the grid.
  */
  function setHighlight(thisCell) {
    thisCell.onmouseover = function () { this.style.backgroundColor = "#D3D3D3"; };
    thisCell.onmouseout = function  () { this.style.backgroundColor = getBackgroundColor(thisCell); };
  }

  /*
    Takes an integer as an arugment and converts it to hex color code based
    on the size of the integer in the form of a string. Used for the pathfinding 
    visualization.

    Shades in increasing order :
    
    ORANGE v1
    #FFAF7A
    #FF9D5C
    #FF8B3D
    #FF781F
    #FF6600
    
  */
  function getColorCode(counter, length) {
    var section = Math.ceil(length / 7);
    if (counter <= section)
      return "#C07963";
    if (counter <= section * 2)
      return "#C09363";
    if (counter <= section * 3)
      return "#C0AB63";
    if (counter <= section * 4)
      return "#C0BF63";
    if (counter <= section * 5)
      return "#ABC063";
    if (counter <= section * 6)
      return "#94C063";
    if (counter <= section * 7)
      return "#7CC063";
  }