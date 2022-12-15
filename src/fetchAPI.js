import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '7942731-4051e2b7897b2b5d28b98eeac';

export const fetchAPI = function (searchQuery, page, imagesPerPage) {
  return axios.get(
    `${BASE_URL}?key=${API_KEY}&q=${searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&per_page=${imagesPerPage}&page=${page}&`
  );
};