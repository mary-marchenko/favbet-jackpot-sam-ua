(function () {
    const apiURL = 'https://fav-prom.com/api_translates';

    const ukLeng = document.querySelector('#ukLeng'),
        enLeng = document.querySelector('#enLeng');

    let locale = 'uk';

    if (ukLeng) locale = 'uk';
    if (enLeng) locale = 'en';

    let i18nData = {};

    function loadTranslations() {
        return fetch(`${apiURL}/translates/${locale}`).then(res => res.json())
            .then(json => {
                i18nData = json;
                translate();

                var mutationObserver = new MutationObserver(function (mutations) {
                    translate();
                });
                mutationObserver.observe(document.getElementById('jackpot'), {
                    childList: true,
                    subtree: true,
                });

            });
    }

    function translate() {
        const elems = document.querySelectorAll('[data-translates]')
        if (elems && elems.length) {
            elems.forEach(elem => {
                const key = elem.getAttribute('data-translate');
                elem.innerHTML = translateKey(key);
                elem.removeAttribute('data-translate');
            })
        }
        refreshLocalizedClass();
    }

    function translateKey(key) {
        if (!key) {
            return;
        }
        return i18nData[key] || '*----NEED TO BE TRANSLATED----*   key:  ' + key;
    }

    function refreshLocalizedClass(element, baseCssClass) {
        if (!element) {
            return;
        }
        for (const lang of ['uk', 'en']) {
            element.classList.remove(baseCssClass + lang);
        }
        element.classList.add(baseCssClass + locale);
    }

    const request = function (link, extraOptions) {
        return fetch(apiURL + link, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            ...(extraOptions || {})
        }).then(res => res.json())
    }


    const InitPage = () => {
        translate();
    }

    function init() {
        if (window.store) {
            var state = window.store.getState();
            userId = state.auth.isAuthorized && state.auth.id || '';
            InitPage();
        } else {
            InitPage();
            let c = 0;
            var i = setInterval(function () {
                if (c < 50) {
                    if (!!window.g_user_id) {
                        userId = window.g_user_id;
                        InitPage();
                        clearInterval(i);
                    }
                } else {
                    clearInterval(i);
                }
            }, 200);
        }
    }


    loadTranslations()
        .then(init);

    let mainPage = document.querySelector('.fav__page');
    setTimeout(() => mainPage.classList.add('overflow'), 1000);

    // Websockets
    const wsURL = 'wss://www.favbet.ua/socket';
    const socket = new WebSocket(wsURL);

    const extractJackpotAmounts = (data) => {
        const defaultCategories = { major: 0, minor: 0, mini: 0, mega: 0 };
        const jackpots = data.data;

        return Object.keys(defaultCategories).reduce((amounts, jackpotType) => {
            amounts[jackpotType] = jackpots[jackpotType] ? jackpots[jackpotType].amount : 0;
            return amounts;
        }, {});
    };

    const updatePrizeElements = (jackpotAmounts) => {
        for (const [category, amount] of Object.entries(jackpotAmounts)) {
            const element = document.querySelector(`.prize-${category}`);
            if (element) {
                element.textContent = `${amount.toFixed(2)}₴`;
            }
        }
    };

    socket.onmessage = (event) => {
        try {
            const message = JSON.parse(event.data);
            if (message.event === 'jackpots_update') {
                const jackpotAmounts = extractJackpotAmounts(message);
                updatePrizeElements(jackpotAmounts);
            }
        } catch (error) {
            console.error('Error parsing message:', error);
        }
    };

    socket.onerror = (error) => {
        console.error('WebSocket Error:', error);
    };

    const sendPing = () => {
        if (socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify({ cmd: "ping", cid: "ping" }));
            console.log('Ping message sent');
        }
    };

    socket.onopen = () => {
        console.log('WebSocket connection established');

        const cid = crypto.randomUUID();
        socket.send(JSON.stringify({
            cmd: "subscribe_jackpot_updates",
            cid: cid
        }));
        setInterval(sendPing, 50000);
    };

    socket.onclose = () => {
        console.log('WebSocket connection closed');
    };

})();
