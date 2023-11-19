/* 

    #############################################################
      
          @@@@@@@@@@    &&&&&&&&&&&&&&&&&&&    %%%%%%%%%%

(   By ~Aryan Maurya Mr.perfect https://amsrportfolio.netlify.app  )

          @@@@@@@@@@    &&&&&&&&&&&&&&&&&&&    %%%%%%%%%%

    #############################################################

*/

let speedZ = 0.1
let c, ctx, W, H;
let camera;
let lines = [], trees = [], coins = [], booms = []
const MAX_ADD = 250
const MIN_W = 300
let MIDDLE 
let treeImg, boatImg, diamondImg, goldImg 
let life = 100
let time = 0
let joystick
let touchs
let score = 0
let play = true
let colorLife = ['#229215', '#000']
let decr = false

const random = (max=1, min=0) => Math.random() * (max - min) + min;

const again = () => {
    clear()
    lines = [] 
    trees = [] 
    coins = [] 
    booms = []
    life = 100
    time = 0
    score = 0
    joystick = new Joystick(W-60,H-150, 50)
    player = new Boat(W/2-30,H-100, 30)
    a0 = a1 = 0
    createLines();
    createTrees()
    createCoins()
    play = true
    decr = false
    end.style.display = 'none'
}

const coll = (x0, y0, r0, x1, y1, r1) => {
    if(Math.hypot(x0-x1, y0-y1)<r0+r1){
        return true
    }
} 

const colorRiviera = (x0, y0, x1, y1) => {
    let NG = ctx.createLinearGradient(x0, y0, x1, y1)
        NG.addColorStop(0, '#0093D5')
        NG.addColorStop(0.1, '#0670F3')
        NG.addColorStop(0.3, "#0044A9")
        NG.addColorStop(0.6, "#0044A9")
        NG.addColorStop(0.9, '#0670F3')
        NG.addColorStop(1, '#0093D5')
    return NG;
}
const clear = () => {
    ctx.fillStyle = 'rgba(0, 0, 0, 1)';
    ctx.fillRect(0, 0, W, H);
};

let a0 = a1 = 0
const createLines = () => {
    for(let z=0; z<15; z+=0.1){
        lines.push(new Line( z, a0, a1))
        a1+=0.1    
    }
    for(let z=15; z<100; z+=0.1){
        lines.push(new Line( z, a0, a1))    
        a0+=0.01
        a1+=0.1
    }
}

const sky = () => {
    let NG = ctx.createLinearGradient(0, 0, 0, H/2.7);
    NG.addColorStop(0, "#63D3FF");
    NG.addColorStop(0.2, "#63D3FF");
    NG.addColorStop(0.9, "#FC9C00");
    NG.addColorStop(1, "#C26F00");
    ctx.beginPath() 
    ctx.fillStyle = NG
    ctx.rect(0,0,W,H/2.5)      
    ctx.fill()    
}

const ground = () => {
    let NG = ctx.createLinearGradient(0, 0, 0, H);
    NG.addColorStop(0, "#004B11");
    NG.addColorStop(0.4, "#004B11");
    NG.addColorStop(1, "#00A425");
    ctx.beginPath() 
    ctx.fillStyle = NG
    ctx.rect(0,0,W,H)      
    ctx.fill()
}

const sun = () => {    
    ctx.beginPath() 
    ctx.fillStyle = 'rgba(255,255,0,.6)'
    ctx.arc(W/2, H/2.8, 15, 2.8, 2.1 * Math.PI);
    ctx.fill();

}

const darwLife = () => {    
    ctx.beginPath() 
    ctx.strokeStyle = '#000'
    ctx.lineWidth = 2
    ctx.fillStyle = '#CA0F02'
    ctx.rect(W/2-50, 10, 100, 12);
    ctx.stroke();
    ctx.fill();
    ctx.beginPath() 
    
    ctx.fillStyle = !decr ?  colorLife[0] : colorLife[~~random(2)]
    ctx.rect(W/2-50, 10, life, 12);
    ctx.fill();

}

const drawTime = () => {    
    let min = ~~(time/60)
    let secs = time%60
    if(secs<10)secs = '0' + secs.toString()
    ctx.beginPath() 
    ctx.fillStyle = 'black'
    ctx.font = "15px Arial Bold";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(min + ':' + secs, W-20, 15);
}

const drawScore = () => {    
    ctx.beginPath() 
    ctx.fillStyle = 'black'
    ctx.font = "17px Arial Bold";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("💰 " +score, 30, 15);
}

