(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["binary_common"],{

/***/ 113:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var urlForLanguage = __webpack_require__(50).urlFor;
var urlLang = __webpack_require__(50).urlLang;
var createElement = __webpack_require__(5).createElement;
var isEmptyObject = __webpack_require__(5).isEmptyObject;
var getCurrentBinaryDomain = __webpack_require__(81).getCurrentBinaryDomain;
__webpack_require__(507);

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
        var new_url = '' + url.substring(0, url.indexOf('/' + url_lang + '/') + url_lang.length + 2) + (normalizePath(path) || 'home') + '.html' + (pars ? '?' + pars : '');
        // replace old lang with new lang
        return urlForLanguage(lang, new_url);
    };

    var default_domain = 'binary.com';
    var host_map = { // the exceptions regarding updating the URLs
        'bot.binary.com': 'www.binary.bot',
        'developers.binary.com': 'developers.binary.com', // same, shouldn't change
        'academy.binary.com': 'academy.binary.com',
        'tech.binary.com': 'tech.binary.com',
        'blog.binary.com': 'blog.binary.com'
    };

    var urlForCurrentDomain = function urlForCurrentDomain(href) {
        var current_domain = getCurrentBinaryDomain();

        if (!current_domain) {
            return href; // don't change when domain is not supported
        }

        var url_object = new URL(href);
        if (Object.keys(host_map).includes(url_object.hostname)) {
            url_object.hostname = host_map[url_object.hostname];
        } else if (url_object.hostname.indexOf(default_domain) !== -1) {
            // to keep all non-Binary links unchanged, we use default domain for all Binary links in the codebase (javascript and templates)
            url_object.hostname = url_object.hostname.replace(new RegExp('\\.' + default_domain, 'i'), '.' + current_domain);
        } else {
            return href;
        }

        return url_object.href;
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
        urlForCurrentDomain: urlForCurrentDomain,
        urlForStatic: urlForStatic,
        getSection: getSection,
        getHashValue: getHashValue,
        updateParamsWithoutReload: updateParamsWithoutReload,

        param: function param(name) {
            return paramsHash()[name];
        },
        websiteUrl: function websiteUrl() {
            return location.protocol + '//' + location.hostname + '/';
        },
        getDefaultDomain: function getDefaultDomain() {
            return default_domain;
        },
        getHostMap: function getHostMap() {
            return host_map;
        },
        resetStaticHost: function resetStaticHost() {
            static_host = undefined;
        }
    };
}();

module.exports = Url;

/***/ }),

/***/ 115:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var moment = __webpack_require__(14);
var getLanguage = __webpack_require__(50).get;
var LocalStore = __webpack_require__(37).LocalStore;
var getPropertyValue = __webpack_require__(5).getPropertyValue;
var getStaticHash = __webpack_require__(5).getStaticHash;
var isEmptyObject = __webpack_require__(5).isEmptyObject;

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

    var makeKey = function makeKey() {
        var source_obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        var msg_type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

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

/***/ 159:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var moment = __webpack_require__(14);
var BinarySocket = __webpack_require__(73);
var PromiseClass = __webpack_require__(5).PromiseClass;

var ServerTime = function () {
    var clock_started = false;
    var pending = new PromiseClass();
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
        pending.resolve();
        update_time_interval = setInterval(updateTime, 1000);
    };

    var get = function get() {
        return server_time ? server_time.clone() : undefined;
    };

    return {
        init: init,
        get: get,
        timePromise: pending.promise
    };
}();

module.exports = ServerTime;

/***/ }),

/***/ 160:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var moment = __webpack_require__(14);
var checkInput = __webpack_require__(89).checkInput;

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

/***/ 20:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var moment = __webpack_require__(14);
var isCryptocurrency = __webpack_require__(32).isCryptocurrency;
var SocketCache = __webpack_require__(115);
var localize = __webpack_require__(3).localize;
var LocalStore = __webpack_require__(37).LocalStore;
var State = __webpack_require__(37).State;
var getPropertyValue = __webpack_require__(5).getPropertyValue;
var isEmptyObject = __webpack_require__(5).isEmptyObject;

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

    var TypesMapConfig = function () {
        var types_map_config = void 0;

        var initTypesMap = function initTypesMap() {
            return {
                default: localize('Real'),
                financial: localize('Investment'),
                gaming: localize('Gaming'),
                virtual: localize('Virtual')
            };
        };

        return {
            get: function get() {
                if (!types_map_config) {
                    types_map_config = initTypesMap();
                }
                return types_map_config;
            }
        };
    }();

    var getAccountTitle = function getAccountTitle(loginid) {
        var types_map = TypesMapConfig.get();
        return types_map[getAccountType(loginid)] || types_map.default;
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

    // remove manager id or master distinction from group
    // remove EUR or GBP distinction from group
    var getMT5AccountType = function getMT5AccountType(group) {
        return group ? group.replace('\\', '_').replace(/_(\d+|master|EUR|GBP)/, '') : '';
    };

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

            can_upgrade_to = canUpgrade('costarica', 'iom', 'malta', 'maltainvest');
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

/***/ 224:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var Cookies = __webpack_require__(156);
var moment = __webpack_require__(14);
var ClientBase = __webpack_require__(20);
var Login = __webpack_require__(90);
var ServerTime = __webpack_require__(159);
var BinarySocket = __webpack_require__(73);
var getElementById = __webpack_require__(89).getElementById;
var isVisible = __webpack_require__(89).isVisible;
var getLanguage = __webpack_require__(50).get;
var State = __webpack_require__(37).State;
var getPropertyValue = __webpack_require__(5).getPropertyValue;
var getAppId = __webpack_require__(81).getAppId;

var GTM = function () {
    var isGtmApplicable = function isGtmApplicable() {
        return (/^(1|1098|14473)$/.test(getAppId())
        );
    };

    var getCommonVariables = function getCommonVariables() {
        return _extends({
            language: getLanguage(),
            pageTitle: pageTitle(),
            pjax: State.get('is_loaded_by_pjax'),
            url: document.URL
        }, ClientBase.isLoggedIn() && {
            visitorId: ClientBase.get('loginid'),
            bom_email: ClientBase.get('email')
        });
    };

    var pushDataLayer = function pushDataLayer(data) {
        if (isGtmApplicable() && !Login.isLoginPages()) {
            dataLayer.push(_extends({}, getCommonVariables(), data));
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

        localStorage.removeItem('GTM_login');
        localStorage.removeItem('GTM_new_account');

        var affiliate_token = Cookies.getJSON('affiliate_tracking');
        if (affiliate_token) {
            pushDataLayer({ bom_affiliate_token: affiliate_token.t });
        }

        var data = {
            visitorId: ClientBase.get('loginid'),
            bom_account_type: ClientBase.getAccountType(),
            bom_currency: ClientBase.get('currency'),
            bom_country: get_settings.country,
            bom_country_abbrev: get_settings.country_code,
            bom_email: get_settings.email,
            url: window.location.href,
            bom_today: Math.floor(Date.now() / 1000)
        };
        if (is_new_account) {
            data.event = 'new_account';
            data.bom_date_joined = data.bom_today;
        }
        if (!ClientBase.get('is_virtual')) {
            data.bom_age = parseInt((moment().unix() - get_settings.date_of_birth) / 31557600);
            data.bom_firstname = get_settings.first_name;
            data.bom_lastname = get_settings.last_name;
            data.bom_phone = get_settings.phone;
        }

        if (is_login) {
            data.event = 'log_in';
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

        // check if there are any transactions in the last 30 days for UX interview selection
        BinarySocket.send({ statement: 1, limit: 1 }).then(function (response) {
            var last_transaction_timestamp = getPropertyValue(response, ['statement', 'transactions', '0', 'transaction_time']);
            pushDataLayer({
                bom_transaction_in_last_30d: !!last_transaction_timestamp && moment(last_transaction_timestamp * 1000).isAfter(ServerTime.get().subtract(30, 'days'))
            });
        });
    };

    var pushPurchaseData = function pushPurchaseData(response) {
        if (!isGtmApplicable() || ClientBase.get('is_virtual')) return;
        var buy = response.buy;
        if (!buy) return;
        var req = response.echo_req.passthrough;
        var data = {
            event: 'buy_contract',
            bom_ui: 'legacy',
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

/***/ 3:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var moment = __webpack_require__(14);
var template = __webpack_require__(5).template;

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

    /**
     * Localizes the text, but doesn't replace placeholders
     * The localized text through this method should replace the placeholders later. e.g. using template()
     * @param  {String} text - text to be localized
     * @return {String} the localized text having the original placeholders ([_1], ...)
     */
    var localizeKeepPlaceholders = function localizeKeepPlaceholders(text) {
        return localize(text /* localize-ignore */
        , [].concat(_toConsumableArray(new Set(text.match(/\[_(\d+)]/g).sort()))));
    };

    return {
        localize: localize,
        localizeKeepPlaceholders: localizeKeepPlaceholders,
        forLang: localizeForLang
    };
}();

module.exports = Localize;

/***/ }),

/***/ 32:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var getLanguage = __webpack_require__(50).get;
var localize = __webpack_require__(3).localize;
var getPropertyValue = __webpack_require__(5).getPropertyValue;

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

var calcDecimalPlaces = function calcDecimalPlaces(currency) {
    return isCryptocurrency(currency) ? 8 : 2;
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
    return (/crypto/i.test(getPropertyValue(currencies_config, [currency, 'type'])) || currency in CryptoConfig.get()
    );
};

var CryptoConfig = function () {
    var crypto_config = void 0;

    var initCryptoConfig = function initCryptoConfig() {
        return {
            BTC: { name: localize('Bitcoin'), min_withdrawal: 0.002, pa_max_withdrawal: 5, pa_min_withdrawal: 0.002 },
            BCH: { name: localize('Bitcoin Cash'), min_withdrawal: 0.002, pa_max_withdrawal: 5, pa_min_withdrawal: 0.002 },
            ETH: { name: localize('Ether'), min_withdrawal: 0.002, pa_max_withdrawal: 5, pa_min_withdrawal: 0.002 },
            ETC: { name: localize('Ether Classic'), min_withdrawal: 0.002, pa_max_withdrawal: 5, pa_min_withdrawal: 0.002 },
            LTC: { name: localize('Litecoin'), min_withdrawal: 0.002, pa_max_withdrawal: 5, pa_min_withdrawal: 0.002 },
            DAI: { name: localize('Dai'), min_withdrawal: 0.02, pa_max_withdrawal: 2000, pa_min_withdrawal: 10 },
            UST: { name: localize('Tether'), min_withdrawal: 0.02, pa_max_withdrawal: 2000, pa_min_withdrawal: 10 }
        };
    };

    return {
        get: function get() {
            if (!crypto_config) {
                crypto_config = initCryptoConfig();
            }
            return crypto_config;
        }
    };
}();

var getMinWithdrawal = function getMinWithdrawal(currency) {
    return isCryptocurrency(currency) ? getPropertyValue(CryptoConfig.get(), [currency, 'min_withdrawal']) || 0.002 : 1;
};

var getMinTransfer = function getMinTransfer(currency) {
    return getPropertyValue(currencies_config, [currency, 'limits', 'transfer_between_accounts', 'min']) || getMinWithdrawal(currency);
};

// @param {String} limit = max|min
var getPaWithdrawalLimit = function getPaWithdrawalLimit(currency, limit) {
    if (isCryptocurrency(currency)) {
        return getPropertyValue(CryptoConfig.get(), [currency, 'pa_' + limit + '_withdrawal']); // pa_min_withdrawal and pa_max_withdrawal used here
    }
    return limit === 'max' ? 2000 : 10; // limits for fiat currency
};

var getCurrencyName = function getCurrencyName(currency) {
    return getPropertyValue(CryptoConfig.get(), [currency, 'name']) || '';
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
    getMinTransfer: getMinTransfer,
    getMinPayout: getMinPayout,
    getPaWithdrawalLimit: getPaWithdrawalLimit,
    getCurrencies: function getCurrencies() {
        return currencies_config;
    }
};

/***/ }),

/***/ 37:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Cookies = __webpack_require__(156);
var getPropertyValue = __webpack_require__(5).getPropertyValue;
var isEmptyObject = __webpack_require__(5).isEmptyObject;
var getCurrentBinaryDomain = __webpack_require__(81).getCurrentBinaryDomain;

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
        return typeof this.storage.getObject === 'function' // Prevent runtime error in IE
        ? this.storage.getObject(key) : JSON.parse(this.storage.getItem(key) || '{}');
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
    this.domain = cookie_domain || (getCurrentBinaryDomain() ? '.' + hostname.split('.').slice(-2).join('.') : hostname);
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

/***/ 5:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var extend = __webpack_require__(114);
__webpack_require__(506);

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
    var to_replace = content;
    if (content && !Array.isArray(content)) {
        to_replace = [content];
    }
    return string.replace(/\[_(\d+)]/g, function (s, index) {
        return to_replace[+index - 1];
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
    static_hash = static_hash || (document.querySelector('script[src*="binary"]').getAttribute('src') || '').split('?')[1];
    return static_hash;
};

var PromiseClass = function PromiseClass() {
    var _this = this;

    _classCallCheck(this, PromiseClass);

    this.promise = new Promise(function (resolve, reject) {
        _this.reject = reject;
        _this.resolve = resolve;
    });
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
    getStaticHash: getStaticHash,
    PromiseClass: PromiseClass
};

/***/ }),

/***/ 50:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Cookies = __webpack_require__(156);
var elementTextContent = __webpack_require__(89).elementTextContent;
var getElementById = __webpack_require__(89).getElementById;
var CookieStorage = __webpack_require__(37).CookieStorage;
var LocalStore = __webpack_require__(37).LocalStore;
var applyToAllElements = __webpack_require__(5).applyToAllElements;

var Language = function () {
    var all_languages = {
        ACH: 'Translations',
        EN: 'English',
        DE: 'Deutsch',
        ES: 'Español',
        FR: 'Français',
        ID: 'Indonesia',
        IT: 'Italiano',
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

/***/ 503:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var moment = __webpack_require__(14);
var urlForStatic = __webpack_require__(113).urlForStatic;
var getStaticHash = __webpack_require__(5).getStaticHash;

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

/***/ 506:
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

/***/ 519:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var BinarySocket = __webpack_require__(73);
var localize = __webpack_require__(3).localize;

/*
 * Monitors the network status and initialises the WebSocket connection
 * 1. online : check the WS status (init/send: blink after timeout, open/message: online)
 * 2. offline: it is offline
 */
var NetworkMonitorBase = function () {
    var _pending_timeouts;

    var StatusConfig = function () {
        var status_config = void 0;

        var initStatusConfig = function initStatusConfig() {
            return {
                online: { class: 'online', tooltip: localize('Online') },
                offline: { class: 'offline', tooltip: localize('Offline') },
                blinking: { class: 'blinker', tooltip: localize('Connecting to server') }
            };
        };

        return {
            get: function get(status) {
                if (!status_config) {
                    status_config = initStatusConfig();
                }
                return status_config[status];
            }
        };
    }();

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
            updateUI(StatusConfig.get(network_status), isOnline());
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

/***/ 521:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var localize = __webpack_require__(3).localize;

var systems = {
    mac: ['Mac68K', 'MacIntel', 'MacPPC'],
    linux: ['HP-UX', 'Linux i686', 'Linux amd64', 'Linux i686 on x86_64', 'Linux i686 X11', 'Linux x86_64', 'Linux x86_64 X11', 'FreeBSD', 'FreeBSD i386', 'FreeBSD amd64', 'X11'],
    ios: ['iPhone', 'iPod', 'iPad', 'iPhone Simulator', 'iPod Simulator', 'iPad Simulator'],
    android: ['Android', 'Linux armv7l', // Samsung galaxy s2 ~ s5, nexus 4/5
    'Linux armv8l', null],
    windows: ['Win16', 'Win32', 'Win64', 'WinCE']
};

var isDesktop = function isDesktop() {
    var os = OSDetect();
    return !!['windows', 'mac', 'linux'].find(function (system) {
        return system === os;
    });
};

var isMobile = function isMobile() {
    return (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    );
};

var OSDetect = function OSDetect() {
    // For testing purposes or more compatibility, if we set 'config.os'
    // inside our localStorage, we ignore fetching information from
    // navigator object and return what we have straight away.
    if (localStorage.getItem('config.os')) {
        return localStorage.getItem('config.os');
    }
    if (typeof navigator !== 'undefined' && navigator.platform) {
        return Object.keys(systems).map(function (os) {
            if (systems[os].some(function (platform) {
                return navigator.platform === platform;
            })) {
                return os;
            }
            return false;
        }).filter(function (os) {
            return os;
        })[0];
    }

    return localize('Unknown OS');
};

module.exports = {
    OSDetect: OSDetect,
    isDesktop: isDesktop,
    isMobile: isMobile
};

/***/ }),

/***/ 528:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Mellt = __webpack_require__(529);
var localize = __webpack_require__(3).localize;

var checkPassword = function checkPassword(password_selector) {
    var el_password = document.querySelector(password_selector);
    if (!el_password) {
        return;
    }

    var div = el_password.parentNode.querySelector('.days_to_crack') || document.createElement('div');

    var daysToCrack = Mellt.checkPassword(el_password.value.trim());
    if (daysToCrack < 0) {
        div.textContent = localize('The password you entered is one of the world\'s most commonly used passwords. You should not be using this password.');
    } else {
        var years = void 0;
        if (daysToCrack > 365) {
            years = Math.round(daysToCrack / 365 * 10) / 10;
            if (years > 1000000) {
                years = Math.round(years / 1000000 * 10) / 10 + ' ' + localize('million');
            } else if (years > 1000) {
                years = Math.round(years / 1000) + ' ' + localize('thousand');
            }
        }
        div.textContent = localize('Hint: it would take approximately [_1][_2] to crack this password.', [daysToCrack === 1000000000 ? '>' : '', years ? years + ' ' + localize('years') : daysToCrack + ' ' + localize('days')]);
    }
    div.className = 'days_to_crack fill-bg-color hint ' + (daysToCrack < 30 ? 'red' : 'green');
    el_password.parentNode.appendChild(div);
};

var removeCheck = function removeCheck(password_selector) {
    var el_message = document.querySelector(password_selector).parentNode.querySelector('.days_to_crack');
    if (el_message) {
        el_message.remove();
    }
};

module.exports = {
    removeCheck: removeCheck,
    checkPassword: checkPassword
};

/***/ }),

/***/ 529:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var CommonPasswords = __webpack_require__(530);

/**
 * Mellt
 *
 * Tests the strength of a password by calculating how long it would take to
 * brute force it.
 *
 * @version 0.1.0
 * @link http://mel.lt/ The homepage for this script.
 * @link http://www.hammerofgod.com/passwordcheck.aspx Much of this is based
 * on the description of Thor's Godly Privacy password strength checker,
 * however the actual code below is all my own.
 * @link http://xato.net/passwords/more-top-worst-passwords/ The included
 * common passwords list is from Mark Burnett's password collection (which
 * is excellent). You can of course use your own password file instead.
 */
