let body = new ELEM(document.body);
body.add("h2",0,"Binary Counting Game","margin:0px;");
let instE = body.add("span",0,"Click Buttons or Use Keyboard.<br>A:0 D:1 W:RESET DEL:UNDO","font-size:0.8em;").e;
let updateInstruction = function(){
    let inner = "Click Buttons or Use Keyboard<br>";
    for(let i = 0; i < base; i++){
        let letter = keyMapArray[i];
        inner += letter.toUpperCase()+":"+i+" ";
    }
    if(base < 32){
        inner += "W:RESET ";
    }else{
        inner += "-:RESET ";
    }
    inner += "DEL:UNDO";
    instE.innerHTML = inner;
};
let optionfield = body.add("div","class:option-field");
optionfield.add("h2",0,"OPTIONS");
let oc = optionfield.add("table","class:option-contents");


let base = 2;
let r1 = oc.add("tr");
r1.add("th",0,"BASE: ");
let baseE = r1.add("th").add("input","type:text;value:2;");
baseE.on("input",function(e){
    let val = this.value.trim();
    if(parseInt(val)+"" === val && 2 <= parseInt(val)){
        base = parseInt(val);
        generateNumpad(base);
        if(base <= 3){
            registerKeyMapping("ads".split(""));
        }else{
            registerKeyMapping("0123456789abcdefghijklmnopqrstuvwxyz".split(""));
        }
        updateInstruction();
    }
    handleReset(true);
});


