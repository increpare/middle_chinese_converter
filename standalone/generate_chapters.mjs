//import fs module
import fs from 'fs';
//find location of this file
import path from 'path';

import { 資料 } from "qieyun";
import { baxter } from "qieyun-examples";

const punctuation = "。，：；？！「」";
const punctuation_latin = ".,:;?!\"\"";

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


//create database from baxter_lines containing middle-chinese and pinyin
var baxter_mc_pinyin = {};
for (var i=0;i<baxter_lines.length;i++){
  var line = baxter_lines[i];
  var split = line.split("\t");
  var char = split[0];
  var pinyin = split[1];
  var mc = split[2];
  var def = split[5];
  if (!baxter_mc_pinyin.hasOwnProperty(char)){
    baxter_mc_pinyin[char] = [];
  }
  baxter_mc_pinyin[char].push([mc,pinyin,def]);
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


function TRANSLATE(input,kurz ){
  input=input.trim();
  var result = "";
  var detailliert = (kurz===true) || input.length===1;
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
              result+=" ";
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
    console.log("character not found AT ALL"+character);
    //if character not already present
    var present=false;
    for (var i=0;i<entries_to_add.length;i++){
      if (entries_to_add[i][0]===character){
        present=true;
        break;
      }
    }
    if (!present){
      entries_to_add.push([character,"???","???"]);
    }
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
      console.log("character not found "+character+" "+mc+" "+解釋)
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

var not_found="";
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
        var lookup = fetch_entry_dynamically(s);
        // console.log("lookup "+s+" "+lookup);
        if (dict[s]==null){
          not_found+=s;
          console.log("missing char in " + input + " : " + s);
          fetch_entry_dynamically(s);
          //print callstack with line numbers
            // var stack = new Error().stack;
            // console.log( stack );
          continue;
        }
      }
      var mc_keys = Object.keys(dict[s]);
      
      if (!detailliert && mc_keys.length>1 && (s in preferred_keys)){
        // Logger_Log("picking "+preferred_keys[s]+" for " + s+".");
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


//set working direction to the location of this file
process.chdir(path.dirname(process.argv[1]));

//load all files in books_input, and remember filenames
var books_to_translate = fs.readdirSync('books_input');
var books_to_translate_filenames = [];
for (var i = 0; i < books_to_translate.length; i++) {
    var filename = books_to_translate[i];
    if (filename.endsWith(".txt")) {
        books_to_translate_filenames.push(filename);
    }
}
//load all the files as strings
var books_to_translate_raw_strings = [];
for (var i = 0; i < books_to_translate_filenames.length; i++) {
    var filename = books_to_translate_filenames[i];
    //read utf-8 files
    var raw_string = fs.readFileSync('books_input/' + filename, 'utf8');
    books_to_translate_raw_strings.push(raw_string);
}

function writeBook(book_title, raw_string) {
    var output="";
    //remove all carraige returns
    raw_string = raw_string.replace(/\r/g, "");
    //replace all \n\n\n+ with \n\n
    raw_string = raw_string.replace(/\n\n\n+/g, "\n\n");    
    //split into lines (allow empty lines)
    var lines = raw_string.split(/\n/);
    
    //for each line
    var intable=false;
    for (var i = 0; i < lines.length; i++) {
        var line = lines[i];

        
        var isHeader=line.startsWith("#");
        if (isHeader){
            line = line.substring(1);
        }
        //split at punctuation 。，：；？！「」
        var phrases = line.split(/([。！？；：，「 」])/);
        
        //fix punctuation
        for (var j = 0; j < phrases.length; j++) {
            var phrase = phrases[j];
            //if it's an opening quote, add it to the subsequent fragment
            if (phrase == "「") {
                //if not the last fragment
                if (j < phrases.length - 1) {
                    //add it to the next fragment
                    phrases[j + 1] = "「" + phrases[j + 1];
                    //and remove this fragment
                    phrases.splice(j, 1);
                    j--;
                    continue;
                }
            }
            //if it's a different punctuation mark, add it to previous fragment 
            else if (punctuation.includes(phrase))
            {
                //if not the first fragment
                if (j > 0) {
                    //add it to the previous fragment
                    phrases[j - 1] = phrases[j - 1] + phrase;
                    //and remove this fragment
                    phrases.splice(j, 1);
                    j--;
                    continue;
                }

            }
        }

        //for each phrase
        for (var phrases_i = 0; phrases_i < phrases.length; phrases_i++) {
            var phrase = phrases[phrases_i];
            // console.log("P: "+phrase);
            // continue;

            var transliterated = TRANSLITERATE(phrase,false);
            var translated = TRANSLATE(phrase,true);
            output += phrase +"\n";
            output += transliterated+"\n";
            output += translated+"\n";
        }
      output+="\n\n";      
    }
    //write to file
    fs.writeFileSync('books_output/' + book_title + '.txt', output, 'utf8');
}

//for each book, generate a html file
for (var book_index = 0; book_index < books_to_translate_raw_strings.length; book_index++) {
    var raw_string = books_to_translate_raw_strings[book_index];
    var filename = books_to_translate_filenames[book_index];
    var book_title = filename.replace(".txt", "");
    console.log("processing " + book_title + "...");
    writeBook(book_title, raw_string);
}





import clipboardy from 'clipboardy';

var output="";

if (entries_to_add.length>0){
  console.log("adding entries to ad_hoc_doc for characters " + entries_to_add.map(a=>a[0]).join("")+".");
  //append entries to ad_hoc_doc.tsv
  var toappend = "";
  for (var i=0;i<entries_to_add.length;i++){
    var entry = entries_to_add[i];
    toappend += "\n"+entry[0]+"\t"+entry[1]+"\t"+entry[2];
  }
  //append toappend to ad_hoc_doc.tsv
  var dat = fs.readFileSync("data/ad_hoc_doc.tsv","utf8").normalize('NFC');
  dat+=toappend;
  fs.writeFileSync("data/ad_hoc_doc.tsv",dat);

}
