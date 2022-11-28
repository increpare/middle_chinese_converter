
//Logger.log("running");

var hauptsheet = SpreadsheetApp.getActive();
var wortsheet = hauptsheet.getSheetByName("BaxterSagart");
var range = wortsheet.getDataRange();
var values = range.getValues();
//additions from https://github.com/lingpy/sinopy
values.push(["樊","","bjon","","","n., Fan (a family name)"]);
values.push(["擇","","draek","","","select, choose, separate out, prefer"]);
values.push(["床","","dzrjang","","","n. bed"]);
values.push(["低","","tej","","","t.v., to lower"]);
values.push(["遲","","drijH","","","to wait for"]);
values.push(["遲","","drij","","","surname Chi"]);
values.push(["冶","","yaeX","","","to smelt; smelter; bewitching"]);
values.push(["長","","drjang","","","n., Chang (a personal name)"]);
values.push(["縲","","lwij","","","縲絏 n., fetters, ropes for binding prisoners"]);
values.push(["濠","","hao","","","n., moat, trench, ditch"]);
values.push(["頹","","dwoj","","","collapse;crumbe;cave-in;elapse;descend;fall;submissive"]);
values.push(["俄","","nga","","","suddenly; soon; presently"]);
values.push(["惻","","tsrhik","","","sad; sorrowful; grieved; to be sympathetic; to be empathetic; (literary) sincere; earnest"]);
values.push(["栩","","xjoX","","","v. oak.  栩栩 s.v., to be lively"]);
values.push(["苔","","doj","","","/n/ moss"]);
values.push(["篁","","hwang","","","/n/ bamboo-grove"]);
values.push(["樓","","luw","","","/n/ storeyed building, tower"]);
values.push(["只","","tsyeX","","","phrase-middle/-final particle;  only, merely; still"]);
values.push(["杳","","'jewX","","","dark/gloomy"]);
values.push(["蹤","","dzjowng","","","footprints/tracks"]);
values.push(["暝","","mengH","","","dark; nighttime; realm of spirits"]);
values.push(["稀","","xj+j","","","/v/ be few, sparse, rare"]);
values.push(["蘧","","gjo","","","蘧蘧 to be sudden"]);
values.push(["鯈","","haw","","","n., moat, trench, ditch"]);
values.push(["軻","","kha","","","n., small cart"]);
values.push(["濛","","muwng"]);
values.push(["举","","kjoX"]);
values.push(["头","","duw"]);
values.push(["乡","","xjang"]);
values.push(["茫","","mang"]);
values.push(["斜","","zae"]);
values.push(["沉","","drim"]);
values.push(["楓","","pjuwng"]);
values.push(["皎","","kewX"]);
values.push(["碣","","gjwot"]);
values.push(["遶","","nyjewH"]);
values.push(["纖","","sjem"]);
values.push(["閒","","hean"]);
values.push(["豔","","yem"]);
values.push(["砧","","trim"]);
values.push(["珠","","tsyju"]);
values.push(["嫦","","dzyang"]);
values.push(["娥","","nga"]);
values.push(["没","","mwot"]);
values.push(["旣","","kj+jH","","","already; de facto; since; then"]);
values.push(["徘","","bwoj"]);
values.push(["徊","","hwoj"]);
values.push(["邀","","xew"]);
values.push(["了","","lewX"]);
values.push(["仞","","nyinH"]);
values.push(["僧","","song"]);
values.push(["僮","","duwng"]);
values.push(["冉","","nyjem"]);
values.push(["冷","","laengX"]);
values.push(["剪","","tsjenX"]);
values.push(["吻","","mjunX"]);
values.push(["奩","","ljem"]);
values.push(["娟","","'jwen"]);
values.push(["怵","","trhwit","","","to fear / to be afraid; sad/sorrowful"]);
values.push(["映","","'jaengH","","","glint;dazzle, put in the shade"]);
values.push(["說","","sywejH","","","/v/ to speak/say/explain"]);
values.push(["與","","yo","","","sentence-final interrogative GP (equiv. to 也平 )"]);
values.push(["虫","","drjuwng","","","insect"]);
values.push(["暮","","muH","","","sunset/nightfall"]);
values.push(["浴","","yowk","","","1. wash the body, bathe, lave.a) ablution; purify.2. swoop and soar, of birds."]);
values.push(["芙","","bju","","","芙蕖 fúqú(MC bju-gjo), lotus (Nelumbo nucifera); 芙蓉 (bju-yowng) fully-opened lotus, or hibiscus on land."]);
values.push(["蓉","","yowng","","","芙蓉 bju-yowng, lotus"]);
values.push(["黃","huáng","hwang","","","yellow"]);
values.push(["黄","huáng","hwang","","","yellow"]);
values.push(["打","","tengX","","","strike,beat; attack"]);
values.push(["遼","","lew","","","distant,faraway; lengthy, protracted"]);
values.push(["鶯","","'eang","","","oriole, espp. black-naped riole, esp. associated with summer; bright plumage, patterned plumage"]);
values.push(["教","","kaew","","","to bring about, to cause, allow"]);
values.push(["耶","","yae","","","father"]);
values.push(["跖","","tsyjek","","","sole of foot"]);
values.push(["括","","kat","","","to tie up; search; embrace"]);
values.push(["愚","","ngju","","","fool; to embarrass"]);
values.push(["椁","","kwak","","","outer coffin"]);
values.push(["滕","","dong","","","ancient state in Shandong; water bursting forth"]);
values.push(["叛","","bwan","","","rebel; betray"]);
values.push(["犯","","bjomX","","","to infringe on; to attack; to encroach, criminal, to brave; to face; to withstand"]);
values.push(["鵠","","howk","","","swan"]);
values.push(["岐","","gje","","","high; majestic; fork in road"]);
values.push(["崑","","kwon","","","崑崙 Kunlun Mountains"]);
values.push(["崙","","lwon","","","崑崙 Kunlun Mountains"]);
values.push(["強","","gȷang","","","to be strong (same as 彊)"]);
values.push(["楮","","trhjo","","","mulberry tree, paper"]);
values.push(["瞡","","kjeh","","","瞡瞡 lacking in knowledge and experience"]);
values.push(["盱","","xju","","","gaze in amazement"]);
values.push(["蝴","","hu","","","蝴蝶 - butterfly"]);
values.push(["麒","","gi","","","麒麟 - unicorn"]);
values.push(["麟","","lin","","","麒麟 - unicorn"]);
values.push(["驕","","kjew","","","large horse, haughty; arrogent"]);
values.push(["鵬","","bong","","","giant mythical bird"]);
values.push(["鄒","","tsrjuw","","","Zou (an ancient Chinese state during the Zhou dynasty)"]);
values.push(["驪","","lje","","","a pure black horse, surname"]);
values.push(["聃","","tham","","","(literary, of ears) large and long, a surname"]);
values.push(["巨","","gjoX","","","huge, a surname, one million"]);
values.push(["般","","pan","","","distribute, category; class; kind"]);
values.push(["卽","","tsik","","","to approach; go near to eat, thereupon"]);
values.push(["覓","","mek","","","to seek out, to find; to choose between"]);
values.push(["曾","","tsong","","","Surname: Zēng"]);
values.push(["喭","","ngjenH","","","surly,rude;coarse,unmannered."]);
values.push(["應","","'ingH","","","respond to, reply"]);

