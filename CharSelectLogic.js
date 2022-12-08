let confirmButtonDis, xButtonDis, oButtonDis, currentChoice,
    showFinalButton, numberOfSelections;

function initialize()
{
    confirmButtonDis = document.getElementById("confirm");
    xButtonDis = document.getElementById("XButton");
    oButtonDis = document.getElementById("OButton");
    showFinalButton = false;
    numberOfSelections = 0;
    console.log(Letters.XLetter.option);
    confirmButtonDis.addEventListener("click", () => {
        console.log("hi");
        sessionStorage.setItem("playerChar", currentChoice);
        window.location.href = "GameScreen.html";
    });

}

class Letters{
    static XLetter = new Letters("X");
    static OLetter = new Letters("O");
    constructor(option) {
        this.option = option;
    }
}

function charChoice(letter)
{
    if(currentChoice !== letter.option)
    {
        currentChoice = letter.option;
        if (currentChoice === Letters.XLetter.option) {
            oButtonDis.style.borderColor = "lightgrey";
            xButtonDis.style.borderColor = "purple";


        } else {
            xButtonDis.style.borderColor = "lightgrey";
            oButtonDis.style.borderColor = "green";
        }
        showFinalButton = true;
        confirmButtonDis.style.display = 'block';

    } else
    {
        currentChoice = null;
        xButtonDis.style.borderColor = "lightgrey";
        oButtonDis.style.borderColor = "lightgrey";
        showFinalButton = false;
        confirmButtonDis.style.display = 'none';
    }
}


