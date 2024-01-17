require("dotenv").config();
const { Telegraf } = require('telegraf');
const covidService = require('./services/covid.api'); //del
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


bot.hears(/.*/, async (context) => {
    let country = context.message.text;

    //LETTER
    if(Helpers.isLetter(country) && Helpers.isEnglish(country)) {
        let letterList = await CovidService.letterList(country);

        //LIST EMPTY
        if (Helpers.isEmptyObject(letterList)) {
            context.reply(`Countries That Start With The Letter ${country.toUpperCase()} not found!\n\n But YOU can read that: https://www.worldatlas.com/articles/countries-that-start-with-the-letter-x.html`);
        }
        else {
            //LIST
            let msg = Message.getListByLetter(letterList);
            context.reply(`Countries That Start With The Letter "${country.toUpperCase()}": \n\n${msg}`);
        }
        //LETTER NOT ENGLISH
    } else if (!Helpers.isEnglish(country)) {
        context.reply("Please, use english letters");

        //COUNTRY FOUND IN LIST
    } else if(await CovidService.isCountryOnList(country)){
            let { response, error, results } = await CovidService.countryData(country);
            let msg = Message.getCountryStats(response[0]);
            context.reply(msg);
        } else {
            //NOT FOUND
            context.reply(`List have ${List.length} countries`);
            context.reply(`Bad request! Country "${country.toLowerCase()}" not found. \n /help`)
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