values.push([" ",""," ","",""," "]);
values.push(["。","",".","","","."]);
values.push(["\n","","\n","","","\n"]);
values.push(["，","",",","","",","]);
values.push([".","",".","","","."]);
values.push(["⋯","","...","","","…"]);
values.push(["…","","…","","","…"]);
values.push(["！","","!","","","!"]);
values.push(["：","",":","","",":"]);
values.push(["「","","\"","","","\""]);
values.push(["」","","\"","","","\""]);
values.push(["」","","\"","","","\""]);
values.push(["『","","\"","","","\""]);
values.push(["』","","\"","","","\""]);
values.push(["、","",";","","",";"]);
values.push(["？","","?","","","?"]);
values.push(["《","","<","","","<"]);
values.push(["》","",">","","",">"]);
values.push(["；","",";","","",";"]);
values.push(["　",""," ","",""," "]);
values.push(["（","","(","","","("]);
values.push(["）","",")","","",")"]);
values.push([",","",",","","",","]);//tolerate incorrect punctuation
values.push([".","",".","","","."]);//tolerate incorrect punctuation
values.push(["/","","/","","","/"]);

easyvalues = [
  "雍 'jowng harmonious,concordant;affable",
  "牢 law pen for domestic animals;coop;prison;granary;secure;desolate",
  "牢 luw reduce in the middle of the fist; roll in the hand, knead",
  "溫 'won (温 variant) warm,tepid,mild,gentle; rekindle,reanimate, intermittent fever",
  "猛 maengX brutish,fierce,severe,streneuous",
  "魋 dwoj an animal resembling a brown bear, A surname Tui.",
  "怍 dzak ashamed,abashed,discomforted",
  "噫 'ik chest;breast,what is in one's heart",
  "鳳 bjuwngH fabulous animal,phoenix",
  "觚 ku tall beaker for wine,angular,sword grip,writing tablet",
  "禘 dejH imperial ancestral worship in ancient China",
  "驥 kijH mythical horse,proficient person",
  "儒 nyju scholar; learned person, idiot",
  "偲 tshoj able,talented",
  "佚 yit secluded,excluded,mistake, ~逸 unconventional, 佚豫 yit-yoH, lax and careless, nonchalant; also, speeding swiftly. ~迭 in turn, successively.",
  "侃 khanX iytsoijebm cabdud",
  "侗 duwng child,immature",
  "俎 tsrjoX meat-tray,chopping-block",
  "倦 gjwenH weary,fatigued",
  "倩 tshenH attractive,charming",
  "倩 tshjengH ask for something to be done in one's place as a favor,son-in-law",
  "僎 dzrjenX to prepare",
  "僎 tswin ~遵, to follow",
  "啟 khejX open,unfold,unfasten,start,expound,letter",
  "嗚 'u onomatic element in various compounds",
  "圃 puX vegetable garden,threshing floor",
  "寮 lew small window, official colleague",
  "巽 swonH weak;yielding;gentle",
  "廋 srjuw hide,conceal,corner,hollow, search/seak out",
  "彬 pin half-and-half,in equal parts",
  "恂 swin unfeigning,simple,unimpeded,fearful of,rdp. with respect and care",
  "慍 'junH nourish a grudge, feel resentment but not act on it, loathe",
  "慾 yowk crave;desire,lust",
  "憚 tanH shy away from, flinch, be wary, ~癉 exhaustion",
  "憚 tat ~怛 startle, alarm",
  "拒 gjoX resist, repudiate",
  "拒 kjuX defensive square (battle formation)",
  "擯 pjinH throw out, expel, ~儐 receive guests",
  "擾 nyewX throw into confusion, domesticated",
  "斐 phj+jX colorful, ornate",
  "杖 drjangX staff, hold onto, cudgel",
  "杞 khiX purple willow, wolfberry, boxtree",
  "桴 bjuw eave-purlin, short ridgepole projected under the eaves, ~泭 small raft, ~枹 mallet/drumstick",
  "梲 tsyjet stud on a roof beam",
  "殯 pjinH encoffin a corpse, final preparations for burial",
  "浸 tsimH leak, soak, irrigation, gradually",
  "浸 tshim 浸淫 yimtshim drench and douse, imperceptably advance",
  "瀆 duwk draining trough, overflow, be disrespectful to",
  "牆 dzjang wall of a building, funerary drape",
  "版 paenX woodenplanks used in framing walls, placard on which to inscribe characters, household register",
  "犂 lej plow, mottled, arrive at or reach a particular time, definitely",
  "狷 kwenH prudent;wary, nervous,impatient",
  "瑚 hu 珊瑚 sanhu coral, ritual vessel for sacrifical offerings",
  "疚 kjuwH chronic illness, sick with sadness, destitute",
  "皙 sek white",
  "硜 kheang onom. of stone being struck, rigid and obstinate",
  "祗 tsyij respectful, honor, only, merely, just; still, as before",
  "科 khwa category, article in legal code, protocol, capless",
  "窬 yu small door to the side of main gate, opening,aperture, hole, ~踰 pass over, climb beyond",
  "簞 tan bamboo food-basket, bin, caddy",
  "紫 tsjeX purple,lavendar-colour",
  "紺 komH deep purple-blue",
  "縕 'jun generative force, orange colour",
  "縕 'junH tag-/waste-silk, tangled, concel, contain",
  "繚 lew tie up, wrap up",
  "羔 kaw eanling, lambkin; kid",
  "耰 'juw harrow, implement to break up clods of earth",
  "肸 xit stir up, excute, activate",
  "莞 hwaenX lightly smiling, bulrushes",
  "莞 kwan kind of reed/bulrush",
  "葸 siX shrink back, shrink away",
  "裨 pjie supplement, fill out, ceremonial garb",
  "裨 bjie ceremonial garb, subordinate", 
  "訒 nyinH reserved or discreet in speech, guarded",
  "訕 sraenH slander,libel,calumniate,ridicule,mock,sneer",
  "貊 maek non-Chinese people to the north, quiet, without fuss, giant panda",
  "蹈 dawH tread, step on, stamp to rhythm",
  "躁 tsawH restless, disturbance",
  "輅 luH wagon, harness",
  "輗 ngej collar-bag of large carriage",
  "适 syek go to, marry, to be suited to, (ADV)just then, (ADV) happen",
  "适 tek to be devoted to, principal wife",
  "鄹 tsrjuw Zou (state)",
  "醫 'i medicine, physician",
  "醯 xej vinegar;sour",
  "釜 byuX cooking-pan, measure of capacity equiv. 64 pints",
  "陶 daw pottery, to mold, pleased, surname",
  "陶 yew well-pleased and elated, name",
  "雌 tshje female of birds, the feminine",
  "鞟 khwak ~鞹 shorn pelt, wrap round or bind up with leather",
  "鞠 kjuwk leather ball, bend/turn/flex, nurture, child/youth, entirely, all of",
  "韞 'junX store-away, preserve, hord; secrete, cache",
  "韶 dzyew music associated with sage-king Shun, spiny tropical fruit",
  "顓 tsywen untaught,ignorant, decent,honest.exclusively/without exception",
  "餲 'aejH putrid smell of spoiled food; carious",
  "饌 sjwenX old unit of cache",
  "饌 dzrjwenH set out, prepare, provide (fine) food.",
  "駢 ben pull (horses) side by side, parallel, to put hosues side by side.",
  "騫 khjen defect, fault, scared, pick out.",
  "鮀 da the goby, a catfish, alligator.",
  "默 mok soundless, darkened.",
  "璉 ljenX vessel for sacrificial offerings",
  "璉 ljen ~連 join/link/connect-up",
  "愿 ngjwonH devoted to, diligent; attentive, careful, prudent.",
  "騂 sjeng a roan horse",
  "軏 ngjwot collar-bar of small carriage",
  "匵 duwk ~櫝 casket/coffin",
  "阼 dzuH east-side steps of great hall, ~祚 dynastic or lineage destiny.",
  "悱 phj+jX frustrated by being at a loss for words",
  "潤 nywinH moist(en); luster, lustrous; sheen, sleek. rain; freshen, as with necessary moisture. enrich, embellish, enhance; revise, improve; e.g. 潤飾 rùnshī, enrich and adorn, esp. lit. composition.",
  "皦 kewX white, pure; surname Jiao",
  "踧 tsjuwk (bn.) 踧踖 (MC tsjuwk-tsjek), discomfited, nonplused; attentive but anxious, polite but fretful. ~蹙, wrinkled, cramped; 2, pressing, imminent ~蹴, trample; 2, kick.",
  "踧 dek flat and smooth, wrinkled, attentive",
  "煥 xwanH iridescent",
  "濫 lamH brim over, overflow, excessively",
  "校 haewH schools in noble estates, military formation of 500 men, ~效 imitate",
  "校 kaewH compare, dispute, reckon, animal enclosure",
  "黻 pyut labris pattern embroidered in ceremonial robes, ~韍, knee-coverings worn by nobles at sacrificial offerings in early times ~紱 fú1, silk waistband upon which to tie pendant gems or seal-cords.",
  "忮 tsyeH object to, be hostile to, intractable",
  "繹 yek unwind raw silk from cocoon, follow a single thread, to list out item by item",
  "奡 ngawH ~傲 high-borne, high-held; haughty, proud. (bn.) 燾奡 (dawH-ngawH) tower upwards.",
  "鼗 daw small drum with two attached beaters",
  "杇 'u ~圬 to plaster,roughcast",
  "盼 pheanH clear-set eyes, with the white and iris distinct", 
  "躩 kjwak briskly stepping, to bound",  
  "沛 phajH marshy plant-cover, watery excess, racing onward",
  "蹜 sruwk walk carefully",
  "涖 lejH ~蒞 to attend, to arrive, drying up of water,to manage/supervise",
  "坫 temH stand or sideboard where cups were placed upside-down after use.",
  "牟 mjuw bellow (ox), confiscate, enlarge ~侔 equal to, same as, like unto ~眸 pupil (of eye) ~麰 barley",
  "迅 swinH quickly,suddenly",
  "腥 seng raw meat,putrid,grease",
  "訐 kjet expose another's faults, gossip",
  "襁 kjangX  sling for infant, swaddling clothes, cord on which cash is strung",
  "閾 xwik threshold,doorsill, borderland",
  "陪 bwoj piled on top of one-another, accompany, assist",
  "緅 tsuw magenta-coloured silk",
  "沽 ku sell,vend,advertise",
  "沽 kuX wine-vender, approximately",
  "蓧 dek basket for carrying grainseed",
  "蓧 dewH bamboo basket for carrying cut weeds",
  "蓧 thew yellow-dock,curly-dock",
  "憮 mjuX rueful, despairing ~嫵, appealing, likeable",
  "燧 zwijH fire-kindler, beacon-fire",
  "鏗 kheang onom. sound of bells",
  "悾 khuwng drup. innocent",
  "踖 dzjek to march ahead ",
  "踖 tsjek advance carefully",
  "盪 dangX assail, throw oneself against, ~蕩 shake, disoldge",
  "繪 hwajH colors neatly coordinated",
  "覿 dek see,notice,appear,be seen",
  "磷 lin ~粼 clear-cut",
  "涅 net blac mudge, alum used in dying, block up",
  "杼 drjoX shuttle of a loom , narrow, thin", 
  "杼 zyoX sawtooth oak", 
  "爲 hjwe (為) make, do, act as", 
  "琢 traewk to polish", 
  "齡 leng age, duration", 
  "梨 lij pear", 
  "紊 mjunH disorderly, confused", 
  "詁 kuX comment, explain", 
  "遜 swonH humble, inferior, to flee", 
  "嬴 yeng fullness, surplus, vanquish", 
  "莽 mangX thick weeds, luxurious growth", 
  "迄 xj+t to reach, until, as yet", 
  "統 thuwngX beginning of ball+thread; clue, succession; sequence, govern;conduct;lead", 
  "混 hwonX heaving water, muddy; murky, confused;jumbled;mixed", 
  "紛 phjun flag streamers, tangled threads, confused", 
  "禎 trjeng auspicious, good omen", 
  "蒞 lijH (混) to look down on;manage, verge on, splash",
  "祚 dzuH celestial favour, (祚)royal throne",
  "洪 huwng vast, flood", 
  "闖 trhjimH rush in, charge in", 
  "靖 dzjengX respectful;polite, delicate", 
  "靖 tsjeng (靖) to signal; to honor", 
  "廿 nyip twenty", 
  "錐 tsywij awl", 
  "掛 kweaH suspend, be worried about, catch/snare", 
  "灝 hawX limitless, (皓) gleaming white;shimmering", 
  "衆 tsyuwngH (眾) multitude, throng", 
  "瑩 hjwaeng polished, set a bright stone in place, elucidate", 
  "泌 bjit bubble up", 
  "釀 nrjangH to brew;ferment, incite", 
  "裕 yuH ample;abundant, wide;diffuse;magnanimous", 
  "嬴 yeng fullness;plentitude, vanquish;excel, be in charge of",
  "併 pjiengH conjoin;combine, together;both",
  "併 pjeng (屏) to screen off; block, remove",
  "篡 tsrhwaenH to sieze, take forcibly",
  "茲 tsi this;these, increasingly; more and more, year, reed mat",
  "茲 dzi 龜茲 (MC khjuw-dzi), Kucha, oasis city on the northern Silk Road in the Tarim Basin (popular because of its music + instruments).",
  "經 keng classic",
  "普 phuX universal,all",
  "屁 phijH fart",
  "暐 hj+jX (literary) abundant appearance of light",
  "耒 lwijX plow",
  "耒 lwojH plow",
  "瀟 sew (of water) deep and clear",
  "遙 yew distant, far away",
  "睛 tsjeng eyeball, vision",
  "駐 trjuH pause, halt; garrison, defend, guard",
  "涉 dzyep to go through, to wade, to involve",
  "扑 phuwk strike, beat, tap",
  "拘 kuw bent, buckled",
  "拘 kju seize, apprehend",  
  "慊 khemX to resent, to be dissatisfied",
  "槁 khawX to wither, to die out",
  "耘 hjun to weed",
  "炳 pjaengX to gleam, to light up",
  "X X -",
  "Y Y -",
  "参 srim the constellation Orion’ (named for the three stars in Orion’s belt)",
  "盧 lu earth-black, brazier, skull",
  "鵷 jwon species of phoenix",
  "楝 lenH chinaberry tree",
  "醴 lejX sweet liquor",
  "鵷 'jwon species of phoenix",
  "姚 yew graceful",
  "梧 ngu parasol tree",
  "鶵 dzrju fledgling (雛)",
  "鼐 nojH great-sized cauldron",
  "桐 duwng paulownia (tall deciduous hardwood tree)",
  "笥 siH bamboo hamper",
  "曳 yejH drag, drape, fatigued",
  "刎 mjunX cut one's throat, esp. suicide",
  "内 nwojH inside, within area, esoteric",
  "内 nop (納) enter, pass into",
  "梧 ngu Chinese parasol tree",
  "桐 duwng various trees related to the tung tree",
  "隐 'j+nX conceal(ment), hide away, obscure",
  "隐 'j+nH lean on, rest against",
  "儵 syuwk black, white flash in darkness",
  "滄 tshang iron gray-blue, cold, chilly",
];