const updateTree = () => {
    for(let i=trees.length-1;  i>=0; i--){
        trees[i].update()
        if(trees[i].z<-1){            
            cpt++
            trees.splice(i, 1)        
            if(cpt%2==0){
                trees.push(new Tree(lines[lines.length-1].x1 - random(W,W/2), lines[lines.length-1].y, lines[lines.length-1].z, treeImg))
            }    
            else {
                trees.push(new Tree(lines[lines.length-1].x0 + random(W,W/2), lines[lines.length-1].y, lines[lines.length-1].z, treeImg))
            }            
        }
    }    
}

const updateLines = ()=> {    
    let check = false
    let n = 0
    for(let i=0;  i<lines.length; i++){
        lines[i].update();
        if(coll(lines[i].bx0, lines[i].by0, 1, player.x+player.width/2, player.y+player.width/2, player.width/4) ){
            check = true
        }
        if(coll(lines[i].bx1, lines[i].by1, 1, player.x+player.width/2, player.y+player.width/2, player.width/4) ){
            check = true
        }
        let ax = lines[i].bx0 + (lines[i].bx1 - lines[i].bx0)/2
        let ar = (lines[i].bx1, lines[i].by0)/2
        if(coll(ax, lines[i].by0, ar/3, player.x+player.width/2, player.y+player.width/2, player.width/2) ){
            n++
        }
        
        if(lines[i].z<-1){
            lines[i].z = lines[lines.length-1].z+0.1
            lines[i].a0 = lines[lines.length-1].a0+0.02
            lines[i].a1 = lines[lines.length-1].a1+0.1
            lines.push(lines[i])
            lines.splice(i, 1)        
        }
    }
    if(check || n==0){
        if(life>0)life-=0.4
        else{
            play = false
            end.style.display = 'flex'
        } 
        decr = true    
    }
    else decr = false    
} 

const updateCoins = ()=> {    
    for(let i=coins.length-1;  i>=0 ; i--){
        coins[i].update()
        if(coll(coins[i].bx, coins[i].by, 250/coins[i].dz/2, player.x+player.width/2, player.y+player.width/2, player.width/2) ){
            score++ 
            for(let n=0;n<40;n++)booms.push(new Boom(coins[i].bx, coins[i].by))
            let imgs = [goldImg, diamondImg]
            coins.push(new Coin(lines[lines.length-1].x1 + random(lines[lines.length-1].x0-lines[lines.length-1].x1-50), lines[lines.length-1].y, lines[lines.length-1].z, imgs[~~random(2)]))
            coins.splice(i, 1)
        }
        else if(coins[i].z<-1){
            let imgs = [goldImg, diamondImg]
            coins.push(new Coin(lines[lines.length-1].x1 + random(lines[lines.length-1].x0-lines[lines.length-1].x1-50), lines[lines.length-1].y, lines[lines.length-1].z, imgs[~~random(2)]))
            coins.splice(i, 1)        
        }
    }    
} 
const updateBooms = ()=> {    
    for(let i=booms.length-1;  i>=0 ; i--){
        booms[i].update()        
        if(booms[i].r<0.5){
            booms.splice(i, 1)        
        }
    }    
} 
class Dot{
    constructor(x,y,z){
        this.x = x;
        this.y = y;
        this.z = z;
    }
}


class Tree extends Dot{
    constructor(x, y ,z, img) {        
        super(x,y,z)
        this.img = img;
    }    
    draw() {
        ctx.beginPath()   
        ctx.drawImage(this.img, this.bx-1000/this.dz/2, this.by-1000/this.dz, 1000/this.dz, 1000/this.dz);
    }
    update() {
        this.dx = this.x - camera.x
        this.dy = this.y- camera.y 
        this.dz = this.z - camera.z 
        this.bx = -3*(this.dx/this.dz)+W/2
        this.by = -3*(this.dy/this.dz)+H/2.7
        this.z-=speedZ
        this.draw()
    }
}

class Boom extends Dot{
    constructor(x, y) {        
        super(x,y)
        this.r = 2
        this.a = random(Math.PI*2);
        this.rad = random(4,2)
    }    
    draw() {
        ctx.beginPath() 
        ctx.fillStyle = 'gold'
        ctx.arc(this.x, this.y, this.r, 0, 2*Math.PI)
        ctx.fill()
    }
    update() {
        this.r-=0.1
        this.x += this.rad*Math.cos(this.a)
        this.y += this.rad*Math.sin(this.a)
        this.draw()
    }
}

