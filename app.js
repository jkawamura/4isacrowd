const board = document.querySelector('.board');
var iconColors; //stores the color set for the current theme
var colorCount = 3; //tracks how many colors are currently being used. Grows with levels
var levelCount = 1; //keeps track of which level the game is currently on
var score = 0; //player's score
var iconArray = []; //stores all the icons on the board
var groups = []; //stores the rows/columns of groups of four or more
var name; //stores the player's 3 letter username
var addColor; //keeps track of what level a color should be added at (varies depending on difficulty)
var dropping; //stores setInterval object when the board is dropping elements
var filling; //stores setInterval object when the board is being filled

//icon class stores each icon element in and its color for quick referencing
function icon(color, checked, element){
    this.color = color;
    this.checked = checked;
    this.element = element;
}

/**
 * builds the board and then populates it with icons
 */
function buildLevel() { 
    name = document.getElementById("name").value;
    const diffs = document.querySelectorAll('input[name="diff"]');

    //finds which difficulty level was selected
    for(var diff of diffs){
        if(diff.checked){
            var diffIn = diff.value;
            break;
        }
    }

    //changes the difficulty based on the user input
    switch(diffIn){
        case "easy":
            addColor = 3;
            break;
        case "med":
            addColor = 2;
            break;
        case "hard":
            addColor = 1;
            break;
    }

    //finds which theme was selected
    const themes = document.querySelectorAll('input[name="theme"]');
    for(var theme of themes){
        if(theme.checked){
            var themeIn = theme.value;
            break;
        }
    }

    //selects the color palette for the icons based on which theme was chosen
    switch(themeIn){
        case "Sunrise":
            iconColors = ["#283c55","#355070","#6d597a","#b56576","#e56b6f","#e77c76","#e88c7d","#eaac8b", "#d0baa9", "#9e8e91", "#5b4a68", "#353535" ];
            break;
        case "Forest":
            iconColors = ["#b8ff82", "#5ec471",  "#308e86", "#3a6b7c", "#cca463", "#7a5330", "#59392c", "#353535", "#eaac8b", "#e88c7d", "#e77c76", "#e56b6f"];
            break;
        case "Sea":
            iconColors = ["#37364e", "#355d69", "#6aae9d","#b9d4b4", "#d0baa9", "#9e8e91", "#5b4a68", "#353535", "#59392c", "#7a5330", "#cca463", "#3a6b7c"];
            break;
    }
    
    //makes the board visible and creates the divs to populate it and stores these divs into the icon class and stores each class instance in the iconArray
    board.style.display = "flex";
    document.getElementById('level').style.display = 'block';
    document.getElementById('scoretext').style.display = 'block';
    for(var i = 0; i < 15; i++){
        iconArray.push([]);
        for(var j = 0; j < 10; j++){
            let color = iconColors[Math.floor(Math.random() * colorCount)];
            let element = document.createElement('div');
            element.style.width = '40px';
            element.style.height = '40px';
            element.style.backgroundColor = color;
            element.setAttribute('class', 'icon');
            element.setAttribute('data-row', i);
            element.setAttribute('data-col', j);
            element.setAttribute('onmouseover', "findNeighbors(this.dataset.row, this.dataset.col);groupSize();");
            element.setAttribute('onmouseout', "clearIcon();");
            element.setAttribute('onclick', "remove();"); 
            let iconTemp = new icon(color, false, element);
            iconArray[i][j] = iconTemp;
            board.appendChild(element);
        }
    }
}

/**
 * When an icon is moused over this method finds all of the other "group members" of that icon. 
 * @param {number} iconRow  the row of the element that was moused over
 * @param {number} iconCol  the column of the element that was moused over
 */
function findNeighbors(iconRow, iconCol){ 
    
    iconRow = parseInt(iconRow);
    iconCol = parseInt(iconCol);

    //identifies the icon being hovered over in the array
    var curr = iconArray[iconRow][iconCol];

    //automatically discards "empty" icons
    if(curr.color == 'transparent'){
        return;
    }

    //adds the current icon's location to an array that stores the locations of group members
    groups.push(iconRow, iconCol);

    //indicates that this icon has already been checked to prevent the recursion from infinite looping
    curr.checked = true;

    //recursive cases. Checks if neighbors have the same color, then, if true, it does the same for the neighbors.
    //checks if icon to the left of the current one has the same color
    if(iconCol - 1 >= 0){
        var left = iconArray[iconRow][iconCol - 1];
        if(left.color == curr.color && left.checked == false){
            findNeighbors(iconRow, iconCol - 1);
        }
    }

    //checks if the icon above the current one has the same color
    if(iconRow - 1 >= 0){
        var top = iconArray[iconRow - 1][iconCol];
        if(top.color == curr.color && top.checked == false){
            findNeighbors(iconRow - 1, iconCol);
        }
    }

    //checks if icon to the right of the current one has the same color
    if(iconCol + 1 < iconArray[0].length){
        var right = iconArray[iconRow][iconCol + 1];
        if(right.color == curr.color && right.checked == false){
            findNeighbors(iconRow, iconCol + 1);
        }
    }

    //checks if the icon below the current one has the same color
    if(iconRow + 1 <  iconArray.length){
        var bot = iconArray[iconRow + 1][iconCol];
        if(bot.color == curr.color && bot.checked == false){
            findNeighbors(iconRow + 1, iconCol);
        }
    }
} 

/**
 * counts how many icons were collected by the findNeighbors method. If more than 8 
 * (2 coordinates per icon) elements are in the "groups" array, 
 * the function visually indicates these icons to the player by lowering their opacity. 
 */