for (var i = 0; i < easyvalues.length; i++) {
    var value = easyvalues[i];
    var split_index1 = 1;
    var split_index2 = value.indexOf(" ", 2);
    var char = value[0];
    var mc = value.substr(2, split_index2 - 2);
    var rest = value.substr(split_index2 + 1);
    values.push([char,"",mc,"","",rest]);
}



var preferred_keys = {
  "別":"pjet",
  "參":"srim",
  "曾":"tsong",
  "重":"drjowngX",
  "處":"tsyhoX",
  "吹":"tsyhwe",
  "出":"tsyhwit",
  "大":"daH",
  "彈":"dan",
  "道":"dawX",
  "斷":"twanX",
  "度":"duH",
  "惡":"'uH",
  "分":"pjun",
  "風":"pjuwng",
  "夫":"pju",
  "父":"bjuX",
  "復":"bjuwH",
  "更":"kaengH",
  "貫":"kwanH",
  "行":"haeng",
  "好":"xawH",
  "荷":"haX",
  "後":"huwX",
  "華":"hwae",
  "幾":"kj+jX",
  "將":"tsjang",
  "覺":"kaewk",
  "教":"kaew",
  "盡":"dzinX",
  "近":"gj+nH",
  "居":"kjo",
  "足":"tsjowk",
  "豈":"khj+jX",
  "看":"khanH",
  "空":"khuwng",
  "會":"hwajH",
  "勞":"law",
  "離":"lje",
  "龍":"ljowng",
  "能":"nong",
  "傍":"bangH",
  "平":"bjaeng",
  "妻":"tshejH",
  "潛":"dzjem",
  "强":"gjang",
  "請":"tshjengX",
  "去":"khjoH",
  "卷":"kjwenX",
  "三":"sam",
  "散":"sanH",
  "少":"syewX",
  "深":"syim",
  "生":"sraeng",
  "勝":"syingH",
  "乘":"zying",
  "識":"tsyiH",
  "適":"syek",
  "樹":"dzyuH",
  "食":"zyik",
  "所":"srjoX",
  "望":"mjangH",
  "為":"hjwe",
  "於":"'jo",
  "下":"haeX",
  "天":"then",
  "間":"kean",
  "鄉":"xjang",
  "相":"sjang",
  "宿":"sjuwk",
  "還":"hwaen",
  "樂":"lak",
  "衣":"'j+j",
  "隱":"'j+nX",
  "予":"yo",
  "雨":"hjuX",
  "語":"ngjoX",
  "與":"yoX",
  "藏":"dzang",
  "長":"drjang",
  "丁":"teng",
  "重":"drjowngX",
  "中":"trjuwng",
  "從":"dzjowng",
  "坐":"dzwaX",
  "治":"driH",
  "杼":"drjoX",
  "靖":"dzjengX",
  "茲":"tsi",
  "反":"pjonX",
  "折":"tsyet",
  "應":"'ing",
  "且":"tshjaeX",
  "頸":"kjiengX",
  "令":"ljengH",
};

