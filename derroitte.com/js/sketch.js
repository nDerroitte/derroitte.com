// Typing
let input_text = "The lab:\nA testing world that will mostlikely bug when entered... ";
let letter_count = 0;
let typing = false;
let typing_symbol = true;
var preMousIsClicked = false;
// Star
var arrayStar = [];
var connectionStar = [];
var mouseIsClicked = false;
var alldone = false;

// Loading font
function preload() {
}

// For when we rezie the windon
function windowResized()
{
    resizeCanvas(windowWidth, windowHeight);
}

// Mouse click event
function mouseClicked()
{
    if(mouseIsClicked)
        mouseIsClicked = false;
    else
        mouseIsClicked = true;
}

// Hover button
function hoverButton()
{
    bgcolor = color(24, 0, 46);
    typing = true
    preMousIsClicked = mouseIsClicked;
    mouseIsClicked = false;
}

// de-Hover button
function unhoverButton()
{
    bgcolor = color(0,3,17);
    typing = false;
    typing_symbol = true;
    t0 = new Date();
    next_letter_secs = random(0.05, 0.1);
    letter_count = 0;
    //mouseIsClicked = preMousIsClicked;
}

// function Setup() 
function setup() {
    canvas  = createCanvas (windowWidth, windowHeight);
    canvas.position(0,0)
    canvas.style('z-index', '-1')
    bgcolor = color(0,3,17);
    t0 = new Date();
    next_letter_secs = random(0.05, 0.1);

}
    
// function draw()
function draw()
{
    // maximiser l'opacité des ligneq
    // faire des autres objects connections au lieu de tout recalculé
    background(bgcolor);
    // Star creation
    if(arrayStar.length<1000)
    {
        newStar = new starObject(random(0,width),random(0,height));
        for(i =0 ; i<arrayStar.length; i++)
        {
            starDist = sqrt(pow(arrayStar[i].x - newStar.x,2)+ pow(arrayStar[i].y - newStar.y,2));
            if(starDist <= 80)
            {
                smallerOpa = min(arrayStar[i].opa, newStar.opa);
                connectionStar.push(new connectionObject(newStar.x, newStar.y, arrayStar[i].x,arrayStar[i].y,map(smallerOpa,0,255,0,65)));
            }
        }
        arrayStar.push(newStar);
    }
    else
    {
        alldone = true;
    }
    // Long line drawing
    if(true)
    {
        for(i=0; i<arrayStar.length; i++)
        {
            arrayStar[i].drawPoint();
        }
    }

    if (mouseIsClicked && typing == false)
    { 
        for(i=0; i<connectionStar.length; i++)
        {
            connectionStar[i].drawLine();
        }
    }
    // Typing
    if (typing) {
        t1 = new Date();
        delta_t =  (t1.getTime() - t0.getTime()) / 1000;
        if(delta_t > next_letter_secs)
        {
            if(letter_count >= input_text.length)
            {
                typing_symbol = !typing_symbol;
                t0 = t1;
                next_letter_secs = 0.5
            }
            else{
                letter_count ++;
                t0 = t1;
                next_letter_secs = random(0.05, 0.1)
            } 
        }
        push();
        fill(255, 255, 255);
        textFont("monospace")
        textSize(50);
        if (typing_symbol)
            text(input_text.substring(0, letter_count) + '|', 100 , 100);
        else
            text(input_text.substring(0, letter_count), 100 , 100);
        pop();
    }
}
