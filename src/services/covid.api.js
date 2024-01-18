const axios = require("axios");

//use your apikey (get https://rapidapi.com/api-sports/api/covid-193/) here or .envfile
const ApiKey= process.env.RAPID_API_KEY;

const ApiHost='covid-193.p.rapidapi.com';
const ApiStatUrl = 'https://covid-193.p.rapidapi.com/statistics'
const ApiCountryUrl = 'https://covid-193.p.rapidapi.com/countries'

let service = {};

service.getByCountry = (country) => {
    return axios.request({
            headers: {
                'X-RapidAPI-Key': ApiKey,
                'X-RapidAPI-Host': ApiHost
            },
            method: 'GET',
            url: ApiStatUrl,
            params: {country: country},
        })
};

service.getCountryList = () => {
    return axios.request({
        headers: {
            'X-RapidAPI-Key': ApiKey,
            'X-RapidAPI-Host': ApiHost
        },
        method: 'GET',
        url: ApiCountryUrl
    })
}

module.exports = service;


