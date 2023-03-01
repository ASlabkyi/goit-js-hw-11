import 'simplelightbox/dist/simple-lightbox.min.css';
import simpleLightbox from 'simplelightbox';
import { Notify } from 'notiflix';
import { markupGallery } from './markup';
import { getImages } from './api';

const searchFormEl = document.querySelector('#search-form');
const galleryEl = document.querySelector('.gallery');
const moreBtnEl = document.querySelector('.load-more');

let searchQuery;
let page = 1;

async function handleFormSubmit(e) {
  e.preventDefault();
  moreBtnEl.style.display = 'none';
  galleryEl.innerHTML = '';
  searchQuery = e.target.searchQuery.value.trim();

  if (!searchQuery) {
    return;
  }

  page = 1;
  const resp = await getImages(searchQuery, page);

  Notify.success(`Hooray! We found ${resp.data.totalHits} images.`);

  const dataHits = resp.data.hits;

  if (dataHits.length === 0) {
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }

  galleryEl.insertAdjacentHTML('beforeend', markupGallery(dataHits));
  moreBtnEl.style.display = 'block';
  lightBox.refresh();
  e.target.reset();
}

async function addPage() {
  moreBtnEl.style.display = 'none';
  page += 1;
  const resp = await getImages(searchQuery, page);
  const dataHits = resp.data.hits;

  galleryEl.insertAdjacentHTML('beforeend', markupGallery(dataHits));
  lightBox.refresh();
  moreBtnEl.style.display = 'block';

  const maxPage = Math.ceil(resp.data.totalHits / 40);

  if (maxPage === page) {
    Notify.warning(
      "We're sorry, but you've reached the end of search results."
    );
    moreBtnEl.style.display = 'none';
  }
}

const lightBox = new SimpleLightbox('.gallery a', {
  captionDelay: 250,
});

searchFormEl.addEventListener('submit', handleFormSubmit);
moreBtnEl.addEventListener('click', addPage);
