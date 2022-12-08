let gameBoard, r1c1, r1c2, r1c3, r2c1, r2c2, r2c3, r3c1, r3c2, r3c3, player, computer,
    turnFunction, tableDisplay, winnerDisplay;
let winningSquares = {hori: null, vert: null, dia: null, diaRev: null};;
const ifNoWinners = (array) => Object.values(array).every(x => x === null);
const allEqual = arr => arr.every( v => v === arr[0] );
let increaseAllClickCountBackAndForths;
function initialize()
{
    let playerLetter, computerLetter;
    if(sessionStorage.getItem("playerChar") === Letters.XLetter.alpha)
    {
        playerLetter = Letters.XLetter;
        computerLetter = Letters.OLetter;
    } else
    {
        playerLetter = Letters.OLetter;
        computerLetter = Letters.XLetter;
    }
    let rw1cl1 = document.getElementById("r1c1");
    let rw1cl2 = document.getElementById("r1c2");
    let rw1cl3 = document.getElementById("r1c3");
    let rw2cl1 = document.getElementById("r2c1");
    let rw2cl2 = document.getElementById("r2c2");
    let rw2cl3 = document.getElementById("r2c3");
    let rw3cl1 = document.getElementById("r3c1");
    let rw3cl2 = document.getElementById("r3c2");
    let rw3cl3 = document.getElementById("r3c3");
    tableDisplay = document.getElementById("table");
    winnerDisplay = document.getElementById("winner");

    r1c1 = new GameSpace(Letters.HollowLetter, SpaceState.Empty, rw1cl1, new AbortController());
    r1c2 = new GameSpace(Letters.HollowLetter, SpaceState.Empty, rw1cl2, new AbortController());
    r1c3 = new GameSpace(Letters.HollowLetter, SpaceState.Empty, rw1cl3, new AbortController());
    r2c1 = new GameSpace(Letters.HollowLetter, SpaceState.Empty, rw2cl1, new AbortController());
    r2c2 = new GameSpace(Letters.HollowLetter, SpaceState.Empty, rw2cl2, new AbortController());
    r2c3 = new GameSpace(Letters.HollowLetter, SpaceState.Empty, rw2cl3, new AbortController());
    r3c1 = new GameSpace(Letters.HollowLetter, SpaceState.Empty, rw3cl1, new AbortController());
    r3c2 = new GameSpace(Letters.HollowLetter, SpaceState.Empty, rw3cl2, new AbortController());
    r3c3 = new GameSpace(Letters.HollowLetter, SpaceState.Empty, rw3cl3, new AbortController());

    player = new Competitor("player", playerLetter, CompetitorType.Player);
    computer = new Competitor("computer", computerLetter, CompetitorType.Computer);

    gameBoard = [
        [r1c1, r1c2, r1c3],
        [r2c1, r2c2, r2c3],
        [r3c1, r3c2, r3c3]
    ];
    gameBoard.forEach((row) =>
    {
        row.forEach((e) =>
        {
            console.log(e.letter.alpha);
        });
    });

    for (let i = 0; i < gameBoard.length; i++) {
        for (let j = 0; j < gameBoard[0].length; j++) {
            let gameSquare = gameBoard[i][j];
            gameSquare.document.addEventListener('click', turnFunction = () => {
                console.log("hi");
                if(gameSquare.turnsNotClicked !== 1  || (gameSquare.turnsNotClicked === 1 && gameSquare.letter === player.letter)) {
                    player.placeLetter(gameSquare);
                    winningSquares = checkForTicTacToe(gameBoard);
                    console.log(winningSquares);
                    if (ifNoWinners(winningSquares)) {
                        computerPlace();
                        winningSquares = checkForTicTacToe(gameBoard);
                    }
                    gameBoard.forEach((row) => {
                        row.forEach((e) => {
                            e.turnsNotClicked++;
                        });
                    });
                    display();
                }
            }, gameSquare.aborting);
        }
    }

    display();
    if(computer.letter === Letters.XLetter)
    {
        computerPlace();
        gameBoard.forEach((row) =>
        {
            row.forEach((e) =>
            {
                if(e.letter === computer.letter)
                {
                    e.turnsNotClicked = 1;
                }
            });
        });
    }
    display();

}

function computerPlace()
{
    let randRow;
    let randCol;
    do {
        randRow = randomNum(0, 2);
        randCol = randomNum(0, 2);
    } while (gameBoard[randRow][randCol].state === SpaceState.Captured ||
    (gameBoard[randRow][randCol].letter === player.letter && gameBoard[randRow][randCol].turnsNotClicked === 0));
    computer.placeLetter(gameBoard[randRow][randCol]);


}