var Mellt = function () {

    // We're making some guesses here about human nature (again much of this is
    // based on the TGP password strength checker, and Timothy "Thor" Mullen
    // deserves the credit for the thinking behind this). Basically we're combining
    // what we know about users (SHIFT+numbers are more common than other
    // punctuation for example) combined with how an attacker will attack a
    // password (most common letters first, expanding outwards).
    //
    // If you want to support passwords that use non-english characters, and
    // your attacker knows this (for example, a Russian site would be expected
    // to contain passwords in Russian characters) add your characters to one of
    // the sets below, or create new sets and insert them in the right places.
    var character_sets = ["0123456789", "abcdefghijklmnopqrstuvwxyz", "abcdefghijklmnopqrstuvwxyz0123456789", "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ", "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789", "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()-=_+", "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()-=_+[]\"{}|;':,./<>?`~"];

    /**
     * Tests password strength by simulating how long it would take a cracker to
     * brute force your password.
     *
     * Also optionally tests against a list of common passwords (contained in an
     * external file) to weed out things like "password", which from a pure brute
     * force perspective would be harder to break if it wasn't so common.
     *
     * The character sets being used in this checker assume English (ASCII)
     * characters (no umlauts for example). If you run a non-english site, and you
     * suspect the crackers will realize this, you may want to modify the
     * character set to include the characters in your language.
     *
     * @param password string, The password to test the strength of
     * @return number Returns a number specifying how many days it would take
     * to brute force the password (at 1 billion checks a second) or -1 to
     * indicate the password was found in the common passwords file. Obviously if
     * they don't have direct access to the hashed passwords this time would be
     * longer, and even then most computers (at the time of this writing) won't be
     * able to test 1 billion hashes a second, but this function measures worst
     * case scenario, so... I would recommend you require at least 30 days to brute
     * force a password, obviously more if you're a bank or other secure system.
     * @throws Exception If an error is encountered.
     */
    var checkPassword = function checkPassword(password) {

        // First check passwords in the common password file if available.
        // We do this because "password" takes 129 seconds, but is the first
        // thing an attacker will try.
        if (CommonPasswords.find(function (pass) {
            return pass === password.toLowerCase();
        })) {
            // If their password exists in the common file, then it's
            // zero time to crack this terrible password.
            return -1;
        }

        // Figure out which character set the password is using (based on the most "complex" character in it).
        var base = '';
        var base_key = null;
        var found_char = void 0;

        var _loop = function _loop(i) {
            found_char = false;
            character_sets.some(function (character_set, idx) {
                if (base_key <= idx && character_set.indexOf(password[i]) > -1) {
                    base_key = idx;
                    base = character_set;
                    found_char = true;
                    return true;
                }
                return false;
            });
            // If the character we were looking for wasn't anywhere in any of the
            // character sets, assign the largest (last) character set as default.
            if (!found_char) {
                base = character_sets[character_sets.length - 1];
                return "break";
            }
        };

        for (var i = 0; i < password.length; i++) {
            var _ret = _loop(i);

            if (_ret === "break") break;
        }

        // Starting at the first character, figure out it's position in the character set
        // and how many attempts will take to get there. For example, say your password
        // was an integer (a bank card PIN number for example):
        // 0 (or 0000 if you prefer) would be the very first password they attempted by the attacker.
        // 9999 would be the last password they attempted (assuming 4 characters).
        // Thus a password/PIN of 6529 would take 6529 attempts until the attacker found
        // the proper combination. The same logic words for alphanumeric passwords, just
        // with a larger number of possibilities for each position in the password. The
        // key thing to note is the attacker doesn't need to test the entire range (every
        // possible combination of all characters) they just need to get to the point in
        // the list of possibilities that is your password. They can (in this example)
        // ignore anything between 6530 and 9999. Using this logic, 'aaa' would be a worse
        // password than 'zzz', because the attacker would encounter 'aaa' first.
        var attempts = 0;
        for (var i = 0; i < password.length; i++) {
            // We power up to the reverse position in the string. For example, if we're trying
            // to hack the 4 character PING code in the example above:
            // First number * (number of characters possible in the charset ^ length of password)
            // ie: 6 * (10^4) = 6000
            // then add that same equation for the second number:
            // 5 * (10^3) = 500
            // then the third numbers
            // 2 * (10^2) = 20
            // and add on the last number
            // 9
            // Totals: 6000 + 500 + 20 + 9 = 6529 attempts before we encounter the correct password.
            var power_of = password.length - i - 1;
            // Character position within the base set. We add one on because strpos is base
            // 0, we want base 1.
            var char_at_position = base.indexOf(password[i]) + 1;
            // If we're at the last character, simply add it's position in the character set
            // this would be the "9" in the pin code example above.
            if (power_of === 0) {
                attempts += char_at_position;
            }
            // Otherwise we need to iterate through all the other characters positions to
            // get here. For example, to find the 5 in 25 we can't just guess 2 and then 5
            // (even though Hollywood seems to insist this is possible), we need to try 0,1,
            // 2,3...15,16,17...23,24,25 (got it).
            else {
                    // This means we have to try every combination of values up to this point for
                    // all previous characters. Which means we need to iterate through the entire
                    // character set, X times, where X is our position -1. Then we need to multiply
                    // that by this character's position.

                    // Multiplier is the (10^4) or (10^3), etc in the pin code example above.
                    // New attempts is the number of attempts we're adding for this position.
                    // Add that on to our existing number of attempts.
                    attempts += char_at_position * Math.pow(base.length, power_of);
                }
        }

        // We can (worst case) try a billion passwords a second. Calculate how many days it
        // will take us to get to the password.
        // This allows us to calculate a number of days to crack. We use days because anything
        // that can be cracked in less than a day is basically useless, so there's no point in
        // having a smaller granularity (hours for example).
        var days = attempts / (1000000000 * 60 * 60 * 24);

        // If it's going to take more than a billion days to crack, just return a billion. This
        // helps when code outside this function isn't using bcmath. Besides, if the password
        // can survive 2.7 million years it's probably ok.
        return days > 1000000000 ? 1000000000 : Math.round(days);
    };

    return {
        checkPassword: checkPassword
    };
}();

module.exports = Mellt;

/***/ }),

