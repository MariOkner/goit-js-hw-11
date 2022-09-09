export default class GalleryApiService {
    constructor() {
        this.searchQuery = '';
        this.page = 1;
    }

    fetchHits() {
        // console.log('до запроса:', this);
        const HTTPS = 'https://pixabay.com/api/'
        const KEY = '29815717-e22672f4a65c97651fd180553';
        const parametrs = 'image_type=photo&orientation=horizontal&safesearch=true';
        const paginate = `per_page=40&page=${this.page}`;
        
        const BASE_URL = `${HTTPS}?key=${KEY}&q=${this.searchQuery}&${parametrs}&${paginate}`;

        return fetch(BASE_URL)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                this.incrementPage();
                // console.log('после запроса:', this);
                return data.hits;
            });  
    }

    incrementPage() {
        this.page += 1;
    }

    resetPage() {
        this.page = 1;
    }

    get query() {
        return this.searchQuery;
    }

    set query(newQuery) {
        this.searchQuery = newQuery;
    }
}