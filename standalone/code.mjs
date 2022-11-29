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
  messages.push(str);
}

var preferred_keys={};
var preferred_keys_lines = fs.readFileSync('preferred_keys.tsv').toString().split("\n");
for (var i = 0; i < preferred_keys_lines.length; i++) {
    var line = preferred_keys_lines[i];
    var split = line.split("\t");
    var char = split[0];
    var key = split[1];
    preferred_keys[char]=key;
}


var values=[];

var ad_hoc_chars = [];
var easyvalues_lines = fs.readFileSync('ad_hoc_doc.tsv').toString().split("\n");
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

var baxter_lines = fs.readFileSync('baxter-sagart.tsv').toString().split("\n");
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


function TRANSLATE(input){
  input=input.trim();
  var result = "";
  var detailliert = input.length===1;
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
        if (!detailliert && keys.length>1 && (c in preferred_keys)){
          
          Logger_Log("picking "+preferred_keys[c]+" for " + c+".");
          keys = [ preferred_keys[c] ];
        }
        
        if (keys.length>1 && detailliert){
          for (var j=0;j<keys.length;j++){
            mc = keys[j];
            if (j>0){
              result+="<br>\n";
            }
            var entry = j+" : "+dict[c][mc][0];
            result += entry;
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


var transliterate_char = function(c, mc, old_chinese,forcetone){
  var result="";
  if (dict.hasOwnProperty(c)){
    var entry = dict[c];
    //if mc is in entry    
    if (entry.hasOwnProperty(mc)){
      var v = (old_chinese===true)?entry[mc][1]:mc;      
      v=v.replace(/\+/g,extra_vowel);
        
      v = v.replace(/i/g,"ı");
      v = v.replace(/j/g,"ȷ");
      
      result = tone_ize(v,forcetone);
      //remove all apostrophes in result
      result = result.replace(/'/g,"");
    }    
  }
  if (result==""){
    result="#";
  }
  return result;
}

var capitalise = function(str){
  var hasdot= str.indexOf(".")>=0;
  var chars = str.split("");
  for (var i=0;i<chars.length;i++){
    if (chars[i]==="." && chars[i-1]!=="."){
      if (i+2<chars.length){
        chars[i+2]=chars[i+2].toUpperCase();
      }
    }
  }
  if (hasdot){
    chars[0]=chars[0].toUpperCase();
  }
  return chars.join("");
}

//mix of baxter-sagart and Karlgren–Li  notation, basewd on B-S
function TRANSLITERATE(input,old_chinese) {
  
  input = input+"";
  input = input.trim();
  const ar = input.split("");
  var detailliert=input.length===1;
  var result=[];
  for (var i=0;i<ar.length;i++){
      var s = ar[i];
    var forcetone="";
    if (ar[i+1]===vowels_raise){
        forcetone=vowels_raise;
        i++;
    } else if (ar[i+1]===vowels_lower){
        forcetone=vowels_lower;
        i++;
    } else if (ar[i+1]===vowels_hold){
        forcetone=vowels_hold;
        i++;
    }  
   // console.log("transliterating "+s+" " + forcetone);

    var mc="";
    if (ar[i+1]==='['){
        var end=ar.indexOf(']',i+1);

        mc =  ar.join("").substring(i+2,end);
        var transliterated =  transliterate_char(s,mc,old_chinese,forcetone);
        result.push(transliterated);
        i=end;
    } else {
      if (dict[s]==null){
        fetch_entry_dynamically(s);
        if (dict[s]==null){
          throw "no dictionary entry for " + s;
        }
      }
      var mc_keys = Object.keys(dict[s]);
      
      
      if (!detailliert && mc_keys.length>1 && (s in preferred_keys)){
        
        Logger_Log("picking "+preferred_keys[s]+" for " + s+".");
        mc_keys = [ preferred_keys[s] ];
      }
      
      
      if (detailliert===false || mc_keys.length===1){
        mc = mc_keys[0];
        var transliterated =  transliterate_char(s,mc,old_chinese,forcetone);
        result.push(transliterated);
      } else {
        var transliterated="";
        for (var j=0;j<mc_keys.length;j++){
          var mc = mc_keys[j];
          if (j>0){
            transliterated += " - ";
          }
          transliterated += transliterate_char(s,mc,old_chinese,forcetone);
        }
        //Logger_Log(transliterated);
        result.push(transliterated);
      }
    }
    
  }
  result = capitalise(result.join(" ").replace(/\ \./g,"."));
  // result = result.replace(/t/g,"ᴛ");
  // result = result.replace(/h/g,"ʜ");
  return result;
}

import clipboardy from 'clipboardy';

//read all input from stdin synchronously
var chinese_string = "";
var stdin = process.openStdin();
stdin.setEncoding('utf8');
stdin.on('data', function(chunk) {
  chinese_string += chunk;
});
stdin.on('end', function() {
  chinese_string = chinese_string.trim();

var transliterated = TRANSLITERATE(chinese_string,false);
//generate translations
var translated = TRANSLATE(chinese_string);


//output command-line arguments
//copy processa.argv to clipboard

var output = transliterated+"\n"+translated;
clipboardy.writeSync(output);
console.log(output);


if (entries_to_add.length>0){
  console.log("adding entries to ad_hoc_doc for characters " + entries_to_add.map(a=>a[0]).join("")+".");
  //append entries to ad_hoc_doc.tsv
  var toappend = "";
  for (var i=0;i<entries_to_add.length;i++){
    var entry = entries_to_add[i];
    toappend += "\n"+entry[0]+"\t"+entry[1]+"\t"+entry[2];
  }
  //append toappend to ad_hoc_doc.tsv
  var dat = fs.readFileSync("ad_hoc_doc.tsv","utf8");
  dat+=toappend;
  fs.writeFileSync("ad_hoc_doc.tsv",dat);

}

});

