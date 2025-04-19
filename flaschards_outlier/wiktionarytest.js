const wiktionary = require('wiktionary')

wiktionary('好').then(result => {
  console.log(result)
})