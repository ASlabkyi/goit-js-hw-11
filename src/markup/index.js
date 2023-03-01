export function markupGallery(dataHits) {
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
