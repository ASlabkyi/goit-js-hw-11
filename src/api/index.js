import axios from 'axios';

export async function getImages(searchQuery, page) {
  return await axios.get('https://pixabay.com/api/', {
    params: {
      key: '33988995-a64a390706535bd3a9c78052f',
      q: searchQuery,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      page,
      per_page: 40,
    },
  });
}
