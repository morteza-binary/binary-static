webpackJsonp([2],[
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var moment = __webpack_require__(9);
var template = __webpack_require__(3).template;

var Localize = function () {
    var localized_texts = void 0;

    var localizeForLang = function localizeForLang(lang) {
        localized_texts = texts_json[lang.toUpperCase()];
        moment.locale(lang.toLowerCase());
    };

    var doLocalize = function doLocalize(txt, params) {
        var text = txt;

        var index = text.replace(/[\s|.]/g, '_');

        text = localized_texts && localized_texts[index] || text;

        // only use template when explicitly required
        return params ? template(text, params) : text;
    };

    var localize = function localize(text, params) {
        return Array.isArray(text) ? text.map(function (t) {
            return doLocalize(t, params);
        }) : doLocalize(text, params);
    };

    return {
        localize: localize,
        forLang: localizeForLang
    };
}();

module.exports = Localize;

/***/ }),
/* 1 */,
/* 2 */,
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var extend = __webpack_require__(193);
__webpack_require__(150);

/**
 * Write loading image to a container for ajax request
 *
 * @param container: a DOM element
 * @param theme: dark or white
 */
var showLoadingImage = function showLoadingImage(container) {
    var theme = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'dark';

    var loading_div = createElement('div', { class: 'barspinner ' + theme, html: Array.from(new Array(5)).map(function (x, i) {
            return '<div class="rect' + (i + 1) + '"></div>';
        }).join('') });
    container.html(loading_div);
};

/**
 * Returns the highest z-index in the page.
 * Accepts a selector to only check those elements,
 * uses all container tags by default
 * If no element found, returns null.
 *
 * @param selector: a selector for target elements
 * @return int|null
 */
var getHighestZIndex = function getHighestZIndex() {
    var selector = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'div,p,area,nav,section,header,canvas,aside,span';

    var elements = selector.split(',');
    var all = [];

    for (var i = 0; i < elements.length; i++) {
        var els = document.getElementsByTagName(elements);
        for (var j = 0; j < els.length; j++) {
            if (els[i].offsetParent) {
                var z = els[i].style['z-index'];
                if (!isNaN(z)) {
                    all.push(z);
                }
            }
        }
    }

    return all.length ? Math.max.apply(Math, all) : null;
};

var downloadCSV = function downloadCSV(csv_contents) {
    var filename = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'data.csv';

    if (navigator.msSaveBlob) {
        // IE 10+
        navigator.msSaveBlob(new Blob([csv_contents], { type: 'text/csv;charset=utf-8;' }), filename);
    } else {
        // Other browsers
        var csv = 'data:text/csv;charset=utf-8,' + csv_contents;
        var download_link = createElement('a', { href: encodeURI(csv), download: filename });

        if (document.body) {
            document.body.appendChild(download_link);
            download_link.click();
            document.body.removeChild(download_link);
        }
    }
};

var template = function template(string, content) {
    return string.replace(/\[_(\d+)]/g, function (s, index) {
        return content[+index - 1];
    });
};

var isEmptyObject = function isEmptyObject(obj) {
    var is_empty = true;
    if (obj && obj instanceof Object) {
        Object.keys(obj).forEach(function (key) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) is_empty = false;
        });
    }
    return is_empty;
};

var cloneObject = function cloneObject(obj) {
    return !isEmptyObject(obj) ? extend(true, Array.isArray(obj) ? [] : {}, obj) : obj;
};

var isDeepEqual = function isDeepEqual(a, b) {
    if ((typeof a === 'undefined' ? 'undefined' : _typeof(a)) !== (typeof b === 'undefined' ? 'undefined' : _typeof(b))) {
        return false;
    } else if (Array.isArray(a)) {
        return isEqualArray(a, b);
    } else if (a && b && (typeof a === 'undefined' ? 'undefined' : _typeof(a)) === 'object') {
        return isEqualObject(a, b);
    }
    // else
    return a === b;
};

var isEqualArray = function isEqualArray(arr1, arr2) {
    return arr1 === arr2 || arr1.length === arr2.length && arr1.every(function (value, idx) {
        return isDeepEqual(value, arr2[idx]);
    });
};

var isEqualObject = function isEqualObject(obj1, obj2) {
    return obj1 === obj2 || Object.keys(obj1).length === Object.keys(obj2).length && Object.keys(obj1).every(function (key) {
        return isDeepEqual(obj1[key], obj2[key]);
    });
};

var getPropertyValue = function getPropertyValue(obj, k) {
    var keys = k;
    if (!Array.isArray(keys)) keys = [keys];
    if (!isEmptyObject(obj) && keys[0] in obj && keys && keys.length > 1) {
        return getPropertyValue(obj[keys[0]], keys.slice(1));
    }
    // else return clone of object to avoid overwriting data
    return obj ? cloneObject(obj[keys[0]]) : undefined;
};

var handleHash = function handleHash() {
    var hash = window.location.hash;
    if (hash) {
        document.querySelector('a[href="' + hash + '"]').click();
    }
};

var clearable = function clearable(element) {
    element.addClass('clear');
    document.addEventListener('mousemove', function (e) {
        if (/clear/.test(e.target.classList)) {
            e.stopPropagation();
            e.target.toggleClass('onClear', e.target.offsetWidth - 18 < e.clientX - e.target.getBoundingClientRect().left);
        }
    });
    document.addEventListener('mousedown', function (e) {
        if (/onClear/.test(e.target.classList)) {
            e.stopPropagation();
            e.target.setAttribute('data-value', '');
            e.target.classList.remove('clear', 'onClear');
            e.target.value = '';
            e.target.dispatchEvent(new Event('change'));
        }
    });
};

/**
 * Creates a DOM element and adds any attributes to it.
 *
 * @param {String} tag_name: the tag to create, e.g. 'div', 'a', etc
 * @param {Object} attributes: all the attributes to assign, e.g. { id: '...', class: '...', html: '...', ... }
 * @return the created DOM element
 */
var createElement = function createElement(tag_name) {
    var attributes = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    var el = document.createElement(tag_name);
    Object.keys(attributes).forEach(function (attr) {
        var value = attributes[attr];
        if (attr === 'text') {
            el.textContent = value;
        } else if (attr === 'html') {
            el.html(value);
        } else {
            el.setAttribute(attr, value);
        }
    });
    return el;
};

/**
 * Apply function to all elements based on selector passed
 *
 * @param {String|Element} selector: selector of the elements to apply the function to, e.g. '.class', '#id', 'tag', etc
 * can also be a DOM element
 * @param {Function} funcToRun: function to apply
 * @param {String} func_selector: method of finding the selector, optional
 * @param {Element} el_parent: parent of the selector, document by default
 */
var applyToAllElements = function applyToAllElements(selector, funcToRun, func_selector, el_parent) {
    if (!selector || !funcToRun) {
        return;
    }

    var function_selector = func_selector;
    var element_to_select = selector;
    if (!func_selector && !element_to_select.nodeName) {
        if (/[\s#]/.test(element_to_select) || element_to_select.lastIndexOf('.') !== 0) {
            function_selector = 'querySelectorAll';
        } else if (element_to_select.lastIndexOf('.') === 0) {
            function_selector = 'getElementsByClassName';
            element_to_select = element_to_select.substring(1);
        } else if (/^[a-zA-Z]+$/.test(element_to_select)) {
            function_selector = 'getElementsByTagName';
        }
    }
    var parent_element = el_parent || document;
    var el = element_to_select.nodeName || (typeof element_to_select === 'undefined' ? 'undefined' : _typeof(element_to_select)) === 'object' ? element_to_select : parent_element[function_selector](element_to_select);
    for (var i = 0; i < el.length; i++) {
        funcToRun(el[i]);
    }
};

/**
 * Returns the first parent element that matches the selector (including el itself)
 *
 * @param {Element} el      : element to start looking for parent
 * @param {String}  selector: selector to find the element that matches to, e.g. '.class', '#id', 'tag', or a combination of them
 */
var findParent = function findParent(el, selector) {
    if (el && el.nodeName !== 'BODY' && typeof el.matches === 'function') {
        return el.matches(selector) ? el : findParent(el.parentNode, selector);
    }
    return null;
};

var static_hash = void 0;
var getStaticHash = function getStaticHash() {
    // TODO: update when splitting the release process
    var scripts_selector = ['.min.js', '.js', '_app.min.js', '_app.js'].map(function (s) {
        return 'script[src*="binary' + s + '"]';
    }).join(',');
    static_hash = static_hash || (document.querySelector(scripts_selector).getAttribute('src') || '').split('?')[1];
    return static_hash;
};

module.exports = {
    showLoadingImage: showLoadingImage,
    getHighestZIndex: getHighestZIndex,
    downloadCSV: downloadCSV,
    template: template,
    isEmptyObject: isEmptyObject,
    cloneObject: cloneObject,
    isDeepEqual: isDeepEqual,
    getPropertyValue: getPropertyValue,
    handleHash: handleHash,
    clearable: clearable,
    createElement: createElement,
    applyToAllElements: applyToAllElements,
    findParent: findParent,
    getStaticHash: getStaticHash
};

/***/ }),
/* 4 */,
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var createElement = __webpack_require__(3).createElement;

// show hedging value if trading purpose is set to hedging else hide it
var detectHedging = function detectHedging($purpose, $hedging) {
    $purpose.change(function () {
        $hedging.setVisibility($purpose.val() === 'Hedging');
    });
};

var jqueryuiTabsToDropdown = function jqueryuiTabsToDropdown($container) {
    var $ddl = $('<select/>');
    $container.find('li a').each(function () {
        $ddl.append($('<option/>', { text: $(this).text(), value: $(this).attr('href') }));
    });
    $ddl.change(function () {
        $container.find('li a[href="' + $(this).val() + '"]').click();
    });
    return $ddl;
};

var makeOption = function makeOption(options) {
    // setting null value helps with detecting required error
    // on 'Please select' options
    // that have no value of their own
    var option_el = createElement('option', { text: options.text, value: options.value || '' });

    if (options.is_disabled && options.is_disabled.toLowerCase() === 'disabled') {
        option_el.setAttribute('disabled', 'disabled');
    }
    if (options.class) {
        option_el.className = options.class;
    }
    if (options.is_selected) {
        option_el.setAttribute('selected', 'selected');
    }
    return option_el;
};

/*
 * function to check if element is visible or not
 *
 * alternative to jquery $('#id').is(':visible')
 */
var isVisible = function isVisible(elem) {
    return !(!elem || elem.offsetWidth === 0 && elem.offsetHeight === 0);
};

/*
 * function to check if browser supports the type date/time
 * send a wrong val in case browser 'pretends' to support
 */
var checkInput = function checkInput(type, wrong_val) {
    var input = createElement('input', { type: type, value: wrong_val });
    return input.value !== wrong_val;
};

/*
 * function to check if new date is selected using native picker
 * if yes, update the data-value. if no, return false.
 */
var dateValueChanged = function dateValueChanged(element, type) {
    var value = void 0;
    if (element.selectedOptions) {
        value = element.selectedOptions[0].getAttribute('data-value');
    } else {
        value = element.value;
    }
    if (element.getAttribute('data-value') === value) {
        return false;
    }
    if (element.getAttribute('type') === type) {
        element.setAttribute('data-value', value);
    }
    return true;
};

var selectorExists = function selectorExists(element) {
    return typeof element !== 'undefined' && element !== null;
};

var getSetElementValue = function getSetElementValue(element, text, type) {
    // eslint-disable-line consistent-return
    if (selectorExists(element)) {
        if (typeof text === 'undefined') return element[type];
        // else
        element[type] = text;
    }
};

/*
 * @param  {String}  id_selector   the selector for the element
 * @param  {Element} parent        optional selector to use for parent, defaults to document
 * @return {Element}               return element if it exists, if it doesn't return a dummy element
 */
var getElementById = function getElementById(id_selector) {
    var parent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : document;
    return parent.getElementById(id_selector) || createElement('div');
};

/*
 * @param  {String}  class_name    the selector class for the element
 * @param  {Element} parent        optional selector to use for parent, defaults to document
 * @return {Element}               return element if it is visible
 */
var getVisibleElement = function getVisibleElement(class_name) {
    var parent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : document;
    return Array.from(parent.getElementsByClassName(class_name)).find(function (el) {
        return isVisible(el);
    });
};

module.exports = {
    detectHedging: detectHedging,
    jqueryuiTabsToDropdown: jqueryuiTabsToDropdown,
    makeOption: makeOption,
    isVisible: isVisible,
    checkInput: checkInput,
    dateValueChanged: dateValueChanged,
    selectorExists: selectorExists,
    getElementById: getElementById,
    getVisibleElement: getVisibleElement,
    elementTextContent: function elementTextContent(element, text) {
        return getSetElementValue(element, text, 'textContent');
    },
    elementInnerHtml: function elementInnerHtml(element, text) {
        return getSetElementValue(element, text, 'innerHTML');
    }
};

/***/ }),
/* 6 */,
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Cookies = __webpack_require__(48);
var getPropertyValue = __webpack_require__(3).getPropertyValue;
var isEmptyObject = __webpack_require__(3).isEmptyObject;

var getObject = function getObject(key) {
    return JSON.parse(this.getItem(key) || '{}');
};

var setObject = function setObject(key, value) {
    if (value && value instanceof Object) {
        this.setItem(key, JSON.stringify(value));
    }
};

if (typeof Storage !== 'undefined') {
    Storage.prototype.getObject = getObject;
    Storage.prototype.setObject = setObject;
}

var isStorageSupported = function isStorageSupported(storage) {
    if (typeof storage === 'undefined') {
        return false;
    }

    var test_key = 'test';
    try {
        storage.setItem(test_key, '1');
        storage.removeItem(test_key);
        return true;
    } catch (e) {
        return false;
    }
};

var Store = function Store(storage) {
    this.storage = storage;
    this.storage.getObject = getObject;
    this.storage.setObject = setObject;
};

Store.prototype = {
    get: function get(key) {
        return this.storage.getItem(key) || undefined;
    },
    set: function set(key, value) {
        if (typeof value !== 'undefined') {
            this.storage.setItem(key, value);
        }
    },
    getObject: function getObject(key) {
        return typeof this.storage.getObject === 'function' ? // Prevent runtime error in IE
        this.storage.getObject(key) : JSON.parse(this.storage.getItem(key) || '{}');
    },
    setObject: function setObject(key, value) {
        if (typeof this.storage.setObject === 'function') {
            // Prevent runtime error in IE
            this.storage.setObject(key, value);
        } else {
            this.storage.setItem(key, JSON.stringify(value));
        }
    },
    remove: function remove(key) {
        this.storage.removeItem(key);
    },
    clear: function clear() {
        this.storage.clear();
    }
};

var InScriptStore = function InScriptStore(object) {
    this.store = typeof object !== 'undefined' ? object : {};
};

InScriptStore.prototype = {
    get: function get(key) {
        return getPropertyValue(this.store, key);
    },
    set: function set(k, value) {
        var obj = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : this.store;

        var key = k;
        if (!Array.isArray(key)) key = [key];
        if (key.length > 1) {
            if (!(key[0] in obj) || isEmptyObject(obj[key[0]])) obj[key[0]] = {};
            this.set(key.slice(1), value, obj[key[0]]);
        } else {
            obj[key[0]] = value;
        }
    },
    getObject: function getObject(key) {
        return JSON.parse(this.get(key) || '{}');
    },
    setObject: function setObject(key, value) {
        this.set(key, JSON.stringify(value));
    },
    remove: function remove() {
        var _this = this;

        for (var _len = arguments.length, keys = Array(_len), _key = 0; _key < _len; _key++) {
            keys[_key] = arguments[_key];
        }

        keys.forEach(function (key) {
            delete _this.store[key];
        });
    },
    clear: function clear() {
        this.store = {};
    },
    has: function has(key) {
        return this.get(key) !== undefined;
    },
    keys: function keys() {
        return Object.keys(this.store);
    },
    call: function call(key) {
        if (typeof this.get(key) === 'function') this.get(key)();
    }
};

var State = new InScriptStore();
State.prototype = InScriptStore.prototype;
/**
 * Shorthand function to get values from response object of State
 *
 * @param {String} pathname
 *     e.g. getResponse('authorize.currency') == get(['response', 'authorize', 'authorize', 'currency'])
 */
State.prototype.getResponse = function (pathname) {
    var path = pathname;
    if (typeof path === 'string') {
        var _keys = path.split('.');
        path = ['response', _keys[0]].concat(_keys);
    }
    return this.get(path);
};
State.set('response', {});

var CookieStorage = function CookieStorage(cookie_name, cookie_domain) {
    var hostname = window.location.hostname;

    this.initialized = false;
    this.cookie_name = cookie_name;
    this.domain = cookie_domain || (/\.binary\.com/i.test(hostname) ? '.' + hostname.split('.').slice(-2).join('.') : hostname);
    this.path = '/';
    this.expires = new Date('Thu, 1 Jan 2037 12:00:00 GMT');
    this.value = {};
};

CookieStorage.prototype = {
    read: function read() {
        var cookie_value = Cookies.get(this.cookie_name);
        try {
            this.value = cookie_value ? JSON.parse(cookie_value) : {};
        } catch (e) {
            this.value = {};
        }
        this.initialized = true;
    },
    write: function write(val, expireDate, isSecure) {
        if (!this.initialized) this.read();
        this.value = val;
        if (expireDate) this.expires = expireDate;
        Cookies.set(this.cookie_name, this.value, {
            expires: this.expires,
            path: this.path,
            domain: this.domain,
            secure: !!isSecure
        });
    },
    get: function get(key) {
        if (!this.initialized) this.read();
        return this.value[key];
    },
    set: function set(key, val) {
        if (!this.initialized) this.read();
        this.value[key] = val;
        Cookies.set(this.cookie_name, this.value, {
            expires: new Date(this.expires),
            path: this.path,
            domain: this.domain
        });
    },
    remove: function remove() {
        Cookies.remove(this.cookie_name, {
            path: this.path,
            domain: this.domain
        });
    }
};

var removeCookies = function removeCookies() {
    for (var _len2 = arguments.length, cookie_names = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        cookie_names[_key2] = arguments[_key2];
    }

    var domains = ['.' + document.domain.split('.').slice(-2).join('.'), '.' + document.domain];

    var parent_path = window.location.pathname.split('/', 2)[1];
    if (parent_path !== '') {
        parent_path = '/' + parent_path;
    }

    cookie_names.forEach(function (c) {
        Cookies.remove(c, { path: '/', domain: domains[0] });
        Cookies.remove(c, { path: '/', domain: domains[1] });
        Cookies.remove(c);
        if (new RegExp(c).test(document.cookie) && parent_path) {
            Cookies.remove(c, { path: parent_path, domain: domains[0] });
            Cookies.remove(c, { path: parent_path, domain: domains[1] });
            Cookies.remove(c, { path: parent_path });
        }
    });
};

var SessionStore = void 0,
    LocalStore = void 0;

if (isStorageSupported(window.localStorage)) {
    LocalStore = new Store(window.localStorage);
}
if (isStorageSupported(window.sessionStorage)) {
    SessionStore = new Store(window.sessionStorage);
}

if (!LocalStore) {
    LocalStore = new InScriptStore();
}
if (!SessionStore) {
    SessionStore = new InScriptStore();
}

module.exports = {
    isStorageSupported: isStorageSupported,
    CookieStorage: CookieStorage,
    removeCookies: removeCookies,
    State: State,
    SessionStore: SessionStore,
    LocalStore: LocalStore
};

/***/ }),
/* 8 */,
/* 9 */,
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var urlForLanguage = __webpack_require__(13).urlFor;
var urlLang = __webpack_require__(13).urlLang;
var createElement = __webpack_require__(3).createElement;
var isEmptyObject = __webpack_require__(3).isEmptyObject;
__webpack_require__(316);

var Url = function () {
    var location_url = void 0,
        static_host = void 0;

    var init = function init(url) {
        location_url = url ? getLocation(url) : window.location;
    };

    var getLocation = function getLocation(url) {
        return createElement('a', { href: decodeURIComponent(url) });
    };

    var reset = function reset() {
        location_url = window ? window.location : location_url;
    };

    var params = function params(href) {
        var arr_params = [];
        var parsed = ((href ? new URL(href) : location_url).search || '').substr(1).split('&');
        var p_l = parsed.length;
        while (p_l--) {
            var param = parsed[p_l].split('=');
            arr_params.push(param);
        }
        return arr_params;
    };

    var paramsHash = function paramsHash(href) {
        var param_hash = {};
        var arr_params = params(href);
        var param = arr_params.length;
        while (param--) {
            if (arr_params[param][0]) {
                param_hash[arr_params[param][0]] = arr_params[param][1] || '';
            }
        }
        return param_hash;
    };

    var paramsHashToString = function paramsHashToString(pars) {
        return isEmptyObject(pars) ? '' : Object.keys(pars).map(function (key) {
            return key + '=' + (pars[key] || '');
        }).join('&');
    };

    var normalizePath = function normalizePath(path) {
        return path ? path.replace(/(^\/|\/$|[^a-zA-Z0-9-_/])/g, '') : '';
    };

    var urlFor = function urlFor(path, pars, language) {
        var lang = (language || urlLang()).toLowerCase();
        // url language might differ from passed language, so we will always replace using the url language
        var url_lang = language ? urlLang().toLowerCase() : lang;
        var url = window.location.href;
        var new_url = '' + url.substring(0, url.indexOf('/' + url_lang + '/') + url_lang.length + 2) + (normalizePath(path) || 'home' + (lang === 'ja' ? '-jp' : '')) + '.html' + (pars ? '?' + pars : '');
        // replace old lang with new lang
        return urlForLanguage(lang, new_url);
    };

    var urlForStatic = function urlForStatic() {
        var path = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

        if (!static_host || static_host.length === 0) {
            static_host = document.querySelector('script[src*="vendor.min.js"]');
            if (static_host) {
                static_host = static_host.getAttribute('src');
            }

            if (static_host && static_host.length > 0) {
                static_host = static_host.substr(0, static_host.indexOf('/js/') + 1);
            } else {
                static_host = Url.websiteUrl();
            }
        }

        return static_host + path.replace(/(^\/)/g, '');
    };

    /**
     * @param {Object} new_params - Object with param-value pairs. To delete param, set value to null.
     * @param {boolean} should_preserve_old - Should existing query parameters be preserved.
     */
    var updateParamsWithoutReload = function updateParamsWithoutReload(new_params, should_preserve_old) {
        var updated_params = should_preserve_old ? Object.assign(paramsHash(), new_params) : new_params;
        Object.keys(new_params).forEach(function (key) {
            if (new_params[key] === null) {
                delete updated_params[key];
            }
        });
        var url = new URL(window.location);
        url.search = paramsHashToString(updated_params);
        window.history.replaceState({ url: url.href }, '', url.href);
    };

    var getSection = function getSection() {
        var url = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : window.location.href;
        return (url.match(new RegExp('/' + urlLang() + '/(.*)/', 'i')) || [])[1];
    };

    var getHashValue = function getHashValue(name) {
        var hash = (location_url || window.location).hash;
        var value = hash.split('=');
        return new RegExp(name).test(hash) && value.length > 1 ? value[1] : '';
    };

    return {
        init: init,
        reset: reset,
        paramsHash: paramsHash,
        getLocation: getLocation,
        paramsHashToString: paramsHashToString,
        urlFor: urlFor,
        urlForStatic: urlForStatic,
        getSection: getSection,
        getHashValue: getHashValue,
        updateParamsWithoutReload: updateParamsWithoutReload,

        param: function param(name) {
            return paramsHash()[name];
        },
        websiteUrl: function websiteUrl() {
            return 'https://www.binary.com/';
        }
    };
}();

module.exports = Url;

/***/ }),
/* 11 */,
/* 12 */,
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Cookies = __webpack_require__(48);
var elementTextContent = __webpack_require__(5).elementTextContent;
var getElementById = __webpack_require__(5).getElementById;
var CookieStorage = __webpack_require__(7).CookieStorage;
var LocalStore = __webpack_require__(7).LocalStore;
var applyToAllElements = __webpack_require__(3).applyToAllElements;

var Language = function () {
    var all_languages = {
        ACH: 'Translations',
        EN: 'English',
        DE: 'Deutsch',
        ES: 'Español',
        FR: 'Français',
        ID: 'Indonesia',
        IT: 'Italiano',
        JA: '日本語',
        PL: 'Polish',
        PT: 'Português',
        RU: 'Русский',
        TH: 'Thai',
        VI: 'Tiếng Việt',
        ZH_CN: '简体中文',
        ZH_TW: '繁體中文'
    };
    var default_language = 'EN';

    var setCookieLanguage = function setCookieLanguage(lang) {
        if (!Cookies.get('language') || lang) {
            var cookie = new CookieStorage('language');
            cookie.write((lang || getLanguage()).toUpperCase());
        }
    };

    var url_lang = null;

    var lang_regex = new RegExp('^(' + Object.keys(all_languages).join('|') + ')$', 'i');

    var languageFromUrl = function languageFromUrl(custom_url) {
        if (url_lang && !custom_url) return url_lang;
        var url_params = (custom_url || window.location.href).split('/').slice(3);
        var language = url_params.find(function (lang) {
            return lang_regex.test(lang);
        }) || '';
        if (!custom_url) {
            url_lang = language;
        }
        return language;
    };

    var current_lang = null;

    var getLanguage = function getLanguage() {
        if (/ach/i.test(current_lang) || /ach/i.test(languageFromUrl())) {
            var crowdin_lang_key = 'jipt_language_code_binary-static';
            var crowdin_lang = localStorage.getItem(crowdin_lang_key) || Cookies.get(crowdin_lang_key); // selected language for in-context translation
            if (crowdin_lang) {
                current_lang = crowdin_lang.toUpperCase().replace('-', '_').toUpperCase();
                if (document.body) {
                    document.body.classList.add(current_lang); // set the body class removed by crowdin code
                }
            }
        }
        current_lang = current_lang || (languageFromUrl() || Cookies.get('language') || default_language).toUpperCase();
        return current_lang;
    };

    var urlForLanguage = function urlForLanguage(lang) {
        var url = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : window.location.href;
        return url.replace(new RegExp('/' + getLanguage() + '/', 'i'), '/' + (lang || default_language).trim().toLowerCase() + '/');
    };

    var onChangeLanguage = function onChangeLanguage() {
        applyToAllElements('li', function (el) {
            el.addEventListener('click', function (e) {
                if (e.target.nodeName !== 'LI') return;
                var lang = e.target.getAttribute('class');
                if (getLanguage() === lang) return;
                elementTextContent(getElementById('display_language').getElementsByClassName('language'), e.target.textContent);
                LocalStore.remove('ws_cache');
                setCookieLanguage(lang);
                document.location = urlForLanguage(lang);
            });
        }, '', getElementById('select_language'));
    };

    return {
        getAll: function getAll() {
            return all_languages;
        },
        setCookie: setCookieLanguage,
        get: getLanguage,
        onChange: onChangeLanguage,
        urlFor: urlForLanguage,
        urlLang: languageFromUrl,
        reset: function reset() {
            url_lang = null;current_lang = null;
        }
    };
}();

module.exports = Language;

/***/ }),
/* 14 */,
/* 15 */,
/* 16 */,
/* 17 */,
/* 18 */,
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var moment = __webpack_require__(9);
var checkInput = __webpack_require__(5).checkInput;

var toTitleCase = function toTitleCase(str) {
    return (str || '').replace(/\w[^\s/\\]*/g, function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
};

var toISOFormat = function toISOFormat(date) {
    return date instanceof moment ? date.format('YYYY-MM-DD') : '';
};

var toReadableFormat = function toReadableFormat(date) {
    if (date instanceof moment) {
        if (window.innerWidth < 770 && checkInput('date', 'not-a-date')) {
            return toISOFormat(date);
        }
        return date.format('DD MMM, YYYY');
    }
    return '';
};

var padLeft = function padLeft(txt, len, char) {
    var text = String(txt || '');
    return text.length >= len ? text : '' + Array(len - text.length + 1).join(char) + text;
};

var compareBigUnsignedInt = function compareBigUnsignedInt(a, b) {
    var first_num = numberToString(a);
    var second_num = numberToString(b);
    if (!first_num || !second_num) {
        return '';
    }
    var max_length = Math.max(first_num.length, second_num.length);
    first_num = padLeft(first_num, max_length, '0');
    second_num = padLeft(second_num, max_length, '0');

    // lexicographical comparison
    var order = 0;
    if (first_num !== second_num) {
        order = first_num > second_num ? 1 : -1;
    }

    return order;
};

var numberToString = function numberToString(n) {
    return typeof n === 'number' ? String(n) : n;
};

module.exports = {
    toISOFormat: toISOFormat,
    toReadableFormat: toReadableFormat,
    toTitleCase: toTitleCase,
    padLeft: padLeft,
    numberToString: numberToString,

    compareBigUnsignedInt: compareBigUnsignedInt
};

/***/ }),
/* 20 */,
/* 21 */,
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var moment = __webpack_require__(9);
var isCryptocurrency = __webpack_require__(33).isCryptocurrency;
var SocketCache = __webpack_require__(49);
var LocalStore = __webpack_require__(7).LocalStore;
var State = __webpack_require__(7).State;
var getPropertyValue = __webpack_require__(3).getPropertyValue;
var isEmptyObject = __webpack_require__(3).isEmptyObject;

var ClientBase = function () {
    var storage_key = 'client.accounts';
    var client_object = {};
    var current_loginid = void 0;

    var init = function init() {
        current_loginid = LocalStore.get('active_loginid');
        client_object = getAllAccountsObject();
    };

    var isLoggedIn = function isLoggedIn() {
        return !isEmptyObject(getAllAccountsObject()) && get('loginid') && get('token');
    };

    var isValidLoginid = function isValidLoginid() {
        if (!isLoggedIn()) return true;
        var valid_login_ids = new RegExp('^(MX|MF|VRTC|MLT|CR|FOG)[0-9]+$', 'i');
        return getAllLoginids().every(function (loginid) {
            return valid_login_ids.test(loginid);
        });
    };

    /**
     * Stores the client information in local variable and localStorage
     *
     * @param {String} key                 The property name to set
     * @param {String|Number|Object} value The regarding value
     * @param {String|null} loginid        The account to set the value for
     */
    var set = function set(key, value) {
        var loginid = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : current_loginid;

        if (key === 'loginid' && value !== current_loginid) {
            LocalStore.set('active_loginid', value);
            current_loginid = value;
        } else {
            if (!(loginid in client_object)) {
                client_object[loginid] = {};
            }
            client_object[loginid][key] = value;
            LocalStore.setObject(storage_key, client_object);
        }
    };

    /**
     * Returns the client information
     *
     * @param {String|null} key     The property name to return the value from, if missing returns the account object
     * @param {String|null} loginid The account to return the value from
     */
    var get = function get(key) {
        var loginid = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : current_loginid;

        var value = void 0;
        if (key === 'loginid') {
            value = loginid || LocalStore.get('active_loginid');
        } else {
            var current_client = client_object[loginid] || getAllAccountsObject()[loginid] || client_object;

            value = key ? current_client[key] : current_client;
        }
        if (!Array.isArray(value) && (+value === 1 || +value === 0 || value === 'true' || value === 'false')) {
            value = JSON.parse(value || false);
        }
        return value;
    };

    var getAllAccountsObject = function getAllAccountsObject() {
        return LocalStore.getObject(storage_key);
    };

    var getAllLoginids = function getAllLoginids() {
        return Object.keys(getAllAccountsObject());
    };

    var getAccountType = function getAccountType() {
        var loginid = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : current_loginid;

        var account_type = void 0;
        if (/^VR/.test(loginid)) account_type = 'virtual';else if (/^MF/.test(loginid)) account_type = 'financial';else if (/^MLT|MX/.test(loginid)) account_type = 'gaming';
        return account_type;
    };

    var isAccountOfType = function isAccountOfType(type) {
        var loginid = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : current_loginid;
        var only_enabled = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

        var this_type = getAccountType(loginid);
        return (type === 'virtual' && this_type === 'virtual' || type === 'real' && this_type !== 'virtual' || type === this_type) && (only_enabled ? !get('is_disabled', loginid) : true);
    };

    var getAccountOfType = function getAccountOfType(type, only_enabled) {
        var id = getAllLoginids().find(function (loginid) {
            return isAccountOfType(type, loginid, only_enabled);
        });
        return id ? Object.assign({ loginid: id }, get(null, id)) : {};
    };

    var hasAccountType = function hasAccountType(type, only_enabled) {
        return !isEmptyObject(getAccountOfType(type, only_enabled));
    };

    // only considers currency of real money accounts
    // @param {String} type = crypto|fiat
    var hasCurrencyType = function hasCurrencyType(type) {
        var loginids = getAllLoginids();
        if (type === 'crypto') {
            // find if has crypto currency account
            return loginids.find(function (loginid) {
                return !get('is_virtual', loginid) && isCryptocurrency(get('currency', loginid));
            });
        }
        // else find if have fiat currency account
        return loginids.find(function (loginid) {
            return !get('is_virtual', loginid) && !isCryptocurrency(get('currency', loginid));
        });
    };

    var types_map = {
        virtual: 'Virtual',
        gaming: 'Gaming',
        financial: 'Investment'
    };

    var getAccountTitle = function getAccountTitle(loginid) {
        return types_map[getAccountType(loginid)] || 'Real';
    };

    var responseAuthorize = function responseAuthorize(response) {
        var authorize = response.authorize;
        set('email', authorize.email);
        set('currency', authorize.currency);
        set('is_virtual', +authorize.is_virtual);
        set('session_start', parseInt(moment().valueOf() / 1000));
        set('landing_company_shortcode', authorize.landing_company_name);
        updateAccountList(authorize.account_list);
    };

    var updateAccountList = function updateAccountList(account_list) {
        account_list.forEach(function (account) {
            set('excluded_until', account.excluded_until || '', account.loginid);
            Object.keys(account).forEach(function (param) {
                var param_to_set = param === 'country' ? 'residence' : param;
                var value_to_set = typeof account[param] === 'undefined' ? '' : account[param];
                if (param_to_set !== 'loginid') {
                    set(param_to_set, value_to_set, account.loginid);
                }
            });
        });
    };

    var shouldAcceptTnc = function shouldAcceptTnc() {
        if (get('is_virtual')) return false;
        var website_tnc_version = State.getResponse('website_status.terms_conditions_version');
        var client_tnc_status = State.getResponse('get_settings.client_tnc_status');
        return typeof client_tnc_status !== 'undefined' && client_tnc_status !== website_tnc_version;
    };

    var clearAllAccounts = function clearAllAccounts() {
        current_loginid = undefined;
        client_object = {};
        LocalStore.setObject(storage_key, client_object);
    };

    var setNewAccount = function setNewAccount(options) {
        if (!options.email || !options.loginid || !options.token) {
            return false;
        }

        SocketCache.clear();
        localStorage.setItem('GTM_new_account', '1');

        set('token', options.token, options.loginid);
        set('email', options.email, options.loginid);
        set('is_virtual', +options.is_virtual, options.loginid);
        set('loginid', options.loginid);

        return true;
    };

    var currentLandingCompany = function currentLandingCompany() {
        var landing_company_response = State.getResponse('landing_company') || {};
        var this_shortcode = get('landing_company_shortcode');
        var landing_company_prop = Object.keys(landing_company_response).find(function (key) {
            return this_shortcode === landing_company_response[key].shortcode;
        });
        return landing_company_response[landing_company_prop] || {};
    };

    var shouldCompleteTax = function shouldCompleteTax() {
        return isAccountOfType('financial') && !/crs_tin_information/.test((State.getResponse('get_account_status') || {}).status);
    };

    var getMT5AccountType = function getMT5AccountType(group) {
        return group ? group.replace('\\', '_').replace(/_(\d+|master)/, '') : '';
    }; // remove manager id or master distinction from group

    var getBasicUpgradeInfo = function getBasicUpgradeInfo() {
        var upgradeable_landing_companies = State.getResponse('authorize.upgradeable_landing_companies');

        var can_open_multi = false;
        var type = void 0,
            can_upgrade_to = void 0;

        if ((upgradeable_landing_companies || []).length) {
            var current_landing_company = get('landing_company_shortcode');

            can_open_multi = upgradeable_landing_companies.indexOf(current_landing_company) !== -1;

            // only show upgrade message to landing companies other than current
            var canUpgrade = function canUpgrade() {
                for (var _len = arguments.length, landing_companies = Array(_len), _key = 0; _key < _len; _key++) {
                    landing_companies[_key] = arguments[_key];
                }

                return landing_companies.find(function (landing_company) {
                    return landing_company !== current_landing_company && upgradeable_landing_companies.indexOf(landing_company) !== -1;
                });
            };

            can_upgrade_to = canUpgrade('costarica', 'iom', 'malta', 'maltainvest', 'japan');
            if (can_upgrade_to) {
                type = can_upgrade_to === 'maltainvest' ? 'financial' : 'real';
            }
        }

        return {
            type: type,
            can_upgrade: !!can_upgrade_to,
            can_upgrade_to: can_upgrade_to,
            can_open_multi: can_open_multi
        };
    };

    var getLandingCompanyValue = function getLandingCompanyValue(loginid, landing_company, key) {
        var landing_company_object = void 0;
        if (loginid.financial || isAccountOfType('financial', loginid)) {
            landing_company_object = getPropertyValue(landing_company, 'financial_company');
        } else if (loginid.real || isAccountOfType('real', loginid)) {
            landing_company_object = getPropertyValue(landing_company, 'gaming_company');

            // handle accounts that don't have gaming company
            if (!landing_company_object) {
                landing_company_object = getPropertyValue(landing_company, 'financial_company');
            }
        } else {
            var financial_company = (getPropertyValue(landing_company, 'financial_company') || {})[key] || [];
            var gaming_company = (getPropertyValue(landing_company, 'gaming_company') || {})[key] || [];
            landing_company_object = financial_company.concat(gaming_company);
            return landing_company_object;
        }
        return (landing_company_object || {})[key];
    };

    var getRiskAssessment = function getRiskAssessment() {
        var status = State.getResponse('get_account_status.status');
        var is_high_risk = /high/.test(State.getResponse('get_account_status.risk_classification'));

        return isAccountOfType('financial') ? /(financial_assessment|trading_experience)_not_complete/.test(status) : is_high_risk && /financial_assessment_not_complete/.test(status);
    };

    // API_V3: send a list of accounts the client can transfer to
    var canTransferFunds = function canTransferFunds(account) {
        if (account) {
            // this specific account can be used to transfer funds to
            return canTransferFundsTo(account.loginid);
        }
        // at least one account can be used to transfer funds to
        return Object.keys(client_object).some(function (loginid) {
            return canTransferFundsTo(loginid);
        });
    };

    var canTransferFundsTo = function canTransferFundsTo(to_loginid) {
        if (to_loginid === current_loginid || get('is_virtual', to_loginid) || get('is_virtual') || get('is_disabled', to_loginid)) {
            return false;
        }
        var from_currency = get('currency');
        var to_currency = get('currency', to_loginid);
        if (!from_currency || !to_currency) {
            return false;
        }
        // only transfer to other accounts that have the same currency as current account if one is maltainvest and one is malta
        if (from_currency === to_currency) {
            // these landing companies are allowed to transfer funds to each other if they have the same currency
            var same_cur_allowed = {
                maltainvest: 'malta',
                malta: 'maltainvest'
            };
            var from_landing_company = get('landing_company_shortcode');
            var to_landing_company = get('landing_company_shortcode', to_loginid);
            // if same_cur_allowed[from_landing_company] is undefined and to_landing_company is also undefined, it will return true
            // so we should compare '' === undefined instead
            return (same_cur_allowed[from_landing_company] || '') === to_landing_company;
        }
        // or for other clients if current account is cryptocurrency it should only transfer to fiat currencies and vice versa
        var is_from_crypto = isCryptocurrency(from_currency);
        var is_to_crypto = isCryptocurrency(to_currency);
        return is_from_crypto ? !is_to_crypto : is_to_crypto;
    };

    var hasCostaricaAccount = function hasCostaricaAccount() {
        return !!getAllLoginids().find(function (loginid) {
            return (/^CR/.test(loginid)
            );
        });
    };

    return {
        init: init,
        isLoggedIn: isLoggedIn,
        isValidLoginid: isValidLoginid,
        set: set,
        get: get,
        getAllLoginids: getAllLoginids,
        getAccountType: getAccountType,
        isAccountOfType: isAccountOfType,
        getAccountOfType: getAccountOfType,
        hasAccountType: hasAccountType,
        hasCurrencyType: hasCurrencyType,
        getAccountTitle: getAccountTitle,
        responseAuthorize: responseAuthorize,
        shouldAcceptTnc: shouldAcceptTnc,
        clearAllAccounts: clearAllAccounts,
        setNewAccount: setNewAccount,
        currentLandingCompany: currentLandingCompany,
        shouldCompleteTax: shouldCompleteTax,
        getMT5AccountType: getMT5AccountType,
        getBasicUpgradeInfo: getBasicUpgradeInfo,
        getLandingCompanyValue: getLandingCompanyValue,
        getRiskAssessment: getRiskAssessment,
        canTransferFunds: canTransferFunds,
        hasCostaricaAccount: hasCostaricaAccount
    };
}();

module.exports = ClientBase;

/***/ }),
/* 23 */,
/* 24 */,
/* 25 */,
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.connect = exports.MobxProvider = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _class, _temp;

var _mobxReact = __webpack_require__(28);

var _propTypes = __webpack_require__(4);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = __webpack_require__(2);

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SPECIAL_REACT_KEYS = { children: true, key: true, ref: true };

var MobxProvider = exports.MobxProvider = (_temp = _class = function (_Provider) {
    _inherits(MobxProvider, _Provider);

    function MobxProvider() {
        _classCallCheck(this, MobxProvider);

        return _possibleConstructorReturn(this, (MobxProvider.__proto__ || Object.getPrototypeOf(MobxProvider)).apply(this, arguments));
    }

    _createClass(MobxProvider, [{
        key: 'getChildContext',
        value: function getChildContext() {
            var stores = {};

            // inherit stores
            var baseStores = this.context.mobxStores;
            if (baseStores) {
                for (var key in baseStores) {
                    // eslint-disable-line
                    stores[key] = baseStores[key];
                }
            }

            // add own stores
            for (var _key in this.props.store) {
                // eslint-disable-line
                if (!SPECIAL_REACT_KEYS[_key]) {
                    stores[_key] = this.props.store[_key];
                }
            }

            return _extends({
                mobxStores: stores
            }, stores);
        }
    }]);

    return MobxProvider;
}(_mobxReact.Provider), _class.childContextTypes = {
    mobxStores: _propTypes2.default.object,
    client: _propTypes2.default.object,
    common: _propTypes2.default.object,
    modules: _propTypes2.default.object,
    ui: _propTypes2.default.object
}, _temp);


var connect_global_store = function connect_global_store(mapper) {
    return function (Component) {
        return (0, _mobxReact.inject)(mapper)((0, _mobxReact.observer)(Component));
    };
};

var connect = exports.connect = function connect(StoreClass, mapper) {
    return function (Component) {
        if (!mapper) {
            return connect_global_store(StoreClass)(Component);
        }

        var observed = (0, _mobxReact.observer)(Component);

        var StoredComponent = function (_Component) {
            _inherits(StoredComponent, _Component);

            function StoredComponent() {
                var _ref;

                var _temp2, _this2, _ret;

                _classCallCheck(this, StoredComponent);

                for (var _len = arguments.length, args = Array(_len), _key2 = 0; _key2 < _len; _key2++) {
                    args[_key2] = arguments[_key2];
                }

                return _ret = (_temp2 = (_this2 = _possibleConstructorReturn(this, (_ref = StoredComponent.__proto__ || Object.getPrototypeOf(StoredComponent)).call.apply(_ref, [this].concat(args))), _this2), _this2.store = new StoreClass(), _this2.propTypes = {
                    children: _propTypes2.default.object
                }, _temp2), _possibleConstructorReturn(_this2, _ret);
            }

            _createClass(StoredComponent, [{
                key: 'render',
                value: function render() {
                    return _react2.default.createElement(observed, _extends({}, this.props, {
                        store: this.store
                    }), this.props.children);
                }
            }]);

            return StoredComponent;
        }(Component);

        var wrappedDisplayName = Component.displayName || Component.name || Component.constructor && Component.constructor.name || 'Unknown';
        StoredComponent.displayName = 'store-' + wrappedDisplayName;

        return (0, _mobxReact.inject)(mapper)(StoredComponent);
    };
};

/***/ }),
/* 27 */,
/* 28 */,
/* 29 */,
/* 30 */,
/* 31 */,
/* 32 */,
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var getLanguage = __webpack_require__(13).get;
var localize = __webpack_require__(0).localize;
var State = __webpack_require__(7).State;
var getPropertyValue = __webpack_require__(3).getPropertyValue;

var currencies_config = {};

var formatMoney = function formatMoney(currency_value, amount, exclude_currency) {
    var decimals = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
    var minimumFractionDigits = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;

    var money = amount;
    if (money) money = String(money).replace(/,/g, '');
    var sign = money && Number(money) < 0 ? '-' : '';
    var decimal_places = decimals || getDecimalPlaces(currency_value);

    money = isNaN(money) ? 0 : Math.abs(money);
    if (typeof Intl !== 'undefined') {
        var options = {
            minimumFractionDigits: minimumFractionDigits || decimal_places,
            maximumFractionDigits: decimal_places
        };
        money = new Intl.NumberFormat(getLanguage().toLowerCase().replace('_', '-'), options).format(money);
    } else {
        money = addComma(money, decimal_places);
    }

    return sign + (exclude_currency ? '' : formatCurrency(currency_value)) + money;
};

var formatCurrency = function formatCurrency(currency) {
    return '<span class="symbols ' + (currency || '').toLowerCase() + '"></span>';
}; // defined in binary-style

var addComma = function addComma(num, decimal_points, is_crypto) {
    var number = String(num || 0).replace(/,/g, '');
    if (typeof decimal_points !== 'undefined') {
        number = (+number).toFixed(decimal_points);
    }
    if (is_crypto) {
        number = parseFloat(+number);
    }

    return number.toString().replace(/(^|[^\w.])(\d{4,})/g, function ($0, $1, $2) {
        return $1 + $2.replace(/\d(?=(?:\d\d\d)+(?!\d))/g, '$&,');
    });
};

var isJPClient = function isJPClient() {
    return !!State.get('is_jp_client');
};

var getFiatDecimalPlaces = function getFiatDecimalPlaces() {
    return isJPClient() ? 0 : 2;
};

var calcDecimalPlaces = function calcDecimalPlaces(currency) {
    return isCryptocurrency(currency) ? 8 : getFiatDecimalPlaces();
};

var getDecimalPlaces = function getDecimalPlaces(currency) {
    return (
        // need to check currencies_config[currency] exists instead of || in case of 0 value
        currencies_config[currency] ? getPropertyValue(currencies_config, [currency, 'fractional_digits']) : calcDecimalPlaces(currency)
    );
};

var setCurrencies = function setCurrencies(website_status) {
    currencies_config = website_status.currencies_config;
};

// (currency in crypto_config) is a back-up in case website_status doesn't include the currency config, in some cases where it's disabled
var isCryptocurrency = function isCryptocurrency(currency) {
    return (/crypto/i.test(getPropertyValue(currencies_config, [currency, 'type'])) || currency in crypto_config
    );
};

var crypto_config = {
    BTC: { name: 'Bitcoin', min_withdrawal: 0.002, pa_max_withdrawal: 5, pa_min_withdrawal: 0.002 },
    BCH: { name: 'Bitcoin Cash', min_withdrawal: 0.002, pa_max_withdrawal: 5, pa_min_withdrawal: 0.002 },
    ETH: { name: 'Ether', min_withdrawal: 0.002, pa_max_withdrawal: 5, pa_min_withdrawal: 0.002 },
    ETC: { name: 'Ether Classic', min_withdrawal: 0.002, pa_max_withdrawal: 5, pa_min_withdrawal: 0.002 },
    LTC: { name: 'Litecoin', min_withdrawal: 0.002, pa_max_withdrawal: 5, pa_min_withdrawal: 0.002 },
    DAI: { name: 'Dai', min_withdrawal: 0.002, pa_max_withdrawal: 2000, pa_min_withdrawal: 10 }
};

var getMinWithdrawal = function getMinWithdrawal(currency) {
    return isCryptocurrency(currency) ? getPropertyValue(crypto_config, [currency, 'min_withdrawal']) || 0.002 : 1;
};

// @param {String} limit = max|min
var getPaWithdrawalLimit = function getPaWithdrawalLimit(currency, limit) {
    if (isCryptocurrency(currency)) {
        return getPropertyValue(crypto_config, [currency, 'pa_' + limit + '_withdrawal']);
    }
    return limit === 'max' ? 2000 : 10;
};

var getCurrencyName = function getCurrencyName(currency) {
    return localize(getPropertyValue(crypto_config, [currency, 'name']) || '');
};

var getMinPayout = function getMinPayout(currency) {
    return getPropertyValue(currencies_config, [currency, 'stake_default']);
};

module.exports = {
    formatMoney: formatMoney,
    formatCurrency: formatCurrency,
    addComma: addComma,
    getDecimalPlaces: getDecimalPlaces,
    setCurrencies: setCurrencies,
    isCryptocurrency: isCryptocurrency,
    getCurrencyName: getCurrencyName,
    getMinWithdrawal: getMinWithdrawal,
    getMinPayout: getMinPayout,
    getPaWithdrawalLimit: getPaWithdrawalLimit,
    getCurrencies: function getCurrencies() {
        return currencies_config;
    }
};

/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Client = __webpack_require__(22);
var getLanguage = __webpack_require__(13).get;
var isStorageSupported = __webpack_require__(7).isStorageSupported;
var getAppId = __webpack_require__(37).getAppId;

var Login = function () {
    var redirectToLogin = function redirectToLogin() {
        if (!Client.isLoggedIn() && !isLoginPages() && isStorageSupported(sessionStorage)) {
            sessionStorage.setItem('redirect_url', window.location.href);
            window.location.href = loginUrl();
        }
    };

    var loginUrl = function loginUrl() {
        var server_url = localStorage.getItem('config.server_url');
        var language = getLanguage();
        return server_url && /qa/.test(server_url) ? 'https://www.' + server_url.split('.')[1] + '.com/oauth2/authorize?app_id=' + getAppId() + '&l=' + language : 'https://oauth.binary.com/oauth2/authorize?app_id=' + getAppId() + '&l=' + language;
    };

    var isLoginPages = function isLoginPages() {
        return (/logged_inws|redirect/i.test(window.location.pathname)
        );
    };

    var socialLoginUrl = function socialLoginUrl(brand) {
        return loginUrl() + '&social_signup=' + brand;
    };

    return {
        redirectToLogin: redirectToLogin,
        isLoginPages: isLoginPages,
        socialLoginUrl: socialLoginUrl
    };
}();

module.exports = Login;

/***/ }),
/* 35 */,
/* 36 */,
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// const Cookies = require('js-cookie');

/*
 * Configuration values needed in js codes
 *
 * NOTE:
 * Please use the following command to avoid accidentally committing personal changes
 * git update-index --assume-unchanged src/javascript/config.js
 *
 */

var getAppId = function getAppId() {
    var app_id = null;
    var user_app_id = ''; // you can insert Application ID of your registered application here
    var config_app_id = window.localStorage.getItem('config.app_id');
    if (config_app_id) {
        app_id = config_app_id;
    } else if (/staging\.binary\.com/i.test(window.location.hostname)) {
        window.localStorage.removeItem('config.default_app_id');
        app_id = 1098;
    } else if (user_app_id.length) {
        window.localStorage.setItem('config.default_app_id', user_app_id); // it's being used in endpoint chrome extension - please do not remove
        app_id = user_app_id;
    } else if (/localhost/i.test(window.location.hostname)) {
        app_id = 1159;
    } else {
        window.localStorage.removeItem('config.default_app_id');
        app_id = 1;
    }
    return app_id;
};

var getSocketURL = function getSocketURL() {
    var server_url = window.localStorage.getItem('config.server_url');
    if (!server_url) {
        // const to_green_percent = { real: 100, virtual: 0, logged_out: 0 }; // default percentage
        // const category_map     = ['real', 'virtual', 'logged_out'];
        // const percent_values   = Cookies.get('connection_setup'); // set by GTM
        //
        // // override defaults by cookie values
        // if (percent_values && percent_values.indexOf(',') > 0) {
        //     const cookie_percents = percent_values.split(',');
        //     category_map.map((cat, idx) => {
        //         if (cookie_percents[idx] && !isNaN(cookie_percents[idx])) {
        //             to_green_percent[cat] = +cookie_percents[idx].trim();
        //         }
        //     });
        // }

        // let server = 'blue';
        // if (/www\.binary\.com/i.test(window.location.hostname)) {
        //     const loginid = window.localStorage.getItem('active_loginid');
        //     let client_type = category_map[2];
        //     if (loginid) {
        //         client_type = /^VRT/.test(loginid) ? category_map[1] : category_map[0];
        //     }
        //
        //     const random_percent = Math.random() * 100;
        //     if (random_percent < to_green_percent[client_type]) {
        //         server = 'green';
        //     }
        // }

        // TODO: in order to use connection_setup config, uncomment the above section and remove next lines

        var is_production = /www\.binary\.com/i.test(window.location.hostname);
        var loginid = window.localStorage.getItem('active_loginid');
        var is_real = loginid && !/^VRT/.test(loginid);
        var server = is_production && is_real ? 'green' : 'blue';

        server_url = server + '.binaryws.com';
    }
    return 'wss://' + server_url + '/websockets/v3';
};

module.exports = {
    getAppId: getAppId,
    getSocketURL: getSocketURL
};

/***/ }),
/* 38 */,
/* 39 */,
/* 40 */,
/* 41 */,
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ClientBase = __webpack_require__(22);
var SocketCache = __webpack_require__(49);
var getLanguage = __webpack_require__(13).get;
var State = __webpack_require__(7).State;
var cloneObject = __webpack_require__(3).cloneObject;
var getPropertyValue = __webpack_require__(3).getPropertyValue;
var isEmptyObject = __webpack_require__(3).isEmptyObject;
var getAppId = __webpack_require__(37).getAppId;
var getSocketURL = __webpack_require__(37).getSocketURL;

/*
 * An abstraction layer over native javascript WebSocket,
 * which provides additional functionality like
 * reopen the closed connection and process the buffered requests
 */
var BinarySocketBase = function () {
    var binary_socket = void 0;

    var config = {};
    var buffered_sends = [];
    var req_id = 0;
    var wrong_app_id = 0;
    var is_available = true;
    var is_disconnect_called = false;

    var socket_url = getSocketURL() + '?app_id=' + getAppId() + '&l=' + getLanguage();
    var timeouts = {};
    var promises = {};

    var no_duplicate_requests = ['authorize', 'get_settings', 'residence_list', 'landing_company', 'payout_currencies', 'asset_index'];

    var sent_requests = {
        items: [],
        clear: function clear() {
            sent_requests.items = [];
        },
        has: function has(msg_type) {
            return sent_requests.items.indexOf(msg_type) >= 0;
        },
        add: function add(msg_type) {
            if (!sent_requests.has(msg_type)) sent_requests.items.push(msg_type);
        },
        remove: function remove(msg_type) {
            if (sent_requests.has(msg_type)) sent_requests.items.splice(sent_requests.items.indexOf(msg_type, 1));
        }
    };

    var waiting_list = {
        items: {},
        add: function add(msg_type, promise_obj) {
            if (!waiting_list.items[msg_type]) {
                waiting_list.items[msg_type] = [];
            }
            waiting_list.items[msg_type].push(promise_obj);
        },
        resolve: function resolve(response) {
            var msg_type = response.msg_type;
            var this_promises = waiting_list.items[msg_type];
            if (this_promises && this_promises.length) {
                this_promises.forEach(function (pr) {
                    if (!waiting_list.another_exists(pr, msg_type)) {
                        pr.resolve(response);
                    }
                });
                waiting_list.items[msg_type] = [];
            }
        },
        another_exists: function another_exists(pr, msg_type) {
            return Object.keys(waiting_list.items).some(function (type) {
                return type !== msg_type && waiting_list.items[type].indexOf(pr) !== -1;
            });
        }
    };

    var clearTimeouts = function clearTimeouts() {
        Object.keys(timeouts).forEach(function (key) {
            clearTimeout(timeouts[key]);
            delete timeouts[key];
        });
    };

    var isReady = function isReady() {
        return hasReadyState(1);
    };

    var isClose = function isClose() {
        return !binary_socket || hasReadyState(2, 3);
    };

    var hasReadyState = function hasReadyState() {
        for (var _len = arguments.length, states = Array(_len), _key = 0; _key < _len; _key++) {
            states[_key] = arguments[_key];
        }

        return binary_socket && states.some(function (s) {
            return binary_socket.readyState === s;
        });
    };

    var sendBufferedRequests = function sendBufferedRequests() {
        while (buffered_sends.length > 0 && is_available) {
            var req_obj = buffered_sends.shift();
            send(req_obj.request, req_obj.options);
        }
    };

    var wait = function wait() {
        for (var _len2 = arguments.length, msg_types = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
            msg_types[_key2] = arguments[_key2];
        }

        var promise_obj = new PromiseClass();
        var is_resolved = true;
        msg_types.forEach(function (msg_type) {
            var last_response = State.get(['response', msg_type]);
            if (!last_response) {
                if (msg_type !== 'authorize' || ClientBase.isLoggedIn()) {
                    waiting_list.add(msg_type, promise_obj);
                    is_resolved = false;
                }
            } else if (msg_types.length === 1) {
                promise_obj.resolve(last_response);
            }
        });
        if (is_resolved) {
            promise_obj.resolve();
        }
        return promise_obj.promise;
    };

    /**
     * @param {Object} data: request object
     * @param {Object} options:
     *      forced  : {boolean}  sends the request regardless the same msg_type has been sent before
     *      msg_type: {string}   specify the type of request call
     *      callback: {function} to call on response of streaming requests
     */
    var send = function send(data) {
        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        var promise_obj = options.promise || new PromiseClass();

        if (!data || isEmptyObject(data)) return promise_obj.promise;

        var msg_type = options.msg_type || no_duplicate_requests.find(function (c) {
            return c in data;
        });

        // Fetch from cache
        if (!options.forced) {
            var response = SocketCache.get(data, msg_type);
            if (response) {
                State.set(['response', msg_type], cloneObject(response));
                if (isReady() && is_available) {
                    // make the request to keep the cache updated
                    binary_socket.send(JSON.stringify(data));
                }
                promise_obj.resolve(response);
                return promise_obj.promise;
            }
        }

        // Fetch from state
        if (!options.forced && msg_type && no_duplicate_requests.indexOf(msg_type) !== -1) {
            var last_response = State.get(['response', msg_type]);
            if (last_response) {
                promise_obj.resolve(last_response);
                return promise_obj.promise;
            } else if (sent_requests.has(msg_type)) {
                return wait(msg_type).then(function (response) {
                    promise_obj.resolve(response);
                    return promise_obj.promise;
                });
            }
        }

        if (!data.req_id) {
            data.req_id = ++req_id;
        }
        promises[data.req_id] = {
            callback: function callback(response) {
                if (typeof options.callback === 'function') {
                    options.callback(response);
                } else {
                    promise_obj.resolve(response);
                }
            },
            subscribe: !!data.subscribe
        };

        if (isReady() && is_available && config.isOnline()) {
            is_disconnect_called = false;
            if (!getPropertyValue(data, 'passthrough') && !getPropertyValue(data, 'verify_email')) {
                data.passthrough = {};
            }

            binary_socket.send(JSON.stringify(data));
            config.wsEvent('send');
            if (msg_type && !sent_requests.has(msg_type)) {
                sent_requests.add(msg_type);
            }
        } else if (+data.time !== 1) {
            // Do not buffer all time requests
            buffered_sends.push({ request: data, options: Object.assign(options, { promise: promise_obj }) });
        }

        return promise_obj.promise;
    };

    var init = function init(options) {
        if (wrong_app_id === getAppId()) {
            return;
        }
        if ((typeof options === 'undefined' ? 'undefined' : _typeof(options)) === 'object' && config !== options) {
            config = options;
            buffered_sends = [];
        }
        clearTimeouts();
        config.wsEvent('init');

        if (isClose()) {
            binary_socket = new WebSocket(socket_url);
            State.set('response', {});
        }

        binary_socket.onopen = function () {
            config.wsEvent('open');
            if (ClientBase.isLoggedIn()) {
                send({ authorize: ClientBase.get('token') }, { forced: true });
            } else {
                sendBufferedRequests();
            }

            if (typeof config.onOpen === 'function') {
                config.onOpen(isReady());
            }
        };

        binary_socket.onmessage = function (msg) {
            config.wsEvent('message');
            var response = msg.data ? JSON.parse(msg.data) : undefined;
            if (response) {
                SocketCache.set(response);
                var msg_type = response.msg_type;

                // store in State
                if (!getPropertyValue(response, ['echo_req', 'subscribe']) || /balance|website_status/.test(msg_type)) {
                    State.set(['response', msg_type], cloneObject(response));
                }
                // resolve the send promise
                var this_req_id = response.req_id;
                var pr = this_req_id ? promises[this_req_id] : null;
                if (pr && typeof pr.callback === 'function') {
                    pr.callback(response);
                    if (!pr.subscribe) {
                        delete promises[this_req_id];
                    }
                }
                // resolve the wait promise
                waiting_list.resolve(response);

                if (getPropertyValue(response, ['error', 'code']) === 'InvalidAppID') {
                    wrong_app_id = getAppId();
                }

                if (typeof config.onMessage === 'function') {
                    config.onMessage(response);
                }
            }
        };

        binary_socket.onclose = function () {
            sent_requests.clear();
            clearTimeouts();
            config.wsEvent('close');

            if (wrong_app_id !== getAppId() && typeof config.onDisconnect === 'function' && !is_disconnect_called) {
                config.onDisconnect();
                is_disconnect_called = true;
            }
        };
    };

    var clear = function clear(msg_type) {
        buffered_sends = [];
        if (msg_type) {
            State.set(['response', msg_type], undefined);
            sent_requests.remove(msg_type);
        }
    };

    var availability = function availability(status) {
        if (typeof status !== 'undefined') {
            is_available = !!status;
        }
        return is_available;
    };

    return {
        init: init,
        wait: wait,
        send: send,
        clear: clear,
        clearTimeouts: clearTimeouts,
        availability: availability,
        hasReadyState: hasReadyState,
        sendBuffered: sendBufferedRequests,
        get: function get() {
            return binary_socket;
        },
        setOnDisconnect: function setOnDisconnect(onDisconnect) {
            config.onDisconnect = onDisconnect;
        },
        removeOnDisconnect: function removeOnDisconnect() {
            delete config.onDisconnect;
        }
    };
}();

var PromiseClass = function PromiseClass() {
    var _this = this;

    _classCallCheck(this, PromiseClass);

    this.promise = new Promise(function (resolve, reject) {
        _this.reject = reject;
        _this.resolve = resolve;
    });
};

module.exports = BinarySocketBase;

/***/ }),
/* 43 */,
/* 44 */,
/* 45 */,
/* 46 */,
/* 47 */,
/* 48 */,
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var moment = __webpack_require__(9);
var getLanguage = __webpack_require__(13).get;
var LocalStore = __webpack_require__(7).LocalStore;
var getPropertyValue = __webpack_require__(3).getPropertyValue;
var getStaticHash = __webpack_require__(3).getStaticHash;
var isEmptyObject = __webpack_require__(3).isEmptyObject;

/*
 * Caches WS responses to reduce delay time and number of requests
 * Stores data in LocalStore which is the first one available in: localStorage, sessionStorage, InScriptStore
 *
 * 1. It caches only the response of those calls which determined in `config`
 * 2. It doesn't cache responses which returned error
 * 3. The value is requested by BinarySocket,
 *    if this returns a value according to the logic here, socket code take it as response
 *    but also triggers an async `send` request, to keep the cache updated for next time
 * 4. Uses client's time to set and check for expiry, as the expire durations are not so long to need a more precise one
 *    (And doesn't worth to wait for the response of time call)
 * 5. Some responses should be cached by a particular value from request (e.g. contracts_for_frxAUDJPY)
 *    so there can be more than one value for a particular call
 * 6. Clears the whole cache regardless their expire time on the following events:
 *    6.1. Client changes: login / logout / switch loginid
 *    6.2. Detect a new release (static hash changed)
 */
var SocketCache = function () {
    // keys are msg_type
    // expire: how long to keep the value (in minutes)
    // map_to: to store different responses of the same key, should be array of:
    //     string  : the property value from echo_req
    //     function: return value of the function
    var config = {
        payout_currencies: { expire: 10 },
        active_symbols: { expire: 10, map_to: ['product_type', 'landing_company', getLanguage] },
        contracts_for: { expire: 10, map_to: ['contracts_for', 'product_type', 'currency'] },
        exchange_rates: { expire: 60, map_to: ['base_currency'] }
    };

    var storage_key = 'ws_cache';

    var data_obj = {};

    var set = function set(response) {
        var msg_type = response.msg_type;

        if (!config[msg_type]) return;

        // prevent unwanted page behaviour
        // if a cached version already exists but it gives an error after being called for updating the cache
        var cashed_response = get(response.echo_req);
        if ((response.error || !response[msg_type]) && cashed_response && !cashed_response.error) {
            clear();
            window.location.reload();
            return;
        }

        var key = makeKey(response.echo_req, msg_type);
        var expires = moment().add(config[msg_type].expire, 'm').valueOf();

        if (!data_obj.static_hash) {
            data_obj.static_hash = getStaticHash();
        }

        data_obj[key] = { value: response, expires: expires };
        LocalStore.setObject(storage_key, data_obj);
    };

    var get = function get(request, msg_type) {
        var response = void 0;

        if (isEmptyObject(data_obj)) {
            data_obj = LocalStore.getObject(storage_key);
            if (isEmptyObject(data_obj)) return undefined;
        }

        if (data_obj.static_hash !== getStaticHash()) {
            // new release
            clear();
        }

        var key = makeKey(request, msg_type);
        var response_obj = getPropertyValue(data_obj, key) || {};

        if (moment().isBefore(response_obj.expires)) {
            response = response_obj.value;
        } else {
            // remove if expired
            remove(key);
        }

        return response;
    };

    var makeKey = function makeKey(source_obj, msg_type) {
        var key = msg_type || Object.keys(source_obj).find(function (type) {
            return config[type];
        });

        if (key && !isEmptyObject(source_obj)) {
            ((config[key] || {}).map_to || []).forEach(function (map_key) {
                var value = typeof map_key === 'function' ? map_key() : source_obj[map_key];
                key += map_key ? '_' + (value || '') : '';
            });
        }

        return key;
    };

    var remove = function remove(key, should_match_all) {
        if (should_match_all) {
            Object.keys(data_obj).forEach(function (data_key) {
                if (data_key.indexOf(key) !== -1) {
                    delete data_obj[data_key];
                }
            });
        } else if (key in data_obj) {
            delete data_obj[key];
        }
        LocalStore.setObject(storage_key, data_obj);
    };

    var clear = function clear() {
        LocalStore.remove(storage_key);
        data_obj = {};
    };

    return {
        set: set,
        get: get,
        remove: remove,
        clear: clear
    };
}();

module.exports = SocketCache;

/***/ }),
/* 50 */,
/* 51 */,
/* 52 */,
/* 53 */,
/* 54 */,
/* 55 */,
/* 56 */,
/* 57 */,
/* 58 */,
/* 59 */,
/* 60 */,
/* 61 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var Cookies = __webpack_require__(48);
var moment = __webpack_require__(9);
var ClientBase = __webpack_require__(22);
var Login = __webpack_require__(34);
var BinarySocket = __webpack_require__(42);
var getElementById = __webpack_require__(5).getElementById;
var isVisible = __webpack_require__(5).isVisible;
var getLanguage = __webpack_require__(13).get;
var State = __webpack_require__(7).State;
var getAppId = __webpack_require__(37).getAppId;

var GTM = function () {
    var isGtmApplicable = function isGtmApplicable() {
        return (/^(1|1098)$/.test(getAppId())
        );
    };

    var gtmDataLayerInfo = function gtmDataLayerInfo(data) {
        var data_layer_info = {
            language: getLanguage(),
            pageTitle: pageTitle(),
            pjax: State.get('is_loaded_by_pjax'),
            url: document.URL,
            event: 'page_load'
        };
        if (ClientBase.isLoggedIn()) {
            data_layer_info.visitorId = ClientBase.get('loginid');
        }

        Object.assign(true, data_layer_info, data);

        var event = data_layer_info.event;
        delete data_layer_info.event;

        return {
            event: event,
            data: data_layer_info
        };
    };

    var pushDataLayer = function pushDataLayer(data) {
        if (isGtmApplicable() && !Login.isLoginPages()) {
            var info = gtmDataLayerInfo(data && (typeof data === 'undefined' ? 'undefined' : _typeof(data)) === 'object' ? data : null);
            dataLayer[0] = info.data;
            dataLayer.push(info.data);
            dataLayer.push({ event: info.event });
        }
    };

    var pageTitle = function pageTitle() {
        var t = /^.+[:-]\s*(.+)$/.exec(document.title);
        return t && t[1] ? t[1] : document.title;
    };

    var eventHandler = function eventHandler(get_settings) {
        if (!isGtmApplicable()) return;
        var is_login = localStorage.getItem('GTM_login') === '1';
        var is_new_account = localStorage.getItem('GTM_new_account') === '1';
        if (!is_login && !is_new_account) return;

        localStorage.removeItem('GTM_login');
        localStorage.removeItem('GTM_new_account');

        var affiliate_token = Cookies.getJSON('affiliate_tracking');
        if (affiliate_token) {
            pushDataLayer({ bom_affiliate_token: affiliate_token.t });
        }

        var data = {
            visitorId: ClientBase.get('loginid'),
            bom_currency: ClientBase.get('currency'),
            bom_country: get_settings.country,
            bom_country_abbrev: get_settings.country_code,
            bom_email: get_settings.email,
            url: window.location.href,
            bom_today: Math.floor(Date.now() / 1000),
            event: is_new_account ? 'new_account' : 'log_in'
        };
        if (is_new_account) {
            data.bom_date_joined = data.bom_today;
        }
        if (!ClientBase.get('is_virtual')) {
            data.bom_age = parseInt((moment().unix() - get_settings.date_of_birth) / 31557600);
            data.bom_firstname = get_settings.first_name;
            data.bom_lastname = get_settings.last_name;
            data.bom_phone = get_settings.phone;
        }

        if (is_login) {
            BinarySocket.wait('mt5_login_list').then(function (response) {
                (response.mt5_login_list || []).forEach(function (obj) {
                    var acc_type = (ClientBase.getMT5AccountType(obj.group) || '').replace('real_vanuatu', 'financial').replace('vanuatu_', '').replace('costarica', 'gaming'); // i.e. financial_cent, demo_cent, demo_gaming, real_gaming
                    if (acc_type) {
                        data['mt5_' + acc_type + '_id'] = obj.login;
                    }
                });
                pushDataLayer(data);
            });
        } else {
            pushDataLayer(data);
        }
    };

    var pushPurchaseData = function pushPurchaseData(response) {
        if (!isGtmApplicable() || ClientBase.get('is_virtual')) return;
        var buy = response.buy;
        if (!buy) return;
        var req = response.echo_req.passthrough;
        var data = {
            event: 'buy_contract',
            visitorId: ClientBase.get('loginid'),
            bom_symbol: req.symbol,
            bom_market: getElementById('contract_markets').value,
            bom_currency: req.currency,
            bom_contract_type: req.contract_type,
            bom_contract_id: buy.contract_id,
            bom_transaction_id: buy.transaction_id,
            bom_buy_price: buy.buy_price,
            bom_payout: buy.payout
        };
        Object.assign(data, {
            bom_amount: req.amount,
            bom_basis: req.basis,
            bom_expiry_type: getElementById('expiry_type').value
        });
        if (data.bom_expiry_type === 'duration') {
            Object.assign(data, {
                bom_duration: req.duration,
                bom_duration_unit: req.duration_unit
            });
        }
        if (isVisible(getElementById('barrier'))) {
            data.bom_barrier = req.barrier;
        } else if (isVisible(getElementById('barrier_high'))) {
            data.bom_barrier_high = req.barrier;
            data.bom_barrier_low = req.barrier2;
        }
        if (isVisible(getElementById('prediction'))) {
            data.bom_prediction = req.barrier;
        }

        pushDataLayer(data);
    };

    var mt5NewAccount = function mt5NewAccount(response) {
        var acc_type = response.mt5_new_account.mt5_account_type ? response.mt5_new_account.account_type + '_' + response.mt5_new_account.mt5_account_type : // financial_cent, demo_cent, ...
        (response.mt5_new_account.account_type === 'demo' ? 'demo' : 'real') + '_gaming'; // demo_gaming, real_gaming

        var gtm_data = {
            event: 'mt5_new_account',
            bom_email: ClientBase.get('email'),
            bom_country: State.getResponse('get_settings.country'),
            mt5_last_signup: acc_type
        };

        gtm_data['mt5_' + acc_type + '_id'] = response.mt5_new_account.login;

        if (/demo/.test(acc_type) && !ClientBase.get('is_virtual')) {
            gtm_data.visitorId = ClientBase.getAccountOfType('virtual').loginid;
        }

        pushDataLayer(gtm_data);
    };

    return {
        pushDataLayer: pushDataLayer,
        eventHandler: eventHandler,
        pushPurchaseData: pushPurchaseData,
        mt5NewAccount: mt5NewAccount,
        setLoginFlag: function setLoginFlag() {
            if (isGtmApplicable()) localStorage.setItem('GTM_login', '1');
        }
    };
}();

module.exports = GTM;

/***/ }),
/* 62 */,
/* 63 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = __webpack_require__(2);

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__(4);

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Section = function Section(_ref) {
    var title = _ref.title,
        description = _ref.description,
        children = _ref.children;
    return _react2.default.createElement(
        'div',
        { className: 'section' },
        _react2.default.createElement(
            'h2',
            { className: 'section__title' },
            title
        ),
        _react2.default.createElement(
            'h4',
            { className: 'section__description' },
            description
        ),
        children
    );
};

Section.propTypes = {
    title: _propTypes2.default.string,
    description: _propTypes2.default.string,
    children: _propTypes2.default.oneOfType([_propTypes2.default.arrayOf(_propTypes2.default.node), _propTypes2.default.node])
};

exports.default = Section;

/***/ }),
/* 64 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.WS = exports.BinarySocketGeneral = undefined;

var _logout = __webpack_require__(257);

Object.keys(_logout).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _logout[key];
    }
  });
});

var _socket_general = __webpack_require__(514);

var _socket_general2 = _interopRequireDefault(_socket_general);

var _ws_methods = __webpack_require__(166);

var _ws_methods2 = _interopRequireDefault(_ws_methods);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.BinarySocketGeneral = _socket_general2.default;
exports.WS = _ws_methods2.default;

/***/ }),
/* 65 */,
/* 66 */,
/* 67 */,
/* 68 */,
/* 69 */,
/* 70 */,
/* 71 */,
/* 72 */,
/* 73 */,
/* 74 */,
/* 75 */,
/* 76 */,
/* 77 */,
/* 78 */,
/* 79 */,
/* 80 */,
/* 81 */,
/* 82 */,
/* 83 */,
/* 84 */,
/* 85 */,
/* 86 */,
/* 87 */,
/* 88 */,
/* 89 */,
/* 90 */,
/* 91 */,
/* 92 */,
/* 93 */,
/* 94 */,
/* 95 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _classnames = __webpack_require__(18);

var _classnames2 = _interopRequireDefault(_classnames);

var _propTypes = __webpack_require__(4);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = __webpack_require__(2);

var _react2 = _interopRequireDefault(_react);

var _tooltip = __webpack_require__(164);

var _tooltip2 = _interopRequireDefault(_tooltip);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Fieldset = function Fieldset(_ref) {
    var children = _ref.children,
        className = _ref.className,
        header = _ref.header,
        icon = _ref.icon,
        onMouseEnter = _ref.onMouseEnter,
        onMouseLeave = _ref.onMouseLeave,
        tooltip = _ref.tooltip;

    var field_left_class = (0, _classnames2.default)('field-info left', { icon: icon }, icon);

    return _react2.default.createElement(
        'fieldset',
        { className: className, onMouseEnter: onMouseEnter, onMouseLeave: onMouseLeave },
        !!header && _react2.default.createElement(
            'div',
            { className: 'fieldset-header' },
            _react2.default.createElement(
                'span',
                { className: field_left_class },
                header
            )
        ),
        !!tooltip && _react2.default.createElement(
            'span',
            { className: 'field-info right' },
            _react2.default.createElement(_tooltip2.default, {
                alignment: 'left',
                icon: 'info',
                message: tooltip || 'Message goes here.'
            })
        ),
        children
    );
};

// ToDo:
// - Refactor Last Digit to keep the children as array type.
//   Currently last_digit.jsx returns object (React-Element) as 'children'
//   props type.
Fieldset.propTypes = {
    children: _propTypes2.default.oneOfType([_propTypes2.default.array, _propTypes2.default.object]),
    className: _propTypes2.default.string,
    header: _propTypes2.default.string,
    icon: _propTypes2.default.string,
    onMouseEnter: _propTypes2.default.func,
    onMouseLeave: _propTypes2.default.func,
    tooltip: _propTypes2.default.string
};

exports.default = Fieldset;

/***/ }),
/* 96 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _moment = __webpack_require__(9);

var _moment2 = _interopRequireDefault(_moment);

var _barrier = __webpack_require__(525);

var _duration = __webpack_require__(258);

var _start_date = __webpack_require__(259);

var _contract = __webpack_require__(522);

var _Services = __webpack_require__(64);

var _language = __webpack_require__(13);

var _localize = __webpack_require__(0);

var _string_util = __webpack_require__(19);

var _utility = __webpack_require__(3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var ContractType = function () {
    var available_contract_types = {};
    var available_categories = {};
    var contract_types = void 0;

    var buildContractTypesConfig = function buildContractTypesConfig(symbol) {
        return _Services.WS.contractsFor(symbol).then(function (r) {
            var contract_categories = (0, _contract.getContractCategoriesConfig)();
            contract_types = (0, _contract.getContractTypesConfig)();

            available_contract_types = {};
            available_categories = (0, _utility.cloneObject)(contract_categories); // To preserve the order (will clean the extra items later in this function)

            r.contracts_for.available.forEach(function (contract) {
                var type = Object.keys(contract_types).find(function (key) {
                    return contract_types[key].trade_types.indexOf(contract.contract_type) !== -1 && (typeof contract_types[key].barrier_count === 'undefined' || +contract_types[key].barrier_count === contract.barriers) // To distinguish betweeen Rise/Fall & Higher/Lower
                    ;
                });

                if (!type || Exceptions.isExcluded(type)) return; // ignore unsupported/excepted contract types

                /*
                add to this config if a value you are looking for does not exist yet
                accordingly create a function to retrieve the value
                config: {
                    has_spot: 1,
                    durations: {
                        min_max: {
                            spot: {
                                tick    : { min: 5,     max: 10 },    // value in ticks, as cannot convert to seconds
                                intraday: { min: 18000, max: 86400 }, // all values converted to seconds
                                daily   : { min: 86400, max: 432000 },
                            },
                            forward: {
                                intraday: { min: 18000, max: 86400 },
                            },
                        },
                        units_display: {
                            spot: [
                                { text: 'ticks',   value: 't' },
                                { text: 'seconds', value: 's' },
                                { text: 'minutes', value: 'm' },
                                { text: 'hours',   value: 'h' },
                                { text: 'days',    value: 'd' },
                            ],
                            forward: [
                                { text: 'days',    value: 'd' },
                            ],
                        },
                    },
                    forward_starting_dates: [
                        { text: 'Mon - 19 Mar, 2018', value: 1517356800, sessions: [{ open: obj_moment, close: obj_moment }] },
                        { text: 'Tue - 20 Mar, 2018', value: 1517443200, sessions: [{ open: obj_moment, close: obj_moment }] },
                        { text: 'Wed - 21 Mar, 2018', value: 1517529600, sessions: [{ open: obj_moment, close: obj_moment }] },
                    ],
                    trade_types: {
                        'CALL': 'Higher',
                        'PUT' : 'Lower',
                    },
                    barriers: {
                        count   : 2,
                        tick    : { high_barrier: '+1.12', low_barrier : '-1.12' },
                        intraday: { high_barrier: '+2.12', low_barrier : '-2.12' },
                        daily   : { high_barrier: 1111,    low_barrier : 1093 },
                    },
                }
                */

                if (!available_contract_types[type]) {
                    // extend contract_categories to include what is needed to create the contract list
                    var sub_cats = available_categories[Object.keys(available_categories).find(function (key) {
                        return available_categories[key].indexOf(type) !== -1;
                    })];
                    sub_cats[sub_cats.indexOf(type)] = { value: type, text: (0, _localize.localize)(contract_types[type].title) };

                    // populate available contract types
                    available_contract_types[type] = (0, _utility.cloneObject)(contract_types[type]);
                }
                var config = available_contract_types[type].config || {};

                // set config values
                config.has_spot = contract.start_type === 'spot';
                config.durations = (0, _duration.buildDurationConfig)(contract, config.durations);
                config.trade_types = buildTradeTypesConfig(contract, config.trade_types);
                config.barriers = (0, _barrier.buildBarriersConfig)(contract, config.barriers);
                config.forward_starting_dates = (0, _start_date.buildForwardStartingConfig)(contract, config.forward_starting_dates);

                available_contract_types[type].config = config;
            });

            // cleanup categories
            Object.keys(available_categories).forEach(function (key) {
                available_categories[key] = available_categories[key].filter(function (item) {
                    return (typeof item === 'undefined' ? 'undefined' : _typeof(item)) === 'object';
                });
                if (available_categories[key].length === 0) {
                    delete available_categories[key];
                }
            });
        });
    };

    var buildTradeTypesConfig = function buildTradeTypesConfig(contract) {
        var trade_types = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        trade_types[contract.contract_type] = contract.contract_display;
        return trade_types;
    };

    var getArrayDefaultValue = function getArrayDefaultValue(arr_new_values, value) {
        return arr_new_values.indexOf(value) !== -1 ? value : arr_new_values[0];
    };

    var getContractValues = function getContractValues(store) {
        var contract_expiry_type = store.contract_expiry_type,
            contract_type = store.contract_type,
            basis = store.basis,
            duration_unit = store.duration_unit,
            start_date = store.start_date;

        var form_components = getComponents(contract_type);
        var obj_basis = getBasis(contract_type, basis);
        var obj_trade_types = getTradeTypes(contract_type);
        var obj_start_dates = getStartDates(contract_type, start_date);
        var obj_start_type = getStartType(obj_start_dates.start_date);
        var obj_barrier = getBarriers(contract_type, contract_expiry_type);
        var obj_duration_unit = getDurationUnit(duration_unit, contract_type, obj_start_type.contract_start_type);

        var obj_duration_units_list = getDurationUnitsList(contract_type, obj_start_type.contract_start_type);

        return _extends({}, form_components, obj_basis, obj_trade_types, obj_start_dates, obj_start_type, obj_barrier, obj_duration_unit, obj_duration_units_list);
    };

    var getContractType = function getContractType(list, contract_type) {
        var arr_list = Object.keys(list || {}).reduce(function (k, l) {
            return [].concat(_toConsumableArray(k), _toConsumableArray(list[l].map(function (ct) {
                return ct.value;
            })));
        }, []);
        return {
            contract_type: getArrayDefaultValue(arr_list, contract_type)
        };
    };

    var getComponents = function getComponents(c_type) {
        return { form_components: ['duration', 'amount'].concat(_toConsumableArray(contract_types[c_type].components)) };
    };

    var getDurationUnitsList = function getDurationUnitsList(contract_type, contract_start_type) {
        return {
            duration_units_list: (0, _utility.getPropertyValue)(available_contract_types, [contract_type, 'config', 'durations', 'units_display', contract_start_type]) || []
        };
    };

    var getDurationUnit = function getDurationUnit(duration_unit, contract_type, contract_start_type) {
        var duration_units = (0, _utility.getPropertyValue)(available_contract_types, [contract_type, 'config', 'durations', 'units_display', contract_start_type]) || [];
        var arr_units = [];
        duration_units.forEach(function (obj) {
            arr_units.push(obj.value);
        });

        return {
            duration_unit: getArrayDefaultValue(arr_units, duration_unit)
        };
    };

    // TODO: use this getter function to dynamically compare min/max versus duration amount
    var getDurationMinMax = function getDurationMinMax(contract_type, contract_start_type, contract_expiry_type) {
        return {
            duration_min_max: (0, _utility.getPropertyValue)(available_contract_types, [contract_type, 'config', 'durations', 'min_max', contract_start_type, contract_expiry_type]) || {}
        };
    };

    var getStartType = function getStartType(start_date) {
        return {
            // Number(0) refers to 'now'
            contract_start_type: start_date === Number(0) ? 'spot' : 'forward'
        };
    };

    var getStartDates = function getStartDates(contract_type, current_start_date) {
        var config = (0, _utility.getPropertyValue)(available_contract_types, [contract_type, 'config']);
        var start_dates_list = [];

        if (config.has_spot) {
            // Number(0) refers to 'now'
            start_dates_list.push({ text: (0, _localize.localize)('Now'), value: Number(0) });
        }
        if (config.forward_starting_dates) {
            start_dates_list.push.apply(start_dates_list, _toConsumableArray(config.forward_starting_dates));
        }

        var start_date = start_dates_list.find(function (item) {
            return item.value === current_start_date;
        }) ? current_start_date : start_dates_list[0].value;

        return { start_date: start_date, start_dates_list: start_dates_list };
    };

    var getSessions = function getSessions(contract_type, start_date) {
        var config = (0, _utility.getPropertyValue)(available_contract_types, [contract_type, 'config']) || {};
        var sessions = ((config.forward_starting_dates || []).find(function (option) {
            return option.value === start_date;
        }) || {}).sessions;
        return { sessions: sessions };
    };

    var hours = [].concat(_toConsumableArray(Array(24).keys())).map(function (a) {
        return ('0' + a).slice(-2);
    });
    var minutes = [].concat(_toConsumableArray(Array(12).keys())).map(function (a) {
        return ('0' + a * 5).slice(-2);
    });

    var getValidTime = function getValidTime(sessions, compare_moment, start_moment) {
        if (sessions && !(0, _start_date.isSessionAvailable)(sessions, compare_moment)) {
            // first see if changing the minute brings it to the right session
            compare_moment.minute(minutes.find(function (m) {
                return (0, _start_date.isSessionAvailable)(sessions, compare_moment.minute(m));
            }) || compare_moment.format('mm'));
            // if not, also change the hour
            if (!(0, _start_date.isSessionAvailable)(sessions, compare_moment)) {
                compare_moment.minute(0);
                compare_moment.hour(hours.find(function (h) {
                    return (0, _start_date.isSessionAvailable)(sessions, compare_moment.hour(h), start_moment, true);
                }) || compare_moment.format('HH'));
                compare_moment.minute(minutes.find(function (m) {
                    return (0, _start_date.isSessionAvailable)(sessions, compare_moment.minute(m));
                }) || compare_moment.format('mm'));
            }
        }
        return compare_moment.format('HH:mm');
    };

    var buildMoment = function buildMoment(date, time) {
        var _time$split = time.split(':'),
            _time$split2 = _slicedToArray(_time$split, 2),
            hour = _time$split2[0],
            minute = _time$split2[1];

        return _moment2.default.utc(isNaN(date) ? date : +date * 1000).hour(hour).minute(minute);
    };

    var getStartTime = function getStartTime(sessions, start_date, start_time) {
        return {
            start_time: getValidTime(sessions, buildMoment(start_date, start_time))
        };
    };

    // has to follow the correct order of checks:
    // first check if end time is within available sessions
    // then confirm that end time is after start time
    var getEndTime = function getEndTime(sessions, start_date, start_time, expiry_date, expiry_time) {
        var start_moment = start_date ? buildMoment(start_date, start_time) : (0, _moment2.default)().utc();
        var end_moment = buildMoment(expiry_date, expiry_time);

        var end_time = expiry_time;
        if (sessions && !(0, _start_date.isSessionAvailable)(sessions, end_moment)) {
            end_time = getValidTime(sessions, end_moment, start_moment);
        }
        if (end_moment.isSameOrBefore(start_moment)) {
            var is_end_of_day = start_moment.get('hours') === 23 && start_moment.get('minute') >= 55;
            var is_end_of_session = sessions && !(0, _start_date.isSessionAvailable)(sessions, start_moment.clone().add(5, 'minutes'));
            end_time = start_moment.clone().add(is_end_of_day || is_end_of_session ? 0 : 5, 'minutes').format('HH:mm');
        }
        return { expiry_time: end_time };
    };

    var getTradeTypes = function getTradeTypes(contract_type) {
        return {
            trade_types: (0, _utility.getPropertyValue)(available_contract_types, [contract_type, 'config', 'trade_types'])
        };
    };

    var getBarriers = function getBarriers(contract_type, expiry_type) {
        var barriers = (0, _utility.getPropertyValue)(available_contract_types, [contract_type, 'config', 'barriers']) || {};
        var barrier_values = barriers[expiry_type] || {};
        var barrier_1 = barrier_values.barrier || barrier_values.high_barrier || '';
        var barrier_2 = barrier_values.low_barrier || '';
        return {
            barrier_count: barriers.count || 0,
            barrier_1: barrier_1.toString(),
            barrier_2: barrier_2.toString()
        };
    };

    var getBasis = function getBasis(contract_type, basis) {
        var arr_basis = (0, _utility.getPropertyValue)(available_contract_types, [contract_type, 'basis']) || {};
        var basis_list = arr_basis.reduce(function (cur, bas) {
            return [].concat(_toConsumableArray(cur), [{ text: (0, _localize.localize)((0, _string_util.toTitleCase)(bas)), value: bas }]);
        }, []);

        return {
            basis_list: basis_list,
            basis: getArrayDefaultValue(arr_basis, basis)
        };
    };

    return {
        buildContractTypesConfig: buildContractTypesConfig,
        getContractValues: getContractValues,
        getContractType: getContractType,
        getDurationUnitsList: getDurationUnitsList,
        getDurationUnit: getDurationUnit,
        getDurationMinMax: getDurationMinMax,
        getStartType: getStartType,
        getBarriers: getBarriers,
        getSessions: getSessions,
        getStartTime: getStartTime,
        getEndTime: getEndTime,

        getContractCategories: function getContractCategories() {
            return { contract_types_list: available_categories };
        }
    };
}();

var Exceptions = function () {
    var isIDLanguage = function isIDLanguage() {
        return (0, _language.get)() === 'ID';
    };

    // if the exception value is true, then it is excluded
    var exceptions = {
        even_odd: isIDLanguage,
        over_under: isIDLanguage
    };

    return {
        isExcluded: function isExcluded(key) {
            return exceptions[key] ? exceptions[key]() : false;
        }
    };
}();

exports.default = ContractType;

/***/ }),
/* 97 */,
/* 98 */,
/* 99 */,
/* 100 */,
/* 101 */,
/* 102 */,
/* 103 */,
/* 104 */,
/* 105 */,
/* 106 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _desc, _value, _class, _class2, _temp;

var _mobx = __webpack_require__(41);

var _utility = __webpack_require__(3);

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
    var desc = {};
    Object['ke' + 'ys'](descriptor).forEach(function (key) {
        desc[key] = descriptor[key];
    });
    desc.enumerable = !!desc.enumerable;
    desc.configurable = !!desc.configurable;

    if ('value' in desc || desc.initializer) {
        desc.writable = true;
    }

    desc = decorators.slice().reverse().reduce(function (desc, decorator) {
        return decorator(target, property, desc) || desc;
    }, desc);

    if (context && desc.initializer !== void 0) {
        desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
        desc.initializer = undefined;
    }

    if (desc.initializer === void 0) {
        Object['define' + 'Property'](target, property, desc);
        desc = null;
    }

    return desc;
}

/**
 * BaseStore class is the base class for all defined stores in the application. It handles some stuff such as:
 *  1. Creating snapshot object from the store.
 *  2. Saving the store's snapshot in local/session storage and keeping them in sync.
 */
var BaseStore = (_class = (_temp = _class2 = function () {

    /**
     * Constructor of the base class that gets properties' name of child which should be saved in storages
     *
     * @param {Object}   root_store - An object that contains the root store of the app.
     * @param {String[]} local_storage_properties - A list of properties' names that should be kept in localStorage.
     * @param {String[]} session_storage_properties - A list of properties' names that should be kept in sessionStorage.
     */
    function BaseStore() {
        var root_store = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
        var local_storage_properties = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
        var session_storage_properties = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

        _classCallCheck(this, BaseStore);

        Object.defineProperty(this, 'root_store', {
            enumerable: false,
            writable: true
        });
        Object.defineProperty(this, 'local_storage_properties', {
            enumerable: false,
            writable: true
        });
        Object.defineProperty(this, 'session_storage_properties', {
            enumerable: false,
            writable: true
        });

        this.root_store = root_store;
        this.local_storage_properties = local_storage_properties || [];
        this.session_storage_properties = session_storage_properties || [];

        this.setupReactionForLocalStorage();
        this.setupReactionForSessionStorage();
        this.retrieveFromStorage();
    }

    /**
     * Returns an snapshot of the current store
     *
     * @param {String[]} properties - A list of properties' names that should be in the snapshot.
     *
     * @return {Object} Returns a cloned object of the store.
     */


    /**
     * An enum object to define LOCAL_STORAGE and SESSION_STORAGE
     */


    _createClass(BaseStore, [{
        key: 'getSnapshot',
        value: function getSnapshot(properties) {
            var snapshot = (0, _mobx.toJS)(this);

            if (!(0, _utility.isEmptyObject)(this.root_store)) {
                snapshot.root_store = this.root_store;
            }

            if (properties && properties.length) {
                snapshot = properties.reduce(function (result, p) {
                    return Object.assign(result, _defineProperty({}, p, snapshot[p]));
                }, {});
            }

            return snapshot;
        }

        /**
         * Sets up a reaction on properties which are mentioned in `local_storage_properties`
         *  and invokes `saveToStorage` when there are any changes on them.
         *
         */

    }, {
        key: 'setupReactionForLocalStorage',
        value: function setupReactionForLocalStorage() {
            var _this = this;

            if (this.local_storage_properties.length) {
                (0, _mobx.reaction)(function () {
                    return _this.local_storage_properties.map(function (i) {
                        return _this[i];
                    });
                }, function () {
                    return _this.saveToStorage(_this.local_storage_properties, BaseStore.STORAGES.LOCAL_STORAGE);
                });
            }
        }

        /**
         * Sets up a reaction on properties which are mentioned in `session_storage_properties`
         *  and invokes `saveToStorage` when there are any changes on them.
         *
         */

    }, {
        key: 'setupReactionForSessionStorage',
        value: function setupReactionForSessionStorage() {
            var _this2 = this;

            if (this.session_storage_properties.length) {
                (0, _mobx.reaction)(function () {
                    return _this2.session_storage_properties.map(function (i) {
                        return _this2[i];
                    });
                }, function () {
                    return _this2.saveToStorage(_this2.session_storage_properties, BaseStore.STORAGES.SESSION_STORAGE);
                });
            }
        }

        /**
         * Removes properties that are not passed from the snapshot of the store and saves it to the passed storage
         *
         * @param {String[]} properties - A list of the store's properties' names which should be saved in the storage.
         * @param {Symbol}   storage    - A symbol object that defines the storage which the snapshot should be stored in it.
         *
         */

    }, {
        key: 'saveToStorage',
        value: function saveToStorage(properties, storage) {
            var snapshot = JSON.stringify(this.getSnapshot(properties));

            if (storage === BaseStore.STORAGES.LOCAL_STORAGE) {
                localStorage.setItem(this.constructor.name, snapshot);
            } else if (storage === BaseStore.STORAGES.SESSION_STORAGE) {
                sessionStorage.setItem(this.constructor.name, snapshot);
            }
        }

        /**
         * Retrieves saved snapshot of the store and assigns to the current instance.
         *
         */

    }, {
        key: 'retrieveFromStorage',
        value: function retrieveFromStorage() {
            var _this3 = this;

            var local_storage_snapshot = JSON.parse(localStorage.getItem(this.constructor.name, {}));
            var session_storage_snapshot = JSON.parse(sessionStorage.getItem(this.constructor.name, {}));

            var snapshot = _extends({}, local_storage_snapshot, session_storage_snapshot);

            Object.keys(snapshot).forEach(function (k) {
                return _this3[k] = snapshot[k];
            });
        }
    }]);

    return BaseStore;
}(), _class2.STORAGES = Object.freeze({
    LOCAL_STORAGE: Symbol('LOCAL_STORAGE'),
    SESSION_STORAGE: Symbol('SESSION_STORAGE')
}), _temp), (_applyDecoratedDescriptor(_class.prototype, 'retrieveFromStorage', [_mobx.action], Object.getOwnPropertyDescriptor(_class.prototype, 'retrieveFromStorage'), _class.prototype)), _class);
exports.default = BaseStore;

/***/ }),
/* 107 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _date_time = __webpack_require__(537);

Object.keys(_date_time).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _date_time[key];
    }
  });
});

/***/ }),
/* 108 */,
/* 109 */,
/* 110 */,
/* 111 */,
/* 112 */,
/* 113 */,
/* 114 */,
/* 115 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var moment = __webpack_require__(9);
var urlForStatic = __webpack_require__(10).urlForStatic;
var getStaticHash = __webpack_require__(3).getStaticHash;

// only reload if it's more than 10 minutes since the last reload
var shouldForceReload = function shouldForceReload(last_reload) {
    return !last_reload || +last_reload + 10 * 60 * 1000 < moment().valueOf();
};

// calling this method is handled by GTM tags
var checkNewRelease = function checkNewRelease() {
    var last_reload = localStorage.getItem('new_release_reload_time');
    if (!shouldForceReload(last_reload)) return false;
    localStorage.setItem('new_release_reload_time', moment().valueOf());

    var current_hash = getStaticHash();
    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function () {
        if (+xhttp.readyState === 4 && +xhttp.status === 200) {
            var latest_hash = xhttp.responseText;
            if (latest_hash && current_hash && latest_hash !== current_hash) {
                window.location.reload(true);
            }
        }
    };
    xhttp.open('GET', urlForStatic('version?' + Math.random().toString(36).slice(2)), true);
    xhttp.send();

    return true;
};

module.exports = {
    shouldForceReload: shouldForceReload,
    checkNewRelease: checkNewRelease
};

/***/ }),
/* 116 */,
/* 117 */,
/* 118 */,
/* 119 */,
/* 120 */,
/* 121 */,
/* 122 */,
/* 123 */,
/* 124 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.CalendarPanelTypes = undefined;

var _propTypes = __webpack_require__(4);

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var CalendarPanelTypes = exports.CalendarPanelTypes = {
    calendar_date: _propTypes2.default.string,
    calendar_view: _propTypes2.default.string,
    date_format: _propTypes2.default.string,
    isPeriodDisabled: _propTypes2.default.func,
    max_date: _propTypes2.default.oneOfType([_propTypes2.default.object, _propTypes2.default.string]),
    min_date: _propTypes2.default.oneOfType([_propTypes2.default.object, _propTypes2.default.string]),
    onClick: _propTypes2.default.object,
    selected_date: _propTypes2.default.string
};

/***/ }),
/* 125 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _drawer_header = __webpack_require__(227);

Object.keys(_drawer_header).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _drawer_header[key];
    }
  });
});

var _drawer_item = __webpack_require__(228);

Object.keys(_drawer_item).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _drawer_item[key];
    }
  });
});

var _drawer_items = __webpack_require__(429);

Object.keys(_drawer_items).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _drawer_items[key];
    }
  });
});

var _drawer = __webpack_require__(226);

Object.keys(_drawer).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _drawer[key];
    }
  });
});

var _toggle_drawer = __webpack_require__(430);

Object.keys(_toggle_drawer).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _toggle_drawer[key];
    }
  });
});

/***/ }),
/* 126 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _propTypes = __webpack_require__(4);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = __webpack_require__(2);

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Button = function Button(_ref) {
    var _ref$className = _ref.className,
        className = _ref$className === undefined ? '' : _ref$className,
        children = _ref.children,
        has_effect = _ref.has_effect,
        id = _ref.id,
        is_disabled = _ref.is_disabled,
        onClick = _ref.onClick,
        text = _ref.text,
        wrapperClassName = _ref.wrapperClassName;

    var classes = 'btn' + (has_effect ? ' effect' : '') + ' ' + className;
    var button = _react2.default.createElement(
        'button',
        { id: id, className: classes, onClick: onClick || undefined, disabled: is_disabled },
        _react2.default.createElement(
            'span',
            null,
            text
        ),
        children
    );
    var wrapper = _react2.default.createElement(
        'div',
        { className: wrapperClassName },
        button
    );

    return wrapperClassName ? wrapper : button;
};

Button.propTypes = {
    className: _propTypes2.default.string,
    children: _propTypes2.default.object,
    has_effect: _propTypes2.default.bool,
    id: _propTypes2.default.string,
    is_disabled: _propTypes2.default.bool,
    onClick: _propTypes2.default.func,
    text: _propTypes2.default.string,
    wrapperClassName: _propTypes2.default.string
};

exports.default = Button;

/***/ }),
/* 127 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _mobx = __webpack_require__(41);

var _mobxReact = __webpack_require__(28);

var _propTypes = __webpack_require__(4);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = __webpack_require__(2);

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Dropdown = function (_React$Component) {
    _inherits(Dropdown, _React$Component);

    function Dropdown(props) {
        _classCallCheck(this, Dropdown);

        var _this = _possibleConstructorReturn(this, (Dropdown.__proto__ || Object.getPrototypeOf(Dropdown)).call(this, props));

        _this.getDisplayText = function (list, value) {
            var findInArray = function findInArray(arr_list) {
                return (arr_list.find(function (item) {
                    return item.value === value;
                }) || {}).text;
            };
            var text = '';
            if ((0, _mobx.isArrayLike)(list)) {
                text = findInArray(list);
            } else {
                Object.keys(list).some(function (key) {
                    text = findInArray(list[key]);
                    return text;
                });
            }
            return text;
        };

        _this.handleVisibility = _this.handleVisibility.bind(_this);
        _this.handleSelect = _this.handleSelect.bind(_this);
        _this.setWrapperRef = _this.setWrapperRef.bind(_this);
        _this.handleClickOutside = _this.handleClickOutside.bind(_this);
        _this.state = {
            is_list_visible: false
        };
        return _this;
    }

    _createClass(Dropdown, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            document.addEventListener('mousedown', this.handleClickOutside);
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            document.removeEventListener('mousedown', this.handleClickOutside);
        }
    }, {
        key: 'handleSelect',
        value: function handleSelect(item) {
            if (item.value !== this.props.value) {
                this.props.onChange({ target: { name: this.props.name, value: item.value } });
            }
            this.handleVisibility();
        }
    }, {
        key: 'setWrapperRef',
        value: function setWrapperRef(node) {
            this.wrapper_ref = node;
        }
    }, {
        key: 'scrollToggle',
        value: function scrollToggle(state) {
            this.is_open = state;
            // Used to disable y-scroll on body - disabled in this component for now
            // document.body.classList.toggle('no-scroll', this.is_open);
        }
    }, {
        key: 'handleClickOutside',
        value: function handleClickOutside(event) {
            if (this.wrapper_ref && !this.wrapper_ref.contains(event.target) && this.state.is_list_visible) {
                this.setState({ is_list_visible: false });
                this.scrollToggle(this.state.is_list_visible);
            }
        }
    }, {
        key: 'handleVisibility',
        value: function handleVisibility() {
            this.setState({ is_list_visible: !this.state.is_list_visible });
            this.scrollToggle(!this.state.is_list_visible);
        }
    }, {
        key: 'render',
        value: function render() {
            var _this2 = this;

            if (this.props.is_nativepicker) {
                return _react2.default.createElement(NativeSelect, {
                    name: this.props.name,
                    value: this.props.value,
                    list: this.props.list,
                    onChange: this.props.onChange
                });
            }
            return _react2.default.createElement(
                'div',
                {
                    ref: this.setWrapperRef,
                    className: 'dropdown-container ' + (this.props.className ? this.props.className : '') + ' ' + (this.state.is_list_visible ? 'show' : '')
                },
                _react2.default.createElement(
                    'div',
                    {
                        className: 'dropdown-display ' + (this.state.is_list_visible ? 'clicked' : ''),
                        onClick: this.handleVisibility,
                        onBlur: this.handleVisibility
                    },
                    _react2.default.createElement(
                        'span',
                        { name: this.props.name, value: this.props.value },
                        this.getDisplayText(this.props.list, this.props.value)
                    )
                ),
                _react2.default.createElement('span', { className: 'select-arrow' }),
                _react2.default.createElement(
                    'div',
                    { className: 'dropdown-list' },
                    _react2.default.createElement(
                        'div',
                        { className: 'list-container' },
                        (0, _mobx.isArrayLike)(this.props.list) ? _react2.default.createElement(Items, {
                            items: this.props.list,
                            name: this.props.name,
                            value: this.props.value,
                            handleSelect: this.handleSelect
                        }) : Object.keys(this.props.list).map(function (key) {
                            return _react2.default.createElement(
                                _react2.default.Fragment,
                                { key: key },
                                _react2.default.createElement(
                                    'div',
                                    { className: 'list-label' },
                                    _react2.default.createElement(
                                        'span',
                                        null,
                                        key
                                    )
                                ),
                                _react2.default.createElement(Items, {
                                    items: _this2.props.list[key],
                                    name: _this2.props.name,
                                    value: _this2.props.value,
                                    handleSelect: _this2.handleSelect
                                })
                            );
                        })
                    )
                )
            );
        }
    }]);

    return Dropdown;
}(_react2.default.Component);

var Items = function Items(_ref) {
    var items = _ref.items,
        name = _ref.name,
        value = _ref.value,
        handleSelect = _ref.handleSelect;
    return items.map(function (item, idx) {
        return _react2.default.createElement(
            _react2.default.Fragment,
            { key: idx },
            _react2.default.createElement(
                'div',
                {
                    className: 'list-item ' + (value === item.value ? 'selected' : ''),
                    key: idx,
                    name: name,
                    value: item.value,
                    onClick: handleSelect.bind(null, item)
                },
                _react2.default.createElement(
                    'span',
                    null,
                    item.text
                )
            )
        );
    });
};

var NativeSelect = function NativeSelect(_ref2) {
    var name = _ref2.name,
        value = _ref2.value,
        list = _ref2.list,
        onChange = _ref2.onChange;
    return _react2.default.createElement(
        'div',
        { className: 'select-wrapper' },
        _react2.default.createElement(
            'select',
            { name: name, value: value, onChange: onChange },
            Array.isArray(list) ? list.map(function (item, idx) {
                return _react2.default.createElement(
                    'option',
                    { key: idx, value: item.value },
                    item.text
                );
            }) : Object.keys(list).map(function (key) {
                return _react2.default.createElement(
                    _react2.default.Fragment,
                    { key: key },
                    _react2.default.createElement(
                        'optgroup',
                        { label: key },
                        list[key].map(function (item, idx) {
                            return _react2.default.createElement(
                                'option',
                                { key: idx, value: item.value },
                                item.text
                            );
                        })
                    )
                );
            })
        )
    );
};

// ToDo: Refactor Drop-down.
// It's now too risky to refactor Dropdown for 'list' and 'value' prop types.
Dropdown.propTypes = {
    className: _propTypes2.default.string,
    is_nativepicker: _propTypes2.default.bool,
    list: _propTypes2.default.oneOfType([_propTypes2.default.array, _propTypes2.default.object]),
    name: _propTypes2.default.string,
    onChange: _propTypes2.default.func,
    type: _propTypes2.default.string,
    value: _propTypes2.default.oneOfType([_propTypes2.default.number, _propTypes2.default.string])
};

// ToDo: Refactor NativeSelect
NativeSelect.propTypes = {
    list: _propTypes2.default.oneOfType([_propTypes2.default.object, _propTypes2.default.array]),
    name: _propTypes2.default.string,
    onChange: _propTypes2.default.func,
    value: _propTypes2.default.oneOfType([_propTypes2.default.number, _propTypes2.default.string])
};

exports.default = (0, _mobxReact.observer)(Dropdown);

/***/ }),
/* 128 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RouteWithSubRoutes = exports.default = exports.BinaryLink = undefined;

var _helpers = __webpack_require__(237);

Object.keys(_helpers).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _helpers[key];
    }
  });
});

var _binary_link = __webpack_require__(461);

var _binary_link2 = _interopRequireDefault(_binary_link);

var _binary_routes = __webpack_require__(462);

var _binary_routes2 = _interopRequireDefault(_binary_routes);

var _route_with_sub_routes = __webpack_require__(238);

var _route_with_sub_routes2 = _interopRequireDefault(_route_with_sub_routes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.BinaryLink = _binary_link2.default;
exports.default = _binary_routes2.default;
exports.RouteWithSubRoutes = _route_with_sub_routes2.default;

/***/ }),
/* 129 */,
/* 130 */,
/* 131 */,
/* 132 */,
/* 133 */,
/* 134 */,
/* 135 */,
/* 136 */,
/* 137 */,
/* 138 */,
/* 139 */,
/* 140 */,
/* 141 */,
/* 142 */,
/* 143 */,
/* 144 */,
/* 145 */,
/* 146 */,
/* 147 */,
/* 148 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var BinarySocket = __webpack_require__(42);

/*
 * Monitors the network status and initialises the WebSocket connection
 * 1. online : check the WS status (init/send: blink after timeout, open/message: online)
 * 2. offline: it is offline
 */
var NetworkMonitorBase = function () {
    var _pending_timeouts;

    var status_config = {
        online: { class: 'online', tooltip: 'Online' },
        offline: { class: 'offline', tooltip: 'Offline' },
        blinking: { class: 'blinker', tooltip: 'Connecting to server' }
    };
    var pendings = {};
    var pending_keys = {
        ws_init: 'ws_init',
        ws_request: 'ws_request'
    };
    var pending_timeouts = (_pending_timeouts = {}, _defineProperty(_pending_timeouts, pending_keys.ws_init, 5000), _defineProperty(_pending_timeouts, pending_keys.ws_request, 10000), _pending_timeouts);

    var ws_config = void 0,
        network_status = void 0,
        updateUI = void 0;

    var init = function init(socket_general_functions, fncUpdateUI) {
        updateUI = fncUpdateUI;
        ws_config = Object.assign({ wsEvent: wsEvent, isOnline: isOnline }, socket_general_functions);

        if ('onLine' in navigator) {
            window.addEventListener('online', setStatus);
            window.addEventListener('offline', setStatus);
        } else {
            // if not supported, default to online and fallback to WS checks
            navigator.onLine = true;
        }

        if (isOnline()) {
            BinarySocket.init(ws_config);
        }

        setStatus(isOnline() ? 'online' : 'offline');
    };

    var isOnline = function isOnline() {
        return navigator.onLine;
    };

    var wsReconnect = function wsReconnect() {
        if (isOnline() && BinarySocket.hasReadyState(2, 3)) {
            // CLOSING or CLOSED
            BinarySocket.init(ws_config);
        } else {
            BinarySocket.send({ ping: 1 }); // trigger a request to get stable status sooner
        }
    };

    var setStatus = function setStatus(status) {
        if (!isOnline()) {
            network_status = 'offline';
        } else if (pending_keys[status] || network_status === 'offline') {
            network_status = 'blinking';
            wsReconnect();
        } else {
            network_status = 'online';
        }

        if (typeof updateUI === 'function') {
            updateUI(status_config[network_status], isOnline());
        }
    };

    var ws_events_map = {
        init: function init() {
            return setPending(pending_keys.ws_init);
        },
        open: function open() {
            return clearPendings(pending_keys.ws_init);
        },
        send: function send() {
            return setPending(pending_keys.ws_request);
        },
        message: function message() {
            return clearPendings();
        },
        close: function close() {
            return setPending(pending_keys.ws_init);
        }
    };

    var wsEvent = function wsEvent(event) {
        if (typeof ws_events_map[event] === 'function') {
            ws_events_map[event]();
        }
    };

    var setPending = function setPending(key) {
        if (!pendings[key]) {
            pendings[key] = setTimeout(function () {
                pendings[key] = undefined;
                setStatus(key);
            }, pending_timeouts[key]);
        }
    };

    var clearPendings = function clearPendings(key) {
        var clear = function clear(k) {
            clearTimeout(pendings[k]);
            pendings[k] = undefined;
            if (k === pending_keys.ws_request) {
                setStatus('online');
            }
        };

        if (key) {
            clear(key);
        } else {
            Object.keys(pendings).forEach(clear);
        }
    };

    return {
        init: init,
        wsEvent: wsEvent
    };
}();

module.exports = NetworkMonitorBase;

/***/ }),
/* 149 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var moment = __webpack_require__(9);
var BinarySocket = __webpack_require__(42);

var ServerTime = function () {
    var clock_started = false;
    var server_time = void 0,
        client_time = void 0,
        get_time_interval = void 0,
        update_time_interval = void 0,
        onTimeUpdated = void 0;

    var init = function init(fncTimeUpdated) {
        if (!clock_started) {
            onTimeUpdated = fncTimeUpdated;
            requestTime();
            clearInterval(get_time_interval);
            get_time_interval = setInterval(requestTime, 30000);
            clock_started = true;
        }
    };

    var requestTime = function requestTime() {
        client_time = moment().valueOf();
        BinarySocket.send({ time: 1 }).then(timeCounter);
    };

    var timeCounter = function timeCounter(response) {
        if (response.error) return;

        if (!clock_started) {
            init();
            return;
        }

        clearInterval(update_time_interval);

        var start_timestamp = response.time;
        var client_time_at_response = moment().valueOf();
        var server_time_at_response = start_timestamp * 1000 + (client_time_at_response - client_time);

        var updateTime = function updateTime() {
            server_time = moment(server_time_at_response + moment().valueOf() - client_time_at_response).utc();

            if (typeof onTimeUpdated === 'function') {
                onTimeUpdated();
            }
        };
        updateTime();
        update_time_interval = setInterval(updateTime, 1000);
    };

    var get = function get() {
        return server_time ? server_time.clone() : undefined;
    };

    return {
        init: init,
        get: get
    };
}();

module.exports = ServerTime;

/***/ }),
/* 150 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


if (!Element.prototype.matches) {
    Element.prototype.matches = Element.prototype.matchesSelector || Element.prototype.mozMatchesSelector || Element.prototype.msMatchesSelector || Element.prototype.oMatchesSelector || Element.prototype.webkitMatchesSelector || function (s) {
        var matches = (this.document || this.ownerDocument).querySelectorAll(s),
            i = matches.length;
        while (--i >= 0 && matches.item(i) !== this) {}
        return i > -1;
    };
}

/***/ }),
/* 151 */,
/* 152 */,
/* 153 */,
/* 154 */,
/* 155 */,
/* 156 */,
/* 157 */,
/* 158 */,
/* 159 */,
/* 160 */,
/* 161 */,
/* 162 */,
/* 163 */,
/* 164 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _classnames = __webpack_require__(18);

var _classnames2 = _interopRequireDefault(_classnames);

var _propTypes = __webpack_require__(4);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = __webpack_require__(2);

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Tooltip = function Tooltip(_ref) {
    var message = _ref.message,
        alignment = _ref.alignment,
        children = _ref.children,
        icon = _ref.icon;

    var icon_name = icon === 'question' || icon === 'info' ? icon : 'question';
    var icon_class = (0, _classnames2.default)(icon_name);
    return _react2.default.createElement(
        'span',
        { className: 'tooltip', 'data-tooltip': message, 'data-tooltip-pos': alignment },
        icon ? _react2.default.createElement('i', { className: icon_class }) : children
    );
};

Tooltip.propTypes = {
    alignment: _propTypes2.default.string,
    children: _propTypes2.default.string,
    icon: _propTypes2.default.string,
    message: _propTypes2.default.string
};

exports.default = Tooltip;

/***/ }),
/* 165 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _propTypes = __webpack_require__(4);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = __webpack_require__(2);

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var InputField = function (_React$Component) {
    _inherits(InputField, _React$Component);

    function InputField() {
        _classCallCheck(this, InputField);

        return _possibleConstructorReturn(this, (InputField.__proto__ || Object.getPrototypeOf(InputField)).apply(this, arguments));
    }

    _createClass(InputField, [{
        key: 'render',
        value: function render() {
            return _react2.default.createElement(
                'div',
                { className: 'input-field ' + (this.props.className ? this.props.className : '') },
                !!this.props.label && _react2.default.createElement(
                    'label',
                    { htmlFor: this.props.name, className: 'input-label' },
                    this.props.label
                ),
                !!this.props.prefix && _react2.default.createElement(
                    'i',
                    null,
                    _react2.default.createElement('span', { className: 'symbols ' + this.props.prefix.toLowerCase() })
                ),
                _react2.default.createElement('input', {
                    type: this.props.type,
                    name: this.props.name,
                    step: this.props.is_currency ? '0.01' : undefined,
                    placeholder: this.props.placeholder || undefined,
                    disabled: this.props.is_disabled,
                    value: this.props.value,
                    onChange: this.props.onChange,
                    required: this.props.required || undefined
                }),
                !!this.props.helper && _react2.default.createElement(
                    'span',
                    { className: 'input-helper' },
                    this.props.helper
                )
            );
        }
    }]);

    return InputField;
}(_react2.default.Component);

// ToDo: Refactor input_field
// supports more than two different types of 'value' as a prop.
// Quick Solution - Pass two different props to input field.


InputField.propTypes = {
    className: _propTypes2.default.string,
    helper: _propTypes2.default.bool,
    is_currency: _propTypes2.default.bool,
    is_disabled: _propTypes2.default.string,
    is_nativepicker: _propTypes2.default.bool,
    label: _propTypes2.default.string,
    name: _propTypes2.default.string,
    number: _propTypes2.default.string,
    onChange: _propTypes2.default.func,
    placeholder: _propTypes2.default.string,
    prefix: _propTypes2.default.string,
    required: _propTypes2.default.bool,
    type: _propTypes2.default.string,
    value: _propTypes2.default.oneOfType([_propTypes2.default.number, _propTypes2.default.string])
};

exports.default = InputField;

/***/ }),
/* 166 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _subscription_manager = __webpack_require__(515);

var _subscription_manager2 = _interopRequireDefault(_subscription_manager);

var _socket_base = __webpack_require__(42);

var _socket_base2 = _interopRequireDefault(_socket_base);

var _utility = __webpack_require__(3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var WS = function () {
    var activeSymbols = function activeSymbols() {
        return _socket_base2.default.send({ active_symbols: 'brief' });
    };

    var buy = function buy(proposal_id, price) {
        return _socket_base2.default.send({ buy: proposal_id, price: price });
    };

    var contractsFor = function contractsFor(symbol) {
        return _socket_base2.default.send({ contracts_for: symbol });
    };

    var getAccountStatus = function getAccountStatus() {
        return _socket_base2.default.send({ get_account_status: 1 });
    };

    var getSelfExclusion = function getSelfExclusion() {
        return _socket_base2.default.send({ get_self_exclusion: 1 });
    };

    var getSettings = function getSettings() {
        return _socket_base2.default.send({ get_settings: 1 });
    };

    var landingCompany = function landingCompany(residence) {
        return _socket_base2.default.send({ landing_company: residence });
    };

    var logout = function logout() {
        return _socket_base2.default.send({ logout: 1 });
    };

    var mt5LoginList = function mt5LoginList() {
        return _socket_base2.default.send({ mt5_login_list: 1 });
    };

    var oauthApps = function oauthApps() {
        return _socket_base2.default.send({ oauth_apps: 1 });
    };

    var payoutCurrencies = function payoutCurrencies() {
        return _socket_base2.default.send({ payout_currencies: 1 });
    };

    var portfolio = function portfolio() {
        return _socket_base2.default.send({ portfolio: 1 });
    };

    var sellExpired = function sellExpired() {
        return _socket_base2.default.send({ sell_expired: 1 });
    };

    var sendRequest = function sendRequest(request_object) {
        return Promise.resolve(!(0, _utility.isEmptyObject)(request_object) ? _socket_base2.default.send(request_object) : {});
    };

    var statement = function statement(limit, offset, date_boundaries) {
        return _socket_base2.default.send(_extends({ statement: 1, description: 1, limit: limit, offset: offset }, date_boundaries));
    };

    // ----- Streaming calls -----
    var forget = function forget(msg_type, cb, match_values) {
        return _subscription_manager2.default.forget(msg_type, cb, match_values);
    };

    var forgetAll = function forgetAll() {
        return _subscription_manager2.default.forgetAll.apply(_subscription_manager2.default, arguments);
    };

    var subscribeBalance = function subscribeBalance(cb) {
        return _subscription_manager2.default.subscribe('balance', { balance: 1, subscribe: 1 }, cb);
    };

    var subscribeProposal = function subscribeProposal(req, cb, should_forget_first) {
        return _subscription_manager2.default.subscribe('proposal', req, cb, should_forget_first);
    };

    var subscribeProposalOpenContract = function subscribeProposalOpenContract(cb, should_forget_first) {
        return _subscription_manager2.default.subscribe('proposal_open_contract', { proposal_open_contract: 1, subscribe: 1 }, cb, should_forget_first);
    };

    var subscribeTicks = function subscribeTicks(symbol, cb, should_forget_first) {
        return _subscription_manager2.default.subscribe('ticks', { ticks: symbol, subscribe: 1 }, cb, should_forget_first);
    };

    var subscribeTicksHistory = function subscribeTicksHistory(request_object, cb, should_forget_first) {
        return _subscription_manager2.default.subscribe('ticks_history', request_object, cb, should_forget_first);
    };

    var subscribeTransaction = function subscribeTransaction(cb, should_forget_first) {
        return _subscription_manager2.default.subscribe('transaction', { transaction: 1, subscribe: 1 }, cb, should_forget_first);
    };

    var subscribeWebsiteStatus = function subscribeWebsiteStatus(cb) {
        return _subscription_manager2.default.subscribe('website_status', { website_status: 1, subscribe: 1 }, cb);
    };

    return {
        activeSymbols: activeSymbols,
        buy: buy,
        contractsFor: contractsFor,
        getAccountStatus: getAccountStatus,
        getSelfExclusion: getSelfExclusion,
        getSettings: getSettings,
        landingCompany: landingCompany,
        logout: logout,
        mt5LoginList: mt5LoginList,
        oauthApps: oauthApps,
        portfolio: portfolio,
        payoutCurrencies: payoutCurrencies,
        sellExpired: sellExpired,
        sendRequest: sendRequest,
        statement: statement,

        // streams
        forget: forget,
        forgetAll: forgetAll,
        subscribeBalance: subscribeBalance,
        subscribeProposal: subscribeProposal,
        subscribeProposalOpenContract: subscribeProposalOpenContract,
        subscribeTicks: subscribeTicks,
        subscribeTicksHistory: subscribeTicksHistory,
        subscribeTransaction: subscribeTransaction,
        subscribeWebsiteStatus: subscribeWebsiteStatus
    };
}();

exports.default = WS;

/***/ }),
/* 167 */,
/* 168 */,
/* 169 */,
/* 170 */,
/* 171 */,
/* 172 */,
/* 173 */,
/* 174 */,
/* 175 */,
/* 176 */,
/* 177 */,
/* 178 */,
/* 179 */,
/* 180 */,
/* 181 */,
/* 182 */,
/* 183 */,
/* 184 */,
/* 185 */,
/* 186 */,
/* 187 */,
/* 188 */,
/* 189 */,
/* 190 */,
/* 191 */,
/* 192 */,
/* 193 */,
/* 194 */,
/* 195 */,
/* 196 */,
/* 197 */,
/* 198 */,
/* 199 */,
/* 200 */,
/* 201 */,
/* 202 */,
/* 203 */,
/* 204 */,
/* 205 */,
/* 206 */,
/* 207 */,
/* 208 */,
/* 209 */,
/* 210 */,
/* 211 */,
/* 212 */,
/* 213 */,
/* 214 */,
/* 215 */,
/* 216 */,
/* 217 */,
/* 218 */,
/* 219 */,
/* 220 */,
/* 221 */,
/* 222 */,
/* 223 */,
/* 224 */,
/* 225 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = CalendarButton;

var _propTypes = __webpack_require__(4);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = __webpack_require__(2);

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function CalendarButton(_ref) {
    var children = _ref.children,
        className = _ref.className,
        is_hidden = _ref.is_hidden,
        label = _ref.label,
        onClick = _ref.onClick;

    return _react2.default.createElement(
        _react2.default.Fragment,
        null,
        !is_hidden && _react2.default.createElement(
            'span',
            {
                type: 'button',
                className: className,
                onClick: onClick
            },
            label,
            children
        )
    );
}

CalendarButton.propTypes = {
    children: _propTypes2.default.oneOfType([_propTypes2.default.array, _propTypes2.default.object, _propTypes2.default.string]),
    className: _propTypes2.default.string,
    is_hidden: _propTypes2.default.bool,
    label: _propTypes2.default.string,
    onClick: _propTypes2.default.func
};

/***/ }),
/* 226 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Drawer = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _classnames = __webpack_require__(18);

var _classnames2 = _interopRequireDefault(_classnames);

var _propTypes = __webpack_require__(4);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = __webpack_require__(2);

var _react2 = _interopRequireDefault(_react);

var _drawer_header = __webpack_require__(227);

var _connect = __webpack_require__(26);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Drawer = function (_React$Component) {
    _inherits(Drawer, _React$Component);

    function Drawer() {
        var _ref;

        var _temp, _this, _ret;

        _classCallCheck(this, Drawer);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Drawer.__proto__ || Object.getPrototypeOf(Drawer)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
            is_this_drawer_on: false
        }, _this.setRef = function (node) {
            _this.ref = node;
        }, _this.hide = function () {
            _this.scrollToggle(false);
            _this.props.hideDrawers();
        }, _this.handleClickOutside = function (event) {
            if (_this.state.is_this_drawer_on) {
                if (_this.ref && !_this.ref.contains(event.target)) {
                    _this.hide();
                }
            }
        }, _temp), _possibleConstructorReturn(_this, _ret);
    }

    _createClass(Drawer, [{
        key: 'scrollToggle',
        value: function scrollToggle(state) {
            this.is_open = state;
            document.body.classList.toggle('no-scroll', this.is_open);
        }
    }, {
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps(nextProps) {
            if (this.props.alignment === 'left') {
                this.setState({ is_this_drawer_on: nextProps.is_main_drawer_on });
            } else if (this.props.alignment === 'right') {
                this.setState({ is_this_drawer_on: nextProps.is_notifications_drawer_on });
            }
        }
    }, {
        key: 'render',
        value: function render() {
            var is_this_drawer_on = this.state.is_this_drawer_on;
            var _props = this.props,
                alignment = _props.alignment,
                closeBtn = _props.closeBtn,
                children = _props.children;


            var visibility = {
                visibility: '' + (!is_this_drawer_on ? 'hidden' : 'visible')
            };
            var drawer_bg_class = (0, _classnames2.default)('drawer-bg', {
                'show': is_this_drawer_on
            });
            var drawer_class = (0, _classnames2.default)('drawer', {
                'visible': is_this_drawer_on
            }, alignment);

            return _react2.default.createElement(
                'aside',
                { className: 'drawer-container' },
                _react2.default.createElement(
                    'div',
                    {
                        className: drawer_bg_class,
                        style: visibility,
                        onClick: this.handleClickOutside
                    },
                    _react2.default.createElement(
                        'div',
                        {
                            ref: this.setRef,
                            className: drawer_class,
                            style: visibility
                        },
                        _react2.default.createElement(_drawer_header.DrawerHeader, {
                            alignment: alignment,
                            closeBtn: closeBtn
                        }),
                        children
                    )
                )
            );
        }
    }]);

    return Drawer;
}(_react2.default.Component);

Drawer.propTypes = {
    alignment: _propTypes2.default.string,
    children: _propTypes2.default.oneOfType([_propTypes2.default.array, _propTypes2.default.object]),
    closeBtn: _propTypes2.default.func,
    footer: _propTypes2.default.func,
    hideDrawers: _propTypes2.default.func,
    icon_class: _propTypes2.default.string,
    icon_link: _propTypes2.default.string,
    is_main_drawer_on: _propTypes2.default.bool,
    is_notifications_drawer_on: _propTypes2.default.bool
};

var drawer_component = (0, _connect.connect)(function (_ref2) {
    var ui = _ref2.ui;
    return {
        is_main_drawer_on: ui.is_main_drawer_on,
        is_notifications_drawer_on: ui.is_notifications_drawer_on,
        hideDrawers: ui.hideDrawers
    };
})(Drawer);

exports.Drawer = drawer_component;

/***/ }),
/* 227 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.DrawerHeader = undefined;

var _classnames = __webpack_require__(18);

var _classnames2 = _interopRequireDefault(_classnames);

var _propTypes = __webpack_require__(4);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = __webpack_require__(2);

var _react2 = _interopRequireDefault(_react);

var _url = __webpack_require__(10);

var _url2 = _interopRequireDefault(_url);

var _localize = __webpack_require__(0);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var DrawerHeader = exports.DrawerHeader = function DrawerHeader(_ref) {
    var alignment = _ref.alignment,
        closeBtn = _ref.closeBtn;

    var drawer_header_class = (0, _classnames2.default)('drawer-header', alignment);
    return _react2.default.createElement(
        _react2.default.Fragment,
        null,
        alignment && alignment === 'right' ? _react2.default.createElement(
            'div',
            { className: drawer_header_class },
            _react2.default.createElement(
                'div',
                { className: 'icons btn-close', onClick: closeBtn },
                _react2.default.createElement('img', { src: _url2.default.urlForStatic('images/app_2/common/close.svg'), alt: 'Close' })
            ),
            _react2.default.createElement(
                'div',
                { className: 'notifications-header' },
                _react2.default.createElement(
                    'h4',
                    null,
                    (0, _localize.localize)('all notifications')
                )
            )
        ) : _react2.default.createElement(
            'div',
            { className: drawer_header_class },
            _react2.default.createElement(
                'div',
                { className: 'icons btn-close', onClick: closeBtn },
                _react2.default.createElement('img', { src: _url2.default.urlForStatic('images/app_2/common/close.svg'), alt: 'Close' })
            ),
            _react2.default.createElement(
                'div',
                { className: 'icons brand-logo' },
                _react2.default.createElement('img', { src: _url2.default.urlForStatic('images/app_2/header/binary_logo_dark.svg'), alt: 'Binary.com' })
            )
        )
    );
};

DrawerHeader.propTypes = {
    alignment: _propTypes2.default.string,
    closeBtn: _propTypes2.default.func
};

/***/ }),
/* 228 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.DrawerItem = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _propTypes = __webpack_require__(4);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = __webpack_require__(2);

var _react2 = _interopRequireDefault(_react);

var _Routes = __webpack_require__(128);

var _connect = __webpack_require__(26);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DrawerItem = function (_React$Component) {
    _inherits(DrawerItem, _React$Component);

    function DrawerItem() {
        var _ref;

        var _temp, _this, _ret;

        _classCallCheck(this, DrawerItem);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = DrawerItem.__proto__ || Object.getPrototypeOf(DrawerItem)).call.apply(_ref, [this].concat(args))), _this), _this.drawerItemClicked = function () {
            _this.props.hideDrawers();
            if (_this.props.collapseItems) {
                _this.props.collapseItems();
            }
        }, _temp), _possibleConstructorReturn(_this, _ret);
    }

    _createClass(DrawerItem, [{
        key: 'render',
        value: function render() {
            var _props = this.props,
                link_to = _props.link_to,
                text = _props.text,
                icon = _props.icon,
                custom_action = _props.custom_action;


            return _react2.default.createElement(
                'div',
                { className: 'drawer-item', onClick: this.drawerItemClicked },
                custom_action ? _react2.default.createElement(
                    'a',
                    { href: 'javascript:;', onClick: custom_action },
                    _react2.default.createElement(
                        'span',
                        { className: icon || undefined
                        },
                        text
                    )
                ) : _react2.default.createElement(
                    _Routes.BinaryLink,
                    { to: link_to },
                    _react2.default.createElement(
                        'span',
                        { className: icon || undefined },
                        text
                    )
                )
            );
        }
    }]);

    return DrawerItem;
}(_react2.default.Component);

DrawerItem.propTypes = {
    collapseItems: _propTypes2.default.func,
    custom_action: _propTypes2.default.func,
    href: _propTypes2.default.string,
    icon: _propTypes2.default.string,
    text: _propTypes2.default.string,
    hideDrawers: _propTypes2.default.func,
    link_to: _propTypes2.default.string
};

var drawer_item_component = (0, _connect.connect)(function (_ref2) {
    var ui = _ref2.ui;
    return {
        hideDrawers: ui.hideDrawers
    };
})(DrawerItem);

exports.DrawerItem = drawer_item_component;

/***/ }),
/* 229 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.PopConfirmElement = undefined;

var _react = __webpack_require__(2);

var _react2 = _interopRequireDefault(_react);

var _classnames = __webpack_require__(18);

var _classnames2 = _interopRequireDefault(_classnames);

var _propTypes = __webpack_require__(4);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _localize = __webpack_require__(0);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var PopConfirmElement = function PopConfirmElement(_ref) {
    var alignment = _ref.alignment,
        cancel_text = _ref.cancel_text,
        confirm_text = _ref.confirm_text,
        is_visible = _ref.is_visible,
        message = _ref.message,
        onClose = _ref.onClose,
        onConfirm = _ref.onConfirm,
        wrapperRef = _ref.wrapperRef;

    var popconfirm_class = (0, _classnames2.default)('popconfirm', alignment, {
        'open': is_visible
    });
    return _react2.default.createElement(
        'div',
        { ref: wrapperRef, className: popconfirm_class },
        _react2.default.createElement(
            'div',
            { className: 'popconfirm-title' },
            _react2.default.createElement(
                'svg',
                { xmlns: 'http://www.w3.org/2000/svg', width: '16', height: '16', viewBox: '0 0 16 16' },
                _react2.default.createElement(
                    'g',
                    { fill: 'none', fillRule: 'evenodd' },
                    _react2.default.createElement('circle', { cx: '8', cy: '8', r: '8', fill: '#FFC107' }),
                    _react2.default.createElement(
                        'g',
                        { fill: '#FFF', transform: 'matrix(1 0 0 -1 6.5 12)' },
                        _react2.default.createElement('circle', { cx: '1.5', cy: '1', r: '1' }),
                        _react2.default.createElement('path', { d: 'M1.5 3c.6 0 1 .4 1 1v3a1 1 0 1 1-2 0V4c0-.6.4-1 1-1z' })
                    )
                )
            ),
            _react2.default.createElement(
                'h4',
                null,
                (0, _localize.localize)(message)
            )
        ),
        _react2.default.createElement(
            'div',
            { className: 'popconfirm-buttons' },
            _react2.default.createElement(
                'div',
                {
                    className: 'btn flat effect',
                    onClick: onClose
                },
                _react2.default.createElement(
                    'span',
                    null,
                    (0, _localize.localize)(cancel_text)
                )
            ),
            _react2.default.createElement(
                'div',
                {
                    className: 'btn flat effect',
                    onClick: onConfirm
                },
                _react2.default.createElement(
                    'span',
                    null,
                    (0, _localize.localize)(confirm_text)
                )
            )
        )
    );
};

PopConfirmElement.propTypes = {
    alignment: _propTypes2.default.string,
    cancel_text: _propTypes2.default.string,
    confirm_text: _propTypes2.default.string,
    is_visible: _propTypes2.default.bool,
    message: _propTypes2.default.string,
    onConfirm: _propTypes2.default.func,
    onClose: _propTypes2.default.func,
    wrapperRef: _propTypes2.default.func
};

exports.PopConfirmElement = PopConfirmElement;

/***/ }),
/* 230 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = __webpack_require__(2);

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__(4);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _toggle_button = __webpack_require__(447);

var _toggle_button2 = _interopRequireDefault(_toggle_button);

var _localize = __webpack_require__(0);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SettingsControl = function SettingsControl(_ref) {
    var children = _ref.children,
        name = _ref.name,
        style = _ref.style,
        to_toggle = _ref.to_toggle,
        toggle = _ref.toggle,
        onClick = _ref.onClick;
    return _react2.default.createElement(
        'div',
        { className: 'settings-row', onClick: toggle || onClick },
        _react2.default.createElement(
            'span',
            null,
            (0, _localize.localize)(name)
        ),
        toggle ? _react2.default.createElement(_toggle_button2.default, {
            toggled: to_toggle,
            style: style
        }) : children
    );
};

SettingsControl.propTypes = {
    children: _propTypes2.default.node,
    name: _propTypes2.default.string,
    style: _propTypes2.default.string,
    toggle: _propTypes2.default.func,
    to_toggle: _propTypes2.default.bool,
    onClick: _propTypes2.default.func
};

exports.default = SettingsControl;

/***/ }),
/* 231 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.TabsItem = undefined;

var _classnames = __webpack_require__(18);

var _classnames2 = _interopRequireDefault(_classnames);

var _react = __webpack_require__(2);

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__(4);

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var TabsItem = function TabsItem(_ref) {
    var active = _ref.active,
        children = _ref.children,
        elements = _ref.elements,
        onChange = _ref.onChange;
    return _react2.default.Children.map(children, function (child) {
        var tab_class = (0, _classnames2.default)('tab', { 'tab--active': child.key === active });
        return _react2.default.createElement(
            'div',
            {
                className: tab_class,
                ref: function ref(el) {
                    return elements[child.key] = el;
                },
                onClick: function onClick() {
                    onChange(child.key);
                }
            },
            child
        );
    });
};

TabsItem.propTypes = {
    active: _propTypes2.default.string,
    children: _propTypes2.default.node,
    elements: _propTypes2.default.object,
    onChange: _propTypes2.default.func
};

exports.TabsItem = TabsItem;

/***/ }),
/* 232 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.TabsWrapper = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(2);

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__(4);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _tabs_item = __webpack_require__(231);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var TabsWrapper = function (_React$PureComponent) {
    _inherits(TabsWrapper, _React$PureComponent);

    function TabsWrapper(props) {
        _classCallCheck(this, TabsWrapper);

        var _this = _possibleConstructorReturn(this, (TabsWrapper.__proto__ || Object.getPrototypeOf(TabsWrapper)).call(this, props));

        _this.getSizes = function () {
            var rootBounds = _this.root.getBoundingClientRect();
            var sizes = {};
            Object.keys(_this.els).forEach(function (key) {
                var el = _this.els[key];
                var bounds = el.getBoundingClientRect();

                var left = bounds.left - rootBounds.left;
                var right = rootBounds.right - bounds.right;

                sizes[key] = { left: left, right: right };
            });
            _this.setState({ sizes: sizes });
        };

        _this.getUnderlineStyle = function () {
            if (_this.props.active == null || Object.keys(_this.state.sizes).length === 0) {
                return { left: '0', right: '100%' };
            }
            var size = _this.state.sizes[_this.props.active];
            return {
                left: size.left + 'px',
                right: size.right + 'px',
                transition: 'left 0.2s, right 0.25s'
            };
        };

        _this.state = {
            sizes: {}
        };
        _this.els = {};
        return _this;
    }

    _createClass(TabsWrapper, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            this.getSizes();
            window.addEventListener('resize', this.getSizes);
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            window.removeEventListener('resize', this.getSizes);
        }
    }, {
        key: 'render',
        value: function render() {
            var _this2 = this;

            return _react2.default.createElement(
                'div',
                {
                    className: 'tab-wrapper',
                    ref: function ref(el) {
                        return _this2.root = el;
                    }
                },
                _react2.default.createElement(
                    _tabs_item.TabsItem,
                    {
                        active: this.props.active,
                        onChange: this.props.onChange,
                        elements: this.els
                    },
                    this.props.children
                ),
                _react2.default.createElement('div', {
                    className: 'tab-underline',
                    style: this.getUnderlineStyle()
                })
            );
        }
    }]);

    return TabsWrapper;
}(_react2.default.PureComponent);

TabsWrapper.propTypes = {
    active: _propTypes2.default.string,
    children: _propTypes2.default.node,
    toggleDialog: _propTypes2.default.func,
    onChange: _propTypes2.default.func
};

exports.TabsWrapper = TabsWrapper;

/***/ }),
/* 233 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _classnames = __webpack_require__(18);

var _classnames2 = _interopRequireDefault(_classnames);

var _mobxReact = __webpack_require__(28);

var _propTypes = __webpack_require__(4);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = __webpack_require__(2);

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/* TODO:
      1. implement sorting by column (ASC/DESC)
      2. implement filtering per column
*/

var DataTable = function (_React$Component) {
    _inherits(DataTable, _React$Component);

    function DataTable() {
        _classCallCheck(this, DataTable);

        return _possibleConstructorReturn(this, (DataTable.__proto__ || Object.getPrototypeOf(DataTable)).apply(this, arguments));
    }

    _createClass(DataTable, [{
        key: 'renderRow',
        value: function renderRow(transaction, id) {
            if (!transaction) return null;
            var defaultRenderCell = function defaultRenderCell(data, data_index) {
                return _react2.default.createElement(
                    'td',
                    { className: data_index, key: data_index },
                    data
                );
            };

            return _react2.default.createElement(
                'tr',
                { className: 'table-row', key: id },
                this.props.columns.map(function (_ref) {
                    var data_index = _ref.data_index,
                        renderCell = _ref.renderCell;

                    var data = transaction[data_index] || '';
                    return (renderCell || defaultRenderCell)(data, data_index, transaction);
                })
            );
        }
    }, {
        key: 'renderBodyRows',
        value: function renderBodyRows() {
            var _this2 = this;

            return this.props.data_source.map(function (transaction, id) {
                return _this2.renderRow(transaction, id);
            });
        }
    }, {
        key: 'renderHeaders',
        value: function renderHeaders() {
            return this.props.columns.map(function (col) {
                return _react2.default.createElement(
                    'th',
                    { className: col.data_index, key: col.data_index },
                    col.title
                );
            });
        }
    }, {
        key: 'renderTableClone',
        value: function renderTableClone() {
            /*
                cloned table with one row for fixed header
                inspired by
                https://stackoverflow.com/questions/4709390
            */
            return _react2.default.createElement(
                'table',
                { className: (0, _classnames2.default)('table', 'table-clone', { 'table--full-width': this.props.is_full_width }) },
                _react2.default.createElement(
                    'thead',
                    { className: 'table-head' },
                    _react2.default.createElement(
                        'tr',
                        { className: 'table-row' },
                        this.renderHeaders()
                    )
                ),
                _react2.default.createElement(
                    'tbody',
                    { className: 'table-body' },
                    this.renderRow(this.props.data_source[0], 0)
                )
            );
        }
    }, {
        key: 'render',
        value: function render() {
            var table_class = (0, _classnames2.default)('table', {
                'table--full-width': this.props.is_full_width,
                'table--fixed-header': this.props.has_fixed_header
            });
            return _react2.default.createElement(
                'div',
                { className: 'table-container' },
                this.props.has_fixed_header && this.renderTableClone(),
                _react2.default.createElement(
                    'table',
                    { className: table_class },
                    _react2.default.createElement(
                        'thead',
                        { className: 'table-head' },
                        _react2.default.createElement(
                            'tr',
                            { className: 'table-row' },
                            this.renderHeaders()
                        )
                    ),
                    this.props.footer && _react2.default.createElement(
                        'tfoot',
                        { className: 'table-foot' },
                        this.renderRow(this.props.footer, 0)
                    ),
                    _react2.default.createElement(
                        'tbody',
                        { className: 'table-body' },
                        this.renderBodyRows()
                    )
                )
            );
        }
    }]);

    return DataTable;
}(_react2.default.Component);

DataTable.propTypes = {
    columns: _propTypes2.default.array,
    data_source: _mobxReact.PropTypes.arrayOrObservableArray,
    footer: _propTypes2.default.object,
    has_fixed_header: _propTypes2.default.bool,
    is_full_width: _propTypes2.default.bool
};

exports.default = DataTable;

/***/ }),
/* 234 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _classnames = __webpack_require__(18);

var _classnames2 = _interopRequireDefault(_classnames);

var _propTypes = __webpack_require__(4);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = __webpack_require__(2);

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var UILoader = function UILoader(_ref) {
    var className = _ref.className;

    var loading_class = (0, _classnames2.default)('loading', className);
    return _react2.default.createElement(
        'div',
        { className: 'block-ui' },
        _react2.default.createElement(
            'div',
            { className: loading_class },
            _react2.default.createElement(
                'div',
                { className: 'spinner' },
                _react2.default.createElement(
                    'svg',
                    { className: 'circular', viewBox: '25 25 50 50' },
                    _react2.default.createElement('circle', { className: 'path', cx: '50', cy: '50', r: '20', fill: 'none', strokeWidth: '4', strokeMiterlimit: '10' })
                )
            )
        )
    );
};

UILoader.propTypes = {
    className: _propTypes2.default.string
};

exports.default = UILoader;

/***/ }),
/* 235 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _date_picker = __webpack_require__(448);

var _date_picker2 = _interopRequireDefault(_date_picker);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _date_picker2.default;

/***/ }),
/* 236 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _mobxReact = __webpack_require__(28);

var _moment = __webpack_require__(9);

var _moment2 = _interopRequireDefault(_moment);

var _propTypes = __webpack_require__(4);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = __webpack_require__(2);

var _react2 = _interopRequireDefault(_react);

var _start_date = __webpack_require__(259);

var _localize = __webpack_require__(0);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/* TODO:
      1. to update state accordingly during native to desktop switches
      2. update the state only when dropdown closed
*/

var TimePickerDropdown = function (_React$Component) {
    _inherits(TimePickerDropdown, _React$Component);

    function TimePickerDropdown(props) {
        _classCallCheck(this, TimePickerDropdown);

        var _this = _possibleConstructorReturn(this, (TimePickerDropdown.__proto__ || Object.getPrototypeOf(TimePickerDropdown)).call(this, props));

        _this.selectOption = function (type, value) {
            var is_enabled = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

            if (is_enabled) {
                var _this$props$value$spl = _this.props.value.split(':'),
                    _this$props$value$spl2 = _slicedToArray(_this$props$value$spl, 2),
                    prev_hour = _this$props$value$spl2[0],
                    prev_minute = _this$props$value$spl2[1];

                if (type === 'h' && value !== prev_hour || type === 'm' && value !== prev_minute) {
                    var is_type_selected = type === 'h' ? 'is_hour_selected' : 'is_minute_selected';
                    _this.setState(_defineProperty({
                        last_updated_type: type
                    }, is_type_selected, true));
                    _this.props.onChange((type === 'h' ? value : prev_hour) + ':' + (type === 'm' ? value : prev_minute));
                }
            }
        };

        _this.clear = function (event) {
            event.stopPropagation();
            _this.resetValues();
            _this.props.onChange('');
        };

        _this.hours = [].concat(_toConsumableArray(Array(24).keys())).map(function (a) {
            return ('0' + a).slice(-2);
        });
        _this.minutes = [].concat(_toConsumableArray(Array(12).keys())).map(function (a) {
            return ('0' + a * 5).slice(-2);
        });
        _this.state = {
            is_hour_selected: false,
            is_minute_selected: false,
            last_updated_type: null
        };
        return _this;
    }

    _createClass(TimePickerDropdown, [{
        key: 'componentDidUpdate',
        value: function componentDidUpdate(prevProps, prevState) {
            var _state = this.state,
                is_hour_selected = _state.is_hour_selected,
                is_minute_selected = _state.is_minute_selected;

            if (is_hour_selected && is_minute_selected) {
                this.resetValues();
                this.props.toggle();
            }
            if (!prevProps.className && this.props.className === 'active') {
                this.resetValues();
            }
            if (prevState.last_updated_type !== this.state.last_updated_type && this.state.last_updated_type) {
                this.setState({ last_updated_type: null });
            }
        }
    }, {
        key: 'resetValues',
        value: function resetValues() {
            this.setState({
                is_hour_selected: false,
                is_minute_selected: false
            });
        }
    }, {
        key: 'render',
        value: function render() {
            var _this2 = this;

            var _props = this.props,
                preClass = _props.preClass,
                value = _props.value,
                toggle = _props.toggle,
                start_date = _props.start_date,
                sessions = _props.sessions;

            var start_moment = (0, _moment2.default)(start_date * 1000 || undefined).utc();
            var start_moment_clone = start_moment.clone().minute(0).second(0);

            var _value$split = value.split(':'),
                _value$split2 = _slicedToArray(_value$split, 2),
                hour = _value$split2[0],
                minute = _value$split2[1];

            return _react2.default.createElement(
                'div',
                { className: preClass + '-dropdown ' + this.props.className },
                _react2.default.createElement(
                    'div',
                    {
                        className: preClass + '-panel',
                        onClick: toggle
                    },
                    _react2.default.createElement(
                        'span',
                        { className: value ? '' : 'placeholder' },
                        value || (0, _localize.localize)('Select time')
                    ),
                    (!('is_clearable' in this.props) || this.props.is_clearable) && _react2.default.createElement('span', {
                        className: preClass + '-clear',
                        onClick: this.clear
                    })
                ),
                _react2.default.createElement(
                    'div',
                    { className: preClass + '-selector' },
                    _react2.default.createElement(
                        'div',
                        {
                            ref: this.saveHourRef,
                            className: preClass + '-hours'
                        },
                        _react2.default.createElement(
                            'div',
                            { className: 'list-title center-text' },
                            _react2.default.createElement(
                                'strong',
                                null,
                                (0, _localize.localize)('Hour')
                            )
                        ),
                        _react2.default.createElement(
                            'div',
                            { className: 'list-container' },
                            this.hours.map(function (h, key) {
                                start_moment_clone.hour(h);
                                var is_enabled = (0, _start_date.isSessionAvailable)(sessions, start_moment_clone, start_moment, true);
                                return _react2.default.createElement(
                                    'div',
                                    {
                                        className: 'list-item' + (hour === h ? ' selected' : '') + (is_enabled ? '' : ' disabled'),
                                        key: key,
                                        onClick: function onClick() {
                                            _this2.selectOption('h', h, is_enabled);
                                        }
                                    },
                                    h
                                );
                            })
                        )
                    ),
                    _react2.default.createElement(
                        'div',
                        {
                            ref: this.saveMinuteRef,
                            className: preClass + '-minutes'
                        },
                        _react2.default.createElement(
                            'div',
                            { className: 'list-title center-text' },
                            _react2.default.createElement(
                                'strong',
                                null,
                                (0, _localize.localize)('Minute')
                            )
                        ),
                        _react2.default.createElement(
                            'div',
                            { className: 'list-container' },
                            this.minutes.map(function (mm, key) {
                                start_moment_clone.hour(hour).minute(mm);
                                var is_enabled = (0, _start_date.isSessionAvailable)(sessions, start_moment_clone, start_moment);
                                return _react2.default.createElement(
                                    'div',
                                    {
                                        className: 'list-item' + (minute === mm ? ' selected' : '') + (is_enabled ? '' : ' disabled'),
                                        key: key,
                                        onClick: function onClick() {
                                            _this2.selectOption('m', mm, is_enabled);
                                        }
                                    },
                                    mm
                                );
                            })
                        )
                    )
                )
            );
        }
    }]);

    return TimePickerDropdown;
}(_react2.default.Component);

var TimePicker = function (_React$Component2) {
    _inherits(TimePicker, _React$Component2);

    function TimePicker(props) {
        _classCallCheck(this, TimePicker);

        var _this3 = _possibleConstructorReturn(this, (TimePicker.__proto__ || Object.getPrototypeOf(TimePicker)).call(this, props));

        _this3.toggleDropDown = function () {
            _this3.setState({ is_open: !_this3.state.is_open });
        };

        _this3.handleChange = function (arg) {
            // To handle nativepicker;
            var value = (typeof arg === 'undefined' ? 'undefined' : _typeof(arg)) === 'object' ? arg.target.value : arg;

            if (value !== _this3.props.value) {
                _this3.props.onChange({ target: { name: _this3.props.name, value: value } });
            }
        };

        _this3.saveRef = function (node) {
            if (!node) return;
            if (node.nodeName === 'INPUT') {
                _this3.target_element = node;
                return;
            }
            _this3.wrapper_ref = node;
        };

        _this3.handleClickOutside = function (event) {
            if (_this3.wrapper_ref && !_this3.wrapper_ref.contains(event.target)) {
                if (_this3.state.is_open) {
                    _this3.setState({ is_open: false });
                }
            }
        };

        _this3.state = {
            is_open: false,
            value: ''
        };
        return _this3;
    }

    _createClass(TimePicker, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            document.addEventListener('mousedown', this.handleClickOutside);
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            document.removeEventListener('mousedown', this.handleClickOutside);
        }
    }, {
        key: 'render',
        value: function render() {
            var prefix_class = 'time-picker';
            var _props2 = this.props,
                is_nativepicker = _props2.is_nativepicker,
                value = _props2.value,
                name = _props2.name,
                is_align_right = _props2.is_align_right,
                placeholder = _props2.placeholder,
                start_date = _props2.start_date,
                sessions = _props2.sessions;

            return _react2.default.createElement(
                'div',
                {
                    ref: this.saveRef,
                    className: '' + prefix_class + (this.props.padding ? ' padding' : '') + (this.state.is_open ? ' active' : '')
                },
                is_nativepicker ? _react2.default.createElement('input', {
                    type: 'time',
                    id: prefix_class + '-input',
                    value: value,
                    onChange: this.handleChange,
                    name: name
                }) : _react2.default.createElement(
                    _react2.default.Fragment,
                    null,
                    _react2.default.createElement('input', {
                        ref: this.saveRef,
                        type: 'text',
                        readOnly: true,
                        id: prefix_class + '-input',
                        className: prefix_class + '-input ' + (this.state.is_open ? 'active' : ''),
                        value: value,
                        onClick: this.toggleDropDown,
                        name: name,
                        placeholder: placeholder
                    }),
                    _react2.default.createElement(TimePickerDropdown, {
                        className: '' + (this.state.is_open ? 'active' : '') + (is_align_right ? ' from-right' : ''),
                        toggle: this.toggleDropDown,
                        onChange: this.handleChange,
                        preClass: prefix_class,
                        start_date: start_date,
                        value: value,
                        sessions: sessions,
                        is_clearable: this.props.is_clearable
                    })
                )
            );
        }
    }]);

    return TimePicker;
}(_react2.default.Component);

TimePicker.propTypes = {
    is_nativepicker: _propTypes2.default.bool,
    is_align_right: _propTypes2.default.bool,
    is_clearable: _propTypes2.default.bool,
    name: _propTypes2.default.string,
    onChange: _propTypes2.default.func,
    padding: _propTypes2.default.string,
    placeholder: _propTypes2.default.string,
    value: _propTypes2.default.string,
    start_date: _propTypes2.default.number,
    sessions: _mobxReact.PropTypes.arrayOrObservableArray
};

TimePickerDropdown.propTypes = {
    className: _propTypes2.default.string,
    onChange: _propTypes2.default.func,
    preClass: _propTypes2.default.string,
    toggle: _propTypes2.default.func,
    value: _propTypes2.default.string,
    value_split: _propTypes2.default.bool,
    is_clearable: _propTypes2.default.bool,
    start_date: _propTypes2.default.number,
    sessions: _mobxReact.PropTypes.arrayOrObservableArray
};

exports.default = (0, _mobxReact.observer)(TimePicker);

/***/ }),
/* 237 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
var normalizePath = exports.normalizePath = function normalizePath(path) {
    return (/^\//.test(path) ? path : '/' + (path || '')
    );
}; // Default to '/'

var getRouteInfo = exports.getRouteInfo = function getRouteInfo(routes, path) {
    return routes.find(function (r) {
        return r.path === normalizePath(path);
    });
};

var isRouteVisible = exports.isRouteVisible = function isRouteVisible(route, is_logged_in) {
    return !(route && route.is_authenticated && !is_logged_in);
};

/***/ }),
/* 238 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = __webpack_require__(2);

var _react2 = _interopRequireDefault(_react);

var _reactRouterDom = __webpack_require__(89);

var _routes = __webpack_require__(242);

var _routes2 = _interopRequireDefault(_routes);

var _login = __webpack_require__(34);

var _client_base = __webpack_require__(22);

var _client_base2 = _interopRequireDefault(_client_base);

var _localize = __webpack_require__(0);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var RouteWithSubRoutes = function RouteWithSubRoutes(route) {
    var renderFactory = function renderFactory(props) {
        var result = null;
        if (route.component === _reactRouterDom.Redirect) {
            var to = route.to;

            // This if clause has been added just to remove '/index' from url in localhost env.
            if (route.path === _routes2.default.index) {
                var location = props.location;

                to = location.pathname.toLowerCase().replace(route.path, '');
            }
            result = _react2.default.createElement(_reactRouterDom.Redirect, { to: to });
        } else {
            result = route.is_authenticated && !_client_base2.default.isLoggedIn() ? // TODO: update styling of the message below
            _react2.default.createElement(
                'a',
                { href: 'javascript:;', onClick: _login.redirectToLogin },
                (0, _localize.localize)('Please login to view this page.')
            ) : _react2.default.createElement(route.component, _extends({}, props, { routes: route.routes }));
        }

        return result;
    };

    return _react2.default.createElement(_reactRouterDom.Route, {
        exact: route.exact,
        path: route.path,
        render: renderFactory
    });
};

exports.default = RouteWithSubRoutes;

/***/ }),
/* 239 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _reactRouterDom = __webpack_require__(89);

var _Constants = __webpack_require__(241);

var _Portfolio = __webpack_require__(473);

var _Portfolio2 = _interopRequireDefault(_Portfolio);

var _settings = __webpack_require__(509);

var _settings2 = _interopRequireDefault(_settings);

var _Statement = __webpack_require__(482);

var _Statement2 = _interopRequireDefault(_Statement);

var _Trading = __webpack_require__(505);

var _Trading2 = _interopRequireDefault(_Trading);

var _account_password = __webpack_require__(248);

var _account_password2 = _interopRequireDefault(_account_password);

var _api_token = __webpack_require__(249);

var _api_token2 = _interopRequireDefault(_api_token);

var _authorized_applications = __webpack_require__(250);

var _authorized_applications2 = _interopRequireDefault(_authorized_applications);

var _cashier_password = __webpack_require__(251);

var _cashier_password2 = _interopRequireDefault(_cashier_password);

var _financial_assessment = __webpack_require__(252);

var _financial_assessment2 = _interopRequireDefault(_financial_assessment);

var _limits = __webpack_require__(253);

var _limits2 = _interopRequireDefault(_limits);

var _login_history = __webpack_require__(254);

var _login_history2 = _interopRequireDefault(_login_history);

var _personal_details = __webpack_require__(255);

var _personal_details2 = _interopRequireDefault(_personal_details);

var _self_exclusion = __webpack_require__(256);

var _self_exclusion2 = _interopRequireDefault(_self_exclusion);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var routes_config = [{ path: _Constants.routes.root, component: _reactRouterDom.Redirect, exact: true, to: '/trade' }, { path: _Constants.routes.index, component: _reactRouterDom.Redirect, to: '/trade' }, { path: _Constants.routes.trade, component: _Trading2.default, exact: true }, { path: _Constants.routes.portfolio, component: _Portfolio2.default, is_authenticated: true }, { path: _Constants.routes.statement, component: _Statement2.default, is_authenticated: true }, {
    path: _Constants.routes.settings,
    component: _settings2.default,
    is_authenticated: true,
    routes: [{ path: _Constants.routes.personal, component: _personal_details2.default }, { path: _Constants.routes.financial, component: _financial_assessment2.default }, { path: _Constants.routes.account_password, component: _account_password2.default }, { path: _Constants.routes.cashier_password, component: _cashier_password2.default }, { path: _Constants.routes.exclusion, component: _self_exclusion2.default }, { path: _Constants.routes.limits, component: _limits2.default }, { path: _Constants.routes.history, component: _login_history2.default }, { path: _Constants.routes.token, component: _api_token2.default }, { path: _Constants.routes.apps, component: _authorized_applications2.default }]
}];

// Settings Routes
exports.default = routes_config;

/***/ }),
/* 240 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
var contract_type_display = exports.contract_type_display = {
    ASIANU: 'Asian Up',
    ASIAND: 'Asian Down',
    CALL: 'Higher',
    CALLE: 'Higher or equal',
    PUT: 'Lower',
    DIGITMATCH: 'Digit Matches',
    DIGITDIFF: 'Digit Differs',
    DIGITODD: 'Digit Odd',
    DIGITEVEN: 'Digit Even',
    DIGITOVER: 'Digit Over',
    DIGITUNDER: 'Digit Under',
    EXPIRYMISS: 'Ends Outside',
    EXPIRYRANGE: 'Ends Between',
    EXPIRYRANGEE: 'Ends Between',
    LBFLOATCALL: 'Close-Low',
    LBFLOATPUT: 'High-Close',
    LBHIGHLOW: 'High-Low',
    RANGE: 'Stays Between',
    UPORDOWN: 'Goes Outside',
    ONETOUCH: 'Touches',
    NOTOUCH: 'Does Not Touch'
};

/***/ }),
/* 241 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.routes = undefined;

var _contract = __webpack_require__(240);

Object.keys(_contract).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _contract[key];
    }
  });
});

var _ui = __webpack_require__(243);

Object.keys(_ui).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _ui[key];
    }
  });
});

var _routes2 = __webpack_require__(242);

var _routes3 = _interopRequireDefault(_routes2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.routes = _routes3.default;

/***/ }),
/* 242 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
var routes = {
    account_password: '/settings/account_password',
    apps: '/settings/apps',
    cashier_password: '/settings/cashier_password',
    exclusion: '/settings/exclusion',
    financial: '/settings/financial',
    history: '/settings/history',
    index: '/index',
    limits: '/settings/limits',
    personal: '/settings/personal',
    portfolio: '/portfolio',
    root: '/',
    settings: '/settings',
    statement: '/statement',
    token: '/settings/token',
    trade: '/trade'
};

exports.default = routes;

/***/ }),
/* 243 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var MAX_MOBILE_WIDTH = exports.MAX_MOBILE_WIDTH = 767;

/***/ }),
/* 244 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _propTypes = __webpack_require__(4);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = __webpack_require__(2);

var _react2 = _interopRequireDefault(_react);

var _url = __webpack_require__(10);

var _url2 = _interopRequireDefault(_url);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var FullScreenDialog = function FullScreenDialog(props) {
    var title = props.title,
        visible = props.visible,
        children = props.children;


    var checkVisibility = function checkVisibility() {
        if (props.visible) {
            document.body.classList.add('no-scroll');
            document.getElementById('binary_app').classList.add('no-scroll');
        } else {
            document.body.classList.remove('no-scroll');
            document.getElementById('binary_app').classList.remove('no-scroll');
        }
    };

    var scrollToElement = function scrollToElement(parent, el) {
        var viewport_offset = el.getBoundingClientRect();
        var hidden = viewport_offset.top + el.clientHeight + 20 > window.innerHeight;
        if (hidden) {
            var new_el_top = (window.innerHeight - el.clientHeight) / 2;
            parent.scrollTop += viewport_offset.top - new_el_top;
        }
    };

    // sometimes input is covered by virtual keyboard on mobile chrome, uc browser
    var handleClick = function handleClick(e) {
        if (e.target.tagName === 'INPUT' && e.target.type === 'number') {
            var scrollToTarget = scrollToElement(e.currentTarget, e.target);
            window.addEventListener('resize', scrollToTarget, false);

            // remove listener, resize is not fired on iOS safari
            window.setTimeout(function () {
                window.removeEventListener('resize', scrollToTarget, false);
            }, 2000);
        }
    };

    checkVisibility();

    return _react2.default.createElement(
        'div',
        {
            className: 'fullscreen-dialog ' + (visible ? 'fullscreen-dialog--open' : ''),
            onClick: handleClick
        },
        _react2.default.createElement(
            'div',
            { className: 'fullscreen-dialog__header' },
            _react2.default.createElement(
                'h2',
                { className: 'fullscreen-dialog__title' },
                title
            ),
            _react2.default.createElement(
                'div',
                {
                    className: 'icons btn-close fullscreen-dialog__close-btn',
                    onClick: props.onClose
                },
                _react2.default.createElement('img', { src: _url2.default.urlForStatic('images/app_2/common/close.svg'), alt: 'Close' })
            )
        ),
        _react2.default.createElement('div', { className: 'fullscreen-dialog__header-shadow-cover' }),
        _react2.default.createElement('div', { className: 'fullscreen-dialog__header-shadow' }),
        _react2.default.createElement(
            'div',
            { className: 'fullscreen-dialog__content' },
            _react2.default.createElement(
                'div',
                { className: 'contracts-modal-list' },
                children
            )
        )
    );
};

FullScreenDialog.propTypes = {
    children: _propTypes2.default.any,
    onClose: _propTypes2.default.func,
    title: _propTypes2.default.string,
    visible: _propTypes2.default.bool
};

exports.default = FullScreenDialog;

/***/ }),
/* 245 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _propTypes = __webpack_require__(4);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = __webpack_require__(2);

var _react2 = _interopRequireDefault(_react);

var _contract_type_widget = __webpack_require__(487);

var _contract_type_widget2 = _interopRequireDefault(_contract_type_widget);

var _connect = __webpack_require__(26);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Contract = function Contract(_ref) {
    var contract_type = _ref.contract_type,
        contract_types_list = _ref.contract_types_list,
        onChange = _ref.onChange,
        is_mobile = _ref.is_mobile;
    return _react2.default.createElement(_contract_type_widget2.default, {
        name: 'contract_type',
        list: contract_types_list,
        value: contract_type,
        onChange: onChange,
        is_mobile: is_mobile
    });
};

Contract.propTypes = {
    contract_type: _propTypes2.default.string,
    contract_types_list: _propTypes2.default.object,
    is_mobile: _propTypes2.default.bool,
    onChange: _propTypes2.default.func
};

exports.default = (0, _connect.connect)(function (_ref2) {
    var modules = _ref2.modules,
        ui = _ref2.ui;
    return {
        contract_type: modules.trade.contract_type,
        contract_types_list: modules.trade.contract_types_list,
        onChange: modules.trade.onChange,
        is_mobile: ui.is_mobile
    };
})(Contract);

/***/ }),
/* 246 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _mobxReact = __webpack_require__(28);

var _propTypes = __webpack_require__(4);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = __webpack_require__(2);

var _react2 = _interopRequireDefault(_react);

var _ui = __webpack_require__(524);

var _connect = __webpack_require__(26);

var _component = __webpack_require__(539);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var TradeParams = function (_React$Component) {
    _inherits(TradeParams, _React$Component);

    function TradeParams() {
        _classCallCheck(this, TradeParams);

        return _possibleConstructorReturn(this, (TradeParams.__proto__ || Object.getPrototypeOf(TradeParams)).apply(this, arguments));
    }

    _createClass(TradeParams, [{
        key: 'isVisible',
        value: function isVisible(component_name) {
            return this.props.form_components.includes(component_name);
        }
    }, {
        key: 'renderCards',
        value: function renderCards() {
            var _this2 = this;

            return _ui.form_components.filter(function (_ref) {
                var name = _ref.name;
                return _this2.isVisible(name);
            }).map(function (_ref2) {
                var name = _ref2.name,
                    Component = _ref2.Component;
                return _react2.default.createElement(Component, _extends({
                    key: name,
                    is_minimized: _this2.props.is_minimized
                }, (0, _component.getComponentProperties)(Component, _this2.props.trade_store, {
                    server_time: _this2.props.server_time
                })));
            });
        }
    }, {
        key: 'render',
        value: function render() {
            return this.renderCards();
        }
    }]);

    return TradeParams;
}(_react2.default.Component);

TradeParams.propTypes = {
    form_components: _mobxReact.PropTypes.arrayOrObservableArray,
    is_minimized: _propTypes2.default.bool,
    onChange: _propTypes2.default.func,
    server_time: _propTypes2.default.object,
    trade_store: _propTypes2.default.object
};

exports.default = (0, _connect.connect)(function (_ref3) {
    var common = _ref3.common,
        modules = _ref3.modules;
    return {
        server_time: common.server_time,
        form_components: modules.trade.form_components,
        trade_store: modules.trade,
        onChange: modules.trade.onChange
    };
})(TradeParams);

/***/ }),
/* 247 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _propTypes = __webpack_require__(4);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = __webpack_require__(2);

var _react2 = _interopRequireDefault(_react);

var _reactRouterDom = __webpack_require__(89);

var _url = __webpack_require__(10);

var _url2 = _interopRequireDefault(_url);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// TODO: use BinaryLink once it supports nested routes
var MenuItem = function MenuItem(_ref) {
    var title = _ref.title,
        description = _ref.description,
        img_src = _ref.img_src,
        path = _ref.path;

    var itemContent = _react2.default.createElement(
        _react2.default.Fragment,
        null,
        _react2.default.createElement('img', { className: 'menu-item__img', src: _url2.default.urlForStatic(img_src) }),
        _react2.default.createElement(
            'div',
            { className: 'menu-item__content' },
            _react2.default.createElement(
                'div',
                { className: 'menu-item__title' },
                title
            ),
            _react2.default.createElement(
                'div',
                { className: 'menu-item__description' },
                description
            )
        )
    );

    return path ? _react2.default.createElement(
        _reactRouterDom.NavLink,
        { className: 'menu-item', to: path, activeClassName: 'menu-item--active' },
        itemContent
    ) : _react2.default.createElement(
        'div',
        { className: 'menu-item' },
        itemContent
    );
};

MenuItem.propTypes = {
    title: _propTypes2.default.string,
    description: _propTypes2.default.string,
    img_src: _propTypes2.default.string,
    path: _propTypes2.default.string
};

exports.default = MenuItem;

/***/ }),
/* 248 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = __webpack_require__(2);

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__(4);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _section = __webpack_require__(63);

var _section2 = _interopRequireDefault(_section);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var AccountPassword = function AccountPassword(_ref) {
    var title = _ref.title,
        description = _ref.description;
    return _react2.default.createElement(_section2.default, { title: title, description: description });
};

AccountPassword.propTypes = {
    title: _propTypes2.default.string,
    description: _propTypes2.default.string
};

exports.default = AccountPassword;

/***/ }),
/* 249 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = __webpack_require__(2);

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__(4);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _section = __webpack_require__(63);

var _section2 = _interopRequireDefault(_section);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ApiToken = function ApiToken(_ref) {
    var title = _ref.title,
        description = _ref.description;
    return _react2.default.createElement(_section2.default, { title: title, description: description });
};

ApiToken.propTypes = {
    title: _propTypes2.default.string,
    description: _propTypes2.default.string
};

exports.default = ApiToken;

/***/ }),
/* 250 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = __webpack_require__(2);

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__(4);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _section = __webpack_require__(63);

var _section2 = _interopRequireDefault(_section);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var AuthorizedApplications = function AuthorizedApplications(_ref) {
    var title = _ref.title,
        description = _ref.description;
    return _react2.default.createElement(_section2.default, { title: title, description: description });
};

AuthorizedApplications.propTypes = {
    title: _propTypes2.default.string,
    description: _propTypes2.default.string
};

exports.default = AuthorizedApplications;

/***/ }),
/* 251 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = __webpack_require__(2);

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__(4);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _section = __webpack_require__(63);

var _section2 = _interopRequireDefault(_section);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var CashierPassword = function CashierPassword(_ref) {
    var title = _ref.title,
        description = _ref.description;
    return _react2.default.createElement(_section2.default, { title: title, description: description });
};

CashierPassword.propTypes = {
    title: _propTypes2.default.string,
    description: _propTypes2.default.string
};

exports.default = CashierPassword;

/***/ }),
/* 252 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = __webpack_require__(2);

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__(4);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _section = __webpack_require__(63);

var _section2 = _interopRequireDefault(_section);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var FinancialAssessment = function FinancialAssessment(_ref) {
    var title = _ref.title,
        description = _ref.description;
    return _react2.default.createElement(_section2.default, { title: title, description: description });
};

FinancialAssessment.propTypes = {
    title: _propTypes2.default.string,
    description: _propTypes2.default.string
};

exports.default = FinancialAssessment;

/***/ }),
/* 253 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = __webpack_require__(2);

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__(4);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _section = __webpack_require__(63);

var _section2 = _interopRequireDefault(_section);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Limits = function Limits(_ref) {
    var title = _ref.title,
        description = _ref.description;
    return _react2.default.createElement(_section2.default, { title: title, description: description });
};

Limits.propTypes = {
    title: _propTypes2.default.string,
    description: _propTypes2.default.string
};

exports.default = Limits;

/***/ }),
/* 254 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = __webpack_require__(2);

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__(4);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _section = __webpack_require__(63);

var _section2 = _interopRequireDefault(_section);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var LoginHistory = function LoginHistory(_ref) {
    var title = _ref.title,
        description = _ref.description;
    return _react2.default.createElement(_section2.default, { title: title, description: description });
};

LoginHistory.propTypes = {
    title: _propTypes2.default.string,
    description: _propTypes2.default.string
};

exports.default = LoginHistory;

/***/ }),
/* 255 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = __webpack_require__(2);

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__(4);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _section = __webpack_require__(63);

var _section2 = _interopRequireDefault(_section);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var PersonalDetails = function PersonalDetails(_ref) {
    var title = _ref.title,
        description = _ref.description;
    return _react2.default.createElement(_section2.default, { title: title, description: description });
};

PersonalDetails.propTypes = {
    title: _propTypes2.default.string,
    description: _propTypes2.default.string
};

exports.default = PersonalDetails;

/***/ }),
/* 256 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = __webpack_require__(2);

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__(4);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _section = __webpack_require__(63);

var _section2 = _interopRequireDefault(_section);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SelfExclusion = function SelfExclusion(_ref) {
    var title = _ref.title,
        description = _ref.description;
    return _react2.default.createElement(_section2.default, { title: title, description: description });
};

SelfExclusion.propTypes = {
    title: _propTypes2.default.string,
    description: _propTypes2.default.string
};

exports.default = SelfExclusion;

/***/ }),
/* 257 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.requestLogout = undefined;

var _ws_methods = __webpack_require__(166);

var _ws_methods2 = _interopRequireDefault(_ws_methods);

var _client_base = __webpack_require__(22);

var _client_base2 = _interopRequireDefault(_client_base);

var _socket_cache = __webpack_require__(49);

var _socket_cache2 = _interopRequireDefault(_socket_cache);

var _storage = __webpack_require__(7);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var requestLogout = exports.requestLogout = function requestLogout() {
    _ws_methods2.default.logout().then(doLogout);
};

var doLogout = function doLogout(response) {
    if (response.logout !== 1) return;
    (0, _storage.removeCookies)('affiliate_token', 'affiliate_tracking');
    _client_base2.default.clearAllAccounts();
    _client_base2.default.set('loginid', '');
    _socket_cache2.default.clear();
    window.location.reload();
};

/***/ }),
/* 258 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _moment = __webpack_require__(9);

var _moment2 = _interopRequireDefault(_moment);

var _localize = __webpack_require__(0);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var duration_maps = {
    t: { display: 'ticks', order: 1 },
    s: { display: 'seconds', order: 2, to_second: 1 },
    m: { display: 'minutes', order: 3, to_second: 60 },
    h: { display: 'hours', order: 4, to_second: 60 * 60 },
    d: { display: 'days', order: 5, to_second: 60 * 60 * 24 }
};

var buildDurationConfig = function buildDurationConfig(contract) {
    var durations = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : { min_max: {}, units_display: {} };

    durations.min_max[contract.start_type] = durations.min_max[contract.start_type] || {};
    durations.units_display[contract.start_type] = durations.units_display[contract.start_type] || [];

    var obj_min = getDurationFromString(contract.min_contract_duration);
    var obj_max = getDurationFromString(contract.max_contract_duration);

    durations.min_max[contract.start_type][contract.expiry_type] = {
        min: convertDurationUnit(obj_min.duration, obj_min.unit, 's'),
        max: convertDurationUnit(obj_max.duration, obj_max.unit, 's')
    };

    var arr_units = [];
    durations.units_display[contract.start_type].forEach(function (obj) {
        arr_units.push(obj.value);
    });
    if (/^tick|daily$/.test(contract.expiry_type)) {
        if (arr_units.indexOf(obj_min.unit) === -1) {
            arr_units.push(obj_min.unit);
        }
    } else {
        Object.keys(duration_maps).forEach(function (u) {
            if (arr_units.indexOf(u) === -1 && duration_maps[u].order >= duration_maps[obj_min.unit].order && duration_maps[u].order <= duration_maps[obj_max.unit].order) {
                arr_units.push(u);
            }
        });
    }

    durations.units_display[contract.start_type] = arr_units.sort(function (a, b) {
        return duration_maps[a].order > duration_maps[b].order ? 1 : -1;
    }).reduce(function (o, c) {
        return [].concat(_toConsumableArray(o), [{ text: (0, _localize.localize)(duration_maps[c].display), value: c }]);
    }, []);

    return durations;
};

var convertDurationUnit = function convertDurationUnit(value, from_unit, to_unit) {
    if (!value || !from_unit || !to_unit) return null;
    if (from_unit === to_unit || !('to_second' in duration_maps[from_unit])) return value;
    return value * duration_maps[from_unit].to_second / duration_maps[to_unit].to_second;
};

var getDurationFromString = function getDurationFromString(duration_string) {
    var duration = duration_string.toString().match(/[a-zA-Z]+|[0-9]+/g);
    return {
        duration: duration[0],
        unit: duration[1]
    };
};

var getExpiryType = function getExpiryType(store) {
    var duration_unit = store.duration_unit,
        expiry_date = store.expiry_date,
        expiry_type = store.expiry_type;

    var server_time = store.root_store.common.server_time;

    var duration_is_day = expiry_type === 'duration' && duration_unit === 'd';
    var expiry_is_after_today = expiry_type === 'endtime' && _moment2.default.utc(expiry_date).isAfter((0, _moment2.default)(server_time).utc(), 'day');

    var contract_expiry_type = 'daily';
    if (!duration_is_day && !expiry_is_after_today) {
        contract_expiry_type = duration_unit === 't' ? 'tick' : 'intraday';
    }

    return contract_expiry_type;
};

module.exports = {
    buildDurationConfig: buildDurationConfig,
    getExpiryType: getExpiryType
};

/***/ }),
/* 259 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.isSessionAvailable = exports.buildForwardStartingConfig = undefined;

var _moment = __webpack_require__(9);

var _moment2 = _interopRequireDefault(_moment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var buildForwardStartingConfig = exports.buildForwardStartingConfig = function buildForwardStartingConfig(contract, forward_starting_dates) {
    var forward_starting_config = [];

    if ((contract.forward_starting_options || []).length) {
        contract.forward_starting_options.forEach(function (option) {
            var duplicated_option = forward_starting_config.find(function (opt) {
                return opt.value === option.date;
            });
            var current_session = { open: _moment2.default.unix(option.open).utc(), close: _moment2.default.unix(option.close).utc() };
            if (duplicated_option) {
                duplicated_option.sessions.push(current_session);
            } else {
                forward_starting_config.push({
                    text: _moment2.default.unix(option.date).format('ddd - DD MMM, YYYY'),
                    value: option.date,
                    sessions: [current_session]
                });
            }
        });
    }

    return forward_starting_config.length ? forward_starting_config : forward_starting_dates;
};

// returns false if same as now
var isBeforeDate = function isBeforeDate(compare_moment, start_moment, should_only_check_hour) {
    var now_moment = _moment2.default.utc(start_moment);
    if (should_only_check_hour) {
        now_moment.minute(0).second(0);
    }
    return compare_moment.isBefore(now_moment) && now_moment.unix() !== compare_moment.unix();
};

var isSessionAvailable = exports.isSessionAvailable = function isSessionAvailable() {
    var sessions = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    var compare_moment = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _moment2.default.utc();
    var start_moment = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : _moment2.default.utc();
    var should_only_check_hour = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
    return !isBeforeDate(compare_moment, undefined, should_only_check_hour) && !isBeforeDate(compare_moment, start_moment, should_only_check_hour) && (!sessions.length || !!sessions.find(function (session) {
        return compare_moment.isBetween(should_only_check_hour ? session.open.clone().minute(0) : session.open, session.close, null, '[]');
    }));
};

/***/ }),
/* 260 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _language = __webpack_require__(538);

Object.keys(_language).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _language[key];
    }
  });
});

/***/ }),
/* 261 */,
/* 262 */,
/* 263 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = __webpack_require__(2);

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Loading = function Loading(_ref) {
    var theme = _ref.theme;
    return _react2.default.createElement(
        'div',
        { className: 'barspinner ' + (theme || 'dark') },
        Array.from(new Array(5)).map(function (x, inx) {
            return _react2.default.createElement('div', { key: inx, className: 'rect' + (inx + 1) });
        })
    );
};

exports.default = Loading;

/***/ }),
/* 264 */,
/* 265 */,
/* 266 */,
/* 267 */,
/* 268 */,
/* 269 */,
/* 270 */,
/* 271 */,
/* 272 */,
/* 273 */,
/* 274 */,
/* 275 */,
/* 276 */,
/* 277 */,
/* 278 */,
/* 279 */,
/* 280 */,
/* 281 */,
/* 282 */,
/* 283 */,
/* 284 */,
/* 285 */,
/* 286 */,
/* 287 */,
/* 288 */,
/* 289 */,
/* 290 */,
/* 291 */,
/* 292 */,
/* 293 */,
/* 294 */,
/* 295 */,
/* 296 */,
/* 297 */,
/* 298 */,
/* 299 */,
/* 300 */,
/* 301 */,
/* 302 */,
/* 303 */,
/* 304 */,
/* 305 */,
/* 306 */,
/* 307 */,
/* 308 */,
/* 309 */,
/* 310 */,
/* 311 */,
/* 312 */,
/* 313 */,
/* 314 */,
/* 315 */,
/* 316 */,
/* 317 */,
/* 318 */,
/* 319 */,
/* 320 */,
/* 321 */,
/* 322 */,
/* 323 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _propTypes = __webpack_require__(4);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = __webpack_require__(2);

var _react2 = _interopRequireDefault(_react);

var _reactDom = __webpack_require__(114);

var _reactRouterDom = __webpack_require__(89);

var _footer = __webpack_require__(463);

var _footer2 = _interopRequireDefault(_footer);

var _header = __webpack_require__(464);

var _header2 = _interopRequireDefault(_header);

var _Routes = __webpack_require__(128);

var _Routes2 = _interopRequireDefault(_Routes);

var _Constants = __webpack_require__(241);

var _network_monitor = __webpack_require__(513);

var _network_monitor2 = _interopRequireDefault(_network_monitor);

var _Stores = __webpack_require__(535);

var _Stores2 = _interopRequireDefault(_Stores);

var _connect = __webpack_require__(26);

var _client_base = __webpack_require__(22);

var _client_base2 = _interopRequireDefault(_client_base);

var _language = __webpack_require__(13);

var _localize = __webpack_require__(0);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// configure({ enforceActions: true }); // disabled for SmartCharts compatibility

// import { configure }              from 'mobx';
var initApp = function initApp() {
    _client_base2.default.init();

    var root_store = new _Stores2.default();

    _network_monitor2.default.init(root_store);

    root_store.modules.trade.init();

    var app = document.getElementById('binary_app');
    if (app) {
        (0, _reactDom.render)(_react2.default.createElement(BinaryApp, { root_store: root_store }), app);
    }
};

/*
 * Retrieves basename from current url
 *
 * @return {string} returns the basename of current url
 */
var getBasename = function getBasename() {
    var regex_string = '(.*(' + Object.keys((0, _language.getAll)()).join('|') + ')/app(/index\\.html)?).*';
    var basename = new RegExp(regex_string, 'ig').exec(window.location.pathname);

    if (basename && basename.length) {
        return basename[1];
    }

    return '/en/app/';
};

var BinaryApp = function BinaryApp(_ref) {
    var root_store = _ref.root_store;
    return _react2.default.createElement(
        _reactRouterDom.BrowserRouter,
        { basename: getBasename() },
        _react2.default.createElement(
            _connect.MobxProvider,
            { store: root_store },
            _react2.default.createElement(
                'div',
                null,
                _react2.default.createElement(
                    'div',
                    { id: 'header' },
                    _react2.default.createElement(_header2.default, {
                        items: [{ icon: 'trade', text: (0, _localize.localize)('Trade'), link_to: _Constants.routes.trade }, { icon: 'portfolio', text: (0, _localize.localize)('Portfolio'), link_to: _Constants.routes.portfolio }, { icon: 'statement', text: (0, _localize.localize)('Statement'), link_to: _Constants.routes.statement }]
                    })
                ),
                _react2.default.createElement(
                    'div',
                    { id: 'app_contents', className: 'app-contents' },
                    _react2.default.createElement(_Routes2.default, null)
                ),
                _react2.default.createElement(
                    'footer',
                    { id: 'footer' },
                    _react2.default.createElement(_footer2.default, null)
                )
            )
        )
    );
};

BinaryApp.propTypes = {
    root_store: _propTypes2.default.object
};

exports.default = initApp;

/***/ }),
/* 324 */,
/* 325 */,
/* 326 */,
/* 327 */,
/* 328 */,
/* 329 */,
/* 330 */,
/* 331 */,
/* 332 */,
/* 333 */,
/* 334 */,
/* 335 */,
/* 336 */,
/* 337 */,
/* 338 */,
/* 339 */,
/* 340 */,
/* 341 */,
/* 342 */,
/* 343 */,
/* 344 */,
/* 345 */,
/* 346 */,
/* 347 */,
/* 348 */,
/* 349 */,
/* 350 */,
/* 351 */,
/* 352 */,
/* 353 */,
/* 354 */,
/* 355 */,
/* 356 */,
/* 357 */,
/* 358 */,
/* 359 */,
/* 360 */,
/* 361 */,
/* 362 */,
/* 363 */,
/* 364 */,
/* 365 */,
/* 366 */,
/* 367 */,
/* 368 */,
/* 369 */,
/* 370 */,
/* 371 */,
/* 372 */,
/* 373 */,
/* 374 */,
/* 375 */,
/* 376 */,
/* 377 */,
/* 378 */,
/* 379 */,
/* 380 */,
/* 381 */,
/* 382 */,
/* 383 */,
/* 384 */,
/* 385 */,
/* 386 */,
/* 387 */,
/* 388 */,
/* 389 */,
/* 390 */,
/* 391 */,
/* 392 */,
/* 393 */,
/* 394 */,
/* 395 */,
/* 396 */,
/* 397 */,
/* 398 */,
/* 399 */,
/* 400 */,
/* 401 */,
/* 402 */,
/* 403 */,
/* 404 */,
/* 405 */,
/* 406 */,
/* 407 */,
/* 408 */,
/* 409 */,
/* 410 */,
/* 411 */,
/* 412 */,
/* 413 */,
/* 414 */,
/* 415 */,
/* 416 */,
/* 417 */,
/* 418 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _smartcharts = __webpack_require__(328);

var _mobx = __webpack_require__(41);

var _mobxReact = __webpack_require__(28);

var _propTypes = __webpack_require__(4);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = __webpack_require__(2);

var _react2 = _interopRequireDefault(_react);

var _Services = __webpack_require__(64);

var _utility = __webpack_require__(3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var subscribe = function subscribe(request_object, callback) {
    if (request_object.subscribe !== 1) return;
    _Services.WS.subscribeTicksHistory(request_object, callback);
};

var forget = function forget(match_values, callback) {
    return _Services.WS.forget('ticks_history', callback, match_values);
};

var SmartCharts = function SmartCharts(_ref) {
    var chart_barriers = _ref.chart_barriers,
        initial_symbol = _ref.initial_symbol,
        is_asset_enabled = _ref.is_asset_enabled,
        is_countdown_enabled = _ref.is_countdown_enabled,
        is_dark_theme = _ref.is_dark_theme,
        is_position_default = _ref.is_position_default,
        is_mobile = _ref.is_mobile,
        _onSymbolChange = _ref.onSymbolChange;

    var chart_layout = is_position_default ? 'left' : 'bottom';
    var chart_theme = is_dark_theme ? 'dark' : 'light';

    var chart_settings = {
        assetInformation: is_asset_enabled,
        // TO-DO - Update language to use saved / stored language
        lang: 'en',
        position: chart_layout,
        countdown: is_countdown_enabled,
        theme: chart_theme
    };
    var barriers = Object.keys(chart_barriers || {}).map(function (key) {
        return (0, _mobx.toJS)(chart_barriers[key]);
    }).filter(function (item) {
        return !(0, _utility.isEmptyObject)(item);
    });

    return _react2.default.createElement(
        _react2.default.Fragment,
        null,
        _react2.default.createElement(_smartcharts.SmartChart, {
            requestSubscribe: subscribe,
            requestForget: forget,
            requestAPI: _Services.WS.sendRequest.bind(_Services.WS),
            onSymbolChange: function onSymbolChange(symbol_obj) {
                _onSymbolChange({
                    target: {
                        name: 'symbol',
                        value: symbol_obj.symbol
                    }
                });
            },
            barriers: barriers,
            initialSymbol: initial_symbol,
            isMobile: is_mobile,
            settings: chart_settings
        })
    );
};

SmartCharts.propTypes = {
    chart_barriers: _propTypes2.default.object,
    initial_symbol: _propTypes2.default.string,
    is_asset_enabled: _propTypes2.default.bool,
    is_countdown_enabled: _propTypes2.default.bool,
    is_dark_theme: _propTypes2.default.bool,
    is_mobile: _propTypes2.default.bool,
    is_position_default: _propTypes2.default.bool,
    onSymbolChange: _propTypes2.default.func
};

exports.default = (0, _mobxReact.observer)(SmartCharts);

/***/ }),
/* 419 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _class, _temp, _initialiseProps;

var _moment = __webpack_require__(9);

var _moment2 = _interopRequireDefault(_moment);

var _propTypes = __webpack_require__(4);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = __webpack_require__(2);

var _react2 = _interopRequireDefault(_react);

var _calendar_footer = __webpack_require__(420);

var _calendar_footer2 = _interopRequireDefault(_calendar_footer);

var _calendar_header = __webpack_require__(421);

var _calendar_header2 = _interopRequireDefault(_calendar_header);

var _calendar_panel = __webpack_require__(422);

var _calendar_panel2 = _interopRequireDefault(_calendar_panel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Calendar = (_temp = _class = function (_React$PureComponent) {
    _inherits(Calendar, _React$PureComponent);

    function Calendar(props) {
        _classCallCheck(this, Calendar);

        var _this = _possibleConstructorReturn(this, (Calendar.__proto__ || Object.getPrototypeOf(Calendar)).call(this, props));

        _initialiseProps.call(_this);

        var date_format = props.date_format,
            start_date = props.start_date;

        var current_date = _moment2.default.utc(start_date).format(date_format);
        _this.state = {
            calendar_date: current_date, // calendar date reference
            selected_date: '', // selected date
            calendar_view: 'date'
        };
        return _this;
    }

    // navigates to next or previous's month/year/decade/century


    // selects a day, a month, a year, or a decade


    // sets Calendar active view


    _createClass(Calendar, [{
        key: 'render',
        value: function render() {
            var _props = this.props,
                children = _props.children,
                date_format = _props.date_format,
                footer = _props.footer,
                id = _props.id,
                max_date = _props.max_date,
                min_date = _props.min_date,
                has_today_btn = _props.has_today_btn;
            var _state = this.state,
                calendar_date = _state.calendar_date,
                calendar_view = _state.calendar_view,
                selected_date = _state.selected_date;


            return _react2.default.createElement(
                'div',
                { id: id, className: 'calendar', value: selected_date },
                children,
                _react2.default.createElement(_calendar_header2.default, {
                    calendar_date: calendar_date,
                    isPeriodDisabled: this.isPeriodDisabled,
                    onClick: this.navigators,
                    onSelect: this.calendarViews,
                    calendar_view: calendar_view
                }),
                _react2.default.createElement(_calendar_panel2.default, {
                    calendar_date: calendar_date,
                    date_format: date_format,
                    isPeriodDisabled: this.isPeriodDisabled,
                    max_date: max_date,
                    min_date: min_date,
                    onClick: this.panelSelectors,
                    selected_date: selected_date,
                    calendar_view: calendar_view
                }),
                _react2.default.createElement(_calendar_footer2.default, {
                    footer: footer,
                    onClick: this.setToday,
                    has_today_btn: has_today_btn
                })
            );
        }
    }]);

    return Calendar;
}(_react2.default.PureComponent), _initialiseProps = function _initialiseProps() {
    var _this2 = this;

    this.navigators = {
        nextMonth: function nextMonth() {
            _this2.navigateTo(1, 'months', true);
        },
        previousMonth: function previousMonth() {
            _this2.navigateTo(1, 'months', false);
        },
        nextYear: function nextYear() {
            _this2.navigateTo(1, 'years', true);
        },
        previousYear: function previousYear() {
            _this2.navigateTo(1, 'years', false);
        },
        nextDecade: function nextDecade() {
            _this2.navigateTo(10, 'years', true);
        },
        previousDecade: function previousDecade() {
            _this2.navigateTo(10, 'years', false);
        },
        nextCentury: function nextCentury() {
            _this2.navigateTo(100, 'years', true);
        },
        previousCentury: function previousCentury() {
            _this2.navigateTo(100, 'years', false);
        } };
    this.panelSelectors = {
        date: function date(e, is_disabled) {
            _this2.updateSelectedDate(e, is_disabled);
        },
        month: function month(e) {
            _this2.updateSelected(e, 'month');
        },
        year: function year(e) {
            _this2.updateSelected(e, 'year');
        },
        decade: function decade(e) {
            _this2.updateSelected(e, 'decade');
        } };
    this.calendarViews = {
        date: function date() {
            _this2.setState({ calendar_view: 'date' });
        },
        month: function month() {
            _this2.setState({ calendar_view: 'month' });
        },
        year: function year() {
            _this2.setState({ calendar_view: 'year' });
        },
        decade: function decade() {
            _this2.setState({ calendar_view: 'decade' });
        }
    };

    this.navigateTo = function (value, unit, is_add) {
        var _props2 = _this2.props,
            date_format = _props2.date_format,
            max_date = _props2.max_date,
            min_date = _props2.min_date;


        var new_date = _moment2.default.utc(_this2.state.calendar_date, date_format)[is_add ? 'add' : 'subtract'](value, unit).format(date_format);

        if (unit === 'months' && _this2.isPeriodDisabled(new_date, 'month')) return;

        if (unit === 'years' && _this2.isPeriodDisabled(new_date, 'years')) {
            new_date = is_add ? max_date : min_date;
        }

        _this2.setState({ calendar_date: _moment2.default.utc(new_date, date_format).format(date_format) }); // formatted date
    };

    this.updateSelectedDate = function (e, is_disabled) {
        if (is_disabled) {
            return;
        }

        var _props3 = _this2.props,
            date_format = _props3.date_format,
            max_date = _props3.max_date,
            min_date = _props3.min_date,
            onSelect = _props3.onSelect;


        var moment_date = _moment2.default.utc(e.target.dataset.date).set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
        var is_before = moment_date.isBefore(_moment2.default.utc(min_date));
        var is_after = moment_date.isAfter(_moment2.default.utc(max_date));

        if (is_before || is_after) {
            return;
        }

        var formatted_date = moment_date.format(date_format);
        _this2.setState({
            calendar_date: formatted_date,
            selected_date: formatted_date
        });

        if (onSelect) {
            onSelect(formatted_date);
        }
    };

    this.updateSelected = function (e, type) {
        var view_map = {
            month: 'date',
            year: 'month',
            decade: 'year'
        };
        var date = _moment2.default.utc(_this2.state.calendar_date, _this2.props.date_format)[type === 'decade' ? 'year' : type](e.target.dataset[type].split('-')[0]).format(_this2.props.date_format);

        if (_this2.isPeriodDisabled(date, type)) return;

        _this2.setState({
            calendar_date: date,
            calendar_view: view_map[type]
        });
    };

    this.resetCalendar = function () {
        var _props4 = _this2.props,
            date_format = _props4.date_format,
            start_date = _props4.start_date;


        var default_date = _moment2.default.utc(start_date).format(date_format);
        _this2.setState({
            calendar_date: default_date,
            selected_date: '',
            calendar_view: 'date'
        });
    };

    this.setToday = function () {
        var _props5 = _this2.props,
            date_format = _props5.date_format,
            onSelect = _props5.onSelect;


        var now = (0, _moment2.default)().utc().format(date_format);
        _this2.setState({
            calendar_date: now,
            selected_date: now,
            calendar_view: 'date'
        });

        if (onSelect) {
            onSelect(now, true);
        }
    };

    this.isPeriodDisabled = function (date, unit) {
        var _props6 = _this2.props,
            max_date = _props6.max_date,
            min_date = _props6.min_date;


        var start_of_period = _moment2.default.utc(date).startOf(unit);
        var end_of_period = _moment2.default.utc(date).endOf(unit);
        return end_of_period.isBefore(_moment2.default.utc(min_date)) || start_of_period.isAfter(_moment2.default.utc(max_date));
    };
}, _temp);


Calendar.defaultProps = {
    date_format: 'YYYY-MM-DD',
    min_date: (0, _moment2.default)(0).utc().format('YYYY-MM-DD'), // by default, min_date is set to Unix Epoch (January 1st 1970)
    max_date: (0, _moment2.default)().utc().add(120, 'y').format('YYYY-MM-DD') // by default, max_date is set to 120 years after today
};

Calendar.propTypes = {
    children: _propTypes2.default.object,
    date_format: _propTypes2.default.string,
    footer: _propTypes2.default.string,
    has_today_btn: _propTypes2.default.bool,
    id: _propTypes2.default.string,
    is_nativepicker: _propTypes2.default.bool,
    max_date: _propTypes2.default.oneOfType([_propTypes2.default.object, _propTypes2.default.string]),
    min_date: _propTypes2.default.oneOfType([_propTypes2.default.object, _propTypes2.default.string]),
    onSelect: _propTypes2.default.func,
    start_date: _propTypes2.default.oneOfType([_propTypes2.default.object, _propTypes2.default.string])
};

exports.default = Calendar;

/***/ }),
/* 420 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = CalendarFooter;

var _propTypes = __webpack_require__(4);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = __webpack_require__(2);

var _react2 = _interopRequireDefault(_react);

var _calendar_button = __webpack_require__(225);

var _calendar_button2 = _interopRequireDefault(_calendar_button);

var _localize = __webpack_require__(0);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function CalendarFooter(_ref) {
    var footer = _ref.footer,
        has_today_btn = _ref.has_today_btn,
        onClick = _ref.onClick;

    return _react2.default.createElement(
        'div',
        { className: 'calendar-footer' },
        footer && _react2.default.createElement(
            'span',
            { className: 'calendar-footer-extra' },
            footer
        ),
        has_today_btn && _react2.default.createElement(
            _calendar_button2.default,
            { className: 'calendar-footer-btn' },
            _react2.default.createElement(
                'a',
                { role: 'button', onClick: onClick },
                (0, _localize.localize)('Today')
            )
        )
    );
}

CalendarFooter.propTypes = {
    footer: _propTypes2.default.string,
    has_today_btn: _propTypes2.default.bool,
    onClick: _propTypes2.default.func
};

/***/ }),
/* 421 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = undefined;

var _classnames = __webpack_require__(18);

var _classnames2 = _interopRequireDefault(_classnames);

var _moment = __webpack_require__(9);

var _moment2 = _interopRequireDefault(_moment);

var _propTypes = __webpack_require__(4);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = __webpack_require__(2);

var _react2 = _interopRequireDefault(_react);

var _calendar_button = __webpack_require__(225);

var _calendar_button2 = _interopRequireDefault(_calendar_button);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function CalendarHeader(_ref) {
    var calendar_date = _ref.calendar_date,
        isPeriodDisabled = _ref.isPeriodDisabled,
        _onClick = _ref.onClick,
        onSelect = _ref.onSelect,
        calendar_view = _ref.calendar_view;

    var is_date_view = calendar_view === 'date';
    var is_month_view = calendar_view === 'month';
    var is_year_view = calendar_view === 'year';
    var is_decade_view = calendar_view === 'decade';
    var moment_date = _moment2.default.utc(calendar_date);

    return _react2.default.createElement(
        'div',
        { className: 'calendar-header' },
        _react2.default.createElement(_calendar_button2.default, {
            className: (0, _classnames2.default)('calendar-prev-year-btn', {
                hidden: isPeriodDisabled(moment_date.clone().subtract(1, 'month'), 'month')
            }),
            onClick: function onClick() {
                return (is_date_view || is_month_view) && _onClick.previousYear() || is_year_view && _onClick.previousDecade() || is_decade_view && _onClick.previousCentury();
            }
        }),
        _react2.default.createElement(_calendar_button2.default, {
            className: (0, _classnames2.default)('calendar-prev-month-btn', {
                hidden: isPeriodDisabled(moment_date.clone().subtract(1, 'month'), 'month')
            }),
            is_hidden: !is_date_view,
            onClick: _onClick.previousMonth
        }),
        _react2.default.createElement(
            'div',
            { className: 'calendar-select' },
            is_date_view && _react2.default.createElement(_calendar_button2.default, {
                className: 'calendar-select-month-btn',
                is_hidden: !is_date_view,
                label: moment_date.format('MMM'),
                onClick: onSelect.month
            }),
            _react2.default.createElement(
                _calendar_button2.default,
                {
                    className: 'calendar-select-year-btn',
                    onClick: function onClick() {
                        return is_date_view || is_month_view ? onSelect.year() : onSelect.decade();
                    }
                },
                (is_date_view || is_month_view) && moment_date.year(),
                is_year_view && moment_date.clone().subtract(1, 'years').year() + '-' + moment_date.clone().add(10, 'years').year(),
                is_decade_view && moment_date.clone().subtract(10, 'years').year() + '-' + moment_date.clone().add(109, 'years').year()
            )
        ),
        _react2.default.createElement(_calendar_button2.default, {
            className: (0, _classnames2.default)('calendar-next-month-btn', {
                hidden: isPeriodDisabled(moment_date.clone().add(1, 'month'), 'month')
            }),
            is_hidden: !is_date_view,
            onClick: _onClick.nextMonth
        }),
        _react2.default.createElement(_calendar_button2.default, {
            className: (0, _classnames2.default)('calendar-next-year-btn', {
                hidden: isPeriodDisabled(moment_date.clone().add(1, 'month'), 'month')
            }),
            onClick: function onClick() {
                return (is_date_view || is_month_view) && _onClick.nextYear() || is_year_view && _onClick.nextDecade() || is_decade_view && _onClick.nextCentury();
            }
        })
    );
}

exports.default = CalendarHeader;
CalendarHeader.propTypes = {
    calendar_date: _propTypes2.default.string,
    calendar_view: _propTypes2.default.string,
    isPeriodDisabled: _propTypes2.default.func,
    onClick: _propTypes2.default.object,
    onSelect: _propTypes2.default.object
};

/***/ }),
/* 422 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = CalendarPanel;

var _propTypes = __webpack_require__(4);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = __webpack_require__(2);

var _react2 = _interopRequireDefault(_react);

var _panels = __webpack_require__(428);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function CalendarPanel(props) {
    var calendar_panel = {
        date: _react2.default.createElement(_panels.CalendarDays, props),
        month: _react2.default.createElement(_panels.CalendarMonths, props),
        year: _react2.default.createElement(_panels.CalendarYears, props),
        decade: _react2.default.createElement(_panels.CalendarDecades, props)
    };

    return _react2.default.createElement(
        'div',
        { className: 'calendar-panel' },
        calendar_panel[props.calendar_view]
    );
}

CalendarPanel.propTypes = {
    calendar_view: _propTypes2.default.string
};

/***/ }),
/* 423 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _calendar = __webpack_require__(419);

var _calendar2 = _interopRequireDefault(_calendar);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _calendar2.default;

/***/ }),
/* 424 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.CalendarDays = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _classnames = __webpack_require__(18);

var _classnames2 = _interopRequireDefault(_classnames);

var _moment = __webpack_require__(9);

var _moment2 = _interopRequireDefault(_moment);

var _react = __webpack_require__(2);

var _react2 = _interopRequireDefault(_react);

var _types = __webpack_require__(124);

var _types2 = _interopRequireDefault(_types);

var _localize = __webpack_require__(0);

var _string_util = __webpack_require__(19);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var getDays = function getDays(_ref) {
    var calendar_date = _ref.calendar_date,
        date_format = _ref.date_format,
        max_date = _ref.max_date,
        min_date = _ref.min_date,
        _onClick = _ref.onClick,
        selected_date = _ref.selected_date;

    var dates = [];
    var days = [];
    var moment_today = (0, _moment2.default)().utc();
    var moment_cur_date = _moment2.default.utc(calendar_date);
    var num_of_days = moment_cur_date.daysInMonth() + 1;
    var moment_month_start = moment_cur_date.clone().startOf('month');
    var moment_month_end = moment_cur_date.clone().endOf('month');
    var first_day = moment_month_start.day();
    var last_day = moment_month_end.day();
    var moment_min_date = _moment2.default.utc(min_date);
    var moment_max_date = _moment2.default.utc(max_date);
    var moment_selected = _moment2.default.utc(selected_date);

    for (var i = first_day; i > 0; i--) {
        dates.push(moment_month_start.clone().subtract(i, 'day').format(date_format));
    }
    for (var idx = 1; idx < num_of_days; idx += 1) {
        dates.push(moment_cur_date.clone().format(date_format.replace('DD', (0, _string_util.padLeft)(idx, 2, '0'))));
    }
    for (var _i = 1; _i <= 6 - last_day; _i++) {
        dates.push(moment_month_end.clone().add(_i, 'day').format(date_format));
    }

    dates.map(function (date) {
        var moment_date = _moment2.default.utc(date).set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
        var is_disabled = moment_date.isBefore(moment_min_date) || moment_date.isAfter(moment_max_date);
        var is_other_month = moment_date.isBefore(moment_month_start) || moment_date.isAfter(moment_month_end);
        var is_active = selected_date && moment_date.isSame(moment_selected);
        var is_today = moment_date.isSame(moment_today, 'day');

        days.push(_react2.default.createElement(
            'span',
            {
                key: date,
                className: (0, _classnames2.default)('calendar-date', {
                    active: is_active && !is_disabled,
                    today: is_today,
                    disabled: is_disabled,
                    hidden: is_other_month
                }),
                onClick: function onClick(e) {
                    _onClick.date(e, is_disabled);
                },
                'data-date': date
            },
            moment_date.date()
        ));
    });

    return days;
};

var week_headers = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

var CalendarDays = exports.CalendarDays = function CalendarDays(props) {
    var days = getDays(props).map(function (day) {
        return day;
    });

    return _react2.default.createElement(
        'div',
        { className: 'calendar-date-panel' },
        week_headers.map(function (item, idx) {
            return _react2.default.createElement(
                'span',
                { key: idx, className: 'calendar-date-header' },
                (0, _localize.localize)(item)
            );
        }),
        days
    );
};

CalendarDays.propTypes = _extends({}, _types2.default);

/***/ }),
/* 425 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.CalendarDecades = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _classnames = __webpack_require__(18);

var _classnames2 = _interopRequireDefault(_classnames);

var _moment = __webpack_require__(9);

var _moment2 = _interopRequireDefault(_moment);

var _react = __webpack_require__(2);

var _react2 = _interopRequireDefault(_react);

var _types = __webpack_require__(124);

var _types2 = _interopRequireDefault(_types);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var CalendarDecades = exports.CalendarDecades = function CalendarDecades(_ref) {
    var calendar_date = _ref.calendar_date,
        isPeriodDisabled = _ref.isPeriodDisabled,
        onClick = _ref.onClick,
        selected_date = _ref.selected_date;

    var selected_year = _moment2.default.utc(selected_date).year();
    var moment_date = _moment2.default.utc(calendar_date);

    var decades = [];
    var min_year = moment_date.year() - 10;
    for (var i = 0; i < 12; i++) {
        var max_year = min_year + 9;
        var range = min_year + '-' + max_year;
        decades.push(range);
        min_year = max_year + 1;
    }

    return _react2.default.createElement(
        'div',
        { className: 'calendar-decade-panel' },
        decades.map(function (range, idx) {
            var _range$split = range.split('-'),
                _range$split2 = _slicedToArray(_range$split, 2),
                start_year = _range$split2[0],
                end_year = _range$split2[1];

            return _react2.default.createElement(
                'span',
                {
                    key: idx,
                    className: (0, _classnames2.default)('calendar-decade', {
                        disabled: isPeriodDisabled(moment_date.year(start_year), 'year') && isPeriodDisabled(moment_date.year(end_year), 'year'),
                        active: start_year === selected_year
                    }),
                    onClick: onClick.decade,
                    'data-decade': range
                },
                range
            );
        })
    );
};

CalendarDecades.propTypes = _extends({}, _types2.default);

/***/ }),
/* 426 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.CalendarMonths = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _classnames = __webpack_require__(18);

var _classnames2 = _interopRequireDefault(_classnames);

var _moment = __webpack_require__(9);

var _moment2 = _interopRequireDefault(_moment);

var _react = __webpack_require__(2);

var _react2 = _interopRequireDefault(_react);

var _types = __webpack_require__(124);

var _types2 = _interopRequireDefault(_types);

var _localize = __webpack_require__(0);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var month_headers = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

var CalendarMonths = exports.CalendarMonths = function CalendarMonths(_ref) {
    var calendar_date = _ref.calendar_date,
        isPeriodDisabled = _ref.isPeriodDisabled,
        onClick = _ref.onClick,
        selected_date = _ref.selected_date;

    var moment_date = _moment2.default.utc(calendar_date);
    var selected_month = _moment2.default.utc(selected_date).month();
    return _react2.default.createElement(
        'div',
        { className: 'calendar-month-panel' },
        month_headers.map(function (month, idx) {
            return _react2.default.createElement(
                'span',
                {
                    key: idx,
                    className: (0, _classnames2.default)('calendar-month', {
                        active: idx === selected_month,
                        disabled: isPeriodDisabled(moment_date.month(month), 'month')
                    }),
                    onClick: onClick.month,
                    'data-month': idx
                },
                (0, _localize.localize)(month)
            );
        })
    );
};

CalendarMonths.propTypes = _extends({}, _types2.default);

/***/ }),
/* 427 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.CalendarYears = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _classnames = __webpack_require__(18);

var _classnames2 = _interopRequireDefault(_classnames);

var _moment = __webpack_require__(9);

var _moment2 = _interopRequireDefault(_moment);

var _react = __webpack_require__(2);

var _react2 = _interopRequireDefault(_react);

var _types = __webpack_require__(124);

var _types2 = _interopRequireDefault(_types);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var CalendarYears = exports.CalendarYears = function CalendarYears(_ref) {
    var calendar_date = _ref.calendar_date,
        isPeriodDisabled = _ref.isPeriodDisabled,
        onClick = _ref.onClick,
        selected_date = _ref.selected_date;

    var selected_year = _moment2.default.utc(selected_date).year();
    var moment_date = _moment2.default.utc(calendar_date);
    var current_year = moment_date.year();
    var years = [];
    for (var year = current_year - 1; year < current_year + 11; year++) {
        years.push(year);
    }
    return _react2.default.createElement(
        'div',
        { className: 'calendar-year-panel' },
        years.map(function (year, idx) {
            return _react2.default.createElement(
                'span',
                {
                    key: idx,
                    className: (0, _classnames2.default)('calendar-year', {
                        disabled: isPeriodDisabled(moment_date.year(year), 'year'),
                        active: year === selected_year
                    }),
                    onClick: onClick.year,
                    'data-year': year
                },
                year
            );
        })
    );
};

CalendarYears.propTypes = _extends({}, _types2.default);

/***/ }),
/* 428 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _calendar_days = __webpack_require__(424);

Object.keys(_calendar_days).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _calendar_days[key];
    }
  });
});

var _calendar_months = __webpack_require__(426);

Object.keys(_calendar_months).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _calendar_months[key];
    }
  });
});

var _calendar_years = __webpack_require__(427);

Object.keys(_calendar_years).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _calendar_years[key];
    }
  });
});

var _calendar_decades = __webpack_require__(425);

Object.keys(_calendar_decades).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _calendar_decades[key];
    }
  });
});

/***/ }),
/* 429 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.DrawerItems = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _classnames = __webpack_require__(18);

var _classnames2 = _interopRequireDefault(_classnames);

var _propTypes = __webpack_require__(4);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = __webpack_require__(2);

var _react2 = _interopRequireDefault(_react);

var _drawer_item = __webpack_require__(228);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DrawerItems = function (_React$Component) {
    _inherits(DrawerItems, _React$Component);

    function DrawerItems() {
        var _ref;

        var _temp, _this, _ret;

        _classCallCheck(this, DrawerItems);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = DrawerItems.__proto__ || Object.getPrototypeOf(DrawerItems)).call.apply(_ref, [this].concat(args))), _this), _this.state = { is_collapsed: false }, _this.collapseItems = function () {
            _this.setState({
                is_collapsed: !_this.state.is_collapsed
            });
        }, _temp), _possibleConstructorReturn(_this, _ret);
    }

    _createClass(DrawerItems, [{
        key: 'render',
        value: function render() {
            var _this2 = this;

            var is_collapsed = this.state.is_collapsed;
            var _props = this.props,
                text = _props.text,
                items = _props.items;


            var list_is_collapsed = {
                visibility: is_collapsed ? 'visible' : 'hidden'
            };
            var parent_item_class = (0, _classnames2.default)('parent-item', {
                'show': is_collapsed
            });
            var drawer_items_class = (0, _classnames2.default)('drawer-items', {
                'show': is_collapsed
            });
            return _react2.default.createElement(
                _react2.default.Fragment,
                null,
                _react2.default.createElement(
                    'div',
                    { className: 'drawer-item', onClick: this.collapseItems },
                    _react2.default.createElement(
                        'span',
                        { className: parent_item_class },
                        text
                    )
                ),
                _react2.default.createElement(
                    'div',
                    {
                        className: drawer_items_class,
                        style: list_is_collapsed
                    },
                    _react2.default.createElement(
                        'div',
                        { className: 'items-group' },
                        items.map(function (item, idx) {
                            return _react2.default.createElement(_drawer_item.DrawerItem, _extends({ key: idx }, item, { collapseItems: _this2.collapseItems }));
                        })
                    )
                )
            );
        }
    }]);

    return DrawerItems;
}(_react2.default.Component);

DrawerItems.propTypes = {
    items: _propTypes2.default.array,
    text: _propTypes2.default.string
};

exports.DrawerItems = DrawerItems;

/***/ }),
/* 430 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ToggleDrawer = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _classnames = __webpack_require__(18);

var _classnames2 = _interopRequireDefault(_classnames);

var _propTypes = __webpack_require__(4);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = __webpack_require__(2);

var _react2 = _interopRequireDefault(_react);

var _drawer = __webpack_require__(226);

var _connect = __webpack_require__(26);

var _url = __webpack_require__(10);

var _url2 = _interopRequireDefault(_url);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ToggleDrawer = function (_React$Component) {
    _inherits(ToggleDrawer, _React$Component);

    function ToggleDrawer() {
        var _ref;

        var _temp, _this, _ret;

        _classCallCheck(this, ToggleDrawer);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = ToggleDrawer.__proto__ || Object.getPrototypeOf(ToggleDrawer)).call.apply(_ref, [this].concat(args))), _this), _this.showDrawer = function () {
            var alignment = _this.props.alignment;

            if (alignment === 'left') {
                _this.props.showMainDrawer();
            } else if (alignment === 'right') {
                _this.props.showNotificationsDrawer();
            }
        }, _this.closeDrawer = function () {
            _this.props.hideDrawers();
        }, _temp), _possibleConstructorReturn(_this, _ret);
    }

    _createClass(ToggleDrawer, [{
        key: 'render',
        value: function render() {
            var _props = this.props,
                icon_class = _props.icon_class,
                icon_link = _props.icon_link,
                alignment = _props.alignment,
                children = _props.children;


            var toggle_class = (0, _classnames2.default)('navbar-icons', icon_class, {
                'menu-toggle': !icon_class
            });

            return _react2.default.createElement(
                _react2.default.Fragment,
                null,
                _react2.default.createElement(
                    'div',
                    { className: toggle_class, onClick: this.showDrawer },
                    _react2.default.createElement('img', { src: icon_link || _url2.default.urlForStatic('images/app_2/header/menu.svg') })
                ),
                _react2.default.createElement(
                    _drawer.Drawer,
                    {
                        alignment: alignment,
                        closeBtn: this.closeDrawer
                    },
                    children
                )
            );
        }
    }]);

    return ToggleDrawer;
}(_react2.default.Component);

ToggleDrawer.propTypes = {
    alignment: _propTypes2.default.string,
    children: _propTypes2.default.oneOfType([_propTypes2.default.array, _propTypes2.default.object]),
    footer: _propTypes2.default.func,
    hideDrawers: _propTypes2.default.func,
    icon_class: _propTypes2.default.string,
    icon_link: _propTypes2.default.string,
    showMainDrawer: _propTypes2.default.func,
    showNotificationsDrawer: _propTypes2.default.func
};

var drawer_component = (0, _connect.connect)(function (_ref2) {
    var ui = _ref2.ui;
    return {
        showMainDrawer: ui.showMainDrawer,
        showNotificationsDrawer: ui.showNotificationsDrawer,
        hideDrawers: ui.hideDrawers
    };
})(ToggleDrawer);

exports.ToggleDrawer = drawer_component;

/***/ }),
/* 431 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _inkbar = __webpack_require__(432);

var _inkbar2 = _interopRequireDefault(_inkbar);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _inkbar2.default;

/***/ }),
/* 432 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _propTypes = __webpack_require__(4);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = __webpack_require__(2);

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var InkBar = function InkBar(_ref) {
    var left = _ref.left,
        width = _ref.width;

    var inkbar_style = {
        left: left,
        width: width
    };
    return _react2.default.createElement('span', { style: inkbar_style, className: 'inkbar' });
};

InkBar.propTypes = {
    left: _propTypes2.default.number,
    width: _propTypes2.default.number
};

exports.default = InkBar;

/***/ }),
/* 433 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _notifications = __webpack_require__(434);

Object.keys(_notifications).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _notifications[key];
    }
  });
});

/***/ }),
/* 434 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Notifications = undefined;

var _propTypes = __webpack_require__(4);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = __webpack_require__(2);

var _react2 = _interopRequireDefault(_react);

var _Drawer = __webpack_require__(125);

var _url = __webpack_require__(10);

var _url2 = _interopRequireDefault(_url);

var _localize = __webpack_require__(0);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Notifications = function Notifications(_ref) {
    var list = _ref.list;
    return _react2.default.createElement(
        _react2.default.Fragment,
        null,
        list && list.length ? list.map(function (item, idx) {
            return _react2.default.createElement(
                _react2.default.Fragment,
                { key: idx },
                _react2.default.createElement(_Drawer.DrawerItem, { text: item[idx] })
            );
        }) : _react2.default.createElement(
            'div',
            { className: 'no-notifications-container' },
            _react2.default.createElement(
                'div',
                { className: 'notification-message' },
                _react2.default.createElement(
                    'div',
                    null,
                    _react2.default.createElement('img', { src: _url2.default.urlForStatic('images/app_2/header/icons/ic_notification_light.svg') })
                ),
                _react2.default.createElement(
                    'div',
                    null,
                    _react2.default.createElement(
                        'h4',
                        null,
                        (0, _localize.localize)('No Notifications')
                    ),
                    _react2.default.createElement(
                        'span',
                        { className: 'no-notifications-message' },
                        (0, _localize.localize)('You have yet to receive any notifications')
                    )
                )
            )
        )
    );
};

Notifications.propTypes = {
    'list': _propTypes2.default.object
};

exports.Notifications = Notifications;

/***/ }),
/* 435 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _popconfirm = __webpack_require__(436);

Object.keys(_popconfirm).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _popconfirm[key];
    }
  });
});

var _popconfirm_element = __webpack_require__(229);

Object.keys(_popconfirm_element).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _popconfirm_element[key];
    }
  });
});

/***/ }),
/* 436 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.PopConfirm = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(2);

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__(4);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _popconfirm_element = __webpack_require__(229);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var PopConfirm = function (_React$Component) {
    _inherits(PopConfirm, _React$Component);

    function PopConfirm() {
        var _ref;

        var _temp, _this, _ret;

        _classCallCheck(this, PopConfirm);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = PopConfirm.__proto__ || Object.getPrototypeOf(PopConfirm)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
            is_open: false
        }, _this.setWrapperRef = function (node) {
            _this.wrapper_ref = node;
        }, _this.handleClickOutside = function (event) {
            if (_this.wrapper_ref && !_this.wrapper_ref.contains(event.target) && _this.state.is_open) {
                _this.setState({ is_open: false });
            }
        }, _this.handleClose = function () {
            _this.setState({ is_open: false });
        }, _temp), _possibleConstructorReturn(_this, _ret);
    }

    _createClass(PopConfirm, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            document.addEventListener('mousedown', this.handleClickOutside);
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            document.removeEventListener('mousedown', this.handleClickOutside);
        }
    }, {
        key: 'render',
        value: function render() {
            var _this2 = this;

            var popconfirm_element = _react2.default.createElement(_popconfirm_element.PopConfirmElement, {
                wrapperRef: this.setWrapperRef,
                alignment: this.props.alignment,
                cancel_text: this.props.cancel_text,
                confirm_text: this.props.confirm_text,
                is_visible: this.state.is_open,
                message: this.props.message,
                onConfirm: this.props.children.props.onClick,
                onClose: this.handleClose
            });
            return _react2.default.createElement(
                _react2.default.Fragment,
                null,
                _react2.default.Children.map(this.props.children, function (child) {
                    return _react2.default.cloneElement(child, {
                        onClick: function onClick() {
                            return _this2.setState({ is_open: !_this2.state.is_open });
                        }
                    }, popconfirm_element);
                })
            );
        }
    }]);

    return PopConfirm;
}(_react2.default.Component);

PopConfirm.propTypes = {
    alignment: _propTypes2.default.string,
    children: _propTypes2.default.object,
    cancel_text: _propTypes2.default.string,
    confirm_text: _propTypes2.default.string,
    message: _propTypes2.default.string
};

exports.PopConfirm = PopConfirm;

/***/ }),
/* 437 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _classnames = __webpack_require__(18);

var _classnames2 = _interopRequireDefault(_classnames);

var _react = __webpack_require__(2);

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__(4);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _arrowback = __webpack_require__(442);

var _arrowback2 = _interopRequireDefault(_arrowback);

var _localize = __webpack_require__(0);

var _index = __webpack_require__(260);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var LanguageDialog = function LanguageDialog(_ref) {
    var hide = _ref.hide,
        is_visible = _ref.is_visible,
        is_settings_on = _ref.is_settings_on;

    var language_dialog_class = (0, _classnames2.default)('language-dialog-container', {
        'show': is_visible && is_settings_on
    });
    return _react2.default.createElement(
        'div',
        { className: language_dialog_class },
        _react2.default.createElement(
            'div',
            { className: 'language-header', onClick: hide },
            _react2.default.createElement(_arrowback2.default, { className: 'arrow-back' }),
            _react2.default.createElement(
                'span',
                null,
                (0, _localize.localize)('language')
            )
        ),
        _react2.default.createElement(
            'div',
            { className: 'language-container' },
            Object.keys((0, _index.getAllowedLanguages)()).map(function (key) {
                return _react2.default.createElement(
                    _react2.default.Fragment,
                    { key: key },
                    _react2.default.createElement(
                        'div',
                        { className: 'language-row' },
                        _react2.default.createElement(
                            'a',
                            { href: (0, _index.getURL)(key) },
                            _react2.default.createElement('i', { className: 'flag ic-flag-' + key.replace(/(\s|_)/, '-').toLowerCase() }),
                            _react2.default.createElement(
                                'span',
                                null,
                                (0, _index.getAllowedLanguages)()[key]
                            )
                        )
                    )
                );
            })
        )
    );
};

LanguageDialog.propTypes = {
    is_settings_on: _propTypes2.default.bool,
    is_visible: _propTypes2.default.bool,
    hide: _propTypes2.default.func
};

exports.default = LanguageDialog;

/***/ }),
/* 438 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _classnames = __webpack_require__(18);

var _classnames2 = _interopRequireDefault(_classnames);

var _react = __webpack_require__(2);

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__(4);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _Tabs = __webpack_require__(439);

var _SettingsDialog = __webpack_require__(465);

var _localize = __webpack_require__(0);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SettingsDialog = function (_React$PureComponent) {
    _inherits(SettingsDialog, _React$PureComponent);

    function SettingsDialog() {
        var _ref;

        var _temp, _this, _ret;

        _classCallCheck(this, SettingsDialog);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = SettingsDialog.__proto__ || Object.getPrototypeOf(SettingsDialog)).call.apply(_ref, [this].concat(args))), _this), _this.setWrapperRef = function (node) {
            _this.wrapper_ref = node;
        }, _this.handleClickOutside = function (event) {
            var footer_settings_btn = !event.target.classList.contains('ic-settings', 'ic-settings active');
            if (_this.wrapper_ref && !_this.wrapper_ref.contains(event.target) && _this.props.is_open && footer_settings_btn) {
                _this.props.toggleDialog();
            }
        }, _temp), _possibleConstructorReturn(_this, _ret);
    }

    // TO-DO - Simplify this


    _createClass(SettingsDialog, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            document.addEventListener('mousedown', this.handleClickOutside);
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            document.removeEventListener('mousedown', this.handleClickOutside);
        }
    }, {
        key: 'render',
        value: function render() {
            var settings_dialog_class = (0, _classnames2.default)('settings-dialog', {
                'show': this.props.is_open
            });
            var settings_dialog_container_class = (0, _classnames2.default)('settings-dialog-container', {
                hide: this.props.is_language_dialog_visible
            });
            return _react2.default.createElement(
                'div',
                { ref: this.setWrapperRef, className: settings_dialog_class },
                _react2.default.createElement(
                    'div',
                    { className: settings_dialog_container_class },
                    _react2.default.createElement(
                        'span',
                        { className: 'settings-header' },
                        (0, _localize.localize)('Settings')
                    ),
                    _react2.default.createElement(_Tabs.Tabs, { alignment: 'center', list: SettingsDialog.settings_content })
                ),
                _react2.default.createElement(_SettingsDialog.LanguageSettings, null)
            );
        }
    }], [{
        key: 'settings_content',
        get: function get() {
            return {
                1: { header: (0, _localize.localize)('General'), content: _SettingsDialog.GeneralSettings },
                2: { header: (0, _localize.localize)('Chart'), content: _SettingsDialog.ChartSettings }
            };
        }
    }]);

    return SettingsDialog;
}(_react2.default.PureComponent);

SettingsDialog.propTypes = {
    is_language_dialog_visible: _propTypes2.default.bool,
    is_open: _propTypes2.default.bool,
    toggleDialog: _propTypes2.default.func
};

exports.default = SettingsDialog;

/***/ }),
/* 439 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _tabs = __webpack_require__(440);

Object.keys(_tabs).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _tabs[key];
    }
  });
});

var _tabs_item = __webpack_require__(231);

Object.keys(_tabs_item).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _tabs_item[key];
    }
  });
});

var _tabs_wrapper = __webpack_require__(232);

Object.keys(_tabs_wrapper).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _tabs_wrapper[key];
    }
  });
});

/***/ }),
/* 440 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Tabs = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _classnames = __webpack_require__(18);

var _classnames2 = _interopRequireDefault(_classnames);

var _react = __webpack_require__(2);

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__(4);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _tabs_wrapper = __webpack_require__(232);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Tabs = function (_React$PureComponent) {
    _inherits(Tabs, _React$PureComponent);

    function Tabs() {
        var _ref;

        var _temp, _this, _ret;

        _classCallCheck(this, Tabs);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Tabs.__proto__ || Object.getPrototypeOf(Tabs)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
            active_tab_index: '1'
        }, _this.setActiveTab = function (index) {
            _this.setState({ active_tab_index: index });
        }, _temp), _possibleConstructorReturn(_this, _ret);
    }

    _createClass(Tabs, [{
        key: 'render',
        value: function render() {
            var _this2 = this;

            var TabContents = this.props.list[this.state.active_tab_index].content;
            var tab_container_class = (0, _classnames2.default)('tab-container', this.props.alignment);
            var tab_header_class = function tab_header_class(icon_name) {
                return (0, _classnames2.default)({
                    icon: icon_name }, icon_name);
            };
            return _react2.default.createElement(
                'div',
                { className: tab_container_class },
                _react2.default.createElement(
                    _tabs_wrapper.TabsWrapper,
                    {
                        active: this.state.active_tab_index,
                        onChange: function onChange(active) {
                            return _this2.setActiveTab(active);
                        }
                    },
                    Object.keys(this.props.list).map(function (key) {
                        return _react2.default.createElement(
                            _react2.default.Fragment,
                            { key: key },
                            _react2.default.createElement(
                                'span',
                                {
                                    className: tab_header_class(_this2.props.list[key].icon),
                                    title: _this2.props.list[key].header
                                },
                                _this2.props.list[key].header
                            )
                        );
                    })
                ),
                _react2.default.createElement(TabContents, null)
            );
        }
    }]);

    return Tabs;
}(_react2.default.PureComponent);

;

Tabs.propTypes = {
    alignment: _propTypes2.default.string,
    list: _propTypes2.default.shape({
        header: _propTypes2.default.string,
        icon: _propTypes2.default.string
    })
};

exports.Tabs = Tabs;

/***/ }),
/* 441 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _classnames = __webpack_require__(18);

var _classnames2 = _interopRequireDefault(_classnames);

var _react = __webpack_require__(2);

var _react2 = _interopRequireDefault(_react);

var _reactPerfectScrollbar = __webpack_require__(310);

var _reactPerfectScrollbar2 = _interopRequireDefault(_reactPerfectScrollbar);

var _client_base = __webpack_require__(22);

var _client_base2 = _interopRequireDefault(_client_base);

var _gtm = __webpack_require__(61);

var _gtm2 = _interopRequireDefault(_gtm);

var _socket_cache = __webpack_require__(49);

var _socket_cache2 = _interopRequireDefault(_socket_cache);

var _localize = __webpack_require__(0);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var getAccountInfo = function getAccountInfo(loginid) {
    var currency = _client_base2.default.get('currency', loginid);
    var is_virtual = _client_base2.default.get('is_virtual', loginid);
    var account_type = !is_virtual && currency ? currency : _client_base2.default.getAccountTitle(loginid);
    return {
        loginid: loginid,
        is_virtual: is_virtual,
        icon: account_type.toLowerCase(), // TODO: display the icon
        title: (0, _localize.localize)('[_1] Account', [account_type])
    };
};

var makeAccountsList = function makeAccountsList() {
    return _client_base2.default.getAllLoginids().map(function (loginid) {
        return loginid !== _client_base2.default.get('loginid') && !_client_base2.default.get('is_disabled', loginid) && _client_base2.default.get('token', loginid) ? getAccountInfo(loginid) : undefined;
    }).filter(function (account) {
        return account;
    });
};

var AccountSwitcher = function (_React$Component) {
    _inherits(AccountSwitcher, _React$Component);

    function AccountSwitcher(props) {
        _classCallCheck(this, AccountSwitcher);

        var _this = _possibleConstructorReturn(this, (AccountSwitcher.__proto__ || Object.getPrototypeOf(AccountSwitcher)).call(this, props));

        _this.toggleAccountsList = function () {
            if (_this.state.accounts_list) {
                _this.setState({
                    is_collapsed: !_this.state.is_collapsed
                });
            }
        };

        _this.switchAccount = function (loginid) {
            if (!loginid || !_client_base2.default.get('token', loginid)) {
                return;
            }

            sessionStorage.setItem('active_tab', '1');
            // set local storage
            _gtm2.default.setLoginFlag();
            _client_base2.default.set('cashier_confirmed', 0);
            _client_base2.default.set('accepted_bch', 0);
            _client_base2.default.set('loginid', loginid);
            _socket_cache2.default.clear();
            window.location.reload();
        };

        _this.state = {
            is_collapsed: false,
            active_account: getAccountInfo(_client_base2.default.get('loginid')),
            accounts_list: makeAccountsList()
        };
        return _this;
    }

    _createClass(AccountSwitcher, [{
        key: 'render',
        value: function render() {
            var _this2 = this;

            if (!_client_base2.default.isLoggedIn()) return false;

            var account_list_collapsed = {
                visibility: '' + (this.state.is_collapsed ? 'visible' : 'hidden')
            };

            var switcher_active_login_class = (0, _classnames2.default)('acc-switcher-active-login', this.state.active_account.icon, {
                'collapsed': this.state.is_collapsed
            });

            var switcher_list_class = (0, _classnames2.default)('acc-switcher-list', {
                'collapsed': this.state.is_collapsed
            });

            return _react2.default.createElement(
                'div',
                { className: 'acc-switcher-container' },
                _react2.default.createElement(
                    'div',
                    { className: 'acc-switcher-header', onClick: this.toggleAccountsList },
                    _react2.default.createElement(
                        'div',
                        { className: switcher_active_login_class },
                        _react2.default.createElement(
                            'p',
                            { className: 'acc-switcher-accountid' },
                            this.state.active_account.loginid
                        ),
                        _react2.default.createElement(
                            'p',
                            { className: 'acc-switcher-currency' },
                            this.state.active_account.title
                        )
                    )
                ),
                _react2.default.createElement(
                    'div',
                    {
                        className: switcher_list_class,
                        style: account_list_collapsed
                    },
                    _react2.default.createElement(
                        _reactPerfectScrollbar2.default,
                        null,
                        _react2.default.createElement(
                            'div',
                            { className: 'acc-switcher-items' },
                            this.state.accounts_list.map(function (account) {
                                return _react2.default.createElement(
                                    _react2.default.Fragment,
                                    { key: account.loginid },
                                    _react2.default.createElement(
                                        'div',
                                        {
                                            className: (0, _classnames2.default)('acc-switcher-account', account.icon),
                                            onClick: _this2.switchAccount.bind(null, account.loginid)
                                        },
                                        _react2.default.createElement(
                                            'p',
                                            { className: 'acc-switcher-accountid' },
                                            account.loginid
                                        ),
                                        _react2.default.createElement(
                                            'p',
                                            { className: 'acc-switcher-currency' },
                                            account.title
                                        )
                                    )
                                );
                            })
                        )
                    )
                )
            );
        }
    }]);

    return AccountSwitcher;
}(_react2.default.Component);

exports.default = AccountSwitcher;

/***/ }),
/* 442 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _propTypes = __webpack_require__(4);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = __webpack_require__(2);

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Arrowback = function Arrowback(_ref) {
    var className = _ref.className;
    return _react2.default.createElement(
        'svg',
        { className: className, xmlns: 'http://www.w3.org/2000/svg', width: '16', height: '16', viewBox: '0 0 16 16' },
        _react2.default.createElement('path', { fill: '#333', fillRule: 'nonzero', d: 'M3.6 8.5L7 12.2a.5.5 0 1 1-.8.6l-4-4.5a.5.5 0 0 1 0-.6l4-4.5a.5.5 0 0 1 .8.6L3.6 7.5h9.9a.5.5 0 1 1 0 1H3.6z' })
    );
};

Arrowback.propTypes = {
    className: _propTypes2.default.string
};

exports.default = Arrowback;

/***/ }),
/* 443 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _propTypes = __webpack_require__(4);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = __webpack_require__(2);

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Arrowhead = function Arrowhead(_ref) {
    var className = _ref.className;
    return _react2.default.createElement(
        'svg',
        { className: className, width: '16', height: '16', xmlns: 'http://www.w3.org/2000/svg' },
        _react2.default.createElement('path', { className: 'arrow-path', d: 'M13.164 5.13a.5.5 0 1 1 .672.74l-5.5 5a.5.5 0 0 1-.672 0l-5.5-5a.5.5 0 0 1 .672-.74L8 9.824l5.164-4.694z', fill: '#D2D3DA', fillRule: 'nonzero' })
    );
};

Arrowhead.propTypes = {
    className: _propTypes2.default.string
};

exports.default = Arrowhead;

/***/ }),
/* 444 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.MenuDrawer = undefined;

var _react = __webpack_require__(2);

var _react2 = _interopRequireDefault(_react);

var _reactPerfectScrollbar = __webpack_require__(310);

var _reactPerfectScrollbar2 = _interopRequireDefault(_reactPerfectScrollbar);

var _Drawer = __webpack_require__(125);

var _Services = __webpack_require__(64);

var _client_base = __webpack_require__(22);

var _client_base2 = _interopRequireDefault(_client_base);

var _localize = __webpack_require__(0);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var MenuDrawer = exports.MenuDrawer = function MenuDrawer() {
    var is_desktop = window.innerWidth > 979;
    return _react2.default.createElement(
        'div',
        { className: 'drawer-items-container' },
        _react2.default.createElement(
            _reactPerfectScrollbar2.default,
            null,
            _react2.default.createElement(
                'div',
                { className: 'list-items-container' },
                _react2.default.createElement(_Drawer.DrawerItem, { text: (0, _localize.localize)('Manage Password') }),
                _react2.default.createElement(_Drawer.DrawerItem, { text: (0, _localize.localize)('Useful Resources') }),
                _react2.default.createElement(_Drawer.DrawerItem, { text: (0, _localize.localize)('Login History') }),
                _react2.default.createElement('hr', null),
                _react2.default.createElement(_Drawer.DrawerItem, { text: (0, _localize.localize)('Settings'), link_to: '/settings' }),
                !is_desktop && _react2.default.createElement(
                    _react2.default.Fragment,
                    null,
                    _react2.default.createElement(_Drawer.DrawerItem, { text: (0, _localize.localize)('Purchase Confirmation') }),
                    _react2.default.createElement(_Drawer.DrawerItem, { text: (0, _localize.localize)('Purchase Lock') }),
                    _react2.default.createElement(_Drawer.DrawerItem, { text: (0, _localize.localize)('Dark Theme') })
                ),
                _react2.default.createElement('hr', null),
                _react2.default.createElement(_Drawer.DrawerItem, { text: (0, _localize.localize)('Contact Us') }),
                _client_base2.default.isLoggedIn() && _react2.default.createElement(_Drawer.DrawerItem, { text: (0, _localize.localize)('Logout'), custom_action: _Services.requestLogout })
            )
        )
    );
};

/***/ }),
/* 445 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _propTypes = __webpack_require__(4);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = __webpack_require__(2);

var _react2 = _interopRequireDefault(_react);

var _currency_base = __webpack_require__(33);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Money = function Money(_ref) {
    var amount = _ref.amount,
        currency = _ref.currency,
        _ref$is_formatted = _ref.is_formatted,
        is_formatted = _ref$is_formatted === undefined ? true : _ref$is_formatted;
    return _react2.default.createElement(
        _react2.default.Fragment,
        null,
        _react2.default.createElement('span', { className: 'symbols ' + (currency || 'USD').toLowerCase() }),
        is_formatted ? (0, _currency_base.formatMoney)(currency, amount, true) : amount
    );
};

Money.propTypes = {
    amount: _propTypes2.default.oneOfType([_propTypes2.default.number, _propTypes2.default.string]),
    currency: _propTypes2.default.string,
    is_formatted: _propTypes2.default.bool
};

exports.default = Money;

/***/ }),
/* 446 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _moment = __webpack_require__(9);

var _moment2 = _interopRequireDefault(_moment);

var _propTypes = __webpack_require__(4);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = __webpack_require__(2);

var _react2 = _interopRequireDefault(_react);

var _connect = __webpack_require__(26);

var _localize = __webpack_require__(0);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } // import { PropTypes as MobxPropTypes } from 'mobx-react';


var PortfolioDrawer = function (_React$Component) {
    _inherits(PortfolioDrawer, _React$Component);

    function PortfolioDrawer() {
        var _ref;

        var _temp, _this, _ret;

        _classCallCheck(this, PortfolioDrawer);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = PortfolioDrawer.__proto__ || Object.getPrototypeOf(PortfolioDrawer)).call.apply(_ref, [this].concat(args))), _this), _this.state = { is_open: true, width: window.innerWidth }, _this.portfolios = [{
            transaction_id: 32355620467,
            contract_id: 478981052055,
            payout: 10,
            expiry_time: 1522886399,
            longcode: 'Win payout if AUD/JPY is strictly higher than entry spot at close on 2018-04-04.',
            shortcode: 'CALL_FRXAUDJPY_10_1520263325_1522886399_S0P_0',
            currency: 'USD',
            buy_price: 1.06,
            app_id: 1,
            symbol: 'AUD/JPY'
        }, {
            transaction_id: 47272620508,
            contract_id: 432523746528,
            payout: 10,
            expiry_time: 15234686345,
            longcode: 'Win payout if AUD/JPY is strictly higher than entry spot at close on 2018-05-04.',
            shortcode: 'CALL_FRXAUDJPY_10_1520263325_1522886399_S0P_0',
            currency: 'USD',
            buy_price: -55.25,
            app_id: 1,
            symbol: 'Australian Index'
        }], _this.handleVisibility = function () {
            _this.setState({ is_open: !_this.state.is_open });
        }, _this.handleWindowSizeChange = function () {
            _this.setState({ width: window.innerWidth });
        }, _this.getIndicative = function (v) {
            var sign = v > 0 ? '+' : '-';
            return {
                value: v,
                display: sign + '$S' + Math.abs(v)
            };
        }, _this.getRemainingTime = function (epoch) {
            var time_left = parseInt(_moment2.default.unix(epoch) - _this.props.server_time.unix());
            return time_left;
        }, _temp), _possibleConstructorReturn(_this, _ret);
    }

    _createClass(PortfolioDrawer, [{
        key: 'componentWillMount',
        value: function componentWillMount() {
            window.addEventListener('resize', this.handleWindowSizeChange);
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            window.removeEventListener('resize', this.handleWindowSizeChange);
        }

        // TODO: returning correct indicative price & currency


        // TODO: calculate remaining time and render

    }, {
        key: 'render',
        value: function render() {
            var _this2 = this;

            var _state = this.state,
                width = _state.width,
                is_open = _state.is_open;

            var is_mobile = width <= 1024;
            var header = is_mobile ? _react2.default.createElement(
                'div',
                {
                    className: 'portfolio-drawer-header',
                    onClick: this.handleVisibility
                },
                _react2.default.createElement('span', { className: 'ic-portfolio' }),
                _react2.default.createElement(
                    'p',
                    null,
                    (0, _localize.localize)('Portfolio')
                ),
                _react2.default.createElement('span', { className: 'ic-close ' + (is_open ? 'open' : '') })
            ) : _react2.default.createElement(
                'div',
                { className: 'portfolio-drawer-header' },
                _react2.default.createElement('span', { className: 'ic-portfolio' }),
                _react2.default.createElement(
                    'p',
                    null,
                    (0, _localize.localize)('Portfolio Quick Menu')
                ),
                _react2.default.createElement('a', {
                    href: 'javascript:;',
                    className: 'ic-close',
                    onClick: this.props.onClick
                })
            );

            return _react2.default.createElement(
                'div',
                { className: 'offset-container' },
                _react2.default.createElement(
                    'div',
                    { className: 'portfolio-drawer' },
                    header,
                    _react2.default.createElement(
                        'div',
                        { className: 'portfolio-list ' + (is_open ? 'show' : '') },
                        this.portfolios.map(function (portfolio, idx) {
                            return _react2.default.createElement(
                                'div',
                                { key: idx, className: 'portfolio' },
                                _react2.default.createElement('span', { className: 'ic-portfolio' }),
                                _react2.default.createElement(
                                    'div',
                                    { className: 'asset' },
                                    _react2.default.createElement(
                                        'span',
                                        { className: 'symbol' },
                                        portfolio.symbol
                                    ),
                                    _react2.default.createElement(
                                        'span',
                                        { className: 'indicative-' + (_this2.getIndicative(portfolio.buy_price).value > 0 ? 'positive' : 'negative') },
                                        _this2.getIndicative(portfolio.buy_price).display
                                    ),
                                    _react2.default.createElement(
                                        'span',
                                        { className: 'remaining-time' },
                                        (0, _moment2.default)(_this2.getRemainingTime(portfolio.expiry_time)).format(is_mobile ? 'HH:mm' : 'HH:mm:ss')
                                    )
                                )
                            );
                        })
                    )
                )
            );
        }
    }]);

    return PortfolioDrawer;
}(_react2.default.Component);

PortfolioDrawer.propTypes = {
    alignment: _propTypes2.default.string,
    children: _propTypes2.default.object,
    onClick: _propTypes2.default.func,
    // portfolios : MobxPropTypes.arrayOrObservableArray,
    server_time: _propTypes2.default.object,
    subtitle: _propTypes2.default.number
};

exports.default = (0, _connect.connect)(function (_ref2) {
    var common = _ref2.common,
        ui = _ref2.ui;
    return {
        server_time: common.server_time,
        onClick: ui.togglePortfolioDrawer
    };
})(PortfolioDrawer);

/***/ }),
/* 447 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _classnames = __webpack_require__(18);

var _classnames2 = _interopRequireDefault(_classnames);

var _react = __webpack_require__(2);

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__(4);

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ToggleButton = function ToggleButton(_ref) {
    var style = _ref.style,
        toggled = _ref.toggled;

    var toggle_style = style || 'toggle-button';
    var icon_class = (0, _classnames2.default)(toggle_style, {
        'toggled': toggled
    });
    return _react2.default.createElement('div', { className: icon_class });
};

ToggleButton.propTypes = {
    style: _propTypes2.default.string,
    toggled: _propTypes2.default.bool
};

exports.default = ToggleButton;

/***/ }),
/* 448 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _classnames = __webpack_require__(18);

var _classnames2 = _interopRequireDefault(_classnames);

var _moment = __webpack_require__(9);

var _moment2 = _interopRequireDefault(_moment);

var _react = __webpack_require__(2);

var _react2 = _interopRequireDefault(_react);

var _date_picker_input = __webpack_require__(449);

var _date_picker_input2 = _interopRequireDefault(_date_picker_input);

var _arrowhead = __webpack_require__(443);

var _arrowhead2 = _interopRequireDefault(_arrowhead);

var _Calendar = __webpack_require__(423);

var _Calendar2 = _interopRequireDefault(_Calendar);

var _Date = __webpack_require__(107);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DatePicker = function (_React$PureComponent) {
    _inherits(DatePicker, _React$PureComponent);

    function DatePicker() {
        var _ref;

        var _temp, _this, _ret;

        _classCallCheck(this, DatePicker);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = DatePicker.__proto__ || Object.getPrototypeOf(DatePicker)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
            value: '',
            is_datepicker_visible: false,
            is_close_btn_visible: false
        }, _this.handleVisibility = function () {
            _this.setState({ is_datepicker_visible: !_this.state.is_datepicker_visible });
        }, _this.onClickOutside = function (e) {
            if (!_this.mainNode.contains(e.target) && _this.state.is_datepicker_visible) {
                _this.setState({ is_datepicker_visible: false });
                if (_this.props.mode !== 'duration') {
                    _this.updateDatePickerValue((0, _Date.formatDate)(_this.state.value));
                }
            }
        }, _this.onMouseEnter = function () {
            if (_this.state.value && (!('is_clearable' in _this.props) || _this.props.is_clearable)) {
                _this.setState({ is_close_btn_visible: true });
            }
        }, _this.onMouseLeave = function () {
            _this.setState({ is_close_btn_visible: false });
        }, _this.onSelectCalendar = function (selected_date, is_datepicker_visible) {
            var value = selected_date;
            if (!_moment2.default.utc(value).isValid) {
                value = '';
            }

            if (_this.props.mode === 'duration') {
                _this.updateDatePickerValue((0, _Date.daysFromTodayTo)(value), 'duration');
            } else {
                _this.updateDatePickerValue(value);
            }
            _this.setState({ is_datepicker_visible: is_datepicker_visible });
        }, _this.onChangeInput = function (e) {
            var value = e.target.value;
            _this.updateDatePickerValue(value, _this.props.mode);
        }, _this.clearDatePickerInput = function () {
            _this.setState({ value: '' }, _this.updateStore);
            _this.calendar.resetCalendar();
        }, _this.updateDatePickerValue = function (value, mode) {
            _this.setState({ value: value }, _this.updateStore);

            // update Calendar
            var _this$props = _this.props,
                date_format = _this$props.date_format,
                start_date = _this$props.start_date;

            var new_date = mode === 'duration' ? _moment2.default.utc().add(value, 'days').format(date_format) : value;
            if (_moment2.default.utc(new_date, date_format).isValid() || !new_date) {
                if (!new_date) {
                    var current_date = _moment2.default.utc(start_date).format(date_format);
                    _this.calendar.setState({
                        calendar_date: current_date,
                        selected_date: current_date
                    });
                } else {
                    _this.calendar.setState({
                        calendar_date: (0, _Date.formatDate)(new_date),
                        selected_date: (0, _Date.formatDate)(new_date)
                    });
                }
            }
        }, _this.updateStore = function () {
            var _this$props2 = _this.props,
                name = _this$props2.name,
                onChange = _this$props2.onChange;

            if (onChange) {
                onChange({ target: { name: name, value: _this.state.value } });
            }
        }, _temp), _possibleConstructorReturn(_this, _ret);
    }

    _createClass(DatePicker, [{
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps(_ref2) {
            var value = _ref2.value,
                mode = _ref2.mode;

            if (value === this.state.value) return;
            this.updateDatePickerValue(value, mode);
        }
    }, {
        key: 'componentWillMount',
        value: function componentWillMount() {
            document.addEventListener('click', this.onClickOutside, true);
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            document.removeEventListener('click', this.onClickOutside, true);
        }

        // TODO: handle cases where user inputs date before min_date and date after max_date


        // update MobX store

    }, {
        key: 'render',
        value: function render() {
            var _this2 = this;

            if (this.props.is_nativepicker) {
                return _react2.default.createElement(
                    'div',
                    { ref: function ref(node) {
                            _this2.mainNode = node;
                        }, className: 'datepicker-container' },
                    _react2.default.createElement('input', {
                        id: this.props.name,
                        name: this.props.name,
                        className: 'datepicker-display',
                        type: 'date',
                        value: this.state.value,
                        min: this.props.min_date,
                        max: this.props.max_date,
                        onChange: function onChange(e) {
                            // fix for ios issue: clear button doesn't work
                            // https://github.com/facebook/react/issues/8938
                            var target = e.nativeEvent.target;
                            function iosClearDefault() {
                                target.defaultValue = '';
                            }
                            window.setTimeout(iosClearDefault, 0);

                            _this2.onSelectCalendar(e.target.value);
                        }
                    }),
                    _react2.default.createElement(
                        'label',
                        { className: 'datepicker-native-overlay', htmlFor: this.props.name },
                        this.state.value || this.props.placeholder,
                        _react2.default.createElement(_arrowhead2.default, { className: 'datepicker-native-overlay__arrowhead' })
                    )
                );
            }

            return _react2.default.createElement(
                'div',
                { ref: function ref(node) {
                        _this2.mainNode = node;
                    }, className: 'datepicker-container' },
                _react2.default.createElement(
                    'div',
                    {
                        className: 'datepicker-display-wrapper',
                        onMouseEnter: this.onMouseEnter,
                        onMouseLeave: this.onMouseLeave
                    },
                    _react2.default.createElement(_date_picker_input2.default, {
                        class_name: 'datepicker-display',
                        mode: this.props.mode,
                        name: this.props.name,
                        placeholder: this.props.placeholder,
                        onClick: this.handleVisibility,
                        is_read_only: true,
                        value: this.state.value
                    }),
                    _react2.default.createElement('span', {
                        className: (0, _classnames2.default)('picker-calendar-icon', {
                            show: !this.state.is_close_btn_visible
                        }),
                        onClick: this.handleVisibility
                    }),
                    _react2.default.createElement('span', {
                        className: (0, _classnames2.default)('close-circle-icon', {
                            show: this.state.is_close_btn_visible
                        }),
                        onClick: this.clearDatePickerInput
                    })
                ),
                _react2.default.createElement(
                    'div',
                    {
                        className: (0, _classnames2.default)('datepicker-calendar', {
                            show: this.state.is_datepicker_visible
                        })
                    },
                    _react2.default.createElement(
                        _Calendar2.default,
                        _extends({
                            ref: function ref(node) {
                                _this2.calendar = node;
                            },
                            onSelect: this.onSelectCalendar
                        }, this.props),
                        _react2.default.createElement(_date_picker_input2.default, {
                            class_name: 'calendar-input',
                            mode: this.props.mode,
                            name: this.props.name,
                            onChange: this.onChangeInput,
                            placeholder: this.props.placeholder,
                            is_read_only: 'is_read_only' in this.props ? this.props.is_read_only : false,
                            value: this.state.value
                        })
                    )
                )
            );
        }
    }]);

    return DatePicker;
}(_react2.default.PureComponent);

DatePicker.defaultProps = {
    date_format: _Calendar2.default.defaultProps.date_format,
    mode: 'date'
};

DatePicker.propTypes = _extends({}, _date_picker_input2.default.propTypes, _Calendar2.default.propTypes);

exports.default = DatePicker;

/***/ }),
/* 449 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = DatePickerInput;

var _propTypes = __webpack_require__(4);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = __webpack_require__(2);

var _react2 = _interopRequireDefault(_react);

var _localize = __webpack_require__(0);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function DatePickerInput(props) {
    return _react2.default.createElement('input', {
        id: props.id,
        name: props.name,
        className: props.class_name,
        readOnly: props.is_read_only,
        placeholder: props.placeholder || (props.mode === 'duration' ? (0, _localize.localize)('Select a duration') : (0, _localize.localize)('Select date')),
        onChange: props.onChange,
        onClick: props.onClick,
        value: props.value
    });
};

DatePickerInput.propTypes = {
    class_name: _propTypes2.default.string,
    id: _propTypes2.default.string,
    is_read_only: _propTypes2.default.bool,
    mode: _propTypes2.default.string,
    name: _propTypes2.default.string,
    onChange: _propTypes2.default.func,
    onClick: _propTypes2.default.func,
    placeholder: _propTypes2.default.string,
    is_clearable: _propTypes2.default.bool,
    value: _propTypes2.default.oneOfType([_propTypes2.default.number, // duration
    _propTypes2.default.string] // date
    )
};

/***/ }),
/* 450 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _toggle_fullscreen = __webpack_require__(451);

Object.keys(_toggle_fullscreen).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _toggle_fullscreen[key];
    }
  });
});

var _toggle_portfolio = __webpack_require__(452);

Object.keys(_toggle_portfolio).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _toggle_portfolio[key];
    }
  });
});

var _toggle_settings = __webpack_require__(453);

Object.keys(_toggle_settings).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _toggle_settings[key];
    }
  });
});

/***/ }),
/* 451 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ToggleFullScreen = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _classnames = __webpack_require__(18);

var _classnames2 = _interopRequireDefault(_classnames);

var _react = __webpack_require__(2);

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ToggleFullScreen = function (_React$Component) {
    _inherits(ToggleFullScreen, _React$Component);

    function ToggleFullScreen(props) {
        _classCallCheck(this, ToggleFullScreen);

        var _this = _possibleConstructorReturn(this, (ToggleFullScreen.__proto__ || Object.getPrototypeOf(ToggleFullScreen)).call(this, props));

        _this.onFullScreen = function () {
            var is_full_screen = _this.fullscreen_map.element.some(function (el) {
                return document[el];
            });
            _this.setState({ is_full_screen: is_full_screen });
        };

        _this.toggleFullScreen = function (e) {
            e.stopPropagation();

            var to_exit = _this.state.is_full_screen;
            var el = to_exit ? document : document.documentElement;
            var fncToCall = _this.fullscreen_map[to_exit ? 'fnc_exit' : 'fnc_enter'].find(function (fnc) {
                return el[fnc];
            });

            if (fncToCall) {
                el[fncToCall]();
            } else {
                _this.setState({ is_full_screen: false }); // fullscreen API is not enabled
            }
        };

        _this.state = {
            is_full_screen: false
        };
        _this.fullscreen_map = {
            event: ['fullscreenchange', 'webkitfullscreenchange', 'mozfullscreenchange', 'MSFullscreenChange'],
            element: ['fullscreenElement', 'webkitFullscreenElement', 'mozFullScreenElement', 'msFullscreenElement'],
            fnc_enter: ['requestFullscreen', 'webkitRequestFullscreen', 'mozRequestFullScreen', 'msRequestFullscreen'],
            fnc_exit: ['exitFullscreen', 'webkitExitFullscreen', 'mozCancelFullScreen', 'msExitFullscreen']
        };

        return _this;
    }

    _createClass(ToggleFullScreen, [{
        key: 'componentWillMount',
        value: function componentWillMount() {
            var _this2 = this;

            this.fullscreen_map.event.forEach(function (event) {
                document.addEventListener(event, _this2.onFullScreen, false);
            });
        }
    }, {
        key: 'render',
        value: function render() {
            var full_screen_icon_class = (0, _classnames2.default)('ic-fullscreen', {
                'active': this.state.is_full_screen
            });
            return _react2.default.createElement('a', {
                href: 'javascript:;',
                className: full_screen_icon_class,
                onClick: this.toggleFullScreen
            });
        }
    }]);

    return ToggleFullScreen;
}(_react2.default.Component);

exports.ToggleFullScreen = ToggleFullScreen;

/***/ }),
/* 452 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.TogglePortfolio = undefined;

var _classnames = __webpack_require__(18);

var _classnames2 = _interopRequireDefault(_classnames);

var _propTypes = __webpack_require__(4);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = __webpack_require__(2);

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var TogglePortfolio = function TogglePortfolio(_ref) {
    var is_portfolio_drawer_on = _ref.is_portfolio_drawer_on,
        togglePortfolioDrawer = _ref.togglePortfolioDrawer;

    var toggle_portolio_class = (0, _classnames2.default)('ic-portfolio', {
        'active': is_portfolio_drawer_on
    });
    return _react2.default.createElement('a', {
        href: 'javascript:;',
        className: toggle_portolio_class,
        onClick: togglePortfolioDrawer
    });
};

TogglePortfolio.propTypes = {
    is_portfolio_drawer_on: _propTypes2.default.bool,
    togglePortfolioDrawer: _propTypes2.default.func
};

exports.TogglePortfolio = TogglePortfolio;

/***/ }),
/* 453 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ToggleSettings = undefined;

var _classnames = __webpack_require__(18);

var _classnames2 = _interopRequireDefault(_classnames);

var _propTypes = __webpack_require__(4);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = __webpack_require__(2);

var _react2 = _interopRequireDefault(_react);

var _settings_dialog = __webpack_require__(438);

var _settings_dialog2 = _interopRequireDefault(_settings_dialog);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ToggleSettings = function ToggleSettings(_ref) {
    var is_language_visible = _ref.is_language_visible,
        is_settings_visible = _ref.is_settings_visible,
        toggleSettings = _ref.toggleSettings;

    var toggle_settings_class = (0, _classnames2.default)('ic-settings', {
        'active': is_settings_visible
    });
    return _react2.default.createElement(
        _react2.default.Fragment,
        null,
        _react2.default.createElement('a', {
            href: 'javascript:;',
            className: toggle_settings_class,
            onClick: toggleSettings
        }),
        _react2.default.createElement(_settings_dialog2.default, {
            is_open: is_settings_visible,
            is_language_dialog_visible: is_language_visible,
            toggleDialog: toggleSettings
        })
    );
};

ToggleSettings.propTypes = {
    is_language_visible: _propTypes2.default.bool,
    is_settings_visible: _propTypes2.default.bool,
    toggleSettings: _propTypes2.default.func
};

exports.ToggleSettings = ToggleSettings;

/***/ }),
/* 454 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.AccountInfo = undefined;

var _propTypes = __webpack_require__(4);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = __webpack_require__(2);

var _react2 = _interopRequireDefault(_react);

var _localize = __webpack_require__(0);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var AccountInfo = function AccountInfo(_ref) {
    var balance = _ref.balance,
        currency = _ref.currency,
        loginid = _ref.loginid;
    return _react2.default.createElement(
        'div',
        { className: 'acc-balance' },
        _react2.default.createElement(
            'div',
            { className: 'acc-info' },
            _react2.default.createElement(
                'p',
                { className: 'acc-balance-currency' },
                (currency || '').toUpperCase() + ' ' + (0, _localize.localize)('Account')
            ),
            _react2.default.createElement(
                'p',
                { className: 'acc-balance-accountid' },
                loginid
            )
        ),
        typeof balance !== 'undefined' && _react2.default.createElement(
            'p',
            { className: 'acc-balance-amount' },
            _react2.default.createElement(
                'i',
                null,
                _react2.default.createElement('span', { className: 'symbols ' + (currency || '').toLowerCase() })
            ),
            balance
        )
    );
};

AccountInfo.propTypes = {
    balance: _propTypes2.default.string,
    currency: _propTypes2.default.string,
    loginid: _propTypes2.default.string
};

exports.AccountInfo = AccountInfo;

/***/ }),
/* 455 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _account_info = __webpack_require__(454);

Object.keys(_account_info).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _account_info[key];
    }
  });
});

var _login_button = __webpack_require__(456);

Object.keys(_login_button).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _login_button[key];
    }
  });
});

var _menu_links = __webpack_require__(457);

Object.keys(_menu_links).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _menu_links[key];
    }
  });
});

var _toggle_menu_drawer = __webpack_require__(458);

Object.keys(_toggle_menu_drawer).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _toggle_menu_drawer[key];
    }
  });
});

var _toggle_notifications_drawer = __webpack_require__(459);

Object.keys(_toggle_notifications_drawer).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _toggle_notifications_drawer[key];
    }
  });
});

var _upgrade_button = __webpack_require__(460);

Object.keys(_upgrade_button).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _upgrade_button[key];
    }
  });
});

/***/ }),
/* 456 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.LoginButton = undefined;

var _react = __webpack_require__(2);

var _react2 = _interopRequireDefault(_react);

var _button = __webpack_require__(126);

var _button2 = _interopRequireDefault(_button);

var _localize = __webpack_require__(0);

var _login = __webpack_require__(34);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var LoginButton = function LoginButton() {
    return _react2.default.createElement(_button2.default, {
        className: 'primary orange',
        has_effect: true,
        text: (0, _localize.localize)('Log in'),
        onClick: _login.redirectToLogin
    });
};

exports.LoginButton = LoginButton;

/***/ }),
/* 457 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.MenuLinks = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _propTypes = __webpack_require__(4);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = __webpack_require__(2);

var _react2 = _interopRequireDefault(_react);

var _InkBar = __webpack_require__(431);

var _InkBar2 = _interopRequireDefault(_InkBar);

var _Routes = __webpack_require__(128);

var _url = __webpack_require__(10);

var _url2 = _interopRequireDefault(_url);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MenuLinks = function (_React$PureComponent) {
    _inherits(MenuLinks, _React$PureComponent);

    function MenuLinks() {
        var _ref;

        var _temp, _this, _ret;

        _classCallCheck(this, MenuLinks);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = MenuLinks.__proto__ || Object.getPrototypeOf(MenuLinks)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
            width: 0,
            left: 0
        }, _this.onClick = function (e) {
            if (!e.target) return;
            _this.updateInkbarPosition(e.target.closest('a'));
        }, _this.updateInkbarPosition = function (el) {
            if (!el) return;

            var _el$getBoundingClient = el.getBoundingClientRect(),
                left = _el$getBoundingClient.left,
                width = _el$getBoundingClient.width;

            _this.setState({ left: left, width: width });
        }, _temp), _possibleConstructorReturn(_this, _ret);
    }

    _createClass(MenuLinks, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            if (!this.node) return;
            this.updateInkbarPosition(this.node.querySelector('a[aria-current="true"]'));
        }
    }, {
        key: 'render',
        value: function render() {
            var _this2 = this;

            var items = this.props.items;

            return _react2.default.createElement(
                _react2.default.Fragment,
                null,
                _react2.default.createElement(
                    'div',
                    { className: 'navbar-icons binary-logo' },
                    _react2.default.createElement('img', { className: 'logo-img', src: _url2.default.urlForStatic('images/app_2/header/symbol.svg'), alt: 'Binary.com' })
                ),
                !!items.length && _react2.default.createElement(
                    'div',
                    { className: 'menu-links', ref: function ref(node) {
                            _this2.node = node;
                        } },
                    items.map(function (item, idx) {
                        return _react2.default.createElement(
                            _Routes.BinaryLink,
                            { onClick: _this2.onClick, key: idx, to: item.link_to },
                            _react2.default.createElement(
                                'span',
                                { className: item.icon, title: item.text },
                                item.text
                            )
                        );
                    }),
                    _react2.default.createElement(_InkBar2.default, { left: this.state.left, width: this.state.width })
                )
            );
        }
    }]);

    return MenuLinks;
}(_react2.default.PureComponent);

MenuLinks.propTypes = {
    items: _propTypes2.default.arrayOf(_propTypes2.default.shape({
        icon: _propTypes2.default.string,
        text: _propTypes2.default.string,
        link_to: _propTypes2.default.string
    }))
};

exports.MenuLinks = MenuLinks;

/***/ }),
/* 458 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ToggleMenuDrawer = undefined;

var _react = __webpack_require__(2);

var _react2 = _interopRequireDefault(_react);

var _account_switcher = __webpack_require__(441);

var _account_switcher2 = _interopRequireDefault(_account_switcher);

var _Drawer = __webpack_require__(125);

var _menu_drawer = __webpack_require__(444);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ToggleMenuDrawer = function ToggleMenuDrawer() {
    return _react2.default.createElement(
        _Drawer.ToggleDrawer,
        { alignment: 'left' },
        _react2.default.createElement(_account_switcher2.default, null),
        _react2.default.createElement(_menu_drawer.MenuDrawer, null)
    );
};

exports.ToggleMenuDrawer = ToggleMenuDrawer;

/***/ }),
/* 459 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ToggleNotificationsDrawer = undefined;

var _react = __webpack_require__(2);

var _react2 = _interopRequireDefault(_react);

var _Notifications = __webpack_require__(433);

var _Drawer = __webpack_require__(125);

var _url = __webpack_require__(10);

var _url2 = _interopRequireDefault(_url);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ToggleNotificationsDrawer = function ToggleNotificationsDrawer() {
    return _react2.default.createElement(
        _Drawer.ToggleDrawer,
        {
            icon_class: 'notify-toggle',
            alignment: 'right',
            icon_link: _url2.default.urlForStatic('images/app_2/header/icons/ic_notification_light.svg')
        },
        _react2.default.createElement(_Notifications.Notifications, null)
    );
};

exports.ToggleNotificationsDrawer = ToggleNotificationsDrawer;

/***/ }),
/* 460 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.UpgradeButton = undefined;

var _propTypes = __webpack_require__(4);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = __webpack_require__(2);

var _react2 = _interopRequireDefault(_react);

var _button = __webpack_require__(126);

var _button2 = _interopRequireDefault(_button);

var _localize = __webpack_require__(0);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var UpgradeButton = function UpgradeButton(_ref) {
    var onClick = _ref.onClick;
    return _react2.default.createElement(_button2.default, {
        id: 'acc-balance-btn',
        className: 'primary orange',
        has_effect: true,
        text: (0, _localize.localize)('Upgrade'),
        onClick: onClick
    });
};

UpgradeButton.propTypes = {
    onClick: _propTypes2.default.func
};

exports.UpgradeButton = UpgradeButton;

/***/ }),
/* 461 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _propTypes = __webpack_require__(4);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = __webpack_require__(2);

var _react2 = _interopRequireDefault(_react);

var _reactRouterDom = __webpack_require__(89);

var _helpers = __webpack_require__(237);

var _routes_config = __webpack_require__(239);

var _routes_config2 = _interopRequireDefault(_routes_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var BinaryLink = function BinaryLink(_ref) {
    var to = _ref.to,
        children = _ref.children,
        props = _objectWithoutProperties(_ref, ['to', 'children']);

    var path = (0, _helpers.normalizePath)(to);
    var route = (0, _helpers.getRouteInfo)(_routes_config2.default, path);

    if (!route) {
        throw new Error('Route not found: ' + to);
    }

    return to ? _react2.default.createElement(
        _reactRouterDom.NavLink,
        _extends({ to: path, activeClassName: 'active', exact: route.exact }, props),
        children
    ) : _react2.default.createElement(
        'a',
        _extends({ href: 'javascript:;' }, props),
        children
    );
};

BinaryLink.propTypes = {
    children: _propTypes2.default.object,
    to: _propTypes2.default.string
};

exports.default = BinaryLink;

/***/ }),
/* 462 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = __webpack_require__(2);

var _react2 = _interopRequireDefault(_react);

var _route_with_sub_routes = __webpack_require__(238);

var _route_with_sub_routes2 = _interopRequireDefault(_route_with_sub_routes);

var _routes_config = __webpack_require__(239);

var _routes_config2 = _interopRequireDefault(_routes_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var BinaryRoutes = function BinaryRoutes() {
    return _routes_config2.default.map(function (route, idx) {
        return _react2.default.createElement(_route_with_sub_routes2.default, _extends({ key: idx }, route));
    });
};

exports.default = BinaryRoutes;

/***/ }),
/* 463 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _propTypes = __webpack_require__(4);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = __webpack_require__(2);

var _react2 = _interopRequireDefault(_react);

var _Routes = __webpack_require__(128);

var _Footer = __webpack_require__(450);

var _server_time = __webpack_require__(469);

var _server_time2 = _interopRequireDefault(_server_time);

var _connect = __webpack_require__(26);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Footer = function Footer(_ref) {
    var items = _ref.items,
        is_portfolio_drawer_on = _ref.is_portfolio_drawer_on,
        is_language_dialog_visible = _ref.is_language_dialog_visible,
        is_settings_dialog_on = _ref.is_settings_dialog_on,
        toggleSettingsDialog = _ref.toggleSettingsDialog,
        togglePortfolioDrawer = _ref.togglePortfolioDrawer;
    return _react2.default.createElement(
        _react2.default.Fragment,
        null,
        _react2.default.createElement(_server_time2.default, null),
        _react2.default.createElement(
            'div',
            { className: 'footer-links' },
            _react2.default.createElement(_Footer.TogglePortfolio, {
                is_portfolio_drawer_on: is_portfolio_drawer_on,
                togglePortfolioDrawer: togglePortfolioDrawer
            }),
            !!(items && items.length) && items.map(function (item, idx) {
                return _react2.default.createElement(
                    _Routes.BinaryLink,
                    { key: idx, to: item.link_to, className: item.icon },
                    _react2.default.createElement('span', { title: item.text })
                );
            }),
            _react2.default.createElement(_Footer.ToggleFullScreen, null),
            _react2.default.createElement(_Footer.ToggleSettings, {
                is_settings_visible: is_settings_dialog_on,
                is_language_visible: is_language_dialog_visible,
                toggleSettings: toggleSettingsDialog
            })
        )
    );
};

Footer.propTypes = {
    items: _propTypes2.default.array,
    is_language_dialog_visible: _propTypes2.default.bool,
    is_portfolio_drawer_on: _propTypes2.default.bool,
    is_settings_dialog_on: _propTypes2.default.bool,
    togglePortfolioDrawer: _propTypes2.default.func,
    toggleSettingsDialog: _propTypes2.default.func
};

exports.default = (0, _connect.connect)(function (_ref2) {
    var ui = _ref2.ui;
    return {
        is_language_dialog_visible: ui.is_language_dialog_on,
        is_portfolio_drawer_on: ui.is_portfolio_drawer_on,
        is_settings_dialog_on: ui.is_settings_dialog_on,
        togglePortfolioDrawer: ui.togglePortfolioDrawer,
        toggleSettingsDialog: ui.toggleSettingsDialog
    };
})(Footer);

/***/ }),
/* 464 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _propTypes = __webpack_require__(4);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = __webpack_require__(2);

var _react2 = _interopRequireDefault(_react);

var _Header = __webpack_require__(455);

var _connect = __webpack_require__(26);

var _currency_base = __webpack_require__(33);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Header = function Header(_ref) {
    var balance = _ref.balance,
        can_upgrade = _ref.can_upgrade,
        currency = _ref.currency,
        loginid = _ref.loginid,
        items = _ref.items,
        is_logged_in = _ref.is_logged_in,
        onClickUpgrade = _ref.onClickUpgrade;
    return _react2.default.createElement(
        'header',
        { className: 'shadow' },
        _react2.default.createElement(
            'div',
            { className: 'menu-items' },
            _react2.default.createElement(
                'div',
                { className: 'menu-left' },
                _react2.default.createElement(_Header.ToggleMenuDrawer, null),
                _react2.default.createElement(_Header.MenuLinks, { items: items })
            ),
            _react2.default.createElement(
                'div',
                { className: 'menu-right' },
                _react2.default.createElement(
                    'div',
                    { className: 'acc-balance-container' },
                    is_logged_in ? _react2.default.createElement(
                        _react2.default.Fragment,
                        null,
                        _react2.default.createElement(_Header.AccountInfo, {
                            balance: (0, _currency_base.formatMoney)(currency, balance, true),
                            currency: currency,
                            loginid: loginid
                        }),
                        can_upgrade && _react2.default.createElement(_Header.UpgradeButton, { onClick: onClickUpgrade })
                    ) : _react2.default.createElement(_Header.LoginButton, null)
                )
            ),
            _react2.default.createElement(_Header.ToggleNotificationsDrawer, null)
        )
    );
};

Header.propTypes = {
    balance: _propTypes2.default.string,
    can_upgrade: _propTypes2.default.bool,
    currency: _propTypes2.default.string,
    loginid: _propTypes2.default.string,
    items: _propTypes2.default.array,
    is_dark_mode: _propTypes2.default.bool, // TODO: add dark theme handler
    is_logged_in: _propTypes2.default.bool,
    onClickUpgrade: _propTypes2.default.func // TODO: add click handler
};

exports.default = (0, _connect.connect)(function (_ref2) {
    var ui = _ref2.ui,
        client = _ref2.client;
    return {
        is_dark_mode: ui.is_dark_mode_on,
        balance: client.balance,
        can_upgrade: client.can_upgrade,
        currency: client.currency,
        loginid: client.loginid,
        is_logged_in: client.is_logged_in
    };
})(Header);

/***/ }),
/* 465 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _settings_chart = __webpack_require__(466);

Object.keys(_settings_chart).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _settings_chart[key];
    }
  });
});

var _settings_general = __webpack_require__(467);

Object.keys(_settings_general).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _settings_general[key];
    }
  });
});

var _settings_language = __webpack_require__(468);

Object.keys(_settings_language).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _settings_language[key];
    }
  });
});

/***/ }),
/* 466 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ChartSettings = undefined;

var _react = __webpack_require__(2);

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__(4);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _settings_control = __webpack_require__(230);

var _settings_control2 = _interopRequireDefault(_settings_control);

var _connect = __webpack_require__(26);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ChartSettings = function ChartSettings(_ref) {
    var is_asset_visible = _ref.is_asset_visible,
        is_countdown_visible = _ref.is_countdown_visible,
        is_layout_default = _ref.is_layout_default,
        toggleAsset = _ref.toggleAsset,
        toggleCountdown = _ref.toggleCountdown,
        toggleLayout = _ref.toggleLayout;
    return _react2.default.createElement(
        'div',
        { className: 'tab-content' },
        _react2.default.createElement(
            'div',
            { className: 'chart-setting-container' },
            _react2.default.createElement(_settings_control2.default, {
                name: 'position',
                toggle: toggleLayout,
                to_toggle: is_layout_default,
                style: 'toggle-chart-layout'
            }),
            _react2.default.createElement(_settings_control2.default, {
                name: 'asset information',
                toggle: toggleAsset,
                to_toggle: is_asset_visible
            }),
            _react2.default.createElement(_settings_control2.default, {
                name: 'scale countdown',
                toggle: toggleCountdown,
                to_toggle: is_countdown_visible
            })
        )
    );
};

ChartSettings.propTypes = {
    is_layout_default: _propTypes2.default.bool,
    is_asset_visible: _propTypes2.default.bool,
    is_countdown_visible: _propTypes2.default.bool,
    toggleAsset: _propTypes2.default.func,
    toggleCountdown: _propTypes2.default.func,
    toggleLayout: _propTypes2.default.func
};

var chart_settings_component = (0, _connect.connect)(function (_ref2) {
    var ui = _ref2.ui;
    return {
        is_layout_default: ui.is_chart_layout_default,
        is_asset_visible: ui.is_chart_asset_info_visible,
        is_countdown_visible: ui.is_chart_countdown_visible,
        toggleAsset: ui.toggleChartAssetInfo,
        toggleCountdown: ui.toggleChartCountdown,
        toggleLayout: ui.toggleChartLayout
    };
})(ChartSettings);

exports.ChartSettings = chart_settings_component;

/***/ }),
/* 467 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.GeneralSettings = undefined;

var _react = __webpack_require__(2);

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__(4);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _settings_control = __webpack_require__(230);

var _settings_control2 = _interopRequireDefault(_settings_control);

var _connect = __webpack_require__(26);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var GeneralSettings = function GeneralSettings(_ref) {
    var curr_language = _ref.curr_language,
        is_dark_mode = _ref.is_dark_mode,
        is_purchase_confirmed = _ref.is_purchase_confirmed,
        is_purchase_locked = _ref.is_purchase_locked,
        showLanguage = _ref.showLanguage,
        toggleDarkMode = _ref.toggleDarkMode,
        togglePurchaseConfirmation = _ref.togglePurchaseConfirmation,
        togglePurchaseLock = _ref.togglePurchaseLock;
    return _react2.default.createElement(
        'div',
        { className: 'tab-content' },
        _react2.default.createElement(
            'div',
            { className: 'general-setting-container' },
            _react2.default.createElement(
                _settings_control2.default,
                {
                    name: 'language',
                    onClick: showLanguage
                },
                _react2.default.createElement('i', { className: 'flag ic-flag-' + (curr_language || 'EN').toLowerCase() })
            ),
            _react2.default.createElement(_settings_control2.default, {
                name: 'dark mode',
                to_toggle: is_dark_mode,
                toggle: toggleDarkMode
            }),
            _react2.default.createElement(_settings_control2.default, {
                name: 'purchase confirmation',
                to_toggle: is_purchase_confirmed,
                toggle: togglePurchaseConfirmation
            }),
            _react2.default.createElement(_settings_control2.default, {
                name: 'purchase lock',
                to_toggle: is_purchase_locked,
                toggle: togglePurchaseLock
            })
        )
    );
};

GeneralSettings.propTypes = {
    curr_language: _propTypes2.default.string,
    showLanguage: _propTypes2.default.func,
    is_dark_mode: _propTypes2.default.bool,
    is_language_visible: _propTypes2.default.bool,
    is_purchase_confirmed: _propTypes2.default.bool,
    is_purchase_locked: _propTypes2.default.bool,
    toggleDarkMode: _propTypes2.default.func,
    togglePurchaseConfirmation: _propTypes2.default.func,
    togglePurchaseLock: _propTypes2.default.func
};

var general_settings_component = (0, _connect.connect)(function (_ref2) {
    var common = _ref2.common,
        ui = _ref2.ui;
    return {
        curr_language: common.current_language,
        is_dark_mode: ui.is_dark_mode_on,
        is_language_visible: ui.is_language_dialog_on,
        is_purchase_confirmed: ui.is_purchase_confirm_on,
        is_purchase_locked: ui.is_purchase_lock_on,
        showLanguage: ui.showLanguageDialog,
        toggleDarkMode: ui.toggleDarkMode,
        togglePurchaseConfirmation: ui.togglePurchaseConfirmation,
        togglePurchaseLock: ui.togglePurchaseLock
    };
})(GeneralSettings);

exports.GeneralSettings = general_settings_component;

/***/ }),
/* 468 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.LanguageSettings = undefined;

var _react = __webpack_require__(2);

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__(4);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _language_dialog = __webpack_require__(437);

var _language_dialog2 = _interopRequireDefault(_language_dialog);

var _connect = __webpack_require__(26);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var LanguageSettings = function LanguageSettings(_ref) {
    var hide = _ref.hide,
        is_visible = _ref.is_visible,
        is_settings_on = _ref.is_settings_on;
    return _react2.default.createElement(_language_dialog2.default, {
        hide: hide,
        is_visible: is_visible,
        is_settings_on: is_settings_on
    });
};

LanguageSettings.propTypes = {
    is_visible: _propTypes2.default.bool,
    is_settings_on: _propTypes2.default.bool,
    hide: _propTypes2.default.func
};

var language_settings_component = (0, _connect.connect)(function (_ref2) {
    var ui = _ref2.ui;
    return {
        is_settings_on: ui.is_settings_dialog_on,
        is_visible: ui.is_language_dialog_on,
        hide: ui.hideLanguageDialog
    };
})(LanguageSettings);

exports.LanguageSettings = language_settings_component;

/***/ }),
/* 469 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _propTypes = __webpack_require__(4);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = __webpack_require__(2);

var _react2 = _interopRequireDefault(_react);

var _connect = __webpack_require__(26);

var _Date = __webpack_require__(107);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ServerTime = function ServerTime(_ref) {
    var server_time = _ref.server_time;

    var gmt_time = (0, _Date.toGMTFormat)(server_time);

    return _react2.default.createElement(
        'div',
        { className: 'server-time' },
        gmt_time
    );
};

ServerTime.propTypes = {
    server_time: _propTypes2.default.object
};

exports.default = (0, _connect.connect)(function (_ref2) {
    var common = _ref2.common;
    return {
        server_time: common.server_time
    };
})(ServerTime);

/***/ }),
/* 470 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _propTypes = __webpack_require__(4);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = __webpack_require__(2);

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Mobile view for portfolio items
var PortfolioCard = function PortfolioCard(_ref) {
    var reference = _ref.reference,
        details = _ref.details,
        remaining_time = _ref.remaining_time,
        indicative = _ref.indicative,
        payout = _ref.payout,
        purchase = _ref.purchase,
        currency = _ref.currency;
    return (
        // TODO: Update styling once UI is ready
        _react2.default.createElement(
            'div',
            { className: 'statement-card card-list__card' },
            _react2.default.createElement(
                'div',
                { className: 'statement-card__header' },
                _react2.default.createElement(
                    'span',
                    { className: 'statement-card__refid' },
                    reference.transaction_id
                ),
                _react2.default.createElement(
                    'span',
                    { className: 'statement-card__date' },
                    remaining_time
                )
            ),
            _react2.default.createElement(
                'div',
                { className: 'statement-card__body' },
                _react2.default.createElement(
                    'div',
                    { className: 'statement-card__desc' },
                    details
                ),
                _react2.default.createElement(
                    'div',
                    { className: 'statement-card__row' },
                    indicative.amount && _react2.default.createElement(
                        'div',
                        { className: 'statement-card__cell statement-card__amount--' + (indicative.style && indicative.style === 'price_moved_up' ? 'buy' : 'sell') },
                        _react2.default.createElement(
                            'span',
                            { className: 'statement-card__cell-text' },
                            _react2.default.createElement('span', { className: 'symbols ' + currency }),
                            indicative.amount
                        )
                    ),
                    _react2.default.createElement(
                        'div',
                        { className: 'statement-card__cell statement-card__payout' },
                        _react2.default.createElement(
                            'span',
                            { className: 'statement-card__cell-text' },
                            _react2.default.createElement('span', { className: 'symbols ' + currency }),
                            payout
                        )
                    ),
                    _react2.default.createElement(
                        'div',
                        { className: 'statement-card__cell statement-card__balance' },
                        _react2.default.createElement(
                            'span',
                            { className: 'statement-card__cell-text' },
                            _react2.default.createElement('span', { className: 'symbols ' + currency }),
                            purchase
                        )
                    )
                )
            )
        )
    );
};

PortfolioCard.propTypes = {
    reference: _propTypes2.default.object,
    details: _propTypes2.default.string,
    remaining_time: _propTypes2.default.string,
    indicative: _propTypes2.default.object,
    payout: _propTypes2.default.string,
    purchase: _propTypes2.default.string,
    currency: _propTypes2.default.string
};

exports.default = PortfolioCard;

/***/ }),
/* 471 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(2);

var _react2 = _interopRequireDefault(_react);

var _portfolio_card = __webpack_require__(470);

var _portfolio_card2 = _interopRequireDefault(_portfolio_card);

var _process_data = __webpack_require__(472);

var _data_table = __webpack_require__(233);

var _data_table2 = _interopRequireDefault(_data_table);

var _tooltip = __webpack_require__(164);

var _tooltip2 = _interopRequireDefault(_tooltip);

var _contract = __webpack_require__(240);

var _Services = __webpack_require__(64);

var _Helpers = __webpack_require__(511);

var _config = __webpack_require__(37);

var _client_base = __webpack_require__(22);

var _client_base2 = _interopRequireDefault(_client_base);

var _currency_base = __webpack_require__(33);

var _localize = __webpack_require__(0);

var _utility = __webpack_require__(3);

var _loading = __webpack_require__(263);

var _loading2 = _interopRequireDefault(_loading);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var app_id = (0, _config.getAppId)();

var Portfolio = function (_React$Component) {
    _inherits(Portfolio, _React$Component);

    function Portfolio() {
        var _ref;

        var _temp, _this, _ret;

        _classCallCheck(this, Portfolio);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Portfolio.__proto__ || Object.getPrototypeOf(Portfolio)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
            currency: _client_base2.default.get('currency').toLowerCase(),
            data_source: [],
            error: null,
            footer: {
                reference: 'Total',
                payout: '',
                purchase: '',
                indicative: ''
            },
            is_loading: true,
            oauth_apps: null
        }, _this.columns = [{
            title: (0, _localize.localize)('Reference No.'),
            data_index: 'reference',
            renderCell: function renderCell(data, data_index) {
                var oauth_apps = _this.state.oauth_apps;

                var tooltip = data.app_id !== app_id && oauth_apps && oauth_apps[data.app_id];
                if (tooltip) {
                    return _react2.default.createElement(
                        'td',
                        { key: data_index, className: data_index },
                        _react2.default.createElement(
                            _tooltip2.default,
                            {
                                alignment: 'right',
                                message: (0, _localize.localize)('Transaction performed by [_1] (APP ID: [_2])', [tooltip, data.app_id])
                            },
                            data.transaction_id.toString()
                        )
                    );
                }
                return _react2.default.createElement(
                    'td',
                    { key: data_index, className: data_index },
                    data.transaction_id || ''
                );
            }
        }, {
            title: (0, _localize.localize)('Contract Type'),
            data_index: 'type',
            renderCell: function renderCell(data, data_index) {
                if (data) {
                    return _react2.default.createElement(
                        'td',
                        { key: data_index },
                        _react2.default.createElement(
                            'div',
                            { className: data_index + '_container' },
                            _react2.default.createElement('i', { className: 'trade_type_icon icon_' + data.toLowerCase() + '--light' }),
                            (0, _localize.localize)(_contract.contract_type_display[data])
                        )
                    );
                }
                return _react2.default.createElement('td', { key: data_index });
            }
        }, {
            title: (0, _localize.localize)('Contract Details'),
            data_index: 'details'
        }, {
            title: (0, _localize.localize)('Remaining Time (GMT)'),
            data_index: 'remaining_time'
        }, {
            title: (0, _localize.localize)('Potential Payout'),
            data_index: 'payout',
            renderCell: function renderCell(data, data_index) {
                return _react2.default.createElement(
                    'td',
                    { key: data_index, className: data_index },
                    ' ',
                    _react2.default.createElement('span', { className: 'symbols ' + _this.state.currency }),
                    data
                );
            }
        }, {
            title: (0, _localize.localize)('Purchase'),
            data_index: 'purchase',
            renderCell: function renderCell(data, data_index) {
                return _react2.default.createElement(
                    'td',
                    { key: data_index, className: data_index },
                    ' ',
                    _react2.default.createElement('span', { className: 'symbols ' + _this.state.currency }),
                    data
                );
            }
        }, {
            title: (0, _localize.localize)('Indicative'),
            data_index: 'indicative',
            renderCell: function renderCell(data, data_index) {
                if (data.amount) {
                    return _react2.default.createElement(
                        'td',
                        { key: data_index, className: 'indicative ' + data.style },
                        _react2.default.createElement('span', { className: 'symbols ' + _this.state.currency }),
                        data.amount,
                        data.style === 'no_resale' && _react2.default.createElement(
                            'div',
                            null,
                            ' ',
                            (0, _localize.localize)('resell not offered')
                        )
                    );
                }
                // Footer total:
                if (data && typeof data === 'string') {
                    return _react2.default.createElement(
                        'td',
                        { key: data_index, className: data_index },
                        ' ',
                        _react2.default.createElement('span', { className: 'symbols ' + _this.state.currency }),
                        data
                    );
                }
                return _react2.default.createElement(
                    'td',
                    { key: data_index },
                    '-'
                );
            }
        }], _this.initializePortfolio = function () {
            _Services.WS.portfolio().then(function (response) {
                _this.setState({ is_loading: false });
                _this.updatePortfolio(response);
            });
            _Services.WS.subscribeTransaction(_this.transactionResponseHandler, false);
            _Services.WS.oauthApps().then(function (response) {
                return _this.updateOAuthApps(response);
            });
        }, _this.transactionResponseHandler = function (response) {
            if ((0, _utility.getPropertyValue)(response, 'error')) {
                _this.setState({ error: response.error.message });
            }
            _Services.WS.portfolio().then(function (res) {
                return _this.updatePortfolio(res);
            });
        }, _this.updateIndicative = function (response) {
            // prevent callback after component has unmounted
            if (!_this.el) return;
            if ((0, _utility.getPropertyValue)(response, 'error')) {
                return;
            }
            var data_source = _this.state.data_source.slice();
            var proposal = response.proposal_open_contract;
            // force to sell the expired contract, in order to remove from portfolio
            if (+proposal.is_settleable === 1 && !proposal.is_sold) {
                _Services.WS.sellExpired();
            }
            if (+proposal.is_sold === 1) {
                data_source = data_source.filter(function (portfolio_item) {
                    return portfolio_item.id !== +proposal.contract_id;
                });
            } else {
                data_source.forEach(function (portfolio_item) {
                    if (portfolio_item.id === +proposal.contract_id) {
                        var indicative = portfolio_item.indicative.amount || '0.00';
                        var amount = (0, _currency_base.formatMoney)(false, proposal.bid_price, true);
                        var style = portfolio_item.indicative.style;

                        if (+proposal.is_valid_to_sell === 1) {
                            if (amount !== indicative) {
                                style = amount > indicative ? 'price_moved_up' : 'price_moved_down';
                            }
                        } else {
                            style = 'no_resale';
                        }
                        portfolio_item.indicative = { style: style, amount: amount };
                    }
                });
            }
            var footer = _this.updateFooterTotals(data_source);
            _this.setState({ data_source: data_source, footer: footer });
        }, _this.updateFooterTotals = function (portfolioArr) {
            var indicative = 0;
            var payout = 0;
            var purchase = 0;

            portfolioArr.forEach(function (portfolio_item) {
                indicative += +portfolio_item.indicative.amount;
                payout += +portfolio_item.payout;
                purchase += +portfolio_item.purchase;
            });
            return _extends({}, _this.state.footer, {
                indicative: (0, _currency_base.formatMoney)(false, indicative, true),
                payout: (0, _currency_base.formatMoney)(false, payout, true),
                purchase: (0, _currency_base.formatMoney)(false, purchase, true)
            });
        }, _this.updateOAuthApps = function (response) {
            var oauth_apps = _Helpers.ProcessData.getOauthAppsObject(response);
            _this.setState({ oauth_apps: oauth_apps });
        }, _this.updatePortfolio = function (response) {
            if ((0, _utility.getPropertyValue)(response, 'error')) {
                _this.setState({ error: response.error.message });
                return;
            }
            if (response.portfolio.contracts && response.portfolio.contracts.length !== 0) {
                var data_source = (0, _process_data.formatPortfolioData)(response.portfolio.contracts);
                var footer = _this.updateFooterTotals(data_source);

                _this.setState({ data_source: data_source, footer: footer });

                _Services.WS.subscribeProposalOpenContract(_this.updateIndicative, false);
            }
        }, _temp), _possibleConstructorReturn(_this, _ret);
    }

    _createClass(Portfolio, [{
        key: 'componentWillMount',
        value: function componentWillMount() {
            this.initializePortfolio();
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            // eslint-disable-line class-methods-use-this
            _Services.WS.forgetAll('proposal_open_contract', 'transaction');
        }
    }, {
        key: 'render',
        value: function render() {
            var _this2 = this;

            return _react2.default.createElement(
                'div',
                { className: 'portfolio', ref: function ref(el) {
                        return _this2.el = el;
                    } },
                _react2.default.createElement(
                    'div',
                    { className: 'portfolio_header_container desktop-only' },
                    _react2.default.createElement(
                        'h2',
                        null,
                        (0, _localize.localize)('Portfolio')
                    )
                ),
                function () {
                    var _state = _this2.state,
                        error = _state.error,
                        is_loading = _state.is_loading;


                    if (is_loading) {
                        return _react2.default.createElement(_loading2.default, null);
                    }
                    if (error) {
                        return _react2.default.createElement(
                            'p',
                            null,
                            error
                        );
                    }
                    return _this2.state.data_source.length > 0 ? _react2.default.createElement(
                        'div',
                        null,
                        _react2.default.createElement(
                            'div',
                            { className: 'desktop-only' },
                            _react2.default.createElement(_data_table2.default, _extends({}, _this2.props, {
                                columns: _this2.columns,
                                data_source: _this2.state.data_source,
                                footer: _this2.state.footer,
                                has_fixed_header: true
                            }))
                        ),
                        _react2.default.createElement(
                            'div',
                            { className: 'mobile-only' },
                            _this2.state.data_source.map(function (transaction, idx) {
                                return _react2.default.createElement(
                                    'div',
                                    { key: idx, className: 'card-list' },
                                    _react2.default.createElement(_portfolio_card2.default, _extends({}, transaction, {
                                        currency: _this2.state.currency
                                    }))
                                );
                            })
                        )
                    ) : _react2.default.createElement(
                        'p',
                        null,
                        (0, _localize.localize)('No open positions.')
                    );
                }()
            );
        }
    }]);

    return Portfolio;
}(_react2.default.Component);

exports.default = Portfolio;

/***/ }),
/* 472 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.formatPortfolioData = undefined;

var _Date = __webpack_require__(107);

var _currency_base = __webpack_require__(33);

var _localize = __webpack_require__(0);

var formatPortfolioData = exports.formatPortfolioData = function formatPortfolioData(portfolio_arr) {
    return portfolio_arr.map(function (portfolio_item) {
        var moment_obj = (0, _Date.toMoment)(portfolio_item.expiry_time);
        // TODO: fromNow should check against server time not local time
        var remaining_time = moment_obj.fromNow(true) + ' - ' + moment_obj.format('h:mm:ss');
        var purchase = parseFloat(portfolio_item.buy_price);
        var payout = parseFloat(portfolio_item.payout);

        return {
            reference: {
                transaction_id: portfolio_item.transaction_id,
                app_id: portfolio_item.app_id
            },
            type: portfolio_item.contract_type,
            details: (0, _localize.localize)(portfolio_item.longcode.replace(/\n/g, '<br />')),
            purchase: (0, _currency_base.formatMoney)(false, purchase, true),
            payout: (0, _currency_base.formatMoney)(false, payout, true),
            remaining_time: remaining_time,
            id: portfolio_item.contract_id,
            indicative: {
                amount: '',
                style: ''
            }
        };
    });
};

/***/ }),
/* 473 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _portfolio = __webpack_require__(471);

var _portfolio2 = _interopRequireDefault(_portfolio);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _portfolio2.default;

/***/ }),
/* 474 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _classnames = __webpack_require__(18);

var _classnames2 = _interopRequireDefault(_classnames);

var _react = __webpack_require__(2);

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var AmountCell = function AmountCell(data, data_index) {
    var className = +data.replace(/,/g, '') >= 0 ? 'profit' : 'loss';

    return _react2.default.createElement(
        'td',
        { key: data_index, className: (0, _classnames2.default)('' + data_index, className) },
        data
    );
};

exports.default = AmountCell;

/***/ }),
/* 475 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _mobxReact = __webpack_require__(28);

var _react = __webpack_require__(2);

var _react2 = _interopRequireDefault(_react);

var _data_table_constants = __webpack_require__(479);

var _data_table = __webpack_require__(233);

var _data_table2 = _interopRequireDefault(_data_table);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ListLargeScreen = function ListLargeScreen(_ref) {
    var data = _ref.data;

    var columns = (0, _data_table_constants.getTableColumnsTemplate)();
    return _react2.default.createElement(
        'div',
        { className: 'statement statement__content' },
        _react2.default.createElement(_data_table2.default, {
            data_source: data.slice(),
            columns: columns,
            has_fixed_header: true,
            is_full_width: true
        })
    );
};

ListLargeScreen.propTypes = {
    data: _mobxReact.PropTypes.arrayOrObservableArray
};

exports.default = ListLargeScreen;

/***/ }),
/* 476 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _mobxReact = __webpack_require__(28);

var _react = __webpack_require__(2);

var _react2 = _interopRequireDefault(_react);

var _statement_card = __webpack_require__(478);

var _statement_card2 = _interopRequireDefault(_statement_card);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ListSmallScreen = function ListSmallScreen(_ref) {
    var data = _ref.data;
    return _react2.default.createElement(
        'div',
        { className: 'statement statement__content' },
        _react2.default.createElement(
            'div',
            { className: 'card-list' },
            data.map(function (transaction, id) {
                return _react2.default.createElement(_statement_card2.default, _extends({ className: 'card-list__card' }, transaction, { key: id }));
            })
        )
    );
};

ListSmallScreen.propTypes = {
    data: _mobxReact.PropTypes.arrayOrObservableArray
};

exports.default = ListSmallScreen;

/***/ }),
/* 477 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _propTypes = __webpack_require__(4);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = __webpack_require__(2);

var _react2 = _interopRequireDefault(_react);

var _localize = __webpack_require__(0);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var NoActivityMessage = function NoActivityMessage(_ref) {
    var has_selected_date = _ref.has_selected_date;
    return _react2.default.createElement(
        'div',
        { className: 'container' },
        _react2.default.createElement(
            'div',
            { className: 'statement__no-activity-msg' },
            !has_selected_date ? (0, _localize.localize)('Your account has no trading activity.') : (0, _localize.localize)('Your account has no trading activity for the selected period.')
        )
    );
};

NoActivityMessage.propTypes = {
    has_selected_date: _propTypes2.default.bool
};

exports.default = NoActivityMessage;

/***/ }),
/* 478 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _classnames = __webpack_require__(18);

var _classnames2 = _interopRequireDefault(_classnames);

var _propTypes = __webpack_require__(4);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = __webpack_require__(2);

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var StatementCard = function StatementCard(_ref) {
    var action = _ref.action,
        amount = _ref.amount,
        balance = _ref.balance,
        className = _ref.className,
        date = _ref.date,
        desc = _ref.desc,
        payout = _ref.payout,
        refid = _ref.refid;
    return _react2.default.createElement(
        'div',
        { className: (0, _classnames2.default)('statement-card', className) },
        _react2.default.createElement(
            'div',
            { className: 'statement-card__header' },
            _react2.default.createElement(
                'span',
                { className: 'statement-card__date' },
                date
            ),
            _react2.default.createElement(
                'span',
                { className: 'statement-card__refid' },
                refid
            )
        ),
        _react2.default.createElement(
            'div',
            { className: 'statement-card__body' },
            _react2.default.createElement(
                'div',
                { className: 'statement-card__desc' },
                desc
            ),
            _react2.default.createElement(
                'div',
                { className: 'statement-card__row' },
                _react2.default.createElement(
                    'div',
                    { className: (0, _classnames2.default)('statement-card__cell statement-card__amount', {
                            'statement-card__amount--buy': action === 'Buy',
                            'statement-card__amount--sell': action === 'Sell',
                            'statement-card__amount--deposit': action === 'Deposit',
                            'statement-card__amount--withdrawal': action === 'Withdrawal'
                        })
                    },
                    _react2.default.createElement(
                        'span',
                        { className: 'statement-card__cell-text' },
                        amount
                    )
                ),
                _react2.default.createElement(
                    'div',
                    { className: 'statement-card__cell statement-card__payout' },
                    _react2.default.createElement(
                        'span',
                        { className: 'statement-card__cell-text' },
                        payout
                    )
                ),
                _react2.default.createElement(
                    'div',
                    { className: 'statement-card__cell statement-card__balance' },
                    _react2.default.createElement(
                        'span',
                        { className: 'statement-card__cell-text' },
                        balance
                    )
                )
            )
        )
    );
};

StatementCard.propTypes = {
    action: _propTypes2.default.string,
    amount: _propTypes2.default.string,
    balance: _propTypes2.default.string,
    className: _propTypes2.default.string,
    date: _propTypes2.default.string,
    desc: _propTypes2.default.string,
    payout: _propTypes2.default.string,
    refid: _propTypes2.default.string
};

exports.default = StatementCard;

/***/ }),
/* 479 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getTableColumnsTemplate = undefined;

var _amount_cell = __webpack_require__(474);

var _amount_cell2 = _interopRequireDefault(_amount_cell);

var _localize = __webpack_require__(0);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var getTableColumnsTemplate = exports.getTableColumnsTemplate = function getTableColumnsTemplate() {
    return [{ title: (0, _localize.localize)('Date'), data_index: 'date' }, { title: (0, _localize.localize)('Ref.'), data_index: 'refid' }, { title: (0, _localize.localize)('Description'), data_index: 'desc' }, { title: (0, _localize.localize)('Action'), data_index: 'action' }, { title: (0, _localize.localize)('Potential Payout'), data_index: 'payout' },
    // TODO: Passing component references as props like "AmountCell" here is a bad practice.
    // use Children or a render callback instead.
    { title: (0, _localize.localize)('Credit/Debit'), data_index: 'amount', renderCell: _amount_cell2.default }, { title: (0, _localize.localize)('Balance'), data_index: 'balance' }];
};

/***/ }),
/* 480 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _mobxReact = __webpack_require__(28);

var _propTypes = __webpack_require__(4);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = __webpack_require__(2);

var _react2 = _interopRequireDefault(_react);

var _statement_filter = __webpack_require__(481);

var _statement_filter2 = _interopRequireDefault(_statement_filter);

var _no_activity_message = __webpack_require__(477);

var _no_activity_message2 = _interopRequireDefault(_no_activity_message);

var _list_large_screen = __webpack_require__(475);

var _list_large_screen2 = _interopRequireDefault(_list_large_screen);

var _list_small_screen = __webpack_require__(476);

var _list_small_screen2 = _interopRequireDefault(_list_small_screen);

var _connect = __webpack_require__(26);

var _loading = __webpack_require__(263);

var _loading2 = _interopRequireDefault(_loading);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Statement = function (_React$Component) {
    _inherits(Statement, _React$Component);

    function Statement() {
        _classCallCheck(this, Statement);

        return _possibleConstructorReturn(this, (Statement.__proto__ || Object.getPrototypeOf(Statement)).apply(this, arguments));
    }

    _createClass(Statement, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            this.props.onMount();
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            this.props.onUnmount();
        }
    }, {
        key: 'render',
        value: function render() {
            var _props = this.props,
                has_no_activity_message = _props.has_no_activity_message,
                has_selected_date = _props.has_selected_date,
                data = _props.data,
                is_loading = _props.is_loading,
                is_mobile = _props.is_mobile;


            return _react2.default.createElement(
                _react2.default.Fragment,
                null,
                _react2.default.createElement(_statement_filter2.default, null),
                is_mobile ? _react2.default.createElement(_list_small_screen2.default, { data: data }) : _react2.default.createElement(_list_large_screen2.default, { data: data }),
                is_loading && _react2.default.createElement(_loading2.default, null),
                has_no_activity_message && _react2.default.createElement(_no_activity_message2.default, { has_selected_date: has_selected_date })
            );
        }
    }]);

    return Statement;
}(_react2.default.Component);

Statement.propTypes = {
    has_no_activity_message: _propTypes2.default.bool,
    has_selected_date: _propTypes2.default.bool,
    data: _mobxReact.PropTypes.arrayOrObservableArray,
    is_loading: _propTypes2.default.bool,
    is_mobile: _propTypes2.default.bool,
    onMount: _propTypes2.default.func,
    onUnmount: _propTypes2.default.func
};

exports.default = (0, _connect.connect)(function (_ref) {
    var modules = _ref.modules,
        ui = _ref.ui;
    return {
        has_no_activity_message: modules.statement.has_no_activity_message,
        has_selected_date: modules.statement.has_selected_date,
        data: modules.statement.data,
        is_loading: modules.statement.is_loading,
        onMount: modules.statement.onMount,
        onUnmount: modules.statement.onUnmount,
        is_mobile: ui.is_mobile
    };
})(Statement);

/***/ }),
/* 481 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _classnames = __webpack_require__(18);

var _classnames2 = _interopRequireDefault(_classnames);

var _moment = __webpack_require__(9);

var _moment2 = _interopRequireDefault(_moment);

var _propTypes = __webpack_require__(4);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = __webpack_require__(2);

var _react2 = _interopRequireDefault(_react);

var _DatePicker = __webpack_require__(235);

var _DatePicker2 = _interopRequireDefault(_DatePicker);

var _connect = __webpack_require__(26);

var _localize = __webpack_require__(0);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Filter = function Filter(_ref) {
    var date_from = _ref.date_from,
        date_to = _ref.date_to,
        handleDateChange = _ref.handleDateChange,
        is_mobile = _ref.is_mobile,
        today = _ref.today;
    return _react2.default.createElement(
        'div',
        { className: (0, _classnames2.default)('statement-filter', { 'mobile-only': is_mobile, 'desktop-only': !is_mobile }) },
        _react2.default.createElement(
            'div',
            { className: 'statement-filter__content container' },
            _react2.default.createElement(
                'span',
                { className: 'statement-filter__label' },
                (0, _localize.localize)('Filter by date:')
            ),
            _react2.default.createElement(_DatePicker2.default, {
                name: 'date_from',
                placeholder: (0, _localize.localize)('Start date'),
                start_date: date_to || today,
                max_date: date_to || today,
                onChange: handleDateChange,
                value: date_from,
                is_nativepicker: is_mobile
            }),
            _react2.default.createElement(
                'span',
                { className: 'statement-filter__dash' },
                '\u2014'
            ),
            _react2.default.createElement(_DatePicker2.default, {
                name: 'date_to',
                placeholder: (0, _localize.localize)('End date'),
                start_date: today,
                min_date: date_from,
                max_date: today,
                has_today_btn: true,
                onChange: handleDateChange,
                value: date_to,
                is_nativepicker: is_mobile
            })
        )
    );
};

Filter.propTypes = {
    date_from: _propTypes2.default.string,
    date_to: _propTypes2.default.string,
    server_time: _propTypes2.default.object,
    handleDateChange: _propTypes2.default.func,
    is_mobile: _propTypes2.default.bool,
    today: _propTypes2.default.string
};

exports.default = (0, _connect.connect)(function (_ref2) {
    var common = _ref2.common,
        modules = _ref2.modules,
        ui = _ref2.ui;
    return {
        today: (0, _moment2.default)(common.server_time).format('YYYY-MM-DD'),
        date_from: modules.statement.date_from,
        date_to: modules.statement.date_to,
        handleDateChange: modules.statement.handleDateChange,
        is_mobile: ui.is_mobile
    };
})(Filter);

/***/ }),
/* 482 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _statement = __webpack_require__(480);

var _statement2 = _interopRequireDefault(_statement);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _statement2.default;

/***/ }),
/* 483 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(2);

var _react2 = _interopRequireDefault(_react);

var _full_screen_dialog = __webpack_require__(244);

var _full_screen_dialog2 = _interopRequireDefault(_full_screen_dialog);

var _trade_params = __webpack_require__(246);

var _trade_params2 = _interopRequireDefault(_trade_params);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MobileWidget = function (_React$PureComponent) {
    _inherits(MobileWidget, _React$PureComponent);

    function MobileWidget(props) {
        _classCallCheck(this, MobileWidget);

        var _this = _possibleConstructorReturn(this, (MobileWidget.__proto__ || Object.getPrototypeOf(MobileWidget)).call(this, props));

        _this.state = {
            open: false
        };
        _this.handleDialogClose = _this.handleDialogClose.bind(_this);
        _this.handleWidgetClick = _this.handleWidgetClick.bind(_this);
        return _this;
    }

    _createClass(MobileWidget, [{
        key: 'handleWidgetClick',
        value: function handleWidgetClick() {
            this.setState({
                open: true
            });
        }
    }, {
        key: 'handleDialogClose',
        value: function handleDialogClose() {
            this.setState({
                open: false
            });
        }
    }, {
        key: 'render',
        value: function render() {
            return _react2.default.createElement(
                _react2.default.Fragment,
                null,
                _react2.default.createElement(
                    'div',
                    { className: 'mobile-widget', onClick: this.handleWidgetClick },
                    _react2.default.createElement(_trade_params2.default, { is_minimized: true })
                ),
                _react2.default.createElement(
                    _full_screen_dialog2.default,
                    {
                        title: 'Set parameters',
                        visible: this.state.open,
                        onClose: this.handleDialogClose
                    },
                    _react2.default.createElement(_trade_params2.default, { is_nativepicker: true })
                )
            );
        }
    }]);

    return MobileWidget;
}(_react2.default.PureComponent);

exports.default = MobileWidget;

/***/ }),
/* 484 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _propTypes = __webpack_require__(4);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = __webpack_require__(2);

var _react2 = _interopRequireDefault(_react);

var _full_screen_dialog = __webpack_require__(244);

var _full_screen_dialog2 = _interopRequireDefault(_full_screen_dialog);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ContractTypeDialog = function ContractTypeDialog(_ref) {
    var children = _ref.children,
        is_mobile = _ref.is_mobile,
        open = _ref.open,
        onClose = _ref.onClose;
    return is_mobile ? _react2.default.createElement(
        _react2.default.Fragment,
        null,
        _react2.default.createElement('span', { className: 'select-arrow' }),
        _react2.default.createElement(
            _full_screen_dialog2.default,
            {
                title: 'Select Trading Type',
                visible: open,
                onClose: onClose
            },
            children
        )
    ) : _react2.default.createElement(
        'div',
        { className: 'contracts-popup-list' },
        _react2.default.createElement(
            'div',
            { className: 'list-container' },
            children
        )
    );
};

ContractTypeDialog.propTypes = {
    children: _propTypes2.default.element,
    is_mobile: _propTypes2.default.bool,
    open: _propTypes2.default.bool,
    onClose: _propTypes2.default.func
};

exports.default = ContractTypeDialog;

/***/ }),
/* 485 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _mobxReact = __webpack_require__(28);

var _propTypes = __webpack_require__(4);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = __webpack_require__(2);

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ContractTypeItem = function ContractTypeItem(_ref) {
    var contracts = _ref.contracts,
        name = _ref.name,
        value = _ref.value,
        handleSelect = _ref.handleSelect;
    return contracts.map(function (contract, idx) {
        return _react2.default.createElement(
            'div',
            {
                key: idx,
                className: 'list-item ' + (value === contract.value ? 'selected' : ''),
                name: name,
                value: contract.value,
                onClick: function onClick() {
                    return handleSelect(contract);
                }
            },
            _react2.default.createElement('i', { className: 'contract-icon ic-' + contract.value + (value === contract.value ? '' : '--invert') }),
            _react2.default.createElement(
                'span',
                { className: 'contract-title' },
                contract.text
            )
        );
    });
};

ContractTypeItem.propTypes = {
    contracts: _mobxReact.PropTypes.arrayOrObservableArray,
    name: _propTypes2.default.string,
    value: _propTypes2.default.string,
    handleSelect: _propTypes2.default.func
};

exports.default = ContractTypeItem;

/***/ }),
/* 486 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _mobxReact = __webpack_require__(28);

var _propTypes = __webpack_require__(4);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = __webpack_require__(2);

var _react2 = _interopRequireDefault(_react);

var _contract_type_item = __webpack_require__(485);

var _contract_type_item2 = _interopRequireDefault(_contract_type_item);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ContractTypeList = function ContractTypeList(_ref) {
    var handleSelect = _ref.handleSelect,
        list = _ref.list,
        name = _ref.name,
        value = _ref.value;
    return Object.keys(list).map(function (key) {
        return _react2.default.createElement(
            _react2.default.Fragment,
            { key: key },
            _react2.default.createElement(
                'div',
                { className: 'list-group' },
                _react2.default.createElement(
                    'div',
                    { className: 'list-label' },
                    _react2.default.createElement(
                        'span',
                        null,
                        key
                    )
                ),
                _react2.default.createElement(
                    'div',
                    { className: 'list-items' },
                    _react2.default.createElement(_contract_type_item2.default, {
                        contracts: list[key],
                        name: name,
                        value: value,
                        handleSelect: handleSelect
                    })
                )
            )
        );
    });
};

ContractTypeList.propTypes = {
    handleSelect: _propTypes2.default.func,
    list: _mobxReact.PropTypes.objectOrObservableObject,
    name: _propTypes2.default.string,
    value: _propTypes2.default.string
};

exports.default = ContractTypeList;

/***/ }),
/* 487 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _propTypes = __webpack_require__(4);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = __webpack_require__(2);

var _react2 = _interopRequireDefault(_react);

var _contract_type_dialog = __webpack_require__(484);

var _contract_type_dialog2 = _interopRequireDefault(_contract_type_dialog);

var _contract_type_list = __webpack_require__(486);

var _contract_type_list2 = _interopRequireDefault(_contract_type_list);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ContractTypeWidget = function (_React$PureComponent) {
    _inherits(ContractTypeWidget, _React$PureComponent);

    function ContractTypeWidget(props) {
        _classCallCheck(this, ContractTypeWidget);

        var _this = _possibleConstructorReturn(this, (ContractTypeWidget.__proto__ || Object.getPrototypeOf(ContractTypeWidget)).call(this, props));

        _this.handleSelect = function (item) {
            if (item.value !== _this.props.value) {
                _this.props.onChange({ target: { name: _this.props.name, value: item.value } });
            }
            _this.handleVisibility();
        };

        _this.setWrapperRef = function (node) {
            _this.wrapper_ref = node;
        };

        _this.handleClickOutside = function (event) {
            if (_this.wrapper_ref && !_this.wrapper_ref.contains(event.target) && _this.state.is_dialog_open) {
                _this.setState({ is_dialog_open: false });
            }
        };

        _this.handleVisibility = function () {
            _this.setState({ is_dialog_open: !_this.state.is_dialog_open });
        };

        _this.getDisplayText = function () {
            var _this$props = _this.props,
                list = _this$props.list,
                value = _this$props.value;

            var findInArray = function findInArray(arr_list) {
                return (arr_list.find(function (item) {
                    return item.value === value;
                }) || {}).text;
            };
            var text = '';
            if (list) {
                Object.keys(list).some(function (key) {
                    text = findInArray(list[key]);
                    return text;
                });
            }
            return text;
        };

        _this.getStyles = function () {
            var container_classes = ['contracts-popup-container'];
            if (_this.props.is_mobile) {
                container_classes.push('mobile-only');
            } else {
                container_classes.push('desktop-only');
            }
            if (_this.state.is_dialog_open) container_classes.push('show');
            return container_classes;
        };

        _this.state = {
            is_dialog_open: false
        };
        return _this;
    }

    _createClass(ContractTypeWidget, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            document.addEventListener('mousedown', this.handleClickOutside);
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            document.removeEventListener('mousedown', this.handleClickOutside);
        }
    }, {
        key: 'render',
        value: function render() {
            var container_classes = this.getStyles();

            return _react2.default.createElement(
                'div',
                {
                    ref: this.setWrapperRef,
                    className: container_classes.join(' '),
                    onClick: this.handleVisibility,
                    onBlur: this.handleVisibility
                },
                _react2.default.createElement(
                    'div',
                    {
                        className: 'contracts-popup-display ' + (this.state.is_dialog_open ? 'clicked' : '')
                    },
                    _react2.default.createElement('i', { className: 'contract-icon ic-' + this.props.value + '--invert' }),
                    _react2.default.createElement(
                        'span',
                        { name: this.props.name, value: this.props.value },
                        this.getDisplayText()
                    )
                ),
                _react2.default.createElement('span', { className: 'select-arrow' }),
                _react2.default.createElement(
                    _contract_type_dialog2.default,
                    {
                        is_mobile: this.props.is_mobile,
                        open: this.state.is_dialog_open,
                        onClose: this.handleVisibility
                    },
                    _react2.default.createElement(_contract_type_list2.default, {
                        list: this.props.list,
                        name: this.props.name,
                        value: this.props.value,
                        handleSelect: this.handleSelect
                    })
                )
            );
        }
    }]);

    return ContractTypeWidget;
}(_react2.default.PureComponent);

ContractTypeWidget.propTypes = {
    is_mobile: _propTypes2.default.bool,
    list: _propTypes2.default.object,
    name: _propTypes2.default.string,
    onChange: _propTypes2.default.func,
    value: _propTypes2.default.string
};

exports.default = ContractTypeWidget;

/***/ }),
/* 488 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _propTypes = __webpack_require__(4);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = __webpack_require__(2);

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ErrorGeneral = function ErrorGeneral(_ref) {
    var message = _ref.message;
    return _react2.default.createElement(
        'div',
        { className: 'info-text' },
        message
    );
};

ErrorGeneral.propTypes = {
    message: _propTypes2.default.string
};

exports.default = ErrorGeneral;

/***/ }),
/* 489 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = __webpack_require__(2);

var _react2 = _interopRequireDefault(_react);

var _button = __webpack_require__(126);

var _button2 = _interopRequireDefault(_button);

var _login = __webpack_require__(34);

var _localize = __webpack_require__(0);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ErrorLogin = function ErrorLogin() {
    return _react2.default.createElement(
        'div',
        { className: 'purchase-login-wrapper' },
        _react2.default.createElement(
            'span',
            { className: 'info-text' },
            (0, _localize.localize)('Please log in to purchase the contract')
        ),
        _react2.default.createElement(_button2.default, {
            className: 'secondary orange',
            has_effect: true,
            text: (0, _localize.localize)('log in'),
            onClick: _login.redirectToLogin
        }),
        _react2.default.createElement(
            'p',
            null,
            (0, _localize.localize)('Don\'t have a [_1] account?', ['Binary.com'])
        ),
        _react2.default.createElement(
            'a',
            { href: 'javascript:;' },
            _react2.default.createElement(
                'span',
                { className: 'info-text' },
                (0, _localize.localize)('Create one now')
            )
        )
    );
};

exports.default = ErrorLogin;

/***/ }),
/* 490 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _message_box = __webpack_require__(491);

var _message_box2 = _interopRequireDefault(_message_box);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _message_box2.default;

/***/ }),
/* 491 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _propTypes = __webpack_require__(4);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = __webpack_require__(2);

var _react2 = _interopRequireDefault(_react);

var _error_general = __webpack_require__(488);

var _error_general2 = _interopRequireDefault(_error_general);

var _error_login = __webpack_require__(489);

var _error_login2 = _interopRequireDefault(_error_login);

var _purchase_result = __webpack_require__(492);

var _purchase_result2 = _interopRequireDefault(_purchase_result);

var _utility = __webpack_require__(3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var MessageBox = function MessageBox(_ref) {
    var purchase_info = _ref.purchase_info;

    var has_error = !!purchase_info.error;
    var ErrorComponent = void 0;
    if (has_error) {
        var error_code = (0, _utility.getPropertyValue)(purchase_info, ['error', 'code']);
        switch (error_code) {
            case 'AuthorizationRequired':
                ErrorComponent = _react2.default.createElement(_error_login2.default, null);
                break;
            default:
                ErrorComponent = _react2.default.createElement(_error_general2.default, { message: purchase_info.error.message });
                break;
        }
    }

    return _react2.default.createElement(
        'div',
        { className: 'purchase-error' },
        has_error ? ErrorComponent : _react2.default.createElement(_purchase_result2.default, { purchase_info: purchase_info.buy })
    );
};

MessageBox.propTypes = {
    purchase_info: _propTypes2.default.object
};

exports.default = MessageBox;

/***/ }),
/* 492 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _propTypes = __webpack_require__(4);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = __webpack_require__(2);

var _react2 = _interopRequireDefault(_react);

var _Date = __webpack_require__(107);

var _localize = __webpack_require__(0);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var PurchaseResult = function PurchaseResult(_ref) {
    var purchase_info = _ref.purchase_info;
    return _react2.default.createElement(
        'div',
        { className: 'info-text' },
        _react2.default.createElement(
            'div',
            null,
            _react2.default.createElement(
                'strong',
                null,
                (0, _localize.localize)('Purchase Info'),
                ':'
            )
        ),
        _react2.default.createElement(
            'div',
            null,
            (0, _localize.localize)('Buy Price'),
            ': ',
            purchase_info.buy_price
        ),
        _react2.default.createElement(
            'div',
            null,
            (0, _localize.localize)('Payout'),
            ': ',
            purchase_info.payout
        ),
        _react2.default.createElement(
            'div',
            null,
            (0, _localize.localize)('Start'),
            ': ',
            (0, _Date.toGMTFormat)(purchase_info.start_time * 1000)
        ),
        _react2.default.createElement(
            'div',
            null,
            (0, _localize.localize)('Contract ID'),
            ': ',
            purchase_info.contract_id
        ),
        _react2.default.createElement(
            'div',
            null,
            (0, _localize.localize)('Transaction ID'),
            ': ',
            purchase_info.transaction_id
        ),
        _react2.default.createElement(
            'div',
            null,
            (0, _localize.localize)('Description'),
            ': ',
            purchase_info.longcode
        )
    );
};

PurchaseResult.propTypes = {
    purchase_info: _propTypes2.default.object
};

exports.default = PurchaseResult;

/***/ }),
/* 493 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _propTypes = __webpack_require__(4);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = __webpack_require__(2);

var _react2 = _interopRequireDefault(_react);

var _money = __webpack_require__(445);

var _money2 = _interopRequireDefault(_money);

var _tooltip = __webpack_require__(164);

var _tooltip2 = _interopRequireDefault(_tooltip);

var _localize = __webpack_require__(0);

var _url = __webpack_require__(10);

var _url2 = _interopRequireDefault(_url);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ContractInfo = function ContractInfo(_ref) {
    var barrier_count = _ref.barrier_count,
        contract_title = _ref.contract_title,
        contract_type = _ref.contract_type,
        currency = _ref.currency,
        proposal_info = _ref.proposal_info;

    var icon_type = ('' + contract_type + (/^(call|put)$/i.test(contract_type) && barrier_count > 0 ? '_barrier' : '')).toLowerCase();

    return _react2.default.createElement(
        'div',
        { className: 'box' },
        _react2.default.createElement(
            'div',
            { className: 'left-column' },
            _react2.default.createElement(
                'div',
                { className: 'type-wrapper' },
                _react2.default.createElement('img', {
                    className: 'type',
                    src: _url2.default.urlForStatic('images/app_2/contracts/types/light/ic_' + icon_type + '.svg')
                })
            ),
            _react2.default.createElement(
                'h4',
                { className: 'trade-type' },
                contract_title
            )
        ),
        proposal_info.has_error || !proposal_info.id ? _react2.default.createElement(
            'div',
            { className: proposal_info.has_error ? 'error-info-wrapper' : '' },
            _react2.default.createElement(
                'span',
                null,
                proposal_info.message
            )
        ) : _react2.default.createElement(
            'div',
            { className: 'purchase-info-wrapper' },
            _react2.default.createElement(
                'div',
                { className: 'stake-wrapper' },
                _react2.default.createElement(
                    'span',
                    null,
                    _react2.default.createElement(
                        'strong',
                        null,
                        (0, _localize.localize)('Stake'),
                        ':'
                    ),
                    _react2.default.createElement(_money2.default, { amount: proposal_info.stake, currency: currency })
                ),
                _react2.default.createElement(
                    'span',
                    { className: 'field-info' },
                    _react2.default.createElement(_tooltip2.default, { alignment: 'left', icon: 'info', message: proposal_info.message })
                )
            ),
            _react2.default.createElement(
                'div',
                null,
                _react2.default.createElement(
                    'strong',
                    null,
                    (0, _localize.localize)('Payout'),
                    ':'
                ),
                _react2.default.createElement(_money2.default, { amount: proposal_info.payout, currency: currency })
            ),
            _react2.default.createElement(
                'div',
                null,
                _react2.default.createElement(
                    'strong',
                    null,
                    (0, _localize.localize)('Net Profit'),
                    ':'
                ),
                _react2.default.createElement(_money2.default, { amount: proposal_info.profit, currency: currency })
            ),
            _react2.default.createElement(
                'div',
                null,
                _react2.default.createElement(
                    'strong',
                    null,
                    (0, _localize.localize)('Return'),
                    ':'
                ),
                proposal_info.returns
            )
        )
    );
};

ContractInfo.propTypes = {
    barrier_count: _propTypes2.default.number,
    contract_title: _propTypes2.default.string,
    contract_type: _propTypes2.default.string,
    currency: _propTypes2.default.string,
    proposal_info: _propTypes2.default.object
};

exports.default = ContractInfo;

/***/ }),
/* 494 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _classnames = __webpack_require__(18);

var _classnames2 = _interopRequireDefault(_classnames);

var _mobxReact = __webpack_require__(28);

var _propTypes = __webpack_require__(4);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = __webpack_require__(2);

var _react2 = _interopRequireDefault(_react);

var _dropdown = __webpack_require__(127);

var _dropdown2 = _interopRequireDefault(_dropdown);

var _fieldset = __webpack_require__(95);

var _fieldset2 = _interopRequireDefault(_fieldset);

var _input_field = __webpack_require__(165);

var _input_field2 = _interopRequireDefault(_input_field);

var _client_base = __webpack_require__(22);

var _client_base2 = _interopRequireDefault(_client_base);

var _currency_base = __webpack_require__(33);

var _localize = __webpack_require__(0);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Amount = function Amount(_ref) {
    var amount = _ref.amount,
        basis = _ref.basis,
        basis_list = _ref.basis_list,
        currencies_list = _ref.currencies_list,
        currency = _ref.currency,
        is_minimized = _ref.is_minimized,
        is_nativepicker = _ref.is_nativepicker,
        onChange = _ref.onChange;

    if (is_minimized) {
        return _react2.default.createElement(
            'div',
            { className: 'fieldset-minimized amount' },
            _react2.default.createElement('span', { className: 'icon invest-amount' }),
            _react2.default.createElement(
                'span',
                { className: 'fieldset-minimized__basis' },
                (basis_list.find(function (o) {
                    return o.value === basis;
                }) || {}).text
            ),
            '\xA0',
            _react2.default.createElement(
                'i',
                null,
                _react2.default.createElement('span', { className: 'symbols ' + (currency || '').toLowerCase() })
            ),
            (0, _currency_base.addComma)(amount, 2)
        );
    }
    var has_currency = _client_base2.default.get('currency');
    var amount_container_class = (0, _classnames2.default)('amount-container', {
        'three-columns': !has_currency
    });

    return _react2.default.createElement(
        _fieldset2.default,
        {
            header: (0, _localize.localize)('Invest Amount'),
            icon: 'invest-amount'
        },
        _react2.default.createElement(
            'div',
            { className: amount_container_class },
            _react2.default.createElement(_dropdown2.default, {
                list: basis_list,
                value: basis,
                name: 'basis',
                onChange: onChange,
                is_nativepicker: is_nativepicker
            }),
            !has_currency && _react2.default.createElement(_dropdown2.default, {
                list: currencies_list,
                value: currency,
                name: 'currency',
                onChange: onChange,
                is_nativepicker: is_nativepicker
            }),
            _react2.default.createElement(_input_field2.default, {
                type: 'number',
                name: 'amount',
                value: amount,
                onChange: onChange,
                is_currency: true,
                prefix: has_currency ? currency : null,
                is_nativepicker: is_nativepicker
            })
        )
    );
};

Amount.propTypes = {
    amount: _propTypes2.default.number,
    basis: _propTypes2.default.string,
    basis_list: _mobxReact.PropTypes.arrayOrObservableArray,
    currencies_list: _propTypes2.default.object,
    currency: _propTypes2.default.string,
    is_minimized: _propTypes2.default.bool,
    is_nativepicker: _propTypes2.default.bool,
    onChange: _propTypes2.default.func
};

exports.default = (0, _mobxReact.observer)(Amount);

/***/ }),
/* 495 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _mobxReact = __webpack_require__(28);

var _propTypes = __webpack_require__(4);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = __webpack_require__(2);

var _react2 = _interopRequireDefault(_react);

var _fieldset = __webpack_require__(95);

var _fieldset2 = _interopRequireDefault(_fieldset);

var _input_field = __webpack_require__(165);

var _input_field2 = _interopRequireDefault(_input_field);

var _localize = __webpack_require__(0);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Barrier = function Barrier(_ref) {
    var barrier_1 = _ref.barrier_1,
        barrier_2 = _ref.barrier_2,
        barrier_count = _ref.barrier_count,
        is_minimized = _ref.is_minimized,
        onChange = _ref.onChange;

    if (is_minimized) {
        if (barrier_count !== 2) {
            return _react2.default.createElement(
                'div',
                { className: 'fieldset-minimized barrier1' },
                _react2.default.createElement('span', { className: 'icon barriers' }),
                barrier_1
            );
        }
        return _react2.default.createElement(
            _react2.default.Fragment,
            null,
            _react2.default.createElement(
                'div',
                { className: 'fieldset-minimized barrier1' },
                _react2.default.createElement('span', { className: 'icon barriers' }),
                barrier_1
            ),
            _react2.default.createElement(
                'div',
                { className: 'fieldset-minimized barrier2' },
                _react2.default.createElement('span', { className: 'icon barriers' }),
                barrier_2
            )
        );
    }
    return _react2.default.createElement(
        _fieldset2.default,
        {
            header: (0, _localize.localize)(barrier_count > 1 ? 'Barriers' : 'Barrier'),
            icon: 'barriers'
        },
        _react2.default.createElement(_input_field2.default, {
            type: 'text',
            name: 'barrier_1',
            value: barrier_1,
            onChange: onChange
        }),
        barrier_count === 2 && _react2.default.createElement(_input_field2.default, {
            type: 'text',
            name: 'barrier_2',
            value: barrier_2,
            onChange: onChange,
            is_currency: true
        })
    );
};

Barrier.propTypes = {
    barrier_1: _propTypes2.default.string,
    barrier_2: _propTypes2.default.string,
    barrier_count: _propTypes2.default.number,
    is_minimized: _propTypes2.default.bool,
    onChange: _propTypes2.default.func
};

exports.default = (0, _mobxReact.observer)(Barrier);

/***/ }),
/* 496 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _mobxReact = __webpack_require__(28);

var _moment = __webpack_require__(9);

var _moment2 = _interopRequireDefault(_moment);

var _propTypes = __webpack_require__(4);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = __webpack_require__(2);

var _react2 = _interopRequireDefault(_react);

var _DatePicker = __webpack_require__(235);

var _DatePicker2 = _interopRequireDefault(_DatePicker);

var _dropdown = __webpack_require__(127);

var _dropdown2 = _interopRequireDefault(_dropdown);

var _fieldset = __webpack_require__(95);

var _fieldset2 = _interopRequireDefault(_fieldset);

var _input_field = __webpack_require__(165);

var _input_field2 = _interopRequireDefault(_input_field);

var _time_picker = __webpack_require__(236);

var _time_picker2 = _interopRequireDefault(_time_picker);

var _localize = __webpack_require__(0);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* TODO:
      1. disable days other than today and tomorrow if start date is forward starting
*/

var expiry_list = [{ text: (0, _localize.localize)('Duration'), value: 'duration' }];

var now_date = void 0,
    min_date_duration = void 0,
    max_date_duration = void 0,
    min_date_expiry = void 0,
    start_date_time = void 0;

var Duration = function Duration(_ref) {
    var duration = _ref.duration,
        duration_unit = _ref.duration_unit,
        duration_units_list = _ref.duration_units_list,
        expiry_date = _ref.expiry_date,
        expiry_time = _ref.expiry_time,
        expiry_type = _ref.expiry_type,
        onChange = _ref.onChange,
        is_minimized = _ref.is_minimized,
        is_nativepicker = _ref.is_nativepicker,
        server_time = _ref.server_time,
        sessions = _ref.sessions,
        start_date = _ref.start_date,
        start_time = _ref.start_time;

    var moment_now = (0, _moment2.default)(server_time);
    if (!now_date || moment_now.date() !== now_date.date()) {
        var moment_today = moment_now.clone().set({ hour: 0, minute: 0, second: 0, millisecond: 0 });

        now_date = moment_now.clone();
        min_date_duration = moment_today.clone().add(1, 'd');
        max_date_duration = moment_today.clone().add(365, 'd');
        min_date_expiry = moment_today.clone();
    }
    var moment_expiry = _moment2.default.utc(expiry_date);
    var is_same_day = moment_expiry.isSame((0, _moment2.default)(start_date * 1000 || undefined).utc(), 'day');
    if (is_same_day) {
        var date_time = _moment2.default.utc(start_date * 1000 || undefined);
        if (start_date) {
            var _start_time$split = start_time.split(':'),
                _start_time$split2 = _slicedToArray(_start_time$split, 2),
                hour = _start_time$split2[0],
                minute = _start_time$split2[1];

            date_time.hour(hour).minute(minute).second(0).add(5, 'minutes');
        }
        // only update start time every five minutes, since time picker shows five minute durations
        var moment_start_date_time = _moment2.default.unix(start_date_time);
        if (!start_date_time || moment_start_date_time.isAfter(date_time) || moment_start_date_time.clone().add(5, 'minutes').isBefore(date_time) || moment_start_date_time.minutes() !== date_time.minutes() && date_time.minutes() % 5 === 0) {
            start_date_time = date_time.unix();
        }
    }
    if (is_minimized) {
        var duration_unit_text = (duration_units_list.find(function (o) {
            return o.value === duration_unit;
        }) || {}).text;
        return _react2.default.createElement(
            'div',
            { className: 'fieldset-minimized duration' },
            _react2.default.createElement('span', { className: 'icon trade-duration' }),
            expiry_type === 'duration' ? duration + ' ' + duration_unit_text : moment_expiry.format('ddd - DD MMM, YYYY') + '\n' + expiry_time
        );
    }

    var has_end_time = expiry_list.find(function (expiry) {
        return expiry.value === 'endtime';
    });
    if (duration_units_list.length === 1 && duration_unit === 't') {
        if (has_end_time) {
            expiry_list.pop(); // remove end time for contracts with only tick duration
        }
    } else if (!has_end_time) {
        expiry_list.push({ text: (0, _localize.localize)('End Time'), value: 'endtime' });
    }

    return _react2.default.createElement(
        _fieldset2.default,
        {
            header: (0, _localize.localize)('Trade Duration'),
            icon: 'trade-duration'
        },
        _react2.default.createElement(_dropdown2.default, {
            list: expiry_list,
            value: expiry_type,
            name: 'expiry_type',
            onChange: onChange,
            is_nativepicker: is_nativepicker
        }),
        expiry_type === 'duration' ? _react2.default.createElement(
            _react2.default.Fragment,
            null,
            _react2.default.createElement(
                'div',
                { className: 'duration-container' },
                duration_unit === 'd' && !is_nativepicker ? _react2.default.createElement(_DatePicker2.default, {
                    name: 'duration',
                    min_date: min_date_duration,
                    max_date: max_date_duration,
                    mode: 'duration',
                    onChange: onChange,
                    value: duration || 1 // TODO: replace 1 with min duration
                    , is_read_only: true,
                    is_clearable: false,
                    is_nativepicker: is_nativepicker,
                    footer: (0, _localize.localize)('The minimum duration is 1 day')
                }) : _react2.default.createElement(_input_field2.default, {
                    type: 'number',
                    name: 'duration',
                    value: duration,
                    onChange: onChange,
                    is_nativepicker: is_nativepicker
                }),
                _react2.default.createElement(_dropdown2.default, {
                    list: duration_units_list,
                    value: duration_unit,
                    name: 'duration_unit',
                    onChange: onChange,
                    is_nativepicker: is_nativepicker
                })
            )
        ) : _react2.default.createElement(
            _react2.default.Fragment,
            null,
            _react2.default.createElement(
                'div',
                { className: 'endtime-container' },
                _react2.default.createElement(_DatePicker2.default, {
                    name: 'expiry_date',
                    has_today_btn: true,
                    min_date: min_date_expiry,
                    max_date: max_date_duration,
                    onChange: onChange,
                    value: expiry_date,
                    is_read_only: true,
                    is_clearable: false,
                    is_nativepicker: is_nativepicker
                }),
                is_same_day && _react2.default.createElement(_time_picker2.default, {
                    onChange: onChange,
                    is_align_right: true,
                    name: 'expiry_time',
                    value: expiry_time,
                    placeholder: '12:00',
                    start_date: start_date_time,
                    sessions: sessions,
                    is_clearable: false,
                    is_nativepicker: is_nativepicker
                })
            )
        )
    );
};

// ToDo: Refactor Duration.jsx and date_picker.jsx
Duration.propTypes = {
    duration: _propTypes2.default.oneOfType([_propTypes2.default.number, _propTypes2.default.string]),
    duration_unit: _propTypes2.default.string,
    duration_units_list: _mobxReact.PropTypes.arrayOrObservableArray,
    expiry_date: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.number]),
    expiry_time: _propTypes2.default.string,
    expiry_type: _propTypes2.default.string,
    is_minimized: _propTypes2.default.bool,
    is_nativepicker: _propTypes2.default.bool,
    onChange: _propTypes2.default.func,
    server_time: _propTypes2.default.object,
    sessions: _mobxReact.PropTypes.arrayOrObservableArray,
    start_date: _propTypes2.default.number,
    start_time: _propTypes2.default.string
};

exports.default = (0, _mobxReact.observer)(Duration);

/***/ }),
/* 497 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _mobxReact = __webpack_require__(28);

var _propTypes = __webpack_require__(4);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = __webpack_require__(2);

var _react2 = _interopRequireDefault(_react);

var _dropdown = __webpack_require__(127);

var _dropdown2 = _interopRequireDefault(_dropdown);

var _fieldset = __webpack_require__(95);

var _fieldset2 = _interopRequireDefault(_fieldset);

var _localize = __webpack_require__(0);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var last_digit_numbers = [].concat(_toConsumableArray(Array(10).keys())).map(function (number) {
    return {
        text: number,
        value: number
    };
});

var LastDigit = function LastDigit(_ref) {
    var is_minimized = _ref.is_minimized,
        is_nativepicker = _ref.is_nativepicker,
        last_digit = _ref.last_digit,
        onChange = _ref.onChange;

    if (is_minimized) {
        return _react2.default.createElement(
            'div',
            { className: 'fieldset-minimized' },
            _react2.default.createElement('span', { className: 'icon digits' }),
            (0, _localize.localize)('Last Digit') + ': ' + last_digit
        );
    }
    return _react2.default.createElement(
        _fieldset2.default,
        {
            header: (0, _localize.localize)('Last Digit Prediction'),
            icon: 'digits'
        },
        _react2.default.createElement(_dropdown2.default, {
            list: last_digit_numbers,
            value: last_digit,
            name: 'last_digit',
            onChange: onChange,
            is_nativepicker: is_nativepicker
        })
    );
};

LastDigit.propTypes = {
    is_minimized: _propTypes2.default.bool,
    is_nativepicker: _propTypes2.default.bool,
    last_digit: _propTypes2.default.number,
    onChange: _propTypes2.default.func
};

exports.default = (0, _mobxReact.observer)(LastDigit);

/***/ }),
/* 498 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _mobxReact = __webpack_require__(28);

var _propTypes = __webpack_require__(4);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = __webpack_require__(2);

var _react2 = _interopRequireDefault(_react);

var _dropdown = __webpack_require__(127);

var _dropdown2 = _interopRequireDefault(_dropdown);

var _fieldset = __webpack_require__(95);

var _fieldset2 = _interopRequireDefault(_fieldset);

var _time_picker = __webpack_require__(236);

var _time_picker2 = _interopRequireDefault(_time_picker);

var _localize = __webpack_require__(0);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* TODO:
    1. update sessions list when the selected one doesn’t have any enabled time
*/

var StartDate = function StartDate(_ref) {
    var is_minimized = _ref.is_minimized,
        is_nativepicker = _ref.is_nativepicker,
        onChange = _ref.onChange,
        sessions = _ref.sessions,
        start_date = _ref.start_date,
        start_dates_list = _ref.start_dates_list,
        start_time = _ref.start_time;

    // Number(0) refers to 'now'
    var is_today = start_date === Number(0);
    var current_date_config = '';
    if (!is_today) {
        current_date_config = start_dates_list.find(function (o) {
            return o.value === +start_date;
        }) || {};
    }
    if (is_minimized) {
        return _react2.default.createElement(
            'div',
            { className: 'fieldset-minimized start-date' },
            _react2.default.createElement('span', { className: 'icon start-time' }),
            is_today ? (0, _localize.localize)('Now') : current_date_config.text + '\n' + start_time
        );
    }
    return _react2.default.createElement(
        _fieldset2.default,
        {
            header: (0, _localize.localize)('Start time'),
            icon: 'start-time'
        },
        _react2.default.createElement(_dropdown2.default, {
            name: 'start_date',
            value: start_date,
            list: start_dates_list,
            onChange: onChange,
            is_nativepicker: is_nativepicker
        }),
        !is_today && _react2.default.createElement(
            _react2.default.Fragment,
            null,
            _react2.default.createElement(_time_picker2.default, {
                onChange: onChange,
                name: 'start_time',
                value: start_time,
                placeholder: '12:00',
                start_date: start_date,
                sessions: sessions,
                is_clearable: false,
                is_nativepicker: is_nativepicker
            })
        )
    );
};

StartDate.propTypes = {
    is_minimized: _propTypes2.default.bool,
    is_nativepicker: _propTypes2.default.bool,
    onChange: _propTypes2.default.func,
    start_date: _propTypes2.default.number,
    start_dates_list: _mobxReact.PropTypes.arrayOrObservableArray,
    start_time: _propTypes2.default.string,
    sessions: _mobxReact.PropTypes.arrayOrObservableArray
};

exports.default = (0, _mobxReact.observer)(StartDate);

/***/ }),
/* 499 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _propTypes = __webpack_require__(4);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = __webpack_require__(2);

var _react2 = _interopRequireDefault(_react);

var _screen_large = __webpack_require__(500);

var _screen_large2 = _interopRequireDefault(_screen_large);

var _screen_small = __webpack_require__(501);

var _screen_small2 = _interopRequireDefault(_screen_small);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var FormLayout = function FormLayout(_ref) {
    var is_mobile = _ref.is_mobile,
        is_trade_enabled = _ref.is_trade_enabled;
    return is_mobile ? _react2.default.createElement(_screen_small2.default, { is_trade_enabled: is_trade_enabled }) : _react2.default.createElement(_screen_large2.default, { is_trade_enabled: is_trade_enabled });
};

FormLayout.propTypes = {
    is_mobile: _propTypes2.default.bool,
    is_trade_enabled: _propTypes2.default.bool
};

exports.default = FormLayout;

/***/ }),
/* 500 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _propTypes = __webpack_require__(4);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = __webpack_require__(2);

var _react2 = _interopRequireDefault(_react);

var _contract_type = __webpack_require__(245);

var _contract_type2 = _interopRequireDefault(_contract_type);

var _purchase = __webpack_require__(502);

var _purchase2 = _interopRequireDefault(_purchase);

var _trade_params = __webpack_require__(246);

var _trade_params2 = _interopRequireDefault(_trade_params);

var _ui_loader = __webpack_require__(234);

var _ui_loader2 = _interopRequireDefault(_ui_loader);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ScreenLarge = function ScreenLarge(_ref) {
    var is_trade_enabled = _ref.is_trade_enabled;
    return _react2.default.createElement(
        'div',
        { className: 'sidebar-container desktop-only' },
        _react2.default.createElement(
            'div',
            { className: 'sidebar-items' },
            !is_trade_enabled ? _react2.default.createElement(_ui_loader2.default, null) : _react2.default.createElement(
                _react2.default.Fragment,
                null,
                _react2.default.createElement(
                    'fieldset',
                    { className: 'trade-types' },
                    _react2.default.createElement(_contract_type2.default, null)
                ),
                _react2.default.createElement(_trade_params2.default, null),
                _react2.default.createElement(
                    'div',
                    { className: 'purchase-wrapper' },
                    _react2.default.createElement(_purchase2.default, null)
                )
            )
        )
    );
};

ScreenLarge.propTypes = {
    is_trade_enabled: _propTypes2.default.bool
};

exports.default = ScreenLarge;

/***/ }),
/* 501 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _propTypes = __webpack_require__(4);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = __webpack_require__(2);

var _react2 = _interopRequireDefault(_react);

var _mobile_widget = __webpack_require__(483);

var _mobile_widget2 = _interopRequireDefault(_mobile_widget);

var _contract_type = __webpack_require__(245);

var _contract_type2 = _interopRequireDefault(_contract_type);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ScreenSmall = function ScreenSmall() {
    return (/* { is_trade_enabled } */_react2.default.createElement(
            _react2.default.Fragment,
            null,
            _react2.default.createElement(_contract_type2.default, null),
            _react2.default.createElement(
                'div',
                { className: 'mobile-only' },
                _react2.default.createElement(_mobile_widget2.default, null)
            )
        )
    );
};

ScreenSmall.propTypes = {
    is_trade_enabled: _propTypes2.default.bool
};

exports.default = ScreenSmall;

/***/ }),
/* 502 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _propTypes = __webpack_require__(4);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = __webpack_require__(2);

var _react2 = _interopRequireDefault(_react);

var _contract_info = __webpack_require__(493);

var _contract_info2 = _interopRequireDefault(_contract_info);

var _MessageBox = __webpack_require__(490);

var _MessageBox2 = _interopRequireDefault(_MessageBox);

var _PopConfirm = __webpack_require__(435);

var _ui_loader = __webpack_require__(234);

var _ui_loader2 = _interopRequireDefault(_ui_loader);

var _button = __webpack_require__(126);

var _button2 = _interopRequireDefault(_button);

var _fieldset = __webpack_require__(95);

var _fieldset2 = _interopRequireDefault(_fieldset);

var _connect = __webpack_require__(26);

var _localize = __webpack_require__(0);

var _utility = __webpack_require__(3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Purchase = function Purchase(_ref) {
    var barrier_count = _ref.barrier_count,
        currency = _ref.currency,
        is_purchase_confirm_on = _ref.is_purchase_confirm_on,
        is_purchase_enabled = _ref.is_purchase_enabled,
        is_purchase_locked = _ref.is_purchase_locked,
        is_trade_enabled = _ref.is_trade_enabled,
        onClickPurchase = _ref.onClickPurchase,
        onHoverPurchase = _ref.onHoverPurchase,
        proposal_info = _ref.proposal_info,
        purchase_info = _ref.purchase_info,
        trade_types = _ref.trade_types;
    return Object.keys(trade_types).map(function (type, idx) {
        var info = proposal_info[type] || {};
        var is_disabled = !is_purchase_enabled || !is_trade_enabled || !info.id || is_purchase_locked;

        var purchase_button = _react2.default.createElement(_button2.default, {
            is_disabled: is_disabled,
            id: 'purchase_' + type,
            className: 'primary green',
            has_effect: true,
            text: (0, _localize.localize)('Purchase'),
            onClick: function onClick() {
                onClickPurchase(info.id, info.stake);
            },
            wrapperClassName: 'submit-section'
        });

        return _react2.default.createElement(
            _fieldset2.default,
            {
                className: 'purchase-option',
                key: idx,
                onMouseEnter: function onMouseEnter() {
                    onHoverPurchase(true, type);
                },
                onMouseLeave: function onMouseLeave() {
                    onHoverPurchase(false);
                }
            },
            !(0, _utility.isEmptyObject)(purchase_info) && purchase_info.echo_req.buy === info.id ? _react2.default.createElement(_MessageBox2.default, { purchase_info: purchase_info }) : _react2.default.createElement(
                _react2.default.Fragment,
                null,
                !is_purchase_enabled && _react2.default.createElement(_ui_loader2.default, null),
                _react2.default.createElement(_contract_info2.default, {
                    barrier_count: barrier_count,
                    contract_title: trade_types[type],
                    contract_type: type,
                    currency: currency,
                    proposal_info: info
                }),
                is_purchase_confirm_on ? _react2.default.createElement(
                    _PopConfirm.PopConfirm,
                    {
                        alignment: 'left',
                        cancel_text: 'Cancel',
                        confirm_text: 'Purchase',
                        message: 'Are you sure you want to purchase this contract?'
                    },
                    purchase_button
                ) : purchase_button
            )
        );
    });
};

Purchase.propTypes = {
    barrier_count: _propTypes2.default.number,
    currency: _propTypes2.default.string,
    is_purchase_enabled: _propTypes2.default.bool,
    is_purchase_confirm_on: _propTypes2.default.bool,
    is_purchase_locked: _propTypes2.default.bool,
    is_trade_enabled: _propTypes2.default.bool,
    onClickPurchase: _propTypes2.default.func,
    onHoverPurchase: _propTypes2.default.func,
    proposal_info: _propTypes2.default.object,
    purchase_info: _propTypes2.default.object,
    trade_types: _propTypes2.default.object
};

exports.default = (0, _connect.connect)(function (_ref2) {
    var modules = _ref2.modules,
        ui = _ref2.ui;
    return {
        barrier_count: modules.trade.barrier_count,
        is_purchase_enabled: modules.trade.is_purchase_enabled,
        is_trade_enabled: modules.trade.is_trade_enabled,
        onClickPurchase: modules.trade.onPurchase,
        onHoverPurchase: modules.trade.onHoverPurchase,
        proposal_info: modules.trade.proposal_info,
        purchase_info: modules.trade.purchase_info,
        trade_types: modules.trade.trade_types,
        is_purchase_confirm_on: ui.is_purchase_confirm_on,
        is_purchase_locked: ui.is_purchase_lock_on
    };
})(Purchase);

/***/ }),
/* 503 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _mobx = __webpack_require__(41);

var _propTypes = __webpack_require__(4);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = __webpack_require__(2);

var _react2 = _interopRequireDefault(_react);

var _connect = __webpack_require__(26);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Test = function (_React$Component) {
    _inherits(Test, _React$Component);

    function Test() {
        var _ref;

        var _temp, _this, _ret;

        _classCallCheck(this, Test);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Test.__proto__ || Object.getPrototypeOf(Test)).call.apply(_ref, [this].concat(args))), _this), _this.state = { is_visible: false }, _this.setVisibility = _this.stateVisibility.bind(_this), _this.styles = {
            container: {
                fontSize: '10px',
                lineHeight: '15px',
                position: 'absolute',
                zIndex: 1,
                background: 'rgba(0, 0, 0, 0.8)',
                color: '#ccc',
                padding: '10px',
                marginTop: '-10px',
                display: 'none',
                overflowY: 'auto',
                height: '100%'
            },
            prop_name: {
                color: 'yellowgreen'
            }
        }, _this.componentDidMount = function () {
            document.addEventListener('keyup', _this.setVisibility, false);
        }, _this.componentWillUnmount = function () {
            document.removeEventListener('keyup', _this.setVisibility);
        }, _temp), _possibleConstructorReturn(_this, _ret);
    }

    _createClass(Test, [{
        key: 'stateVisibility',
        value: function stateVisibility(e) {
            if (e.ctrlKey && e.keyCode === 83) {
                // Ctrl + S
                this.setState({ is_visible: !this.state.is_visible });
            }
        }
    }, {
        key: 'render',
        value: function render() {
            var _this2 = this;

            return _react2.default.createElement(
                'code',
                { id: 'state_info', style: Object.assign({}, this.styles.container, { display: this.state.is_visible ? 'block' : 'none' }) },
                this.props.entries.sort().map(function (_ref2) {
                    var _ref3 = _slicedToArray(_ref2, 2),
                        k = _ref3[0],
                        v = _ref3[1];

                    return k !== 'root_store' && _react2.default.createElement(
                        'div',
                        { key: k },
                        _react2.default.createElement(
                            'span',
                            { style: _this2.styles.prop_name },
                            k,
                            ':'
                        ),
                        ' ',
                        v && (typeof v === 'undefined' ? 'undefined' : _typeof(v)) === 'object' ? JSON.stringify((0, _mobx.toJS)(v), null, 1) : v
                    );
                })
            );
        }
    }]);

    return Test;
}(_react2.default.Component);

Test.propTypes = {
    entries: _propTypes2.default.array
};

exports.default = (0, _connect.connect)(function (_ref4) {
    var modules = _ref4.modules;
    return {
        entries: Object.entries(modules.trade)
    };
})(Test);

/***/ }),
/* 504 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _classnames = __webpack_require__(18);

var _classnames2 = _interopRequireDefault(_classnames);

var _propTypes = __webpack_require__(4);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = __webpack_require__(2);

var _react2 = _interopRequireDefault(_react);

var _test = __webpack_require__(503);

var _test2 = _interopRequireDefault(_test);

var _form_layout = __webpack_require__(499);

var _form_layout2 = _interopRequireDefault(_form_layout);

var _smartcharts = __webpack_require__(418);

var _smartcharts2 = _interopRequireDefault(_smartcharts);

var _portfolio_drawer = __webpack_require__(446);

var _portfolio_drawer2 = _interopRequireDefault(_portfolio_drawer);

var _connect = __webpack_require__(26);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Trade = function (_React$Component) {
    _inherits(Trade, _React$Component);

    function Trade() {
        _classCallCheck(this, Trade);

        return _possibleConstructorReturn(this, (Trade.__proto__ || Object.getPrototypeOf(Trade)).apply(this, arguments));
    }

    _createClass(Trade, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            this.props.updateQueryString();
        }
    }, {
        key: 'render',
        value: function render() {
            return _react2.default.createElement(
                'div',
                {
                    id: 'trade_container',
                    className: (0, _classnames2.default)('trade-container', {
                        show: this.props.is_portfolio_drawer_on
                    })
                },
                _react2.default.createElement(
                    'div',
                    { className: 'chart-container notice-msg' },
                    _react2.default.createElement(_smartcharts2.default, {
                        chart_barriers: this.props.chart_barriers,
                        initial_symbol: this.props.initial_symbol,
                        is_mobile: this.props.is_mobile,
                        onSymbolChange: this.props.onSymbolChange,
                        is_dark_theme: this.props.is_dark_theme,
                        is_asset_enabled: this.props.is_asset_enabled,
                        is_countdown_enabled: this.props.is_countdown_enabled,
                        is_position_default: this.props.is_position_default
                    }),
                    _react2.default.createElement(_test2.default, null)
                ),
                _react2.default.createElement(_form_layout2.default, { is_mobile: this.props.is_mobile, is_trade_enabled: this.props.is_trade_enabled }),
                _react2.default.createElement(_portfolio_drawer2.default, null)
            );
        }
    }]);

    return Trade;
}(_react2.default.Component);

Trade.propTypes = {
    chart_barriers: _propTypes2.default.object,
    initial_symbol: _propTypes2.default.string,
    is_asset_enabled: _propTypes2.default.bool,
    is_countdown_enabled: _propTypes2.default.bool,
    is_dark_theme: _propTypes2.default.bool,
    is_position_default: _propTypes2.default.bool,
    is_mobile: _propTypes2.default.bool,
    is_portfolio_drawer_on: _propTypes2.default.bool,
    is_purchase_enabled: _propTypes2.default.bool,
    is_trade_enabled: _propTypes2.default.bool,
    onSymbolChange: _propTypes2.default.func,
    server_time: _propTypes2.default.object,
    updateQueryString: _propTypes2.default.func
};

exports.default = (0, _connect.connect)(function (_ref) {
    var common = _ref.common,
        modules = _ref.modules,
        ui = _ref.ui;
    return {
        server_time: common.server_time,
        chart_barriers: modules.trade.chart_barriers,
        initial_symbol: modules.trade.symbol,
        is_purchase_enabled: modules.trade.is_purchase_enabled,
        is_trade_enabled: modules.trade.is_trade_enabled,
        onSymbolChange: modules.trade.onChange,
        updateQueryString: modules.trade.updateQueryString,
        is_dark_theme: ui.is_dark_mode_on,
        is_countdown_enabled: ui.is_chart_countdown_visible,
        is_asset_enabled: ui.is_chart_asset_info_visible,
        is_position_default: ui.is_chart_layout_default,
        is_mobile: ui.is_mobile,
        is_portfolio_drawer_on: ui.is_portfolio_drawer_on
    };
})(Trade);

/***/ }),
/* 505 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _trade = __webpack_require__(504);

var _trade2 = _interopRequireDefault(_trade);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _trade2.default;

/***/ }),
/* 506 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = __webpack_require__(2);

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__(4);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _menu_list = __webpack_require__(507);

var _menu_list2 = _interopRequireDefault(_menu_list);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Menu = function Menu(_ref) {
    var data = _ref.data;
    return _react2.default.createElement(
        'div',
        { className: 'settings-menu' },
        data.map(function (group) {
            return _react2.default.createElement(
                'div',
                { key: group.title },
                _react2.default.createElement(
                    'h2',
                    { className: 'settings-menu__group-header' },
                    group.title
                ),
                _react2.default.createElement('hr', { className: 'settings-menu__separator' }),
                _react2.default.createElement(_menu_list2.default, { items: group.items })
            );
        })
    );
};

Menu.propTypes = {
    data: _propTypes2.default.arrayOf(_propTypes2.default.shape({
        title: _propTypes2.default.string,
        items: _propTypes2.default.array
    }))
};

exports.default = Menu;

/***/ }),
/* 507 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = __webpack_require__(2);

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__(4);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _menu_item = __webpack_require__(247);

var _menu_item2 = _interopRequireDefault(_menu_item);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var MenuList = function MenuList(_ref) {
    var items = _ref.items;
    return _react2.default.createElement(
        'div',
        null,
        items.map(function (_ref2, i) {
            var title = _ref2.title,
                description = _ref2.description,
                img_src = _ref2.img_src,
                path = _ref2.path;
            return _react2.default.createElement(_menu_item2.default, {
                key: i,
                title: title,
                description: description,
                img_src: img_src,
                path: path
            });
        })
    );
};

MenuList.propTypes = {
    items: _propTypes2.default.arrayOf(_propTypes2.default.shape({
        title: _propTypes2.default.string,
        description: _propTypes2.default.string,
        img_src: _propTypes2.default.string,
        path: _propTypes2.default.string
    }))
};

exports.default = MenuList;

/***/ }),
/* 508 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _classnames = __webpack_require__(18);

var _classnames2 = _interopRequireDefault(_classnames);

var _propTypes = __webpack_require__(4);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = __webpack_require__(2);

var _react2 = _interopRequireDefault(_react);

var _reactRouterDom = __webpack_require__(89);

var _menu_item = __webpack_require__(247);

var _menu_item2 = _interopRequireDefault(_menu_item);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MobileDropdown = function (_React$Component) {
    _inherits(MobileDropdown, _React$Component);

    function MobileDropdown() {
        var _ref;

        var _temp, _this, _ret;

        _classCallCheck(this, MobileDropdown);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = MobileDropdown.__proto__ || Object.getPrototypeOf(MobileDropdown)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
            is_open: false
        }, _this.toggleOpen = function () {
            _this.setState({
                is_open: !_this.state.is_open
            });
        }, _temp), _possibleConstructorReturn(_this, _ret);
    }

    _createClass(MobileDropdown, [{
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps() {
            this.setState({
                is_open: false
            });
        }
    }, {
        key: 'render',
        value: function render() {
            var _props = this.props,
                all_items = _props.all_items,
                children = _props.children;
            var is_open = this.state.is_open;

            return _react2.default.createElement(
                'div',
                { className: (0, _classnames2.default)('mobile-dropdown', { 'mobile-dropdown--open': is_open }) },
                _react2.default.createElement(
                    'div',
                    { className: 'mobile-dropdown__button', onClick: this.toggleOpen },
                    _react2.default.createElement(
                        _reactRouterDom.Switch,
                        null,
                        all_items.map(function (_ref2) {
                            var title = _ref2.title,
                                description = _ref2.description,
                                path = _ref2.path,
                                img_src = _ref2.img_src;
                            return _react2.default.createElement(_reactRouterDom.Route, {
                                key: path,
                                path: path,
                                render: function render() {
                                    return _react2.default.createElement(_menu_item2.default, {
                                        title: title,
                                        description: description,
                                        img_src: img_src
                                    });
                                }
                            });
                        })
                    ),
                    _react2.default.createElement('span', { className: 'select-arrow' })
                ),
                _react2.default.createElement(
                    'div',
                    { className: 'mobile-dropdown__menu' },
                    children
                )
            );
        }
    }]);

    return MobileDropdown;
}(_react2.default.Component);

MobileDropdown.propTypes = {
    all_items: _propTypes2.default.arrayOf(_propTypes2.default.shape({
        title: _propTypes2.default.string,
        description: _propTypes2.default.string,
        img_src: _propTypes2.default.string,
        path: _propTypes2.default.string
    })),
    children: _propTypes2.default.element
};

exports.default = MobileDropdown;

/***/ }),
/* 509 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = __webpack_require__(2);

var _react2 = _interopRequireDefault(_react);

var _reactRouterDom = __webpack_require__(89);

var _propTypes = __webpack_require__(4);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _menu = __webpack_require__(506);

var _menu2 = _interopRequireDefault(_menu);

var _mobile_dropdown = __webpack_require__(508);

var _mobile_dropdown2 = _interopRequireDefault(_mobile_dropdown);

var _settings_data = __webpack_require__(510);

var _settings_data2 = _interopRequireDefault(_settings_data);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var Settings = function Settings(_ref) {
    var match = _ref.match,
        routes = _ref.routes;

    var component_to_path = routes.reduce(function (map, _ref2) {
        var component = _ref2.component,
            path = _ref2.path;

        map[component.displayName || component.name] = path;
        return map;
    }, {});

    // Redirect doesn't work with relative paths
    // const getAbsolutePath = (component) => {
    //     const path = component_to_path[component.displayName || component.name];
    //     const base = match.url[match.url.length - 1] === '/'
    //         ? match.url.slice(0, -1)
    //         : match.url;
    //     return `${base}${path}`;
    // };

    // Add paths from this.props.routes to items
    var data = _settings_data2.default.map(function (section) {
        return _extends({}, section, {
            items: section.items.map(function (item) {
                return _extends({}, item, {
                    // path: getAbsolutePath(item.Component),
                    path: component_to_path[item.Component.displayname || item.Component.name]

                });
            })
        });
    });

    var all_items = data.reduce(function (all, section) {
        return [].concat(_toConsumableArray(all), _toConsumableArray(section.items));
    }, []);
    return _react2.default.createElement(
        'div',
        { className: 'settings container' },
        _react2.default.createElement(
            'div',
            { className: 'settings__sidebar desktop-only' },
            _react2.default.createElement(_menu2.default, { data: data })
        ),
        _react2.default.createElement(
            'div',
            { className: 'mobile-only' },
            _react2.default.createElement(
                _mobile_dropdown2.default,
                { all_items: all_items },
                _react2.default.createElement(_menu2.default, { data: data })
            )
        ),
        _react2.default.createElement(
            'div',
            { className: 'settings__content' },
            _react2.default.createElement(
                _reactRouterDom.Switch,
                null,
                all_items.map(function (_ref3) {
                    var Component = _ref3.Component,
                        title = _ref3.title,
                        description = _ref3.description,
                        path = _ref3.path;
                    return _react2.default.createElement(_reactRouterDom.Route, {
                        key: path,
                        path: path,
                        render: function render() {
                            return _react2.default.createElement(Component, { title: title, description: description });
                        }
                    });
                }),
                _react2.default.createElement(_reactRouterDom.Redirect, { from: match.url, to: all_items[0].path })
            )
        )
    );
};

Settings.propTypes = {
    match: _propTypes2.default.object,
    routes: _propTypes2.default.arrayOf(_propTypes2.default.shape({
        path: _propTypes2.default.string,
        component: _propTypes2.default.function
    }))
};

exports.default = Settings;

/***/ }),
/* 510 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _account_password = __webpack_require__(248);

var _account_password2 = _interopRequireDefault(_account_password);

var _api_token = __webpack_require__(249);

var _api_token2 = _interopRequireDefault(_api_token);

var _authorized_applications = __webpack_require__(250);

var _authorized_applications2 = _interopRequireDefault(_authorized_applications);

var _cashier_password = __webpack_require__(251);

var _cashier_password2 = _interopRequireDefault(_cashier_password);

var _financial_assessment = __webpack_require__(252);

var _financial_assessment2 = _interopRequireDefault(_financial_assessment);

var _limits = __webpack_require__(253);

var _limits2 = _interopRequireDefault(_limits);

var _login_history = __webpack_require__(254);

var _login_history2 = _interopRequireDefault(_login_history);

var _personal_details = __webpack_require__(255);

var _personal_details2 = _interopRequireDefault(_personal_details);

var _self_exclusion = __webpack_require__(256);

var _self_exclusion2 = _interopRequireDefault(_self_exclusion);

var _localize = __webpack_require__(0);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var data = [{
    title: (0, _localize.localize)('Profile'),
    items: [{
        title: (0, _localize.localize)('Personal Details'),
        description: (0, _localize.localize)('View your personal information.'),
        img_src: 'images/app_2/settings/ic-personal-details.svg',
        Component: _personal_details2.default
    }, {
        title: (0, _localize.localize)('Financial Assessment'),
        description: (0, _localize.localize)('View your financial assessment settings'),
        img_src: 'images/app_2/settings/ic-financial-assesment.svg',
        Component: _financial_assessment2.default
    }]
}, {
    title: (0, _localize.localize)('Security & Limits'),
    items: [{
        title: (0, _localize.localize)('Account Password'),
        description: (0, _localize.localize)('Change your main login password.'),
        img_src: 'images/app_2/settings/ic-account-password.svg',
        Component: _account_password2.default
    }, {
        title: (0, _localize.localize)('Cashier Password'),
        description: (0, _localize.localize)('Change the password used for deposits and withdrawals'),
        img_src: 'images/app_2/settings/ic-cashier-password.svg',
        Component: _cashier_password2.default
    }, {
        title: (0, _localize.localize)('Self Exclusion'),
        description: (0, _localize.localize)('Facility that allows you to set limits on your account.'),
        img_src: 'images/app_2/settings/ic-self-exclusion.svg',
        Component: _self_exclusion2.default
    }, {
        title: (0, _localize.localize)('Limits'),
        description: (0, _localize.localize)('View your trading and withdrawal limits'),
        img_src: 'images/app_2/settings/ic-limits.svg',
        Component: _limits2.default
    }, {
        title: (0, _localize.localize)('Login History'),
        description: (0, _localize.localize)('View your login history'),
        img_src: 'images/app_2/settings/ic-login-history.svg',
        Component: _login_history2.default
    }, {
        title: (0, _localize.localize)('API Token'),
        description: (0, _localize.localize)('API token for third party applications'),
        img_src: 'images/app_2/settings/ic-api-token.svg',
        Component: _api_token2.default
    }, {
        title: (0, _localize.localize)('Authorized Applications'),
        description: (0, _localize.localize)('Manage your authorised applications'),
        img_src: 'images/app_2/settings/ic-authorised-applications.svg',
        Component: _authorized_applications2.default
    }]
}];

exports.default = data;

/***/ }),
/* 511 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ProcessData = undefined;

var _process_data = __webpack_require__(512);

var _ProcessData = _interopRequireWildcard(_process_data);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

exports.ProcessData = _ProcessData;

/***/ }),
/* 512 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * Converts oauth_apps response to an object
 *
 * @param  {Object} response of oauth_apps request
 * @return {Object} returns an object containing application ids alongside their name { app_id: name }
 */
var getOauthAppsObject = exports.getOauthAppsObject = function getOauthAppsObject() {
    var response = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    return (response.oauth_apps || []).reduce(function (acc, app) {
        return _extends({}, acc, _defineProperty({}, app.app_id, app.name));
    }, { 2: 'Binary.com Autoexpiry' });
};

/***/ }),
/* 513 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _index = __webpack_require__(64);

var _network_monitor_base = __webpack_require__(148);

var _network_monitor_base2 = _interopRequireDefault(_network_monitor_base);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// TODO: implement a component to display network status and corresponding messages
var NetworkMonitor = function () {
    var init = function init(store) {
        _network_monitor_base2.default.init(_index.BinarySocketGeneral.init(store));
    };

    return {
        init: init
    };
}();

exports.default = NetworkMonitor;

/***/ }),
/* 514 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _mobx = __webpack_require__(41);

var _logout = __webpack_require__(257);

var _ws_methods = __webpack_require__(166);

var _ws_methods2 = _interopRequireDefault(_ws_methods);

var _client_base = __webpack_require__(22);

var _client_base2 = _interopRequireDefault(_client_base);

var _currency_base = __webpack_require__(33);

var _login = __webpack_require__(34);

var _login2 = _interopRequireDefault(_login);

var _server_time = __webpack_require__(149);

var _server_time2 = _interopRequireDefault(_server_time);

var _socket_base = __webpack_require__(42);

var _socket_base2 = _interopRequireDefault(_socket_base);

var _storage = __webpack_require__(7);

var _utility = __webpack_require__(3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var client_store = void 0,
    common_store = void 0;

// TODO: update commented statements to the corresponding functions from app_2
var BinarySocketGeneral = function () {
    var onOpen = function onOpen(is_ready) {
        // Header.hideNotification();
        if (is_ready) {
            if (!_login2.default.isLoginPages()) {
                if (!_client_base2.default.isValidLoginid()) {
                    (0, _logout.requestLogout)();
                    return;
                }
                _ws_methods2.default.subscribeWebsiteStatus(ResponseHandlers.websiteStatus);
            }
            _server_time2.default.init((0, _mobx.action)('setTime', function () {
                common_store.server_time = _server_time2.default.get();
            }));
        }
    };

    var onMessage = function onMessage(response) {
        handleError(response);
        // Header.hideNotification('CONNECTION_ERROR');
        switch (response.msg_type) {
            case 'authorize':
                if (response.error) {
                    var is_active_tab = sessionStorage.getItem('active_tab') === '1';
                    if ((0, _utility.getPropertyValue)(response, ['error', 'code']) === 'SelfExclusion' && is_active_tab) {
                        sessionStorage.removeItem('active_tab');
                        // Dialog.alert({ id: 'authorize_error_alert', message: response.error.message });
                    }
                    (0, _logout.requestLogout)();
                } else if (!_login2.default.isLoginPages() && !/authorize/.test(_storage.State.get('skip_response'))) {
                    if (response.authorize.loginid !== _client_base2.default.get('loginid')) {
                        (0, _logout.requestLogout)();
                    } else {
                        _client_base2.default.responseAuthorize(response);
                        setBalance(response.authorize.balance);
                        _ws_methods2.default.subscribeBalance(ResponseHandlers.balance);
                        _ws_methods2.default.getSettings();
                        _ws_methods2.default.getAccountStatus();
                        _ws_methods2.default.payoutCurrencies();
                        _ws_methods2.default.mt5LoginList();
                        setResidence(response.authorize.country || _client_base2.default.get('residence'));
                        if (!_client_base2.default.get('is_virtual')) {
                            _ws_methods2.default.getSelfExclusion();
                        }
                        _socket_base2.default.sendBuffered();
                        if (/bch/i.test(response.authorize.currency) && !_client_base2.default.get('accepted_bch')) {
                            // showPopup({
                            //     url        : urlFor('user/warning'),
                            //     popup_id   : 'warning_popup',
                            //     form_id    : '#frm_warning',
                            //     content_id : '#warning_content',
                            //     validations: [{ selector: '#chk_accept', validations: [['req', { hide_asterisk: true }]] }],
                            //     onAccept   : () => { Client.set('accepted_bch', 1); },
                            // });
                        }
                    }
                }
                break;
            case 'landing_company':
                // Header.upgradeMessageVisibility();
                break;
            case 'get_self_exclusion':
                // SessionDurationLimit.exclusionResponseHandler(response);
                break;
            case 'get_settings':
                if (response.get_settings) {
                    setResidence(response.get_settings.country_code);
                    _client_base2.default.set('email', response.get_settings.email);
                    // GTM.eventHandler(response.get_settings);
                    // if (response.get_settings.is_authenticated_payment_agent) {
                    //     $('#topMenuPaymentAgent').setVisibility(1);
                    // }
                }
                break;
            // no default
        }
    };

    var setResidence = function setResidence(residence) {
        if (residence) {
            _client_base2.default.set('residence', residence);
            _ws_methods2.default.landingCompany(residence);
        }
    };

    var setBalance = (0, _mobx.flow)( /*#__PURE__*/regeneratorRuntime.mark(function _callee(balance) {
        return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        _context.next = 2;
                        return _socket_base2.default.wait('website_status');

                    case 2:
                        _client_base2.default.set('balance', balance);
                        client_store.balance = balance;

                    case 4:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, this);
    }));

    var handleError = function handleError(response) {
        var msg_type = response.msg_type;
        var error_code = (0, _utility.getPropertyValue)(response, ['error', 'code']);
        switch (error_code) {
            case 'WrongResponse':
            case 'InternalServerError':
            case 'OutputValidationFailed':
                {
                    if (msg_type !== 'mt5_login_list') {
                        // showNoticeMessage(response.error.message);
                    }
                    break;
                }
            case 'RateLimit':
                if (msg_type !== 'cashier_password') {
                    // Header.displayNotification(localize('You have reached the rate limit of requests per second. Please try later.'), true, 'RATE_LIMIT');
                }
                break;
            case 'InvalidAppID':
                // Header.displayNotification(response.error.message, true, 'INVALID_APP_ID');
                break;
            case 'DisabledClient':
                // showNoticeMessage(response.error.message);
                break;
            // no default
        }
    };

    var init = function init(store) {
        client_store = store.client;
        common_store = store.common;

        return {
            onOpen: onOpen,
            onMessage: onMessage
        };
    };

    return {
        init: init,
        setBalance: setBalance
    };
}();

exports.default = BinarySocketGeneral;


var ResponseHandlers = function () {
    var is_available = false;
    var websiteStatus = function websiteStatus(response) {
        if (response.website_status) {
            is_available = /^up$/i.test(response.website_status.site_status);
            if (is_available && !_socket_base2.default.availability()) {
                window.location.reload();
                return;
            }
            if (response.website_status.message) {
                // Footer.displayNotification(response.website_status.message);
            } else {
                    // Footer.clearNotification();
                }
            _socket_base2.default.availability(is_available);
            (0, _currency_base.setCurrencies)(response.website_status);
        }
    };

    var balance = function balance(response) {
        if (!response.error) {
            BinarySocketGeneral.setBalance(response.balance.balance);
        }
    };

    return {
        websiteStatus: websiteStatus,
        balance: balance
    };
}();

/***/ }),
/* 515 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _socket_base = __webpack_require__(42);

var _socket_base2 = _interopRequireDefault(_socket_base);

var _utility = __webpack_require__(3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * A layer over BinarySocket to handle subscribing to streaming calls
 * in order to keep track of subscriptions, manage forget, prevent multiple subscription at the same time, ...
 *
 * structure of the the subscription object is:
 * {
 *     1: { msg_type: 'proposal', request: { ... }, stream_id: '...', subscribers: [ ... ] },
 *     2: ...
 * }
 * object keys: subscription_id that assigned to each subscription
 * msg_type   : msg_type of the request for faster filtering
 * request    : the request object, used to subscribe to the same stream when there is a new subscribe request with exactly the same values
 * stream_id  : id of the stream which stored from its response and used to forget the stream when needed
 * subscribers: an array of callbacks to dispatch the response to
 */
var SubscriptionManager = function () {
    var subscriptions = {};
    var forget_requested = {};

    var subscription_id = 0;

    /**
     * To submit request for a new subscription
     *
     * @param {String}   msg_type             msg_type of the request
     * @param {Object}   request_obj          the whole object of the request to be made
     * @param {Function} fncCallback          callback function to pass the responses to
     * @param {Boolean}  should_forget_first  when it's true: forgets the previous subscription, then subscribes after receiving the forget response (if any)
     */
    var subscribe = function subscribe(msg_type, request_obj, fncCallback) {
        var should_forget_first = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

        if (should_forget_first) {
            forget(msg_type, fncCallback).then(function () {
                subscribe(msg_type, request_obj, fncCallback);
            });
            return;
        }

        var sub_id = Object.keys(subscriptions).find(function (id) {
            return (0, _utility.isDeepEqual)(request_obj, subscriptions[id].request);
        });

        if (!sub_id) {
            sub_id = ++subscription_id;

            subscriptions[sub_id] = {
                msg_type: msg_type,
                request: (0, _utility.cloneObject)(request_obj),
                stream_id: '', // stream_id will be updated after receiving the response
                subscribers: [fncCallback]
            };

            _socket_base2.default.send(request_obj, {
                callback: function (id) {
                    return function (response) {
                        dispatch(response, id);
                    };
                }(sub_id)
            });
        } else if (!hasCallbackFunction(sub_id, fncCallback)) {
            // there is already an active subscription for the very same request which fncCallback is not subscribed to it yet
            subscriptions[sub_id].subscribers.push(fncCallback);
        }
    };

    // dispatches the response to subscribers of the specific subscription id (internal use only)
    var dispatch = function dispatch(response, sub_id) {
        var stream_id = (0, _utility.getPropertyValue)(response, [response.msg_type, 'id']);

        if (!subscriptions[sub_id]) {
            if (!forget_requested[stream_id]) {
                forgetStream(stream_id);
            }
            return;
        }

        var sub_info = subscriptions[sub_id];
        // set the stream_id
        if (!sub_info.stream_id && stream_id) {
            sub_info.stream_id = stream_id;
        }

        // callback subscribers
        var subscribers = sub_info.subscribers;
        if (subscribers.length) {
            if (response.error && !sub_info.stream_id) {
                // first response returned error
                delete subscriptions[sub_id];
            }
            sub_info.subscribers.forEach(function (fnc) {
                fnc(response);
            });
        } else {
            delete subscriptions[sub_id];
            forgetStream(sub_info.stream_id);
        }
    };

    /**
     * To forget a subscription which submitted for a specific callback function
     *
     * @param  {String}   msg_type      msg_type to forget
     * @param  {Function} fncCallback   the same function passed to subscribe()
     *     (this is the way to distinguish between different subscribers of the same stream at the same time)
     * @param  {Object}   match_values  optional, to only forget subscriptions having request that "contains" provided values
     * @return {Promise}  the promise object of all possible forget requests
     */
    var forget = function forget(msg_type, fncCallback, match_values) {
        if (typeof fncCallback !== 'function') {
            throw new Error('Missing callback function. To forget all subscriptions of msg_type: ' + msg_type + ', please call forgetAll().');
        }

        // find corresponding id(s)
        var sub_ids = Object.keys(subscriptions).filter(function (id) {
            return subscriptions[id].msg_type === msg_type && hasCallbackFunction(id, fncCallback);
        });

        var forgets_list = [];
        sub_ids.forEach(function (id) {
            if (match_values && !hasValues(subscriptions[id].request, match_values)) {
                return;
            }
            var stream_id = subscriptions[id].stream_id;
            if (stream_id && subscriptions[id].subscribers.length === 1) {
                delete subscriptions[id];
                forgets_list.push(forgetStream(stream_id));
            } else {
                // there are other subscribers, or for some reason there is no stream_id:
                // (i.e. returned an error, or forget() being called before the first response)
                subscriptions[id].subscribers.splice(subscriptions[id].subscribers.indexOf(fncCallback), 1);
            }
        });
        return Promise.all(forgets_list);
    };

    /**
     * To forget all active subscriptions of a list of msg_types
     *
     * @param  {String}  msg_types  list of msg_types to forget
     * @return {Promise} the promise object of all possible forget_all requests
     */
    var forgetAll = function forgetAll() {
        for (var _len = arguments.length, msg_types = Array(_len), _key = 0; _key < _len; _key++) {
            msg_types[_key] = arguments[_key];
        }

        var types_to_forget = {};

        msg_types.forEach(function (msg_type) {
            var sub_ids = Object.keys(subscriptions).filter(function (id) {
                return subscriptions[id].msg_type === msg_type;
            });
            if (sub_ids.length) {
                sub_ids.forEach(function (id) {
                    delete subscriptions[id];
                });
                types_to_forget[msg_type] = true;
            }
        });

        return Promise.resolve(!(0, _utility.isEmptyObject)(types_to_forget) ? _socket_base2.default.send({ forget_all: Object.keys(types_to_forget) }) : {});
    };

    var forgetStream = function forgetStream(stream_id) {
        forget_requested[stream_id] = true; // to prevent forgetting multiple times
        return Promise.resolve(stream_id ? _socket_base2.default.send({ forget: stream_id }).then(function () {
            delete forget_requested[stream_id];
        }) : {});
    };

    var hasCallbackFunction = function hasCallbackFunction(sub_id, fncCallback) {
        return subscriptions[sub_id] && subscriptions[sub_id].subscribers.indexOf(fncCallback) !== -1;
    };

    var hasValues = function hasValues(request_obj, values_obj) {
        return (typeof request_obj === 'undefined' ? 'undefined' : _typeof(request_obj)) === 'object' && (typeof values_obj === 'undefined' ? 'undefined' : _typeof(values_obj)) === 'object' && Object.keys(values_obj).every(function (key) {
            return request_obj[key] === values_obj[key];
        });
    };

    return {
        subscribe: subscribe,
        forget: forget,
        forgetAll: forgetAll
    };
}();

exports.default = SubscriptionManager;

/***/ }),
/* 516 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.onChangeContractType = exports.onChangeContractTypeList = undefined;

var _contract_type = __webpack_require__(96);

var _contract_type2 = _interopRequireDefault(_contract_type);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var onChangeContractTypeList = exports.onChangeContractTypeList = function onChangeContractTypeList(_ref) {
    var contract_types_list = _ref.contract_types_list,
        contract_type = _ref.contract_type;
    return _contract_type2.default.getContractType(contract_types_list, contract_type);
};

var onChangeContractType = exports.onChangeContractType = function onChangeContractType(store) {
    return _contract_type2.default.getContractValues(store);
};

/***/ }),
/* 517 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getCurrenciesAsync = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _currency = __webpack_require__(527);

var _Services = __webpack_require__(64);

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var getCurrenciesAsync = exports.getCurrenciesAsync = function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(currency) {
        var response, currencies_list, default_currency;
        return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        _context.next = 2;
                        return _Services.WS.payoutCurrencies();

                    case 2:
                        response = _context.sent;
                        currencies_list = (0, _currency.buildCurrenciesList)(response.payout_currencies);
                        default_currency = (0, _currency.getDefaultCurrency)(currencies_list, currency);
                        return _context.abrupt('return', _extends({
                            currencies_list: currencies_list
                        }, default_currency));

                    case 6:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, undefined);
    }));

    return function getCurrenciesAsync(_x) {
        return _ref.apply(this, arguments);
    };
}();

/***/ }),
/* 518 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.onChangeExpiry = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _contract_type = __webpack_require__(96);

var _contract_type2 = _interopRequireDefault(_contract_type);

var _duration = __webpack_require__(258);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var onChangeExpiry = exports.onChangeExpiry = function onChangeExpiry(store) {
    var contract_expiry_type = (0, _duration.getExpiryType)(store);

    // TODO: there will be no barrier available if contract is only daily but client chooses intraday endtime. we should find a way to handle this.
    var obj_barriers = store.contract_expiry_type !== contract_expiry_type && // barrier value changes for tick/intraday/daily
    _contract_type2.default.getBarriers(store.contract_type, contract_expiry_type);

    return _extends({
        contract_expiry_type: contract_expiry_type
    }, obj_barriers);
};

/***/ }),
/* 519 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.processPurchase = undefined;

var _Services = __webpack_require__(64);

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var processPurchase = exports.processPurchase = function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(proposal_id, price) {
        return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        _context.next = 2;
                        return _Services.WS.buy(proposal_id, price);

                    case 2:
                        return _context.abrupt('return', _context.sent);

                    case 3:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, undefined);
    }));

    return function processPurchase(_x, _x2) {
        return _ref.apply(this, arguments);
    };
}();

/***/ }),
/* 520 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.onChangeStartDate = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _contract_type = __webpack_require__(96);

var _contract_type2 = _interopRequireDefault(_contract_type);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var onChangeStartDate = exports.onChangeStartDate = function onChangeStartDate(store) {
    var contract_type = store.contract_type,
        start_date = store.start_date,
        duration_unit = store.duration_unit,
        expiry_date = store.expiry_date,
        expiry_time = store.expiry_time;
    var start_time = store.start_time;


    var obj_contract_start_type = _contract_type2.default.getStartType(start_date);
    var contract_start_type = obj_contract_start_type.contract_start_type;
    var obj_duration_units_list = _contract_type2.default.getDurationUnitsList(contract_type, contract_start_type);
    var obj_duration_unit = _contract_type2.default.getDurationUnit(duration_unit, contract_type, contract_start_type);
    var obj_sessions = _contract_type2.default.getSessions(contract_type, start_date);
    var sessions = obj_sessions.sessions;
    var obj_start_time = _contract_type2.default.getStartTime(sessions, start_date, start_time);
    start_time = obj_start_time.start_time;
    var obj_end_time = _contract_type2.default.getEndTime(sessions, start_date, start_time, expiry_date, expiry_time);

    return _extends({}, obj_contract_start_type, obj_duration_units_list, obj_duration_unit, obj_sessions, obj_start_time, obj_end_time);
};

/***/ }),
/* 521 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.onChangeSymbolAsync = undefined;

var _contract_type = __webpack_require__(96);

var _contract_type2 = _interopRequireDefault(_contract_type);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var onChangeSymbolAsync = exports.onChangeSymbolAsync = function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(symbol) {
        return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        _context.next = 2;
                        return _contract_type2.default.buildContractTypesConfig(symbol);

                    case 2:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, undefined);
    }));

    return function onChangeSymbolAsync(_x) {
        return _ref.apply(this, arguments);
    };
}();

/***/ }),
/* 522 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getContractCategoriesConfig = exports.getContractTypesConfig = undefined;

var _localize = __webpack_require__(0);

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * components can be undef or an array containing any of: 'start_date', 'barrier', 'last_digit'
 *     ['duration', 'amount'] are omitted, as they're available in all contract types
 */
var getContractTypesConfig = exports.getContractTypesConfig = function getContractTypesConfig() {
    return {
        rise_fall: { title: (0, _localize.localize)('Rise/Fall'), trade_types: ['CALL', 'PUT'], basis: ['payout', 'stake'], components: ['start_date'], barrier_count: 0 },
        high_low: { title: (0, _localize.localize)('Higher/Lower'), trade_types: ['CALL', 'PUT'], basis: ['payout', 'stake'], components: ['barrier'], barrier_count: 1 },
        touch: { title: (0, _localize.localize)('Touch/No Touch'), trade_types: ['ONETOUCH', 'NOTOUCH'], basis: ['payout', 'stake'], components: ['barrier'] },
        end: { title: (0, _localize.localize)('Ends Between/Ends Outside'), trade_types: ['EXPIRYMISS', 'EXPIRYRANGE'], basis: ['payout', 'stake'], components: ['barrier'] },
        stay: { title: (0, _localize.localize)('Stays Between/Goes Outside'), trade_types: ['RANGE', 'UPORDOWN'], basis: ['payout', 'stake'], components: ['barrier'] },
        asian: { title: (0, _localize.localize)('Asians'), trade_types: ['ASIANU', 'ASIAND'], basis: ['payout', 'stake'], components: [] },
        match_diff: { title: (0, _localize.localize)('Matches/Differs'), trade_types: ['DIGITMATCH', 'DIGITDIFF'], basis: ['payout', 'stake'], components: ['last_digit'] },
        even_odd: { title: (0, _localize.localize)('Even/Odd'), trade_types: ['DIGITODD', 'DIGITEVEN'], basis: ['payout', 'stake'], components: [] },
        over_under: { title: (0, _localize.localize)('Over/Under'), trade_types: ['DIGITOVER', 'DIGITUNDER'], basis: ['payout', 'stake'], components: ['last_digit'] },
        lb_call: { title: (0, _localize.localize)('Close-Low'), trade_types: ['LBFLOATCALL'], basis: ['multiplier'], components: [] },
        lb_put: { title: (0, _localize.localize)('High-Close'), trade_types: ['LBFLOATPUT'], basis: ['multiplier'], components: [] },
        lb_high_low: { title: (0, _localize.localize)('High-Low'), trade_types: ['LBHIGHLOW'], basis: ['multiplier'], components: [] }
    };
};

var getContractCategoriesConfig = exports.getContractCategoriesConfig = function getContractCategoriesConfig() {
    var _ref;

    return _ref = {}, _defineProperty(_ref, (0, _localize.localize)('Up/Down'), ['rise_fall', 'high_low']), _defineProperty(_ref, (0, _localize.localize)('Touch/No Touch'), ['touch']), _defineProperty(_ref, (0, _localize.localize)('In/Out'), ['end', 'stay']), _defineProperty(_ref, (0, _localize.localize)('Asians'), ['asian']), _defineProperty(_ref, (0, _localize.localize)('Digits'), ['match_diff', 'even_odd', 'over_under']), _defineProperty(_ref, (0, _localize.localize)('Lookback'), ['lb_call', 'lb_put', 'lb_high_low']), _ref;
};

/***/ }),
/* 523 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
// list of trade's options that should be used in query string of trade page url.
var allowed_query_string_variables = exports.allowed_query_string_variables = ['amount', 'barrier_1', 'barrier_2', 'basis', 'contract_start_type', 'contract_type', 'currency', 'duration', 'duration_unit', 'expiry_date', 'expiry_type', 'last_digit', 'start_date', 'symbol'];

/***/ }),
/* 524 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.form_components = undefined;

var _duration = __webpack_require__(496);

var _duration2 = _interopRequireDefault(_duration);

var _start_date = __webpack_require__(498);

var _start_date2 = _interopRequireDefault(_start_date);

var _last_digit = __webpack_require__(497);

var _last_digit2 = _interopRequireDefault(_last_digit);

var _amount = __webpack_require__(494);

var _amount2 = _interopRequireDefault(_amount);

var _barrier = __webpack_require__(495);

var _barrier2 = _interopRequireDefault(_barrier);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var form_components = exports.form_components = [{ name: 'start_date', Component: _start_date2.default }, { name: 'duration', Component: _duration2.default }, { name: 'barrier', Component: _barrier2.default }, { name: 'last_digit', Component: _last_digit2.default }, { name: 'amount', Component: _amount2.default }];

/***/ }),
/* 525 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var buildBarriersConfig = exports.buildBarriersConfig = function buildBarriersConfig(contract) {
    var barriers = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : { count: contract.barriers };

    if (!contract.barriers) {
        return undefined;
    }

    var obj_barrier = {};

    ['barrier', 'low_barrier', 'high_barrier'].forEach(function (field) {
        if (field in contract) obj_barrier[field] = contract[field];
    });

    return Object.assign(barriers || {}, _defineProperty({}, contract.expiry_type, obj_barrier));
};

/***/ }),
/* 526 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.createChartBarriersConfig = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _dec, _dec2, _dec3, _dec4, _desc, _value, _class, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9;

var _mobx = __webpack_require__(41);

function _initDefineProp(target, property, descriptor, context) {
    if (!descriptor) return;
    Object.defineProperty(target, property, {
        enumerable: descriptor.enumerable,
        configurable: descriptor.configurable,
        writable: descriptor.writable,
        value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
    });
}

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
    var desc = {};
    Object['ke' + 'ys'](descriptor).forEach(function (key) {
        desc[key] = descriptor[key];
    });
    desc.enumerable = !!desc.enumerable;
    desc.configurable = !!desc.configurable;

    if ('value' in desc || desc.initializer) {
        desc.writable = true;
    }

    desc = decorators.slice().reverse().reduce(function (desc, decorator) {
        return decorator(target, property, desc) || desc;
    }, desc);

    if (context && desc.initializer !== void 0) {
        desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
        desc.initializer = undefined;
    }

    if (desc.initializer === void 0) {
        Object['define' + 'Property'](target, property, desc);
        desc = null;
    }

    return desc;
}

function _initializerWarningHelper(descriptor, context) {
    throw new Error('Decorating class property failed. Please ensure that transform-class-properties is enabled.');
}

var createChartBarriersConfig = exports.createChartBarriersConfig = function createChartBarriersConfig(contract_type, proposal_response, onChartBarrierChange) {
    if (proposal_response.error || !isBarrierSupported(contract_type)) {
        return {};
    }

    return new ChartBarriersConfig(proposal_response.echo_req, onChartBarrierChange);
};

var isBarrierSupported = function isBarrierSupported(contract_type) {
    return contract_type in CONTRACT_SHADES;
};

var ChartBarriersConfig = (_dec = _mobx.action.bound, _dec2 = _mobx.action.bound, _dec3 = _mobx.action.bound, _dec4 = _mobx.action.bound, (_class = function () {
    function ChartBarriersConfig(_ref, onChartBarrierChange) {
        var barrier = _ref.barrier,
            barrier2 = _ref.barrier2;

        _classCallCheck(this, ChartBarriersConfig);

        _initDefineProp(this, 'color', _descriptor, this);

        _initDefineProp(this, 'lineStyle', _descriptor2, this);

        _initDefineProp(this, 'shade', _descriptor3, this);

        _initDefineProp(this, 'high', _descriptor4, this);

        _initDefineProp(this, 'low', _descriptor5, this);

        _initDefineProp(this, 'relative', _descriptor6, this);

        _initDefineProp(this, 'draggable', _descriptor7, this);

        _initDefineProp(this, 'hidePriceLines', _descriptor8, this);

        _initDefineProp(this, 'getDefaults', _descriptor9, this);

        this.color = 'green';
        this.lineStyle = 'dashed';
        this.shade = 'NONE_SINGLE';
        this.onChange = this.onBarrierChange;

        // trade_store's action to process new barriers on dragged
        this.onChartBarrierChange = onChartBarrierChange.bind(this);

        this.high = +barrier || 0; // 0 to follow the price
        if (barrier2) {
            this.low = +barrier2;
            this.shade = 'NONE_DOUBLE';
        }

        var has_barrier = !!barrier;
        this.relative = !has_barrier || /^[+-]/.test(barrier);
        this.draggable = has_barrier;
        this.hidePriceLines = !has_barrier;
    }

    _createClass(ChartBarriersConfig, [{
        key: 'updateBarriers',
        value: function updateBarriers(_ref2) {
            var high = _ref2.high,
                low = _ref2.low;

            this.high = +high || undefined;
            this.low = +low || undefined;
        }
    }, {
        key: 'updateBarrierShade',
        value: function updateBarrierShade(chart_barriers, is_over, contract_type) {
            this.shade = is_over && CONTRACT_SHADES[contract_type] || this.getDefaults();
        }
    }, {
        key: 'onBarrierChange',
        value: function onBarrierChange(_ref3) {
            var high = _ref3.high,
                low = _ref3.low;

            this.updateBarriers({ high: high, low: low });
            this.onChartBarrierChange();
        }
    }]);

    return ChartBarriersConfig;
}(), (_descriptor = _applyDecoratedDescriptor(_class.prototype, 'color', [_mobx.observable], {
    enumerable: true,
    initializer: null
}), _descriptor2 = _applyDecoratedDescriptor(_class.prototype, 'lineStyle', [_mobx.observable], {
    enumerable: true,
    initializer: null
}), _descriptor3 = _applyDecoratedDescriptor(_class.prototype, 'shade', [_mobx.observable], {
    enumerable: true,
    initializer: null
}), _descriptor4 = _applyDecoratedDescriptor(_class.prototype, 'high', [_mobx.observable], {
    enumerable: true,
    initializer: null
}), _descriptor5 = _applyDecoratedDescriptor(_class.prototype, 'low', [_mobx.observable], {
    enumerable: true,
    initializer: null
}), _descriptor6 = _applyDecoratedDescriptor(_class.prototype, 'relative', [_mobx.observable], {
    enumerable: true,
    initializer: null
}), _descriptor7 = _applyDecoratedDescriptor(_class.prototype, 'draggable', [_mobx.observable], {
    enumerable: true,
    initializer: null
}), _descriptor8 = _applyDecoratedDescriptor(_class.prototype, 'hidePriceLines', [_mobx.observable], {
    enumerable: true,
    initializer: null
}), _applyDecoratedDescriptor(_class.prototype, 'updateBarriers', [_dec], Object.getOwnPropertyDescriptor(_class.prototype, 'updateBarriers'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'updateBarrierShade', [_dec2], Object.getOwnPropertyDescriptor(_class.prototype, 'updateBarrierShade'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'onBarrierChange', [_dec3], Object.getOwnPropertyDescriptor(_class.prototype, 'onBarrierChange'), _class.prototype), _descriptor9 = _applyDecoratedDescriptor(_class.prototype, 'getDefaults', [_dec4], {
    enumerable: true,
    initializer: function initializer() {
        var _this = this;

        return function () {
            return typeof _this.high !== 'undefined' && typeof _this.low !== 'undefined' ? 'NONE_DOUBLE' : 'NONE_SINGLE';
        };
    }
})), _class));


var CONTRACT_SHADES = {
    CALL: 'ABOVE',
    PUT: 'BELOW',
    EXPIRYRANGE: 'BETWEEN',
    EXPIRYMISS: 'OUTSIDE',
    RANGE: 'BETWEEN',
    UPORDOWN: 'OUTSIDE',
    ONETOUCH: 'NONE_SINGLE', // no shade
    NOTOUCH: 'NONE_SINGLE' // no shade
};

/***/ }),
/* 527 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getDefaultCurrency = exports.buildCurrenciesList = undefined;

var _currency_base = __webpack_require__(33);

var _localize = __webpack_require__(0);

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var buildCurrenciesList = exports.buildCurrenciesList = function buildCurrenciesList(payout_currencies) {
    var _ref;

    var fiat = [];
    var crypto = [];

    payout_currencies.forEach(function (cur) {
        ((0, _currency_base.isCryptocurrency)(cur) ? crypto : fiat).push({ text: cur, value: cur });
    });

    return _ref = {}, _defineProperty(_ref, (0, _localize.localize)('Fiat'), fiat), _defineProperty(_ref, (0, _localize.localize)('Crypto'), crypto), _ref;
};

var getDefaultCurrency = exports.getDefaultCurrency = function getDefaultCurrency(currencies_list) {
    var currency = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

    var supported_currencies = Object.values(currencies_list).reduce(function (a, b) {
        return [].concat(_toConsumableArray(a), _toConsumableArray(b));
    });
    var default_currency = supported_currencies.find(function (c) {
        return c.value === currency;
    }) ? currency : supported_currencies[0].value;

    return {
        currency: default_currency
    };
};

/***/ }),
/* 528 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.processTradeParams = undefined;

var _extend = __webpack_require__(193);

var _extend2 = _interopRequireDefault(_extend);

var _client_base = __webpack_require__(22);

var _client_base2 = _interopRequireDefault(_client_base);

var _utility = __webpack_require__(3);

var _contract_type = __webpack_require__(96);

var _contract_type2 = _interopRequireDefault(_contract_type);

var _contract_type3 = __webpack_require__(516);

var ContractType = _interopRequireWildcard(_contract_type3);

var _currency = __webpack_require__(517);

var Currency = _interopRequireWildcard(_currency);

var _duration = __webpack_require__(518);

var Duration = _interopRequireWildcard(_duration);

var _start_date = __webpack_require__(520);

var StartDate = _interopRequireWildcard(_start_date);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var processTradeParams = exports.processTradeParams = function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(store, new_state) {
        var snapshot;
        return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        snapshot = store.getSnapshot();

                        if (!(!_client_base2.default.get('currency') && (0, _utility.isEmptyObject)(store.currencies_list))) {
                            _context.next = 8;
                            break;
                        }

                        _context.t0 = extendOrReplace;
                        _context.t1 = snapshot;
                        _context.next = 6;
                        return Currency.getCurrenciesAsync(store.currency);

                    case 6:
                        _context.t2 = _context.sent;
                        (0, _context.t0)(_context.t1, _context.t2);

                    case 8:

                        getMethodsList(store, new_state).forEach(function (fnc) {
                            extendOrReplace(snapshot, fnc(snapshot));
                        });

                        return _context.abrupt('return', snapshot);

                    case 10:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, undefined);
    }));

    return function processTradeParams(_x, _x2) {
        return _ref.apply(this, arguments);
    };
}();

var getMethodsList = function getMethodsList(store, new_state) {
    return [_contract_type2.default.getContractCategories, ContractType.onChangeContractTypeList].concat(_toConsumableArray(/\b(symbol|contract_type)\b/.test(Object.keys(new_state)) || !store.contract_type ? // symbol/contract_type changed or contract_type not set yet
    [ContractType.onChangeContractType] : []), [Duration.onChangeExpiry, StartDate.onChangeStartDate]);
};

// Some values need to be replaced, not extended
var extendOrReplace = function extendOrReplace(source, new_values) {
    var to_replace = ['contract_types_list', 'trade_types', 'duration_units_list'];

    to_replace.forEach(function (key) {
        if (key in new_values) {
            source[key] = undefined;
        }
    });

    (0, _extend2.default)(true, source, new_values);
};

/***/ }),
/* 529 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.createProposalRequests = exports.getProposalInfo = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _moment = __webpack_require__(9);

var _moment2 = _interopRequireDefault(_moment);

var _Date = __webpack_require__(107);

var _currency_base = __webpack_require__(33);

var _utility = __webpack_require__(3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var getProposalInfo = exports.getProposalInfo = function getProposalInfo(store, response) {
    var proposal = response.proposal || {};
    var profit = proposal.payout - proposal.ask_price || 0;
    var returns = profit * 100 / (proposal.payout || 1);

    return {
        profit: profit.toFixed((0, _currency_base.getDecimalPlaces)(store.currency)),
        returns: returns.toFixed(2) + '%',
        stake: proposal.display_value,
        payout: proposal.payout,
        id: proposal.id || '',
        message: proposal.longcode || response.error.message,
        has_error: !!response.error
    };
};

var createProposalRequests = exports.createProposalRequests = function createProposalRequests(store) {
    var requests = {};

    Object.keys(store.trade_types).forEach(function (type) {
        var new_req = createProposalRequestForContract(store, type);
        var current_req = store.proposal_requests[type];
        if (!(0, _utility.isDeepEqual)(new_req, current_req)) {
            requests[type] = new_req;
        }
    });

    return requests;
};

var createProposalRequestForContract = function createProposalRequestForContract(store, type_of_contract) {
    var obj_expiry = {};
    if (store.expiry_type === 'endtime') {
        var expiry_date = _moment2.default.utc(store.expiry_date);
        var start_date = _moment2.default.unix(store.start_date || store.server_time).utc();
        var is_same_day = expiry_date.isSame(start_date, 'day');
        var expiry_time = is_same_day ? store.expiry_time : '23:59:59';
        obj_expiry.date_expiry = (0, _Date.convertToUnix)(expiry_date.unix(), expiry_time);
    }

    return _extends({
        proposal: 1,
        subscribe: 1,
        amount: parseFloat(store.amount),
        basis: store.basis,
        contract_type: type_of_contract,
        currency: store.currency,
        symbol: store.symbol
    }, store.start_date && { date_start: (0, _Date.convertToUnix)(store.start_date, store.start_time) }, store.expiry_type === 'duration' ? {
        duration: parseInt(store.duration),
        duration_unit: store.duration_unit
    } : obj_expiry, (store.barrier_count > 0 || store.form_components.indexOf('last_digit') !== -1) && { barrier: store.barrier_1 || store.last_digit }, store.barrier_count === 2 && { barrier2: store.barrier_2 });
};

/***/ }),
/* 530 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _desc, _value, _class, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _descriptor10, _descriptor11, _descriptor12, _descriptor13, _descriptor14, _descriptor15, _descriptor16, _descriptor17, _descriptor18, _descriptor19, _descriptor20, _descriptor21, _descriptor22, _descriptor23, _descriptor24, _descriptor25, _descriptor26, _descriptor27, _descriptor28, _descriptor29, _descriptor30, _descriptor31;

var _mobx = __webpack_require__(41);

var _purchase = __webpack_require__(519);

var _symbol = __webpack_require__(521);

var _Symbol = _interopRequireWildcard(_symbol);

var _query_string = __webpack_require__(523);

var _chart = __webpack_require__(526);

var _contract_type = __webpack_require__(96);

var _contract_type2 = _interopRequireDefault(_contract_type);

var _process = __webpack_require__(528);

var _proposal = __webpack_require__(529);

var _base_store = __webpack_require__(106);

var _base_store2 = _interopRequireDefault(_base_store);

var _Services = __webpack_require__(64);

var _URL = __webpack_require__(540);

var _URL2 = _interopRequireDefault(_URL);

var _client_base = __webpack_require__(22);

var _client_base2 = _interopRequireDefault(_client_base);

var _utility = __webpack_require__(3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _initDefineProp(target, property, descriptor, context) {
    if (!descriptor) return;
    Object.defineProperty(target, property, {
        enumerable: descriptor.enumerable,
        configurable: descriptor.configurable,
        writable: descriptor.writable,
        value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
    });
}

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
    var desc = {};
    Object['ke' + 'ys'](descriptor).forEach(function (key) {
        desc[key] = descriptor[key];
    });
    desc.enumerable = !!desc.enumerable;
    desc.configurable = !!desc.configurable;

    if ('value' in desc || desc.initializer) {
        desc.writable = true;
    }

    desc = decorators.slice().reverse().reduce(function (desc, decorator) {
        return decorator(target, property, desc) || desc;
    }, desc);

    if (context && desc.initializer !== void 0) {
        desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
        desc.initializer = undefined;
    }

    if (desc.initializer === void 0) {
        Object['define' + 'Property'](target, property, desc);
        desc = null;
    }

    return desc;
}

function _initializerWarningHelper(descriptor, context) {
    throw new Error('Decorating class property failed. Please ensure that transform-class-properties is enabled.');
}

var TradeStore = (_dec = _mobx.action.bound, _dec2 = _mobx.action.bound, _dec3 = _mobx.action.bound, _dec4 = _mobx.action.bound, _dec5 = _mobx.action.bound, _dec6 = _mobx.action.bound, _dec7 = _mobx.action.bound, _dec8 = _mobx.action.bound, _dec9 = _mobx.action.bound, (_class = function (_BaseStore) {
    _inherits(TradeStore, _BaseStore);

    // Last Digit


    // Start Time


    // Amount


    // Contract Type
    function TradeStore(root_store) {
        _classCallCheck(this, TradeStore);

        var session_storage_properties = _query_string.allowed_query_string_variables;

        var _this = _possibleConstructorReturn(this, (TradeStore.__proto__ || Object.getPrototypeOf(TradeStore)).call(this, root_store, null, session_storage_properties));

        _initDefineProp(_this, 'is_purchase_enabled', _descriptor, _this);

        _initDefineProp(_this, 'is_trade_enabled', _descriptor2, _this);

        _initDefineProp(_this, 'symbol', _descriptor3, _this);

        _initDefineProp(_this, 'contract_expiry_type', _descriptor4, _this);

        _initDefineProp(_this, 'contract_start_type', _descriptor5, _this);

        _initDefineProp(_this, 'contract_type', _descriptor6, _this);

        _initDefineProp(_this, 'contract_types_list', _descriptor7, _this);

        _initDefineProp(_this, 'form_components', _descriptor8, _this);

        _initDefineProp(_this, 'trade_types', _descriptor9, _this);

        _initDefineProp(_this, 'amount', _descriptor10, _this);

        _initDefineProp(_this, 'basis', _descriptor11, _this);

        _initDefineProp(_this, 'basis_list', _descriptor12, _this);

        _initDefineProp(_this, 'currencies_list', _descriptor13, _this);

        _initDefineProp(_this, 'currency', _descriptor14, _this);

        _initDefineProp(_this, 'duration', _descriptor15, _this);

        _initDefineProp(_this, 'duration_unit', _descriptor16, _this);

        _initDefineProp(_this, 'duration_units_list', _descriptor17, _this);

        _initDefineProp(_this, 'expiry_date', _descriptor18, _this);

        _initDefineProp(_this, 'expiry_time', _descriptor19, _this);

        _initDefineProp(_this, 'expiry_type', _descriptor20, _this);

        _initDefineProp(_this, 'barrier_1', _descriptor21, _this);

        _initDefineProp(_this, 'barrier_2', _descriptor22, _this);

        _initDefineProp(_this, 'barrier_count', _descriptor23, _this);

        _initDefineProp(_this, 'start_date', _descriptor24, _this);

        _initDefineProp(_this, 'start_dates_list', _descriptor25, _this);

        _initDefineProp(_this, 'start_time', _descriptor26, _this);

        _initDefineProp(_this, 'sessions', _descriptor27, _this);

        _initDefineProp(_this, 'last_digit', _descriptor28, _this);

        _initDefineProp(_this, 'proposal_info', _descriptor29, _this);

        _initDefineProp(_this, 'purchase_info', _descriptor30, _this);

        _initDefineProp(_this, 'chart_barriers', _descriptor31, _this);

        _this.proposal_requests = {};
        return _this;
    }

    // Chart


    // Purchase
    // Number(0) refers to 'now'


    // Barrier


    // Duration


    // Underlying


    _createClass(TradeStore, [{
        key: 'init',
        value: function init() {
            var _this2 = this;

            if (this.symbol) {
                _contract_type2.default.buildContractTypesConfig(this.symbol).then((0, _mobx.action)(function () {
                    _this2.processNewValuesAsync(_extends({}, _contract_type2.default.getContractValues(_this2), _contract_type2.default.getContractCategories()));
                }));
            }
        }
    }, {
        key: 'onChange',
        value: function onChange(e) {
            var _e$target = e.target,
                name = _e$target.name,
                value = _e$target.value,
                type = _e$target.type;

            if (!(name in this)) {
                throw new Error('Invalid Argument: ' + name);
            }

            this.processNewValuesAsync(_defineProperty({}, name, type === 'number' ? +value : value), true);
        }
    }, {
        key: 'onHoverPurchase',
        value: function onHoverPurchase(is_over, contract_type) {
            if (!(0, _utility.isEmptyObject)(this.chart_barriers.main)) {
                this.chart_barriers.main.updateBarrierShade(this.chart_barriers, is_over, contract_type);
            }
        }
    }, {
        key: 'onPurchase',
        value: function onPurchase(proposal_id, price) {
            var _this3 = this;

            if (proposal_id) {
                (0, _purchase.processPurchase)(proposal_id, price).then((0, _mobx.action)(function (response) {
                    _this3.purchase_info = response;
                }));
            }
        }

        /**
         * Updates the store with new values
         * @param  {Object} new_state - new values to update the store with
         * @return {Object} returns the object having only those values that are updated
         */

    }, {
        key: 'updateStore',
        value: function updateStore(new_state) {
            var _this4 = this;

            Object.keys((0, _utility.cloneObject)(new_state)).forEach(function (key) {
                if (key === 'root_store') return;
                if (JSON.stringify(_this4[key]) === JSON.stringify(new_state[key])) {
                    delete new_state[key];
                } else {
                    if (key === 'symbol') {
                        _this4.is_purchase_enabled = false;
                        _this4.is_trade_enabled = false;
                    }

                    // Add changes to queryString of the url
                    if (_query_string.allowed_query_string_variables.indexOf(key) !== -1) {
                        _URL2.default.setQueryParam(_defineProperty({}, key, new_state[key]));
                    }

                    _this4[key] = new_state[key];
                }
            });

            return new_state;
        }
    }, {
        key: 'processNewValuesAsync',
        value: function () {
            var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
                var obj_new_values = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
                var is_changed_by_user = arguments[1];
                var new_state, is_barrier_changed, snapshot;
                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                new_state = this.updateStore((0, _utility.cloneObject)(obj_new_values));

                                if (!(is_changed_by_user || /\b(symbol|contract_types_list)\b/.test(Object.keys(new_state)))) {
                                    _context.next = 14;
                                    break;
                                }

                                if (!('symbol' in new_state)) {
                                    _context.next = 5;
                                    break;
                                }

                                _context.next = 5;
                                return _Symbol.onChangeSymbolAsync(new_state.symbol);

                            case 5:
                                is_barrier_changed = 'barrier_1' in new_state || 'barrier_2' in new_state;

                                this.updateStore(_extends({ // disable purchase button(s), clear contract info, cleanup chart
                                    is_purchase_enabled: false,
                                    proposal_info: {}
                                }, is_barrier_changed ? {} : { chart_barriers: {} }));
                                if (is_barrier_changed && !(0, _utility.isEmptyObject)(this.chart_barriers.main)) {
                                    this.chart_barriers.main.updateBarriers({ high: this.barrier_1, low: this.barrier_2 });
                                }

                                _context.next = 10;
                                return (0, _process.processTradeParams)(this, new_state);

                            case 10:
                                snapshot = _context.sent;

                                snapshot.is_trade_enabled = true;
                                this.updateStore(snapshot);

                                this.requestProposal();

                            case 14:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));

            function processNewValuesAsync() {
                return _ref.apply(this, arguments);
            }

            return processNewValuesAsync;
        }()
    }, {
        key: 'requestProposal',
        value: function requestProposal() {
            var _this5 = this;

            var requests = (0, _proposal.createProposalRequests)(this);
            if (!(0, _utility.isEmptyObject)(requests)) {
                this.proposal_requests = requests;
                this.proposal_info = {};

                _Services.WS.forgetAll('proposal').then(function () {
                    Object.keys(_this5.proposal_requests).forEach(function (type) {
                        _Services.WS.subscribeProposal(_this5.proposal_requests[type], _this5.onProposalResponse);
                    });
                });
            }
        }
    }, {
        key: 'onProposalResponse',
        value: function onProposalResponse(response) {
            var contract_type = response.echo_req.contract_type;
            this.proposal_info = _extends({}, this.proposal_info, _defineProperty({}, contract_type, (0, _proposal.getProposalInfo)(this, response)));

            if ((0, _utility.isEmptyObject)(this.chart_barriers.main)) {
                this.chart_barriers = {
                    main: (0, _chart.createChartBarriersConfig)(contract_type, response, this.onChartBarrierChange)
                };
            }

            this.is_purchase_enabled = true;
        }
    }, {
        key: 'onChartBarrierChange',
        value: function onChartBarrierChange() {
            var main_barriers = this.chart_barriers.main;
            this.processNewValuesAsync({
                barrier_1: '' + (main_barriers.relative && !/^[+-]/.test(main_barriers.high) ? '+' : '') + main_barriers.high,
                barrier_2: '' + main_barriers.low
            }, true);
        }
    }, {
        key: 'updateQueryString',
        value: function updateQueryString() {
            // Update the url's query string by default values of the store
            var queryParams = _URL2.default.updateQueryString(this, _query_string.allowed_query_string_variables);

            // update state values from query string
            var config = {};
            [].concat(_toConsumableArray(queryParams)).forEach(function (param) {
                config[param[0]] = isNaN(param[1]) ? param[1] : +param[1];
            });
            this.processNewValuesAsync(config);
        }
    }]);

    return TradeStore;
}(_base_store2.default), (_descriptor = _applyDecoratedDescriptor(_class.prototype, 'is_purchase_enabled', [_mobx.observable], {
    enumerable: true,
    initializer: function initializer() {
        return false;
    }
}), _descriptor2 = _applyDecoratedDescriptor(_class.prototype, 'is_trade_enabled', [_mobx.observable], {
    enumerable: true,
    initializer: function initializer() {
        return false;
    }
}), _descriptor3 = _applyDecoratedDescriptor(_class.prototype, 'symbol', [_mobx.observable], {
    enumerable: true,
    initializer: null
}), _descriptor4 = _applyDecoratedDescriptor(_class.prototype, 'contract_expiry_type', [_mobx.observable], {
    enumerable: true,
    initializer: function initializer() {
        return '';
    }
}), _descriptor5 = _applyDecoratedDescriptor(_class.prototype, 'contract_start_type', [_mobx.observable], {
    enumerable: true,
    initializer: function initializer() {
        return '';
    }
}), _descriptor6 = _applyDecoratedDescriptor(_class.prototype, 'contract_type', [_mobx.observable], {
    enumerable: true,
    initializer: function initializer() {
        return '';
    }
}), _descriptor7 = _applyDecoratedDescriptor(_class.prototype, 'contract_types_list', [_mobx.observable], {
    enumerable: true,
    initializer: function initializer() {
        return {};
    }
}), _descriptor8 = _applyDecoratedDescriptor(_class.prototype, 'form_components', [_mobx.observable], {
    enumerable: true,
    initializer: function initializer() {
        return [];
    }
}), _descriptor9 = _applyDecoratedDescriptor(_class.prototype, 'trade_types', [_mobx.observable], {
    enumerable: true,
    initializer: function initializer() {
        return {};
    }
}), _descriptor10 = _applyDecoratedDescriptor(_class.prototype, 'amount', [_mobx.observable], {
    enumerable: true,
    initializer: function initializer() {
        return 10;
    }
}), _descriptor11 = _applyDecoratedDescriptor(_class.prototype, 'basis', [_mobx.observable], {
    enumerable: true,
    initializer: function initializer() {
        return '';
    }
}), _descriptor12 = _applyDecoratedDescriptor(_class.prototype, 'basis_list', [_mobx.observable], {
    enumerable: true,
    initializer: function initializer() {
        return [];
    }
}), _descriptor13 = _applyDecoratedDescriptor(_class.prototype, 'currencies_list', [_mobx.observable], {
    enumerable: true,
    initializer: function initializer() {
        return {};
    }
}), _descriptor14 = _applyDecoratedDescriptor(_class.prototype, 'currency', [_mobx.observable], {
    enumerable: true,
    initializer: function initializer() {
        return _client_base2.default.get('currency');
    }
}), _descriptor15 = _applyDecoratedDescriptor(_class.prototype, 'duration', [_mobx.observable], {
    enumerable: true,
    initializer: function initializer() {
        return 5;
    }
}), _descriptor16 = _applyDecoratedDescriptor(_class.prototype, 'duration_unit', [_mobx.observable], {
    enumerable: true,
    initializer: function initializer() {
        return '';
    }
}), _descriptor17 = _applyDecoratedDescriptor(_class.prototype, 'duration_units_list', [_mobx.observable], {
    enumerable: true,
    initializer: function initializer() {
        return [];
    }
}), _descriptor18 = _applyDecoratedDescriptor(_class.prototype, 'expiry_date', [_mobx.observable], {
    enumerable: true,
    initializer: function initializer() {
        return '';
    }
}), _descriptor19 = _applyDecoratedDescriptor(_class.prototype, 'expiry_time', [_mobx.observable], {
    enumerable: true,
    initializer: function initializer() {
        return '09:40';
    }
}), _descriptor20 = _applyDecoratedDescriptor(_class.prototype, 'expiry_type', [_mobx.observable], {
    enumerable: true,
    initializer: function initializer() {
        return 'duration';
    }
}), _descriptor21 = _applyDecoratedDescriptor(_class.prototype, 'barrier_1', [_mobx.observable], {
    enumerable: true,
    initializer: function initializer() {
        return '';
    }
}), _descriptor22 = _applyDecoratedDescriptor(_class.prototype, 'barrier_2', [_mobx.observable], {
    enumerable: true,
    initializer: function initializer() {
        return '';
    }
}), _descriptor23 = _applyDecoratedDescriptor(_class.prototype, 'barrier_count', [_mobx.observable], {
    enumerable: true,
    initializer: function initializer() {
        return 0;
    }
}), _descriptor24 = _applyDecoratedDescriptor(_class.prototype, 'start_date', [_mobx.observable], {
    enumerable: true,
    initializer: function initializer() {
        return Number(0);
    }
}), _descriptor25 = _applyDecoratedDescriptor(_class.prototype, 'start_dates_list', [_mobx.observable], {
    enumerable: true,
    initializer: function initializer() {
        return [];
    }
}), _descriptor26 = _applyDecoratedDescriptor(_class.prototype, 'start_time', [_mobx.observable], {
    enumerable: true,
    initializer: function initializer() {
        return '12:30';
    }
}), _descriptor27 = _applyDecoratedDescriptor(_class.prototype, 'sessions', [_mobx.observable], {
    enumerable: true,
    initializer: function initializer() {
        return [];
    }
}), _descriptor28 = _applyDecoratedDescriptor(_class.prototype, 'last_digit', [_mobx.observable], {
    enumerable: true,
    initializer: function initializer() {
        return 3;
    }
}), _descriptor29 = _applyDecoratedDescriptor(_class.prototype, 'proposal_info', [_mobx.observable], {
    enumerable: true,
    initializer: function initializer() {
        return {};
    }
}), _descriptor30 = _applyDecoratedDescriptor(_class.prototype, 'purchase_info', [_mobx.observable], {
    enumerable: true,
    initializer: function initializer() {
        return {};
    }
}), _descriptor31 = _applyDecoratedDescriptor(_class.prototype, 'chart_barriers', [_mobx.observable], {
    enumerable: true,
    initializer: function initializer() {
        return _mobx.observable.object({});
    }
}), _applyDecoratedDescriptor(_class.prototype, 'init', [_dec], Object.getOwnPropertyDescriptor(_class.prototype, 'init'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'onChange', [_dec2], Object.getOwnPropertyDescriptor(_class.prototype, 'onChange'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'onHoverPurchase', [_dec3], Object.getOwnPropertyDescriptor(_class.prototype, 'onHoverPurchase'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'onPurchase', [_dec4], Object.getOwnPropertyDescriptor(_class.prototype, 'onPurchase'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'updateStore', [_dec5], Object.getOwnPropertyDescriptor(_class.prototype, 'updateStore'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'requestProposal', [_dec6], Object.getOwnPropertyDescriptor(_class.prototype, 'requestProposal'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'onProposalResponse', [_dec7], Object.getOwnPropertyDescriptor(_class.prototype, 'onProposalResponse'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'onChartBarrierChange', [_dec8], Object.getOwnPropertyDescriptor(_class.prototype, 'onChartBarrierChange'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'updateQueryString', [_dec9], Object.getOwnPropertyDescriptor(_class.prototype, 'updateQueryString'), _class.prototype)), _class));
exports.default = TradeStore;
;

/***/ }),
/* 531 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = undefined;

var _statement_store = __webpack_require__(532);

var _statement_store2 = _interopRequireDefault(_statement_store);

var _trade_store = __webpack_require__(530);

var _trade_store2 = _interopRequireDefault(_trade_store);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ModulesStore = function ModulesStore(root_store) {
    _classCallCheck(this, ModulesStore);

    this.statement = new _statement_store2.default();
    this.trade = new _trade_store2.default(root_store);
};

exports.default = ModulesStore;
;

/***/ }),
/* 532 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _desc, _value, _class, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5;

var _mobx = __webpack_require__(41);

var _moment = __webpack_require__(9);

var _moment2 = _interopRequireDefault(_moment);

var _base_store = __webpack_require__(106);

var _base_store2 = _interopRequireDefault(_base_store);

var _Services = __webpack_require__(64);

var _currency_base = __webpack_require__(33);

var _client_base = __webpack_require__(22);

var _client_base2 = _interopRequireDefault(_client_base);

var _localize = __webpack_require__(0);

var _string_util = __webpack_require__(19);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _initDefineProp(target, property, descriptor, context) {
    if (!descriptor) return;
    Object.defineProperty(target, property, {
        enumerable: descriptor.enumerable,
        configurable: descriptor.configurable,
        writable: descriptor.writable,
        value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
    });
}

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
    var desc = {};
    Object['ke' + 'ys'](descriptor).forEach(function (key) {
        desc[key] = descriptor[key];
    });
    desc.enumerable = !!desc.enumerable;
    desc.configurable = !!desc.configurable;

    if ('value' in desc || desc.initializer) {
        desc.writable = true;
    }

    desc = decorators.slice().reverse().reduce(function (desc, decorator) {
        return decorator(target, property, desc) || desc;
    }, desc);

    if (context && desc.initializer !== void 0) {
        desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
        desc.initializer = undefined;
    }

    if (desc.initializer === void 0) {
        Object['define' + 'Property'](target, property, desc);
        desc = null;
    }

    return desc;
}

function _initializerWarningHelper(descriptor, context) {
    throw new Error('Decorating class property failed. Please ensure that transform-class-properties is enabled.');
}

var batch_size = 100; // request response limit

var StatementStore = (_dec = _mobx.action.bound, _dec2 = _mobx.action.bound, _dec3 = _mobx.action.bound, _dec4 = _mobx.action.bound, _dec5 = _mobx.action.bound, _dec6 = _mobx.action.bound, (_class = function (_BaseStore) {
    _inherits(StatementStore, _BaseStore);

    function StatementStore() {
        var _ref;

        var _temp, _this, _ret;

        _classCallCheck(this, StatementStore);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = StatementStore.__proto__ || Object.getPrototypeOf(StatementStore)).call.apply(_ref, [this].concat(args))), _this), _initDefineProp(_this, 'data', _descriptor, _this), _initDefineProp(_this, 'is_loading', _descriptor2, _this), _initDefineProp(_this, 'has_loaded_all', _descriptor3, _this), _initDefineProp(_this, 'date_from', _descriptor4, _this), _initDefineProp(_this, 'date_to', _descriptor5, _this), _temp), _possibleConstructorReturn(_this, _ret);
    }

    _createClass(StatementStore, [{
        key: 'clearTable',
        value: function clearTable() {
            this.data = [];
            this.has_loaded_all = false;
            this.is_loading = false;
        }
    }, {
        key: 'fetchNextBatch',
        value: function fetchNextBatch() {
            var _this2 = this;

            if (this.has_loaded_all || this.is_loading) return;

            this.is_loading = true;

            var currency = _client_base2.default.get('currency');

            _Services.WS.statement(batch_size, this.data.length, _extends({}, this.date_from && { date_from: (0, _moment2.default)(this.date_from).unix() }, this.date_to && { date_to: (0, _moment2.default)(this.date_to).add(1, 'd').subtract(1, 's').unix() })).then(function (response) {
                var formatted_transactions = response.statement.transactions.map(function (transaction) {
                    return getStatementData(transaction, currency);
                });

                _this2.data = [].concat(_toConsumableArray(_this2.data), _toConsumableArray(formatted_transactions));
                _this2.has_loaded_all = formatted_transactions.length < batch_size;
                _this2.is_loading = false;
            });
        }
    }, {
        key: 'handleDateChange',
        value: function handleDateChange(e) {
            if (e.target.value !== this[e.target.name]) {
                this[e.target.name] = e.target.value;
                this.clearTable();
                this.fetchNextBatch();
            }
        }
    }, {
        key: 'handleScroll',
        value: function handleScroll() {
            var _document$scrollingEl = document.scrollingElement,
                scrollTop = _document$scrollingEl.scrollTop,
                scrollHeight = _document$scrollingEl.scrollHeight,
                clientHeight = _document$scrollingEl.clientHeight;

            var left_to_scroll = scrollHeight - (scrollTop + clientHeight);

            if (left_to_scroll < 2000) {
                this.fetchNextBatch();
            }
        }
    }, {
        key: 'onMount',
        value: function onMount() {
            this.fetchNextBatch();
            window.addEventListener('scroll', this.handleScroll, false);
        }
    }, {
        key: 'onUnmount',
        value: function onUnmount() {
            window.removeEventListener('scroll', this.handleScroll, false);
            this.clearTable();
        }
    }, {
        key: 'has_no_activity_message',
        get: function get() {
            return !this.is_loading && this.data.length === 0;
        }
    }, {
        key: 'has_selected_date',
        get: function get() {
            return !!(this.date_from || this.date_to);
        }
    }]);

    return StatementStore;
}(_base_store2.default), (_descriptor = _applyDecoratedDescriptor(_class.prototype, 'data', [_mobx.observable], {
    enumerable: true,
    initializer: function initializer() {
        return [];
    }
}), _descriptor2 = _applyDecoratedDescriptor(_class.prototype, 'is_loading', [_mobx.observable], {
    enumerable: true,
    initializer: function initializer() {
        return false;
    }
}), _descriptor3 = _applyDecoratedDescriptor(_class.prototype, 'has_loaded_all', [_mobx.observable], {
    enumerable: true,
    initializer: function initializer() {
        return false;
    }
}), _descriptor4 = _applyDecoratedDescriptor(_class.prototype, 'date_from', [_mobx.observable], {
    enumerable: true,
    initializer: function initializer() {
        return '';
    }
}), _descriptor5 = _applyDecoratedDescriptor(_class.prototype, 'date_to', [_mobx.observable], {
    enumerable: true,
    initializer: function initializer() {
        return '';
    }
}), _applyDecoratedDescriptor(_class.prototype, 'clearTable', [_dec], Object.getOwnPropertyDescriptor(_class.prototype, 'clearTable'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'fetchNextBatch', [_dec2], Object.getOwnPropertyDescriptor(_class.prototype, 'fetchNextBatch'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'handleDateChange', [_dec3], Object.getOwnPropertyDescriptor(_class.prototype, 'handleDateChange'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'handleScroll', [_dec4], Object.getOwnPropertyDescriptor(_class.prototype, 'handleScroll'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'onMount', [_dec5], Object.getOwnPropertyDescriptor(_class.prototype, 'onMount'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'onUnmount', [_dec6], Object.getOwnPropertyDescriptor(_class.prototype, 'onUnmount'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'has_no_activity_message', [_mobx.computed], Object.getOwnPropertyDescriptor(_class.prototype, 'has_no_activity_message'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'has_selected_date', [_mobx.computed], Object.getOwnPropertyDescriptor(_class.prototype, 'has_selected_date'), _class.prototype)), _class));

/*
    RESPONSE PARSING FUNCTION
*/

exports.default = StatementStore;
var getStatementData = function getStatementData(statement, currency) {
    var date_obj = new Date(statement.transaction_time * 1000);
    var moment_obj = _moment2.default.utc(date_obj);
    var date_str = moment_obj.format('YYYY-MM-DD');
    var time_str = moment_obj.format('HH:mm:ss') + ' GMT';
    var payout = parseFloat(statement.payout);
    var amount = parseFloat(statement.amount);
    var balance = parseFloat(statement.balance_after);
    var should_exclude_currency = true;

    return {
        action: (0, _localize.localize)((0, _string_util.toTitleCase)(statement.action_type)),
        date: date_str + '\n' + time_str,
        refid: statement.transaction_id,
        payout: isNaN(payout) ? '-' : (0, _currency_base.formatMoney)(currency, payout, should_exclude_currency),
        amount: isNaN(amount) ? '-' : (0, _currency_base.formatMoney)(currency, amount, should_exclude_currency),
        balance: isNaN(balance) ? '-' : (0, _currency_base.formatMoney)(currency, balance, should_exclude_currency),
        desc: (0, _localize.localize)(statement.longcode.replace(/\n/g, '<br />')),
        id: statement.contract_id,
        app_id: statement.app_id
    };
};

/***/ }),
/* 533 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = undefined;

var _desc, _value, _class, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6;

var _mobx = __webpack_require__(41);

var _base_store = __webpack_require__(106);

var _base_store2 = _interopRequireDefault(_base_store);

var _client_base = __webpack_require__(22);

var _client_base2 = _interopRequireDefault(_client_base);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _initDefineProp(target, property, descriptor, context) {
    if (!descriptor) return;
    Object.defineProperty(target, property, {
        enumerable: descriptor.enumerable,
        configurable: descriptor.configurable,
        writable: descriptor.writable,
        value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
    });
}

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
    var desc = {};
    Object['ke' + 'ys'](descriptor).forEach(function (key) {
        desc[key] = descriptor[key];
    });
    desc.enumerable = !!desc.enumerable;
    desc.configurable = !!desc.configurable;

    if ('value' in desc || desc.initializer) {
        desc.writable = true;
    }

    desc = decorators.slice().reverse().reduce(function (desc, decorator) {
        return decorator(target, property, desc) || desc;
    }, desc);

    if (context && desc.initializer !== void 0) {
        desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
        desc.initializer = undefined;
    }

    if (desc.initializer === void 0) {
        Object['define' + 'Property'](target, property, desc);
        desc = null;
    }

    return desc;
}

function _initializerWarningHelper(descriptor, context) {
    throw new Error('Decorating class property failed. Please ensure that transform-class-properties is enabled.');
}

var ClientStore = (_class = function (_BaseStore) {
    _inherits(ClientStore, _BaseStore);

    function ClientStore() {
        var _ref;

        var _temp, _this, _ret;

        _classCallCheck(this, ClientStore);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = ClientStore.__proto__ || Object.getPrototypeOf(ClientStore)).call.apply(_ref, [this].concat(args))), _this), _initDefineProp(_this, 'balance', _descriptor, _this), _initDefineProp(_this, 'is_logged_in', _descriptor2, _this), _initDefineProp(_this, 'loginid', _descriptor3, _this), _initDefineProp(_this, 'currency', _descriptor4, _this), _initDefineProp(_this, 'upgrade_info', _descriptor5, _this), _initDefineProp(_this, 'can_upgrade', _descriptor6, _this), _temp), _possibleConstructorReturn(_this, _ret);
    }

    return ClientStore;
}(_base_store2.default), (_descriptor = _applyDecoratedDescriptor(_class.prototype, 'balance', [_mobx.observable], {
    enumerable: true,
    initializer: null
}), _descriptor2 = _applyDecoratedDescriptor(_class.prototype, 'is_logged_in', [_mobx.observable], {
    enumerable: true,
    initializer: function initializer() {
        return !!_client_base2.default.isLoggedIn();
    }
}), _descriptor3 = _applyDecoratedDescriptor(_class.prototype, 'loginid', [_mobx.observable], {
    enumerable: true,
    initializer: function initializer() {
        return _client_base2.default.get('loginid');
    }
}), _descriptor4 = _applyDecoratedDescriptor(_class.prototype, 'currency', [_mobx.observable], {
    enumerable: true,
    initializer: function initializer() {
        return _client_base2.default.get('currency') || '';
    }
}), _descriptor5 = _applyDecoratedDescriptor(_class.prototype, 'upgrade_info', [_mobx.observable], {
    enumerable: true,
    initializer: function initializer() {
        return _client_base2.default.getBasicUpgradeInfo();
    }
}), _descriptor6 = _applyDecoratedDescriptor(_class.prototype, 'can_upgrade', [_mobx.observable], {
    enumerable: true,
    initializer: function initializer() {
        return this.upgrade_info.can_upgrade || this.upgrade_info.can_open_multi;
    }
})), _class);
exports.default = ClientStore;
;

/***/ }),
/* 534 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = undefined;

var _desc, _value, _class, _descriptor, _descriptor2;

var _mobx = __webpack_require__(41);

var _moment = __webpack_require__(9);

var _moment2 = _interopRequireDefault(_moment);

var _index = __webpack_require__(260);

var _base_store = __webpack_require__(106);

var _base_store2 = _interopRequireDefault(_base_store);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _initDefineProp(target, property, descriptor, context) {
    if (!descriptor) return;
    Object.defineProperty(target, property, {
        enumerable: descriptor.enumerable,
        configurable: descriptor.configurable,
        writable: descriptor.writable,
        value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
    });
}

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
    var desc = {};
    Object['ke' + 'ys'](descriptor).forEach(function (key) {
        desc[key] = descriptor[key];
    });
    desc.enumerable = !!desc.enumerable;
    desc.configurable = !!desc.configurable;

    if ('value' in desc || desc.initializer) {
        desc.writable = true;
    }

    desc = decorators.slice().reverse().reduce(function (desc, decorator) {
        return decorator(target, property, desc) || desc;
    }, desc);

    if (context && desc.initializer !== void 0) {
        desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
        desc.initializer = undefined;
    }

    if (desc.initializer === void 0) {
        Object['define' + 'Property'](target, property, desc);
        desc = null;
    }

    return desc;
}

function _initializerWarningHelper(descriptor, context) {
    throw new Error('Decorating class property failed. Please ensure that transform-class-properties is enabled.');
}

var CommonStore = (_class = function (_BaseStore) {
    _inherits(CommonStore, _BaseStore);

    function CommonStore() {
        var _ref;

        var _temp, _this, _ret;

        _classCallCheck(this, CommonStore);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = CommonStore.__proto__ || Object.getPrototypeOf(CommonStore)).call.apply(_ref, [this].concat(args))), _this), _initDefineProp(_this, 'server_time', _descriptor, _this), _initDefineProp(_this, 'current_language', _descriptor2, _this), _temp), _possibleConstructorReturn(_this, _ret);
    }

    return CommonStore;
}(_base_store2.default), (_descriptor = _applyDecoratedDescriptor(_class.prototype, 'server_time', [_mobx.observable], {
    enumerable: true,
    initializer: function initializer() {
        return _moment2.default.utc();
    }
}), _descriptor2 = _applyDecoratedDescriptor(_class.prototype, 'current_language', [_mobx.observable], {
    enumerable: true,
    initializer: function initializer() {
        return _index.currentLanguage;
    }
})), _class);
exports.default = CommonStore;
;

/***/ }),
/* 535 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = undefined;

var _client_store = __webpack_require__(533);

var _client_store2 = _interopRequireDefault(_client_store);

var _common_store = __webpack_require__(534);

var _common_store2 = _interopRequireDefault(_common_store);

var _Modules = __webpack_require__(531);

var _Modules2 = _interopRequireDefault(_Modules);

var _ui_store = __webpack_require__(536);

var _ui_store2 = _interopRequireDefault(_ui_store);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var RootStore = function RootStore() {
    _classCallCheck(this, RootStore);

    this.client = new _client_store2.default();
    this.common = new _common_store2.default();
    this.modules = new _Modules2.default(this);
    this.ui = new _ui_store2.default();
};

exports.default = RootStore;
;

/***/ }),
/* 536 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _dec12, _dec13, _dec14, _desc, _value, _class, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _descriptor10, _descriptor11, _descriptor12;

var _mobx = __webpack_require__(41);

var _base_store = __webpack_require__(106);

var _base_store2 = _interopRequireDefault(_base_store);

var _ui = __webpack_require__(243);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _initDefineProp(target, property, descriptor, context) {
    if (!descriptor) return;
    Object.defineProperty(target, property, {
        enumerable: descriptor.enumerable,
        configurable: descriptor.configurable,
        writable: descriptor.writable,
        value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
    });
}

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
    var desc = {};
    Object['ke' + 'ys'](descriptor).forEach(function (key) {
        desc[key] = descriptor[key];
    });
    desc.enumerable = !!desc.enumerable;
    desc.configurable = !!desc.configurable;

    if ('value' in desc || desc.initializer) {
        desc.writable = true;
    }

    desc = decorators.slice().reverse().reduce(function (desc, decorator) {
        return decorator(target, property, desc) || desc;
    }, desc);

    if (context && desc.initializer !== void 0) {
        desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
        desc.initializer = undefined;
    }

    if (desc.initializer === void 0) {
        Object['define' + 'Property'](target, property, desc);
        desc = null;
    }

    return desc;
}

function _initializerWarningHelper(descriptor, context) {
    throw new Error('Decorating class property failed. Please ensure that transform-class-properties is enabled.');
}

var UIStore = (_dec = _mobx.action.bound, _dec2 = _mobx.action.bound, _dec3 = _mobx.action.bound, _dec4 = _mobx.action.bound, _dec5 = _mobx.action.bound, _dec6 = _mobx.action.bound, _dec7 = _mobx.action.bound, _dec8 = _mobx.action.bound, _dec9 = _mobx.action.bound, _dec10 = _mobx.action.bound, _dec11 = _mobx.action.bound, _dec12 = _mobx.action.bound, _dec13 = _mobx.action.bound, _dec14 = _mobx.action.bound, (_class = function (_BaseStore) {
    _inherits(UIStore, _BaseStore);

    function UIStore() {
        _classCallCheck(this, UIStore);

        var local_storage_properties = ['is_chart_asset_info_visible', 'is_chart_countdown_visible', 'is_chart_layout_default', 'is_dark_mode_on', 'is_portfolio_drawer_on', 'is_purchase_confirm_on', 'is_purchase_lock_on'];

        var _this = _possibleConstructorReturn(this, (UIStore.__proto__ || Object.getPrototypeOf(UIStore)).call(this, null, local_storage_properties));

        _initDefineProp(_this, 'is_portfolio_drawer_on', _descriptor, _this);

        _initDefineProp(_this, 'is_main_drawer_on', _descriptor2, _this);

        _initDefineProp(_this, 'is_notifications_drawer_on', _descriptor3, _this);

        _initDefineProp(_this, 'screen_width', _descriptor4, _this);

        _initDefineProp(_this, 'is_settings_dialog_on', _descriptor5, _this);

        _initDefineProp(_this, 'is_language_dialog_on', _descriptor6, _this);

        _initDefineProp(_this, 'is_dark_mode_on', _descriptor7, _this);

        _initDefineProp(_this, 'is_purchase_confirm_on', _descriptor8, _this);

        _initDefineProp(_this, 'is_purchase_lock_on', _descriptor9, _this);

        _initDefineProp(_this, 'is_chart_layout_default', _descriptor10, _this);

        _initDefineProp(_this, 'is_chart_asset_info_visible', _descriptor11, _this);

        _initDefineProp(_this, 'is_chart_countdown_visible', _descriptor12, _this);

        window.addEventListener('resize', _this.updateScreenWidth);
        return _this;
    }

    // SmartCharts Controls


    // Purchase Controls


    _createClass(UIStore, [{
        key: 'updateScreenWidth',
        value: function updateScreenWidth() {
            this.screen_width = window.innerWidth;
        }
    }, {
        key: 'toggleChartLayout',
        value: function toggleChartLayout() {
            this.is_chart_layout_default = !this.is_chart_layout_default;
        }
    }, {
        key: 'toggleChartAssetInfo',
        value: function toggleChartAssetInfo() {
            this.is_chart_asset_info_visible = !this.is_chart_asset_info_visible;
        }
    }, {
        key: 'toggleChartCountdown',
        value: function toggleChartCountdown() {
            this.is_chart_countdown_visible = !this.is_chart_countdown_visible;
        }
    }, {
        key: 'togglePurchaseLock',
        value: function togglePurchaseLock() {
            this.is_purchase_lock_on = !this.is_purchase_lock_on;
        }
    }, {
        key: 'togglePurchaseConfirmation',
        value: function togglePurchaseConfirmation() {
            this.is_purchase_confirm_on = !this.is_purchase_confirm_on;
        }
    }, {
        key: 'toggleDarkMode',
        value: function toggleDarkMode() {
            this.is_dark_mode_on = !this.is_dark_mode_on;
        }
    }, {
        key: 'toggleSettingsDialog',
        value: function toggleSettingsDialog() {
            this.is_settings_dialog_on = !this.is_settings_dialog_on;
            if (!this.is_settings_dialog_on) this.is_language_dialog_on = false;
        }
    }, {
        key: 'showLanguageDialog',
        value: function showLanguageDialog() {
            this.is_language_dialog_on = true;
        }
    }, {
        key: 'hideLanguageDialog',
        value: function hideLanguageDialog() {
            this.is_language_dialog_on = false;
        }
    }, {
        key: 'togglePortfolioDrawer',
        value: function togglePortfolioDrawer() {
            // show and hide Portfolio Drawer
            this.is_portfolio_drawer_on = !this.is_portfolio_drawer_on;
        }
    }, {
        key: 'showMainDrawer',
        value: function showMainDrawer() {
            // show main Drawer
            this.is_main_drawer_on = true;
        }
    }, {
        key: 'showNotificationsDrawer',
        value: function showNotificationsDrawer() {
            // show nofitications Drawer
            this.is_notifications_drawer_on = true;
        }
    }, {
        key: 'hideDrawers',
        value: function hideDrawers() {
            // hide both menu drawers
            this.is_main_drawer_on = false;
            this.is_notifications_drawer_on = false;
        }
    }, {
        key: 'is_mobile',
        get: function get() {
            return this.screen_width <= _ui.MAX_MOBILE_WIDTH;
        }
    }]);

    return UIStore;
}(_base_store2.default), (_descriptor = _applyDecoratedDescriptor(_class.prototype, 'is_portfolio_drawer_on', [_mobx.observable], {
    enumerable: true,
    initializer: function initializer() {
        return false;
    }
}), _descriptor2 = _applyDecoratedDescriptor(_class.prototype, 'is_main_drawer_on', [_mobx.observable], {
    enumerable: true,
    initializer: function initializer() {
        return false;
    }
}), _descriptor3 = _applyDecoratedDescriptor(_class.prototype, 'is_notifications_drawer_on', [_mobx.observable], {
    enumerable: true,
    initializer: function initializer() {
        return false;
    }
}), _descriptor4 = _applyDecoratedDescriptor(_class.prototype, 'screen_width', [_mobx.observable], {
    enumerable: true,
    initializer: function initializer() {
        return window.innerWidth;
    }
}), _descriptor5 = _applyDecoratedDescriptor(_class.prototype, 'is_settings_dialog_on', [_mobx.observable], {
    enumerable: true,
    initializer: function initializer() {
        return false;
    }
}), _descriptor6 = _applyDecoratedDescriptor(_class.prototype, 'is_language_dialog_on', [_mobx.observable], {
    enumerable: true,
    initializer: function initializer() {
        return false;
    }
}), _descriptor7 = _applyDecoratedDescriptor(_class.prototype, 'is_dark_mode_on', [_mobx.observable], {
    enumerable: true,
    initializer: function initializer() {
        return true;
    }
}), _descriptor8 = _applyDecoratedDescriptor(_class.prototype, 'is_purchase_confirm_on', [_mobx.observable], {
    enumerable: true,
    initializer: function initializer() {
        return false;
    }
}), _descriptor9 = _applyDecoratedDescriptor(_class.prototype, 'is_purchase_lock_on', [_mobx.observable], {
    enumerable: true,
    initializer: function initializer() {
        return false;
    }
}), _descriptor10 = _applyDecoratedDescriptor(_class.prototype, 'is_chart_layout_default', [_mobx.observable], {
    enumerable: true,
    initializer: function initializer() {
        return false;
    }
}), _descriptor11 = _applyDecoratedDescriptor(_class.prototype, 'is_chart_asset_info_visible', [_mobx.observable], {
    enumerable: true,
    initializer: function initializer() {
        return true;
    }
}), _descriptor12 = _applyDecoratedDescriptor(_class.prototype, 'is_chart_countdown_visible', [_mobx.observable], {
    enumerable: true,
    initializer: function initializer() {
        return false;
    }
}), _applyDecoratedDescriptor(_class.prototype, 'updateScreenWidth', [_dec], Object.getOwnPropertyDescriptor(_class.prototype, 'updateScreenWidth'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'is_mobile', [_mobx.computed], Object.getOwnPropertyDescriptor(_class.prototype, 'is_mobile'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'toggleChartLayout', [_dec2], Object.getOwnPropertyDescriptor(_class.prototype, 'toggleChartLayout'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'toggleChartAssetInfo', [_dec3], Object.getOwnPropertyDescriptor(_class.prototype, 'toggleChartAssetInfo'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'toggleChartCountdown', [_dec4], Object.getOwnPropertyDescriptor(_class.prototype, 'toggleChartCountdown'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'togglePurchaseLock', [_dec5], Object.getOwnPropertyDescriptor(_class.prototype, 'togglePurchaseLock'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'togglePurchaseConfirmation', [_dec6], Object.getOwnPropertyDescriptor(_class.prototype, 'togglePurchaseConfirmation'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'toggleDarkMode', [_dec7], Object.getOwnPropertyDescriptor(_class.prototype, 'toggleDarkMode'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'toggleSettingsDialog', [_dec8], Object.getOwnPropertyDescriptor(_class.prototype, 'toggleSettingsDialog'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'showLanguageDialog', [_dec9], Object.getOwnPropertyDescriptor(_class.prototype, 'showLanguageDialog'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'hideLanguageDialog', [_dec10], Object.getOwnPropertyDescriptor(_class.prototype, 'hideLanguageDialog'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'togglePortfolioDrawer', [_dec11], Object.getOwnPropertyDescriptor(_class.prototype, 'togglePortfolioDrawer'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'showMainDrawer', [_dec12], Object.getOwnPropertyDescriptor(_class.prototype, 'showMainDrawer'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'showNotificationsDrawer', [_dec13], Object.getOwnPropertyDescriptor(_class.prototype, 'showNotificationsDrawer'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'hideDrawers', [_dec14], Object.getOwnPropertyDescriptor(_class.prototype, 'hideDrawers'), _class.prototype)), _class));
exports.default = UIStore;
;

/***/ }),
/* 537 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.daysFromTodayTo = exports.formatDate = exports.toGMTFormat = exports.convertToUnix = exports.toMoment = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _moment = __webpack_require__(9);

var _moment2 = _interopRequireDefault(_moment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Convert epoch to moment object
 * @param  {Number} epoch
 * @return {moment} the moment object of provided epoch
 */
var toMoment = exports.toMoment = function toMoment(epoch) {
  return _moment2.default.unix(epoch).utc();
};

/**
 * Set specified time on moment object
 * @param  {moment} moment_obj  the moment to set the time on
 * @param  {String} time        24 hours format, may or may not include seconds
 * @return {moment} a new moment object of result
 */
var setTime = function setTime(moment_obj, time) {
  var _time$split = time.split(':'),
      _time$split2 = _slicedToArray(_time$split, 3),
      hour = _time$split2[0],
      minute = _time$split2[1],
      second = _time$split2[2];

  moment_obj.hour(hour).minute(minute || 0).second(second || 0);
  return moment_obj;
};

/**
 * return the unix value of provided epoch and time
 * @param  {Number} epoch  the date to update with provided time
 * @param  {String} time   the time to set on the date
 * @return {Number} unix value of the result
 */
var convertToUnix = exports.convertToUnix = function convertToUnix(epoch, time) {
  return setTime(toMoment(epoch), time).unix();
};

var toGMTFormat = exports.toGMTFormat = function toGMTFormat(time) {
  return (0, _moment2.default)(time || undefined).utc().format('YYYY-MM-DD HH:mm:ss [GMT]');
};

var formatDate = exports.formatDate = function formatDate(date) {
  var date_format = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'YYYY-MM-DD';
  return (0, _moment2.default)(date || undefined, date_format).format(date_format);
};

/**
 * return the number of days from today to date specified
 * @param  {String} date   the date to calculate number of days from today
 * @return {Number} an integer of the number of days
 */
var daysFromTodayTo = exports.daysFromTodayTo = function daysFromTodayTo(date) {
  var diff = (0, _moment2.default)(date).utc().diff((0, _moment2.default)().utc(), 'days');
  return !date || diff < 0 ? '' : diff + 1;
};

/***/ }),
/* 538 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getURL = exports.getAllowedLanguages = exports.currentLanguage = undefined;

var _language = __webpack_require__(13);

var currentLanguage = exports.currentLanguage = (0, _language.get)();

var getAllowedLanguages = exports.getAllowedLanguages = function getAllowedLanguages() {
    var exclude_languages = ['JA', 'ACH'];
    var language_list = Object.keys((0, _language.getAll)()).filter(function (key) {
        return !exclude_languages.includes(key);
    }).reduce(function (obj, key) {
        obj[key] = (0, _language.getAll)()[key];
        return obj;
    }, {});

    return language_list;
};

var getURL = exports.getURL = function getURL(lang) {
    return (0, _language.urlFor)(lang);
};

/***/ }),
/* 539 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * Returns an object that maps component properties to corresponding values from the store
 * @param  {Object} Component - the react presentational component
 * @param  {Object} stores    - the store objects to look for the property to get its value
 * @return {Object}
 */
var getComponentProperties = exports.getComponentProperties = function getComponentProperties(Component) {
    for (var _len = arguments.length, stores = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        stores[_key - 1] = arguments[_key];
    }

    return Object.getOwnPropertyNames(Component.propTypes || {}).reduce(function (acc, prop) {
        return _extends({}, acc, getPropFromStores.apply(undefined, [prop].concat(stores)));
    }, {});
};

/**
 * Find the property among provided stores and return an object {prop: value}
 * @param  {Object} stores - the store objects to look for the property to get its value
 * @param  {String} prop   - the property to find among stores
 * @return {Object}
 */
var getPropFromStores = function getPropFromStores(prop) {
    for (var _len2 = arguments.length, stores = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        stores[_key2 - 1] = arguments[_key2];
    }

    var store = stores.find(function (item) {
        return prop in item;
    }) || {};
    return prop in store ? _defineProperty({}, prop, store[prop]) : {};
};

/***/ }),
/* 540 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _url = __webpack_require__(541);

Object.defineProperty(exports, 'default', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_url).default;
  }
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ }),
/* 541 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _utility = __webpack_require__(3);

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var URLHelper = function () {
    function URLHelper() {
        _classCallCheck(this, URLHelper);
    }

    _createClass(URLHelper, null, [{
        key: 'getQueryParams',

        /**
         * Get query string of the url
         *
         * @param {String|null} url
         *
         * @return {Object} returns a key-value object that contains all query string of the url.
         */
        value: function getQueryParams(url) {
            var query_string = url ? new URL(url).search : window.location.search;
            var query_params = new URLSearchParams(query_string.slice(1));

            return query_params;
        }

        /**
         * append params to url query string
         *
         * @param {Object} params - a key value object that contains all query strings should be added to the url
         * @param {String} url - the url that should query strings add to
         *
         * @return {Object} returns modified url object.
         */

    }, {
        key: 'setQueryParam',
        value: function setQueryParam(params) {
            var url = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

            var url_object = url ? new URL(url) : window.location;
            var param_object = new URLSearchParams(url_object.search.slice(1));
            Object.keys(params).forEach(function (name) {
                param_object.delete(name);

                var value = params[name];

                if (value && (typeof value === 'undefined' ? 'undefined' : _typeof(value)) !== 'object' && value !== '') {
                    param_object.append(name, params[name]);
                }
            });

            param_object.sort();

            if (!url) {
                window.history.replaceState(null, null, '?' + param_object.toString());
            } else {
                url_object.seach = param_object.toString();
            }

            return url_object;
        }

        /**
         * Update query string by values of passing object
         *
         * @param {Object} store - an object that contains values which should be added to the query string
         * @param {string[]} allowed_query_string_variables - a list of variables those are allowed to add to query string.
         *
         * @return {Object} returns an iterator object of updated query string
         */

    }, {
        key: 'updateQueryString',
        value: function updateQueryString(store, allowed_query_string_variables) {

            var queryParams = URLHelper.getQueryParams();

            if (!(0, _utility.isEmptyObject)(store)) {

                // create query string by default values in trade_store if the param doesn't exist in query string.
                allowed_query_string_variables.filter(function (p) {
                    return !queryParams.get(p);
                }).forEach(function (key) {
                    if (store[key]) {
                        URLHelper.setQueryParam(_defineProperty({}, key, store[key]));
                        queryParams.set(key, store[key]);
                    }
                });
            }

            return queryParams;
        }
    }]);

    return URLHelper;
}();

exports.default = URLHelper;

/***/ }),
/* 542 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(116);

__webpack_require__(147);

var _app = __webpack_require__(323);

var _app2 = _interopRequireDefault(_app);

var _check_new_release = __webpack_require__(115);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

window.check_new_release = _check_new_release.checkNewRelease; // used by GTM to update page after a new release

document.addEventListener('DOMContentLoaded', _app2.default);
window.addEventListener('pageshow', function (e) {
    // Safari doesn't fire load event when using back button
    if (e.persisted) {
        (0, _app2.default)();
    }
});

/***/ }),
/* 543 */,
/* 544 */,
/* 545 */,
/* 546 */,
/* 547 */,
/* 548 */,
/* 549 */,
/* 550 */,
/* 551 */,
/* 552 */,
/* 553 */,
/* 554 */,
/* 555 */,
/* 556 */,
/* 557 */,
/* 558 */,
/* 559 */,
/* 560 */,
/* 561 */,
/* 562 */,
/* 563 */,
/* 564 */,
/* 565 */,
/* 566 */,
/* 567 */,
/* 568 */,
/* 569 */,
/* 570 */,
/* 571 */,
/* 572 */,
/* 573 */,
/* 574 */,
/* 575 */,
/* 576 */,
/* 577 */,
/* 578 */,
/* 579 */,
/* 580 */,
/* 581 */,
/* 582 */,
/* 583 */,
/* 584 */,
/* 585 */,
/* 586 */,
/* 587 */,
/* 588 */,
/* 589 */,
/* 590 */,
/* 591 */,
/* 592 */,
/* 593 */,
/* 594 */,
/* 595 */,
/* 596 */,
/* 597 */,
/* 598 */,
/* 599 */,
/* 600 */,
/* 601 */,
/* 602 */,
/* 603 */,
/* 604 */,
/* 605 */,
/* 606 */,
/* 607 */,
/* 608 */,
/* 609 */,
/* 610 */,
/* 611 */,
/* 612 */,
/* 613 */,
/* 614 */,
/* 615 */,
/* 616 */,
/* 617 */,
/* 618 */,
/* 619 */,
/* 620 */,
/* 621 */,
/* 622 */,
/* 623 */,
/* 624 */,
/* 625 */,
/* 626 */,
/* 627 */,
/* 628 */,
/* 629 */,
/* 630 */,
/* 631 */,
/* 632 */,
/* 633 */,
/* 634 */,
/* 635 */,
/* 636 */,
/* 637 */,
/* 638 */,
/* 639 */,
/* 640 */,
/* 641 */,
/* 642 */,
/* 643 */,
/* 644 */,
/* 645 */,
/* 646 */,
/* 647 */,
/* 648 */,
/* 649 */,
/* 650 */,
/* 651 */,
/* 652 */,
/* 653 */,
/* 654 */,
/* 655 */,
/* 656 */,
/* 657 */,
/* 658 */,
/* 659 */,
/* 660 */,
/* 661 */,
/* 662 */,
/* 663 */,
/* 664 */,
/* 665 */,
/* 666 */,
/* 667 */,
/* 668 */,
/* 669 */,
/* 670 */,
/* 671 */,
/* 672 */,
/* 673 */,
/* 674 */,
/* 675 */,
/* 676 */,
/* 677 */,
/* 678 */,
/* 679 */,
/* 680 */,
/* 681 */,
/* 682 */,
/* 683 */,
/* 684 */,
/* 685 */,
/* 686 */,
/* 687 */,
/* 688 */,
/* 689 */,
/* 690 */,
/* 691 */,
/* 692 */,
/* 693 */,
/* 694 */,
/* 695 */,
/* 696 */,
/* 697 */,
/* 698 */,
/* 699 */,
/* 700 */,
/* 701 */,
/* 702 */,
/* 703 */,
/* 704 */,
/* 705 */,
/* 706 */,
/* 707 */,
/* 708 */,
/* 709 */,
/* 710 */,
/* 711 */,
/* 712 */,
/* 713 */,
/* 714 */,
/* 715 */,
/* 716 */,
/* 717 */,
/* 718 */,
/* 719 */,
/* 720 */,
/* 721 */,
/* 722 */,
/* 723 */,
/* 724 */,
/* 725 */,
/* 726 */,
/* 727 */,
/* 728 */,
/* 729 */,
/* 730 */,
/* 731 */,
/* 732 */,
/* 733 */,
/* 734 */,
/* 735 */,
/* 736 */,
/* 737 */,
/* 738 */,
/* 739 */,
/* 740 */,
/* 741 */,
/* 742 */,
/* 743 */,
/* 744 */,
/* 745 */,
/* 746 */,
/* 747 */,
/* 748 */,
/* 749 */,
/* 750 */,
/* 751 */,
/* 752 */,
/* 753 */,
/* 754 */,
/* 755 */,
/* 756 */,
/* 757 */,
/* 758 */,
/* 759 */,
/* 760 */,
/* 761 */,
/* 762 */,
/* 763 */,
/* 764 */,
/* 765 */,
/* 766 */,
/* 767 */,
/* 768 */,
/* 769 */,
/* 770 */,
/* 771 */,
/* 772 */,
/* 773 */,
/* 774 */,
/* 775 */,
/* 776 */,
/* 777 */,
/* 778 */,
/* 779 */,
/* 780 */,
/* 781 */,
/* 782 */,
/* 783 */,
/* 784 */,
/* 785 */,
/* 786 */,
/* 787 */,
/* 788 */,
/* 789 */,
/* 790 */,
/* 791 */,
/* 792 */,
/* 793 */,
/* 794 */,
/* 795 */,
/* 796 */,
/* 797 */,
/* 798 */,
/* 799 */,
/* 800 */,
/* 801 */,
/* 802 */
/***/ (function(module, exports) {

module.exports = CIQ;

/***/ })
],[542]);
//# sourceMappingURL=binary_app.js.map