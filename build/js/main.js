"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
(function (_sessionStorage$getIt) {
  var apiURL = 'https://fav-prom.com/api_translates';
  var ukLeng = document.querySelector('#ukLeng'),
    enLeng = document.querySelector('#enLeng');

  // let locale = 'uk';
  var locale = (_sessionStorage$getIt = sessionStorage.getItem("locale")) !== null && _sessionStorage$getIt !== void 0 ? _sessionStorage$getIt : "uk";
  if (ukLeng) locale = 'uk';
  if (enLeng) locale = 'en';
  var i18nData = {};
  function loadTranslations() {
    return fetch("".concat(apiURL, "/new-translates/").concat(locale)).then(function (res) {
      return res.json();
    }).then(function (json) {
      i18nData = json;
      translate();
      var mutationObserver = new MutationObserver(function (mutations) {
        translate();
      });
      mutationObserver.observe(document.getElementById('jackpot'), {
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
    for (var _i = 0, _arr = ['uk', 'en']; _i < _arr.length; _i++) {
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
  var InitPage = function InitPage() {
    translate();
  };
  function init() {
    if (window.store) {
      InitPage();
    } else {
      InitPage();
      var c = 0;
      var i = setInterval(function () {
        if (c < 50) {
          if (!!window.g_user_id) {
            InitPage();
            clearInterval(i);
          }
        } else {
          clearInterval(i);
        }
      }, 200);
    }
  }
  loadTranslations().then(init);
  var mainPage = document.querySelector('.fav__page');
  setTimeout(function () {
    return mainPage.classList.add('overflow');
  }, 1000);

  // Websockets
  var wsURL = 'wss://www.favbet.ua/socket';
  var socket = new WebSocket(wsURL);
  var extractJackpotAmounts = function extractJackpotAmounts(data) {
    var defaultCategories = {
      major: 0,
      minor: 0,
      mini: 0,
      mega: 0
    };
    var jackpots = data.data;
    return Object.keys(defaultCategories).reduce(function (amounts, jackpotType) {
      amounts[jackpotType] = jackpots[jackpotType] ? jackpots[jackpotType].amount : 0;
      return amounts;
    }, {});
  };
  var updatePrizeElements = function updatePrizeElements(jackpotAmounts) {
    for (var _i2 = 0, _Object$entries = Object.entries(jackpotAmounts); _i2 < _Object$entries.length; _i2++) {
      var _Object$entries$_i = _slicedToArray(_Object$entries[_i2], 2),
        category = _Object$entries$_i[0],
        amount = _Object$entries$_i[1];
      var element = document.querySelector(".prize-".concat(category));
      if (element) {
        element.textContent = "".concat(amount.toFixed(2), "\u20B4");
      }
    }
  };
  socket.onmessage = function (event) {
    try {
      var message = JSON.parse(event.data);
      if (message.event === 'jackpots_update') {
        var jackpotAmounts = extractJackpotAmounts(message);
        updatePrizeElements(jackpotAmounts);
      }
    } catch (error) {
      console.error('Error parsing message:', error);
    }
  };
  socket.onerror = function (error) {
    console.error('WebSocket Error:', error);
  };
  var sendPing = function sendPing() {
    if (socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({
        cmd: "ping",
        cid: "ping"
      }));
      console.log('Ping message sent');
    }
  };
  socket.onopen = function () {
    console.log('WebSocket connection established');
    var cid = crypto.randomUUID();
    socket.send(JSON.stringify({
      cmd: "subscribe_jackpot_updates",
      cid: cid
    }));
    setInterval(sendPing, 50000);
  };
  socket.onclose = function () {
    console.log('WebSocket connection closed');
  };

  // TEST

  document.addEventListener("DOMContentLoaded", function () {
    var _document$querySelect;
    (_document$querySelect = document.querySelector(".menu-btn")) === null || _document$querySelect === void 0 || _document$querySelect.addEventListener("click", function () {
      var _document$querySelect2;
      (_document$querySelect2 = document.querySelector(".menu-test")) === null || _document$querySelect2 === void 0 || _document$querySelect2.classList.toggle("hide");
    });
  });
  document.querySelector('.dark-btn').addEventListener('click', function () {
    document.body.classList.toggle('dark');
  });
  var lngBtn = document.querySelector(".lng-btn");
  lngBtn.addEventListener("click", function () {
    if (sessionStorage.getItem("locale")) {
      sessionStorage.removeItem("locale");
    } else {
      sessionStorage.setItem("locale", "en");
    }
    window.location.reload();
  });
})();
"use strict";

(function () {
  var currentIndex = 1;
  var startX = 0;
  var isDragging = false;
  var slider = document.querySelector('.prize__slider');
  var items = document.querySelectorAll('.prize__item');
  var totalItems = items.length;
  function updateSlider() {
    items.forEach(function (item, index) {
      var distance = index - currentIndex;
      var newPosition = distance * 33.33;
      if (distance > totalItems / 2) {
        newPosition -= totalItems * 33.33;
      } else if (distance < -totalItems / 2) {
        newPosition += totalItems * 33.33;
      }
      var scale = index === currentIndex ? 1 : 0.8;
      item.style.transform = "translateX(".concat(newPosition, "%) scale(").concat(scale, ")");
      item.style.zIndex = index === currentIndex ? 2 : 1;
      var isVisible = Math.abs(distance) <= 1 || index === 0 && currentIndex === totalItems - 1 || index === totalItems - 1 && currentIndex === 0;
      item.classList.toggle('hidden', !isVisible);
      item.classList.toggle('active', index === currentIndex);
      item.classList.remove('left-slide', 'right-slide');
      if (distance === 1 || currentIndex === totalItems - 1 && index === 0) {
        item.classList.add('right-slide');
      } else if (distance === -1 || currentIndex === 0 && index === totalItems - 1) {
        item.classList.add('left-slide');
      }
    });
  }
  function moveSlider(offset) {
    currentIndex = (currentIndex + offset + totalItems) % totalItems;
    updateSlider();
  }
  function handleStart(event) {
    isDragging = true;
    startX = event.clientX || event.touches[0].clientX;
  }
  function handleMove(event) {
    if (!isDragging) return;
    var currentX = event.clientX || event.touches[0].clientX;
    var diffX = currentX - startX;
    if (Math.abs(diffX) > 50) {
      moveSlider(diffX > 0 ? -1 : 1);
      isDragging = false;
    }
  }
  function handleEnd() {
    isDragging = false;
  }
  var buttonsLeft = document.querySelectorAll('.button-slider-left');
  var buttonsRight = document.querySelectorAll('.button-slider-right');
  buttonsLeft.forEach(function (btn) {
    btn.addEventListener('click', function () {
      moveSlider(-1);
    });
  });
  buttonsRight.forEach(function (btn) {
    btn.addEventListener('click', function () {
      moveSlider(1);
    });
  });
  slider.addEventListener('mousedown', handleStart);
  slider.addEventListener('touchstart', handleStart);
  document.addEventListener('mousemove', handleMove);
  document.addEventListener('touchmove', handleMove);
  document.addEventListener('mouseup', handleEnd);
  document.addEventListener('touchend', handleEnd);
  updateSlider();

  /********************************ANIMATION******************************/

  var animItems = document.querySelectorAll('._anim-items');
  if (animItems.length > 0) {
    var animOnScroll = function animOnScroll(params) {
      for (var index = 0; index < animItems.length; index++) {
        var animItem = animItems[index];
        var animItemHight = animItem.offsetHeight;
        var animItemOffSet = offset(animItem).top;
        var animStart = 4;
        var animItemPoint = window.innerHeight - animItemHight / animStart;
        if (animItemHight > window.innerHeight) {
          animItemPoint = window.innerHeight - window.innerHeight / animStart;
        }
        if (pageYOffset > animItemOffSet - animItemPoint && pageYOffset < animItemOffSet + animItemHight) {
          animItem.classList.add('_view');
        } else {
          if (!animItem.classList.contains('_anim-no-hide')) {
            animItem.classList.remove('_view');
          }
        }
      }
      function offset(el) {
        var rect = el.getBoundingClientRect(),
          scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
          scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        return {
          top: rect.top + scrollTop,
          left: rect.left + scrollLeft
        };
      }
    };
    window.addEventListener('scroll', animOnScroll);
    setTimeout(function () {
      animOnScroll();
    }, 300);
  }
})();
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4uanMiLCJzZWNvbmQuanMiXSwibmFtZXMiOlsiX3Nlc3Npb25TdG9yYWdlJGdldEl0IiwiYXBpVVJMIiwidWtMZW5nIiwiZG9jdW1lbnQiLCJxdWVyeVNlbGVjdG9yIiwiZW5MZW5nIiwibG9jYWxlIiwic2Vzc2lvblN0b3JhZ2UiLCJnZXRJdGVtIiwiaTE4bkRhdGEiLCJsb2FkVHJhbnNsYXRpb25zIiwiZmV0Y2giLCJjb25jYXQiLCJ0aGVuIiwicmVzIiwianNvbiIsInRyYW5zbGF0ZSIsIm11dGF0aW9uT2JzZXJ2ZXIiLCJNdXRhdGlvbk9ic2VydmVyIiwibXV0YXRpb25zIiwib2JzZXJ2ZSIsImdldEVsZW1lbnRCeUlkIiwiY2hpbGRMaXN0Iiwic3VidHJlZSIsImVsZW1zIiwicXVlcnlTZWxlY3RvckFsbCIsImxlbmd0aCIsImZvckVhY2giLCJlbGVtIiwia2V5IiwiZ2V0QXR0cmlidXRlIiwiaW5uZXJIVE1MIiwidHJhbnNsYXRlS2V5IiwicmVtb3ZlQXR0cmlidXRlIiwicmVmcmVzaExvY2FsaXplZENsYXNzIiwiZWxlbWVudCIsImJhc2VDc3NDbGFzcyIsIl9pIiwiX2FyciIsImxhbmciLCJjbGFzc0xpc3QiLCJyZW1vdmUiLCJhZGQiLCJyZXF1ZXN0IiwibGluayIsImV4dHJhT3B0aW9ucyIsIl9vYmplY3RTcHJlYWQiLCJoZWFkZXJzIiwiSW5pdFBhZ2UiLCJpbml0Iiwid2luZG93Iiwic3RvcmUiLCJjIiwiaSIsInNldEludGVydmFsIiwiZ191c2VyX2lkIiwiY2xlYXJJbnRlcnZhbCIsIm1haW5QYWdlIiwic2V0VGltZW91dCIsIndzVVJMIiwic29ja2V0IiwiV2ViU29ja2V0IiwiZXh0cmFjdEphY2twb3RBbW91bnRzIiwiZGF0YSIsImRlZmF1bHRDYXRlZ29yaWVzIiwibWFqb3IiLCJtaW5vciIsIm1pbmkiLCJtZWdhIiwiamFja3BvdHMiLCJPYmplY3QiLCJrZXlzIiwicmVkdWNlIiwiYW1vdW50cyIsImphY2twb3RUeXBlIiwiYW1vdW50IiwidXBkYXRlUHJpemVFbGVtZW50cyIsImphY2twb3RBbW91bnRzIiwiX2kyIiwiX09iamVjdCRlbnRyaWVzIiwiZW50cmllcyIsIl9PYmplY3QkZW50cmllcyRfaSIsIl9zbGljZWRUb0FycmF5IiwiY2F0ZWdvcnkiLCJ0ZXh0Q29udGVudCIsInRvRml4ZWQiLCJvbm1lc3NhZ2UiLCJldmVudCIsIm1lc3NhZ2UiLCJKU09OIiwicGFyc2UiLCJlcnJvciIsImNvbnNvbGUiLCJvbmVycm9yIiwic2VuZFBpbmciLCJyZWFkeVN0YXRlIiwiT1BFTiIsInNlbmQiLCJzdHJpbmdpZnkiLCJjbWQiLCJjaWQiLCJsb2ciLCJvbm9wZW4iLCJjcnlwdG8iLCJyYW5kb21VVUlEIiwib25jbG9zZSIsImFkZEV2ZW50TGlzdGVuZXIiLCJfZG9jdW1lbnQkcXVlcnlTZWxlY3QiLCJfZG9jdW1lbnQkcXVlcnlTZWxlY3QyIiwidG9nZ2xlIiwiYm9keSIsImxuZ0J0biIsInJlbW92ZUl0ZW0iLCJzZXRJdGVtIiwibG9jYXRpb24iLCJyZWxvYWQiLCJjdXJyZW50SW5kZXgiLCJzdGFydFgiLCJpc0RyYWdnaW5nIiwic2xpZGVyIiwiaXRlbXMiLCJ0b3RhbEl0ZW1zIiwidXBkYXRlU2xpZGVyIiwiaXRlbSIsImluZGV4IiwiZGlzdGFuY2UiLCJuZXdQb3NpdGlvbiIsInNjYWxlIiwic3R5bGUiLCJ0cmFuc2Zvcm0iLCJ6SW5kZXgiLCJpc1Zpc2libGUiLCJNYXRoIiwiYWJzIiwibW92ZVNsaWRlciIsIm9mZnNldCIsImhhbmRsZVN0YXJ0IiwiY2xpZW50WCIsInRvdWNoZXMiLCJoYW5kbGVNb3ZlIiwiY3VycmVudFgiLCJkaWZmWCIsImhhbmRsZUVuZCIsImJ1dHRvbnNMZWZ0IiwiYnV0dG9uc1JpZ2h0IiwiYnRuIiwiYW5pbUl0ZW1zIiwiYW5pbU9uU2Nyb2xsIiwicGFyYW1zIiwiYW5pbUl0ZW0iLCJhbmltSXRlbUhpZ2h0Iiwib2Zmc2V0SGVpZ2h0IiwiYW5pbUl0ZW1PZmZTZXQiLCJ0b3AiLCJhbmltU3RhcnQiLCJhbmltSXRlbVBvaW50IiwiaW5uZXJIZWlnaHQiLCJwYWdlWU9mZnNldCIsImNvbnRhaW5zIiwiZWwiLCJyZWN0IiwiZ2V0Qm91bmRpbmdDbGllbnRSZWN0Iiwic2Nyb2xsTGVmdCIsInBhZ2VYT2Zmc2V0IiwiZG9jdW1lbnRFbGVtZW50Iiwic2Nyb2xsVG9wIiwibGVmdCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7QUFBQSxDQUFDLFVBQUFBLHFCQUFBLEVBQVk7RUFDVCxJQUFNQyxNQUFNLEdBQUcscUNBQXFDO0VBRXBELElBQU1DLE1BQU0sR0FBR0MsUUFBUSxDQUFDQyxhQUFhLENBQUMsU0FBUyxDQUFDO0lBQzVDQyxNQUFNLEdBQUdGLFFBQVEsQ0FBQ0MsYUFBYSxDQUFDLFNBQVMsQ0FBQzs7RUFFOUM7RUFDQSxJQUFJRSxNQUFNLElBQUFOLHFCQUFBLEdBQUdPLGNBQWMsQ0FBQ0MsT0FBTyxDQUFDLFFBQVEsQ0FBQyxjQUFBUixxQkFBQSxjQUFBQSxxQkFBQSxHQUFJLElBQUk7RUFHckQsSUFBSUUsTUFBTSxFQUFFSSxNQUFNLEdBQUcsSUFBSTtFQUN6QixJQUFJRCxNQUFNLEVBQUVDLE1BQU0sR0FBRyxJQUFJO0VBRXpCLElBQUlHLFFBQVEsR0FBRyxDQUFDLENBQUM7RUFFakIsU0FBU0MsZ0JBQWdCQSxDQUFBLEVBQUc7SUFDeEIsT0FBT0MsS0FBSyxJQUFBQyxNQUFBLENBQUlYLE1BQU0sc0JBQUFXLE1BQUEsQ0FBbUJOLE1BQU0sQ0FBRSxDQUFDLENBQUNPLElBQUksQ0FBQyxVQUFBQyxHQUFHO01BQUEsT0FBSUEsR0FBRyxDQUFDQyxJQUFJLENBQUMsQ0FBQztJQUFBLEVBQUMsQ0FDckVGLElBQUksQ0FBQyxVQUFBRSxJQUFJLEVBQUk7TUFDVk4sUUFBUSxHQUFHTSxJQUFJO01BQ2ZDLFNBQVMsQ0FBQyxDQUFDO01BRVgsSUFBSUMsZ0JBQWdCLEdBQUcsSUFBSUMsZ0JBQWdCLENBQUMsVUFBVUMsU0FBUyxFQUFFO1FBQzdESCxTQUFTLENBQUMsQ0FBQztNQUNmLENBQUMs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TztVQUFFWixHQUFHLEVBQUVPLElBQUksQ0FBQ1AsR0FBRyxHQUFHWSxTQUFTO1VBQUVDLElBQUksRUFBRU4sSUFBSSxDQUFDTSxJQUFJLEdBQUdKO1FBQVcsQ0FBQztNQUN0RTtJQUNKLENBQUM7SUE5QkRoSCxNQUFNLENBQUN3RCxnQkFBZ0IsQ0FBQyxRQUFRLEVBQUd5QyxZQUFZLENBQUM7SUErQmhEekYsVUFBVSxDQUFDLFlBQU07TUFDYnlGLFlBQVksQ0FBQyxDQUFDO0lBQ2xCLENBQUMsRUFBRSxHQUFHLENBQUM7RUFFWDtBQUVBLENBQUMsRUFBRSxDQUFDIiwiZmlsZSI6Im1haW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gKCkge1xuICAgIGNvbnN0IGFwaVVSTCA9ICdodHRwczovL2Zhdi1wcm9tLmNvbS9hcGlfdHJhbnNsYXRlcyc7XG5cbiAgICBjb25zdCB1a0xlbmcgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjdWtMZW5nJyksXG4gICAgICAgIGVuTGVuZyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNlbkxlbmcnKTtcblxuICAgIC8vIGxldCBsb2NhbGUgPSAndWsnO1xuICAgIGxldCBsb2NhbGUgPSBzZXNzaW9uU3RvcmFnZS5nZXRJdGVtKFwibG9jYWxlXCIpID8/IFwidWtcIlxuXG5cbiAgICBpZiAodWtMZW5nKSBsb2NhbGUgPSAndWsnO1xuICAgIGlmIChlbkxlbmcpIGxvY2FsZSA9ICdlbic7XG5cbiAgICBsZXQgaTE4bkRhdGEgPSB7fTtcblxuICAgIGZ1bmN0aW9uIGxvYWRUcmFuc2xhdGlvbnMoKSB7XG4gICAgICAgIHJldHVybiBmZXRjaChgJHthcGlVUkx9L25ldy10cmFuc2xhdGVzLyR7bG9jYWxlfWApLnRoZW4ocmVzID0+IHJlcy5qc29uKCkpXG4gICAgICAgICAgICAudGhlbihqc29uID0+IHtcbiAgICAgICAgICAgICAgICBpMThuRGF0YSA9IGpzb247XG4gICAgICAgICAgICAgICAgdHJhbnNsYXRlKCk7XG5cbiAgICAgICAgICAgICAgICB2YXIgbXV0YXRpb25PYnNlcnZlciA9IG5ldyBNdXRhdGlvbk9ic2VydmVyKGZ1bmN0aW9uIChtdXRhdGlvbnMpIHtcbiAgICAgICAgICAgICAgICAgICAgdHJhbnNsYXRlKCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgbXV0YXRpb25PYnNlcnZlci5vYnNlcnZlKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdqYWNrcG90JyksIHtcbiAgICAgICAgICAgICAgICAgICAgY2hpbGRMaXN0OiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICBzdWJ0cmVlOiB0cnVlLFxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiB0cmFuc2xhdGUoKSB7XG4gICAgICAgIGNvbnN0IGVsZW1zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnW2RhdGEtdHJhbnNsYXRlXScpXG4gICAgICAgIGlmIChlbGVtcyAmJiBlbGVtcy5sZW5ndGgpIHtcbiAgICAgICAgICAgIGVsZW1zLmZvckVhY2goZWxlbSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3Qga2V5ID0gZWxlbS5nZXRBdHRyaWJ1dGUoJ2RhdGEtdHJhbnNsYXRlJyk7XG4gICAgICAgICAgICAgICAgZWxlbS5pbm5lckhUTUwgPSB0cmFuc2xhdGVLZXkoa2V5KTtcbiAgICAgICAgICAgICAgICBlbGVtLnJlbW92ZUF0dHJpYnV0ZSgnZGF0YS10cmFuc2xhdGUnKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICAgICAgcmVmcmVzaExvY2FsaXplZENsYXNzKCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gdHJhbnNsYXRlS2V5KGtleSkge1xuICAgICAgICBpZiAoIWtleSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBpMThuRGF0YVtrZXldIHx8ICcqLS0tLU5FRUQgVE8gQkUgVFJBTlNMQVRFRC0tLS0qICAga2V5OiAgJyArIGtleTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiByZWZyZXNoTG9jYWxpemVkQ2xhc3MoZWxlbWVudCwgYmFzZUNzc0NsYXNzKSB7XG4gICAgICAgIGlmICghZWxlbWVudCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGZvciAoY29uc3QgbGFuZyBvZiBbJ3VrJywgJ2VuJ10pIHtcbiAgICAgICAgICAgIGVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZShiYXNlQ3NzQ2xhc3MgKyBsYW5nKTtcbiAgICAgICAgfVxuICAgICAgICBlbGVtZW50LmNsYXNzTGlzdC5hZGQoYmFzZUNzc0NsYXNzICsgbG9jYWxlKTtcbiAgICB9XG5cbiAgICBjb25zdCByZXF1ZXN0ID0gZnVuY3Rpb24gKGxpbmssIGV4dHJhT3B0aW9ucykge1xuICAgICAgICByZXR1cm4gZmV0Y2goYXBpVVJMICsgbGluaywge1xuICAgICAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICAgICAgICdBY2NlcHQnOiAnYXBwbGljYXRpb24vanNvbicsXG4gICAgICAgICAgICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJ1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIC4uLihleHRyYU9wdGlvbnMgfHwge30pXG4gICAgICAgIH0pLnRoZW4ocmVzID0+IHJlcy5qc29uKCkpXG4gICAgfVxuXG5cbiAgICBjb25zdCBJbml0UGFnZSA9ICgpID0+IHtcbiAgICAgICAgdHJhbnNsYXRlKCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaW5pdCgpIHtcbiAgICAgICAgaWYgKHdpbmRvdy5zdG9yZSkge1xuICAgICAgICAgICAgSW5pdFBhZ2UoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIEluaXRQYWdlKCk7XG4gICAgICAgICAgICBsZXQgYyA9IDA7XG4gICAgICAgICAgICB2YXIgaSA9IHNldEludGVydmFsKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBpZiAoYyA8IDUwKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghIXdpbmRvdy5nX3VzZXJfaWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIEluaXRQYWdlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBjbGVhckludGVydmFsKGkpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgY2xlYXJJbnRlcnZhbChpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LCAyMDApO1xuICAgICAgICB9XG4gICAgfVxuXG5cbiAgICBsb2FkVHJhbnNsYXRpb25zKClcbiAgICAgICAgLnRoZW4oaW5pdCk7XG5cbiAgICBsZXQgbWFpblBhZ2UgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZmF2X19wYWdlJyk7XG4gICAgc2V0VGltZW91dCgoKSA9PiBtYWluUGFnZS5jbGFzc0xpc3QuYWRkKCdvdmVyZmxvdycpLCAxMDAwKTtcblxuICAgIC8vIFdlYnNvY2tldHNcbiAgICBjb25zdCB3c1VSTCA9ICd3c3M6Ly93d3cuZmF2YmV0LnVhL3NvY2tldCc7XG4gICAgY29uc3Qgc29ja2V0ID0gbmV3IFdlYlNvY2tldCh3c1VSTCk7XG5cbiAgICBjb25zdCBleHRyYWN0SmFja3BvdEFtb3VudHMgPSAoZGF0YSkgPT4ge1xuICAgICAgICBjb25zdCBkZWZhdWx0Q2F0ZWdvcmllcyA9IHsgbWFqb3I6IDAsIG1pbm9yOiAwLCBtaW5pOiAwLCBtZWdhOiAwIH07XG4gICAgICAgIGNvbnN0IGphY2twb3RzID0gZGF0YS5kYXRhO1xuXG4gICAgICAgIHJldHVybiBPYmplY3Qua2V5cyhkZWZhdWx0Q2F0ZWdvcmllcykucmVkdWNlKChhbW91bnRzLCBqYWNrcG90VHlwZSkgPT4ge1xuICAgICAgICAgICAgYW1vdW50c1tqYWNrcG90VHlwZV0gPSBqYWNrcG90c1tqYWNrcG90VHlwZV0gPyBqYWNrcG90c1tqYWNrcG90VHlwZV0uYW1vdW50IDogMDtcbiAgICAgICAgICAgIHJldHVybiBhbW91bnRzO1xuICAgICAgICB9LCB7fSk7XG4gICAgfTtcblxuICAgIGNvbnN0IHVwZGF0ZVByaXplRWxlbWVudHMgPSAoamFja3BvdEFtb3VudHMpID0+IHtcbiAgICAgICAgZm9yIChjb25zdCBbY2F0ZWdvcnksIGFtb3VudF0gb2YgT2JqZWN0LmVudHJpZXMoamFja3BvdEFtb3VudHMpKSB7XG4gICAgICAgICAgICBjb25zdCBlbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgLnByaXplLSR7Y2F0ZWdvcnl9YCk7XG4gICAgICAgICAgICBpZiAoZWxlbWVudCkge1xuICAgICAgICAgICAgICAgIGVsZW1lbnQudGV4dENvbnRlbnQgPSBgJHthbW91bnQudG9GaXhlZCgyKX3igrRgO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfTtcblxuICAgIHNvY2tldC5vbm1lc3NhZ2UgPSAoZXZlbnQpID0+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IG1lc3NhZ2UgPSBKU09OLnBhcnNlKGV2ZW50LmRhdGEpO1xuICAgICAgICAgICAgaWYgKG1lc3NhZ2UuZXZlbnQgPT09ICdqYWNrcG90c191cGRhdGUnKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgamFja3BvdEFtb3VudHMgPSBleHRyYWN0SmFja3BvdEFtb3VudHMobWVzc2FnZSk7XG4gICAgICAgICAgICAgICAgdXBkYXRlUHJpemVFbGVtZW50cyhqYWNrcG90QW1vdW50cyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKCdFcnJvciBwYXJzaW5nIG1lc3NhZ2U6JywgZXJyb3IpO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIHNvY2tldC5vbmVycm9yID0gKGVycm9yKSA9PiB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoJ1dlYlNvY2tldCBFcnJvcjonLCBlcnJvcik7XG4gICAgfTtcblxuICAgIGNvbnN0IHNlbmRQaW5nID0gKCkgPT4ge1xuICAgICAgICBpZiAoc29ja2V0LnJlYWR5U3RhdGUgPT09IFdlYlNvY2tldC5PUEVOKSB7XG4gICAgICAgICAgICBzb2NrZXQuc2VuZChKU09OLnN0cmluZ2lmeSh7IGNtZDogXCJwaW5nXCIsIGNpZDogXCJwaW5nXCIgfSkpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ1BpbmcgbWVzc2FnZSBzZW50Jyk7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgc29ja2V0Lm9ub3BlbiA9ICgpID0+IHtcbiAgICAgICAgY29uc29sZS5sb2coJ1dlYlNvY2tldCBjb25uZWN0aW9uIGVzdGFibGlzaGVkJyk7XG5cbiAgICAgICAgY29uc3QgY2lkID0gY3J5cHRvLnJhbmRvbVVVSUQoKTtcbiAgICAgICAgc29ja2V0LnNlbmQoSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICAgICAgY21kOiBcInN1YnNjcmliZV9qYWNrcG90X3VwZGF0ZXNcIixcbiAgICAgICAgICAgIGNpZDogY2lkXG4gICAgICAgIH0pKTtcbiAgICAgICAgc2V0SW50ZXJ2YWwoc2VuZFBpbmcsIDUwMDAwKTtcbiAgICB9O1xuXG4gICAgc29ja2V0Lm9uY2xvc2UgPSAoKSA9PiB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdXZWJTb2NrZXQgY29ubmVjdGlvbiBjbG9zZWQnKTtcbiAgICB9O1xuXG4gICAgLy8gVEVTVFxuXG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIkRPTUNvbnRlbnRMb2FkZWRcIiwgKCkgPT4ge1xuICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLm1lbnUtYnRuXCIpPy5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuICAgICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5tZW51LXRlc3RcIik/LmNsYXNzTGlzdC50b2dnbGUoXCJoaWRlXCIpO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5kYXJrLWJ0bicpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgICBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC50b2dnbGUoJ2RhcmsnKTtcbiAgICB9KTtcblxuICAgIGNvbnN0IGxuZ0J0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIubG5nLWJ0blwiKVxuICAgIGxuZ0J0bi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuICAgICAgICBpZiAoc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbShcImxvY2FsZVwiKSkge1xuICAgICAgICAgICAgc2Vzc2lvblN0b3JhZ2UucmVtb3ZlSXRlbShcImxvY2FsZVwiKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHNlc3Npb25TdG9yYWdlLnNldEl0ZW0oXCJsb2NhbGVcIiwgXCJlblwiKTtcbiAgICAgICAgfVxuICAgICAgICB3aW5kb3cubG9jYXRpb24ucmVsb2FkKCk7XG4gICAgfSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24gKCkge1xuICAgIGxldCBjdXJyZW50SW5kZXggPSAxO1xuICAgIGxldCBzdGFydFggPSAwO1xuICAgIGxldCBpc0RyYWdnaW5nID0gZmFsc2U7XG5cbiAgICBjb25zdCBzbGlkZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucHJpemVfX3NsaWRlcicpO1xuICAgIGNvbnN0IGl0ZW1zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnByaXplX19pdGVtJyk7XG4gICAgY29uc3QgdG90YWxJdGVtcyA9IGl0ZW1zLmxlbmd0aDtcblxuICAgIGZ1bmN0aW9uIHVwZGF0ZVNsaWRlcigpIHtcbiAgICAgICAgaXRlbXMuZm9yRWFjaCgoaXRlbSwgaW5kZXgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGRpc3RhbmNlID0gaW5kZXggLSBjdXJyZW50SW5kZXg7XG4gICAgICAgICAgICBsZXQgbmV3UG9zaXRpb24gPSBkaXN0YW5jZSAqIDMzLjMzO1xuXG4gICAgICAgICAgICBpZiAoZGlzdGFuY2UgPiB0b3RhbEl0ZW1zIC8gMikge1xuICAgICAgICAgICAgICAgIG5ld1Bvc2l0aW9uIC09IHRvdGFsSXRlbXMgKiAzMy4zMztcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZGlzdGFuY2UgPCAtdG90YWxJdGVtcyAvIDIpIHtcbiAgICAgICAgICAgICAgICBuZXdQb3NpdGlvbiArPSB0b3RhbEl0ZW1zICogMzMuMzM7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IHNjYWxlID0gaW5kZXggPT09IGN1cnJlbnRJbmRleCA/IDEgOiAwLjg7XG5cbiAgICAgICAgICAgIGl0ZW0uc3R5bGUudHJhbnNmb3JtID0gYHRyYW5zbGF0ZVgoJHtuZXdQb3NpdGlvbn0lKSBzY2FsZSgke3NjYWxlfSlgO1xuICAgICAgICAgICAgaXRlbS5zdHlsZS56SW5kZXggPSBpbmRleCA9PT0gY3VycmVudEluZGV4ID8gMiA6IDE7XG5cbiAgICAgICAgICAgIGNvbnN0IGlzVmlzaWJsZSA9IE1hdGguYWJzKGRpc3RhbmNlKSA8PSAxIHx8IChpbmRleCA9PT0gMCAmJiBjdXJyZW50SW5kZXggPT09IHRvdGFsSXRlbXMgLSAxKSB8fCAoaW5kZXggPT09IHRvdGFsSXRlbXMgLSAxICYmIGN1cnJlbnRJbmRleCA9PT0gMCk7XG4gICAgICAgICAgICBpdGVtLmNsYXNzTGlzdC50b2dnbGUoJ2hpZGRlbicsICFpc1Zpc2libGUpO1xuICAgICAgICAgICAgaXRlbS5jbGFzc0xpc3QudG9nZ2xlKCdhY3RpdmUnLCBpbmRleCA9PT0gY3VycmVudEluZGV4KTtcblxuICAgICAgICAgICAgaXRlbS5jbGFzc0xpc3QucmVtb3ZlKCdsZWZ0LXNsaWRlJywgJ3JpZ2h0LXNsaWRlJyk7XG4gICAgICAgICAgICBpZiAoZGlzdGFuY2UgPT09IDEgfHwgKGN1cnJlbnRJbmRleCA9PT0gdG90YWxJdGVtcyAtIDEgJiYgaW5kZXggPT09IDApKSB7XG4gICAgICAgICAgICAgICAgaXRlbS5jbGFzc0xpc3QuYWRkKCdyaWdodC1zbGlkZScpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChkaXN0YW5jZSA9PT0gLTEgfHwgKGN1cnJlbnRJbmRleCA9PT0gMCAmJiBpbmRleCA9PT0gdG90YWxJdGVtcyAtIDEpKSB7XG4gICAgICAgICAgICAgICAgaXRlbS5jbGFzc0xpc3QuYWRkKCdsZWZ0LXNsaWRlJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIG1vdmVTbGlkZXIob2Zmc2V0KSB7XG4gICAgICAgIGN1cnJlbnRJbmRleCA9IChjdXJyZW50SW5kZXggKyBvZmZzZXQgKyB0b3RhbEl0ZW1zKSAlIHRvdGFsSXRlbXM7XG4gICAgICAgIHVwZGF0ZVNsaWRlcigpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGhhbmRsZVN0YXJ0KGV2ZW50KSB7XG4gICAgICAgIGlzRHJhZ2dpbmcgPSB0cnVlO1xuICAgICAgICBzdGFydFggPSBldmVudC5jbGllbnRYIHx8IGV2ZW50LnRvdWNoZXNbMF0uY2xpZW50WDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBoYW5kbGVNb3ZlKGV2ZW50KSB7XG4gICAgICAgIGlmICghaXNEcmFnZ2luZykgcmV0dXJuO1xuXG4gICAgICAgIGNvbnN0IGN1cnJlbnRYID0gZXZlbnQuY2xpZW50WCB8fCBldmVudC50b3VjaGVzWzBdLmNsaWVudFg7XG4gICAgICAgIGNvbnN0IGRpZmZYID0gY3VycmVudFggLSBzdGFydFg7XG5cbiAgICAgICAgaWYgKE1hdGguYWJzKGRpZmZYKSA+IDUwKSB7XG4gICAgICAgICAgICBtb3ZlU2xpZGVyKGRpZmZYID4gMCA/IC0xIDogMSk7XG4gICAgICAgICAgICBpc0RyYWdnaW5nID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBoYW5kbGVFbmQoKSB7XG4gICAgICAgIGlzRHJhZ2dpbmcgPSBmYWxzZTtcbiAgICB9XG5cbiAgICBjb25zdCBidXR0b25zTGVmdCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5idXR0b24tc2xpZGVyLWxlZnQnKVxuICAgIGNvbnN0IGJ1dHRvbnNSaWdodCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5idXR0b24tc2xpZGVyLXJpZ2h0JylcbiAgICBidXR0b25zTGVmdC5mb3JFYWNoKGJ0biAgPT4ge1xuICAgICAgICBidG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgICAgICAgICBtb3ZlU2xpZGVyKC0xKTtcbiAgICAgICAgfSlcbiAgICB9KVxuICAgIGJ1dHRvbnNSaWdodC5mb3JFYWNoKGJ0biAgPT4ge1xuICAgICAgICBidG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgICAgICAgICBtb3ZlU2xpZGVyKDEpO1xuICAgICAgICB9KVxuICAgIH0pXG5cbiAgICBzbGlkZXIuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgaGFuZGxlU3RhcnQpO1xuICAgIHNsaWRlci5hZGRFdmVudExpc3RlbmVyKCd0b3VjaHN0YXJ0JywgaGFuZGxlU3RhcnQpO1xuXG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgaGFuZGxlTW92ZSk7XG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2htb3ZlJywgaGFuZGxlTW92ZSk7XG5cbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgaGFuZGxlRW5kKTtcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCd0b3VjaGVuZCcsIGhhbmRsZUVuZCk7XG5cbiAgICB1cGRhdGVTbGlkZXIoKTtcblxuXG4vKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipBTklNQVRJT04qKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbmNvbnN0IGFuaW1JdGVtcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5fYW5pbS1pdGVtcycpO1xuXG5pZihhbmltSXRlbXMubGVuZ3RoID4gMCkge1xuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdzY3JvbGwnICwgYW5pbU9uU2Nyb2xsKVxuXG4gICAgZnVuY3Rpb24gYW5pbU9uU2Nyb2xsKHBhcmFtcyl7XG4gICAgICAgIGZvcihsZXQgaW5kZXg9MDsgaW5kZXg8YW5pbUl0ZW1zLmxlbmd0aDsgaW5kZXgrKyl7XG4gICAgICAgICAgICBjb25zdCBhbmltSXRlbSA9IGFuaW1JdGVtc1tpbmRleF07XG4gICAgICAgICAgICBjb25zdCBhbmltSXRlbUhpZ2h0ID0gYW5pbUl0ZW0ub2Zmc2V0SGVpZ2h0O1xuICAgICAgICAgICAgY29uc3QgYW5pbUl0ZW1PZmZTZXQgPSBvZmZzZXQoYW5pbUl0ZW0pLnRvcDtcbiAgICAgICAgICAgIGNvbnN0IGFuaW1TdGFydCA9IDQ7XG5cbiAgICAgICAgICAgIGxldCBhbmltSXRlbVBvaW50ID0gd2luZG93LmlubmVySGVpZ2h0IC0gYW5pbUl0ZW1IaWdodCAvIGFuaW1TdGFydDtcblxuICAgICAgICAgICAgaWYoYW5pbUl0ZW1IaWdodCA+IHdpbmRvdy5pbm5lckhlaWdodCl7XG4gICAgICAgICAgICAgICAgYW5pbUl0ZW1Qb2ludCA9IHdpbmRvdy5pbm5lckhlaWdodCAtIHdpbmRvdy5pbm5lckhlaWdodCAvIGFuaW1TdGFydDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYoKHBhZ2VZT2Zmc2V0ID4gYW5pbUl0ZW1PZmZTZXQtYW5pbUl0ZW1Qb2ludCkgJiYgcGFnZVlPZmZzZXQgPCAoYW5pbUl0ZW1PZmZTZXQgKyBhbmltSXRlbUhpZ2h0KSl7XG4gICAgICAgICAgICAgICAgYW5pbUl0ZW0uY2xhc3NMaXN0LmFkZCgnX3ZpZXcnKTtcbiAgICAgICAgICAgIH0gIGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmKCFhbmltSXRlbS5jbGFzc0xpc3QuY29udGFpbnMoJ19hbmltLW5vLWhpZGUnKSl7XG4gICAgICAgICAgICAgICAgICAgIGFuaW1JdGVtLmNsYXNzTGlzdC5yZW1vdmUoJ192aWV3Jyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gb2Zmc2V0KGVsKSB7XG4gICAgICAgICAgICB2YXIgcmVjdCA9IGVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLFxuICAgICAgICAgICAgICAgIHNjcm9sbExlZnQgPSB3aW5kb3cucGFnZVhPZmZzZXQgfHwgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnNjcm9sbExlZnQsXG4gICAgICAgICAgICAgICAgc2Nyb2xsVG9wID0gd2luZG93LnBhZ2VZT2Zmc2V0IHx8IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zY3JvbGxUb3A7XG4gICAgICAgICAgICByZXR1cm4geyB0b3A6IHJlY3QudG9wICsgc2Nyb2xsVG9wLCBsZWZ0OiByZWN0LmxlZnQgKyBzY3JvbGxMZWZ0IH07XG4gICAgICAgIH1cbiAgICB9XG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIGFuaW1PblNjcm9sbCgpO1xuICAgIH0sIDMwMCk7XG5cbn1cblxufSkoKTtcbiJdfQ==