let keyMapping = {};
let keyMapArray = [];
let registerKeyMapping = function(arr){
    keyMapping = {};
    for(let i = 0; i < arr.length; i++){
        keyMapping[arr[i]] = i;
    }
    keyMapArray = arr;
};
registerKeyMapping(["a","d","s"]);
let numColor = "#888#fff93a#ff703a#3af6ff#3a77ff#ff3a3a#b33aff#ffcb3a#3aff5b#3affb6#463aff#3af6ff#ff0000#4634dc#34dc8e#ff2121#5721ff#a0ff21".split(/\s*\#\s*/).slice(1).map(c=>"#"+c);


let r2 = oc.add("tr");
r2.add("th",0,"DIFFICULTY: ");
let difficultyE = r2.add("th").add("select");
difficultyE.add("option",0,"EASY");
difficultyE.add("option",0,"HARD");
let difficulty = "EASY";
difficultyE.on("change",function(){
    difficulty = this.options[this.selectedIndex].innerHTML;
    slot.e.style.display = difficulty === "EASY" ? "inline-block" : "none";
});


let wr = body.add("div","class:wrapper");
let sc = wr.add("div","class:score");
let h1 = sc.add("h1",0,"SCORE: 0");
let sp = sc.add("p",0,"OFFSET: 0");
let slot = wr.add("div","class:slot");
let updateSlot = function(){
    slot.e.innerHTML = "";
    let cnt0 = cnt;
    let offset0 = offset;
    let cntstr0 = cnt0.toString(base);
    if(offset0 === 0){
        cnt0--;
        cntstr0 = cnt0.toString(base);
        offset0 = cntstr0.length;
    }
    if(cnt0 === -1){
        slot.add("div").add("div").add("div");
        return;
    }
    for(let i = 0; i < cntstr0.length; i++){
        let c = slot.add("div").add("div").add("div").e;
        if(i < offset0){
            c.innerHTML = cntstr0[i];
            c.parentNode.style.backgroundColor = numColor[parseInt(cntstr0[i],36)%numColor.length];
        }
    }
};
/*
let lives = 3;
let livesE = wr.add("div","class:lives");
let updateLives = function(){
    
    let cnt0 = cnt;
    let offset0 = offset;
    let cntstr0 = cnt0.toString(base);
    if(offset0 === 0){
        cnt0--;
        cntstr0 = cnt0.toString(base);
        offset0 = cntstr0.length;
    }
    if(cnt0 === -1){
        slot.add("div").add("div").add("div");
        return;
    }
    for(let i = 0; i < cntstr0.length; i++){
        let c = slot.add("div").add("div").add("div").e;
        if(i < offset0){
            c.innerHTML = cntstr0[i];
            c.parentNode.style.backgroundColor = numColor[parseInt(cntstr0[i],36)%numColor.length];
        }
    }
};*/



let numpad = wr.add("div","class:numpad");
let numpadElems = [];
let generateNumpad = function(n){
    numpad.e.innerHTML = "";
    numpadElems = [];
    let w = Math.round(Math.sqrt(n+1));
    let wr = Math.floor(100/w*100)/100;
    console.log(w,wr);
    let style = `width:calc(${wr}% - ${10*(w-1)/w}px);font-size:${wr/15}em;margin:5px;`;
    for(let j = 0; j < n; j++){
        let i = n === 10?(j<3?j+7:j<6?j+1:j<9?j-5:0):j;
        console.log(j%w);
        let btn = numpad.add("div",0,0,style+(j+1===n?"margin-right:0px;":"")+(j%w===0?"margin-left:0px;":(j+1)%w===0?"margin-right:0px;":""));
        btn.add("div",0,i.toString(36));
        btn.on("click",function(){
            if(!over)handleInput(i);
        });
        numpadElems[i] = btn.e;
    }
    updateSlot();
};
let br = wr.add("div","class:bottom","RESET");
br.on("click",function(){
    handleReset();
});
let handleReset = function(silent){
    if(!silent){
        if(wr.e.classList.contains("over")){
            wr.e.classList.remove("over");
        }else{
            numpadElems.map(e=>{
                e.classList.add("pressed");
                setTimeout(()=>e.classList.remove("pressed"),100);
            });
            br.e.classList.add("pressed");
            setTimeout(()=>br.e.classList.remove("pressed"),100);
        }
    }
    wr.e.classList.remove("over");
    score = 0;
    cnt = 0;
    offset = 0;
    cntstr = cnt.toString(base);
    updateScore();
    updateSlot();
    over = false;
};
let ud = wr.add("div","class:undo","UNDO");
ud.on("click",function(){
    handleUndo();
});
let handleUndo = function(silent){
    if(wr.e.classList.contains("over")){
        wr.e.classList.remove("over");
        updateScore();
        updateSlot();
        over = false;
    }else{
        ud.e.classList.add("pressed");
        setTimeout(()=>ud.e.classList.remove("pressed"),100);
        offset--;
        if(offset < 0){
            cnt--;
            cntstr = cnt.toString(base);
            if(cnt === -1){
                cnt = 0;
                offset = 0;
                cntstr = cnt.toString(base);
            }else{
                offset = cntstr.length-1;
            }
        }
        updateScore();
        updateSlot();
    }
};

let score = 0;
let cnt = 0;
let offset = 0;
let cntstr = cnt.toString(base);
let over = false;
generateNumpad(base);

let updateScore = function(){
    h1.e.innerHTML = `SCORE: ${cnt}`;
    sp.e.innerHTML = `OFFSET: ${offset}`;
};

let handleInput = function(n){
    numpadElems[n].classList.add("pressed");
    setTimeout(()=>numpadElems[n].classList.remove("pressed"),100);
    if(n.toString(36) === cntstr[offset]){
        offset++;
        score++;
        if(offset === 1)updateSlot();
        if(offset === cntstr.length){
            offset = 0;
            cnt++;
            cntstr = cnt.toString(base);
        }
        updateSlot();
    }else{
        //game over
        wr.e.classList.add("over");
        over = true;
    }
    updateScore();
};


window.addEventListener("keydown",(e)=>{
    if(e.target.nodeName === "INPUT")return;
    //console.log(e);
    let key = e.key;
    if(key in keyMapping && keyMapping[key] < base && !over){
        handleInput(keyMapping[key]);
    }else if(key === "w"){
        handleReset();
    }else if(key === "-"){
        handleReset();
    }
    if(key === "Backspace"){
        handleUndo();
    }
});


