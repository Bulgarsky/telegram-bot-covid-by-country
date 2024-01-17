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
    if(country.length === 1) return true;
}

module.exports = helper;