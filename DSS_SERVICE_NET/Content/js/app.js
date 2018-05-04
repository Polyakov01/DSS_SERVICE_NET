(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

try {
    screen.orientation.lock('portrait-primary'); // webkit only
} catch (error) {
    console.log(error);
}
var m = require('mithril');
window.Globals = require('./components/globals.js');
// var lang = require('./lang/lang.js')();
// window.t = lang.t;
var routes = require('./routes.js');
m.route.mode = "hash";
m.route(document.body, "/login", routes());

},{"./components/globals.js":2,"./routes.js":31,"mithril":32}],2:[function(require,module,exports){
'use strict';

var m = require('mithril');
var Helper = require('./helper.js');
module.exports = function () {
    var token = '';
    var auth = false;
    var currentLang = 'ru';
    var langList = [{ code: 'ru', name: 'Русский' }, { code: 'kz', name: 'Казакша' }];
    var coordinates = { latitude: 0, longitude: 0 };
    var _user = {
        "USE_CODE": 192
    };

    function setDatePickerDefaults() {
        $.fn.datepicker.dates['en'] = {
            days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
            daysShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
            daysMin: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
            months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
            monthsShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
            today: "Today",
            clear: "Clear",
            format: "dd-mm-yyyy",
            titleFormat: "MM yyyy", /* Leverages same syntax as 'format' */
            weekStart: 1
        };

        $.fn.datepicker.dates['ru'] = {
            days: ["Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"],
            daysShort: ["Вск", "Пнд", "Втр", "Срд", "Чтв", "Птн", "Суб"],
            daysMin: ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"],
            months: ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"],
            monthsShort: ["Янв", "Фев", "Мар", "Апр", "Май", "Июн", "Июл", "Авг", "Сен", "Окт", "Ноя", "Дек"],
            today: "Сегодня",
            clear: "Очистить",
            format: "dd.mm.yyyy",
            weekStart: 1,
            monthsTitle: 'Месяцы'
        };
    }

    return {
        setDatePickerDefaults: setDatePickerDefaults,
        setToken: function setToken(key) {
            token = key;
        },
        getToken: function getToken() {
            return token;
        },
        getLang: function getLang() {
            return currentLang;
        },
        setLang: function setLang(lang) {
            currentLang = lang;
        },
        getLangList: function getLangList() {
            return langList;
        },
        setUser: function setUser(data) {
            _user = data[0];
        },
        user: function user(prop) {
            if (typeof prop === 'undefined') {
                return _user;
            }
            try {
                return _user[prop];
            } catch (error) {
                console.log(error);
                return false;
            }
        },
        setAuth: function setAuth(value) {
            auth = value;
        },
        isAuth: function isAuth() {
            return auth;
        },
        setCoordinates: function setCoordinates(latitude, longitude) {
            coordinates.latitude = latitude;
            coordinates.longitude = longitude;
        },
        getCoordinates: function getCoordinates() {
            return coordinates;
        }
    };
}();

},{"./helper.js":3,"mithril":32}],3:[function(require,module,exports){
'use strict';

module.exports = function () {

    function debounce(fn, delay) {
        var timer = null;
        return function () {
            var context = this,
                args = arguments;
            clearTimeout(timer);
            timer = setTimeout(function () {
                fn.apply(context, args);
            }, delay);
        };
    }

    function throttle(fn, threshhold, scope) {
        threshhold || (threshhold = 250);
        var last = void 0,
            deferTimer = void 0;
        return function () {
            var context = scope || this;
            var now = +new Date(),
                args = arguments;
            if (last && now < last + threshhold) {
                // hold on to it
                clearTimeout(deferTimer);
                deferTimer = setTimeout(function () {
                    last = now;
                    fn.apply(context, args);
                }, threshhold);
            } else {
                last = now;
                fn.apply(context, args);
            }
        };
    }

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }

    return {
        debounce: debounce,
        throttle: throttle,
        getRandomInt: getRandomInt
    };
}();

},{}],4:[function(require,module,exports){
'use strict';

var m = require('mithril');
var Modal = require('./modal-window.js');
module.exports = function (config) {
    var header = config.header || 'Загрузка данных';
    var text = config.text || 'Операция может занять продолжительное время.';

    function view() {
        return m(new Modal({
            id: 'appLoadingWindow',
            state: 'show',
            content: [m("img", {
                class: "app-loading-window__loader",
                src: "assets/images/loading.gif"
            }), 'Пожалуйста, подождите...', m("p", { class: "app-loading-window__message" }, text)],
            isStatic: true,
            header: header,
            isFooter: false,
            isFullScreen: false,
            modalSizeParams: { width: '400px', height: false, padding: '15% 0 0 0' },
            zIndex: 9999
        }));
    }

    return {
        view: view
    };
};

},{"./modal-window.js":5,"mithril":32}],5:[function(require,module,exports){
'use strict';

var m = require('mithril');
module.exports = function (config) {
    var state = config.state || 'show';
    var content = config.content || '';
    var id = 'modalWindow-' + (config.id || 1);
    var isStatic = config.isStatic || false;
    var isFooter = config.isFooter || false;
    var header = config.header || 'Header';
    var isFullScreen = config.isFullScreen || false;
    var modalSizeParams = config.modalSizeParams || { width: '600px', height: '300px', padding: '15% 0 0 0' };
    var cancelBtn = config.cancelBtn || 'Cancel';
    var confirmBtn = config.confirmBtn || 'Ok';
    var confirmBtnClass = config.confirmBtnClass || 'btn-system-primary';
    var onConfirm = config.onConfirm || function () {};
    var onCancel = config.onCancel || function () {};
    var zIndex = config.zIndex || 1000;

    function show() {
        state = 'show';
        document.getElementById(id).style.display = "block";
    }

    function hide() {
        state = 'hidden';
        onCancel();
    }

    function updatedContent(cnt) {
        content = cnt;
    }

    function oninit() {
        if (isFullScreen) {
            modalSizeParams = { width: '100%', height: '100%', padding: '20px' };
        }
    }

    function view() {
        switch (state) {
            case 'show':
                return m("div", { class: "modal-window", id: id, style: "padding: " + modalSizeParams.padding + ";z-index: " + zIndex + ';' }, m("div", { class: "modal-window__content", style: "width: " + modalSizeParams.width + (modalSizeParams.height ? "; height: " + modalSizeParams.height : '') + ";" }, [m("div", { class: "modal-window__header" }, [isStatic ? '' : m("button", { type: "button", class: "close", "aria-hidden": true, onclick: hide }, m("span", '×')), m("h2", header)]), m("div", { class: "modal-window__body" + (isFooter ? '_with-footer' : '') + ' clearfix' }, [content]), isFooter && !isStatic ? m("div", { class: "modal-window__footer" }, [cancelBtn !== 'none' ? m("button", { type: "button", class: "btn btn-primary btn-system-cancel", onclick: hide }, cancelBtn) : '', m("button", { type: "button", class: "btn btn-primary " + confirmBtnClass, onclick: onConfirm }, confirmBtn)]) : '']));
            case 'hidden':
                return m("div", { class: "modal-window_hidden", id: id }, '');
        }
    }

    return {
        oninit: oninit,
        view: view,
        updatedContent: updatedContent,
        show: show,
        hide: hide
    };
};

},{"mithril":32}],6:[function(require,module,exports){
'use strict';

var m = require('mithril');
module.exports = function () {
    var useBody = true;
    function serialize(data) {
        try {
            return m.buildQueryString(data); // JSON.stringify(data);
        } catch (error) {
            throw new Error("Ошибка отправки запроса", data);
        }
    }

    function deserialize(data) {
        try {
            return data !== "" ? JSON.parse(data).data : null;
        } catch (e) {
            return null;
        }
    }

    function checkResponse(data) {
        if (data === null) return;

        if (data.status === 'ERROR') {
            throw new Error(data.message);
        }
        return data;
    }

    function login(login, password) {
        var data = {
            login: login,
            password: password
        };
        return m.request({
            background: true,
            useBody: useBody,
            method: "POST",
            url: Config.services + 'Login',
            data: data,
            serialize: serialize,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
            }
        });
    }

    function get(fields, table, where, order, start, end) {
        var data = {
            background: true,
            token: Globals.getToken(),
            fields: fields,
            table: table,
            where: where
        };

        if (typeof order !== 'undefined' && order !== null) {
            data.order = order;
        }

        if (typeof start !== 'undefined' && typeof end !== 'undefined') {
            data.start = start;
            data.end = end;
        }
        return m.request({
            useBody: useBody,
            method: "POST",
            url: Config.services + 'GetData',
            data: data,
            serialize: serialize,
            deserialize: deserialize,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
            }
        }).then(checkResponse);
    }

    function insert(table, fields, values) {
        var data = {
            token: Globals.getToken(),
            table: table,
            fields: fields,
            values: values
        };

        return m.request({
            background: true,
            useBody: useBody,
            method: "POST",
            url: Config.services + 'InsertData',
            data: data,
            serialize: serialize,
            deserialize: deserialize,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
            }
        }).then(checkResponse);
    }

    function update(table, fields, where) {
        var data = {
            token: Globals.getToken(),
            table: table,
            fields: fields,
            where: where
        };

        return m.request({
            background: true,
            useBody: useBody,
            method: "POST",
            url: Config.services + 'UpdateData',
            data: data,
            serialize: serialize,
            deserialize: deserialize,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
            }
        }).then(checkResponse);
    }

    function execQuery(query) {
        var data = {
            token: Globals.getToken(),
            query: query
        };

        return m.request({
            background: true,
            useBody: useBody,
            method: "POST",
            url: Config.services + 'ExecQuery',
            data: data,
            serialize: serialize,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
            }
        }).then(checkResponse);
    }

    function uploadImage(file, folder, fileName, onProgress) {
        var data = new FormData();
        data.append("file", file);
        data.append("operation", "photo_upload");
        data.append("folder_name", folder);
        data.append("file_name", fileName);

        return m.request({
            background: true,
            method: "POST",
            url: Config.services + 'PhotoUpload',
            data: data
            // config: function (xhr) {
            //     xhr.upload.addEventListener("progress", function (e) {
            //         console.log((e.loaded / e.total) + "% completed");
            //         onProgress(e.loaded / e.total);
            //         m.redraw() // tell Mithril that data changed and a re-render is needed
            //     })
            // }
        }).then(checkResponse);
    }

    function uploadImageBase64(fileName, folder, image) {
        var data = {
            token: Globals.getToken(),
            fileName: fileName,
            folder: folder,
            image: image
        };

        return m.request({
            background: true,
            useBody: useBody,
            method: "POST",
            url: Config.services + 'UploadImageB64',
            data: data,
            serialize: serialize,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
            }
        }).then(checkResponse);
    }

    function sendSMS(message, phone) {
        var data = {
            token: Globals.getToken(),
            message: message,
            phone: phone,
            operation: "send_sms"
        };

        return m.request({
            useBody: useBody,
            method: "POST",
            url: Config.services,
            data: data,
            serialize: serialize,
            background: true,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                "Accept": "application/json, text/javascript"
            }
        });
    }

    return {
        login: login,
        get: get,
        insert: insert,
        update: update,
        execQuery: execQuery,
        uploadImage: uploadImage,
        uploadImageBase64: uploadImageBase64,
        sendSMS: sendSMS
    };
}();

},{"mithril":32}],7:[function(require,module,exports){
'use strict';

var m = require('mithril');
var Modal = require('../../components/modal-window/modal-window.js');
var R = require('../../components/request.js');
module.exports = function (config) {
    var interval = config.interval || 5000;
    var _messages = [];
    var _state = 'hidden';
    var _modal = false;

    function getMessages() {
        return R.get('*', 'ST_USER_MESSAGE', "WHERE USM_USE_CODE = " + Globals.user('USE_CODE') + " AND USM_IS_READEN = 0");
    }

    function initCarousel(el) {
        console.log('init carousel');
        $(el.dom).carousel({
            interval: interval
        }).carousel('cycle');
    }

    function removeMessage(messageIndex) {
        var message = _messages[messageIndex];
        R.update('ST_USER_MESSAGE', 'USM_IS_READEN = 1', "USM_CODE = " + message.code);
        _messages.splice(messageIndex, 1);
        if (_messages.length === 0) {
            _state = 'hidden';
        }
    }

    function onItemClick() {
        var messageIndex = this.getAttribute('data-index');
        var message = _messages[messageIndex];
        if (message.isNews) {
            //relocate
        } else {
            _modal = new Modal({
                id: 'alertModal',
                state: 'show',
                header: message.header,
                content: [m("div", { style: "text-align: left;" }, [m.trust(message.text)])],
                isStatic: false,
                isFooter: true,
                isFullScreen: false,
                modalSizeParams: { width: '90%', height: false, padding: '15% 0 0 0' },
                zIndex: 1005,
                cancelBtn: 'none',
                confirmBtn: 'Ок',
                onConfirm: function onConfirm() {
                    _modal = false;
                    removeMessage(messageIndex);
                },
                onCancel: function onCancel() {
                    _modal = false;
                    removeMessage(messageIndex);
                }
            });
        }
    }

    function oninit() {
        getMessages().then(function (data) {
            if (data.length === 0) return;
            data.map(function (message) {
                _messages.push({
                    code: message['USM_CODE'],
                    header: message['USM_HEADER'],
                    annotation: message['USM_ANNOTATION'],
                    text: message['USM_TEXT'],
                    isNews: message['USM_IS_NEWS']
                });
            });
            _state = 'show';
            m.redraw();
        }).catch(function (error) {
            console.error(error);
        });
    }

    function view() {
        switch (_state) {
            case 'hidden':
                return '';
            case 'show':
                return m("div", { class: "m-alert" }, [m("div", { id: "alertCarousel", class: "carousel slide", "data-ride": "carousel", oncreate: initCarousel, key: Date.now() }, [m("div", { class: "carousel-inner", "role": "listbox" }, [_messages.map(function (message, index) {
                    return m("div", { class: "item" + (index === 0 ? ' active' : '') + ' m-alert__item', "data-index": index, onclick: onItemClick }, [m("div", { class: "m-alert__item-inner" }, [m("h3", message.header), m("p", m.trust(message.annotation)), m("span", { class: "glyphicon glyphicon-envelope", "aria-hidden": "true" })])]);
                })])]), _modal ? m(_modal) : '']);
        }
    }

    return {
        view: view,
        oninit: oninit
    };
};

},{"../../components/modal-window/modal-window.js":5,"../../components/request.js":6,"mithril":32}],8:[function(require,module,exports){
"use strict";

var m = require('mithril');
module.exports = function (config) {

    function exit() {
        Globals.setAuth(false);
        m.route('/login');
    }

    function view() {
        return m("nav", { class: "navbar navbar-default navbar-fixed-top" }, m("div", { class: "container-fluid" }, [m("div", { class: "navbar-header" }, [m("button", { type: "button", class: "navbar-toggle collapsed", "data-toggle": "collapse", "data-target": "#menuCollapse", "aria-expanded": "false" }, [m("span", { class: "sr-only" }, 'Toggle navigation'), m("span", { class: "icon-bar" }), m("span", { class: "icon-bar" }), m("span", { class: "icon-bar" })]), m("a", { class: "navbar-brand m-menu__user-container", href: "/home", oncreate: m.route.link }, m("span", { class: "glyphicon glyphicon-user", "aria-hidden": "true" }), Globals.user('USE_NAME')
        //" ("+Globals.user("USE_SCORE")+" баллов)"
        )]), m("div", { class: "collapse navbar-collapse", id: "menuCollapse" }, [m("ul", { class: "nav navbar-nav" }, [m("li", { class: m.route.get() === '/list' ? "active" : "" }, m("a", { href: "/list", class: "", oncreate: m.route.link }, 'Задачи')), m("li", { class: m.route.get() === '/home' ? "active" : "" }, m("a", { href: "/home", oncreate: m.route.link }, 'Личный кабинет')), m("li", { class: m.route.get() === '/messages' ? "active" : "" }, m("a", { href: "/messages", oncreate: m.route.link }, 'Сообщения')), m("li", m("a", { href: "", onclick: exit }, 'Выход'))])])]));
    }

    function oninit() {}

    return {
        oninit: oninit,
        view: view
    };
};

},{"mithril":32}],9:[function(require,module,exports){
'use strict';

module.exports = function (config) {
    var surveyData = config.data;

    var surveyModel = {
        structure: {},
        results: {},
        removeQuestionFromResults: function removeQuestionFromResults(questionCode) {
            delete surveyModel.results[questionCode];
        },
        addQuestionResult: function addQuestionResult(question, data) {
            surveyModel.results[question] = data;
        }
    };

    function prepare() {
        surveyModel.structure = surveyData.reduce(function (survey, row, index) {
            if (!survey.hasOwnProperty(row['QUE_CODE'])) {
                survey[row['QUE_CODE']] = {
                    code: row['QUE_CODE'],
                    text: {
                        ru: row['QUE_TEXT'],
                        kz: row['QUE_TEXT_KAZ'],
                        en: row['QUE_TEXT_ENG']
                    },
                    photo: {
                        ru: row['QUE_PHOTO'],
                        kz: row['QUE_PHOTO_KAZ'],
                        en: row['QUE_PHOTO_ENG']
                    },
                    typeCode: row['QUT_ALIAS'],
                    typeName: row['QUT_NAME'],
                    answers: [],
                    isFirst: index === 0
                };
            }

            if (index === 0) {
                survey.firstQuestion = row['QUE_CODE'];
                survey[row['QUE_CODE']].isFirst = true;
            }

            survey[row['QUE_CODE']].answers.push({
                code: row['ANS_CODE'],
                text: {
                    ru: row['ANS_TEXT'],
                    kz: row['ANS_TEXT_KAZ'],
                    en: row['ANS_TEXT_ENG']
                },
                photo: {
                    ru: row['ANS_PHOTO'],
                    kz: row['ANS_PHOTO_KAZ'],
                    en: row['ANS_PHOTO_ENG']
                },
                order: row['SUD_SHOW_ORDER'],
                isMandatory: row['SUD_ANS_IS_MANDATORY'],
                nextQuestion: row['ANS_NEXT_QUE_CODE']
            });

            return survey;
        }, { firstQuestion: null });
        return surveyModel.structure;
    }

    return {
        prepare: prepare,
        getStructure: function getStructure() {
            return surveyModel.structure;
        }
    };
};

},{}],10:[function(require,module,exports){
'use strict';

var m = require('mithril');
//import types
var FinalScreen = require('./types/final-screen.js');
var PaintScreen = require('./types/paint-screen.js');
var PhotoScreen = require('./types/photo-screen.js');
var ImageScreen = require('./types/image-screen.js');
var LanguageScreen = require('./types/language-screen.js');
var TextListScreen = require('./types/text-list-screen.js');
var VideoScreen = require('./types/video-screen.js');
var ImageGridScreen = require('./types/image-grid-screen.js');
var RegisterNamePhoneScreen = require('./types/register-name-phone-screen.js');
var RegisterBirthGenderScreen = require('./types/register-birth-gender-screen.js');
var RegisterConfirmSmsScreen = require('./types/confirm-code.js');
var DigitInputScreen = require('./types/digit-input-screen.js');
var UnknownScreen = require('./types/unknown.js');

function build(config) {
    switch (config.question.typeCode) {
        case 'DIGIT_INPUT':
            return new DigitInputScreen(config);

        case 'PAINT':
            return new PaintScreen(config);

        case 'FINAL_SCREEN':
            return new FinalScreen(config);

        case 'USER_PHOTO':
            return new PhotoScreen(config);

        case 'IMAGE_SCREEN':
            return new ImageScreen(config);

        case 'REGISTER_NAME_PHONE':
            return new RegisterNamePhoneScreen(config);

        case 'REGISTER_BIRTH_GENDER':
            return new RegisterBirthGenderScreen(config);

        case 'REGISTER_CONFIRM_SMS':
            return new RegisterConfirmSmsScreen(config);

        case 'LANGUAGE_CHOICE':
            config.langs = Globals.getLangList();
            return new LanguageScreen(config);

        case 'VIDEO_SCREEN':
            return new VideoScreen(config);

        case 'IMAGE_GRID_WITH_LABEL':
            config.withLabel = true;
            return new ImageGridScreen(config);

        case 'IMAGE_GRID_WITHOUT_LABEL':
            config.withLabel = false;
            return new ImageGridScreen(config);

        case 'LIST_SINGLE_ANSWER':
            config.withFilter = false;
            return new TextListScreen(config);

        case 'LIST_SINGLE_ANSWER_WITH_FILTER':
            config.withFilter = true;
            return new TextListScreen(config);

        default:
            return new UnknownScreen(config);
    }
}
module.exports = build;

},{"./types/confirm-code.js":13,"./types/digit-input-screen.js":14,"./types/final-screen.js":15,"./types/image-grid-screen.js":16,"./types/image-screen.js":17,"./types/language-screen.js":18,"./types/paint-screen.js":19,"./types/photo-screen.js":20,"./types/register-birth-gender-screen.js":21,"./types/register-name-phone-screen.js":22,"./types/text-list-screen.js":23,"./types/unknown.js":24,"./types/video-screen.js":25,"mithril":32}],11:[function(require,module,exports){
'use strict';

var m = require('mithril');
var R = require('../../components/request.js');

module.exports = function (config) {
    var survey = config.survey;
    var afterSave = config.afterSave || function () {
        console.log('saved');
    };
    var results = {};
    var defaultSalepoint = 38; //118346 на 1.200 
    var visitCode = void 0;

    function set(question, answerCode, result) {
        results[question.code] = { question: question, answerCode: answerCode, result: result };
    }

    function get(code) {
        if (results.hasOwnProperty(code)) {
            return results[code];
        }
        return false;
    }

    function remove(questionCode) {
        try {
            delete results[questionCode];
        } catch (error) {
            console.error('there is no this question code in results!');
        }
    }

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }

    function getDateTimeString() {
        var currentdate = new Date();
        return currentdate.getFullYear() + "." + (currentdate.getMonth() + 1 < 10 ? "0" : "") + (currentdate.getMonth() + 1) + "." + (currentdate.getDate() < 10 ? "0" : "") + currentdate.getDate() + " " + currentdate.getHours() + ":" + currentdate.getMinutes() + ":" + currentdate.getSeconds();
    }

    function createVisit() {
        var currentdate = new Date();
        var datetime = getDateTimeString();
        var visitId = Globals.user('USE_CODE') + '/' + defaultSalepoint + '/' + getRandomInt(1000, 9999) + ' - ' + datetime;
        var coordinates = Globals.getCoordinates();
        return R.insert('ST_VISIT', 'VIS_NUMBER, VIS_USE_CODE, VIS_SAL_CODE, VIS_START_DATE, VIS_FINISH_DATE, VIS_VIT_CODE, VIS_LATITUDE, VIS_LONGITUDE', '\'' + visitId + '\', ' + Globals.user('USE_CODE') + ', ' + Globals.user('USE_SAL_CODE') + ', \'' + datetime + '\', \'' + datetime + '\', \'4\', \'' + coordinates.latitude + '\', \'' + coordinates.longitude + '\'');
    }

    function saveRespondent() {
        var promiseArray = [];
        var user = null;

        for (var questionCode in results) {
            var resultObj = results[questionCode];
            switch (resultObj.question.typeCode) {
                case 'REGISTER_NAME_PHONE':
                    if (user === null) {
                        user = { name: resultObj.result.name, surname: resultObj.result.surname, phone: resultObj.result.phone };
                    } else {
                        user.name = resultObj.result.name;
                        user.surname = resultObj.result.surname;
                        user.phone = resultObj.result.phone;
                    }
                    break;

                case 'REGISTER_BIRTH_GENDER':
                    if (user === null) {
                        user = { gender: resultObj.result.gender, birthdate: resultObj.result.birthdate };
                    } else {
                        user.gender = resultObj.result.gender === 'man' ? 4 : 5;
                        user.birthdate = resultObj.result.birthdate;
                    }
                    break;
            }
        }

        if (user === null) {
            return new Promise(function (resolve) {
                return resolve(null);
            });
        } else {
            return R.insert('ST_RESPONDENTS', 'RES_NAME, RES_SURNAME, RES_BIRTHDATE, RES_PHONE, RES_GND_CODE, RES_VIS_CODE, RES_SUR_CODE', "N'" + user.name + "', N'" + user.surname + "' ," + "CONVERT(DATETIME,'" + user.birthdate + "',104), '+7" + user.phone + "', " + user.gender + ', ' + visitCode + ', ' + survey);
        }
    }

    function saveSurveyResults(respondent) {
        var promiseArray = [];

        for (var questionCode in results) {
            var resultObj = results[questionCode];
            switch (resultObj.question.typeCode) {
                case 'USER_PHOTO':
                    var photo = resultObj.result;
                    var currentdate = new Date();
                    var extension = photo.name.split('.').pop();
                    var datetime = getDateTimeString();
                    var photoName = Globals.user('USE_CODE') + '_' + getRandomInt(1000, 9999) + '_' + datetime + '.' + extension;

                    promiseArray.push(R.insert('ST_VISIT_PHOTO', 'VIP_VIS_CODE, VIP_FOLDER_NAME, VIP_PHOTO_NAME', visitCode + ", '" + Globals.user('USE_CODE') + "', '" + photoName + "'"));
                    promiseArray.push(R.uploadImage(photo, Globals.user('USE_CODE'), resultObj.result));

                    promiseArray.push(R.insert('ST_SURVEY_RESULTS', 'SRS_VIS_CODE, SRS_SUR_CODE, SRS_QUE_CODE, SRS_ANS_CODE, SRS_ANS_VALUE', visitCode + ', ' + survey + ', ' + resultObj.question.code + ', ' + resultObj.answerCode + ', 1'));
                    break;

                case 'PAINT':
                    var imageName = Globals.user('USE_CODE') + '_' + getRandomInt(1000, 9999) + '_' + getDateTimeString();

                    if (respondent !== null) {
                        promiseArray.push(R.insert('ST_VISIT_PHOTO', 'VIP_VIS_CODE, VIP_FOLDER_NAME, VIP_PHOTO_NAME', visitCode + ", '" + Globals.user('USE_CODE') + "', '" + imageName + "'"));
                    }

                    promiseArray.push(R.uploadImageBase64(photo, 'ST_RESPONDENT', photoName, null));
                    break;

                case 'DIGIT_INPUT':
                    for (var answerCode in resultObj.result) {
                        promiseArray.push(R.insert('ST_SURVEY_RESULTS', 'SRS_VIS_CODE, SRS_SUR_CODE, SRS_QUE_CODE, SRS_ANS_CODE, SRS_ANS_VALUE',
                        // 'WT_SYNC_H_ST_SURVEY_RESULTS', 
                        // 'SRS_VIS_NUMBER, SRS_SUR_CODE, SRS_QUE_CODE, SRS_ANS_CODE, SRS_ANS_VALUE, USE_CODE', 
                        visitCode + ', ' + survey + ', ' + resultObj.question.code + ', ' + answerCode + ', ' + resultObj.result[answerCode]));
                    }
                    break;
                default:
                    promiseArray.push(R.insert(
                    // 'WT_SYNC_H_ST_SURVEY_RESULTS', 
                    // 'SRS_VIS_NUMBER, SRS_SUR_CODE, SRS_QUE_CODE, SRS_ANS_CODE, SRS_ANS_VALUE, USE_CODE', 
                    'ST_SURVEY_RESULTS', 'SRS_VIS_CODE, SRS_SUR_CODE, SRS_QUE_CODE, SRS_ANS_CODE, SRS_ANS_VALUE', visitCode + ', ' + survey + ', ' + resultObj.question.code + ', ' + resultObj.answerCode + ', 1'));
            }
        }
        return Promise.all(promiseArray);
    }

    function save() {
        return createVisit().then(function (visit) {
            try {
                visitCode = visit[0].key;
            } catch (error) {
                throw new Error('Ошибка сохранения опроса!');
            }
        }).then(saveRespondent).then(saveSurveyResults).then(afterSave).then(function () {
            m.redraw();
        }).catch(function (error) {
            console.log(error);
            m.redraw();
        });
    }

    return {
        get: get,
        set: set,
        remove: remove,
        save: save
    };
};

},{"../../components/request.js":6,"mithril":32}],12:[function(require,module,exports){
'use strict';

var m = require('mithril');
var Helper = require('../../components/helper.js');
var R = require('../../components/request.js');
var SurveyModelCon = require('./model.js');
var ResultModelCon = require('./result-model.js');
var BuildQuestionScreen = require('./question-builder.js');
var LoadingModal = require('../../components/modal-window/loading-modal-window.js');
var Modal = require('../../components/modal-window/modal-window.js');
module.exports = function (config) {
    var survey = config.survey || false;
    var afterSave = config.afterSave;
    var SurveyModel = void 0;
    var ResultModel = void 0;
    var loadingModal = false;
    var alertModal = false;
    var _Question = void 0;
    var _state = 'loading';
    var _errors = [];
    var _questionStructure = void 0;
    var _surveyStepHistory = [];
    var _currentQuestion = void 0;
    var _sessionCode = Helper.getRandomInt(1000, 9999);

    function generateQuestion() {
        _Question = BuildQuestionScreen({
            question: _currentQuestion,
            prev: goPrev,
            next: goNext,
            sessionCode: _sessionCode,
            ResultModel: ResultModel,
            onAlert: function onAlert(header, messages) {
                alertModal = new Modal({
                    id: 'alertModal',
                    state: 'show',
                    header: header,
                    content: [m("div", { style: "text-align: left;" }, [messages.map(function (message) {
                        return m("p", message);
                    })])],
                    isStatic: false,
                    isFooter: true,
                    isFullScreen: false,
                    modalSizeParams: { width: '90%', height: false, padding: '15% 0 0 0' },
                    zIndex: 1005,
                    cancelBtn: 'none',
                    confirmBtn: 'Ок',
                    onConfirm: function onConfirm() {
                        alertModal = false;
                    },
                    onCancel: function onCancel() {
                        alertModal = false;
                    }
                });
            }
        });
    }

    function prepareSurvey(data) {
        SurveyModel = new SurveyModelCon({ data: data });
        _questionStructure = SurveyModel.prepare();
        _currentQuestion = _questionStructure[_questionStructure.firstQuestion];
        _surveyStepHistory.push(_currentQuestion.code);
        generateQuestion();
        _state = 'loaded';
    }

    function goPrev() {
        var currentIndex = _surveyStepHistory.indexOf(_currentQuestion.code);
        _surveyStepHistory.splice(currentIndex, 1);
        _currentQuestion = _questionStructure[_surveyStepHistory[currentIndex - 1]];
        generateQuestion();
    }

    function goNext(nextQuestion, answer) {
        _currentQuestion = _questionStructure[nextQuestion];
        _surveyStepHistory.push(_currentQuestion.code);
        generateQuestion();
    }

    ///////////////////////////////////////
    ///   COMPONENT LIFECYCLE METHODS   ///
    ///////////////////////////////////////

    function oninit() {
        if (survey) {
            ResultModel = new ResultModelCon({
                survey: survey,
                afterSave: afterSave
            });

            R.get('*', 'VIEW_ST_SURVEY_DETAILS', "WHERE SUD_SUR_CODE = " + survey, 'SUD_SHOW_ORDER').then(prepareSurvey).then(function () {
                m.redraw();
            }).catch(function (e) {
                _errors.push('Ошибка загрузки данных для опроса!');
                _errors.push(e.message);
                _state = 'error';
                m.redraw();
            });
        } else {
            _errors.push('Отсуствует обязательный параметр "код опроса"!');
            _state = 'error';
        }
    }

    function view() {
        switch (_state) {
            case 'loading':
                return m("div", { class: "m-survey" }, loadingModal ? m(loadingModal) : '');
            case 'loaded':
                return m("div", { class: "m-survey" }, [m(_Question), alertModal ? m(alertModal) : ''
                // m("div", {class: "m-survey__history"}, [
                //     // _currentQuestion.code
                //     _surveyStepHistory.join(' -> ')
                // ])
                ]);
            case 'error':
                return m("div", { class: "m-survey" }, [_errors.map(function (error) {
                    return m("p", error);
                })]);
        }
    }

    return {
        oninit: oninit,
        view: view
    };
};

},{"../../components/helper.js":3,"../../components/modal-window/loading-modal-window.js":4,"../../components/modal-window/modal-window.js":5,"../../components/request.js":6,"./model.js":9,"./question-builder.js":10,"./result-model.js":11,"mithril":32}],13:[function(require,module,exports){
'use strict';

var m = require('mithril');

module.exports = function (config) {
    var ResultModel = config.ResultModel;
    var question = config.question;
    var _state = 'default';
    var _nextQuestion = false;
    var _errors = [];

    var Model = {
        code: null,
        setCode: function setCode(value) {
            Model.code = value;
        },
        check: function check() {
            if (Model.code == config.sessionCode || Model.code == '0000') {
                return true;
            }
            return false;
        }
    };

    function goPrev() {
        if (question.isFirst) {
            window.history.back();
        } else {
            ResultModel.remove(question.code);
            config.prev();
        }
    }

    function goNext() {
        if (Model.check()) {
            ResultModel.set(question, question.answers[0].code, Model.code);
            config.next(_nextQuestion);
        } else {
            config.onAlert('Ошибка', ['Неверный код подтверждения!']);
        }
    }

    ///////////////////////////////////////
    ///   COMPONENT LIFECYCLE METHODS   ///
    ///////////////////////////////////////

    function oninit() {
        console.log('on init');
        try {
            _nextQuestion = question.answers[0].nextQuestion;
        } catch (error) {
            _errors.push('Отсутствуют варианты ответов!');
            _state = 'error';
        }
    }

    function view() {
        return m("div", { class: "container confirm-code-screen survey-screen", style: 'background-image: url("' + Config.serverAddress + 'photo/ST_QUESTION/' + question.photo[Globals.getLang()] + '"); background-repeat: none; background-size:cover;' }, [m("div", { class: "row survey-top-panel" }, [m("div", { class: "col-xs-6 col-md-3" }, m("button", { class: "btn btn-default survey-prev-btn", onclick: goPrev }, "Назад")), m("div", { class: "col-xs-6 col-md-3 col-md-push-6" }, m("button", { class: "btn btn-default survey-next-btn", onclick: goNext }, "Вперед")), m("div", { class: "col-xs-12 col-md-6 col-md-pull-3 survey-top-panel__question-container" }, question.text[Globals.getLang()])]), m("div", { class: "confirm-code-screen__content" }, [m("div", { class: "row" }, [m("div", { class: "col-xs-12" }, [m("input", { class: "form-control", placeholder: "Введите код подтверждения", value: Model.code, onchange: m.withAttr("value", Model.setCode) })])])])]);
    }

    return {
        oninit: oninit,
        view: view
    };
};

},{"mithril":32}],14:[function(require,module,exports){
'use strict';

var m = require('mithril');

module.exports = function (config) {
    var ResultModel = config.ResultModel;
    var question = config.question;
    var _state = 'default';
    var _nextQuestion = false;
    var _errors = [];
    var Model = {
        answers: {},
        change: function change() {
            var code = parseInt(this.getAttribute('data-code'));
            var value = parseInt(this.value);
            value = isNaN(value) ? 0 : value;
            Model.answers[code] = value;
        }
    };

    function goPrev() {
        if (question.isFirst) {
            window.history.back();
        } else {
            ResultModel.remove(question.code);
            config.prev();
        }
    }

    function goNext() {
        ResultModel.set(question, null, Model.answers);
        config.next(_nextQuestion);
    }

    ///////////////////////////////////////
    ///   COMPONENT LIFECYCLE METHODS   ///
    ///////////////////////////////////////

    function oninit() {
        console.log('on init');
        try {
            _nextQuestion = question.answers[0].nextQuestion;
            question.answers.forEach(function (answer) {
                Model.answers[answer.code] = 0;
            });
        } catch (error) {
            _errors.push('Отсутствуют варианты ответов!');
            _state = 'error';
        }
    }

    function view() {
        return m("div", { class: "container digit-input-screen survey-screen", style: 'background-image: url("' + Config.serverAddress + 'photo/ST_QUESTION/' + question.photo[Globals.getLang()] + '"); background-repeat: none; background-size:cover;' }, [m("div", { class: "row survey-top-panel" }, [m("div", { class: "col-xs-6 col-md-3" }, m("button", { class: "btn btn-default survey-prev-btn", onclick: goPrev }, "Назад")), m("div", { class: "col-xs-6 col-md-3 col-md-push-6" }, m("button", { class: "btn btn-default survey-next-btn", onclick: goNext }, "Вперед")), m("div", { class: "col-xs-12 col-md-6 col-md-pull-3 survey-top-panel__question-container" }, question.text[Globals.getLang()])]), m("div", { class: "digit-input-screen__content" }, [m("div", { class: "row" }, [m("div", { class: "col-xs-12" }, [m("form", m("ul", { class: "list-group digit-input-screen__list" }, [question.answers.map(function (answer) {
            return m("li", { class: "list-group-item" }, [m("div", { class: "row" }, [m("div", { class: "col-xs-8" }, m("strong", answer.text[Globals.getLang()])), m("div", { class: "col-xs-4" }, m("input", { type: "number", class: "form-control", "data-code": answer.code, placeholder: "0", onchange: m.withAttr("value", Model.change), value: Model.answers[answer.code] !== 0 ? Model.answers[answer.code] : '' }))])]);
        })]))])])])]);
    }

    return {
        oninit: oninit,
        view: view
    };
};

},{"mithril":32}],15:[function(require,module,exports){
'use strict';

var m = require('mithril');
var LoadingModal = require('../../../components/modal-window/loading-modal-window.js');

module.exports = function (config) {
    var ResultModel = config.ResultModel;
    var question = config.question;
    var loadingModal = false;
    var _nextQuestion = false;
    var _listCombo = void 0;
    var _selected = false;
    var _search = '';

    function goPrev() {
        if (question.isFirst) {
            window.history.back();
        } else {
            ResultModel.remove(question.code);
            config.prev();
        }
    }

    function save() {
        loadingModal = new LoadingModal({
            header: "Сохранение опроса",
            text: ''
        });
        ResultModel.save();
    }

    ///////////////////////////////////////
    ///   COMPONENT LIFECYCLE METHODS   ///
    ///////////////////////////////////////

    function oninit() {}

    function view() {
        return m("div", { class: "container final-screen survey-screen", style: 'background-image: url("' + Config.serverAddress + 'photo/ST_QUESTION/' + question.photo[Globals.getLang()] + '"); background-repeat: none; background-size:cover;' }, [m("div", { class: "row survey-top-panel" }, [m("div", { class: "col-xs-6 col-md-3" }, m("button", { class: "btn btn-default survey-prev-btn", onclick: goPrev }, "Назад")), m("div", { class: "col-xs-12 col-md-6 col-md-pull-3 survey-top-panel__question-container" },
        // question.text[Globals.getLang()]
        'Конец опроса')]), m("div", { class: "final-screen__content" }, [
        // m("h3", {class: ""}, question.answers[0].text[Globals.getLang()]),
        m("button", { class: "btn btn-default", onclick: save }, 'Завершить опрос')]), loadingModal ? m(loadingModal) : '']);
    }

    return {
        oninit: oninit,
        view: view
    };
};

},{"../../../components/modal-window/loading-modal-window.js":4,"mithril":32}],16:[function(require,module,exports){
'use strict';

var m = require('mithril');
var Helper = require('../../../components/helper.js');

module.exports = function (config) {
    var ResultModel = config.ResultModel;
    var question = config.question;
    var _nextQuestion = false;
    var _selected = false;
    var _listCombo = void 0;
    var _search = '';
    var _images = [];

    var reloadFunction = Helper.debounce(function () {
        m.redraw();
    }, 500);

    function goPrev() {
        if (question.isFirst) {
            window.history.back();
        } else {
            ResultModel.remove(question.code);
            config.prev();
        }
    }

    function goNext() {
        if (_selected) {
            ResultModel.set(question, _selected, null);
            config.next(_nextQuestion);
        } else {
            config.onAlert('Ошибка', ['Выберите вариант ответа!']);
        }
    }

    function selectImage() {
        _nextQuestion = parseInt(this.getAttribute('data-next'));
        _selected = parseInt(this.getAttribute('data-index'));
    }

    ///////////////////////////////////////
    ///   COMPONENT LIFECYCLE METHODS   ///
    ///////////////////////////////////////

    function oncreate() {
        _images.forEach(function (imageObj, index) {
            if (imageObj.status === 'not_checked') {
                var image = new Image();
                image.onload = function () {
                    _images[index]['status'] = 'ok';
                    reloadFunction();
                };
                image.onerror = function () {
                    _images[index]['status'] = 'error';
                    reloadFunction();
                };
                image.src = imageObj.src;
            }
        });
    }

    function oninit() {
        _images = question.answers.map(function (answer) {
            return {
                next: answer.nextQuestion,
                name: answer.text[Globals.getLang()],
                src: Config.serverAddress + 'photo/ST_ANSWER/' + answer.photo[Globals.getLang()],
                status: 'not_checked'
            };
        });
    }

    function view() {
        return m("div", { class: "container image-grid-screen survey-screen", style: 'background-image: url("' + Config.serverAddress + 'photo/ST_QUESTION/' + question.photo[Globals.getLang()] + '"); background-repeat: none; background-size:cover;' }, [m("div", { class: "row survey-top-panel" }, [m("div", { class: "col-xs-6 col-md-3" }, m("button", { class: "btn btn-default survey-prev-btn", onclick: goPrev }, "Назад")), m("div", { class: "col-xs-6 col-md-3 col-md-push-6" }, m("button", { class: "btn btn-default survey-next-btn", onclick: goNext }, "Вперед")), m("div", { class: "col-xs-12 col-md-6 col-md-pull-3 survey-top-panel__question-container" }, question.text[Globals.getLang()])]), m("div", { class: "row image-grid-screen__content" }, [_images.map(function (image, index) {
            return m("div", { class: "col-xs-12 col-sm-6 col-md-4 col-lg-3 image-grid-screen__image-container" }, [m("div", { class: "image-grid-screen__image-wrapper clearfix " + (index === _selected ? 'active' : ''), "data-next": image.next, "data-index": index, onclick: selectImage }, m("img", { src: image.status === 'ok' ? image.src : image.status === 'not_checked' ? './assets/images/loading.gif' : './assets/images/no_image.png' }))]);
        })])]);
    }

    return {
        oninit: oninit,
        oncreate: oncreate,
        view: view
    };
};

},{"../../../components/helper.js":3,"mithril":32}],17:[function(require,module,exports){
'use strict';

var m = require('mithril');
module.exports = function (config) {
    var question = config.question;
    var ResultModel = config.ResultModel;
    var _state = 'default';
    var _nextQuestion = false;
    var _errors = [];

    function goPrev() {
        if (question.isFirst) {
            window.history.back();
        } else {
            ResultModel.remove(question.code);
            config.prev();
        }
    }

    function goNext() {
        ResultModel.set(question, question.answers[0].code, null);
        config.next(_nextQuestion);
    }

    function enableScale() {
        var viewport = document.querySelector("meta[name=viewport]");
        viewport.setAttribute('content', 'width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes');
    }

    function disableScale() {
        var viewport = document.querySelector("meta[name=viewport]");
        viewport.setAttribute('content', 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no');
    }

    ///////////////////////////////////////
    ///   COMPONENT LIFECYCLE METHODS   ///
    ///////////////////////////////////////

    function onremove() {
        disableScale();
    }

    function oninit() {
        enableScale();
        try {
            _nextQuestion = question.answers[0].nextQuestion;
        } catch (error) {
            _errors.push('Отсутствуют варианты ответов!');
            _state = 'error';
        }
    }

    function view() {
        switch (_state) {
            case 'default':
                return m("div", { class: "container survey-screen" }, [m("div", { class: "row survey-top-panel" }, [m("div", { class: "col-xs-6 col-md-3" }, m("button", { class: "btn btn-default survey-prev-btn", onclick: goPrev }, "Назад")), m("div", { class: "col-xs-6 col-md-3 col-md-push-6" }, m("button", { class: "btn btn-default survey-next-btn", onclick: goNext }, "Вперед")), m("div", { class: "col-xs-12 col-md-6 col-md-pull-3 survey-top-panel__question-container" }, question.text[Globals.getLang()])]), m("div", { class: "row" }, [m("img", { src: Config.serverAddress + "photo/ST_QUESTION/" + question.photo[Globals.getLang()], width: "100%;" })])]);
            case 'error':
                return m("div", { class: "screen-photo" }, [_errors.map(function (error) {
                    return m("p", { class: "error" }, error);
                })]);
        }
    }

    return {
        oninit: oninit,
        view: view,
        onremove: onremove
    };
};

},{"mithril":32}],18:[function(require,module,exports){
'use strict';

var m = require('mithril');

module.exports = function (config) {
    var ResultModel = config.ResultModel;
    var question = config.question;
    var langs = config.langs || [];
    var _state = 'default';
    var _currentLang = false;
    var _nextQuestion = false;
    var _errors = [];

    function chooseLang() {
        _currentLang = this.getAttribute('data-lang');
        Globals.setLang(_currentLang);
        ResultModel.set(question, question.answers[0].code, _currentLang);
        config.next(_nextQuestion);
    }

    ///////////////////////////////////////
    ///   COMPONENT LIFECYCLE METHODS   ///
    ///////////////////////////////////////

    function oninit() {
        try {
            _nextQuestion = question.answers[0].nextQuestion;
        } catch (error) {
            _errors.push('Отсутствуют варианты ответов!');
            _state = 'error';
        }

        if (langs.length === 0) {
            _errors.push('Отсутствует список для выбора языка!');
        }
    }

    function view() {
        switch (_state) {
            case 'default':
                return m("div", { class: "screen-language container survey-screen", style: 'background-image: url("' + Config.serverAddress + '/photo/ST_QUESTION/' + question.photo[Globals.getLang()] + '"); background-repeat: none; background-size:cover;' }, [m("div", { class: "row survey-top-panel" }, [m("div", { class: "col-xs-12" }, m("h3", question.text[Globals.getLang()]))]), m("div", { class: "row screen-language__content" }, [langs.map(function (lang) {
                    return m("div", { class: "col-xs-12 col-sm-6" }, m("button", { class: "btn btn-default screen-language__lang-btn", "data-lang": lang.code, onclick: chooseLang }, lang.name));
                })])]);
            case 'error':
                return m("div", { class: "screen-language" }, [_errors.map(function (error) {
                    return m("p", { class: "error" }, error);
                })]);
        }
    }

    return {
        oninit: oninit,
        view: view
    };
};

},{"mithril":32}],19:[function(require,module,exports){
'use strict';

var m = require('mithril');
var R = require('../../../components/request.js');
var Helper = require('../../../components/helper.js');
module.exports = function (config) {
    var ResultModel = config.ResultModel;
    var question = config.question;
    var _state = 'default';
    var _nextQuestion = false;
    var _errors = [];

    var canvas = void 0;
    var context = void 0;

    function goPrev() {
        if (question.isFirst) {
            window.history.back();
        } else {
            ResultModel.remove(question.code);
            config.prev();
        }
    }

    function goNext() {
        ResultModel.set(question, question.answers[0].code, canvas.toDataURL());
        R.uploadImageBase64(Helper.getRandomInt(1000, 9999), 'ST_RESPONDENT', canvas.toDataURL()).then(function (data) {
            console.log(data);
        });
        config.next(_nextQuestion);
    }

    function clearCanvas() {
        context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    }

    function initCanvas(vnode) {
        canvas = document.querySelector('#canvas');
        context = canvas.getContext('2d');
        var container = $('#canvasContainer').height(parseInt($('#canvasContainer').width() / 1.5));
        canvas.width = parseInt(container.width());
        canvas.height = parseInt(container.height());

        // create a drawer which tracks touch movements
        var drawer = {
            isDrawing: false,
            touchstart: function touchstart(coors) {
                context.beginPath();
                context.moveTo(coors.x, coors.y);
                this.isDrawing = true;
            },
            touchmove: function touchmove(coors) {
                if (this.isDrawing) {
                    context.lineTo(coors.x, coors.y);
                    context.stroke();
                }
            },
            touchend: function touchend(coors) {
                if (this.isDrawing) {
                    this.touchmove(coors);
                    this.isDrawing = false;
                }
            }
        };
        // create a function to pass touch events and coordinates to drawer
        function draw(event) {
            var type = null;
            // map mouse events to touch events
            switch (event.type) {
                case "mousedown":
                    event.touches = [];
                    event.touches[0] = {
                        pageX: event.pageX,
                        pageY: event.pageY
                    };
                    type = "touchstart";
                    break;
                case "mousemove":
                    event.touches = [];
                    event.touches[0] = {
                        pageX: event.pageX,
                        pageY: event.pageY
                    };
                    type = "touchmove";
                    break;
                case "mouseup":
                    event.touches = [];
                    event.touches[0] = {
                        pageX: event.pageX,
                        pageY: event.pageY
                    };
                    type = "touchend";
                    break;
            }

            // touchend clear the touches[0], so we need to use changedTouches[0]
            var coors = void 0;
            if (event.type === "touchend") {
                coors = {
                    x: event.changedTouches[0].pageX - 4 * $('.paint-screen__content').offset().left,
                    y: event.changedTouches[0].pageY - $('.paint-screen__content').offset().top
                };
            } else {
                // get the touch coordinates
                coors = {
                    x: event.touches[0].pageX - 4 * $('.paint-screen__content').offset().left,
                    y: event.touches[0].pageY - $('.paint-screen__content').offset().top
                };
            }
            type = type || event.type;
            // pass the coordinates to the appropriate handler
            drawer[type](coors);
        }

        // detect touch capabilities
        var touchAvailable = 'createTouch' in document || 'ontouchstart' in window;

        // attach the touchstart, touchmove, touchend event listeners.
        if (touchAvailable) {
            canvas.addEventListener('touchstart', draw, false);
            canvas.addEventListener('touchmove', draw, false);
            canvas.addEventListener('touchend', draw, false);
        }
        // attach the mousedown, mousemove, mouseup event listeners.
        else {
                canvas.addEventListener('mousedown', draw, false);
                canvas.addEventListener('mousemove', draw, false);
                canvas.addEventListener('mouseup', draw, false);
            }

        // prevent elastic scrolling
        document.body.addEventListener('touchmove', function (event) {
            event.preventDefault();
        }, false); // end body.onTouchMove
    }

    ///////////////////////////////////////
    ///   COMPONENT LIFECYCLE METHODS   ///
    ///////////////////////////////////////

    function oninit() {
        try {
            _nextQuestion = question.answers[0].nextQuestion;
        } catch (error) {
            _errors.push('Отсутствуют варианты ответов!');
            _state = 'error';
        }
    }

    function view() {
        switch (_state) {
            case 'default':
                return m("div", { class: "container paint-screen survey-screen", style: 'background-image: url("' + Config.serverAddress + 'photo/ST_QUESTION/' + question.photo[Globals.getLang()] + '"); background-repeat: none; background-size:cover;' }, [m("div", { class: "row survey-top-panel" }, [m("div", { class: "col-xs-6 col-md-3" }, m("button", { class: "btn btn-default survey-prev-btn", onclick: goPrev }, "Назад")), m("div", { class: "col-xs-6 col-md-3 col-md-push-6" }, m("button", { class: "btn btn-default survey-next-btn", onclick: goNext }, "Вперед")), m("div", { class: "col-xs-12 col-md-6 col-md-pull-3 survey-top-panel__question-container" }, question.text[Globals.getLang()])]), m("div", { class: "row paint-screen__content" }, [m("div", { class: "col-xs-12" }, [m("div", { class: "paint-screen__canvas-container", id: "canvasContainer" }, [m("canvas", { id: "canvas", oncreate: initCanvas })]), m("div", { class: "" }, [m("button", { class: "btn btn-default paint-screen__clear-btn", onclick: clearCanvas }, 'Очистить')])])])]);
            case 'error':
                return m("div", { class: "screen-photo" }, [_errors.map(function (error) {
                    return m("p", { class: "error" }, error);
                })]);
        }
    }

    return {
        oninit: oninit,
        view: view
    };
};

},{"../../../components/helper.js":3,"../../../components/request.js":6,"mithril":32}],20:[function(require,module,exports){
'use strict';

var m = require('mithril');

module.exports = function (config) {
    var ResultModel = config.ResultModel;
    var question = config.question;
    var _state = 'default';
    var _photo = false;
    var _photoSrc = false;
    var _nextQuestion = false;
    var _errors = [];

    function photoChanged() {
        _photo = false;
        if (this.files && this.files[0]) {
            _photo = this.files[0];
            try {
                var reader = new FileReader();
                reader.onload = function (e) {
                    _photoSrc = e.target.result;
                    m.redraw();
                };
                reader.readAsDataURL(this.files[0]);
            } catch (error) {
                console.log('enanble create photo preview!');
            }
        }
    }

    function goPrev() {
        if (question.isFirst) {
            window.history.back();
        } else {
            ResultModel.remove(question.code);
            config.prev();
        }
    }

    function goNext() {
        if (_photo) {
            ResultModel.set(question, question.answers[0].code, _photo);
            config.next(_nextQuestion);
        } else {
            config.onAlert('Неверно заполнены поля', ['Сделайте фото!']);
        }
    }

    ///////////////////////////////////////
    ///   COMPONENT LIFECYCLE METHODS   ///
    ///////////////////////////////////////

    function oninit() {
        try {
            _nextQuestion = question.answers[0].nextQuestion;
        } catch (error) {
            _errors.push('Отсутствуют варианты ответов!');
            _state = 'error';
        }
    }

    function view() {
        switch (_state) {
            case 'default':
                return m("div", { class: "container photo-screen survey-screen", style: 'background-image: url("' + Config.serverAddress + 'photo/ST_QUESTION/' + question.photo[Globals.getLang()] + '"); background-repeat: none; background-size:cover;' }, [m("div", { class: "row survey-top-panel" }, [m("div", { class: "col-xs-6 col-md-3" }, m("button", { class: "btn btn-default survey-prev-btn", onclick: goPrev }, "Назад")), m("div", { class: "col-xs-6 col-md-3 col-md-push-6" }, m("button", { class: "btn btn-default survey-next-btn", onclick: goNext }, "Вперед")), m("div", { class: "col-xs-12 col-md-6 col-md-pull-3 survey-top-panel__question-container" }, question.text[Globals.getLang()])]), m("div", { class: "row photo-screen__content" }, [m("div", { class: "col-xs-12" }, [m("div", { class: "screen-photo__photo-container" }, [_photoSrc ? m("div", { class: "screen-photo__photo" }, [m("img", { src: _photoSrc })]) : m("div", { class: "screen-photo__photo_cap" }, ['Фото'])]), m("button", { class: "btn btn-primary screen-photo__input-btn" }, ['Сделать фото', m('span', { class: "glyphicon glyphicon-camera" }), m("input", { type: "file", accept: "image/*;capture=camera", capture: "camera", onchange: photoChanged })])])])]);
            case 'error':
                return m("div", { class: "screen-photo" }, [_errors.map(function (error) {
                    return m("p", { class: "error" }, error);
                })]);
        }
    }

    return {
        oninit: oninit,
        view: view
    };
};

},{"mithril":32}],21:[function(require,module,exports){
'use strict';

var m = require('mithril');
var Helper = require('../../../components/helper.js');

module.exports = function (config) {
    var ResultModel = config.ResultModel;
    var question = config.question;
    var _nextQuestion = false;

    var UserModel = {
        gender: false,
        birthdate: false,
        load: function load(data) {
            UserModel.gender = data.gender;
            UserModel.birthdate = data.birthdate;
        },
        setGender: function setGender() {
            UserModel.gender = this.getAttribute('data-gender');
        },
        setBirthdate: function setBirthdate() {
            UserModel.birthdate = this.value;
        },
        check: function check() {
            var messages = [];
            if (!UserModel.gender) {
                messages.push('Выберите пол!');
            }

            if (!UserModel.birthdate) {
                messages.push('Выберите дату рождения!');
            }

            return {
                isValid: messages.length === 0,
                messages: messages
            };
        }
    };

    function goPrev() {
        if (question.isFirst) {
            window.history.back();
        } else {
            ResultModel.remove(question.code);
            config.prev();
        }
    }

    function goNext() {
        var result = UserModel.check();
        if (result.isValid) {
            ResultModel.set(question, question.answers[0].code, { gender: UserModel.gender, birthdate: UserModel.birthdate });
            config.next(_nextQuestion);
        } else {
            config.onAlert('Неверно заполнены поля', result.messages);
        }
    }

    function datePicker(el) {
        $(el.dom).datepicker({
            format: 'dd-mm-yyyy',
            language: Globals.getLang(),
            autoclose: true,
            startView: 'years',
            minViewMode: 'days',
            endDate: '-21y',
            ignoreReadonly: true,
            allowInputToggle: true
        });
    }

    ///////////////////////////////////////
    ///   COMPONENT LIFECYCLE METHODS   ///
    ///////////////////////////////////////

    function oncreate() {}

    function oninit() {
        var data = ResultModel.get(question.code);
        if (data) {
            UserModel.load(data.result);
        }
        try {
            _nextQuestion = question.answers[0].nextQuestion;
        } catch (error) {
            _errors.push('Отсутствуют варианты ответов!');
            _state = 'error';
        }
    }

    function view() {
        return m("div", { class: "container register-birth-gender-screen survey-screen", style: 'background-image: url("' + Config.serverAddress + 'photo/ST_QUESTION/' + question.photo[Globals.getLang()] + '"); background-repeat: none; background-size:cover;' }, [m("div", { class: "row survey-top-panel" }, [m("div", { class: "col-xs-6 col-md-3" }, m("button", { class: "btn btn-default survey-prev-btn", onclick: goPrev }, "Назад")), m("div", { class: "col-xs-6 col-md-3 col-md-push-6" }, m("button", { class: "btn btn-default survey-next-btn", onclick: goNext }, "Вперед")), m("div", { class: "col-xs-12 col-md-6 col-md-pull-3 survey-top-panel__question-container" }, question.text[Globals.getLang()])]), m("div", { class: "row register-birth-gender-screen__content" }, [m("div", { class: "col-xs-12 col-md-6" }, [m("div", { class: "inner-addon right-addon register-birth-gender-screen__calendar-container" }, [m("i", { class: "glyphicon glyphicon-calendar" }, ''), m("input", { type: "text", class: "form-control", placeholder: "Дата рождения", oncreate: datePicker, value: UserModel.birthdate ? UserModel.birthdate : '', readonly: "true", onchange: UserModel.setBirthdate })])]), m("div", { class: "col-xs-12 col-md-6" }, [m("button", { class: "register-birth-gender-screen__gender-btn btn btn-default " + (UserModel.gender === 'man' ? 'active' : ''), "data-gender": "man", onclick: UserModel.setGender }, [m("i", { class: "fa fa-male", "aria-hidden": "true" })]), m("button", { class: "register-birth-gender-screen__gender-btn btn btn-default " + (UserModel.gender === 'woman' ? 'active' : ''), "data-gender": "woman", onclick: UserModel.setGender }, m("i", { class: "fa fa-female", "aria-hidden": "true" }))])])]);
    }

    return {
        oninit: oninit,
        oncreate: oncreate,
        view: view
    };
};

},{"../../../components/helper.js":3,"mithril":32}],22:[function(require,module,exports){
'use strict';

var m = require('mithril');
var Helper = require('../../../components/helper.js');
var R = require('../../../components/request.js');
var Modal = require('../../../components/modal-window/modal-window.js');

module.exports = function (config) {
    var ResultModel = config.ResultModel;
    var question = config.question;
    var _nextQuestion = false;

    var UserModel = {
        name: '',
        surname: '',
        phone: '',
        load: function load(data) {
            UserModel.name = data.name;
            UserModel.surname = data.surname;
            UserModel.phone = data.phone;
        },
        changeName: function changeName(value) {
            UserModel.name = value.trim();
        },
        changeSurname: function changeSurname(value) {
            UserModel.surname = value.trim();
        },
        changePhone: function changePhone(value) {
            UserModel.phone = value.replace(/[^0-9.]/g, "");
        },
        check: function check() {
            var messages = [];
            if (UserModel.name === '') {
                messages.push('Заполните имя!');
            }

            if (UserModel.surname === '') {
                messages.push('Заполните фамилию!');
            }

            var reg = new RegExp(/[0-9]{10}/);
            if (!reg.test(UserModel.phone)) {
                messages.push('Неверно заполнен телефон!');
                messages.push('Формат телефона "7771234567"');
            } else {
                var phonePreffixes = ['700', '701', '702', '705', '707', '708', '712', '713', '717', '718', '721', '725', '726', '727', '747', '750', '751', '760', '761', '762', '763', '764', '771', '775', '776', '777', '778'];
                var userPhonePreffix = UserModel.phone.substr(0, 3);
                if (phonePreffixes.indexOf(userPhonePreffix) === -1) {
                    messages.push('Неверный префикс оператора!');
                }
            }

            return {
                isValid: messages.length === 0,
                messages: messages
            };
        }
    };

    function goPrev() {
        if (question.isFirst) {
            window.history.back();
        } else {
            ResultModel.remove(question.code);
            config.prev();
        }
    }

    function goNext() {
        var result = UserModel.check();
        if (result.isValid) {
            ResultModel.set(question, question.answers[0].code, { name: UserModel.name, surname: UserModel.surname, phone: UserModel.phone });
            var message = 'Kod podtverzhdeniya: ' + config.sessionCode;

            if (Config.isSendMessage) {
                R.sendSMS(message, '+7' + UserModel.phone);
            }

            config.next(_nextQuestion);
        } else {
            config.onAlert('Неверно заполнены поля', result.messages);
        }
    }

    function selectImage() {
        _nextQuestion = parseInt(this.getAttribute('data-next'));
        _selected = parseInt(this.getAttribute('data-index'));
    }

    function createPhoneMask(el) {
        try {
            $(el.dom).mask("(999)-999-99-99", {
                completed: function completed() {
                    UserModel.changePhone(this.val().replace(/[^0-9.]/g, ""));
                }
            });
        } catch (error) {
            console.log(error);
        }
    }

    ///////////////////////////////////////
    ///   COMPONENT LIFECYCLE METHODS   ///
    ///////////////////////////////////////

    function oncreate() {}

    function oninit() {
        console.log(config);
        var data = ResultModel.get(question.code);
        if (data) {
            UserModel.load(data.result);
        }
        try {
            _nextQuestion = question.answers[0].nextQuestion;
        } catch (error) {
            _errors.push('Отсутствуют варианты ответов!');
            _state = 'error';
        }
    }

    function view() {
        return m("div", { class: "container register-name-screen survey-screen", style: 'background-image: url("' + Config.serverAddress + 'photo/ST_QUESTION/' + question.photo[Globals.getLang()] + '"); background-repeat: none; background-size:cover;' }, [m("div", { class: "row survey-top-panel" }, [m("div", { class: "col-xs-6 col-md-3" }, m("button", { class: "btn btn-default survey-prev-btn", onclick: goPrev }, "Назад")), m("div", { class: "col-xs-6 col-md-3 col-md-push-6" }, m("button", { class: "btn btn-default survey-next-btn", onclick: goNext }, "Вперед")), m("div", { class: "col-xs-12 col-md-6 col-md-pull-3 survey-top-panel__question-container" }, question.text[Globals.getLang()])]), m("div", { class: "row register-name-screen__content" }, [m("div", { class: "col-xs-12 col-md-6" }, [m("input", { class: "form-control", placeholder: "Введите имя", value: UserModel.name, onchange: m.withAttr("value", UserModel.changeName) })]), m("div", { class: "col-xs-12 col-md-6" }, [m("input", { class: "form-control", placeholder: "Введите фамилию", value: UserModel.surname, onchange: m.withAttr("value", UserModel.changeSurname) })]), m("div", { class: "col-xs-12" }, [m("input", { class: "form-control", type: "tel", placeholder: "Номер телефона", value: UserModel.phone, oninput: m.withAttr("value", UserModel.changePhone) })])])]);
    }

    return {
        oninit: oninit,
        oncreate: oncreate,
        view: view
    };
};

},{"../../../components/helper.js":3,"../../../components/modal-window/modal-window.js":5,"../../../components/request.js":6,"mithril":32}],23:[function(require,module,exports){
'use strict';

var m = require('mithril');

module.exports = function (config) {
    var ResultModel = config.ResultModel;
    var question = config.question;
    var _nextQuestion = false;
    var _listCombo = void 0;
    var _selected = false;
    var _search = '';

    function goPrev() {
        if (question.isFirst) {
            window.history.back();
        } else {
            ResultModel.remove(question.code);
            config.prev();
        }
    }

    function goNext() {
        if (_selected) {
            ResultModel.set(question, _selected, null);
            config.next(_nextQuestion);
        } else {
            config.onAlert('Ошибка', ['Выберите вариант ответа!']);
        }
    }

    function changeAnswer() {
        _selected = parseInt(this.getAttribute('data-code'));
        _nextQuestion = parseInt(this.getAttribute('data-next'));
    }

    function search(item) {
        var regExp = new RegExp(_search, "i");
        return item.text[Globals.getLang()].search(regExp) !== -1;
    }

    function searchChanged(value) {
        _search = value.trim();
    }

    function clearFilter() {
        _search = '';
    }

    ///////////////////////////////////////
    ///   COMPONENT LIFECYCLE METHODS   ///
    ///////////////////////////////////////

    function oninit() {}

    function view() {
        return m("div", { class: "container text-list-screen survey-screen", style: 'background-image: url("' + Config.serverAddress + 'photo/ST_QUESTION/' + question.photo[Globals.getLang()] + '"); background-repeat: none; background-size:cover;' }, [m("div", { class: "row survey-top-panel" }, [m("div", { class: "col-xs-6 col-md-3" }, m("button", { class: "btn btn-default survey-prev-btn", onclick: goPrev }, "Назад")), m("div", { class: "col-xs-6 col-md-3 col-md-push-6" }, m("button", { class: "btn btn-default survey-next-btn", onclick: goNext }, "Вперед")), m("div", { class: "col-xs-12 col-md-6 col-md-pull-3 survey-top-panel__question-container" }, question.text[Globals.getLang()])]), m("div", { class: "text-list-screen__content" }, [
        // m("div", {class: "row text-list-screen__search-container"}, [
        //     m("div", {class: "col-xs-12"}, [
        //         m("div", {class: "inner-addon right-addon text-list-screen__search-input-container"}, [
        //             m("i", {class: "glyphicon glyphicon-search"}),
        //             m("input", {class: "form-control text-list-screen__search-input", placeholder: "Фильтр", value: _search, oninput: m.withAttr("value", searchChanged)}),
        //         ]),
        //         m("button", {class: "btn btn-default visible-xs text-list-screen__clear-filter text-list-screen__clear-filter_small", onclick: clearFilter}, m("span", m.trust('&times;')) ),
        //         m("button", {class: "btn btn-default hidden-xs text-list-screen__clear-filter", onclick: clearFilter}, 'Очистить')
        //     ]),
        // ]),
        m("div", { class: "row" }, [m("div", { class: "col-xs-12" }, [m("ul", { class: "list-group" }, [question.answers.filter(search).map(function (answer) {
            return m("li", { class: "list-group-item " + (_selected === answer.code ? 'active' : ''), "data-code": answer.code, "data-next": answer.nextQuestion, onclick: changeAnswer }, answer.text[Globals.getLang()]);
        })])])])])]);
    }

    return {
        oninit: oninit,
        view: view
    };
};

},{"mithril":32}],24:[function(require,module,exports){
'use strict';

var m = require('mithril');

module.exports = function (config) {
    var ResultModel = config.ResultModel;
    var question = config.question;
    var _nextQuestion = false;

    function valueChanged() {
        _nextQuestion = parseInt(this.value);
    }

    function goPrev() {
        if (question.isFirst) {
            window.history.back();
        } else {
            ResultModel.remove(question.code);
            config.prev();
        }
    }

    function goNext() {
        if (_nextQuestion) {
            ResultModel.set(question, question.answers[0].code, null);
            config.next(_nextQuestion);
        } else {
            alert("Выберите вариант ответа!");
        }
    }

    ///////////////////////////////////////
    ///   COMPONENT LIFECYCLE METHODS   ///
    ///////////////////////////////////////

    function view() {
        return m("div", { class: "container survey-screen", style: 'min-height: 600px; background-image: url("http://89.106.232.34:1080/photo/ST_QUESTION/' + question.photo[Globals.getLang()] + '"); background-repeat: none; background-size:cover;' }, [m("div", { class: "row survey-top-panel" }, [m("div", { class: "col-xs-6 col-md-3" }, m("button", { class: "btn btn-default survey-prev-btn", onclick: goPrev }, "Назад")), m("div", { class: "col-xs-6 col-md-3 col-md-push-6" }, m("button", { class: "btn btn-default survey-next-btn", onclick: goNext }, "Вперед")), m("div", { class: "col-xs-12 col-md-6 col-md-pull-3 survey-top-panel__question-container" }, [m("h3", question.text[[Globals.getLang()]]), '(Unknown question type "' + question.typeName + '"(' + question.typeCode + ') )'])]), m("div", { class: "row" }, [m("div", { class: "btn-group", "data-toggle": "buttons" }, [question.answers.map(function (answer) {
            return m("label", { class: "btn " + (_nextQuestion === answer.nextQuestion ? 'btn-primary' : 'btn-default') }, [m("input", { type: "radio", name: "question-answer", value: answer.nextQuestion, onchange: valueChanged }), answer.text[Globals.getLang()]]);
        })])])]);
    }

    return {
        view: view
    };
};

},{"mithril":32}],25:[function(require,module,exports){
'use strict';

var m = require('mithril');

module.exports = function (config) {
    var ResultModel = config.ResultModel;
    var question = config.question;
    var _state = 'default';
    var _videoViewed = false;
    var _nextQuestion = false;
    var _errors = [];
    var _videoPlayer = void 0;
    var _playerWidth = false;
    var _playerHeight = false;

    function removeOldPlayer() {
        try {
            var oldPlayer = document.getElementById('surveyVideo');
            videojs(oldPlayer).dispose();
        } catch (error) {
            console.log(error);
        }
    }

    function goPrev() {
        removeOldPlayer();
        if (question.isFirst) {
            window.history.back();
        } else {
            ResultModel.remove(question.code);
            config.prev();
        }
    }

    function goNext() {
        if (_videoViewed) {
            removeOldPlayer();
            ResultModel.set(question, question.answers[0].code, null);
            config.next(_nextQuestion);
        } else {
            alert('Пожалуйста, досмотрите видео до конца.');
        }
    }

    function initPlayer(vnode) {
        try {
            _videoPlayer = videojs('surveyVideo', {
                controlBar: {
                    progressControl: false
                },
                // autoplay: true,
                width: _playerWidth,
                height: _playerHeight,
                volume: 0.2
            });
            _videoPlayer.volume(0.2);
            _videoPlayer.ready(function () {
                this.play();
            });

            _videoPlayer.on("ended", function () {
                try {
                    if (document.exitFullscreen) document.exitFullscreen();else if (document.webkitExitFullscreen) document.webkitExitFullscreen();else if (document.mozCancelFullScreen) document.mozCancelFullScreen();else if (document.msExitFullscreen) document.msExitFullscreen();
                } catch (error) {
                    console.log(error);
                }
                _videoViewed = true;
            });

            _videoPlayer.on("play", function () {});
        } catch (error) {
            _videoViewed = true;
        }
    }

    ///////////////////////////////////////
    ///   COMPONENT LIFECYCLE METHODS   ///
    ///////////////////////////////////////

    function oninit() {
        try {
            _nextQuestion = question.answers[0].nextQuestion;
        } catch (error) {
            _errors.push('Отсутствуют варианты ответов!');
            _state = 'error';
        }
    }

    function oncreate(vnode) {
        _playerWidth = $('.vidoe-screen__video-container').width();
        _playerHeight = _playerWidth * 0.4;

        $(window).resize(function () {
            _playerWidth = $('.vidoe-screen__video-container').width();
            _playerHeight = _playerWidth * 0.4;
            _videoPlayer.width(_playerWidth);
            _videoPlayer.height(_playerHeight);
        });
        m.redraw();
    }

    function view() {
        switch (_state) {
            case 'default':
                return m("div", { class: "container video-screen survey-screen" }, [m("div", { class: "row survey-top-panel" }, [m("div", { class: "col-xs-6 col-md-3" }, m("button", { class: "btn btn-default survey-prev-btn", onclick: goPrev }, "Назад")), m("div", { class: "col-xs-6 col-md-3 col-md-push-6" }, m("button", { class: "btn btn-default survey-next-btn", onclick: goNext }, "Вперед")), m("div", { class: "col-xs-12 col-md-6 col-md-pull-3 survey-top-panel__question-container" }, question.text[Globals.getLang()])]), m("div", { class: "row vidoe-screen__content" }, [m("div", { class: "col-xs-12" }, [m("div", { class: "vidoe-screen__video-container", oncreate: initPlayer }, [m("video", {
                    id: "surveyVideo",
                    class: "video-js vjs-default-skin vjs-big-play-centered",
                    width: _playerWidth ? _playerWidth : 'auto',
                    height: _playerHeight ? _playerHeight : 'auto',
                    controls: true,
                    preload: "auto",
                    autoplay: true,
                    poster: "",
                    "data-setup": '{}'
                }, [m("source", { src: Config.serverAddress + "photo/ST_QUESTION/" + question.photo[Globals.getLang()], type: "video/mp4" }), m("p", { class: "vjs-no-js" }, ['To view this video please enable JavaScript, and consider upgrading to a web browser that', m("a", { href: "http://videojs.com/html5-video-support/", target: "_blank" }, 'supports HTML5 video')])])])])])]);
            case 'error':
                return m("div", { class: "screen-photo" }, [_errors.map(function (error) {
                    return m("p", { class: "error" }, error);
                })]);
        }
    }

    return {
        oninit: oninit,
        oncreate: oncreate,
        view: view
    };
};

},{"mithril":32}],26:[function(require,module,exports){
'use strict';

var m = require('mithril');
var R = require('../../components/request.js');
var MenuModule = require('../../modules/menu/menu.js');
var Modal = require('../../components/modal-window/modal-window.js');
var LoadingModal = require('../../components/modal-window/loading-modal-window.js');
module.exports = function () {
    var _state = 'loading';
    var _errors = [];
    var Menu = void 0;
    var _modal = false;
    var _history = [];

    var Model = {
        password: '',
        passwordConfirm: '',
        setPassword: function setPassword(value) {
            Model.password = value;
        },
        setConfirmPassword: function setConfirmPassword(value) {
            Model.passwordConfirm = value;
        },
        save: function save() {
            var errors = [];
            if (Model.password !== Model.passwordConfirm) {
                errors.push('Пароли не совпадают!');
            }

            if (Model.password.length < 4) {
                errors.push('Пароль не может быть короче 4 символов!');
            }

            if (errors.length > 0) {
                _modal = new Modal({
                    id: 'alertModal',
                    state: 'show',
                    header: 'Изменение пароля',
                    content: [m("div", { style: "text-align: left;" }, [m("p", { class: "" }, m("strong", 'Возникли ошибки при измениии пароля!')), errors.map(function (error) {
                        return m("p", { class: "" }, error);
                    })])],
                    isStatic: false,
                    isFooter: true,
                    isFullScreen: false,
                    modalSizeParams: { width: '90%', height: false, padding: '15% 0 0 0' },
                    zIndex: 1005,
                    cancelBtn: 'none',
                    confirmBtn: 'Ок',
                    onConfirm: function onConfirm() {
                        _modal = false;
                    },
                    onCancel: function onCancel() {
                        _modal = false;
                    }
                });
            } else {
                R.update('ST_USER', "USE_PASSWORD = '" + Model.password + "'", "USE_CODE = " + Globals.user('USE_CODE')).then(function () {
                    _modal = new Modal({
                        id: 'alertModal',
                        state: 'show',
                        header: 'Изменение пароля',
                        content: [m("div", { style: "text-align: left;" }, ['Пароль успешно изменен!'])],
                        isStatic: false,
                        isFooter: true,
                        isFullScreen: false,
                        modalSizeParams: { width: '90%', height: false, padding: '15% 0 0 0' },
                        zIndex: 1005,
                        cancelBtn: 'none',
                        confirmBtn: 'Ок',
                        onConfirm: function onConfirm() {
                            _modal = false;
                        },
                        onCancel: function onCancel() {
                            _modal = false;
                        }
                    });
                    m.redraw();
                }).catch(function (error) {
                    throw new Error(error.message);
                });
            }
        }
    };

    function refreshUserScore() {
        return R.execQuery('EXEC ADJREC_SCORE_CALCULATE');
    }

    function getUserData() {
        return R.get('*', 'VIEW_AUTHENTICATION', "WHERE USE_CODE = " + Globals.user("USE_CODE")).then(function (data) {
            Globals.setUser(data);
        });
    }

    function loadOperationHistory() {
        return R.get('*', 'VIEW_ST_USER_OPERATION', "WHERE VIS_USE_CODE = " + Globals.user('USE_CODE'), "VIS_START_DATE DESC").then(function (data) {
            data.map(function (operation) {
                _history.push({ name: operation['SUR_NAME'], date: operation['VIS_START_DATE'] });
            });
        });
    }

    ///////////////////////////////////////
    ///   COMPONENT LIFECYCLE METHODS   ///
    ///////////////////////////////////////

    function oninit() {
        Menu = new MenuModule();
        refreshUserScore().then(getUserData).then(loadOperationHistory).then(function (data) {
            _state = 'loaded';
            m.redraw();
        }).catch(function (error) {
            console.log(error);
            _errors.push(error.message);
            _state = 'error';
            m.redraw();
        });
    }

    function view() {
        switch (_state) {
            case 'loading':
                return m("div", { class: "container p-home" }, [m(new LoadingModal({}))]);
            case 'loaded':
                return m("div", { class: "container p-home" }, [m(Menu), m("div", { class: "row" }, [m("div", { class: "col-sm-12" }, [m("div", { class: "p-home__header-container" }, [m("span", { class: "glyphicon glyphicon-user", "aria-hidden": "true" }), m("h3", { class: "p-home__header" }, 'Личный кабинет')]), m("div", { class: "p-home__user-points-container component-container" }, [m("h3", { class: "p-home__container-header" }, 'Кошелек'), m("p", { class: "" }, 'Ваши баллы: ' + Globals.user('USE_SCORE')), m("button", { class: "btn btn-link p-home__history-btn", "data-toggle": "collapse", "data-target": "#historyCollapse", "aria-expanded": "false", "aria-controls": "historyCollapse" }, 'История операций'), m("div", { class: "collapse", id: "historyCollapse" }, [m("ul", { class: "list-group p-home__operation-item" }, [_history.map(function (operation) {
                    return m("li", { class: "list-group-item p-home__operation-item" }, [m("strong", operation.name), m("span", { class: "p-home__operation-item-date" }, operation.date)]);
                })])])]), m("div", { class: "p-home__user-settings-container component-container clearfix" }, [m("h3", { class: "p-home__container-header" }, 'Настройки'), m("div", { class: "form-group" }, [m("label", { for: "password" }, "Новый пароль"), m("input", { type: "password", class: "form-control", id: "password", onchange: m.withAttr('value', Model.setPassword) })]), m("div", { class: "form-group" }, [m("label", { for: "password" }, "Подтверждение пароля"), m("input", { type: "password", class: "form-control", id: "password", onchange: m.withAttr('value', Model.setConfirmPassword) })]), m("button", { class: "btn btn-primary p-home__change-password-btn", onclick: Model.save }, 'Изменить пароль')])])]), _modal ? m(_modal) : '']);
            case 'error':
                return m("div", { class: "container p-home" }, [_errors.map(function (error) {
                    return m("p", error);
                })]);
        }
    }

    return {
        oninit: oninit,
        view: view
    };
};

},{"../../components/modal-window/loading-modal-window.js":4,"../../components/modal-window/modal-window.js":5,"../../components/request.js":6,"../../modules/menu/menu.js":8,"mithril":32}],27:[function(require,module,exports){
'use strict';

var m = require('mithril');
var R = require('../../components/request.js');
var SurveyLandingModule = require('../../modules/survey-landing/survey-landing.js');
module.exports = function () {
    var surveyModule = false;

    function oninit() {
        var surCode = m.route.param('code');
        surveyModule = new SurveyLandingModule({
            survey: surCode,
            afterSave: function afterSave() {
                m.route.set('/list');
            }
        });
    }

    function view() {
        return m("div", { class: "p-survey" }, [surveyModule ? m(surveyModule) : '']);
    }

    return {
        oninit: oninit,
        view: view
    };
};

},{"../../components/request.js":6,"../../modules/survey-landing/survey-landing.js":12,"mithril":32}],28:[function(require,module,exports){
'use strict';

var m = require('mithril');
var R = require('../../components/request.js');
var Modal = require('../../components/modal-window/modal-window.js');
module.exports = function () {
    var restoreModal = false;
    var Alert = false;
    var _authError = false;
    var UserModel = {
        phone: '7777777777',
        password: '111',
        changePhone: function changePhone(value) {
            _authError = false;
            UserModel.phone = value.replace(/[^0-9.]/g, "");
        },
        changePassword: function changePassword(value) {
            _authError = false;
            UserModel.password = value;
        }
    };
    var _isLogging = false;

    function createPhoneMask(el) {
        try {
            $(el.dom).mask("(999)-999-99-99", {
                completed: function completed() {
                    UserModel.changePhone(this.val().replace(/[^0-9.]/g, ""));
                }
            });
        } catch (error) {
            console.log(error);
        }
    }

    function getCoordinatesSuccess(position) {
        Globals.setCoordinates(position.coords.latitude, position.coords.longitude);
    }

    function getCoordinatesError(error) {
        console.log('Unable get coordinates from this device');
    }

    function auth() {
        _isLogging = true;
        R.login(UserModel.phone, UserModel.password).then(function (data) {
            Globals.setToken(data.token);
            R.get('*', 'VIEW_AUTHENTICATION', "WHERE USE_LOGIN = '" + UserModel.phone + "' AND USE_PASSWORD = '" + UserModel.password + "'").then(function (data) {
                Globals.setUser(data);
                Globals.setAuth(true);
                m.route.set('/list');
            }).catch(function (e) {
                console.error('Unable get user data!');
                console.error(e);
                _isLogging = false;
                _authError = true;
                m.redraw();
            });
            // try {
            //     navigator.geolocation.getCurrentPosition(getCoordinatesSuccess, getCoordinatesError);
            // } catch (error) {
            //     console.log('Unable get coordinates from this device');
            // }
        }).catch(function (e) {
            console.error('Auth error!');
            console.error(e);
            _isLogging = false;
            _authError = true;
            m.redraw();
        });
    }

    function passwordSend() {
        restoreModal = new Modal({
            id: 'restoreModal',
            state: 'show',
            header: 'Восстановление пароля',
            content: [m("div", { class: "some-content" }, [m("p", { class: "" }, 'Пароль будет выслан Вам в телефонном сообщении.')])],
            isStatic: false,
            isFooter: true,
            isFullScreen: false,
            modalSizeParams: { width: '90%', height: false, padding: '15% 0 0 0' },
            zIndex: 1005,
            cancelBtn: 'none',
            confirmBtn: 'Ок',
            onConfirm: function onConfirm() {
                restoreModal = false;
            },
            onCancel: function onCancel() {
                restoreModal = false;
            }
        });
    }

    function createPhoneMask(el) {
        try {
            $(el.dom).mask("(999)-999-99-99", { completed: function completed() {
                    UserModel.changePhone(this.val().replace(/[^0-9.]/g, ""));
                } });
        } catch (error) {
            alert(error);
        }
    }

    function restore() {
        restoreModal = new Modal({
            id: 'restoreModal',
            state: 'show',
            header: 'Восстановление пароля',
            content: [m("div", { class: "some-content" }, [m("input", { type: 'tel', class: "form-control", placeholder: "Номер телефона", value: UserModel.phone }), m("button", { class: "btn btn-default form-control", onclick: passwordSend, style: "margin-top: 10px;" }, 'Получить пароль')])],
            isStatic: false,
            isFooter: true,
            isFullScreen: false,
            modalSizeParams: { width: '90%', height: false, padding: '15% 0 0 0' },
            zIndex: 1005,
            cancelBtn: 'none',
            confirmBtn: 'Отмена',
            onConfirm: function onConfirm() {
                restoreModal = false;
            },
            onCancel: function onCancel() {
                restoreModal = false;
            }
        });
    }

    ///////////////////////////////////////
    ///   COMPONENT LIFECYCLE METHODS   ///
    ///////////////////////////////////////

    function oninit() {
        //auth();
    }

    function view() {
        return m("div", { class: "container p-login" }, [m("div", { class: "row p-login__header" }, [m("div", { class: "col-sm-12" }, m("h3", { class: "p-login__header-text" }, 'Shop 360'))]), m("div", { class: "row p-login__auth-form" }, [m("div", { class: "col-sm-12" }, m("div", { class: "input-group p-login__phone-container" }, [m("span", { class: "input-group-addon" }, '+7'), m("input", { type: "tel", class: "form-control", placeholder: "Номер телефона", oninput: m.withAttr("value", UserModel.changePhone), value: UserModel.phone })])), m("div", { class: "col-sm-12" }, m("input", { type: "password", class: "form-control p-login__password", placeholder: "Пароль", oninput: m.withAttr("value", UserModel.changePassword), value: UserModel.password })), m("div", { class: "col-sm-12" }, m("button", { class: "btn btn-default form-control p-login__auth-btn", disabled: UserModel.phone === '' || _isLogging, onclick: auth }, 'Войти'), _authError ? m("div", { class: "alert alert-danger", role: "alert", style: "margin: 10px 0 0 0; padding: 10px;" }, [m("span", { class: "glyphicon glyphicon-exclamation-sign", "aria-hidden": "true" }), 'Неверный логин или пароль!']) : ''), m("div", { class: "col-sm-12" }, m("button", { class: "btn btn-link p-login__restore-password", onclick: restore }, 'Забыли пароль?'))]), restoreModal ? m(restoreModal) : '', Alert ? m(Alert) : '']);
    }

    return {
        oninit: oninit,
        view: view
    };
};

},{"../../components/modal-window/modal-window.js":5,"../../components/request.js":6,"mithril":32}],29:[function(require,module,exports){
'use strict';

var m = require('mithril');
var R = require('../../components/request.js');
var MenuModule = require('../../modules/menu/menu.js');
var Modal = require('../../components/modal-window/modal-window.js');
var LoadingModal = require('../../components/modal-window/loading-modal-window.js');
module.exports = function () {
    var _state = 'loading';
    var _errors = [];
    var Menu = void 0;
    var _messages = [];
    var _modal = false;

    function removeMessage(message) {
        message['USM_IS_READEN'] = 1;
        R.update('ST_USER_MESSAGE', 'USM_IS_READEN = 1', "USM_CODE = " + message['USM_CODE']);
    }

    function showMessage() {
        var index = this.getAttribute('data-index');
        var message = _messages[index];
        _modal = new Modal({
            id: 'alertModal',
            state: 'show',
            header: message['USM_HEADER'],
            content: [m("div", { style: "text-align: left;" }, [message['USM_TEXT']])],
            isStatic: false,
            isFooter: true,
            isFullScreen: false,
            modalSizeParams: { width: '90%', height: false, padding: '15% 0 0 0' },
            zIndex: 1005,
            cancelBtn: 'none',
            confirmBtn: 'Ок',
            onConfirm: function onConfirm() {
                _modal = false;
                removeMessage(message);
            },
            onCancel: function onCancel() {
                _modal = false;
                removeMessage(message);
            }
        });
    }

    ///////////////////////////////////////
    ///   COMPONENT LIFECYCLE METHODS   ///
    ///////////////////////////////////////

    function oninit() {
        Menu = new MenuModule();
        R.get('*', 'VIEW_ST_USER_MESSAGE', "WHERE USM_USE_CODE = " + Globals.user("USE_CODE"), "USM_CODE DESC").then(function (data) {
            _messages = data;
            _state = 'loaded';
            m.redraw();
        }).catch(function (error) {
            _errors.push(error.message);
            _state = 'error';
            m.redraw();
        });
    }

    function view() {
        switch (_state) {
            case 'loading':
                return m("div", { class: "container p-messages" }, [m(new LoadingModal({}))]);
            case 'loaded':
                return m("div", { class: "container p-messages" }, [m(Menu), m("div", { class: "row" }, [m("div", { class: "col-sm-12" }, [m("div", { class: "p-messages__header-container" }, [m("span", { class: "glyphicon glyphicon-envelope", "aria-hidden": "true" }), m("h3", { class: "p-messages__header" }, 'Сообщения')]), _messages.map(function (message, index) {
                    return m("div", { class: "p-messages__message-item component-container " + (message['USM_IS_READEN'] == 1 ? "p-messages__message-item_readen" : "") }, [m("div", { class: "p-messages__message-item-header" }, [m("h3", message['USM_HEADER']), m("span", message['USM_CREATE'])]), m("p", message['USM_ANNOTATION']), m("div", { class: "p-messages__message-item-link-container" }, m("button", { class: "btn btn-link p-messages__message-item-link", "data-index": index, onclick: showMessage }, 'Читать'))]);
                })])]), _modal ? m(_modal) : '']);
            case 'error':
                return m("div", { class: "container p-home" }, [_errors.map(function (error) {
                    return m("p", error);
                })]);
        }
    }

    return {
        oninit: oninit,
        view: view
    };
};

},{"../../components/modal-window/loading-modal-window.js":4,"../../components/modal-window/modal-window.js":5,"../../components/request.js":6,"../../modules/menu/menu.js":8,"mithril":32}],30:[function(require,module,exports){
'use strict';

var m = require('mithril');
var R = require('../../components/request.js');
var MenuModule = require('../../modules/menu/menu.js');
var AlertModule = require('../../modules/alert/alert.js');
var LoadingModal = require('../../components/modal-window/loading-modal-window.js');
module.exports = function () {
    var _state = 'loading';
    var _errors = [];
    var _surveyList = [];
    var _trainingList = [];
    var _one2oneList = [];
    var loadingModal = false;
    var Menu = void 0;
    var Alert = void 0;

    function loadSurvey() {
        var surCode = this.getAttribute('data-code');
        m.route.set('/survey/' + surCode);
    }

    function loadSurveys() {
        return R.get('*', "VIEW_ST_USER_SURVEY", "WHERE SUR_IS_PROMO <> 1 AND SUR_IS_TRAINING <> 1 AND USS_USE_CODE = " + Globals.user("USE_CODE")).then(function (data) {
            _surveyList = data;
        });
    }

    function loadTraining() {
        return R.get('*', "VIEW_ST_USER_SURVEY", "WHERE SUR_IS_TRAINING = 1 AND USS_USE_CODE = " + Globals.user("USE_CODE")).then(function (data) {
            _trainingList = data;
        });
    }

    function load_1_2_1() {
        return R.get('*', "VIEW_ST_USER_SURVEY", "WHERE  SUR_IS_PROMO = 1 AND USS_USE_CODE = " + Globals.user("USE_CODE")).then(function (data) {
            _one2oneList = data;
            _state = 'loaded';
        });
    }

    ///////////////////////////////////////
    ///   COMPONENT LIFECYCLE METHODS   ///
    ///////////////////////////////////////

    function oninit() {
        loadingModal = new LoadingModal({
            header: "Загрузка данных"
        });

        Menu = new MenuModule();
        Promise.all([loadSurveys(), loadTraining(), load_1_2_1()]).then(function () {
            m.redraw();
        }).catch(function (error) {
            _errors.push('Ошибка загрузки списка');
            _errors.push(error.message);
            _state = 'error';
            m.redraw();
        });

        Alert = new AlertModule({
            interval: 3000
        });
    }

    function view() {
        switch (_state) {
            case 'loading':
                return m("div", { class: "container p-survey-list" }, [m(loadingModal)]);
            case 'loaded':
                return m("div", { class: "container p-survey-list" }, [m(Menu), m("div", { class: "row" }, [m("div", { class: "col-sm-12" }, [m("div", { class: "p-survey-list__header-container" }, [m("span", { class: "glyphicon glyphicon-list", "aria-hidden": "true" }), m("h3", { class: "p-survey-list__header" }, 'Задачи')]), m("div", { class: "list-group" }, [_surveyList.map(function (surveyObj) {
                    var btnName = 'Приступить';

                    if (surveyObj['SUR_ALLOWED'] == 0) {
                        btnName = 'Будет доступно ' + surveyObj['SUR_ALLOW_DATE'];
                    }

                    if (surveyObj['SUR_PROGRESS'] >= surveyObj['SUR_COMPLETE_COUNT']) {
                        btnName = 'Задача выполнена';
                    }

                    return m("div", { class: "p-survey-list__survey-item clearfix" }, [m("div", { class: "p-survey-list__survey-item-header-container" }, m("h3", { class: "p-survey-list__survey-item-header" }, surveyObj['SUR_NAME'])), m("div", { class: "p-survey-list__survey-item-desc" }, 'Описание программы "' + surveyObj['SUR_NAME'] + '"'), m("div", { class: "p-survey-list__survey-item-rate-container" }, m("span", '+' + surveyObj['SUR_COMPLETE_SCORE'])), m("div", { class: "p-survey-list__survey-item-bottom" }, [m("div", { class: "p-survey-list__survey-item-progress" }, ['Выполнено ', m("strong", surveyObj['SUR_PROGRESS']), ' из ', m("strong", surveyObj['SUR_COMPLETE_COUNT'])]), m("button", { class: "btn btn-primary p-survey-list__survey-item-start-btn", "data-code": surveyObj['SUR_CODE'], disabled: surveyObj['SUR_ALLOWED'] == 0 || surveyObj['SUR_PROGRESS'] >= surveyObj['SUR_COMPLETE_COUNT'], onclick: loadSurvey }, btnName)])]);
                })])]), m("div", { class: "col-sm-12" + (_trainingList.length === 0 ? " hidden" : "") }, [m("div", { class: "p-survey-list__header-container" }, [m("span", { class: "glyphicon glyphicon-education", "aria-hidden": "true" }), m("h3", { class: "p-survey-list__header" }, 'Обучение')]), m("div", { class: "list-group" }, [_trainingList.map(function (surveyObj) {
                    var btnName = 'Приступить';
                    if (surveyObj['SUR_ALLOWED'] == 0) {
                        btnName = 'Будет доступно ' + surveyObj['SUR_ALLOW_DATE'];
                    }

                    if (surveyObj['SUR_PROGRESS'] >= surveyObj['SUR_COMPLETE_COUNT']) {
                        btnName = 'Задача выполнена';
                    }

                    return m("div", { class: "p-survey-list__survey-item clearfix" }, [m("div", { class: "p-survey-list__survey-item-header-container" }, m("h3", { class: "p-survey-list__survey-item-header" }, surveyObj['SUR_NAME'])), m("div", { class: "p-survey-list__survey-item-desc" }, 'Описание программы "' + surveyObj['SUR_NAME'] + '"'), m("div", { class: "p-survey-list__survey-item-rate-container" }, m("span", '+' + surveyObj['SUR_COMPLETE_SCORE'])), m("div", { class: "p-survey-list__survey-item-bottom" }, [m("div", { class: "p-survey-list__survey-item-progress" }, ['Выполнено ', m("strong", surveyObj['SUR_PROGRESS']), ' из ', m("strong", surveyObj['SUR_COMPLETE_COUNT'])]), m("button", { class: "btn btn-primary p-survey-list__survey-item-start-btn", "data-code": surveyObj['SUR_CODE'], disabled: surveyObj['SUR_ALLOWED'] == 0 || surveyObj['SUR_PROGRESS'] >= surveyObj['SUR_COMPLETE_COUNT'], onclick: loadSurvey }, btnName)])]);
                })])]), m("div", { class: "col-sm-12" + (_one2oneList.length === 0 ? " hidden" : "") }, [m("div", { class: "p-survey-list__header-container" }, [
                // m("span", {class: "glyphicon glyphicon-education", "aria-hidden": "true"}),
                m("h3", { class: "p-survey-list__header" }, 'Опрос клиента')]), m("div", { class: "list-group" }, [_one2oneList.map(function (surveyObj) {
                    var btnName = 'Приступить';
                    if (surveyObj['SUR_ALLOWED'] == 0) {
                        btnName = 'Будет доступно ' + surveyObj['SUR_ALLOW_DATE'];
                    }

                    if (surveyObj['SUR_PROGRESS'] >= surveyObj['SUR_COMPLETE_COUNT']) {
                        btnName = 'Задача выполнена';
                    }

                    return m("div", { class: "p-survey-list__survey-item clearfix" }, [m("div", { class: "p-survey-list__survey-item-header-container" }, m("h3", { class: "p-survey-list__survey-item-header" }, surveyObj['SUR_NAME'])), m("div", { class: "p-survey-list__survey-item-desc" }, 'Описание программы "' + surveyObj['SUR_NAME'] + '"'), m("div", { class: "p-survey-list__survey-item-rate-container" }, m("span", '+' + surveyObj['SUR_COMPLETE_SCORE'])), m("div", { class: "p-survey-list__survey-item-bottom" }, [m("div", { class: "p-survey-list__survey-item-progress" }, ['Выполнено ', m("strong", surveyObj['SUR_PROGRESS']), ' из ', m("strong", surveyObj['SUR_COMPLETE_COUNT'])]), m("button", { class: "btn btn-primary p-survey-list__survey-item-start-btn", "data-code": surveyObj['SUR_CODE'], disabled: surveyObj['SUR_ALLOWED'] == 0 || surveyObj['SUR_PROGRESS'] >= surveyObj['SUR_COMPLETE_COUNT'], onclick: loadSurvey }, btnName)])]);
                })])])]), m(Alert)]);
            case 'error':
                return m("div", { class: "container p-survey-list" }, [_errors.map(function (error) {
                    return m("p", error);
                })]);
        }
    }

    return {
        oninit: oninit,
        view: view
    };
};

},{"../../components/modal-window/loading-modal-window.js":4,"../../components/request.js":6,"../../modules/alert/alert.js":7,"../../modules/menu/menu.js":8,"mithril":32}],31:[function(require,module,exports){
'use strict';

var m = require('mithril');
var SurveyPage = require('./pages/landing/landing.js');
var LoginPage = require('./pages/login/login.js');
var SurveyListPage = require('./pages/survey-list/survey-list.js');
var MessagePage = require('./pages/messages/messages.js');
var HomePage = require('./pages/home/home.js');
module.exports = function () {
    function route(module) {
        return {
            onmatch: function onmatch(arg, path) {
                if (!Globals.isAuth()) {
                    return m.route.set('/login');
                }
                return module;
            }
        };
    }

    return {
        "/login": LoginPage,
        "/list": route(SurveyListPage),
        "/survey/:code": route(SurveyPage),
        "/messages": route(MessagePage),
        "/home": route(HomePage)
    };
};

},{"./pages/home/home.js":26,"./pages/landing/landing.js":27,"./pages/login/login.js":28,"./pages/messages/messages.js":29,"./pages/survey-list/survey-list.js":30,"mithril":32}],32:[function(require,module,exports){
(function (global){
;(function() {
"use strict"
function Vnode(tag, key, attrs0, children, text, dom) {
	return {tag: tag, key: key, attrs: attrs0, children: children, text: text, dom: dom, domSize: undefined, state: undefined, _state: undefined, events: undefined, instance: undefined, skip: false}
}
Vnode.normalize = function(node) {
	if (Array.isArray(node)) return Vnode("[", undefined, undefined, Vnode.normalizeChildren(node), undefined, undefined)
	if (node != null && typeof node !== "object") return Vnode("#", undefined, undefined, node === false ? "" : node, undefined, undefined)
	return node
}
Vnode.normalizeChildren = function normalizeChildren(children) {
	for (var i = 0; i < children.length; i++) {
		children[i] = Vnode.normalize(children[i])
	}
	return children
}
var selectorParser = /(?:(^|#|\.)([^#\.\[\]]+))|(\[(.+?)(?:\s*=\s*("|'|)((?:\\["'\]]|.)*?)\5)?\])/g
var selectorCache = {}
var hasOwn = {}.hasOwnProperty
function compileSelector(selector) {
	var match, tag = "div", classes = [], attrs = {}
	while (match = selectorParser.exec(selector)) {
		var type = match[1], value = match[2]
		if (type === "" && value !== "") tag = value
		else if (type === "#") attrs.id = value
		else if (type === ".") classes.push(value)
		else if (match[3][0] === "[") {
			var attrValue = match[6]
			if (attrValue) attrValue = attrValue.replace(/\\(["'])/g, "$1").replace(/\\\\/g, "\\")
			if (match[4] === "class") classes.push(attrValue)
			else attrs[match[4]] = attrValue === "" ? attrValue : attrValue || true
		}
	}
	if (classes.length > 0) attrs.className = classes.join(" ")
	return selectorCache[selector] = {tag: tag, attrs: attrs}
}
function execSelector(state, attrs, children) {
	var hasAttrs = false, childList, text
	var className = attrs.className || attrs.class
	for (var key in state.attrs) {
		if (hasOwn.call(state.attrs, key)) {
			attrs[key] = state.attrs[key]
		}
	}
	if (className !== undefined) {
		if (attrs.class !== undefined) {
			attrs.class = undefined
			attrs.className = className
		}
		if (state.attrs.className != null) {
			attrs.className = state.attrs.className + " " + className
		}
	}
	for (var key in attrs) {
		if (hasOwn.call(attrs, key) && key !== "key") {
			hasAttrs = true
			break
		}
	}
	if (Array.isArray(children) && children.length === 1 && children[0] != null && children[0].tag === "#") {
		text = children[0].children
	} else {
		childList = children
	}
	return Vnode(state.tag, attrs.key, hasAttrs ? attrs : undefined, childList, text)
}
function hyperscript(selector) {
	// Because sloppy mode sucks
	var attrs = arguments[1], start = 2, children
	if (selector == null || typeof selector !== "string" && typeof selector !== "function" && typeof selector.view !== "function") {
		throw Error("The selector must be either a string or a component.");
	}
	if (typeof selector === "string") {
		var cached = selectorCache[selector] || compileSelector(selector)
	}
	if (attrs == null) {
		attrs = {}
	} else if (typeof attrs !== "object" || attrs.tag != null || Array.isArray(attrs)) {
		attrs = {}
		start = 1
	}
	if (arguments.length === start + 1) {
		children = arguments[start]
		if (!Array.isArray(children)) children = [children]
	} else {
		children = []
		while (start < arguments.length) children.push(arguments[start++])
	}
	var normalized = Vnode.normalizeChildren(children)
	if (typeof selector === "string") {
		return execSelector(cached, attrs, normalized)
	} else {
		return Vnode(selector, attrs.key, attrs, normalized)
	}
}
hyperscript.trust = function(html) {
	if (html == null) html = ""
	return Vnode("<", undefined, undefined, html, undefined, undefined)
}
hyperscript.fragment = function(attrs1, children) {
	return Vnode("[", attrs1.key, attrs1, Vnode.normalizeChildren(children), undefined, undefined)
}
var m = hyperscript
/** @constructor */
var PromisePolyfill = function(executor) {
	if (!(this instanceof PromisePolyfill)) throw new Error("Promise must be called with `new`")
	if (typeof executor !== "function") throw new TypeError("executor must be a function")
	var self = this, resolvers = [], rejectors = [], resolveCurrent = handler(resolvers, true), rejectCurrent = handler(rejectors, false)
	var instance = self._instance = {resolvers: resolvers, rejectors: rejectors}
	var callAsync = typeof setImmediate === "function" ? setImmediate : setTimeout
	function handler(list, shouldAbsorb) {
		return function execute(value) {
			var then
			try {
				if (shouldAbsorb && value != null && (typeof value === "object" || typeof value === "function") && typeof (then = value.then) === "function") {
					if (value === self) throw new TypeError("Promise can't be resolved w/ itself")
					executeOnce(then.bind(value))
				}
				else {
					callAsync(function() {
						if (!shouldAbsorb && list.length === 0) console.error("Possible unhandled promise rejection:", value)
						for (var i = 0; i < list.length; i++) list[i](value)
						resolvers.length = 0, rejectors.length = 0
						instance.state = shouldAbsorb
						instance.retry = function() {execute(value)}
					})
				}
			}
			catch (e) {
				rejectCurrent(e)
			}
		}
	}
	function executeOnce(then) {
		var runs = 0
		function run(fn) {
			return function(value) {
				if (runs++ > 0) return
				fn(value)
			}
		}
		var onerror = run(rejectCurrent)
		try {then(run(resolveCurrent), onerror)} catch (e) {onerror(e)}
	}
	executeOnce(executor)
}
PromisePolyfill.prototype.then = function(onFulfilled, onRejection) {
	var self = this, instance = self._instance
	function handle(callback, list, next, state) {
		list.push(function(value) {
			if (typeof callback !== "function") next(value)
			else try {resolveNext(callback(value))} catch (e) {if (rejectNext) rejectNext(e)}
		})
		if (typeof instance.retry === "function" && state === instance.state) instance.retry()
	}
	var resolveNext, rejectNext
	var promise = new PromisePolyfill(function(resolve, reject) {resolveNext = resolve, rejectNext = reject})
	handle(onFulfilled, instance.resolvers, resolveNext, true), handle(onRejection, instance.rejectors, rejectNext, false)
	return promise
}
PromisePolyfill.prototype.catch = function(onRejection) {
	return this.then(null, onRejection)
}
PromisePolyfill.resolve = function(value) {
	if (value instanceof PromisePolyfill) return value
	return new PromisePolyfill(function(resolve) {resolve(value)})
}
PromisePolyfill.reject = function(value) {
	return new PromisePolyfill(function(resolve, reject) {reject(value)})
}
PromisePolyfill.all = function(list) {
	return new PromisePolyfill(function(resolve, reject) {
		var total = list.length, count = 0, values = []
		if (list.length === 0) resolve([])
		else for (var i = 0; i < list.length; i++) {
			(function(i) {
				function consume(value) {
					count++
					values[i] = value
					if (count === total) resolve(values)
				}
				if (list[i] != null && (typeof list[i] === "object" || typeof list[i] === "function") && typeof list[i].then === "function") {
					list[i].then(consume, reject)
				}
				else consume(list[i])
			})(i)
		}
	})
}
PromisePolyfill.race = function(list) {
	return new PromisePolyfill(function(resolve, reject) {
		for (var i = 0; i < list.length; i++) {
			list[i].then(resolve, reject)
		}
	})
}
if (typeof window !== "undefined") {
	if (typeof window.Promise === "undefined") window.Promise = PromisePolyfill
	var PromisePolyfill = window.Promise
} else if (typeof global !== "undefined") {
	if (typeof global.Promise === "undefined") global.Promise = PromisePolyfill
	var PromisePolyfill = global.Promise
} else {
}
var buildQueryString = function(object) {
	if (Object.prototype.toString.call(object) !== "[object Object]") return ""
	var args = []
	for (var key0 in object) {
		destructure(key0, object[key0])
	}
	return args.join("&")
	function destructure(key0, value) {
		if (Array.isArray(value)) {
			for (var i = 0; i < value.length; i++) {
				destructure(key0 + "[" + i + "]", value[i])
			}
		}
		else if (Object.prototype.toString.call(value) === "[object Object]") {
			for (var i in value) {
				destructure(key0 + "[" + i + "]", value[i])
			}
		}
		else args.push(encodeURIComponent(key0) + (value != null && value !== "" ? "=" + encodeURIComponent(value) : ""))
	}
}
var FILE_PROTOCOL_REGEX = new RegExp("^file://", "i")
var _8 = function($window, Promise) {
	var callbackCount = 0
	var oncompletion
	function setCompletionCallback(callback) {oncompletion = callback}
	function finalizer() {
		var count = 0
		function complete() {if (--count === 0 && typeof oncompletion === "function") oncompletion()}
		return function finalize(promise0) {
			var then0 = promise0.then
			promise0.then = function() {
				count++
				var next = then0.apply(promise0, arguments)
				next.then(complete, function(e) {
					complete()
					if (count === 0) throw e
				})
				return finalize(next)
			}
			return promise0
		}
	}
	function normalize(args, extra) {
		if (typeof args === "string") {
			var url = args
			args = extra || {}
			if (args.url == null) args.url = url
		}
		return args
	}
	function request(args, extra) {
		var finalize = finalizer()
		args = normalize(args, extra)
		var promise0 = new Promise(function(resolve, reject) {
			if (args.method == null) args.method = "GET"
			args.method = args.method.toUpperCase()
			var useBody = (args.method === "GET" || args.method === "TRACE") ? false : (typeof args.useBody === "boolean" ? args.useBody : true)
			if (typeof args.serialize !== "function") args.serialize = typeof FormData !== "undefined" && args.data instanceof FormData ? function(value) {return value} : JSON.stringify
			if (typeof args.deserialize !== "function") args.deserialize = deserialize
			if (typeof args.extract !== "function") args.extract = extract
			args.url = interpolate(args.url, args.data)
			if (useBody) args.data = args.serialize(args.data)
			else args.url = assemble(args.url, args.data)
			var xhr = new $window.XMLHttpRequest(),
				aborted = false,
				_abort = xhr.abort
			xhr.abort = function abort() {
				aborted = true
				_abort.call(xhr)
			}
			xhr.open(args.method, args.url, typeof args.async === "boolean" ? args.async : true, typeof args.user === "string" ? args.user : undefined, typeof args.password === "string" ? args.password : undefined)
			if (args.serialize === JSON.stringify && useBody) {
				xhr.setRequestHeader("Content-Type", "application/json; charset=utf-8")
			}
			if (args.deserialize === deserialize) {
				xhr.setRequestHeader("Accept", "application/json, text/*")
			}
			if (args.withCredentials) xhr.withCredentials = args.withCredentials
			for (var key in args.headers) if ({}.hasOwnProperty.call(args.headers, key)) {
				xhr.setRequestHeader(key, args.headers[key])
			}
			if (typeof args.config === "function") xhr = args.config(xhr, args) || xhr
			xhr.onreadystatechange = function() {
				// Don't throw errors on xhr.abort().
				if(aborted) return
				if (xhr.readyState === 4) {
					try {
						var response = (args.extract !== extract) ? args.extract(xhr, args) : args.deserialize(args.extract(xhr, args))
						if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304 || FILE_PROTOCOL_REGEX.test(args.url)) {
							resolve(cast(args.type, response))
						}
						else {
							var error = new Error(xhr.responseText)
							for (var key in response) error[key] = response[key]
							reject(error)
						}
					}
					catch (e) {
						reject(e)
					}
				}
			}
			if (useBody && (args.data != null)) xhr.send(args.data)
			else xhr.send()
		})
		return args.background === true ? promise0 : finalize(promise0)
	}
	function jsonp(args, extra) {
		var finalize = finalizer()
		args = normalize(args, extra)
		var promise0 = new Promise(function(resolve, reject) {
			var callbackName = args.callbackName || "_mithril_" + Math.round(Math.random() * 1e16) + "_" + callbackCount++
			var script = $window.document.createElement("script")
			$window[callbackName] = function(data) {
				script.parentNode.removeChild(script)
				resolve(cast(args.type, data))
				delete $window[callbackName]
			}
			script.onerror = function() {
				script.parentNode.removeChild(script)
				reject(new Error("JSONP request failed"))
				delete $window[callbackName]
			}
			if (args.data == null) args.data = {}
			args.url = interpolate(args.url, args.data)
			args.data[args.callbackKey || "callback"] = callbackName
			script.src = assemble(args.url, args.data)
			$window.document.documentElement.appendChild(script)
		})
		return args.background === true? promise0 : finalize(promise0)
	}
	function interpolate(url, data) {
		if (data == null) return url
		var tokens = url.match(/:[^\/]+/gi) || []
		for (var i = 0; i < tokens.length; i++) {
			var key = tokens[i].slice(1)
			if (data[key] != null) {
				url = url.replace(tokens[i], data[key])
			}
		}
		return url
	}
	function assemble(url, data) {
		var querystring = buildQueryString(data)
		if (querystring !== "") {
			var prefix = url.indexOf("?") < 0 ? "?" : "&"
			url += prefix + querystring
		}
		return url
	}
	function deserialize(data) {
		try {return data !== "" ? JSON.parse(data) : null}
		catch (e) {throw new Error(data)}
	}
	function extract(xhr) {return xhr.responseText}
	function cast(type0, data) {
		if (typeof type0 === "function") {
			if (Array.isArray(data)) {
				for (var i = 0; i < data.length; i++) {
					data[i] = new type0(data[i])
				}
			}
			else return new type0(data)
		}
		return data
	}
	return {request: request, jsonp: jsonp, setCompletionCallback: setCompletionCallback}
}
var requestService = _8(window, PromisePolyfill)
var coreRenderer = function($window) {
	var $doc = $window.document
	var $emptyFragment = $doc.createDocumentFragment()
	var nameSpace = {
		svg: "http://www.w3.org/2000/svg",
		math: "http://www.w3.org/1998/Math/MathML"
	}
	var onevent
	function setEventCallback(callback) {return onevent = callback}
	function getNameSpace(vnode) {
		return vnode.attrs && vnode.attrs.xmlns || nameSpace[vnode.tag]
	}
	//create
	function createNodes(parent, vnodes, start, end, hooks, nextSibling, ns) {
		for (var i = start; i < end; i++) {
			var vnode = vnodes[i]
			if (vnode != null) {
				createNode(parent, vnode, hooks, ns, nextSibling)
			}
		}
	}
	function createNode(parent, vnode, hooks, ns, nextSibling) {
		var tag = vnode.tag
		if (typeof tag === "string") {
			vnode.state = {}
			if (vnode.attrs != null) initLifecycle(vnode.attrs, vnode, hooks)
			switch (tag) {
				case "#": return createText(parent, vnode, nextSibling)
				case "<": return createHTML(parent, vnode, nextSibling)
				case "[": return createFragment(parent, vnode, hooks, ns, nextSibling)
				default: return createElement(parent, vnode, hooks, ns, nextSibling)
			}
		}
		else return createComponent(parent, vnode, hooks, ns, nextSibling)
	}
	function createText(parent, vnode, nextSibling) {
		vnode.dom = $doc.createTextNode(vnode.children)
		insertNode(parent, vnode.dom, nextSibling)
		return vnode.dom
	}
	function createHTML(parent, vnode, nextSibling) {
		var match1 = vnode.children.match(/^\s*?<(\w+)/im) || []
		var parent1 = {caption: "table", thead: "table", tbody: "table", tfoot: "table", tr: "tbody", th: "tr", td: "tr", colgroup: "table", col: "colgroup"}[match1[1]] || "div"
		var temp = $doc.createElement(parent1)
		temp.innerHTML = vnode.children
		vnode.dom = temp.firstChild
		vnode.domSize = temp.childNodes.length
		var fragment = $doc.createDocumentFragment()
		var child
		while (child = temp.firstChild) {
			fragment.appendChild(child)
		}
		insertNode(parent, fragment, nextSibling)
		return fragment
	}
	function createFragment(parent, vnode, hooks, ns, nextSibling) {
		var fragment = $doc.createDocumentFragment()
		if (vnode.children != null) {
			var children = vnode.children
			createNodes(fragment, children, 0, children.length, hooks, null, ns)
		}
		vnode.dom = fragment.firstChild
		vnode.domSize = fragment.childNodes.length
		insertNode(parent, fragment, nextSibling)
		return fragment
	}
	function createElement(parent, vnode, hooks, ns, nextSibling) {
		var tag = vnode.tag
		var attrs2 = vnode.attrs
		var is = attrs2 && attrs2.is
		ns = getNameSpace(vnode) || ns
		var element = ns ?
			is ? $doc.createElementNS(ns, tag, {is: is}) : $doc.createElementNS(ns, tag) :
			is ? $doc.createElement(tag, {is: is}) : $doc.createElement(tag)
		vnode.dom = element
		if (attrs2 != null) {
			setAttrs(vnode, attrs2, ns)
		}
		insertNode(parent, element, nextSibling)
		if (vnode.attrs != null && vnode.attrs.contenteditable != null) {
			setContentEditable(vnode)
		}
		else {
			if (vnode.text != null) {
				if (vnode.text !== "") element.textContent = vnode.text
				else vnode.children = [Vnode("#", undefined, undefined, vnode.text, undefined, undefined)]
			}
			if (vnode.children != null) {
				var children = vnode.children
				createNodes(element, children, 0, children.length, hooks, null, ns)
				setLateAttrs(vnode)
			}
		}
		return element
	}
	function initComponent(vnode, hooks) {
		var sentinel
		if (typeof vnode.tag.view === "function") {
			vnode.state = Object.create(vnode.tag)
			sentinel = vnode.state.view
			if (sentinel.$$reentrantLock$$ != null) return $emptyFragment
			sentinel.$$reentrantLock$$ = true
		} else {
			vnode.state = void 0
			sentinel = vnode.tag
			if (sentinel.$$reentrantLock$$ != null) return $emptyFragment
			sentinel.$$reentrantLock$$ = true
			vnode.state = (vnode.tag.prototype != null && typeof vnode.tag.prototype.view === "function") ? new vnode.tag(vnode) : vnode.tag(vnode)
		}
		vnode._state = vnode.state
		if (vnode.attrs != null) initLifecycle(vnode.attrs, vnode, hooks)
		initLifecycle(vnode._state, vnode, hooks)
		vnode.instance = Vnode.normalize(vnode._state.view.call(vnode.state, vnode))
		if (vnode.instance === vnode) throw Error("A view cannot return the vnode it received as argument")
		sentinel.$$reentrantLock$$ = null
	}
	function createComponent(parent, vnode, hooks, ns, nextSibling) {
		initComponent(vnode, hooks)
		if (vnode.instance != null) {
			var element = createNode(parent, vnode.instance, hooks, ns, nextSibling)
			vnode.dom = vnode.instance.dom
			vnode.domSize = vnode.dom != null ? vnode.instance.domSize : 0
			insertNode(parent, element, nextSibling)
			return element
		}
		else {
			vnode.domSize = 0
			return $emptyFragment
		}
	}
	//update
	function updateNodes(parent, old, vnodes, recycling, hooks, nextSibling, ns) {
		if (old === vnodes || old == null && vnodes == null) return
		else if (old == null) createNodes(parent, vnodes, 0, vnodes.length, hooks, nextSibling, ns)
		else if (vnodes == null) removeNodes(old, 0, old.length, vnodes)
		else {
			if (old.length === vnodes.length) {
				var isUnkeyed = false
				for (var i = 0; i < vnodes.length; i++) {
					if (vnodes[i] != null && old[i] != null) {
						isUnkeyed = vnodes[i].key == null && old[i].key == null
						break
					}
				}
				if (isUnkeyed) {
					for (var i = 0; i < old.length; i++) {
						if (old[i] === vnodes[i]) continue
						else if (old[i] == null && vnodes[i] != null) createNode(parent, vnodes[i], hooks, ns, getNextSibling(old, i + 1, nextSibling))
						else if (vnodes[i] == null) removeNodes(old, i, i + 1, vnodes)
						else updateNode(parent, old[i], vnodes[i], hooks, getNextSibling(old, i + 1, nextSibling), recycling, ns)
					}
					return
				}
			}
			recycling = recycling || isRecyclable(old, vnodes)
			if (recycling) {
				var pool = old.pool
				old = old.concat(old.pool)
			}
			var oldStart = 0, start = 0, oldEnd = old.length - 1, end = vnodes.length - 1, map
			while (oldEnd >= oldStart && end >= start) {
				var o = old[oldStart], v = vnodes[start]
				if (o === v && !recycling) oldStart++, start++
				else if (o == null) oldStart++
				else if (v == null) start++
				else if (o.key === v.key) {
					var shouldRecycle = (pool != null && oldStart >= old.length - pool.length) || ((pool == null) && recycling)
					oldStart++, start++
					updateNode(parent, o, v, hooks, getNextSibling(old, oldStart, nextSibling), shouldRecycle, ns)
					if (recycling && o.tag === v.tag) insertNode(parent, toFragment(o), nextSibling)
				}
				else {
					var o = old[oldEnd]
					if (o === v && !recycling) oldEnd--, start++
					else if (o == null) oldEnd--
					else if (v == null) start++
					else if (o.key === v.key) {
						var shouldRecycle = (pool != null && oldEnd >= old.length - pool.length) || ((pool == null) && recycling)
						updateNode(parent, o, v, hooks, getNextSibling(old, oldEnd + 1, nextSibling), shouldRecycle, ns)
						if (recycling || start < end) insertNode(parent, toFragment(o), getNextSibling(old, oldStart, nextSibling))
						oldEnd--, start++
					}
					else break
				}
			}
			while (oldEnd >= oldStart && end >= start) {
				var o = old[oldEnd], v = vnodes[end]
				if (o === v && !recycling) oldEnd--, end--
				else if (o == null) oldEnd--
				else if (v == null) end--
				else if (o.key === v.key) {
					var shouldRecycle = (pool != null && oldEnd >= old.length - pool.length) || ((pool == null) && recycling)
					updateNode(parent, o, v, hooks, getNextSibling(old, oldEnd + 1, nextSibling), shouldRecycle, ns)
					if (recycling && o.tag === v.tag) insertNode(parent, toFragment(o), nextSibling)
					if (o.dom != null) nextSibling = o.dom
					oldEnd--, end--
				}
				else {
					if (!map) map = getKeyMap(old, oldEnd)
					if (v != null) {
						var oldIndex = map[v.key]
						if (oldIndex != null) {
							var movable = old[oldIndex]
							var shouldRecycle = (pool != null && oldIndex >= old.length - pool.length) || ((pool == null) && recycling)
							updateNode(parent, movable, v, hooks, getNextSibling(old, oldEnd + 1, nextSibling), recycling, ns)
							insertNode(parent, toFragment(movable), nextSibling)
							old[oldIndex].skip = true
							if (movable.dom != null) nextSibling = movable.dom
						}
						else {
							var dom = createNode(parent, v, hooks, ns, nextSibling)
							nextSibling = dom
						}
					}
					end--
				}
				if (end < start) break
			}
			createNodes(parent, vnodes, start, end + 1, hooks, nextSibling, ns)
			removeNodes(old, oldStart, oldEnd + 1, vnodes)
		}
	}
	function updateNode(parent, old, vnode, hooks, nextSibling, recycling, ns) {
		var oldTag = old.tag, tag = vnode.tag
		if (oldTag === tag) {
			vnode.state = old.state
			vnode._state = old._state
			vnode.events = old.events
			if (!recycling && shouldNotUpdate(vnode, old)) return
			if (typeof oldTag === "string") {
				if (vnode.attrs != null) {
					if (recycling) {
						vnode.state = {}
						initLifecycle(vnode.attrs, vnode, hooks)
					}
					else updateLifecycle(vnode.attrs, vnode, hooks)
				}
				switch (oldTag) {
					case "#": updateText(old, vnode); break
					case "<": updateHTML(parent, old, vnode, nextSibling); break
					case "[": updateFragment(parent, old, vnode, recycling, hooks, nextSibling, ns); break
					default: updateElement(old, vnode, recycling, hooks, ns)
				}
			}
			else updateComponent(parent, old, vnode, hooks, nextSibling, recycling, ns)
		}
		else {
			removeNode(old, null)
			createNode(parent, vnode, hooks, ns, nextSibling)
		}
	}
	function updateText(old, vnode) {
		if (old.children.toString() !== vnode.children.toString()) {
			old.dom.nodeValue = vnode.children
		}
		vnode.dom = old.dom
	}
	function updateHTML(parent, old, vnode, nextSibling) {
		if (old.children !== vnode.children) {
			toFragment(old)
			createHTML(parent, vnode, nextSibling)
		}
		else vnode.dom = old.dom, vnode.domSize = old.domSize
	}
	function updateFragment(parent, old, vnode, recycling, hooks, nextSibling, ns) {
		updateNodes(parent, old.children, vnode.children, recycling, hooks, nextSibling, ns)
		var domSize = 0, children = vnode.children
		vnode.dom = null
		if (children != null) {
			for (var i = 0; i < children.length; i++) {
				var child = children[i]
				if (child != null && child.dom != null) {
					if (vnode.dom == null) vnode.dom = child.dom
					domSize += child.domSize || 1
				}
			}
			if (domSize !== 1) vnode.domSize = domSize
		}
	}
	function updateElement(old, vnode, recycling, hooks, ns) {
		var element = vnode.dom = old.dom
		ns = getNameSpace(vnode) || ns
		if (vnode.tag === "textarea") {
			if (vnode.attrs == null) vnode.attrs = {}
			if (vnode.text != null) {
				vnode.attrs.value = vnode.text //FIXME handle0 multiple children
				vnode.text = undefined
			}
		}
		updateAttrs(vnode, old.attrs, vnode.attrs, ns)
		if (vnode.attrs != null && vnode.attrs.contenteditable != null) {
			setContentEditable(vnode)
		}
		else if (old.text != null && vnode.text != null && vnode.text !== "") {
			if (old.text.toString() !== vnode.text.toString()) old.dom.firstChild.nodeValue = vnode.text
		}
		else {
			if (old.text != null) old.children = [Vnode("#", undefined, undefined, old.text, undefined, old.dom.firstChild)]
			if (vnode.text != null) vnode.children = [Vnode("#", undefined, undefined, vnode.text, undefined, undefined)]
			updateNodes(element, old.children, vnode.children, recycling, hooks, null, ns)
		}
	}
	function updateComponent(parent, old, vnode, hooks, nextSibling, recycling, ns) {
		if (recycling) {
			initComponent(vnode, hooks)
		} else {
			vnode.instance = Vnode.normalize(vnode._state.view.call(vnode.state, vnode))
			if (vnode.instance === vnode) throw Error("A view cannot return the vnode it received as argument")
			if (vnode.attrs != null) updateLifecycle(vnode.attrs, vnode, hooks)
			updateLifecycle(vnode._state, vnode, hooks)
		}
		if (vnode.instance != null) {
			if (old.instance == null) createNode(parent, vnode.instance, hooks, ns, nextSibling)
			else updateNode(parent, old.instance, vnode.instance, hooks, nextSibling, recycling, ns)
			vnode.dom = vnode.instance.dom
			vnode.domSize = vnode.instance.domSize
		}
		else if (old.instance != null) {
			removeNode(old.instance, null)
			vnode.dom = undefined
			vnode.domSize = 0
		}
		else {
			vnode.dom = old.dom
			vnode.domSize = old.domSize
		}
	}
	function isRecyclable(old, vnodes) {
		if (old.pool != null && Math.abs(old.pool.length - vnodes.length) <= Math.abs(old.length - vnodes.length)) {
			var oldChildrenLength = old[0] && old[0].children && old[0].children.length || 0
			var poolChildrenLength = old.pool[0] && old.pool[0].children && old.pool[0].children.length || 0
			var vnodesChildrenLength = vnodes[0] && vnodes[0].children && vnodes[0].children.length || 0
			if (Math.abs(poolChildrenLength - vnodesChildrenLength) <= Math.abs(oldChildrenLength - vnodesChildrenLength)) {
				return true
			}
		}
		return false
	}
	function getKeyMap(vnodes, end) {
		var map = {}, i = 0
		for (var i = 0; i < end; i++) {
			var vnode = vnodes[i]
			if (vnode != null) {
				var key2 = vnode.key
				if (key2 != null) map[key2] = i
			}
		}
		return map
	}
	function toFragment(vnode) {
		var count0 = vnode.domSize
		if (count0 != null || vnode.dom == null) {
			var fragment = $doc.createDocumentFragment()
			if (count0 > 0) {
				var dom = vnode.dom
				while (--count0) fragment.appendChild(dom.nextSibling)
				fragment.insertBefore(dom, fragment.firstChild)
			}
			return fragment
		}
		else return vnode.dom
	}
	function getNextSibling(vnodes, i, nextSibling) {
		for (; i < vnodes.length; i++) {
			if (vnodes[i] != null && vnodes[i].dom != null) return vnodes[i].dom
		}
		return nextSibling
	}
	function insertNode(parent, dom, nextSibling) {
		if (nextSibling && nextSibling.parentNode) parent.insertBefore(dom, nextSibling)
		else parent.appendChild(dom)
	}
	function setContentEditable(vnode) {
		var children = vnode.children
		if (children != null && children.length === 1 && children[0].tag === "<") {
			var content = children[0].children
			if (vnode.dom.innerHTML !== content) vnode.dom.innerHTML = content
		}
		else if (vnode.text != null || children != null && children.length !== 0) throw new Error("Child node of a contenteditable must be trusted")
	}
	//remove
	function removeNodes(vnodes, start, end, context) {
		for (var i = start; i < end; i++) {
			var vnode = vnodes[i]
			if (vnode != null) {
				if (vnode.skip) vnode.skip = false
				else removeNode(vnode, context)
			}
		}
	}
	function removeNode(vnode, context) {
		var expected = 1, called = 0
		if (vnode.attrs && typeof vnode.attrs.onbeforeremove === "function") {
			var result = vnode.attrs.onbeforeremove.call(vnode.state, vnode)
			if (result != null && typeof result.then === "function") {
				expected++
				result.then(continuation, continuation)
			}
		}
		if (typeof vnode.tag !== "string" && typeof vnode._state.onbeforeremove === "function") {
			var result = vnode._state.onbeforeremove.call(vnode.state, vnode)
			if (result != null && typeof result.then === "function") {
				expected++
				result.then(continuation, continuation)
			}
		}
		continuation()
		function continuation() {
			if (++called === expected) {
				onremove(vnode)
				if (vnode.dom) {
					var count0 = vnode.domSize || 1
					if (count0 > 1) {
						var dom = vnode.dom
						while (--count0) {
							removeNodeFromDOM(dom.nextSibling)
						}
					}
					removeNodeFromDOM(vnode.dom)
					if (context != null && vnode.domSize == null && !hasIntegrationMethods(vnode.attrs) && typeof vnode.tag === "string") { //TODO test custom elements
						if (!context.pool) context.pool = [vnode]
						else context.pool.push(vnode)
					}
				}
			}
		}
	}
	function removeNodeFromDOM(node) {
		var parent = node.parentNode
		if (parent != null) parent.removeChild(node)
	}
	function onremove(vnode) {
		if (vnode.attrs && typeof vnode.attrs.onremove === "function") vnode.attrs.onremove.call(vnode.state, vnode)
		if (typeof vnode.tag !== "string" && typeof vnode._state.onremove === "function") vnode._state.onremove.call(vnode.state, vnode)
		if (vnode.instance != null) onremove(vnode.instance)
		else {
			var children = vnode.children
			if (Array.isArray(children)) {
				for (var i = 0; i < children.length; i++) {
					var child = children[i]
					if (child != null) onremove(child)
				}
			}
		}
	}
	//attrs2
	function setAttrs(vnode, attrs2, ns) {
		for (var key2 in attrs2) {
			setAttr(vnode, key2, null, attrs2[key2], ns)
		}
	}
	function setAttr(vnode, key2, old, value, ns) {
		var element = vnode.dom
		if (key2 === "key" || key2 === "is" || (old === value && !isFormAttribute(vnode, key2)) && typeof value !== "object" || typeof value === "undefined" || isLifecycleMethod(key2)) return
		var nsLastIndex = key2.indexOf(":")
		if (nsLastIndex > -1 && key2.substr(0, nsLastIndex) === "xlink") {
			element.setAttributeNS("http://www.w3.org/1999/xlink", key2.slice(nsLastIndex + 1), value)
		}
		else if (key2[0] === "o" && key2[1] === "n" && typeof value === "function") updateEvent(vnode, key2, value)
		else if (key2 === "style") updateStyle(element, old, value)
		else if (key2 in element && !isAttribute(key2) && ns === undefined && !isCustomElement(vnode)) {
			if (key2 === "value") {
				var normalized0 = "" + value // eslint-disable-line no-implicit-coercion
				//setting input[value] to same value by typing on focused element moves cursor to end in Chrome
				if ((vnode.tag === "input" || vnode.tag === "textarea") && vnode.dom.value === normalized0 && vnode.dom === $doc.activeElement) return
				//setting select[value] to same value while having select open blinks select dropdown in Chrome
				if (vnode.tag === "select") {
					if (value === null) {
						if (vnode.dom.selectedIndex === -1 && vnode.dom === $doc.activeElement) return
					} else {
						if (old !== null && vnode.dom.value === normalized0 && vnode.dom === $doc.activeElement) return
					}
				}
				//setting option[value] to same value while having select open blinks select dropdown in Chrome
				if (vnode.tag === "option" && old != null && vnode.dom.value === normalized0) return
			}
			// If you assign an input type1 that is not supported by IE 11 with an assignment expression, an error0 will occur.
			if (vnode.tag === "input" && key2 === "type") {
				element.setAttribute(key2, value)
				return
			}
			element[key2] = value
		}
		else {
			if (typeof value === "boolean") {
				if (value) element.setAttribute(key2, "")
				else element.removeAttribute(key2)
			}
			else element.setAttribute(key2 === "className" ? "class" : key2, value)
		}
	}
	function setLateAttrs(vnode) {
		var attrs2 = vnode.attrs
		if (vnode.tag === "select" && attrs2 != null) {
			if ("value" in attrs2) setAttr(vnode, "value", null, attrs2.value, undefined)
			if ("selectedIndex" in attrs2) setAttr(vnode, "selectedIndex", null, attrs2.selectedIndex, undefined)
		}
	}
	function updateAttrs(vnode, old, attrs2, ns) {
		if (attrs2 != null) {
			for (var key2 in attrs2) {
				setAttr(vnode, key2, old && old[key2], attrs2[key2], ns)
			}
		}
		if (old != null) {
			for (var key2 in old) {
				if (attrs2 == null || !(key2 in attrs2)) {
					if (key2 === "className") key2 = "class"
					if (key2[0] === "o" && key2[1] === "n" && !isLifecycleMethod(key2)) updateEvent(vnode, key2, undefined)
					else if (key2 !== "key") vnode.dom.removeAttribute(key2)
				}
			}
		}
	}
	function isFormAttribute(vnode, attr) {
		return attr === "value" || attr === "checked" || attr === "selectedIndex" || attr === "selected" && vnode.dom === $doc.activeElement
	}
	function isLifecycleMethod(attr) {
		return attr === "oninit" || attr === "oncreate" || attr === "onupdate" || attr === "onremove" || attr === "onbeforeremove" || attr === "onbeforeupdate"
	}
	function isAttribute(attr) {
		return attr === "href" || attr === "list" || attr === "form" || attr === "width" || attr === "height"// || attr === "type"
	}
	function isCustomElement(vnode){
		return vnode.attrs.is || vnode.tag.indexOf("-") > -1
	}
	function hasIntegrationMethods(source) {
		return source != null && (source.oncreate || source.onupdate || source.onbeforeremove || source.onremove)
	}
	//style
	function updateStyle(element, old, style) {
		if (old === style) element.style.cssText = "", old = null
		if (style == null) element.style.cssText = ""
		else if (typeof style === "string") element.style.cssText = style
		else {
			if (typeof old === "string") element.style.cssText = ""
			for (var key2 in style) {
				element.style[key2] = style[key2]
			}
			if (old != null && typeof old !== "string") {
				for (var key2 in old) {
					if (!(key2 in style)) element.style[key2] = ""
				}
			}
		}
	}
	//event
	function updateEvent(vnode, key2, value) {
		var element = vnode.dom
		var callback = typeof onevent !== "function" ? value : function(e) {
			var result = value.call(element, e)
			onevent.call(element, e)
			return result
		}
		if (key2 in element) element[key2] = typeof value === "function" ? callback : null
		else {
			var eventName = key2.slice(2)
			if (vnode.events === undefined) vnode.events = {}
			if (vnode.events[key2] === callback) return
			if (vnode.events[key2] != null) element.removeEventListener(eventName, vnode.events[key2], false)
			if (typeof value === "function") {
				vnode.events[key2] = callback
				element.addEventListener(eventName, vnode.events[key2], false)
			}
		}
	}
	//lifecycle
	function initLifecycle(source, vnode, hooks) {
		if (typeof source.oninit === "function") source.oninit.call(vnode.state, vnode)
		if (typeof source.oncreate === "function") hooks.push(source.oncreate.bind(vnode.state, vnode))
	}
	function updateLifecycle(source, vnode, hooks) {
		if (typeof source.onupdate === "function") hooks.push(source.onupdate.bind(vnode.state, vnode))
	}
	function shouldNotUpdate(vnode, old) {
		var forceVnodeUpdate, forceComponentUpdate
		if (vnode.attrs != null && typeof vnode.attrs.onbeforeupdate === "function") forceVnodeUpdate = vnode.attrs.onbeforeupdate.call(vnode.state, vnode, old)
		if (typeof vnode.tag !== "string" && typeof vnode._state.onbeforeupdate === "function") forceComponentUpdate = vnode._state.onbeforeupdate.call(vnode.state, vnode, old)
		if (!(forceVnodeUpdate === undefined && forceComponentUpdate === undefined) && !forceVnodeUpdate && !forceComponentUpdate) {
			vnode.dom = old.dom
			vnode.domSize = old.domSize
			vnode.instance = old.instance
			return true
		}
		return false
	}
	function render(dom, vnodes) {
		if (!dom) throw new Error("Ensure the DOM element being passed to m.route/m.mount/m.render is not undefined.")
		var hooks = []
		var active = $doc.activeElement
		var namespace = dom.namespaceURI
		// First time0 rendering into a node clears it out
		if (dom.vnodes == null) dom.textContent = ""
		if (!Array.isArray(vnodes)) vnodes = [vnodes]
		updateNodes(dom, dom.vnodes, Vnode.normalizeChildren(vnodes), false, hooks, null, namespace === "http://www.w3.org/1999/xhtml" ? undefined : namespace)
		dom.vnodes = vnodes
		for (var i = 0; i < hooks.length; i++) hooks[i]()
		if ($doc.activeElement !== active) active.focus()
	}
	return {render: render, setEventCallback: setEventCallback}
}
function throttle(callback) {
	//60fps translates to 16.6ms, round it down since setTimeout requires int
	var time = 16
	var last = 0, pending = null
	var timeout = typeof requestAnimationFrame === "function" ? requestAnimationFrame : setTimeout
	return function() {
		var now = Date.now()
		if (last === 0 || now - last >= time) {
			last = now
			callback()
		}
		else if (pending === null) {
			pending = timeout(function() {
				pending = null
				callback()
				last = Date.now()
			}, time - (now - last))
		}
	}
}
var _11 = function($window) {
	var renderService = coreRenderer($window)
	renderService.setEventCallback(function(e) {
		if (e.redraw === false) e.redraw = undefined
		else redraw()
	})
	var callbacks = []
	function subscribe(key1, callback) {
		unsubscribe(key1)
		callbacks.push(key1, throttle(callback))
	}
	function unsubscribe(key1) {
		var index = callbacks.indexOf(key1)
		if (index > -1) callbacks.splice(index, 2)
	}
	function redraw() {
		for (var i = 1; i < callbacks.length; i += 2) {
			callbacks[i]()
		}
	}
	return {subscribe: subscribe, unsubscribe: unsubscribe, redraw: redraw, render: renderService.render}
}
var redrawService = _11(window)
requestService.setCompletionCallback(redrawService.redraw)
var _16 = function(redrawService0) {
	return function(root, component) {
		if (component === null) {
			redrawService0.render(root, [])
			redrawService0.unsubscribe(root)
			return
		}
		
		if (component.view == null && typeof component !== "function") throw new Error("m.mount(element, component) expects a component, not a vnode")
		
		var run0 = function() {
			redrawService0.render(root, Vnode(component))
		}
		redrawService0.subscribe(root, run0)
		redrawService0.redraw()
	}
}
m.mount = _16(redrawService)
var Promise = PromisePolyfill
var parseQueryString = function(string) {
	if (string === "" || string == null) return {}
	if (string.charAt(0) === "?") string = string.slice(1)
	var entries = string.split("&"), data0 = {}, counters = {}
	for (var i = 0; i < entries.length; i++) {
		var entry = entries[i].split("=")
		var key5 = decodeURIComponent(entry[0])
		var value = entry.length === 2 ? decodeURIComponent(entry[1]) : ""
		if (value === "true") value = true
		else if (value === "false") value = false
		var levels = key5.split(/\]\[?|\[/)
		var cursor = data0
		if (key5.indexOf("[") > -1) levels.pop()
		for (var j = 0; j < levels.length; j++) {
			var level = levels[j], nextLevel = levels[j + 1]
			var isNumber = nextLevel == "" || !isNaN(parseInt(nextLevel, 10))
			var isValue = j === levels.length - 1
			if (level === "") {
				var key5 = levels.slice(0, j).join()
				if (counters[key5] == null) counters[key5] = 0
				level = counters[key5]++
			}
			if (cursor[level] == null) {
				cursor[level] = isValue ? value : isNumber ? [] : {}
			}
			cursor = cursor[level]
		}
	}
	return data0
}
var coreRouter = function($window) {
	var supportsPushState = typeof $window.history.pushState === "function"
	var callAsync0 = typeof setImmediate === "function" ? setImmediate : setTimeout
	function normalize1(fragment0) {
		var data = $window.location[fragment0].replace(/(?:%[a-f89][a-f0-9])+/gim, decodeURIComponent)
		if (fragment0 === "pathname" && data[0] !== "/") data = "/" + data
		return data
	}
	var asyncId
	function debounceAsync(callback0) {
		return function() {
			if (asyncId != null) return
			asyncId = callAsync0(function() {
				asyncId = null
				callback0()
			})
		}
	}
	function parsePath(path, queryData, hashData) {
		var queryIndex = path.indexOf("?")
		var hashIndex = path.indexOf("#")
		var pathEnd = queryIndex > -1 ? queryIndex : hashIndex > -1 ? hashIndex : path.length
		if (queryIndex > -1) {
			var queryEnd = hashIndex > -1 ? hashIndex : path.length
			var queryParams = parseQueryString(path.slice(queryIndex + 1, queryEnd))
			for (var key4 in queryParams) queryData[key4] = queryParams[key4]
		}
		if (hashIndex > -1) {
			var hashParams = parseQueryString(path.slice(hashIndex + 1))
			for (var key4 in hashParams) hashData[key4] = hashParams[key4]
		}
		return path.slice(0, pathEnd)
	}
	var router = {prefix: "#!"}
	router.getPath = function() {
		var type2 = router.prefix.charAt(0)
		switch (type2) {
			case "#": return normalize1("hash").slice(router.prefix.length)
			case "?": return normalize1("search").slice(router.prefix.length) + normalize1("hash")
			default: return normalize1("pathname").slice(router.prefix.length) + normalize1("search") + normalize1("hash")
		}
	}
	router.setPath = function(path, data, options) {
		var queryData = {}, hashData = {}
		path = parsePath(path, queryData, hashData)
		if (data != null) {
			for (var key4 in data) queryData[key4] = data[key4]
			path = path.replace(/:([^\/]+)/g, function(match2, token) {
				delete queryData[token]
				return data[token]
			})
		}
		var query = buildQueryString(queryData)
		if (query) path += "?" + query
		var hash = buildQueryString(hashData)
		if (hash) path += "#" + hash
		if (supportsPushState) {
			var state = options ? options.state : null
			var title = options ? options.title : null
			$window.onpopstate()
			if (options && options.replace) $window.history.replaceState(state, title, router.prefix + path)
			else $window.history.pushState(state, title, router.prefix + path)
		}
		else $window.location.href = router.prefix + path
	}
	router.defineRoutes = function(routes, resolve, reject) {
		function resolveRoute() {
			var path = router.getPath()
			var params = {}
			var pathname = parsePath(path, params, params)
			var state = $window.history.state
			if (state != null) {
				for (var k in state) params[k] = state[k]
			}
			for (var route0 in routes) {
				var matcher = new RegExp("^" + route0.replace(/:[^\/]+?\.{3}/g, "(.*?)").replace(/:[^\/]+/g, "([^\\/]+)") + "\/?$")
				if (matcher.test(pathname)) {
					pathname.replace(matcher, function() {
						var keys = route0.match(/:[^\/]+/g) || []
						var values = [].slice.call(arguments, 1, -2)
						for (var i = 0; i < keys.length; i++) {
							params[keys[i].replace(/:|\./g, "")] = decodeURIComponent(values[i])
						}
						resolve(routes[route0], params, path, route0)
					})
					return
				}
			}
			reject(path, params)
		}
		if (supportsPushState) $window.onpopstate = debounceAsync(resolveRoute)
		else if (router.prefix.charAt(0) === "#") $window.onhashchange = resolveRoute
		resolveRoute()
	}
	return router
}
var _20 = function($window, redrawService0) {
	var routeService = coreRouter($window)
	var identity = function(v) {return v}
	var render1, component, attrs3, currentPath, lastUpdate
	var route = function(root, defaultRoute, routes) {
		if (root == null) throw new Error("Ensure the DOM element that was passed to `m.route` is not undefined")
		var run1 = function() {
			if (render1 != null) redrawService0.render(root, render1(Vnode(component, attrs3.key, attrs3)))
		}
		var bail = function(path) {
			if (path !== defaultRoute) routeService.setPath(defaultRoute, null, {replace: true})
			else throw new Error("Could not resolve default route " + defaultRoute)
		}
		routeService.defineRoutes(routes, function(payload, params, path) {
			var update = lastUpdate = function(routeResolver, comp) {
				if (update !== lastUpdate) return
				component = comp != null && (typeof comp.view === "function" || typeof comp === "function")? comp : "div"
				attrs3 = params, currentPath = path, lastUpdate = null
				render1 = (routeResolver.render || identity).bind(routeResolver)
				run1()
			}
			if (payload.view || typeof payload === "function") update({}, payload)
			else {
				if (payload.onmatch) {
					Promise.resolve(payload.onmatch(params, path)).then(function(resolved) {
						update(payload, resolved)
					}, bail)
				}
				else update(payload, "div")
			}
		}, bail)
		redrawService0.subscribe(root, run1)
	}
	route.set = function(path, data, options) {
		if (lastUpdate != null) {
			options = options || {}
			options.replace = true
		}
		lastUpdate = null
		routeService.setPath(path, data, options)
	}
	route.get = function() {return currentPath}
	route.prefix = function(prefix0) {routeService.prefix = prefix0}
	route.link = function(vnode1) {
		vnode1.dom.setAttribute("href", routeService.prefix + vnode1.attrs.href)
		vnode1.dom.onclick = function(e) {
			if (e.ctrlKey || e.metaKey || e.shiftKey || e.which === 2) return
			e.preventDefault()
			e.redraw = false
			var href = this.getAttribute("href")
			if (href.indexOf(routeService.prefix) === 0) href = href.slice(routeService.prefix.length)
			route.set(href, undefined, undefined)
		}
	}
	route.param = function(key3) {
		if(typeof attrs3 !== "undefined" && typeof key3 !== "undefined") return attrs3[key3]
		return attrs3
	}
	return route
}
m.route = _20(window, redrawService)
m.withAttr = function(attrName, callback1, context) {
	return function(e) {
		callback1.call(context || this, attrName in e.currentTarget ? e.currentTarget[attrName] : e.currentTarget.getAttribute(attrName))
	}
}
var _28 = coreRenderer(window)
m.render = _28.render
m.redraw = redrawService.redraw
m.request = requestService.request
m.jsonp = requestService.jsonp
m.parseQueryString = parseQueryString
m.buildQueryString = buildQueryString
m.version = "1.1.3"
m.vnode = Vnode
if (typeof module !== "undefined") module["exports"] = m
else window.m = m
}());
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhcHBcXGFwcC5qcyIsImFwcFxcY29tcG9uZW50c1xcZ2xvYmFscy5qcyIsImFwcFxcY29tcG9uZW50c1xcaGVscGVyLmpzIiwiYXBwXFxjb21wb25lbnRzXFxtb2RhbC13aW5kb3dcXGxvYWRpbmctbW9kYWwtd2luZG93LmpzIiwiYXBwXFxjb21wb25lbnRzXFxtb2RhbC13aW5kb3dcXG1vZGFsLXdpbmRvdy5qcyIsImFwcFxcY29tcG9uZW50c1xccmVxdWVzdC5qcyIsImFwcFxcbW9kdWxlc1xcYWxlcnRcXGFsZXJ0LmpzIiwiYXBwXFxtb2R1bGVzXFxtZW51XFxtZW51LmpzIiwiYXBwXFxtb2R1bGVzXFxzdXJ2ZXktbGFuZGluZ1xcbW9kZWwuanMiLCJhcHBcXG1vZHVsZXNcXHN1cnZleS1sYW5kaW5nXFxxdWVzdGlvbi1idWlsZGVyLmpzIiwiYXBwXFxtb2R1bGVzXFxzdXJ2ZXktbGFuZGluZ1xccmVzdWx0LW1vZGVsLmpzIiwiYXBwXFxtb2R1bGVzXFxzdXJ2ZXktbGFuZGluZ1xcc3VydmV5LWxhbmRpbmcuanMiLCJhcHBcXG1vZHVsZXNcXHN1cnZleS1sYW5kaW5nXFx0eXBlc1xcY29uZmlybS1jb2RlLmpzIiwiYXBwXFxtb2R1bGVzXFxzdXJ2ZXktbGFuZGluZ1xcdHlwZXNcXGRpZ2l0LWlucHV0LXNjcmVlbi5qcyIsImFwcFxcbW9kdWxlc1xcc3VydmV5LWxhbmRpbmdcXHR5cGVzXFxmaW5hbC1zY3JlZW4uanMiLCJhcHBcXG1vZHVsZXNcXHN1cnZleS1sYW5kaW5nXFx0eXBlc1xcaW1hZ2UtZ3JpZC1zY3JlZW4uanMiLCJhcHBcXG1vZHVsZXNcXHN1cnZleS1sYW5kaW5nXFx0eXBlc1xcaW1hZ2Utc2NyZWVuLmpzIiwiYXBwXFxtb2R1bGVzXFxzdXJ2ZXktbGFuZGluZ1xcdHlwZXNcXGxhbmd1YWdlLXNjcmVlbi5qcyIsImFwcFxcbW9kdWxlc1xcc3VydmV5LWxhbmRpbmdcXHR5cGVzXFxwYWludC1zY3JlZW4uanMiLCJhcHBcXG1vZHVsZXNcXHN1cnZleS1sYW5kaW5nXFx0eXBlc1xccGhvdG8tc2NyZWVuLmpzIiwiYXBwXFxtb2R1bGVzXFxzdXJ2ZXktbGFuZGluZ1xcdHlwZXNcXHJlZ2lzdGVyLWJpcnRoLWdlbmRlci1zY3JlZW4uanMiLCJhcHBcXG1vZHVsZXNcXHN1cnZleS1sYW5kaW5nXFx0eXBlc1xccmVnaXN0ZXItbmFtZS1waG9uZS1zY3JlZW4uanMiLCJhcHBcXG1vZHVsZXNcXHN1cnZleS1sYW5kaW5nXFx0eXBlc1xcdGV4dC1saXN0LXNjcmVlbi5qcyIsImFwcFxcbW9kdWxlc1xcc3VydmV5LWxhbmRpbmdcXHR5cGVzXFx1bmtub3duLmpzIiwiYXBwXFxtb2R1bGVzXFxzdXJ2ZXktbGFuZGluZ1xcdHlwZXNcXHZpZGVvLXNjcmVlbi5qcyIsImFwcFxccGFnZXNcXGhvbWVcXGhvbWUuanMiLCJhcHBcXHBhZ2VzXFxsYW5kaW5nXFxsYW5kaW5nLmpzIiwiYXBwXFxwYWdlc1xcbG9naW5cXGxvZ2luLmpzIiwiYXBwXFxwYWdlc1xcbWVzc2FnZXNcXG1lc3NhZ2VzLmpzIiwiYXBwXFxwYWdlc1xcc3VydmV5LWxpc3RcXHN1cnZleS1saXN0LmpzIiwiYXBwXFxyb3V0ZXMuanMiLCJub2RlX21vZHVsZXMvbWl0aHJpbC9taXRocmlsLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7O0FBQ0EsSUFBSTtBQUNBLFdBQU8sV0FBUCxDQUFtQixJQUFuQixDQUF3QixrQkFBeEIsRUFEQSxDQUMrQztBQUNsRCxDQUZELENBRUUsT0FBTyxLQUFQLEVBQWM7QUFDWixZQUFRLEdBQVIsQ0FBWSxLQUFaO0FBQ0g7QUFDRCxJQUFJLElBQUksUUFBUSxTQUFSLENBQVI7QUFDQSxPQUFPLE9BQVAsR0FBaUIsUUFBUSx5QkFBUixDQUFqQjtBQUNBO0FBQ0E7QUFDQSxJQUFJLFNBQVMsUUFBUSxhQUFSLENBQWI7QUFDQSxFQUFFLEtBQUYsQ0FBUSxJQUFSLEdBQWUs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QTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiJ3VzZSBzdHJpY3QnO1xyXG50cnkge1xyXG4gICAgc2NyZWVuLm9yaWVudGF0aW9uLmxvY2soJ3BvcnRyYWl0LXByaW1hcnknKTsgICAvLyB3ZWJraXQgb25seVxyXG59IGNhdGNoIChlcnJvcikge1xyXG4gICAgY29uc29sZS5sb2coZXJyb3IpO1xyXG59XHJcbmxldCBtID0gcmVxdWlyZSgnbWl0aHJpbCcpO1xyXG53aW5kb3cuR2xvYmFscyA9IHJlcXVpcmUoJy4vY29tcG9uZW50cy9nbG9iYWxzLmpzJyk7XHJcbi8vIHZhciBsYW5nID0gcmVxdWlyZSgnLi9sYW5nL2xhbmcuanMnKSgpO1xyXG4vLyB3aW5kb3cudCA9IGxhbmcudDtcclxubGV0IHJvdXRlcyA9IHJlcXVpcmUoJy4vcm91dGVzLmpzJyk7XHJcbm0ucm91dGUubW9kZSA9IFwiaGFzaFwiO1xyXG5tLnJvdXRlKGRvY3VtZW50LmJvZHksIFwiL2xvZ2luXCIsIHJvdXRlcygpKTtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG52YXIgbSA9IHJlcXVpcmUoJ21pdGhyaWwnKTtcclxudmFyIEhlbHBlciA9IHJlcXVpcmUoJy4vaGVscGVyLmpzJyk7XHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oKXtcclxuICAgIGxldCB0b2tlbiA9ICcnO1xyXG4gICAgbGV0IGF1dGggPSBmYWxzZTtcclxuICAgIGxldCBjdXJyZW50TGFuZyA9ICdydSc7XHJcbiAgICBsZXQgbGFuZ0xpc3QgPSBbXHJcbiAgICAgICAge2NvZGU6ICdydScsIG5hbWU6ICfQoNGD0YHRgdC60LjQuSd9LFxyXG4gICAgICAgIHtjb2RlOiAna3onLCBuYW1lOiAn0JrQsNC30LDQutGI0LAnfVxyXG4gICAgXTtcclxuICAgIGxldCBjb29yZGluYXRlcyA9IHtsYXRpdHVkZTogMCwgbG9uZ2l0dWRlOiAwfTtcclxuICAgIGxldCB1c2VyID0ge1xyXG4gICAgICAgIFwiVVNFX0NPREVcIjogMTkyXHJcbiAgICB9O1xyXG5cclxuICAgIGZ1bmN0aW9uIHNldERhdGVQaWNrZXJEZWZhdWx0cygpe1xyXG4gICAgICAgICQuZm4uZGF0ZXBpY2tlci5kYXRlc1snZW4nXSA9IHtcclxuICAgICAgICAgICAgZGF5czogW1wiU3VuZGF5XCIsIFwiTW9uZGF5XCIsIFwiVHVlc2RheVwiLCBcIldlZG5lc2RheVwiLCBcIlRodXJzZGF5XCIsIFwiRnJpZGF5XCIsIFwiU2F0dXJkYXlcIl0sXHJcbiAgICAgICAgICAgIGRheXNTaG9ydDogW1wiU3VuXCIsIFwiTW9uXCIsIFwiVHVlXCIsIFwiV2VkXCIsIFwiVGh1XCIsIFwiRnJpXCIsIFwiU2F0XCJdLFxyXG4gICAgICAgICAgICBkYXlzTWluOiBbXCJTdVwiLCBcIk1vXCIsIFwiVHVcIiwgXCJXZVwiLCBcIlRoXCIsIFwiRnJcIiwgXCJTYVwiXSxcclxuICAgICAgICAgICAgbW9udGhzOiBbXCJKYW51YXJ5XCIsIFwiRmVicnVhcnlcIiwgXCJNYXJjaFwiLCBcIkFwcmlsXCIsIFwiTWF5XCIsIFwiSnVuZVwiLCBcIkp1bHlcIiwgXCJBdWd1c3RcIiwgXCJTZXB0ZW1iZXJcIiwgXCJPY3RvYmVyXCIsIFwiTm92ZW1iZXJcIiwgXCJEZWNlbWJlclwiXSxcclxuICAgICAgICAgICAgbW9udGhzU2hvcnQ6IFtcIkphblwiLCBcIkZlYlwiLCBcIk1hclwiLCBcIkFwclwiLCBcIk1heVwiLCBcIkp1blwiLCBcIkp1bFwiLCBcIkF1Z1wiLCBcIlNlcFwiLCBcIk9jdFwiLCBcIk5vdlwiLCBcIkRlY1wiXSxcclxuICAgICAgICAgICAgdG9kYXk6IFwiVG9kYXlcIixcclxuICAgICAgICAgICAgY2xlYXI6IFwiQ2xlYXJcIixcclxuICAgICAgICAgICAgZm9ybWF0OiBcImRkLW1tLXl5eXlcIixcclxuICAgICAgICAgICAgdGl0bGVGb3JtYXQ6IFwiTU0geXl5eVwiLCAvKiBMZXZlcmFnZXMgc2FtZSBzeW50YXggYXMgJ2Zvcm1hdCcgKi9cclxuICAgICAgICAgICAgd2Vla1N0YXJ0OiAxXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgJC5mbi5kYXRlcGlja2VyLmRhdGVzWydydSddID0ge1xyXG4gICAgICAgICAgICBkYXlzOiBbXCLQktC+0YHQutGA0LXRgdC10L3RjNC1XCIsIFwi0J/QvtC90LXQtNC10LvRjNC90LjQulwiLCBcItCS0YLQvtGA0L3QuNC6XCIsIFwi0KHRgNC10LTQsFwiLCBcItCn0LXRgtCy0LXRgNCzXCIsIFwi0J/Rj9GC0L3QuNGG0LBcIiwgXCLQodGD0LHQsdC+0YLQsFwiXSxcclxuICAgICAgICAgICAgZGF5c1Nob3J0OiBbXCLQktGB0LpcIiwgXCLQn9C90LRcIiwgXCLQktGC0YBcIiwgXCLQodGA0LRcIiwgXCLQp9GC0LJcIiwgXCLQn9GC0L1cIiwgXCLQodGD0LFcIl0sXHJcbiAgICAgICAgICAgIGRheXNNaW46IFtcItCS0YFcIiwgXCLQn9C9XCIsIFwi0JLRglwiLCBcItCh0YBcIiwgXCLQp9GCXCIsIFwi0J/RglwiLCBcItCh0LFcIl0sXHJcbiAgICAgICAgICAgIG1vbnRoczogW1wi0K/QvdCy0LDRgNGMXCIsIFwi0KTQtdCy0YDQsNC70YxcIiwgXCLQnNCw0YDRglwiLCBcItCQ0L/RgNC10LvRjFwiLCBcItCc0LDQuVwiLCBcItCY0Y7QvdGMXCIsIFwi0JjRjtC70YxcIiwgXCLQkNCy0LPRg9GB0YJcIiwgXCLQodC10L3RgtGP0LHRgNGMXCIsIFwi0J7QutGC0Y/QsdGA0YxcIiwgXCLQndC+0Y/QsdGA0YxcIiwgXCLQlNC10LrQsNCx0YDRjFwiXSxcclxuICAgICAgICAgICAgbW9udGhzU2hvcnQ6IFtcItCv0L3QslwiLCBcItCk0LXQslwiLCBcItCc0LDRgFwiLCBcItCQ0L/RgFwiLCBcItCc0LDQuVwiLCBcItCY0Y7QvVwiLCBcItCY0Y7Qu1wiLCBcItCQ0LLQs1wiLCBcItCh0LXQvVwiLCBcItCe0LrRglwiLCBcItCd0L7Rj1wiLCBcItCU0LXQulwiXSxcclxuICAgICAgICAgICAgdG9kYXk6IFwi0KHQtdCz0L7QtNC90Y9cIixcclxuICAgICAgICAgICAgY2xlYXI6IFwi0J7Rh9C40YHRgtC40YLRjFwiLFxyXG4gICAgICAgICAgICBmb3JtYXQ6IFwiZGQubW0ueXl5eVwiLFxyXG4gICAgICAgICAgICB3ZWVrU3RhcnQ6IDEsXHJcbiAgICAgICAgICAgIG1vbnRoc1RpdGxlOiAn0JzQtdGB0Y/RhtGLJ1xyXG4gICAgICAgIH07XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBzZXREYXRlUGlja2VyRGVmYXVsdHM6IHNldERhdGVQaWNrZXJEZWZhdWx0cyxcclxuICAgICAgICBzZXRUb2tlbjogZnVuY3Rpb24gKGtleSkge1xyXG4gICAgICAgICAgICB0b2tlbiA9IGtleTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGdldFRva2VuOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0b2tlbjtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGdldExhbmc6IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgIHJldHVybiBjdXJyZW50TGFuZztcclxuICAgICAgICB9LFxyXG4gICAgICAgIHNldExhbmc6IGZ1bmN0aW9uKGxhbmcpe1xyXG4gICAgICAgICAgICBjdXJyZW50TGFuZyA9IGxhbmc7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBnZXRMYW5nTGlzdDogZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgcmV0dXJuIGxhbmdMaXN0O1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgc2V0VXNlcjogZnVuY3Rpb24oZGF0YSl7XHJcbiAgICAgICAgICAgIHVzZXIgPSBkYXRhWzBdO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgdXNlcjogZnVuY3Rpb24ocHJvcCl7XHJcbiAgICAgICAgICAgIGlmKHR5cGVvZiBwcm9wID09PSAndW5kZWZpbmVkJyl7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdXNlcjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHVzZXJbcHJvcF1cclxuICAgICAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycm9yKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICBzZXRBdXRoOiBmdW5jdGlvbih2YWx1ZSl7XHJcbiAgICAgICAgICAgIGF1dGggPSB2YWx1ZTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGlzQXV0aDogZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgcmV0dXJuIGF1dGg7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBzZXRDb29yZGluYXRlczogZnVuY3Rpb24obGF0aXR1ZGUsIGxvbmdpdHVkZSl7XHJcbiAgICAgICAgICAgIGNvb3JkaW5hdGVzLmxhdGl0dWRlID0gbGF0aXR1ZGU7XHJcbiAgICAgICAgICAgIGNvb3JkaW5hdGVzLmxvbmdpdHVkZSA9IGxvbmdpdHVkZTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGdldENvb3JkaW5hdGVzOiBmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICByZXR1cm4gY29vcmRpbmF0ZXM7IFxyXG4gICAgICAgIH1cclxuICAgIH1cclxufSgpOyIsIid1c2Ugc3RyaWN0JztcclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgZnVuY3Rpb24gZGVib3VuY2UoZm4sIGRlbGF5KSB7XHJcbiAgICAgICAgbGV0IHRpbWVyID0gbnVsbDtcclxuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBsZXQgY29udGV4dCA9IHRoaXMsIGFyZ3MgPSBhcmd1bWVudHM7XHJcbiAgICAgICAgICAgIGNsZWFyVGltZW91dCh0aW1lcik7XHJcbiAgICAgICAgICAgIHRpbWVyID0gc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICBmbi5hcHBseShjb250ZXh0LCBhcmdzKTtcclxuICAgICAgICAgICAgfSwgZGVsYXkpO1xyXG4gICAgICAgIH07XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gdGhyb3R0bGUoZm4sIHRocmVzaGhvbGQsIHNjb3BlKSB7XHJcbiAgICAgICAgdGhyZXNoaG9sZCB8fCAodGhyZXNoaG9sZCA9IDI1MCk7XHJcbiAgICAgICAgbGV0IGxhc3QsXHJcbiAgICAgICAgICAgIGRlZmVyVGltZXI7XHJcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgbGV0IGNvbnRleHQgPSBzY29wZSB8fCB0aGlzO1xyXG4gICAgICAgICAgICBsZXQgbm93ID0gK25ldyBEYXRlLFxyXG4gICAgICAgICAgICAgICAgYXJncyA9IGFyZ3VtZW50cztcclxuICAgICAgICAgICAgaWYgKGxhc3QgJiYgbm93IDwgbGFzdCArIHRocmVzaGhvbGQpIHtcclxuICAgICAgICAgICAgICAgIC8vIGhvbGQgb24gdG8gaXRcclxuICAgICAgICAgICAgICAgIGNsZWFyVGltZW91dChkZWZlclRpbWVyKTtcclxuICAgICAgICAgICAgICAgIGRlZmVyVGltZXIgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICBsYXN0ID0gbm93O1xyXG4gICAgICAgICAgICAgICAgICAgIGZuLmFwcGx5KGNvbnRleHQsIGFyZ3MpO1xyXG4gICAgICAgICAgICAgICAgfSwgdGhyZXNoaG9sZCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBsYXN0ID0gbm93O1xyXG4gICAgICAgICAgICAgICAgZm4uYXBwbHkoY29udGV4dCwgYXJncyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGdldFJhbmRvbUludChtaW4sIG1heCkge1xyXG4gICAgICAgIHJldHVybiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAobWF4IC0gbWluKSkgKyBtaW47XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJue1xyXG4gICAgICAgIGRlYm91bmNlOiBkZWJvdW5jZSxcclxuICAgICAgICB0aHJvdHRsZTogdGhyb3R0bGUsXHJcbiAgICAgICAgZ2V0UmFuZG9tSW50OiBnZXRSYW5kb21JbnRcclxuICAgIH1cclxufSgpOyIsIid1c2Ugc3RyaWN0JztcclxudmFyIG0gPSByZXF1aXJlKCdtaXRocmlsJyk7XHJcbnZhciBNb2RhbCA9IHJlcXVpcmUoJy4vbW9kYWwtd2luZG93LmpzJyk7XHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGNvbmZpZykge1xyXG4gICAgdmFyIGhlYWRlciA9IGNvbmZpZy5oZWFkZXIgfHwgJ9CX0LDQs9GA0YPQt9C60LAg0LTQsNC90L3Ri9GFJztcclxuICAgIHZhciB0ZXh0ID0gY29uZmlnLnRleHQgfHwgJ9Ce0L/QtdGA0LDRhtC40Y8g0LzQvtC20LXRgiDQt9Cw0L3Rj9GC0Ywg0L/RgNC+0LTQvtC70LbQuNGC0LXQu9GM0L3QvtC1INCy0YDQtdC80Y8uJztcclxuXHJcbiAgICBmdW5jdGlvbiB2aWV3KCkge1xyXG4gICAgICAgIHJldHVybiBtKG5ldyBNb2RhbCh7XHJcbiAgICAgICAgICAgIGlkOiAnYXBwTG9hZGluZ1dpbmRvdycsXHJcbiAgICAgICAgICAgIHN0YXRlOiAnc2hvdycsXHJcbiAgICAgICAgICAgIGNvbnRlbnQ6IFtcclxuICAgICAgICAgICAgICAgIG0oXCJpbWdcIiwge1xyXG4gICAgICAgICAgICAgICAgICAgIGNsYXNzOiBcImFwcC1sb2FkaW5nLXdpbmRvd19fbG9hZGVyXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgc3JjOiBcImFzc2V0cy9pbWFnZXMvbG9hZGluZy5naWZcIlxyXG4gICAgICAgICAgICAgICAgfSksXHJcbiAgICAgICAgICAgICAgICAn0J/QvtC20LDQu9GD0LnRgdGC0LAsINC/0L7QtNC+0LbQtNC40YLQtS4uLicsXHJcbiAgICAgICAgICAgICAgICBtKFwicFwiLCB7Y2xhc3M6IFwiYXBwLWxvYWRpbmctd2luZG93X19tZXNzYWdlXCJ9LCB0ZXh0KVxyXG4gICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICBpc1N0YXRpYzogdHJ1ZSxcclxuICAgICAgICAgICAgaGVhZGVyOiBoZWFkZXIsXHJcbiAgICAgICAgICAgIGlzRm9vdGVyOiBmYWxzZSxcclxuICAgICAgICAgICAgaXNGdWxsU2NyZWVuOiBmYWxzZSxcclxuICAgICAgICAgICAgbW9kYWxTaXplUGFyYW1zOiB7d2lkdGg6ICc0MDBweCcsIGhlaWdodDogZmFsc2UsIHBhZGRpbmc6ICcxNSUgMCAwIDAnfSxcclxuICAgICAgICAgICAgekluZGV4OiA5OTk5XHJcbiAgICAgICAgfSkpXHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJue1xyXG4gICAgICAgIHZpZXc6IHZpZXdcclxuICAgIH1cclxufTsiLCIndXNlIHN0cmljdCc7XHJcbnZhciBtID0gcmVxdWlyZSgnbWl0aHJpbCcpO1xyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChjb25maWcpIHtcclxuICAgIHZhciBzdGF0ZSA9IGNvbmZpZy5zdGF0ZSB8fCAnc2hvdyc7XHJcbiAgICB2YXIgY29udGVudCA9IGNvbmZpZy5jb250ZW50IHx8ICcnO1xyXG4gICAgdmFyIGlkID0gJ21vZGFsV2luZG93LScrKGNvbmZpZy5pZCB8fCAxKTtcclxuICAgIHZhciBpc1N0YXRpYyA9IGNvbmZpZy5pc1N0YXRpYyB8fCBmYWxzZTtcclxuICAgIHZhciBpc0Zvb3RlciA9IGNvbmZpZy5pc0Zvb3RlciB8fCBmYWxzZTtcclxuICAgIHZhciBoZWFkZXIgPSBjb25maWcuaGVhZGVyIHx8ICdIZWFkZXInO1xyXG4gICAgdmFyIGlzRnVsbFNjcmVlbiA9IGNvbmZpZy5pc0Z1bGxTY3JlZW4gfHwgZmFsc2U7XHJcbiAgICB2YXIgbW9kYWxTaXplUGFyYW1zID0gY29uZmlnLm1vZGFsU2l6ZVBhcmFtcyB8fCB7d2lkdGg6ICc2MDBweCcsIGhlaWdodDogJzMwMHB4JywgcGFkZGluZzogJzE1JSAwIDAgMCd9O1xyXG4gICAgdmFyIGNhbmNlbEJ0biA9IGNvbmZpZy5jYW5jZWxCdG4gfHwgJ0NhbmNlbCdcclxuICAgIHZhciBjb25maXJtQnRuID0gY29uZmlnLmNvbmZpcm1CdG4gfHwgJ09rJztcclxuICAgIHZhciBjb25maXJtQnRuQ2xhc3MgPSBjb25maWcuY29uZmlybUJ0bkNsYXNzIHx8ICdidG4tc3lzdGVtLXByaW1hcnknO1xyXG4gICAgdmFyIG9uQ29uZmlybSA9IGNvbmZpZy5vbkNvbmZpcm0gfHwgZnVuY3Rpb24oKXt9O1xyXG4gICAgdmFyIG9uQ2FuY2VsID0gY29uZmlnLm9uQ2FuY2VsIHx8IGZ1bmN0aW9uKCl7fTtcclxuICAgIHZhciB6SW5kZXggPSBjb25maWcuekluZGV4IHx8IDEwMDA7XHJcblxyXG4gICAgZnVuY3Rpb24gc2hvdygpe1xyXG4gICAgICAgIHN0YXRlID0gJ3Nob3cnO1xyXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKS5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGhpZGUoKXtcclxuICAgICAgICBzdGF0ZSA9ICdoaWRkZW4nO1xyXG4gICAgICAgIG9uQ2FuY2VsKCk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gdXBkYXRlZENvbnRlbnQoY250KXtcclxuICAgICAgICBjb250ZW50ID0gY250O1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIG9uaW5pdCgpIHtcclxuICAgICAgICBpZihpc0Z1bGxTY3JlZW4pe1xyXG4gICAgICAgICAgICBtb2RhbFNpemVQYXJhbXMgPSB7d2lkdGg6ICcxMDAlJywgaGVpZ2h0OiAnMTAwJScsIHBhZGRpbmc6ICcyMHB4J307XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHZpZXcoKSB7XHJcbiAgICAgICAgc3dpdGNoKHN0YXRlKXtcclxuICAgICAgICAgICAgY2FzZSAnc2hvdyc6XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbShcImRpdlwiLCB7Y2xhc3M6IFwibW9kYWwtd2luZG93XCIsIGlkOiBpZCwgc3R5bGU6IFwicGFkZGluZzogXCIrbW9kYWxTaXplUGFyYW1zLnBhZGRpbmcgKyBcIjt6LWluZGV4OiBcIiArIHpJbmRleCArICc7J30sXHJcbiAgICAgICAgICAgICAgICAgICAgbShcImRpdlwiLCB7Y2xhc3M6IFwibW9kYWwtd2luZG93X19jb250ZW50XCIsIHN0eWxlOiBcIndpZHRoOiBcIiArIG1vZGFsU2l6ZVBhcmFtcy53aWR0aCArIChtb2RhbFNpemVQYXJhbXMuaGVpZ2h0ID8gXCI7IGhlaWdodDogXCIgKyBtb2RhbFNpemVQYXJhbXMuaGVpZ2h0IDogJycpICsgXCI7XCJ9LCBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG0oXCJkaXZcIiwge2NsYXNzOiBcIm1vZGFsLXdpbmRvd19faGVhZGVyXCJ9LCBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpc1N0YXRpYyA/ICcnIDogbShcImJ1dHRvblwiLCB7dHlwZTogXCJidXR0b25cIiwgY2xhc3M6IFwiY2xvc2VcIixcImFyaWEtaGlkZGVuXCI6IHRydWUsIG9uY2xpY2s6IGhpZGV9LCBtKFwic3BhblwiLCAnw5cnKSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtKFwiaDJcIiwgaGVhZGVyKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBdKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgbShcImRpdlwiLCB7Y2xhc3M6IFwibW9kYWwtd2luZG93X19ib2R5XCIgKyAoaXNGb290ZXIgPyAnX3dpdGgtZm9vdGVyJyA6ICcnKSArICcgY2xlYXJmaXgnfSwgW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGVudFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBdKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgKGlzRm9vdGVyICYmICFpc1N0YXRpYykgPyBtKFwiZGl2XCIsIHtjbGFzczogXCJtb2RhbC13aW5kb3dfX2Zvb3RlclwifSwgW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FuY2VsQnRuICE9PSAnbm9uZScgPyBtKFwiYnV0dG9uXCIsIHt0eXBlOiBcImJ1dHRvblwiLCBjbGFzczogXCJidG4gYnRuLXByaW1hcnkgYnRuLXN5c3RlbS1jYW5jZWxcIiwgb25jbGljazogaGlkZX0sIGNhbmNlbEJ0bikgOiAnJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG0oXCJidXR0b25cIiwge3R5cGU6IFwiYnV0dG9uXCIsIGNsYXNzOiBcImJ0biBidG4tcHJpbWFyeSBcIitjb25maXJtQnRuQ2xhc3MsIG9uY2xpY2s6IG9uQ29uZmlybX0sIGNvbmZpcm1CdG4pLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBdKSA6ICcnXHJcbiAgICAgICAgICAgICAgICAgICAgXSlcclxuICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgIGNhc2UgJ2hpZGRlbic6XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbShcImRpdlwiLCB7Y2xhc3M6IFwibW9kYWwtd2luZG93X2hpZGRlblwiLCBpZDogaWR9LCAnJyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybntcclxuICAgICAgICBvbmluaXQ6IG9uaW5pdCxcclxuICAgICAgICB2aWV3OiB2aWV3LFxyXG4gICAgICAgIHVwZGF0ZWRDb250ZW50OiB1cGRhdGVkQ29udGVudCxcclxuICAgICAgICBzaG93OiBzaG93LFxyXG4gICAgICAgIGhpZGU6IGhpZGVcclxuICAgIH1cclxufTsiLCIndXNlIHN0cmljdCc7XHJcbmxldCBtID0gcmVxdWlyZSgnbWl0aHJpbCcpO1xyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICgpIHtcclxuICAgIGxldCB1c2VCb2R5ID0gdHJ1ZTtcclxuICAgIGZ1bmN0aW9uIHNlcmlhbGl6ZShkYXRhKXtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICByZXR1cm4gbS5idWlsZFF1ZXJ5U3RyaW5nKGRhdGEpOyAvLyBKU09OLnN0cmluZ2lmeShkYXRhKTtcclxuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCLQntGI0LjQsdC60LAg0L7RgtC/0YDQsNCy0LrQuCDQt9Cw0L/RgNC+0YHQsFwiLCBkYXRhKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gZGVzZXJpYWxpemUoZGF0YSkge1xyXG5cdFx0dHJ5IHtcclxuICAgICAgICAgICAgcmV0dXJuIGRhdGEgIT09IFwiXCIgPyBKU09OLnBhcnNlKGRhdGEpLmRhdGEgOiBudWxsXHJcbiAgICAgICAgfVxyXG5cdFx0Y2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG5cdH1cclxuXHJcbiAgICBmdW5jdGlvbiBjaGVja1Jlc3BvbnNlKGRhdGEpe1xyXG4gICAgICAgIGlmKGRhdGEgPT09IG51bGwpIHJldHVybjtcclxuXHJcbiAgICAgICAgaWYoZGF0YS5zdGF0dXMgPT09ICdFUlJPUicpe1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoZGF0YS5tZXNzYWdlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGRhdGE7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gbG9naW4obG9naW4sIHBhc3N3b3JkKXtcclxuICAgICAgICB2YXIgZGF0YSA9IHtcclxuICAgICAgICAgICAgbG9naW46IGxvZ2luLFxyXG4gICAgICAgICAgICBwYXNzd29yZDogcGFzc3dvcmRcclxuICAgICAgICB9O1xyXG4gICAgICAgIHJldHVybiBtLnJlcXVlc3Qoe1xyXG4gICAgICAgICAgICBiYWNrZ3JvdW5kOiB0cnVlLFxyXG4gICAgICAgICAgICB1c2VCb2R5OiB1c2VCb2R5LFxyXG4gICAgICAgICAgICBtZXRob2Q6IFwiUE9TVFwiLFxyXG4gICAgICAgICAgICB1cmw6IENvbmZpZy5zZXJ2aWNlcysnTG9naW4nLFxyXG4gICAgICAgICAgICBkYXRhOiBkYXRhLFxyXG4gICAgICAgICAgICBzZXJpYWxpemU6IHNlcmlhbGl6ZSxcclxuICAgICAgICAgICAgaGVhZGVyczoge1xyXG4gICAgICAgICAgICAgICAgXCJDb250ZW50LVR5cGVcIjogXCJhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQ7IGNoYXJzZXQ9VVRGLThcIlxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gZ2V0KGZpZWxkcywgdGFibGUsIHdoZXJlLCBvcmRlciwgc3RhcnQsIGVuZCl7XHJcbiAgICAgICAgbGV0IGRhdGEgPSB7XHJcbiAgICAgICAgICAgIGJhY2tncm91bmQ6IHRydWUsXHJcbiAgICAgICAgICAgIHRva2VuOiBHbG9iYWxzLmdldFRva2VuKCksXHJcbiAgICAgICAgICAgIGZpZWxkczogZmllbGRzLFxyXG4gICAgICAgICAgICB0YWJsZTogdGFibGUsXHJcbiAgICAgICAgICAgIHdoZXJlOiB3aGVyZVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGlmKHR5cGVvZiBvcmRlciAhPT0gJ3VuZGVmaW5lZCcgJiYgb3JkZXIgIT09IG51bGwpe1xyXG4gICAgICAgICAgICBkYXRhLm9yZGVyID0gb3JkZXI7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZih0eXBlb2Ygc3RhcnQgIT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiBlbmQgIT09ICd1bmRlZmluZWQnKXtcclxuICAgICAgICAgICAgZGF0YS5zdGFydCA9IHN0YXJ0O1xyXG4gICAgICAgICAgICBkYXRhLmVuZCA9IGVuZDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG0ucmVxdWVzdCh7XHJcbiAgICAgICAgICAgIHVzZUJvZHk6IHVzZUJvZHksXHJcbiAgICAgICAgICAgIG1ldGhvZDogXCJQT1NUXCIsXHJcbiAgICAgICAgICAgIHVybDogQ29uZmlnLnNlcnZpY2VzKydHZXREYXRhJyxcclxuICAgICAgICAgICAgZGF0YTogZGF0YSxcclxuICAgICAgICAgICAgc2VyaWFsaXplOiBzZXJpYWxpemUsXHJcbiAgICAgICAgICAgIGRlc2VyaWFsaXplOiBkZXNlcmlhbGl6ZSxcclxuICAgICAgICAgICAgaGVhZGVyczoge1xyXG4gICAgICAgICAgICAgICAgXCJDb250ZW50LVR5cGVcIjogXCJhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQ7IGNoYXJzZXQ9VVRGLThcIlxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSkudGhlbihjaGVja1Jlc3BvbnNlKTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBpbnNlcnQodGFibGUsIGZpZWxkcywgdmFsdWVzKXtcclxuICAgICAgICBsZXQgZGF0YSA9IHtcclxuICAgICAgICAgICAgdG9rZW46IEdsb2JhbHMuZ2V0VG9rZW4oKSxcclxuICAgICAgICAgICAgdGFibGU6IHRhYmxlLFxyXG4gICAgICAgICAgICBmaWVsZHM6IGZpZWxkcyxcclxuICAgICAgICAgICAgdmFsdWVzOiB2YWx1ZXNcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICByZXR1cm4gbS5yZXF1ZXN0KHtcclxuICAgICAgICAgICAgYmFja2dyb3VuZDogdHJ1ZSxcclxuICAgICAgICAgICAgdXNlQm9keTogdXNlQm9keSxcclxuICAgICAgICAgICAgbWV0aG9kOiBcIlBPU1RcIixcclxuICAgICAgICAgICAgdXJsOiBDb25maWcuc2VydmljZXMrJ0luc2VydERhdGEnLFxyXG4gICAgICAgICAgICBkYXRhOiBkYXRhLFxyXG4gICAgICAgICAgICBzZXJpYWxpemU6IHNlcmlhbGl6ZSxcclxuICAgICAgICAgICAgZGVzZXJpYWxpemU6IGRlc2VyaWFsaXplLFxyXG4gICAgICAgICAgICBoZWFkZXJzOiB7XHJcbiAgICAgICAgICAgICAgICBcIkNvbnRlbnQtVHlwZVwiOiBcImFwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZDsgY2hhcnNldD1VVEYtOFwiXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KS50aGVuKGNoZWNrUmVzcG9uc2UpO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHVwZGF0ZSh0YWJsZSwgZmllbGRzLCB3aGVyZSl7XHJcbiAgICAgICAgbGV0IGRhdGEgPSB7XHJcbiAgICAgICAgICAgIHRva2VuOiBHbG9iYWxzLmdldFRva2VuKCksXHJcbiAgICAgICAgICAgIHRhYmxlOiB0YWJsZSxcclxuICAgICAgICAgICAgZmllbGRzOiBmaWVsZHMsXHJcbiAgICAgICAgICAgIHdoZXJlOiB3aGVyZVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIG0ucmVxdWVzdCh7XHJcbiAgICAgICAgICAgIGJhY2tncm91bmQ6IHRydWUsXHJcbiAgICAgICAgICAgIHVzZUJvZHk6IHVzZUJvZHksXHJcbiAgICAgICAgICAgIG1ldGhvZDogXCJQT1NUXCIsXHJcbiAgICAgICAgICAgIHVybDogQ29uZmlnLnNlcnZpY2VzKydVcGRhdGVEYXRhJyxcclxuICAgICAgICAgICAgZGF0YTogZGF0YSxcclxuICAgICAgICAgICAgc2VyaWFsaXplOiBzZXJpYWxpemUsXHJcbiAgICAgICAgICAgIGRlc2VyaWFsaXplOiBkZXNlcmlhbGl6ZSxcclxuICAgICAgICAgICAgaGVhZGVyczoge1xyXG4gICAgICAgICAgICAgICAgXCJDb250ZW50LVR5cGVcIjogXCJhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQ7IGNoYXJzZXQ9VVRGLThcIlxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSkudGhlbihjaGVja1Jlc3BvbnNlKTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBleGVjUXVlcnkocXVlcnkpe1xyXG4gICAgICAgIGxldCBkYXRhID0ge1xyXG4gICAgICAgICAgICB0b2tlbjogR2xvYmFscy5nZXRUb2tlbigpLFxyXG4gICAgICAgICAgICBxdWVyeTogcXVlcnlcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICByZXR1cm4gbS5yZXF1ZXN0KHtcclxuICAgICAgICAgICAgYmFja2dyb3VuZDogdHJ1ZSxcclxuICAgICAgICAgICAgdXNlQm9keTogdXNlQm9keSxcclxuICAgICAgICAgICAgbWV0aG9kOiBcIlBPU1RcIixcclxuICAgICAgICAgICAgdXJsOiBDb25maWcuc2VydmljZXMrJ0V4ZWNRdWVyeScsXHJcbiAgICAgICAgICAgIGRhdGE6IGRhdGEsXHJcbiAgICAgICAgICAgIHNlcmlhbGl6ZTogc2VyaWFsaXplLFxyXG4gICAgICAgICAgICBoZWFkZXJzOiB7XHJcbiAgICAgICAgICAgICAgICBcIkNvbnRlbnQtVHlwZVwiOiBcImFwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZDsgY2hhcnNldD1VVEYtOFwiXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KS50aGVuKGNoZWNrUmVzcG9uc2UpO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHVwbG9hZEltYWdlKGZpbGUsIGZvbGRlciwgZmlsZU5hbWUsIG9uUHJvZ3Jlc3Mpe1xyXG4gICAgICAgIGxldCBkYXRhID0gbmV3IEZvcm1EYXRhKClcclxuICAgICAgICBkYXRhLmFwcGVuZChcImZpbGVcIiwgZmlsZSk7XHJcbiAgICAgICAgZGF0YS5hcHBlbmQoXCJvcGVyYXRpb25cIiwgXCJwaG90b191cGxvYWRcIik7XHJcbiAgICAgICAgZGF0YS5hcHBlbmQoXCJmb2xkZXJfbmFtZVwiLCBmb2xkZXIpO1xyXG4gICAgICAgIGRhdGEuYXBwZW5kKFwiZmlsZV9uYW1lXCIsIGZpbGVOYW1lKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIG0ucmVxdWVzdCh7XHJcbiAgICAgICAgICAgIGJhY2tncm91bmQ6IHRydWUsXHJcbiAgICAgICAgICAgIG1ldGhvZDogXCJQT1NUXCIsXHJcbiAgICAgICAgICAgIHVybDogQ29uZmlnLnNlcnZpY2VzKydQaG90b1VwbG9hZCcsXHJcbiAgICAgICAgICAgIGRhdGE6IGRhdGEsXHJcbiAgICAgICAgICAgIC8vIGNvbmZpZzogZnVuY3Rpb24gKHhocikge1xyXG4gICAgICAgICAgICAvLyAgICAgeGhyLnVwbG9hZC5hZGRFdmVudExpc3RlbmVyKFwicHJvZ3Jlc3NcIiwgZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICAgICAgLy8gICAgICAgICBjb25zb2xlLmxvZygoZS5sb2FkZWQgLyBlLnRvdGFsKSArIFwiJSBjb21wbGV0ZWRcIik7XHJcbiAgICAgICAgICAgIC8vICAgICAgICAgb25Qcm9ncmVzcyhlLmxvYWRlZCAvIGUudG90YWwpO1xyXG4gICAgICAgICAgICAvLyAgICAgICAgIG0ucmVkcmF3KCkgLy8gdGVsbCBNaXRocmlsIHRoYXQgZGF0YSBjaGFuZ2VkIGFuZCBhIHJlLXJlbmRlciBpcyBuZWVkZWRcclxuICAgICAgICAgICAgLy8gICAgIH0pXHJcbiAgICAgICAgICAgIC8vIH1cclxuICAgICAgICB9KS50aGVuKGNoZWNrUmVzcG9uc2UpXHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gdXBsb2FkSW1hZ2VCYXNlNjQoZmlsZU5hbWUsIGZvbGRlciwgaW1hZ2Upe1xyXG4gICAgICAgIGxldCBkYXRhID0ge1xyXG4gICAgICAgICAgICB0b2tlbjogR2xvYmFscy5nZXRUb2tlbigpLFxyXG4gICAgICAgICAgICBmaWxlTmFtZTogZmlsZU5hbWUsXHJcbiAgICAgICAgICAgIGZvbGRlcjogZm9sZGVyLFxyXG4gICAgICAgICAgICBpbWFnZTogaW1hZ2VcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICByZXR1cm4gbS5yZXF1ZXN0KHtcclxuICAgICAgICAgICAgYmFja2dyb3VuZDogdHJ1ZSxcclxuICAgICAgICAgICAgdXNlQm9keTogdXNlQm9keSxcclxuICAgICAgICAgICAgbWV0aG9kOiBcIlBPU1RcIixcclxuICAgICAgICAgICAgdXJsOiBDb25maWcuc2VydmljZXMrJ1VwbG9hZEltYWdlQjY0JyxcclxuICAgICAgICAgICAgZGF0YTogZGF0YSxcclxuICAgICAgICAgICAgc2VyaWFsaXplOiBzZXJpYWxpemUsXHJcbiAgICAgICAgICAgIGhlYWRlcnM6IHtcclxuICAgICAgICAgICAgICAgIFwiQ29udGVudC1UeXBlXCI6IFwiYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkOyBjaGFyc2V0PVVURi04XCJcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pLnRoZW4oY2hlY2tSZXNwb25zZSk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gc2VuZFNNUyhtZXNzYWdlLCBwaG9uZSl7XHJcbiAgICAgICAgbGV0IGRhdGEgPSB7XHJcbiAgICAgICAgICAgIHRva2VuOiBHbG9iYWxzLmdldFRva2VuKCksXHJcbiAgICAgICAgICAgIG1lc3NhZ2U6IG1lc3NhZ2UsXHJcbiAgICAgICAgICAgIHBob25lOiBwaG9uZSxcclxuICAgICAgICAgICAgb3BlcmF0aW9uOiBcInNlbmRfc21zXCJcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICByZXR1cm4gbS5yZXF1ZXN0KHtcclxuICAgICAgICAgICAgdXNlQm9keTogdXNlQm9keSxcclxuICAgICAgICAgICAgbWV0aG9kOiBcIlBPU1RcIixcclxuICAgICAgICAgICAgdXJsOiBDb25maWcuc2VydmljZXMsXHJcbiAgICAgICAgICAgIGRhdGE6IGRhdGEsXHJcbiAgICAgICAgICAgIHNlcmlhbGl6ZTogc2VyaWFsaXplLFxyXG4gICAgICAgICAgICBiYWNrZ3JvdW5kOiB0cnVlLFxyXG4gICAgICAgICAgICBoZWFkZXJzOiB7XHJcbiAgICAgICAgICAgICAgICBcIkNvbnRlbnQtVHlwZVwiOiBcImFwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZDsgY2hhcnNldD1VVEYtOFwiLFxyXG4gICAgICAgICAgICAgICAgXCJBY2NlcHRcIjogXCJhcHBsaWNhdGlvbi9qc29uLCB0ZXh0L2phdmFzY3JpcHRcIlxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJue1xyXG4gICAgICAgIGxvZ2luOiBsb2dpbixcclxuICAgICAgICBnZXQ6IGdldCxcclxuICAgICAgICBpbnNlcnQ6IGluc2VydCxcclxuICAgICAgICB1cGRhdGU6IHVwZGF0ZSxcclxuICAgICAgICBleGVjUXVlcnk6IGV4ZWNRdWVyeSxcclxuICAgICAgICB1cGxvYWRJbWFnZTogdXBsb2FkSW1hZ2UsXHJcbiAgICAgICAgdXBsb2FkSW1hZ2VCYXNlNjQ6IHVwbG9hZEltYWdlQmFzZTY0LFxyXG4gICAgICAgIHNlbmRTTVM6IHNlbmRTTVNcclxuICAgIH1cclxufSgpOyIsIid1c2Ugc3RyaWN0JztcclxubGV0IG0gPSByZXF1aXJlKCdtaXRocmlsJyk7XHJcbmxldCBNb2RhbCA9IHJlcXVpcmUoJy4uLy4uL2NvbXBvbmVudHMvbW9kYWwtd2luZG93L21vZGFsLXdpbmRvdy5qcycpO1xyXG5sZXQgUiA9IHJlcXVpcmUoJy4uLy4uL2NvbXBvbmVudHMvcmVxdWVzdC5qcycpO1xyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGNvbmZpZyl7XHJcbiAgICBsZXQgaW50ZXJ2YWwgPSBjb25maWcuaW50ZXJ2YWwgfHwgNTAwMDtcclxuICAgIGxldCBfbWVzc2FnZXMgPSBbXTtcclxuICAgIGxldCBfc3RhdGUgPSAnaGlkZGVuJztcclxuICAgIGxldCBfbW9kYWwgPSBmYWxzZTtcclxuICAgIFxyXG4gICAgZnVuY3Rpb24gZ2V0TWVzc2FnZXMoKXtcclxuICAgICAgICByZXR1cm4gUi5nZXQoJyonLCAnU1RfVVNFUl9NRVNTQUdFJywgXCJXSEVSRSBVU01fVVNFX0NPREUgPSBcIiArIEdsb2JhbHMudXNlcignVVNFX0NPREUnKSArIFwiIEFORCBVU01fSVNfUkVBREVOID0gMFwiKTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBpbml0Q2Fyb3VzZWwoZWwpe1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCdpbml0IGNhcm91c2VsJyk7XHJcbiAgICAgICAgJChlbC5kb20pLmNhcm91c2VsKHtcclxuICAgICAgICAgICAgaW50ZXJ2YWw6IGludGVydmFsXHJcbiAgICAgICAgfSkuY2Fyb3VzZWwoJ2N5Y2xlJyk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gcmVtb3ZlTWVzc2FnZShtZXNzYWdlSW5kZXgpe1xyXG4gICAgICAgIGxldCBtZXNzYWdlID0gX21lc3NhZ2VzW21lc3NhZ2VJbmRleF07XHJcbiAgICAgICAgUi51cGRhdGUoJ1NUX1VTRVJfTUVTU0FHRScsICdVU01fSVNfUkVBREVOID0gMScsIFwiVVNNX0NPREUgPSBcIiArIG1lc3NhZ2UuY29kZSk7XHJcbiAgICAgICAgX21lc3NhZ2VzLnNwbGljZShtZXNzYWdlSW5kZXgsIDEpO1xyXG4gICAgICAgIGlmKF9tZXNzYWdlcy5sZW5ndGggPT09IDApe1xyXG4gICAgICAgICAgICBfc3RhdGUgPSAnaGlkZGVuJztcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gb25JdGVtQ2xpY2soKXtcclxuICAgICAgICBsZXQgbWVzc2FnZUluZGV4ID0gdGhpcy5nZXRBdHRyaWJ1dGUoJ2RhdGEtaW5kZXgnKTtcclxuICAgICAgICBsZXQgbWVzc2FnZSA9IF9tZXNzYWdlc1ttZXNzYWdlSW5kZXhdO1xyXG4gICAgICAgIGlmKG1lc3NhZ2UuaXNOZXdzKXtcclxuICAgICAgICAgICAgLy9yZWxvY2F0ZVxyXG4gICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICBfbW9kYWwgPSBuZXcgTW9kYWwoe1xyXG4gICAgICAgICAgICAgICAgaWQ6ICdhbGVydE1vZGFsJyxcclxuICAgICAgICAgICAgICAgIHN0YXRlOiAnc2hvdycsXHJcbiAgICAgICAgICAgICAgICBoZWFkZXI6IG1lc3NhZ2UuaGVhZGVyLFxyXG4gICAgICAgICAgICAgICAgY29udGVudDogW1xyXG4gICAgICAgICAgICAgICAgICAgIG0oXCJkaXZcIiwge3N0eWxlOiBcInRleHQtYWxpZ246IGxlZnQ7XCJ9LCBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG0udHJ1c3QobWVzc2FnZS50ZXh0KVxyXG4gICAgICAgICAgICAgICAgICAgIF0pXHJcbiAgICAgICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICAgICAgaXNTdGF0aWM6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgaXNGb290ZXI6IHRydWUsXHJcbiAgICAgICAgICAgICAgICBpc0Z1bGxTY3JlZW46IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgbW9kYWxTaXplUGFyYW1zOiB7d2lkdGg6ICc5MCUnLCBoZWlnaHQ6IGZhbHNlLCBwYWRkaW5nOiAnMTUlIDAgMCAwJ30sXHJcbiAgICAgICAgICAgICAgICB6SW5kZXg6IDEwMDUsXHJcbiAgICAgICAgICAgICAgICBjYW5jZWxCdG46ICdub25lJywgXHJcbiAgICAgICAgICAgICAgICBjb25maXJtQnRuOiAn0J7QuicsXHJcbiAgICAgICAgICAgICAgICBvbkNvbmZpcm06IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICAgICAgICAgX21vZGFsID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVtb3ZlTWVzc2FnZShtZXNzYWdlSW5kZXgpO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIG9uQ2FuY2VsOiBmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAgICAgICAgIF9tb2RhbCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIHJlbW92ZU1lc3NhZ2UobWVzc2FnZUluZGV4KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gb25pbml0KCl7XHJcbiAgICAgICAgZ2V0TWVzc2FnZXMoKVxyXG4gICAgICAgICAgICAudGhlbihkYXRhID0+IHtcclxuICAgICAgICAgICAgICAgIGlmKGRhdGEubGVuZ3RoID09PSAwKSByZXR1cm47XHJcbiAgICAgICAgICAgICAgICBkYXRhLm1hcChtZXNzYWdlID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBfbWVzc2FnZXMucHVzaCh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvZGU6IG1lc3NhZ2VbJ1VTTV9DT0RFJ10sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGhlYWRlcjogbWVzc2FnZVsnVVNNX0hFQURFUiddLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBhbm5vdGF0aW9uOiBtZXNzYWdlWydVU01fQU5OT1RBVElPTiddLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBtZXNzYWdlWydVU01fVEVYVCddLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpc05ld3M6IG1lc3NhZ2VbJ1VTTV9JU19ORVdTJ11cclxuICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICBfc3RhdGUgPSAnc2hvdyc7XHJcbiAgICAgICAgICAgICAgICBtLnJlZHJhdygpO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAuY2F0Y2goZXJyb3IgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihlcnJvcik7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICB9XHJcbiAgICBcclxuICAgIGZ1bmN0aW9uIHZpZXcoKXtcclxuICAgICAgICBzd2l0Y2ggKF9zdGF0ZSkge1xyXG4gICAgICAgICAgICBjYXNlICdoaWRkZW4nOlxyXG4gICAgICAgICAgICAgICAgcmV0dXJuICcnO1xyXG4gICAgICAgICAgICBjYXNlICdzaG93JzpcclxuICAgICAgICAgICAgICAgIHJldHVybiBtKFwiZGl2XCIsIHtjbGFzczogXCJtLWFsZXJ0XCJ9LCBbXHJcbiAgICAgICAgICAgICAgICAgICAgbShcImRpdlwiLCB7aWQ6IFwiYWxlcnRDYXJvdXNlbFwiLCBjbGFzczogXCJjYXJvdXNlbCBzbGlkZVwiLCBcImRhdGEtcmlkZVwiOiBcImNhcm91c2VsXCIsIG9uY3JlYXRlOiBpbml0Q2Fyb3VzZWwsIGtleTogRGF0ZS5ub3coKX0sIFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbShcImRpdlwiLCB7Y2xhc3M6IFwiY2Fyb3VzZWwtaW5uZXJcIiwgXCJyb2xlXCI6IFwibGlzdGJveFwifSwgW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgX21lc3NhZ2VzLm1hcCgobWVzc2FnZSwgaW5kZXgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gbShcImRpdlwiLCB7Y2xhc3M6IFwiaXRlbVwiKyhpbmRleCA9PT0gMCA/ICcgYWN0aXZlJyA6ICcnKSArICcgbS1hbGVydF9faXRlbScsIFwiZGF0YS1pbmRleFwiOiBpbmRleCwgb25jbGljazogb25JdGVtQ2xpY2t9LCBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG0oXCJkaXZcIiwge2NsYXNzOiBcIm0tYWxlcnRfX2l0ZW0taW5uZXJcIn0sIFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG0oXCJoM1wiLCBtZXNzYWdlLmhlYWRlciksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtKFwicFwiLCBtLnRydXN0KG1lc3NhZ2UuYW5ub3RhdGlvbikpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbShcInNwYW5cIiwge2NsYXNzOiBcImdseXBoaWNvbiBnbHlwaGljb24tZW52ZWxvcGVcIiwgXCJhcmlhLWhpZGRlblwiOiBcInRydWVcIn0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF0pXHJcbiAgICAgICAgICAgICAgICAgICAgXSksXHJcbiAgICAgICAgICAgICAgICAgICAgX21vZGFsID8gbShfbW9kYWwpIDogJydcclxuICAgICAgICAgICAgICAgIF0pXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHZpZXc6IHZpZXcsXHJcbiAgICAgICAgb25pbml0OiBvbmluaXRcclxuICAgIH1cclxufSIsIlwidXNlIHN0cmljdFwiO1xyXG5sZXQgbSA9IHJlcXVpcmUoJ21pdGhyaWwnKTtcclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoY29uZmlnKSB7XHJcblxyXG4gICAgZnVuY3Rpb24gZXhpdCgpe1xyXG4gICAgICAgIEdsb2JhbHMuc2V0QXV0aChmYWxzZSk7XHJcbiAgICAgICAgbS5yb3V0ZSgnL2xvZ2luJyk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gdmlldygpIHtcclxuICAgICAgICByZXR1cm4gbShcIm5hdlwiLCB7IGNsYXNzOiBcIm5hdmJhciBuYXZiYXItZGVmYXVsdCBuYXZiYXItZml4ZWQtdG9wXCIgfSxcclxuICAgICAgICAgICAgbShcImRpdlwiLCB7IGNsYXNzOiBcImNvbnRhaW5lci1mbHVpZFwiIH0sIFtcclxuICAgICAgICAgICAgICAgIG0oXCJkaXZcIiwgeyBjbGFzczogXCJuYXZiYXItaGVhZGVyXCIgfSwgW1xyXG4gICAgICAgICAgICAgICAgICAgIG0oXCJidXR0b25cIiwgeyB0eXBlOiBcImJ1dHRvblwiLCBjbGFzczogXCJuYXZiYXItdG9nZ2xlIGNvbGxhcHNlZFwiLCBcImRhdGEtdG9nZ2xlXCI6IFwiY29sbGFwc2VcIiwgXCJkYXRhLXRhcmdldFwiOiBcIiNtZW51Q29sbGFwc2VcIiwgXCJhcmlhLWV4cGFuZGVkXCI6IFwiZmFsc2VcIiB9LCBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG0oXCJzcGFuXCIsIHsgY2xhc3M6IFwic3Itb25seVwiIH0sICdUb2dnbGUgbmF2aWdhdGlvbicpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBtKFwic3BhblwiLCB7IGNsYXNzOiBcImljb24tYmFyXCIgfSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG0oXCJzcGFuXCIsIHsgY2xhc3M6IFwiaWNvbi1iYXJcIiB9KSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgbShcInNwYW5cIiwgeyBjbGFzczogXCJpY29uLWJhclwiIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgXSksXHJcbiAgICAgICAgICAgICAgICAgICAgbShcImFcIiwgeyBjbGFzczogXCJuYXZiYXItYnJhbmQgbS1tZW51X191c2VyLWNvbnRhaW5lclwiLCBocmVmOiBcIi9ob21lXCIsIG9uY3JlYXRlOiBtLnJvdXRlLmxpbmsgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgbShcInNwYW5cIiwgeyBjbGFzczogXCJnbHlwaGljb24gZ2x5cGhpY29uLXVzZXJcIiwgXCJhcmlhLWhpZGRlblwiOiBcInRydWVcIiB9KSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgR2xvYmFscy51c2VyKCdVU0VfTkFNRScpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vXCIgKFwiK0dsb2JhbHMudXNlcihcIlVTRV9TQ09SRVwiKStcIiDQsdCw0LvQu9C+0LIpXCJcclxuICAgICAgICAgICAgICAgICAgICApXHJcbiAgICAgICAgICAgICAgICBdKSxcclxuICAgICAgICAgICAgICAgIG0oXCJkaXZcIiwgeyBjbGFzczogXCJjb2xsYXBzZSBuYXZiYXItY29sbGFwc2VcIiwgaWQ6IFwibWVudUNvbGxhcHNlXCIgfSwgW1xyXG4gICAgICAgICAgICAgICAgICAgIG0oXCJ1bFwiLCB7IGNsYXNzOiBcIm5hdiBuYXZiYXItbmF2XCIgfSwgW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBtKFwibGlcIiwgeyBjbGFzczogKG0ucm91dGUuZ2V0KCkgPT09ICcvbGlzdCcgPyBcImFjdGl2ZVwiIDogXCJcIikgfSwgbShcImFcIiwgeyBocmVmOiBcIi9saXN0XCIsIGNsYXNzOiBcIlwiLCBvbmNyZWF0ZTogbS5yb3V0ZS5saW5rIH0sICfQl9Cw0LTQsNGH0LgnKSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG0oXCJsaVwiLCB7IGNsYXNzOiAobS5yb3V0ZS5nZXQoKSA9PT0gJy9ob21lJyA/IFwiYWN0aXZlXCIgOiBcIlwiKSB9LCBtKFwiYVwiLCB7IGhyZWY6IFwiL2hvbWVcIiwgb25jcmVhdGU6IG0ucm91dGUubGluayB9LCAn0JvQuNGH0L3Ri9C5INC60LDQsdC40L3QtdGCJykpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBtKFwibGlcIiwgeyBjbGFzczogKG0ucm91dGUuZ2V0KCkgPT09ICcvbWVzc2FnZXMnID8gXCJhY3RpdmVcIiA6IFwiXCIpIH0sIG0oXCJhXCIsIHsgaHJlZjogXCIvbWVzc2FnZXNcIiwgb25jcmVhdGU6IG0ucm91dGUubGluayB9LCAn0KHQvtC+0LHRidC10L3QuNGPJykpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBtKFwibGlcIiwgbShcImFcIiwgeyBocmVmOiBcIlwiLCBvbmNsaWNrOiBleGl0IH0sICfQktGL0YXQvtC0JykpLFxyXG4gICAgICAgICAgICAgICAgICAgIF0pXHJcbiAgICAgICAgICAgICAgICBdKVxyXG4gICAgICAgICAgICBdKVxyXG4gICAgICAgIClcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBvbmluaXQoKXtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBvbmluaXQ6IG9uaW5pdCxcclxuICAgICAgICB2aWV3OiB2aWV3XHJcbiAgICB9XHJcbn0iLCIndXNlIHN0cmljdCc7XHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oY29uZmlnKXtcclxuICAgIGxldCBzdXJ2ZXlEYXRhID0gY29uZmlnLmRhdGE7XHJcbiAgICBcclxuICAgIGxldCBzdXJ2ZXlNb2RlbCA9IHtcclxuICAgICAgICBzdHJ1Y3R1cmU6IHt9LFxyXG4gICAgICAgIHJlc3VsdHM6IHt9LFxyXG4gICAgICAgIHJlbW92ZVF1ZXN0aW9uRnJvbVJlc3VsdHM6IChxdWVzdGlvbkNvZGUpID0+IHtcclxuICAgICAgICAgICAgZGVsZXRlIHN1cnZleU1vZGVsLnJlc3VsdHNbcXVlc3Rpb25Db2RlXTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGFkZFF1ZXN0aW9uUmVzdWx0OiAocXVlc3Rpb24sIGRhdGEpID0+IHtcclxuICAgICAgICAgICAgc3VydmV5TW9kZWwucmVzdWx0c1txdWVzdGlvbl0gPSBkYXRhO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgZnVuY3Rpb24gcHJlcGFyZSgpe1xyXG4gICAgICAgIHN1cnZleU1vZGVsLnN0cnVjdHVyZSA9IHN1cnZleURhdGEucmVkdWNlKCAoc3VydmV5LCByb3csIGluZGV4KSA9PiB7ICAgXHJcbiAgICAgICAgICAgIGlmKCFzdXJ2ZXkuaGFzT3duUHJvcGVydHkocm93WydRVUVfQ09ERSddKSl7XHJcbiAgICAgICAgICAgICAgICBzdXJ2ZXlbcm93WydRVUVfQ09ERSddXSA9IHtcclxuICAgICAgICAgICAgICAgICAgICBjb2RlOiByb3dbJ1FVRV9DT0RFJ10sXHJcbiAgICAgICAgICAgICAgICAgICAgdGV4dDoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBydTogcm93WydRVUVfVEVYVCddLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBrejogcm93WydRVUVfVEVYVF9LQVonXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZW46IHJvd1snUVVFX1RFWFRfRU5HJ10sXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICBwaG90bzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBydTogcm93WydRVUVfUEhPVE8nXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAga3o6IHJvd1snUVVFX1BIT1RPX0tBWiddLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbjogcm93WydRVUVfUEhPVE9fRU5HJ10sXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICB0eXBlQ29kZTogcm93WydRVVRfQUxJQVMnXSxcclxuICAgICAgICAgICAgICAgICAgICB0eXBlTmFtZTogcm93WydRVVRfTkFNRSddLFxyXG4gICAgICAgICAgICAgICAgICAgIGFuc3dlcnM6IFtdLFxyXG4gICAgICAgICAgICAgICAgICAgIGlzRmlyc3Q6IGluZGV4ID09PSAwXHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZihpbmRleCA9PT0gMCl7XHJcbiAgICAgICAgICAgICAgICBzdXJ2ZXkuZmlyc3RRdWVzdGlvbiA9IHJvd1snUVVFX0NPREUnXTtcclxuICAgICAgICAgICAgICAgIHN1cnZleVtyb3dbJ1FVRV9DT0RFJ11dLmlzRmlyc3QgPSB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBzdXJ2ZXlbcm93WydRVUVfQ09ERSddXS5hbnN3ZXJzLnB1c2goe1xyXG4gICAgICAgICAgICAgICAgY29kZTogcm93WydBTlNfQ09ERSddLFxyXG4gICAgICAgICAgICAgICAgdGV4dDoge1xyXG4gICAgICAgICAgICAgICAgICAgIHJ1OiByb3dbJ0FOU19URVhUJ10sXHJcbiAgICAgICAgICAgICAgICAgICAga3o6IHJvd1snQU5TX1RFWFRfS0FaJ10sXHJcbiAgICAgICAgICAgICAgICAgICAgZW46IHJvd1snQU5TX1RFWFRfRU5HJ11cclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBwaG90bzoge1xyXG4gICAgICAgICAgICAgICAgICAgIHJ1OiByb3dbJ0FOU19QSE9UTyddLFxyXG4gICAgICAgICAgICAgICAgICAgIGt6OiByb3dbJ0FOU19QSE9UT19LQVonXSxcclxuICAgICAgICAgICAgICAgICAgICBlbjogcm93WydBTlNfUEhPVE9fRU5HJ11cclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBvcmRlcjogcm93WydTVURfU0hPV19PUkRFUiddLFxyXG4gICAgICAgICAgICAgICAgaXNNYW5kYXRvcnk6IHJvd1snU1VEX0FOU19JU19NQU5EQVRPUlknXSxcclxuICAgICAgICAgICAgICAgIG5leHRRdWVzdGlvbjogcm93WydBTlNfTkVYVF9RVUVfQ09ERSddXHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHN1cnZleTtcclxuICAgICAgICB9LCB7Zmlyc3RRdWVzdGlvbjogbnVsbH0pO1xyXG4gICAgICAgIHJldHVybiBzdXJ2ZXlNb2RlbC5zdHJ1Y3R1cmU7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBwcmVwYXJlOiBwcmVwYXJlLFxyXG4gICAgICAgIGdldFN0cnVjdHVyZTogZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgcmV0dXJuIHN1cnZleU1vZGVsLnN0cnVjdHVyZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0iLCIndXNlIHN0cmljdCc7XHJcbmxldCBtID0gcmVxdWlyZSgnbWl0aHJpbCcpO1xyXG4vL2ltcG9ydCB0eXBlc1xyXG5sZXQgRmluYWxTY3JlZW4gPSByZXF1aXJlKCcuL3R5cGVzL2ZpbmFsLXNjcmVlbi5qcycpO1xyXG5sZXQgUGFpbnRTY3JlZW4gPSByZXF1aXJlKCcuL3R5cGVzL3BhaW50LXNjcmVlbi5qcycpO1xyXG5sZXQgUGhvdG9TY3JlZW4gPSByZXF1aXJlKCcuL3R5cGVzL3Bob3RvLXNjcmVlbi5qcycpO1xyXG5sZXQgSW1hZ2VTY3JlZW4gPSByZXF1aXJlKCcuL3R5cGVzL2ltYWdlLXNjcmVlbi5qcycpO1xyXG5sZXQgTGFuZ3VhZ2VTY3JlZW4gPSByZXF1aXJlKCcuL3R5cGVzL2xhbmd1YWdlLXNjcmVlbi5qcycpO1xyXG5sZXQgVGV4dExpc3RTY3JlZW4gPSByZXF1aXJlKCcuL3R5cGVzL3RleHQtbGlzdC1zY3JlZW4uanMnKTtcclxubGV0IFZpZGVvU2NyZWVuID0gcmVxdWlyZSgnLi90eXBlcy92aWRlby1zY3JlZW4uanMnKTtcclxubGV0IEltYWdlR3JpZFNjcmVlbiA9IHJlcXVpcmUoJy4vdHlwZXMvaW1hZ2UtZ3JpZC1zY3JlZW4uanMnKTtcclxubGV0IFJlZ2lzdGVyTmFtZVBob25lU2NyZWVuID0gcmVxdWlyZSgnLi90eXBlcy9yZWdpc3Rlci1uYW1lLXBob25lLXNjcmVlbi5qcycpO1xyXG5sZXQgUmVnaXN0ZXJCaXJ0aEdlbmRlclNjcmVlbiA9IHJlcXVpcmUoJy4vdHlwZXMvcmVnaXN0ZXItYmlydGgtZ2VuZGVyLXNjcmVlbi5qcycpO1xyXG5sZXQgUmVnaXN0ZXJDb25maXJtU21zU2NyZWVuID0gcmVxdWlyZSgnLi90eXBlcy9jb25maXJtLWNvZGUuanMnKTtcclxubGV0IERpZ2l0SW5wdXRTY3JlZW4gPSByZXF1aXJlKCcuL3R5cGVzL2RpZ2l0LWlucHV0LXNjcmVlbi5qcycpO1xyXG5sZXQgVW5rbm93blNjcmVlbiA9IHJlcXVpcmUoJy4vdHlwZXMvdW5rbm93bi5qcycpO1xyXG5cclxuZnVuY3Rpb24gYnVpbGQoY29uZmlnKXtcclxuICAgIHN3aXRjaChjb25maWcucXVlc3Rpb24udHlwZUNvZGUpe1xyXG4gICAgICAgIGNhc2UgJ0RJR0lUX0lOUFVUJzpcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBEaWdpdElucHV0U2NyZWVuKCBjb25maWcgKTtcclxuXHJcbiAgICAgICAgY2FzZSAnUEFJTlQnOlxyXG4gICAgICAgICAgICByZXR1cm4gbmV3IFBhaW50U2NyZWVuKCBjb25maWcgKTtcclxuXHJcbiAgICAgICAgY2FzZSAnRklOQUxfU0NSRUVOJzpcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBGaW5hbFNjcmVlbiggY29uZmlnICk7XHJcblxyXG4gICAgICAgIGNhc2UgJ1VTRVJfUEhPVE8nOlxyXG4gICAgICAgICAgICByZXR1cm4gbmV3IFBob3RvU2NyZWVuKCBjb25maWcgKTtcclxuXHJcbiAgICAgICAgY2FzZSAnSU1BR0VfU0NSRUVOJzpcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBJbWFnZVNjcmVlbiggY29uZmlnICk7XHJcblxyXG4gICAgICAgIGNhc2UgJ1JFR0lTVEVSX05BTUVfUEhPTkUnOlxyXG4gICAgICAgICAgICByZXR1cm4gbmV3IFJlZ2lzdGVyTmFtZVBob25lU2NyZWVuKCBjb25maWcgKTtcclxuXHJcbiAgICAgICAgY2FzZSAnUkVHSVNURVJfQklSVEhfR0VOREVSJzpcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBSZWdpc3RlckJpcnRoR2VuZGVyU2NyZWVuKCBjb25maWcgKTtcclxuXHJcbiAgICAgICAgY2FzZSAnUkVHSVNURVJfQ09ORklSTV9TTVMnOlxyXG4gICAgICAgICAgICByZXR1cm4gbmV3IFJlZ2lzdGVyQ29uZmlybVNtc1NjcmVlbiggY29uZmlnICk7XHJcblxyXG4gICAgICAgIGNhc2UgJ0xBTkdVQUdFX0NIT0lDRSc6XHJcbiAgICAgICAgICAgIGNvbmZpZy5sYW5ncyA9IEdsb2JhbHMuZ2V0TGFuZ0xpc3QoKTtcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBMYW5ndWFnZVNjcmVlbiggY29uZmlnICk7XHJcblxyXG4gICAgICAgIGNhc2UgJ1ZJREVPX1NDUkVFTic6XHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgVmlkZW9TY3JlZW4oIGNvbmZpZyApO1xyXG5cclxuICAgICAgICBjYXNlICdJTUFHRV9HUklEX1dJVEhfTEFCRUwnOlxyXG4gICAgICAgICAgICBjb25maWcud2l0aExhYmVsID0gdHJ1ZTtcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBJbWFnZUdyaWRTY3JlZW4oIGNvbmZpZyApO1xyXG5cclxuICAgICAgICBjYXNlICdJTUFHRV9HUklEX1dJVEhPVVRfTEFCRUwnOlxyXG4gICAgICAgICAgICBjb25maWcud2l0aExhYmVsID0gZmFsc2U7XHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgSW1hZ2VHcmlkU2NyZWVuKCBjb25maWcgKTtcclxuXHJcbiAgICAgICAgY2FzZSAnTElTVF9TSU5HTEVfQU5TV0VSJzpcclxuICAgICAgICAgICAgY29uZmlnLndpdGhGaWx0ZXIgPSBmYWxzZTtcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBUZXh0TGlzdFNjcmVlbiggY29uZmlnICk7XHJcblxyXG4gICAgICAgIGNhc2UgJ0xJU1RfU0lOR0xFX0FOU1dFUl9XSVRIX0ZJTFRFUic6XHJcbiAgICAgICAgICAgIGNvbmZpZy53aXRoRmlsdGVyID0gdHJ1ZTtcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBUZXh0TGlzdFNjcmVlbiggY29uZmlnICk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgVW5rbm93blNjcmVlbiggY29uZmlnICk7XHJcbiAgICB9XHJcbn1cclxubW9kdWxlLmV4cG9ydHMgPSBidWlsZDsiLCIndXNlIHN0cmljdCc7XHJcbmxldCBtID0gcmVxdWlyZSgnbWl0aHJpbCcpO1xyXG5sZXQgUiA9IHJlcXVpcmUoJy4uLy4uL2NvbXBvbmVudHMvcmVxdWVzdC5qcycpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoY29uZmlnKSB7XHJcbiAgICBsZXQgc3VydmV5ID0gY29uZmlnLnN1cnZleTtcclxuICAgIGxldCBhZnRlclNhdmUgPSBjb25maWcuYWZ0ZXJTYXZlIHx8IGZ1bmN0aW9uICgpIHsgY29uc29sZS5sb2coJ3NhdmVkJyk7IH07XHJcbiAgICBsZXQgcmVzdWx0cyA9IHt9O1xyXG4gICAgbGV0IGRlZmF1bHRTYWxlcG9pbnQgPSAzODsgIC8vMTE4MzQ2INC90LAgMS4yMDAgXHJcbiAgICBsZXQgdmlzaXRDb2RlO1xyXG5cclxuICAgIGZ1bmN0aW9uIHNldChxdWVzdGlvbiwgYW5zd2VyQ29kZSwgcmVzdWx0KSB7XHJcbiAgICAgICAgcmVzdWx0c1txdWVzdGlvbi5jb2RlXSA9IHsgcXVlc3Rpb246IHF1ZXN0aW9uLCBhbnN3ZXJDb2RlOiBhbnN3ZXJDb2RlLCByZXN1bHQ6IHJlc3VsdCB9O1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGdldChjb2RlKSB7XHJcbiAgICAgICAgaWYgKHJlc3VsdHMuaGFzT3duUHJvcGVydHkoY29kZSkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdHNbY29kZV07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiByZW1vdmUocXVlc3Rpb25Db2RlKSB7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgZGVsZXRlIHJlc3VsdHNbcXVlc3Rpb25Db2RlXTtcclxuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKCd0aGVyZSBpcyBubyB0aGlzIHF1ZXN0aW9uIGNvZGUgaW4gcmVzdWx0cyEnKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gZ2V0UmFuZG9tSW50KG1pbiwgbWF4KSB7XHJcbiAgICAgICAgcmV0dXJuIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIChtYXggLSBtaW4pKSArIG1pbjtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBnZXREYXRlVGltZVN0cmluZygpe1xyXG4gICAgICAgIGxldCBjdXJyZW50ZGF0ZSA9IG5ldyBEYXRlKCk7XHJcbiAgICAgICAgcmV0dXJuIGN1cnJlbnRkYXRlLmdldEZ1bGxZZWFyKCkgKyBcIi5cIlxyXG4gICAgICAgICAgICArICgoY3VycmVudGRhdGUuZ2V0TW9udGgoKSArIDEpIDwgMTAgPyBcIjBcIiA6IFwiXCIpICsgKGN1cnJlbnRkYXRlLmdldE1vbnRoKCkgKyAxKSArIFwiLlwiXHJcbiAgICAgICAgICAgICsgKGN1cnJlbnRkYXRlLmdldERhdGUoKSA8IDEwID8gXCIwXCIgOiBcIlwiKSArIGN1cnJlbnRkYXRlLmdldERhdGUoKSArIFwiIFwiXHJcbiAgICAgICAgICAgICsgY3VycmVudGRhdGUuZ2V0SG91cnMoKSArIFwiOlwiXHJcbiAgICAgICAgICAgICsgY3VycmVudGRhdGUuZ2V0TWludXRlcygpICsgXCI6XCJcclxuICAgICAgICAgICAgKyBjdXJyZW50ZGF0ZS5nZXRTZWNvbmRzKCk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gY3JlYXRlVmlzaXQoKSB7XHJcbiAgICAgICAgbGV0IGN1cnJlbnRkYXRlID0gbmV3IERhdGUoKTtcclxuICAgICAgICBsZXQgZGF0ZXRpbWUgPSBnZXREYXRlVGltZVN0cmluZygpO1xyXG4gICAgICAgIGxldCB2aXNpdElkID0gR2xvYmFscy51c2VyKCdVU0VfQ09ERScpICsgJy8nICsgZGVmYXVsdFNhbGVwb2ludCArICcvJyArIGdldFJhbmRvbUludCgxMDAwLCA5OTk5KSArICcgLSAnICsgZGF0ZXRpbWU7XHJcbiAgICAgICAgbGV0IGNvb3JkaW5hdGVzID0gR2xvYmFscy5nZXRDb29yZGluYXRlcygpO1xyXG4gICAgICAgIHJldHVybiBSLmluc2VydChcclxuICAgICAgICAgICAgJ1NUX1ZJU0lUJywgXHJcbiAgICAgICAgICAgICdWSVNfTlVNQkVSLCBWSVNfVVNFX0NPREUsIFZJU19TQUxfQ09ERSwgVklTX1NUQVJUX0RBVEUsIFZJU19GSU5JU0hfREFURSwgVklTX1ZJVF9DT0RFLCBWSVNfTEFUSVRVREUsIFZJU19MT05HSVRVREUnLCBcclxuICAgICAgICAgICAgYCcke3Zpc2l0SWR9JywgJHtHbG9iYWxzLnVzZXIoJ1VTRV9DT0RFJyl9LCAke0dsb2JhbHMudXNlcignVVNFX1NBTF9DT0RFJyl9LCAnJHtkYXRldGltZX0nLCAnJHtkYXRldGltZX0nLCAnNCcsICcke2Nvb3JkaW5hdGVzLmxhdGl0dWRlfScsICcke2Nvb3JkaW5hdGVzLmxvbmdpdHVkZX0nYClcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBzYXZlUmVzcG9uZGVudCgpIHtcclxuICAgICAgICBsZXQgcHJvbWlzZUFycmF5ID0gW107XHJcbiAgICAgICAgbGV0IHVzZXIgPSBudWxsO1xyXG5cclxuICAgICAgICBmb3IgKGxldCBxdWVzdGlvbkNvZGUgaW4gcmVzdWx0cykge1xyXG4gICAgICAgICAgICBsZXQgcmVzdWx0T2JqID0gcmVzdWx0c1txdWVzdGlvbkNvZGVdO1xyXG4gICAgICAgICAgICBzd2l0Y2ggKHJlc3VsdE9iai5xdWVzdGlvbi50eXBlQ29kZSkge1xyXG4gICAgICAgICAgICAgICAgY2FzZSAnUkVHSVNURVJfTkFNRV9QSE9ORSc6XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHVzZXIgPT09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdXNlciA9IHsgbmFtZTogcmVzdWx0T2JqLnJlc3VsdC5uYW1lLCBzdXJuYW1lOiByZXN1bHRPYmoucmVzdWx0LnN1cm5hbWUsIHBob25lOiByZXN1bHRPYmoucmVzdWx0LnBob25lIH07XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdXNlci5uYW1lID0gcmVzdWx0T2JqLnJlc3VsdC5uYW1lO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB1c2VyLnN1cm5hbWUgPSByZXN1bHRPYmoucmVzdWx0LnN1cm5hbWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHVzZXIucGhvbmUgPSByZXN1bHRPYmoucmVzdWx0LnBob25lO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgICAgICBjYXNlICdSRUdJU1RFUl9CSVJUSF9HRU5ERVInOlxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh1c2VyID09PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHVzZXIgPSB7IGdlbmRlcjogcmVzdWx0T2JqLnJlc3VsdC5nZW5kZXIsIGJpcnRoZGF0ZTogcmVzdWx0T2JqLnJlc3VsdC5iaXJ0aGRhdGUgfTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB1c2VyLmdlbmRlciA9IChyZXN1bHRPYmoucmVzdWx0LmdlbmRlciA9PT0gJ21hbicpID8gNCA6IDU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHVzZXIuYmlydGhkYXRlID0gcmVzdWx0T2JqLnJlc3VsdC5iaXJ0aGRhdGU7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodXNlciA9PT0gbnVsbCkge1xyXG4gICAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzb2x2ZShudWxsKTtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gUi5pbnNlcnQoXHJcbiAgICAgICAgICAgICAgICAnU1RfUkVTUE9OREVOVFMnLFxyXG4gICAgICAgICAgICAgICAgJ1JFU19OQU1FLCBSRVNfU1VSTkFNRSwgUkVTX0JJUlRIREFURSwgUkVTX1BIT05FLCBSRVNfR05EX0NPREUsIFJFU19WSVNfQ09ERSwgUkVTX1NVUl9DT0RFJyxcclxuICAgICAgICAgICAgICAgIFwiTidcIiArIHVzZXIubmFtZSArIFwiJywgTidcIiArIHVzZXIuc3VybmFtZSArIFwiJyAsXCIgKyBcIkNPTlZFUlQoREFURVRJTUUsJ1wiICsgdXNlci5iaXJ0aGRhdGUgKyBcIicsMTA0KSwgJys3XCIgKyB1c2VyLnBob25lICsgXCInLCBcIiArIHVzZXIuZ2VuZGVyICsgJywgJyArIHZpc2l0Q29kZSArICcsICcgKyBzdXJ2ZXkpXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHNhdmVTdXJ2ZXlSZXN1bHRzKHJlc3BvbmRlbnQpIHtcclxuICAgICAgICBsZXQgcHJvbWlzZUFycmF5ID0gW107XHJcblxyXG4gICAgICAgIGZvciAobGV0IHF1ZXN0aW9uQ29kZSBpbiByZXN1bHRzKSB7XHJcbiAgICAgICAgICAgIGxldCByZXN1bHRPYmogPSByZXN1bHRzW3F1ZXN0aW9uQ29kZV07XHJcbiAgICAgICAgICAgIHN3aXRjaCAocmVzdWx0T2JqLnF1ZXN0aW9uLnR5cGVDb2RlKSB7XHJcbiAgICAgICAgICAgICAgICBjYXNlICdVU0VSX1BIT1RPJzpcclxuICAgICAgICAgICAgICAgICAgICBsZXQgcGhvdG8gPSByZXN1bHRPYmoucmVzdWx0O1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBjdXJyZW50ZGF0ZSA9IG5ldyBEYXRlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGV4dGVuc2lvbiA9IHBob3RvLm5hbWUuc3BsaXQoJy4nKS5wb3AoKTtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgZGF0ZXRpbWUgPSBnZXREYXRlVGltZVN0cmluZygpO1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBwaG90b05hbWUgPSBHbG9iYWxzLnVzZXIoJ1VTRV9DT0RFJykgKyAnXycgKyBnZXRSYW5kb21JbnQoMTAwMCwgOTk5OSkgKyAnXycgKyBkYXRldGltZSArICcuJyArIGV4dGVuc2lvbjtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgcHJvbWlzZUFycmF5LnB1c2goXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFIuaW5zZXJ0KFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ1NUX1ZJU0lUX1BIT1RPJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdWSVBfVklTX0NPREUsIFZJUF9GT0xERVJfTkFNRSwgVklQX1BIT1RPX05BTUUnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmlzaXRDb2RlICsgXCIsICdcIiArIEdsb2JhbHMudXNlcignVVNFX0NPREUnKSArIFwiJywgJ1wiICsgcGhvdG9OYW1lICsgXCInXCIpXHJcbiAgICAgICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgICAgICAgICBwcm9taXNlQXJyYXkucHVzaChSLnVwbG9hZEltYWdlKHBob3RvLCBHbG9iYWxzLnVzZXIoJ1VTRV9DT0RFJyksIHJlc3VsdE9iai5yZXN1bHQpKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgcHJvbWlzZUFycmF5LnB1c2goXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFIuaW5zZXJ0KFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ1NUX1NVUlZFWV9SRVNVTFRTJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdTUlNfVklTX0NPREUsIFNSU19TVVJfQ09ERSwgU1JTX1FVRV9DT0RFLCBTUlNfQU5TX0NPREUsIFNSU19BTlNfVkFMVUUnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmlzaXRDb2RlICsgJywgJyArIHN1cnZleSArICcsICcgKyByZXN1bHRPYmoucXVlc3Rpb24uY29kZSArICcsICcgKyByZXN1bHRPYmouYW5zd2VyQ29kZSArICcsIDEnXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIClcclxuICAgICAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgICAgICAgIGNhc2UgJ1BBSU5UJzpcclxuICAgICAgICAgICAgICAgICAgICBsZXQgaW1hZ2VOYW1lID0gR2xvYmFscy51c2VyKCdVU0VfQ09ERScpICsgJ18nICsgZ2V0UmFuZG9tSW50KDEwMDAsIDk5OTkpICsgJ18nICsgZ2V0RGF0ZVRpbWVTdHJpbmcoKTtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgIGlmKHJlc3BvbmRlbnQgIT09IG51bGwpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwcm9taXNlQXJyYXkucHVzaChcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFIuaW5zZXJ0KFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdTVF9WSVNJVF9QSE9UTycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ1ZJUF9WSVNfQ09ERSwgVklQX0ZPTERFUl9OQU1FLCBWSVBfUEhPVE9fTkFNRScsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmlzaXRDb2RlICsgXCIsICdcIiArIEdsb2JhbHMudXNlcignVVNFX0NPREUnKSArIFwiJywgJ1wiICsgaW1hZ2VOYW1lICsgXCInXCIpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBwcm9taXNlQXJyYXkucHVzaChSLnVwbG9hZEltYWdlQmFzZTY0KHBob3RvLCAnU1RfUkVTUE9OREVOVCcsIHBob3RvTmFtZSwgbnVsbCkpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgICAgICAgIGNhc2UgJ0RJR0lUX0lOUFVUJzpcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBhbnN3ZXJDb2RlIGluIHJlc3VsdE9iai5yZXN1bHQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcHJvbWlzZUFycmF5LnB1c2goXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBSLmluc2VydChcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnU1RfU1VSVkVZX1JFU1VMVFMnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdTUlNfVklTX0NPREUsIFNSU19TVVJfQ09ERSwgU1JTX1FVRV9DT0RFLCBTUlNfQU5TX0NPREUsIFNSU19BTlNfVkFMVUUnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICdXVF9TWU5DX0hfU1RfU1VSVkVZX1JFU1VMVFMnLCBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAnU1JTX1ZJU19OVU1CRVIsIFNSU19TVVJfQ09ERSwgU1JTX1FVRV9DT0RFLCBTUlNfQU5TX0NPREUsIFNSU19BTlNfVkFMVUUsIFVTRV9DT0RFJywgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmlzaXRDb2RlICsgJywgJyArIHN1cnZleSArICcsICcgKyByZXN1bHRPYmoucXVlc3Rpb24uY29kZSArICcsICcgKyBhbnN3ZXJDb2RlICsgJywgJyArIHJlc3VsdE9iai5yZXN1bHRbYW5zd2VyQ29kZV1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIClcclxuICAgICAgICAgICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgICAgIHByb21pc2VBcnJheS5wdXNoKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBSLmluc2VydChcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICdXVF9TWU5DX0hfU1RfU1VSVkVZX1JFU1VMVFMnLCBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICdTUlNfVklTX05VTUJFUiwgU1JTX1NVUl9DT0RFLCBTUlNfUVVFX0NPREUsIFNSU19BTlNfQ09ERSwgU1JTX0FOU19WQUxVRSwgVVNFX0NPREUnLCBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdTVF9TVVJWRVlfUkVTVUxUUycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnU1JTX1ZJU19DT0RFLCBTUlNfU1VSX0NPREUsIFNSU19RVUVfQ09ERSwgU1JTX0FOU19DT0RFLCBTUlNfQU5TX1ZBTFVFJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZpc2l0Q29kZSArICcsICcgKyBzdXJ2ZXkgKyAnLCAnICsgcmVzdWx0T2JqLnF1ZXN0aW9uLmNvZGUgKyAnLCAnICsgcmVzdWx0T2JqLmFuc3dlckNvZGUgKyAnLCAxJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICApXHJcbiAgICAgICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gUHJvbWlzZS5hbGwocHJvbWlzZUFycmF5KTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBzYXZlKCkge1xyXG4gICAgICAgIHJldHVybiBjcmVhdGVWaXNpdCgpXHJcbiAgICAgICAgICAgIC50aGVuKHZpc2l0ID0+IHtcclxuICAgICAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmlzaXRDb2RlID0gdmlzaXRbMF0ua2V5O1xyXG4gICAgICAgICAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ9Ce0YjQuNCx0LrQsCDRgdC+0YXRgNCw0L3QtdC90LjRjyDQvtC/0YDQvtGB0LAhJyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC50aGVuKHNhdmVSZXNwb25kZW50KVxyXG4gICAgICAgICAgICAudGhlbihzYXZlU3VydmV5UmVzdWx0cylcclxuICAgICAgICAgICAgLnRoZW4oYWZ0ZXJTYXZlKVxyXG4gICAgICAgICAgICAudGhlbigoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBtLnJlZHJhdygpO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAuY2F0Y2goZXJyb3IgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXJyb3IpO1xyXG4gICAgICAgICAgICAgICAgbS5yZWRyYXcoKTtcclxuICAgICAgICAgICAgfSlcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIGdldDogZ2V0LFxyXG4gICAgICAgIHNldDogc2V0LFxyXG4gICAgICAgIHJlbW92ZTogcmVtb3ZlLFxyXG4gICAgICAgIHNhdmU6IHNhdmVcclxuICAgIH1cclxufTsiLCIndXNlIHN0cmljdCc7XHJcbmxldCBtID0gcmVxdWlyZSgnbWl0aHJpbCcpO1xyXG5sZXQgSGVscGVyID0gcmVxdWlyZSgnLi4vLi4vY29tcG9uZW50cy9oZWxwZXIuanMnKTtcclxubGV0IFIgPSByZXF1aXJlKCcuLi8uLi9jb21wb25lbnRzL3JlcXVlc3QuanMnKTtcclxubGV0IFN1cnZleU1vZGVsQ29uID0gcmVxdWlyZSgnLi9tb2RlbC5qcycpO1xyXG5sZXQgUmVzdWx0TW9kZWxDb24gPSByZXF1aXJlKCcuL3Jlc3VsdC1tb2RlbC5qcycpO1xyXG5sZXQgQnVpbGRRdWVzdGlvblNjcmVlbiA9IHJlcXVpcmUoJy4vcXVlc3Rpb24tYnVpbGRlci5qcycpO1xyXG5sZXQgTG9hZGluZ01vZGFsID0gcmVxdWlyZSgnLi4vLi4vY29tcG9uZW50cy9tb2RhbC13aW5kb3cvbG9hZGluZy1tb2RhbC13aW5kb3cuanMnKTtcclxubGV0IE1vZGFsID0gcmVxdWlyZSgnLi4vLi4vY29tcG9uZW50cy9tb2RhbC13aW5kb3cvbW9kYWwtd2luZG93LmpzJyk7XHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oY29uZmlnKXtcclxuICAgIGxldCBzdXJ2ZXkgPSBjb25maWcuc3VydmV5IHx8IGZhbHNlO1xyXG4gICAgbGV0IGFmdGVyU2F2ZSA9IGNvbmZpZy5hZnRlclNhdmU7XHJcbiAgICBsZXQgU3VydmV5TW9kZWw7XHJcbiAgICBsZXQgUmVzdWx0TW9kZWw7XHJcbiAgICBsZXQgbG9hZGluZ01vZGFsID0gZmFsc2U7XHJcbiAgICBsZXQgYWxlcnRNb2RhbCA9IGZhbHNlO1xyXG4gICAgbGV0IF9RdWVzdGlvbjtcclxuICAgIGxldCBfc3RhdGUgPSAnbG9hZGluZyc7XHJcbiAgICBsZXQgX2Vycm9ycyA9IFtdO1xyXG4gICAgbGV0IF9xdWVzdGlvblN0cnVjdHVyZTtcclxuICAgIGxldCBfc3VydmV5U3RlcEhpc3RvcnkgPSBbXTtcclxuICAgIGxldCBfY3VycmVudFF1ZXN0aW9uO1xyXG4gICAgbGV0IF9zZXNzaW9uQ29kZSA9IEhlbHBlci5nZXRSYW5kb21JbnQoMTAwMCwgOTk5OSk7XHJcblxyXG4gICAgZnVuY3Rpb24gZ2VuZXJhdGVRdWVzdGlvbigpe1xyXG4gICAgICAgIF9RdWVzdGlvbiA9IEJ1aWxkUXVlc3Rpb25TY3JlZW4oe1xyXG4gICAgICAgICAgICBxdWVzdGlvbjogX2N1cnJlbnRRdWVzdGlvbixcclxuICAgICAgICAgICAgcHJldjogZ29QcmV2LFxyXG4gICAgICAgICAgICBuZXh0OiBnb05leHQsXHJcbiAgICAgICAgICAgIHNlc3Npb25Db2RlOiBfc2Vzc2lvbkNvZGUsXHJcbiAgICAgICAgICAgIFJlc3VsdE1vZGVsOiBSZXN1bHRNb2RlbCxcclxuICAgICAgICAgICAgb25BbGVydDogZnVuY3Rpb24oaGVhZGVyLCBtZXNzYWdlcyl7XHJcbiAgICAgICAgICAgICAgICBhbGVydE1vZGFsID0gbmV3IE1vZGFsKHtcclxuICAgICAgICAgICAgICAgICAgICBpZDogJ2FsZXJ0TW9kYWwnLFxyXG4gICAgICAgICAgICAgICAgICAgIHN0YXRlOiAnc2hvdycsXHJcbiAgICAgICAgICAgICAgICAgICAgaGVhZGVyOiBoZWFkZXIsXHJcbiAgICAgICAgICAgICAgICAgICAgY29udGVudDogW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBtKFwiZGl2XCIsIHtzdHlsZTogXCJ0ZXh0LWFsaWduOiBsZWZ0O1wifSwgW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZXMubWFwKG1lc3NhZ2UgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBtKFwicFwiLCBtZXNzYWdlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF0pXHJcbiAgICAgICAgICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgICAgICAgICBpc1N0YXRpYzogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAgICAgaXNGb290ZXI6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgaXNGdWxsU2NyZWVuOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgICAgICBtb2RhbFNpemVQYXJhbXM6IHt3aWR0aDogJzkwJScsIGhlaWdodDogZmFsc2UsIHBhZGRpbmc6ICcxNSUgMCAwIDAnfSxcclxuICAgICAgICAgICAgICAgICAgICB6SW5kZXg6IDEwMDUsXHJcbiAgICAgICAgICAgICAgICAgICAgY2FuY2VsQnRuOiAnbm9uZScsIFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbmZpcm1CdG46ICfQntC6JyxcclxuICAgICAgICAgICAgICAgICAgICBvbkNvbmZpcm06IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFsZXJ0TW9kYWwgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIG9uQ2FuY2VsOiBmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBhbGVydE1vZGFsID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHByZXBhcmVTdXJ2ZXkoZGF0YSl7XHJcbiAgICAgICAgU3VydmV5TW9kZWwgPSBuZXcgU3VydmV5TW9kZWxDb24oe2RhdGE6IGRhdGF9KTtcclxuICAgICAgICBfcXVlc3Rpb25TdHJ1Y3R1cmUgPSBTdXJ2ZXlNb2RlbC5wcmVwYXJlKCk7XHJcbiAgICAgICAgX2N1cnJlbnRRdWVzdGlvbiA9IF9xdWVzdGlvblN0cnVjdHVyZVtfcXVlc3Rpb25TdHJ1Y3R1cmUuZmlyc3RRdWVzdGlvbl07XHJcbiAgICAgICAgX3N1cnZleVN0ZXBIaXN0b3J5LnB1c2goX2N1cnJlbnRRdWVzdGlvbi5jb2RlKTtcclxuICAgICAgICBnZW5lcmF0ZVF1ZXN0aW9uKCk7XHJcbiAgICAgICAgX3N0YXRlID0gJ2xvYWRlZCc7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gZ29QcmV2KCl7XHJcbiAgICAgICAgbGV0IGN1cnJlbnRJbmRleCA9IF9zdXJ2ZXlTdGVwSGlzdG9yeS5pbmRleE9mKF9jdXJyZW50UXVlc3Rpb24uY29kZSk7XHJcbiAgICAgICAgX3N1cnZleVN0ZXBIaXN0b3J5LnNwbGljZShjdXJyZW50SW5kZXgsIDEpO1xyXG4gICAgICAgIF9jdXJyZW50UXVlc3Rpb24gPSBfcXVlc3Rpb25TdHJ1Y3R1cmVbX3N1cnZleVN0ZXBIaXN0b3J5W2N1cnJlbnRJbmRleCAtIDFdXTtcclxuICAgICAgICBnZW5lcmF0ZVF1ZXN0aW9uKCk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gZ29OZXh0KG5leHRRdWVzdGlvbiwgYW5zd2VyKXtcclxuICAgICAgICBfY3VycmVudFF1ZXN0aW9uID0gX3F1ZXN0aW9uU3RydWN0dXJlW25leHRRdWVzdGlvbl07XHJcbiAgICAgICAgX3N1cnZleVN0ZXBIaXN0b3J5LnB1c2goX2N1cnJlbnRRdWVzdGlvbi5jb2RlKTtcclxuICAgICAgICBnZW5lcmF0ZVF1ZXN0aW9uKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgICAvLy8gICBDT01QT05FTlQgTElGRUNZQ0xFIE1FVEhPRFMgICAvLy9cclxuICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxuICAgIGZ1bmN0aW9uIG9uaW5pdCgpe1xyXG4gICAgICAgIGlmIChzdXJ2ZXkpIHtcclxuICAgICAgICAgICAgUmVzdWx0TW9kZWwgPSBuZXcgUmVzdWx0TW9kZWxDb24oe1xyXG4gICAgICAgICAgICAgICAgc3VydmV5OiBzdXJ2ZXksXHJcbiAgICAgICAgICAgICAgICBhZnRlclNhdmU6IGFmdGVyU2F2ZVxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIFIuZ2V0KCcqJywgJ1ZJRVdfU1RfU1VSVkVZX0RFVEFJTFMnLCBcIldIRVJFIFNVRF9TVVJfQ09ERSA9IFwiK3N1cnZleSwgJ1NVRF9TSE9XX09SREVSJylcclxuICAgICAgICAgICAgICAgIC50aGVuKHByZXBhcmVTdXJ2ZXkpXHJcbiAgICAgICAgICAgICAgICAudGhlbigoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgbS5yZWRyYXcoKTtcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAuY2F0Y2goZnVuY3Rpb24oZSl7XHJcbiAgICAgICAgICAgICAgICAgICAgX2Vycm9ycy5wdXNoKCfQntGI0LjQsdC60LAg0LfQsNCz0YDRg9C30LrQuCDQtNCw0L3QvdGL0YUg0LTQu9GPINC+0L/RgNC+0YHQsCEnKTtcclxuICAgICAgICAgICAgICAgICAgICBfZXJyb3JzLnB1c2goZS5tZXNzYWdlKTtcclxuICAgICAgICAgICAgICAgICAgICBfc3RhdGUgPSAnZXJyb3InO1xyXG4gICAgICAgICAgICAgICAgICAgIG0ucmVkcmF3KCk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgX2Vycm9ycy5wdXNoKCfQntGC0YHRg9GB0YLQstGD0LXRgiDQvtCx0Y/Qt9Cw0YLQtdC70YzQvdGL0Lkg0L/QsNGA0LDQvNC10YLRgCBcItC60L7QtCDQvtC/0YDQvtGB0LBcIiEnKTtcclxuICAgICAgICAgICAgX3N0YXRlID0gJ2Vycm9yJztcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gdmlldygpe1xyXG4gICAgICAgIHN3aXRjaChfc3RhdGUpe1xyXG4gICAgICAgICAgICBjYXNlICdsb2FkaW5nJzpcclxuICAgICAgICAgICAgICAgIHJldHVybiBtKFwiZGl2XCIsIHtjbGFzczogXCJtLXN1cnZleVwifSwgXHJcbiAgICAgICAgICAgICAgICAgICAgbG9hZGluZ01vZGFsID8gbShsb2FkaW5nTW9kYWwpIDogJydcclxuICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgIGNhc2UgJ2xvYWRlZCc6XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbShcImRpdlwiLCB7Y2xhc3M6IFwibS1zdXJ2ZXlcIn0sIFtcclxuICAgICAgICAgICAgICAgICAgICBtKF9RdWVzdGlvbiksXHJcbiAgICAgICAgICAgICAgICAgICAgYWxlcnRNb2RhbCA/IG0oYWxlcnRNb2RhbCkgOiAnJ1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIG0oXCJkaXZcIiwge2NsYXNzOiBcIm0tc3VydmV5X19oaXN0b3J5XCJ9LCBbXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgIC8vIF9jdXJyZW50UXVlc3Rpb24uY29kZVxyXG4gICAgICAgICAgICAgICAgICAgIC8vICAgICBfc3VydmV5U3RlcEhpc3Rvcnkuam9pbignIC0+ICcpXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gXSlcclxuICAgICAgICAgICAgICAgIF0pO1xyXG4gICAgICAgICAgICBjYXNlICdlcnJvcic6XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbShcImRpdlwiLCB7Y2xhc3M6IFwibS1zdXJ2ZXlcIn0sIFtcclxuICAgICAgICAgICAgICAgICAgICBfZXJyb3JzLm1hcChmdW5jdGlvbihlcnJvcil7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBtKFwicFwiLCBlcnJvcik7XHJcbiAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIF0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIG9uaW5pdDogb25pbml0LFxyXG4gICAgICAgIHZpZXc6IHZpZXdcclxuICAgIH1cclxufSIsIid1c2Ugc3RyaWN0JztcclxubGV0IG0gPSByZXF1aXJlKCdtaXRocmlsJyk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChjb25maWcpIHtcclxuICAgIGxldCBSZXN1bHRNb2RlbCA9IGNvbmZpZy5SZXN1bHRNb2RlbDtcclxuICAgIGxldCBxdWVzdGlvbiA9IGNvbmZpZy5xdWVzdGlvbjtcclxuICAgIGxldCBfc3RhdGUgPSAnZGVmYXVsdCc7XHJcbiAgICBsZXQgX25leHRRdWVzdGlvbiA9IGZhbHNlO1xyXG4gICAgbGV0IF9lcnJvcnMgPSBbXTtcclxuIFxyXG4gICAgbGV0IE1vZGVsID0ge1xyXG4gICAgICAgIGNvZGU6IG51bGwsXHJcbiAgICAgICAgc2V0Q29kZTogZnVuY3Rpb24odmFsdWUpe1xyXG4gICAgICAgICAgICBNb2RlbC5jb2RlID0gdmFsdWU7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBjaGVjazogZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgaWYoTW9kZWwuY29kZSA9PSBjb25maWcuc2Vzc2lvbkNvZGUgfHwgTW9kZWwuY29kZSA9PSAnMDAwMCcpe1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBnb1ByZXYoKSB7XHJcbiAgICAgICAgaWYocXVlc3Rpb24uaXNGaXJzdCl7XHJcbiAgICAgICAgICAgIHdpbmRvdy5oaXN0b3J5LmJhY2soKTtcclxuICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgUmVzdWx0TW9kZWwucmVtb3ZlKHF1ZXN0aW9uLmNvZGUpO1xyXG4gICAgICAgICAgICBjb25maWcucHJldigpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBnb05leHQoKSB7XHJcbiAgICAgICAgaWYoTW9kZWwuY2hlY2soKSl7XHJcbiAgICAgICAgICAgIFJlc3VsdE1vZGVsLnNldChxdWVzdGlvbiwgcXVlc3Rpb24uYW5zd2Vyc1swXS5jb2RlLCBNb2RlbC5jb2RlKTtcclxuICAgICAgICAgICAgY29uZmlnLm5leHQoX25leHRRdWVzdGlvbik7XHJcbiAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgIGNvbmZpZy5vbkFsZXJ0KCfQntGI0LjQsdC60LAnLCBbJ9Cd0LXQstC10YDQvdGL0Lkg0LrQvtC0INC/0L7QtNGC0LLQtdGA0LbQtNC10L3QuNGPISddKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgICAvLy8gICBDT01QT05FTlQgTElGRUNZQ0xFIE1FVEhPRFMgICAvLy9cclxuICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxuICAgIGZ1bmN0aW9uIG9uaW5pdCgpIHtcclxuICAgICAgICBjb25zb2xlLmxvZygnb24gaW5pdCcpO1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIF9uZXh0UXVlc3Rpb24gPSBxdWVzdGlvbi5hbnN3ZXJzWzBdLm5leHRRdWVzdGlvbjtcclxuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgICAgICBfZXJyb3JzLnB1c2goJ9Ce0YLRgdGD0YLRgdGC0LLRg9GO0YIg0LLQsNGA0LjQsNC90YLRiyDQvtGC0LLQtdGC0L7QsiEnKTtcclxuICAgICAgICAgICAgX3N0YXRlID0gJ2Vycm9yJztcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gdmlldygpIHtcclxuICAgICAgICByZXR1cm4gbShcImRpdlwiLCB7IGNsYXNzOiBcImNvbnRhaW5lciBjb25maXJtLWNvZGUtc2NyZWVuIHN1cnZleS1zY3JlZW5cIiwgc3R5bGU6ICdiYWNrZ3JvdW5kLWltYWdlOiB1cmwoXCInICsgQ29uZmlnLnNlcnZlckFkZHJlc3MgKyAncGhvdG8vU1RfUVVFU1RJT04vJyArIHF1ZXN0aW9uLnBob3RvW0dsb2JhbHMuZ2V0TGFuZygpXSArICdcIik7IGJhY2tncm91bmQtcmVwZWF0OiBub25lOyBiYWNrZ3JvdW5kLXNpemU6Y292ZXI7JyB9LCBbXHJcbiAgICAgICAgICAgIG0oXCJkaXZcIiwgeyBjbGFzczogXCJyb3cgc3VydmV5LXRvcC1wYW5lbFwiIH0sIFtcclxuICAgICAgICAgICAgICAgIG0oXCJkaXZcIiwgeyBjbGFzczogXCJjb2wteHMtNiBjb2wtbWQtM1wiIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgbShcImJ1dHRvblwiLCB7IGNsYXNzOiBcImJ0biBidG4tZGVmYXVsdCBzdXJ2ZXktcHJldi1idG5cIiwgb25jbGljazogZ29QcmV2IH0sIFwi0J3QsNC30LDQtFwiKSxcclxuICAgICAgICAgICAgICAgICksXHJcbiAgICAgICAgICAgICAgICBtKFwiZGl2XCIsIHsgY2xhc3M6IFwiY29sLXhzLTYgY29sLW1kLTMgY29sLW1kLXB1c2gtNlwiIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgbShcImJ1dHRvblwiLCB7IGNsYXNzOiBcImJ0biBidG4tZGVmYXVsdCBzdXJ2ZXktbmV4dC1idG5cIiwgb25jbGljazogZ29OZXh0IH0sIFwi0JLQv9C10YDQtdC0XCIpLFxyXG4gICAgICAgICAgICAgICAgKSxcclxuICAgICAgICAgICAgICAgIG0oXCJkaXZcIiwgeyBjbGFzczogXCJjb2wteHMtMTIgY29sLW1kLTYgY29sLW1kLXB1bGwtMyBzdXJ2ZXktdG9wLXBhbmVsX19xdWVzdGlvbi1jb250YWluZXJcIiB9LFxyXG4gICAgICAgICAgICAgICAgICAgIHF1ZXN0aW9uLnRleHRbR2xvYmFscy5nZXRMYW5nKCldXHJcbiAgICAgICAgICAgICAgICApXHJcbiAgICAgICAgICAgIF0pLFxyXG4gICAgICAgICAgICBtKFwiZGl2XCIsIHsgY2xhc3M6IFwiY29uZmlybS1jb2RlLXNjcmVlbl9fY29udGVudFwiIH0sIFtcclxuICAgICAgICAgICAgICAgIG0oXCJkaXZcIiwgeyBjbGFzczogXCJyb3dcIiB9LCBbXHJcbiAgICAgICAgICAgICAgICAgICAgbShcImRpdlwiLCB7IGNsYXNzOiBcImNvbC14cy0xMlwiIH0sIFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbShcImlucHV0XCIsIHsgY2xhc3M6IFwiZm9ybS1jb250cm9sXCIsIHBsYWNlaG9sZGVyOiBcItCS0LLQtdC00LjRgtC1INC60L7QtCDQv9C+0LTRgtCy0LXRgNC20LTQtdC90LjRj1wiLCB2YWx1ZTogTW9kZWwuY29kZSwgb25jaGFuZ2U6IG0ud2l0aEF0dHIoXCJ2YWx1ZVwiLCBNb2RlbC5zZXRDb2RlKSB9KVxyXG4gICAgICAgICAgICAgICAgICAgIF0pXHJcbiAgICAgICAgICAgICAgICBdKVxyXG4gICAgICAgICAgICBdKVxyXG4gICAgICAgIF0pXHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBvbmluaXQ6IG9uaW5pdCxcclxuICAgICAgICB2aWV3OiB2aWV3XHJcbiAgICB9XHJcbn0iLCIndXNlIHN0cmljdCc7XHJcbmxldCBtID0gcmVxdWlyZSgnbWl0aHJpbCcpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoY29uZmlnKSB7XHJcbiAgICBsZXQgUmVzdWx0TW9kZWwgPSBjb25maWcuUmVzdWx0TW9kZWw7XHJcbiAgICBsZXQgcXVlc3Rpb24gPSBjb25maWcucXVlc3Rpb247XHJcbiAgICBsZXQgX3N0YXRlID0gJ2RlZmF1bHQnO1xyXG4gICAgbGV0IF9uZXh0UXVlc3Rpb24gPSBmYWxzZTtcclxuICAgIGxldCBfZXJyb3JzID0gW107XHJcbiAgICBsZXQgTW9kZWwgPSB7XHJcbiAgICAgICAgYW5zd2Vyczoge30sXHJcbiAgICAgICAgY2hhbmdlOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGxldCBjb2RlID0gcGFyc2VJbnQodGhpcy5nZXRBdHRyaWJ1dGUoJ2RhdGEtY29kZScpKTtcclxuICAgICAgICAgICAgbGV0IHZhbHVlID0gcGFyc2VJbnQodGhpcy52YWx1ZSk7XHJcbiAgICAgICAgICAgIHZhbHVlID0gaXNOYU4odmFsdWUpID8gMCA6IHZhbHVlO1xyXG4gICAgICAgICAgICBNb2RlbC5hbnN3ZXJzW2NvZGVdID0gdmFsdWU7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGdvUHJldigpIHtcclxuICAgICAgICBpZihxdWVzdGlvbi5pc0ZpcnN0KXtcclxuICAgICAgICAgICAgd2luZG93Lmhpc3RvcnkuYmFjaygpO1xyXG4gICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICBSZXN1bHRNb2RlbC5yZW1vdmUocXVlc3Rpb24uY29kZSk7XHJcbiAgICAgICAgICAgIGNvbmZpZy5wcmV2KCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGdvTmV4dCgpIHtcclxuICAgICAgICBSZXN1bHRNb2RlbC5zZXQocXVlc3Rpb24sIG51bGwsIE1vZGVsLmFuc3dlcnMpO1xyXG4gICAgICAgIGNvbmZpZy5uZXh0KF9uZXh0UXVlc3Rpb24pO1xyXG4gICAgfVxyXG5cclxuICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gICAgLy8vICAgQ09NUE9ORU5UIExJRkVDWUNMRSBNRVRIT0RTICAgLy8vXHJcbiAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbiAgICBmdW5jdGlvbiBvbmluaXQoKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coJ29uIGluaXQnKTtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBfbmV4dFF1ZXN0aW9uID0gcXVlc3Rpb24uYW5zd2Vyc1swXS5uZXh0UXVlc3Rpb247XHJcbiAgICAgICAgICAgIHF1ZXN0aW9uLmFuc3dlcnMuZm9yRWFjaChmdW5jdGlvbiAoYW5zd2VyKSB7XHJcbiAgICAgICAgICAgICAgICBNb2RlbC5hbnN3ZXJzW2Fuc3dlci5jb2RlXSA9IDA7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgICAgIF9lcnJvcnMucHVzaCgn0J7RgtGB0YPRgtGB0YLQstGD0Y7RgiDQstCw0YDQuNCw0L3RgtGLINC+0YLQstC10YLQvtCyIScpO1xyXG4gICAgICAgICAgICBfc3RhdGUgPSAnZXJyb3InO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiB2aWV3KCkge1xyXG4gICAgICAgIHJldHVybiBtKFwiZGl2XCIsIHsgY2xhc3M6IFwiY29udGFpbmVyIGRpZ2l0LWlucHV0LXNjcmVlbiBzdXJ2ZXktc2NyZWVuXCIsIHN0eWxlOiAnYmFja2dyb3VuZC1pbWFnZTogdXJsKFwiJyArIENvbmZpZy5zZXJ2ZXJBZGRyZXNzICsgJ3Bob3RvL1NUX1FVRVNUSU9OLycgKyBxdWVzdGlvbi5waG90b1tHbG9iYWxzLmdldExhbmcoKV0gKyAnXCIpOyBiYWNrZ3JvdW5kLXJlcGVhdDogbm9uZTsgYmFja2dyb3VuZC1zaXplOmNvdmVyOycgfSwgW1xyXG4gICAgICAgICAgICBtKFwiZGl2XCIsIHsgY2xhc3M6IFwicm93IHN1cnZleS10b3AtcGFuZWxcIiB9LCBbXHJcbiAgICAgICAgICAgICAgICBtKFwiZGl2XCIsIHsgY2xhc3M6IFwiY29sLXhzLTYgY29sLW1kLTNcIiB9LFxyXG4gICAgICAgICAgICAgICAgICAgIG0oXCJidXR0b25cIiwgeyBjbGFzczogXCJidG4gYnRuLWRlZmF1bHQgc3VydmV5LXByZXYtYnRuXCIsIG9uY2xpY2s6IGdvUHJldiB9LCBcItCd0LDQt9Cw0LRcIiksXHJcbiAgICAgICAgICAgICAgICApLFxyXG4gICAgICAgICAgICAgICAgbShcImRpdlwiLCB7IGNsYXNzOiBcImNvbC14cy02IGNvbC1tZC0zIGNvbC1tZC1wdXNoLTZcIiB9LFxyXG4gICAgICAgICAgICAgICAgICAgIG0oXCJidXR0b25cIiwgeyBjbGFzczogXCJidG4gYnRuLWRlZmF1bHQgc3VydmV5LW5leHQtYnRuXCIsIG9uY2xpY2s6IGdvTmV4dCB9LCBcItCS0L/QtdGA0LXQtFwiKSxcclxuICAgICAgICAgICAgICAgICksXHJcbiAgICAgICAgICAgICAgICBtKFwiZGl2XCIsIHsgY2xhc3M6IFwiY29sLXhzLTEyIGNvbC1tZC02IGNvbC1tZC1wdWxsLTMgc3VydmV5LXRvcC1wYW5lbF9fcXVlc3Rpb24tY29udGFpbmVyXCIgfSxcclxuICAgICAgICAgICAgICAgICAgICBxdWVzdGlvbi50ZXh0W0dsb2JhbHMuZ2V0TGFuZygpXVxyXG4gICAgICAgICAgICAgICAgKVxyXG4gICAgICAgICAgICBdKSxcclxuICAgICAgICAgICAgbShcImRpdlwiLCB7IGNsYXNzOiBcImRpZ2l0LWlucHV0LXNjcmVlbl9fY29udGVudFwiIH0sIFtcclxuICAgICAgICAgICAgICAgIG0oXCJkaXZcIiwgeyBjbGFzczogXCJyb3dcIiB9LCBbXHJcbiAgICAgICAgICAgICAgICAgICAgbShcImRpdlwiLCB7IGNsYXNzOiBcImNvbC14cy0xMlwiIH0sIFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbShcImZvcm1cIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG0oXCJ1bFwiLCB7IGNsYXNzOiBcImxpc3QtZ3JvdXAgZGlnaXQtaW5wdXQtc2NyZWVuX19saXN0XCIgfSwgW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHF1ZXN0aW9uLmFuc3dlcnMubWFwKGZ1bmN0aW9uIChhbnN3ZXIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG0oXCJsaVwiLCB7IGNsYXNzOiBcImxpc3QtZ3JvdXAtaXRlbVwiIH0sIFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG0oXCJkaXZcIiwgeyBjbGFzczogXCJyb3dcIiB9LCBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbShcImRpdlwiLCB7IGNsYXNzOiBcImNvbC14cy04XCIgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbShcInN0cm9uZ1wiLCBhbnN3ZXIudGV4dFtHbG9iYWxzLmdldExhbmcoKV0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtKFwiZGl2XCIsIHsgY2xhc3M6IFwiY29sLXhzLTRcIiB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtKFwiaW5wdXRcIiwgeyB0eXBlOiBcIm51bWJlclwiLCBjbGFzczogXCJmb3JtLWNvbnRyb2xcIiwgXCJkYXRhLWNvZGVcIjogYW5zd2VyLmNvZGUsIHBsYWNlaG9sZGVyOiBcIjBcIiwgb25jaGFuZ2U6IG0ud2l0aEF0dHIoXCJ2YWx1ZVwiLCBNb2RlbC5jaGFuZ2UpLCB2YWx1ZTogKE1vZGVsLmFuc3dlcnNbYW5zd2VyLmNvZGVdICE9PSAwID8gTW9kZWwuYW5zd2Vyc1thbnN3ZXIuY29kZV0gOiAnJykgfSwgKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIClcclxuICAgICAgICAgICAgICAgICAgICBdKVxyXG4gICAgICAgICAgICAgICAgXSlcclxuICAgICAgICAgICAgXSlcclxuICAgICAgICBdKVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgb25pbml0OiBvbmluaXQsXHJcbiAgICAgICAgdmlldzogdmlld1xyXG4gICAgfVxyXG59IiwiJ3VzZSBzdHJpY3QnO1xyXG5sZXQgbSA9IHJlcXVpcmUoJ21pdGhyaWwnKTtcclxubGV0IExvYWRpbmdNb2RhbCA9IHJlcXVpcmUoJy4uLy4uLy4uL2NvbXBvbmVudHMvbW9kYWwtd2luZG93L2xvYWRpbmctbW9kYWwtd2luZG93LmpzJyk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGNvbmZpZyl7XHJcbiAgICBsZXQgUmVzdWx0TW9kZWwgPSBjb25maWcuUmVzdWx0TW9kZWw7XHJcbiAgICBsZXQgcXVlc3Rpb24gPSBjb25maWcucXVlc3Rpb247XHJcbiAgICBsZXQgbG9hZGluZ01vZGFsID0gZmFsc2U7XHJcbiAgICBsZXQgX25leHRRdWVzdGlvbiA9IGZhbHNlO1xyXG4gICAgbGV0IF9saXN0Q29tYm87XHJcbiAgICBsZXQgX3NlbGVjdGVkID0gZmFsc2U7XHJcbiAgICBsZXQgX3NlYXJjaCA9ICcnO1xyXG5cclxuICAgIGZ1bmN0aW9uIGdvUHJldigpe1xyXG4gICAgICAgIGlmKHF1ZXN0aW9uLmlzRmlyc3Qpe1xyXG4gICAgICAgICAgICB3aW5kb3cuaGlzdG9yeS5iYWNrKCk7XHJcbiAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgIFJlc3VsdE1vZGVsLnJlbW92ZShxdWVzdGlvbi5jb2RlKTtcclxuICAgICAgICAgICAgY29uZmlnLnByZXYoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gc2F2ZSgpe1xyXG4gICAgICAgIGxvYWRpbmdNb2RhbCA9IG5ldyBMb2FkaW5nTW9kYWwoe1xyXG4gICAgICAgICAgICBoZWFkZXI6IFwi0KHQvtGF0YDQsNC90LXQvdC40LUg0L7Qv9GA0L7RgdCwXCIsXHJcbiAgICAgICAgICAgIHRleHQ6ICcnXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgUmVzdWx0TW9kZWwuc2F2ZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIFxyXG4gICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgICAvLy8gICBDT01QT05FTlQgTElGRUNZQ0xFIE1FVEhPRFMgICAvLy9cclxuICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxuICAgIGZ1bmN0aW9uIG9uaW5pdCgpe1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiB2aWV3KCl7XHJcbiAgICAgICAgcmV0dXJuIG0oXCJkaXZcIiwge2NsYXNzOiBcImNvbnRhaW5lciBmaW5hbC1zY3JlZW4gc3VydmV5LXNjcmVlblwiLCBzdHlsZTogJ2JhY2tncm91bmQtaW1hZ2U6IHVybChcIicrQ29uZmlnLnNlcnZlckFkZHJlc3MrJ3Bob3RvL1NUX1FVRVNUSU9OLycrcXVlc3Rpb24ucGhvdG9bR2xvYmFscy5nZXRMYW5nKCldKydcIik7IGJhY2tncm91bmQtcmVwZWF0OiBub25lOyBiYWNrZ3JvdW5kLXNpemU6Y292ZXI7J30sIFtcclxuICAgICAgICAgICAgbShcImRpdlwiLCB7Y2xhc3M6IFwicm93IHN1cnZleS10b3AtcGFuZWxcIn0sIFtcclxuICAgICAgICAgICAgICAgIG0oXCJkaXZcIiwge2NsYXNzOiBcImNvbC14cy02IGNvbC1tZC0zXCJ9LCBcclxuICAgICAgICAgICAgICAgICAgICBtKFwiYnV0dG9uXCIsIHtjbGFzczogXCJidG4gYnRuLWRlZmF1bHQgc3VydmV5LXByZXYtYnRuXCIsIG9uY2xpY2s6IGdvUHJldn0sIFwi0J3QsNC30LDQtFwiKSxcclxuICAgICAgICAgICAgICAgICksXHJcbiAgICAgICAgICAgICAgICBtKFwiZGl2XCIsIHtjbGFzczogXCJjb2wteHMtMTIgY29sLW1kLTYgY29sLW1kLXB1bGwtMyBzdXJ2ZXktdG9wLXBhbmVsX19xdWVzdGlvbi1jb250YWluZXJcIn0sIFxyXG4gICAgICAgICAgICAgICAgICAgIC8vIHF1ZXN0aW9uLnRleHRbR2xvYmFscy5nZXRMYW5nKCldXHJcbiAgICAgICAgICAgICAgICAgICAgJ9Ca0L7QvdC10YYg0L7Qv9GA0L7RgdCwJ1xyXG4gICAgICAgICAgICAgICAgKVxyXG4gICAgICAgICAgICBdKSxcclxuICAgICAgICAgICAgbShcImRpdlwiLCB7Y2xhc3M6IFwiZmluYWwtc2NyZWVuX19jb250ZW50XCJ9LCBbXHJcbiAgICAgICAgICAgICAgICAvLyBtKFwiaDNcIiwge2NsYXNzOiBcIlwifSwgcXVlc3Rpb24uYW5zd2Vyc1swXS50ZXh0W0dsb2JhbHMuZ2V0TGFuZygpXSksXHJcbiAgICAgICAgICAgICAgICBtKFwiYnV0dG9uXCIsIHtjbGFzczogXCJidG4gYnRuLWRlZmF1bHRcIiwgb25jbGljazogc2F2ZX0sICfQl9Cw0LLQtdGA0YjQuNGC0Ywg0L7Qv9GA0L7RgScpXHJcbiAgICAgICAgICAgIF0pLFxyXG4gICAgICAgICAgICBsb2FkaW5nTW9kYWwgPyBtKGxvYWRpbmdNb2RhbCkgOiAnJ1xyXG4gICAgICAgIF0pXHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBvbmluaXQ6IG9uaW5pdCxcclxuICAgICAgICB2aWV3OiB2aWV3XHJcbiAgICB9XHJcbn0iLCIndXNlIHN0cmljdCc7XHJcbmxldCBtID0gcmVxdWlyZSgnbWl0aHJpbCcpO1xyXG5sZXQgSGVscGVyID0gcmVxdWlyZSgnLi4vLi4vLi4vY29tcG9uZW50cy9oZWxwZXIuanMnKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oY29uZmlnKXtcclxuICAgIGxldCBSZXN1bHRNb2RlbCA9IGNvbmZpZy5SZXN1bHRNb2RlbDtcclxuICAgIGxldCBxdWVzdGlvbiA9IGNvbmZpZy5xdWVzdGlvbjtcclxuICAgIGxldCBfbmV4dFF1ZXN0aW9uID0gZmFsc2U7XHJcbiAgICBsZXQgX3NlbGVjdGVkID0gZmFsc2U7XHJcbiAgICBsZXQgX2xpc3RDb21ibztcclxuICAgIGxldCBfc2VhcmNoID0gJyc7XHJcbiAgICBsZXQgX2ltYWdlcyA9IFtdO1xyXG5cclxuICAgIGxldCByZWxvYWRGdW5jdGlvbiA9IEhlbHBlci5kZWJvdW5jZSggZnVuY3Rpb24oKXttLnJlZHJhdygpO30sIDUwMCApO1xyXG5cclxuICAgIGZ1bmN0aW9uIGdvUHJldigpe1xyXG4gICAgICAgIGlmKHF1ZXN0aW9uLmlzRmlyc3Qpe1xyXG4gICAgICAgICAgICB3aW5kb3cuaGlzdG9yeS5iYWNrKCk7XHJcbiAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgIFJlc3VsdE1vZGVsLnJlbW92ZShxdWVzdGlvbi5jb2RlKTtcclxuICAgICAgICAgICAgY29uZmlnLnByZXYoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gZ29OZXh0KCl7XHJcbiAgICAgICAgaWYoX3NlbGVjdGVkKXtcclxuICAgICAgICAgICAgUmVzdWx0TW9kZWwuc2V0KHF1ZXN0aW9uLCBfc2VsZWN0ZWQsIG51bGwpO1xyXG4gICAgICAgICAgICBjb25maWcubmV4dChfbmV4dFF1ZXN0aW9uKTtcclxuICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgY29uZmlnLm9uQWxlcnQoJ9Ce0YjQuNCx0LrQsCcsIFsn0JLRi9Cx0LXRgNC40YLQtSDQstCw0YDQuNCw0L3RgiDQvtGC0LLQtdGC0LAhJ10pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBzZWxlY3RJbWFnZSgpe1xyXG4gICAgICAgIF9uZXh0UXVlc3Rpb24gPSBwYXJzZUludCh0aGlzLmdldEF0dHJpYnV0ZSgnZGF0YS1uZXh0JykpO1xyXG4gICAgICAgIF9zZWxlY3RlZCA9IHBhcnNlSW50KHRoaXMuZ2V0QXR0cmlidXRlKCdkYXRhLWluZGV4JykpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gICAgLy8vICAgQ09NUE9ORU5UIExJRkVDWUNMRSBNRVRIT0RTICAgLy8vXHJcbiAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbiAgICBmdW5jdGlvbiBvbmNyZWF0ZSgpIHtcclxuICAgICAgICBfaW1hZ2VzLmZvckVhY2goZnVuY3Rpb24oaW1hZ2VPYmosIGluZGV4KXtcclxuICAgICAgICAgICAgaWYoaW1hZ2VPYmouc3RhdHVzID09PSAnbm90X2NoZWNrZWQnKXtcclxuICAgICAgICAgICAgICAgIGxldCBpbWFnZSA9IG5ldyBJbWFnZSgpO1xyXG4gICAgICAgICAgICAgICAgaW1hZ2Uub25sb2FkID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIF9pbWFnZXNbaW5kZXhdWydzdGF0dXMnXSA9ICdvayc7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVsb2FkRnVuY3Rpb24oKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGltYWdlLm9uZXJyb3IgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgX2ltYWdlc1tpbmRleF1bJ3N0YXR1cyddID0gJ2Vycm9yJztcclxuICAgICAgICAgICAgICAgICAgICByZWxvYWRGdW5jdGlvbigpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaW1hZ2Uuc3JjID0gaW1hZ2VPYmouc3JjO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gb25pbml0KCl7XHJcbiAgICAgICAgX2ltYWdlcyA9IHF1ZXN0aW9uLmFuc3dlcnMubWFwKGZ1bmN0aW9uKGFuc3dlcil7XHJcbiAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICBuZXh0OiBhbnN3ZXIubmV4dFF1ZXN0aW9uLFxyXG4gICAgICAgICAgICAgICAgbmFtZTogYW5zd2VyLnRleHRbR2xvYmFscy5nZXRMYW5nKCldLFxyXG4gICAgICAgICAgICAgICAgc3JjOiBDb25maWcuc2VydmVyQWRkcmVzcysncGhvdG8vU1RfQU5TV0VSLycrYW5zd2VyLnBob3RvW0dsb2JhbHMuZ2V0TGFuZygpXSxcclxuICAgICAgICAgICAgICAgIHN0YXR1czogJ25vdF9jaGVja2VkJ1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHZpZXcoKXtcclxuICAgICAgICByZXR1cm4gbShcImRpdlwiLCB7Y2xhc3M6IFwiY29udGFpbmVyIGltYWdlLWdyaWQtc2NyZWVuIHN1cnZleS1zY3JlZW5cIiwgc3R5bGU6ICdiYWNrZ3JvdW5kLWltYWdlOiB1cmwoXCInK0NvbmZpZy5zZXJ2ZXJBZGRyZXNzKydwaG90by9TVF9RVUVTVElPTi8nK3F1ZXN0aW9uLnBob3RvW0dsb2JhbHMuZ2V0TGFuZygpXSsnXCIpOyBiYWNrZ3JvdW5kLXJlcGVhdDogbm9uZTsgYmFja2dyb3VuZC1zaXplOmNvdmVyOyd9LCBbXHJcbiAgICAgICAgICAgIG0oXCJkaXZcIiwge2NsYXNzOiBcInJvdyBzdXJ2ZXktdG9wLXBhbmVsXCJ9LCBbXHJcbiAgICAgICAgICAgICAgICBtKFwiZGl2XCIsIHtjbGFzczogXCJjb2wteHMtNiBjb2wtbWQtM1wifSwgXHJcbiAgICAgICAgICAgICAgICAgICAgbShcImJ1dHRvblwiLCB7Y2xhc3M6IFwiYnRuIGJ0bi1kZWZhdWx0IHN1cnZleS1wcmV2LWJ0blwiLCBvbmNsaWNrOiBnb1ByZXZ9LCBcItCd0LDQt9Cw0LRcIiksXHJcbiAgICAgICAgICAgICAgICApLFxyXG4gICAgICAgICAgICAgICAgbShcImRpdlwiLCB7Y2xhc3M6IFwiY29sLXhzLTYgY29sLW1kLTMgY29sLW1kLXB1c2gtNlwifSwgXHJcbiAgICAgICAgICAgICAgICAgICAgbShcImJ1dHRvblwiLCB7Y2xhc3M6IFwiYnRuIGJ0bi1kZWZhdWx0IHN1cnZleS1uZXh0LWJ0blwiLCBvbmNsaWNrOiBnb05leHR9LCBcItCS0L/QtdGA0LXQtFwiKSxcclxuICAgICAgICAgICAgICAgICksICAgICAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICBtKFwiZGl2XCIsIHtjbGFzczogXCJjb2wteHMtMTIgY29sLW1kLTYgY29sLW1kLXB1bGwtMyBzdXJ2ZXktdG9wLXBhbmVsX19xdWVzdGlvbi1jb250YWluZXJcIn0sIFxyXG4gICAgICAgICAgICAgICAgICAgIHF1ZXN0aW9uLnRleHRbR2xvYmFscy5nZXRMYW5nKCldXHJcbiAgICAgICAgICAgICAgICApXHJcbiAgICAgICAgICAgIF0pLFxyXG4gICAgICAgICAgICBtKFwiZGl2XCIsIHtjbGFzczogXCJyb3cgaW1hZ2UtZ3JpZC1zY3JlZW5fX2NvbnRlbnRcIn0sIFtcclxuICAgICAgICAgICAgICAgIF9pbWFnZXMubWFwKGZ1bmN0aW9uKGltYWdlLCBpbmRleCl7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG0oXCJkaXZcIiwge2NsYXNzOiBcImNvbC14cy0xMiBjb2wtc20tNiBjb2wtbWQtNCBjb2wtbGctMyBpbWFnZS1ncmlkLXNjcmVlbl9faW1hZ2UtY29udGFpbmVyXCJ9LCBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG0oXCJkaXZcIiwge2NsYXNzOiBcImltYWdlLWdyaWQtc2NyZWVuX19pbWFnZS13cmFwcGVyIGNsZWFyZml4IFwiICsgKGluZGV4ID09PSBfc2VsZWN0ZWQgPyAnYWN0aXZlJyA6ICcnKSwgXCJkYXRhLW5leHRcIjogaW1hZ2UubmV4dCwgXCJkYXRhLWluZGV4XCI6IGluZGV4LCBvbmNsaWNrOiBzZWxlY3RJbWFnZX0sIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbShcImltZ1wiLCB7c3JjOiBpbWFnZS5zdGF0dXMgPT09ICdvaycgPyBpbWFnZS5zcmMgOiAoaW1hZ2Uuc3RhdHVzID09PSAnbm90X2NoZWNrZWQnID8gJy4vYXNzZXRzL2ltYWdlcy9sb2FkaW5nLmdpZicgOiAnLi9hc3NldHMvaW1hZ2VzL25vX2ltYWdlLnBuZycpIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIClcclxuICAgICAgICAgICAgICAgICAgICBdKVxyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgXSlcclxuICAgICAgICBdKVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgb25pbml0OiBvbmluaXQsXHJcbiAgICAgICAgb25jcmVhdGU6IG9uY3JlYXRlLFxyXG4gICAgICAgIHZpZXc6IHZpZXdcclxuICAgIH1cclxufSIsIid1c2Ugc3RyaWN0JztcclxubGV0IG0gPSByZXF1aXJlKCdtaXRocmlsJyk7XHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oY29uZmlnKXtcclxuICAgIGxldCBxdWVzdGlvbiA9IGNvbmZpZy5xdWVzdGlvbjtcclxuICAgIGxldCBSZXN1bHRNb2RlbCA9IGNvbmZpZy5SZXN1bHRNb2RlbDtcclxuICAgIGxldCBfc3RhdGUgPSAnZGVmYXVsdCc7XHJcbiAgICBsZXQgX25leHRRdWVzdGlvbiA9IGZhbHNlO1xyXG4gICAgbGV0IF9lcnJvcnMgPSBbXTtcclxuXHJcbiAgICBmdW5jdGlvbiBnb1ByZXYoKXtcclxuICAgICAgICBpZihxdWVzdGlvbi5pc0ZpcnN0KXtcclxuICAgICAgICAgICAgd2luZG93Lmhpc3RvcnkuYmFjaygpO1xyXG4gICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICBSZXN1bHRNb2RlbC5yZW1vdmUocXVlc3Rpb24uY29kZSk7XHJcbiAgICAgICAgICAgIGNvbmZpZy5wcmV2KCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGdvTmV4dCgpe1xyXG4gICAgICAgIFJlc3VsdE1vZGVsLnNldChxdWVzdGlvbiwgcXVlc3Rpb24uYW5zd2Vyc1swXS5jb2RlLCBudWxsKTtcclxuICAgICAgICBjb25maWcubmV4dChfbmV4dFF1ZXN0aW9uKTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBlbmFibGVTY2FsZSgpe1xyXG4gICAgICAgIGxldCB2aWV3cG9ydCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJtZXRhW25hbWU9dmlld3BvcnRdXCIpO1xyXG4gICAgICAgIHZpZXdwb3J0LnNldEF0dHJpYnV0ZSgnY29udGVudCcsICd3aWR0aD1kZXZpY2Utd2lkdGgsIGluaXRpYWwtc2NhbGU9MSwgbWF4aW11bS1zY2FsZT01LCB1c2VyLXNjYWxhYmxlPXllcycpO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGRpc2FibGVTY2FsZSgpe1xyXG4gICAgICAgIGxldCB2aWV3cG9ydCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJtZXRhW25hbWU9dmlld3BvcnRdXCIpO1xyXG4gICAgICAgIHZpZXdwb3J0LnNldEF0dHJpYnV0ZSgnY29udGVudCcsICd3aWR0aD1kZXZpY2Utd2lkdGgsIGluaXRpYWwtc2NhbGU9MSwgbWF4aW11bS1zY2FsZT0xLCB1c2VyLXNjYWxhYmxlPW5vJyk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgICAvLy8gICBDT01QT05FTlQgTElGRUNZQ0xFIE1FVEhPRFMgICAvLy9cclxuICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxuICAgIGZ1bmN0aW9uIG9ucmVtb3ZlKCl7XHJcbiAgICAgICAgZGlzYWJsZVNjYWxlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gb25pbml0KCl7XHJcbiAgICAgICAgZW5hYmxlU2NhbGUoKTtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBfbmV4dFF1ZXN0aW9uID0gcXVlc3Rpb24uYW5zd2Vyc1swXS5uZXh0UXVlc3Rpb247XHJcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICAgICAgX2Vycm9ycy5wdXNoKCfQntGC0YHRg9GC0YHRgtCy0YPRjtGCINCy0LDRgNC40LDQvdGC0Ysg0L7RgtCy0LXRgtC+0LIhJyk7XHJcbiAgICAgICAgICAgIF9zdGF0ZSA9ICdlcnJvcic7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHZpZXcoKXtcclxuICAgICAgICBzd2l0Y2goX3N0YXRlKXtcclxuICAgICAgICAgICAgY2FzZSAnZGVmYXVsdCc6XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbShcImRpdlwiLCB7Y2xhc3M6IFwiY29udGFpbmVyIHN1cnZleS1zY3JlZW5cIn0sIFtcclxuICAgICAgICAgICAgICAgICAgICBtKFwiZGl2XCIsIHtjbGFzczogXCJyb3cgc3VydmV5LXRvcC1wYW5lbFwifSwgW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBtKFwiZGl2XCIsIHtjbGFzczogXCJjb2wteHMtNiBjb2wtbWQtM1wifSwgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtKFwiYnV0dG9uXCIsIHtjbGFzczogXCJidG4gYnRuLWRlZmF1bHQgc3VydmV5LXByZXYtYnRuXCIsIG9uY2xpY2s6IGdvUHJldn0sIFwi0J3QsNC30LDQtFwiKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgbShcImRpdlwiLCB7Y2xhc3M6IFwiY29sLXhzLTYgY29sLW1kLTMgY29sLW1kLXB1c2gtNlwifSwgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtKFwiYnV0dG9uXCIsIHtjbGFzczogXCJidG4gYnRuLWRlZmF1bHQgc3VydmV5LW5leHQtYnRuXCIsIG9uY2xpY2s6IGdvTmV4dH0sIFwi0JLQv9C10YDQtdC0XCIpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICApLCAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBtKFwiZGl2XCIsIHtjbGFzczogXCJjb2wteHMtMTIgY29sLW1kLTYgY29sLW1kLXB1bGwtMyBzdXJ2ZXktdG9wLXBhbmVsX19xdWVzdGlvbi1jb250YWluZXJcIn0sIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcXVlc3Rpb24udGV4dFtHbG9iYWxzLmdldExhbmcoKV1cclxuICAgICAgICAgICAgICAgICAgICAgICAgKVxyXG4gICAgICAgICAgICAgICAgICAgIF0pLFxyXG4gICAgICAgICAgICAgICAgICAgIG0oXCJkaXZcIiwge2NsYXNzOiBcInJvd1wifSwgW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBtKFwiaW1nXCIsIHtzcmM6IENvbmZpZy5zZXJ2ZXJBZGRyZXNzK1wicGhvdG8vU1RfUVVFU1RJT04vXCIrcXVlc3Rpb24ucGhvdG9bR2xvYmFscy5nZXRMYW5nKCldLCB3aWR0aDogXCIxMDAlO1wifSlcclxuICAgICAgICAgICAgICAgICAgICBdKSxcclxuICAgICAgICAgICAgICAgIF0pXHJcbiAgICAgICAgICAgIGNhc2UgJ2Vycm9yJzpcclxuICAgICAgICAgICAgICAgIHJldHVybiBtKFwiZGl2XCIsIHtjbGFzczogXCJzY3JlZW4tcGhvdG9cIn0sIFtcclxuICAgICAgICAgICAgICAgICAgICBfZXJyb3JzLm1hcChmdW5jdGlvbihlcnJvcil7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBtKFwicFwiLCB7Y2xhc3M6IFwiZXJyb3JcIn0sIGVycm9yKVxyXG4gICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICBdKVxyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBvbmluaXQ6IG9uaW5pdCxcclxuICAgICAgICB2aWV3OiB2aWV3LFxyXG4gICAgICAgIG9ucmVtb3ZlOiBvbnJlbW92ZVxyXG4gICAgfVxyXG59IiwiJ3VzZSBzdHJpY3QnO1xyXG5sZXQgbSA9IHJlcXVpcmUoJ21pdGhyaWwnKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oY29uZmlnKXtcclxuICAgIGxldCBSZXN1bHRNb2RlbCA9IGNvbmZpZy5SZXN1bHRNb2RlbDtcclxuICAgIGxldCBxdWVzdGlvbiA9IGNvbmZpZy5xdWVzdGlvbjtcclxuICAgIGxldCBsYW5ncyA9IGNvbmZpZy5sYW5ncyB8fCBbXTtcclxuICAgIGxldCBfc3RhdGUgPSAnZGVmYXVsdCc7XHJcbiAgICBsZXQgX2N1cnJlbnRMYW5nID0gZmFsc2U7XHJcbiAgICBsZXQgX25leHRRdWVzdGlvbiA9IGZhbHNlO1xyXG4gICAgbGV0IF9lcnJvcnMgPSBbXTtcclxuXHJcbiAgICBmdW5jdGlvbiBjaG9vc2VMYW5nKCl7XHJcbiAgICAgICAgX2N1cnJlbnRMYW5nID0gdGhpcy5nZXRBdHRyaWJ1dGUoJ2RhdGEtbGFuZycpO1xyXG4gICAgICAgIEdsb2JhbHMuc2V0TGFuZyhfY3VycmVudExhbmcpO1xyXG4gICAgICAgIFJlc3VsdE1vZGVsLnNldChxdWVzdGlvbiwgcXVlc3Rpb24uYW5zd2Vyc1swXS5jb2RlLCBfY3VycmVudExhbmcpO1xyXG4gICAgICAgIGNvbmZpZy5uZXh0KF9uZXh0UXVlc3Rpb24pO1xyXG4gICAgfVxyXG5cclxuICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gICAgLy8vICAgQ09NUE9ORU5UIExJRkVDWUNMRSBNRVRIT0RTICAgLy8vXHJcbiAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbiAgICBmdW5jdGlvbiBvbmluaXQoKXtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBfbmV4dFF1ZXN0aW9uID0gcXVlc3Rpb24uYW5zd2Vyc1swXS5uZXh0UXVlc3Rpb247XHJcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICAgICAgX2Vycm9ycy5wdXNoKCfQntGC0YHRg9GC0YHRgtCy0YPRjtGCINCy0LDRgNC40LDQvdGC0Ysg0L7RgtCy0LXRgtC+0LIhJyk7XHJcbiAgICAgICAgICAgIF9zdGF0ZSA9ICdlcnJvcic7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZihsYW5ncy5sZW5ndGggPT09IDApe1xyXG4gICAgICAgICAgICBfZXJyb3JzLnB1c2goJ9Ce0YLRgdGD0YLRgdGC0LLRg9C10YIg0YHQv9C40YHQvtC6INC00LvRjyDQstGL0LHQvtGA0LAg0Y/Qt9GL0LrQsCEnKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gdmlldygpe1xyXG4gICAgICAgIHN3aXRjaChfc3RhdGUpe1xyXG4gICAgICAgICAgICBjYXNlICdkZWZhdWx0JzpcclxuICAgICAgICAgICAgICAgIHJldHVybiBtKFwiZGl2XCIsIHtjbGFzczogXCJzY3JlZW4tbGFuZ3VhZ2UgY29udGFpbmVyIHN1cnZleS1zY3JlZW5cIiwgc3R5bGU6ICdiYWNrZ3JvdW5kLWltYWdlOiB1cmwoXCInK0NvbmZpZy5zZXJ2ZXJBZGRyZXNzKycvcGhvdG8vU1RfUVVFU1RJT04vJytxdWVzdGlvbi5waG90b1tHbG9iYWxzLmdldExhbmcoKV0rJ1wiKTsgYmFja2dyb3VuZC1yZXBlYXQ6IG5vbmU7IGJhY2tncm91bmQtc2l6ZTpjb3ZlcjsnfSwgW1xyXG4gICAgICAgICAgICAgICAgICAgIG0oXCJkaXZcIiwge2NsYXNzOiBcInJvdyBzdXJ2ZXktdG9wLXBhbmVsXCJ9LCBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG0oXCJkaXZcIiwge2NsYXNzOiBcImNvbC14cy0xMlwifSwgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtKFwiaDNcIiwgcXVlc3Rpb24udGV4dFtHbG9iYWxzLmdldExhbmcoKV0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICksXHJcbiAgICAgICAgICAgICAgICAgICAgXSksXHJcbiAgICAgICAgICAgICAgICAgICAgbShcImRpdlwiLCB7Y2xhc3M6IFwicm93IHNjcmVlbi1sYW5ndWFnZV9fY29udGVudFwifSwgW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsYW5ncy5tYXAoZnVuY3Rpb24obGFuZyl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gbShcImRpdlwiLCB7Y2xhc3M6IFwiY29sLXhzLTEyIGNvbC1zbS02XCJ9LCBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtKFwiYnV0dG9uXCIsIHtjbGFzczogXCJidG4gYnRuLWRlZmF1bHQgc2NyZWVuLWxhbmd1YWdlX19sYW5nLWJ0blwiLCBcImRhdGEtbGFuZ1wiOiBsYW5nLmNvZGUsIG9uY2xpY2s6IGNob29zZUxhbmd9LCBsYW5nLm5hbWUpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgXSlcclxuICAgICAgICAgICAgICAgIF0pXHJcbiAgICAgICAgICAgIGNhc2UgJ2Vycm9yJzpcclxuICAgICAgICAgICAgICAgIHJldHVybiBtKFwiZGl2XCIsIHtjbGFzczogXCJzY3JlZW4tbGFuZ3VhZ2VcIn0sIFtcclxuICAgICAgICAgICAgICAgICAgICBfZXJyb3JzLm1hcChmdW5jdGlvbihlcnJvcil7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBtKFwicFwiLCB7Y2xhc3M6IFwiZXJyb3JcIn0sIGVycm9yKVxyXG4gICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICBdKVxyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcbiAgICBcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgb25pbml0OiBvbmluaXQsXHJcbiAgICAgICAgdmlldzogdmlld1xyXG4gICAgfVxyXG59IiwiJ3VzZSBzdHJpY3QnO1xyXG5sZXQgbSA9IHJlcXVpcmUoJ21pdGhyaWwnKTtcclxubGV0IFIgPSByZXF1aXJlKCcuLi8uLi8uLi9jb21wb25lbnRzL3JlcXVlc3QuanMnKTtcclxubGV0IEhlbHBlciA9IHJlcXVpcmUoJy4uLy4uLy4uL2NvbXBvbmVudHMvaGVscGVyLmpzJyk7XHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oY29uZmlnKXtcclxuICAgIGxldCBSZXN1bHRNb2RlbCA9IGNvbmZpZy5SZXN1bHRNb2RlbDtcclxuICAgIGxldCBxdWVzdGlvbiA9IGNvbmZpZy5xdWVzdGlvbjtcclxuICAgIGxldCBfc3RhdGUgPSAnZGVmYXVsdCc7XHJcbiAgICBsZXQgX25leHRRdWVzdGlvbiA9IGZhbHNlO1xyXG4gICAgbGV0IF9lcnJvcnMgPSBbXTtcclxuXHJcbiAgICBsZXQgY2FudmFzO1xyXG4gICAgbGV0IGNvbnRleHQ7XHJcblxyXG4gICAgZnVuY3Rpb24gZ29QcmV2KCl7XHJcbiAgICAgICAgaWYocXVlc3Rpb24uaXNGaXJzdCl7XHJcbiAgICAgICAgICAgIHdpbmRvdy5oaXN0b3J5LmJhY2soKTtcclxuICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgUmVzdWx0TW9kZWwucmVtb3ZlKHF1ZXN0aW9uLmNvZGUpO1xyXG4gICAgICAgICAgICBjb25maWcucHJldigpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBnb05leHQoKXtcclxuICAgICAgICBSZXN1bHRNb2RlbC5zZXQocXVlc3Rpb24sIHF1ZXN0aW9uLmFuc3dlcnNbMF0uY29kZSwgY2FudmFzLnRvRGF0YVVSTCgpKTtcclxuICAgICAgICBSLnVwbG9hZEltYWdlQmFzZTY0KEhlbHBlci5nZXRSYW5kb21JbnQoMTAwMCwgOTk5OSksICdTVF9SRVNQT05ERU5UJywgY2FudmFzLnRvRGF0YVVSTCgpKVxyXG4gICAgICAgICAgICAudGhlbihkYXRhID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGRhdGEpO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIGNvbmZpZy5uZXh0KF9uZXh0UXVlc3Rpb24pO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGNsZWFyQ2FudmFzKCl7XHJcbiAgICAgICAgY29udGV4dC5jbGVhclJlY3QoMCwgMCwgY29udGV4dC5jYW52YXMud2lkdGgsIGNvbnRleHQuY2FudmFzLmhlaWdodCk7IFxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGluaXRDYW52YXModm5vZGUpe1xyXG4gICAgICAgIGNhbnZhcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNjYW52YXMnKTtcclxuICAgICAgICBjb250ZXh0ID0gY2FudmFzLmdldENvbnRleHQoJzJkJyk7XHJcbiAgICAgICAgbGV0IGNvbnRhaW5lciA9ICQoJyNjYW52YXNDb250YWluZXInKS5oZWlnaHQoIHBhcnNlSW50KCQoJyNjYW52YXNDb250YWluZXInKS53aWR0aCgpIC8gMS41KSApO1xyXG4gICAgICAgIGNhbnZhcy53aWR0aCA9IHBhcnNlSW50KGNvbnRhaW5lci53aWR0aCgpKTtcclxuICAgICAgICBjYW52YXMuaGVpZ2h0ID0gcGFyc2VJbnQoY29udGFpbmVyLmhlaWdodCgpKTtcclxuICAgIFxyXG4gICAgICAgIC8vIGNyZWF0ZSBhIGRyYXdlciB3aGljaCB0cmFja3MgdG91Y2ggbW92ZW1lbnRzXHJcbiAgICAgICAgbGV0IGRyYXdlciA9IHtcclxuICAgICAgICAgICAgaXNEcmF3aW5nOiBmYWxzZSxcclxuICAgICAgICAgICAgdG91Y2hzdGFydDogZnVuY3Rpb24gKGNvb3JzKSB7XHJcbiAgICAgICAgICAgICAgICBjb250ZXh0LmJlZ2luUGF0aCgpO1xyXG4gICAgICAgICAgICAgICAgY29udGV4dC5tb3ZlVG8oY29vcnMueCwgY29vcnMueSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmlzRHJhd2luZyA9IHRydWU7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHRvdWNobW92ZTogZnVuY3Rpb24gKGNvb3JzKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5pc0RyYXdpbmcpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb250ZXh0LmxpbmVUbyhjb29ycy54LCBjb29ycy55KTtcclxuICAgICAgICAgICAgICAgICAgICBjb250ZXh0LnN0cm9rZSgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB0b3VjaGVuZDogZnVuY3Rpb24gKGNvb3JzKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5pc0RyYXdpbmcpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnRvdWNobW92ZShjb29ycyk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pc0RyYXdpbmcgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgLy8gY3JlYXRlIGEgZnVuY3Rpb24gdG8gcGFzcyB0b3VjaCBldmVudHMgYW5kIGNvb3JkaW5hdGVzIHRvIGRyYXdlclxyXG4gICAgICAgIGZ1bmN0aW9uIGRyYXcoZXZlbnQpIHsgXHJcbiAgICAgICAgICAgIGxldCB0eXBlID0gbnVsbDtcclxuICAgICAgICAgICAgLy8gbWFwIG1vdXNlIGV2ZW50cyB0byB0b3VjaCBldmVudHNcclxuICAgICAgICAgICAgc3dpdGNoKGV2ZW50LnR5cGUpe1xyXG4gICAgICAgICAgICAgICAgY2FzZSBcIm1vdXNlZG93blwiOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBldmVudC50b3VjaGVzID0gW107XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50LnRvdWNoZXNbMF0gPSB7IFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFnZVg6IGV2ZW50LnBhZ2VYLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFnZVk6IGV2ZW50LnBhZ2VZXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGUgPSBcInRvdWNoc3RhcnRcIjsgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSBcIm1vdXNlbW92ZVwiOiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnQudG91Y2hlcyA9IFtdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBldmVudC50b3VjaGVzWzBdID0geyBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhZ2VYOiBldmVudC5wYWdlWCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhZ2VZOiBldmVudC5wYWdlWVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlID0gXCJ0b3VjaG1vdmVcIjsgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgXCJtb3VzZXVwXCI6ICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBldmVudC50b3VjaGVzID0gW107XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50LnRvdWNoZXNbMF0gPSB7IFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFnZVg6IGV2ZW50LnBhZ2VYLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFnZVk6IGV2ZW50LnBhZ2VZXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGUgPSBcInRvdWNoZW5kXCI7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfSAgICBcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIC8vIHRvdWNoZW5kIGNsZWFyIHRoZSB0b3VjaGVzWzBdLCBzbyB3ZSBuZWVkIHRvIHVzZSBjaGFuZ2VkVG91Y2hlc1swXVxyXG4gICAgICAgICAgICBsZXQgY29vcnM7XHJcbiAgICAgICAgICAgIGlmKGV2ZW50LnR5cGUgPT09IFwidG91Y2hlbmRcIikge1xyXG4gICAgICAgICAgICAgICAgY29vcnMgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgeDogZXZlbnQuY2hhbmdlZFRvdWNoZXNbMF0ucGFnZVggLSA0KiQoJy5wYWludC1zY3JlZW5fX2NvbnRlbnQnKS5vZmZzZXQoKS5sZWZ0LFxyXG4gICAgICAgICAgICAgICAgICAgIHk6IGV2ZW50LmNoYW5nZWRUb3VjaGVzWzBdLnBhZ2VZIC0gJCgnLnBhaW50LXNjcmVlbl9fY29udGVudCcpLm9mZnNldCgpLnRvcFxyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIC8vIGdldCB0aGUgdG91Y2ggY29vcmRpbmF0ZXNcclxuICAgICAgICAgICAgICAgIGNvb3JzID0ge1xyXG4gICAgICAgICAgICAgICAgICAgIHg6IGV2ZW50LnRvdWNoZXNbMF0ucGFnZVggLSA0KiQoJy5wYWludC1zY3JlZW5fX2NvbnRlbnQnKS5vZmZzZXQoKS5sZWZ0LFxyXG4gICAgICAgICAgICAgICAgICAgIHk6IGV2ZW50LnRvdWNoZXNbMF0ucGFnZVkgLSAkKCcucGFpbnQtc2NyZWVuX19jb250ZW50Jykub2Zmc2V0KCkudG9wXHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHR5cGUgPSB0eXBlIHx8IGV2ZW50LnR5cGVcclxuICAgICAgICAgICAgLy8gcGFzcyB0aGUgY29vcmRpbmF0ZXMgdG8gdGhlIGFwcHJvcHJpYXRlIGhhbmRsZXJcclxuICAgICAgICAgICAgZHJhd2VyW3R5cGVdKGNvb3JzKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy8gZGV0ZWN0IHRvdWNoIGNhcGFiaWxpdGllc1xyXG4gICAgICAgIGxldCB0b3VjaEF2YWlsYWJsZSA9ICgnY3JlYXRlVG91Y2gnIGluIGRvY3VtZW50KSB8fCAoJ29udG91Y2hzdGFydCcgaW4gd2luZG93KTtcclxuICAgICAgICBcclxuICAgICAgICAvLyBhdHRhY2ggdGhlIHRvdWNoc3RhcnQsIHRvdWNobW92ZSwgdG91Y2hlbmQgZXZlbnQgbGlzdGVuZXJzLlxyXG4gICAgICAgIGlmKHRvdWNoQXZhaWxhYmxlKXtcclxuICAgICAgICAgICAgY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCBkcmF3LCBmYWxzZSk7XHJcbiAgICAgICAgICAgIGNhbnZhcy5hZGRFdmVudExpc3RlbmVyKCd0b3VjaG1vdmUnLCBkcmF3LCBmYWxzZSk7XHJcbiAgICAgICAgICAgIGNhbnZhcy5hZGRFdmVudExpc3RlbmVyKCd0b3VjaGVuZCcsIGRyYXcsIGZhbHNlKTsgICAgICAgIFxyXG4gICAgICAgIH0gICAgXHJcbiAgICAgICAgLy8gYXR0YWNoIHRoZSBtb3VzZWRvd24sIG1vdXNlbW92ZSwgbW91c2V1cCBldmVudCBsaXN0ZW5lcnMuXHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGNhbnZhcy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCBkcmF3LCBmYWxzZSk7XHJcbiAgICAgICAgICAgIGNhbnZhcy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCBkcmF3LCBmYWxzZSk7XHJcbiAgICAgICAgICAgIGNhbnZhcy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgZHJhdywgZmFsc2UpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gcHJldmVudCBlbGFzdGljIHNjcm9sbGluZ1xyXG4gICAgICAgIGRvY3VtZW50LmJvZHkuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2htb3ZlJywgZnVuY3Rpb24gKGV2ZW50KSB7XHJcbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgfSwgZmFsc2UpOyAvLyBlbmQgYm9keS5vblRvdWNoTW92ZVxyXG4gICAgfVxyXG5cclxuICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gICAgLy8vICAgQ09NUE9ORU5UIExJRkVDWUNMRSBNRVRIT0RTICAgLy8vXHJcbiAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbiAgICBmdW5jdGlvbiBvbmluaXQoKXtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBfbmV4dFF1ZXN0aW9uID0gcXVlc3Rpb24uYW5zd2Vyc1swXS5uZXh0UXVlc3Rpb247XHJcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICAgICAgX2Vycm9ycy5wdXNoKCfQntGC0YHRg9GC0YHRgtCy0YPRjtGCINCy0LDRgNC40LDQvdGC0Ysg0L7RgtCy0LXRgtC+0LIhJyk7XHJcbiAgICAgICAgICAgIF9zdGF0ZSA9ICdlcnJvcic7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHZpZXcoKXtcclxuICAgICAgICBzd2l0Y2goX3N0YXRlKXtcclxuICAgICAgICAgICAgY2FzZSAnZGVmYXVsdCc6XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbShcImRpdlwiLCB7Y2xhc3M6IFwiY29udGFpbmVyIHBhaW50LXNjcmVlbiBzdXJ2ZXktc2NyZWVuXCIsIHN0eWxlOiAnYmFja2dyb3VuZC1pbWFnZTogdXJsKFwiJytDb25maWcuc2VydmVyQWRkcmVzcysncGhvdG8vU1RfUVVFU1RJT04vJytxdWVzdGlvbi5waG90b1tHbG9iYWxzLmdldExhbmcoKV0rJ1wiKTsgYmFja2dyb3VuZC1yZXBlYXQ6IG5vbmU7IGJhY2tncm91bmQtc2l6ZTpjb3ZlcjsnfSwgW1xyXG4gICAgICAgICAgICAgICAgICAgIG0oXCJkaXZcIiwge2NsYXNzOiBcInJvdyBzdXJ2ZXktdG9wLXBhbmVsXCJ9LCBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG0oXCJkaXZcIiwge2NsYXNzOiBcImNvbC14cy02IGNvbC1tZC0zXCJ9LCBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG0oXCJidXR0b25cIiwge2NsYXNzOiBcImJ0biBidG4tZGVmYXVsdCBzdXJ2ZXktcHJldi1idG5cIiwgb25jbGljazogZ29QcmV2fSwgXCLQndCw0LfQsNC0XCIpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICApLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBtKFwiZGl2XCIsIHtjbGFzczogXCJjb2wteHMtNiBjb2wtbWQtMyBjb2wtbWQtcHVzaC02XCJ9LCBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG0oXCJidXR0b25cIiwge2NsYXNzOiBcImJ0biBidG4tZGVmYXVsdCBzdXJ2ZXktbmV4dC1idG5cIiwgb25jbGljazogZ29OZXh0fSwgXCLQktC/0LXRgNC10LRcIiksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICksICAgICAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG0oXCJkaXZcIiwge2NsYXNzOiBcImNvbC14cy0xMiBjb2wtbWQtNiBjb2wtbWQtcHVsbC0zIHN1cnZleS10b3AtcGFuZWxfX3F1ZXN0aW9uLWNvbnRhaW5lclwifSwgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBxdWVzdGlvbi50ZXh0W0dsb2JhbHMuZ2V0TGFuZygpXVxyXG4gICAgICAgICAgICAgICAgICAgICAgICApXHJcbiAgICAgICAgICAgICAgICAgICAgXSksXHJcbiAgICAgICAgICAgICAgICAgICAgbShcImRpdlwiLCB7Y2xhc3M6IFwicm93IHBhaW50LXNjcmVlbl9fY29udGVudFwifSwgW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBtKFwiZGl2XCIsIHtjbGFzczogXCJjb2wteHMtMTJcIn0sIFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG0oXCJkaXZcIiwge2NsYXNzOiBcInBhaW50LXNjcmVlbl9fY2FudmFzLWNvbnRhaW5lclwiLCBpZDogXCJjYW52YXNDb250YWluZXJcIn0sIFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtKFwiY2FudmFzXCIsIHtpZDogXCJjYW52YXNcIiwgb25jcmVhdGU6IGluaXRDYW52YXN9KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtKFwiZGl2XCIsIHtjbGFzczogXCJcIn0sIFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtKFwiYnV0dG9uXCIsIHtjbGFzczogXCJidG4gYnRuLWRlZmF1bHQgcGFpbnQtc2NyZWVuX19jbGVhci1idG5cIiwgb25jbGljazogY2xlYXJDYW52YXN9LCAn0J7Rh9C40YHRgtC40YLRjCcpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBdKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBdKVxyXG4gICAgICAgICAgICAgICAgICAgIF0pXHJcbiAgICAgICAgICAgICAgICBdKVxyXG4gICAgICAgICAgICBjYXNlICdlcnJvcic6XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbShcImRpdlwiLCB7Y2xhc3M6IFwic2NyZWVuLXBob3RvXCJ9LCBbXHJcbiAgICAgICAgICAgICAgICAgICAgX2Vycm9ycy5tYXAoZnVuY3Rpb24oZXJyb3Ipe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gbShcInBcIiwge2NsYXNzOiBcImVycm9yXCJ9LCBlcnJvcilcclxuICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgXSlcclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgb25pbml0OiBvbmluaXQsXHJcbiAgICAgICAgdmlldzogdmlld1xyXG4gICAgfVxyXG59IiwiJ3VzZSBzdHJpY3QnO1xyXG5sZXQgbSA9IHJlcXVpcmUoJ21pdGhyaWwnKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oY29uZmlnKXtcclxuICAgIGxldCBSZXN1bHRNb2RlbCA9IGNvbmZpZy5SZXN1bHRNb2RlbDtcclxuICAgIGxldCBxdWVzdGlvbiA9IGNvbmZpZy5xdWVzdGlvbjtcclxuICAgIGxldCBfc3RhdGUgPSAnZGVmYXVsdCc7XHJcbiAgICBsZXQgX3Bob3RvID0gZmFsc2U7XHJcbiAgICBsZXQgX3Bob3RvU3JjID0gZmFsc2U7XHJcbiAgICBsZXQgX25leHRRdWVzdGlvbiA9IGZhbHNlO1xyXG4gICAgbGV0IF9lcnJvcnMgPSBbXTtcclxuXHJcbiAgICBmdW5jdGlvbiBwaG90b0NoYW5nZWQoKXtcclxuICAgICAgICBfcGhvdG8gPSBmYWxzZTtcclxuICAgICAgICBpZih0aGlzLmZpbGVzICYmIHRoaXMuZmlsZXNbMF0pe1xyXG4gICAgICAgICAgICBfcGhvdG8gPSB0aGlzLmZpbGVzWzBdO1xyXG4gICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgbGV0IHJlYWRlciA9IG5ldyBGaWxlUmVhZGVyKCk7XHJcbiAgICAgICAgICAgICAgICByZWFkZXIub25sb2FkID0gZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICAgICAgICAgICAgICBfcGhvdG9TcmMgPSBlLnRhcmdldC5yZXN1bHQ7XHJcbiAgICAgICAgICAgICAgICAgICAgbS5yZWRyYXcoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJlYWRlci5yZWFkQXNEYXRhVVJMKHRoaXMuZmlsZXNbMF0pO1xyXG4gICAgICAgICAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2VuYW5ibGUgY3JlYXRlIHBob3RvIHByZXZpZXchJyk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGdvUHJldigpe1xyXG4gICAgICAgIGlmKHF1ZXN0aW9uLmlzRmlyc3Qpe1xyXG4gICAgICAgICAgICB3aW5kb3cuaGlzdG9yeS5iYWNrKCk7XHJcbiAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgIFJlc3VsdE1vZGVsLnJlbW92ZShxdWVzdGlvbi5jb2RlKTtcclxuICAgICAgICAgICAgY29uZmlnLnByZXYoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gZ29OZXh0KCl7XHJcbiAgICAgICAgaWYoX3Bob3RvKXtcclxuICAgICAgICAgICAgUmVzdWx0TW9kZWwuc2V0KHF1ZXN0aW9uLCBxdWVzdGlvbi5hbnN3ZXJzWzBdLmNvZGUsIF9waG90byk7XHJcbiAgICAgICAgICAgIGNvbmZpZy5uZXh0KF9uZXh0UXVlc3Rpb24pO1xyXG4gICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICBjb25maWcub25BbGVydCgn0J3QtdCy0LXRgNC90L4g0LfQsNC/0L7Qu9C90LXQvdGLINC/0L7Qu9GPJywgWyfQodC00LXQu9Cw0LnRgtC1INGE0L7RgtC+ISddKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG5cclxuICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gICAgLy8vICAgQ09NUE9ORU5UIExJRkVDWUNMRSBNRVRIT0RTICAgLy8vXHJcbiAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbiAgICBmdW5jdGlvbiBvbmluaXQoKXtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBfbmV4dFF1ZXN0aW9uID0gcXVlc3Rpb24uYW5zd2Vyc1swXS5uZXh0UXVlc3Rpb247XHJcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICAgICAgX2Vycm9ycy5wdXNoKCfQntGC0YHRg9GC0YHRgtCy0YPRjtGCINCy0LDRgNC40LDQvdGC0Ysg0L7RgtCy0LXRgtC+0LIhJyk7XHJcbiAgICAgICAgICAgIF9zdGF0ZSA9ICdlcnJvcic7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHZpZXcoKXtcclxuICAgICAgICBzd2l0Y2goX3N0YXRlKXtcclxuICAgICAgICAgICAgY2FzZSAnZGVmYXVsdCc6XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbShcImRpdlwiLCB7Y2xhc3M6IFwiY29udGFpbmVyIHBob3RvLXNjcmVlbiBzdXJ2ZXktc2NyZWVuXCIsIHN0eWxlOiAnYmFja2dyb3VuZC1pbWFnZTogdXJsKFwiJytDb25maWcuc2VydmVyQWRkcmVzcysncGhvdG8vU1RfUVVFU1RJT04vJytxdWVzdGlvbi5waG90b1tHbG9iYWxzLmdldExhbmcoKV0rJ1wiKTsgYmFja2dyb3VuZC1yZXBlYXQ6IG5vbmU7IGJhY2tncm91bmQtc2l6ZTpjb3ZlcjsnfSwgW1xyXG4gICAgICAgICAgICAgICAgICAgIG0oXCJkaXZcIiwge2NsYXNzOiBcInJvdyBzdXJ2ZXktdG9wLXBhbmVsXCJ9LCBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG0oXCJkaXZcIiwge2NsYXNzOiBcImNvbC14cy02IGNvbC1tZC0zXCJ9LCBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG0oXCJidXR0b25cIiwge2NsYXNzOiBcImJ0biBidG4tZGVmYXVsdCBzdXJ2ZXktcHJldi1idG5cIiwgb25jbGljazogZ29QcmV2fSwgXCLQndCw0LfQsNC0XCIpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICApLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBtKFwiZGl2XCIsIHtjbGFzczogXCJjb2wteHMtNiBjb2wtbWQtMyBjb2wtbWQtcHVzaC02XCJ9LCBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG0oXCJidXR0b25cIiwge2NsYXNzOiBcImJ0biBidG4tZGVmYXVsdCBzdXJ2ZXktbmV4dC1idG5cIiwgb25jbGljazogZ29OZXh0fSwgXCLQktC/0LXRgNC10LRcIiksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICksICAgICAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG0oXCJkaXZcIiwge2NsYXNzOiBcImNvbC14cy0xMiBjb2wtbWQtNiBjb2wtbWQtcHVsbC0zIHN1cnZleS10b3AtcGFuZWxfX3F1ZXN0aW9uLWNvbnRhaW5lclwifSwgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBxdWVzdGlvbi50ZXh0W0dsb2JhbHMuZ2V0TGFuZygpXVxyXG4gICAgICAgICAgICAgICAgICAgICAgICApXHJcbiAgICAgICAgICAgICAgICAgICAgXSksXHJcbiAgICAgICAgICAgICAgICAgICAgbShcImRpdlwiLCB7Y2xhc3M6IFwicm93IHBob3RvLXNjcmVlbl9fY29udGVudFwifSwgW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBtKFwiZGl2XCIsIHtjbGFzczogXCJjb2wteHMtMTJcIn0sIFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG0oXCJkaXZcIiwge2NsYXNzOiBcInNjcmVlbi1waG90b19fcGhvdG8tY29udGFpbmVyXCJ9LCBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgX3Bob3RvU3JjID8gXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG0oXCJkaXZcIiwge2NsYXNzOiBcInNjcmVlbi1waG90b19fcGhvdG9cIn0sIFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG0oXCJpbWdcIiwge3NyYzogX3Bob3RvU3JjfSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXSkgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG0oXCJkaXZcIiwge2NsYXNzOiBcInNjcmVlbi1waG90b19fcGhvdG9fY2FwXCJ9LCBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAn0KTQvtGC0L4nXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBdKSwgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtKFwiYnV0dG9uXCIsIHtjbGFzczogXCJidG4gYnRuLXByaW1hcnkgc2NyZWVuLXBob3RvX19pbnB1dC1idG5cIn0sW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICfQodC00LXQu9Cw0YLRjCDRhNC+0YLQvicsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbSgnc3BhbicsIHtjbGFzczogXCJnbHlwaGljb24gZ2x5cGhpY29uLWNhbWVyYVwifSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbShcImlucHV0XCIsIHt0eXBlOiBcImZpbGVcIiwgYWNjZXB0OiBcImltYWdlLyo7Y2FwdHVyZT1jYW1lcmFcIiwgY2FwdHVyZTogXCJjYW1lcmFcIiwgb25jaGFuZ2U6IHBob3RvQ2hhbmdlZH0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBdKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBdKVxyXG4gICAgICAgICAgICAgICAgICAgIF0pXHJcbiAgICAgICAgICAgICAgICBdKVxyXG4gICAgICAgICAgICBjYXNlICdlcnJvcic6XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbShcImRpdlwiLCB7Y2xhc3M6IFwic2NyZWVuLXBob3RvXCJ9LCBbXHJcbiAgICAgICAgICAgICAgICAgICAgX2Vycm9ycy5tYXAoZnVuY3Rpb24oZXJyb3Ipe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gbShcInBcIiwge2NsYXNzOiBcImVycm9yXCJ9LCBlcnJvcilcclxuICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgXSlcclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgb25pbml0OiBvbmluaXQsXHJcbiAgICAgICAgdmlldzogdmlld1xyXG4gICAgfVxyXG59IiwiJ3VzZSBzdHJpY3QnO1xyXG5sZXQgbSA9IHJlcXVpcmUoJ21pdGhyaWwnKTtcclxubGV0IEhlbHBlciA9IHJlcXVpcmUoJy4uLy4uLy4uL2NvbXBvbmVudHMvaGVscGVyLmpzJyk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGNvbmZpZyl7XHJcbiAgICBsZXQgUmVzdWx0TW9kZWwgPSBjb25maWcuUmVzdWx0TW9kZWw7XHJcbiAgICBsZXQgcXVlc3Rpb24gPSBjb25maWcucXVlc3Rpb247XHJcbiAgICBsZXQgX25leHRRdWVzdGlvbiA9IGZhbHNlO1xyXG5cclxuICAgIGxldCBVc2VyTW9kZWwgPSB7XHJcbiAgICAgICAgZ2VuZGVyOiBmYWxzZSxcclxuICAgICAgICBiaXJ0aGRhdGU6IGZhbHNlLFxyXG4gICAgICAgIGxvYWQ6IGZ1bmN0aW9uKGRhdGEpe1xyXG4gICAgICAgICAgICBVc2VyTW9kZWwuZ2VuZGVyID0gZGF0YS5nZW5kZXI7XHJcbiAgICAgICAgICAgIFVzZXJNb2RlbC5iaXJ0aGRhdGUgPSBkYXRhLmJpcnRoZGF0ZTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIHNldEdlbmRlcjogZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgVXNlck1vZGVsLmdlbmRlciA9IHRoaXMuZ2V0QXR0cmlidXRlKCdkYXRhLWdlbmRlcicpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgc2V0QmlydGhkYXRlOiBmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICBVc2VyTW9kZWwuYmlydGhkYXRlID0gdGhpcy52YWx1ZTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGNoZWNrOiBmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICBsZXQgbWVzc2FnZXMgPSBbXTtcclxuICAgICAgICAgICAgaWYoIVVzZXJNb2RlbC5nZW5kZXIpe1xyXG4gICAgICAgICAgICAgICAgbWVzc2FnZXMucHVzaCgn0JLRi9Cx0LXRgNC40YLQtSDQv9C+0LshJyk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmKCFVc2VyTW9kZWwuYmlydGhkYXRlKXtcclxuICAgICAgICAgICAgICAgIG1lc3NhZ2VzLnB1c2goJ9CS0YvQsdC10YDQuNGC0LUg0LTQsNGC0YMg0YDQvtC20LTQtdC90LjRjyEnKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgIGlzVmFsaWQ6IChtZXNzYWdlcy5sZW5ndGggPT09IDApLFxyXG4gICAgICAgICAgICAgICAgbWVzc2FnZXM6IG1lc3NhZ2VzXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gZ29QcmV2KCl7XHJcbiAgICAgICAgaWYocXVlc3Rpb24uaXNGaXJzdCl7XHJcbiAgICAgICAgICAgIHdpbmRvdy5oaXN0b3J5LmJhY2soKTtcclxuICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgUmVzdWx0TW9kZWwucmVtb3ZlKHF1ZXN0aW9uLmNvZGUpO1xyXG4gICAgICAgICAgICBjb25maWcucHJldigpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBnb05leHQoKXtcclxuICAgICAgICBsZXQgcmVzdWx0ID0gVXNlck1vZGVsLmNoZWNrKCk7XHJcbiAgICAgICAgaWYocmVzdWx0LmlzVmFsaWQpe1xyXG4gICAgICAgICAgICBSZXN1bHRNb2RlbC5zZXQocXVlc3Rpb24sIHF1ZXN0aW9uLmFuc3dlcnNbMF0uY29kZSwge2dlbmRlcjogVXNlck1vZGVsLmdlbmRlciwgYmlydGhkYXRlOiBVc2VyTW9kZWwuYmlydGhkYXRlfSk7XHJcbiAgICAgICAgICAgIGNvbmZpZy5uZXh0KF9uZXh0UXVlc3Rpb24pO1xyXG4gICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICBjb25maWcub25BbGVydCgn0J3QtdCy0LXRgNC90L4g0LfQsNC/0L7Qu9C90LXQvdGLINC/0L7Qu9GPJywgcmVzdWx0Lm1lc3NhZ2VzKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gZGF0ZVBpY2tlcihlbCl7XHJcbiAgICAgICAgJChlbC5kb20pLmRhdGVwaWNrZXIoe1xyXG4gICAgICAgICAgICBmb3JtYXQ6ICdkZC1tbS15eXl5JyxcclxuICAgICAgICAgICAgbGFuZ3VhZ2U6IEdsb2JhbHMuZ2V0TGFuZygpLFxyXG4gICAgICAgICAgICBhdXRvY2xvc2U6IHRydWUsXHJcbiAgICAgICAgICAgIHN0YXJ0VmlldzogJ3llYXJzJyxcclxuICAgICAgICAgICAgbWluVmlld01vZGU6ICdkYXlzJyxcclxuICAgICAgICAgICAgZW5kRGF0ZTogJy0yMXknLFxyXG4gICAgICAgICAgICBpZ25vcmVSZWFkb25seTogdHJ1ZSxcclxuICAgICAgICAgICAgYWxsb3dJbnB1dFRvZ2dsZTogdHJ1ZVxyXG4gICAgICAgIH0pXHJcbiAgICB9XHJcblxyXG4gICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgICAvLy8gICBDT01QT05FTlQgTElGRUNZQ0xFIE1FVEhPRFMgICAvLy9cclxuICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxuICAgIGZ1bmN0aW9uIG9uY3JlYXRlKCkge1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBvbmluaXQoKXtcclxuICAgICAgICBsZXQgZGF0YSA9IFJlc3VsdE1vZGVsLmdldChxdWVzdGlvbi5jb2RlKTtcclxuICAgICAgICBpZihkYXRhKXtcclxuICAgICAgICAgICAgVXNlck1vZGVsLmxvYWQoZGF0YS5yZXN1bHQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBfbmV4dFF1ZXN0aW9uID0gcXVlc3Rpb24uYW5zd2Vyc1swXS5uZXh0UXVlc3Rpb247XHJcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICAgICAgX2Vycm9ycy5wdXNoKCfQntGC0YHRg9GC0YHRgtCy0YPRjtGCINCy0LDRgNC40LDQvdGC0Ysg0L7RgtCy0LXRgtC+0LIhJyk7XHJcbiAgICAgICAgICAgIF9zdGF0ZSA9ICdlcnJvcic7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHZpZXcoKXtcclxuICAgICAgICByZXR1cm4gbShcImRpdlwiLCB7Y2xhc3M6IFwiY29udGFpbmVyIHJlZ2lzdGVyLWJpcnRoLWdlbmRlci1zY3JlZW4gc3VydmV5LXNjcmVlblwiLCBzdHlsZTogJ2JhY2tncm91bmQtaW1hZ2U6IHVybChcIicrQ29uZmlnLnNlcnZlckFkZHJlc3MrJ3Bob3RvL1NUX1FVRVNUSU9OLycrcXVlc3Rpb24ucGhvdG9bR2xvYmFscy5nZXRMYW5nKCldKydcIik7IGJhY2tncm91bmQtcmVwZWF0OiBub25lOyBiYWNrZ3JvdW5kLXNpemU6Y292ZXI7J30sIFtcclxuICAgICAgICAgICAgbShcImRpdlwiLCB7Y2xhc3M6IFwicm93IHN1cnZleS10b3AtcGFuZWxcIn0sIFtcclxuICAgICAgICAgICAgICAgIG0oXCJkaXZcIiwge2NsYXNzOiBcImNvbC14cy02IGNvbC1tZC0zXCJ9LCBcclxuICAgICAgICAgICAgICAgICAgICBtKFwiYnV0dG9uXCIsIHtjbGFzczogXCJidG4gYnRuLWRlZmF1bHQgc3VydmV5LXByZXYtYnRuXCIsIG9uY2xpY2s6IGdvUHJldn0sIFwi0J3QsNC30LDQtFwiKSxcclxuICAgICAgICAgICAgICAgICksXHJcbiAgICAgICAgICAgICAgICBtKFwiZGl2XCIsIHtjbGFzczogXCJjb2wteHMtNiBjb2wtbWQtMyBjb2wtbWQtcHVzaC02XCJ9LCBcclxuICAgICAgICAgICAgICAgICAgICBtKFwiYnV0dG9uXCIsIHtjbGFzczogXCJidG4gYnRuLWRlZmF1bHQgc3VydmV5LW5leHQtYnRuXCIsIG9uY2xpY2s6IGdvTmV4dH0sIFwi0JLQv9C10YDQtdC0XCIpLFxyXG4gICAgICAgICAgICAgICAgKSwgICAgICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIG0oXCJkaXZcIiwge2NsYXNzOiBcImNvbC14cy0xMiBjb2wtbWQtNiBjb2wtbWQtcHVsbC0zIHN1cnZleS10b3AtcGFuZWxfX3F1ZXN0aW9uLWNvbnRhaW5lclwifSwgXHJcbiAgICAgICAgICAgICAgICAgICAgcXVlc3Rpb24udGV4dFtHbG9iYWxzLmdldExhbmcoKV1cclxuICAgICAgICAgICAgICAgIClcclxuICAgICAgICAgICAgXSksXHJcbiAgICAgICAgICAgIG0oXCJkaXZcIiwge2NsYXNzOiBcInJvdyByZWdpc3Rlci1iaXJ0aC1nZW5kZXItc2NyZWVuX19jb250ZW50XCJ9LCBbXHJcbiAgICAgICAgICAgICAgICBtKFwiZGl2XCIsIHtjbGFzczogXCJjb2wteHMtMTIgY29sLW1kLTZcIn0sIFtcclxuICAgICAgICAgICAgICAgICAgICBtKFwiZGl2XCIsIHtjbGFzczogXCJpbm5lci1hZGRvbiByaWdodC1hZGRvbiByZWdpc3Rlci1iaXJ0aC1nZW5kZXItc2NyZWVuX19jYWxlbmRhci1jb250YWluZXJcIn0sIFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbShcImlcIiwge2NsYXNzOiBcImdseXBoaWNvbiBnbHlwaGljb24tY2FsZW5kYXJcIn0sICcnKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgbShcImlucHV0XCIsIHt0eXBlOiBcInRleHRcIiwgY2xhc3M6IFwiZm9ybS1jb250cm9sXCIsIHBsYWNlaG9sZGVyOiBcItCU0LDRgtCwINGA0L7QttC00LXQvdC40Y9cIiwgb25jcmVhdGU6IGRhdGVQaWNrZXIsIHZhbHVlOiAoVXNlck1vZGVsLmJpcnRoZGF0ZSA/IFVzZXJNb2RlbC5iaXJ0aGRhdGUgOiAnJyksIHJlYWRvbmx5OiBcInRydWVcIiwgb25jaGFuZ2U6IFVzZXJNb2RlbC5zZXRCaXJ0aGRhdGV9KVxyXG4gICAgICAgICAgICAgICAgICAgIF0pLFxyXG4gICAgICAgICAgICAgICAgXSksXHJcbiAgICAgICAgICAgICAgICBtKFwiZGl2XCIsIHtjbGFzczogXCJjb2wteHMtMTIgY29sLW1kLTZcIn0sIFtcclxuICAgICAgICAgICAgICAgICAgICBtKFwiYnV0dG9uXCIsIHtjbGFzczogXCJyZWdpc3Rlci1iaXJ0aC1nZW5kZXItc2NyZWVuX19nZW5kZXItYnRuIGJ0biBidG4tZGVmYXVsdCBcIisoVXNlck1vZGVsLmdlbmRlciA9PT0gJ21hbicgPyAnYWN0aXZlJyA6ICcnKSwgXCJkYXRhLWdlbmRlclwiOiBcIm1hblwiLCBvbmNsaWNrOiBVc2VyTW9kZWwuc2V0R2VuZGVyfSwgW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBtKFwiaVwiLCB7Y2xhc3M6IFwiZmEgZmEtbWFsZVwiLCBcImFyaWEtaGlkZGVuXCI6IFwidHJ1ZVwifSksXHJcblxyXG4gICAgICAgICAgICAgICAgICAgIF0pLFxyXG4gICAgICAgICAgICAgICAgICAgIG0oXCJidXR0b25cIiwge2NsYXNzOiBcInJlZ2lzdGVyLWJpcnRoLWdlbmRlci1zY3JlZW5fX2dlbmRlci1idG4gYnRuIGJ0bi1kZWZhdWx0IFwiKyhVc2VyTW9kZWwuZ2VuZGVyID09PSAnd29tYW4nID8gJ2FjdGl2ZScgOiAnJyksIFwiZGF0YS1nZW5kZXJcIjogXCJ3b21hblwiLCBvbmNsaWNrOiBVc2VyTW9kZWwuc2V0R2VuZGVyfSwgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG0oXCJpXCIsIHtjbGFzczogXCJmYSBmYS1mZW1hbGVcIiwgXCJhcmlhLWhpZGRlblwiOiBcInRydWVcIn0pXHJcbiAgICAgICAgICAgICAgICAgICAgKVxyXG4gICAgICAgICAgICAgICAgXSksXHJcblxyXG4gICAgICAgICAgICBdKVxyXG4gICAgICAgIF0pXHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBvbmluaXQ6IG9uaW5pdCxcclxuICAgICAgICBvbmNyZWF0ZTogb25jcmVhdGUsXHJcbiAgICAgICAgdmlldzogdmlld1xyXG4gICAgfVxyXG59IiwiJ3VzZSBzdHJpY3QnO1xyXG5sZXQgbSA9IHJlcXVpcmUoJ21pdGhyaWwnKTtcclxubGV0IEhlbHBlciA9IHJlcXVpcmUoJy4uLy4uLy4uL2NvbXBvbmVudHMvaGVscGVyLmpzJyk7XHJcbmxldCBSID0gcmVxdWlyZSgnLi4vLi4vLi4vY29tcG9uZW50cy9yZXF1ZXN0LmpzJyk7XHJcbmxldCBNb2RhbCA9IHJlcXVpcmUoJy4uLy4uLy4uL2NvbXBvbmVudHMvbW9kYWwtd2luZG93L21vZGFsLXdpbmRvdy5qcycpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoY29uZmlnKSB7XHJcbiAgICBsZXQgUmVzdWx0TW9kZWwgPSBjb25maWcuUmVzdWx0TW9kZWw7XHJcbiAgICBsZXQgcXVlc3Rpb24gPSBjb25maWcucXVlc3Rpb247XHJcbiAgICBsZXQgX25leHRRdWVzdGlvbiA9IGZhbHNlO1xyXG5cclxuICAgIGxldCBVc2VyTW9kZWwgPSB7XHJcbiAgICAgICAgbmFtZTogJycsXHJcbiAgICAgICAgc3VybmFtZTogJycsXHJcbiAgICAgICAgcGhvbmU6ICcnLFxyXG4gICAgICAgIGxvYWQ6IGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAgICAgICAgIFVzZXJNb2RlbC5uYW1lID0gZGF0YS5uYW1lO1xyXG4gICAgICAgICAgICBVc2VyTW9kZWwuc3VybmFtZSA9IGRhdGEuc3VybmFtZTtcclxuICAgICAgICAgICAgVXNlck1vZGVsLnBob25lID0gZGF0YS5waG9uZTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGNoYW5nZU5hbWU6IGZ1bmN0aW9uICh2YWx1ZSkge1xyXG4gICAgICAgICAgICBVc2VyTW9kZWwubmFtZSA9IHZhbHVlLnRyaW0oKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGNoYW5nZVN1cm5hbWU6IGZ1bmN0aW9uICh2YWx1ZSkge1xyXG4gICAgICAgICAgICBVc2VyTW9kZWwuc3VybmFtZSA9IHZhbHVlLnRyaW0oKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGNoYW5nZVBob25lOiBmdW5jdGlvbiAodmFsdWUpIHtcclxuICAgICAgICAgICAgVXNlck1vZGVsLnBob25lID0gdmFsdWUucmVwbGFjZSgvW14wLTkuXS9nLCBcIlwiKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGNoZWNrOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGxldCBtZXNzYWdlcyA9IFtdO1xyXG4gICAgICAgICAgICBpZiAoVXNlck1vZGVsLm5hbWUgPT09ICcnKSB7XHJcbiAgICAgICAgICAgICAgICBtZXNzYWdlcy5wdXNoKCfQl9Cw0L/QvtC70L3QuNGC0LUg0LjQvNGPIScpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoVXNlck1vZGVsLnN1cm5hbWUgPT09ICcnKSB7XHJcbiAgICAgICAgICAgICAgICBtZXNzYWdlcy5wdXNoKCfQl9Cw0L/QvtC70L3QuNGC0LUg0YTQsNC80LjQu9C40Y4hJyk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGxldCByZWcgPSBuZXcgUmVnRXhwKC9bMC05XXsxMH0vKTtcclxuICAgICAgICAgICAgaWYgKCFyZWcudGVzdChVc2VyTW9kZWwucGhvbmUpKSB7XHJcbiAgICAgICAgICAgICAgICBtZXNzYWdlcy5wdXNoKCfQndC10LLQtdGA0L3QviDQt9Cw0L/QvtC70L3QtdC9INGC0LXQu9C10YTQvtC9IScpO1xyXG4gICAgICAgICAgICAgICAgbWVzc2FnZXMucHVzaCgn0KTQvtGA0LzQsNGCINGC0LXQu9C10YTQvtC90LAgXCI3NzcxMjM0NTY3XCInKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGxldCBwaG9uZVByZWZmaXhlcyA9IFsnNzAwJywgJzcwMScsICc3MDInLCAnNzA1JywgJzcwNycsICc3MDgnLCAnNzEyJywgJzcxMycsICc3MTcnLCAnNzE4JywgJzcyMScsICc3MjUnLCAnNzI2JywgJzcyNycsICc3NDcnLCAnNzUwJywgJzc1MScsICc3NjAnLCAnNzYxJywgJzc2MicsICc3NjMnLCAnNzY0JywgJzc3MScsICc3NzUnLCAnNzc2JywgJzc3NycsICc3NzgnXTtcclxuICAgICAgICAgICAgICAgIGxldCB1c2VyUGhvbmVQcmVmZml4ID0gVXNlck1vZGVsLnBob25lLnN1YnN0cigwLCAzKTtcclxuICAgICAgICAgICAgICAgIGlmIChwaG9uZVByZWZmaXhlcy5pbmRleE9mKHVzZXJQaG9uZVByZWZmaXgpID09PSAtMSkge1xyXG4gICAgICAgICAgICAgICAgICAgIG1lc3NhZ2VzLnB1c2goJ9Cd0LXQstC10YDQvdGL0Lkg0L/RgNC10YTQuNC60YEg0L7Qv9C10YDQsNGC0L7RgNCwIScpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgaXNWYWxpZDogbWVzc2FnZXMubGVuZ3RoID09PSAwLFxyXG4gICAgICAgICAgICAgICAgbWVzc2FnZXM6IG1lc3NhZ2VzXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gZ29QcmV2KCkge1xyXG4gICAgICAgIGlmIChxdWVzdGlvbi5pc0ZpcnN0KSB7XHJcbiAgICAgICAgICAgIHdpbmRvdy5oaXN0b3J5LmJhY2soKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBSZXN1bHRNb2RlbC5yZW1vdmUocXVlc3Rpb24uY29kZSk7XHJcbiAgICAgICAgICAgIGNvbmZpZy5wcmV2KCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGdvTmV4dCgpIHtcclxuICAgICAgICBsZXQgcmVzdWx0ID0gVXNlck1vZGVsLmNoZWNrKCk7XHJcbiAgICAgICAgaWYgKHJlc3VsdC5pc1ZhbGlkKSB7XHJcbiAgICAgICAgICAgIFJlc3VsdE1vZGVsLnNldChxdWVzdGlvbiwgcXVlc3Rpb24uYW5zd2Vyc1swXS5jb2RlLCB7IG5hbWU6IFVzZXJNb2RlbC5uYW1lLCBzdXJuYW1lOiBVc2VyTW9kZWwuc3VybmFtZSwgcGhvbmU6IFVzZXJNb2RlbC5waG9uZSB9KTtcclxuICAgICAgICAgICAgbGV0IG1lc3NhZ2UgPSAnS29kIHBvZHR2ZXJ6aGRlbml5YTogJyArIGNvbmZpZy5zZXNzaW9uQ29kZTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGlmKENvbmZpZy5pc1NlbmRNZXNzYWdlKXtcclxuICAgICAgICAgICAgICAgIFIuc2VuZFNNUyhtZXNzYWdlLCAnKzcnK1VzZXJNb2RlbC5waG9uZSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGNvbmZpZy5uZXh0KF9uZXh0UXVlc3Rpb24pO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGNvbmZpZy5vbkFsZXJ0KCfQndC10LLQtdGA0L3QviDQt9Cw0L/QvtC70L3QtdC90Ysg0L/QvtC70Y8nLCByZXN1bHQubWVzc2FnZXMpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBzZWxlY3RJbWFnZSgpIHtcclxuICAgICAgICBfbmV4dFF1ZXN0aW9uID0gcGFyc2VJbnQodGhpcy5nZXRBdHRyaWJ1dGUoJ2RhdGEtbmV4dCcpKTtcclxuICAgICAgICBfc2VsZWN0ZWQgPSBwYXJzZUludCh0aGlzLmdldEF0dHJpYnV0ZSgnZGF0YS1pbmRleCcpKTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBjcmVhdGVQaG9uZU1hc2soZWwpIHtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAkKGVsLmRvbSkubWFzayhcIig5OTkpLTk5OS05OS05OVwiLCB7XHJcbiAgICAgICAgICAgICAgICBjb21wbGV0ZWQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICBVc2VyTW9kZWwuY2hhbmdlUGhvbmUodGhpcy52YWwoKS5yZXBsYWNlKC9bXjAtOS5dL2csIFwiXCIpKVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhlcnJvcik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gICAgLy8vICAgQ09NUE9ORU5UIExJRkVDWUNMRSBNRVRIT0RTICAgLy8vXHJcbiAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbiAgICBmdW5jdGlvbiBvbmNyZWF0ZSgpIHtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gb25pbml0KCkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGNvbmZpZyk7XHJcbiAgICAgICAgbGV0IGRhdGEgPSBSZXN1bHRNb2RlbC5nZXQocXVlc3Rpb24uY29kZSk7XHJcbiAgICAgICAgaWYgKGRhdGEpIHtcclxuICAgICAgICAgICAgVXNlck1vZGVsLmxvYWQoZGF0YS5yZXN1bHQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBfbmV4dFF1ZXN0aW9uID0gcXVlc3Rpb24uYW5zd2Vyc1swXS5uZXh0UXVlc3Rpb247XHJcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICAgICAgX2Vycm9ycy5wdXNoKCfQntGC0YHRg9GC0YHRgtCy0YPRjtGCINCy0LDRgNC40LDQvdGC0Ysg0L7RgtCy0LXRgtC+0LIhJyk7XHJcbiAgICAgICAgICAgIF9zdGF0ZSA9ICdlcnJvcic7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHZpZXcoKSB7XHJcbiAgICAgICAgcmV0dXJuIG0oXCJkaXZcIiwgeyBjbGFzczogXCJjb250YWluZXIgcmVnaXN0ZXItbmFtZS1zY3JlZW4gc3VydmV5LXNjcmVlblwiLCBzdHlsZTogJ2JhY2tncm91bmQtaW1hZ2U6IHVybChcIicgKyBDb25maWcuc2VydmVyQWRkcmVzcyArICdwaG90by9TVF9RVUVTVElPTi8nICsgcXVlc3Rpb24ucGhvdG9bR2xvYmFscy5nZXRMYW5nKCldICsgJ1wiKTsgYmFja2dyb3VuZC1yZXBlYXQ6IG5vbmU7IGJhY2tncm91bmQtc2l6ZTpjb3ZlcjsnIH0sIFtcclxuICAgICAgICAgICAgbShcImRpdlwiLCB7IGNsYXNzOiBcInJvdyBzdXJ2ZXktdG9wLXBhbmVsXCIgfSwgW1xyXG4gICAgICAgICAgICAgICAgbShcImRpdlwiLCB7IGNsYXNzOiBcImNvbC14cy02IGNvbC1tZC0zXCIgfSxcclxuICAgICAgICAgICAgICAgICAgICBtKFwiYnV0dG9uXCIsIHsgY2xhc3M6IFwiYnRuIGJ0bi1kZWZhdWx0IHN1cnZleS1wcmV2LWJ0blwiLCBvbmNsaWNrOiBnb1ByZXYgfSwgXCLQndCw0LfQsNC0XCIpLFxyXG4gICAgICAgICAgICAgICAgKSxcclxuICAgICAgICAgICAgICAgIG0oXCJkaXZcIiwgeyBjbGFzczogXCJjb2wteHMtNiBjb2wtbWQtMyBjb2wtbWQtcHVzaC02XCIgfSxcclxuICAgICAgICAgICAgICAgICAgICBtKFwiYnV0dG9uXCIsIHsgY2xhc3M6IFwiYnRuIGJ0bi1kZWZhdWx0IHN1cnZleS1uZXh0LWJ0blwiLCBvbmNsaWNrOiBnb05leHQgfSwgXCLQktC/0LXRgNC10LRcIiksXHJcbiAgICAgICAgICAgICAgICApLFxyXG4gICAgICAgICAgICAgICAgbShcImRpdlwiLCB7IGNsYXNzOiBcImNvbC14cy0xMiBjb2wtbWQtNiBjb2wtbWQtcHVsbC0zIHN1cnZleS10b3AtcGFuZWxfX3F1ZXN0aW9uLWNvbnRhaW5lclwiIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgcXVlc3Rpb24udGV4dFtHbG9iYWxzLmdldExhbmcoKV1cclxuICAgICAgICAgICAgICAgIClcclxuICAgICAgICAgICAgXSksXHJcbiAgICAgICAgICAgIG0oXCJkaXZcIiwgeyBjbGFzczogXCJyb3cgcmVnaXN0ZXItbmFtZS1zY3JlZW5fX2NvbnRlbnRcIiB9LCBbXHJcbiAgICAgICAgICAgICAgICBtKFwiZGl2XCIsIHsgY2xhc3M6IFwiY29sLXhzLTEyIGNvbC1tZC02XCIgfSwgW1xyXG4gICAgICAgICAgICAgICAgICAgIG0oXCJpbnB1dFwiLCB7IGNsYXNzOiBcImZvcm0tY29udHJvbFwiLCBwbGFjZWhvbGRlcjogXCLQktCy0LXQtNC40YLQtSDQuNC80Y9cIiwgdmFsdWU6IFVzZXJNb2RlbC5uYW1lLCBvbmNoYW5nZTogbS53aXRoQXR0cihcInZhbHVlXCIsIFVzZXJNb2RlbC5jaGFuZ2VOYW1lKSB9KVxyXG4gICAgICAgICAgICAgICAgXSksXHJcbiAgICAgICAgICAgICAgICBtKFwiZGl2XCIsIHsgY2xhc3M6IFwiY29sLXhzLTEyIGNvbC1tZC02XCIgfSwgW1xyXG4gICAgICAgICAgICAgICAgICAgIG0oXCJpbnB1dFwiLCB7IGNsYXNzOiBcImZvcm0tY29udHJvbFwiLCBwbGFjZWhvbGRlcjogXCLQktCy0LXQtNC40YLQtSDRhNCw0LzQuNC70LjRjlwiLCB2YWx1ZTogVXNlck1vZGVsLnN1cm5hbWUsIG9uY2hhbmdlOiBtLndpdGhBdHRyKFwidmFsdWVcIiwgVXNlck1vZGVsLmNoYW5nZVN1cm5hbWUpIH0pXHJcbiAgICAgICAgICAgICAgICBdKSxcclxuICAgICAgICAgICAgICAgIG0oXCJkaXZcIiwgeyBjbGFzczogXCJjb2wteHMtMTJcIiB9LCBbXHJcbiAgICAgICAgICAgICAgICAgICAgbShcImlucHV0XCIsIHsgY2xhc3M6IFwiZm9ybS1jb250cm9sXCIsIHR5cGU6IFwidGVsXCIsIHBsYWNlaG9sZGVyOiBcItCd0L7QvNC10YAg0YLQtdC70LXRhNC+0L3QsFwiLCB2YWx1ZTogVXNlck1vZGVsLnBob25lLCBvbmlucHV0OiBtLndpdGhBdHRyKFwidmFsdWVcIiwgVXNlck1vZGVsLmNoYW5nZVBob25lKSB9KVxyXG4gICAgICAgICAgICAgICAgXSlcclxuICAgICAgICAgICAgXSlcclxuICAgICAgICBdKVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgb25pbml0OiBvbmluaXQsXHJcbiAgICAgICAgb25jcmVhdGU6IG9uY3JlYXRlLFxyXG4gICAgICAgIHZpZXc6IHZpZXdcclxuICAgIH1cclxufSIsIid1c2Ugc3RyaWN0JztcclxubGV0IG0gPSByZXF1aXJlKCdtaXRocmlsJyk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGNvbmZpZyl7XHJcbiAgICBsZXQgUmVzdWx0TW9kZWwgPSBjb25maWcuUmVzdWx0TW9kZWw7XHJcbiAgICBsZXQgcXVlc3Rpb24gPSBjb25maWcucXVlc3Rpb247XHJcbiAgICBsZXQgX25leHRRdWVzdGlvbiA9IGZhbHNlO1xyXG4gICAgbGV0IF9saXN0Q29tYm87XHJcbiAgICBsZXQgX3NlbGVjdGVkID0gZmFsc2U7XHJcbiAgICBsZXQgX3NlYXJjaCA9ICcnO1xyXG5cclxuICAgIGZ1bmN0aW9uIGdvUHJldigpe1xyXG4gICAgICAgIGlmKHF1ZXN0aW9uLmlzRmlyc3Qpe1xyXG4gICAgICAgICAgICB3aW5kb3cuaGlzdG9yeS5iYWNrKCk7XHJcbiAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgIFJlc3VsdE1vZGVsLnJlbW92ZShxdWVzdGlvbi5jb2RlKTtcclxuICAgICAgICAgICAgY29uZmlnLnByZXYoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gZ29OZXh0KCl7XHJcbiAgICAgICAgaWYoX3NlbGVjdGVkKXtcclxuICAgICAgICAgICAgUmVzdWx0TW9kZWwuc2V0KHF1ZXN0aW9uLCBfc2VsZWN0ZWQsIG51bGwpO1xyXG4gICAgICAgICAgICBjb25maWcubmV4dChfbmV4dFF1ZXN0aW9uKTtcclxuICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgY29uZmlnLm9uQWxlcnQoJ9Ce0YjQuNCx0LrQsCcsIFsn0JLRi9Cx0LXRgNC40YLQtSDQstCw0YDQuNCw0L3RgiDQvtGC0LLQtdGC0LAhJ10pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gY2hhbmdlQW5zd2VyKCl7XHJcbiAgICAgICAgX3NlbGVjdGVkID0gcGFyc2VJbnQodGhpcy5nZXRBdHRyaWJ1dGUoJ2RhdGEtY29kZScpKTtcclxuICAgICAgICBfbmV4dFF1ZXN0aW9uID0gcGFyc2VJbnQodGhpcy5nZXRBdHRyaWJ1dGUoJ2RhdGEtbmV4dCcpKTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBzZWFyY2goaXRlbSl7XHJcbiAgICAgICAgdmFyIHJlZ0V4cCA9IG5ldyBSZWdFeHAoX3NlYXJjaCxcImlcIik7XHJcbiAgICAgICAgcmV0dXJuIGl0ZW0udGV4dFtHbG9iYWxzLmdldExhbmcoKV0uc2VhcmNoKHJlZ0V4cCkgIT09IC0xO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHNlYXJjaENoYW5nZWQodmFsdWUpe1xyXG4gICAgICAgIF9zZWFyY2ggPSB2YWx1ZS50cmltKCk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gY2xlYXJGaWx0ZXIoKXtcclxuICAgICAgICBfc2VhcmNoID0gJyc7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gICAgLy8vICAgQ09NUE9ORU5UIExJRkVDWUNMRSBNRVRIT0RTICAgLy8vXHJcbiAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbiAgICBmdW5jdGlvbiBvbmluaXQoKXtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gdmlldygpe1xyXG4gICAgICAgIHJldHVybiBtKFwiZGl2XCIsIHtjbGFzczogXCJjb250YWluZXIgdGV4dC1saXN0LXNjcmVlbiBzdXJ2ZXktc2NyZWVuXCIsIHN0eWxlOiAnYmFja2dyb3VuZC1pbWFnZTogdXJsKFwiJytDb25maWcuc2VydmVyQWRkcmVzcysncGhvdG8vU1RfUVVFU1RJT04vJytxdWVzdGlvbi5waG90b1tHbG9iYWxzLmdldExhbmcoKV0rJ1wiKTsgYmFja2dyb3VuZC1yZXBlYXQ6IG5vbmU7IGJhY2tncm91bmQtc2l6ZTpjb3ZlcjsnfSwgW1xyXG4gICAgICAgICAgICBtKFwiZGl2XCIsIHtjbGFzczogXCJyb3cgc3VydmV5LXRvcC1wYW5lbFwifSwgW1xyXG4gICAgICAgICAgICAgICAgbShcImRpdlwiLCB7Y2xhc3M6IFwiY29sLXhzLTYgY29sLW1kLTNcIn0sIFxyXG4gICAgICAgICAgICAgICAgICAgIG0oXCJidXR0b25cIiwge2NsYXNzOiBcImJ0biBidG4tZGVmYXVsdCBzdXJ2ZXktcHJldi1idG5cIiwgb25jbGljazogZ29QcmV2fSwgXCLQndCw0LfQsNC0XCIpLFxyXG4gICAgICAgICAgICAgICAgKSxcclxuICAgICAgICAgICAgICAgIG0oXCJkaXZcIiwge2NsYXNzOiBcImNvbC14cy02IGNvbC1tZC0zIGNvbC1tZC1wdXNoLTZcIn0sIFxyXG4gICAgICAgICAgICAgICAgICAgIG0oXCJidXR0b25cIiwge2NsYXNzOiBcImJ0biBidG4tZGVmYXVsdCBzdXJ2ZXktbmV4dC1idG5cIiwgb25jbGljazogZ29OZXh0fSwgXCLQktC/0LXRgNC10LRcIiksXHJcbiAgICAgICAgICAgICAgICApLCAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgbShcImRpdlwiLCB7Y2xhc3M6IFwiY29sLXhzLTEyIGNvbC1tZC02IGNvbC1tZC1wdWxsLTMgc3VydmV5LXRvcC1wYW5lbF9fcXVlc3Rpb24tY29udGFpbmVyXCJ9LCBcclxuICAgICAgICAgICAgICAgICAgICBxdWVzdGlvbi50ZXh0W0dsb2JhbHMuZ2V0TGFuZygpXVxyXG4gICAgICAgICAgICAgICAgKVxyXG4gICAgICAgICAgICBdKSxcclxuICAgICAgICAgICAgbShcImRpdlwiLCB7Y2xhc3M6IFwidGV4dC1saXN0LXNjcmVlbl9fY29udGVudFwifSwgW1xyXG4gICAgICAgICAgICAgICAgLy8gbShcImRpdlwiLCB7Y2xhc3M6IFwicm93IHRleHQtbGlzdC1zY3JlZW5fX3NlYXJjaC1jb250YWluZXJcIn0sIFtcclxuICAgICAgICAgICAgICAgIC8vICAgICBtKFwiZGl2XCIsIHtjbGFzczogXCJjb2wteHMtMTJcIn0sIFtcclxuICAgICAgICAgICAgICAgIC8vICAgICAgICAgbShcImRpdlwiLCB7Y2xhc3M6IFwiaW5uZXItYWRkb24gcmlnaHQtYWRkb24gdGV4dC1saXN0LXNjcmVlbl9fc2VhcmNoLWlucHV0LWNvbnRhaW5lclwifSwgW1xyXG4gICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgbShcImlcIiwge2NsYXNzOiBcImdseXBoaWNvbiBnbHlwaGljb24tc2VhcmNoXCJ9KSxcclxuICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgIG0oXCJpbnB1dFwiLCB7Y2xhc3M6IFwiZm9ybS1jb250cm9sIHRleHQtbGlzdC1zY3JlZW5fX3NlYXJjaC1pbnB1dFwiLCBwbGFjZWhvbGRlcjogXCLQpNC40LvRjNGC0YBcIiwgdmFsdWU6IF9zZWFyY2gsIG9uaW5wdXQ6IG0ud2l0aEF0dHIoXCJ2YWx1ZVwiLCBzZWFyY2hDaGFuZ2VkKX0pLFxyXG4gICAgICAgICAgICAgICAgLy8gICAgICAgICBdKSxcclxuICAgICAgICAgICAgICAgIC8vICAgICAgICAgbShcImJ1dHRvblwiLCB7Y2xhc3M6IFwiYnRuIGJ0bi1kZWZhdWx0IHZpc2libGUteHMgdGV4dC1saXN0LXNjcmVlbl9fY2xlYXItZmlsdGVyIHRleHQtbGlzdC1zY3JlZW5fX2NsZWFyLWZpbHRlcl9zbWFsbFwiLCBvbmNsaWNrOiBjbGVhckZpbHRlcn0sIG0oXCJzcGFuXCIsIG0udHJ1c3QoJyZ0aW1lczsnKSkgKSxcclxuICAgICAgICAgICAgICAgIC8vICAgICAgICAgbShcImJ1dHRvblwiLCB7Y2xhc3M6IFwiYnRuIGJ0bi1kZWZhdWx0IGhpZGRlbi14cyB0ZXh0LWxpc3Qtc2NyZWVuX19jbGVhci1maWx0ZXJcIiwgb25jbGljazogY2xlYXJGaWx0ZXJ9LCAn0J7Rh9C40YHRgtC40YLRjCcpXHJcbiAgICAgICAgICAgICAgICAvLyAgICAgXSksXHJcbiAgICAgICAgICAgICAgICAvLyBdKSxcclxuICAgICAgICAgICAgICAgIG0oXCJkaXZcIiwge2NsYXNzOiBcInJvd1wifSwgW1xyXG4gICAgICAgICAgICAgICAgICAgIG0oXCJkaXZcIiwge2NsYXNzOiBcImNvbC14cy0xMlwifSwgW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBtKFwidWxcIiwge2NsYXNzOiBcImxpc3QtZ3JvdXBcIn0sIFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHF1ZXN0aW9uLmFuc3dlcnMuZmlsdGVyKHNlYXJjaCkubWFwKGZ1bmN0aW9uKGFuc3dlcil7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG0oXCJsaVwiLCB7Y2xhc3M6IFwibGlzdC1ncm91cC1pdGVtIFwiKyhfc2VsZWN0ZWQgPT09IGFuc3dlci5jb2RlID8gJ2FjdGl2ZScgOiAnJyksIFwiZGF0YS1jb2RlXCI6IGFuc3dlci5jb2RlLCBcImRhdGEtbmV4dFwiOiBhbnN3ZXIubmV4dFF1ZXN0aW9uLCBvbmNsaWNrOiBjaGFuZ2VBbnN3ZXJ9LCBhbnN3ZXIudGV4dFtHbG9iYWxzLmdldExhbmcoKV0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBdKVxyXG4gICAgICAgICAgICAgICAgICAgIF0pXHJcbiAgICAgICAgICAgICAgICBdKVxyXG4gICAgICAgICAgICBdKVxyXG4gICAgICAgIF0pXHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBvbmluaXQ6IG9uaW5pdCxcclxuICAgICAgICB2aWV3OiB2aWV3XHJcbiAgICB9XHJcbn0iLCIndXNlIHN0cmljdCc7XHJcbmxldCBtID0gcmVxdWlyZSgnbWl0aHJpbCcpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihjb25maWcpe1xyXG4gICAgbGV0IFJlc3VsdE1vZGVsID0gY29uZmlnLlJlc3VsdE1vZGVsO1xyXG4gICAgbGV0IHF1ZXN0aW9uID0gY29uZmlnLnF1ZXN0aW9uO1xyXG4gICAgbGV0IF9uZXh0UXVlc3Rpb24gPSBmYWxzZTtcclxuICAgIFxyXG4gICAgZnVuY3Rpb24gdmFsdWVDaGFuZ2VkKCl7XHJcbiAgICAgICAgX25leHRRdWVzdGlvbiA9IHBhcnNlSW50KHRoaXMudmFsdWUpO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGdvUHJldigpe1xyXG4gICAgICAgIGlmKHF1ZXN0aW9uLmlzRmlyc3Qpe1xyXG4gICAgICAgICAgICB3aW5kb3cuaGlzdG9yeS5iYWNrKCk7XHJcbiAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgIFJlc3VsdE1vZGVsLnJlbW92ZShxdWVzdGlvbi5jb2RlKTtcclxuICAgICAgICAgICAgY29uZmlnLnByZXYoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gZ29OZXh0KCl7XHJcbiAgICAgICAgaWYoX25leHRRdWVzdGlvbil7XHJcbiAgICAgICAgICAgIFJlc3VsdE1vZGVsLnNldChxdWVzdGlvbiwgcXVlc3Rpb24uYW5zd2Vyc1swXS5jb2RlLCBudWxsKTtcclxuICAgICAgICAgICAgY29uZmlnLm5leHQoX25leHRRdWVzdGlvbik7XHJcbiAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgIGFsZXJ0KFwi0JLRi9Cx0LXRgNC40YLQtSDQstCw0YDQuNCw0L3RgiDQvtGC0LLQtdGC0LAhXCIpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAgIC8vLyAgIENPTVBPTkVOVCBMSUZFQ1lDTEUgTUVUSE9EUyAgIC8vL1xyXG4gICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcblxyXG4gICAgZnVuY3Rpb24gdmlldygpe1xyXG4gICAgICAgIHJldHVybiBtKFwiZGl2XCIsIHtjbGFzczogXCJjb250YWluZXIgc3VydmV5LXNjcmVlblwiLCBzdHlsZTogJ21pbi1oZWlnaHQ6IDYwMHB4OyBiYWNrZ3JvdW5kLWltYWdlOiB1cmwoXCJodHRwOi8vODkuMTA2LjIzMi4zNDoxMDgwL3Bob3RvL1NUX1FVRVNUSU9OLycrcXVlc3Rpb24ucGhvdG9bR2xvYmFscy5nZXRMYW5nKCldKydcIik7IGJhY2tncm91bmQtcmVwZWF0OiBub25lOyBiYWNrZ3JvdW5kLXNpemU6Y292ZXI7J30sIFtcclxuICAgICAgICAgICAgbShcImRpdlwiLCB7Y2xhc3M6IFwicm93IHN1cnZleS10b3AtcGFuZWxcIn0sIFtcclxuICAgICAgICAgICAgICAgIG0oXCJkaXZcIiwge2NsYXNzOiBcImNvbC14cy02IGNvbC1tZC0zXCJ9LCBcclxuICAgICAgICAgICAgICAgICAgICBtKFwiYnV0dG9uXCIsIHtjbGFzczogXCJidG4gYnRuLWRlZmF1bHQgc3VydmV5LXByZXYtYnRuXCIsIG9uY2xpY2s6IGdvUHJldn0sIFwi0J3QsNC30LDQtFwiKSxcclxuICAgICAgICAgICAgICAgICksXHJcbiAgICAgICAgICAgICAgICBtKFwiZGl2XCIsIHtjbGFzczogXCJjb2wteHMtNiBjb2wtbWQtMyBjb2wtbWQtcHVzaC02XCJ9LCBcclxuICAgICAgICAgICAgICAgICAgICBtKFwiYnV0dG9uXCIsIHtjbGFzczogXCJidG4gYnRuLWRlZmF1bHQgc3VydmV5LW5leHQtYnRuXCIsIG9uY2xpY2s6IGdvTmV4dH0sIFwi0JLQv9C10YDQtdC0XCIpLFxyXG4gICAgICAgICAgICAgICAgKSwgICAgICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIG0oXCJkaXZcIiwge2NsYXNzOiBcImNvbC14cy0xMiBjb2wtbWQtNiBjb2wtbWQtcHVsbC0zIHN1cnZleS10b3AtcGFuZWxfX3F1ZXN0aW9uLWNvbnRhaW5lclwifSxbXHJcbiAgICAgICAgICAgICAgICAgICAgbShcImgzXCIsIHF1ZXN0aW9uLnRleHRbW0dsb2JhbHMuZ2V0TGFuZygpXV0pLFxyXG4gICAgICAgICAgICAgICAgICAgICcoVW5rbm93biBxdWVzdGlvbiB0eXBlIFwiJytxdWVzdGlvbi50eXBlTmFtZSsnXCIoJytxdWVzdGlvbi50eXBlQ29kZSsnKSApJyxcclxuICAgICAgICAgICAgICAgIF0pXHJcbiAgICAgICAgICAgIF0pLFxyXG4gICAgICAgICAgICBtKFwiZGl2XCIsIHtjbGFzczogXCJyb3dcIn0sIFtcclxuICAgICAgICAgICAgICAgIG0oXCJkaXZcIiwge2NsYXNzOiBcImJ0bi1ncm91cFwiLCBcImRhdGEtdG9nZ2xlXCI6IFwiYnV0dG9uc1wifSwgW1xyXG4gICAgICAgICAgICAgICAgICAgIHF1ZXN0aW9uLmFuc3dlcnMubWFwKGFuc3dlciA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBtKFwibGFiZWxcIiwge2NsYXNzOiBcImJ0biBcIiArIChfbmV4dFF1ZXN0aW9uID09PSBhbnN3ZXIubmV4dFF1ZXN0aW9uID8gJ2J0bi1wcmltYXJ5JyA6ICdidG4tZGVmYXVsdCcpIH0sIFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG0oXCJpbnB1dFwiLCB7dHlwZTogXCJyYWRpb1wiLCBuYW1lOiBcInF1ZXN0aW9uLWFuc3dlclwiLCB2YWx1ZTogYW5zd2VyLm5leHRRdWVzdGlvbiwgb25jaGFuZ2U6IHZhbHVlQ2hhbmdlZH0pLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYW5zd2VyLnRleHRbR2xvYmFscy5nZXRMYW5nKCldXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF0pXHJcbiAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIF0pXHJcbiAgICAgICAgICAgIF0pXHJcbiAgICAgICAgXSkgXHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB2aWV3OiB2aWV3XHJcbiAgICB9XHJcbn0iLCIndXNlIHN0cmljdCc7XHJcbmxldCBtID0gcmVxdWlyZSgnbWl0aHJpbCcpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihjb25maWcpe1xyXG4gICAgbGV0IFJlc3VsdE1vZGVsID0gY29uZmlnLlJlc3VsdE1vZGVsO1xyXG4gICAgbGV0IHF1ZXN0aW9uID0gY29uZmlnLnF1ZXN0aW9uO1xyXG4gICAgbGV0IF9zdGF0ZSA9ICdkZWZhdWx0JztcclxuICAgIGxldCBfdmlkZW9WaWV3ZWQgPSBmYWxzZTtcclxuICAgIGxldCBfbmV4dFF1ZXN0aW9uID0gZmFsc2U7XHJcbiAgICBsZXQgX2Vycm9ycyA9IFtdO1xyXG4gICAgbGV0IF92aWRlb1BsYXllcjtcclxuICAgIGxldCBfcGxheWVyV2lkdGggPSBmYWxzZTtcclxuICAgIGxldCBfcGxheWVySGVpZ2h0ID0gZmFsc2U7XHJcblxyXG4gICAgZnVuY3Rpb24gcmVtb3ZlT2xkUGxheWVyKCl7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgbGV0IG9sZFBsYXllciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzdXJ2ZXlWaWRlbycpO1xyXG4gICAgICAgICAgICB2aWRlb2pzKG9sZFBsYXllcikuZGlzcG9zZSgpO1xyXG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycm9yKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gZ29QcmV2KCl7XHJcbiAgICAgICAgcmVtb3ZlT2xkUGxheWVyKCk7XHJcbiAgICAgICAgaWYocXVlc3Rpb24uaXNGaXJzdCl7XHJcbiAgICAgICAgICAgIHdpbmRvdy5oaXN0b3J5LmJhY2soKTtcclxuICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgUmVzdWx0TW9kZWwucmVtb3ZlKHF1ZXN0aW9uLmNvZGUpO1xyXG4gICAgICAgICAgICBjb25maWcucHJldigpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBnb05leHQoKXtcclxuICAgICAgICBpZihfdmlkZW9WaWV3ZWQpe1xyXG4gICAgICAgICAgICByZW1vdmVPbGRQbGF5ZXIoKTtcclxuICAgICAgICAgICAgUmVzdWx0TW9kZWwuc2V0KHF1ZXN0aW9uLCBxdWVzdGlvbi5hbnN3ZXJzWzBdLmNvZGUsIG51bGwpO1xyXG4gICAgICAgICAgICBjb25maWcubmV4dChfbmV4dFF1ZXN0aW9uKTtcclxuICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgYWxlcnQoJ9Cf0L7QttCw0LvRg9C50YHRgtCwLCDQtNC+0YHQvNC+0YLRgNC40YLQtSDQstC40LTQtdC+INC00L4g0LrQvtC90YbQsC4nKVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBpbml0UGxheWVyKHZub2RlKXtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBfdmlkZW9QbGF5ZXIgPSB2aWRlb2pzKCdzdXJ2ZXlWaWRlbycsIHtcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xCYXI6IHtcclxuICAgICAgICAgICAgICAgICAgICBwcm9ncmVzc0NvbnRyb2w6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIC8vIGF1dG9wbGF5OiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgd2lkdGg6IF9wbGF5ZXJXaWR0aCxcclxuICAgICAgICAgICAgICAgIGhlaWdodDogX3BsYXllckhlaWdodCxcclxuICAgICAgICAgICAgICAgIHZvbHVtZTogMC4yXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBfdmlkZW9QbGF5ZXIudm9sdW1lKDAuMik7XHJcbiAgICAgICAgICAgIF92aWRlb1BsYXllci5yZWFkeShmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wbGF5KCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgX3ZpZGVvUGxheWVyLm9uKFwiZW5kZWRcIiwgZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRvY3VtZW50LmV4aXRGdWxsc2NyZWVuKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5leGl0RnVsbHNjcmVlbigpO1xyXG4gICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKGRvY3VtZW50LndlYmtpdEV4aXRGdWxsc2NyZWVuKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC53ZWJraXRFeGl0RnVsbHNjcmVlbigpO1xyXG4gICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKGRvY3VtZW50Lm1vekNhbmNlbEZ1bGxTY3JlZW4pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRvY3VtZW50Lm1vekNhbmNlbEZ1bGxTY3JlZW4oKTtcclxuICAgICAgICAgICAgICAgICAgICBlbHNlIGlmIChkb2N1bWVudC5tc0V4aXRGdWxsc2NyZWVuKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5tc0V4aXRGdWxsc2NyZWVuKCk7ICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlcnJvcik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBfdmlkZW9WaWV3ZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIF92aWRlb1BsYXllci5vbihcInBsYXlcIiwgZnVuY3Rpb24oKXsgXHJcblxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgICAgICBfdmlkZW9WaWV3ZWQgPSB0cnVlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcblxyXG4gICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgICAvLy8gICBDT01QT05FTlQgTElGRUNZQ0xFIE1FVEhPRFMgICAvLy9cclxuICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxuICAgIGZ1bmN0aW9uIG9uaW5pdCgpe1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIF9uZXh0UXVlc3Rpb24gPSBxdWVzdGlvbi5hbnN3ZXJzWzBdLm5leHRRdWVzdGlvbjtcclxuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgICAgICBfZXJyb3JzLnB1c2goJ9Ce0YLRgdGD0YLRgdGC0LLRg9GO0YIg0LLQsNGA0LjQsNC90YLRiyDQvtGC0LLQtdGC0L7QsiEnKTtcclxuICAgICAgICAgICAgX3N0YXRlID0gJ2Vycm9yJztcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gb25jcmVhdGUodm5vZGUpe1xyXG4gICAgICAgIF9wbGF5ZXJXaWR0aCA9ICQoJy52aWRvZS1zY3JlZW5fX3ZpZGVvLWNvbnRhaW5lcicpLndpZHRoKCk7XHJcbiAgICAgICAgX3BsYXllckhlaWdodCA9IF9wbGF5ZXJXaWR0aCAqIDAuNDtcclxuXHJcbiAgICAgICAgJCggd2luZG93ICkucmVzaXplKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBfcGxheWVyV2lkdGggPSAkKCcudmlkb2Utc2NyZWVuX192aWRlby1jb250YWluZXInKS53aWR0aCgpO1xyXG4gICAgICAgICAgICBfcGxheWVySGVpZ2h0ID0gX3BsYXllcldpZHRoICogMC40O1xyXG4gICAgICAgICAgICBfdmlkZW9QbGF5ZXIud2lkdGgoX3BsYXllcldpZHRoKTtcclxuICAgICAgICAgICAgX3ZpZGVvUGxheWVyLmhlaWdodChfcGxheWVySGVpZ2h0KTtcclxuICAgICAgICB9KTtcclxuICAgICAgICBtLnJlZHJhdygpO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHZpZXcoKXtcclxuICAgICAgICBzd2l0Y2goX3N0YXRlKXtcclxuICAgICAgICAgICAgY2FzZSAnZGVmYXVsdCc6XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbShcImRpdlwiLCB7Y2xhc3M6IFwiY29udGFpbmVyIHZpZGVvLXNjcmVlbiBzdXJ2ZXktc2NyZWVuXCJ9LCBbXHJcbiAgICAgICAgICAgICAgICAgICAgbShcImRpdlwiLCB7Y2xhc3M6IFwicm93IHN1cnZleS10b3AtcGFuZWxcIn0sIFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbShcImRpdlwiLCB7Y2xhc3M6IFwiY29sLXhzLTYgY29sLW1kLTNcIn0sIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbShcImJ1dHRvblwiLCB7Y2xhc3M6IFwiYnRuIGJ0bi1kZWZhdWx0IHN1cnZleS1wcmV2LWJ0blwiLCBvbmNsaWNrOiBnb1ByZXZ9LCBcItCd0LDQt9Cw0LRcIiksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG0oXCJkaXZcIiwge2NsYXNzOiBcImNvbC14cy02IGNvbC1tZC0zIGNvbC1tZC1wdXNoLTZcIn0sIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbShcImJ1dHRvblwiLCB7Y2xhc3M6IFwiYnRuIGJ0bi1kZWZhdWx0IHN1cnZleS1uZXh0LWJ0blwiLCBvbmNsaWNrOiBnb05leHR9LCBcItCS0L/QtdGA0LXQtFwiKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgKSwgICAgICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICAgICAgbShcImRpdlwiLCB7Y2xhc3M6IFwiY29sLXhzLTEyIGNvbC1tZC02IGNvbC1tZC1wdWxsLTMgc3VydmV5LXRvcC1wYW5lbF9fcXVlc3Rpb24tY29udGFpbmVyXCJ9LCBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHF1ZXN0aW9uLnRleHRbR2xvYmFscy5nZXRMYW5nKCldXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIClcclxuICAgICAgICAgICAgICAgICAgICBdKSxcclxuICAgICAgICAgICAgICAgICAgICBtKFwiZGl2XCIsIHtjbGFzczogXCJyb3cgdmlkb2Utc2NyZWVuX19jb250ZW50XCJ9LCBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG0oXCJkaXZcIiwge2NsYXNzOiBcImNvbC14cy0xMlwifSwgW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbShcImRpdlwiLCB7Y2xhc3M6IFwidmlkb2Utc2NyZWVuX192aWRlby1jb250YWluZXJcIiwgb25jcmVhdGU6IGluaXRQbGF5ZXJ9LCBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbShcInZpZGVvXCIsIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWQ6IFwic3VydmV5VmlkZW9cIiwgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzOiBcInZpZGVvLWpzIHZqcy1kZWZhdWx0LXNraW4gdmpzLWJpZy1wbGF5LWNlbnRlcmVkXCIsIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aWR0aDogKF9wbGF5ZXJXaWR0aCA/IF9wbGF5ZXJXaWR0aCA6ICdhdXRvJyksIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBoZWlnaHQ6IChfcGxheWVySGVpZ2h0ID8gX3BsYXllckhlaWdodCA6ICdhdXRvJyksIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sczogdHJ1ZSwgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByZWxvYWQ6IFwiYXV0b1wiLCBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXV0b3BsYXk6IHRydWUsIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb3N0ZXI6IFwiXCIsIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImRhdGEtc2V0dXBcIjogJ3t9JyBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG0oXCJzb3VyY2VcIiwge3NyYzogQ29uZmlnLnNlcnZlckFkZHJlc3MrXCJwaG90by9TVF9RVUVTVElPTi9cIitxdWVzdGlvbi5waG90b1tHbG9iYWxzLmdldExhbmcoKV0sIHR5cGU6IFwidmlkZW8vbXA0XCJ9KSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbShcInBcIiwge2NsYXNzOiBcInZqcy1uby1qc1wifSwgW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ1RvIHZpZXcgdGhpcyB2aWRlbyBwbGVhc2UgZW5hYmxlIEphdmFTY3JpcHQsIGFuZCBjb25zaWRlciB1cGdyYWRpbmcgdG8gYSB3ZWIgYnJvd3NlciB0aGF0JyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG0oXCJhXCIsIHtocmVmOiBcImh0dHA6Ly92aWRlb2pzLmNvbS9odG1sNS12aWRlby1zdXBwb3J0L1wiLCB0YXJnZXQ6IFwiX2JsYW5rXCJ9LCAnc3VwcG9ydHMgSFRNTDUgdmlkZW8nKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBdKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBdKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBdKVxyXG4gICAgICAgICAgICAgICAgICAgIF0pXHJcbiAgICAgICAgICAgICAgICBdKTtcclxuICAgICAgICAgICAgY2FzZSAnZXJyb3InOlxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG0oXCJkaXZcIiwge2NsYXNzOiBcInNjcmVlbi1waG90b1wifSwgW1xyXG4gICAgICAgICAgICAgICAgICAgIF9lcnJvcnMubWFwKGZ1bmN0aW9uKGVycm9yKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG0oXCJwXCIsIHtjbGFzczogXCJlcnJvclwifSwgZXJyb3IpXHJcbiAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIF0pXHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIG9uaW5pdDogb25pbml0LFxyXG4gICAgICAgIG9uY3JlYXRlOiBvbmNyZWF0ZSxcclxuICAgICAgICB2aWV3OiB2aWV3XHJcbiAgICB9XHJcbn0iLCIndXNlIHN0cmljdCc7XHJcbmxldCBtID0gcmVxdWlyZSgnbWl0aHJpbCcpO1xyXG5sZXQgUiA9IHJlcXVpcmUoJy4uLy4uL2NvbXBvbmVudHMvcmVxdWVzdC5qcycpO1xyXG5sZXQgTWVudU1vZHVsZSA9IHJlcXVpcmUoJy4uLy4uL21vZHVsZXMvbWVudS9tZW51LmpzJyk7XHJcbmxldCBNb2RhbCA9IHJlcXVpcmUoJy4uLy4uL2NvbXBvbmVudHMvbW9kYWwtd2luZG93L21vZGFsLXdpbmRvdy5qcycpO1xyXG5sZXQgTG9hZGluZ01vZGFsID0gcmVxdWlyZSgnLi4vLi4vY29tcG9uZW50cy9tb2RhbC13aW5kb3cvbG9hZGluZy1tb2RhbC13aW5kb3cuanMnKTtcclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICBsZXQgX3N0YXRlID0gJ2xvYWRpbmcnO1xyXG4gICAgbGV0IF9lcnJvcnMgPSBbXTtcclxuICAgIGxldCBNZW51O1xyXG4gICAgbGV0IF9tb2RhbCA9IGZhbHNlO1xyXG4gICAgbGV0IF9oaXN0b3J5ID0gW107XHJcblxyXG4gICAgbGV0IE1vZGVsID0ge1xyXG4gICAgICAgIHBhc3N3b3JkOiAnJyxcclxuICAgICAgICBwYXNzd29yZENvbmZpcm06ICcnLFxyXG4gICAgICAgIHNldFBhc3N3b3JkOiBmdW5jdGlvbiAodmFsdWUpIHtcclxuICAgICAgICAgICAgTW9kZWwucGFzc3dvcmQgPSB2YWx1ZTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIHNldENvbmZpcm1QYXNzd29yZDogZnVuY3Rpb24gKHZhbHVlKSB7XHJcbiAgICAgICAgICAgIE1vZGVsLnBhc3N3b3JkQ29uZmlybSA9IHZhbHVlO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgc2F2ZTogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBsZXQgZXJyb3JzID0gW107XHJcbiAgICAgICAgICAgIGlmIChNb2RlbC5wYXNzd29yZCAhPT0gTW9kZWwucGFzc3dvcmRDb25maXJtKSB7XHJcbiAgICAgICAgICAgICAgICBlcnJvcnMucHVzaCgn0J/QsNGA0L7Qu9C4INC90LUg0YHQvtCy0L/QsNC00LDRjtGCIScpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoTW9kZWwucGFzc3dvcmQubGVuZ3RoIDwgNCkge1xyXG4gICAgICAgICAgICAgICAgZXJyb3JzLnB1c2goJ9Cf0LDRgNC+0LvRjCDQvdC1INC80L7QttC10YIg0LHRi9GC0Ywg0LrQvtGA0L7Rh9C1IDQg0YHQuNC80LLQvtC70L7QsiEnKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKGVycm9ycy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICBfbW9kYWwgPSBuZXcgTW9kYWwoe1xyXG4gICAgICAgICAgICAgICAgICAgIGlkOiAnYWxlcnRNb2RhbCcsXHJcbiAgICAgICAgICAgICAgICAgICAgc3RhdGU6ICdzaG93JyxcclxuICAgICAgICAgICAgICAgICAgICBoZWFkZXI6ICfQmNC30LzQtdC90LXQvdC40LUg0L/QsNGA0L7Qu9GPJyxcclxuICAgICAgICAgICAgICAgICAgICBjb250ZW50OiBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG0oXCJkaXZcIiwgeyBzdHlsZTogXCJ0ZXh0LWFsaWduOiBsZWZ0O1wiIH0sIFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG0oXCJwXCIsIHsgY2xhc3M6IFwiXCIgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtKFwic3Ryb25nXCIsICfQktC+0LfQvdC40LrQu9C4INC+0YjQuNCx0LrQuCDQv9GA0Lgg0LjQt9C80LXQvdC40LjQuCDQv9Cw0YDQvtC70Y8hJylcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlcnJvcnMubWFwKGVycm9yID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gbShcInBcIiwgeyBjbGFzczogXCJcIiB9LCBlcnJvcilcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF0pXHJcbiAgICAgICAgICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgICAgICAgICBpc1N0YXRpYzogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAgICAgaXNGb290ZXI6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgaXNGdWxsU2NyZWVuOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgICAgICBtb2RhbFNpemVQYXJhbXM6IHsgd2lkdGg6ICc5MCUnLCBoZWlnaHQ6IGZhbHNlLCBwYWRkaW5nOiAnMTUlIDAgMCAwJyB9LFxyXG4gICAgICAgICAgICAgICAgICAgIHpJbmRleDogMTAwNSxcclxuICAgICAgICAgICAgICAgICAgICBjYW5jZWxCdG46ICdub25lJyxcclxuICAgICAgICAgICAgICAgICAgICBjb25maXJtQnRuOiAn0J7QuicsXHJcbiAgICAgICAgICAgICAgICAgICAgb25Db25maXJtOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF9tb2RhbCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgb25DYW5jZWw6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgX21vZGFsID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIFIudXBkYXRlKCdTVF9VU0VSJywgXCJVU0VfUEFTU1dPUkQgPSAnXCIgKyBNb2RlbC5wYXNzd29yZCArIFwiJ1wiLCBcIlVTRV9DT0RFID0gXCIgKyBHbG9iYWxzLnVzZXIoJ1VTRV9DT0RFJykpXHJcbiAgICAgICAgICAgICAgICAgICAgLnRoZW4oKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBfbW9kYWwgPSBuZXcgTW9kYWwoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWQ6ICdhbGVydE1vZGFsJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YXRlOiAnc2hvdycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBoZWFkZXI6ICfQmNC30LzQtdC90LXQvdC40LUg0L/QsNGA0L7Qu9GPJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRlbnQ6IFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtKFwiZGl2XCIsIHsgc3R5bGU6IFwidGV4dC1hbGlnbjogbGVmdDtcIiB9LCBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICfQn9Cw0YDQvtC70Ywg0YPRgdC/0LXRiNC90L4g0LjQt9C80LXQvdC10L0hJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaXNTdGF0aWM6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaXNGb290ZXI6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpc0Z1bGxTY3JlZW46IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbW9kYWxTaXplUGFyYW1zOiB7IHdpZHRoOiAnOTAlJywgaGVpZ2h0OiBmYWxzZSwgcGFkZGluZzogJzE1JSAwIDAgMCcgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHpJbmRleDogMTAwNSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhbmNlbEJ0bjogJ25vbmUnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uZmlybUJ0bjogJ9Ce0LonLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb25Db25maXJtOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgX21vZGFsID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DYW5jZWw6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBfbW9kYWwgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgbS5yZWRyYXcoKTtcclxuICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgICAgIC5jYXRjaChlcnJvciA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihlcnJvci5tZXNzYWdlKTtcclxuICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHJlZnJlc2hVc2VyU2NvcmUoKXtcclxuICAgICAgICByZXR1cm4gUi5leGVjUXVlcnkoJ0VYRUMgQURKUkVDX1NDT1JFX0NBTENVTEFURScpO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGdldFVzZXJEYXRhKCl7XHJcbiAgICAgICAgcmV0dXJuIFIuZ2V0KCcqJywgJ1ZJRVdfQVVUSEVOVElDQVRJT04nLCBcIldIRVJFIFVTRV9DT0RFID0gXCIgKyBHbG9iYWxzLnVzZXIoXCJVU0VfQ09ERVwiKSlcclxuICAgICAgICAgICAgLnRoZW4oZGF0YSA9PiB7XHJcbiAgICAgICAgICAgICAgICBHbG9iYWxzLnNldFVzZXIoZGF0YSk7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gbG9hZE9wZXJhdGlvbkhpc3RvcnkoKXtcclxuICAgICAgICByZXR1cm4gUi5nZXQoJyonLCAnVklFV19TVF9VU0VSX09QRVJBVElPTicsIFwiV0hFUkUgVklTX1VTRV9DT0RFID0gXCIgKyBHbG9iYWxzLnVzZXIoJ1VTRV9DT0RFJyksIFwiVklTX1NUQVJUX0RBVEUgREVTQ1wiKVxyXG4gICAgICAgICAgICAudGhlbihkYXRhID0+IHtcclxuICAgICAgICAgICAgICAgIGRhdGEubWFwKG9wZXJhdGlvbiA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgX2hpc3RvcnkucHVzaCh7bmFtZTogb3BlcmF0aW9uWydTVVJfTkFNRSddLCBkYXRlOiBvcGVyYXRpb25bJ1ZJU19TVEFSVF9EQVRFJ119KTtcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICB9XHJcblxyXG4gICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgICAvLy8gICBDT01QT05FTlQgTElGRUNZQ0xFIE1FVEhPRFMgICAvLy9cclxuICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxuICAgIGZ1bmN0aW9uIG9uaW5pdCgpIHtcclxuICAgICAgICBNZW51ID0gbmV3IE1lbnVNb2R1bGUoKTtcclxuICAgICAgICByZWZyZXNoVXNlclNjb3JlKClcclxuICAgICAgICAgICAgLnRoZW4oZ2V0VXNlckRhdGEpXHJcbiAgICAgICAgICAgIC50aGVuKGxvYWRPcGVyYXRpb25IaXN0b3J5KVxyXG4gICAgICAgICAgICAudGhlbihkYXRhID0+IHtcclxuICAgICAgICAgICAgICAgIF9zdGF0ZSA9ICdsb2FkZWQnO1xyXG4gICAgICAgICAgICAgICAgbS5yZWRyYXcoKTtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLmNhdGNoKGVycm9yID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycm9yKTtcclxuICAgICAgICAgICAgICAgIF9lcnJvcnMucHVzaChlcnJvci5tZXNzYWdlKTtcclxuICAgICAgICAgICAgICAgIF9zdGF0ZSA9ICdlcnJvcic7XHJcbiAgICAgICAgICAgICAgICBtLnJlZHJhdygpO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHZpZXcoKSB7XHJcbiAgICAgICAgc3dpdGNoIChfc3RhdGUpIHtcclxuICAgICAgICAgICAgY2FzZSAnbG9hZGluZyc6XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbShcImRpdlwiLCB7IGNsYXNzOiBcImNvbnRhaW5lciBwLWhvbWVcIiB9LCBbXHJcbiAgICAgICAgICAgICAgICAgICAgbShuZXcgTG9hZGluZ01vZGFsKHt9KSlcclxuICAgICAgICAgICAgICAgIF0pXHJcbiAgICAgICAgICAgIGNhc2UgJ2xvYWRlZCc6XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbShcImRpdlwiLCB7IGNsYXNzOiBcImNvbnRhaW5lciBwLWhvbWVcIiB9LCBbXHJcbiAgICAgICAgICAgICAgICAgICAgbShNZW51KSxcclxuICAgICAgICAgICAgICAgICAgICBtKFwiZGl2XCIsIHsgY2xhc3M6IFwicm93XCIgfSwgW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBtKFwiZGl2XCIsIHsgY2xhc3M6IFwiY29sLXNtLTEyXCIgfSwgW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbShcImRpdlwiLCB7IGNsYXNzOiBcInAtaG9tZV9faGVhZGVyLWNvbnRhaW5lclwiIH0sIFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtKFwic3BhblwiLCB7IGNsYXNzOiBcImdseXBoaWNvbiBnbHlwaGljb24tdXNlclwiLCBcImFyaWEtaGlkZGVuXCI6IFwidHJ1ZVwiIH0pLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG0oXCJoM1wiLCB7IGNsYXNzOiBcInAtaG9tZV9faGVhZGVyXCIgfSwgJ9Cb0LjRh9C90YvQuSDQutCw0LHQuNC90LXRgicpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBdKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG0oXCJkaXZcIiwgeyBjbGFzczogXCJwLWhvbWVfX3VzZXItcG9pbnRzLWNvbnRhaW5lciBjb21wb25lbnQtY29udGFpbmVyXCIgfSwgW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG0oXCJoM1wiLCB7IGNsYXNzOiBcInAtaG9tZV9fY29udGFpbmVyLWhlYWRlclwiIH0sICfQmtC+0YjQtdC70LXQuicpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG0oXCJwXCIsIHsgY2xhc3M6IFwiXCIgfSwgJ9CS0LDRiNC4INCx0LDQu9C70Ys6ICcgKyBHbG9iYWxzLnVzZXIoJ1VTRV9TQ09SRScpKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtKFwiYnV0dG9uXCIsIHsgY2xhc3M6IFwiYnRuIGJ0bi1saW5rIHAtaG9tZV9faGlzdG9yeS1idG5cIiwgXCJkYXRhLXRvZ2dsZVwiOiBcImNvbGxhcHNlXCIsIFwiZGF0YS10YXJnZXRcIjogXCIjaGlzdG9yeUNvbGxhcHNlXCIsIFwiYXJpYS1leHBhbmRlZFwiOiBcImZhbHNlXCIsIFwiYXJpYS1jb250cm9sc1wiOiBcImhpc3RvcnlDb2xsYXBzZVwiIH0sICfQmNGB0YLQvtGA0LjRjyDQvtC/0LXRgNCw0YbQuNC5JyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbShcImRpdlwiLCB7IGNsYXNzOiBcImNvbGxhcHNlXCIsIGlkOiBcImhpc3RvcnlDb2xsYXBzZVwiIH0sIFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbShcInVsXCIsIHsgY2xhc3M6IFwibGlzdC1ncm91cCBwLWhvbWVfX29wZXJhdGlvbi1pdGVtXCIgfSwgW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgX2hpc3RvcnkubWFwKG9wZXJhdGlvbiA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG0oXCJsaVwiLCB7Y2xhc3M6IFwibGlzdC1ncm91cC1pdGVtIHAtaG9tZV9fb3BlcmF0aW9uLWl0ZW1cIn0sIFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbShcInN0cm9uZ1wiLCBvcGVyYXRpb24ubmFtZSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG0oXCJzcGFuXCIsIHtjbGFzczogXCJwLWhvbWVfX29wZXJhdGlvbi1pdGVtLWRhdGVcIn0sIG9wZXJhdGlvbi5kYXRlKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBdKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBdKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG0oXCJkaXZcIiwgeyBjbGFzczogXCJwLWhvbWVfX3VzZXItc2V0dGluZ3MtY29udGFpbmVyIGNvbXBvbmVudC1jb250YWluZXIgY2xlYXJmaXhcIiB9LCBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbShcImgzXCIsIHsgY2xhc3M6IFwicC1ob21lX19jb250YWluZXItaGVhZGVyXCIgfSwgJ9Cd0LDRgdGC0YDQvtC50LrQuCcpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG0oXCJkaXZcIiwgeyBjbGFzczogXCJmb3JtLWdyb3VwXCIgfSwgW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtKFwibGFiZWxcIiwgeyBmb3I6IFwicGFzc3dvcmRcIiB9LCBcItCd0L7QstGL0Lkg0L/QsNGA0L7Qu9GMXCIpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtKFwiaW5wdXRcIiwgeyB0eXBlOiBcInBhc3N3b3JkXCIsIGNsYXNzOiBcImZvcm0tY29udHJvbFwiLCBpZDogXCJwYXNzd29yZFwiLCBvbmNoYW5nZTogbS53aXRoQXR0cigndmFsdWUnLCBNb2RlbC5zZXRQYXNzd29yZCkgfSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBdKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtKFwiZGl2XCIsIHsgY2xhc3M6IFwiZm9ybS1ncm91cFwiIH0sIFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbShcImxhYmVsXCIsIHsgZm9yOiBcInBhc3N3b3JkXCIgfSwgXCLQn9C+0LTRgtCy0LXRgNC20LTQtdC90LjQtSDQv9Cw0YDQvtC70Y9cIiksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG0oXCJpbnB1dFwiLCB7IHR5cGU6IFwicGFzc3dvcmRcIiwgY2xhc3M6IFwiZm9ybS1jb250cm9sXCIsIGlkOiBcInBhc3N3b3JkXCIsIG9uY2hhbmdlOiBtLndpdGhBdHRyKCd2YWx1ZScsIE1vZGVsLnNldENvbmZpcm1QYXNzd29yZCkgfSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBdKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtKFwiYnV0dG9uXCIsIHsgY2xhc3M6IFwiYnRuIGJ0bi1wcmltYXJ5IHAtaG9tZV9fY2hhbmdlLXBhc3N3b3JkLWJ0blwiLCBvbmNsaWNrOiBNb2RlbC5zYXZlIH0sICfQmNC30LzQtdC90LjRgtGMINC/0LDRgNC+0LvRjCcpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBdKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBdKVxyXG4gICAgICAgICAgICAgICAgICAgIF0pLFxyXG4gICAgICAgICAgICAgICAgICAgIF9tb2RhbCA/IG0oX21vZGFsKSA6ICcnXHJcbiAgICAgICAgICAgICAgICBdKVxyXG4gICAgICAgICAgICBjYXNlICdlcnJvcic6XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbShcImRpdlwiLCB7IGNsYXNzOiBcImNvbnRhaW5lciBwLWhvbWVcIiB9LCBbXHJcbiAgICAgICAgICAgICAgICAgICAgX2Vycm9ycy5tYXAoZXJyb3IgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gbShcInBcIiwgZXJyb3IpXHJcbiAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIF0pXHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIG9uaW5pdDogb25pbml0LFxyXG4gICAgICAgIHZpZXc6IHZpZXdcclxuICAgIH1cclxufVxyXG4iLCIndXNlIHN0cmljdCc7XHJcbmxldCBtID0gcmVxdWlyZSgnbWl0aHJpbCcpO1xyXG5sZXQgUiA9IHJlcXVpcmUoJy4uLy4uL2NvbXBvbmVudHMvcmVxdWVzdC5qcycpO1xyXG5sZXQgU3VydmV5TGFuZGluZ01vZHVsZSA9IHJlcXVpcmUoJy4uLy4uL21vZHVsZXMvc3VydmV5LWxhbmRpbmcvc3VydmV5LWxhbmRpbmcuanMnKTtcclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoKXtcclxuICAgIGxldCBzdXJ2ZXlNb2R1bGUgPSBmYWxzZTtcclxuICAgIFxyXG4gICAgZnVuY3Rpb24gb25pbml0KCkge1xyXG4gICAgICAgIGxldCBzdXJDb2RlID0gbS5yb3V0ZS5wYXJhbSgnY29kZScpO1xyXG4gICAgICAgIHN1cnZleU1vZHVsZSA9IG5ldyBTdXJ2ZXlMYW5kaW5nTW9kdWxlKHtcclxuICAgICAgICAgICAgc3VydmV5OiBzdXJDb2RlLFxyXG4gICAgICAgICAgICBhZnRlclNhdmU6IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICAgICBtLnJvdXRlLnNldCgnL2xpc3QnKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiB2aWV3ICgpIHtcclxuICAgICAgICByZXR1cm4gbShcImRpdlwiLCB7Y2xhc3M6IFwicC1zdXJ2ZXlcIn0sIFtcclxuICAgICAgICAgICAgc3VydmV5TW9kdWxlID8gbShzdXJ2ZXlNb2R1bGUpIDogJydcclxuICAgICAgICBdKVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgb25pbml0OiBvbmluaXQsXHJcbiAgICAgICAgdmlldzogdmlld1xyXG4gICAgfVxyXG59XHJcbiIsIid1c2Ugc3RyaWN0JztcclxubGV0IG0gPSByZXF1aXJlKCdtaXRocmlsJyk7XHJcbmxldCBSID0gcmVxdWlyZSgnLi4vLi4vY29tcG9uZW50cy9yZXF1ZXN0LmpzJyk7XHJcbmxldCBNb2RhbCA9IHJlcXVpcmUoJy4uLy4uL2NvbXBvbmVudHMvbW9kYWwtd2luZG93L21vZGFsLXdpbmRvdy5qcycpO1xyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICgpIHtcclxuICAgIGxldCByZXN0b3JlTW9kYWwgPSBmYWxzZTtcclxuICAgIGxldCBBbGVydCA9IGZhbHNlO1xyXG4gICAgbGV0IF9hdXRoRXJyb3IgPSBmYWxzZTtcclxuICAgIGxldCBVc2VyTW9kZWwgPSB7XHJcbiAgICAgICAgcGhvbmU6ICc3Nzc3Nzc3Nzc3JyxcclxuICAgICAgICBwYXNzd29yZDogJzExMScsXHJcbiAgICAgICAgY2hhbmdlUGhvbmU6IGZ1bmN0aW9uICh2YWx1ZSkge1xyXG4gICAgICAgICAgICBfYXV0aEVycm9yID0gZmFsc2U7XHJcbiAgICAgICAgICAgIFVzZXJNb2RlbC5waG9uZSA9IHZhbHVlLnJlcGxhY2UoL1teMC05Ll0vZywgXCJcIik7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBjaGFuZ2VQYXNzd29yZDogZnVuY3Rpb24gKHZhbHVlKSB7XHJcbiAgICAgICAgICAgIF9hdXRoRXJyb3IgPSBmYWxzZTtcclxuICAgICAgICAgICAgVXNlck1vZGVsLnBhc3N3b3JkID0gdmFsdWU7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgbGV0IF9pc0xvZ2dpbmcgPSBmYWxzZTtcclxuXHJcbiAgICBmdW5jdGlvbiBjcmVhdGVQaG9uZU1hc2soZWwpIHtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAkKGVsLmRvbSkubWFzayhcIig5OTkpLTk5OS05OS05OVwiLCB7XHJcbiAgICAgICAgICAgICAgICBjb21wbGV0ZWQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICBVc2VyTW9kZWwuY2hhbmdlUGhvbmUodGhpcy52YWwoKS5yZXBsYWNlKC9bXjAtOS5dL2csIFwiXCIpKVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhlcnJvcilcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gZ2V0Q29vcmRpbmF0ZXNTdWNjZXNzKHBvc2l0aW9uKXtcclxuICAgICAgICBHbG9iYWxzLnNldENvb3JkaW5hdGVzKHBvc2l0aW9uLmNvb3Jkcy5sYXRpdHVkZSwgcG9zaXRpb24uY29vcmRzLmxvbmdpdHVkZSk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gZ2V0Q29vcmRpbmF0ZXNFcnJvcihlcnJvcikge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCdVbmFibGUgZ2V0IGNvb3JkaW5hdGVzIGZyb20gdGhpcyBkZXZpY2UnKTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBhdXRoKCkge1xyXG4gICAgICAgIF9pc0xvZ2dpbmcgPSB0cnVlO1xyXG4gICAgICAgIFIubG9naW4oVXNlck1vZGVsLnBob25lLCBVc2VyTW9kZWwucGFzc3dvcmQpXHJcbiAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICBHbG9iYWxzLnNldFRva2VuKGRhdGEudG9rZW4pO1xyXG4gICAgICAgICAgICAgICAgUi5nZXQoJyonLCAnVklFV19BVVRIRU5USUNBVElPTicsIFwiV0hFUkUgVVNFX0xPR0lOID0gJ1wiK1VzZXJNb2RlbC5waG9uZStcIicgQU5EIFVTRV9QQVNTV09SRCA9ICdcIitVc2VyTW9kZWwucGFzc3dvcmQrXCInXCIpXHJcbiAgICAgICAgICAgICAgICAgICAgLnRoZW4oZGF0YSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIEdsb2JhbHMuc2V0VXNlcihkYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgR2xvYmFscy5zZXRBdXRoKHRydWUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBtLnJvdXRlLnNldCgnL2xpc3QnKTtcclxuICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgICAgIC5jYXRjaChmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKCdVbmFibGUgZ2V0IHVzZXIgZGF0YSEnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgX2lzTG9nZ2luZyA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBfYXV0aEVycm9yID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbS5yZWRyYXcoKTtcclxuICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgLy8gdHJ5IHtcclxuICAgICAgICAgICAgICAgIC8vICAgICBuYXZpZ2F0b3IuZ2VvbG9jYXRpb24uZ2V0Q3VycmVudFBvc2l0aW9uKGdldENvb3JkaW5hdGVzU3VjY2VzcywgZ2V0Q29vcmRpbmF0ZXNFcnJvcik7XHJcbiAgICAgICAgICAgICAgICAvLyB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgICAgICAgICAgLy8gICAgIGNvbnNvbGUubG9nKCdVbmFibGUgZ2V0IGNvb3JkaW5hdGVzIGZyb20gdGhpcyBkZXZpY2UnKTtcclxuICAgICAgICAgICAgICAgIC8vIH1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLmNhdGNoKGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKCdBdXRoIGVycm9yIScpO1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihlKTtcclxuICAgICAgICAgICAgICAgIF9pc0xvZ2dpbmcgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIF9hdXRoRXJyb3IgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgbS5yZWRyYXcoKTtcclxuICAgICAgICAgICAgfSlcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBwYXNzd29yZFNlbmQoKXtcclxuICAgICAgICByZXN0b3JlTW9kYWwgPSBuZXcgTW9kYWwoe1xyXG4gICAgICAgICAgICBpZDogJ3Jlc3RvcmVNb2RhbCcsXHJcbiAgICAgICAgICAgIHN0YXRlOiAnc2hvdycsXHJcbiAgICAgICAgICAgIGhlYWRlcjogJ9CS0L7RgdGB0YLQsNC90L7QstC70LXQvdC40LUg0L/QsNGA0L7Qu9GPJyxcclxuICAgICAgICAgICAgY29udGVudDogW1xyXG4gICAgICAgICAgICAgICAgbShcImRpdlwiLCB7Y2xhc3M6IFwic29tZS1jb250ZW50XCJ9LCBbXHJcbiAgICAgICAgICAgICAgICAgICAgbShcInBcIiwge2NsYXNzOiBcIlwifSwgJ9Cf0LDRgNC+0LvRjCDQsdGD0LTQtdGCINCy0YvRgdC70LDQvSDQktCw0Lwg0LIg0YLQtdC70LXRhNC+0L3QvdC+0Lwg0YHQvtC+0LHRidC10L3QuNC4LicpXHJcbiAgICAgICAgICAgICAgICBdKVxyXG4gICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICBpc1N0YXRpYzogZmFsc2UsXHJcbiAgICAgICAgICAgIGlzRm9vdGVyOiB0cnVlLFxyXG4gICAgICAgICAgICBpc0Z1bGxTY3JlZW46IGZhbHNlLFxyXG4gICAgICAgICAgICBtb2RhbFNpemVQYXJhbXM6IHt3aWR0aDogJzkwJScsIGhlaWdodDogZmFsc2UsIHBhZGRpbmc6ICcxNSUgMCAwIDAnfSxcclxuICAgICAgICAgICAgekluZGV4OiAxMDA1LFxyXG4gICAgICAgICAgICBjYW5jZWxCdG46ICdub25lJywgXHJcbiAgICAgICAgICAgIGNvbmZpcm1CdG46ICfQntC6JyxcclxuICAgICAgICAgICAgb25Db25maXJtOiBmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAgICAgcmVzdG9yZU1vZGFsID0gZmFsc2U7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIG9uQ2FuY2VsOiBmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAgICAgcmVzdG9yZU1vZGFsID0gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KVxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGNyZWF0ZVBob25lTWFzayhlbCl7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgJChlbC5kb20pLm1hc2soXCIoOTk5KS05OTktOTktOTlcIiwge2NvbXBsZXRlZDogZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgIFVzZXJNb2RlbC5jaGFuZ2VQaG9uZSh0aGlzLnZhbCgpLnJlcGxhY2UoL1teMC05Ll0vZywgXCJcIikpXHJcbiAgICAgICAgICAgIH19KTtcclxuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgICAgICBhbGVydChlcnJvcilcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gcmVzdG9yZSgpe1xyXG4gICAgICAgIHJlc3RvcmVNb2RhbCA9ICBuZXcgTW9kYWwoe1xyXG4gICAgICAgICAgICBpZDogJ3Jlc3RvcmVNb2RhbCcsXHJcbiAgICAgICAgICAgIHN0YXRlOiAnc2hvdycsXHJcbiAgICAgICAgICAgIGhlYWRlcjogJ9CS0L7RgdGB0YLQsNC90L7QstC70LXQvdC40LUg0L/QsNGA0L7Qu9GPJyxcclxuICAgICAgICAgICAgY29udGVudDogW1xyXG4gICAgICAgICAgICAgICAgbShcImRpdlwiLCB7Y2xhc3M6IFwic29tZS1jb250ZW50XCJ9LCBbXHJcbiAgICAgICAgICAgICAgICAgICAgbShcImlucHV0XCIsIHt0eXBlOiAndGVsJywgY2xhc3M6IFwiZm9ybS1jb250cm9sXCIsIHBsYWNlaG9sZGVyOiBcItCd0L7QvNC10YAg0YLQtdC70LXRhNC+0L3QsFwiLCB2YWx1ZTogVXNlck1vZGVsLnBob25lfSksXHJcbiAgICAgICAgICAgICAgICAgICAgbShcImJ1dHRvblwiLCB7Y2xhc3M6IFwiYnRuIGJ0bi1kZWZhdWx0IGZvcm0tY29udHJvbFwiLCBvbmNsaWNrOiBwYXNzd29yZFNlbmQsIHN0eWxlOiBcIm1hcmdpbi10b3A6IDEwcHg7XCJ9LCAn0J/QvtC70YPRh9C40YLRjCDQv9Cw0YDQvtC70YwnKVxyXG4gICAgICAgICAgICAgICAgXSlcclxuICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgaXNTdGF0aWM6IGZhbHNlLFxyXG4gICAgICAgICAgICBpc0Zvb3RlcjogdHJ1ZSxcclxuICAgICAgICAgICAgaXNGdWxsU2NyZWVuOiBmYWxzZSxcclxuICAgICAgICAgICAgbW9kYWxTaXplUGFyYW1zOiB7d2lkdGg6ICc5MCUnLCBoZWlnaHQ6IGZhbHNlLCBwYWRkaW5nOiAnMTUlIDAgMCAwJ30sXHJcbiAgICAgICAgICAgIHpJbmRleDogMTAwNSxcclxuICAgICAgICAgICAgY2FuY2VsQnRuOiAnbm9uZScsIFxyXG4gICAgICAgICAgICBjb25maXJtQnRuOiAn0J7RgtC80LXQvdCwJyxcclxuICAgICAgICAgICAgb25Db25maXJtOiBmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAgICAgcmVzdG9yZU1vZGFsID0gZmFsc2U7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIG9uQ2FuY2VsOiBmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAgICAgcmVzdG9yZU1vZGFsID0gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KVxyXG4gICAgfVxyXG5cclxuICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gICAgLy8vICAgQ09NUE9ORU5UIExJRkVDWUNMRSBNRVRIT0RTICAgLy8vXHJcbiAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbiAgICBmdW5jdGlvbiBvbmluaXQoKSB7XHJcbiAgICAgICAgLy9hdXRoKCk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gdmlldygpIHtcclxuICAgICAgICByZXR1cm4gbShcImRpdlwiLCB7IGNsYXNzOiBcImNvbnRhaW5lciBwLWxvZ2luXCIgfSwgW1xyXG4gICAgICAgICAgICBtKFwiZGl2XCIsIHsgY2xhc3M6IFwicm93IHAtbG9naW5fX2hlYWRlclwiIH0sIFtcclxuICAgICAgICAgICAgICAgIG0oXCJkaXZcIiwgeyBjbGFzczogXCJjb2wtc20tMTJcIiB9LFxyXG4gICAgICAgICAgICAgICAgICAgIG0oXCJoM1wiLCB7IGNsYXNzOiBcInAtbG9naW5fX2hlYWRlci10ZXh0XCIgfSwgJ1Nob3AgMzYwJylcclxuICAgICAgICAgICAgICAgIClcclxuICAgICAgICAgICAgXSksXHJcbiAgICAgICAgICAgIG0oXCJkaXZcIiwgeyBjbGFzczogXCJyb3cgcC1sb2dpbl9fYXV0aC1mb3JtXCIgfSwgW1xyXG4gICAgICAgICAgICAgICAgbShcImRpdlwiLCB7IGNsYXNzOiBcImNvbC1zbS0xMlwiIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgbShcImRpdlwiLCB7IGNsYXNzOiBcImlucHV0LWdyb3VwIHAtbG9naW5fX3Bob25lLWNvbnRhaW5lclwiIH0sIFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbShcInNwYW5cIiwgeyBjbGFzczogXCJpbnB1dC1ncm91cC1hZGRvblwiIH0sICcrNycpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBtKFwiaW5wdXRcIiwgeyB0eXBlOiBcInRlbFwiLCBjbGFzczogXCJmb3JtLWNvbnRyb2xcIiwgcGxhY2Vob2xkZXI6IFwi0J3QvtC80LXRgCDRgtC10LvQtdGE0L7QvdCwXCIsIG9uaW5wdXQ6IG0ud2l0aEF0dHIoXCJ2YWx1ZVwiLCBVc2VyTW9kZWwuY2hhbmdlUGhvbmUpLCB2YWx1ZTogVXNlck1vZGVsLnBob25lfSlcclxuICAgICAgICAgICAgICAgICAgICBdKVxyXG4gICAgICAgICAgICAgICAgKSxcclxuICAgICAgICAgICAgICAgIG0oXCJkaXZcIiwgeyBjbGFzczogXCJjb2wtc20tMTJcIiB9LFxyXG4gICAgICAgICAgICAgICAgICAgIG0oXCJpbnB1dFwiLCB7IHR5cGU6IFwicGFzc3dvcmRcIiwgY2xhc3M6IFwiZm9ybS1jb250cm9sIHAtbG9naW5fX3Bhc3N3b3JkXCIsIHBsYWNlaG9sZGVyOiBcItCf0LDRgNC+0LvRjFwiLCBvbmlucHV0OiBtLndpdGhBdHRyKFwidmFsdWVcIiwgVXNlck1vZGVsLmNoYW5nZVBhc3N3b3JkKSwgdmFsdWU6IFVzZXJNb2RlbC5wYXNzd29yZCB9KVxyXG4gICAgICAgICAgICAgICAgKSxcclxuICAgICAgICAgICAgICAgIG0oXCJkaXZcIiwgeyBjbGFzczogXCJjb2wtc20tMTJcIiB9LFxyXG4gICAgICAgICAgICAgICAgICAgIG0oXCJidXR0b25cIiwgeyBjbGFzczogXCJidG4gYnRuLWRlZmF1bHQgZm9ybS1jb250cm9sIHAtbG9naW5fX2F1dGgtYnRuXCIsIGRpc2FibGVkOiAoVXNlck1vZGVsLnBob25lID09PSAnJyB8fCBfaXNMb2dnaW5nKSwgb25jbGljazogYXV0aCB9LCAn0JLQvtC50YLQuCcpLFxyXG4gICAgICAgICAgICAgICAgICAgIF9hdXRoRXJyb3IgPyBtKFwiZGl2XCIsIHtjbGFzczogXCJhbGVydCBhbGVydC1kYW5nZXJcIiwgcm9sZTogXCJhbGVydFwiLCBzdHlsZTogXCJtYXJnaW46IDEwcHggMCAwIDA7IHBhZGRpbmc6IDEwcHg7XCJ9LCBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG0oXCJzcGFuXCIsIHtjbGFzczogXCJnbHlwaGljb24gZ2x5cGhpY29uLWV4Y2xhbWF0aW9uLXNpZ25cIiwgXCJhcmlhLWhpZGRlblwiOiBcInRydWVcIn0pLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAn0J3QtdCy0LXRgNC90YvQuSDQu9C+0LPQuNC9INC40LvQuCDQv9Cw0YDQvtC70YwhJ1xyXG4gICAgICAgICAgICAgICAgICAgIF0pIDogJydcclxuICAgICAgICAgICAgICAgICksXHJcbiAgICAgICAgICAgICAgICBtKFwiZGl2XCIsIHsgY2xhc3M6IFwiY29sLXNtLTEyXCIgfSxcclxuICAgICAgICAgICAgICAgICAgICBtKFwiYnV0dG9uXCIsIHsgY2xhc3M6IFwiYnRuIGJ0bi1saW5rIHAtbG9naW5fX3Jlc3RvcmUtcGFzc3dvcmRcIiwgb25jbGljazogcmVzdG9yZSB9LCAn0JfQsNCx0YvQu9C4INC/0LDRgNC+0LvRjD8nKVxyXG4gICAgICAgICAgICAgICAgKVxyXG4gICAgICAgICAgICBdKSxcclxuICAgICAgICAgICAgcmVzdG9yZU1vZGFsID8gbShyZXN0b3JlTW9kYWwpIDogJycsXHJcbiAgICAgICAgICAgIEFsZXJ0ID8gbShBbGVydCkgOiAnJ1xyXG4gICAgICAgIF0pXHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBvbmluaXQ6IG9uaW5pdCxcclxuICAgICAgICB2aWV3OiB2aWV3XHJcbiAgICB9XHJcbn1cclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5sZXQgbSA9IHJlcXVpcmUoJ21pdGhyaWwnKTtcclxubGV0IFIgPSByZXF1aXJlKCcuLi8uLi9jb21wb25lbnRzL3JlcXVlc3QuanMnKTtcclxubGV0IE1lbnVNb2R1bGUgPSByZXF1aXJlKCcuLi8uLi9tb2R1bGVzL21lbnUvbWVudS5qcycpO1xyXG5sZXQgTW9kYWwgPSByZXF1aXJlKCcuLi8uLi9jb21wb25lbnRzL21vZGFsLXdpbmRvdy9tb2RhbC13aW5kb3cuanMnKTtcclxubGV0IExvYWRpbmdNb2RhbCA9IHJlcXVpcmUoJy4uLy4uL2NvbXBvbmVudHMvbW9kYWwtd2luZG93L2xvYWRpbmctbW9kYWwtd2luZG93LmpzJyk7XHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKCkge1xyXG4gICAgbGV0IF9zdGF0ZSA9ICdsb2FkaW5nJztcclxuICAgIGxldCBfZXJyb3JzID0gW107XHJcbiAgICBsZXQgTWVudTtcclxuICAgIGxldCBfbWVzc2FnZXMgPSBbXTtcclxuICAgIGxldCBfbW9kYWwgPSBmYWxzZTtcclxuXHJcbiAgICBmdW5jdGlvbiByZW1vdmVNZXNzYWdlKG1lc3NhZ2Upe1xyXG4gICAgICAgIG1lc3NhZ2VbJ1VTTV9JU19SRUFERU4nXSA9IDE7XHJcbiAgICAgICAgUi51cGRhdGUoJ1NUX1VTRVJfTUVTU0FHRScsICdVU01fSVNfUkVBREVOID0gMScsIFwiVVNNX0NPREUgPSBcIiArIG1lc3NhZ2VbJ1VTTV9DT0RFJ10pO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHNob3dNZXNzYWdlKCl7XHJcbiAgICAgICAgbGV0IGluZGV4ID0gdGhpcy5nZXRBdHRyaWJ1dGUoJ2RhdGEtaW5kZXgnKTtcclxuICAgICAgICBsZXQgbWVzc2FnZSA9IF9tZXNzYWdlc1tpbmRleF07XHJcbiAgICAgICAgX21vZGFsID0gbmV3IE1vZGFsKHtcclxuICAgICAgICAgICAgaWQ6ICdhbGVydE1vZGFsJyxcclxuICAgICAgICAgICAgc3RhdGU6ICdzaG93JyxcclxuICAgICAgICAgICAgaGVhZGVyOiBtZXNzYWdlWydVU01fSEVBREVSJ10sXHJcbiAgICAgICAgICAgIGNvbnRlbnQ6IFtcclxuICAgICAgICAgICAgICAgIG0oXCJkaXZcIiwge3N0eWxlOiBcInRleHQtYWxpZ246IGxlZnQ7XCJ9LCBbXHJcbiAgICAgICAgICAgICAgICAgICAgbWVzc2FnZVsnVVNNX1RFWFQnXVxyXG4gICAgICAgICAgICAgICAgXSlcclxuICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgaXNTdGF0aWM6IGZhbHNlLFxyXG4gICAgICAgICAgICBpc0Zvb3RlcjogdHJ1ZSxcclxuICAgICAgICAgICAgaXNGdWxsU2NyZWVuOiBmYWxzZSxcclxuICAgICAgICAgICAgbW9kYWxTaXplUGFyYW1zOiB7d2lkdGg6ICc5MCUnLCBoZWlnaHQ6IGZhbHNlLCBwYWRkaW5nOiAnMTUlIDAgMCAwJ30sXHJcbiAgICAgICAgICAgIHpJbmRleDogMTAwNSxcclxuICAgICAgICAgICAgY2FuY2VsQnRuOiAnbm9uZScsIFxyXG4gICAgICAgICAgICBjb25maXJtQnRuOiAn0J7QuicsXHJcbiAgICAgICAgICAgIG9uQ29uZmlybTogZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgIF9tb2RhbCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgcmVtb3ZlTWVzc2FnZShtZXNzYWdlKTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgb25DYW5jZWw6IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICAgICBfbW9kYWwgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIHJlbW92ZU1lc3NhZ2UobWVzc2FnZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KVxyXG4gICAgfVxyXG5cclxuICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gICAgLy8vICAgQ09NUE9ORU5UIExJRkVDWUNMRSBNRVRIT0RTICAgLy8vXHJcbiAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbiAgICBmdW5jdGlvbiBvbmluaXQoKSB7XHJcbiAgICAgICAgTWVudSA9IG5ldyBNZW51TW9kdWxlKCk7XHJcbiAgICAgICAgUi5nZXQoJyonLCAnVklFV19TVF9VU0VSX01FU1NBR0UnLCBcIldIRVJFIFVTTV9VU0VfQ09ERSA9IFwiICsgR2xvYmFscy51c2VyKFwiVVNFX0NPREVcIiksIFwiVVNNX0NPREUgREVTQ1wiKVxyXG4gICAgICAgICAgICAudGhlbihkYXRhID0+IHtcclxuICAgICAgICAgICAgICAgIF9tZXNzYWdlcyA9IGRhdGE7XHJcbiAgICAgICAgICAgICAgICBfc3RhdGUgPSAnbG9hZGVkJztcclxuICAgICAgICAgICAgICAgIG0ucmVkcmF3KCk7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5jYXRjaChlcnJvciA9PiB7XHJcbiAgICAgICAgICAgICAgICBfZXJyb3JzLnB1c2goZXJyb3IubWVzc2FnZSk7XHJcbiAgICAgICAgICAgICAgICBfc3RhdGUgPSAnZXJyb3InO1xyXG4gICAgICAgICAgICAgICAgbS5yZWRyYXcoKTtcclxuICAgICAgICAgICAgfSlcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiB2aWV3KCkge1xyXG4gICAgICAgIHN3aXRjaCAoX3N0YXRlKSB7XHJcbiAgICAgICAgICAgIGNhc2UgJ2xvYWRpbmcnOlxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG0oXCJkaXZcIiwgeyBjbGFzczogXCJjb250YWluZXIgcC1tZXNzYWdlc1wiIH0sIFtcclxuICAgICAgICAgICAgICAgICAgICBtKG5ldyBMb2FkaW5nTW9kYWwoe30pKVxyXG4gICAgICAgICAgICAgICAgXSlcclxuICAgICAgICAgICAgY2FzZSAnbG9hZGVkJzpcclxuICAgICAgICAgICAgICAgIHJldHVybiBtKFwiZGl2XCIsIHsgY2xhc3M6IFwiY29udGFpbmVyIHAtbWVzc2FnZXNcIiB9LCBbXHJcbiAgICAgICAgICAgICAgICAgICAgbShNZW51KSxcclxuICAgICAgICAgICAgICAgICAgICBtKFwiZGl2XCIsIHsgY2xhc3M6IFwicm93XCIgfSwgW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBtKFwiZGl2XCIsIHsgY2xhc3M6IFwiY29sLXNtLTEyXCIgfSwgW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbShcImRpdlwiLCB7Y2xhc3M6IFwicC1tZXNzYWdlc19faGVhZGVyLWNvbnRhaW5lclwifSwgW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG0oXCJzcGFuXCIsIHtjbGFzczogXCJnbHlwaGljb24gZ2x5cGhpY29uLWVudmVsb3BlXCIsIFwiYXJpYS1oaWRkZW5cIjogXCJ0cnVlXCJ9KSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtKFwiaDNcIiwgeyBjbGFzczogXCJwLW1lc3NhZ2VzX19oZWFkZXJcIiB9LCAn0KHQvtC+0LHRidC10L3QuNGPJylcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF0pLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgX21lc3NhZ2VzLm1hcCgobWVzc2FnZSwgaW5kZXgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gbShcImRpdlwiLCB7Y2xhc3M6IFwicC1tZXNzYWdlc19fbWVzc2FnZS1pdGVtIGNvbXBvbmVudC1jb250YWluZXIgXCIgKyAobWVzc2FnZVsnVVNNX0lTX1JFQURFTiddID09IDEgPyBcInAtbWVzc2FnZXNfX21lc3NhZ2UtaXRlbV9yZWFkZW5cIiA6IFwiXCIpfSwgW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtKFwiZGl2XCIsIHtjbGFzczogXCJwLW1lc3NhZ2VzX19tZXNzYWdlLWl0ZW0taGVhZGVyXCJ9LCBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtKFwiaDNcIiwgbWVzc2FnZVsnVVNNX0hFQURFUiddKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG0oXCJzcGFuXCIsIG1lc3NhZ2VbJ1VTTV9DUkVBVEUnXSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG0oXCJwXCIsIG1lc3NhZ2VbJ1VTTV9BTk5PVEFUSU9OJ10gKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbShcImRpdlwiLCB7Y2xhc3M6IFwicC1tZXNzYWdlc19fbWVzc2FnZS1pdGVtLWxpbmstY29udGFpbmVyXCJ9LCBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG0oXCJidXR0b25cIiwge2NsYXNzOiBcImJ0biBidG4tbGluayBwLW1lc3NhZ2VzX19tZXNzYWdlLWl0ZW0tbGlua1wiLCBcImRhdGEtaW5kZXhcIjogaW5kZXgsIG9uY2xpY2s6IHNob3dNZXNzYWdlfSwgJ9Cn0LjRgtCw0YLRjCcpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBdKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgXSlcclxuICAgICAgICAgICAgICAgICAgICBdKSxcclxuICAgICAgICAgICAgICAgICAgICBfbW9kYWwgPyBtKF9tb2RhbCkgOiAnJ1xyXG4gICAgICAgICAgICAgICAgXSlcclxuICAgICAgICAgICAgY2FzZSAnZXJyb3InOlxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG0oXCJkaXZcIiwgeyBjbGFzczogXCJjb250YWluZXIgcC1ob21lXCIgfSwgW1xyXG4gICAgICAgICAgICAgICAgICAgIF9lcnJvcnMubWFwKGVycm9yID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG0oXCJwXCIsIGVycm9yKVxyXG4gICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICBdKVxyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBvbmluaXQ6IG9uaW5pdCxcclxuICAgICAgICB2aWV3OiB2aWV3XHJcbiAgICB9XHJcbn1cclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5sZXQgbSA9IHJlcXVpcmUoJ21pdGhyaWwnKTtcclxubGV0IFIgPSByZXF1aXJlKCcuLi8uLi9jb21wb25lbnRzL3JlcXVlc3QuanMnKTtcclxubGV0IE1lbnVNb2R1bGUgPSByZXF1aXJlKCcuLi8uLi9tb2R1bGVzL21lbnUvbWVudS5qcycpO1xyXG5sZXQgQWxlcnRNb2R1bGUgPSByZXF1aXJlKCcuLi8uLi9tb2R1bGVzL2FsZXJ0L2FsZXJ0LmpzJyk7XHJcbmxldCBMb2FkaW5nTW9kYWwgPSByZXF1aXJlKCcuLi8uLi9jb21wb25lbnRzL21vZGFsLXdpbmRvdy9sb2FkaW5nLW1vZGFsLXdpbmRvdy5qcycpO1xyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICgpIHtcclxuICAgIGxldCBfc3RhdGUgPSAnbG9hZGluZyc7XHJcbiAgICBsZXQgX2Vycm9ycyA9IFtdO1xyXG4gICAgbGV0IF9zdXJ2ZXlMaXN0ID0gW107XHJcbiAgICBsZXQgX3RyYWluaW5nTGlzdCA9IFtdO1xyXG4gICAgbGV0IF9vbmUyb25lTGlzdCA9IFtdO1xyXG4gICAgbGV0IGxvYWRpbmdNb2RhbCA9IGZhbHNlO1xyXG4gICAgbGV0IE1lbnU7XHJcbiAgICBsZXQgQWxlcnQ7XHJcblxyXG4gICAgZnVuY3Rpb24gbG9hZFN1cnZleSgpIHtcclxuICAgICAgICBsZXQgc3VyQ29kZSA9IHRoaXMuZ2V0QXR0cmlidXRlKCdkYXRhLWNvZGUnKTtcclxuICAgICAgICBtLnJvdXRlLnNldCgnL3N1cnZleS8nICsgc3VyQ29kZSk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gbG9hZFN1cnZleXMoKSB7XHJcbiAgICAgICAgcmV0dXJuIFIuZ2V0KCcqJywgXCJWSUVXX1NUX1VTRVJfU1VSVkVZXCIsIFwiV0hFUkUgU1VSX0lTX1BST01PIDw+IDEgQU5EIFNVUl9JU19UUkFJTklORyA8PiAxIEFORCBVU1NfVVNFX0NPREUgPSBcIiArIEdsb2JhbHMudXNlcihcIlVTRV9DT0RFXCIpKVxyXG4gICAgICAgICAgICAudGhlbihmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgX3N1cnZleUxpc3QgPSBkYXRhO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGxvYWRUcmFpbmluZygpIHtcclxuICAgICAgICByZXR1cm4gUi5nZXQoJyonLCBcIlZJRVdfU1RfVVNFUl9TVVJWRVlcIiwgXCJXSEVSRSBTVVJfSVNfVFJBSU5JTkcgPSAxIEFORCBVU1NfVVNFX0NPREUgPSBcIiArIEdsb2JhbHMudXNlcihcIlVTRV9DT0RFXCIpKVxyXG4gICAgICAgICAgICAudGhlbihmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgX3RyYWluaW5nTGlzdCA9IGRhdGE7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gbG9hZF8xXzJfMSgpIHtcclxuICAgICAgICByZXR1cm4gUi5nZXQoJyonLCBcIlZJRVdfU1RfVVNFUl9TVVJWRVlcIiwgXCJXSEVSRSAgU1VSX0lTX1BST01PID0gMSBBTkQgVVNTX1VTRV9DT0RFID0gXCIgKyBHbG9iYWxzLnVzZXIoXCJVU0VfQ09ERVwiKSlcclxuICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgICAgICAgICAgIF9vbmUyb25lTGlzdCA9IGRhdGE7XHJcbiAgICAgICAgICAgICAgICBfc3RhdGUgPSAnbG9hZGVkJztcclxuICAgICAgICAgICAgfSlcclxuICAgIH1cclxuXHJcbiAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAgIC8vLyAgIENPTVBPTkVOVCBMSUZFQ1lDTEUgTUVUSE9EUyAgIC8vL1xyXG4gICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcblxyXG4gICAgZnVuY3Rpb24gb25pbml0KCkge1xyXG4gICAgICAgIGxvYWRpbmdNb2RhbCA9IG5ldyBMb2FkaW5nTW9kYWwoe1xyXG4gICAgICAgICAgICBoZWFkZXI6IFwi0JfQsNCz0YDRg9C30LrQsCDQtNCw0L3QvdGL0YVcIlxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBNZW51ID0gbmV3IE1lbnVNb2R1bGUoKTtcclxuICAgICAgICBQcm9taXNlLmFsbChbXHJcbiAgICAgICAgICAgIGxvYWRTdXJ2ZXlzKCksXHJcbiAgICAgICAgICAgIGxvYWRUcmFpbmluZygpLFxyXG4gICAgICAgICAgICBsb2FkXzFfMl8xKClcclxuICAgICAgICBdKVxyXG4gICAgICAgICAgICAudGhlbigoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBtLnJlZHJhdygpO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAuY2F0Y2goZnVuY3Rpb24gKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICBfZXJyb3JzLnB1c2goJ9Ce0YjQuNCx0LrQsCDQt9Cw0LPRgNGD0LfQutC4INGB0L/QuNGB0LrQsCcpO1xyXG4gICAgICAgICAgICAgICAgX2Vycm9ycy5wdXNoKGVycm9yLm1lc3NhZ2UpO1xyXG4gICAgICAgICAgICAgICAgX3N0YXRlID0gJ2Vycm9yJztcclxuICAgICAgICAgICAgICAgIG0ucmVkcmF3KCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICBBbGVydCA9IG5ldyBBbGVydE1vZHVsZSh7XHJcbiAgICAgICAgICAgIGludGVydmFsOiAzMDAwXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gdmlldygpIHtcclxuICAgICAgICBzd2l0Y2ggKF9zdGF0ZSkge1xyXG4gICAgICAgICAgICBjYXNlICdsb2FkaW5nJzpcclxuICAgICAgICAgICAgICAgIHJldHVybiBtKFwiZGl2XCIsIHsgY2xhc3M6IFwiY29udGFpbmVyIHAtc3VydmV5LWxpc3RcIiB9LCBbXHJcbiAgICAgICAgICAgICAgICAgICAgbShsb2FkaW5nTW9kYWwpXHJcbiAgICAgICAgICAgICAgICBdKVxyXG4gICAgICAgICAgICBjYXNlICdsb2FkZWQnOlxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG0oXCJkaXZcIiwgeyBjbGFzczogXCJjb250YWluZXIgcC1zdXJ2ZXktbGlzdFwiIH0sIFtcclxuICAgICAgICAgICAgICAgICAgICBtKE1lbnUpLFxyXG4gICAgICAgICAgICAgICAgICAgIG0oXCJkaXZcIiwgeyBjbGFzczogXCJyb3dcIiB9LCBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG0oXCJkaXZcIiwgeyBjbGFzczogXCJjb2wtc20tMTJcIiB9LCBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtKFwiZGl2XCIsIHsgY2xhc3M6IFwicC1zdXJ2ZXktbGlzdF9faGVhZGVyLWNvbnRhaW5lclwiIH0sIFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtKFwic3BhblwiLCB7IGNsYXNzOiBcImdseXBoaWNvbiBnbHlwaGljb24tbGlzdFwiLCBcImFyaWEtaGlkZGVuXCI6IFwidHJ1ZVwiIH0pLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG0oXCJoM1wiLCB7IGNsYXNzOiBcInAtc3VydmV5LWxpc3RfX2hlYWRlclwiIH0sICfQl9Cw0LTQsNGH0LgnKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtKFwiZGl2XCIsIHsgY2xhc3M6IFwibGlzdC1ncm91cFwiIH0sIFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBfc3VydmV5TGlzdC5tYXAoZnVuY3Rpb24gKHN1cnZleU9iaikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgYnRuTmFtZSA9ICfQn9GA0LjRgdGC0YPQv9C40YLRjCc7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZihzdXJ2ZXlPYmpbJ1NVUl9BTExPV0VEJ10gPT0gMCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBidG5OYW1lID0gJ9CR0YPQtNC10YIg0LTQvtGB0YLRg9C/0L3QviAnICsgc3VydmV5T2JqWydTVVJfQUxMT1dfREFURSddO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZihzdXJ2ZXlPYmpbJ1NVUl9QUk9HUkVTUyddID49IHN1cnZleU9ialsnU1VSX0NPTVBMRVRFX0NPVU5UJ10pe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnRuTmFtZSA9ICfQl9Cw0LTQsNGH0LAg0LLRi9C/0L7Qu9C90LXQvdCwJztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG0oXCJkaXZcIiwgeyBjbGFzczogXCJwLXN1cnZleS1saXN0X19zdXJ2ZXktaXRlbSBjbGVhcmZpeFwiIH0sIFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG0oXCJkaXZcIiwgeyBjbGFzczogXCJwLXN1cnZleS1saXN0X19zdXJ2ZXktaXRlbS1oZWFkZXItY29udGFpbmVyXCIgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtKFwiaDNcIiwgeyBjbGFzczogXCJwLXN1cnZleS1saXN0X19zdXJ2ZXktaXRlbS1oZWFkZXJcIiB9LCBzdXJ2ZXlPYmpbJ1NVUl9OQU1FJ10pLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG0oXCJkaXZcIiwgeyBjbGFzczogXCJwLXN1cnZleS1saXN0X19zdXJ2ZXktaXRlbS1kZXNjXCIgfSwgJ9Ce0L/QuNGB0LDQvdC40LUg0L/RgNC+0LPRgNCw0LzQvNGLIFwiJyArIHN1cnZleU9ialsnU1VSX05BTUUnXSArICdcIicpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbShcImRpdlwiLCB7IGNsYXNzOiBcInAtc3VydmV5LWxpc3RfX3N1cnZleS1pdGVtLXJhdGUtY29udGFpbmVyXCIgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtKFwic3BhblwiLCAnKycgKyBzdXJ2ZXlPYmpbJ1NVUl9DT01QTEVURV9TQ09SRSddKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG0oXCJkaXZcIiwgeyBjbGFzczogXCJwLXN1cnZleS1saXN0X19zdXJ2ZXktaXRlbS1ib3R0b21cIiB9LCBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbShcImRpdlwiLCB7IGNsYXNzOiBcInAtc3VydmV5LWxpc3RfX3N1cnZleS1pdGVtLXByb2dyZXNzXCIgfSwgW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAn0JLRi9C/0L7Qu9C90LXQvdC+ICcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG0oXCJzdHJvbmdcIiwgc3VydmV5T2JqWydTVVJfUFJPR1JFU1MnXSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICcg0LjQtyAnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtKFwic3Ryb25nXCIsIHN1cnZleU9ialsnU1VSX0NPTVBMRVRFX0NPVU5UJ10pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbShcImJ1dHRvblwiLCB7IGNsYXNzOiBcImJ0biBidG4tcHJpbWFyeSBwLXN1cnZleS1saXN0X19zdXJ2ZXktaXRlbS1zdGFydC1idG5cIiwgXCJkYXRhLWNvZGVcIjogc3VydmV5T2JqWydTVVJfQ09ERSddLCBkaXNhYmxlZDogKHN1cnZleU9ialsnU1VSX0FMTE9XRUQnXSA9PSAwIHx8IHN1cnZleU9ialsnU1VSX1BST0dSRVNTJ10gPj0gc3VydmV5T2JqWydTVVJfQ09NUExFVEVfQ09VTlQnXSkgLCBvbmNsaWNrOiBsb2FkU3VydmV5IH0sIGJ0bk5hbWUpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBdKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBdKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBdKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBdKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgbShcImRpdlwiLCB7IGNsYXNzOiBcImNvbC1zbS0xMlwiICsgKF90cmFpbmluZ0xpc3QubGVuZ3RoID09PSAwID8gXCIgaGlkZGVuXCIgOiBcIlwiKSB9LCBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtKFwiZGl2XCIsIHsgY2xhc3M6IFwicC1zdXJ2ZXktbGlzdF9faGVhZGVyLWNvbnRhaW5lclwiIH0sIFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtKFwic3BhblwiLCB7IGNsYXNzOiBcImdseXBoaWNvbiBnbHlwaGljb24tZWR1Y2F0aW9uXCIsIFwiYXJpYS1oaWRkZW5cIjogXCJ0cnVlXCIgfSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbShcImgzXCIsIHsgY2xhc3M6IFwicC1zdXJ2ZXktbGlzdF9faGVhZGVyXCIgfSwgJ9Ce0LHRg9GH0LXQvdC40LUnKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtKFwiZGl2XCIsIHsgY2xhc3M6IFwibGlzdC1ncm91cFwiIH0sIFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBfdHJhaW5pbmdMaXN0Lm1hcChmdW5jdGlvbiAoc3VydmV5T2JqKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBidG5OYW1lID0gJ9Cf0YDQuNGB0YLRg9C/0LjRgtGMJztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYoc3VydmV5T2JqWydTVVJfQUxMT1dFRCddID09IDApe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnRuTmFtZSA9ICfQkdGD0LTQtdGCINC00L7RgdGC0YPQv9C90L4gJyArIHN1cnZleU9ialsnU1VSX0FMTE9XX0RBVEUnXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYoc3VydmV5T2JqWydTVVJfUFJPR1JFU1MnXSA+PSBzdXJ2ZXlPYmpbJ1NVUl9DT01QTEVURV9DT1VOVCddKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJ0bk5hbWUgPSAn0JfQsNC00LDRh9CwINCy0YvQv9C+0LvQvdC10L3QsCc7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBtKFwiZGl2XCIsIHsgY2xhc3M6IFwicC1zdXJ2ZXktbGlzdF9fc3VydmV5LWl0ZW0gY2xlYXJmaXhcIiB9LCBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtKFwiZGl2XCIsIHsgY2xhc3M6IFwicC1zdXJ2ZXktbGlzdF9fc3VydmV5LWl0ZW0taGVhZGVyLWNvbnRhaW5lclwiIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbShcImgzXCIsIHsgY2xhc3M6IFwicC1zdXJ2ZXktbGlzdF9fc3VydmV5LWl0ZW0taGVhZGVyXCIgfSwgc3VydmV5T2JqWydTVVJfTkFNRSddKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtKFwiZGl2XCIsIHsgY2xhc3M6IFwicC1zdXJ2ZXktbGlzdF9fc3VydmV5LWl0ZW0tZGVzY1wiIH0sICfQntC/0LjRgdCw0L3QuNC1INC/0YDQvtCz0YDQsNC80LzRiyBcIicgKyBzdXJ2ZXlPYmpbJ1NVUl9OQU1FJ10gKyAnXCInKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG0oXCJkaXZcIiwgeyBjbGFzczogXCJwLXN1cnZleS1saXN0X19zdXJ2ZXktaXRlbS1yYXRlLWNvbnRhaW5lclwiIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbShcInNwYW5cIiwgJysnICsgc3VydmV5T2JqWydTVVJfQ09NUExFVEVfU0NPUkUnXSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtKFwiZGl2XCIsIHsgY2xhc3M6IFwicC1zdXJ2ZXktbGlzdF9fc3VydmV5LWl0ZW0tYm90dG9tXCIgfSwgW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG0oXCJkaXZcIiwgeyBjbGFzczogXCJwLXN1cnZleS1saXN0X19zdXJ2ZXktaXRlbS1wcm9ncmVzc1wiIH0sIFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ9CS0YvQv9C+0LvQvdC10L3QviAnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtKFwic3Ryb25nXCIsIHN1cnZleU9ialsnU1VSX1BST0dSRVNTJ10pLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnINC40LcgJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbShcInN0cm9uZ1wiLCBzdXJ2ZXlPYmpbJ1NVUl9DT01QTEVURV9DT1VOVCddKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF0pLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG0oXCJidXR0b25cIiwgeyBjbGFzczogXCJidG4gYnRuLXByaW1hcnkgcC1zdXJ2ZXktbGlzdF9fc3VydmV5LWl0ZW0tc3RhcnQtYnRuXCIsIFwiZGF0YS1jb2RlXCI6IHN1cnZleU9ialsnU1VSX0NPREUnXSwgZGlzYWJsZWQ6IChzdXJ2ZXlPYmpbJ1NVUl9BTExPV0VEJ10gPT0gMCB8fCBzdXJ2ZXlPYmpbJ1NVUl9QUk9HUkVTUyddID49IHN1cnZleU9ialsnU1VSX0NPTVBMRVRFX0NPVU5UJ10pLCBvbmNsaWNrOiBsb2FkU3VydmV5IH0sIGJ0bk5hbWUpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBdKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBdKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBdKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBdKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgbShcImRpdlwiLCB7IGNsYXNzOiBcImNvbC1zbS0xMlwiICsgKF9vbmUyb25lTGlzdC5sZW5ndGggPT09IDAgPyBcIiBoaWRkZW5cIiA6IFwiXCIpIH0sIFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG0oXCJkaXZcIiwgeyBjbGFzczogXCJwLXN1cnZleS1saXN0X19oZWFkZXItY29udGFpbmVyXCIgfSwgW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIG0oXCJzcGFuXCIsIHtjbGFzczogXCJnbHlwaGljb24gZ2x5cGhpY29uLWVkdWNhdGlvblwiLCBcImFyaWEtaGlkZGVuXCI6IFwidHJ1ZVwifSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbShcImgzXCIsIHsgY2xhc3M6IFwicC1zdXJ2ZXktbGlzdF9faGVhZGVyXCIgfSwgJ9Ce0L/RgNC+0YEg0LrQu9C40LXQvdGC0LAnKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtKFwiZGl2XCIsIHsgY2xhc3M6IFwibGlzdC1ncm91cFwiIH0sIFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBfb25lMm9uZUxpc3QubWFwKGZ1bmN0aW9uIChzdXJ2ZXlPYmopIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGJ0bk5hbWUgPSAn0J/RgNC40YHRgtGD0L/QuNGC0YwnO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZihzdXJ2ZXlPYmpbJ1NVUl9BTExPV0VEJ10gPT0gMCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBidG5OYW1lID0gJ9CR0YPQtNC10YIg0LTQvtGB0YLRg9C/0L3QviAnICsgc3VydmV5T2JqWydTVVJfQUxMT1dfREFURSddO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZihzdXJ2ZXlPYmpbJ1NVUl9QUk9HUkVTUyddID49IHN1cnZleU9ialsnU1VSX0NPTVBMRVRFX0NPVU5UJ10pe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnRuTmFtZSA9ICfQl9Cw0LTQsNGH0LAg0LLRi9C/0L7Qu9C90LXQvdCwJztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG0oXCJkaXZcIiwgeyBjbGFzczogXCJwLXN1cnZleS1saXN0X19zdXJ2ZXktaXRlbSBjbGVhcmZpeFwiIH0sIFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG0oXCJkaXZcIiwgeyBjbGFzczogXCJwLXN1cnZleS1saXN0X19zdXJ2ZXktaXRlbS1oZWFkZXItY29udGFpbmVyXCIgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtKFwiaDNcIiwgeyBjbGFzczogXCJwLXN1cnZleS1saXN0X19zdXJ2ZXktaXRlbS1oZWFkZXJcIiB9LCBzdXJ2ZXlPYmpbJ1NVUl9OQU1FJ10pLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG0oXCJkaXZcIiwgeyBjbGFzczogXCJwLXN1cnZleS1saXN0X19zdXJ2ZXktaXRlbS1kZXNjXCIgfSwgJ9Ce0L/QuNGB0LDQvdC40LUg0L/RgNC+0LPRgNCw0LzQvNGLIFwiJyArIHN1cnZleU9ialsnU1VSX05BTUUnXSArICdcIicpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbShcImRpdlwiLCB7IGNsYXNzOiBcInAtc3VydmV5LWxpc3RfX3N1cnZleS1pdGVtLXJhdGUtY29udGFpbmVyXCIgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtKFwic3BhblwiLCAnKycgKyBzdXJ2ZXlPYmpbJ1NVUl9DT01QTEVURV9TQ09SRSddKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG0oXCJkaXZcIiwgeyBjbGFzczogXCJwLXN1cnZleS1saXN0X19zdXJ2ZXktaXRlbS1ib3R0b21cIiB9LCBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbShcImRpdlwiLCB7IGNsYXNzOiBcInAtc3VydmV5LWxpc3RfX3N1cnZleS1pdGVtLXByb2dyZXNzXCIgfSwgW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAn0JLRi9C/0L7Qu9C90LXQvdC+ICcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG0oXCJzdHJvbmdcIiwgc3VydmV5T2JqWydTVVJfUFJPR1JFU1MnXSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICcg0LjQtyAnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtKFwic3Ryb25nXCIsIHN1cnZleU9ialsnU1VSX0NPTVBMRVRFX0NPVU5UJ10pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbShcImJ1dHRvblwiLCB7IGNsYXNzOiBcImJ0biBidG4tcHJpbWFyeSBwLXN1cnZleS1saXN0X19zdXJ2ZXktaXRlbS1zdGFydC1idG5cIiwgXCJkYXRhLWNvZGVcIjogc3VydmV5T2JqWydTVVJfQ09ERSddLCBkaXNhYmxlZDogKHN1cnZleU9ialsnU1VSX0FMTE9XRUQnXSA9PSAwIHx8IHN1cnZleU9ialsnU1VSX1BST0dSRVNTJ10gPj0gc3VydmV5T2JqWydTVVJfQ09NUExFVEVfQ09VTlQnXSksIG9uY2xpY2s6IGxvYWRTdXJ2ZXkgfSwgYnRuTmFtZSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF0pXHJcbiAgICAgICAgICAgICAgICAgICAgXSksXHJcbiAgICAgICAgICAgICAgICAgICAgbShBbGVydClcclxuICAgICAgICAgICAgICAgIF0pXHJcbiAgICAgICAgICAgIGNhc2UgJ2Vycm9yJzpcclxuICAgICAgICAgICAgICAgIHJldHVybiBtKFwiZGl2XCIsIHsgY2xhc3M6IFwiY29udGFpbmVyIHAtc3VydmV5LWxpc3RcIiB9LCBbXHJcbiAgICAgICAgICAgICAgICAgICAgX2Vycm9ycy5tYXAoZXJyb3IgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gbShcInBcIiwgZXJyb3IpXHJcbiAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIF0pXHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIG9uaW5pdDogb25pbml0LFxyXG4gICAgICAgIHZpZXc6IHZpZXdcclxuICAgIH1cclxufVxyXG4iLCIndXNlIHN0cmljdCc7XHJcbmxldCBtID0gcmVxdWlyZSgnbWl0aHJpbCcpO1xyXG5sZXQgU3VydmV5UGFnZSA9IHJlcXVpcmUoJy4vcGFnZXMvbGFuZGluZy9sYW5kaW5nLmpzJyk7XHJcbmxldCBMb2dpblBhZ2UgPSByZXF1aXJlKCcuL3BhZ2VzL2xvZ2luL2xvZ2luLmpzJyk7XHJcbmxldCBTdXJ2ZXlMaXN0UGFnZSA9IHJlcXVpcmUoJy4vcGFnZXMvc3VydmV5LWxpc3Qvc3VydmV5LWxpc3QuanMnKTtcclxubGV0IE1lc3NhZ2VQYWdlID0gcmVxdWlyZSgnLi9wYWdlcy9tZXNzYWdlcy9tZXNzYWdlcy5qcycpO1xyXG5sZXQgSG9tZVBhZ2UgPSByZXF1aXJlKCcuL3BhZ2VzL2hvbWUvaG9tZS5qcycpO1xyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICgpIHtcclxuICAgIGZ1bmN0aW9uIHJvdXRlKG1vZHVsZSl7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgb25tYXRjaDogZnVuY3Rpb24gKGFyZywgcGF0aCl7XHJcbiAgICAgICAgICAgICAgICBpZighR2xvYmFscy5pc0F1dGgoKSl7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG0ucm91dGUuc2V0KCcvbG9naW4nKVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG1vZHVsZVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIFwiL2xvZ2luXCI6IExvZ2luUGFnZSxcclxuICAgICAgICBcIi9saXN0XCI6IHJvdXRlKFN1cnZleUxpc3RQYWdlKSxcclxuICAgICAgICBcIi9zdXJ2ZXkvOmNvZGVcIjogcm91dGUoU3VydmV5UGFnZSksXHJcbiAgICAgICAgXCIvbWVzc2FnZXNcIjogcm91dGUoTWVzc2FnZVBhZ2UpLFxyXG4gICAgICAgIFwiL2hvbWVcIjogcm91dGUoSG9tZVBhZ2UpLFxyXG4gICAgfTtcclxufSIsIjsoZnVuY3Rpb24oKSB7XG5cInVzZSBzdHJpY3RcIlxuZnVuY3Rpb24gVm5vZGUodGFnLCBrZXksIGF0dHJzMCwgY2hpbGRyZW4sIHRleHQsIGRvbSkge1xuXHRyZXR1cm4ge3RhZzogdGFnLCBrZXk6IGtleSwgYXR0cnM6IGF0dHJzMCwgY2hpbGRyZW46IGNoaWxkcmVuLCB0ZXh0OiB0ZXh0LCBkb206IGRvbSwgZG9tU2l6ZTogdW5kZWZpbmVkLCBzdGF0ZTogdW5kZWZpbmVkLCBfc3RhdGU6IHVuZGVmaW5lZCwgZXZlbnRzOiB1bmRlZmluZWQsIGluc3RhbmNlOiB1bmRlZmluZWQsIHNraXA6IGZhbHNlfVxufVxuVm5vZGUubm9ybWFsaXplID0gZnVuY3Rpb24obm9kZSkge1xuXHRpZiAoQXJyYXkuaXNBcnJheShub2RlKSkgcmV0dXJuIFZub2RlKFwiW1wiLCB1bmRlZmluZWQsIHVuZGVmaW5lZCwgVm5vZGUubm9ybWFsaXplQ2hpbGRyZW4obm9kZSksIHVuZGVmaW5lZCwgdW5kZWZpbmVkKVxuXHRpZiAobm9kZSAhPSBudWxsICYmIHR5cGVvZiBub2RlICE9PSBcIm9iamVjdFwiKSByZXR1cm4gVm5vZGUoXCIjXCIsIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCBub2RlID09PSBmYWxzZSA/IFwiXCIgOiBub2RlLCB1bmRlZmluZWQsIHVuZGVmaW5lZClcblx0cmV0dXJuIG5vZGVcbn1cblZub2RlLm5vcm1hbGl6ZUNoaWxkcmVuID0gZnVuY3Rpb24gbm9ybWFsaXplQ2hpbGRyZW4oY2hpbGRyZW4pIHtcblx0Zm9yICh2YXIgaSA9IDA7IGkgPCBjaGlsZHJlbi5sZW5ndGg7IGkrKykge1xuXHRcdGNoaWxkcmVuW2ldID0gVm5vZGUubm9ybWFsaXplKGNoaWxkcmVuW2ldKVxuXHR9XG5cdHJldHVybiBjaGlsZHJlblxufVxudmFyIHNlbGVjdG9yUGFyc2VyID0gLyg/OihefCN8XFwuKShbXiNcXC5cXFtcXF1dKykpfChcXFsoLis/KSg/Olxccyo9XFxzKihcInwnfCkoKD86XFxcXFtcIidcXF1dfC4pKj8pXFw1KT9cXF0pL2dcbnZhciBzZWxlY3RvckNhY2hlID0ge31cbnZhciBoYXNPd24gPSB7fS5oYXNPd25Qcm9wZXJ0eVxuZnVuY3Rpb24gY29tcGlsZVNlbGVjdG9yKHNlbGVjdG9yKSB7XG5cdHZhciBtYXRjaCwgdGFnID0gXCJkaXZcIiwgY2xhc3NlcyA9IFtdLCBhdHRycyA9IHt9XG5cdHdoaWxlIChtYXRjaCA9IHNlbGVjdG9yUGFyc2VyLmV4ZWMoc2VsZWN0b3IpKSB7XG5cdFx0dmFyIHR5cGUgPSBtYXRjaFsxXSwgdmFsdWUgPSBtYXRjaFsyXVxuXHRcdGlmICh0eXBlID09PSBcIlwiICYmIHZhbHVlICE9PSBcIlwiKSB0YWcgPSB2YWx1ZVxuXHRcdGVsc2UgaWYgKHR5cGUgPT09IFwiI1wiKSBhdHRycy5pZCA9IHZhbHVlXG5cdFx0ZWxzZSBpZiAodHlwZSA9PT0gXCIuXCIpIGNsYXNzZXMucHVzaCh2YWx1ZSlcblx0XHRlbHNlIGlmIChtYXRjaFszXVswXSA9PT0gXCJbXCIpIHtcblx0XHRcdHZhciBhdHRyVmFsdWUgPSBtYXRjaFs2XVxuXHRcdFx0aWYgKGF0dHJWYWx1ZSkgYXR0clZhbHVlID0gYXR0clZhbHVlLnJlcGxhY2UoL1xcXFwoW1wiJ10pL2csIFwiJDFcIikucmVwbGFjZSgvXFxcXFxcXFwvZywgXCJcXFxcXCIpXG5cdFx0XHRpZiAobWF0Y2hbNF0gPT09IFwiY2xhc3NcIikgY2xhc3Nlcy5wdXNoKGF0dHJWYWx1ZSlcblx0XHRcdGVsc2UgYXR0cnNbbWF0Y2hbNF1dID0gYXR0clZhbHVlID09PSBcIlwiID8gYXR0clZhbHVlIDogYXR0clZhbHVlIHx8IHRydWVcblx0XHR9XG5cdH1cblx0aWYgKGNsYXNzZXMubGVuZ3RoID4gMCkgYXR0cnMuY2xhc3NOYW1lID0gY2xhc3Nlcy5qb2luKFwiIFwiKVxuXHRyZXR1cm4gc2VsZWN0b3JDYWNoZVtzZWxlY3Rvcl0gPSB7dGFnOiB0YWcsIGF0dHJzOiBhdHRyc31cbn1cbmZ1bmN0aW9uIGV4ZWNTZWxlY3RvcihzdGF0ZSwgYXR0cnMsIGNoaWxkcmVuKSB7XG5cdHZhciBoYXNBdHRycyA9IGZhbHNlLCBjaGlsZExpc3QsIHRleHRcblx0dmFyIGNsYXNzTmFtZSA9IGF0dHJzLmNsYXNzTmFtZSB8fCBhdHRycy5jbGFzc1xuXHRmb3IgKHZhciBrZXkgaW4gc3RhdGUuYXR0cnMpIHtcblx0XHRpZiAoaGFzT3duLmNhbGwoc3RhdGUuYXR0cnMsIGtleSkpIHtcblx0XHRcdGF0dHJzW2tleV0gPSBzdGF0ZS5hdHRyc1trZXldXG5cdFx0fVxuXHR9XG5cdGlmIChjbGFzc05hbWUgIT09IHVuZGVmaW5lZCkge1xuXHRcdGlmIChhdHRycy5jbGFzcyAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRhdHRycy5jbGFzcyA9IHVuZGVmaW5lZFxuXHRcdFx0YXR0cnMuY2xhc3NOYW1lID0gY2xhc3NOYW1lXG5cdFx0fVxuXHRcdGlmIChzdGF0ZS5hdHRycy5jbGFzc05hbWUgIT0gbnVsbCkge1xuXHRcdFx0YXR0cnMuY2xhc3NOYW1lID0gc3RhdGUuYXR0cnMuY2xhc3NOYW1lICsgXCIgXCIgKyBjbGFzc05hbWVcblx0XHR9XG5cdH1cblx0Zm9yICh2YXIga2V5IGluIGF0dHJzKSB7XG5cdFx0aWYgKGhhc093bi5jYWxsKGF0dHJzLCBrZXkpICYmIGtleSAhPT0gXCJrZXlcIikge1xuXHRcdFx0aGFzQXR0cnMgPSB0cnVlXG5cdFx0XHRicmVha1xuXHRcdH1cblx0fVxuXHRpZiAoQXJyYXkuaXNBcnJheShjaGlsZHJlbikgJiYgY2hpbGRyZW4ubGVuZ3RoID09PSAxICYmIGNoaWxkcmVuWzBdICE9IG51bGwgJiYgY2hpbGRyZW5bMF0udGFnID09PSBcIiNcIikge1xuXHRcdHRleHQgPSBjaGlsZHJlblswXS5jaGlsZHJlblxuXHR9IGVsc2Uge1xuXHRcdGNoaWxkTGlzdCA9IGNoaWxkcmVuXG5cdH1cblx0cmV0dXJuIFZub2RlKHN0YXRlLnRhZywgYXR0cnMua2V5LCBoYXNBdHRycyA/IGF0dHJzIDogdW5kZWZpbmVkLCBjaGlsZExpc3QsIHRleHQpXG59XG5mdW5jdGlvbiBoeXBlcnNjcmlwdChzZWxlY3Rvcikge1xuXHQvLyBCZWNhdXNlIHNsb3BweSBtb2RlIHN1Y2tzXG5cdHZhciBhdHRycyA9IGFyZ3VtZW50c1sxXSwgc3RhcnQgPSAyLCBjaGlsZHJlblxuXHRpZiAoc2VsZWN0b3IgPT0gbnVsbCB8fCB0eXBlb2Ygc2VsZWN0b3IgIT09IFwic3RyaW5nXCIgJiYgdHlwZW9mIHNlbGVjdG9yICE9PSBcImZ1bmN0aW9uXCIgJiYgdHlwZW9mIHNlbGVjdG9yLnZpZXcgIT09IFwiZnVuY3Rpb25cIikge1xuXHRcdHRocm93IEVycm9yKFwiVGhlIHNlbGVjdG9yIG11c3QgYmUgZWl0aGVyIGEgc3RyaW5nIG9yIGEgY29tcG9uZW50LlwiKTtcblx0fVxuXHRpZiAodHlwZW9mIHNlbGVjdG9yID09PSBcInN0cmluZ1wiKSB7XG5cdFx0dmFyIGNhY2hlZCA9IHNlbGVjdG9yQ2FjaGVbc2VsZWN0b3JdIHx8IGNvbXBpbGVTZWxlY3RvcihzZWxlY3Rvcilcblx0fVxuXHRpZiAoYXR0cnMgPT0gbnVsbCkge1xuXHRcdGF0dHJzID0ge31cblx0fSBlbHNlIGlmICh0eXBlb2YgYXR0cnMgIT09IFwib2JqZWN0XCIgfHwgYXR0cnMudGFnICE9IG51bGwgfHwgQXJyYXkuaXNBcnJheShhdHRycykpIHtcblx0XHRhdHRycyA9IHt9XG5cdFx0c3RhcnQgPSAxXG5cdH1cblx0aWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IHN0YXJ0ICsgMSkge1xuXHRcdGNoaWxkcmVuID0gYXJndW1lbnRzW3N0YXJ0XVxuXHRcdGlmICghQXJyYXkuaXNBcnJheShjaGlsZHJlbikpIGNoaWxkcmVuID0gW2NoaWxkcmVuXVxuXHR9IGVsc2Uge1xuXHRcdGNoaWxkcmVuID0gW11cblx0XHR3aGlsZSAoc3RhcnQgPCBhcmd1bWVudHMubGVuZ3RoKSBjaGlsZHJlbi5wdXNoKGFyZ3VtZW50c1tzdGFydCsrXSlcblx0fVxuXHR2YXIgbm9ybWFsaXplZCA9IFZub2RlLm5vcm1hbGl6ZUNoaWxkcmVuKGNoaWxkcmVuKVxuXHRpZiAodHlwZW9mIHNlbGVjdG9yID09PSBcInN0cmluZ1wiKSB7XG5cdFx0cmV0dXJuIGV4ZWNTZWxlY3RvcihjYWNoZWQsIGF0dHJzLCBub3JtYWxpemVkKVxuXHR9IGVsc2Uge1xuXHRcdHJldHVybiBWbm9kZShzZWxlY3RvciwgYXR0cnMua2V5LCBhdHRycywgbm9ybWFsaXplZClcblx0fVxufVxuaHlwZXJzY3JpcHQudHJ1c3QgPSBmdW5jdGlvbihodG1sKSB7XG5cdGlmIChodG1sID09IG51bGwpIGh0bWwgPSBcIlwiXG5cdHJldHVybiBWbm9kZShcIjxcIiwgdW5kZWZpbmVkLCB1bmRlZmluZWQsIGh0bWwsIHVuZGVmaW5lZCwgdW5kZWZpbmVkKVxufVxuaHlwZXJzY3JpcHQuZnJhZ21lbnQgPSBmdW5jdGlvbihhdHRyczEsIGNoaWxkcmVuKSB7XG5cdHJldHVybiBWbm9kZShcIltcIiwgYXR0cnMxLmtleSwgYXR0cnMxLCBWbm9kZS5ub3JtYWxpemVDaGlsZHJlbihjaGlsZHJlbiksIHVuZGVmaW5lZCwgdW5kZWZpbmVkKVxufVxudmFyIG0gPSBoeXBlcnNjcmlwdFxuLyoqIEBjb25zdHJ1Y3RvciAqL1xudmFyIFByb21pc2VQb2x5ZmlsbCA9IGZ1bmN0aW9uKGV4ZWN1dG9yKSB7XG5cdGlmICghKHRoaXMgaW5zdGFuY2VvZiBQcm9taXNlUG9seWZpbGwpKSB0aHJvdyBuZXcgRXJyb3IoXCJQcm9taXNlIG11c3QgYmUgY2FsbGVkIHdpdGggYG5ld2BcIilcblx0aWYgKHR5cGVvZiBleGVjdXRvciAhPT0gXCJmdW5jdGlvblwiKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiZXhlY3V0b3IgbXVzdCBiZSBhIGZ1bmN0aW9uXCIpXG5cdHZhciBzZWxmID0gdGhpcywgcmVzb2x2ZXJzID0gW10sIHJlamVjdG9ycyA9IFtdLCByZXNvbHZlQ3VycmVudCA9IGhhbmRsZXIocmVzb2x2ZXJzLCB0cnVlKSwgcmVqZWN0Q3VycmVudCA9IGhhbmRsZXIocmVqZWN0b3JzLCBmYWxzZSlcblx0dmFyIGluc3RhbmNlID0gc2VsZi5faW5zdGFuY2UgPSB7cmVzb2x2ZXJzOiByZXNvbHZlcnMsIHJlamVjdG9yczogcmVqZWN0b3JzfVxuXHR2YXIgY2FsbEFzeW5jID0gdHlwZW9mIHNldEltbWVkaWF0ZSA9PT0gXCJmdW5jdGlvblwiID8gc2V0SW1tZWRpYXRlIDogc2V0VGltZW91dFxuXHRmdW5jdGlvbiBoYW5kbGVyKGxpc3QsIHNob3VsZEFic29yYikge1xuXHRcdHJldHVybiBmdW5jdGlvbiBleGVjdXRlKHZhbHVlKSB7XG5cdFx0XHR2YXIgdGhlblxuXHRcdFx0dHJ5IHtcblx0XHRcdFx0aWYgKHNob3VsZEFic29yYiAmJiB2YWx1ZSAhPSBudWxsICYmICh0eXBlb2YgdmFsdWUgPT09IFwib2JqZWN0XCIgfHwgdHlwZW9mIHZhbHVlID09PSBcImZ1bmN0aW9uXCIpICYmIHR5cGVvZiAodGhlbiA9IHZhbHVlLnRoZW4pID09PSBcImZ1bmN0aW9uXCIpIHtcblx0XHRcdFx0XHRpZiAodmFsdWUgPT09IHNlbGYpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJQcm9taXNlIGNhbid0IGJlIHJlc29sdmVkIHcvIGl0c2VsZlwiKVxuXHRcdFx0XHRcdGV4ZWN1dGVPbmNlKHRoZW4uYmluZCh2YWx1ZSkpXG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0Y2FsbEFzeW5jKGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdFx0aWYgKCFzaG91bGRBYnNvcmIgJiYgbGlzdC5sZW5ndGggPT09IDApIGNvbnNvbGUuZXJyb3IoXCJQb3NzaWJsZSB1bmhhbmRsZWQgcHJvbWlzZSByZWplY3Rpb246XCIsIHZhbHVlKVxuXHRcdFx0XHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBsaXN0Lmxlbmd0aDsgaSsrKSBsaXN0W2ldKHZhbHVlKVxuXHRcdFx0XHRcdFx0cmVzb2x2ZXJzLmxlbmd0aCA9IDAsIHJlamVjdG9ycy5sZW5ndGggPSAwXG5cdFx0XHRcdFx0XHRpbnN0YW5jZS5zdGF0ZSA9IHNob3VsZEFic29yYlxuXHRcdFx0XHRcdFx0aW5zdGFuY2UucmV0cnkgPSBmdW5jdGlvbigpIHtleGVjdXRlKHZhbHVlKX1cblx0XHRcdFx0XHR9KVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRjYXRjaCAoZSkge1xuXHRcdFx0XHRyZWplY3RDdXJyZW50KGUpXG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cdGZ1bmN0aW9uIGV4ZWN1dGVPbmNlKHRoZW4pIHtcblx0XHR2YXIgcnVucyA9IDBcblx0XHRmdW5jdGlvbiBydW4oZm4pIHtcblx0XHRcdHJldHVybiBmdW5jdGlvbih2YWx1ZSkge1xuXHRcdFx0XHRpZiAocnVucysrID4gMCkgcmV0dXJuXG5cdFx0XHRcdGZuKHZhbHVlKVxuXHRcdFx0fVxuXHRcdH1cblx0XHR2YXIgb25lcnJvciA9IHJ1bihyZWplY3RDdXJyZW50KVxuXHRcdHRyeSB7dGhlbihydW4ocmVzb2x2ZUN1cnJlbnQpLCBvbmVycm9yKX0gY2F0Y2ggKGUpIHtvbmVycm9yKGUpfVxuXHR9XG5cdGV4ZWN1dGVPbmNlKGV4ZWN1dG9yKVxufVxuUHJvbWlzZVBvbHlmaWxsLnByb3RvdHlwZS50aGVuID0gZnVuY3Rpb24ob25GdWxmaWxsZWQsIG9uUmVqZWN0aW9uKSB7XG5cdHZhciBzZWxmID0gdGhpcywgaW5zdGFuY2UgPSBzZWxmLl9pbnN0YW5jZVxuXHRmdW5jdGlvbiBoYW5kbGUoY2FsbGJhY2ssIGxpc3QsIG5leHQsIHN0YXRlKSB7XG5cdFx0bGlzdC5wdXNoKGZ1bmN0aW9uKHZhbHVlKSB7XG5cdFx0XHRpZiAodHlwZW9mIGNhbGxiYWNrICE9PSBcImZ1bmN0aW9uXCIpIG5leHQodmFsdWUpXG5cdFx0XHRlbHNlIHRyeSB7cmVzb2x2ZU5leHQoY2FsbGJhY2sodmFsdWUpKX0gY2F0Y2ggKGUpIHtpZiAocmVqZWN0TmV4dCkgcmVqZWN0TmV4dChlKX1cblx0XHR9KVxuXHRcdGlmICh0eXBlb2YgaW5zdGFuY2UucmV0cnkgPT09IFwiZnVuY3Rpb25cIiAmJiBzdGF0ZSA9PT0gaW5zdGFuY2Uuc3RhdGUpIGluc3RhbmNlLnJldHJ5KClcblx0fVxuXHR2YXIgcmVzb2x2ZU5leHQsIHJlamVjdE5leHRcblx0dmFyIHByb21pc2UgPSBuZXcgUHJvbWlzZVBvbHlmaWxsKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge3Jlc29sdmVOZXh0ID0gcmVzb2x2ZSwgcmVqZWN0TmV4dCA9IHJlamVjdH0pXG5cdGhhbmRsZShvbkZ1bGZpbGxlZCwgaW5zdGFuY2UucmVzb2x2ZXJzLCByZXNvbHZlTmV4dCwgdHJ1ZSksIGhhbmRsZShvblJlamVjdGlvbiwgaW5zdGFuY2UucmVqZWN0b3JzLCByZWplY3ROZXh0LCBmYWxzZSlcblx0cmV0dXJuIHByb21pc2Vcbn1cblByb21pc2VQb2x5ZmlsbC5wcm90b3R5cGUuY2F0Y2ggPSBmdW5jdGlvbihvblJlamVjdGlvbikge1xuXHRyZXR1cm4gdGhpcy50aGVuKG51bGwsIG9uUmVqZWN0aW9uKVxufVxuUHJvbWlzZVBvbHlmaWxsLnJlc29sdmUgPSBmdW5jdGlvbih2YWx1ZSkge1xuXHRpZiAodmFsdWUgaW5zdGFuY2VvZiBQcm9taXNlUG9seWZpbGwpIHJldHVybiB2YWx1ZVxuXHRyZXR1cm4gbmV3IFByb21pc2VQb2x5ZmlsbChmdW5jdGlvbihyZXNvbHZlKSB7cmVzb2x2ZSh2YWx1ZSl9KVxufVxuUHJvbWlzZVBvbHlmaWxsLnJlamVjdCA9IGZ1bmN0aW9uKHZhbHVlKSB7XG5cdHJldHVybiBuZXcgUHJvbWlzZVBvbHlmaWxsKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge3JlamVjdCh2YWx1ZSl9KVxufVxuUHJvbWlzZVBvbHlmaWxsLmFsbCA9IGZ1bmN0aW9uKGxpc3QpIHtcblx0cmV0dXJuIG5ldyBQcm9taXNlUG9seWZpbGwoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG5cdFx0dmFyIHRvdGFsID0gbGlzdC5sZW5ndGgsIGNvdW50ID0gMCwgdmFsdWVzID0gW11cblx0XHRpZiAobGlzdC5sZW5ndGggPT09IDApIHJlc29sdmUoW10pXG5cdFx0ZWxzZSBmb3IgKHZhciBpID0gMDsgaSA8IGxpc3QubGVuZ3RoOyBpKyspIHtcblx0XHRcdChmdW5jdGlvbihpKSB7XG5cdFx0XHRcdGZ1bmN0aW9uIGNvbnN1bWUodmFsdWUpIHtcblx0XHRcdFx0XHRjb3VudCsrXG5cdFx0XHRcdFx0dmFsdWVzW2ldID0gdmFsdWVcblx0XHRcdFx0XHRpZiAoY291bnQgPT09IHRvdGFsKSByZXNvbHZlKHZhbHVlcylcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAobGlzdFtpXSAhPSBudWxsICYmICh0eXBlb2YgbGlzdFtpXSA9PT0gXCJvYmplY3RcIiB8fCB0eXBlb2YgbGlzdFtpXSA9PT0gXCJmdW5jdGlvblwiKSAmJiB0eXBlb2YgbGlzdFtpXS50aGVuID09PSBcImZ1bmN0aW9uXCIpIHtcblx0XHRcdFx0XHRsaXN0W2ldLnRoZW4oY29uc3VtZSwgcmVqZWN0KVxuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2UgY29uc3VtZShsaXN0W2ldKVxuXHRcdFx0fSkoaSlcblx0XHR9XG5cdH0pXG59XG5Qcm9taXNlUG9seWZpbGwucmFjZSA9IGZ1bmN0aW9uKGxpc3QpIHtcblx0cmV0dXJuIG5ldyBQcm9taXNlUG9seWZpbGwoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBsaXN0Lmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRsaXN0W2ldLnRoZW4ocmVzb2x2ZSwgcmVqZWN0KVxuXHRcdH1cblx0fSlcbn1cbmlmICh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiKSB7XG5cdGlmICh0eXBlb2Ygd2luZG93LlByb21pc2UgPT09IFwidW5kZWZpbmVkXCIpIHdpbmRvdy5Qcm9taXNlID0gUHJvbWlzZVBvbHlmaWxsXG5cdHZhciBQcm9taXNlUG9seWZpbGwgPSB3aW5kb3cuUHJvbWlzZVxufSBlbHNlIGlmICh0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiKSB7XG5cdGlmICh0eXBlb2YgZ2xvYmFsLlByb21pc2UgPT09IFwidW5kZWZpbmVkXCIpIGdsb2JhbC5Qcm9taXNlID0gUHJvbWlzZVBvbHlmaWxsXG5cdHZhciBQcm9taXNlUG9seWZpbGwgPSBnbG9iYWwuUHJvbWlzZVxufSBlbHNlIHtcbn1cbnZhciBidWlsZFF1ZXJ5U3RyaW5nID0gZnVuY3Rpb24ob2JqZWN0KSB7XG5cdGlmIChPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwob2JqZWN0KSAhPT0gXCJbb2JqZWN0IE9iamVjdF1cIikgcmV0dXJuIFwiXCJcblx0dmFyIGFyZ3MgPSBbXVxuXHRmb3IgKHZhciBrZXkwIGluIG9iamVjdCkge1xuXHRcdGRlc3RydWN0dXJlKGtleTAsIG9iamVjdFtrZXkwXSlcblx0fVxuXHRyZXR1cm4gYXJncy5qb2luKFwiJlwiKVxuXHRmdW5jdGlvbiBkZXN0cnVjdHVyZShrZXkwLCB2YWx1ZSkge1xuXHRcdGlmIChBcnJheS5pc0FycmF5KHZhbHVlKSkge1xuXHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCB2YWx1ZS5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRkZXN0cnVjdHVyZShrZXkwICsgXCJbXCIgKyBpICsgXCJdXCIsIHZhbHVlW2ldKVxuXHRcdFx0fVxuXHRcdH1cblx0XHRlbHNlIGlmIChPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodmFsdWUpID09PSBcIltvYmplY3QgT2JqZWN0XVwiKSB7XG5cdFx0XHRmb3IgKHZhciBpIGluIHZhbHVlKSB7XG5cdFx0XHRcdGRlc3RydWN0dXJlKGtleTAgKyBcIltcIiArIGkgKyBcIl1cIiwgdmFsdWVbaV0pXG5cdFx0XHR9XG5cdFx0fVxuXHRcdGVsc2UgYXJncy5wdXNoKGVuY29kZVVSSUNvbXBvbmVudChrZXkwKSArICh2YWx1ZSAhPSBudWxsICYmIHZhbHVlICE9PSBcIlwiID8gXCI9XCIgKyBlbmNvZGVVUklDb21wb25lbnQodmFsdWUpIDogXCJcIikpXG5cdH1cbn1cbnZhciBGSUxFX1BST1RPQ09MX1JFR0VYID0gbmV3IFJlZ0V4cChcIl5maWxlOi8vXCIsIFwiaVwiKVxudmFyIF84ID0gZnVuY3Rpb24oJHdpbmRvdywgUHJvbWlzZSkge1xuXHR2YXIgY2FsbGJhY2tDb3VudCA9IDBcblx0dmFyIG9uY29tcGxldGlvblxuXHRmdW5jdGlvbiBzZXRDb21wbGV0aW9uQ2FsbGJhY2soY2FsbGJhY2spIHtvbmNvbXBsZXRpb24gPSBjYWxsYmFja31cblx0ZnVuY3Rpb24gZmluYWxpemVyKCkge1xuXHRcdHZhciBjb3VudCA9IDBcblx0XHRmdW5jdGlvbiBjb21wbGV0ZSgpIHtpZiAoLS1jb3VudCA9PT0gMCAmJiB0eXBlb2Ygb25jb21wbGV0aW9uID09PSBcImZ1bmN0aW9uXCIpIG9uY29tcGxldGlvbigpfVxuXHRcdHJldHVybiBmdW5jdGlvbiBmaW5hbGl6ZShwcm9taXNlMCkge1xuXHRcdFx0dmFyIHRoZW4wID0gcHJvbWlzZTAudGhlblxuXHRcdFx0cHJvbWlzZTAudGhlbiA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRjb3VudCsrXG5cdFx0XHRcdHZhciBuZXh0ID0gdGhlbjAuYXBwbHkocHJvbWlzZTAsIGFyZ3VtZW50cylcblx0XHRcdFx0bmV4dC50aGVuKGNvbXBsZXRlLCBmdW5jdGlvbihlKSB7XG5cdFx0XHRcdFx0Y29tcGxldGUoKVxuXHRcdFx0XHRcdGlmIChjb3VudCA9PT0gMCkgdGhyb3cgZVxuXHRcdFx0XHR9KVxuXHRcdFx0XHRyZXR1cm4gZmluYWxpemUobmV4dClcblx0XHRcdH1cblx0XHRcdHJldHVybiBwcm9taXNlMFxuXHRcdH1cblx0fVxuXHRmdW5jdGlvbiBub3JtYWxpemUoYXJncywgZXh0cmEpIHtcblx0XHRpZiAodHlwZW9mIGFyZ3MgPT09IFwic3RyaW5nXCIpIHtcblx0XHRcdHZhciB1cmwgPSBhcmdzXG5cdFx0XHRhcmdzID0gZXh0cmEgfHwge31cblx0XHRcdGlmIChhcmdzLnVybCA9PSBudWxsKSBhcmdzLnVybCA9IHVybFxuXHRcdH1cblx0XHRyZXR1cm4gYXJnc1xuXHR9XG5cdGZ1bmN0aW9uIHJlcXVlc3QoYXJncywgZXh0cmEpIHtcblx0XHR2YXIgZmluYWxpemUgPSBmaW5hbGl6ZXIoKVxuXHRcdGFyZ3MgPSBub3JtYWxpemUoYXJncywgZXh0cmEpXG5cdFx0dmFyIHByb21pc2UwID0gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG5cdFx0XHRpZiAoYXJncy5tZXRob2QgPT0gbnVsbCkgYXJncy5tZXRob2QgPSBcIkdFVFwiXG5cdFx0XHRhcmdzLm1ldGhvZCA9IGFyZ3MubWV0aG9kLnRvVXBwZXJDYXNlKClcblx0XHRcdHZhciB1c2VCb2R5ID0gKGFyZ3MubWV0aG9kID09PSBcIkdFVFwiIHx8IGFyZ3MubWV0aG9kID09PSBcIlRSQUNFXCIpID8gZmFsc2UgOiAodHlwZW9mIGFyZ3MudXNlQm9keSA9PT0gXCJib29sZWFuXCIgPyBhcmdzLnVzZUJvZHkgOiB0cnVlKVxuXHRcdFx0aWYgKHR5cGVvZiBhcmdzLnNlcmlhbGl6ZSAhPT0gXCJmdW5jdGlvblwiKSBhcmdzLnNlcmlhbGl6ZSA9IHR5cGVvZiBGb3JtRGF0YSAhPT0gXCJ1bmRlZmluZWRcIiAmJiBhcmdzLmRhdGEgaW5zdGFuY2VvZiBGb3JtRGF0YSA/IGZ1bmN0aW9uKHZhbHVlKSB7cmV0dXJuIHZhbHVlfSA6IEpTT04uc3RyaW5naWZ5XG5cdFx0XHRpZiAodHlwZW9mIGFyZ3MuZGVzZXJpYWxpemUgIT09IFwiZnVuY3Rpb25cIikgYXJncy5kZXNlcmlhbGl6ZSA9IGRlc2VyaWFsaXplXG5cdFx0XHRpZiAodHlwZW9mIGFyZ3MuZXh0cmFjdCAhPT0gXCJmdW5jdGlvblwiKSBhcmdzLmV4dHJhY3QgPSBleHRyYWN0XG5cdFx0XHRhcmdzLnVybCA9IGludGVycG9sYXRlKGFyZ3MudXJsLCBhcmdzLmRhdGEpXG5cdFx0XHRpZiAodXNlQm9keSkgYXJncy5kYXRhID0gYXJncy5zZXJpYWxpemUoYXJncy5kYXRhKVxuXHRcdFx0ZWxzZSBhcmdzLnVybCA9IGFzc2VtYmxlKGFyZ3MudXJsLCBhcmdzLmRhdGEpXG5cdFx0XHR2YXIgeGhyID0gbmV3ICR3aW5kb3cuWE1MSHR0cFJlcXVlc3QoKSxcblx0XHRcdFx0YWJvcnRlZCA9IGZhbHNlLFxuXHRcdFx0XHRfYWJvcnQgPSB4aHIuYWJvcnRcblx0XHRcdHhoci5hYm9ydCA9IGZ1bmN0aW9uIGFib3J0KCkge1xuXHRcdFx0XHRhYm9ydGVkID0gdHJ1ZVxuXHRcdFx0XHRfYWJvcnQuY2FsbCh4aHIpXG5cdFx0XHR9XG5cdFx0XHR4aHIub3BlbihhcmdzLm1ldGhvZCwgYXJncy51cmwsIHR5cGVvZiBhcmdzLmFzeW5jID09PSBcImJvb2xlYW5cIiA/IGFyZ3MuYXN5bmMgOiB0cnVlLCB0eXBlb2YgYXJncy51c2VyID09PSBcInN0cmluZ1wiID8gYXJncy51c2VyIDogdW5kZWZpbmVkLCB0eXBlb2YgYXJncy5wYXNzd29yZCA9PT0gXCJzdHJpbmdcIiA/IGFyZ3MucGFzc3dvcmQgOiB1bmRlZmluZWQpXG5cdFx0XHRpZiAoYXJncy5zZXJpYWxpemUgPT09IEpTT04uc3RyaW5naWZ5ICYmIHVzZUJvZHkpIHtcblx0XHRcdFx0eGhyLnNldFJlcXVlc3RIZWFkZXIoXCJDb250ZW50LVR5cGVcIiwgXCJhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04XCIpXG5cdFx0XHR9XG5cdFx0XHRpZiAoYXJncy5kZXNlcmlhbGl6ZSA9PT0gZGVzZXJpYWxpemUpIHtcblx0XHRcdFx0eGhyLnNldFJlcXVlc3RIZWFkZXIoXCJBY2NlcHRcIiwgXCJhcHBsaWNhdGlvbi9qc29uLCB0ZXh0LypcIilcblx0XHRcdH1cblx0XHRcdGlmIChhcmdzLndpdGhDcmVkZW50aWFscykgeGhyLndpdGhDcmVkZW50aWFscyA9IGFyZ3Mud2l0aENyZWRlbnRpYWxzXG5cdFx0XHRmb3IgKHZhciBrZXkgaW4gYXJncy5oZWFkZXJzKSBpZiAoe30uaGFzT3duUHJvcGVydHkuY2FsbChhcmdzLmhlYWRlcnMsIGtleSkpIHtcblx0XHRcdFx0eGhyLnNldFJlcXVlc3RIZWFkZXIoa2V5LCBhcmdzLmhlYWRlcnNba2V5XSlcblx0XHRcdH1cblx0XHRcdGlmICh0eXBlb2YgYXJncy5jb25maWcgPT09IFwiZnVuY3Rpb25cIikgeGhyID0gYXJncy5jb25maWcoeGhyLCBhcmdzKSB8fCB4aHJcblx0XHRcdHhoci5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbigpIHtcblx0XHRcdFx0Ly8gRG9uJ3QgdGhyb3cgZXJyb3JzIG9uIHhoci5hYm9ydCgpLlxuXHRcdFx0XHRpZihhYm9ydGVkKSByZXR1cm5cblx0XHRcdFx0aWYgKHhoci5yZWFkeVN0YXRlID09PSA0KSB7XG5cdFx0XHRcdFx0dHJ5IHtcblx0XHRcdFx0XHRcdHZhciByZXNwb25zZSA9IChhcmdzLmV4dHJhY3QgIT09IGV4dHJhY3QpID8gYXJncy5leHRyYWN0KHhociwgYXJncykgOiBhcmdzLmRlc2VyaWFsaXplKGFyZ3MuZXh0cmFjdCh4aHIsIGFyZ3MpKVxuXHRcdFx0XHRcdFx0aWYgKCh4aHIuc3RhdHVzID49IDIwMCAmJiB4aHIuc3RhdHVzIDwgMzAwKSB8fCB4aHIuc3RhdHVzID09PSAzMDQgfHwgRklMRV9QUk9UT0NPTF9SRUdFWC50ZXN0KGFyZ3MudXJsKSkge1xuXHRcdFx0XHRcdFx0XHRyZXNvbHZlKGNhc3QoYXJncy50eXBlLCByZXNwb25zZSkpXG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHRcdFx0dmFyIGVycm9yID0gbmV3IEVycm9yKHhoci5yZXNwb25zZVRleHQpXG5cdFx0XHRcdFx0XHRcdGZvciAodmFyIGtleSBpbiByZXNwb25zZSkgZXJyb3Jba2V5XSA9IHJlc3BvbnNlW2tleV1cblx0XHRcdFx0XHRcdFx0cmVqZWN0KGVycm9yKVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRjYXRjaCAoZSkge1xuXHRcdFx0XHRcdFx0cmVqZWN0KGUpXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRpZiAodXNlQm9keSAmJiAoYXJncy5kYXRhICE9IG51bGwpKSB4aHIuc2VuZChhcmdzLmRhdGEpXG5cdFx0XHRlbHNlIHhoci5zZW5kKClcblx0XHR9KVxuXHRcdHJldHVybiBhcmdzLmJhY2tncm91bmQgPT09IHRydWUgPyBwcm9taXNlMCA6IGZpbmFsaXplKHByb21pc2UwKVxuXHR9XG5cdGZ1bmN0aW9uIGpzb25wKGFyZ3MsIGV4dHJhKSB7XG5cdFx0dmFyIGZpbmFsaXplID0gZmluYWxpemVyKClcblx0XHRhcmdzID0gbm9ybWFsaXplKGFyZ3MsIGV4dHJhKVxuXHRcdHZhciBwcm9taXNlMCA9IG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuXHRcdFx0dmFyIGNhbGxiYWNrTmFtZSA9IGFyZ3MuY2FsbGJhY2tOYW1lIHx8IFwiX21pdGhyaWxfXCIgKyBNYXRoLnJvdW5kKE1hdGgucmFuZG9tKCkgKiAxZTE2KSArIFwiX1wiICsgY2FsbGJhY2tDb3VudCsrXG5cdFx0XHR2YXIgc2NyaXB0ID0gJHdpbmRvdy5kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic2NyaXB0XCIpXG5cdFx0XHQkd2luZG93W2NhbGxiYWNrTmFtZV0gPSBmdW5jdGlvbihkYXRhKSB7XG5cdFx0XHRcdHNjcmlwdC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHNjcmlwdClcblx0XHRcdFx0cmVzb2x2ZShjYXN0KGFyZ3MudHlwZSwgZGF0YSkpXG5cdFx0XHRcdGRlbGV0ZSAkd2luZG93W2NhbGxiYWNrTmFtZV1cblx0XHRcdH1cblx0XHRcdHNjcmlwdC5vbmVycm9yID0gZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHNjcmlwdC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHNjcmlwdClcblx0XHRcdFx0cmVqZWN0KG5ldyBFcnJvcihcIkpTT05QIHJlcXVlc3QgZmFpbGVkXCIpKVxuXHRcdFx0XHRkZWxldGUgJHdpbmRvd1tjYWxsYmFja05hbWVdXG5cdFx0XHR9XG5cdFx0XHRpZiAoYXJncy5kYXRhID09IG51bGwpIGFyZ3MuZGF0YSA9IHt9XG5cdFx0XHRhcmdzLnVybCA9IGludGVycG9sYXRlKGFyZ3MudXJsLCBhcmdzLmRhdGEpXG5cdFx0XHRhcmdzLmRhdGFbYXJncy5jYWxsYmFja0tleSB8fCBcImNhbGxiYWNrXCJdID0gY2FsbGJhY2tOYW1lXG5cdFx0XHRzY3JpcHQuc3JjID0gYXNzZW1ibGUoYXJncy51cmwsIGFyZ3MuZGF0YSlcblx0XHRcdCR3aW5kb3cuZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmFwcGVuZENoaWxkKHNjcmlwdClcblx0XHR9KVxuXHRcdHJldHVybiBhcmdzLmJhY2tncm91bmQgPT09IHRydWU/IHByb21pc2UwIDogZmluYWxpemUocHJvbWlzZTApXG5cdH1cblx0ZnVuY3Rpb24gaW50ZXJwb2xhdGUodXJsLCBkYXRhKSB7XG5cdFx0aWYgKGRhdGEgPT0gbnVsbCkgcmV0dXJuIHVybFxuXHRcdHZhciB0b2tlbnMgPSB1cmwubWF0Y2goLzpbXlxcL10rL2dpKSB8fCBbXVxuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgdG9rZW5zLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHR2YXIga2V5ID0gdG9rZW5zW2ldLnNsaWNlKDEpXG5cdFx0XHRpZiAoZGF0YVtrZXldICE9IG51bGwpIHtcblx0XHRcdFx0dXJsID0gdXJsLnJlcGxhY2UodG9rZW5zW2ldLCBkYXRhW2tleV0pXG5cdFx0XHR9XG5cdFx0fVxuXHRcdHJldHVybiB1cmxcblx0fVxuXHRmdW5jdGlvbiBhc3NlbWJsZSh1cmwsIGRhdGEpIHtcblx0XHR2YXIgcXVlcnlzdHJpbmcgPSBidWlsZFF1ZXJ5U3RyaW5nKGRhdGEpXG5cdFx0aWYgKHF1ZXJ5c3RyaW5nICE9PSBcIlwiKSB7XG5cdFx0XHR2YXIgcHJlZml4ID0gdXJsLmluZGV4T2YoXCI/XCIpIDwgMCA/IFwiP1wiIDogXCImXCJcblx0XHRcdHVybCArPSBwcmVmaXggKyBxdWVyeXN0cmluZ1xuXHRcdH1cblx0XHRyZXR1cm4gdXJsXG5cdH1cblx0ZnVuY3Rpb24gZGVzZXJpYWxpemUoZGF0YSkge1xuXHRcdHRyeSB7cmV0dXJuIGRhdGEgIT09IFwiXCIgPyBKU09OLnBhcnNlKGRhdGEpIDogbnVsbH1cblx0XHRjYXRjaCAoZSkge3Rocm93IG5ldyBFcnJvcihkYXRhKX1cblx0fVxuXHRmdW5jdGlvbiBleHRyYWN0KHhocikge3JldHVybiB4aHIucmVzcG9uc2VUZXh0fVxuXHRmdW5jdGlvbiBjYXN0KHR5cGUwLCBkYXRhKSB7XG5cdFx0aWYgKHR5cGVvZiB0eXBlMCA9PT0gXCJmdW5jdGlvblwiKSB7XG5cdFx0XHRpZiAoQXJyYXkuaXNBcnJheShkYXRhKSkge1xuXHRcdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGRhdGEubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0XHRkYXRhW2ldID0gbmV3IHR5cGUwKGRhdGFbaV0pXG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdGVsc2UgcmV0dXJuIG5ldyB0eXBlMChkYXRhKVxuXHRcdH1cblx0XHRyZXR1cm4gZGF0YVxuXHR9XG5cdHJldHVybiB7cmVxdWVzdDogcmVxdWVzdCwganNvbnA6IGpzb25wLCBzZXRDb21wbGV0aW9uQ2FsbGJhY2s6IHNldENvbXBsZXRpb25DYWxsYmFja31cbn1cbnZhciByZXF1ZXN0U2VydmljZSA9IF84KHdpbmRvdywgUHJvbWlzZVBvbHlmaWxsKVxudmFyIGNvcmVSZW5kZXJlciA9IGZ1bmN0aW9uKCR3aW5kb3cpIHtcblx0dmFyICRkb2MgPSAkd2luZG93LmRvY3VtZW50XG5cdHZhciAkZW1wdHlGcmFnbWVudCA9ICRkb2MuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpXG5cdHZhciBuYW1lU3BhY2UgPSB7XG5cdFx0c3ZnOiBcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIsXG5cdFx0bWF0aDogXCJodHRwOi8vd3d3LnczLm9yZy8xOTk4L01hdGgvTWF0aE1MXCJcblx0fVxuXHR2YXIgb25ldmVudFxuXHRmdW5jdGlvbiBzZXRFdmVudENhbGxiYWNrKGNhbGxiYWNrKSB7cmV0dXJuIG9uZXZlbnQgPSBjYWxsYmFja31cblx0ZnVuY3Rpb24gZ2V0TmFtZVNwYWNlKHZub2RlKSB7XG5cdFx0cmV0dXJuIHZub2RlLmF0dHJzICYmIHZub2RlLmF0dHJzLnhtbG5zIHx8IG5hbWVTcGFjZVt2bm9kZS50YWddXG5cdH1cblx0Ly9jcmVhdGVcblx0ZnVuY3Rpb24gY3JlYXRlTm9kZXMocGFyZW50LCB2bm9kZXMsIHN0YXJ0LCBlbmQsIGhvb2tzLCBuZXh0U2libGluZywgbnMpIHtcblx0XHRmb3IgKHZhciBpID0gc3RhcnQ7IGkgPCBlbmQ7IGkrKykge1xuXHRcdFx0dmFyIHZub2RlID0gdm5vZGVzW2ldXG5cdFx0XHRpZiAodm5vZGUgIT0gbnVsbCkge1xuXHRcdFx0XHRjcmVhdGVOb2RlKHBhcmVudCwgdm5vZGUsIGhvb2tzLCBucywgbmV4dFNpYmxpbmcpXG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cdGZ1bmN0aW9uIGNyZWF0ZU5vZGUocGFyZW50LCB2bm9kZSwgaG9va3MsIG5zLCBuZXh0U2libGluZykge1xuXHRcdHZhciB0YWcgPSB2bm9kZS50YWdcblx0XHRpZiAodHlwZW9mIHRhZyA9PT0gXCJzdHJpbmdcIikge1xuXHRcdFx0dm5vZGUuc3RhdGUgPSB7fVxuXHRcdFx0aWYgKHZub2RlLmF0dHJzICE9IG51bGwpIGluaXRMaWZlY3ljbGUodm5vZGUuYXR0cnMsIHZub2RlLCBob29rcylcblx0XHRcdHN3aXRjaCAodGFnKSB7XG5cdFx0XHRcdGNhc2UgXCIjXCI6IHJldHVybiBjcmVhdGVUZXh0KHBhcmVudCwgdm5vZGUsIG5leHRTaWJsaW5nKVxuXHRcdFx0XHRjYXNlIFwiPFwiOiByZXR1cm4gY3JlYXRlSFRNTChwYXJlbnQsIHZub2RlLCBuZXh0U2libGluZylcblx0XHRcdFx0Y2FzZSBcIltcIjogcmV0dXJuIGNyZWF0ZUZyYWdtZW50KHBhcmVudCwgdm5vZGUsIGhvb2tzLCBucywgbmV4dFNpYmxpbmcpXG5cdFx0XHRcdGRlZmF1bHQ6IHJldHVybiBjcmVhdGVFbGVtZW50KHBhcmVudCwgdm5vZGUsIGhvb2tzLCBucywgbmV4dFNpYmxpbmcpXG5cdFx0XHR9XG5cdFx0fVxuXHRcdGVsc2UgcmV0dXJuIGNyZWF0ZUNvbXBvbmVudChwYXJlbnQsIHZub2RlLCBob29rcywgbnMsIG5leHRTaWJsaW5nKVxuXHR9XG5cdGZ1bmN0aW9uIGNyZWF0ZVRleHQocGFyZW50LCB2bm9kZSwgbmV4dFNpYmxpbmcpIHtcblx0XHR2bm9kZS5kb20gPSAkZG9jLmNyZWF0ZVRleHROb2RlKHZub2RlLmNoaWxkcmVuKVxuXHRcdGluc2VydE5vZGUocGFyZW50LCB2bm9kZS5kb20sIG5leHRTaWJsaW5nKVxuXHRcdHJldHVybiB2bm9kZS5kb21cblx0fVxuXHRmdW5jdGlvbiBjcmVhdGVIVE1MKHBhcmVudCwgdm5vZGUsIG5leHRTaWJsaW5nKSB7XG5cdFx0dmFyIG1hdGNoMSA9IHZub2RlLmNoaWxkcmVuLm1hdGNoKC9eXFxzKj88KFxcdyspL2ltKSB8fCBbXVxuXHRcdHZhciBwYXJlbnQxID0ge2NhcHRpb246IFwidGFibGVcIiwgdGhlYWQ6IFwidGFibGVcIiwgdGJvZHk6IFwidGFibGVcIiwgdGZvb3Q6IFwidGFibGVcIiwgdHI6IFwidGJvZHlcIiwgdGg6IFwidHJcIiwgdGQ6IFwidHJcIiwgY29sZ3JvdXA6IFwidGFibGVcIiwgY29sOiBcImNvbGdyb3VwXCJ9W21hdGNoMVsxXV0gfHwgXCJkaXZcIlxuXHRcdHZhciB0ZW1wID0gJGRvYy5jcmVhdGVFbGVtZW50KHBhcmVudDEpXG5cdFx0dGVtcC5pbm5lckhUTUwgPSB2bm9kZS5jaGlsZHJlblxuXHRcdHZub2RlLmRvbSA9IHRlbXAuZmlyc3RDaGlsZFxuXHRcdHZub2RlLmRvbVNpemUgPSB0ZW1wLmNoaWxkTm9kZXMubGVuZ3RoXG5cdFx0dmFyIGZyYWdtZW50ID0gJGRvYy5jcmVhdGVEb2N1bWVudEZyYWdtZW50KClcblx0XHR2YXIgY2hpbGRcblx0XHR3aGlsZSAoY2hpbGQgPSB0ZW1wLmZpcnN0Q2hpbGQpIHtcblx0XHRcdGZyYWdtZW50LmFwcGVuZENoaWxkKGNoaWxkKVxuXHRcdH1cblx0XHRpbnNlcnROb2RlKHBhcmVudCwgZnJhZ21lbnQsIG5leHRTaWJsaW5nKVxuXHRcdHJldHVybiBmcmFnbWVudFxuXHR9XG5cdGZ1bmN0aW9uIGNyZWF0ZUZyYWdtZW50KHBhcmVudCwgdm5vZGUsIGhvb2tzLCBucywgbmV4dFNpYmxpbmcpIHtcblx0XHR2YXIgZnJhZ21lbnQgPSAkZG9jLmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKVxuXHRcdGlmICh2bm9kZS5jaGlsZHJlbiAhPSBudWxsKSB7XG5cdFx0XHR2YXIgY2hpbGRyZW4gPSB2bm9kZS5jaGlsZHJlblxuXHRcdFx0Y3JlYXRlTm9kZXMoZnJhZ21lbnQsIGNoaWxkcmVuLCAwLCBjaGlsZHJlbi5sZW5ndGgsIGhvb2tzLCBudWxsLCBucylcblx0XHR9XG5cdFx0dm5vZGUuZG9tID0gZnJhZ21lbnQuZmlyc3RDaGlsZFxuXHRcdHZub2RlLmRvbVNpemUgPSBmcmFnbWVudC5jaGlsZE5vZGVzLmxlbmd0aFxuXHRcdGluc2VydE5vZGUocGFyZW50LCBmcmFnbWVudCwgbmV4dFNpYmxpbmcpXG5cdFx0cmV0dXJuIGZyYWdtZW50XG5cdH1cblx0ZnVuY3Rpb24gY3JlYXRlRWxlbWVudChwYXJlbnQsIHZub2RlLCBob29rcywgbnMsIG5leHRTaWJsaW5nKSB7XG5cdFx0dmFyIHRhZyA9IHZub2RlLnRhZ1xuXHRcdHZhciBhdHRyczIgPSB2bm9kZS5hdHRyc1xuXHRcdHZhciBpcyA9IGF0dHJzMiAmJiBhdHRyczIuaXNcblx0XHRucyA9IGdldE5hbWVTcGFjZSh2bm9kZSkgfHwgbnNcblx0XHR2YXIgZWxlbWVudCA9IG5zID9cblx0XHRcdGlzID8gJGRvYy5jcmVhdGVFbGVtZW50TlMobnMsIHRhZywge2lzOiBpc30pIDogJGRvYy5jcmVhdGVFbGVtZW50TlMobnMsIHRhZykgOlxuXHRcdFx0aXMgPyAkZG9jLmNyZWF0ZUVsZW1lbnQodGFnLCB7aXM6IGlzfSkgOiAkZG9jLmNyZWF0ZUVsZW1lbnQodGFnKVxuXHRcdHZub2RlLmRvbSA9IGVsZW1lbnRcblx0XHRpZiAoYXR0cnMyICE9IG51bGwpIHtcblx0XHRcdHNldEF0dHJzKHZub2RlLCBhdHRyczIsIG5zKVxuXHRcdH1cblx0XHRpbnNlcnROb2RlKHBhcmVudCwgZWxlbWVudCwgbmV4dFNpYmxpbmcpXG5cdFx0aWYgKHZub2RlLmF0dHJzICE9IG51bGwgJiYgdm5vZGUuYXR0cnMuY29udGVudGVkaXRhYmxlICE9IG51bGwpIHtcblx0XHRcdHNldENvbnRlbnRFZGl0YWJsZSh2bm9kZSlcblx0XHR9XG5cdFx0ZWxzZSB7XG5cdFx0XHRpZiAodm5vZGUudGV4dCAhPSBudWxsKSB7XG5cdFx0XHRcdGlmICh2bm9kZS50ZXh0ICE9PSBcIlwiKSBlbGVtZW50LnRleHRDb250ZW50ID0gdm5vZGUudGV4dFxuXHRcdFx0XHRlbHNlIHZub2RlLmNoaWxkcmVuID0gW1Zub2RlKFwiI1wiLCB1bmRlZmluZWQsIHVuZGVmaW5lZCwgdm5vZGUudGV4dCwgdW5kZWZpbmVkLCB1bmRlZmluZWQpXVxuXHRcdFx0fVxuXHRcdFx0aWYgKHZub2RlLmNoaWxkcmVuICE9IG51bGwpIHtcblx0XHRcdFx0dmFyIGNoaWxkcmVuID0gdm5vZGUuY2hpbGRyZW5cblx0XHRcdFx0Y3JlYXRlTm9kZXMoZWxlbWVudCwgY2hpbGRyZW4sIDAsIGNoaWxkcmVuLmxlbmd0aCwgaG9va3MsIG51bGwsIG5zKVxuXHRcdFx0XHRzZXRMYXRlQXR0cnModm5vZGUpXG5cdFx0XHR9XG5cdFx0fVxuXHRcdHJldHVybiBlbGVtZW50XG5cdH1cblx0ZnVuY3Rpb24gaW5pdENvbXBvbmVudCh2bm9kZSwgaG9va3MpIHtcblx0XHR2YXIgc2VudGluZWxcblx0XHRpZiAodHlwZW9mIHZub2RlLnRhZy52aWV3ID09PSBcImZ1bmN0aW9uXCIpIHtcblx0XHRcdHZub2RlLnN0YXRlID0gT2JqZWN0LmNyZWF0ZSh2bm9kZS50YWcpXG5cdFx0XHRzZW50aW5lbCA9IHZub2RlLnN0YXRlLnZpZXdcblx0XHRcdGlmIChzZW50aW5lbC4kJHJlZW50cmFudExvY2skJCAhPSBudWxsKSByZXR1cm4gJGVtcHR5RnJhZ21lbnRcblx0XHRcdHNlbnRpbmVsLiQkcmVlbnRyYW50TG9jayQkID0gdHJ1ZVxuXHRcdH0gZWxzZSB7XG5cdFx0XHR2bm9kZS5zdGF0ZSA9IHZvaWQgMFxuXHRcdFx0c2VudGluZWwgPSB2bm9kZS50YWdcblx0XHRcdGlmIChzZW50aW5lbC4kJHJlZW50cmFudExvY2skJCAhPSBudWxsKSByZXR1cm4gJGVtcHR5RnJhZ21lbnRcblx0XHRcdHNlbnRpbmVsLiQkcmVlbnRyYW50TG9jayQkID0gdHJ1ZVxuXHRcdFx0dm5vZGUuc3RhdGUgPSAodm5vZGUudGFnLnByb3RvdHlwZSAhPSBudWxsICYmIHR5cGVvZiB2bm9kZS50YWcucHJvdG90eXBlLnZpZXcgPT09IFwiZnVuY3Rpb25cIikgPyBuZXcgdm5vZGUudGFnKHZub2RlKSA6IHZub2RlLnRhZyh2bm9kZSlcblx0XHR9XG5cdFx0dm5vZGUuX3N0YXRlID0gdm5vZGUuc3RhdGVcblx0XHRpZiAodm5vZGUuYXR0cnMgIT0gbnVsbCkgaW5pdExpZmVjeWNsZSh2bm9kZS5hdHRycywgdm5vZGUsIGhvb2tzKVxuXHRcdGluaXRMaWZlY3ljbGUodm5vZGUuX3N0YXRlLCB2bm9kZSwgaG9va3MpXG5cdFx0dm5vZGUuaW5zdGFuY2UgPSBWbm9kZS5ub3JtYWxpemUodm5vZGUuX3N0YXRlLnZpZXcuY2FsbCh2bm9kZS5zdGF0ZSwgdm5vZGUpKVxuXHRcdGlmICh2bm9kZS5pbnN0YW5jZSA9PT0gdm5vZGUpIHRocm93IEVycm9yKFwiQSB2aWV3IGNhbm5vdCByZXR1cm4gdGhlIHZub2RlIGl0IHJlY2VpdmVkIGFzIGFyZ3VtZW50XCIpXG5cdFx0c2VudGluZWwuJCRyZWVudHJhbnRMb2NrJCQgPSBudWxsXG5cdH1cblx0ZnVuY3Rpb24gY3JlYXRlQ29tcG9uZW50KHBhcmVudCwgdm5vZGUsIGhvb2tzLCBucywgbmV4dFNpYmxpbmcpIHtcblx0XHRpbml0Q29tcG9uZW50KHZub2RlLCBob29rcylcblx0XHRpZiAodm5vZGUuaW5zdGFuY2UgIT0gbnVsbCkge1xuXHRcdFx0dmFyIGVsZW1lbnQgPSBjcmVhdGVOb2RlKHBhcmVudCwgdm5vZGUuaW5zdGFuY2UsIGhvb2tzLCBucywgbmV4dFNpYmxpbmcpXG5cdFx0XHR2bm9kZS5kb20gPSB2bm9kZS5pbnN0YW5jZS5kb21cblx0XHRcdHZub2RlLmRvbVNpemUgPSB2bm9kZS5kb20gIT0gbnVsbCA/IHZub2RlLmluc3RhbmNlLmRvbVNpemUgOiAwXG5cdFx0XHRpbnNlcnROb2RlKHBhcmVudCwgZWxlbWVudCwgbmV4dFNpYmxpbmcpXG5cdFx0XHRyZXR1cm4gZWxlbWVudFxuXHRcdH1cblx0XHRlbHNlIHtcblx0XHRcdHZub2RlLmRvbVNpemUgPSAwXG5cdFx0XHRyZXR1cm4gJGVtcHR5RnJhZ21lbnRcblx0XHR9XG5cdH1cblx0Ly91cGRhdGVcblx0ZnVuY3Rpb24gdXBkYXRlTm9kZXMocGFyZW50LCBvbGQsIHZub2RlcywgcmVjeWNsaW5nLCBob29rcywgbmV4dFNpYmxpbmcsIG5zKSB7XG5cdFx0aWYgKG9sZCA9PT0gdm5vZGVzIHx8IG9sZCA9PSBudWxsICYmIHZub2RlcyA9PSBudWxsKSByZXR1cm5cblx0XHRlbHNlIGlmIChvbGQgPT0gbnVsbCkgY3JlYXRlTm9kZXMocGFyZW50LCB2bm9kZXMsIDAsIHZub2Rlcy5sZW5ndGgsIGhvb2tzLCBuZXh0U2libGluZywgbnMpXG5cdFx0ZWxzZSBpZiAodm5vZGVzID09IG51bGwpIHJlbW92ZU5vZGVzKG9sZCwgMCwgb2xkLmxlbmd0aCwgdm5vZGVzKVxuXHRcdGVsc2Uge1xuXHRcdFx0aWYgKG9sZC5sZW5ndGggPT09IHZub2Rlcy5sZW5ndGgpIHtcblx0XHRcdFx0dmFyIGlzVW5rZXllZCA9IGZhbHNlXG5cdFx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgdm5vZGVzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdFx0aWYgKHZub2Rlc1tpXSAhPSBudWxsICYmIG9sZFtpXSAhPSBudWxsKSB7XG5cdFx0XHRcdFx0XHRpc1Vua2V5ZWQgPSB2bm9kZXNbaV0ua2V5ID09IG51bGwgJiYgb2xkW2ldLmtleSA9PSBudWxsXG5cdFx0XHRcdFx0XHRicmVha1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAoaXNVbmtleWVkKSB7XG5cdFx0XHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBvbGQubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0XHRcdGlmIChvbGRbaV0gPT09IHZub2Rlc1tpXSkgY29udGludWVcblx0XHRcdFx0XHRcdGVsc2UgaWYgKG9sZFtpXSA9PSBudWxsICYmIHZub2Rlc1tpXSAhPSBudWxsKSBjcmVhdGVOb2RlKHBhcmVudCwgdm5vZGVzW2ldLCBob29rcywgbnMsIGdldE5leHRTaWJsaW5nKG9sZCwgaSArIDEsIG5leHRTaWJsaW5nKSlcblx0XHRcdFx0XHRcdGVsc2UgaWYgKHZub2Rlc1tpXSA9PSBudWxsKSByZW1vdmVOb2RlcyhvbGQsIGksIGkgKyAxLCB2bm9kZXMpXG5cdFx0XHRcdFx0XHRlbHNlIHVwZGF0ZU5vZGUocGFyZW50LCBvbGRbaV0sIHZub2Rlc1tpXSwgaG9va3MsIGdldE5leHRTaWJsaW5nKG9sZCwgaSArIDEsIG5leHRTaWJsaW5nKSwgcmVjeWNsaW5nLCBucylcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0cmV0dXJuXG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdHJlY3ljbGluZyA9IHJlY3ljbGluZyB8fCBpc1JlY3ljbGFibGUob2xkLCB2bm9kZXMpXG5cdFx0XHRpZiAocmVjeWNsaW5nKSB7XG5cdFx0XHRcdHZhciBwb29sID0gb2xkLnBvb2xcblx0XHRcdFx0b2xkID0gb2xkLmNvbmNhdChvbGQucG9vbClcblx0XHRcdH1cblx0XHRcdHZhciBvbGRTdGFydCA9IDAsIHN0YXJ0ID0gMCwgb2xkRW5kID0gb2xkLmxlbmd0aCAtIDEsIGVuZCA9IHZub2Rlcy5sZW5ndGggLSAxLCBtYXBcblx0XHRcdHdoaWxlIChvbGRFbmQgPj0gb2xkU3RhcnQgJiYgZW5kID49IHN0YXJ0KSB7XG5cdFx0XHRcdHZhciBvID0gb2xkW29sZFN0YXJ0XSwgdiA9IHZub2Rlc1tzdGFydF1cblx0XHRcdFx0aWYgKG8gPT09IHYgJiYgIXJlY3ljbGluZykgb2xkU3RhcnQrKywgc3RhcnQrK1xuXHRcdFx0XHRlbHNlIGlmIChvID09IG51bGwpIG9sZFN0YXJ0Kytcblx0XHRcdFx0ZWxzZSBpZiAodiA9PSBudWxsKSBzdGFydCsrXG5cdFx0XHRcdGVsc2UgaWYgKG8ua2V5ID09PSB2LmtleSkge1xuXHRcdFx0XHRcdHZhciBzaG91bGRSZWN5Y2xlID0gKHBvb2wgIT0gbnVsbCAmJiBvbGRTdGFydCA+PSBvbGQubGVuZ3RoIC0gcG9vbC5sZW5ndGgpIHx8ICgocG9vbCA9PSBudWxsKSAmJiByZWN5Y2xpbmcpXG5cdFx0XHRcdFx0b2xkU3RhcnQrKywgc3RhcnQrK1xuXHRcdFx0XHRcdHVwZGF0ZU5vZGUocGFyZW50LCBvLCB2LCBob29rcywgZ2V0TmV4dFNpYmxpbmcob2xkLCBvbGRTdGFydCwgbmV4dFNpYmxpbmcpLCBzaG91bGRSZWN5Y2xlLCBucylcblx0XHRcdFx0XHRpZiAocmVjeWNsaW5nICYmIG8udGFnID09PSB2LnRhZykgaW5zZXJ0Tm9kZShwYXJlbnQsIHRvRnJhZ21lbnQobyksIG5leHRTaWJsaW5nKVxuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdHZhciBvID0gb2xkW29sZEVuZF1cblx0XHRcdFx0XHRpZiAobyA9PT0gdiAmJiAhcmVjeWNsaW5nKSBvbGRFbmQtLSwgc3RhcnQrK1xuXHRcdFx0XHRcdGVsc2UgaWYgKG8gPT0gbnVsbCkgb2xkRW5kLS1cblx0XHRcdFx0XHRlbHNlIGlmICh2ID09IG51bGwpIHN0YXJ0Kytcblx0XHRcdFx0XHRlbHNlIGlmIChvLmtleSA9PT0gdi5rZXkpIHtcblx0XHRcdFx0XHRcdHZhciBzaG91bGRSZWN5Y2xlID0gKHBvb2wgIT0gbnVsbCAmJiBvbGRFbmQgPj0gb2xkLmxlbmd0aCAtIHBvb2wubGVuZ3RoKSB8fCAoKHBvb2wgPT0gbnVsbCkgJiYgcmVjeWNsaW5nKVxuXHRcdFx0XHRcdFx0dXBkYXRlTm9kZShwYXJlbnQsIG8sIHYsIGhvb2tzLCBnZXROZXh0U2libGluZyhvbGQsIG9sZEVuZCArIDEsIG5leHRTaWJsaW5nKSwgc2hvdWxkUmVjeWNsZSwgbnMpXG5cdFx0XHRcdFx0XHRpZiAocmVjeWNsaW5nIHx8IHN0YXJ0IDwgZW5kKSBpbnNlcnROb2RlKHBhcmVudCwgdG9GcmFnbWVudChvKSwgZ2V0TmV4dFNpYmxpbmcob2xkLCBvbGRTdGFydCwgbmV4dFNpYmxpbmcpKVxuXHRcdFx0XHRcdFx0b2xkRW5kLS0sIHN0YXJ0Kytcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0ZWxzZSBicmVha1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHR3aGlsZSAob2xkRW5kID49IG9sZFN0YXJ0ICYmIGVuZCA+PSBzdGFydCkge1xuXHRcdFx0XHR2YXIgbyA9IG9sZFtvbGRFbmRdLCB2ID0gdm5vZGVzW2VuZF1cblx0XHRcdFx0aWYgKG8gPT09IHYgJiYgIXJlY3ljbGluZykgb2xkRW5kLS0sIGVuZC0tXG5cdFx0XHRcdGVsc2UgaWYgKG8gPT0gbnVsbCkgb2xkRW5kLS1cblx0XHRcdFx0ZWxzZSBpZiAodiA9PSBudWxsKSBlbmQtLVxuXHRcdFx0XHRlbHNlIGlmIChvLmtleSA9PT0gdi5rZXkpIHtcblx0XHRcdFx0XHR2YXIgc2hvdWxkUmVjeWNsZSA9IChwb29sICE9IG51bGwgJiYgb2xkRW5kID49IG9sZC5sZW5ndGggLSBwb29sLmxlbmd0aCkgfHwgKChwb29sID09IG51bGwpICYmIHJlY3ljbGluZylcblx0XHRcdFx0XHR1cGRhdGVOb2RlKHBhcmVudCwgbywgdiwgaG9va3MsIGdldE5leHRTaWJsaW5nKG9sZCwgb2xkRW5kICsgMSwgbmV4dFNpYmxpbmcpLCBzaG91bGRSZWN5Y2xlLCBucylcblx0XHRcdFx0XHRpZiAocmVjeWNsaW5nICYmIG8udGFnID09PSB2LnRhZykgaW5zZXJ0Tm9kZShwYXJlbnQsIHRvRnJhZ21lbnQobyksIG5leHRTaWJsaW5nKVxuXHRcdFx0XHRcdGlmIChvLmRvbSAhPSBudWxsKSBuZXh0U2libGluZyA9IG8uZG9tXG5cdFx0XHRcdFx0b2xkRW5kLS0sIGVuZC0tXG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0aWYgKCFtYXApIG1hcCA9IGdldEtleU1hcChvbGQsIG9sZEVuZClcblx0XHRcdFx0XHRpZiAodiAhPSBudWxsKSB7XG5cdFx0XHRcdFx0XHR2YXIgb2xkSW5kZXggPSBtYXBbdi5rZXldXG5cdFx0XHRcdFx0XHRpZiAob2xkSW5kZXggIT0gbnVsbCkge1xuXHRcdFx0XHRcdFx0XHR2YXIgbW92YWJsZSA9IG9sZFtvbGRJbmRleF1cblx0XHRcdFx0XHRcdFx0dmFyIHNob3VsZFJlY3ljbGUgPSAocG9vbCAhPSBudWxsICYmIG9sZEluZGV4ID49IG9sZC5sZW5ndGggLSBwb29sLmxlbmd0aCkgfHwgKChwb29sID09IG51bGwpICYmIHJlY3ljbGluZylcblx0XHRcdFx0XHRcdFx0dXBkYXRlTm9kZShwYXJlbnQsIG1vdmFibGUsIHYsIGhvb2tzLCBnZXROZXh0U2libGluZyhvbGQsIG9sZEVuZCArIDEsIG5leHRTaWJsaW5nKSwgcmVjeWNsaW5nLCBucylcblx0XHRcdFx0XHRcdFx0aW5zZXJ0Tm9kZShwYXJlbnQsIHRvRnJhZ21lbnQobW92YWJsZSksIG5leHRTaWJsaW5nKVxuXHRcdFx0XHRcdFx0XHRvbGRbb2xkSW5kZXhdLnNraXAgPSB0cnVlXG5cdFx0XHRcdFx0XHRcdGlmIChtb3ZhYmxlLmRvbSAhPSBudWxsKSBuZXh0U2libGluZyA9IG1vdmFibGUuZG9tXG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHRcdFx0dmFyIGRvbSA9IGNyZWF0ZU5vZGUocGFyZW50LCB2LCBob29rcywgbnMsIG5leHRTaWJsaW5nKVxuXHRcdFx0XHRcdFx0XHRuZXh0U2libGluZyA9IGRvbVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRlbmQtLVxuXHRcdFx0XHR9XG5cdFx0XHRcdGlmIChlbmQgPCBzdGFydCkgYnJlYWtcblx0XHRcdH1cblx0XHRcdGNyZWF0ZU5vZGVzKHBhcmVudCwgdm5vZGVzLCBzdGFydCwgZW5kICsgMSwgaG9va3MsIG5leHRTaWJsaW5nLCBucylcblx0XHRcdHJlbW92ZU5vZGVzKG9sZCwgb2xkU3RhcnQsIG9sZEVuZCArIDEsIHZub2Rlcylcblx0XHR9XG5cdH1cblx0ZnVuY3Rpb24gdXBkYXRlTm9kZShwYXJlbnQsIG9sZCwgdm5vZGUsIGhvb2tzLCBuZXh0U2libGluZywgcmVjeWNsaW5nLCBucykge1xuXHRcdHZhciBvbGRUYWcgPSBvbGQudGFnLCB0YWcgPSB2bm9kZS50YWdcblx0XHRpZiAob2xkVGFnID09PSB0YWcpIHtcblx0XHRcdHZub2RlLnN0YXRlID0gb2xkLnN0YXRlXG5cdFx0XHR2bm9kZS5fc3RhdGUgPSBvbGQuX3N0YXRlXG5cdFx0XHR2bm9kZS5ldmVudHMgPSBvbGQuZXZlbnRzXG5cdFx0XHRpZiAoIXJlY3ljbGluZyAmJiBzaG91bGROb3RVcGRhdGUodm5vZGUsIG9sZCkpIHJldHVyblxuXHRcdFx0aWYgKHR5cGVvZiBvbGRUYWcgPT09IFwic3RyaW5nXCIpIHtcblx0XHRcdFx0aWYgKHZub2RlLmF0dHJzICE9IG51bGwpIHtcblx0XHRcdFx0XHRpZiAocmVjeWNsaW5nKSB7XG5cdFx0XHRcdFx0XHR2bm9kZS5zdGF0ZSA9IHt9XG5cdFx0XHRcdFx0XHRpbml0TGlmZWN5Y2xlKHZub2RlLmF0dHJzLCB2bm9kZSwgaG9va3MpXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGVsc2UgdXBkYXRlTGlmZWN5Y2xlKHZub2RlLmF0dHJzLCB2bm9kZSwgaG9va3MpXG5cdFx0XHRcdH1cblx0XHRcdFx0c3dpdGNoIChvbGRUYWcpIHtcblx0XHRcdFx0XHRjYXNlIFwiI1wiOiB1cGRhdGVUZXh0KG9sZCwgdm5vZGUpOyBicmVha1xuXHRcdFx0XHRcdGNhc2UgXCI8XCI6IHVwZGF0ZUhUTUwocGFyZW50LCBvbGQsIHZub2RlLCBuZXh0U2libGluZyk7IGJyZWFrXG5cdFx0XHRcdFx0Y2FzZSBcIltcIjogdXBkYXRlRnJhZ21lbnQocGFyZW50LCBvbGQsIHZub2RlLCByZWN5Y2xpbmcsIGhvb2tzLCBuZXh0U2libGluZywgbnMpOyBicmVha1xuXHRcdFx0XHRcdGRlZmF1bHQ6IHVwZGF0ZUVsZW1lbnQob2xkLCB2bm9kZSwgcmVjeWNsaW5nLCBob29rcywgbnMpXG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdGVsc2UgdXBkYXRlQ29tcG9uZW50KHBhcmVudCwgb2xkLCB2bm9kZSwgaG9va3MsIG5leHRTaWJsaW5nLCByZWN5Y2xpbmcsIG5zKVxuXHRcdH1cblx0XHRlbHNlIHtcblx0XHRcdHJlbW92ZU5vZGUob2xkLCBudWxsKVxuXHRcdFx0Y3JlYXRlTm9kZShwYXJlbnQsIHZub2RlLCBob29rcywgbnMsIG5leHRTaWJsaW5nKVxuXHRcdH1cblx0fVxuXHRmdW5jdGlvbiB1cGRhdGVUZXh0KG9sZCwgdm5vZGUpIHtcblx0XHRpZiAob2xkLmNoaWxkcmVuLnRvU3RyaW5nKCkgIT09IHZub2RlLmNoaWxkcmVuLnRvU3RyaW5nKCkpIHtcblx0XHRcdG9sZC5kb20ubm9kZVZhbHVlID0gdm5vZGUuY2hpbGRyZW5cblx0XHR9XG5cdFx0dm5vZGUuZG9tID0gb2xkLmRvbVxuXHR9XG5cdGZ1bmN0aW9uIHVwZGF0ZUhUTUwocGFyZW50LCBvbGQsIHZub2RlLCBuZXh0U2libGluZykge1xuXHRcdGlmIChvbGQuY2hpbGRyZW4gIT09IHZub2RlLmNoaWxkcmVuKSB7XG5cdFx0XHR0b0ZyYWdtZW50KG9sZClcblx0XHRcdGNyZWF0ZUhUTUwocGFyZW50LCB2bm9kZSwgbmV4dFNpYmxpbmcpXG5cdFx0fVxuXHRcdGVsc2Ugdm5vZGUuZG9tID0gb2xkLmRvbSwgdm5vZGUuZG9tU2l6ZSA9IG9sZC5kb21TaXplXG5cdH1cblx0ZnVuY3Rpb24gdXBkYXRlRnJhZ21lbnQocGFyZW50LCBvbGQsIHZub2RlLCByZWN5Y2xpbmcsIGhvb2tzLCBuZXh0U2libGluZywgbnMpIHtcblx0XHR1cGRhdGVOb2RlcyhwYXJlbnQsIG9sZC5jaGlsZHJlbiwgdm5vZGUuY2hpbGRyZW4sIHJlY3ljbGluZywgaG9va3MsIG5leHRTaWJsaW5nLCBucylcblx0XHR2YXIgZG9tU2l6ZSA9IDAsIGNoaWxkcmVuID0gdm5vZGUuY2hpbGRyZW5cblx0XHR2bm9kZS5kb20gPSBudWxsXG5cdFx0aWYgKGNoaWxkcmVuICE9IG51bGwpIHtcblx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0dmFyIGNoaWxkID0gY2hpbGRyZW5baV1cblx0XHRcdFx0aWYgKGNoaWxkICE9IG51bGwgJiYgY2hpbGQuZG9tICE9IG51bGwpIHtcblx0XHRcdFx0XHRpZiAodm5vZGUuZG9tID09IG51bGwpIHZub2RlLmRvbSA9IGNoaWxkLmRvbVxuXHRcdFx0XHRcdGRvbVNpemUgKz0gY2hpbGQuZG9tU2l6ZSB8fCAxXG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdGlmIChkb21TaXplICE9PSAxKSB2bm9kZS5kb21TaXplID0gZG9tU2l6ZVxuXHRcdH1cblx0fVxuXHRmdW5jdGlvbiB1cGRhdGVFbGVtZW50KG9sZCwgdm5vZGUsIHJlY3ljbGluZywgaG9va3MsIG5zKSB7XG5cdFx0dmFyIGVsZW1lbnQgPSB2bm9kZS5kb20gPSBvbGQuZG9tXG5cdFx0bnMgPSBnZXROYW1lU3BhY2Uodm5vZGUpIHx8IG5zXG5cdFx0aWYgKHZub2RlLnRhZyA9PT0gXCJ0ZXh0YXJlYVwiKSB7XG5cdFx0XHRpZiAodm5vZGUuYXR0cnMgPT0gbnVsbCkgdm5vZGUuYXR0cnMgPSB7fVxuXHRcdFx0aWYgKHZub2RlLnRleHQgIT0gbnVsbCkge1xuXHRcdFx0XHR2bm9kZS5hdHRycy52YWx1ZSA9IHZub2RlLnRleHQgLy9GSVhNRSBoYW5kbGUwIG11bHRpcGxlIGNoaWxkcmVuXG5cdFx0XHRcdHZub2RlLnRleHQgPSB1bmRlZmluZWRcblx0XHRcdH1cblx0XHR9XG5cdFx0dXBkYXRlQXR0cnModm5vZGUsIG9sZC5hdHRycywgdm5vZGUuYXR0cnMsIG5zKVxuXHRcdGlmICh2bm9kZS5hdHRycyAhPSBudWxsICYmIHZub2RlLmF0dHJzLmNvbnRlbnRlZGl0YWJsZSAhPSBudWxsKSB7XG5cdFx0XHRzZXRDb250ZW50RWRpdGFibGUodm5vZGUpXG5cdFx0fVxuXHRcdGVsc2UgaWYgKG9sZC50ZXh0ICE9IG51bGwgJiYgdm5vZGUudGV4dCAhPSBudWxsICYmIHZub2RlLnRleHQgIT09IFwiXCIpIHtcblx0XHRcdGlmIChvbGQudGV4dC50b1N0cmluZygpICE9PSB2bm9kZS50ZXh0LnRvU3RyaW5nKCkpIG9sZC5kb20uZmlyc3RDaGlsZC5ub2RlVmFsdWUgPSB2bm9kZS50ZXh0XG5cdFx0fVxuXHRcdGVsc2Uge1xuXHRcdFx0aWYgKG9sZC50ZXh0ICE9IG51bGwpIG9sZC5jaGlsZHJlbiA9IFtWbm9kZShcIiNcIiwgdW5kZWZpbmVkLCB1bmRlZmluZWQsIG9sZC50ZXh0LCB1bmRlZmluZWQsIG9sZC5kb20uZmlyc3RDaGlsZCldXG5cdFx0XHRpZiAodm5vZGUudGV4dCAhPSBudWxsKSB2bm9kZS5jaGlsZHJlbiA9IFtWbm9kZShcIiNcIiwgdW5kZWZpbmVkLCB1bmRlZmluZWQsIHZub2RlLnRleHQsIHVuZGVmaW5lZCwgdW5kZWZpbmVkKV1cblx0XHRcdHVwZGF0ZU5vZGVzKGVsZW1lbnQsIG9sZC5jaGlsZHJlbiwgdm5vZGUuY2hpbGRyZW4sIHJlY3ljbGluZywgaG9va3MsIG51bGwsIG5zKVxuXHRcdH1cblx0fVxuXHRmdW5jdGlvbiB1cGRhdGVDb21wb25lbnQocGFyZW50LCBvbGQsIHZub2RlLCBob29rcywgbmV4dFNpYmxpbmcsIHJlY3ljbGluZywgbnMpIHtcblx0XHRpZiAocmVjeWNsaW5nKSB7XG5cdFx0XHRpbml0Q29tcG9uZW50KHZub2RlLCBob29rcylcblx0XHR9IGVsc2Uge1xuXHRcdFx0dm5vZGUuaW5zdGFuY2UgPSBWbm9kZS5ub3JtYWxpemUodm5vZGUuX3N0YXRlLnZpZXcuY2FsbCh2bm9kZS5zdGF0ZSwgdm5vZGUpKVxuXHRcdFx0aWYgKHZub2RlLmluc3RhbmNlID09PSB2bm9kZSkgdGhyb3cgRXJyb3IoXCJBIHZpZXcgY2Fubm90IHJldHVybiB0aGUgdm5vZGUgaXQgcmVjZWl2ZWQgYXMgYXJndW1lbnRcIilcblx0XHRcdGlmICh2bm9kZS5hdHRycyAhPSBudWxsKSB1cGRhdGVMaWZlY3ljbGUodm5vZGUuYXR0cnMsIHZub2RlLCBob29rcylcblx0XHRcdHVwZGF0ZUxpZmVjeWNsZSh2bm9kZS5fc3RhdGUsIHZub2RlLCBob29rcylcblx0XHR9XG5cdFx0aWYgKHZub2RlLmluc3RhbmNlICE9IG51bGwpIHtcblx0XHRcdGlmIChvbGQuaW5zdGFuY2UgPT0gbnVsbCkgY3JlYXRlTm9kZShwYXJlbnQsIHZub2RlLmluc3RhbmNlLCBob29rcywgbnMsIG5leHRTaWJsaW5nKVxuXHRcdFx0ZWxzZSB1cGRhdGVOb2RlKHBhcmVudCwgb2xkLmluc3RhbmNlLCB2bm9kZS5pbnN0YW5jZSwgaG9va3MsIG5leHRTaWJsaW5nLCByZWN5Y2xpbmcsIG5zKVxuXHRcdFx0dm5vZGUuZG9tID0gdm5vZGUuaW5zdGFuY2UuZG9tXG5cdFx0XHR2bm9kZS5kb21TaXplID0gdm5vZGUuaW5zdGFuY2UuZG9tU2l6ZVxuXHRcdH1cblx0XHRlbHNlIGlmIChvbGQuaW5zdGFuY2UgIT0gbnVsbCkge1xuXHRcdFx0cmVtb3ZlTm9kZShvbGQuaW5zdGFuY2UsIG51bGwpXG5cdFx0XHR2bm9kZS5kb20gPSB1bmRlZmluZWRcblx0XHRcdHZub2RlLmRvbVNpemUgPSAwXG5cdFx0fVxuXHRcdGVsc2Uge1xuXHRcdFx0dm5vZGUuZG9tID0gb2xkLmRvbVxuXHRcdFx0dm5vZGUuZG9tU2l6ZSA9IG9sZC5kb21TaXplXG5cdFx0fVxuXHR9XG5cdGZ1bmN0aW9uIGlzUmVjeWNsYWJsZShvbGQsIHZub2Rlcykge1xuXHRcdGlmIChvbGQucG9vbCAhPSBudWxsICYmIE1hdGguYWJzKG9sZC5wb29sLmxlbmd0aCAtIHZub2Rlcy5sZW5ndGgpIDw9IE1hdGguYWJzKG9sZC5sZW5ndGggLSB2bm9kZXMubGVuZ3RoKSkge1xuXHRcdFx0dmFyIG9sZENoaWxkcmVuTGVuZ3RoID0gb2xkWzBdICYmIG9sZFswXS5jaGlsZHJlbiAmJiBvbGRbMF0uY2hpbGRyZW4ubGVuZ3RoIHx8IDBcblx0XHRcdHZhciBwb29sQ2hpbGRyZW5MZW5ndGggPSBvbGQucG9vbFswXSAmJiBvbGQucG9vbFswXS5jaGlsZHJlbiAmJiBvbGQucG9vbFswXS5jaGlsZHJlbi5sZW5ndGggfHwgMFxuXHRcdFx0dmFyIHZub2Rlc0NoaWxkcmVuTGVuZ3RoID0gdm5vZGVzWzBdICYmIHZub2Rlc1swXS5jaGlsZHJlbiAmJiB2bm9kZXNbMF0uY2hpbGRyZW4ubGVuZ3RoIHx8IDBcblx0XHRcdGlmIChNYXRoLmFicyhwb29sQ2hpbGRyZW5MZW5ndGggLSB2bm9kZXNDaGlsZHJlbkxlbmd0aCkgPD0gTWF0aC5hYnMob2xkQ2hpbGRyZW5MZW5ndGggLSB2bm9kZXNDaGlsZHJlbkxlbmd0aCkpIHtcblx0XHRcdFx0cmV0dXJuIHRydWVcblx0XHRcdH1cblx0XHR9XG5cdFx0cmV0dXJuIGZhbHNlXG5cdH1cblx0ZnVuY3Rpb24gZ2V0S2V5TWFwKHZub2RlcywgZW5kKSB7XG5cdFx0dmFyIG1hcCA9IHt9LCBpID0gMFxuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgZW5kOyBpKyspIHtcblx0XHRcdHZhciB2bm9kZSA9IHZub2Rlc1tpXVxuXHRcdFx0aWYgKHZub2RlICE9IG51bGwpIHtcblx0XHRcdFx0dmFyIGtleTIgPSB2bm9kZS5rZXlcblx0XHRcdFx0aWYgKGtleTIgIT0gbnVsbCkgbWFwW2tleTJdID0gaVxuXHRcdFx0fVxuXHRcdH1cblx0XHRyZXR1cm4gbWFwXG5cdH1cblx0ZnVuY3Rpb24gdG9GcmFnbWVudCh2bm9kZSkge1xuXHRcdHZhciBjb3VudDAgPSB2bm9kZS5kb21TaXplXG5cdFx0aWYgKGNvdW50MCAhPSBudWxsIHx8IHZub2RlLmRvbSA9PSBudWxsKSB7XG5cdFx0XHR2YXIgZnJhZ21lbnQgPSAkZG9jLmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKVxuXHRcdFx0aWYgKGNvdW50MCA+IDApIHtcblx0XHRcdFx0dmFyIGRvbSA9IHZub2RlLmRvbVxuXHRcdFx0XHR3aGlsZSAoLS1jb3VudDApIGZyYWdtZW50LmFwcGVuZENoaWxkKGRvbS5uZXh0U2libGluZylcblx0XHRcdFx0ZnJhZ21lbnQuaW5zZXJ0QmVmb3JlKGRvbSwgZnJhZ21lbnQuZmlyc3RDaGlsZClcblx0XHRcdH1cblx0XHRcdHJldHVybiBmcmFnbWVudFxuXHRcdH1cblx0XHRlbHNlIHJldHVybiB2bm9kZS5kb21cblx0fVxuXHRmdW5jdGlvbiBnZXROZXh0U2libGluZyh2bm9kZXMsIGksIG5leHRTaWJsaW5nKSB7XG5cdFx0Zm9yICg7IGkgPCB2bm9kZXMubGVuZ3RoOyBpKyspIHtcblx0XHRcdGlmICh2bm9kZXNbaV0gIT0gbnVsbCAmJiB2bm9kZXNbaV0uZG9tICE9IG51bGwpIHJldHVybiB2bm9kZXNbaV0uZG9tXG5cdFx0fVxuXHRcdHJldHVybiBuZXh0U2libGluZ1xuXHR9XG5cdGZ1bmN0aW9uIGluc2VydE5vZGUocGFyZW50LCBkb20sIG5leHRTaWJsaW5nKSB7XG5cdFx0aWYgKG5leHRTaWJsaW5nICYmIG5leHRTaWJsaW5nLnBhcmVudE5vZGUpIHBhcmVudC5pbnNlcnRCZWZvcmUoZG9tLCBuZXh0U2libGluZylcblx0XHRlbHNlIHBhcmVudC5hcHBlbmRDaGlsZChkb20pXG5cdH1cblx0ZnVuY3Rpb24gc2V0Q29udGVudEVkaXRhYmxlKHZub2RlKSB7XG5cdFx0dmFyIGNoaWxkcmVuID0gdm5vZGUuY2hpbGRyZW5cblx0XHRpZiAoY2hpbGRyZW4gIT0gbnVsbCAmJiBjaGlsZHJlbi5sZW5ndGggPT09IDEgJiYgY2hpbGRyZW5bMF0udGFnID09PSBcIjxcIikge1xuXHRcdFx0dmFyIGNvbnRlbnQgPSBjaGlsZHJlblswXS5jaGlsZHJlblxuXHRcdFx0aWYgKHZub2RlLmRvbS5pbm5lckhUTUwgIT09IGNvbnRlbnQpIHZub2RlLmRvbS5pbm5lckhUTUwgPSBjb250ZW50XG5cdFx0fVxuXHRcdGVsc2UgaWYgKHZub2RlLnRleHQgIT0gbnVsbCB8fCBjaGlsZHJlbiAhPSBudWxsICYmIGNoaWxkcmVuLmxlbmd0aCAhPT0gMCkgdGhyb3cgbmV3IEVycm9yKFwiQ2hpbGQgbm9kZSBvZiBhIGNvbnRlbnRlZGl0YWJsZSBtdXN0IGJlIHRydXN0ZWRcIilcblx0fVxuXHQvL3JlbW92ZVxuXHRmdW5jdGlvbiByZW1vdmVOb2Rlcyh2bm9kZXMsIHN0YXJ0LCBlbmQsIGNvbnRleHQpIHtcblx0XHRmb3IgKHZhciBpID0gc3RhcnQ7IGkgPCBlbmQ7IGkrKykge1xuXHRcdFx0dmFyIHZub2RlID0gdm5vZGVzW2ldXG5cdFx0XHRpZiAodm5vZGUgIT0gbnVsbCkge1xuXHRcdFx0XHRpZiAodm5vZGUuc2tpcCkgdm5vZGUuc2tpcCA9IGZhbHNlXG5cdFx0XHRcdGVsc2UgcmVtb3ZlTm9kZSh2bm9kZSwgY29udGV4dClcblx0XHRcdH1cblx0XHR9XG5cdH1cblx0ZnVuY3Rpb24gcmVtb3ZlTm9kZSh2bm9kZSwgY29udGV4dCkge1xuXHRcdHZhciBleHBlY3RlZCA9IDEsIGNhbGxlZCA9IDBcblx0XHRpZiAodm5vZGUuYXR0cnMgJiYgdHlwZW9mIHZub2RlLmF0dHJzLm9uYmVmb3JlcmVtb3ZlID09PSBcImZ1bmN0aW9uXCIpIHtcblx0XHRcdHZhciByZXN1bHQgPSB2bm9kZS5hdHRycy5vbmJlZm9yZXJlbW92ZS5jYWxsKHZub2RlLnN0YXRlLCB2bm9kZSlcblx0XHRcdGlmIChyZXN1bHQgIT0gbnVsbCAmJiB0eXBlb2YgcmVzdWx0LnRoZW4gPT09IFwiZnVuY3Rpb25cIikge1xuXHRcdFx0XHRleHBlY3RlZCsrXG5cdFx0XHRcdHJlc3VsdC50aGVuKGNvbnRpbnVhdGlvbiwgY29udGludWF0aW9uKVxuXHRcdFx0fVxuXHRcdH1cblx0XHRpZiAodHlwZW9mIHZub2RlLnRhZyAhPT0gXCJzdHJpbmdcIiAmJiB0eXBlb2Ygdm5vZGUuX3N0YXRlLm9uYmVmb3JlcmVtb3ZlID09PSBcImZ1bmN0aW9uXCIpIHtcblx0XHRcdHZhciByZXN1bHQgPSB2bm9kZS5fc3RhdGUub25iZWZvcmVyZW1vdmUuY2FsbCh2bm9kZS5zdGF0ZSwgdm5vZGUpXG5cdFx0XHRpZiAocmVzdWx0ICE9IG51bGwgJiYgdHlwZW9mIHJlc3VsdC50aGVuID09PSBcImZ1bmN0aW9uXCIpIHtcblx0XHRcdFx0ZXhwZWN0ZWQrK1xuXHRcdFx0XHRyZXN1bHQudGhlbihjb250aW51YXRpb24sIGNvbnRpbnVhdGlvbilcblx0XHRcdH1cblx0XHR9XG5cdFx0Y29udGludWF0aW9uKClcblx0XHRmdW5jdGlvbiBjb250aW51YXRpb24oKSB7XG5cdFx0XHRpZiAoKytjYWxsZWQgPT09IGV4cGVjdGVkKSB7XG5cdFx0XHRcdG9ucmVtb3ZlKHZub2RlKVxuXHRcdFx0XHRpZiAodm5vZGUuZG9tKSB7XG5cdFx0XHRcdFx0dmFyIGNvdW50MCA9IHZub2RlLmRvbVNpemUgfHwgMVxuXHRcdFx0XHRcdGlmIChjb3VudDAgPiAxKSB7XG5cdFx0XHRcdFx0XHR2YXIgZG9tID0gdm5vZGUuZG9tXG5cdFx0XHRcdFx0XHR3aGlsZSAoLS1jb3VudDApIHtcblx0XHRcdFx0XHRcdFx0cmVtb3ZlTm9kZUZyb21ET00oZG9tLm5leHRTaWJsaW5nKVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRyZW1vdmVOb2RlRnJvbURPTSh2bm9kZS5kb20pXG5cdFx0XHRcdFx0aWYgKGNvbnRleHQgIT0gbnVsbCAmJiB2bm9kZS5kb21TaXplID09IG51bGwgJiYgIWhhc0ludGVncmF0aW9uTWV0aG9kcyh2bm9kZS5hdHRycykgJiYgdHlwZW9mIHZub2RlLnRhZyA9PT0gXCJzdHJpbmdcIikgeyAvL1RPRE8gdGVzdCBjdXN0b20gZWxlbWVudHNcblx0XHRcdFx0XHRcdGlmICghY29udGV4dC5wb29sKSBjb250ZXh0LnBvb2wgPSBbdm5vZGVdXG5cdFx0XHRcdFx0XHRlbHNlIGNvbnRleHQucG9vbC5wdXNoKHZub2RlKVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fVxuXHRmdW5jdGlvbiByZW1vdmVOb2RlRnJvbURPTShub2RlKSB7XG5cdFx0dmFyIHBhcmVudCA9IG5vZGUucGFyZW50Tm9kZVxuXHRcdGlmIChwYXJlbnQgIT0gbnVsbCkgcGFyZW50LnJlbW92ZUNoaWxkKG5vZGUpXG5cdH1cblx0ZnVuY3Rpb24gb25yZW1vdmUodm5vZGUpIHtcblx0XHRpZiAodm5vZGUuYXR0cnMgJiYgdHlwZW9mIHZub2RlLmF0dHJzLm9ucmVtb3ZlID09PSBcImZ1bmN0aW9uXCIpIHZub2RlLmF0dHJzLm9ucmVtb3ZlLmNhbGwodm5vZGUuc3RhdGUsIHZub2RlKVxuXHRcdGlmICh0eXBlb2Ygdm5vZGUudGFnICE9PSBcInN0cmluZ1wiICYmIHR5cGVvZiB2bm9kZS5fc3RhdGUub25yZW1vdmUgPT09IFwiZnVuY3Rpb25cIikgdm5vZGUuX3N0YXRlLm9ucmVtb3ZlLmNhbGwodm5vZGUuc3RhdGUsIHZub2RlKVxuXHRcdGlmICh2bm9kZS5pbnN0YW5jZSAhPSBudWxsKSBvbnJlbW92ZSh2bm9kZS5pbnN0YW5jZSlcblx0XHRlbHNlIHtcblx0XHRcdHZhciBjaGlsZHJlbiA9IHZub2RlLmNoaWxkcmVuXG5cdFx0XHRpZiAoQXJyYXkuaXNBcnJheShjaGlsZHJlbikpIHtcblx0XHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBjaGlsZHJlbi5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRcdHZhciBjaGlsZCA9IGNoaWxkcmVuW2ldXG5cdFx0XHRcdFx0aWYgKGNoaWxkICE9IG51bGwpIG9ucmVtb3ZlKGNoaWxkKVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cdC8vYXR0cnMyXG5cdGZ1bmN0aW9uIHNldEF0dHJzKHZub2RlLCBhdHRyczIsIG5zKSB7XG5cdFx0Zm9yICh2YXIga2V5MiBpbiBhdHRyczIpIHtcblx0XHRcdHNldEF0dHIodm5vZGUsIGtleTIsIG51bGwsIGF0dHJzMltrZXkyXSwgbnMpXG5cdFx0fVxuXHR9XG5cdGZ1bmN0aW9uIHNldEF0dHIodm5vZGUsIGtleTIsIG9sZCwgdmFsdWUsIG5zKSB7XG5cdFx0dmFyIGVsZW1lbnQgPSB2bm9kZS5kb21cblx0XHRpZiAoa2V5MiA9PT0gXCJrZXlcIiB8fCBrZXkyID09PSBcImlzXCIgfHwgKG9sZCA9PT0gdmFsdWUgJiYgIWlzRm9ybUF0dHJpYnV0ZSh2bm9kZSwga2V5MikpICYmIHR5cGVvZiB2YWx1ZSAhPT0gXCJvYmplY3RcIiB8fCB0eXBlb2YgdmFsdWUgPT09IFwidW5kZWZpbmVkXCIgfHwgaXNMaWZlY3ljbGVNZXRob2Qoa2V5MikpIHJldHVyblxuXHRcdHZhciBuc0xhc3RJbmRleCA9IGtleTIuaW5kZXhPZihcIjpcIilcblx0XHRpZiAobnNMYXN0SW5kZXggPiAtMSAmJiBrZXkyLnN1YnN0cigwLCBuc0xhc3RJbmRleCkgPT09IFwieGxpbmtcIikge1xuXHRcdFx0ZWxlbWVudC5zZXRBdHRyaWJ1dGVOUyhcImh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmtcIiwga2V5Mi5zbGljZShuc0xhc3RJbmRleCArIDEpLCB2YWx1ZSlcblx0XHR9XG5cdFx0ZWxzZSBpZiAoa2V5MlswXSA9PT0gXCJvXCIgJiYga2V5MlsxXSA9PT0gXCJuXCIgJiYgdHlwZW9mIHZhbHVlID09PSBcImZ1bmN0aW9uXCIpIHVwZGF0ZUV2ZW50KHZub2RlLCBrZXkyLCB2YWx1ZSlcblx0XHRlbHNlIGlmIChrZXkyID09PSBcInN0eWxlXCIpIHVwZGF0ZVN0eWxlKGVsZW1lbnQsIG9sZCwgdmFsdWUpXG5cdFx0ZWxzZSBpZiAoa2V5MiBpbiBlbGVtZW50ICYmICFpc0F0dHJpYnV0ZShrZXkyKSAmJiBucyA9PT0gdW5kZWZpbmVkICYmICFpc0N1c3RvbUVsZW1lbnQodm5vZGUpKSB7XG5cdFx0XHRpZiAoa2V5MiA9PT0gXCJ2YWx1ZVwiKSB7XG5cdFx0XHRcdHZhciBub3JtYWxpemVkMCA9IFwiXCIgKyB2YWx1ZSAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLWltcGxpY2l0LWNvZXJjaW9uXG5cdFx0XHRcdC8vc2V0dGluZyBpbnB1dFt2YWx1ZV0gdG8gc2FtZSB2YWx1ZSBieSB0eXBpbmcgb24gZm9jdXNlZCBlbGVtZW50IG1vdmVzIGN1cnNvciB0byBlbmQgaW4gQ2hyb21lXG5cdFx0XHRcdGlmICgodm5vZGUudGFnID09PSBcImlucHV0XCIgfHwgdm5vZGUudGFnID09PSBcInRleHRhcmVhXCIpICYmIHZub2RlLmRvbS52YWx1ZSA9PT0gbm9ybWFsaXplZDAgJiYgdm5vZGUuZG9tID09PSAkZG9jLmFjdGl2ZUVsZW1lbnQpIHJldHVyblxuXHRcdFx0XHQvL3NldHRpbmcgc2VsZWN0W3ZhbHVlXSB0byBzYW1lIHZhbHVlIHdoaWxlIGhhdmluZyBzZWxlY3Qgb3BlbiBibGlua3Mgc2VsZWN0IGRyb3Bkb3duIGluIENocm9tZVxuXHRcdFx0XHRpZiAodm5vZGUudGFnID09PSBcInNlbGVjdFwiKSB7XG5cdFx0XHRcdFx0aWYgKHZhbHVlID09PSBudWxsKSB7XG5cdFx0XHRcdFx0XHRpZiAodm5vZGUuZG9tLnNlbGVjdGVkSW5kZXggPT09IC0xICYmIHZub2RlLmRvbSA9PT0gJGRvYy5hY3RpdmVFbGVtZW50KSByZXR1cm5cblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0aWYgKG9sZCAhPT0gbnVsbCAmJiB2bm9kZS5kb20udmFsdWUgPT09IG5vcm1hbGl6ZWQwICYmIHZub2RlLmRvbSA9PT0gJGRvYy5hY3RpdmVFbGVtZW50KSByZXR1cm5cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0Ly9zZXR0aW5nIG9wdGlvblt2YWx1ZV0gdG8gc2FtZSB2YWx1ZSB3aGlsZSBoYXZpbmcgc2VsZWN0IG9wZW4gYmxpbmtzIHNlbGVjdCBkcm9wZG93biBpbiBDaHJvbWVcblx0XHRcdFx0aWYgKHZub2RlLnRhZyA9PT0gXCJvcHRpb25cIiAmJiBvbGQgIT0gbnVsbCAmJiB2bm9kZS5kb20udmFsdWUgPT09IG5vcm1hbGl6ZWQwKSByZXR1cm5cblx0XHRcdH1cblx0XHRcdC8vIElmIHlvdSBhc3NpZ24gYW4gaW5wdXQgdHlwZTEgdGhhdCBpcyBub3Qgc3VwcG9ydGVkIGJ5IElFIDExIHdpdGggYW4gYXNzaWdubWVudCBleHByZXNzaW9uLCBhbiBlcnJvcjAgd2lsbCBvY2N1ci5cblx0XHRcdGlmICh2bm9kZS50YWcgPT09IFwiaW5wdXRcIiAmJiBrZXkyID09PSBcInR5cGVcIikge1xuXHRcdFx0XHRlbGVtZW50LnNldEF0dHJpYnV0ZShrZXkyLCB2YWx1ZSlcblx0XHRcdFx0cmV0dXJuXG5cdFx0XHR9XG5cdFx0XHRlbGVtZW50W2tleTJdID0gdmFsdWVcblx0XHR9XG5cdFx0ZWxzZSB7XG5cdFx0XHRpZiAodHlwZW9mIHZhbHVlID09PSBcImJvb2xlYW5cIikge1xuXHRcdFx0XHRpZiAodmFsdWUpIGVsZW1lbnQuc2V0QXR0cmlidXRlKGtleTIsIFwiXCIpXG5cdFx0XHRcdGVsc2UgZWxlbWVudC5yZW1vdmVBdHRyaWJ1dGUoa2V5Milcblx0XHRcdH1cblx0XHRcdGVsc2UgZWxlbWVudC5zZXRBdHRyaWJ1dGUoa2V5MiA9PT0gXCJjbGFzc05hbWVcIiA/IFwiY2xhc3NcIiA6IGtleTIsIHZhbHVlKVxuXHRcdH1cblx0fVxuXHRmdW5jdGlvbiBzZXRMYXRlQXR0cnModm5vZGUpIHtcblx0XHR2YXIgYXR0cnMyID0gdm5vZGUuYXR0cnNcblx0XHRpZiAodm5vZGUudGFnID09PSBcInNlbGVjdFwiICYmIGF0dHJzMiAhPSBudWxsKSB7XG5cdFx0XHRpZiAoXCJ2YWx1ZVwiIGluIGF0dHJzMikgc2V0QXR0cih2bm9kZSwgXCJ2YWx1ZVwiLCBudWxsLCBhdHRyczIudmFsdWUsIHVuZGVmaW5lZClcblx0XHRcdGlmIChcInNlbGVjdGVkSW5kZXhcIiBpbiBhdHRyczIpIHNldEF0dHIodm5vZGUsIFwic2VsZWN0ZWRJbmRleFwiLCBudWxsLCBhdHRyczIuc2VsZWN0ZWRJbmRleCwgdW5kZWZpbmVkKVxuXHRcdH1cblx0fVxuXHRmdW5jdGlvbiB1cGRhdGVBdHRycyh2bm9kZSwgb2xkLCBhdHRyczIsIG5zKSB7XG5cdFx0aWYgKGF0dHJzMiAhPSBudWxsKSB7XG5cdFx0XHRmb3IgKHZhciBrZXkyIGluIGF0dHJzMikge1xuXHRcdFx0XHRzZXRBdHRyKHZub2RlLCBrZXkyLCBvbGQgJiYgb2xkW2tleTJdLCBhdHRyczJba2V5Ml0sIG5zKVxuXHRcdFx0fVxuXHRcdH1cblx0XHRpZiAob2xkICE9IG51bGwpIHtcblx0XHRcdGZvciAodmFyIGtleTIgaW4gb2xkKSB7XG5cdFx0XHRcdGlmIChhdHRyczIgPT0gbnVsbCB8fCAhKGtleTIgaW4gYXR0cnMyKSkge1xuXHRcdFx0XHRcdGlmIChrZXkyID09PSBcImNsYXNzTmFtZVwiKSBrZXkyID0gXCJjbGFzc1wiXG5cdFx0XHRcdFx0aWYgKGtleTJbMF0gPT09IFwib1wiICYmIGtleTJbMV0gPT09IFwiblwiICYmICFpc0xpZmVjeWNsZU1ldGhvZChrZXkyKSkgdXBkYXRlRXZlbnQodm5vZGUsIGtleTIsIHVuZGVmaW5lZClcblx0XHRcdFx0XHRlbHNlIGlmIChrZXkyICE9PSBcImtleVwiKSB2bm9kZS5kb20ucmVtb3ZlQXR0cmlidXRlKGtleTIpXG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdH1cblx0ZnVuY3Rpb24gaXNGb3JtQXR0cmlidXRlKHZub2RlLCBhdHRyKSB7XG5cdFx0cmV0dXJuIGF0dHIgPT09IFwidmFsdWVcIiB8fCBhdHRyID09PSBcImNoZWNrZWRcIiB8fCBhdHRyID09PSBcInNlbGVjdGVkSW5kZXhcIiB8fCBhdHRyID09PSBcInNlbGVjdGVkXCIgJiYgdm5vZGUuZG9tID09PSAkZG9jLmFjdGl2ZUVsZW1lbnRcblx0fVxuXHRmdW5jdGlvbiBpc0xpZmVjeWNsZU1ldGhvZChhdHRyKSB7XG5cdFx0cmV0dXJuIGF0dHIgPT09IFwib25pbml0XCIgfHwgYXR0ciA9PT0gXCJvbmNyZWF0ZVwiIHx8IGF0dHIgPT09IFwib251cGRhdGVcIiB8fCBhdHRyID09PSBcIm9ucmVtb3ZlXCIgfHwgYXR0ciA9PT0gXCJvbmJlZm9yZXJlbW92ZVwiIHx8IGF0dHIgPT09IFwib25iZWZvcmV1cGRhdGVcIlxuXHR9XG5cdGZ1bmN0aW9uIGlzQXR0cmlidXRlKGF0dHIpIHtcblx0XHRyZXR1cm4gYXR0ciA9PT0gXCJocmVmXCIgfHwgYXR0ciA9PT0gXCJsaXN0XCIgfHwgYXR0ciA9PT0gXCJmb3JtXCIgfHwgYXR0ciA9PT0gXCJ3aWR0aFwiIHx8IGF0dHIgPT09IFwiaGVpZ2h0XCIvLyB8fCBhdHRyID09PSBcInR5cGVcIlxuXHR9XG5cdGZ1bmN0aW9uIGlzQ3VzdG9tRWxlbWVudCh2bm9kZSl7XG5cdFx0cmV0dXJuIHZub2RlLmF0dHJzLmlzIHx8IHZub2RlLnRhZy5pbmRleE9mKFwiLVwiKSA+IC0xXG5cdH1cblx0ZnVuY3Rpb24gaGFzSW50ZWdyYXRpb25NZXRob2RzKHNvdXJjZSkge1xuXHRcdHJldHVybiBzb3VyY2UgIT0gbnVsbCAmJiAoc291cmNlLm9uY3JlYXRlIHx8IHNvdXJjZS5vbnVwZGF0ZSB8fCBzb3VyY2Uub25iZWZvcmVyZW1vdmUgfHwgc291cmNlLm9ucmVtb3ZlKVxuXHR9XG5cdC8vc3R5bGVcblx0ZnVuY3Rpb24gdXBkYXRlU3R5bGUoZWxlbWVudCwgb2xkLCBzdHlsZSkge1xuXHRcdGlmIChvbGQgPT09IHN0eWxlKSBlbGVtZW50LnN0eWxlLmNzc1RleHQgPSBcIlwiLCBvbGQgPSBudWxsXG5cdFx0aWYgKHN0eWxlID09IG51bGwpIGVsZW1lbnQuc3R5bGUuY3NzVGV4dCA9IFwiXCJcblx0XHRlbHNlIGlmICh0eXBlb2Ygc3R5bGUgPT09IFwic3RyaW5nXCIpIGVsZW1lbnQuc3R5bGUuY3NzVGV4dCA9IHN0eWxlXG5cdFx0ZWxzZSB7XG5cdFx0XHRpZiAodHlwZW9mIG9sZCA9PT0gXCJzdHJpbmdcIikgZWxlbWVudC5zdHlsZS5jc3NUZXh0ID0gXCJcIlxuXHRcdFx0Zm9yICh2YXIga2V5MiBpbiBzdHlsZSkge1xuXHRcdFx0XHRlbGVtZW50LnN0eWxlW2tleTJdID0gc3R5bGVba2V5Ml1cblx0XHRcdH1cblx0XHRcdGlmIChvbGQgIT0gbnVsbCAmJiB0eXBlb2Ygb2xkICE9PSBcInN0cmluZ1wiKSB7XG5cdFx0XHRcdGZvciAodmFyIGtleTIgaW4gb2xkKSB7XG5cdFx0XHRcdFx0aWYgKCEoa2V5MiBpbiBzdHlsZSkpIGVsZW1lbnQuc3R5bGVba2V5Ml0gPSBcIlwiXG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdH1cblx0Ly9ldmVudFxuXHRmdW5jdGlvbiB1cGRhdGVFdmVudCh2bm9kZSwga2V5MiwgdmFsdWUpIHtcblx0XHR2YXIgZWxlbWVudCA9IHZub2RlLmRvbVxuXHRcdHZhciBjYWxsYmFjayA9IHR5cGVvZiBvbmV2ZW50ICE9PSBcImZ1bmN0aW9uXCIgPyB2YWx1ZSA6IGZ1bmN0aW9uKGUpIHtcblx0XHRcdHZhciByZXN1bHQgPSB2YWx1ZS5jYWxsKGVsZW1lbnQsIGUpXG5cdFx0XHRvbmV2ZW50LmNhbGwoZWxlbWVudCwgZSlcblx0XHRcdHJldHVybiByZXN1bHRcblx0XHR9XG5cdFx0aWYgKGtleTIgaW4gZWxlbWVudCkgZWxlbWVudFtrZXkyXSA9IHR5cGVvZiB2YWx1ZSA9PT0gXCJmdW5jdGlvblwiID8gY2FsbGJhY2sgOiBudWxsXG5cdFx0ZWxzZSB7XG5cdFx0XHR2YXIgZXZlbnROYW1lID0ga2V5Mi5zbGljZSgyKVxuXHRcdFx0aWYgKHZub2RlLmV2ZW50cyA9PT0gdW5kZWZpbmVkKSB2bm9kZS5ldmVudHMgPSB7fVxuXHRcdFx0aWYgKHZub2RlLmV2ZW50c1trZXkyXSA9PT0gY2FsbGJhY2spIHJldHVyblxuXHRcdFx0aWYgKHZub2RlLmV2ZW50c1trZXkyXSAhPSBudWxsKSBlbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoZXZlbnROYW1lLCB2bm9kZS5ldmVudHNba2V5Ml0sIGZhbHNlKVxuXHRcdFx0aWYgKHR5cGVvZiB2YWx1ZSA9PT0gXCJmdW5jdGlvblwiKSB7XG5cdFx0XHRcdHZub2RlLmV2ZW50c1trZXkyXSA9IGNhbGxiYWNrXG5cdFx0XHRcdGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihldmVudE5hbWUsIHZub2RlLmV2ZW50c1trZXkyXSwgZmFsc2UpXG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cdC8vbGlmZWN5Y2xlXG5cdGZ1bmN0aW9uIGluaXRMaWZlY3ljbGUoc291cmNlLCB2bm9kZSwgaG9va3MpIHtcblx0XHRpZiAodHlwZW9mIHNvdXJjZS5vbmluaXQgPT09IFwiZnVuY3Rpb25cIikgc291cmNlLm9uaW5pdC5jYWxsKHZub2RlLnN0YXRlLCB2bm9kZSlcblx0XHRpZiAodHlwZW9mIHNvdXJjZS5vbmNyZWF0ZSA9PT0gXCJmdW5jdGlvblwiKSBob29rcy5wdXNoKHNvdXJjZS5vbmNyZWF0ZS5iaW5kKHZub2RlLnN0YXRlLCB2bm9kZSkpXG5cdH1cblx0ZnVuY3Rpb24gdXBkYXRlTGlmZWN5Y2xlKHNvdXJjZSwgdm5vZGUsIGhvb2tzKSB7XG5cdFx0aWYgKHR5cGVvZiBzb3VyY2Uub251cGRhdGUgPT09IFwiZnVuY3Rpb25cIikgaG9va3MucHVzaChzb3VyY2Uub251cGRhdGUuYmluZCh2bm9kZS5zdGF0ZSwgdm5vZGUpKVxuXHR9XG5cdGZ1bmN0aW9uIHNob3VsZE5vdFVwZGF0ZSh2bm9kZSwgb2xkKSB7XG5cdFx0dmFyIGZvcmNlVm5vZGVVcGRhdGUsIGZvcmNlQ29tcG9uZW50VXBkYXRlXG5cdFx0aWYgKHZub2RlLmF0dHJzICE9IG51bGwgJiYgdHlwZW9mIHZub2RlLmF0dHJzLm9uYmVmb3JldXBkYXRlID09PSBcImZ1bmN0aW9uXCIpIGZvcmNlVm5vZGVVcGRhdGUgPSB2bm9kZS5hdHRycy5vbmJlZm9yZXVwZGF0ZS5jYWxsKHZub2RlLnN0YXRlLCB2bm9kZSwgb2xkKVxuXHRcdGlmICh0eXBlb2Ygdm5vZGUudGFnICE9PSBcInN0cmluZ1wiICYmIHR5cGVvZiB2bm9kZS5fc3RhdGUub25iZWZvcmV1cGRhdGUgPT09IFwiZnVuY3Rpb25cIikgZm9yY2VDb21wb25lbnRVcGRhdGUgPSB2bm9kZS5fc3RhdGUub25iZWZvcmV1cGRhdGUuY2FsbCh2bm9kZS5zdGF0ZSwgdm5vZGUsIG9sZClcblx0XHRpZiAoIShmb3JjZVZub2RlVXBkYXRlID09PSB1bmRlZmluZWQgJiYgZm9yY2VDb21wb25lbnRVcGRhdGUgPT09IHVuZGVmaW5lZCkgJiYgIWZvcmNlVm5vZGVVcGRhdGUgJiYgIWZvcmNlQ29tcG9uZW50VXBkYXRlKSB7XG5cdFx0XHR2bm9kZS5kb20gPSBvbGQuZG9tXG5cdFx0XHR2bm9kZS5kb21TaXplID0gb2xkLmRvbVNpemVcblx0XHRcdHZub2RlLmluc3RhbmNlID0gb2xkLmluc3RhbmNlXG5cdFx0XHRyZXR1cm4gdHJ1ZVxuXHRcdH1cblx0XHRyZXR1cm4gZmFsc2Vcblx0fVxuXHRmdW5jdGlvbiByZW5kZXIoZG9tLCB2bm9kZXMpIHtcblx0XHRpZiAoIWRvbSkgdGhyb3cgbmV3IEVycm9yKFwiRW5zdXJlIHRoZSBET00gZWxlbWVudCBiZWluZyBwYXNzZWQgdG8gbS5yb3V0ZS9tLm1vdW50L20ucmVuZGVyIGlzIG5vdCB1bmRlZmluZWQuXCIpXG5cdFx0dmFyIGhvb2tzID0gW11cblx0XHR2YXIgYWN0aXZlID0gJGRvYy5hY3RpdmVFbGVtZW50XG5cdFx0dmFyIG5hbWVzcGFjZSA9IGRvbS5uYW1lc3BhY2VVUklcblx0XHQvLyBGaXJzdCB0aW1lMCByZW5kZXJpbmcgaW50byBhIG5vZGUgY2xlYXJzIGl0IG91dFxuXHRcdGlmIChkb20udm5vZGVzID09IG51bGwpIGRvbS50ZXh0Q29udGVudCA9IFwiXCJcblx0XHRpZiAoIUFycmF5LmlzQXJyYXkodm5vZGVzKSkgdm5vZGVzID0gW3Zub2Rlc11cblx0XHR1cGRhdGVOb2Rlcyhkb20sIGRvbS52bm9kZXMsIFZub2RlLm5vcm1hbGl6ZUNoaWxkcmVuKHZub2RlcyksIGZhbHNlLCBob29rcywgbnVsbCwgbmFtZXNwYWNlID09PSBcImh0dHA6Ly93d3cudzMub3JnLzE5OTkveGh0bWxcIiA/IHVuZGVmaW5lZCA6IG5hbWVzcGFjZSlcblx0XHRkb20udm5vZGVzID0gdm5vZGVzXG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBob29rcy5sZW5ndGg7IGkrKykgaG9va3NbaV0oKVxuXHRcdGlmICgkZG9jLmFjdGl2ZUVsZW1lbnQgIT09IGFjdGl2ZSkgYWN0aXZlLmZvY3VzKClcblx0fVxuXHRyZXR1cm4ge3JlbmRlcjogcmVuZGVyLCBzZXRFdmVudENhbGxiYWNrOiBzZXRFdmVudENhbGxiYWNrfVxufVxuZnVuY3Rpb24gdGhyb3R0bGUoY2FsbGJhY2spIHtcblx0Ly82MGZwcyB0cmFuc2xhdGVzIHRvIDE2LjZtcywgcm91bmQgaXQgZG93biBzaW5jZSBzZXRUaW1lb3V0IHJlcXVpcmVzIGludFxuXHR2YXIgdGltZSA9IDE2XG5cdHZhciBsYXN0ID0gMCwgcGVuZGluZyA9IG51bGxcblx0dmFyIHRpbWVvdXQgPSB0eXBlb2YgcmVxdWVzdEFuaW1hdGlvbkZyYW1lID09PSBcImZ1bmN0aW9uXCIgPyByZXF1ZXN0QW5pbWF0aW9uRnJhbWUgOiBzZXRUaW1lb3V0XG5cdHJldHVybiBmdW5jdGlvbigpIHtcblx0XHR2YXIgbm93ID0gRGF0ZS5ub3coKVxuXHRcdGlmIChsYXN0ID09PSAwIHx8IG5vdyAtIGxhc3QgPj0gdGltZSkge1xuXHRcdFx0bGFzdCA9IG5vd1xuXHRcdFx0Y2FsbGJhY2soKVxuXHRcdH1cblx0XHRlbHNlIGlmIChwZW5kaW5nID09PSBudWxsKSB7XG5cdFx0XHRwZW5kaW5nID0gdGltZW91dChmdW5jdGlvbigpIHtcblx0XHRcdFx0cGVuZGluZyA9IG51bGxcblx0XHRcdFx0Y2FsbGJhY2soKVxuXHRcdFx0XHRsYXN0ID0gRGF0ZS5ub3coKVxuXHRcdFx0fSwgdGltZSAtIChub3cgLSBsYXN0KSlcblx0XHR9XG5cdH1cbn1cbnZhciBfMTEgPSBmdW5jdGlvbigkd2luZG93KSB7XG5cdHZhciByZW5kZXJTZXJ2aWNlID0gY29yZVJlbmRlcmVyKCR3aW5kb3cpXG5cdHJlbmRlclNlcnZpY2Uuc2V0RXZlbnRDYWxsYmFjayhmdW5jdGlvbihlKSB7XG5cdFx0aWYgKGUucmVkcmF3ID09PSBmYWxzZSkgZS5yZWRyYXcgPSB1bmRlZmluZWRcblx0XHRlbHNlIHJlZHJhdygpXG5cdH0pXG5cdHZhciBjYWxsYmFja3MgPSBbXVxuXHRmdW5jdGlvbiBzdWJzY3JpYmUoa2V5MSwgY2FsbGJhY2spIHtcblx0XHR1bnN1YnNjcmliZShrZXkxKVxuXHRcdGNhbGxiYWNrcy5wdXNoKGtleTEsIHRocm90dGxlKGNhbGxiYWNrKSlcblx0fVxuXHRmdW5jdGlvbiB1bnN1YnNjcmliZShrZXkxKSB7XG5cdFx0dmFyIGluZGV4ID0gY2FsbGJhY2tzLmluZGV4T2Yoa2V5MSlcblx0XHRpZiAoaW5kZXggPiAtMSkgY2FsbGJhY2tzLnNwbGljZShpbmRleCwgMilcblx0fVxuXHRmdW5jdGlvbiByZWRyYXcoKSB7XG5cdFx0Zm9yICh2YXIgaSA9IDE7IGkgPCBjYWxsYmFja3MubGVuZ3RoOyBpICs9IDIpIHtcblx0XHRcdGNhbGxiYWNrc1tpXSgpXG5cdFx0fVxuXHR9XG5cdHJldHVybiB7c3Vic2NyaWJlOiBzdWJzY3JpYmUsIHVuc3Vic2NyaWJlOiB1bnN1YnNjcmliZSwgcmVkcmF3OiByZWRyYXcsIHJlbmRlcjogcmVuZGVyU2VydmljZS5yZW5kZXJ9XG59XG52YXIgcmVkcmF3U2VydmljZSA9IF8xMSh3aW5kb3cpXG5yZXF1ZXN0U2VydmljZS5zZXRDb21wbGV0aW9uQ2FsbGJhY2socmVkcmF3U2VydmljZS5yZWRyYXcpXG52YXIgXzE2ID0gZnVuY3Rpb24ocmVkcmF3U2VydmljZTApIHtcblx0cmV0dXJuIGZ1bmN0aW9uKHJvb3QsIGNvbXBvbmVudCkge1xuXHRcdGlmIChjb21wb25lbnQgPT09IG51bGwpIHtcblx0XHRcdHJlZHJhd1NlcnZpY2UwLnJlbmRlcihyb290LCBbXSlcblx0XHRcdHJlZHJhd1NlcnZpY2UwLnVuc3Vic2NyaWJlKHJvb3QpXG5cdFx0XHRyZXR1cm5cblx0XHR9XG5cdFx0XG5cdFx0aWYgKGNvbXBvbmVudC52aWV3ID09IG51bGwgJiYgdHlwZW9mIGNvbXBvbmVudCAhPT0gXCJmdW5jdGlvblwiKSB0aHJvdyBuZXcgRXJyb3IoXCJtLm1vdW50KGVsZW1lbnQsIGNvbXBvbmVudCkgZXhwZWN0cyBhIGNvbXBvbmVudCwgbm90IGEgdm5vZGVcIilcblx0XHRcblx0XHR2YXIgcnVuMCA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0cmVkcmF3U2VydmljZTAucmVuZGVyKHJvb3QsIFZub2RlKGNvbXBvbmVudCkpXG5cdFx0fVxuXHRcdHJlZHJhd1NlcnZpY2UwLnN1YnNjcmliZShyb290LCBydW4wKVxuXHRcdHJlZHJhd1NlcnZpY2UwLnJlZHJhdygpXG5cdH1cbn1cbm0ubW91bnQgPSBfMTYocmVkcmF3U2VydmljZSlcbnZhciBQcm9taXNlID0gUHJvbWlzZVBvbHlmaWxsXG52YXIgcGFyc2VRdWVyeVN0cmluZyA9IGZ1bmN0aW9uKHN0cmluZykge1xuXHRpZiAoc3RyaW5nID09PSBcIlwiIHx8IHN0cmluZyA9PSBudWxsKSByZXR1cm4ge31cblx0aWYgKHN0cmluZy5jaGFyQXQoMCkgPT09IFwiP1wiKSBzdHJpbmcgPSBzdHJpbmcuc2xpY2UoMSlcblx0dmFyIGVudHJpZXMgPSBzdHJpbmcuc3BsaXQoXCImXCIpLCBkYXRhMCA9IHt9LCBjb3VudGVycyA9IHt9XG5cdGZvciAodmFyIGkgPSAwOyBpIDwgZW50cmllcy5sZW5ndGg7IGkrKykge1xuXHRcdHZhciBlbnRyeSA9IGVudHJpZXNbaV0uc3BsaXQoXCI9XCIpXG5cdFx0dmFyIGtleTUgPSBkZWNvZGVVUklDb21wb25lbnQoZW50cnlbMF0pXG5cdFx0dmFyIHZhbHVlID0gZW50cnkubGVuZ3RoID09PSAyID8gZGVjb2RlVVJJQ29tcG9uZW50KGVudHJ5WzFdKSA6IFwiXCJcblx0XHRpZiAodmFsdWUgPT09IFwidHJ1ZVwiKSB2YWx1ZSA9IHRydWVcblx0XHRlbHNlIGlmICh2YWx1ZSA9PT0gXCJmYWxzZVwiKSB2YWx1ZSA9IGZhbHNlXG5cdFx0dmFyIGxldmVscyA9IGtleTUuc3BsaXQoL1xcXVxcWz98XFxbLylcblx0XHR2YXIgY3Vyc29yID0gZGF0YTBcblx0XHRpZiAoa2V5NS5pbmRleE9mKFwiW1wiKSA+IC0xKSBsZXZlbHMucG9wKClcblx0XHRmb3IgKHZhciBqID0gMDsgaiA8IGxldmVscy5sZW5ndGg7IGorKykge1xuXHRcdFx0dmFyIGxldmVsID0gbGV2ZWxzW2pdLCBuZXh0TGV2ZWwgPSBsZXZlbHNbaiArIDFdXG5cdFx0XHR2YXIgaXNOdW1iZXIgPSBuZXh0TGV2ZWwgPT0gXCJcIiB8fCAhaXNOYU4ocGFyc2VJbnQobmV4dExldmVsLCAxMCkpXG5cdFx0XHR2YXIgaXNWYWx1ZSA9IGogPT09IGxldmVscy5sZW5ndGggLSAxXG5cdFx0XHRpZiAobGV2ZWwgPT09IFwiXCIpIHtcblx0XHRcdFx0dmFyIGtleTUgPSBsZXZlbHMuc2xpY2UoMCwgaikuam9pbigpXG5cdFx0XHRcdGlmIChjb3VudGVyc1trZXk1XSA9PSBudWxsKSBjb3VudGVyc1trZXk1XSA9IDBcblx0XHRcdFx0bGV2ZWwgPSBjb3VudGVyc1trZXk1XSsrXG5cdFx0XHR9XG5cdFx0XHRpZiAoY3Vyc29yW2xldmVsXSA9PSBudWxsKSB7XG5cdFx0XHRcdGN1cnNvcltsZXZlbF0gPSBpc1ZhbHVlID8gdmFsdWUgOiBpc051bWJlciA/IFtdIDoge31cblx0XHRcdH1cblx0XHRcdGN1cnNvciA9IGN1cnNvcltsZXZlbF1cblx0XHR9XG5cdH1cblx0cmV0dXJuIGRhdGEwXG59XG52YXIgY29yZVJvdXRlciA9IGZ1bmN0aW9uKCR3aW5kb3cpIHtcblx0dmFyIHN1cHBvcnRzUHVzaFN0YXRlID0gdHlwZW9mICR3aW5kb3cuaGlzdG9yeS5wdXNoU3RhdGUgPT09IFwiZnVuY3Rpb25cIlxuXHR2YXIgY2FsbEFzeW5jMCA9IHR5cGVvZiBzZXRJbW1lZGlhdGUgPT09IFwiZnVuY3Rpb25cIiA/IHNldEltbWVkaWF0ZSA6IHNldFRpbWVvdXRcblx0ZnVuY3Rpb24gbm9ybWFsaXplMShmcmFnbWVudDApIHtcblx0XHR2YXIgZGF0YSA9ICR3aW5kb3cubG9jYXRpb25bZnJhZ21lbnQwXS5yZXBsYWNlKC8oPzolW2EtZjg5XVthLWYwLTldKSsvZ2ltLCBkZWNvZGVVUklDb21wb25lbnQpXG5cdFx0aWYgKGZyYWdtZW50MCA9PT0gXCJwYXRobmFtZVwiICYmIGRhdGFbMF0gIT09IFwiL1wiKSBkYXRhID0gXCIvXCIgKyBkYXRhXG5cdFx0cmV0dXJuIGRhdGFcblx0fVxuXHR2YXIgYXN5bmNJZFxuXHRmdW5jdGlvbiBkZWJvdW5jZUFzeW5jKGNhbGxiYWNrMCkge1xuXHRcdHJldHVybiBmdW5jdGlvbigpIHtcblx0XHRcdGlmIChhc3luY0lkICE9IG51bGwpIHJldHVyblxuXHRcdFx0YXN5bmNJZCA9IGNhbGxBc3luYzAoZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGFzeW5jSWQgPSBudWxsXG5cdFx0XHRcdGNhbGxiYWNrMCgpXG5cdFx0XHR9KVxuXHRcdH1cblx0fVxuXHRmdW5jdGlvbiBwYXJzZVBhdGgocGF0aCwgcXVlcnlEYXRhLCBoYXNoRGF0YSkge1xuXHRcdHZhciBxdWVyeUluZGV4ID0gcGF0aC5pbmRleE9mKFwiP1wiKVxuXHRcdHZhciBoYXNoSW5kZXggPSBwYXRoLmluZGV4T2YoXCIjXCIpXG5cdFx0dmFyIHBhdGhFbmQgPSBxdWVyeUluZGV4ID4gLTEgPyBxdWVyeUluZGV4IDogaGFzaEluZGV4ID4gLTEgPyBoYXNoSW5kZXggOiBwYXRoLmxlbmd0aFxuXHRcdGlmIChxdWVyeUluZGV4ID4gLTEpIHtcblx0XHRcdHZhciBxdWVyeUVuZCA9IGhhc2hJbmRleCA+IC0xID8gaGFzaEluZGV4IDogcGF0aC5sZW5ndGhcblx0XHRcdHZhciBxdWVyeVBhcmFtcyA9IHBhcnNlUXVlcnlTdHJpbmcocGF0aC5zbGljZShxdWVyeUluZGV4ICsgMSwgcXVlcnlFbmQpKVxuXHRcdFx0Zm9yICh2YXIga2V5NCBpbiBxdWVyeVBhcmFtcykgcXVlcnlEYXRhW2tleTRdID0gcXVlcnlQYXJhbXNba2V5NF1cblx0XHR9XG5cdFx0aWYgKGhhc2hJbmRleCA+IC0xKSB7XG5cdFx0XHR2YXIgaGFzaFBhcmFtcyA9IHBhcnNlUXVlcnlTdHJpbmcocGF0aC5zbGljZShoYXNoSW5kZXggKyAxKSlcblx0XHRcdGZvciAodmFyIGtleTQgaW4gaGFzaFBhcmFtcykgaGFzaERhdGFba2V5NF0gPSBoYXNoUGFyYW1zW2tleTRdXG5cdFx0fVxuXHRcdHJldHVybiBwYXRoLnNsaWNlKDAsIHBhdGhFbmQpXG5cdH1cblx0dmFyIHJvdXRlciA9IHtwcmVmaXg6IFwiIyFcIn1cblx0cm91dGVyLmdldFBhdGggPSBmdW5jdGlvbigpIHtcblx0XHR2YXIgdHlwZTIgPSByb3V0ZXIucHJlZml4LmNoYXJBdCgwKVxuXHRcdHN3aXRjaCAodHlwZTIpIHtcblx0XHRcdGNhc2UgXCIjXCI6IHJldHVybiBub3JtYWxpemUxKFwiaGFzaFwiKS5zbGljZShyb3V0ZXIucHJlZml4Lmxlbmd0aClcblx0XHRcdGNhc2UgXCI/XCI6IHJldHVybiBub3JtYWxpemUxKFwic2VhcmNoXCIpLnNsaWNlKHJvdXRlci5wcmVmaXgubGVuZ3RoKSArIG5vcm1hbGl6ZTEoXCJoYXNoXCIpXG5cdFx0XHRkZWZhdWx0OiByZXR1cm4gbm9ybWFsaXplMShcInBhdGhuYW1lXCIpLnNsaWNlKHJvdXRlci5wcmVmaXgubGVuZ3RoKSArIG5vcm1hbGl6ZTEoXCJzZWFyY2hcIikgKyBub3JtYWxpemUxKFwiaGFzaFwiKVxuXHRcdH1cblx0fVxuXHRyb3V0ZXIuc2V0UGF0aCA9IGZ1bmN0aW9uKHBhdGgsIGRhdGEsIG9wdGlvbnMpIHtcblx0XHR2YXIgcXVlcnlEYXRhID0ge30sIGhhc2hEYXRhID0ge31cblx0XHRwYXRoID0gcGFyc2VQYXRoKHBhdGgsIHF1ZXJ5RGF0YSwgaGFzaERhdGEpXG5cdFx0aWYgKGRhdGEgIT0gbnVsbCkge1xuXHRcdFx0Zm9yICh2YXIga2V5NCBpbiBkYXRhKSBxdWVyeURhdGFba2V5NF0gPSBkYXRhW2tleTRdXG5cdFx0XHRwYXRoID0gcGF0aC5yZXBsYWNlKC86KFteXFwvXSspL2csIGZ1bmN0aW9uKG1hdGNoMiwgdG9rZW4pIHtcblx0XHRcdFx0ZGVsZXRlIHF1ZXJ5RGF0YVt0b2tlbl1cblx0XHRcdFx0cmV0dXJuIGRhdGFbdG9rZW5dXG5cdFx0XHR9KVxuXHRcdH1cblx0XHR2YXIgcXVlcnkgPSBidWlsZFF1ZXJ5U3RyaW5nKHF1ZXJ5RGF0YSlcblx0XHRpZiAocXVlcnkpIHBhdGggKz0gXCI/XCIgKyBxdWVyeVxuXHRcdHZhciBoYXNoID0gYnVpbGRRdWVyeVN0cmluZyhoYXNoRGF0YSlcblx0XHRpZiAoaGFzaCkgcGF0aCArPSBcIiNcIiArIGhhc2hcblx0XHRpZiAoc3VwcG9ydHNQdXNoU3RhdGUpIHtcblx0XHRcdHZhciBzdGF0ZSA9IG9wdGlvbnMgPyBvcHRpb25zLnN0YXRlIDogbnVsbFxuXHRcdFx0dmFyIHRpdGxlID0gb3B0aW9ucyA/IG9wdGlvbnMudGl0bGUgOiBudWxsXG5cdFx0XHQkd2luZG93Lm9ucG9wc3RhdGUoKVxuXHRcdFx0aWYgKG9wdGlvbnMgJiYgb3B0aW9ucy5yZXBsYWNlKSAkd2luZG93Lmhpc3RvcnkucmVwbGFjZVN0YXRlKHN0YXRlLCB0aXRsZSwgcm91dGVyLnByZWZpeCArIHBhdGgpXG5cdFx0XHRlbHNlICR3aW5kb3cuaGlzdG9yeS5wdXNoU3RhdGUoc3RhdGUsIHRpdGxlLCByb3V0ZXIucHJlZml4ICsgcGF0aClcblx0XHR9XG5cdFx0ZWxzZSAkd2luZG93LmxvY2F0aW9uLmhyZWYgPSByb3V0ZXIucHJlZml4ICsgcGF0aFxuXHR9XG5cdHJvdXRlci5kZWZpbmVSb3V0ZXMgPSBmdW5jdGlvbihyb3V0ZXMsIHJlc29sdmUsIHJlamVjdCkge1xuXHRcdGZ1bmN0aW9uIHJlc29sdmVSb3V0ZSgpIHtcblx0XHRcdHZhciBwYXRoID0gcm91dGVyLmdldFBhdGgoKVxuXHRcdFx0dmFyIHBhcmFtcyA9IHt9XG5cdFx0XHR2YXIgcGF0aG5hbWUgPSBwYXJzZVBhdGgocGF0aCwgcGFyYW1zLCBwYXJhbXMpXG5cdFx0XHR2YXIgc3RhdGUgPSAkd2luZG93Lmhpc3Rvcnkuc3RhdGVcblx0XHRcdGlmIChzdGF0ZSAhPSBudWxsKSB7XG5cdFx0XHRcdGZvciAodmFyIGsgaW4gc3RhdGUpIHBhcmFtc1trXSA9IHN0YXRlW2tdXG5cdFx0XHR9XG5cdFx0XHRmb3IgKHZhciByb3V0ZTAgaW4gcm91dGVzKSB7XG5cdFx0XHRcdHZhciBtYXRjaGVyID0gbmV3IFJlZ0V4cChcIl5cIiArIHJvdXRlMC5yZXBsYWNlKC86W15cXC9dKz9cXC57M30vZywgXCIoLio/KVwiKS5yZXBsYWNlKC86W15cXC9dKy9nLCBcIihbXlxcXFwvXSspXCIpICsgXCJcXC8/JFwiKVxuXHRcdFx0XHRpZiAobWF0Y2hlci50ZXN0KHBhdGhuYW1lKSkge1xuXHRcdFx0XHRcdHBhdGhuYW1lLnJlcGxhY2UobWF0Y2hlciwgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0XHR2YXIga2V5cyA9IHJvdXRlMC5tYXRjaCgvOlteXFwvXSsvZykgfHwgW11cblx0XHRcdFx0XHRcdHZhciB2YWx1ZXMgPSBbXS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSwgLTIpXG5cdFx0XHRcdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGtleXMubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0XHRcdFx0cGFyYW1zW2tleXNbaV0ucmVwbGFjZSgvOnxcXC4vZywgXCJcIildID0gZGVjb2RlVVJJQ29tcG9uZW50KHZhbHVlc1tpXSlcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdHJlc29sdmUocm91dGVzW3JvdXRlMF0sIHBhcmFtcywgcGF0aCwgcm91dGUwKVxuXHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0cmV0dXJuXG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdHJlamVjdChwYXRoLCBwYXJhbXMpXG5cdFx0fVxuXHRcdGlmIChzdXBwb3J0c1B1c2hTdGF0ZSkgJHdpbmRvdy5vbnBvcHN0YXRlID0gZGVib3VuY2VBc3luYyhyZXNvbHZlUm91dGUpXG5cdFx0ZWxzZSBpZiAocm91dGVyLnByZWZpeC5jaGFyQXQoMCkgPT09IFwiI1wiKSAkd2luZG93Lm9uaGFzaGNoYW5nZSA9IHJlc29sdmVSb3V0ZVxuXHRcdHJlc29sdmVSb3V0ZSgpXG5cdH1cblx0cmV0dXJuIHJvdXRlclxufVxudmFyIF8yMCA9IGZ1bmN0aW9uKCR3aW5kb3csIHJlZHJhd1NlcnZpY2UwKSB7XG5cdHZhciByb3V0ZVNlcnZpY2UgPSBjb3JlUm91dGVyKCR3aW5kb3cpXG5cdHZhciBpZGVudGl0eSA9IGZ1bmN0aW9uKHYpIHtyZXR1cm4gdn1cblx0dmFyIHJlbmRlcjEsIGNvbXBvbmVudCwgYXR0cnMzLCBjdXJyZW50UGF0aCwgbGFzdFVwZGF0ZVxuXHR2YXIgcm91dGUgPSBmdW5jdGlvbihyb290LCBkZWZhdWx0Um91dGUsIHJvdXRlcykge1xuXHRcdGlmIChyb290ID09IG51bGwpIHRocm93IG5ldyBFcnJvcihcIkVuc3VyZSB0aGUgRE9NIGVsZW1lbnQgdGhhdCB3YXMgcGFzc2VkIHRvIGBtLnJvdXRlYCBpcyBub3QgdW5kZWZpbmVkXCIpXG5cdFx0dmFyIHJ1bjEgPSBmdW5jdGlvbigpIHtcblx0XHRcdGlmIChyZW5kZXIxICE9IG51bGwpIHJlZHJhd1NlcnZpY2UwLnJlbmRlcihyb290LCByZW5kZXIxKFZub2RlKGNvbXBvbmVudCwgYXR0cnMzLmtleSwgYXR0cnMzKSkpXG5cdFx0fVxuXHRcdHZhciBiYWlsID0gZnVuY3Rpb24ocGF0aCkge1xuXHRcdFx0aWYgKHBhdGggIT09IGRlZmF1bHRSb3V0ZSkgcm91dGVTZXJ2aWNlLnNldFBhdGgoZGVmYXVsdFJvdXRlLCBudWxsLCB7cmVwbGFjZTogdHJ1ZX0pXG5cdFx0XHRlbHNlIHRocm93IG5ldyBFcnJvcihcIkNvdWxkIG5vdCByZXNvbHZlIGRlZmF1bHQgcm91dGUgXCIgKyBkZWZhdWx0Um91dGUpXG5cdFx0fVxuXHRcdHJvdXRlU2VydmljZS5kZWZpbmVSb3V0ZXMocm91dGVzLCBmdW5jdGlvbihwYXlsb2FkLCBwYXJhbXMsIHBhdGgpIHtcblx0XHRcdHZhciB1cGRhdGUgPSBsYXN0VXBkYXRlID0gZnVuY3Rpb24ocm91dGVSZXNvbHZlciwgY29tcCkge1xuXHRcdFx0XHRpZiAodXBkYXRlICE9PSBsYXN0VXBkYXRlKSByZXR1cm5cblx0XHRcdFx0Y29tcG9uZW50ID0gY29tcCAhPSBudWxsICYmICh0eXBlb2YgY29tcC52aWV3ID09PSBcImZ1bmN0aW9uXCIgfHwgdHlwZW9mIGNvbXAgPT09IFwiZnVuY3Rpb25cIik/IGNvbXAgOiBcImRpdlwiXG5cdFx0XHRcdGF0dHJzMyA9IHBhcmFtcywgY3VycmVudFBhdGggPSBwYXRoLCBsYXN0VXBkYXRlID0gbnVsbFxuXHRcdFx0XHRyZW5kZXIxID0gKHJvdXRlUmVzb2x2ZXIucmVuZGVyIHx8IGlkZW50aXR5KS5iaW5kKHJvdXRlUmVzb2x2ZXIpXG5cdFx0XHRcdHJ1bjEoKVxuXHRcdFx0fVxuXHRcdFx0aWYgKHBheWxvYWQudmlldyB8fCB0eXBlb2YgcGF5bG9hZCA9PT0gXCJmdW5jdGlvblwiKSB1cGRhdGUoe30sIHBheWxvYWQpXG5cdFx0XHRlbHNlIHtcblx0XHRcdFx0aWYgKHBheWxvYWQub25tYXRjaCkge1xuXHRcdFx0XHRcdFByb21pc2UucmVzb2x2ZShwYXlsb2FkLm9ubWF0Y2gocGFyYW1zLCBwYXRoKSkudGhlbihmdW5jdGlvbihyZXNvbHZlZCkge1xuXHRcdFx0XHRcdFx0dXBkYXRlKHBheWxvYWQsIHJlc29sdmVkKVxuXHRcdFx0XHRcdH0sIGJhaWwpXG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZSB1cGRhdGUocGF5bG9hZCwgXCJkaXZcIilcblx0XHRcdH1cblx0XHR9LCBiYWlsKVxuXHRcdHJlZHJhd1NlcnZpY2UwLnN1YnNjcmliZShyb290LCBydW4xKVxuXHR9XG5cdHJvdXRlLnNldCA9IGZ1bmN0aW9uKHBhdGgsIGRhdGEsIG9wdGlvbnMpIHtcblx0XHRpZiAobGFzdFVwZGF0ZSAhPSBudWxsKSB7XG5cdFx0XHRvcHRpb25zID0gb3B0aW9ucyB8fCB7fVxuXHRcdFx0b3B0aW9ucy5yZXBsYWNlID0gdHJ1ZVxuXHRcdH1cblx0XHRsYXN0VXBkYXRlID0gbnVsbFxuXHRcdHJvdXRlU2VydmljZS5zZXRQYXRoKHBhdGgsIGRhdGEsIG9wdGlvbnMpXG5cdH1cblx0cm91dGUuZ2V0ID0gZnVuY3Rpb24oKSB7cmV0dXJuIGN1cnJlbnRQYXRofVxuXHRyb3V0ZS5wcmVmaXggPSBmdW5jdGlvbihwcmVmaXgwKSB7cm91dGVTZXJ2aWNlLnByZWZpeCA9IHByZWZpeDB9XG5cdHJvdXRlLmxpbmsgPSBmdW5jdGlvbih2bm9kZTEpIHtcblx0XHR2bm9kZTEuZG9tLnNldEF0dHJpYnV0ZShcImhyZWZcIiwgcm91dGVTZXJ2aWNlLnByZWZpeCArIHZub2RlMS5hdHRycy5ocmVmKVxuXHRcdHZub2RlMS5kb20ub25jbGljayA9IGZ1bmN0aW9uKGUpIHtcblx0XHRcdGlmIChlLmN0cmxLZXkgfHwgZS5tZXRhS2V5IHx8IGUuc2hpZnRLZXkgfHwgZS53aGljaCA9PT0gMikgcmV0dXJuXG5cdFx0XHRlLnByZXZlbnREZWZhdWx0KClcblx0XHRcdGUucmVkcmF3ID0gZmFsc2Vcblx0XHRcdHZhciBocmVmID0gdGhpcy5nZXRBdHRyaWJ1dGUoXCJocmVmXCIpXG5cdFx0XHRpZiAoaHJlZi5pbmRleE9mKHJvdXRlU2VydmljZS5wcmVmaXgpID09PSAwKSBocmVmID0gaHJlZi5zbGljZShyb3V0ZVNlcnZpY2UucHJlZml4Lmxlbmd0aClcblx0XHRcdHJvdXRlLnNldChocmVmLCB1bmRlZmluZWQsIHVuZGVmaW5lZClcblx0XHR9XG5cdH1cblx0cm91dGUucGFyYW0gPSBmdW5jdGlvbihrZXkzKSB7XG5cdFx0aWYodHlwZW9mIGF0dHJzMyAhPT0gXCJ1bmRlZmluZWRcIiAmJiB0eXBlb2Yga2V5MyAhPT0gXCJ1bmRlZmluZWRcIikgcmV0dXJuIGF0dHJzM1trZXkzXVxuXHRcdHJldHVybiBhdHRyczNcblx0fVxuXHRyZXR1cm4gcm91dGVcbn1cbm0ucm91dGUgPSBfMjAod2luZG93LCByZWRyYXdTZXJ2aWNlKVxubS53aXRoQXR0ciA9IGZ1bmN0aW9uKGF0dHJOYW1lLCBjYWxsYmFjazEsIGNvbnRleHQpIHtcblx0cmV0dXJuIGZ1bmN0aW9uKGUpIHtcblx0XHRjYWxsYmFjazEuY2FsbChjb250ZXh0IHx8IHRoaXMsIGF0dHJOYW1lIGluIGUuY3VycmVudFRhcmdldCA/IGUuY3VycmVudFRhcmdldFthdHRyTmFtZV0gOiBlLmN1cnJlbnRUYXJnZXQuZ2V0QXR0cmlidXRlKGF0dHJOYW1lKSlcblx0fVxufVxudmFyIF8yOCA9IGNvcmVSZW5kZXJlcih3aW5kb3cpXG5tLnJlbmRlciA9IF8yOC5yZW5kZXJcbm0ucmVkcmF3ID0gcmVkcmF3U2VydmljZS5yZWRyYXdcbm0ucmVxdWVzdCA9IHJlcXVlc3RTZXJ2aWNlLnJlcXVlc3Rcbm0uanNvbnAgPSByZXF1ZXN0U2VydmljZS5qc29ucFxubS5wYXJzZVF1ZXJ5U3RyaW5nID0gcGFyc2VRdWVyeVN0cmluZ1xubS5idWlsZFF1ZXJ5U3RyaW5nID0gYnVpbGRRdWVyeVN0cmluZ1xubS52ZXJzaW9uID0gXCIxLjEuM1wiXG5tLnZub2RlID0gVm5vZGVcbmlmICh0eXBlb2YgbW9kdWxlICE9PSBcInVuZGVmaW5lZFwiKSBtb2R1bGVbXCJleHBvcnRzXCJdID0gbVxuZWxzZSB3aW5kb3cubSA9IG1cbn0oKSk7Il19