class Competitor
{
    constructor(name, letter, type) {
        this.name = name;
        this.letter = letter;
        this.type = type;
    }

    placeLetter = (space) =>
    {
        if(space.state !== SpaceState.Captured)
        {
            if(space.state === SpaceState.Occupied)
            {
                if(space.letter === this.letter)
                {
                    space.state = SpaceState.Captured;
                    space.document.style.color = space.letter.color;
                    space.aborting.abort();


                } else
                {
                    space.letter = this.letter;
                    space.turnsNotClicked = 0;
                    console.log(this.type);
                }
            } else
            {
                space.state = SpaceState.Occupied;
                space.letter = this.letter;
                space.turnsNotClicked = 0;
                console.log(this.type);

            }
        }
    }
}

class CompetitorType
{
    static Player = new CompetitorType("player");
    static Computer = new CompetitorType("computer");
    constructor(type) {
        this.type = type;
    }
}

class GameSpace{
    constructor(letter, state, document, aborting, turnsNotClicked) {
        this.letter = letter;
        this.state = state;
        this.document = document;
        this.turnsNotClicked = 2;
        this.aborting = aborting;
    }

}

class Letters{
    static XLetter = new Letters("X", "purple");
    static OLetter = new Letters("O", "green");
    static HollowLetter = new Letters("&nbsp;", "#ffffff00");
    constructor(alpha, color) {
        this.alpha = alpha;
        this.color = color;
    }
}

class SpaceState{
    static Empty = new SpaceState("Empty");
    static Occupied = new SpaceState("Occupied");
    static Captured = new SpaceState("Captured");

    constructor(state) {
        this.state = state;
    }
}

function checkForTicTacToe(array2d) {
    return {hori: checkHori(array2d), vert: checkVert(array2d), dia: checkDia(array2d), diaRev: checkDiaRev(array2d)};

}

function checkHori(array2d)
{
    for (let array2dKey of array2d) {
        if(checkAllSameLetter(array2dKey) === true)
            return array2dKey;
    }
    return null;
}



function checkVert(array2d)
{

    for (let i = 0; i < array2d[0].length; i++) {
        let col = [];
        for (let j = 0; j < array2d.length; j++) {
            col.push(array2d[j][i]);
        }
        if(checkAllSameLetter(col) === true)
            return col;
    }
    return null;
}
function checkDia(array2d)
{
    let dia = [];
    for (let i = 0; i < array2d.length; i++) {
        dia.push(array2d[i][i]);
    }
    if(checkAllSameLetter(dia) === true)
    {
        return dia;
    } else
    {
        return null;
    }
}
function checkDiaRev(array2d)
{
    let diaRev = [];
    for (let i = 0; i < array2d.length; i++) {
        diaRev.push(array2d[i][array2d.length-1-i]);
    }
    if(checkAllSameLetter(diaRev) === true)
    {
        return diaRev;
    } else
    {
        return null;
    }
}


function checkAllSameLetter(array)
{
    if(array[0].letter === Letters.HollowLetter)
    {
        return false;
    }
    return array.every(value => {
        return value.letter === array[0].letter;
    })

}

function randomNum(min,max)
{
    return Math.floor(Math.random() * (max-min+1))+ min;
}

function delay(milliseconds){
    return new Promise(resolve => {
        setTimeout(resolve, milliseconds);});
}

function display()
{

    for (let i = 0; i < gameBoard.length; i++) {
        for (let j = 0; j < gameBoard[0].length; j++) {
            let gameSquare = gameBoard[i][j];
            gameSquare.document.innerHTML = gameSquare.letter.alpha
            gameSquare.document.style.color = gameSquare.letter.color;
            if(gameSquare.state === SpaceState.Captured)
            {
                gameSquare.document.style.borderColor = gameSquare.letter.color;

            }

        }
    }
    if (!ifNoWinners(winningSquares))
    {
            gameBoard.forEach((row) =>
            {
                row.forEach((e) =>
                {
                    e.aborting.abort();
                });
            });
            let winningName;
            let winningLetter;
            Object.values(winningSquares).forEach((arr) =>
            {
                if(arr !== null) {
                    winningLetter = arr[0].letter;
                    winningName = winningLetter === player.letter ? player.name : computer.name;

                    arr.forEach((square) => {
                        square.document.style.backgroundColor = "lightgrey";
                    });
                }
            });
            winnerDisplay.innerHTML =`The winner is ${winningLetter.alpha}: The ${winningName}`;

        if(winningName === player.name)
                winnerDisplay.innerHTML+="</br> You Win";
            else
                winnerDisplay.innerHTML+="</br> You Lose";
    }
    tableDisplay.style.emptyCells = 'show';
}

function goBack()
{
    window.location.href = "CharSelectScreen.html";
}