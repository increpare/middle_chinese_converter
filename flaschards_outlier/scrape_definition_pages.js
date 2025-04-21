//want to 

//load radical_indexes.tsv
var fs = require('fs');
var dict = {};

//shuowen dicts taken from https://github.com/shuowenjiezi/shuowen <3 <3 <3

//load every json file in shuowen/
var files = fs.readdirSync('shuowen/');
for (var i = 0; i < files.length; i++) {
    var file = files[i];
    var data = JSON.parse(fs.readFileSync('shuowen/'+file, 'utf8'));
    if (dict.hasOwnProperty(data.wordhead)) {
        console.log("already exists: "+data.wordhead);
    }
    dict[data.wordhead] = data.explanation;
}

//write to shouwendict.json
fs.writeFileSync('shouwendict.json', JSON.stringify(dict, null, 2));