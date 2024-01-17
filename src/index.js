require("dotenv").config();
const { Telegraf } = require('telegraf');
const covidService = require('./services/covid');
const CovidService = require('./services/covid.service.js');
const Helpers = require('./services/helper.js');
const Message = require('./services/Message.service.js');

//use your telegram apikey here (get from @botfather)
const bot = new Telegraf(process.env.BOT_APY_KEY);

let List = {};

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

//is country on list?
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

bot.hears(/.*/, async (context) => {
    let country = context.message.text;
    let check = await checkList(country.toString());
    let { response, error, results } = await CovidService.countryData(country);

    if(country.length === 1){
        //if send 1 letter
        if(Helpers.isEnglish(country)){
            let letterList = await CovidService.letterList(country);

            if(Helpers.isEmptyObject(letterList)){
                context.reply(`Countries That Start With The Letter ${country.toUpperCase()} not found!\n\n But YOU can read that: https://www.worldatlas.com/articles/countries-that-start-with-the-letter-x.html`);
            }else{
                let msg = Message.getListByLetter(letterList);
                context.reply(`Countries That Start With The Letter "${country.toUpperCase()}": \n\n${msg}`);
            }

        } else {
            context.reply("Please, use english letters");
        }

    } else if (results === 1){
        let msg = Message.getCountryStats(response[0]);
        context.reply(msg);

    } else {
        if (!check) {
            context.reply(`List have ${List.length} countries`);
            context.reply(`Bad request! Country "${country.toLowerCase()}" not found. \n /help`);
        }
    }
});


bot.launch()
    .then(result => {
        const date = new Date();
        console.log(`Bot started ${date}`);
    })
    .catch((error) => console.error("bot.launch() .catch ERROR:\n", error));


// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));