/***/ 530:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var CommonPasswords = ["password", "123456", "12345678", "1234", "qwerty", "12345", "dragon", "pussy", "baseball", "football", "letmein", "monkey", "696969", "abc123", "mustang", "michael", "shadow", "master", "jennifer", "111111", "2000", "jordan", "superman", "harley", "1234567", "fuckme", "hunter", "fuckyou", "trustno1", "ranger", "buster", "thomas", "tigger", "robert", "soccer", "fuck", "batman", "test", "pass", "killer", "hockey", "george", "charlie", "andrew", "michelle", "love", "sunshine", "jessica", "asshole", "6969", "pepper", "daniel", "access", "123456789", "654321", "joshua", "maggie", "starwars", "silver", "william", "dallas", "yankees", "123123", "ashley", "666666", "hello", "amanda", "orange", "biteme", "freedom", "computer", "sexy", "thunder", "nicole", "ginger", "heather", "hammer", "summer", "corvette", "taylor", "fucker", "austin", "1111", "merlin", "matthew", "121212", "golfer", "cheese", "princess", "martin", "chelsea", "patrick", "richard", "diamond", "yellow", "bigdog", "secret", "asdfgh", "sparky", "cowboy", "camaro", "anthony", "matrix", "falcon", "iloveyou", "bailey", "guitar", "jackson", "purple", "scooter", "phoenix", "aaaaaa", "morgan", "tigers", "porsche", "mickey", "maverick", "cookie", "nascar", "peanut", "justin", "131313", "money", "horny", "samantha", "panties", "steelers", "joseph", "snoopy", "boomer", "whatever", "iceman", "smokey", "gateway", "dakota", "cowboys", "eagles", "chicken", "dick", "black", "zxcvbn", "please", "andrea", "ferrari", "knight", "hardcore", "melissa", "compaq", "coffee", "booboo", "bitch", "johnny", "bulldog", "xxxxxx", "welcome", "james", "player", "ncc1701", "wizard", "scooby", "charles", "junior", "internet", "bigdick", "mike", "brandy", "tennis", "blowjob", "banana", "monster", "spider", "lakers", "miller", "rabbit", "enter", "mercedes", "brandon", "steven", "fender", "john", "yamaha", "diablo", "chris", "boston", "tiger", "marine", "chicago", "rangers", "gandalf", "winter", "bigtits", "barney", "edward", "raiders", "porn", "badboy", "blowme", "spanky", "bigdaddy", "johnson", "chester", "london", "midnight", "blue", "fishing", "000000", "hannah", "slayer", "11111111", "rachel", "sexsex", "redsox", "thx1138", "asdf", "marlboro", "panther", "zxcvbnm", "arsenal", "oliver", "qazwsx", "mother", "victoria", "7777777", "jasper", "angel", "david", "winner", "crystal", "golden", "butthead", "viking", "jack", "iwantu", "shannon", "murphy", "angels", "prince", "cameron", "girls", "madison", "wilson", "carlos", "hooters", "willie", "startrek", "captain", "maddog", "jasmine", "butter", "booger", "angela", "golf", "lauren", "rocket", "tiffany", "theman", "dennis", "liverpoo", "flower", "forever", "green", "jackie", "muffin", "turtle", "sophie", "danielle", "redskins", "toyota", "jason", "sierra", "winston", "debbie", "giants", "packers", "newyork", "jeremy", "casper", "bubba", "112233", "sandra", "lovers", "mountain", "united", "cooper", "driver", "tucker", "helpme", "fucking", "pookie", "lucky", "maxwell", "8675309", "bear", "suckit", "gators", "5150", "222222", "shithead", "fuckoff", "jaguar", "monica", "fred", "happy", "hotdog", "tits", "gemini", "lover", "xxxxxxxx", "777777", "canada", "nathan", "victor", "florida", "88888888", "nicholas", "rosebud", "metallic", "doctor", "trouble", "success", "stupid", "tomcat", "warrior", "peaches", "apples", "fish", "qwertyui", "magic", "buddy", "dolphins", "rainbow", "gunner", "987654", "freddy", "alexis", "braves", "cock", "2112", "1212", "cocacola", "xavier", "dolphin", "testing", "bond007", "member", "calvin", "voodoo", "7777", "samson", "alex", "apollo", "fire", "tester", "walter", "beavis", "voyager", "peter", "porno", "bonnie", "rush2112", "beer", "apple", "scorpio", "jonathan", "skippy", "sydney", "scott", "red123", "power", "gordon", "travis", "beaver", "star", "jackass", "flyers", "boobs", "232323", "zzzzzz", "steve", "rebecca", "scorpion", "doggie", "legend", "ou812", "yankee", "blazer", "bill", "runner", "birdie", "bitches", "555555", "parker", "topgun", "asdfasdf", "heaven", "viper", "animal", "2222", "bigboy", "4444", "arthur", "baby", "private", "godzilla", "donald", "williams", "lifehack", "phantom", "dave", "rock", "august", "sammy", "cool", "brian", "platinum", "jake", "bronco", "paul", "mark", "frank", "heka6w2", "copper", "billy", "cumshot", "garfield", "willow", "cunt", "little", "carter", "slut", "albert", "69696969", "kitten", "super", "jordan23", "eagle1", "shelby", "america", "11111", "jessie", "house", "free", "123321", "chevy", "bullshit", "white", "broncos", "horney", "surfer", "nissan", "999999", "saturn", "airborne", "elephant", "marvin", "shit", "action", "adidas", "qwert", "kevin", "1313", "explorer", "walker", "police", "christin", "december", "benjamin", "wolf", "sweet", "therock", "king", "online", "dickhead", "brooklyn", "teresa", "cricket", "sharon", "dexter", "racing", "penis", "gregory", "0000", "teens", "redwings", "dreams", "michigan", "hentai", "magnum", "87654321", "nothing", "donkey", "trinity", "digital", "333333", "stella", "cartman", "guinness", "123abc", "speedy", "buffalo", "kitty", "pimpin", "eagle", "einstein", "kelly", "nelson", "nirvana", "vampire", "xxxx", "playboy", "louise", "pumpkin", "snowball", "test123", "girl", "sucker", "mexico", "beatles", "fantasy", "ford", "gibson", "celtic", "marcus", "cherry", "cassie", "888888", "natasha", "sniper", "chance", "genesis", "hotrod", "reddog", "alexande", "college", "jester", "passw0rd", "bigcock", "smith", "lasvegas", "carmen", "slipknot", "3333", "death", "kimberly", "1q2w3e", "eclipse", "1q2w3e4r", "stanley", "samuel", "drummer", "homer", "montana", "music", "aaaa", "spencer", "jimmy", "carolina", "colorado", "creative", "hello1", "rocky", "goober", "friday", "bollocks", "scotty", "abcdef", "bubbles", "hawaii", "fluffy", "mine", "stephen", "horses", "thumper", "5555", "pussies", "darkness", "asdfghjk", "pamela", "boobies", "buddha", "vanessa", "sandman", "naughty", "douglas", "honda", "matt", "azerty", "6666", "shorty", "money1", "beach", "loveme", "4321", "simple", "poohbear", "444444", "badass", "destiny", "sarah", "denise", "vikings", "lizard", "melanie", "assman", "sabrina", "nintendo", "water", "good", "howard", "time", "123qwe", "november", "xxxxx", "october", "leather", "bastard", "young", "101010", "extreme", "hard", "password1", "vincent", "pussy1", "lacrosse", "hotmail", "spooky", "amateur", "alaska", "badger", "paradise", "maryjane", "poop", "crazy", "mozart", "video", "russell", "vagina", "spitfire", "anderson", "norman", "eric", "cherokee", "cougar", "barbara", "long", "420420", "family", "horse", "enigma", "allison", "raider", "brazil", "blonde", "jones", "55555", "dude", "drowssap", "jeff", "school", "marshall", "lovely", "1qaz2wsx", "jeffrey", "caroline", "franklin", "booty", "molly", "snickers", "leslie", "nipples", "courtney", "diesel", "rocks", "eminem", "westside", "suzuki", "daddy", "passion", "hummer", "ladies", "zachary", "frankie", "elvis", "reggie", "alpha", "suckme", "simpson", "patricia", "147147", "pirate", "tommy", "semperfi", "jupiter", "redrum", "freeuser", "wanker", "stinky", "ducati", "paris", "natalie", "babygirl", "bishop", "windows", "spirit", "pantera", "monday", "patches", "brutus", "houston", "smooth", "penguin", "marley", "forest", "cream", "212121", "flash", "maximus", "nipple", "bobby", "bradley", "vision", "pokemon", "champion", "fireman", "indian", "softball", "picard", "system", "clinton", "cobra", "enjoy", "lucky1", "claire", "claudia", "boogie", "timothy", "marines", "security", "dirty", "admin", "wildcats", "pimp", "dancer", "hardon", "veronica", "fucked", "abcd1234", "abcdefg", "ironman", "wolverin", "remember", "great", "freepass", "bigred", "squirt", "justice", "francis", "hobbes", "kermit", "pearljam", "mercury", "domino", "9999", "denver", "brooke", "rascal", "hitman", "mistress", "simon", "tony", "bbbbbb", "friend", "peekaboo", "naked", "budlight", "electric", "sluts", "stargate", "saints", "bondage", "brittany", "bigman", "zombie", "swimming", "duke", "qwerty1", "babes", "scotland", "disney", "rooster", "brenda", "mookie", "swordfis", "candy", "duncan", "olivia", "hunting", "blink182", "alicia", "8888", "samsung", "bubba1", "whore", "virginia", "general", "passport", "aaaaaaaa", "erotic", "liberty", "arizona", "jesus", "abcd", "newport", "skipper", "rolltide", "balls", "happy1", "galore", "christ", "weasel", "242424", "wombat", "digger", "classic", "bulldogs", "poopoo", "accord", "popcorn", "turkey", "jenny", "amber", "bunny", "mouse", "007007", "titanic", "liverpool", "dreamer", "everton", "friends", "chevelle", "carrie", "gabriel", "psycho", "nemesis", "burton", "pontiac", "connor", "eatme", "lickme", "roland", "cumming", "mitchell", "ireland", "lincoln", "arnold", "spiderma", "patriots", "goblue", "devils", "eugene", "empire", "asdfg", "cardinal", "brown", "shaggy", "froggy", "qwer", "kawasaki", "kodiak", "people", "phpbb", "light", "54321", "kramer", "chopper", "hooker", "honey", "whynot", "lesbian", "lisa", "baxter", "adam", "snake", "teen", "ncc1701d", "qqqqqq", "airplane", "britney", "avalon", "sandy", "sugar", "sublime", "stewart", "wildcat", "raven", "scarface", "elizabet", "123654", "trucks", "wolfpack", "pervert", "lawrence", "raymond", "redhead", "american", "alyssa", "bambam", "movie", "woody", "shaved", "snowman", "tiger1", "chicks", "raptor", "1969", "stingray", "shooter", "france", "stars", "madmax", "kristen", "sports", "jerry", "789456", "garcia", "simpsons", "lights", "ryan", "looking", "chronic", "alison", "hahaha", "packard", "hendrix", "perfect", "service", "spring", "srinivas", "spike", "katie", "252525", "oscar", "brother", "bigmac", "suck", "single", "cannon", "georgia", "popeye", "tattoo", "texas", "party", "bullet", "taurus", "sailor", "wolves", "panthers", "japan", "strike", "flowers", "pussycat", "chris1", "loverboy", "berlin", "sticky", "marina", "tarheels", "fisher", "russia", "connie", "wolfgang", "testtest", "mature", "bass", "catch22", "juice", "michael1", "nigger", "159753", "women", "alpha1", "trooper", "hawkeye", "head", "freaky", "dodgers", "pakistan", "machine", "pyramid", "vegeta", "katana", "moose", "tinker", "coyote", "infinity", "inside", "pepsi", "letmein1", "bang", "control", "hercules", "morris", "james1", "tickle", "outlaw", "browns", "billybob", "pickle", "test1", "michele", "antonio", "sucks", "pavilion", "changeme", "caesar", "prelude", "tanner", "adrian", "darkside", "bowling", "wutang", "sunset", "robbie", "alabama", "danger", "zeppelin", "juan", "rusty", "pppppp", "nick", "2001", "ping", "darkstar", "madonna", "qwe123", "bigone", "casino", "cheryl", "charlie1", "mmmmmm", "integra", "wrangler", "apache", "tweety", "qwerty12", "bobafett", "simone", "none", "business", "sterling", "trevor", "transam", "dustin", "harvey", "england", "2323", "seattle", "ssssss", "rose", "harry", "openup", "pandora", "pussys", "trucker", "wallace", "indigo", "storm", "malibu", "weed", "review", "babydoll", "doggy", "dilbert", "pegasus", "joker", "catfish", "flipper", "valerie", "herman", "fuckit", "detroit", "kenneth", "cheyenne", "bruins", "stacey", "smoke", "joey", "seven", "marino", "fetish", "xfiles", "wonder", "stinger", "pizza", "babe", "pretty", "stealth", "manutd", "gracie", "gundam", "cessna", "longhorn", "presario", "mnbvcxz", "wicked", "mustang1", "victory", "21122112", "shelly", "awesome", "athena", "q1w2e3r4", "help", "holiday", "knicks", "street", "redneck", "12341234", "casey", "gizmo", "scully", "dragon1", "devildog", "triumph", "eddie", "bluebird", "shotgun", "peewee", "ronnie", "angel1", "daisy", "special", "metallica", "madman", "country", "impala", "lennon", "roscoe", "omega", "access14", "enterpri", "miranda", "search", "smitty", "blizzard", "unicorn", "tight", "rick", "ronald", "asdf1234", "harrison", "trigger", "truck", "danny", "home", "winnie", "beauty", "thailand", "1234567890", "cadillac", "castle", "tyler", "bobcat", "buddy1", "sunny", "stones", "asian", "freddie", "chuck", "butt", "loveyou", "norton", "hellfire", "hotsex", "indiana", "short", "panzer", "lonewolf", "trumpet", "colors", "blaster", "12121212", "fireball", "logan", "precious", "aaron", "elaine", "jungle", "atlanta", "gold", "corona", "curtis", "nikki", "polaris", "timber", "theone", "baller", "chipper", "orlando", "island", "skyline", "dragons", "dogs", "benson", "licker", "goldie", "engineer", "kong", "pencil", "basketba", "open", "hornet", "world", "linda", "barbie", "chan", "farmer", "valentin", "wetpussy", "indians", "larry", "redman", "foobar", "travel", "morpheus", "bernie", "target", "141414", "hotstuff", "photos", "laura", "savage", "holly", "rocky1", "fuck_inside", "dollar", "turbo", "design", "newton", "hottie", "moon", "202020", "blondes", "4128", "lestat", "avatar", "future", "goforit", "random", "abgrtyu", "jjjjjj", "cancer", "q1w2e3", "smiley", "goldberg", "express", "virgin", "zipper", "wrinkle1", "stone", "andy", "babylon", "dong", "powers", "consumer", "dudley", "monkey1", "serenity", "samurai", "99999999", "bigboobs", "skeeter", "lindsay", "joejoe", "master1", "aaaaa", "chocolat", "christia", "birthday", "stephani", "tang", "1234qwer", "alfred", "ball", "98765432", "maria", "sexual", "maxima", "77777777", "sampson", "buckeye", "highland", "kristin", "seminole", "reaper", "bassman", "nugget", "lucifer", "airforce", "nasty", "watson", "warlock", "2121", "philip", "always", "dodge", "chrissy", "burger", "bird", "snatch", "missy", "pink", "gang", "maddie", "holmes", "huskers", "piglet", "photo", "joanne", "hamilton", "dodger", "paladin", "christy", "chubby", "buckeyes", "hamlet", "abcdefgh", "bigfoot", "sunday", "manson", "goldfish", "garden", "deftones", "icecream", "blondie", "spartan", "julie", "harold", "charger", "brandi", "stormy", "sherry", "pleasure", "juventus", "rodney", "galaxy", "holland", "escort", "zxcvb", "planet", "jerome", "wesley", "blues", "song", "peace", "david1", "ncc1701e", "1966", "51505150", "cavalier", "gambit", "karen", "sidney", "ripper", "oicu812", "jamie", "sister", "marie", "martha", "nylons", "aardvark", "nadine", "minnie", "whiskey", "bing", "plastic", "anal", "babylon5", "chang", "savannah", "loser", "racecar", "insane", "yankees1", "mememe", "hansolo", "chiefs", "fredfred", "freak", "frog", "salmon", "concrete", "yvonne", "zxcv", "shamrock", "atlantis", "warren", "wordpass", "julian", "mariah", "rommel", "1010", "harris", "predator", "sylvia", "massive", "cats", "sammy1", "mister", "stud", "marathon", "rubber", "ding", "trunks", "desire", "montreal", "justme", "faster", "kathleen", "irish", "1999", "bertha", "jessica1", "alpine", "sammie", "diamonds", "tristan", "00000", "swinger", "shan", "stallion", "pitbull", "letmein2", "roberto", "ready", "april", "palmer", "ming", "shadow1", "audrey", "chong", "clitoris", "wang", "shirley", "fuckers", "jackoff", "bluesky", "sundance", "renegade", "hollywoo", "151515", "bernard", "wolfman", "soldier", "picture", "pierre", "ling", "goddess", "manager", "nikita", "sweety", "titans", "hang", "fang", "ficken", "niners", "bottom", "bubble", "hello123", "ibanez", "webster", "sweetpea", "stocking", "323232", "tornado", "lindsey", "content", "bruce", "buck", "aragorn", "griffin", "chen", "campbell", "trojan", "christop", "newman", "wayne", "tina", "rockstar", "father", "geronimo", "pascal", "crimson", "brooks", "hector", "penny", "anna", "google", "camera", "chandler", "fatcat", "lovelove", "cody", "cunts", "waters", "stimpy", "finger", "cindy", "wheels", "viper1", "latin", "robin", "greenday", "987654321", "creampie", "brendan", "hiphop", "willy", "snapper", "funtime", "duck", "trombone", "adult", "cotton", "cookies", "kaiser", "mulder", "westham", "latino", "jeep", "ravens", "aurora", "drizzt", "madness", "energy", "kinky", "314159", "sophia", "stefan", "slick", "rocker", "55555555", "freeman", "french", "mongoose", "speed", "dddddd", "hong", "henry", "hungry", "yang", "catdog", "cheng", "ghost", "gogogo", "randy", "tottenha", "curious", "butterfl", "mission", "january", "singer", "sherman", "shark", "techno", "lancer", "lalala", "autumn", "chichi", "orion", "trixie", "clifford", "delta", "bobbob", "bomber", "holden", "kang", "kiss", "1968", "spunky", "liquid", "mary", "beagle", "granny", "network", "bond", "kkkkkk", "millie", "1973", "biggie", "beetle", "teacher", "susan", "toronto", "anakin", "genius", "dream", "cocks", "dang", "bush", "karate", "snakes", "bangkok", "callie", "fuckyou2", "pacific", "daytona", "kelsey", "infantry", "skywalke", "foster", "felix", "sailing", "raistlin", "vanhalen", "huang", "herbert", "jacob", "blackie", "tarzan", "strider", "sherlock", "lang", "gong", "sang", "dietcoke", "ultimate", "tree", "shai", "sprite", "ting", "artist", "chai", "chao", "devil", "python", "ninja", "misty", "ytrewq", "sweetie", "superfly", "456789", "tian", "jing", "jesus1", "freedom1", "dian", "drpepper", "potter", "chou", "darren", "hobbit", "violet", "yong", "shen", "phillip", "maurice", "gloria", "nolimit", "mylove", "biscuit", "yahoo", "shasta", "sex4me", "smoker", "smile", "pebbles", "pics", "philly", "tong", "tintin", "lesbians", "marlin", "cactus", "frank1", "tttttt", "chun", "danni", "emerald", "showme", "pirates", "lian", "dogg", "colleen", "xiao", "xian", "tazman", "tanker", "patton", "toshiba", "richie", "alberto", "gotcha", "graham", "dillon", "rang", "emily", "keng", "jazz", "bigguy", "yuan", "woman", "tomtom", "marion", "greg", "chaos", "fossil", "flight", "racerx", "tuan", "creamy", "boss", "bobo", "musicman", "warcraft", "window", "blade", "shuang", "sheila", "shun", "lick", "jian", "microsoft", "rong", "allen", "feng", "getsome", "sally", "quality", "kennedy", "morrison", "1977", "beng", "wwwwww", "yoyoyo", "zhang", "seng", "teddy", "joanna", "andreas", "harder", "luke", "qazxsw", "qian", "cong", "chuan", "deng", "nang", "boeing", "keeper", "western", "isabelle", "1963", "subaru", "sheng", "thuglife", "teng", "jiong", "miao", "martina", "mang", "maniac", "pussie", "tracey", "a1b2c3", "clayton", "zhou", "zhuang", "xing", "stonecol", "snow", "spyder", "liang", "jiang", "memphis", "regina", "ceng", "magic1", "logitech", "chuang", "dark", "million", "blow", "sesame", "shao", "poison", "titty", "terry", "kuan", "kuai", "kyle", "mian", "guan", "hamster", "guai", "ferret", "florence", "geng", "duan", "pang", "maiden", "quan", "velvet", "nong", "neng", "nookie", "buttons", "bian", "bingo", "biao", "zhong", "zeng", "xiong", "zhun", "ying", "zong", "xuan", "zang", "0.0.000", "suan", "shei", "shui", "sharks", "shang", "shua", "small", "peng", "pian", "piao", "liao", "meng", "miami", "reng", "guang", "cang", "change", "ruan", "diao", "luan", "lucas", "qing", "chui", "chuo", "cuan", "nuan", "ning", "heng", "huan", "kansas", "muscle", "monroe", "weng", "whitney", "1passwor", "bluemoon", "zhui", "zhua", "xiang", "zheng", "zhen", "zhei", "zhao", "zhan", "yomama", "zhai", "zhuo", "zuan", "tarheel", "shou", "shuo", "tiao", "lady", "leonard", "leng", "kuang", "jiao", "13579", "basket", "qiao", "qiong", "qiang", "chuai", "nian", "niao", "niang", "huai", "22222222", "bianca", "zhuan", "zhuai", "shuan", "shuai", "stardust", "jumper", "margaret", "archie", "66666666", "charlott", "forget", "qwertz", "bones", "history", "milton", "waterloo", "2002", "stuff", "11223344", "office", "oldman", "preston", "trains", "murray", "vertigo", "246810", "black1", "swallow", "smiles", "standard", "alexandr", "parrot", "luther", "user", "nicolas", "1976", "surfing", "pioneer", "pete", "masters", "apple1", "asdasd", "auburn", "hannibal", "frontier", "panama", "lucy", "buffy", "brianna", "welcome1", "vette", "blue22", "shemale", "111222", "baggins", "groovy", "global", "turner", "181818", "1979", "blades", "spanking", "life", "byteme", "lobster", "collins", "dawg", "hilton", "japanese", "1970", "1964", "2424", "polo", "markus", "coco", "deedee", "mikey", "1972", "171717", "1701", "strip", "jersey", "green1", "capital", "sasha", "sadie", "putter", "vader", "seven7", "lester", "marcel", "banshee", "grendel", "gilbert", "dicks", "dead", "hidden", "iloveu", "1980", "sound", "ledzep", "michel", "147258", "female", "bugger", "buffett", "bryan", "hell", "kristina", "molson", "2020", "wookie", "sprint", "thanks", "jericho", "102030", "grace", "fuckin", "mandy", "ranger1", "trebor", "deepthroat", "bonehead", "molly1", "mirage", "models", "1984", "2468", "stuart", "showtime", "squirrel", "pentium", "mario", "anime", "gator", "powder", "twister", "connect", "neptune", "bruno", "butts", "engine", "eatshit", "mustangs", "woody1", "shogun", "septembe", "pooh", "jimbo", "roger", "annie", "bacon", "center", "russian", "sabine", "damien", "mollie", "voyeur", "2525", "363636", "leonardo", "camel", "chair", "germany", "giant", "qqqq", "nudist", "bone", "sleepy", "tequila", "megan", "fighter", "garrett", "dominic", "obiwan", "makaveli", "vacation", "walnut", "1974", "ladybug", "cantona", "ccbill", "satan", "rusty1", "passwor1", "columbia", "napoleon", "dusty", "kissme", "motorola", "william1", "1967", "zzzz", "skater", "smut", "play", "matthew1", "robinson", "valley", "coolio", "dagger", "boner", "bull", "horndog", "jason1", "blake", "penguins", "rescue", "griffey", "8j4ye3uz", "californ", "champs", "qwertyuiop", "portland", "queen", "colt45", "boat", "xxxxxxx", "xanadu", "tacoma", "mason", "carpet", "gggggg", "safety", "palace", "italia", "stevie", "picturs", "picasso", "thongs", "tempest", "ricardo", "roberts", "asd123", "hairy", "foxtrot", "gary", "nimrod", "hotboy", "343434", "1111111", "asdfghjkl", "goose", "overlord", "blood", "wood", "stranger", "454545", "shaolin", "sooners", "socrates", "spiderman", "peanuts", "maxine", "rogers", "13131313", "andrew1", "filthy", "donnie", "ohyeah", "africa", "national", "kenny", "keith", "monique", "intrepid", "jasmin", "pickles", "assass", "fright", "potato", "darwin", "hhhhhh", "kingdom", "weezer", "424242", "pepsi1", "throat", "romeo", "gerard", "looker", "puppy", "butch", "monika", "suzanne", "sweets", "temple", "laurie", "josh", "megadeth", "analsex", "nymets", "ddddddd", "bigballs", "support", "stick", "today", "down", "oakland", "oooooo", "qweasd", "chucky", "bridge", "carrot", "chargers", "discover", "dookie", "condor", "night", "butler", "hoover", "horny1", "isabella", "sunrise", "sinner", "jojo", "megapass", "martini", "assfuck", "grateful", "ffffff", "abigail", "esther", "mushroom", "janice", "jamaica", "wright", "sims", "space", "there", "timmy", "7654321", "77777", "cccccc", "gizmodo", "roxanne", "ralph", "tractor", "cristina", "dance", "mypass", "hongkong", "helena", "1975", "blue123", "pissing", "thomas1", "redred", "rich", "basketball", "attack", "cash", "satan666", "drunk", "dixie", "dublin", "bollox", "kingkong", "katrina", "miles", "1971", "22222", "272727", "sexx", "penelope", "thompson", "anything", "bbbb", "battle", "grizzly", "passat", "porter", "tracy", "defiant", "bowler", "knickers", "monitor", "wisdom", "wild", "slappy", "thor", "letsgo", "robert1", "feet", "rush", "brownie", "hudson", "098765", "playing", "playtime", "lightnin", "melvin", "atomic", "bart", "hawk", "goku", "glory", "llllll", "qwaszx", "cosmos", "bosco", "knights", "bentley", "beast", "slapshot", "lewis", "assword", "frosty", "gillian", "sara", "dumbass", "mallard", "dddd", "deanna", "elwood", "wally", "159357", "titleist", "angelo", "aussie", "guest", "golfing", "doobie", "loveit", "chloe", "elliott", "werewolf", "vipers", "janine", "1965", "blabla", "surf", "sucking", "tardis", "serena", "shelley", "thegame", "legion", "rebels", "fernando", "fast", "gerald", "sarah1", "double", "onelove", "loulou", "toto", "crash", "blackcat", "0007", "tacobell", "soccer1", "jedi", "manuel", "method", "river", "chase", "ludwig", "poopie", "derrick", "boob", "breast", "kittycat", "isabel", "belly", "pikachu", "thunder1", "thankyou", "jose", "celeste", "celtics", "frances", "frogger", "scoobydo", "sabbath", "coltrane", "budman", "willis", "jackal", "bigger", "zzzzz", "silvia", "sooner", "licking", "gopher", "geheim", "lonestar", "primus", "pooper", "newpass", "brasil", "heather1", "husker", "element", "moomoo", "beefcake", "zzzzzzzz", "tammy", "shitty", "smokin", "personal", "jjjj", "anthony1", "anubis", "backup", "gorilla", "fuckface", "painter", "lowrider", "punkrock", "traffic", "claude", "daniela", "dale", "delta1", "nancy", "boys", "easy", "kissing", "kelley", "wendy", "theresa", "amazon", "alan", "fatass", "dodgeram", "dingdong", "malcolm", "qqqqqqqq", "breasts", "boots", "honda1", "spidey", "poker", "temp", "johnjohn", "miguel", "147852", "archer", "asshole1", "dogdog", "tricky", "crusader", "weather", "syracuse", "spankme", "speaker", "meridian", "amadeus", "back", "harley1", "falcons", "dorothy", "turkey50", "kenwood", "keyboard", "ilovesex", "1978", "blackman", "shazam", "shalom", "lickit", "jimbob", "richmond", "roller", "carson", "check", "fatman", "funny", "garbage", "sandiego", "loving", "magnus", "cooldude", "clover", "mobile", "bell", "payton", "plumber", "texas1", "tool", "topper", "jenna", "mariners", "rebel", "harmony", "caliente", "celica", "fletcher", "german", "diana", "oxford", "osiris", "orgasm", "punkin", "porsche9", "tuesday", "close", "breeze", "bossman", "kangaroo", "billie", "latinas", "judith", "astros", "scruffy", "donna", "qwertyu", "davis", "hearts", "kathy", "jammer", "java", "springer", "rhonda", "ricky", "1122", "goodtime", "chelsea1", "freckles", "flyboy", "doodle", "city", "nebraska", "bootie", "kicker", "webmaster", "vulcan", "iverson", "191919", "blueeyes", "stoner", "321321", "farside", "rugby", "director", "pussy69", "power1", "bobbie", "hershey", "hermes", "monopoly", "west", "birdman", "blessed", "blackjac", "southern", "peterpan", "thumbs", "lawyer", "melinda", "fingers", "fuckyou1", "rrrrrr", "a1b2c3d4", "coke", "nicola", "bohica", "heart", "elvis1", "kids", "blacky", "stories", "sentinel", "snake1", "phoebe", "jesse", "richard1", "1234abcd", "guardian", "candyman", "fisting", "scarlet", "dildo", "pancho", "mandingo", "lucky7", "condom", "munchkin", "billyboy", "summer1", "student", "sword", "skiing", "sergio", "site", "sony", "thong", "rootbeer", "assassin", "cassidy", "frederic", "fffff", "fitness", "giovanni", "scarlett", "durango", "postal", "achilles", "dawn", "dylan", "kisses", "warriors", "imagine", "plymouth", "topdog", "asterix", "hallo", "cameltoe", "fuckfuck", "bridget", "eeeeee", "mouth", "weird", "will", "sithlord", "sommer", "toby", "theking", "juliet", "avenger", "backdoor", "goodbye", "chevrole", "faith", "lorraine", "trance", "cosworth", "brad", "houses", "homers", "eternity", "kingpin", "verbatim", "incubus", "1961", "blond", "zaphod", "shiloh", "spurs", "station", "jennie", "maynard", "mighty", "aliens", "hank", "charly", "running", "dogman", "omega1", "printer", "aggies", "chocolate", "deadhead", "hope", "javier", "bitch1", "stone55", "pineappl", "thekid", "lizzie", "rockets", "ashton", "camels", "formula", "forrest", "rosemary", "oracle", "rain", "pussey", "porkchop", "abcde", "clancy", "nellie", "mystic", "inferno", "blackdog", "steve1", "pauline", "alexander", "alice", "alfa", "grumpy", "flames", "scream", "lonely", "puffy", "proxy", "valhalla", "unreal", "cynthia", "herbie", "engage", "yyyyyy", "010101", "solomon", "pistol", "melody", "celeb", "flying", "gggg", "santiago", "scottie", "oakley", "portugal", "a12345", "newbie", "mmmm", "venus", "1qazxsw2", "beverly", "zorro", "work", "writer", "stripper", "sebastia", "spread", "phil", "tobias", "links", "members", "metal", "1221", "andre", "565656", "funfun", "trojans", "again", "cyber", "hurrican", "moneys", "1x2zkg8w", "zeus", "thing", "tomato", "lion", "atlantic", "celine", "usa123", "trans", "account", "aaaaaaa", "homerun", "hyperion", "kevin1", "blacks", "44444444", "skittles", "sean", "hastings", "fart", "gangbang", "fubar", "sailboat", "older", "oilers", "craig", "conrad", "church", "damian", "dean", "broken", "buster1", "hithere", "immortal", "sticks", "pilot", "peters", "lexmark", "jerkoff", "maryland", "anders", "cheers", "possum", "columbus", "cutter", "muppet", "beautiful", "stolen", "swordfish", "sport", "sonic", "peter1", "jethro", "rockon", "asdfghj", "pass123", "paper", "pornos", "ncc1701a", "bootys", "buttman", "bonjour", "escape", "1960", "becky", "bears", "362436", "spartans", "tinman", "threesom", "lemons", "maxmax", "1414", "bbbbb", "camelot", "chad", "chewie", "gogo", "fusion", "saint", "dilligaf", "nopass", "myself", "hustler", "hunter1", "whitey", "beast1", "yesyes", "spank", "smudge", "pinkfloy", "patriot", "lespaul", "annette", "hammers", "catalina", "finish", "formula1", "sausage", "scooter1", "orioles", "oscar1", "over", "colombia", "cramps", "natural", "eating", "exotic", "iguana", "bella", "suckers", "strong", "sheena", "start", "slave", "pearl", "topcat", "lancelot", "angelica", "magelan", "racer", "ramona", "crunch", "british", "button", "eileen", "steph", "456123", "skinny", "seeking", "rockhard", "chief", "filter", "first", "freaks", "sakura", "pacman", "poontang", "dalton", "newlife", "homer1", "klingon", "watcher", "walleye", "tasha", "tasty", "sinatra", "starship", "steel", "starbuck", "poncho", "amber1", "gonzo", "grover", "catherin", "carol", "candle", "firefly", "goblin", "scotch", "diver", "usmc", "huskies", "eleven", "kentucky", "kitkat", "israel", "beckham", "bicycle", "yourmom", "studio", "tara", "33333333", "shane", "splash", "jimmy1", "reality", "12344321", "caitlin", "focus", "sapphire", "mailman", "raiders1", "clark", "ddddd", "hopper", "excalibu", "more", "wilbur", "illini", "imperial", "phillips", "lansing", "maxx", "gothic", "golfball", "carlton", "camille", "facial", "front242", "macdaddy", "qwer1234", "vectra", "cowboys1", "crazy1", "dannyboy", "jane", "betty", "benny", "bennett", "leader", "martinez", "aquarius", "barkley", "hayden", "caught", "franky", "ffff", "floyd", "sassy", "pppp", "pppppppp", "prodigy", "clarence", "noodle", "eatpussy", "vortex", "wanking", "beatrice", "billy1", "siemens", "pedro", "phillies", "research", "groups", "carolyn", "chevy1", "cccc", "fritz", "gggggggg", "doughboy", "dracula", "nurses", "loco", "madrid", "lollipop", "trout", "utopia", "chrono", "cooler", "conner", "nevada", "wibble", "werner", "summit", "marco", "marilyn", "1225", "babies", "capone", "fugazi", "panda", "mama", "qazwsxed", "puppies", "triton", "9876", "command", "nnnnnn", "ernest", "momoney", "iforgot", "wolfie", "studly", "shawn", "renee", "alien", "hamburg", "81fukkc", "741852", "catman", "china", "forgot", "gagging", "scott1", "drew", "oregon", "qweqwe", "train", "crazybab", "daniel1", "cutlass", "brothers", "holes", "heidi", "mothers", "music1", "what", "walrus", "1957", "bigtime", "bike", "xtreme", "simba", "ssss", "rookie", "angie", "bathing", "fresh", "sanchez", "rotten", "maestro", "luis", "look", "turbo1", "99999", "butthole", "hhhh", "elijah", "monty", "bender", "yoda", "shania", "shock", "phish", "thecat", "rightnow", "reagan", "baddog", "asia", "greatone", "gateway1", "randall", "abstr", "napster", "brian1", "bogart", "high", "hitler", "emma", "kill", "weaver", "wildfire", "jackson1", "isaiah", "1981", "belinda", "beaner", "yoyo", "0.0.0.000", "super1", "select", "snuggles", "slutty", "some", "phoenix1", "technics", "toon", "raven1", "rayray", "123789", "1066", "albion", "greens", "fashion", "gesperrt", "santana", "paint", "powell", "credit", "darling", "mystery", "bowser", "bottle", "brucelee", "hehehe", "kelly1", "mojo", "1998", "bikini", "woofwoof", "yyyy", "strap", "sites", "spears", "theodore", "julius", "richards", "amelia", "central", "f**k", "nyjets", "punisher", "username", "vanilla", "twisted", "bryant", "brent", "bunghole", "here", "elizabeth", "erica", "kimber", "viagra", "veritas", "pony", "pool", "titts", "labtec", "lifetime", "jenny1", "masterbate", "mayhem", "redbull", "govols", "gremlin", "505050", "gmoney", "rupert", "rovers", "diamond1", "lorenzo", "trident", "abnormal", "davidson", "deskjet", "cuddles", "nice", "bristol", "karina", "milano", "vh5150", "jarhead", "1982", "bigbird", "bizkit", "sixers", "slider", "star69", "starfish", "penetration", "tommy1", "john316", "meghan", "michaela", "market", "grant", "caligula", "carl", "flicks", "films", "madden", "railroad", "cosmo", "cthulhu", "bradford", "br0d3r", "military", "bearbear", "swedish", "spawn", "patrick1", "polly", "these", "todd", "reds", "anarchy", "groove", "franco", "fuckher", "oooo", "tyrone", "vegas", "airbus", "cobra1", "christine", "clips", "delete", "duster", "kitty1", "mouse1", "monkeys", "jazzman", "1919", "262626", "swinging", "stroke", "stocks", "sting", "pippen", "labrador", "jordan1", "justdoit", "meatball", "females", "saturday", "park", "vector", "cooter", "defender", "desert", "demon", "nike", "bubbas", "bonkers", "english", "kahuna", "wildman", "4121", "sirius", "static", "piercing", "terror", "teenage", "leelee", "marissa", "microsof", "mechanic", "robotech", "rated", "hailey", "chaser", "sanders", "salsero", "nuts", "macross", "quantum", "rachael", "tsunami", "universe", "daddy1", "cruise", "nguyen", "newpass6", "nudes", "hellyeah", "vernon", "1959", "zaq12wsx", "striker", "sixty", "steele", "spice", "spectrum", "smegma", "thumb", "jjjjjjjj", "mellow", "astrid", "cancun", "cartoon", "sabres", "samiam", "pants", "oranges", "oklahoma", "lust", "coleman", "denali", "nude", "noodles", "buzz", "brest", "hooter", "mmmmmmmm", "warthog", "bloody", "blueblue", "zappa", "wolverine", "sniffing", "lance", "jean", "jjjjj", "harper", "calico", "freee", "rover", "door", "pooter", "closeup", "bonsai", "evelyn", "emily1", "kathryn", "keystone", "iiii", "1955", "yzerman", "theboss", "tolkien", "jill", "megaman", "rasta", "bbbbbbbb", "bean", "handsome", "hal9000", "goofy", "gringo", "gofish", "gizmo1", "samsam", "scuba", "onlyme", "tttttttt", "corrado", "clown", "clapton", "deborah", "boris", "bulls", "vivian", "jayhawk", "bethany", "wwww", "sharky", "seeker", "ssssssss", "somethin", "pillow", "thesims", "lighter", "lkjhgf", "melissa1", "marcius2", "barry", "guiness", "gymnast", "casey1", "goalie", "godsmack", "doug", "lolo", "rangers1", "poppy", "abby", "clemson", "clipper", "deeznuts", "nobody", "holly1", "elliot", "eeee", "kingston", "miriam", "belle", "yosemite", "sucked", "sex123", "sexy69", "pic's", "tommyboy", "lamont", "meat", "masterbating", "marianne", "marc", "gretzky", "happyday", "frisco", "scratch", "orchid", "orange1", "manchest", "quincy", "unbelievable", "aberdeen", "dawson", "nathalie", "ne1469", "boxing", "hill", "korn", "intercourse", "161616", "1985", "ziggy", "supersta", "stoney", "senior", "amature", "barber", "babyboy", "bcfields", "goliath", "hack", "hardrock", "children", "frodo", "scout", "scrappy", "rosie", "qazqaz", "tracker", "active", "craving", "commando", "cohiba", "deep", "cyclone", "dana", "bubba69", "katie1", "mpegs", "vsegda", "jade", "irish1", "better", "sexy1", "sinclair", "smelly", "squerting", "lions", "jokers", "jeanette", "julia", "jojojo", "meathead", "ashley1", "groucho", "cheetah", "champ", "firefox", "gandalf1", "packer", "magnolia", "love69", "tyler1", "typhoon", "tundra", "bobby1", "kenworth", "village", "volley", "beth", "wolf359", "0420", "000007", "swimmer", "skydive", "smokes", "patty", "peugeot", "pompey", "legolas", "kristy", "redhot", "rodman", "redalert", "having", "grapes", "4runner", "carrera", "floppy", "dollars", "ou8122", "quattro", "adams", "cloud9", "davids", "nofear", "busty", "homemade", "mmmmm", "whisper", "vermont", "webmaste", "wives", "insertion", "jayjay", "philips", "phone", "topher", "tongue", "temptress", "midget", "ripken", "havefun", "gretchen", "canon", "celebrity", "five", "getting", "ghetto", "direct", "otto", "ragnarok", "trinidad", "usnavy", "conover", "cruiser", "dalshe", "nicole1", "buzzard", "hottest", "kingfish", "misfit", "moore", "milfnew", "warlord", "wassup", "bigsexy", "blackhaw", "zippy", "shearer", "tights", "thursday", "kungfu", "labia", "journey", "meatloaf", "marlene", "rider", "area51", "batman1", "bananas", "636363", "cancel", "ggggg", "paradox", "mack", "lynn", "queens", "adults", "aikido", "cigars", "nova", "hoosier", "eeyore", "moose1", "warez", "interacial", "streaming", "313131", "pertinant", "pool6123", "mayday", "rivers", "revenge", "animated", "banker", "baddest", "gordon24", "ccccc", "fortune", "fantasies", "touching", "aisan", "deadman", "homepage", "ejaculation", "whocares", "iscool", "jamesbon", "1956", "1pussy", "womam", "sweden", "skidoo", "spock", "sssss", "petra", "pepper1", "pinhead", "micron", "allsop", "amsterda", "army", "aside", "gunnar", "666999", "chip", "foot", "fowler", "february", "face", "fletch", "george1", "sapper", "science", "sasha1", "luckydog", "lover1", "magick", "popopo", "public", "ultima", "derek", "cypress", "booker", "businessbabe", "brandon1", "edwards", "experience", "vulva", "vvvv", "jabroni", "bigbear", "yummy", "010203", "searay", "secret1", "showing", "sinbad", "sexxxx", "soleil", "software", "piccolo", "thirteen", "leopard", "legacy", "jensen", "justine", "memorex", "marisa", "mathew", "redwing", "rasputin", "134679", "anfield", "greenbay", "gore", "catcat", "feather", "scanner", "pa55word", "contortionist", "danzig", "daisy1", "hores", "erik", "exodus", "vinnie", "iiiiii", "zero", "1001", "subway", "tank", "second", "snapple", "sneakers", "sonyfuck", "picks", "poodle", "test1234", "their", "llll", "junebug", "june", "marker", "mellon", "ronaldo", "roadkill", "amanda1", "asdfjkl", "beaches", "greene", "great1", "cheerleaers", "force", "doitnow", "ozzy", "madeline", "radio", "tyson", "christian", "daphne", "boxster", "brighton", "housewifes", "emmanuel", "emerson", "kkkk", "mnbvcx", "moocow", "vides", "wagner", "janet", "1717", "bigmoney", "blonds", "1000", "storys", "stereo", "4545", "420247", "seductive", "sexygirl", "lesbean", "live", "justin1", "124578", "animals", "balance", "hansen", "cabbage", "canadian", "gangbanged", "dodge1", "dimas", "lori", "loud", "malaka", "puss", "probes", "adriana", "coolman", "crawford", "dante", "nacked", "hotpussy", "erotica", "kool", "mirror", "wearing", "implants", "intruder", "bigass", "zenith", "woohoo", "womans", "tanya", "tango", "stacy", "pisces", "laguna", "krystal", "maxell", "andyod22", "barcelon", "chainsaw", "chickens", "flash1", "downtown", "orgasms", "magicman", "profit", "pusyy", "pothead", "coconut", "chuckie", "contact", "clevelan", "designer", "builder", "budweise", "hotshot", "horizon", "hole", "experienced", "mondeo", "wifes", "1962", "strange", "stumpy", "smiths", "sparks", "slacker", "piper", "pitchers", "passwords", "laptop", "jeremiah", "allmine", "alliance", "bbbbbbb", "asscock", "halflife", "grandma", "hayley", "88888", "cecilia", "chacha", "saratoga", "sandy1", "santos", "doogie", "number", "positive", "qwert40", "transexual", "crow", "close-up", "darrell", "bonita", "ib6ub9", "volvo", "jacob1", "iiiii", "beastie", "sunnyday", "stoned", "sonics", "starfire", "snapon", "pictuers", "pepe", "testing1", "tiberius", "lisalisa", "lesbain", "litle", "retard", "ripple", "austin1", "badgirl", "golfgolf", "flounder", "garage", "royals", "dragoon", "dickie", "passwor", "ocean", "majestic", "poppop", "trailers", "dammit", "nokia", "bobobo", "br549", "emmitt", "knock", "minime", "mikemike", "whitesox", "1954", "3232", "353535", "seamus", "solo", "sparkle", "sluttey", "pictere", "titten", "lback", "1024", "angelina", "goodluck", "charlton", "fingerig", "gallaries", "goat", "ruby", "passme", "oasis", "lockerroom", "logan1", "rainman", "twins", "treasure", "absolutely", "club", "custom", "cyclops", "nipper", "bucket", "homepage-", "hhhhh", "momsuck", "indain", "2345", "beerbeer", "bimmer", "susanne", "stunner", "stevens", "456456", "shell", "sheba", "tootsie", "tiny", "testerer", "reefer", "really", "1012", "harcore", "gollum", "545454", "chico", "caveman", "carole", "fordf150", "fishes", "gaymen", "saleen", "doodoo", "pa55w0rd", "looney", "presto", "qqqqq", "cigar", "bogey", "brewer", "helloo", "dutch", "kamikaze", "monte", "wasser", "vietnam", "visa", "japanees", "0123", "swords", "slapper", "peach", "jump", "marvel", "masterbaiting", "march", "redwood", "rolling", "1005", "ametuer", "chiks", "cathy", "callaway", "fucing", "sadie1", "panasoni", "mamas", "race", "rambo", "unknown", "absolut", "deacon", "dallas1", "housewife", "kristi", "keywest", "kirsten", "kipper", "morning", "wings", "idiot", "18436572", "1515", "beating", "zxczxc", "sullivan", "303030", "shaman", "sparrow", "terrapin", "jeffery", "masturbation", "mick", "redfish", "1492", "angus", "barrett", "goirish", "hardcock", "felicia", "forfun", "galary", "freeporn", "duchess", "olivier", "lotus", "pornographic", "ramses", "purdue", "traveler", "crave", "brando", "enter1", "killme", "moneyman", "welder", "windsor", "wifey", "indon", "yyyyy", "stretch", "taylor1", "4417", "shopping", "picher", "pickup", "thumbnils", "johnboy", "jets", "jess", "maureen", "anne", "ameteur", "amateurs", "apollo13", "hambone", "goldwing", "5050", "charley", "sally1", "doghouse", "padres", "pounding", "quest", "truelove", "underdog", "trader", "crack", "climber", "bolitas", "bravo", "hohoho", "model", "italian", "beanie", "beretta", "wrestlin", "stroker", "tabitha", "sherwood", "sexyman", "jewels", "johannes", "mets", "marcos", "rhino", "bdsm", "balloons", "goodman", "grils", "happy123", "flamingo", "games", "route66", "devo", "dino", "outkast", "paintbal", "magpie", "llllllll", "twilight", "critter", "christie", "cupcake", "nickel", "bullseye", "krista", "knickerless", "mimi", "murder", "videoes", "binladen", "xerxes", "slim", "slinky", "pinky", "peterson", "thanatos", "meister", "menace", "ripley", "retired", "albatros", "balloon", "bank", "goten", "5551212", "getsdown", "donuts", "divorce", "nwo4life", "lord", "lost", "underwear", "tttt", "comet", "deer", "damnit", "dddddddd", "deeznutz", "nasty1", "nonono", "nina", "enterprise", "eeeee", "misfit99", "milkman", "vvvvvv", "isaac", "1818", "blueboy", "beans", "bigbutt", "wyatt", "tech", "solution", "poetry", "toolman", "laurel", "juggalo", "jetski", "meredith", "barefoot", "50spanks", "gobears", "scandinavian", "original", "truman", "cubbies", "nitram", "briana", "ebony", "kings", "warner", "bilbo", "yumyum", "zzzzzzz", "stylus", "321654", "shannon1", "server", "secure", "silly", "squash", "starman", "steeler", "staples", "phrases", "techniques", "laser", "135790", "allan", "barker", "athens", "cbr600", "chemical", "fester", "gangsta", "fucku2", "freeze", "game", "salvador", "droopy", "objects", "passwd", "lllll", "loaded", "louis", "manchester", "losers", "vedder", "clit", "chunky", "darkman", "damage", "buckshot", "buddah", "boobed", "henti", "hillary", "webber", "winter1", "ingrid", "bigmike", "beta", "zidane", "talon", "slave1", "pissoff", "person", "thegreat", "living", "lexus", "matador", "readers", "riley", "roberta", "armani", "ashlee", "goldstar", "5656", "cards", "fmale", "ferris", "fuking", "gaston", "fucku", "ggggggg", "sauron", "diggler", "pacers", "looser", "pounded", "premier", "pulled", "town", "trisha", "triangle", "cornell", "collin", "cosmic", "deeper", "depeche", "norway", "bright", "helmet", "kristine", "kendall", "mustard", "misty1", "watch", "jagger", "bertie", "berger", "word", "3x7pxr", "silver1", "smoking", "snowboar", "sonny", "paula", "penetrating", "photoes", "lesbens", "lambert", "lindros", "lillian", "roadking", "rockford", "1357", "143143", "asasas", "goodboy", "898989", "chicago1", "card", "ferrari1", "galeries", "godfathe", "gawker", "gargoyle", "gangster", "rubble", "rrrr", "onetime", "pussyman", "pooppoop", "trapper", "twenty", "abraham", "cinder", "company", "newcastl", "boricua", "bunny1", "boxer", "hotred", "hockey1", "hooper", "edward1", "evan", "kris", "misery", "moscow", "milk", "mortgage", "bigtit", "show", "snoopdog", "three", "lionel", "leanne", "joshua1", "july", "1230", "assholes", "cedric", "fallen", "farley", "gene", "frisky", "sanity", "script", "divine", "dharma", "lucky13", "property", "tricia", "akira", "desiree", "broadway", "butterfly", "hunt", "hotbox", "hootie", "heat", "howdy", "earthlink", "karma", "kiteboy", "motley", "westwood", "1988", "bert", "blackbir", "biggles", "wrench", "working", "wrestle", "slippery", "pheonix", "penny1", "pianoman", "tomorrow", "thedude", "jenn", "jonjon", "jones1", "mattie", "memory", "micheal", "roadrunn", "arrow", "attitude", "azzer", "seahawks", "diehard", "dotcom", "lola", "tunafish", "chivas", "cinnamon", "clouds", "deluxe", "northern", "nuclear", "north", "boom", "boobie", "hurley", "krishna", "momomo", "modles", "volume", "23232323", "bluedog", "wwwwwww", "zerocool", "yousuck", "pluto", "limewire", "link", "joung", "marcia", "awnyce", "gonavy", "haha", "films+pic+galeries", "fabian", "francois", "girsl", "fuckthis", "girfriend", "rufus", "drive", "uncencored", "a123456", "airport", "clay", "chrisbln", "combat", "cygnus", "cupoi", "never", "netscape", "brett", "hhhhhhhh", "eagles1", "elite", "knockers", "kendra", "mommy", "1958", "tazmania", "shonuf", "piano", "pharmacy", "thedog", "lips", "jillian", "jenkins", "midway", "arsenal1", "anaconda", "australi", "gromit", "gotohell", "787878", "66666", "carmex2", "camber", "gator1", "ginger1", "fuzzy", "seadoo", "dorian", "lovesex", "rancid", "uuuuuu", "911911", "nature", "bulldog1", "helen", "health", "heater", "higgins", "kirk", "monalisa", "mmmmmmm", "whiteout", "virtual", "ventura", "jamie1", "japanes", "james007", "2727", "2469", "blam", "bitchass", "believe", "zephyr", "stiffy", "sweet1", "silent", "southpar", "spectre", "tigger1", "tekken", "lenny", "lakota", "lionking", "jjjjjjj", "medical", "megatron", "1369", "hawaiian", "gymnastic", "golfer1", "gunners", "7779311", "515151", "famous", "glass", "screen", "rudy", "royal", "sanfran", "drake", "optimus", "panther1", "love1", "mail", "maggie1", "pudding", "venice", "aaron1", "delphi", "niceass", "bounce", "busted", "house1", "killer1", "miracle", "momo", "musashi", "jammin", "2003", "234567", "wp2003wp", "submit", "silence", "sssssss", "state", "spikes", "sleeper", "passwort", "toledo", "kume", "media", "meme", "medusa", "mantis", "remote", "reading", "reebok", "1017", "artemis", "hampton", "harry1", "cafc91", "fettish", "friendly", "oceans", "oooooooo", "mango", "ppppp", "trainer", "troy", "uuuu", "909090", "cross", "death1", "news", "bullfrog", "hokies", "holyshit", "eeeeeee", "mitch", "jasmine1", "&amp", "&amp;", "sergeant", "spinner", "leon", "jockey", "records", "right", "babyblue", "hans", "gooner", "474747", "cheeks", "cars", "candice", "fight", "glow", "pass1234", "parola", "okokok", "pablo", "magical", "major", "ramsey", "poseidon", "989898", "confused", "circle", "crusher", "cubswin", "nnnn", "hollywood", "erin", "kotaku", "milo", "mittens", "whatsup", "vvvvv", "iomega", "insertions", "bengals", "bermuda", "biit", "yellow1", "012345", "spike1", "south", "sowhat", "pitures", "peacock", "pecker", "theend", "juliette", "jimmie", "romance", "augusta", "hayabusa", "hawkeyes", "castro", "florian", "geoffrey", "dolly", "lulu", "qaz123", "usarmy", "twinkle", "cloud", "chuckles", "cold", "hounddog", "hover", "hothot", "europa", "ernie", "kenshin", "kojak", "mikey1", "water1", "196969", "because", "wraith", "zebra", "wwwww", "33333", "simon1", "spider1", "snuffy", "philippe", "thunderb", "teddy1", "lesley", "marino13", "maria1", "redline", "renault", "aloha", "antoine", "handyman", "cerberus", "gamecock", "gobucks", "freesex", "duffman", "ooooo", "papa", "nuggets", "magician", "longbow", "preacher", "porno1", "county", "chrysler", "contains", "dalejr", "darius", "darlene", "dell", "navy", "buffy1", "hedgehog", "hoosiers", "honey1", "hott", "heyhey", "europe", "dutchess", "everest", "wareagle", "ihateyou", "sunflowe", "3434", "senators", "shag", "spoon", "sonoma", "stalker", "poochie", "terminal", "terefon", "laurence", "maradona", "maryann", "marty", "roman", "1007", "142536", "alibaba", "america1", "bartman", "astro", "goth", "century", "chicken1", "cheater", "four", "ghost1", "passpass", "oral", "r2d2c3po", "civic", "cicero", "myxworld", "kkkkk", "missouri", "wishbone", "infiniti", "jameson", "1a2b3c", "1qwerty", "wonderboy", "skip", "shojou", "stanford", "sparky1", "smeghead", "poiuy", "titanium", "torres", "lantern", "jelly", "jeanne", "meier", "1213", "bayern", "basset", "gsxr750", "cattle", "charlene", "fishing1", "fullmoon", "gilles", "dima", "obelix", "popo", "prissy", "ramrod", "unique", "absolute", "bummer", "hotone", "dynasty", "entry", "konyor", "missy1", "moses", "282828", "yeah", "xyz123", "stop", "426hemi", "404040", "seinfeld", "simmons", "pingpong", "lazarus", "matthews", "marine1", "manning", "recovery", "12345a", "beamer", "babyface", "greece", "gustav", "7007", "charity", "camilla", "ccccccc", "faggot", "foxy", "frozen", "gladiato", "duckie", "dogfood", "paranoid", "packers1", "longjohn", "radical", "tuna", "clarinet", "claudio", "circus", "danny1", "novell", "nights", "bonbon", "kashmir", "kiki", "mortimer", "modelsne", "moondog", "monaco", "vladimir", "insert", "1953", "zxc123", "supreme", "3131", "sexxx", "selena", "softail", "poipoi", "pong", "together", "mars", "martin1", "rogue", "alone", "avalanch", "audia4", "55bgates", "cccccccc", "chick", "came11", "figaro", "geneva", "dogboy", "dnsadm", "dipshit", "paradigm", "othello", "operator", "officer", "malone", "post", "rafael", "valencia", "tripod", "choice", "chopin", "coucou", "coach", "cocksuck", "common", "creature", "borussia", "book", "browning", "heritage", "hiziad", "homerj", "eight", "earth", "millions", "mullet", "whisky", "jacques", "store", "4242", "speedo", "starcraf", "skylar", "spaceman", "piggy", "pierce", "tiger2", "legos", "lala", "jezebel", "judy", "joker1", "mazda", "barton", "baker", "727272", "chester1", "fishman", "food", "rrrrrrrr", "sandwich", "dundee", "lumber", "magazine", "radar", "ppppppp", "tranny", "aaliyah", "admiral", "comics", "cleo", "delight", "buttfuck", "homeboy", "eternal", "kilroy", "kellie", "khan", "violin", "wingman", "walmart", "bigblue", "blaze", "beemer", "beowulf", "bigfish", "yyyyyyy", "woodie", "yeahbaby", "0123456", "tbone", "style", "syzygy", "starter", "lemon", "linda1", "merlot", "mexican", "11235813", "anita", "banner", "bangbang", "badman", "barfly", "grease", "carla", "charles1", "ffffffff", "screw", "doberman", "diane", "dogshit", "overkill", "counter", "coolguy", "claymore", "demons", "demo", "nomore", "normal", "brewster", "hhhhhhh", "hondas", "iamgod", "enterme", "everett", "electron", "eastside", "kayla", "minimoni", "mybaby", "wildbill", "wildcard", "ipswich", "200000", "bearcat", "zigzag", "yyyyyyyy", "xander", "sweetnes", "369369", "skyler", "skywalker", "pigeon", "peyton", "tipper", "lilly", "asdf123", "alphabet", "asdzxc", "babybaby", "banane", "barnes", "guyver", "graphics", "grand", "chinook", "florida1", "flexible", "fuckinside", "otis", "ursitesux", "tototo", "trust", "tower", "adam12", "christma", "corey", "chrome", "buddie", "bombers", "bunker", "hippie", "keegan", "misfits", "vickie", "292929", "woofer", "wwwwwwww", "stubby", "sheep", "secrets", "sparta", "stang", "spud", "sporty", "pinball", "jorge", "just4fun", "johanna", "maxxxx", "rebecca1", "gunther", "fatima", "fffffff", "freeway", "garion", "score", "rrrrr", "sancho", "outback", "maggot", "puddin", "trial", "adrienne", "987456", "colton", "clyde", "brain", "brains", "hoops", "eleanor", "dwayne", "kirby", "mydick", "villa", "19691969", "bigcat", "becker", "shiner", "silverad", "spanish", "templar", "lamer", "juicy", "marsha", "mike1", "maximum", "rhiannon", "real", "1223", "10101010", "arrows", "andres", "alucard", "baldwin", "baron", "avenue", "ashleigh", "haggis", "channel", "cheech", "safari", "ross", "dog123", "orion1", "paloma", "qwerasdf", "presiden", "vegitto", "trees", "969696", "adonis", "colonel", "cookie1", "newyork1", "brigitte", "buddyboy", "hellos", "heineken", "dwight", "eraser", "kerstin", "motion", "moritz", "millwall", "visual", "jaybird", "1983", "beautifu", "bitter", "yvette", "zodiac", "steven1", "sinister", "slammer", "smashing", "slick1", "sponge", "teddybea", "theater", "this", "ticklish", "lipstick", "jonny", "massage", "mann", "reynolds", "ring", "1211", "amazing", "aptiva", "applepie", "bailey1", "guitar1", "chanel", "canyon", "gagged", "fuckme1", "rough", "digital1", "dinosaur", "punk", "98765", "90210", "clowns", "cubs", "daniels", "deejay", "nigga", "naruto", "boxcar", "icehouse", "hotties", "electra", "kent", "widget", "india", "insanity", "1986", "2004", "best", "bluefish", "bingo1", "*****", "stratus", "strength", "sultan", "storm1", "44444", "4200", "sentnece", "season", "sexyboy", "sigma", "smokie", "spam", "point", "pippo", "ticket", "temppass", "joel", "manman", "medicine", "1022", "anton", "almond", "bacchus", "aztnm", "axio", "awful", "bamboo", "hakr", "gregor", "hahahaha", "5678", "casanova", "caprice", "camero1", "fellow", "fountain", "dupont", "dolphin1", "dianne", "paddle", "magnet", "qwert1", "pyon", "porsche1", "tripper", "vampires", "coming", "noway", "burrito", "bozo", "highheel", "hughes", "hookem", "eddie1", "ellie", "entropy", "kkkkkkkk", "kkkkkkk", "illinois", "jacobs", "1945", "1951", "24680", "21212121", "100000", "stonecold", "taco", "subzero", "sharp", "sexxxy", "skolko", "shanna", "skyhawk", "spurs1", "sputnik", "piazza", "testpass", "letter", "lane", "kurt", "jiggaman", "matilda", "1224", "harvard", "hannah1", "525252", "4ever", "carbon", "chef", "federico", "ghosts", "gina", "scorpio1", "rt6ytere", "madison1", "loki", "raquel", "promise", "coolness", "christina", "coldbeer", "citadel", "brittney", "highway", "evil", "monarch", "morgan1", "washingt", "1997", "bella1", "berry", "yaya", "yolanda", "superb", "taxman", "studman", "stephanie", "3636", "sherri", "sheriff", "shepherd", "poland", "pizzas", "tiffany1", "toilet", "latina", "lassie", "larry1", "joseph1", "mephisto", "meagan", "marian", "reptile", "rico", "razor", "1013", "barron", "hammer1", "gypsy", "grande", "carroll", "camper", "chippy", "cat123", "call", "chimera", "fiesta", "glock", "glenn", "domain", "dieter", "dragonba", "onetwo", "nygiants", "odessa", "password2", "louie", "quartz", "prowler", "prophet", "towers", "ultra", "cocker", "corleone", "dakota1", "cumm", "nnnnnnn", "natalia", "boxers", "hugo", "heynow", "hollow", "iceberg", "elvira", "kittykat", "kate", "kitchen", "wasabi", "vikings1", "impact", "beerman", "string", "sleep", "splinter", "snoopy1", "pipeline", "pocket", "legs", "maple", "mickey1", "manuela", "mermaid", "micro", "meowmeow", "redbird", "alisha", "baura", "battery", "grass", "chevys", "chestnut", "caravan", "carina", "charmed", "fraser", "frogman", "diving", "dogger", "draven", "drifter", "oatmeal", "paris1", "longdong", "quant4307s", "rachel1", "vegitta", "cole", "cobras", "corsair", "dadada", "noelle", "mylife", "nine", "bowwow", "body", "hotrats", "eastwood", "moonligh", "modena", "wave", "illusion", "iiiiiii", "jayhawks", "birgit", "zone", "sutton", "susana", "swingers", "shocker", "shrimp", "sexgod", "squall", "stefanie", "squeeze", "soul", "patrice", "poiu", "players", "tigers1", "toejam", "tickler", "line", "julie1", "jimbo1", "jefferso", "juanita", "michael2", "rodeo", "robot", "1023", "annie1", "bball", "guess", "happy2", "charter", "farm", "flasher", "falcon1", "fiction", "fastball", "gadget", "scrabble", "diaper", "dirtbike", "dinner", "oliver1", "partner", "paco", "lucille", "macman", "poopy", "popper", "postman", "ttttttt", "ursula", "acura", "cowboy1", "conan", "daewoo", "cyrus", "customer", "nation", "nemrac58", "nnnnn", "nextel", "bolton", "bobdylan", "hopeless", "eureka", "extra", "kimmie", "kcj9wx5n", "killbill", "musica", "volkswag", "wage", "windmill", "wert", "vintage", "iloveyou1", "itsme", "bessie", "zippo", "311311", "starligh", "smokey1", "spot", "snappy", "soulmate", "plasma", "thelma", "tonight", "krusty", "just4me", "mcdonald", "marius", "rochelle", "rebel1", "1123", "alfredo", "aubrey", "audi", "chantal", "fick", "goaway", "roses", "sales", "rusty2", "dirt", "dogbone", "doofus", "ooooooo", "oblivion", "mankind", "luck", "mahler", "lllllll", "pumper", "puck", "pulsar", "valkyrie", "tupac", "compass", "concorde", "costello", "cougars", "delaware", "niceguy", "nocturne", "bob123", "boating", "bronze", "hopkins", "herewego", "hewlett", "houhou", "hubert", "earnhard", "eeeeeeee", "keller", "mingus", "mobydick", "venture", "verizon", "imation", "1950", "1948", "1949", "223344", "bigbig", "blossom", "zack", "wowwow", "sissy", "skinner", "spiker", "square", "snooker", "sluggo", "player1", "junk", "jeannie", "jsbach", "jumbo", "jewel", "medic", "robins", "reddevil", "reckless", "123456a", "1125", "1031", "beacon", "astra", "gumby", "hammond", "hassan", "757575", "585858", "chillin", "fuck1", "sander", "lowell", "radiohea", "upyours", "trek", "courage", "coolcool", "classics", "choochoo", "darryl", "nikki1", "nitro", "bugs", "boytoy", "ellen", "excite", "kirsty", "kane", "wingnut", "wireless", "icu812", "1master", "beatle", "bigblock", "blanca", "wolfen", "summer99", "sugar1", "tartar", "sexysexy", "senna", "sexman", "sick", "someone", "soprano", "pippin", "platypus", "pixies", "telephon", "land", "laura1", "laurent", "rimmer", "road", "report", "1020", "12qwaszx", "arturo", "around", "hamish", "halifax", "fishhead", "forum", "dododo", "doit", "outside", "paramedi", "lonesome", "mandy1", "twist", "uuuuu", "uranus", "ttttt", "butcher", "bruce1", "helper", "hopeful", "eduard", "dusty1", "kathy1", "katherin", "moonbeam", "muscles", "monster1", "monkeybo", "morton", "windsurf", "vvvvvvv", "vivid", "install", "1947", "187187", "1941", "1952", "tatiana", "susan1", "31415926", "sinned", "sexxy", "senator", "sebastian", "shadows", "smoothie", "snowflak", "playstat", "playa", "playboy1", "toaster", "jerry1", "marie1", "mason1", "merlin1", "roger1", "roadster", "112358", "1121", "andrea1", "bacardi", "auto", "hardware", "hardy", "789789", "5555555", "captain1", "flores", "fergus", "sascha", "rrrrrrr", "dome", "onion", "nutter", "lololo", "qqqqqqq", "quick", "undertak", "uuuuuuuu", "uuuuuuu", "criminal", "cobain", "cindy1", "coors", "dani", "descent", "nimbus", "nomad", "nanook", "norwich", "bomb", "bombay", "broker", "hookup", "kiwi", "winners", "jackpot", "1a2b3c4d", "1776", "beardog", "bighead", "blast", "bird33", "0987", "stress", "shot", "spooge", "pelican", "peepee", "perry", "pointer", "titan", "thedoors", "jeremy1", "annabell", "altima", "baba", "hallie", "hate", "hardone", "5454", "candace", "catwoman", "flip", "faithful", "finance", "farmboy", "farscape", "genesis1", "salomon", "destroy", "papers", "option", "page", "loser1", "lopez", "r2d2", "pumpkins", "training", "chriss", "cumcum", "ninjas", "ninja1", "hung", "erika", "eduardo", "killers", "miller1", "islander", "jamesbond", "intel", "jarvis", "19841984", "2626", "bizzare", "blue12", "biker", "yoyoma", "sushi", "styles", "shitface", "series", "shanti", "spanker", "steffi", "smart", "sphinx", "please1", "paulie", "pistons", "tiburon", "limited", "maxwell1", "mdogg", "rockies", "armstron", "alexia", "arlene", "alejandr", "arctic", "banger", "audio", "asimov", "augustus", "grandpa", "753951", "4you", "chilly", "care1839", "chapman", "flyfish", "fantasia", "freefall", "santa", "sandrine", "oreo", "ohshit", "macbeth", "madcat", "loveya", "mallory", "rage", "quentin", "qwerqwer", "project", "ramirez", "colnago", "citizen", "chocha", "cobalt", "crystal1", "dabears", "nevets", "nineinch", "broncos1", "helene", "huge", "edgar", "epsilon", "easter", "kestrel", "moron", "virgil", "winston1", "warrior1", "iiiiiiii", "iloveyou2", "1616", "beat", "bettina", "woowoo", "zander", "straight", "shower", "sloppy", "specialk", "tinkerbe", "jellybea", "reader", "romero", "redsox1", "ride", "1215", "1112", "annika", "arcadia", "answer", "baggio", "base", "guido", "555666", "carmel", "cayman", "cbr900rr", "chips", "gabriell", "gertrude", "glennwei", "roxy", "sausages", "disco", "pass1", "luna", "lovebug", "macmac", "queenie", "puffin", "vanguard", "trip", "trinitro", "airwolf", "abbott", "aaa111", "cocaine", "cisco", "cottage", "dayton", "deadly", "datsun", "bricks", "bumper", "eldorado", "kidrock", "wizard1", "whiskers", "wind", "wildwood", "istheman", "interest", "italy", "25802580", "benoit", "bigones", "woodland", "wolfpac", "strawber", "suicide", "3030", "sheba1", "sixpack", "peace1", "physics", "pearson", "tigger2", "toad", "megan1", "meow", "ringo", "roll", "amsterdam", "717171", "686868", "5424", "catherine", "canuck", "football1", "footjob", "fulham", "seagull", "orgy", "lobo", "mancity", "truth", "trace", "vancouve", "vauxhall", "acidburn", "derf", "myspace1", "boozer", "buttercu", "howell", "hola", "easton", "minemine", "munch", "jared", "1dragon", "biology", "bestbuy", "bigpoppa", "blackout", "blowfish", "bmw325", "bigbob", "stream", "talisman", "tazz", "sundevil", "3333333", "skate", "shutup", "shanghai", "shop", "spencer1", "slowhand", "polish", "pinky1", "tootie", "thecrow", "leroy", "jonathon", "jubilee", "jingle", "martine", "matrix1", "manowar", "michaels", "messiah", "mclaren", "resident", "reilly", "redbaron", "rollins", "romans", "return", "rivera", "andromed", "athlon", "beach1", "badgers", "guitars", "harald", "harddick", "gotribe", "6996", "7grout", "5wr2i7h8", "635241", "chase1", "carver", "charlotte", "fallout", "fiddle", "fredrick", "fenris", "francesc", "fortuna", "ferguson", "fairlane", "felipe", "felix1", "forward", "gasman", "frost", "fucks", "sahara", "sassy1", "dogpound", "dogbert", "divx1", "manila", "loretta", "priest", "pornporn", "quasar", "venom", "987987", "access1", "clippers", "daylight", "decker", "daman", "data", "dentist", "crusty", "nathan1", "nnnnnnnn", "bruno1", "bucks", "brodie", "budapest", "kittens", "kerouac", "mother1", "waldo1", "wedding", "whistler", "whatwhat", "wanderer", "idontkno", "1942", "1946", "bigdawg", "bigpimp", "zaqwsx", "414141", "3000gt", "434343", "shoes", "serpent", "starr", "smurf", "pasword", "tommie", "thisisit", "lake", "john1", "robotics", "redeye", "rebelz", "1011", "alatam", "asses", "asians", "bama", "banzai", "harvest", "gonzalez", "hair", "hanson", "575757", "5329", "cascade", "chinese", "fatty", "fender1", "flower2", "funky", "sambo", "drummer1", "dogcat", "dottie", "oedipus", "osama", "macleod", "prozac", "private1", "rampage", "punch", "presley", "concord", "cook", "cinema", "cornwall", "cleaner", "christopher", "ciccio", "corinne", "clutch", "corvet07", "daemon", "bruiser", "boiler", "hjkl", "eyes", "egghead", "expert", "ethan", "kasper", "mordor", "wasted", "jamess", "iverson3", "bluesman", "zouzou", "090909", "1002", "switch", "stone1", "4040", "sisters", "sexo", "shawna", "smith1", "sperma", "sneaky", "polska", "thewho", "terminat", "krypton", "lawson", "library", "lekker", "jules", "johnson1", "johann", "justus", "rockie", "romano", "aspire", "bastards", "goodie", "cheese1", "fenway", "fishon", "fishin", "fuckoff1", "girls1", "sawyer", "dolores", "desmond", "duane", "doomsday", "pornking", "ramones", "rabbits", "transit", "aaaaa1", "clock", "delilah", "noel", "boyz", "bookworm", "bongo", "bunnies", "brady", "buceta", "highbury", "henry1", "heels", "eastern", "krissy", "mischief", "mopar", "ministry", "vienna", "weston", "wildone", "vodka", "jayson", "bigbooty", "beavis1", "betsy", "xxxxxx1", "yogibear", "000001", "0815", "zulu", "420000", "september", "sigmar", "sprout", "stalin", "peggy", "patch", "lkjhgfds", "lagnaf", "rolex", "redfox", "referee", "123123123", "1231", "angus1", "ariana", "ballin", "attila", "hall", "greedy", "grunt", "747474", "carpedie", "cecile", "caramel", "foxylady", "field", "gatorade", "gidget", "futbol", "frosch", "saiyan", "schmidt", "drums", "donner", "doggy1", "drum", "doudou", "pack", "pain", "nutmeg", "quebec", "valdepen", "trash", "triple", "tosser", "tuscl", "track", "comfort", "choke", "comein", "cola", "deputy", "deadpool", "bremen", "borders", "bronson", "break", "hotass", "hotmail1", "eskimo", "eggman", "koko", "kieran", "katrin", "kordell1", "komodo", "mone", "munich", "vvvvvvvv", "winger", "jaeger", "ivan", "jackson5", "2222222", "bergkamp", "bennie", "bigben", "zanzibar", "worm", "xxx123", "sunny1", "373737", "services", "sheridan", "slater", "slayer1", "snoop", "stacie", "peachy", "thecure", "times", "little1", "jennaj", "marquis", "middle", "rasta69", "1114", "aries", "havana", "gratis", "calgary", "checkers", "flanker", "salope", "dirty1", "draco", "dogface", "luv2epus", "rainbow6", "qwerty123", "umpire", "turnip", "vbnm", "tucson", "troll", "aileen", "codered", "commande", "damon", "nana", "neon", "nico", "nightwin", "neil", "boomer1", "bushido", "hotmail0", "horace", "enternow", "kaitlyn", "keepout", "karen1", "mindy", "mnbv", "viewsoni", "volcom", "wizards", "wine", "1995", "berkeley", "bite", "zach", "woodstoc", "tarpon", "shinobi", "starstar", "phat", "patience", "patrol", "toolbox", "julien", "johnny1", "joebob", "marble", "riders", "reflex", "120676", "1235", "angelus", "anthrax", "atlas", "hawks", "grandam", "harlem", "hawaii50", "gorgeous", "655321", "cabron", "challeng", "callisto", "firewall", "firefire", "fischer", "flyer", "flower1", "factory", "federal", "gambler", "frodo1", "funk", "sand", "sam123", "scania", "dingo", "papito", "passmast", "olive", "palermo", "ou8123", "lock", "ranch", "pride", "randy1", "twiggy", "travis1", "transfer", "treetop", "addict", "admin1", "963852", "aceace", "clarissa", "cliff", "cirrus", "clifton", "colin", "bobdole", "bonner", "bogus", "bonjovi", "bootsy", "boater", "elway7", "edison", "kelvin", "kenny1", "moonshin", "montag", "moreno", "wayne1", "white1", "jazzy", "jakejake", "1994", "1991", "2828", "blunt", "bluejays", "beau", "belmont", "worthy", "systems", "sensei", "southpark", "stan", "peeper", "pharao", "pigpen", "tomahawk", "teensex", "leedsutd", "larkin", "jermaine", "jeepster", "jimjim", "josephin", "melons", "marlon", "matthias", "marriage", "robocop", "1003", "1027", "antelope", "azsxdc", "gordo", "hazard", "granada", "8989", "7894", "ceasar", "cabernet", "cheshire", "california", "chelle", "candy1", "fergie", "fanny", "fidelio", "giorgio", "fuckhead", "ruth", "sanford", "diego", "dominion", "devon", "panic", "longer", "mackie", "qawsed", "trucking", "twelve", "chloe1", "coral", "daddyo", "nostromo", "boyboy", "booster", "bucky", "honolulu", "esquire", "dynamite", "motor", "mollydog", "wilder", "windows1", "waffle", "wallet", "warning", "virus", "washburn", "wealth", "vincent1", "jabber", "jaguars", "javelin", "irishman", "idefix", "bigdog1", "blue42", "blanked", "blue32", "biteme1", "bearcats", "blaine", "yessir", "sylveste", "team", "stephan", "sunfire", "tbird", "stryker", "3ip76k2", "sevens", "sheldon", "pilgrim", "tenchi", "titman", "leeds", "lithium", "lander", "linkin", "landon", "marijuan", "mariner", "markie", "midnite", "reddwarf", "1129", "123asd", "12312312", "allstar", "albany", "asdf12", "antonia", "aspen", "hardball", "goldfing", "7734", "49ers", "carlo", "chambers", "cable", "carnage", "callum", "carlos1", "fitter", "fandango", "festival", "flame", "gofast", "gamma", "fucmy69", "scrapper", "dogwood", "django", "magneto", "loose", "premium", "addison", "9999999", "abc1234", "cromwell", "newyear", "nichole", "bookie", "burns", "bounty", "brown1", "bologna", "earl", "entrance", "elway", "killjoy", "kerry", "keenan", "kick", "klondike", "mini", "mouser", "mohammed", "wayer", "impreza", "irene", "insomnia", "24682468", "2580", "24242424", "billbill", "bellaco", "blessing", "blues1", "bedford", "blanco", "blunts", "stinks", "teaser", "streets", "sf49ers", "shovel", "solitude", "spikey", "sonia", "pimpdadd", "timeout", "toffee", "lefty", "johndoe", "johndeer", "mega", "manolo", "mentor", "margie", "ratman", "ridge", "record", "rhodes", "robin1", "1124", "1210", "1028", "1226", "another", "babylove", "barbados", "harbor", "gramma", "646464", "carpente", "chaos1", "fishbone", "fireblad", "glasgow", "frogs", "scissors", "screamer", "salem", "scuba1", "ducks", "driven", "doggies", "dicky", "donovan", "obsidian", "rams", "progress", "tottenham", "aikman", "comanche", "corolla", "clarke", "conway", "cumslut", "cyborg", "dancing", "boston1", "bong", "houdini", "helmut", "elvisp", "edge", "keksa12", "misha", "monty1", "monsters", "wetter", "watford", "wiseguy", "veronika", "visitor", "janelle", "1989", "1987", "20202020", "biatch", "beezer", "bigguns", "blueball", "bitchy", "wyoming", "yankees2", "wrestler", "stupid1", "sealteam", "sidekick", "simple1", "smackdow", "sporting", "spiral", "smeller", "sperm", "plato", "tophat", "test2", "theatre", "thick", "toomuch", "leigh", "jello", "jewish", "junkie", "maxim", "maxime", "meadow", "remingto", "roofer", "124038", "1018", "1269", "1227", "123457", "arkansas", "alberta", "aramis", "andersen", "beaker", "barcelona", "baltimor", "googoo", "goochi", "852456", "4711", "catcher", "carman", "champ1", "chess", "fortress", "fishfish", "firefigh", "geezer", "rsalinas", "samuel1", "saigon", "scooby1", "doors", "dick1", "devin", "doom", "dirk", "doris", "dontknow", "load", "magpies", "manfred", "raleigh", "vader1", "universa", "tulips", "defense", "mygirl", "burn", "bowtie", "bowman", "holycow", "heinrich", "honeys", "enforcer", "katherine", "minerva", "wheeler", "witch", "waterboy", "jaime", "irving", "1992", "23skidoo", "bimbo", "blue11", "birddog", "woodman", "womble", "zildjian", "030303", "stinker", "stoppedby", "sexybabe", "speakers", "slugger", "spotty", "smoke1", "polopolo", "perfect1", "things", "torpedo", "tender", "thrasher", "lakeside", "lilith", "jimmys", "jerk", "junior1", "marsh", "masamune", "rice", "root", "1214", "april1", "allgood", "bambi", "grinch", "767676", "5252", "cherries", "chipmunk", "cezer121", "carnival", "capecod", "finder", "flint", "fearless", "goats", "funstuff", "gideon", "savior", "seabee", "sandro", "schalke", "salasana", "disney1", "duckman", "options", "pancake", "pantera1", "malice", "lookin", "love123", "lloyd", "qwert123", "puppet", "prayers", "union", "tracer", "crap", "creation", "cwoui", "nascar24", "hookers", "hollie", "hewitt", "estrella", "erection", "ernesto", "ericsson", "edthom", "kaylee", "kokoko", "kokomo", "kimball", "morales", "mooses", "monk", "walton", "weekend", "inter", "internal", "1michael", "1993", "19781978", "25252525", "worker", "summers", "surgery", "shibby", "shamus", "skibum", "sheepdog", "sex69", "spliff", "slipper", "spoons", "spanner", "snowbird", "slow", "toriamos", "temp123", "tennesse", "lakers1", "jomama", "julio", "mazdarx7", "rosario", "recon", "riddle", "room", "revolver", "1025", "1101", "barney1", "babycake", "baylor", "gotham", "gravity", "hallowee", "hancock", "616161", "515000", "caca", "cannabis", "castor", "chilli", "fdsa", "getout", "fuck69", "gators1", "sail", "sable", "rumble", "dolemite", "dork", "dickens", "duffer", "dodgers1", "painting", "onions", "logger", "lorena", "lookout", "magic32", "port", "poon", "prime", "twat", "coventry", "citroen", "christmas", "civicsi", "cocksucker", "coochie", "compaq1", "nancy1", "buzzer", "boulder", "butkus", "bungle", "hogtied", "honor", "hero", "hotgirls", "hilary", "heidi1", "eggplant", "mustang6", "mortal", "monkey12", "wapapapa", "wendy1", "volleyba", "vibrate", "vicky", "bledsoe", "blink", "birthday4", "woof", "xxxxx1", "talk", "stephen1", "suburban", "stock", "tabatha", "sheeba", "start1", "soccer10", "something", "starcraft", "soccer12", "peanut1", "plastics", "penthous", "peterbil", "tools", "tetsuo", "torino", "tennis1", "termite", "ladder", "last", "lemmein", "lakewood", "jughead", "melrose", "megane", "reginald", "redone", "request", "angela1", "alive", "alissa", "goodgirl", "gonzo1", "golden1", "gotyoass", "656565", "626262", "capricor", "chains", "calvin1", "foolish", "fallon", "getmoney", "godfather", "gabber", "gilligan", "runaway", "salami", "dummy", "dungeon", "dudedude", "dumb", "dope", "opus", "paragon", "oxygen", "panhead", "pasadena", "opendoor", "odyssey", "magellan", "lottie", "printing", "pressure", "prince1", "trustme", "christa", "court", "davies", "neville", "nono", "bread", "buffet", "hound", "kajak", "killkill", "mona", "moto", "mildred", "winner1", "vixen", "whiteboy", "versace", "winona", "voyager1", "instant", "indy", "jackjack", "bigal", "beech", "biggun", "blake1", "blue99", "big1", "woods", "synergy", "success1", "336699", "sixty9", "shark1", "skin", "simba1", "sharpe", "sebring", "spongebo", "spunk", "springs", "sliver", "phialpha", "password9", "pizza1", "plane", "perkins", "pookey", "tickling", "lexingky", "lawman", "joe123", "jolly", "mike123", "romeo1", "redheads", "reserve", "apple123", "alanis", "ariane", "antony", "backbone", "aviation", "band", "hand", "green123", "haley", "carlitos", "byebye", "cartman1", "camden", "chewy", "camaross", "favorite6", "forumwp", "franks", "ginscoot", "fruity", "sabrina1", "devil666", "doughnut", "pantie", "oldone", "paintball", "lumina", "rainbow1", "prosper", "total", "true", "umbrella", "ajax", "951753", "achtung", "abc12345", "compact", "color", "corn", "complete", "christi", "closer", "corndog", "deerhunt", "darklord", "dank", "nimitz", "brandy1", "bowl", "breanna", "holidays", "hetfield", "holein1", "hillbill", "hugetits", "east", "evolutio", "kenobi", "whiplash", "waldo", "wg8e3wjf", "wing", "istanbul", "invis", "1996", "benton", "bigjohn", "bluebell", "beef", "beater", "benji", "bluejay", "xyzzy", "wrestling", "storage", "superior", "suckdick", "taichi", "stellar", "stephane", "shaker", "skirt", "seymour", "semper", "splurge", "squeak", "pearls", "playball", "pitch", "phyllis", "pooky", "piss", "tomas", "titfuck", "joemama", "johnny5", "marcello", "marjorie", "married", "maxi", "rhubarb", "rockwell", "ratboy", "reload", "rooney", "redd", "1029", "1030", "1220", "anchor", "bbking", "baritone", "gryphon", "gone", "57chevy", "494949", "celeron", "fishy", "gladiator", "fucker1", "roswell", "dougie", "downer", "dicker", "diva", "domingo", "donjuan", "nympho", "omar", "praise", "racers", "trick", "trauma", "truck1", "trample", "acer", "corwin", "cricket1", "clemente", "climax", "denmark", "cuervo", "notnow", "nittany", "neutron", "native", "bosco1", "buffa", "breaker", "hello2", "hydro", "estelle", "exchange", "explore", "kisskiss", "kittys", "kristian", "montecar", "modem", "mississi", "mooney", "weiner", "washington", "20012001", "bigdick1", "bibi", "benfica", "yahoo1", "striper", "tabasco", "supra", "383838", "456654", "seneca", "serious", "shuttle", "socks", "stanton", "penguin1", "pathfind", "testibil", "thethe", "listen", "lightning", "lighting", "jeter2", "marma", "mark1", "metoo", "republic", "rollin", "redleg", "redbone", "redskin", "rocco", "1245", "armand", "anthony7", "altoids", "andrews", "barley", "away", "asswipe", "bauhaus", "bbbbbb1", "gohome", "harrier", "golfpro", "goldeney", "818181", "6666666", "5000", "5rxypn", "cameron1", "calling", "checker", "calibra", "fields", "freefree", "faith1", "fist", "fdm7ed", "finally", "giraffe", "glasses", "giggles", "fringe", "gate", "georgie", "scamper", "rrpass1", "screwyou", "duffy", "deville", "dimples", "pacino", "ontario", "passthie", "oberon", "quest1", "postov1000", "puppydog", "puffer", "raining", "protect", "qwerty7", "trey", "tribe", "ulysses", "tribal", "adam25", "a1234567", "compton", "collie", "cleopatr", "contract", "davide", "norris", "namaste", "myrtle", "buffalo1", "bonovox", "buckley", "bukkake", "burning", "burner", "bordeaux", "burly", "hun999", "emilie", "elmo", "enters", "enrique", "keisha", "mohawk", "willard", "vgirl", "whale", "vince", "jayden", "jarrett", "1812", "1943", "222333", "bigjim", "bigd", "zoom", "wordup", "ziggy1", "yahooo", "workout", "young1", "written", "xmas", "zzzzzz1", "surfer1", "strife", "sunlight", "tasha1", "skunk", "shauna", "seth", "soft", "sprinter", "peaches1", "planes", "pinetree", "plum", "pimping", "theforce", "thedon", "toocool", "leeann", "laddie", "list", "lkjh", "lara", "joke", "jupiter1", "mckenzie", "matty", "rene", "redrose", "1200", "102938", "annmarie", "alexa", "antares", "austin31", "ground", "goose1", "737373", "78945612", "789987", "6464", "calimero", "caster", "casper1", "cement", "chevrolet", "chessie", "caddy", "chill", "child", "canucks", "feeling", "favorite", "fellatio", "f00tball", "francine", "gateway2", "gigi", "gamecube", "giovanna", "rugby1", "scheisse", "dshade", "dudes", "dixie1", "owen", "offshore", "olympia", "lucas1", "macaroni", "manga", "pringles", "puff", "tribble", "trouble1", "ussy", "core", "clint", "coolhand", "colonial", "colt", "debra", "darthvad", "dealer", "cygnusx1", "natalie1", "newark", "husband", "hiking", "errors", "eighteen", "elcamino", "emmett", "emilia", "koolaid", "knight1", "murphy1", "volcano", "idunno", "2005", "2233", "block", "benito", "blueberr", "biguns", "yamahar1", "zapper", "zorro1", "0911", "3006", "sixsix", "shopper", "siobhan", "sextoy", "stafford", "snowboard", "speedway", "sounds", "pokey", "peabody", "playboy2", "titi", "think", "toast", "toonarmy", "lister", "lambda", "joecool", "jonas", "joyce", "juniper", "mercer", "max123", "manny", "massimo", "mariposa", "met2002", "reggae", "ricky1", "1236", "1228", "1016", "all4one", "arianna", "baberuth", "asgard", "gonzales", "484848", "5683", "6669", "catnip", "chiquita", "charisma", "capslock", "cashmone", "chat", "figure", "galant", "frenchy", "gizmodo1", "girlies", "gabby", "garner", "screwy", "doubled", "divers", "dte4uw", "done", "dragonfl", "maker", "locks", "rachelle", "treble", "twinkie", "trailer", "tropical", "acid", "crescent", "cooking", "cococo", "cory", "dabomb", "daffy", "dandfa", "cyrano", "nathanie", "briggs", "boners", "helium", "horton", "hoffman", "hellas", "espresso", "emperor", "killa", "kikimora", "wanda", "w4g8at", "verona", "ilikeit", "iforget", "1944", "20002000", "birthday1", "beatles1", "blue1", "bigdicks", "beethove", "blacklab", "blazers", "benny1", "woodwork", "0069", "0101", "taffy", "susie", "survivor", "swim", "stokes", "4567", "shodan", "spoiled", "steffen", "pissed", "pavlov", "pinnacle", "place", "petunia", "terrell", "thirty", "toni", "tito", "teenie", "lemonade", "lily", "lillie", "lalakers", "lebowski", "lalalala", "ladyboy", "jeeper", "joyjoy", "mercury1", "mantle", "mannn", "rocknrol", "riversid", "reeves", "123aaa", "11112222", "121314", "1021", "1004", "1120", "allen1", "ambers", "amstel", "ambrose", "alice1", "alleycat", "allegro", "ambrosia", "alley", "australia", "hatred", "gspot", "graves", "goodsex", "hattrick", "harpoon", "878787", "8inches", "4wwvte", "cassandr", "charlie123", "case", "chavez", "fighting", "gabriela", "gatsby", "fudge", "gerry", "generic", "gareth", "fuckme2", "samm", "sage", "seadog", "satchmo", "scxakv", "santafe", "dipper", "dingle", "dizzy", "outoutout", "madmad", "london1", "qbg26i", "pussy123", "randolph", "vaughn", "tzpvaw", "vamp", "comedy", "comp", "cowgirl", "coldplay", "dawgs", "delaney", "nt5d27", "novifarm", "needles", "notredam", "newness", "mykids", "bryan1", "bouncer", "hihihi", "honeybee", "iceman1", "herring", "horn", "hook", "hotlips", "dynamo", "klaus", "kittie", "kappa", "kahlua", "muffy", "mizzou", "mohamed", "musical", "wannabe", "wednesda", "whatup", "weller", "waterfal", "willy1", "invest", "blanche", "bear1", "billabon", "youknow", "zelda", "yyyyyy1", "zachary1", "01234567", "070462", "zurich", "superstar", "storms", "tail", "stiletto", "strat", "427900", "sigmachi", "shelter", "shells", "sexy123", "smile1", "sophie1", "stefano", "stayout", "somerset", "smithers", "playmate", "pinkfloyd", "phish1", "payday", "thebear", "telefon", "laetitia", "kswbdu", "larson", "jetta", "jerky", "melina", "metro", "revoluti", "retire", "respect", "1216", "1201", "1204", "1222", "1115", "archange", "barry1", "handball", "676767", "chandra", "chewbacc", "flesh", "furball", "gocubs", "fruit", "fullback", "gman", "gentle", "dunbar", "dewalt", "dominiqu", "diver1", "dhip6a", "olemiss", "ollie", "mandrake", "mangos", "pretzel", "pusssy", "tripleh", "valdez", "vagabond", "clean", "comment", "crew", "clovis", "deaths", "dandan", "csfbr5yy", "deadspin", "darrel", "ninguna", "noah", "ncc74656", "bootsie", "bp2002", "bourbon", "brennan", "bumble", "books", "hose", "heyyou", "houston1", "hemlock", "hippo", "hornets", "hurricane", "horseman", "hogan", "excess", "extensa", "muffin1", "virginie", "werdna", "idontknow", "info", "iron", "jack1", "1bitch", "151nxjmt", "bendover", "bmwbmw", "bills", "zaq123", "wxcvbn", "surprise", "supernov", "tahoe", "talbot", "simona", "shakur", "sexyone", "seviyi", "sonja", "smart1", "speed1", "pepito", "phantom1", "playoffs", "terry1", "terrier", "laser1", "lite", "lancia", "johngalt", "jenjen", "jolene", "midori", "message", "maserati", "matteo", "mental", "miami1", "riffraff", "ronald1", "reason", "rhythm", "1218", "1026", "123987", "1015", "1103", "armada", "architec", "austria", "gotmilk", "hawkins", "gray", "camila", "camp", "cambridg", "charge", "camero", "flex", "foreplay", "getoff", "glacier", "glotest", "froggie", "gerbil", "rugger", "sanity72", "salesman", "donna1", "dreaming", "deutsch", "orchard", "oyster", "palmtree", "ophelia", "pajero", "m5wkqf", "magenta", "luckyone", "treefrog", "vantage", "usmarine", "tyvugq", "uptown", "abacab", "aaaaaa1", "advance", "chuck1", "delmar", "darkange", "cyclones", "nate", "navajo", "nope", "border", "bubba123", "building", "iawgk2", "hrfzlz", "dylan1", "enrico", "encore", "emilio", "eclipse1", "killian", "kayleigh", "mutant", "mizuno", "mustang2", "video1", "viewer", "weed420", "whales", "jaguar1", "insight", "1990", "159159", "1love", "bliss", "bears1", "bigtruck", "binder", "bigboss", "blitz", "xqgann", "yeahyeah", "zeke", "zardoz", "stickman", "table", "3825", "signal", "sentra", "side", "shiva", "skipper1", "singapor", "southpaw", "sonora", "squid", "slamdunk", "slimjim", "placid", "photon", "placebo", "pearl1", "test12", "therock1", "tiger123", "leinad", "legman", "jeepers", "joeblow", "mccarthy", "mike23", "redcar", "rhinos", "rjw7x4", "1102", "13576479", "112211", "alcohol", "gwju3g", "greywolf", "7bgiqk", "7878", "535353", "4snz9g", "candyass", "cccccc1", "carola", "catfight", "cali", "fister", "fosters", "finland", "frankie1", "gizzmo", "fuller", "royalty", "rugrat", "sandie", "rudolf", "dooley", "dive", "doreen", "dodo", "drop", "oemdlg", "out3xf", "paddy", "opennow", "puppy1", "qazwsxedc", "pregnant", "quinn", "ramjet", "under", "uncle", "abraxas", "corner", "creed", "cocoa", "crown", "cows", "cn42qj", "dancer1", "death666", "damned", "nudity", "negative", "nimda2k", "buick", "bobb", "braves1", "brook", "henrik", "higher", "hooligan", "dust", "everlast", "karachi", "mortis", "mulligan", "monies", "motocros", "wally1", "weapon", "waterman", "view", "willie1", "vicki", "inspiron", "1test", "2929", "bigblack", "xytfu7", "yackwin", "zaq1xsw2", "yy5rbfsc", "100100", "0660", "tahiti", "takehana", "talks", "332211", "3535", "sedona", "seawolf", "skydiver", "shine", "spleen", "slash", "spjfet", "special1", "spooner", "slimshad", "sopranos", "spock1", "penis1", "patches1", "terri", "thierry", "thething", "toohot", "large", "limpone", "johnnie", "mash4077", "matchbox", "masterp", "maxdog", "ribbit", "reed", "rita", "rockin", "redhat", "rising", "1113", "14789632", "1331", "allday", "aladin", "andrey", "amethyst", "ariel", "anytime", "baseball1", "athome", "basil", "goofy1", "greenman", "gustavo", "goofball", "ha8fyp", "goodday", "778899", "charon", "chappy", "castillo", "caracas", "cardiff", "capitals", "canada1", "cajun", "catter", "freddy1", "favorite2", "frazier", "forme", "follow", "forsaken", "feelgood", "gavin", "gfxqx686", "garlic", "sarge", "saskia", "sanjose", "russ", "salsa", "dilbert1", "dukeduke", "downhill", "longhair", "loop", "locutus", "lockdown", "malachi", "mamacita", "lolipop", "rainyday", "pumpkin1", "punker", "prospect", "rambo1", "rainbows", "quake", "twin", "trinity1", "trooper1", "aimee", "citation", "coolcat", "crappy", "default", "dental", "deniro", "d9ungl", "daddys", "napoli", "nautica", "nermal", "bukowski", "brick", "bubbles1", "bogota", "board", "branch", "breath", "buds", "hulk", "humphrey", "hitachi", "evans", "ender", "export", "kikiki", "kcchiefs", "kram", "morticia", "montrose", "mongo", "waqw3p", "wizzard", "visited", "whdbtp", "whkzyc", "image", "154ugeiu", "1fuck", "binky", "blind", "bigred1", "blubber", "benz", "becky1", "year2005", "wonderfu", "wooden", "xrated", "0001", "tampabay", "survey", "tammy1", "stuffer", "3mpz4r", "3000", "3some", "selina", "sierra1", "shampoo", "silk", "shyshy", "slapnuts", "standby", "spartan1", "sprocket", "sometime", "stanley1", "poker1", "plus", "thought", "theshit", "torture", "thinking", "lavalamp", "light1", "laserjet", "jediknig", "jjjjj1", "jocelyn", "mazda626", "menthol", "maximo", "margaux", "medic1", "release", "richter", "rhino1", "roach", "renate", "repair", "reveal", "1209", "1234321", "amigos", "apricot", "alexandra", "asdfgh1", "hairball", "hatter", "graduate", "grimace", "7xm5rq", "6789", "cartoons", "capcom", "cheesy", "cashflow", "carrots", "camping", "fanatic", "fool", "format", "fleming", "girlie", "glover", "gilmore", "gardner", "safeway", "ruthie", "dogfart", "dondon", "diapers", "outsider", "odin", "opiate", "lollol", "love12", "loomis", "mallrats", "prague", "primetime21", "pugsley", "program", "r29hqq", "touch", "valleywa", "airman", "abcdefg1", "darkone", "cummer", "dempsey", "damn", "nadia", "natedogg", "nineball", "ndeyl5", "natchez", "newone", "normandy", "nicetits", "buddy123", "buddys", "homely", "husky", "iceland", "hr3ytm", "highlife", "holla", "earthlin", "exeter", "eatmenow", "kimkim", "karine", "k2trix", "kernel", "kirkland", "money123", "moonman", "miles1", "mufasa", "mousey", "wilma", "wilhelm", "whites", "warhamme", "instinct", "jackass1", "2277", "20spanks", "blobby", "blair", "blinky", "bikers", "blackjack", "becca", "blue23", "xman", "wyvern", "085tzzqi", "zxzxzx", "zsmj2v", "suede", "t26gn4", "sugars", "sylvie", "tantra", "swoosh", "swiss", "4226", "4271", "321123", "383pdjvl", "shoe", "shane1", "shelby1", "spades", "spain", "smother", "soup", "sparhawk", "pisser", "photo1", "pebble", "phones", "peavey", "picnic", "pavement", "terra", "thistle", "tokyo", "therapy", "lives", "linden", "kronos", "lilbit", "linux", "johnston", "material", "melanie1", "marbles", "redlight", "reno", "recall", "1208", "1138", "1008", "alchemy", "aolsucks", "alexalex", "atticus", "auditt", "ballet", "b929ezzh", "goodyear", "hanna", "griffith", "gubber", "863abgsg", "7474", "797979", "464646", "543210", "4zqauf", "4949", "ch5nmk", "carlito", "chewey", "carebear", "caleb", "checkmat", "cheddar", "chachi", "fever", "forgetit", "fine", "forlife", "giants1", "gates", "getit", "gamble", "gerhard", "galileo", "g3ujwg", "ganja", "rufus1", "rushmore", "scouts", "discus", "dudeman", "olympus", "oscars", "osprey", "madcow", "locust", "loyola", "mammoth", "proton", "rabbit1", "question", "ptfe3xxp", "pwxd5x", "purple1", "punkass", "prophecy", "uyxnyd", "tyson1", "aircraft", "access99", "abcabc", "cocktail", "colts", "civilwar", "cleveland", "claudia1", "contour", "clement", "dddddd1", "cypher", "denied", "dapzu455", "dagmar", "daisydog", "name", "noles", "butters", "buford", "hoochie", "hotel", "hoser", "eddy", "ellis", "eldiablo", "kingrich", "mudvayne", "motown", "mp8o6d", "wife", "vipergts", "italiano", "innocent", "2055", "2211", "beavers", "bloke", "blade1", "yamato", "zooropa", "yqlgr667", "050505", "zxcvbnm1", "zw6syj", "suckcock", "tango1", "swing", "stern", "stephens", "swampy", "susanna", "tammie", "445566", "333666", "380zliki", "sexpot", "sexylady", "sixtynin", "sickboy", "spiffy", "sleeping", "skylark", "sparkles", "slam", "pintail", "phreak", "places", "teller", "timtim", "tires", "thighs", "left", "latex", "llamas", "letsdoit", "lkjhg", "landmark", "letters", "lizzard", "marlins", "marauder", "metal1", "manu", "register", "righton", "1127", "alain", "alcat", "amigo", "basebal1", "azertyui", "attract", "azrael", "hamper", "gotenks", "golfgti", "gutter", "hawkwind", "h2slca", "harman", "grace1", "6chid8", "789654", "canine", "casio", "cazzo", "chamber", "cbr900", "cabrio", "calypso", "capetown", "feline", "flathead", "fisherma", "flipmode", "fungus", "goal", "g9zns4", "full", "giggle", "gabriel1", "fuck123", "saffron", "dogmeat", "dreamcas", "dirtydog", "dunlop", "douche", "dresden", "dickdick", "destiny1", "pappy", "oaktree", "lydia", "luft4", "puta", "prayer", "ramada", "trumpet1", "vcradq", "tulip", "tracy71", "tycoon", "aaaaaaa1", "conquest", "click", "chitown", "corps", "creepers", "constant", "couples", "code", "cornhole", "danman", "dada", "density", "d9ebk7", "cummins", "darth", "cute", "nash", "nirvana1", "nixon", "norbert", "nestle", "brenda1", "bonanza", "bundy", "buddies", "hotspur", "heavy", "horror", "hufmqw", "electro", "erasure", "enough", "elisabet", "etvww4", "ewyuza", "eric1", "kinder", "kenken", "kismet", "klaatu", "musician", "milamber", "willi", "waiting", "isacs155", "igor", "1million", "1letmein", "x35v8l", "yogi", "ywvxpz", "xngwoj", "zippy1", "020202", "****", "stonewal", "sweeney", "story", "sentry", "sexsexsex", "spence", "sonysony", "smirnoff", "star12", "solace", "sledge", "states", "snyder", "star1", "paxton", "pentagon", "pkxe62", "pilot1", "pommes", "paulpaul", "plants", "tical", "tictac", "toes", "lighthou", "lemans", "kubrick", "letmein22", "letmesee", "jys6wz", "jonesy", "jjjjjj1", "jigga", "joelle", "mate", "merchant", "redstorm", "riley1", "rosa", "relief", "14141414", "1126", "allison1", "badboy1", "asthma", "auggie", "basement", "hartley", "hartford", "hardwood", "gumbo", "616913", "57np39", "56qhxs", "4mnveh", "cake", "forbes", "fatluvr69", "fqkw5m", "fidelity", "feathers", "fresno", "godiva", "gecko", "gladys", "gibson1", "gogators", "fridge", "general1", "saxman", "rowing", "sammys", "scotts", "scout1", "sasasa", "samoht", "dragon69", "ducky", "dragonball", "driller", "p3wqaw", "nurse", "papillon", "oneone", "openit", "optimist", "longshot", "portia", "rapier", "pussy2", "ralphie", "tuxedo", "ulrike", "undertow", "trenton", "copenhag", "come", "delldell", "culinary", "deltas", "mytime", "nicky", "nickie", "noname", "noles1", "bucker", "bopper", "bullock", "burnout", "bryce", "hedges", "ibilltes", "hihje863", "hitter", "ekim", "espana", "eatme69", "elpaso", "envelope", "express1", "eeeeee1", "eatme1", "karaoke", "kara", "mustang5", "misses", "wellingt", "willem", "waterski", "webcam", "jasons", "infinite", "iloveyou!", "jakarta", "belair", "bigdad", "beerme", "yoshi", "yinyang", "zimmer", "x24ik3", "063dyjuy", "0000007", "ztmfcq", "stopit", "stooges", "survival", "stockton", "symow8", "strato", "2hot4u", "ship", "simons", "skins", "shakes", "sex1", "shield", "snacks", "softtail", "slimed123", "pizzaman", "pipe", "pitt", "pathetic", "pinto", "tigercat", "tonton", "lager", "lizzy", "juju", "john123", "jennings", "josiah", "jesse1", "jordon", "jingles", "martian", "mario1", "rootedit", "rochard", "redwine", "requiem", "riverrat", "rats", "1117", "1014", "1205", "althea", "allie", "amor", "amiga", "alpina", "alert", "atreides", "banana1", "bahamut", "hart", "golfman", "happines", "7uftyx", "5432", "5353", "5151", "4747", "byron", "chatham", "chadwick", "cherie", "foxfire", "ffvdj474", "freaked", "foreskin", "gayboy", "gggggg1", "glenda", "gameover", "glitter", "funny1", "scoobydoo", "scroll", "rudolph", "saddle", "saxophon", "dingbat", "digimon", "omicron", "parsons", "ohio", "panda1", "loloxx", "macintos", "lululu", "lollypop", "racer1", "queen1", "qwertzui", "prick", "upnfmc", "tyrant", "trout1", "9skw5g", "aceman", "adelaide", "acls2h", "aaabbb", "acapulco", "aggie", "comcast", "craft", "crissy", "cloudy", "cq2kph", "custer", "d6o8pm", "cybersex", "davecole", "darian", "crumbs", "daisey", "davedave", "dasani", "needle", "mzepab", "myporn", "narnia", "nineteen", "booger1", "bravo1", "budgie", "btnjey", "highlander", "hotel6", "humbug", "edwin", "ewtosi", "kristin1", "kobe", "knuckles", "keith1", "katarina", "muff", "muschi", "montana1", "wingchun", "wiggle", "whatthe", "walking", "watching", "vette1", "vols", "virago", "intj3a", "ishmael", "intern", "jachin", "illmatic", "199999", "2010", "beck", "blender", "bigpenis", "bengal", "blue1234", "your", "zaqxsw", "xray", "xxxxxxx1", "zebras", "yanks", "worlds", "tadpole", "stripes", "svetlana", "3737", "4343", "3728", "4444444", "368ejhih", "solar", "sonne", "smalls", "sniffer", "sonata", "squirts", "pitcher", "playstation", "pktmxr", "pescator", "points", "texaco", "lesbos", "lilian", "l8v53x", "jo9k2jw2", "jimbeam", "josie", "jimi", "jupiter2", "jurassic", "marines1", "maya", "rocket1", "ringer", "14725836", "12345679", "1219", "123098", "1233", "alessand", "althor", "angelika", "arch", "armando", "alpha123", "basher", "barefeet", "balboa", "bbbbb1", "banks", "badabing", "harriet", "gopack", "golfnut", "gsxr1000", "gregory1", "766rglqy", "8520", "753159", "8dihc6", "69camaro", "666777", "cheeba", "chino", "calendar", "cheeky", "camel1", "fishcake", "falling", "flubber", "giuseppe", "gianni", "gloves", "gnasher23", "frisbee", "fuzzy1", "fuzzball", "sauce", "save13tx", "schatz", "russell1", "sandra1", "scrotum", "scumbag", "sabre", "samdog", "dripping", "dragon12", "dragster", "paige", "orwell", "mainland", "lunatic", "lonnie", "lotion", "maine", "maddux", "qn632o", "poophead", "rapper", "porn4life", "producer", "rapunzel", "tracks", "velocity", "vanessa1", "ulrich", "trueblue", "vampire1", "abacus", "902100", "crispy", "corky", "crane", "chooch", "d6wnro", "cutie", "deal", "dabulls", "dehpye", "navyseal", "njqcw4", "nownow", "nigger1", "nightowl", "nonenone", "nightmar", "bustle", "buddy2", "boingo", "bugman", "bulletin", "bosshog", "bowie", "hybrid", "hillside", "hilltop", "hotlegs", "honesty", "hzze929b", "hhhhh1", "hellohel", "eloise", "evilone", "edgewise", "e5pftu", "eded", "embalmer", "excalibur", "elefant", "kenzie", "karl", "karin", "killah", "kleenex", "mouses", "mounta1n", "motors", "mutley", "muffdive", "vivitron", "winfield", "wednesday", "w00t88", "iloveit", "jarjar", "incest", "indycar", "17171717", "1664", "17011701", "222777", "2663", "beelch", "benben", "yitbos", "yyyyy1", "yasmin", "zapata", "zzzzz1", "stooge", "tangerin", "taztaz", "stewart1", "summer69", "sweetness", "system1", "surveyor", "stirling", "3qvqod", "3way", "456321", "sizzle", "simhrq", "shrink", "shawnee", "someday", "sparty", "ssptx452", "sphere", "spark", "slammed", "sober", "persian", "peppers", "ploppy", "pn5jvw", "poobear", "pianos", "plaster", "testme", "tiff", "thriller", "larissa", "lennox", "jewell", "master12", "messier", "rockey", "1229", "1217", "1478", "1009", "anastasi", "almighty", "amonra", "aragon", "argentin", "albino", "azazel", "grinder", "6uldv8", "83y6pv", "8888888", "4tlved", "515051", "carsten", "changes", "flanders", "flyers88", "ffffff1", "firehawk", "foreman", "firedog", "flashman", "ggggg1", "gerber", "godspeed", "galway", "giveitup", "funtimes", "gohan", "giveme", "geryfe", "frenchie", "sayang", "rudeboy", "savanna", "sandals", "devine", "dougal", "drag0n", "dga9la", "disaster", "desktop", "only", "onlyone", "otter", "pandas", "mafia", "lombard", "luckys", "lovejoy", "lovelife", "manders", "product", "qqh92r", "qcmfd454", "pork", "radar1", "punani", "ptbdhw", "turtles", "undertaker", "trs8f7", "tramp", "ugejvp", "abba", "911turbo", "acdc", "abcd123", "clever", "corina", "cristian", "create", "crash1", "colony", "crosby", "delboy", "daniele", "davinci", "daughter", "notebook", "niki", "nitrox", "borabora", "bonzai", "budd", "brisbane", "hotter", "heeled", "heroes", "hooyah", "hotgirl", "i62gbq", "horse1", "hills", "hpk2qc", "epvjb6", "echo", "korean", "kristie", "mnbvc", "mohammad", "mind", "mommy1", "munster", "wade", "wiccan", "wanted", "jacket", "2369", "bettyboo", "blondy", "bismark", "beanbag", "bjhgfi", "blackice", "yvtte545", "ynot", "yess", "zlzfrh", "wolvie", "007bond", "******", "tailgate", "tanya1", "sxhq65", "stinky1", "3234412", "3ki42x", "seville", "shimmer", "sheryl", "sienna", "shitshit", "skillet", "seaman", "sooners1", "solaris", "smartass", "pastor", "pasta", "pedros", "pennywis", "pfloyd", "tobydog", "thetruth", "lethal", "letme1n", "leland", "jenifer", "mario66", "micky", "rocky2", "rewq", "ripped", "reindeer", "1128", "1207", "1104", "1432", "aprilia", "allstate", "alyson", "bagels", "basic", "baggies", "barb", "barrage", "greatest", "gomez", "guru", "guard", "72d5tn", "606060", "4wcqjn", "caldwell", "chance1", "catalog", "faust", "film", "flange", "fran", "fartman", "geil", "gbhcf2", "fussball", "glen", "fuaqz4", "gameboy", "garnet", "geneviev", "rotary", "seahawk", "russel", "saab", "seal", "samadams", "devlt4", "ditto", "drevil", "drinker", "deuce", "dipstick", "donut", "octopus", "ottawa", "losangel", "loverman", "porky", "q9umoz", "rapture", "pump", "pussy4me", "university", "triplex", "ue8fpw", "trent", "trophy", "turbos", "troubles", "agent", "aaa340", "churchil", "crazyman", "consult", "creepy", "craven", "class", "cutiepie", "ddddd1", "dejavu", "cuxldv", "nettie", "nbvibt", "nikon", "niko", "norwood", "nascar1", "nolan", "bubba2", "boobear", "boogers", "buff", "bullwink", "bully", "bulldawg", "horsemen", "escalade", "editor", "eagle2", "dynamic", "ella", "efyreg", "edition", "kidney", "minnesot", "mogwai", "morrow", "msnxbi", "moonlight", "mwq6qlzo", "wars", "werder", "verygood", "voodoo1", "wheel", "iiiiii1", "159951", "1624", "1911a1", "2244", "bellagio", "bedlam", "belkin", "bill1", "woodrow", "xirt2k", "worship", "??????", "tanaka", "swift", "susieq", "sundown", "sukebe", "tales", "swifty", "2fast4u", "senate", "sexe", "sickness", "shroom", "shaun", "seaweed", "skeeter1", "status", "snicker", "sorrow", "spanky1", "spook", "patti", "phaedrus", "pilots", "pinch", "peddler", "theo", "thumper1", "tessie", "tiger7", "tmjxn151", "thematri", "l2g7k3", "letmeinn", "lazy", "jeffjeff", "joan", "johnmish", "mantra", "mariana", "mike69", "marshal", "mart", "mazda6", "riptide", "robots", "rental", "1107", "1130", "142857", "11001001", "1134", "armored", "alvin", "alec", "allnight", "alright", "amatuers", "bartok", "attorney", "astral", "baboon", "bahamas", "balls1", "bassoon", "hcleeb", "happyman", "granite", "graywolf", "golf1", "gomets", "8vjzus", "7890", "789123", "8uiazp", "5757", "474jdvff", "551scasi", "50cent", "camaro1", "cherry1", "chemist", "final", "firenze", "fishtank", "farrell", "freewill", "glendale", "frogfrog", "gerhardt", "ganesh", "same", "scirocco", "devilman", "doodles", "dinger", "okinawa", "olympic", "nursing", "orpheus", "ohmygod", "paisley", "pallmall", "null", "lounge", "lunchbox", "manhatta", "mahalo", "mandarin", "qwqwqw", "qguvyt", "pxx3eftp", "president", "rambler", "puzzle", "poppy1", "turk182", "trotter", "vdlxuc", "trish", "tugboat", "valiant", "tracie", "uwrl7c", "chris123", "coaster", "cmfnpu", "decimal", "debbie1", "dandy", "daedalus", "dede", "natasha1", "nissan1", "nancy123", "nevermin", "napalm", "newcastle", "boats", "branden", "britt", "bonghit", "hester", "ibxnsm", "hhhhhh1", "holger", "durham", "edmonton", "erwin", "equinox", "dvader", "kimmy", "knulla", "mustafa", "monsoon", "mistral", "morgana", "monica1", "mojave", "month", "monterey", "mrbill", "vkaxcs", "victor1", "wacker", "wendell", "violator", "vfdhif", "wilson1", "wavpzt", "verena", "wildstar", "winter99", "iqzzt580", "jarrod", "imback", "1914", "19741974", "1monkey", "1q2w3e4r5t", "2500", "2255", "blank", "bigshow", "bigbucks", "blackcoc", "zoomer", "wtcacq", "wobble", "xmen", "xjznq5", "yesterda", "yhwnqc", "zzzxxx", "streak", "393939", "2fchbg", "skinhead", "skilled", "shakira", "shaft", "shadow12", "seaside", "sigrid", "sinful", "silicon", "smk7366", "snapshot", "sniper1", "soccer11", "staff", "slap", "smutty", "peepers", "pleasant", "plokij", "pdiddy", "pimpdaddy", "thrust", "terran", "topaz", "today1", "lionhear", "littlema", "lauren1", "lincoln1", "lgnu9d", "laughing", "juneau", "methos", "medina", "merlyn", "rogue1", "romulus", "redshift", "1202", "1469", "12locked", "arizona1", "alfarome", "al9agd", "aol123", "altec", "apollo1", "arse", "baker1", "bbb747", "bach", "axeman", "astro1", "hawthorn", "goodfell", "hawks1", "gstring", "hannes", "8543852", "868686", "4ng62t", "554uzpad", "5401", "567890", "5232", "catfood", "frame", "flow", "fire1", "flipflop", "fffff1", "fozzie", "fluff", "garrison", "fzappa", "furious", "round", "rustydog", "sandberg", "scarab", "satin", "ruger", "samsung1", "destin", "diablo2", "dreamer1", "detectiv", "dominick", "doqvq3", "drywall", "paladin1", "papabear", "offroad", "panasonic", "nyyankee", "luetdi", "qcfmtz", "pyf8ah", "puddles", "privacy", "rainer", "pussyeat", "ralph1", "princeto", "trivia", "trewq", "tri5a3", "advent", "9898", "agyvorc", "clarkie", "coach1", "courier", "contest", "christo", "corinna", "chowder", "concept", "climbing", "cyzkhw", "davidb", "dad2ownu", "days", "daredevi", "de7mdf", "nose", "necklace", "nazgul", "booboo1", "broad", "bonzo", "brenna", "boot", "butch1", "huskers1", "hgfdsa", "hornyman", "elmer", "elektra", "england1", "elodie", "kermit1", "knife", "kaboom", "minute", "modern", "motherfucker", "morten", "mocha", "monday1", "morgoth", "ward", "weewee", "weenie", "walters", "vorlon", "website", "wahoo", "ilovegod", "insider", "jayman", "1911", "1dallas", "1900", "1ranger", "201jedlz", "2501", "1qaz", "bertram", "bignuts", "bigbad", "beebee", "billows", "belize", "bebe", "wvj5np", "wu4etd", "yamaha1", "wrinkle5", "zebra1", "yankee1", "zoomzoom", "09876543", "0311", "?????", "stjabn", "tainted", "3tmnej", "shoot", "skooter", "skelter", "sixteen", "starlite", "smack", "spice1", "stacey1", "smithy", "perrin", "pollux", "peternorth", "pixie", "paulina", "piston", "pick", "poets", "pine", "toons", "tooth", "topspin", "kugm7b", "legends", "jeepjeep", "juliana", "joystick", "junkmail", "jojojojo", "jonboy", "judge", "midland", "meteor", "mccabe", "matter", "mayfair", "meeting", "merrill", "raul", "riches", "reznor", "rockrock", "reboot", "reject", "robyn", "renee1", "roadway", "rasta220", "1411", "1478963", "1019", "archery", "allman", "andyandy", "barks", "bagpuss", "auckland", "gooseman", "hazmat", "gucci", "guns", "grammy", "happydog", "greek", "7kbe9d", "7676", "6bjvpe", "5lyedn", "5858", "5291", "charlie2", "chas", "c7lrwu", "candys", "chateau", "ccccc1", "cardinals", "fear", "fihdfv", "fortune12", "gocats", "gaelic", "fwsadn", "godboy", "gldmeo", "fx3tuo", "fubar1", "garland", "generals", "gforce", "rxmtkp", "rulz", "sairam", "dunhill", "division", "dogggg", "detect", "details", "doll", "drinks", "ozlq6qwm", "ov3ajy", "lockout", "makayla", "macgyver", "mallorca", "loves", "prima", "pvjegu", "qhxbij", "raphael", "prelude1", "totoro", "tusymo", "trousers", "tunnel", "valeria", "tulane", "turtle1", "tracy1", "aerosmit", "abbey1", "address", "clticic", "clueless", "cooper1", "comets", "collect", "corbin", "delpiero", "derick", "cyprus", "dante1", "dave1", "nounours", "neal", "nexus6", "nero", "nogard", "norfolk", "brent1", "booyah", "bootleg", "buckaroo", "bulls23", "bulls1", "booper", "heretic", "icecube", "hellno", "hounds", "honeydew", "hooters1", "hoes", "howie", "hevnm4", "hugohugo", "eighty", "epson", "evangeli", "eeeee1", "eyphed"];

