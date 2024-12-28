//include fs
import fs from 'fs';

//load up ../google-scripts/baxter-sagart.tsv
let baxterSagart = fs.readFileSync('../google-scripts/baxter-sagart.tsv', 'utf8');
//split by line
let baxterSagartLines = baxterSagart.split('\n');
var syllables=[];
for (var i=1; i<baxterSagartLines.length; i++){
    //split by tab
    let line = baxterSagartLines[i].split('\t');
    //if there is a syllable
    if (line[2]){
        //add it to the syllables array
        syllables.push(line[2]);
    }
}

console.log("Number of non-unique syllables: "+syllables.length);
//sort syllables list and remove duplicates
syllables.sort();
syllables = syllables.filter(function(item, pos) {
    return syllables.indexOf(item) == pos;
})

console.log("Number of syllables: "+syllables.length);
//print first ten
console.log(syllables.slice(0,10));

const vowels_s = "a,e,ae,ea,i,o,u,+"
const vowels = vowels_s.split(',');

let tone_or_stop_s = "X,H,p,t,k"

function process_syllable(s){
    //split into (initial) <vowel> (final)
    let match = s.match(/([^aeiou\+]+)([aeiou\+]+)([^aeiou\+]*)/);
    let initial = match[1];
    //initial modifiers:
    // r: retroflex
    // h: aspirated
    // y: palatized
    const retroflex = initial.indexOf('r') != -1;
    if (retroflex) {
        initial = initial.replace('r','');
    }
    const aspirated = initial.indexOf('h') > 0;
    if (aspirated) {
        initial = initial.replace('h','');
    }
    //voiced if contains b,d,dz,g,z,h
    const voiced = initial.indexOf('b') != -1 || initial.indexOf('d') != -1 || initial.indexOf('dz') != -1 || initial.indexOf('g') != -1 || initial.indexOf('z') != -1 || initial.indexOf('h') != -1;
    if (voiced) {
        initial = initial.replace('dz','ts').replace('b','p').replace('d','t').replace('g','k').replace('z','s').replace('h','x');
    }
    var articulation = voiced ? "v" : (aspirated ? "h" : "-");

    const palatized = initial.indexOf('y') != -1;
    if (palatized) {
        initial = initial.replace('y','');
    }

    const rounded = initial.indexOf('j') != -1;
    if (rounded) {
        initial = initial.replace('j','');
    }

    const glide = initial.indexOf('w') != -1;
    if (glide) {
        initial = initial.replace('w','');
    }

    

    let vowel = match[2];
    let final = match[3];

    //parse end of final to see if it is a tone or stop
    let tone_or_stop = final.slice(-1);
    let tone_or_stop_index = tone_or_stop_s.indexOf(tone_or_stop);
    if (tone_or_stop_index != -1){
        final = final.slice(0,-1);
    }
    else{
        tone_or_stop = "F";
    }
    
    if (final == ""){
        final="∅";
    }
    return {
        initial: initial,
        articulation: articulation,
        rounded: rounded,
        glide: glide,
        retroflex: retroflex,
        palatized: palatized,
        vowel: vowel,
        final: final,
        tone_or_stop: tone_or_stop,
    }


}


//generate list of processed syllables
let processed_syllables = syllables.map(process_syllable);

//for each part of the vowel, generate a list of possible values
let initial_values = [];
let vowel_values = [];
let final_values = [];
let tone_or_stop_values = [];
for (let i=0; i<processed_syllables.length; i++){
    let syllable = processed_syllables[i];
    if (syllable.initial && initial_values.indexOf(syllable.initial) == -1){
        initial_values.push(syllable.initial);
    }
    if (syllable.vowel && vowel_values.indexOf(syllable.vowel) == -1){
        vowel_values.push(syllable.vowel);
    }
    if (syllable.final && final_values.indexOf(syllable.final) == -1){
        final_values.push(syllable.final);
    }
    if (syllable.tone_or_stop && tone_or_stop_values.indexOf(syllable.tone_or_stop) == -1){
        tone_or_stop_values.push(syllable.tone_or_stop);
    }
}

console.log("Initial values: "+initial_values);
console.log("Vowel values: "+vowel_values);
console.log("Final values: "+final_values);
console.log("Tone or stop values: "+tone_or_stop_values);

/* results of analysis:

Vowels:
a,ae,ea,e,i,+,ie,o,u

Final structure:
N,M,J
W,NG,WNG (these should superimpose)

Tone or stop:
H,X,p,k,F,t 
*/

console.log("\n\n\n")

//for each possible vowel
for (let i=0; i<vowel_values.length; i++){
    let vowel = vowel_values[i];
    let possible_finals = [];
    //for each syllable
    for (let j=0; j<processed_syllables.length; j++){
        let syllable = processed_syllables[j];
        //if the syllable has the vowel
        if (syllable.vowel == vowel){
            //add the final to the list of possible finals
            if (possible_finals.indexOf(syllable.final) == -1){
                possible_finals.push(syllable.final);
            }
        }
    }
    possible_finals.sort();
    console.log("Vowel: "+vowel+" Possible finals: "+possible_finals);
}

console.log("\n\n\n")

/*question - what tones/stops can follow what final structures?*/
for (let i=0; i<tone_or_stop_values.length;i++){
    let tone_or_stop = tone_or_stop_values[i];
    let possible_finals = [];
    for (let j=0; j<processed_syllables.length; j++){
        let syllable = processed_syllables[j];
        if (syllable.tone_or_stop == tone_or_stop){
            if (possible_finals.indexOf(syllable.final) == -1){
                possible_finals.push(syllable.final);
            }
        }
    }
    possible_finals.sort();
    console.log("Tone or stop: "+tone_or_stop+" Possible finals: "+possible_finals);
}