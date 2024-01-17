const CovidService = require("./covid.service.js");
const ALPHABET = [
    'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P',
    'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L',
    'Z', 'X', 'C', 'V', 'B', 'N', 'M'
]
let List = {};
helper = {}

helper.isEmptyObject = (obj) => {
    for (const prop in obj) {
        if (Object.hasOwn(obj, prop)) {
            return false;
        }
    }
    return true;
}

helper.isEnglish = (letter) => {
    return ALPHABET.includes(letter.toUpperCase());
}

helper.isOnList = async (country) => {
    let check = false;
    const apiResponse = await CovidService.countryList(); //object
    const { response } = apiResponse.data; //object

    if(helper.isEmptyObject(List)){
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

module.exports = helper;