import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api/'
const KEY = '29815717-e22672f4a65c97651fd180553';
const parametrs = 'image_type=photo&orientation=horizontal&safesearch=true';

export default class GalleryApiService {
    constructor() {
        this.searchQueryImg = '';
        this.page = 1;
        this.perPage = 40;
        this.totalPages = 0;
    }

    async fetchHits() {
        const url = `${BASE_URL}?key=${KEY}&q=${this.searchQueryImg}&${parametrs}&per_page=${this.perPage}&page=${this.page}`;

        const response = await axios.get(url);
            
        if (response.status !== 200) {
            throw new Error(response.status);
        }
        
        console.log('hits:', response.data.hits);
        console.log('page:', this.page);
        console.log('perPage:', this.perPage);
        console.log('totalHits:', response.data.totalHits);
        
        if (response.data.totalHits === 0) {
            throw new Error(response.status);
        }

        this.totalPages = Math.ceil(response.data.totalHits / this.perPage);

        return response.data.hits;        
    }

    nextPage() {
        this.page += 1;
    }

    resetPage() {
        this.page = 1;
    }

    get query() {
        return this.searchQueryImg;
    }

    set query(newQuery) {
        this.searchQueryImg = newQuery;
    }
}