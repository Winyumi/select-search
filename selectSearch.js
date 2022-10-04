export default class SelectSearch {
  /**
   * @param {HTMLSelectElement} select
   */
  constructor(select) {
    this.elements = {
      select: select,
      container: document.createElement('div'),
      input: document.createElement('input'),
      list: document.createElement('ul'),
    };
    this.elements.input.placeholder = 'Start typing to search...';
    this.elements.input.autocomplete = 'off';
    this.elements.container.classList.add('select-search');
    this.elements.container.append(this.elements.input, this.elements.list);
    this.elements.select.value = '';
    this.elements.select.tabIndex = -1;
    this.elements.select.after(this.elements.container);
    this.elements.container.prepend(this.elements.select);

    this.list = [];
    this.input = { timer: null, value: '', delay: 50 };

    this.elements.select.addEventListener('change', this.eventSelectChange);
    this.elements.input.addEventListener('change', this.eventInputChange);
    this.elements.input.addEventListener('keyup', this.eventInputChange);
    this.elements.input.addEventListener('focus', this.eventInputFocus);
    this.elements.input.addEventListener('blur', this.eventInputBlur);
    window.addEventListener('mousedown', this.eventClickOutside);

    this.loadList();
    this.runList();
    this.hideList();
  }


  // list functions

  loadList() {
    this.elements.select.querySelectorAll('option').forEach(el => {
      el.dataset.text = el.text;
      if (el.value) this.list.push({ text: el.text, value: el.value });
    });
  }
  clearList() {
    this.elements.list.querySelectorAll('*').forEach(el => el.remove());
  }
  showList() {
    this.elements.list.hidden = false;
  }
  hideList() {
    this.elements.list.hidden = true;
  }
  runList() {
    this.clearList();
    let regexp = new RegExp(this.input.value.replace(/[.+]/g, '\\$&'), 'i'); // /[-\/\\^$*+?.()|[\]{}]/
    let selectOptionsFiltered = this.list.filter(e => regexp.test(e.text));
    if (!selectOptionsFiltered.length) return this.hideList();
    this.showList();
    for (let item of selectOptionsFiltered) {
      let match = String(item.text).match(regexp) || [];
      const li = document.createElement('li');
      li.innerHTML = item.text;
      if (match[0]) li.innerHTML = String(item.text).replace(regexp, `<b>${match[0]}</b>`);
      li.addEventListener('click', ev => {
        ev.preventDefault();
        this.input.value = item.text;
        this.elements.input.value = item.text;
        this.elements.select.value = item.value;
        this.elements.select.dispatchEvent(new Event('change'));
        this.hideList();
      });
      this.elements.list.append(li);
    }
  }


  // events

  eventSelectChange = ev => {
    const option = this.elements.select.querySelector('option[value="' + this.elements.select.value + '"]');
    this.elements.input.value = option.text;
    this.input.value = option.text;
  };
  eventInputChange = ev => {
    if (ev.target.value === this.input.value) return;
    this.input.value = ev.target.value;
    clearTimeout(this.input.timer);
    this.input.timer = setTimeout(() => {
      this.runList();
    }, this.input.delay);
  };
  eventInputBlur = ev => {
    //let find = this.list.find(e => e.text === this.elements.input.value);
    const option = this.elements.select.querySelector('option[data-text="' + this.elements.input.value + '"]');
    if (!option) {
      this.input.value = '';
      this.elements.input.value = '';
      this.elements.select.value = '';
    } else {
      this.elements.select.value = option.value;
      this.input.value = option.text;

    }
  };
  eventInputFocus = ev => {
    this.runList();
  };
  eventClickOutside = ev => {
    if (this.elements.container.contains(ev.target)) return;
    this.hideList();
  };

}
