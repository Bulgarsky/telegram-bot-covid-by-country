require("dotenv").config();
const { Telegraf } = require('telegraf');
const CovidService = require('./services/covid.service.js');
const Helpers = require('./services/helper.js');
const Message = require('./services/Message.service.js');

//use your telegram apikey here (get from @botfather)
const bot = new Telegraf(process.env.BOT_APY_KEY);

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

    switch (Helpers.checkInputText(country)){
        case "NotLetter":
            if(await CovidService.isCountryOnList(country)){
                //COUNTRY FOUND IN LIST
                let { response, error, results } = await CovidService.countryData(country);
                let msg = Message.getCountryStats(response[0]);
                context.reply(msg);
            } else {
                //COUNTRY NOT FOUND IN LIST
                context.reply(`Bad request! Country "${country.toUpperCase()}" not found.\n\nClick to /help for get instruction`)
            }
            break;

        case "NotEnglishLetter":
            context.reply("Please, use english letters");
            break;

        case "EnglishLetter":
            let letterList = await CovidService.letterList(country);
            if (Helpers.isEmptyObject(letterList)) {
                //LIST EMPTY
                context.reply(`Countries That Start With The Letter ${country.toUpperCase()} not found!\n\n But YOU can read that: https://www.worldatlas.com/articles/countries-that-start-with-the-letter-x.html`);
            }
            else {
                //LIST NOT EMPTY
                let msg = Message.getListByLetter(letterList);
                context.reply(`Countries That Start With The Letter "${country.toUpperCase()}": \n\n${msg}`);
            }
            break;
        default:
            console.warn("Switch/default. Event has not been processed. input: ", country)
            context.reply("Switch/default. Event has not been processed. input: ", country);
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