class Boat extends Dot{
    constructor(x, y, z) {        
        super(x,y,z)
        this.width = this.z
        this.a = 0
    }    
    draw() {
        ctx.beginPath()   
        ctx.drawImage(boatImg, this.x, this.y, this.width, this.width);
    }
    update() {
        this.width += 0.3*Math.sin(this.a)
        this.x += (joystick.x1-joystick.x0)*0.001*this.width
        this.y += (joystick.y1-joystick.y0)*0.0005*this.width
        if(this.y>H-this.width-20)this.y = H-this.width-20
        if(this.y<H/2.5+20)this.y = H/2.5+20

        if(this.x<10)this.x = 10
        if(this.x>W-10-this.width)this.x = W-10-this.width

        this.a+=0.02
        this.draw()
    }
}

class Joystick extends Dot{
    constructor(x, y, w) {        
        super(x,y)
        this.x0 =  this.x 
        this.y0 =  this.y
        this.x1 = this.x0
        this.y1 = this.y0
        this.width = w
    }    
    draw() {
        ctx.beginPath()  
        ctx.strokeStyle = 'black' 
        ctx.lineWidth = 0.5
        ctx.fillStyle = 'rgba(255,255,255,.2)'
        ctx.arc(this.x0, this.y0, this.width, 0, 2*Math.PI);
        ctx.stroke()
        ctx.fill()

        ctx.beginPath()  
        ctx.fillStyle = '#3A3A3A'
        ctx.arc(this.x0, this.y0, this.width/12, 0, 2*Math.PI);
        ctx.fill()
        
        ctx.beginPath()  
        ctx.lineWidth = this.width/6
        ctx.strokeStyle = '#3A3A3A'
        ctx.moveTo(this.x0, this.y0);
        ctx.lineTo(this.x1, this.y1);
        ctx.stroke()

        ctx.beginPath()  
        ctx.strokeStyle = 'black' 
        ctx.lineWidth = 0.5
        let NG = ctx.createRadialGradient(this.x1, this.y1, 11, this.x1, this.y1+15, this.width/1.5)
        NG.addColorStop(0, '#191919')
        NG.addColorStop(0.9, 'white')
        NG.addColorStop(1, 'white')
        ctx.fillStyle = NG
        ctx.arc(this.x1, this.y1, this.width/3, 0, 2*Math.PI);
        ctx.fill()
        ctx.stroke()        
    }
    update() {
        this.x0 = touchs.x || this.x 
        this.y0 = touchs.y || this.y
        this.x1 = touchs.xMove  || this.x0
        this.y1 = touchs.yMove || this.y0
        this.a = Math.atan2((this.y1-this.y0),(this.x1-this.x0));
        if(Math.hypot(this.x0-this.x1,this.y0-this.y1) > this.width/2){
            this.x1=Math.cos(this.a)*this.width+this.x0;
            this.y1=Math.sin(this.a)*this.width+this.y0;
        }
        this.draw()
    }
}

class Coin extends Dot{
    constructor(x, y, z, img) {        
        super(x,y,z)
        this.img = img
    }    
    draw() {
        ctx.beginPath()   
        ctx.drawImage(this.img, this.bx-250/this.dz/2, this.by-250/this.dz, 250/this.dz, 250/this.dz);
    }
    update() {
        this.dx = this.x - camera.x
        this.dy = this.y- camera.y 
        this.dz = this.z - camera.z 
        this.bx = -3*(this.dx/this.dz)+W/2
        this.by = -3*(this.dy/this.dz)+H/2.7
        this.z-=speedZ
        this.draw()
    }
}

