/*
GAME RULES:

- The game has 2 players, playing in rounds
- In each turn, a player rolls a dice as many times as he whishes. Each result get added to his ROUND score
- BUT, if the player rolls a 1, all his ROUND score gets lost. After that, it's the next player's turn
- The player can choose to 'Hold', which means that his ROUND score gets added to his GLBAL score. After that, it's the next player's turn
- The first player to reach 100 points on GLOBAL score wins the game

CHALLENGE RULES:

- Player loses entire score when 2 6s are rolled consecutively
- Players can set winning score
- There are 2 dice instead of 1 and current score is 0 when 1 dice is rolled a 1 
*/


let scores, roundScore, activePlayer, gamePlaying, sixRolled, winnerScore, isGoalDefined;
const lowerLimit = 10;
const upperLimit = 200;

init();     //initalizes the game
document.querySelector('.btn-score').addEventListener('click', setWinScore);    //changes the winning condition after button is pressed

//anonymous function doesnt have name, cant be reused
document.querySelector('.btn-roll').addEventListener('click', function(){    
    if (gamePlaying)
    {    
        // need random #
        let dice1 = diceRoll();
        let dice2 = diceRoll();
        isGoalDefined = true;
        //console.log('Player '+activePlayer+' rolled a '+dice1+' and a '+dice2);

        //checks if 6 was rolled again after previous turn and if double six was rolled
        if(dice1 === 6 && sixRolled || dice2 === 6 && sixRolled || dice1 === 6 && dice2 === dice1)
        {
            //console.log('Player '+activePlayer+' rolled 2 sixes in a row');
            //wipes out current player score and switches player
            document.querySelector('#score-'+activePlayer).textContent = '0';
            nextPlayer();
        }
        else
        {
            sixRolled = false;  //curent roll is not equal to previous roll (6)
            // display score
            let diceDOM1 = document.querySelector('.dice1');
            let diceDOM2 = document.querySelector('.dice2');
            diceDOM1.style.display = 'block';
            diceDOM2.style.display = 'block';
            diceDOM1.src = 'dice-'+ dice1 +'.png';    //displays dice img according to # generated            
            diceDOM2.src = 'dice-'+ dice2 +'.png';
        }

        if(dice1 === 6 || dice2 === 6)
        {
            sixRolled = true;   //remembers that current roll is 6
        }

        //update round score only if rolled # is NOT a 1
        if (dice1 !== 1 && dice2 !== 1)
        {
            //add total score for the round
            roundScore += dice1 + dice2;
            document.querySelector('#current-'+activePlayer).textContent = roundScore; 
        }
        else
        {
            //switch to next player
            nextPlayer();
        }
    }    
});

//another anonymous function below
document.querySelector('.btn-hold').addEventListener('click', function(){
    if(gamePlaying)
    {
        //add current score to global score
        scores[activePlayer-1] += roundScore;
        //console.log('Player '+activePlayer+' currently has a score of '+scores[activePlayer-1]);

        //update UI by changing player score
        document.querySelector('#score-'+activePlayer).textContent = scores[activePlayer-1];
    
        //check if player won game
        if (scores[activePlayer-1] >= winnerScore)
        {
            //when winner appears, dices disappears and winner is displayed
            document.querySelector('#name-'+activePlayer).textContent = 'Winner!';  
            document.querySelector('.dice1').style.display = 'none';
            document.querySelector('.dice2').style.display = 'none';
            document.querySelector('.player-'+activePlayer+'-panel').classList.add('winner');
            document.querySelector('.player-'+activePlayer+'-panel').classList.remove('active');
            
            // stop dice roll after winning
            gamePlaying = false;
        }
        else
        {
            //nextPlayer
            nextPlayer();
        }
    }
});

//init is callback function here, using EventListener here to call init
document.querySelector('.btn-new').addEventListener('click', init);


function nextPlayer(){
    //next player
    activePlayer === 1 ? activePlayer = 2: activePlayer = 1;    //ternary operator
    roundScore = 0;     //sets temp score to 0 after switch

    //sets both temporary score boxes to 0
    document.getElementById('current-1').textContent = '0';
    document.getElementById('current-2').textContent = '0';

    //switches active between player 1 and player 2
    document.querySelector('.player-1-panel').classList.toggle('active');
    document.querySelector('.player-2-panel').classList.toggle('active');

    //hides dice after player switch
    document.querySelector('.dice1').style.display = 'none';
    document.querySelector('.dice2').style.display = 'none';
}


function init(){
    scores = [0,0];         //scores of both players
    roundScore = 0;         //total score of current play in the round
    activePlayer = 1;       //0 is 1st player, 1 is 2nd player
    gamePlaying = true;     //checks if we are playing game
    winnerScore = 100;      //default win score, can be changed
    isGoalDefined = false;  //checks if goal is defined before game starts, if true then goal cant change till new game

    //informs user winning score and how to change score
    alert('The winning score has been set to '+winnerScore+'. To change the score, enter a value and press submit.'+
    ' The range of values can be between '+lowerLimit+' points and '+upperLimit+' points.');
    //console.log(winnerScore);
    //console.log(typeof winnerScore);

    document.querySelector('.dice1').style.display = 'none';     //hide dice in beginning
    document.querySelector('.dice2').style.display = 'none';

    //set all scores to zero
    document.getElementById('score-1').textContent = '0';
    document.getElementById('score-2').textContent = '0';
    document.getElementById('current-1').textContent = '0';
    document.getElementById('current-2').textContent = '0';
    
    //set text to player 1 and player 2
    document.getElementById('name-1').textContent = 'Player 1';
    document.getElementById('name-2').textContent = 'Player 2';

    //removes winner and active from both players and sets active to player 1
    document.querySelector('.player-1-panel').classList.remove('winner');
    document.querySelector('.player-2-panel').classList.remove('winner');
    document.querySelector('.player-1-panel').classList.remove('active');
    document.querySelector('.player-2-panel').classList.remove('active');
    document.querySelector('.player-1-panel').classList.add('active');
}

function setWinScore(){
    if (!isGoalDefined)
    {
        //changes string value from html to number
        winnerScore = parseInt(document.querySelector('#winningScore').value, 10);
        if (isNaN(winnerScore))
        {
            //use default score as winning condition
            winnerScore = 100;
            alert('The winning score has been set to '+winnerScore+' because you entered the wrong value.');    
        }
        else if (winnerScore < lowerLimit || winnerScore > upperLimit)
        {
            //force user to limit range of winning score
            winnerScore = 100;
            alert('The winning score has been set to '+winnerScore+' because you can only enter a value between 10 and 150.');
        }
        else
        {
            alert('The winning score has been set to '+winnerScore+'. The default is 100 points.');
            //console.log(winnerScore);
            //console.log(typeof winnerScore);
        }
    }
}

function diceRoll(){
    return Math.floor((Math.random() * 6))+1;
}



/*  Additional Notes Below

//querySelector selects CSS elements, textContent changes the plain text in the webpage, innerHTML lets you add html to page
//next 2 lines are examples of how to edit text using querySelector
//document.querySelector('#current-'+activePlayer).textContent = dice;
//document.querySelector('#current-'+activePlayer).innerHTML = '<em>'+ dice +'</em>';

//line below gets the text from webpage
let x = document.querySelector('#score-'+activePlayer).textContent;

function btn(){
    //do something here
}
//btn would become a callback function if we let addEventListener call it instead of programmer calling it

//the 2 lines below are how to remove/add classes in html page
        document.querySelector('.player-0-panel').classList.remove('active');
        document.querySelector('.player-1-panel').classList.add('active');
*/