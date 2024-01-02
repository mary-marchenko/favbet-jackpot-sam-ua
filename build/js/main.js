"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
(function () {
  var apiURL = 'https://fav-prom.com/api_ny_ro';
  var FIRST_TABLE_USERS = 7;
  var unauthMsgs = document.querySelectorAll('.unauth-msg'),
    youAreInBtns = document.querySelectorAll('.took-part'),
    participateBtns = document.querySelectorAll('.btn-join');
  var roLeng = document.querySelector('#roLeng');
  var locale = 'ro';
  if (roLeng) locale = 'ro';
  var i18nData = {};
  var userId;
  // userId = 66756756;

  function loadTranslations() {
    return fetch("".concat(apiURL, "/translates/").concat(locale)).then(function (res) {
      return res.json();
    }).then(function (json) {
      i18nData = json;
      translate();
      var mutationObserver = new MutationObserver(function (mutations) {
        translate();
      });
      mutationObserver.observe(document.getElementById('newYear2024'), {
        childList: true,
        subtree: true
      });
    });
  }
  function translate() {
    var elems = document.querySelectorAll('[data-translate]');
    if (elems && elems.length) {
      elems.forEach(function (elem) {
        var key = elem.getAttribute('data-translate');
        elem.innerHTML = translateKey(key);
        elem.removeAttribute('data-translate');
      });
    }
    var bannerDesk = document.querySelector('.banner-desk');
    var bannerMob = document.querySelector('.banner-mob');
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
    for (var _i = 0, _arr = ['ro']; _i < _arr.length; _i++) {
      var lang = _arr[_i];
      element.classList.remove(baseCssClass + lang);
    }
    element.classList.add(baseCssClass + locale);
  }
  var request = function request(link, extraOptions) {
    return fetch(apiURL + link, _objectSpread({
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }, extraOptions || {})).then(function (res) {
      return res.json();
    });
  };
  function getUsers() {
    return request('/users');
  }
  var InitPage = function InitPage() {
    getUsers().then(function (users) {
      users = users.sort(function (a, b) {
        return b.points - a.points;
      });
      renderUsers(users);
      translate();
    });
  };
  function init() {
    if (window.store) {
      var state = window.store.getState();
      userId = state.auth.isAuthorized && state.auth.id || '';
      InitPage();
    } else {
      InitPage();
      var c = 0;
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
    participateBtns.forEach(function (authBtn, i) {
      authBtn.addEventListener('click', function (e) {
        e.preventDefault();
        request('/user', {
          method: 'POST',
          body: JSON.stringify({
            userid: userId
          })
        }).then(function (res) {
          participateBtns.forEach(function (item) {
            return item.classList.add('hide');
          });
          youAreInBtns.forEach(function (item) {
            return item.classList.remove('hide');
          });
          InitPage();
        });
      });
    });
  }
  function renderUsers(users) {
    users = users.sort(function (a, b) {
      return b.points - a.points;
    });
    var firstTableUsers = users.slice(0, FIRST_TABLE_USERS);
    populateUsersTable(firstTableUsers, userId, document.querySelector('#results-table-one'), getPrizeTranslationKeyFirst);
    var secondTableUsers = users.filter(function (user) {
      return !firstTableUsers.includes(user);
    });
    populateUsersTable(secondTableUsers, userId, document.querySelector('#results-table-two'), getPrizeTranslationKeySecond);
  }
  function populateUsersTable(users, currentUserId, table, getPrizeTranslationKey) {
    table.innerHTML = '';
    if (users && users.length) {
      var currentUser = userId && users.find(function (user) {
        return user.userid === currentUserId;
      });
      if (currentUser) {
        displayUser(currentUser, users, true, table, getPrizeTranslationKey);
      }
      users.forEach(function (user) {
        if (user.userid !== currentUserId) {
          displayUser(user, users, false, table, getPrizeTranslationKey);
        }
      });
    }
  }
  function displayUser(user, allUsers, isCurrentUser, table, getPrizeTranslationKey) {
    var additionalUserRow = document.createElement('div');
    additionalUserRow.classList.add('tableResults__row');
    if (isCurrentUser) {
      additionalUserRow.classList.add('you');
    }
    var place = allUsers.indexOf(user) + 1;
    var prizeKey = getPrizeTranslationKey(place);
    additionalUserRow.innerHTML = "\n                <div class=\"tableResults__body-col\"> ".concat(place, " ").concat(isCurrentUser ? '<span data-translate="you">(tu)</span>' : '', "</div>\n                <div class=\"tableResults__body-col\">").concat(user.userid, "</div>\n                <div class=\"tableResults__body-col\">").concat(Math.round(user.points * 100) / 100, "</div>\n                <div class=\"tableResults__body-col\">").concat(prizeKey ? translateKey(prizeKey) : ' - ', "</div>\n            ");
    table.append(additionalUserRow);
  }
  function getPrizeTranslationKeyFirst(place) {
    if (place <= 7) {
      return "prize_".concat(place);
    }
  }
  function getPrizeTranslationKeySecond(place) {
    var adjustedPlace = place + 7;
    switch (true) {
      case adjustedPlace <= 15:
        return "prize_".concat(adjustedPlace);
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
  var checkUserAuth = function checkUserAuth() {
    if (userId) {
      var _iterator = _createForOfIteratorHelper(unauthMsgs),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var unauthMes = _step.value;
          unauthMes.classList.add('hide');
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
      request("/favuser/".concat(userId, "?nocache=1")).then(function (res) {
        if (res._id) {
          participateBtns.forEach(function (item) {
            return item.classList.add('hide');
          });
          youAreInBtns.forEach(function (item) {
            return item.classList.remove('hide');
          });
        } else {
          participateBtns.forEach(function (item) {
            return item.classList.remove('hide');
          });
        }
      });
    } else {
      var _iterator2 = _createForOfIteratorHelper(participateBtns),
        _step2;
      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var participateBtn = _step2.value;
          participateBtn.classList.add('hide');
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }
      var _iterator3 = _createForOfIteratorHelper(unauthMsgs),
        _step3;
      try {
        for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
          var _unauthMes = _step3.value;
          _unauthMes.classList.remove('hide');
        }
      } catch (err) {
        _iterator3.e(err);
      } finally {
        _iterator3.f();
      }
    }
  };
  loadTranslations().then(init);
  var mainPage = document.querySelector('.fav__page');
  setTimeout(function () {
    return mainPage.classList.add('overflow');
  }, 1000);
  function pauseRandomly(element) {
    setTimeout(function () {
      element.classList.add('pause');
      setTimeout(function () {
        element.classList.remove('pause');
      }, Math.random() * 8000);
    }, Math.random() * 5000);
  }
  var prizes = document.querySelectorAll('.prize__item-img img');
  prizes.forEach(pauseRandomly);
})();
"use strict";
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4uanMiLCJzZWNvbmQuanMiXSwibmFtZXMiOlsiYXBpVVJMIiwiRklSU1RfVEFCTEVfVVNFUlMiLCJ1bmF1dGhNc2dzIiwiZG9jdW1lbnQiLCJxdWVyeVNlbGVjdG9yQWxsIiwieW91QXJlSW5CdG5zIiwicGFydGljaXBhdGVCdG5zIiwicm9MZW5nIiwicXVlcnlTZWxlY3RvciIsImxvY2FsZSIsImkxOG5EYXRhIiwidXNlcklkIiwibG9hZFRyYW5zbGF0aW9ucyIsImZldGNoIiwiY29uY2F0IiwidGhlbiIsInJlcyIsImpzb24iLCJ0cmFuc2xhdGUiLCJtdXRhdGlvbk9ic2VydmVyIiwiTXV0YXRpb25PYnNlcnZlciIsIm11dGF0aW9ucyIsIm9ic2VydmUiLCJnZXRFbGVtZW50QnlJZCIsImNoaWxkTGlzdCIsInN1YnRyZWUiLCJlbGVtcyIsImxlbmd0aCIsImZvckVhY2giLCJlbGVtIiwia2V5IiwiZ2V0QXR0cmlidXRlIiwiaW5uZXJIVE1MIiwidHJhbnNsYXRlS2V5IiwicmVtb3ZlQXR0cmlidXRlIiwiYmFubmVyRGVzayIsImJhbm5lck1vYiIsInJlZnJlc2hMb2NhbGl6ZWRDbGFzcyIsImVsZW1lbnQiLCJiYXNlQ3NzQ2xhc3MiLCJfaSIsIl9hcnIiLCJsYW5nIiwiY2xhc3NMaXN0IiwicmVtb3ZlIiwiYWRkIiwicmVxdWVzdCIsImxpbmsiLCJleHRyYU9wdGlvbnMiLCJfb2JqZWN0U3ByZWFkIiwiaGVhZGVycyIsImdldFVzZXJzIiwiSW5pdFBhZ2UiLCJ1c2VycyIsInNvcnQiLCJhIiwiYiIsInBvaW50cyIsInJlbmRlclVzZXJzIiwiaW5pdCIsIndpbmRvdyIsInN0b3JlIiwic3RhdGUiLCJnZXRTdGF0ZSIsImF1dGgiLCJpc0F1dGhvcml6ZWQiLCJpZCIsImMiLCJpIiwic2V0SW50ZXJ2YWwiLCJnX3VzZXJfaWQiLCJjaGVja1VzZXJBdXRoIiwiY2xlYXJJbnRlcnZhbCIsImF1dGhCdG4iLCJhZGRFdmVudExpc3RlbmVyIiwiZSIsInByZXZlbnREZWZhdWx0IiwibWV0aG9kIiwiYm9keSIsIkpTT04iLCJzdHJpbmdpZnkiLCJ1c2VyaWQiLCJpdGVtIiwiZmlyc3RUYWJsZVVzZXJzIiwic2xpY2UiLCJwb3B1bGF0ZVVzZXJzVGFibGUiLCJnZXRQcml6ZVRyYW5zbGF0aW9uS2V5Rmlyc3QiLCJzZWNvbmRUYWJsZVVzZXJzIiwiZmlsdGVyIiwidXNlciIsImluY2x1ZGVzIiwiZ2V0UHJpemVUcmFuc2xhdGlvbktleVNlY29uZCIsImN1cnJlbnRVc2VySWQiLCJ0YWJsZSIsImdldFByaXplVHJhbnNsYXRpb25LZXkiLCJjdXJyZW50VXNlciIsImZpbmQiLCJkaXNwbGF5VXNlciIsImFsbFVzZXJzIiwiaXNDdXJyZW50VXNlciIsImFkZGl0aW9uYWxVc2VyUm93IiwiY3JlYXRlRWxlbWVudCIsInBsYWNlIiwiaW5kZXhPZiIsInByaXplS2V5IiwiTWF0aCIsInJvdW5kIiwiYXBwZW5kIiwiYWRqdXN0ZWRQbGFjZSIsInVuZGVmaW5lZCIsIl9pdGVyYXRvciIsIl9jcmVhdGVGb3JPZkl0ZXJhdG9ySGVscGVyIiwiX3N0ZXAiLCJzIiwibiIsImRvbmUiLCJ1bmF1dGhNZXMiLCJ2YWx1ZSIsImVyciIsImYiLCJfaWQiLCJfaXRlcmF0b3IyIiwiX3N0ZXAyIiwicGFydGljaXBhdGVCdG4iLCJfaXRlcmF0b3IzIiwiX3N0ZXAzIiwibWFpblBhZ2UiLCJzZXRUaW1lb3V0IiwicGF1c2VSYW5kb21seSIsInJhbmRvbSIsInByaXplcyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFBQSxDQUFDLFlBQVk7RUFDVCxJQUFNQSxNQUFNLEdBQUcsZ0NBQWdDO0VBQy9DLElBQU1DLGlCQUFpQixHQUFHLENBQUM7RUFFM0IsSUFDSUMsVUFBVSxHQUFHQyxRQUFRLENBQUNDLGdCQUFnQixDQUFDLGFBQWEsQ0FBQztJQUNyREMsWUFBWSxHQUFHRixRQUFRLENBQUNDLGdCQUFnQixDQUFDLFlBQVksQ0FBQztJQUN0REUsZUFBZSxHQUFHSCxRQUFRLENBQUNDLGdC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QUFTLE1BQUEsQ0FBQVIsS0FBQTtVQUNoQkQsVUFBUyxDQUFDekUsU0FBUyxDQUFDQyxNQUFNLENBQUMsTUFBTSxDQUFDO1FBQ3RDO01BQUMsU0FBQTBFLEdBQUE7UUFBQU0sVUFBQSxDQUFBakQsQ0FBQSxDQUFBMkMsR0FBQTtNQUFBO1FBQUFNLFVBQUEsQ0FBQUwsQ0FBQTtNQUFBO0lBQ0w7RUFDSixDQUFDO0VBR0QzRyxnQkFBZ0IsQ0FBQyxDQUFDLENBQ2JHLElBQUksQ0FBQzRDLElBQUksQ0FBQztFQUVmLElBQUltRSxRQUFRLEdBQUczSCxRQUFRLENBQUNLLGFBQWEsQ0FBQyxZQUFZLENBQUM7RUFDbkR1SCxVQUFVLENBQUM7SUFBQSxPQUFNRCxRQUFRLENBQUNuRixTQUFTLENBQUNFLEdBQUcsQ0FBQyxVQUFVLENBQUM7RUFBQSxHQUFFLElBQUksQ0FBQztFQUUxRCxTQUFTbUYsYUFBYUEsQ0FBQzFGLE9BQU8sRUFBRTtJQUM1QnlGLFVBQVUsQ0FBQyxZQUFZO01BQ25CekYsT0FBTyxDQUFDSyxTQUFTLENBQUNFLEdBQUcsQ0FBQyxPQUFPLENBQUM7TUFDOUJrRixVQUFVLENBQUMsWUFBWTtRQUNuQnpGLE9BQU8sQ0FBQ0ssU0FBUyxDQUFDQyxNQUFNLENBQUMsT0FBTyxDQUFDO01BQ3JDLENBQUMsRUFBRTZELElBQUksQ0FBQ3dCLE1BQU0sQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDO0lBQzVCLENBQUMsRUFBRXhCLElBQUksQ0FBQ3dCLE1BQU0sQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDO0VBQzVCO0VBRUEsSUFBTUMsTUFBTSxHQUFHL0gsUUFBUSxDQUFDQyxnQkFBZ0IsQ0FBQyxzQkFBc0IsQ0FBQztFQUVoRThILE1BQU0sQ0FBQ3RHLE9BQU8sQ0FBQ29HLGFBQWEsQ0FBQztBQUNqQyxDQUFDLEVBQUUsQ0FBQztBQ3RQSiIsImZpbGUiOiJtYWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uICgpIHtcbiAgICBjb25zdCBhcGlVUkwgPSAnaHR0cHM6Ly9mYXYtcHJvbS5jb20vYXBpX255X3JvJztcbiAgICBjb25zdCBGSVJTVF9UQUJMRV9VU0VSUyA9IDc7XG5cbiAgICBjb25zdFxuICAgICAgICB1bmF1dGhNc2dzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnVuYXV0aC1tc2cnKSxcbiAgICAgICAgeW91QXJlSW5CdG5zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnRvb2stcGFydCcpLFxuICAgICAgICBwYXJ0aWNpcGF0ZUJ0bnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuYnRuLWpvaW4nKTtcblxuICAgIGNvbnN0IHJvTGVuZyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNyb0xlbmcnKTtcblxuICAgIGxldCBsb2NhbGUgPSAncm8nO1xuXG4gICAgaWYgKHJvTGVuZykgbG9jYWxlID0gJ3JvJztcblxuICAgIGxldCBpMThuRGF0YSA9IHt9O1xuICAgIGxldCB1c2VySWQ7XG4gICAgLy8gdXNlcklkID0gNjY3NTY3NTY7XG5cbiAgICBmdW5jdGlvbiBsb2FkVHJhbnNsYXRpb25zKCkge1xuICAgICAgICByZXR1cm4gZmV0Y2goYCR7YXBpVVJMfS90cmFuc2xhdGVzLyR7bG9jYWxlfWApLnRoZW4ocmVzID0+IHJlcy5qc29uKCkpXG4gICAgICAgICAgICAudGhlbihqc29uID0+IHtcbiAgICAgICAgICAgICAgICBpMThuRGF0YSA9IGpzb247XG4gICAgICAgICAgICAgICAgdHJhbnNsYXRlKCk7XG5cbiAgICAgICAgICAgICAgICB2YXIgbXV0YXRpb25PYnNlcnZlciA9IG5ldyBNdXRhdGlvbk9ic2VydmVyKGZ1bmN0aW9uIChtdXRhdGlvbnMpIHtcbiAgICAgICAgICAgICAgICAgICAgdHJhbnNsYXRlKCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgbXV0YXRpb25PYnNlcnZlci5vYnNlcnZlKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCduZXdZZWFyMjAyNCcpLCB7XG4gICAgICAgICAgICAgICAgICAgIGNoaWxkTGlzdDogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgc3VidHJlZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gdHJhbnNsYXRlKCkge1xuICAgICAgICBjb25zdCBlbGVtcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ1tkYXRhLXRyYW5zbGF0ZV0nKVxuICAgICAgICBpZiAoZWxlbXMgJiYgZWxlbXMubGVuZ3RoKSB7XG4gICAgICAgICAgICBlbGVtcy5mb3JFYWNoKGVsZW0gPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IGtleSA9IGVsZW0uZ2V0QXR0cmlidXRlKCdkYXRhLXRyYW5zbGF0ZScpO1xuICAgICAgICAgICAgICAgIGVsZW0uaW5uZXJIVE1MID0gdHJhbnNsYXRlS2V5KGtleSk7XG4gICAgICAgICAgICAgICAgZWxlbS5yZW1vdmVBdHRyaWJ1dGUoJ2RhdGEtdHJhbnNsYXRlJyk7XG4gICAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGJhbm5lckRlc2sgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuYmFubmVyLWRlc2snKTtcbiAgICAgICAgY29uc3QgYmFubmVyTW9iID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmJhbm5lci1tb2InKTtcbiAgICAgICAgcmVmcmVzaExvY2FsaXplZENsYXNzKGJhbm5lckRlc2ssICdiYW5uZXItZGVzay0nKTtcbiAgICAgICAgcmVmcmVzaExvY2FsaXplZENsYXNzKGJhbm5lck1vYiwgJ2Jhbm5lci1tb2ItJyk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gdHJhbnNsYXRlS2V5KGtleSkge1xuICAgICAgICBpZiAoIWtleSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBpMThuRGF0YVtrZXldIHx8ICcqLS0tLU5FRUQgVE8gQkUgVFJBTlNMQVRFRC0tLS0qICAga2V5OiAgJyArIGtleTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiByZWZyZXNoTG9jYWxpemVkQ2xhc3MoZWxlbWVudCwgYmFzZUNzc0NsYXNzKSB7XG4gICAgICAgIGlmICghZWxlbWVudCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGZvciAoY29uc3QgbGFuZyBvZiBbJ3JvJ10pIHtcbiAgICAgICAgICAgIGVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZShiYXNlQ3NzQ2xhc3MgKyBsYW5nKTtcbiAgICAgICAgfVxuICAgICAgICBlbGVtZW50LmNsYXNzTGlzdC5hZGQoYmFzZUNzc0NsYXNzICsgbG9jYWxlKTtcbiAgICB9XG5cbiAgICBjb25zdCByZXF1ZXN0ID0gZnVuY3Rpb24gKGxpbmssIGV4dHJhT3B0aW9ucykge1xuICAgICAgICByZXR1cm4gZmV0Y2goYXBpVVJMICsgbGluaywge1xuICAgICAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICAgICAgICdBY2NlcHQnOiAnYXBwbGljYXRpb24vanNvbicsXG4gICAgICAgICAgICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJ1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIC4uLihleHRyYU9wdGlvbnMgfHwge30pXG4gICAgICAgIH0pLnRoZW4ocmVzID0+IHJlcy5qc29uKCkpXG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0VXNlcnMoKSB7XG4gICAgICAgIHJldHVybiByZXF1ZXN0KCcvdXNlcnMnKTtcbiAgICB9XG5cbiAgICBjb25zdCBJbml0UGFnZSA9ICgpID0+IHtcbiAgICAgICAgZ2V0VXNlcnMoKS50aGVuKHVzZXJzID0+IHtcbiAgICAgICAgICAgIHVzZXJzID0gdXNlcnMuc29ydCgoYSwgYikgPT4gYi5wb2ludHMgLSBhLnBvaW50cyk7XG4gICAgICAgICAgICByZW5kZXJVc2Vycyh1c2Vycyk7XG4gICAgICAgICAgICB0cmFuc2xhdGUoKTtcbiAgICAgICAgfSlcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpbml0KCkge1xuICAgICAgICBpZiAod2luZG93LnN0b3JlKSB7XG4gICAgICAgICAgICB2YXIgc3RhdGUgPSB3aW5kb3cuc3RvcmUuZ2V0U3RhdGUoKTtcbiAgICAgICAgICAgIHVzZXJJZCA9IHN0YXRlLmF1dGguaXNBdXRob3JpemVkICYmIHN0YXRlLmF1dGguaWQgfHwgJyc7XG4gICAgICAgICAgICBJbml0UGFnZSgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgSW5pdFBhZ2UoKTtcbiAgICAgICAgICAgIGxldCBjID0gMDtcbiAgICAgICAgICAgIHZhciBpID0gc2V0SW50ZXJ2YWwoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGlmIChjIDwgNTApIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCEhd2luZG93LmdfdXNlcl9pZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdXNlcklkID0gd2luZG93LmdfdXNlcl9pZDtcbiAgICAgICAgICAgICAgICAgICAgICAgIEluaXRQYWdlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBjaGVja1VzZXJBdXRoKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBjbGVhckludGVydmFsKGkpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgY2xlYXJJbnRlcnZhbChpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LCAyMDApO1xuICAgICAgICB9XG5cbiAgICAgICAgY2hlY2tVc2VyQXV0aCgpO1xuXG4gICAgICAgIHBhcnRpY2lwYXRlQnRucy5mb3JFYWNoKChhdXRoQnRuLCBpKSA9PiB7XG4gICAgICAgICAgICBhdXRoQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHtcbiAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgICAgICAgICByZXF1ZXN0KCcvdXNlcicsIHtcbiAgICAgICAgICAgICAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICAgICAgICAgICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHVzZXJpZDogdXNlcklkXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgfSkudGhlbihyZXMgPT4ge1xuICAgICAgICAgICAgICAgICAgICBwYXJ0aWNpcGF0ZUJ0bnMuZm9yRWFjaChpdGVtID0+IGl0ZW0uY2xhc3NMaXN0LmFkZCgnaGlkZScpKTtcbiAgICAgICAgICAgICAgICAgICAgeW91QXJlSW5CdG5zLmZvckVhY2goaXRlbSA9PiBpdGVtLmNsYXNzTGlzdC5yZW1vdmUoJ2hpZGUnKSk7XG4gICAgICAgICAgICAgICAgICAgIEluaXRQYWdlKCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcmVuZGVyVXNlcnModXNlcnMpIHtcbiAgICAgICAgdXNlcnMgPSB1c2Vycy5zb3J0KChhLCBiKSA9PiBiLnBvaW50cyAtIGEucG9pbnRzKTtcblxuICAgICAgICBjb25zdCBmaXJzdFRhYmxlVXNlcnMgPSB1c2Vycy5zbGljZSgwLCBGSVJTVF9UQUJMRV9VU0VSUyk7XG4gICAgICAgIHBvcHVsYXRlVXNlcnNUYWJsZShmaXJzdFRhYmxlVXNlcnMsIHVzZXJJZCwgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3Jlc3VsdHMtdGFibGUtb25lJyksIGdldFByaXplVHJhbnNsYXRpb25LZXlGaXJzdCk7XG5cbiAgICAgICAgY29uc3Qgc2Vjb25kVGFibGVVc2VycyA9IHVzZXJzLmZpbHRlcigodXNlcikgPT4gIWZpcnN0VGFibGVVc2Vycy5pbmNsdWRlcyh1c2VyKSk7XG4gICAgICAgIHBvcHVsYXRlVXNlcnNUYWJsZShzZWNvbmRUYWJsZVVzZXJzLCB1c2VySWQsIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNyZXN1bHRzLXRhYmxlLXR3bycpLCBnZXRQcml6ZVRyYW5zbGF0aW9uS2V5U2Vjb25kKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBwb3B1bGF0ZVVzZXJzVGFibGUodXNlcnMsIGN1cnJlbnRVc2VySWQsIHRhYmxlLCBnZXRQcml6ZVRyYW5zbGF0aW9uS2V5KSB7XG4gICAgICAgIHRhYmxlLmlubmVySFRNTCA9ICcnO1xuICAgICAgICBpZiAodXNlcnMgJiYgdXNlcnMubGVuZ3RoKSB7XG4gICAgICAgICAgICBjb25zdCBjdXJyZW50VXNlciA9IHVzZXJJZCAmJiB1c2Vycy5maW5kKHVzZXIgPT4gdXNlci51c2VyaWQgPT09IGN1cnJlbnRVc2VySWQpO1xuICAgICAgICAgICAgaWYgKGN1cnJlbnRVc2VyKSB7XG4gICAgICAgICAgICAgICAgZGlzcGxheVVzZXIoY3VycmVudFVzZXIsIHVzZXJzLCB0cnVlLCB0YWJsZSwgZ2V0UHJpemVUcmFuc2xhdGlvbktleSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHVzZXJzLmZvckVhY2goKHVzZXIpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAodXNlci51c2VyaWQgIT09IGN1cnJlbnRVc2VySWQpIHtcbiAgICAgICAgICAgICAgICAgICAgZGlzcGxheVVzZXIodXNlciwgdXNlcnMsIGZhbHNlLCB0YWJsZSwgZ2V0UHJpemVUcmFuc2xhdGlvbktleSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBkaXNwbGF5VXNlcih1c2VyLCBhbGxVc2VycywgaXNDdXJyZW50VXNlciwgdGFibGUsIGdldFByaXplVHJhbnNsYXRpb25LZXkpIHtcbiAgICAgICAgY29uc3QgYWRkaXRpb25hbFVzZXJSb3cgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgYWRkaXRpb25hbFVzZXJSb3cuY2xhc3NMaXN0LmFkZCgndGFibGVSZXN1bHRzX19yb3cnKTtcbiAgICAgICAgaWYgKGlzQ3VycmVudFVzZXIpIHtcbiAgICAgICAgICAgIGFkZGl0aW9uYWxVc2VyUm93LmNsYXNzTGlzdC5hZGQoJ3lvdScpO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgcGxhY2UgPSBhbGxVc2Vycy5pbmRleE9mKHVzZXIpICsgMTtcblxuICAgICAgICBjb25zdCBwcml6ZUtleSA9IGdldFByaXplVHJhbnNsYXRpb25LZXkocGxhY2UpO1xuICAgICAgICBhZGRpdGlvbmFsVXNlclJvdy5pbm5lckhUTUwgPSBgXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInRhYmxlUmVzdWx0c19fYm9keS1jb2xcIj4gJHtwbGFjZX0gJHtpc0N1cnJlbnRVc2VyID8gJzxzcGFuIGRhdGEtdHJhbnNsYXRlPVwieW91XCI+KHR1KTwvc3Bhbj4nIDogJyd9PC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInRhYmxlUmVzdWx0c19fYm9keS1jb2xcIj4ke3VzZXIudXNlcmlkfTwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ0YWJsZVJlc3VsdHNfX2JvZHktY29sXCI+JHtNYXRoLnJvdW5kKHVzZXIucG9pbnRzICogMTAwKSAvIDEwMH08L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwidGFibGVSZXN1bHRzX19ib2R5LWNvbFwiPiR7cHJpemVLZXkgPyB0cmFuc2xhdGVLZXkocHJpemVLZXkpIDogJyAtICd9PC9kaXY+XG4gICAgICAgICAgICBgO1xuICAgICAgICB0YWJsZS5hcHBlbmQoYWRkaXRpb25hbFVzZXJSb3cpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldFByaXplVHJhbnNsYXRpb25LZXlGaXJzdChwbGFjZSkge1xuICAgICAgICBpZiAocGxhY2UgPD0gNykge1xuICAgICAgICAgICAgcmV0dXJuIGBwcml6ZV8ke3BsYWNlfWBcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldFByaXplVHJhbnNsYXRpb25LZXlTZWNvbmQocGxhY2UpIHtcbiAgICAgICAgbGV0IGFkanVzdGVkUGxhY2UgPSBwbGFjZSArIDc7XG5cbiAgICAgICAgc3dpdGNoICh0cnVlKSB7XG4gICAgICAgICAgICBjYXNlIGFkanVzdGVkUGxhY2UgPD0gMTU6XG4gICAgICAgICAgICAgICAgcmV0dXJuIGBwcml6ZV8ke2FkanVzdGVkUGxhY2V9YDtcbiAgICAgICAgICAgIGNhc2UgYWRqdXN0ZWRQbGFjZSA8PSAyMDpcbiAgICAgICAgICAgICAgICByZXR1cm4gJ3ByaXplXzE2LTIwJztcbiAgICAgICAgICAgIGNhc2UgYWRqdXN0ZWRQbGFjZSA8PSAyNTpcbiAgICAgICAgICAgICAgICByZXR1cm4gJ3ByaXplXzIxLTI1JztcbiAgICAgICAgICAgIGNhc2UgYWRqdXN0ZWRQbGFjZSA8PSAzNTpcbiAgICAgICAgICAgICAgICByZXR1cm4gJ3ByaXplXzI2LTM1JztcbiAgICAgICAgICAgIGNhc2UgYWRqdXN0ZWRQbGFjZSA8PSA1MDpcbiAgICAgICAgICAgICAgICByZXR1cm4gJ3ByaXplXzM2LTUwJztcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgfVxuICAgIH1cblxuXG4gICAgbGV0IGNoZWNrVXNlckF1dGggPSAoKSA9PiB7XG4gICAgICAgIGlmICh1c2VySWQpIHtcbiAgICAgICAgICAgIGZvciAoY29uc3QgdW5hdXRoTWVzIG9mIHVuYXV0aE1zZ3MpIHtcbiAgICAgICAgICAgICAgICB1bmF1dGhNZXMuY2xhc3NMaXN0LmFkZCgnaGlkZScpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmVxdWVzdChgL2ZhdnVzZXIvJHt1c2VySWR9P25vY2FjaGU9MWApXG4gICAgICAgICAgICAgICAgLnRoZW4ocmVzID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlcy5faWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhcnRpY2lwYXRlQnRucy5mb3JFYWNoKGl0ZW0gPT4gaXRlbS5jbGFzc0xpc3QuYWRkKCdoaWRlJykpO1xuICAgICAgICAgICAgICAgICAgICAgICAgeW91QXJlSW5CdG5zLmZvckVhY2goaXRlbSA9PiBpdGVtLmNsYXNzTGlzdC5yZW1vdmUoJ2hpZGUnKSk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwYXJ0aWNpcGF0ZUJ0bnMuZm9yRWFjaChpdGVtID0+IGl0ZW0uY2xhc3NMaXN0LnJlbW92ZSgnaGlkZScpKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBmb3IgKGxldCBwYXJ0aWNpcGF0ZUJ0biBvZiBwYXJ0aWNpcGF0ZUJ0bnMpIHtcbiAgICAgICAgICAgICAgICBwYXJ0aWNpcGF0ZUJ0bi5jbGFzc0xpc3QuYWRkKCdoaWRlJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmb3IgKGNvbnN0IHVuYXV0aE1lcyBvZiB1bmF1dGhNc2dzKSB7XG4gICAgICAgICAgICAgICAgdW5hdXRoTWVzLmNsYXNzTGlzdC5yZW1vdmUoJ2hpZGUnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuXG4gICAgbG9hZFRyYW5zbGF0aW9ucygpXG4gICAgICAgIC50aGVuKGluaXQpO1xuXG4gICAgbGV0IG1haW5QYWdlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmZhdl9fcGFnZScpO1xuICAgIHNldFRpbWVvdXQoKCkgPT4gbWFpblBhZ2UuY2xhc3NMaXN0LmFkZCgnb3ZlcmZsb3cnKSwgMTAwMCk7XG5cbiAgICBmdW5jdGlvbiBwYXVzZVJhbmRvbWx5KGVsZW1lbnQpIHtcbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBlbGVtZW50LmNsYXNzTGlzdC5hZGQoJ3BhdXNlJyk7XG4gICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBlbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoJ3BhdXNlJyk7XG4gICAgICAgICAgICB9LCBNYXRoLnJhbmRvbSgpICogODAwMCk7XG4gICAgICAgIH0sIE1hdGgucmFuZG9tKCkgKiA1MDAwKTtcbiAgICB9XG5cbiAgICBjb25zdCBwcml6ZXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcucHJpemVfX2l0ZW0taW1nIGltZycpO1xuXG4gICAgcHJpemVzLmZvckVhY2gocGF1c2VSYW5kb21seSk7XG59KSgpO1xuXG5cbiIsIiJdfQ==
