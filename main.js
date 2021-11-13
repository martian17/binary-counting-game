let body = new ELEM(document.body);
body.add("h2",0,"Binary Counting Game","margin:0px;");
body.add("span",0,"Click Buttons or Use Keyboard.<br>A: 0 D: 1 W: RESET","font-size:0.8em;");
let wr = body.add("div","class:wrapper");
let sc = wr.add("div","class:score");
let h1 = sc.add("h1",0,"SCORE: 0");
let sp = sc.add("p",0,"OFFSET: 0");
let b0 = wr.add("div","class:left","0");
let b1 = wr.add("div","class:right","1");
let br = wr.add("div","class:bottom","RESET");


let score = 0;
let cnt = 0;
let offset = 0;
let cntstr = cnt.toString(2);
let over = false;

let updateScore = function(){
    h1.e.innerHTML = `SCORE: ${cnt}`;
    sp.e.innerHTML = `OFFSET: ${offset}`;
};

let handleInput = function(n){
    if(n === "0"){
        b0.e.classList.add("pressed");
        setTimeout(()=>b0.e.classList.remove("pressed"),100);
    }else if(n === "1"){
        b1.e.classList.add("pressed");
        setTimeout(()=>b1.e.classList.remove("pressed"),100);
    }else if(n === "r"){
        if(wr.e.classList.contains("over")){
            wr.e.classList.remove("over");
        }else{
            b0.e.classList.add("pressed");
            setTimeout(()=>b0.e.classList.remove("pressed"),100);
            b1.e.classList.add("pressed");
            setTimeout(()=>b1.e.classList.remove("pressed"),100);
            br.e.classList.add("pressed");
            setTimeout(()=>br.e.classList.remove("pressed"),100);
        }
        score = 0;
        cnt = 0;
        offset = 0;
        cntstr = cnt.toString(2);
        updateScore();
        over = false;
        return;
    }
    if(n === cntstr[offset]){
        offset++;
        score++;
        if(offset === cntstr.length){
            offset = 0;
            cnt++;
            cntstr = cnt.toString(2);
        }
    }else{
        //game over
        wr.e.classList.add("over");
        over = true;
    }
    updateScore();
};

b0.on("click",function(){
    if(!over)handleInput("0");
});

b1.on("click",function(){
    if(!over)handleInput("1");
});

br.on("click",function(){
    handleInput("r");
});

window.addEventListener("keydown",(e)=>{
    //console.log(e);
    if(e.key === "a"){
        if(!over)handleInput("0");
    }else if(e.key === "d"){
        if(!over)handleInput("1");
    }else if(e.key === "w"){
        handleInput("r");
    }
});


