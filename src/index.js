import './css/styles.css';

import debounce from 'lodash.debounce';
import { fetchCountries } from './fetchCountries.js';
import Notiflix from 'notiflix';

const DEBOUNCE_DELAY = 300;
const inputRef = document.querySelector('#search-box');
const listRef = document.querySelector('.country-list');
const infoRef = document.querySelector('.country-info');

inputRef.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));

function onInput(e) {
  const countryName = e.target.value.trim();
  if (!countryName) {
    listRef.innerHTML = '';
    infoRef.innerHTML = '';
  }
  fetchCountries(countryName)
    .then(markUp)
    .catch(() =>
      Notiflix.Notify.failure('Oops, there is no country with that name')
    );
}

function markUp(data) {
  if (data.length > 10) {
    Notiflix.Notify.warning(
      'Too many matches found. Please enter a more specific name.'
    );
    return;
  }
  if (data.length >= 2 && data.length < 10) {
    infoRef.innerHTML = '';
    listRef.innerHTML = data
      .map(item => {
        return `<li><img src=${item.flags.svg} width = 30px, height = 20px></img><span>${item.name.official}</span></li>`;
      })
      .join();
    return;
  }
  listRef.innerHTML = '';
  const country = data[0];
  infoRef.innerHTML = `<div><img src=${
    country.flags.svg
  } width = 60px, height = 45px></img>
  <span>${country.name.official}</span>
  </div>
  <p>Capital: <span> ${country.capital} </span></p>
  <p>Population: <span> ${country.population} </span></p>
  <p>Languages: <span> ${Object.values(country.languages)} </span></p>
  `;
  console.log(country.languages);
}
