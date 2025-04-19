/*************************/
/* LOAD DICTIONARY START */
/*************************/
import { readFile, writeFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { 資料 } from "qieyun";
import { baxter, putonghua } from "qieyun-examples";
import pinyin from 'pinyin';
import * as cjk from 'cjk-regex'
import hanzi from "hanzi";
hanzi.start();



// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Dictionary object to store the processed data
const dict = {};

// Read dictionary files
const baxter_sagart = await readFile(resolve(__dirname, '../standalone/data/baxter-sagart.tsv'), 'utf8');
const ad_hoc_doc = await readFile(resolve(__dirname, '../standalone/data/ad_hoc_doc.tsv'), 'utf8');

var baxter_lines = baxter_sagart.split("\n");

/*copy "deck_orig.json" to "說文部首：楷體與小篆/deck.json" (overwrite if exists)*/
const deck_orig_txt = await readFile(resolve(__dirname, './deck_orig.json'), 'utf8');
await writeFile(resolve(__dirname, './說文部首：楷體與小篆/deck.json'), deck_orig_txt);

var fallback_chinese_dict={};

var values = [];
var easyvalues_lines = ad_hoc_doc.toString().split("\n");
for (var i = 0; i < easyvalues_lines.length; i++) {
    var line = easyvalues_lines[i];
    var split = line.split("\t");
    var char = split[0];
    var mc = split[1];
    var rest = split[2];
    var py_dict = split[3];
    var oc = split[4];
    var pinyin_lookup = char;
    //if rest ends with "(x)"", use x as pinyin_lookup
    var rest_chars = [...rest];
    if (rest_chars.length>2 && rest_chars[rest_chars.length-1]===")" && rest_chars[rest_chars.length-3]==="("){
        pinyin_lookup = rest_chars[rest_chars.length-2];
    }
    var py = fetch_pronunciation_entry_dynamically(pinyin_lookup, pinyin);
    py = py.split("(")[0];

    if (py_dict){
        console.log("using py_dict", py_dict);
        py = py_dict;
    }
    values.push([char, py, mc, "", oc, rest]);
}

var baxter_lines = baxter_sagart.split("\n");
baxter_lines.shift();
for (var i = 0; i < baxter_lines.length; i++) {
    var line = baxter_lines[i];
    var split = line.split("\t");
    var char = split[0];
    var py = split[1];
    var mc = split[2];
    var def = split[5];
    values.push([char, py, mc, "", "", def]);
}

for (var i = 0; i < values.length; i++) {
    const entry = values[i];
    const hansi = entry[0];
    const py = entry[1];
    const mc = entry[2];
    const oc = entry[4];
    const def = entry[5];

    var pronunciation = `${py} (${mc})`;
    if (!dict.hasOwnProperty(hansi)) {
        dict[hansi] = {}
        dict[hansi][pronunciation] = def;
        // console.log("added entry:", pronunciation);
    } else {
        var dictentry = dict[hansi];
        if (!dictentry.hasOwnProperty(pronunciation)) {
            dict[hansi][pronunciation] = def;
        } else {
            //otherwise if it's entry doesn't contain def already
            var definition = dictentry[pronunciation];
            if (definition.indexOf(def) < 0) {
                dict[hansi][pronunciation] += "/" + def;
            }
        }
    }
}

//save dict to dict.json
await writeFile(resolve(__dirname, './dict.json'), JSON.stringify(dict, null, 2));
//write values to values.json
await writeFile(resolve(__dirname, './values.json'), JSON.stringify(values, null, 2));

function fetch_definition_str(char){
    var lookup = hanzi.definitionLookup(char)
    if (!lookup){
        console.log("no lookup found for character", char);
        return "";
    }
    // console.log(lookup,char);
    if (lookup.length>1){
        // console.log("multiple definitions found for character", char);
        // console.log(lookup);
    }
    if (lookup.length===0){
        console.log("no definitions found for character", char);
        return "";
    }
    return lookup[0].definition;
}
function fetch_pronunciation_entry_dynamically(character, fallback) {
    //look it up in qieyun
    var lookup = 資料.query字頭(character);
    if (lookup.length === 0) {
        var pinyin_results = pinyin.pinyin(character);
        if (pinyin_results==null||pinyin_results.length ===0 || pinyin_results[0].length ===0){
            // console.log("Aah character", character, "not found at all qieyun no pinyin library");
            return "#";
        }
        var py = (pinyin.pinyin(character))[0][0];
        console.log("Warning: character", character, "not found in qieyun, using pinyin:", py);
        return py;
    } else {
        for (var i = 0; i < lookup.length; i++) {
            const 音韻地位 = lookup[i].音韻地位;
            var 解釋 = lookup[i].解釋;
            const mc = baxter(音韻地位);
            const py = putonghua(音韻地位);
            var pronunciation = `${py} (${mc})`;

            var alt_definition = fetch_definition_str(character);
            if (alt_definition.length>0){
                解釋 = alt_definition;
                // console.log("using alternative definition for character", character, "from hanzi library:", alt_definition);
            }
            // add to dict
            if (!(character in fallback_chinese_dict)) {
                fallback_chinese_dict[character] = {};
            }
            if (!(pronunciation in fallback_chinese_dict[character])) {
                fallback_chinese_dict[character][pronunciation] = 解釋;
            }
            return pronunciation;

        }

        return pronunciation = `${baxter(lookup[0].音韻地位)} (${putonghua(lookup[0].音韻地位)})`;
    }
    return null;
}

/*************************/
/* LOAD DICTIONARY END   */
/*************************/

//load the flashcard json file
const flashcards_txt = await readFile("./說文部首：楷體與小篆/deck.json", 'utf8');

//parse the flashcard json file
const flashcards_json = JSON.parse(flashcards_txt);

const flashcards = flashcards_json["notes"]
console.log(flashcards.length);

const cjkCharset = cjk.all()

function is_cjk(char) {
    return cjkCharset.toRegExp().test(char) || dict.hasOwnProperty(char);
}

function strip_str(str) {
    //remove all non-cjk characters usin is_cjk
    str = [...str].filter(is_cjk).join("");
    return str;
}


function strip_parentheticals(str) {
    var original_str = str;
    str=str.trim();
    console.log("trimmed", str);
    var str_chars = [...str];
    console.log(str_chars);
    console.log(str_chars.length);
    console.log(str_chars[str_chars.length-1]);
    console.log(str_chars[str_chars.length-3]);
    if (str_chars.length>2 && str_chars[str_chars.length-3]==="(" && str_chars[str_chars.length-1]===")"){
        var char_to_add = str_chars[str_chars.length-2];
        console.log("char_to_add", char_to_add);
        if (is_cjk(char_to_add)){
            console.log(str_chars);
            console.log(char_to_add);
            str = char_to_add;
            console.log("post 0", str);
        }
    }

    //remove all parentheticals
    //if I end with 
    str = str.replace(/\([^)]*\)/g, '');
    console.log("post 1", str);
    str = str.replace(/\（[^)]*\）/g, '');
    console.log("post 2", str);
    str = str.replace(/\《[^)]*\》/g, '');
    console.log("post 3", str);
    var str_toks = str.split("。");
    if (str_toks.length > 1) {
        var char_to_add = [...(str_toks[1].trim())][0]; 
        if (is_cjk(char_to_add)){
            str = char_to_add;
        }
    }
    //trim whitespace
    str = str.trim();
    var str_chars = [...original_str];
    console.log(str_chars);
    console.log([...str][0]);
    //if the original string ended with a parenthetical, add is contents back, if the string here is empty

    console.log("post 4", str);
    return str;
}