//values.push(["","",""]);


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
          
          Logger.log("picking "+preferred_keys[c]+" for " + c+".");
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

const extra_vowel = "ų";
const vowels = "aeıou"+extra_vowel;
const vowels_raise = "\u0301";
const vowels_lower = "\u0300";
const vowels_hold = "\u0304";

const retroflex = "\u0323";
const palatize = "\u032F";


var tone_ize = function(str,forcetone){
    console.log(str,forcetone);
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

function TABLE_PRETTIFY_TONES(vs){
  var vs_ar=vs.split(" ");
  var result=[];
  for (var i=0;i<vs_ar.length;i++){
    var v=vs_ar[i];
    v=v.replace(/\+/g,extra_vowel);
    
    v = v.replace(/i/g,"ı");
    v = v.replace(/j/g,"ȷ");
    
    result.push(tone_ize(v,false));
  }
  return result.join(" ");;
}

var transliterate_char = function(c, mc, old_chinese,forcetone){
  if (c==="。"){
    return ".";
  }
  if (c==="\n"){
    return "\n";
  }
  if (c==="，"){
    return ",";
  }
  if (c==="."){
    return ".";
  }
  
  var result="";
  if (dict.hasOwnProperty(c)){
    var entry = dict[c];
    //Logger.log("entry looks like " +  JSON.stringify(entry));
    if (entry.hasOwnProperty(mc)){
      var v = (old_chinese===true)?entry[mc][1]:mc;      
      v=v.replace(/\+/g,extra_vowel);
        
      v = v.replace(/i/g,"ı");
      v = v.replace(/j/g,"ȷ");
      
      result = tone_ize(v,forcetone);
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
  
//  Logger.log("transliterating "+input);
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
//        Logger.log("looking to access"+s+" "+dict[s]);
      if (dict[s]==null){
        throw "no dictionary entry for " + s;
      }
      var mc_keys = Object.keys(dict[s]);
      
      
      if (!detailliert && mc_keys.length>1 && (s in preferred_keys)){
        
        Logger.log("picking "+preferred_keys[s]+" for " + s+".");
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
        //Logger.log(transliterated);
        result.push(transliterated);
      }
    }
    
  }
  result = capitalise(result.join(" ").replace(/\ \./g,"."));
  // result = result.replace(/t/g,"ᴛ");
  // result = result.replace(/h/g,"ʜ");
  return result;
}

function add_table_translations(){
//   Logger.log("reformatting");
  var anki_workpage = hauptsheet.getActiveSheet();
  var col = anki_workpage.getRange("B:B");
  
  var display_chars_col = anki_workpage.getRange("F:F");
  
  var anki_range = anki_workpage.getDataRange();
  var anki_values = anki_range.getValues();
  

  var targetarray=[["MC"]];
  var targetarray_display_chars=[["Anzeigezeichen"]];
  var errors="";
  for (var i=2;i<=anki_values.length;i++){

    var replacewith = anki_values[i-1][0];
    try{
      var newval = TRANSLITERATE(replacewith,false);
    } catch (e){
      errors += e + "\n";
    }
    // Logger.log([i,replacewith,newval]);
    targetarray.push([newval]);  
    
    targetarray_display_chars.push([replacewith.replaceAll(vowels_raise,"").replaceAll(vowels_lower,"").replaceAll("'","").replaceAll(vowels_hold,"").replace(/\[.*\]/g,"")]);
  }
  col.setValues(targetarray);
  
  display_chars_col.setValues(targetarray_display_chars);
  
  if (errors.length>0){
    throw errors;
  }
  
  
}

function TABLE_HANSI_TO_MC(str){
  var result=[];
  for (var i=0;i<str.length;i++){
    var char=str[i];
    if (char in dict){      
      var mc_keys = Object.keys(dict[char]);
      var entry = mc_keys.join("/");
      result.push(entry);
    } else {
      result.push(char);
    }
  }
   return result.join(" ");
}

function add_table_definitions(){
//   Logger.log("reformatting");
  var anki_workpage = hauptsheet.getActiveSheet();
  var col = anki_workpage.getRange("C:C");
  
  
  var anki_range = anki_workpage.getDataRange();
  var anki_values = anki_range.getValues();
  

  var targetarray=[["MC"]];
  for (var i=2;i<=anki_values.length;i++){

    var replacewith = anki_values[i-1][0];
    var oldval = anki_values[i-1][2];
    var newval = TRANSLATE(replacewith);
    
    //i don't know hwhat to do about this - some sentences in the classical chinese book have good translations that are more helpful than per-word translations.
    //if (replacewith.length>2 ){
    //  newval=oldval;
    //}

    // Logger.log([i,replacewith,newval]);
    targetarray.push([newval]);  
    
  }
  
  col.setValues(targetarray);
  
  
  
}