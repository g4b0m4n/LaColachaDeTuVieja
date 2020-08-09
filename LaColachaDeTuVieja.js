var ctx = document.querySelector("canvas").getContext("2d");
var score = 0;
var segments = [];
//ctx.canvas.width, ctx.canvas.height = 400;

class Head {

    constructor() {
        this.x = ctx.canvas.width/2;
        this.y = ctx.canvas.height/2;
        this.w = 10;
        this.h = 20;
        this.dr = false;
    }
    
    colision(obj){
        if (obj.w > this.x & obj.h > this.y &
        obj.x < this.w & obj.y <this.h) return true;
    }
}
var head = new Head();
//segments[0]=head;

class Segment {

    constructor(last) {
        this.x =last.x+last.w+5;
        this.y =last.y+last.h+5;
        this.w =last.w;
        this.h =last.h;
    }
    /*
    colision(head){
        if (head.w > this.x & head.h > this.y &
        head.x < this.w & head.y <this.h) return true;
    }*/
}

class Mice {
    
    constructor(x, y) {
        this.x = 1+Math.random()*200;
        this.y = 1+Math.random()*200;
        this.w = 10;
        this.h = 10;
    }
}
var mice = new Mice();

var wallCol = function(obj){
    if(obj.w > 400-obj.x| obj.h > 400-obj.y){
        return true;
    }
    if (obj.x < 0 | obj.y < 0){
        return true;
    }
}

var touchArea = function(cx, cy, x, y, w, h, dr, ev){
    if (cx > x & cx < w & cy > y & cy < h){
        dr = ev;
    }
}

controller = {

    left: false,
    right: false,
    up: false,
    down: false, 
    
    touchListener: function(event) {
        var touch_state = event.type == "touchstart"?true:false;
        
        touchArea(event.touches.clientX, event.touches.clientY,
        0,100, 0, 100, controller.up, touch_state);
        
        touchArea(event.touches.clientX, event.touches.clientY,
        300,400, 300, 400, controller.down, touch_state);
        
        touchArea(event.touches.clientX, event.touches.clientY,
        0,100, 0, 100, controller.left, touch_state);
        
        touchArea(event.touches.clientX, event.touches.clientY,
        300,400, 300, 400, controller.right, touch_state);
    },
    keyListener: function(event) {
        var key_state = event.type == "keydown"?true: false;

        switch (event.keyCode) {

            case 37: //left
                controller.left = key_state;
                break;
            case 38: //up
                controller.up = key_state;
                break;
            case 39: //right
                controller.right = key_state;
                break;
            case 40: //down
                controller.down = key_state;
                break;
        }
    }/*keyListener end*/
};/*controller end*/

var loop = function() {
   let i = 1;
   ctx.fillStyle = "#ff0000";
   ctx.fillRect(0,0,ctx.canvas.width ,ctx.canvas.height );
   ctx.fillStyle = "#000000";
   
   mice.x+=Math.random()+1;
   
   if (wallCol(mice)){
       mice.y*=-1;
   }else if (wallCol(mice)){
       mice.y*=1;
   }else if (wallCol(mice)) {
       mice.x*=-1;
   }else if (wallCol(mice)){
       mice.x*=1;
   }

   
   ctx.fillRect(head.x, head.y, head.w, head.h);
   
   if(head.dr) head.x+=1;
   else head.y+=1;
   
   ctx.fillRect(mice.x, mice.y, mice.w, mice.h);
   
   if (controller.up){
       head.dr=false;
       head.y*=-1;
       head.w=10;
       head.h=20;
   }else if (controller.down){
       head.dr=false;
       head.y*=1;
       head.w=10;
       head.h=20;
   }else if (controller.left) {
       head.dr=true;
       head.x*=-1;
       head.w=20;
       head.h=10;
   }else if (controller.right){
       head.dr=true;
       head.x*=1;
       head.w=20;
       head.h=10;
   }
    while (i < score){
       i++;
       segments[i]= new Segment(segments[i-1]);
       ctx.fillRect(segments[i].x, segments[i].y,
       segments[i].w, segments[i].h);
       
        if (head.colision(segments[i])){
            segments.splice(i,1);
        }
    } 
    if (head.colision(mice)) {
        score++;
        mice = null;
        mice = new Mice();
        
    }
    if(wallCol(head)) head=null;
    
    window.requestAnimationFrame(loop); //update frame
}
ctx.addEventListener("touchstart", controller.touchListener);
ctx.addEventListener("touchend", controller.touchListener);
ctx.addEventListener("touchmove", controller.touchListener);
ctx.addEventListener("touchcancel", controller.touchListener);
ctx.addEventListener("keydown", controller.keyListener);
ctx.addEventListener("keyup", controller.keyListener);
window.requestAnimationFrame(loop); //draw first frame
