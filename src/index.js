import 'simplelightbox/dist/simple-lightbox.min.css';
import simpleLightbox from 'simplelightbox';
import { Notify } from 'notiflix';
import axios from 'axios';

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
  const resp = await axios.get('https://pixabay.com/api/', {
    params: {
      key: '33988995-a64a390706535bd3a9c78052f',
      q: searchQuery,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      page: page,
      per_page: 40,
    },
  });

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
  const resp = await axios.get('https://pixabay.com/api/', {
    params: {
      key: '33988995-a64a390706535bd3a9c78052f',
      q: searchQuery,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      page: page,
      per_page: 40,
    },
  });
  const dataHits = resp.data.hits;

  if (dataHits.length === 0) {
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }

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

function markupGallery(dataHits) {
  return dataHits
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) =>
        `<div class="photo-card">
        <a class="gallery__item" href="${largeImageURL}">
        <img class="gallery__image" src="${webformatURL}" alt="${tags}" loading="lazy" />
        </a>
        <div class="info">
          <p class="info-item">
            <b>Likes: ${likes}</b>
          </p>
          <p class="info-item">
            <b>Views: ${views}</b>
          </p>
          <p class="info-item">
            <b>Comments: ${comments}</b>
          </p>
          <p class="info-item">
            <b>Downloads: ${downloads}</b>
          </p>
        </div>
      </div>`
    )
    .join('');
}

const lightBox = new SimpleLightbox('.gallery a', {
  captionDelay: 250,
});

searchFormEl.addEventListener('submit', handleFormSubmit);
moreBtnEl.addEventListener('click', addPage);
