"use strict";
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import {fetchPictures} from './fetchPictures';
import galleryCardTemplate from './gallery.hbs';

let searchQuery = '';
let pageNumber = null;

const searchForm = document.querySelector('#search-form');
const galleryContainer = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');


searchForm.addEventListener('submit', handleFormSubmit);
loadMoreBtn.style.display = "none";



function handleFormSubmit (event) {
    event.preventDefault();
    searchQuery = event.currentTarget.elements.searchQuery.value.trim();
    galleryContainer.innerHTML = "";  //Для пошуку за новим ключовим словом, очищуємо вміст галереї

    pageNumber = 1;
    fetchPictures(searchQuery, pageNumber)
        .then((data) => {
            if(data.hits.length === 0) {
                Notify.failure('Sorry, there are no images matching your search query. Please try again.');
            } 
            galleryContainer.insertAdjacentHTML('beforeend', galleryCardTemplate(data.hits));
            Notify.success(`Hooray! We found ${data.totalHits} images.`);
        


    

            const imagesCardsSet = document.querySelectorAll('.photo-card'); //контейнер для зображення і підписів
            imagesCardsSet.forEach(imageCard => {
                imageCard.style.cssText = "width: calc((100% - 50px) / 4);";
            })    

            const galleryImgEls = document.querySelectorAll('img'); // зображення
            galleryImgEls.forEach(el => {
                el.style.cssText = "width: 100%; height: 73%; object-fit: cover;";
            });

            const cardsMetaWrap = document.querySelectorAll('.info');   //контейнер підписів     
            cardsMetaWrap.forEach(cardMetaWrapItem => {
                cardMetaWrapItem.style.cssText = "display: flex; -webkit-box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.12), 0px 1px 1px rgba(0, 0, 0, 0.14), 0px 2px 1px rgba(0, 0, 0, 0.2); box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.12), 0px 1px 1px rgba(0, 0, 0, 0.14), 0px 2px 1px rgba(0, 0, 0, 0.2); border-radius: 0px 0px 4px 4px;";

            })
            const cardsMeta = document.querySelectorAll('.info-item');  //підписи  <p>    
            cardsMeta.forEach(cardMeta => {
                cardMeta.style.cssText = "display: flex; flex-direction: column; align-items: center; margin-left: auto; margin-right: auto;";

            })
            
            loadMoreBtn.addEventListener('click', handleLoadMoreBtnClick);
            function handleLoadMoreBtnClick () {    
                   




                pageNumber += 1;
                fetchPictures(searchQuery, pageNumber)
                    .then((data) => {
                        galleryContainer.insertAdjacentHTML('beforeend', galleryCardTemplate(data.hits));
                        console.log(data); 
                    })
                
                if(pageNumber > Math.ceil(data.totalHits / 3)) {
                    Notify.failure("We're sorry, but you've reached the end of search results."); 
                    loadMoreBtn.style.display = "none";
                }
            }

            loadMoreBtn.style.display = "block"
        }).catch(console.log);
}