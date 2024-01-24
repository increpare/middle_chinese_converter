//import fs module
import fs from 'fs';
//find location of this file
import path from 'path';
//csv-parse
import { parse } from 'csv-parse/sync';


const pos_dictionary  = {
    "nc":"n<sub>c</sub>",
    "nloc":"n<sub>loc</sub>",
    "np":"n<sub>p</sub>",
    "ntemp":"n<sub>temp</sub>",
    "Od":"O<sub>d</sub>",
    "Oi":"O<sub>i</sub>",
    "Opr":"O<sub>pr</sub>",
    "parta":"part<sub>a</sub>",
    "partp":"part<sub>p</sub>",
    "prdem":"pr<sub>dem</sub>",
    "prind":"pr<sub>ind</sub>",
    "print":"pr<sub>int</sub>",
    "prper":"pr<sub>per</sub>",
    "prrel":"pr<sub>rel</sub>",
    "ptint":"pt<sub>int</sub>",
    "ptemp":"pt<sub>emp</sub>",
    "vi":"v<sub>i</sub>",
    "vn":"v<sub>n</sub>",
    "vst":"v<sub>st</sub>",
    "vtr":"v<sub>tr</sub>"
}

//load Vogelsang Glossary - Tabellenblatt1-3.csv
var __dirname = path.resolve();
var glossary_txt = fs.readFileSync(path.resolve(__dirname, 'data/Vogelsang Glossary - Tabellenblatt1-3.csv'), 'utf8');
//drop first line
//parse glossary using parse synchronously
var glossary = parse(glossary_txt, {
    skip_empty_lines: true
  });
//drop first line
glossary.shift();
var dictionary = {};

for (var i = 0; i < glossary.length; i++) {
    //do a csv split, being careful to ignore commas quoted strings
    var line = glossary[i];
    // console.log("line:"+line);
    //Full Entry	Hansi	Pinyin	OC	PoS	Definitions	MC	BS_Gloss	Order
    var d_full = line[0];
    var d_hansi = line[1];
    var d_pinyin = line[2];
    var d_oc = line[3];
    var d_pos = line[4].trim();
    if (d_pos in pos_dictionary) {
        d_pos = pos_dictionary[d_pos];
    } else {
        //if first word is in pos_dictionary, replace it
        var d_pos_words = d_pos.split(" ");
        if (d_pos_words[0] in pos_dictionary) {
            d_pos_words[0] = pos_dictionary[d_pos_words[0]];
            d_pos = d_pos_words.join(" ");
        }
            
    }
    var d_definitions = line[5];
    var d_mc = line[6];
    var d_mc_pretty = line[7];
    var d_bs_gloss = line[8];
    // console.log(d_hansi);
    var d_order = line[9];
    // console.log(glossary[i]);
    // console.log("hansi = "+d_hansi + " pinyin = "+d_pinyin + " oc = "+d_oc + " pos = "+d_pos + " definitions = "+d_definitions + " mc = "+d_mc + " bs_gloss = "+d_bs_gloss + " order = "+d_order)
    var entry_html = `<span class="pinyin">${d_pinyin}</span> <span class="mc">${d_mc_pretty}</span> <span class="oc">${d_oc}</span><br><span class="pos">${d_pos}</span><p><span class="definitions">${d_definitions}</span>`;
    var entry_html_no_pronunciation = `<span class="pinyin">???</span> <span class="mc">$???</span> <span class="oc">???</span><br><span class="pos">${d_pos}</span><p><span class="definitions">${d_definitions}</span>`;
    var entry_html_no_pos = `<span class="pinyin">${d_pinyin}</span> <span class="mc">${d_mc_pretty}</span> <span class="oc">${d_oc}</span><br><span class="pos"><b>XXX</b></span><p><span class="definitions">${d_definitions}</span>`;
    var entry_pronunciation_only = `<span class="pinyin">${d_pinyin}</span> <span class="mc">${d_mc_pretty}</span> <span class="oc">${d_oc}</span>`;
    // console.log(entry_html);
    //if entry already exists, append entry_html to it
    if (dictionary[d_hansi]) {
        dictionary[d_hansi][0] += "<hr>"+entry_html;
        dictionary[d_hansi][1] += "<hr>"+entry_html_no_pronunciation;
        dictionary[d_hansi][2] += "<hr>"+entry_html_no_pos;
        dictionary[d_hansi][3] += "<br>"+entry_pronunciation_only;
        dictionary[d_hansi][4] += " "+d_mc;
        dictionary[d_hansi][5] += " "+d_mc_pretty;
    } else {
        dictionary[d_hansi] = [entry_html,entry_html_no_pronunciation,entry_html_no_pos,entry_pronunciation_only,d_mc,d_mc_pretty,d_order];
    }
}

//save as tsv
var tsv = "";
for (var key in dictionary) {
    var entry = dictionary[key];
    var id = "vogelsang_"+key;
    var order = entry[5];
    var def = entry[0];
    var def_no_proncuation = entry[1];
    //var characters to mask are all characters in key except for / and any whitespace
    var characters_to_mask = key.replace(/\/|\s/g, '');
    var def_masked = def.replace(new RegExp("["+characters_to_mask+"]", 'ug'), '<b>?</b>');
    var def_no_pos = entry[2];
    var def_pronunciation_only = entry[3];
    var mc = entry[4];
    var mc_pretty = entry[5];
    tsv += id+"\t"+key+"\t"+def+"\t"+def_masked+"\t"+def_no_proncuation+"\t"+def_no_pos+"\t"+ def_pronunciation_only+"\t"+mc+"\t"+mc_pretty+"\t" +order+ "\n";
}
fs.writeFileSync(path.resolve(__dirname, 'data/final_vogelsang.tsv'), tsv, 'utf8');
