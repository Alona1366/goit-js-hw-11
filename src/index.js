import './css/styles.css';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { fetchAPI } from './fetchAPI';

const { searchForm, gallery, guard } = {
    searchForm: document.querySelector('#search-form'),
    gallery: document.querySelector('.gallery'),
    guard: document.querySelector('.js-guard'),
  };

  const simpleligthbox = new SimpleLightbox('.gallery a', { loop: false });

  const imagesPerPage = 40;
  let page = 1;
  let observer = null;
  const options = {
    root: null,
    rootMargin: '600px',
    threshold: 1.0,
  };

  searchForm.addEventListener('submit', onSubmit);

  function onSubmit(e) {
  e.preventDefault();
  gallery.innerHTML = '';
  if (page > 1) {
    observer.unobserve(guard);
  }
  page = 1;

  const searchQuery = e.target.elements.searchQuery.value.trim();
  observer = new IntersectionObserver(onLoad, options);
  observer.observe(guard);

  function onLoad(entries, observer) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        fetchAPI(searchQuery, page, imagesPerPage)
          .then(response => {
            if (response.data.hits.length < 1) {
              throw new Error();
            }
            addMoreImages(response.data.hits);
            if (page > 1) {
              smoothImagesScroll();
            }
            if (page === 1) {
              notifySuccess(response);
            }
            if (page === Math.ceil(response.data.totalHits / imagesPerPage)) {
              observer.unobserve(guard);
              window.addEventListener('scroll', checkScrollPosition);
            }
            changeFormOpacity();
            page += 1;
          })
          .catch(error => {
            notifyFailure();
            observer.unobserve(guard);
          })
          .then(() => simpleligthbox.refresh());
      }
    });
  }
}

function createMarkup(array) {
  return array
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => `<div class="photo-card"><div class="thumb"><a class="gallery-item" href="${largeImageURL}">
        <img src="${webformatURL}" alt="${tags}" loading="lazy" /></a></div>
        <div class="info">
          <p class="info-item">
            <b>Likes</b>
            <span>${likes}</span>
          </p>
          <p class="info-item">
            <b>Views</b>
            <span>${views}</span>
          </p>
          <p class="info-item">
            <b>Comments</b>
            <span>${comments}</span>
          </p>
          <p class="info-item">
            <b>Downloads</b>
            <span>${downloads}</span>
          </p>
        </div>
      </div>`
    )
    .join('');
}

function checkScrollPosition() {
  if (window.scrollY > window.innerHeight - 70) {
    window.removeEventListener('scroll', checkScrollPosition);
    notifyInfo();
  }
}

function addMoreImages(array) {
  gallery.insertAdjacentHTML('beforeend', createMarkup(array));
}

function smoothImagesScroll() {
  const { height: cardHeight } =
    gallery.firstElementChild.getBoundingClientRect();
  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}

function changeFormOpacity() {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 0) {
      searchForm.classList.add('page-is-scrolled');
    } else {
      searchForm.classList.remove('page-is-scrolled');
    }
  });
}

function notifySuccess(response) {
  Notiflix.Notify.success(
    `Hooray! We found: ${response.data.totalHits} images.`
  );
}

function notifyFailure() {
  Notiflix.Notify.failure(
    'Sorry, there are no images matching your search query. Please try again.'
  );
}

function notifyInfo() {
  Notiflix.Notify.info(
    "We're sorry, but you've reached the end of search results"
  );
}

