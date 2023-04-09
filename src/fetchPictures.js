"use strict";
import axios from "axios";

const API_KEY = '35060250-d524e63ae3659c305fff44fad';
const BASE_URL = 'https://pixabay.com/api/';

export const fetchPictures = async (name, pageNumber) => {
    try {
        return await axios.get(`${BASE_URL}`, { //через бібліотеку axios (самостійно переводить дані із формату JSON у JS і навпаки; вміє ловити помилки)
        params: {
            key: API_KEY,
            q: name,
            image_type: 'photo',
            orientation: 'horizontal',
            safesearch: true,
            page: pageNumber,
            per_page: 40,
        },
    });
    } catch(error) {
        throw new Error(error.message);
    }
    
    // Звичайним методом (працює):
    // return fetch(`${BASE_URL}?key=${API_KEY}&q=${name}&image_type=photo&orientation=horizontal&safesearch=true&page=${pageNumber}&per_page=4`)
    //     .then(response => {
    //         if(!response.ok) {
    //             throw new Error (response.status);
    //         }
    //         return response.json();  
    //     });
}