for (var i = 0; i < flashcards.length; i++) {
    const fields = flashcards[i]["fields"];
    /* fields:
    0: 常用隸定字形
    1: 其他隸定字形
    2: 篆文圖片
    3: 篆文字型
    4: 古文、籀文等其他字形
    5: 拼音
    6: 解
    7: 反切
    8: 六書
    9: 部
    10: 序號
    11: 卷
    12: 頁
    */
    //so I want to replace the 拼音 field with the middle-chinese pronunciation from the dictionary
    //first, look up character
    if (fields[0].indexOf("𦫳")>=0){
        console.log("found in checkpoint 1", fields);
        console.log("fields[0]"+fields[0]);
    
        var hz = strip_parentheticals(fields[0]);
        console.log("post strip_str", hz);
        hz = strip_str(hz);
        console.log("post strip_str", hz);
    } else {
        var hz = strip_str(strip_parentheticals(fields[0]));

    }
    if (hz.length === 0) {
        //just take last character
        hz = strip_str(fields[1]);
    }
    if (hz.indexOf("𦫳")>=0){
        console.log("found in checkpoint 2", fields);
        console.log("hz = "+hz);
    }
    if (hz.length === 0) {
        console.log(`Warning: character "${fields[0]}" is empty`);
        continue;
    }

    var hz_chars = [...hz];
    if (hz_chars.length > 1) {
        console.log(`Warning: character "${fields[0]}" has more than one character (stripped: "${hanzi}")`);
        // Try to use just the first character
        hz = hz_chars[0];
    }

    if (hz==="𦫳"){
        console.log("found in checkpoint 3", fields);
        console.log(hz);
    }

    let lookup_dict=dict;
    //now look up pronunciation
    if (!dict.hasOwnProperty(hz)) {
        var dynamic_entry_mc = fetch_pronunciation_entry_dynamically(hz);
        if (dynamic_entry_mc === null) {
            console.log(`Warning: character "${hz}" not found in dictionary`);

            // if (fields[0].indexOf("𤣩")>=0){
            //     exit();
            // }
            continue;
        }
        fields[5] = dynamic_entry_mc;
        lookup_dict = fallback_chinese_dict;
        var chinese_definitions = fallback_chinese_dict[hz];
        // console.log(`using dynamic lookup for character "${hz}" with chinese definition`);
        // console.log(chinese_definitions);
    }

    var pronunciations_dict = lookup_dict[hz];
    var new_definition_string = "";
    if (!pronunciations_dict){
        console.log(`Warning: no definitions found for character "${hz}"`);


        continue;
    }
    var pronunciations = Object.keys(pronunciations_dict);
    for (var j = 0; j < pronunciations.length; j++) {
        var pronunciation = pronunciations[j];
        var definition = pronunciations_dict[pronunciation];
        if (new_definition_string.length > 0) {
            new_definition_string += "<br>";
        }
        new_definition_string += pronunciation + ": " + definition;
    }
    fields[5] = new_definition_string;

}

//save it to deck2.json
console.log("\nProcessing complete!");

const deck2_json = JSON.stringify(flashcards_json, null, 2);
await writeFile("./說文部首：楷體與小篆/deck.json", deck2_json);
console.log("Updated deck saved to ./說文部首：楷體與小篆/deck.json");


/* why can't i see 
󰈙
    𥄎𠂢𠂆𦫳𣦻𢆶㓞𠙴丶𨛜㫃𣐺𠧪𠔼㒳󰈙𱐕𱐕𠂣
*/