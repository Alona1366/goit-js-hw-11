import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
// import { fetchImagesApi } from './fetchImagesApi';

const { searchForm, imageGallery, guard } = {
    searchForm: document.querySelector('#search-form'),
    imageGallery: document.querySelector('.gallery'),
    guard: document.querySelector('.js-guard'),
  };

  const simpleligthbox = new SimpleLightbox('.gallery a', { loop: false });