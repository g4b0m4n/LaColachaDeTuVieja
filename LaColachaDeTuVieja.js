var ctx = document.querySelector("canvas").getContext("2d");
var score = 0;
var segments = [];
var random;
//ctx.canvas.width, ctx.canvas.height = 400;

class Head {

    constructor() {
        this.x = ctx.canvas.width/2;
        this.y = ctx.canvas.height/2;
        this.w = 10;
        this.h = 20;
        this.drx = 0;
        this.dry = 0;
        this.speed = 1;
    }
    
    colision(obj){
        if (obj.w > this.x && obj.h > this.y ||
        obj.x < this.w && obj.y < this.h) return true;
    }
}
var head = new Head();
//segments[0]=head;

class Segment {

    constructor(last) {
        this.x = last.x+last.w+5;
        this.y = last.y+last.h+5;
        this.w = last.w;
        this.h = last.h;
        this.speed = 1;
    }
}

class Mice {
    
    constructor(x, y) {
        this.x = 1+Math.random()*200;
        this.y = 1+Math.random()*200;
        this.w = 10;
        this.h = 10;
        this.dr= 1;
        this.speed = 3;
        console.log("cuick");
    }
}
var mice = new Mice();

var wallCol = function(obj){
    if(obj.w > ctx.canvas.width-obj.x
    || obj.h > ctx.canvas.height-obj.y){
        return true;
    }
    else if (obj.x < 1 || obj.y < 1){
        return true;
    }
    else return false;
}

var touchArea = function(cx, cy, x, y, w, h, dr, ev){
    if (cx > x && cx < w && cy > y && cy < h){
        dr = ev;
    }
}

controller = {

    left: false,
    right: false,
    up: false,
    down: false, 
    
    touchListener: function(event) {
        //event.preventDefault();
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
        event.preventDefault();
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
   
   random = Math.floor(Math.random()*101) ;
   console.log(random);
   if (random%2==0) {
       mice.x+=mice.speed;
       mice.y+=0;
  } else {
       mice.x+=0;
       mice.y+=mice.speed;
  }
   console.log(mice.x+"\n"+mice.y+"\n"+mice.dr+"\n"+mice.speed);
   if (wallCol(mice)) mice.speed*=-mice.dr;
   
   ctx.fillRect(head.x, head.y, head.w, head.h);

   head.x+=head.drx;
   head.y+=head.dry;
   
   ctx.fillRect(mice.x, mice.y, mice.w, mice.h);
   
   if (controller.up){
       head.drx=0;
       head.dry=-1;
       head.w=10;
       head.h=20;
   }else if (controller.down){
       head.drx=0;
       head.dry=1;
       head.w=10;
       head.h=20;
   }else if (controller.left) {
       head.drx=-1;
       head.dry=0;
       head.w=20;
       head.h=10;
   }else if (controller.right){
       head.drx=1;
       head.dry=0;
       head.w=20;
       head.h=10;
   }
   
    if (head.colision(mice)) {
        score++;
        mice = null;
        mice = new Mice();
        
    }
    if(wallCol(head)) head=null;
    
    while (i < score){
       i++;
       segments[i]= new Segment(segments[i-1]);
       ctx.fillRect(segments[i].x, segments[i].y,
       segments[i].w, segments[i].h);
       
        if (head.colision(segments[i])){
            segments.splice(i,1);
        }
   }
    window.requestAnimationFrame(loop); //update frame
}
window.addEventListener("touchstart", controller.touchListener);
window.addEventListener("touchend", controller.touchListener);
window.addEventListener("touchmove", controller.touchListener);
window.addEventListener("touchcancel", controller.touchListener);
window.addEventListener("keydown", controller.keyListener);
window.addEventListener("keyup", controller.keyListener);
window.requestAnimationFrame(loop); //draw first frame
