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

///////////////////
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
    if(ALPHABET.includes(letter.toUpperCase())){
        console.warn(true, 'english letter: ', letter);
        return true;
    } else {
        console.warn(false, 'not english: ', letter);
        return false;
    }

}

async function getListByLetter(letter){
    let LetterList = {};
    let letterIndex = 0;

    await isEnglish(letter);

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


bot.hears(/.*/, async (context) => {
    let country = context.message.text;
    let check = await checkList(country.toString());
    const apiResponse = await covidService.getByCountry(country);

    const { response, error, results } = apiResponse.data;

    if(country.length === 1){
        if(await isEnglish(country)){
            let LetterList = await getListByLetter(country);
            let msg = getMessageReplyLetterList(LetterList);
            context.reply(`${country.toUpperCase()}-letter country names: \n\n${msg}`);
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
    return `${response.country} (${response.continent}), population: ${response.population}\n
Cases:\n new: ${response.cases.new},\n active: ${response.cases.active}, \n critical: ${response.cases.critical},\n recovered: ${response.cases.recovered},\n total: ${response.cases.total},\n
Deaths:\n new: ${response.deaths.new},\n total: ${response.deaths.total},\n
Tests:\n total: ${response.tests.total},\n
Date: ${response.day}`;
}


bot.launch()
    .then(result => {
        const date = new Date();
        console.log(`Bot started ${date}`);
    })
    .catch((error) => console.log("bot.launch() .catch ERROR: ", error));

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));