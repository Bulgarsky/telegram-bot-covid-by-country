let service = {};

//return string - country statistic
service.getCountryStats = (countryData) => {
    let {
        country,
        continent,
        population,
        day: date,
        cases: {
            new: newCases, active: activeCases, critical:critCases, recovered: recoveredCases, total: totalCases
        },
        deaths: {
            new: newDeaths, total: totalDeaths
        },
        tests: {
            total: totalTests
        }
    } = countryData;

    return `${country} (${continent}), population: ${population}\n
Cases:\n new: ${newCases},\n active: ${activeCases}, \n critical: ${critCases},\n recovered: ${recoveredCases},\n total: ${totalCases},\n
Deaths:\n new: ${newDeaths},\n total: ${totalDeaths},\n
Tests:\n total: ${totalTests},\n
Date: ${date}`;
}

//return string - country list
service.getListByLetter = (countryList) => {
    let countryString = "";
    for(let key in countryList){
        countryString += `${countryList[key]}, `;
    }
    return countryString;
}

module.exports = service;