class starObject
{
    constructor(x, y)
    {
        this.x = x;
        this.y = y;
        this.sWeight = random(1,3);
        this.opa = random(0,255);
        this.arrayCon = [];
    }
    
    drawPoint()
    {
        push();
        stroke(255,this.opa);
        strokeWeight(this.sWeight);
        point(this.x, this.y);
        pop();
    }

    // drawLine()
    // {
    //     if(this.arrayCon.length!=0)
    //     {
    //         for (let j =0; j <this.arrayCon.length; j++)
    //         {
    //             push();
    //             stroke(255,this.arrayCon[j].opa);
    //             strokeWeight(0.7);
    //             line(this.arrayCon[j].x2,this.arrayCon[j].y2,this.x,this.y);
    //             pop();
    //         }
    //     }
    // }
}