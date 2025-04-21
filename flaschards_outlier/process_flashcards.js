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



var variant_sets = ["𱐕㐺","󰂤㝱","𣑼𣏟","亏于","犾㹜","𢊁廌","帇𦘒","𣠔㯻","𤣩玉","丄𠄞上","气乞","𠰛吿告","𠙵口","𣥚𧺆走","𣥠癶","昰是","𠕋𠕁冊册","𧮫𠔌","𠯶句","𠃚𠃏丩","𠦃卅","𠬞廾廾","𡴂𠬜","𠔏共","𦥠舁舁","𦥑臼","𠦶革","䰜𩰲","𠃨丮𩰊","㕜史","𦘙畫","殺𣪩?","𡰻皮","𠭼㼱","⺊卜","𤰃用","𥄎𡕥","睂眉","𦣹自","鼻鼻","𦏲羽","雈萑","𦤄𥄕","𦍋羊","𣦻𣦼","𣦵歺","𣦸死","𠕎肉","𠚣刀","㓞𠛉","𣐇耒","𧢲角","𤮺甘","𠄎乃","𠤔旨","𧯛壴","𧯽豊","㚎厺去","𠂁丹","𤯞靑青","丼井","𠊊食","𠓛亼","𠓡矢","𩫖𩫏","𢂋京","𣆪𣆉㫗","𠾂𠻮嗇","䑞舜","𡳿㞢之","𤯓生","𦾓華","𥠻稽","巢巢","𣠔㯻","𨛜䣈𨙵","朙明","𡖈𡖇多","𠄷𠫼亝齊","㐔𠅏克","𢑗彔录","𪏽香","𣎳朩","麻麻","𥤢穴","𤕫𤕬疒","𠘨冖","襾覀","黹黹","󰈙𠤎","丠丘","𡔛𡈼","𡍴𨤣重","𠂣㐆","𧚍裘","𡰣尸","𡳐履","𨡳㱃","㒫旡","𩑋頁","𡇢𠚑面","𩠐首","𠨗巵卮","𢎛卪卩㔾","𠁽丸","㣇㣇","𢄉豚","𧰽𤉡","𤉢象","𪐗黑","囪囱","𤆍赤","𡗕亦","𡯁尢𡯂尣","𡔲壺","𡕍壹","㚔𠂷𡴘幸","夲𠦍","𡗓立","𡘋竝","恖思","𩕘頻瀕","巛川","仌冫","𤋳魚","𩙱飛","𠃉乚","𠀚不","𡉰至","㢴西","𦣝𦣞","𤦡珡琴","𠃑𠃊","兦亾亡","𠙹甾","𢎺弦","𢁴系","𦃃素","𪓑黽","𡏳堇","黃黄","𠠲力","勺勺","𤣫𣁬斗","𠀁七","𠘯禸厹","𠾧嘼","𢀳巴","𠩖庚","𡩟寅","戼卯","𨑃辰","𦥔申"]
function get_variant_set(char){
    for (var i = 0; i < variant_sets.length; i++) {
        var variant_set = variant_sets[i];
        var variant_set_chars = [...variant_set];
        if (variant_set_chars.indexOf(char) >= 0) {
            return [...variant_set];
        }
    }
    return [char];
}

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

    //don't use rest.split("");
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
        // console.log("no lookup found for character", char);
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

function try_get_pinyin(character){
    var pinyin_results = pinyin.pinyin(character);
    if (pinyin_results==null||pinyin_results.length ===0 || pinyin_results[0].length ===0){
        return "";
    }
    return pinyin_results[0][0];
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
        // console.log("Warning: character", character, "not found in qieyun, using pinyin:", py);
        return py;
    } else {
        for (var i = 0; i < lookup.length; i++) {
            const 音韻地位 = lookup[i].音韻地位;
            var 解釋 = lookup[i].解釋;
            const mc = baxter(音韻地位);
            // const py_reconstructed = putonghua(音韻地位);
            var py = try_get_pinyin(character);
            // if (py.normalize("NFC")!==py_reconstructed.normalize("NFC")){
                // console.log("Warning: character", character, "has different pinyin in qieyun and pinyin library:", py, py_reconstructed);
            // }

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


var shuowen_dict = JSON.parse(await readFile(resolve(__dirname, './shouwendict.json'), 'utf8'));

function strip_parentheticals(str) {
    var original_str = str;
    str=str.trim();
    var str_chars = [...str];
    if (str_chars.length>2 && str_chars[str_chars.length-3]==="(" && str_chars[str_chars.length-1]===")"){
        var char_to_add = str_chars[str_chars.length-2];
        if (is_cjk(char_to_add)){
            // console.log(str_chars);
            // console.log(char_to_add);
            str = char_to_add;
        }
    }

    //remove all parentheticals
    //if I end with 
    str = str.replace(/\([^)]*\)/g, '');
    str = str.replace(/\（[^)]*\）/g, '');
    str = str.replace(/\《[^)]*\》/g, '');
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
    //if the original string ended with a parenthetical, add is contents back, if the string here is empty

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

    var hz = strip_str(strip_parentheticals(fields[0]));

    if (fields[6].trim().length===0){
        var variants = get_variant_set(hz);
        var found_definition = false;
        for (var j = 0; j < variants.length; j++) {
            var variant = variants[j];
            if (shuowen_dict.hasOwnProperty(variant)){
                fields[6] = shuowen_dict[variant];
                found_definition = true;
                break;
            }
        }
        if (!found_definition){
            //only log if fields[0][0] is a digit
            if (fields[0][0].match(/\d/)){
                console.log("ERROR: no definition found for character", hz);
                console.log("variant sets:", variants);
            }
        }
    }
    if (hz.length === 0) {
        //just take last character
        hz = strip_str(fields[1]);
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
        var definition_line = pronunciation + ": " + definition;
        if (new_definition_string.indexOf(definition_line) < 0){
            new_definition_string += definition_line;
        }
    }
    fields[5] = new_definition_string;

}

//save it to deck2.json
console.log("\nProcessing complete!");

const deck2_json = JSON.stringify(flashcards_json, null, 2);
await writeFile("./說文部首：楷體與小篆/deck.json", deck2_json);
console.log("Updated deck saved to ./說文部首：楷體與小篆/deck.json");

