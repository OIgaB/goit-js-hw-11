"use strict";

const API_KEY = '35060250-d524e63ae3659c305fff44fad';
const BASE_URL = 'https://pixabay.com/api/';
let pageNumber = 1;

export const fetchPictures = (name) => {
     
    return fetch(`${BASE_URL}?key=${API_KEY}&q=${name}&image_type=photo&orientation=horizontal&safesearch=true&page=${pageNumber}&per_page=4`)
        .then(response => {
            if(!response.ok) {
                throw new Error (response.status);
            }
            pageNumber += 1;
            return response.json();  
        });
}
//У разі пошуку за новим ключовим словом, значення page потрібно повернути до початкового, 
//оскільки буде пагінація по новій колекції зображень.