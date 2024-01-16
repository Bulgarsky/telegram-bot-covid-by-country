require("dotenv").config();
const { Telegraf } = require('telegraf');
const covidService = require('./services/covid');

//use your telegram apikey here (get from @botfather)
const bot = new Telegraf(process.env.BOT_APY_KEY);

let List = {};
const ALPHABET = [
    'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P',
    'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L',
    'Z', 'X', 'C', 'V', 'B', 'N', 'M'
]


bot.start((context) => {
    const userFirstName = context.update.message.from.first_name;
    context.reply(`Hello, ${userFirstName} click to /help to get instruction`);
});

bot.help( (context) =>{
    context.reply(`
    Send Country name or First letter any case. Example:
        Russia
        china
        USA
        Z
        e
    `);
});

async function checkList(country){
    let check = false;
    const apiResponse = await covidService.getCountryList(); //object
    const { response } = apiResponse.data; //object

    if(!List.length){
        List = response;
    }

    for (let index in response){
        if(response[index].toLowerCase() === country.toLowerCase()){
            check = true;
            break;
        }
        check = false
    }
    return check;
}

async function isEnglish(letter){
    return ALPHABET.includes(letter.toUpperCase());
}

async function getListByLetter(letter){
    let LetterList = {};
    let letterIndex = 0;

    if(!List.length){
        const apiResponse = await covidService.getCountryList();  //object
        const { response } = apiResponse.data; //object
        List = response;

    } else {

        for (let index in List){

            if(List[index].toLowerCase().slice(0, 1).toUpperCase() === letter.toUpperCase()){
                let key = letter + letterIndex;
                LetterList[key] = List[index];
                letterIndex += 1;
            }
        }
    }

    return LetterList;
}

function isEmptyObject(obj) {
    for (const prop in obj) {
        if (Object.hasOwn(obj, prop)) {
            return false;
        }
    }

    return true;
}

bot.hears(/.*/, async (context) => {
    let country = context.message.text;
    let check = await checkList(country.toString());
    const apiResponse = await covidService.getByCountry(country);

    const { response, error, results } = apiResponse.data;

    if(country.length === 1){
        if(await isEnglish(country)){
            let LetterList = await getListByLetter(country);

            if(isEmptyObject(LetterList)){
                context.reply(`Countries That Start With The Letter ${country.toUpperCase()} not found!\n\n But YOU can read that: https://www.worldatlas.com/articles/countries-that-start-with-the-letter-x.html`);
            }else{
                let msg = getMessageReplyLetterList(LetterList);
                context.reply(`Countries That Start With The Letter "${country.toUpperCase()}": \n\n${msg}`);
            }

        } else {
            context.reply("Please, use english letters");
        }

    } else if (results === 1){
        let msg = getMessageReplyByCountry(response[0]);
        context.reply(msg);

    } else {
        if (!check) {
            context.reply(`List have ${List.length} countries`);
            context.reply(`Bad request! Country "${country.toLowerCase()}" not found. \n /help`);
        }
    }
});

function getMessageReplyLetterList(countryList){
    let countryString = "";
    for(let key in countryList){
        countryString += `${countryList[key]}, `;
    }
    return countryString;
}

function getMessageReplyByCountry(response){
    let {
        country,
        continent,
        population,
        day: date,
        cases: {
            new: newCases, active: activeCases, critical:critCases, recovered: recoveredCases, total: totalCases
        },
        deaths: {
            new: newDeaths, total: totalDeaths
        },
        tests: {
            total: totalTests
        }
    } = response;



    let msg = `${country} (${continent}), population: ${population}\n
Cases:\n new: ${newCases},\n active: ${activeCases}, \n critical: ${critCases},\n recovered: ${recoveredCases},\n total: ${totalCases},\n
Deaths:\n new: ${newDeaths},\n total: ${totalDeaths},\n
Tests:\n total: ${totalTests},\n
Date: ${date}`;

    return msg;
}


bot.launch()
    .then(result => {
        const date = new Date();
        console.log(`Bot started ${date}`);
    })
    .catch((error) => console.error("bot.launch() .catch ERROR:\n", error));


// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));