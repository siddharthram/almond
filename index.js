"use strict";

const Tp = require('thingpedia');

const URL = 'http://thecatapi.com/api/images/get?api_key=<YOUR-API-KEY>&format=xml&type=jpg,png';

module.exports = class CatAPIDevice extends Tp.BaseDevice {
    /* 
    A query function called "get", which returns $count number of cat pictures
    the "get" before the underscore tells the system this is a "query" function instead of an "action" function
    the "get" after the underscore indicates the name of the function
    */
    get_get({ count }) {
        count = count || 1;
        const url = URL + '&results_per_page=' + count;
        // Tp.Helpers.Http provides wrappers for nodejs http APIs with a Promise interface
        // In this case an HTTP GET request is sent and it returns a Promise of the result
        return Tp.Helpers.Http.get(url).then((result) => Tp.Helpers.Xml.parseString(result))
        .then((parsed) => {
            const array = parsed.response.data[0].images[0].image;
            // All queries always return an array. Here we use Array.prototype.map() to create a new Array
            return array.map((image) => {
                return { image_id: image.id[0], 
                         picture_url: image.url[0],
                         link: 'http://thecatapi.com/?id=' + image.id[0] };
            });
        });
    }
};
