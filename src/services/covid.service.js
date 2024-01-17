const covidAPI = require('./covid.js');
const covidService = require("./covid");
const helpers = require('./helper.js');
let service = {};

let List = {};
//+
service.countryData = (countryName) => {
    const apiResponse = covidAPI.getByCountry(countryName)
    const { response: stats } = apiResponse.data;  //object

    return stats;
}

//+
service.letterList = async (letter) => {
    let LetterList = {};
    let letterIndex = 0;

    if(helpers.isEmptyObject(List)) {
        const apiResponse = await covidService.getCountryList() //object
        const { response } = apiResponse.data; //object
        List = response;
    }

    for (let index in List){
        if(List[index].toLowerCase().slice(0, 1).toUpperCase() === letter.toUpperCase()){
            let key = letter + letterIndex;
            LetterList[key] = List[index];
            letterIndex += 1;
        }
    }
    return LetterList;
}

module.exports = service;