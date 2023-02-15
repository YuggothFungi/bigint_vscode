const BASE                    = 10;
const DIGITS_IN_NUMBER        = ((BASE-1)+'').length;
const DIGITS_ARRAY_MAXLEN     = 13;
const DIGITS_ARRAY            = new Array(DIGITS_ARRAY_MAXLEN).fill(0);


class TBuffer{
    
    constructor(...x){
        this.valData=x.reduce((p,c)=>p+c,0);
        this.base=BASE;
        return this;
    }
    
    shiftRank(){this.valData=Math.floor(this.valData/this.base)}
    remainder(){
        var r=this.valData%this.base
        this.shiftRank();
        return r;
    }
    isZero(){return this.valData===0};
    notEmpty(){return !this.isZero()};

    pushSum(...x){
        this.valData+=x.reduce((p,c)=>p+c,0)
        return this.valData}
    
    pushProd(...x){
        this.valData+=x.reduce((p,c)=>p*c,1)
        return this.valData}

    writeNumberInBaseArray(rev){
        var numberAsArray=[];
        while(this.valData!==0){
            numberAsArray.push(this.remainder());
        }
        if(rev!==0){return numberAsArray}
        else {return numberAsArray.reverse();}        
    }
    
}

class TLNum{

    constructor(S){
        S = S || {};
        this._digits = S['digits'] || DIGITS_ARRAY;
        this.maxlen  = S['digits'] ? S['digits'].length : DIGITS_ARRAY_MAXLEN;
        this.negative= S['n'] || false;
        this.layout  = S['layout'] || null;
        this.ref     = 0;
        this._current= 0;
        this.lsd_num = 0;
        this.refreshLsd();
        return this;
    };

    current(v){
        if (v===undefined){return this._digits[this._current]}
        else {
            this._digits[this._current]=v;
            return this;
        }
    };

    first() {
        this._current=0; return this.current();   
    };

    next() {
        this._current++; return this.current();
    };

    refreshLsd(){
        for (let i=0; i<this._digits.length; i++){
            if(this._digits[i]!==0) this.lsd_num=i;
        }
    };
    
    digits(d){
        if(d==undefined){return (this._digits)}
        this._digits.fill(d);
        return this;
    };

    lsd(n){
        if(n!=undefined){this.lsd_num=n; return this}
        else {return this._digits[this.lsd_num]}
    };
    
    str(base=10){
        /*let i = this._digits.length-1
        let isLsd = this._digits.map(x=> x!=0)
        while (!isLsd[i]){i--}
        this.lsd_num=i*/
        let decimal = this._digits.slice(0,this.lsd_num+1)
        let dcm = decimal.reverse().map(val=>String(val).padStart(DIGITS_IN_NUMBER,"0"))
        let dstring=dcm.join("")
        return dstring.replace(/^0+/,"")
    };

    reachedLsd(){
        return this._current===this.lsd_num;
    };

    setRand(){
        return this
    };

    add(numtl){
        let buf = new TBuffer(this.first(), numtl.first());
        while(buf.notEmpty() && !this.reachedLsd()){
            this.current(buf.remainder());
            this.next();
            numtl.next();
            this.current(buf.pushSum(this.current(),numtl.current()));
            this.refreshLsd();
        }
    };
    
}


/*
let a = new TLNum({'digits':[7,5,0,9,1,0,0,0,0]})
let b = new TLNum({'digits':[1,8,3,4,0,0,0,0]})
*/