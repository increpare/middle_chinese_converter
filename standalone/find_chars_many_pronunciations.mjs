//import fs module
import fs from 'fs';
//find location of this file
import path from 'path';

import { 資料 } from "qieyun";
import { baxter } from "qieyun-examples";

var chars = {};
var baxter_lines = fs.readFileSync('data/baxter-sagart.tsv').toString().normalize('NFC').split("\n");
baxter_lines.shift();
var definitions = {};
var dict_complete=[];
for (var i = 0; i < baxter_lines.length; i++) {
    var line = baxter_lines[i];
    var split = line.split("\t");
    var char = split[0];
    var pinyin = split[1];
    var mc = split[2];
    var oc = split[4];
    var def = split[5];
    if (chars[char] == undefined) {
        chars[char] = [[oc], [mc], [pinyin], [def]];
        definitions[char+"_"+oc] = def;
        definitions[char+"__"+mc] = def;
        definitions[char+"___"+pinyin] = def;
    } else {
        var dat = chars[char];
        if (!dat[0].includes(oc)) {
            dat[0].push(oc);
            definitions[char+"_"+oc] = def;
        }
        if (!dat[1].includes(mc)) {
            dat[1].push(mc);
            definitions[char+"__"+mc] = def;
        }
        if (!dat[2].includes(pinyin)) {
            dat[2].push(pinyin);
            definitions[char+"___"+pinyin] = def;
        }
    }
    if (char!=""){
        dict_complete.push([char, pinyin, mc, oc, def]);
    }
}

//create array off all unique middle chinese pronunciations
var py_pronunciations = [];
var mc_pronunciations = [];
var oc_pronuciations = [];
for (var i=0;i<dict_complete.length;i++) {
    var dat = dict_complete[i];
    var char = dat[0];
    var py = dat[1];
    if (!py_pronunciations.includes(py)) {
        py_pronunciations.push(py);
    }

    var mc = dat[2];
    if (!mc_pronunciations.includes(mc)) {
        mc_pronunciations.push(mc);
    }        

    var oc = dat[3];
    console.log(char +":"+ oc)
    //remove square braces
    oc = oc.replace("[", "");
    oc = oc.replace("]", "");
    oc = oc.replace("(", "");
    oc = oc.replace(")", "");
    if (!oc_pronuciations.includes(oc)) {
        oc_pronuciations.push(oc);
    }

}
console.log(mc_pronunciations.length + " unique MC pronunciations");
console.log(py_pronunciations.length + " unique Pinyin pronunciations");
console.log(oc_pronuciations.length + " unique OC pronunciations");

//find char with most pinyin pronunciations
var max = 0;
var max_char = "";
for (var char in chars) {
    var dat = chars[char];
    if (dat[2].length > max) {
        max = dat[2].length;
        max_char = char;
    }
}
console.log(max_char + " has " + max + " Pinyin pronunciations:");
//combine pronunciations and glosses
for (var i=0;i<chars[max_char][2].length;i++) {
    var pinyin = chars[max_char][2][i];
    var def = definitions[max_char+"___"+pinyin];
    console.log("\t"+pinyin + "\t" + def);
}

//find char with most mc pronunciations
var max = 0;
var max_char = "";
for (var char in chars) {
    var dat = chars[char];
    if (dat[1].length >= 5) {
        console.log(char + " has " + dat[1].length + " MC pronunciations:");
        for (var i=0;i<chars[char][1].length;i++) {
            var mc = chars[char][1][i];
            var def = definitions[char+"__"+mc];
            console.log("\t"+mc + "\t" + def);
        }
    }
}



//find char with most oc pronunciations
var max = 0;
var max_char = "";
for (var char in chars) {
    var dat = chars[char];
    if (dat[0].length >= 5) {
        console.log(char + " has " + dat[0].length + " OC pronunciations:");
        for (var i=0;i<chars[char][0].length;i++) {
            var oc = chars[char][0][i];
            var def = definitions[char+"_"+oc];
            console.log("\t"+oc + "\t" + def);
        }
    }
}
