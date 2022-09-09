import axios from 'axios';
axios.get('/user?ID=12345');

import { Notify } from 'notiflix';
import './css/styles.css';
import GalleryApiService from './js/gallery-service';

const form = document.querySelector('.search-form');
const inputEl = document.querySelector('input');
const buttonSub = document.querySelector('form > button');
const galleryEl = document.querySelector('.gallery');
const buttonLoadMore = document.querySelector('.load-more');

const galleryApiService = new GalleryApiService(); 
// console.log(galleryApiService);

form.addEventListener('submit', onFormSubmit);
buttonLoadMore.addEventListener('click', onLoadMoreClick);

function onFormSubmit(evt) {
    evt.preventDefault();

    galleryApiService.query = evt.currentTarget.elements.searchQuery.value;
    galleryApiService.resetPage();
    galleryApiService.fetchHits().then(appendHitsMarkup);

}

function onLoadMoreClick() {
    galleryApiService.fetchHits().then(appendHitsMarkup);
}

function appendHitsMarkup(hits) {
    const markup = hits
        .map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => {
            return `
                <div class="photo-card">
                    <img src="${webformatURL}" alt="${tags}" loading="lazy" />
                    <div class="info">
                        <p class="info-item">
                        <b>${likes}</b>
                        </p>
                        <p class="info-item">
                        <b>${views}</b>
                        </p>
                        <p class="info-item">
                        <b>${comments}</b>
                        </p>
                        <p class="info-item">
                        <b>${downloads}</b>
                        </p>
                    </div>
                </div>    
            `
        })
        .join('');
    galleryEl.innerHTML = markup;
};

