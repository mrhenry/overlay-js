export default class Overlay {

  // @constructor
  // @param {HTMLElement} el
  // @param {Object}      options
  constructor (el = document.getElementsByClassName('js-overlay')[0], options = { selectors: {}, states: {} }) {
    this.el = el;

    this.options = {
      selectors: {
        content: '.js-overlay-content',
        hide: '.js-overlay-hide',
        show: '.js-overlay-show',
        toggle: '.js-overlay-toggle'
      },
      states: {
        hidden: 'is-hidden',
        shown: 'is-shown',
      }
    };

    // Merge provided selectors
    for (let selector in options.selectors) {
      if (options.selectors.hasOwnProperty(selector)) {
        this.options.selectors[selector] = options.selectors[selector];
      }
    }

    // Merge provided states
    for (let state in options.states) {
      if (options.states.hasOwnProperty(state)) {
        this.options.states[state] = options.states[state];
      }
    }

    this.init().bind();
  }

  // Initial setup
  init () {
    return this;
  }

  // Bind event handlers to certain DOM elements, specified through
  bind () {
    document.body.addEventListener('keyup', e => {
      if (e.keyCode === 27) {
        this.hide();
      }
    });

    this.bindDelegate('click', this.options.selectors.show, e => {
      e.preventDefault();
      this.show();
    });

    this.bindDelegate('click', this.options.selectors.hide, e => {
      e.preventDefault();
      this.hide();
    });

    this.bindDelegate('click', this.options.selectors.toggle, e => {
      e.preventDefault();
      this.toggle();
    });

    return this;
  }

  // Helper method to support clicks on elements that don't exist yet
  // @param {String}    evt       Event to listen for
  // @param {String}    selector  Element selector that triggers the event
  // @param {Function}  handler   Callback method
  bindDelegate (evt, selector, handler) {
    let matches = document.body.matches || document.body.webkitMatchesSelector || document.body.msMatchesSelector;

    // Listen to all events of type evt
    document.body.addEventListener(evt, e => {
      // If e.target matches the specified selector or is a child element
      if (!!matches.call(e.target, `${selector}, ${selector} *`)) {
        // Find the actual element that matches the selector
        let matchingElement = e.target;
        while (!matches.call(matchingElement, selector)) {
          matchingElement = matchingElement.parentNode;
        }

        // Execute handler, pass on the Event object
        // and have the matching element as the second argument
        handler(e, matchingElement);
      }
    }, false);
  }

  // Show the overlay
  show () {
    if (this.el.className.indexOf(this.options.states.shown) !== -1) {
      return false;
    }

    let regex = new RegExp("\\s*" + this.options.states.hidden + "\\s*", 'gi'), // Template string not working because of reasons
        evt = new CustomEvent('overlay:show', { bubbles: true, cancelable: true }); // @fixme - IE9 support

    this.el.className = this.el.className.replace(regex, '') + ' ' + this.options.states.shown;

    document.body.dispatchEvent(evt);

    if (document.body.classList) {
      document.body.classList.add('overlay-' + this.options.states.shown);

    } else {
      document.body.className += ' ' + 'overlay-' + this.options.states.shown;

    }

    return true;
  }

  // Hide the overlay
  hide () {
    if (this.el.className.indexOf(this.options.states.hidden) !== -1) {
      return false;
    }

    let regex = new RegExp("\\s*" + this.options.states.shown + "\\s*", 'gi'), // Template string not working because of reasons
        evt = new CustomEvent('overlay:hide', { bubbles: true, cancelable: true }); // @fixme - IE9 support

    this.el.className = this.el.className.replace(regex, '') + ' ' + this.options.states.hidden;

    document.body.dispatchEvent(evt);

    if (document.body.classList) {
      document.body.classList.remove('overlay-' + this.options.states.shown);

    } else {
      document.body.className = el.className.replace(new RegExp('(^|\\b)' + 'overlay-' + this.options.states.shown.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');

    }



    return true;
  }

  // Toggle the overlay
  toggle () {
    if (this.el.className.indexOf(this.options.states.shown) === -1) {
      this.show();
    } else {
      this.hide();
    }
  }

  // Render HTML inside the content selector
  render (html) {
    this.el.querySelector(this.options.selectors.content).innerHTML = html;
  }
}