module.exports = CommonPasswords;

/***/ }),

/***/ 73:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var ClientBase = __webpack_require__(20);
var SocketCache = __webpack_require__(115);
var getLanguage = __webpack_require__(50).get;
var State = __webpack_require__(37).State;
var cloneObject = __webpack_require__(5).cloneObject;
var getPropertyValue = __webpack_require__(5).getPropertyValue;
var isEmptyObject = __webpack_require__(5).isEmptyObject;
var PromiseClass = __webpack_require__(5).PromiseClass;
var getAppId = __webpack_require__(81).getAppId;
var getSocketURL = __webpack_require__(81).getSocketURL;

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

module.exports = BinarySocketBase;

/***/ }),

/***/ 89:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var createElement = __webpack_require__(5).createElement;

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

/***/ 90:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Client = __webpack_require__(20);
var getLanguage = __webpack_require__(50).get;
var isMobile = __webpack_require__(521).isMobile;
var isStorageSupported = __webpack_require__(37).isStorageSupported;
var LocalStore = __webpack_require__(37).LocalStore;
var urlForCurrentDomain = __webpack_require__(113).urlForCurrentDomain;
var getAppId = __webpack_require__(81).getAppId;

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
        var signup_device = LocalStore.get('signup_device') || (isMobile() ? 'mobile' : 'desktop');
        var date_first_contact = LocalStore.get('date_first_contact');
        var marketing_queries = '&signup_device=' + signup_device + (date_first_contact ? '&date_first_contact=' + date_first_contact : '');

        return server_url && /qa/.test(server_url) ? 'https://www.' + server_url.split('.')[1] + '.com/oauth2/authorize?app_id=' + getAppId() + '&l=' + language + marketing_queries : urlForCurrentDomain('https://oauth.binary.com/oauth2/authorize?app_id=' + getAppId() + '&l=' + language + marketing_queries);
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

/***/ })

}]);
//# sourceMappingURL=binary_common.js.map