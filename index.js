'use strict';
const util = require('util');

const getRandomIntNumber = (min, max) => {
  return parseInt( Math.random() * (max - min) + min );
};

let matrixASCII = [];
let matrixASCII_2 = [];

let f = 10;
for (let i = 0; i < 256; i++) {
    
    if (    i == 36                 // $
        ||  i == 44                 // ,
        ||  (i >= 48 && i <= 57)    // 0 .. 9
    ) {
        continue;
    }
    
    let add    = String.fromCharCode(i);
    let found  = false;
    
    for (let j = 0; j < matrixASCII.length; j++) {
        if (matrixASCII[j][1] == add) {
            console.log('found:', add);
            found = true;
            break;
        }
    }
    
    if (found) {
        continue;
    }
    
    matrixASCII.push(['' + f, add, i]);
    f++;
}

for (let i = 0; i < 256 && f <= 300; i++) {
    
    if (   i == 36                 // $
        || i == 44                 // ,
        ||  (i >= 48 && i <= 57)    // 0 .. 9
    ) {
        continue;
    }
    
    let add    = String.fromCharCode(i) + String.fromCharCode(i);
    let found  = false;
    
    for (let j = 0; j < matrixASCII.length; j++) {
        if (matrixASCII[j][1] == add) {
            console.log('found:', add);
            found = true;
            break;
        }
    }
    
    if (found) {
        continue;
    }
    
    matrixASCII.push(['' + f, add, i]);
    f++;
}

matrixASCII.reverse();

for (let i = 59, j = 0; i < 256; i++, j++) {
    if (matrixASCII[j][1].length < 2) {
        break;
    }
    
    let add = String.fromCharCode(i) + String.fromCharCode(i);
    
    matrixASCII_2.push([matrixASCII[j][1] + ',', add, i]);
}

//------------------------------------------------------------------------------
function serializeList(list) {
    let result = '';
    
    for (let i = 0; i < list.length; i++) {
        let add = '' + list[i];
        
        for (let j = 0; j < matrixASCII.length; j++) {
            if (add.indexOf( matrixASCII[j][0] ) != -1) {
               add = add.replace(matrixASCII[j][0], matrixASCII[j][1]);
               break;
            } 
        }
        
        if (i > 0) {
            result += ',';
        }
        
        result += add;
    }
    
    for (let j = 0; j < matrixASCII_2.length; j++) {
        result = result.replaceAll(matrixASCII_2[j][0], matrixASCII_2[j][1]);
    }
    
    //console.log(list.join(','));
    //console.log(result);
    return result;
}

function deSerializeList(stringList) {
    let result = [];
    
    for (let j = 0; j < matrixASCII_2.length; j++) {
        stringList = stringList.replaceAll(matrixASCII_2[j][1], matrixASCII_2[j][0]);
    }
    
    let list = stringList.split(',');
    
    for (let i = 0; i < list.length; i++) {
        let add = '' + list[i];
        
        for (let j = 0; j < matrixASCII.length; j++) {
            if (add.indexOf( matrixASCII[j][1] ) != -1) {
               add = add.replace(matrixASCII[j][1], matrixASCII[j][0]);
               break;
            } 
        }
        
        result.push(parseInt(add));
    }
    
    //console.log(result);
    return result;
}

/*console.log(matrixASCII.length);
console.log(util.inspect(matrixASCII, { maxArrayLength: null, depth:null }));
console.log(util.inspect(matrixASCII_2, { maxArrayLength: null, depth:null }));*/

function test(count, min = 1, max = 300, debug = false, setList = null) {

    let COUNT_NUMBERS = count;
    let list = [];

    if (setList) {
        list = setList;
    }
    else {
        for (let i = 0; i < COUNT_NUMBERS; i++) {
            list.push( getRandomIntNumber(min, max + 1) );
        }
    }
    
    let r1 = serializeList(list);
    let r2 = deSerializeList(r1);

    if (debug) {
        console.log('[= 1]', list.join(','));
        console.log('[= 2]', r1);
        console.log('[= 3]', r2.join(','));
        console.log('=', r1.length, list.join(',').length, r1.length * 100 / list.join(',').length);
    }

    if (list.length != r2.length) {
        console.log("ERROR 1", list.length, r2.length);
    }
    else {
        let haveError = false;

        for (let i = 0; i < list.length; i++) {
            if (list[i] != r2[i]) {
                haveError = true;
                console.log("ERROR 2:", i, list[i], r2[i]);
                break;
            }
        }

        if (! haveError) {
            console.log(
                          "OK"
                        , "length original"
                        , list.join(',').length
                        , "serialize len:"
                        , r1.length
                        , "compress:", 100 - r1.length * 100.0 / list.join(',').length
            );
        }
    }
}

console.log("\nслучайные - 50:");
test(50);

console.log("\nслучайные - 100:");
test(100);

console.log("\nслучайные - 500:");
test(500);

console.log("\nслучайные - 1000:");
test(1000);


console.log("\nВсе числа 1 знака:");
test(50, 1, 9);
test(100, 1, 9);
test(500, 1, 9);
test(1000, 1, 9);

console.log("\nВсе числа из 2-х знаков:");
test(50, 10, 100);
test(100, 10, 100);
test(500, 10, 100);
test(1000, 10, 100);

console.log("\nВсе числа из 3-х знаков:");
test(50, 100, 300);
test(100, 100, 300);
test(500, 100, 300);
test(1000, 100, 300);

console.log("\nКаждого числа по 3 - всего чисел 900:");
let myList = [];

for (let i = 0; i < 900; i++) {
    let addValue = getRandomIntNumber(1, 300 + 1)
    myList.push(addValue);
    myList.push(addValue);
    myList.push(addValue);
}

test(1000, 100, 300, false, myList);