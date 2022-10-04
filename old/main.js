document.readyState != 'loading' ? init() :
window.addEventListener('DOMContentLoaded', init);

async function init() {

  // locate select
  const selects = document.querySelectorAll('select.search');
  selects.forEach(el => {

    const select = el;
    select.value = '';


    // populate list of options
    let selectOptions = [];
    select.querySelectorAll('option').forEach(el => {
      if (el.value) selectOptions.push({ text: el.text, value: el.value });
    });
    console.log(selectOptions);

    // create elements
    const container = document.createElement('div');
    const input = document.createElement('input');
    const ul = document.createElement('ul');
    container.classList.add('select-search');
    input.placeholder = 'Start typing to search... / Commencez à taper pour rechercher...'
    container.append(input, ul);
    select.after(container);


    let timer, inputValue, delay = 50;

    input.addEventListener('keyup', ev => {
      if (ev.target.value === inputValue) return;
      inputValue = ev.target.value;
      clearTimeout(timer);
      timer = setTimeout(() => {
        runChooser(inputValue);
      }, delay);
    });

    input.addEventListener('focus', focusInput);
    input.addEventListener('blur', checkInput);
    window.addEventListener('mousedown', blurInput);

    runChooser();
    hideChooser();

    function checkInput(ev) {
      let find = selectOptions.find(e => e.text === input.value);
      if (!find) {
        input.value = '';
        select.value = '';
      }
    }
    function focusInput(ev) {
      showChooser();
    }
    function blurInput(ev) {
      if (container.contains(ev.target)) return;
      hideChooser();
    }

    function showChooser() {
      ul.hidden = false;
    }
    function hideChooser() {
      ul.hidden = true;
    }

    function runChooser(value = '') {
      clearChooser();
      let regexp = new RegExp(value.replace(/[.+]/g, '\\$&'), 'i'); // /[-\/\\^$*+?.()|[\]{}]/
      let selectOptionsFiltered = selectOptions.filter(e => regexp.test(e.text));
      showChooser();
      for (let item of selectOptionsFiltered) {
        let match = String(item.text).match(regexp) || [];
        const li = document.createElement('li');
        li.innerHTML = item.text;
        li.innerHTML = String(item.text).replace(regexp, `<b>${match[0]}</b>`);
        li.addEventListener('click', ev => {
          ev.preventDefault();
          input.value = item.text;
          select.value = item.value;
          hideChooser();
        });
        ul.append(li);
      }
    }

    function clearChooser() {
      ul.querySelectorAll('*').forEach(el => el.remove());
    }



  })
}
