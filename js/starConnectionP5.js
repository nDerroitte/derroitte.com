
class connectionObject
{
    constructor(x1, y1, x2,y2,opa)
    {
        this.x2 = x2;
        this.y2 = y2;
        this.x1 = x1;
        this.y1 = y1;
        this.opa  = opa;
    } 

    drawLine()
    {
        push();
        stroke(255,this.opa);
        strokeWeight(0.7);
        line(this.x1, this.y1, this.x2, this.y2);
        pop();
    }
}

