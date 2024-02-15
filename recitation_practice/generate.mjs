import fs from 'fs';
import path from 'path';


process.chdir(path.dirname(process.argv[1]));

function generateDict() {
    var values = [];

    var easyvalues_lines = fs.readFileSync('../standalone/data/ad_hoc_doc.tsv').toString().split("\n");
    for (var i = 0; i < easyvalues_lines.length; i++) {
        var line = easyvalues_lines[i];
        var split = line.split("\t");
        var char = split[0];
        var mc = split[1];
        var rest = split[2];
        var oc = split[4];
        values.push([char, "", mc, "", oc, rest]);
    }

    var baxter_lines = fs.readFileSync('../standalone/data/baxter-sagart.tsv').toString().split("\n");
    baxter_lines.shift();
    for (var i = 0; i < baxter_lines.length; i++) {
        var line = baxter_lines[i];
        var split = line.split("\t");
        var char = split[0];
        var mc = split[2];
        var def = split[5];
        values.push([char, "", mc, "", "", def]);
    }

    //process values into dict
    var dict = {};
    for (var i = 0; i < values.length; i++) {
        const entry = values[i];
        const hansi = entry[0];
        const mc = entry[2];
        const oc = entry[4];
        const def = entry[5];
        
        if (!dict.hasOwnProperty(hansi)) {
            dict[hansi] = {}
            dict[hansi][mc] = def;
        } else {
            var dictentry = dict[hansi];
            if (!dictentry.hasOwnProperty(mc)) {
                dict[hansi][mc] = def;
            } else {
                //otherwise if it's entry doesn't contain def already
                var definition = dictentry[mc];
                if (definition.indexOf(def) < 0) {
                    dict[hansi][mc]+="/"+def;
                }
            }
        }
    }
    return dict;
}

var dict = generateDict();


//load datalite.txt
let datalite = fs.readFileSync('datalite.txt', 'utf8');
//split lines
let lines = datalite.split('\n').map(line => line.trim());
var poems = [];
for (let i = 0; i < lines.length; i++) {
    //if empty, ignore
    if (lines[i] == '') {
        continue;
    }
    //if starts with 《, we have the title of a new poem
    if (lines[i].startsWith('《')) {
        poems.push({
            title: lines[i].substring(1, lines[i].length - 1),
            body: []
        });//create a new poem object
    }
    else {
        poems[poems.length - 1].body.push(lines[i]);
    }
}

function punctuate(line) {
    //replaces 。 with <span class="punctuation">。</span>
    return line.replace(/。/g, '<span class="punctuation">。</span>');

}
var tone_ize = function (str, forcetone) {
    const extra_vowel = "ų";
    const vowels = "aeıou"+extra_vowel;
    const vowels_raise = "\u0301";
    const vowels_lower = "\u0300";
    const vowels_hold = "\u0304";

    const retroflex = "\u0323";
    const palatize = "\u032F";

    //remov opening apostrophe
    str = str.replace(/’/g, "");
    str = str.replace(/\+/g, extra_vowel);
    str = str.replace(/i/g, "ı");
    str = str.replace(/j/g, "ȷ");

    var final = str[str.length - 1];
    if (forcetone === vowels_hold) {
        if (final === "H" || final === "X") {
            str = str.substr(0, str.length - 1);
            final = str[str.length - 1];
        }
    } else if (forcetone === vowels_lower) {
        if (final === "H" || final === "X") {
            str = str.substr(0, str.length - 1);
        }
        str = str + "H";
        final = str[str.length - 1];
    } else if (forcetone === vowels_raise) {
        if (final === "H" || final === "X") {
            str = str.substr(0, str.length - 1);
        }
        str = str + "X";
        final = str[str.length - 1];
    }
    if (final === "X") {
        str = str.substr(0, str.length - 1);
        var chars = str.split("");
        for (var i = 0; i < chars.length; i++) {
            var c = chars[i];
            var vowel_idx = vowels.indexOf(c);
            if (vowel_idx >= 0) {
                chars[i] += vowels_raise;
                break;
            }
        }
        str = chars.join("");
    } else if (final === "H") {
        str = str.substr(0, str.length - 1);
        var chars = str.split("");
        for (var i = 0; i < chars.length; i++) {
            var c = chars[i];
            var vowel_idx = vowels.indexOf(c);
            if (vowel_idx >= 0) {
                chars[i] += vowels_lower;
                break;
            }
        }
        str = chars.join("").normalize('NFC');;
    }
    else if (final !== "p" && final !== "t" & final !== "k") {
        var chars = str.split("");
        for (var i = 0; i < chars.length; i++) {
            var c = chars[i];
            var vowel_idx = vowels.indexOf(c);
            if (vowel_idx >= 0) {
                chars[i] += vowels_hold;
                break;
            }
        }
        str = chars.join("");
    }

    chars = str.split("");
    //replace r with retroflex dot
    for (var i = 0; i < chars.length - 1; i++) {
        if (vowels.indexOf(chars[i]) >= 0) {
            break;
        }
        if (chars[i] === 'r') {
            chars[i] = retroflex;
        }
        if (i > 0 && chars[i] === 'y') {
            chars[i] = palatize;
        }
    }
    str = chars.join('');
    return str;
}

