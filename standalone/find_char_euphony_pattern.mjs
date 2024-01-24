//import fs module
import fs from 'fs';
//find location of this file
import path from 'path';

import { 資料 } from "qieyun";
import { baxter } from "qieyun-examples";


//set working direction to the location of this file
process.chdir(path.dirname(process.argv[1]));

var messages=[];

function Logger_Log(str){
  console.log(str);
  // messages.push(str);
}

var preferred_keys={};
var preferred_keys_lines = fs.readFileSync('data/preferred_keys.tsv').toString().normalize('NFC').split("\n");
for (var i = 0; i < preferred_keys_lines.length; i++) {
    var line = preferred_keys_lines[i];
    //split by any whitespace
    var split = line.split(/\s+/);
    var char = split[0];
    var key = split[1];
    preferred_keys[char]=key;
}


var values=[];

var ad_hoc_chars = [];
var easyvalues_lines = fs.readFileSync('data/ad_hoc_doc.tsv').toString().normalize('NFC').split("\n");
for (var i = 0; i < easyvalues_lines.length; i++) {
    var line = easyvalues_lines[i];
    var split = line.split("\t");
    var char = split[0];
    var mc = split[1];
    var rest = split[2];
    var oc = split[4];
    ad_hoc_chars.push([char,mc,rest]);
    values.push([char,"",mc,"",oc,rest]);
}

var baxter_lines = fs.readFileSync('data/baxter-sagart.tsv').toString().normalize('NFC').split("\n");
baxter_lines.shift();
for (var i = 0; i < baxter_lines.length; i++) {
    var line = baxter_lines[i];
    var split = line.split("\t");
    var char = split[0];
    var mc = split[2];
    var def = split[5];
    values.push([char,"",mc,"","",def]);
}

//process values into dict
var dict={};
for (var i=0;i<values.length;i++){
  const entry=values[i];
  const hansi=entry[0];
  const mc = entry[2];
  const def = entry[5];
  const oc = entry[4];
  
  if (!dict.hasOwnProperty(hansi)){
    dict[hansi]={}
    dict[hansi][mc]=[def,oc];
  } else {
    var dictentry = dict[hansi];
    if (!dictentry.hasOwnProperty(mc)){
      dict[hansi][mc]=[def,oc]
    }    
    if (dict[hansi][mc][0]!==def){
      dict[hansi][mc][0]+="/"+def;
    }
    if (dict[hansi][mc][1]!==oc){
      dict[hansi][mc][1]+="/"+oc;
    }
  }
}



const extra_vowel = "ų";
const vowels = "aeıou"+extra_vowel;
const vowels_raise = "\u0301";
const vowels_lower = "\u0300";
const vowels_hold = "\u0304";

const retroflex = "\u0323";
const palatize = "\u032F";


var tone_ize = function(str,forcetone){
  //remov opening apostrophe
  str = str.replace(/’/g,"");
  str=str.replace(/\+/g,extra_vowel);      
  str = str.replace(/i/g,"ı");
  str = str.replace(/j/g,"ȷ");

  var final = str[str.length-1];
  if (forcetone===vowels_hold){
    if (final==="H"||final==="X"){
        str=str.substr(0,str.length-1);
        final = str[str.length-1];
    }
  } else if (forcetone===vowels_lower) {
    if (final==="H"||final==="X"){
        str=str.substr(0,str.length-1);
    }
    str=str+"H";
    final = str[str.length-1];
  } else if (forcetone===vowels_raise) {
    if (final==="H"||final==="X"){
        str=str.substr(0,str.length-1);
    }
    str=str+"X";
    final = str[str.length-1];
  }
  if ( final==="X" ){
    str = str.substr(0,str.length-1);
    var chars = str.split("");
    for (var i=0;i<chars.length;i++){
      var c = chars[i];
      var vowel_idx = vowels.indexOf(c);
      if (vowel_idx>=0){
        chars[i]+=vowels_raise;
        break;
      }
    }
    str = chars.join("");
  } else if ( final==="H" ){
    str = str.substr(0,str.length-1);
    var chars = str.split("");
    for (var i=0;i<chars.length;i++){
      var c = chars[i];
      var vowel_idx = vowels.indexOf(c);
      if (vowel_idx>=0){
        chars[i]+=vowels_lower;
        break;
      }
    }
    str = chars.join("").normalize('NFC');;
  }
  else if (final!=="p" && final!=="t" & final!=="k"){
    var chars = str.split("");
    for (var i=0;i<chars.length;i++){
      var c = chars[i];
      var vowel_idx = vowels.indexOf(c);
      if (vowel_idx>=0){
        chars[i]+=vowels_hold;
        break;
      }
    }
    str = chars.join("");
  }
  
  chars=str.split("");
  //replace r with retroflex dot
  for (var i=0;i<chars.length-1;i++)
  {
    if (vowels.indexOf(chars[i])>=0){
      break;
    }
    if (chars[i]==='r'){
      chars[i]=retroflex;
    }
    if (i>0&&chars[i]==='y'){
      chars[i]=palatize;
    }
  }
  str=chars.join('');
  return str;
}


