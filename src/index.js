"use strict";
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import {fetchPictures} from './fetchPictures';
import galleryCardTemplate from './gallery.hbs';

let searchQuery = '';

const searchForm = document.querySelector('#search-form');
const galleryContainer = document.querySelector('.gallery');

searchForm.addEventListener('submit', handleFormSubmit);

function handleFormSubmit (event) {
    event.preventDefault();
    searchQuery = event.currentTarget.elements.searchQuery.value.trim();
    galleryContainer.innerHTML = "";  //Для пошуку за новим ключовим словом, очищуємо вміст галереї
    fetchPictures(searchQuery).then(({hits}) => {
        if(hits.length === 0) {
            Notify.failure('Sorry, there are no images matching your search query. Please try again.');
        } 
        galleryContainer.insertAdjacentHTML('beforeend', galleryCardTemplate(hits));
    }).catch(console.log);
}

//В початковому стані кнопка повинна бути прихована.
//Після першого запиту кнопка з'являється в інтерфейсі під галереєю.
//При повторному сабміті форми кнопка спочатку ховається, а після запиту знову відображається.