function groupSize() { 
    
    //checks to make sure the group has at least 4 icons (each icon is identified by a row and a column, hence the 8)
    if(groups.length >= 8){
        for(let i = 0; i < groups.length; i += 2){
            iconArray[groups[i]][groups[i+1]].element.style.animation = 'fadeout .5s forwards';
        }
    } 
}

/**
 * clears the preview effect from the icons when the player removes their mouse from the group
 */
function clearIcon(){

    //revmoes fade effect from everything in the array.
    for(var i = 0; i < iconArray.length; i++){
        for(var j = 0; j < iconArray[0].length; j++){
            iconArray[i][j].checked = false;
            iconArray[i][j].element.style.animation = 'fadein 0s forwards';
        }

        //clears the group array
    } groups = [];
} 

//removes the group currently being previewed once the player clicks
/**
 * removes the group currently being previewed when the player clicks
 */
function remove(){

    //checks if the group has four or more icons and removes it. 
    if(groups.length >= 8){
        for(var i = 0; i < groups.length; i += 2){
            iconArray[groups[i]][groups[i+1]].element.style.backgroundColor = 'transparent';
            iconArray[groups[i]][groups[i+1]].color = "transparent";
        }

        //adds the value of the blocks removed to the score
        score += groups.length/2 * colorCount * colorCount;

        //updates the score indicator at the top of the page
        document.getElementById('scoretext').innerHTML = "Score: " + score;

        //begins dropping elements every 50ms to fill the removed icons' spots
        dropping = setInterval(function(){dropDown();}, 10);
    }
    for(let i = 0; i < groups.length; i += 2){
        iconArray[groups[i]][groups[i+1]].checked = false;
        iconArray[groups[i]][groups[i+1]].element.style.animation = 'fadein 0s forwards';
    } 
    //clears out the group array
    groups = []; 
}

/**
 * performs the drop effect on icons and then checks if anything needs to be dropped down. 
 */
function dropDown(){
    //performs drop down on all icons
    dropDownHelper();

    //checks if all icons have dropped down completely
    if(dropDownFinish() == true){
        clearInterval(dropping);

        //checks if the level is finished by seeingif the baord any groups of 4 remaining
        if (checkFinish() == true){

            //adds colors if needed, depending on the level and difficulty
            if(levelCount%addColor == 0){
                colorCount += 1;
            } 

            //advances the level counter and changes the level indicator at the top of the page
            levelCount += 1;
            document.getElementById('level').innerHTML = 'Level ' + (levelCount);

            //refills the empty spaces 
            filling = setInterval(function(){
                //fills the top row 
                fillWhite();
                //drops everything down by one row
                dropDownHelper();
            }, 10);
        }
    }
}


/**
 * checks if there any groups of four left after icons are removed and dropped down
 */
function checkFinish(){ 

    //loops through every icon 
    for(var i = 0; i < iconArray.length; i++){
        for(var j = 0; j < iconArray[0].length; j++){
            
            //calls the find neighbors on every icon
            findNeighbors(i, j);
            for(let i = 0; i < groups.length; i += 2){
                iconArray[groups[i]][groups[i+1]].checked = false;
            }

            //checks if the icon was in a group of four and returns false if this is the case
            if(groups.length >= 8){
                groups = [];
                return false;
            }

            //since findNeighbors uses the group array to store its findings, it must be cleared every loop
            groups = [];
        } 
    //returns true if none of the icons are in a group of four    
    } return true;
}

/**
 * fills in the empty space by repeatedly filling the top row and letting it drop
 */
function fillWhite(){
    //checks if the board is full by seeing if any of the top row spots are empty
    var full = true;
    for(element of iconArray[0]){
        if(element.color == 'transparent'){
            full = false;
            let color = iconColors[Math.floor(Math.random() * colorCount)];
            element.element.style.backgroundColor = color;
            element.color = color;
        }
    } 

    if(full == true){
        //checks if there are any groups of four left, if not, the game is over and the prompt for the user's score pops up
        if(checkFinish() == true){
            clearInterval(filling);
            document.getElementById("score").style.display = 'block';
            document.getElementById("insertscore").innerHTML = 'Score: ' + score;
            document.querySelector(".board").style.animation = 'fadeout2 3s forwards';
            document.getElementById("level").style.animation = 'fadeout2 3s forwards';
            document.getElementById("scoretext").style.animation = 'fadeout2 3s forwards';
            document.getElementById("scoretextform").value = score;
            document.getElementById("nameform").value = name; 
        } else{
            clearInterval(filling);
        }
    } 
}




/**
 * checks if anything needs to be dropped down 
 */
function dropDownFinish(){
    for(var i = iconArray.length - 2; i >= 0; i--){
        for(var j = 0; j < iconArray[0].length; j++){
            var curr = iconArray[i][j];
            var bot = iconArray[i + 1][j];
            if(bot.color == 'transparent' && curr.color != 'transparent'){
                return false;
            }
        }
    } return true;
}

/**
 * drops all icons down one spot if there is a blank square below them.
 */
function dropDownHelper(){
    for(var i = iconArray.length - 2; i >= 0; i--){
        for(var j = 0; j < iconArray[0].length; j++){
            var curr = iconArray[i][j];
            var bot = iconArray[i + 1][j];
            if(bot.color == 'transparent'){
                let color = curr.color;
                bot.color = color;
                bot.element.style.backgroundColor = color;
                curr.color = 'transparent';
                curr.element.style.backgroundColor = 'transparent';
            }
        }
    }
}