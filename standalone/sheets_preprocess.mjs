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
function TRANSLITERATE(input,old_chinese,pickone) {
  //if pickone not defined, set to fals
  if (pickone===undefined){
    pickone=false;
  }
  input = input+"";
  input = input.trim();
  const ar = input.split("");
  var detailliert = input.length===1 && pickone===false;;
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
          continue;
        }
      }
      var mc_keys = Object.keys(dict[s]);
      
      if (pickone || (!detailliert && mc_keys.length>1)){
        if (s in preferred_keys){
          Logger_Log("picking "+preferred_keys[s]+" for " + s+".");
          mc_keys = [ preferred_keys[s] ];
        }
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

var output="";

var chinese_string = fs.readFileSync("data/input.txt","utf8").normalize('NFC');

chinese_string = chinese_string.trim();

//remove all non-unique characters from chinese_string
var unique_chars = chinese_string.split("").filter((v, i, a) => a.indexOf(v) === i).join("");

const toignore=`,,,...///--………⋯......、;;。..《<<》>>「""」""『""』""〈<<〉>>【[[】]]！!!（((）))，,,：::；;;？??`;
for (var i=0;i<unique_chars.length;i++){
  var char = unique_chars[i];
  if (toignore.indexOf(char)>=0){
    continue;
  }
  var transliterated = TRANSLITERATE(char,false);
  //generate translations
  var translated = TRANSLATE(char);
  var output_line = char+" "+transliterated+" "+translated;
  output_line = output_line.trim();
  if (output_line.indexOf("#")===-1 && output_line!==""){
    output += '"'+char+" "+transliterated+" "+translated+'",\n';
  }
}

//save output to output.txt
fs.writeFileSync("data/output.txt",output,"utf8");

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

console.log("not found: "+not_found);


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

//load vogelsang_charorder.txt as string
var vogelsang_charorder = fs.readFileSync("data/vogelsang_charorder.txt","utf8").normalize('NFC');

//read input_vogelsang.tsv
var input_vogelsang = fs.readFileSync("data/input_vogelsang.tsv","utf8").normalize('NFC');
var lines_vogelsang = input_vogelsang.split("\n");
for (var i=0;i<lines_vogelsang.length;i++){
  var line = lines_vogelsang[i];
  var ar = line.split("\t").map(a=>a.trim());
  var hansis = ar[0].split("/")[0];
  var pinyin = ar[1].toLowerCase();
  var def_mc="";
  var def_def="";
  for (var k=0;k<hansis.length;k++){
    var hansi = hansis[k];
    let found=false;
    if (baxter_mc_pinyin.hasOwnProperty(hansi)){    
      var mc_pinyin = baxter_mc_pinyin[hansi];
      //if there are multiple entries with the same pinyin, but one has preferred mc pronunciation, use that one
      if (preferred_keys.hasOwnProperty(hansi)){
        var preferred_mc = preferred_keys[hansi];
        for (var j=0;j<mc_pinyin.length;j++){
          var this_def_mc = mc_pinyin[j][0];
          var this_def_pinyin = mc_pinyin[j][1];
          var this_def_def = mc_pinyin[j][2];           
          if (pinyin.indexOf(this_def_pinyin)>=0 && this_def_mc===preferred_mc){
            def_mc += " " + this_def_mc;
            def_def += " / " + this_def_def;
            found=true;
            break;
          }      
        }
      }
      //add mc_pinyin to output
      for (var j=0;j<mc_pinyin.length;j++){
        var this_def_mc = mc_pinyin[j][0];
        var this_def_pinyin = mc_pinyin[j][1];
        var this_def_def = mc_pinyin[j][2];           
        if (pinyin.indexOf(this_def_pinyin)>=0){
          def_mc += " " + this_def_mc;
          def_def += " / " + this_def_def;
          found=true;
          break;
        }      
      }
    } 
    if (!found){
      //look up in qieyun
      var entry = fetch_entry_dynamically(hansi);
      def_mc += " " + entry;
      def_def += " / ";
    }    
  }
  def_def = def_def.trim();
  if (def_def[0]=== "/"){
    def_def = def_def.substring(1);
  }
  def_mc = def_mc.trim();
  var charindex =  hansis.split("").map(hansi => vogelsang_charorder.indexOf(hansi)).sort((a,b)=>b-a)[0];
  if (charindex<0){
    charindex=100000000;
  }
  //split def_mc into words, tone_ize, and join
  var tonized_words = def_mc.split(" ").map(word => tone_ize(word,false)).join(" ");
  lines_vogelsang[i] = lines_vogelsang[i] + "\t" + def_mc + "\t"+ tonized_words + "\t" + def_def + "\t" + charindex;

  
}
//combine back together
var output_vogelsang = lines_vogelsang.join("\n");
//save output_vogelsang to output_vogelsang.tsv
fs.writeFileSync("data/output_vogelsang.tsv",output_vogelsang,"utf8");

//assemble json dict with entries {mc_pronunciation;pinyin_pronunciation;definition} for everey character
var dict_complete = {};
for (var i=0;i<unique_chars.length;i++){
  var char = unique_chars[i];
  var pronunciation = TRANSLITERATE(char,false,true);
  var definition = TRANSLATE(char,true);
  dict_complete[char] = [pronunciation,definition];
  console.log(char+" "+pronunciation+" "+definition);
}
//save dict_complete to dict_complete.json
fs.writeFileSync("data/dict_complete.json",JSON.stringify(dict_complete),"utf8");


// //assemble list of all chinese characters in database from values. this overwrites input.txt so as to force the above code to produce a simple wordlist.
// var all_chars = [];
// for (var i=0;i<values.length;i++){
//   var char = values[i][0];
//   if (all_chars.indexOf(char)===-1){
//     all_chars.push(char);
//   }
// }
// //print all_chars to input.txt
// fs.writeFileSync("data/input.txt",all_chars.join(""),"utf8");