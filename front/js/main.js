(function () {
    const apiURL = 'https://fav-prom.com/api_ny_ro';
    const FIRST_TABLE_USERS = 7;

    const
        unauthMsgs = document.querySelectorAll('.unauth-msg'),
        youAreInBtns = document.querySelectorAll('.took-part'),
        participateBtns = document.querySelectorAll('.btn-join');

    const roLeng = document.querySelector('#roLeng');

    let locale = 'ro';

    if (roLeng) locale = 'ro';

    let i18nData = {};
    let userId;
    // userId = 66756756;

    function loadTranslations() {
        return fetch(`${apiURL}/translates/${locale}`).then(res => res.json())
            .then(json => {
                i18nData = json;
                translate();

                var mutationObserver = new MutationObserver(function (mutations) {
                    translate();
                });
                mutationObserver.observe(document.getElementById('newYear2024'), {
                    childList: true,
                    subtree: true,
                });

            });
    }

    function translate() {
        const elems = document.querySelectorAll('[data-translate]')
        if (elems && elems.length) {
            elems.forEach(elem => {
                const key = elem.getAttribute('data-translate');
                elem.innerHTML = translateKey(key);
                elem.removeAttribute('data-translate');
            })
        }
        const bannerDesk = document.querySelector('.banner-desk');
        const bannerMob = document.querySelector('.banner-mob');
        refreshLocalizedClass(bannerDesk, 'banner-desk-');
        refreshLocalizedClass(bannerMob, 'banner-mob-');
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
        for (const lang of ['ro']) {
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

    function getUsers() {
        return request('/users');
    }

    const InitPage = () => {
        getUsers().then(users => {
            users = users.sort((a, b) => b.points - a.points);
            renderUsers(users);
            translate();
        })
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
                        checkUserAuth();
                        clearInterval(i);
                    }
                } else {
                    clearInterval(i);
                }
            }, 200);
        }

        checkUserAuth();

        participateBtns.forEach((authBtn, i) => {
            authBtn.addEventListener('click', (e) => {
                e.preventDefault();

                request('/user', {
                    method: 'POST',
                    body: JSON.stringify({
                        userid: userId
                    })
                }).then(res => {
                    participateBtns.forEach(item => item.classList.add('hide'));
                    youAreInBtns.forEach(item => item.classList.remove('hide'));
                    InitPage();
                });
            });
        });
    }

    function renderUsers(users) {
        users = users.sort((a, b) => b.points - a.points);

        const firstTableUsers = users.slice(0, FIRST_TABLE_USERS);
        populateUsersTable(firstTableUsers, userId, document.querySelector('#results-table-one'), getPrizeTranslationKeyFirst);

        const secondTableUsers = users.filter((user) => !firstTableUsers.includes(user));
        populateUsersTable(secondTableUsers, userId, document.querySelector('#results-table-two'), getPrizeTranslationKeySecond);
    }

    function populateUsersTable(users, currentUserId, table, getPrizeTranslationKey) {
        table.innerHTML = '';
        if (users && users.length) {
            const currentUser = userId && users.find(user => user.userid === currentUserId);
            if (currentUser) {
                displayUser(currentUser, users, true, table, getPrizeTranslationKey);
            }

            users.forEach((user) => {
                if (user.userid !== currentUserId) {
                    displayUser(user, users, false, table, getPrizeTranslationKey);
                }
            });
        }
    }

    function displayUser(user, allUsers, isCurrentUser, table, getPrizeTranslationKey) {
        const additionalUserRow = document.createElement('div');
        additionalUserRow.classList.add('tableResults__row');
        if (isCurrentUser) {
            additionalUserRow.classList.add('you');
        }

        const place = allUsers.indexOf(user) + 1;

        const prizeKey = getPrizeTranslationKey(place);
        additionalUserRow.innerHTML = `
                <div class="tableResults__body-col"> ${place} ${isCurrentUser ? '<span data-translate="you">(tu)</span>' : ''}</div>
                <div class="tableResults__body-col">${user.userid}</div>
                <div class="tableResults__body-col">${Math.round(user.points * 100) / 100}</div>
                <div class="tableResults__body-col">${prizeKey ? translateKey(prizeKey) : ' - '}</div>
            `;
        table.append(additionalUserRow);
    }

    function getPrizeTranslationKeyFirst(place) {
        if (place <= 7) {
            return `prize_${place}`
        }
    }

    function getPrizeTranslationKeySecond(place) {
        let adjustedPlace = place + 7;

        switch (true) {
            case adjustedPlace <= 15:
                return `prize_${adjustedPlace}`;
            case adjustedPlace <= 20:
                return 'prize_16-20';
            case adjustedPlace <= 25:
                return 'prize_21-25';
            case adjustedPlace <= 35:
                return 'prize_26-35';
            case adjustedPlace <= 50:
                return 'prize_36-50';
            default:
                return undefined;
        }
    }


    let checkUserAuth = () => {
        if (userId) {
            for (const unauthMes of unauthMsgs) {
                unauthMes.classList.add('hide');
            }
            request(`/favuser/${userId}?nocache=1`)
                .then(res => {
                    if (res._id) {
                        participateBtns.forEach(item => item.classList.add('hide'));
                        youAreInBtns.forEach(item => item.classList.remove('hide'));
                    } else {
                        participateBtns.forEach(item => item.classList.remove('hide'));
                    }
                })
        } else {
            for (let participateBtn of participateBtns) {
                participateBtn.classList.add('hide');
            }
            for (const unauthMes of unauthMsgs) {
                unauthMes.classList.remove('hide');
            }
        }
    }


    loadTranslations()
        .then(init);

    let mainPage = document.querySelector('.fav__page');
    setTimeout(() => mainPage.classList.add('overflow'), 1000);

    function pauseRandomly(element) {
        setTimeout(function () {
            element.classList.add('pause');
            setTimeout(function () {
                element.classList.remove('pause');
            }, Math.random() * 8000);
        }, Math.random() * 5000);
    }

    const prizes = document.querySelectorAll('.prize__item-img img');

    prizes.forEach(pauseRandomly);
})();


