require("dotenv").config();
const { Telegraf } = require('telegraf');
const covidService = require('./services/covid');

//use your telegram apikey here (get from @botfather)
const bot = new Telegraf(process.env.BOT_APY_KEY);

let List = {};

///////////////////
bot.start((context) => {
    const userFirstName = context.update.message.from.first_name;
    context.reply(`Hello, ${userFirstName} click to /help to get instruction`);
});

bot.help( (context) =>{
    context.reply(`
    Send Country name any case. Example:
        Russia
        China
        usa
    or send first letter. Example:
        a
        F
    `);
});

async function checkList(country){
    let check = false;
    const countriesList = await covidService.getCountryList(); //typeof countriesList object
    const { response } = countriesList.data; //typeof response:  object

    if(!List.length){
        List = response;
    }

    for (let index in response){
        if(response[index].toLowerCase() === country.toLowerCase()){
            //console.log(`${response[index]} found in list`);
            //console.log("response[index]: ", response[index]);
            check = true;
            break;
        }
        check = false
    }
    return check;
}

async function getListByLetter(letter){
    let LetterList = {};
    let letterIndex = 0;

    if(!List.length){
        const countriesList = await covidService.getCountryList();  //typeof countriesList object
        const { response } = countriesList.data; //typeof response:  object
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
    //console.log("Letter list: ", LetterList);
    return LetterList;
}


bot.hears(/.*/, async (context) => {
    let country = context.message.text;
    let check = await checkList(country.toString());
    const apiResponse = await covidService.getByCountry(country);
    //console.log("api: \n", apiResponse.data)
    const { response, error, results } = apiResponse.data;

    if(country.length === 1){
        const LetterList = await getListByLetter(country);
        let msg = getMessageReplyLetterList(LetterList);
        //console.log(`it was send Letter ${country.toUpperCase()}`);
        context.reply(`${country}-letter country names:\n\n${msg}`);
        // context.reply(msg);

    } else if (results === 1){
        // console.log(`results = 1, Country "${country}" Found!`)
        //console.log(`response. Country "${country}" \n`, response);
        //context.reply(`Covid statistics of ${country.toUpperCase()}:`);
        let msg = getMessageReplyByCountry(response[0]);
        context.reply(msg);

    } else {
        // console.log(`results = 0, Country "${country}" Not Found.`);
        // console.log(`api errors: `, error);
        if (!check) {
            context.reply(`List have ${List.length} countries`);
        }
        context.reply(`Bad request! Country "${country.toLowerCase()}" not found. \n /help`);
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