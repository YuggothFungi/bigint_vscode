const BASE = 10;
const DIGITS_IN_NUMBER = ((BASE - 1) + '').length;
const DIGITS_ARRAY_MAXLEN = 13;
const DIGITS_ARRAY = new Array(DIGITS_ARRAY_MAXLEN).fill(0);

// вспомогательный класс, в котором производятся арифметические операции над числами 
// запоминается остаток от операции по основанию BASE и "перенос" в следующий разряд
class TBuffer {

    // возвращает по умолчанию сумму всех переданных в буфер чисел
    constructor(...x) {
        this.valData = x.reduce((p, c) => p + c, 0);
        this.base = BASE;
        return this;
    }

    // свдиг разряда, какой "перенос" в следущий разряд
    shiftRank() { this.valData = Math.floor(this.valData / this.base) }

    // возвращает остаток по основанию BASE
    remainder() {
        var r = this.valData % this.base
        this.shiftRank();
        return r;
    }

    // возвращает true если значение в буфере пустое
    isZero() { return this.valData === 0 };
    // возвращает true если значение в буфере непустое
    notEmpty() { return !this.isZero() };

    // возвращает сумму переданных чисел
    pushSum(...x) {
        this.valData += x.reduce((p, c) => p + c, 0)
        return this.valData
    }

    // возвращает произведение переданных чисел
    pushProd(...x) {
        this.valData += x.reduce((p, c) => p * c, 1)
        return this.valData
    }

    // вспомогательное для проверок, отображает число из буфера в формате массива чисел по основанию BASE
    writeNumberInBaseArray(rev) {
        var numberAsArray = [];
        while (this.valData !== 0) {
            numberAsArray.push(this.remainder());
        }
        if (rev !== 0) { return numberAsArray }
        else { return numberAsArray.reverse(); }
    }

}

// основной класс, в котором мы описываем поля и методы работы с длинным целым числом
class TLNum {

    // пример минимальной конструкции a = new TLNum({'digits':[2,1,2,3,4,0,0,0]})
    // создаем массив для числа 43212 по основанию 10.
    constructor(S) {
        S = S || {};
        this._digits = S['digits'] || DIGITS_ARRAY;
        this.maxlen = S['digits'] ? S['digits'].length : DIGITS_ARRAY_MAXLEN;
        this.negative = S['n'] || false;
        this.layout = S['layout'] || null;
        this.ref = 0;
        this._current = 0;
        this.lsd_num = 0;
        this.refreshLsd();
        return this;
    };

    // если параметр передаётся, то присваивает его значение полю _current и возвращает
    // если вызыв без параметра, то возвращает значение, которое хранится в массиве digits под индексом _current
    current(v) {
        if (v !== undefined) { this._digits[this._current] = v; return this }
        else { return this._digits[this._current] }
    };

    // устанавливает указатель на начало (0 индекс) и возвращает значение
    first() {
        this._current = 0; return this.current();
    };

    // сдвигает указатель вправо на 1 и возвращает значение
    next() {
        this._current++; return this.current();
    };

    // сдвигает указатель влево на 1 и возвращает значение
    prev() {
        this._current--; return this.current();
    };

    // устанавливает значение в поле lsd_num, номер индекса в массиве digits, который указывает на последний значащий разряд
    refreshLsd() {
        for (let i = 0; i < this._digits.length; i++) {
            if (this._digits[i] !== 0) this.lsd_num = i;
        }
    };

    // если параметр передаётся, то присваивает его значение полю lsd_num и возвращает
    // если вызыв без параметра, то возвращает значение, которое хранится в массиве digits под индексом lsd_num
    digits(d) {
        if (d == undefined) { return (this._digits) }
        this._digits.fill(d);
        return this;
    };

    // если параметр передаётся, то присваивает его значение полю lsd_num и возвращает
    // если вызыв без параметра, то возвращает значение, которое хранится в массиве digits под индексом lsd_num
    lsd(n) {
        if (n != undefined) { this.lsd_num = n; return this }
        else { return this._digits[this.lsd_num] }
    };

    // строковое представление числа, для числа короче, чем основание системы счисления-1, незначащие символы добиваются нулями
    // например, в основании 100, число 6 будет представлено строкой "06"
    str(base = 10) {
        let decimal = this._digits.slice(0, this.lsd_num + 1);
        let dcm = decimal.reverse().map(val => String(val).padStart(DIGITS_IN_NUMBER, "0"));
        let dstring = dcm.join("");
        return dstring.replace(/^0+/, "");
    };

    // возвращает true если указатель смотрит на последний значащий разряд 
    reachedLsd() {
        return this._current === this.lsd_num;
    };

    // тут надо сделать случайное длинное целое
    setRand() {
        return this
    };
    
    // должно было получиться круто, но пока не получилось
    // addProperNotWorkingYet(numtl) {
    //     let buf = new TBuffer(this.first(), numtl.first());
    //     while (!this.reachedLsd() && buf.notEmpty()) {
    //         buf.pushSum(this.next(), numtl.next());
    //         console.log(buf.writeNumberInBaseArray(buf));
    //     }
    //     this.prev();
    //     this.lsd(this.lsd() > this._current ? this.lsd() : this._current);
    //     this.first();
    //     numtl.first();
    //     return this;
    // };

    // обновляем значение текущего числа, прибавляя к нему numtl
    add(numtl) {
        // используем буфер для сложения
        let buf = new TBuffer(this.first(), numtl.first());
        
        // складываем в буфере, переходим от младшего разряда к старшему, 
        // пока буфер не будет пуст и указатель не смотрит на последний значащий разряд
        while (buf.notEmpty() && (!this.reachedLsd() || !numtl.reachedLsd())) {
            this.current(buf.remainder());
            this.next();
            numtl.next();
            this.current(buf.pushSum(this.current(), numtl.current()));
            this.refreshLsd();
        }
    };

    // возвращаем 1, если число больше numtl; -1, если число меньше; 0 если числа равны.
    compare(numtl) {
        // ставим указатель на позицию последнего значащего разряда
        this._current = this.lsd_num;
        numtl._current = numtl.lsd_num;

        // обрабатываем ситуации, когда числа разной длины
        if (this._current > numtl._current) return 1;
        else if (this._current < numtl._current) return -1;
        else {
            // обрабатываем ситуацию, когда числа одной длины
            while (this._current === numtl._current && this._current !== 0) {
                if (this.current() > numtl.current()) return 1;
                else if (this.current() < numtl.current()) return -1;
                else {
                    this.prev();
                    numtl.prev();
                };
            };
            if (this.current() > numtl.current()) return 1;
            else if (this.current() < numtl.current()) return -1;
            else return 0;
        };
    };
}