class Line{
    constructor(z, a0, a1) {        
        this.z = z;
        this.a0 = a0;
        this.a1 = a1;
        this.y = 0
    }    
    projectionX0() {
        let dx = this.x0 - camera.x
        let dy = this.y- camera.y 
        let dz = this.z - camera.z 
        this.bx0 = -3*(dx/dz)+W/2
        this.by0 = -3*(dy/dz)+H/2.7
    }
    projectionX1() {
        let dx = this.x1 - camera.x
        let dy = this.y - camera.y 
        this.dz = this.z - camera.z 
        this.bx1 = -3*(dx/this.dz)+W/2
        this.by1 = -3*(dy/this.dz)+H/2.7
    }
    draw() {
        ctx.beginPath()       
        ctx.strokeStyle = colorRiviera(this.bx0, this.by0, this.bx1, this.by1)
        ctx.lineWidth =  100/this.dz
        ctx.moveTo(this.bx0, this.by0)
        ctx.lineTo(this.bx1, this.by1)
        ctx.stroke()
        ctx.closePath()

        ctx.beginPath()   
        ctx.fillStyle = '#D2B48C'
        //ctx.ellipse(this.bx0, this.by0, 30/this.dz, 60/this.dz, -90, 0, 2 * Math.PI);
        //ctx.fill()
        ctx.closePath()

        ctx.beginPath()   
        ctx.fillStyle = '#D2B48C'
        //ctx.ellipse(this.bx1, this.by1, 30/this.dz, 60/this.dz, 90, 0, 2 * Math.PI);
        //ctx.fill()
        ctx.closePath()
    }
    update(){    
        this.z-=speedZ
        this.x0 = MIDDLE+100*Math.sin(this.a0) + MIN_W + MAX_ADD * Math.cos(this.a0)+40*Math.sin(this.a1);
        this.x1 = MIDDLE+100*Math.sin(this.a0) - MIN_W - MAX_ADD * Math.cos(this.a0+1.5)+40*Math.sin(this.a1);
        this.projectionX0()    
        this.projectionX1()    
        this.draw();
    }
}

const createTrees = () => {
    for(let i =0; i<lines.length;i += 100){
        lines[i].update()
        trees.push(new Tree(lines[i].x1 - random(W,W/2), lines[i].y, lines[i].z, treeImg))
        trees.push(new Tree(lines[i].x0 + random(W,W/2), lines[i].y, lines[i].z, treeImg))
    }
}

const createCoins = () => {
    for(let i =0; i<lines.length;i += ~~random(100,50)){
        lines[i].update()
        let imgs = [goldImg, diamondImg]
        coins.push(new Coin(lines[i].x0 - random(lines[i].x0-lines[i].x1-50), lines[i].y, lines[i].z, imgs[~~random(2)]))
    }
}

const events = () => {
    touchs = {
        x: null,
        y: null,
        xMove : null,
        yMove : null
    };
    c.addEventListener("touchstart", function(event){
        let touch = event.changedTouches[0];
        let touchX = parseInt(touch.clientX);
        let touchY = parseInt(touch.clientY);
        touchs.x = touchX-c.offsetLeft;
        touchs.y = touchY-c.offsetTop;
    });
    c.addEventListener("touchmove", function(event){
            let touch = event.changedTouches[0];
            let touchX = parseInt(touch.clientX);
            let touchY = parseInt(touch.clientY);
            touchs.xMove = touchX-c.offsetLeft;
            touchs.yMove = touchY-c.offsetTop;
    });
    c.addEventListener("touchend", function(event){
        touchs.xMove = null;
        touchs.yMove = null;
    });
}
const init = () => {
    c = document.getElementById("canvas");
    c.width = W = innerWidth <500?innerWidth:500;
    c.height = H = innerHeight 
    ctx = c.getContext("2d")
    camera = {x:W, y:H, z:-5};
    MIDDLE = W
    treeImg = new Image();
    treeImg.src = 'https://i.ibb.co/k8cggBh/palm-tree.png'
    boatImg = new Image()
    boatImg.src = "https://i.ibb.co/rMzw6cH/boat.png"
    diamondImg = new Image()
    diamondImg.src = "https://i.ibb.co/J7gKFkT/diamond.png"
    goldImg = new Image()
    goldImg.src = "https://i.ibb.co/zS2Vns1/gold.png"
    joystick = new Joystick(W-70,H/1.5, 50)
    player = new Boat(W/2-30,H-100, 30)
    createLines();
    createTrees()
    createCoins()
    events()
    setInterval(()=>time++,1000)
    requestAnimationFrame(animate)

};

let cpt = 0
const animate = () => {
    if(play){
        clear()
        ground()
        updateLines()
        updateCoins()
        sky()
        sun()
        updateTree()
        player.update()
        darwLife()
        drawTime()
        joystick.update()
        drawScore()
        updateBooms()
    }    
    requestAnimationFrame(animate)
};

window.onload = init;


/* 

    #############################################################
      
          @@@@@@@@@@    &&&&&&&&&&&&&&&&&&&    %%%%%%%%%%

(   By ~Aryan Maurya Mr.perfect https://amsrportfolio.netlify.app  )

          @@@@@@@@@@    &&&&&&&&&&&&&&&&&&&    %%%%%%%%%%

    #############################################################

*/
