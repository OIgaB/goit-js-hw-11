"use strict";
import { Notify } from 'notiflix/build/notiflix-notify-aio';  // бібліотека вспливаючих сповіщень
import SimpleLightbox from "simplelightbox";                 // бібліотека для галереї
import "simplelightbox/dist/simple-lightbox.min.css";       // бібліотеки для галереї (стилізація)
import {fetchPictures} from './fetchPictures';             // проміс (дані з бекенду/API) 
import galleryCardTemplate from './gallery.hbs';          // шаблонізатор (handlebar)

const searchForm = document.querySelector('#search-form');    // <form>
const galleryContainer = document.querySelector('.gallery'); // <div>
const loadMoreBtn = document.querySelector('.load-more');   // <button>

let searchQuery = '';
let pageNumber = null;
let lightbox = null;

loadMoreBtn.style.display = "none";


// Відправка запиту/форми
searchForm.addEventListener('submit', handleFormSubmit);

async function handleFormSubmit (event) {
    event.preventDefault();
    searchQuery = event.currentTarget.elements.searchQuery.value.trim();
    galleryContainer.innerHTML = "";  //Для пошуку за новим ключовим словом, очищуємо вміст галереї
    pageNumber = 1;

    try {
        const {data} = await fetchPictures(searchQuery, pageNumber);  // рівноцінний запис 2-м рядкам, що нижче
    //fetchPictures(searchQuery, pageNumber)  // виклик ф-ції-запиту до бекенду, що вертає проміс 
        //.then(({data}) => { // ({data}) замість (data) - у випадку застосування бібліотеки axios
            //console.log(data); // приклад: {total: 7526, totalHits: 500, hits: Array(4)}
            //console.log(data.hits); // масив об'єктів
            if(data.hits.length === 0) {  // або (!data.hits.length)
                Notify.failure('Sorry, there are no images matching your search query. Please try again.');
                loadMoreBtn.style.display = "none";
                return;
            } 
            Notify.success(`Hooray! We found ${data.totalHits} images.`);
            
            renderMarkup(data.hits); // Рендер розмітки
            styleGallery();  // Стилізація галереї   

            // Створюємо модальне вікно-галерею через бібліотеку SimpleLightbox
            lightbox = new SimpleLightbox('.gallery a', { 
                captionSelector: 'img', 
            });  

            loadMoreBtn.addEventListener('click', handleLoadMoreBtnClick); //  клік по кнопці "Load More"
            loadMoreBtn.style.display = "block";

    } catch(err) {
        console.log(err);
    }
}

// Обробник події кліку на кнопку "Load More"

async function handleLoadMoreBtnClick () {   
    pageNumber += 1;
    try {
        const {data} = await fetchPictures(searchQuery, pageNumber);
    // fetchPictures(searchQuery, pageNumber)
        // .then(({data}) => {  // ({data}) замість (data) - у випадку застосування бібліотеки axios
            renderMarkup(data.hits);  // Рендер розмітки
            styleGallery();  // Стилізація галереї  
            lightbox.refresh(); // рефрешим бібліотеку SimpleLightbox

            if(pageNumber > Math.ceil(data.totalHits / 4)) {
                Notify.failure("We're sorry, but you've reached the end of search results."); 
                loadMoreBtn.style.display = "none";
            }
        } catch(err) {
            console.log(err);
        }
}

// Рендер розмітки
function renderMarkup(data) {
    galleryContainer.insertAdjacentHTML('beforeend', galleryCardTemplate(data));
}

// Стилізація галереї   
function styleGallery() {
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
}