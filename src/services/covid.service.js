const covidAPI = require('./covid.api.js');
const helpers = require('./helper.js');

let service = {};
let List = {};

//+
service.countryData = async (countryName) => {
    const apiResponse = await covidAPI.getByCountry(countryName)
      //object
    return apiResponse.data;
}

//+
service.letterList = async (letter) => {
    let LetterList = {};
    let letterIndex = 0;

    if(helpers.isEmptyObject(List)) {
        const data = await service.getCountryList() //object
        const { response } = data;
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

//+
service.getCountryList = async () =>{
    const apiResponse = await covidAPI.getCountryList();
    return apiResponse.data;
}

service.isCountryOnList = async (country) => {
    let check = false;

    if(helpers.isEmptyObject(List)){
        const data = await service.getCountryList(); //object
        const { response } = data; //object
        List = response;
    }

    for (let index in List){
        if(List[index].toLowerCase() === country.toLowerCase()){
            check = true;
            break;
        }
        check = false
    }
    return check;
}


module.exports = service;