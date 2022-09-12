import { Notify } from 'notiflix';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import './css/styles.css';
import GalleryApiService from './js/gallery-service';
import LoadMoreButton from './js/load-more-button';

const form = document.querySelector('.search-form');
const inputEl = document.querySelector('input');
const buttonSub = document.querySelector('form > button');
const galleryEl = document.querySelector('.gallery');
let lightBox = null;
const galleryApiService = new GalleryApiService();
const loadMoreButtonCls = new LoadMoreButton({
  selector: '.load-more',
  hidden: true,
});

form.addEventListener('submit', onFormSubmit);
loadMoreButtonCls.refs.button.addEventListener('click', onLoadMoreClick);

function onFormSubmit(evt) {
  evt.preventDefault();
  clearHitsContainer();

  galleryApiService.query = evt.currentTarget.elements.searchQuery.value.trim();

  if (galleryApiService.query === '') {
    return Notify.success(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }

  loadMoreButtonCls.show();
  galleryApiService.resetPage();
  fetchGalleryHits();
// ____________________________________________ 
}

function onLoadMoreClick() {
  galleryApiService.nextPage();
  fetchGalleryHits();
}

function fetchGalleryHits() {
  loadMoreButtonCls.disable(); 
  galleryApiService.fetchHits()
    .then(hits => {
      appendHitsMarkup(hits);

      lightBox = new SimpleLightbox('.gallery a');
      lightBox.refresh(); 

      if (galleryApiService.page === galleryApiService.totalPages) {
        Notify.success(
        `We're sorry, but you've reached the end of search results.`
        );
        loadMoreButtonCls.hide();
      } else {
        loadMoreButtonCls.enable();
      }
    })
    .catch(error => {
      onSearchError();
    });
}
// __________________________________________________________
function appendHitsMarkup(hits) {
  const markup = hits
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `
              <a class="gallery__link" href="${largeImageURL}" >
                <div class="gallery__photo-card">
                    <img class="gallery__img" src="${webformatURL}" alt="${tags}" loading="lazy" />
                    <div class="gallery__info">
                        <p class="gallery__info-item">
                        <b>Likes</b>${likes}
                        </p>
                        <p class="gallery__info-item">
                        <b>Views</b>${views}
                        </p>
                        <p class="gallery__info-item">
                        <b>Comments</b>${comments}
                        </p>
                        <p class="gallery__info-item">
                        <b>Downloads</b>${downloads}
                        </p>
                    </div>
                </div>  
              </a>  
            `;
      }
    )
    .join('');
  galleryEl.insertAdjacentHTML('beforeend', markup);
}

function clearHitsContainer() {
  galleryEl.innerHTML = '';
}

function onSearchError(error) {
  Notify.failure(`Sorry, there are no images matching your search query. Please try again.`);
  loadMoreButtonCls.hide();
};