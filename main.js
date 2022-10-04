import SelectSearch from './selectSearch.js';

document.readyState != 'loading' ? init() :
window.addEventListener('DOMContentLoaded', init);

async function init() {
  const selects = document.querySelectorAll('select.search');
  selects.forEach(el => new SelectSearch(el));
}