function addLineBreakOpportunities(str){
    //add <wbr> both sides of all slashes
    str = str.replace(/\//g, "/<wbr>");
    return str.replace(/; */g, "; <wbr>");
    
}
function addDefinitions(char) {
    if (char === "。") {
        return char;
    }
    var def = dict[char];
    if (def === undefined) {
        console.log(`no definition for ${char}`);
        return char;
    }

    /*sample def code:
    <span class="char">
        下
        <span class="tooltiptext">
            <span class="display_c">下</span>
            <hr>
            <span class="defpronounce">haeX</span><br>
            <span class="defgloss">down</span>
            <hr>
            <span class="defpronounce">haeH</span><br>
            <span class="defgloss">descend</span>
        </span>
    </span>
    */
var HTML_DEF = `<span class="char" onclick="">`;
    HTML_DEF += `${char}`;
    HTML_DEF += `<span class="tooltiptext">`;
    HTML_DEF += `\t\t<span class="display_c" onclick="">${char}<span class="cursive">${char}</span></span>\n`;
    var pronunciations = Object.keys(def);

    for (var i = 0; i < pronunciations.length; i++) {
        var pronunciation = pronunciations[i];
        HTML_DEF += `\t\t<hr>`;
        HTML_DEF += `\t\t<span class="defpronounce">${tone_ize(pronunciation)}</span><br>\n`;
        var defs = def[pronunciation];        
        HTML_DEF += `\t\t<span class="defgloss" lang="en">${addLineBreakOpportunities(defs)}</span>\n`;
    }
    HTML_DEF += `</span>`;
    HTML_DEF += `</span>`;
    return HTML_DEF;
}

function addDefinitionsToLine(line) {
    var chars = line.split("");
    var HTML_LINE = "";
    for (var i = 0; i < chars.length; i++) {
        HTML_LINE += addDefinitions(chars[i]);
    }
    return HTML_LINE;
}

function generatePoemHTML(poem) {
    /* example of poem:
    <div class="poem">
    <div class="header" id="#遠遊">遠遊</div>
    <div class="content">
            下崢嶸而無地兮<br>上寥廓而無天<br>視儵忽而無見兮<br>聽惝怳而無聞<br></div>
    </div>
    */
    var HTML_POEM = `<div class="poem">\n`;
    HTML_POEM += `<a class="header" id="${poem.title}" href="#top">${addDefinitionsToLine(poem.title)}</a>\n`;
    HTML_POEM += `<div class="content">\n`;
    for (let i = 0; i < poem.body.length; i++) {
        HTML_POEM += `${punctuate(addDefinitionsToLine(poem.body[i]))}<br>\n`;
    }
    HTML_POEM += `</div>\n`;
    HTML_POEM += `</div>\n`;
    return HTML_POEM;
}

var titles = poems.map(poem => poem.title);

//HTML_TOC is a list of links like `<a class="toclink" href="#遠遊">遠遊</a>`
var HTML_TOC = titles.map(title => `<a class="toclink" href="#${title}">${addDefinitionsToLine(title)}</a>`).join('&#8203;');


var HTML_POEMS = poems.map(poem => generatePoemHTML(poem)).join('\n');

var HTML_FILE = `<html>
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, user-scalable=no" />
    <meta name="apple-mobile-web-app-title" content="CODEX" />
    <meta name="apple-mobile-web-app-capable" content="yes"/>
    <meta name="apple-mobile-web-app-status-bar-style" content="black" />
    <link rel="apple-touch-icon" href="icon.png" />

    <title>CODEX</title>
    <!--include style.css!-->
    <link rel="stylesheet" href="style.css">
</head>
<body lang="zh-Hant"  id="top" onclick="">
    <div class="pageouter">
        <div class="page">
            <div class="TOC" id="TOC">
                ${HTML_TOC}
            </div>
            <div class="poems_container">
                ${HTML_POEMS}
            </div>
        </div>
    </div>
    <!--embed script.js!-->
    <script src="script.js"></script>
</body>
</html>`;
//write to disk
fs.writeFileSync('index.html', HTML_FILE);