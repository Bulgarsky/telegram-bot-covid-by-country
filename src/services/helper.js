const ALPHABET = [
    'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P',
    'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L',
    'Z', 'X', 'C', 'V', 'B', 'N', 'M'
]

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

helper.isLetter = (country) => {
    return country.length === 1;
}

helper.checkInputText = (text) => {
    if (helper.isLetter(text) && helper.isEnglish(text)) {
        return "EnglishLetter";
    } else if(helper.isLetter(text) && !helper.isEnglish(text)){
        return "NotEnglishLetter"
    } else if(!helper.isLetter(text)){
        return "NotLetter"
    }
}

helper.worldAtlas = (letter) => {
    return `https://www.worldatlas.com/articles/countries-that-start-with-the-letter-${letter}.html`
}

module.exports = helper;