function TRANSLATE(input,pickone){
  if (pickone===undefined){
    pickone=false;
  }
  input=input.trim();
  var result = "";
  var detailliert = input.length===1 && pickone===false;
  for (var i=0;i<input.length;i++){
    var c = input[i];    
    if (c==="。"){
      continue;
    }
    if (c==="\n"){
        continue;
    }
    if (c==="，"){
        continue;
    }
    if (c==="."){
        continue;
    }
    
    if (dict.hasOwnProperty(c)){
      if (i>0) {
        result+=" \\ ";
      }
      
      
      var found=false;
      var mc=[];
      if (input[i+1]==='['){
        var end=input.indexOf(']',i+1);
        mc = input.substring(i+2,end);
        result += dict[c][mc];  
        i=end;   
      } else {
        var keys=Object.keys(dict[c]); 
        if ( pickone || (!detailliert && keys.length>1)){
          if (c in preferred_keys){
            Logger_Log("picking "+preferred_keys[c]+" for " + c+".");
            keys = [ preferred_keys[c] ];
          }
        }
        
        if (keys.length>1 && detailliert){
          for (var j=0;j<keys.length;j++){
            mc = keys[j];
            if (j>0){
              result+="<br>";
            }
            var entry = j+" : "+dict[c][mc][0];
            result += entry.trim();
          }
        } else {
          var mc = keys[0];
          result+=dict[c][mc][0];
        }
      }      
    }
    else {
      result+=" # ";
    }
//    for (var j=0;j<values.length;j++){
//      var zeichen=values[j][0];
//      if (zeichen===c){
//        result += " / " + values[j][5] +" / ";
//        found=true;
//      }
//    }
//    if (!found){
//      result +=" # ";
//    }    
  }
  return result;
}

var entries_to_add = [];
function fetch_entry_dynamically(character){
  //look it up in qieyun
  var lookup = 資料.query字頭(character);
  if (lookup.length===0){
    return "#"
  } else {
    for (var i=0;i<lookup.length;i++){
      const 音韻地位 = lookup[i].音韻地位;
      const 解釋 = lookup[i].解釋;
      const mc = baxter(音韻地位);
      //add to dict
      if (!(character in dict)){
        dict[character] = {};        
      }
      if (!(mc in dict[character])){
        dict[character][mc] = [解釋,""];
      }
      entries_to_add.push([character,mc,解釋]);
    }
    return baxter(lookup[0].音韻地位);
  }
}

function word_has_voiced_opening(wort){
    var first = wort[0];
    return first==="b"||first==="d"||first==="g"||first==="m"||first==="n"||first==="z";
}

function word_has_unvoiced_opening(wort){
    var first = wort[0];
    return first==="p"||first==="t"||first==="k"||first==="s";
}

function word_has_nasal_ending(wort){
    if (wort[wort.length-1]==="X"||wort[wort.length-1]==="H"){
      wort=wort.substr(0,wort.length-1);
    }
    var last = wort[wort.length-1];    
    return last==="n"||last==="m"||last==="g";
}

function word_has_vowel_final(wort){
  if (wort[wort.length-1]==="X"||wort[wort.length-1]==="H"){
    wort=wort.substr(0,wort.length-1);
  }
  var last = wort[wort.length-1];
  return last==="a"||last==="e"||last==="i"||last==="o"||last==="u";
}

    
function word_tone(wort){
    //1 = flat
    //2 = rising
    //3 = falling
    //4 = entering
    var last = wort[wort.length-1];
    if (last==="H"){
        return 3;
    }
    if (last==="X"){
        return 2;
    }
    if (last==="p"||last==="t"||last==="k"){
        return 4;
    }
    return 1;
}

console.log("starting");
var type_a=[];
var type_b=[];

function GoodPair(w1, w2){
  //rule 4: if first voiced, second can't be unvoiced
  if (word_has_voiced_opening(w1)&&word_has_unvoiced_opening(w2)){
    return false;
  }
  //rule 5: nasal can't follow word with vowel ending
  if (word_has_vowel_final(w1)&&word_has_nasal_ending(w2)){
    return false;
  }
  return true;
}

function Rule4PositiveExample(w1,w2){
  return word_has_unvoiced_opening(w1)&&word_has_voiced_opening(w2);
}

function Rule5PositiveExample(w1,w2){
  return word_has_nasal_ending(w1)&&word_has_vowel_final(w2);
}

//load data/poetry_all.txt into an array
var lines = fs.readFileSync('./data/poetry_all.txt').toString().normalize('NFC').split("\n");
for (var i = 0; i < lines.length; i++) {
    var line = lines[i];
    //split based on punctuation (remember this is chinese)
    var split = line.split(/[，。？！]/);

    for (var j=0;j<split.length;j++){
        var part = split[j];
        if (part.length>4){
          //truncate
          part=part.substr(0,4);
        }
        if (part.length!==4){
            continue;
        }
        var words = part.split("").map(fetch_entry_dynamically);
        var tones = words.map(word_tone);
        //desired tone pattern is 1,2,3,4
        if (!(tones[0]===1&&tones[1]===2&&tones[2]===3&&tones[3]===4)){
            continue;
        } 

        if (!GoodPair(words[0],words[1])){
          continue;
        }
        if (!GoodPair(words[2],words[3])){
          continue;
        }

        //require rule 4 to hold somewhere positively
        if (!Rule4PositiveExample(words[0],words[1])&&!Rule4PositiveExample(words[2],words[3])){
          continue;
        }
        //require rule 5 to hold somewhere positively
        if (!Rule5PositiveExample(words[0],words[1])&&!Rule5PositiveExample(words[2],words[3])){
          continue;
        }
        
        console.log(part);
        console.log(words.join(" "));

    }
}
