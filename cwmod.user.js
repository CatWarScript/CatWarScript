// ==UserScript==
// @name         CatWar Mod
// @name:ru      Варомод
// @namespace    https://catwar.su/blog482084
// @version      2.6
// @description  Полезные дополнения для catwar.su | Обновление 2.6!
// @author       Fredo14 & ScriptTeam
// @copyright    2019—2020, Хвойница & 2024 ScriptTeam (https://vk.com/cwscript)
// @license      MIT; https://opensource.org/licenses/MIT
// @match        https://*.catwar.su/*
// @grant        GM_xmlhttpRequest
// @grant        GM.xmlHttpRequest
// @grant        GM_addStyle
// @require      https://code.jquery.com/jquery-3.4.1.min.js
// ==/UserScript==

(function (window, document, $) {
  'use strict';

  const VERSION = '2.6';

const defaults = {
  'blogTagsOpen': false,
  'sniffTagsOpen1': false,
  'sniffTagsOpen2': false,
  'lsLastSearch': { folder: 0, type: 1 },
  'enableSavingLS': true,
  'indexSaveAlert': false,
  'hideEducation': false,
  'catAddFightLevel': false,
  'enableCatNotes': true,
  'enableFaeNotes': true,
  'blogAnswerButton': true,
  'blogCiteButton': true,
  'blogCiteButtonHide': false,
  'blogCommentSmiles': false,
  'blogAvatars': false,
  'blogAvatarsSize': 100,
  'blogAvatarsBorder': true,
  'blogAvatarsNoCrop': false,
  'blogImgMaxWid': 0,
  'sniffImgMaxWid': 0,
  'creationAlert': false,
  'knsAlert': false,
  'hideMail': false,
  'actionTitle': false,
  'actionEndAlert': false,
  'actionEndAlertLink': 'https://porch.website/cwmod/ding.mp3',
  'actionEndAlertVol': 1,
  'actionEndAlertTime': 1,
  'actionEndAlertBlurOnly': false,
  'fightPanelHeight': 70,
  'cwmodTheme': 0,
  'compact': false,
  'compactSwapSides': false,
  'compactChatOnTop': true,
  'compactRadiusEdges': false,
  'compactHideHeaders': false,
  'compactSplitInfo': true,
  'compactSplitInfoHeaders': true,
  'cw3Bkg': 0,
  'cw3BkgImg': '/cw3/sky/1.png',
  'cw3BkgSize': 0,
  'cw3BkgPos': 0,
  'cw3SnowWeather': false,
  'cw3HideSky': false,
  'cw3CageGrid': false,
  'loudQuieter': false,
  'quietLouder': false,
  'putCatsDown': false,
  'putArrowsDown': true,
  'deadNotTransperent': false,
  'realism': false,
  'alwaysDay': false,
  'noHistoryUnderline': false,
  'catTooltipInfo': false,
  'shortInventory': false,
  'paramInfo': true,
  'newPageMenu': false,
  'menuAbout': false,
  'menuIndex': true,
  'menuTop': false,
  'menuChat': true,
  'menuLS': true,
  'menuLS0': false,
  'menuBlogs': false,
  'menuSniff': false,
  'menuSett': false,
  'menuMobile': false
};
const globals = {};
for (var key in defaults) {
  let settings = getSettings(key);
  if (settings === null) {
    globals[key] = defaults[key];
  }
  else {
    if (Array.isArray(defaults[key])) {
      globals[key] = JSON.parse(settings);
    }
    else if (typeof defaults[key] === 'number') {
      globals[key] = parseFloat(settings);
    }
    else {
      globals[key] = settings;
    }
  }
}

function getSettings(key) {
  let setting = 'cs_n_' + key;
  let val = window.localStorage.getItem(setting);
  switch (val) {
    case null:
      return null;
    case 'true':
      return true;
    case 'false':
      return false;
    default:
      return val;
  }
}

function setSettings(key, val) {
  let setting = 'cs_n_' + key;
  window.localStorage.setItem(setting, String(val));
  globals[key] = val;
}

function removeSettings(key) {
  let setting = 'cs_n_' + key;
  window.localStorage.removeItem(setting);
}

function resetSettings(settingsToReset) {
  for (var i = 0; i < settingsToReset.length; i++) {
    let key = settingsToReset[i];
    removeSettings(key);
  }
  for (i = 0; i < settingsToReset.length; i++) {
    let key = settingsToReset[i];
    globals[key] = csDefaults[key];
  }
  $('.cs-set').each(function() {
    let key = this.id;
    if (settingsToReset.includes(key)) {
      let val = csDefaults[key];
      if (this.type === 'checkbox') {
        this.checked = val;
      }
      else {
        this.value = val;
      }
    }
  });
}
let SETTINGS = {};
let thisPageSettings = [];
const months = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
const catTimeStart = 1200000000000;
const MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
const isDesktop = isPage(/cw3\/(?!(kns|jagd))/) ? ($('#app').data('mobile') === 0) : ($('#branch').length);
const body = $('body');
if (!Date.prototype.toISOStringLocal) {
  Date.prototype.toISOStringLocal = function() {
    const d = new Date(+this);
    let offset = d.getTimezoneOffset();
    const sign = offset < 0 ? '+' : '-';
    d.setUTCMinutes(d.getUTCMinutes() - d.getTimezoneOffset());
    offset = ('0' + (offset / 60 | 0)).slice(-2) + ('0' + (offset % 60)).slice(-2);
    return d.toISOString().replace(/Z\s*/i, '') + sign + offset;
  };
}
const pageurl = window.location.href;
const isCW3 = (/^https:\/\/\w?\.?catwar.su\/cw3(?!(\/kns|\/jagd))/.test(pageurl));
const isKns = (/^https:\/\/\w?\.?catwar.su\/cw3\/kns/.test(pageurl));
const isIndex = (isPage('', true) || isPage('index')) && $('#act_name b').length;
const isCat = (/^https:\/\/\w?\.?catwar.su\/cat(\d+|\/.+)/.test(pageurl));
const isFae = (/^https:\/\/\w?\.?catwar.su\/fae/.test(pageurl));
const isChat = (/^https:\/\/\w?\.?catwar.su\/chat/.test(pageurl));
const isLs = (/^https:\/\/\w?\.?catwar.su\/ls/.test(pageurl));
const isIdeas = (/^https:\/\/\w?\.?catwar.su\/ideas/.test(pageurl));
const isBlogs = (/^https:\/\/\w?\.?catwar.su\/(blog(?!sea)|sniff|idea)/.test(pageurl));
const isSettings = (/^https:\/\/\w?\.?catwar.su\/settings/.test(pageurl));
try {
  updateStorage();
  loadSettings();
  changeAllPages();
  if (isCW3) {
    changeCW3Page();
  }
  else if (isKns) {
    changeKnsPage();
  }
  else if (isIndex) {
    changeIndexPage();
  }
  else if (isCat) {
    changeCatPage();
  }
  else if (isFae) {
    changeFaePage();
  }
  else if (isChat) {
    changeChatPage();
  }
  else if (isLs) {
    changeLsPage();
  }
  else if (isIdeas) {
    changeIdeasPage();
  }
  else if (isBlogs) {
    changeAllBlogsPages();
  }
  else if (isSettings) {
    changeSettingsPage();
  }
}
catch (err) {
  window.console.error('Варомод:', err);
}

function updateStorage() {
  // 2.0
  Object.keys(window.localStorage).forEach(function(key) {
    const savedNotes = JSON.parse(window.localStorage.getItem('cwmod_notes') || '{}');
    if (/^cwm_settings/.test(key)) delete window.localStorage[key];
    if (/^cwm_note/.test(key)) {
      const catId = getNumber(key);
      savedNotes[catId] = window.localStorage[key];
      saveData('notes', savedNotes);
      delete window.localStorage[key];
    }
    if (key === 'cwm_saved_chat') {
      saveData('saved_chat', window.localStorage[key]);
      delete window.localStorage[key];
    }
  });
}

function changeAllPages() {
  const white = $('body > span').first();
  if (white.length) {
    white.children('a').css('color', '');
    white.css('background-color', $('#site_table').css('background-color'));
  }
  const footer = $('#footer');
  if (footer.length) {
    const oldFooter = footer.html().split('<br>©');
    footer.html(oldFooter[0] + ` | <a target="_blank" href="/settings#cwmod">Настройки</a><br>©` + oldFooter[1]);
  }
  let css = `
#cwmod-popup-wrap {
  position: fixed;
  left: 0;
  top: 0;
  z-index: 2;
  width: 100%;
  height: 100%;
  display: none;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
}
#cwmod-popup {
  display: grid;
  grid-gap: 1em;
  max-height: 50vh;
  width: 300px;
  padding: 1em;
  background: white;
  color: black;
  border: 1px solid black;
}
.cwmod-popup-btn:hover { text-decoration: none; }
.cwmod-popup-btn { display: none; text-align: center; color: #000033; text-decoration: underline; cursor: pointer; }
#cwmod-popup-reload { grid-area: reload; }
#cwmod-popup-cancel { grid-area: cancel; }
#cwmod-popup-hide { grid-area: hide; }
#cwmod-popup-text { grid-area: text; }
#cwmod-popup-text a { color: #123; }
#cwmod-popup-text a:hover { color: #246; }

.reload #cwmod-popup { grid-template-areas: 'text text' 'reload cancel'; }
.reload #cwmod-popup-reload, .reload #cwmod-popup-cancel { display: block; }
.alert #cwmod-popup { grid-template-areas: 'text' 'hide'; }
.alert #cwmod-popup-hide { display: block; }

.usn { user-select: none; }
.fs0 { font-size: 0; }
`;
  addCSS(css);
  body.append(`
<div class="reload" id="cwmod-popup-wrap">
  <div id="cwmod-popup">
    <div id="cwmod-popup-text"></div>
    <div class="cwmod-popup-btn" id="cwmod-popup-reload" onclick="window.location.reload()">Обновить</div>
    <div class="cwmod-popup-btn" id="cwmod-popup-cancel" onclick="$('#cwmod-popup-wrap').hide()">Позже</div>
    <div class="cwmod-popup-btn" id="cwmod-popup-hide" onclick="$('#cwmod-popup-wrap').hide()">Скрыть</div>
  </div>
</div>
`);
  $(window).on('storage', function(e) {
    if (e.originalEvent.key === 'cwmod_settings') {
      const oldValue = JSON.parse(e.originalEvent.oldValue);
      const newValue = JSON.parse(e.originalEvent.newValue);
      Object.keys(newValue).forEach(function(key) {
        if (thisPageSettings.indexOf(key) !== -1) {
          if (oldValue[key] !== newValue[key]) {
            let text = 'Настройки Варомода для этой страницы были изменены. Обновить страницу прямо сейчас, чтобы применить их?';
            showCwmodPopup('reload', text);
          }
        }
      });
    }
  });
  body.on('click', 'summary.cwmod-settings', function() {
    const th = $(this);
    const key = th.data('conf');
    setSettings(key, !th.parent().is('[open]'));
  });
  body.on('change', 'select.cwmod-settings', function() {
    const th = $(this);
    const key = th.data('conf');
    let val = th.val();
    if (/^\d+$/.test(val)) val = Number(val);
    setSettings(key, val);
    $(`[data-show="${key}"]`).each(function() {
      let cond = $(this).data('cond');
      const invert = /^!/.test(cond);
      cond = cond.replace(/^!/, '');
      if (invert !== (cond === val)) $(this).show();
      else $(this).hide();
    });
  });
  body.on('change', 'input.cwmod-settings', function() {
    const th = $(this);
    const key = th.data('conf');
    const type = th.attr('type');
    let val;
    if (type === 'checkbox') {
      val = th.is(':checked');
      setSettings(key, val);
      if (val) $(`[data-show="${key}"]`).show();
      else $(`[data-show="${key}"]`).hide();
    }
    else if (type === 'range') {
      val = th.val();
      setSettings(key, val);
    }
  });
  body.on('input', 'input.cwmod-settings', function() {
    const th = $(this);
    const key = th.data('conf');
    const type = th.attr('type');
    if (type === 'number') {
      if (th.val()) setSettings(key, Number(th.val()));
    }
    else if (type === 'text') {
      if (th.val()) setSettings(key, th.val());
    }
  });
  body.on('click', '.cwmod-settings-set-default', function(e) {
    e.preventDefault();
    const th = $(this);
    const key = th.data('rel');
    const val = DEFAULTS[key];
    const input = $(`[data-conf="${key}"]`);
    if (input.attr('type') === 'text') input.val(val);
    setSettings(key, val);
  });
  body.on('click', '.cwmod-settings-test-sound', function(e) {
    e.preventDefault();
    const th = $(this);
    const audio = new Audio();
    const volume = $(`[data-conf="${th.data('volume')}"]`).val();
    audio.src = getSettings(th.data('audio'));
    audio.volume = volume;
    audio.pause();
    audio.currentTime = 0;
    audio.play();
  });
  if (globals.enableCatNotes) {
    body.on('mouseenter', 'a:not(.headers)', function() {
      const th = $(this);
      const href = th.attr('href');
      if (!/cat\d+/.test(href)) return;
      const catId = /\d+/.exec(href)[0];
      const note = getNoteByCatId(catId);
      if (note) th.attr('title', note);
    });
  }
  body.on('mouseenter', '.headers', function() {
    $(this).attr('title', 'Это раскрывающийся блок');
  });
}

function showCwmodPopup(type, text) {
  $('#cwmod-popup-wrap').removeClass().addClass(type);
  $('#cwmod-popup-text').html(text);
  if ($('#cwmod-popup-wrap').css('display') === 'none') {
    $('#cwmod-popup-wrap').css('display', 'flex');
  }
}

function moonCalc() {
  if (!$('#info').length) return;
  addCSS(`.calc-error { color: darkred; }`);
  $('#info').after('<div id="calc-age"></div>');
  const infoObserver = new MutationObserver(function(mutations) {
    mutations.forEach(function() {
      const infoText = $('#info').text();
      if (!infoText.match('Дата')) {
        $('#calc-age').empty();
        return;
      }
      const birthDateString = infoText.match(/\d{4}-\d\d-\d\d \d\d:\d\d/)[0].replace(' ', 'T');
      const nowDateString = dateToString(new Date);
      const moonsNow = getMoonsFromDate(birthDateString, nowDateString);
      let bornWord;
      const sex = $('[src^="//e.catwar.su/avatar"]').first()[0].style.borderColor;
      const isRegDate = (/регистрац/.test(infoText) && $('#age2_icon').length);
      switch (sex) {
        case 'pink':
          bornWord = isRegDate ? 'Зарегистрировалась' : 'Родилась';
          break;
        case 'blue':
          bornWord = isRegDate ? 'Зарегистрировался' : 'Родилcя';
          break;
        default:
          bornWord = isRegDate ? 'Зарегистрировалось' : 'Родилoсь';
      }
      const catTime = timestampToCatTime(Date.parse(birthDateString));
      const catTimeString = `${catTime.day} ${months[catTime.month]} ${catTime.year} года в ${leadingZero(catTime.hour)}:${leadingZero(catTime.minute)}`;
      $('#calc-age').html(`
<p><b>Калькулятор возраста</b></p>
<label>Дата и время: <input type="datetime-local" id="calc-date" min="${birthDateString}" value="${nowDateString}" max="9999-31-12T23:59"></label> <span id="calc-error-date" class="calc-error"></span>
<br><label>Возраст: <input type="number" id="calc-moons" min="0" step="0.1" value=${moonsNow} style="width: 60px"></label> <span id="moon-word">лун</span> <span id="calc-error-moons" class="calc-error"></span>
<br>${bornWord} ${catTimeString} по кошачьему времени.
<br><br>
`);
      updateMoonWord(moonsNow);
      $('#calc-date').on('input', function() {
        $('#calc-error-date').empty();
        const dateString = $('#calc-date').val();
        const date = Date.parse(dateString);
        if (isNaN(date)) {
          if (dateString.length) $('#calc-error-date').html('Ошибка!');
          return;
        }
        if (date < Date.parse(birthDateString)) {
          $('#calc-error-date').html('Ошибка!');
          return;
        }
        const moons = getMoonsFromDate(birthDateString, dateString);
        $('#calc-moons').val(moons);
        updateMoonWord(moons);
      });
      $('#calc-moons').on('input', function() {
        $('#calc-error-moons').empty();
        const moons = Number($('#calc-moons').val());
        if (moons < 0 || isNaN(moons)) {
          $('#calc-error-moons').html('Ошибка!');
          return;
        }
        $('#calc-date').val(getDateStringFromMoons(birthDateString, moons));
        updateMoonWord(moons);
      });
    });
  });
  infoObserver.observe(document.querySelector('#info'), {
    childList: true
  });
}

function updateMoonWord(moons) {
  $('#moon-word').html(declOfNum(moons, ['луна', 'луны', 'лун']));
}

function getMoonsFromDate(birthDateString, dateString) {
  const birthday = Date.parse(birthDateString);
  const date = Date.parse(dateString);
  const moons = Math.floor(convertTime('ms d', date - birthday) / 4 * 10) / 10;
  return moons;
}

function getDateStringFromMoons(birthDateString, moons) {
  const birthday = Date.parse(birthDateString);
  const age = Math.round(convertTime('d ms', moons * 4));
  return dateToString(birthday + age);
}

function changeAllBlogsPages() {
  addBBcode(1);
  let css = `
#blogs-reload > a, .poll-hasAnswered1 { color: black; }
.tags-list { margin: 0; }
.tags-list > li { list-style-type: circle; }
#add-tags p, #add-tags li { line-height: 1.4em; }
.add-tag {
  padding: 1px 5px;
  background-color: rgba(255, 255, 255, 0.8);
  color: black;
  border-radius: 1rem;
  white-space: nowrap;
  cursor: pointer;
}
.add-tag::before { content: '+ '; color: #888; }
#search > p { margin-top: 0.5em; }
.comment-answer, .comment-cite { display: inline-block; margin-top: 5px; }
  `;
  if (globals.blogCiteButtonHide) {
    css += `.comment-cite-wrap { display: none; }`;
  }
  if (isPage('blog')) {
    if (globals.blogImgMaxWid) {
      css += `img {max-width: ${globals.blogImgMaxWid}px}`;
    }
  }
  if (isPage('sniff')) {
    if (globals.sniffImgMaxWid) {
      css += `img {max-width: ${globals.sniffImgMaxWid}px}`;
    }
  }
  if (globals.blogAvatars) {
    const width = globals.blogAvatarsSize;
    const border = globals.blogAvatarsBorder;
    const size = globals.blogAvatarsNoCrop ? 'contain' : 'cover';
    css += `
    .comment-avatar {
      grid-area: avatar;
      display: block;
      width: ${width}px;
      height: ${width}px;
      ${border ? 'border: 1px solid black;' : ''}
      background-size: ${size};
      background-repeat: no-repeat;
      background-position: center;
    }
    .comment-info { grid-area: info; }
    .comment-info + p { grid-area: p; }
    .comment-text { grid-area: text; }
    .comment-answer-buttons { grid-area: btns; }
    .view-comment {
      display: grid;
      grid-template-areas: 'avatar info' 'avatar p' 'avatar text' 'btns btns';
      grid-template-columns: ${width + 2 * border}px auto;/*я пожалею об этом*/
      grid-column-gap: 10px;
    }
    `;
  }
  addCSS(css);
  changeMainPage();
  changeViewPage();
  if (isPage('blogs?creation') || isPage('sniff?creation')) {
    changeCreationPage();
  }
  const viewObserver = new MutationObserver(function(mutations) {
    mutations.forEach(function() {
      if ($('#view').css('display') === 'none') {
        hideCommentPreview();
      }
    });
  });
  const creationObserver = new MutationObserver(function(mutations) {
    mutations.forEach(function() {
      if ($('#creation').css('display') === 'none') {
        window.removeEventListener('beforeunload', beforeunload);
      }
      else {
        changeCreationPage();
      }
    });
  });
  viewObserver.observe($('#view')[0], {
    attributes: true
  });
  creationObserver.observe($('#creation')[0], {
    attributes: true
  });
}

function changeMainPage() {
  $('#search > form > input[type="text"]').attr('placeholder', 'Поиск по ключевым словам');
  $('#search').append(`<p><input id="search-tag" type="text" size="35" placeholder="Поиск по тегу"> <input id="search-ok" type="button" value="Искать"></p>`);
  $('#search-ok').click(function() {
    searchByTag($('#search-tag').val());
  });
  $('#search-tag').keypress(function(e) {
    if (e.which == 13) {
      searchByTag($('#search-tag').val());
      return false;
    }
  });
}

function changeViewPage() {
  const p = $('#send_comment_form > p:last-child');
  p.prepend(`<input type="button" id="comment-preview" value="Предпросмотр"> `);
  $('#send_comment_form').after(`
<p id="comment-preview-hide" style="display: none; margin: 0.5em 0;"><a href="#">Скрыть предпросмотр</a></p>
<div id="comment-preview-div" style="display :none"></div>
    `);
  const WS = io.connect(window.location.origin, {
    path: '/ws/blogs/socket.io'
    , reconnectionDelay: 10000
    , reconnectionDelayMax: 20000
  });
  WS.on('creation preview', function(data) {
    $('#comment-preview-div').html(data).show();
    $('#comment-preview-hide').show();
  });
  $('#comment-preview').click(function() {
    WS.emit("creation preview", $('#comment').val());
  });
  $('#send_comment_form [type="submit"]').click(hideCommentPreview);
  $('#comment-preview-hide').click(function(e) {
    e.preventDefault();
    hideCommentPreview();
  });
  if (globals.blogCommentSmiles) {
    p.append(`
<img src="smile/1.png" class="sticker" data-code=":sm1:">
<img src="smile/2.png" class="sticker" data-code=":sm2:">
<img src="smile/3.png" class="sticker" data-code=":sm3:">
<img src="smile/4.png" class="sticker" data-code=":sm4:">
<img src="smile/5.png" class="sticker" data-code=":sm5:">
<img src="smile/6.png" class="sticker" data-code=":sm6:">
<img src="smile/7.png" class="sticker" data-code=":sm7:">
<img src="smile/8.png" class="sticker" data-code=":sm8:">
<img src="smile/9.png" class="sticker" data-code=":sm9:">
`);
  }
  if ($('#comment').length) {
    const commentObserver = new MutationObserver(function(mutations) {
      mutations.forEach(changeComments);
    });
    commentObserver.observe(document.querySelector('#view_comments'), {
      childList: true
    });
  }
  let selectionInfo = {};
  $('#view_comments').on('mouseup touchend', function() {
    if (globals.blogCiteButtonHide) $('.comment-cite-wrap').hide();
    const sel = window.getSelection();
    if (!sel.isCollapsed && sel.anchorNode && sel.focusNode) {
      if (sel.anchorNode.parentElement.classList.contains('.comment-cite')) return;
      else selectionInfo = {};
      const anchor = {
        elem: sel.anchorNode
        , isComment: false
        , id: 0
      };
      const focus = {
        elem: sel.focusNode
        , isComment: false
        , id: 0
      };
      while (anchor.elem = anchor.elem.parentElement) {
        if (anchor.elem.classList.contains('comment-text')) anchor.isComment = true;
        if (anchor.elem.dataset.id) {
          anchor.id = anchor.elem.dataset.id;
          break;
        }
      }
      while (focus.elem = focus.elem.parentElement) {
        if (focus.elem.classList.contains('comment-text')) focus.isComment = true;
        if (focus.elem.dataset.id) {
          focus.id = focus.elem.dataset.id;
          break;
        }
      }
      if (anchor.isComment && focus.isComment && anchor.id === focus.id) {
        selectionInfo.text = sel.toString();
        selectionInfo.id = parseInt(anchor.id, 10);
        $(`[data-id="${selectionInfo.id}"] .comment-cite-wrap`).show();
      }
    }
  });
  $('#view_comments').on('click', '.comment-answer', function(e) {
    e.preventDefault();
    answerComment($(this).parent().parent(), false);
  });
  $('#view_comments').on('click', '.comment-cite', function(e) {
    e.preventDefault();
    answerComment($(this).parent().parent().parent(), true, selectionInfo);
  });
}

function hideCommentPreview() {
  $('#comment-preview-hide').hide();
  $('#comment-preview-div').empty().hide();
}

function changeComments() {
  addAnswerButtons();
  if (globals.blogAvatars) {
    addCommentAvatars();
  }
}

function addCommentAvatars() {
  $('.view-comment:not(.has-avatar)').each(function() {
    $(this).prepend('<div class="comment-avatar"></div>');
    const commentId = $(this).data('id');
    const avatarSelector = `.view-comment[data-id="${commentId}"] > .comment-avatar`;
    const avatarDiv = $(avatarSelector);
    const author = $(this).children('.comment-info').children('.author');
    const catId = author.length ? getNumber(author.attr('href')) : 0;
    // const storedAvatar = window.sessionStorage.getItem('avatar' + catId);
    const storedAvatarJPG = '//e.catwar.su/avatar/' + catId + '.jpg'
    const storedAvatarPNG = '//e.catwar.su/avatar/' + catId + '.png'
    const storedAvatarGIF = '//e.catwar.su/avatar/' + catId + '.gif'
    if (catId === 0) {
      avatarDiv.css('background-image', `url(//e.catwar.su/avatar/0.jpg)`);
    }
    else {
      avatarDiv.css('background-image', `url(${storedAvatarJPG}), url(${storedAvatarPNG}),url(${storedAvatarGIF}) `);
    }
    $(this).addClass('has-avatar');
  });
}

function addAnswerButtons() {
  const answerButton = isDesktop ? 'Ответить' : '🗨';
  const citeButton = isDesktop ? 'Цитировать' : '💬';
  const addAnswer = globals.blogAnswerButton;
  const addCite = globals.blogCiteButton;
  $('.view-comment:not(.has-buttons)').each(function() {
    let html = `<p class="comment-answer-buttons">`;
    const notMyComment = $(this).children('.comment-info').children('[data-candelete="0"]').css('display') !== 'none';
    if (addAnswer && notMyComment) {
      html += `<a class="comment-answer" href="#">${answerButton}</a>`;
    }
    if (addCite) {
      html += '<span class="comment-cite-wrap">';
      if (addAnswer && notMyComment) html += ' | '
      html += `<a class="comment-cite" href="#">${citeButton}</a></span>`;
    }
    $(this).append(html).addClass('has-buttons');
  });
}

function answerComment(comment, cite, selectionInfo) {
  const commentInfo = comment.children('.comment-info');
  const num = commentInfo.children('b').children('.num').text();
  let author;
  if (commentInfo.children('.author').length) author = '[link' + getNumber(commentInfo.children('.author').attr('href')) + ']';
  else author = '[b][code]' + commentInfo.children('span').first().text() + '[/code][/b]';
  let quote;
  if (cite) {
    let text;
    if (selectionInfo.id === comment.data('id')) text = selectionInfo.text;
    else text = bbencode(comment.children('.comment-text').children('.parsed').html());
    const date = findDate(commentInfo.html());
    quote = `[table][tr][td][size=10][i]Цитата:[/i] [b]#${num}[/b] ${date} @ ${author}[/size][/td][/tr][tr][td][table=0][tr][td]  [/td][td]${text}[/td][/tr][/table][/td][/tr][/table]`;
  }
  else {
    quote = `${author} (#${num}), `;
  }
  const textarea = $('#comment');
  textarea.val(textarea.val() + quote);
  textarea.focus();
}

function changeCreationPage() {
  if (globals.creationAlert) addSaveAlert();
  if (isPage('blogs?creation', true) || isPage('sniff?creation', true)) {
    const blogsTags = `
<details id="add-tags"${globals.blogTagsOpen ? ' open' : ''}>
<summary class="cwmod-settings"><b>Добавить теги</b></summary>
<p>
  <span class="add-tag">информация</span>
  <span class="add-tag">новичкам</span>
  <span class="add-tag">племенной блог</span>
</p>
<p>
  <span class="add-tag">поздравление</span>
  <span class="add-tag">день рождения</span>
  <span class="add-tag">годовщина</span>
  <span class="add-tag">самопоздравление</span>
</p>
<p>
  <span class="add-tag">писательское творчество</span>
  <span class="add-tag">стихотворения</span>
  <span class="add-tag">рисунки</span>
  <span class="add-tag">фотографии</span>
  <span class="add-tag">рукоделие</span>
  <span class="add-tag">журнал</span>
</p>
<p>
  <span class="add-tag">неграмотно</span>
  <span class="add-tag">мало</span>
  <span class="add-tag">скопировано</span>
  <span class="add-tag">опасно для глаз</span>
</p>
<p><span class="add-tag">сходка</span></p>
<p><span class="add-tag">конкурс</span></p>
</details>
`;
    const sniffTags = `
<details id="add-tags"${globals.sniffTagsOpen1 ? ' open' : ''}>
<summary class="cwmod-settings"><b>Добавить теги</b></summary>
<p><small>Основано на блоге <a href="/blog331589">Ликбез</a>. Инструкция по выбору тегов там, а это кнопки для тех, кому лень писать их руками.</small></p>
<p><span class="add-tag">изображение</span></p>
<ul class="tags-list">
  <li><span class="add-tag">скриншот</span> <span class="add-tag">достижение</span> <span class="add-tag">максимальное достижение</span> <span class="add-tag">звуки в Игровой</span> <span class="add-tag">скриншот Игровой</span> <span class="add-tag">скриншот кота</span> <span class="add-tag">скриншот профиля</span></li>
  <li><span class="add-tag">фотография</span> <span class="add-tag">фотография автора</span> <span class="add-tag">фотография питомца</span> <span class="add-tag">фотография природы</span></li>
  <li><span class="add-tag">действие</span> <span class="add-tag">дизайн</span> <span class="add-tag">запах</span> <span class="add-tag">локация</span> <span class="add-tag">медалька</span> <span class="add-tag">мем</span> <span class="add-tag">небо</span> <span class="add-tag">предмет</span> <span class="add-tag">рисунок</span></li>
</ul>
<p><span class="add-tag">Поднюхано</span> <span class="add-tag">Замышеголовили</span></p>
<ul class="tags-list">
  <li><span class="add-tag">бугурт</span> <span class="add-tag">искусство</span> <span class="add-tag">Игровая</span> <span class="add-tag">критика</span> <span class="add-tag">милота</span> <span class="add-tag">обновление</span> <span class="add-tag">племенные новости</span> <span class="add-tag">творчество</span> <span class="add-tag">точка зрения</span></li>
</ul>
<p><span class="add-tag">Флудильня</span></p>
<ul class="tags-list">
  <li><span class="add-tag">кроли</span> <span class="add-tag">локации за кроли</span> <span class="add-tag">о себе за кроли</span> <span class="add-tag">предметы за кроли</span> <span class="add-tag">рисунки за кроли</span> <span class="add-tag">услуги за кроли</span></li>
  <li><span class="add-tag">пыль</span> <span class="add-tag">предметы за пыль</span> <span class="add-tag">рисунки за пыль</span> <span class="add-tag">услуги за пыль</span></li>
  <li><span class="add-tag">рисунки за деньги</span></li>
  <li><span class="add-tag">ролевая</span> <span class="add-tag">приглашение в ролевую</span></li>
  <li><span class="add-tag">72</span> <span class="add-tag">адопт</span> <span class="add-tag">аукцион</span> <span class="add-tag">битва окрасов</span> <span class="add-tag">бугурт</span> <span class="add-tag">варомявы</span> <span class="add-tag">выбор племени</span> <span class="add-tag">гиф</span> <span class="add-tag">Голодные игры</span> <span class="add-tag">желание</span> <span class="add-tag">игра</span> <span class="add-tag">Игровая</span> <span class="add-tag">имя</span> <span class="add-tag">карта</span> <span class="add-tag">квест</span> <span class="add-tag">квест-опрос</span> <span class="add-tag">клон</span> <span class="add-tag">комикс</span> <span class="add-tag">лотерея</span> <span class="add-tag">обмен</span> <span class="add-tag">обмен предметов</span> <span class="add-tag">окрас</span> <span class="add-tag">покраска лайнов</span> <span class="add-tag">рабство</span> <span class="add-tag">симулятор</span> <span class="add-tag">сторонняя игра</span> <span class="add-tag">халява</span></li>
</ul>
<p>Общие теги:</p>
<ul class="tags-list">
  <li><span class="add-tag">реальность</span> <span class="add-tag">учёба</span> <span class="add-tag">школа</span> <span class="add-tag">сон</span> <span class="add-tag">семья</span></li>
  <li><span class="add-tag">поиск</span> <span class="add-tag">поиск друзей</span> <span class="add-tag">поиск кота</span> <span class="add-tag">поиск напарника</span> <span class="add-tag">поиск пары</span> <span class="add-tag">поиск семьи</span> <span class="add-tag">поиск художника</span></li>
  <li><span class="add-tag">вопрос</span> <span class="add-tag">опрос</span> <span class="add-tag">помощь</span></li>
</ul>
<details${globals.sniffTagsOpen2 ? ' open' : ''}>
<summary class="cwmod-settings"><b>Теги вселенных и фракций</b></summary>
<p>Мёртвые:
  <span class="add-tag">Звёздное племя</span>
  <span class="add-tag">Сумрачный лес</span>
  <span class="add-tag">Душевая</span>
</p>
<p>Озёрная вселенная:
  <span class="add-tag">Грозовое племя</span>
  <span class="add-tag">племя Ветра</span>
  <span class="add-tag">Речное племя</span>
  <span class="add-tag">племя Теней</span>
  <span class="add-tag">клан Падающей Воды</span>
  <span class="add-tag">Северный клан</span>
  <span class="add-tag">Домашние</span>
  <span class="add-tag">одиночки ОВ</span>
  <span class="add-tag">Озёрная вселенная</span>
</p>
<p>Морская вселенная:
  <span class="add-tag">Морское племя</span>
  <span class="add-tag">племя Солнца</span>
  <span class="add-tag">племя Луны</span>
  <span class="add-tag">одиночки МВ</span>
  <span class="add-tag">Морская вселенная</span>
</p>
<p>Вселенная творцов:
  <span class="add-tag">племя Неразгаданных Тайн</span>
  <span class="add-tag">Крылатое племя</span>
  <span class="add-tag">Сплочённый Союз Свободных Республик</span>
  <span class="add-tag">клан Ледяного Дождя</span>
  <span class="add-tag">Эльфийские земли</span>
  <span class="add-tag">Чернолесье</span>
  <span class="add-tag">одиночки ВТ</span>
  <span class="add-tag">Вселенная творцов</span>
</p>
</details>
</details>
`;
    const tagsInput = $('#creation-tags');
    if (!$('#add-tags').length) {
      if (isPage('blogs')) tagsInput.parent().after(blogsTags);
      else if (isPage('sniff')) tagsInput.parent().after(sniffTags);
      $('.add-tag').click(function() {
        let tags = tagsInput.val();
        if (tags) tags += ', ';
        tags += $(this).text();
        tagsInput.val(tags);
        tagsInput.focus();
      });
    }
    const creationInput = $('#creation-text');
    if (creationInput.length) {
      const key = isPage('blogs') ? 'cwm_saved_blog' : 'cwm_saved_sniff';
      const oldText = window.localStorage.getItem(key);
      if (oldText && !creationInput.val()) creationInput.val(oldText);
      creationInput.on('input', function() {
        window.localStorage.setItem(key, creationInput.val());
      });
    }
  }
}

function searchByTag(tag) {
  window.location.href = window.location.href.split('?')[0] + '?tag=' + tag;
}

function changeCatPage() {
  addCSS(`#info { color: black; } #age_icon, #age2_icon, #act_icon, img[src^="medal"] { cursor: pointer; }`);
  moonCalc();
  if ($('[src="img/icon_kraft.png"]').length) {
    if (globals.catAddFightLevel) {
      const kraftArr = ['блоха', 'котёночек', 'задира', 'гроза детской', 'страх барсуков', 'победитель псов', 'защитник племени', 'великий воин', 'достоин Львиного племени', 'идеальная'];
      const b = $('[src="img/icon_kraft.png"]').parent().siblings().children('b');
      b.append(' (' + kraftArr.indexOf(b.text()) + ')');
    }
  }
  if (globals.enableCatNotes) {
    let p, catId;
    if (isDesktop) {
      p = $('#branch > p').first();
      catId = p.data('cat');
      $('#branch').prepend(`<textarea id="note" placeholder="Заметка об игроке. Её можете видеть только вы" style="float: right; min-width: 100px; width: 250px; max-width: 500px; height: 100px;"></textarea>`);
    }
    else {
      p = $('#site_table > p').first();
      catId = p.data('cat');
      p.append(`<textarea id="note" placeholder="Заметка об игроке. Её можете видеть только вы" style="display: block; width: calc(100% - 10px); height: 50px;"></textarea>`);
    }
    const oldText = getNoteByCatId(catId);
    const textarea = $('#note');
    if (oldText && !textarea.val()) textarea.val(oldText);
    const savedNotes = JSON.parse(window.localStorage.getItem('cwmod_notes') || '{}');
    textarea.on('input', function() {
      savedNotes[catId] = textarea.val();
      if (!savedNotes[catId]) delete savedNotes[catId];
      saveData('notes', savedNotes);
    });
  }
  const medals = $('img[src^="medal"]');
  if (medals.length) {
    let lastpic = false;
    medals.last().after(`<div id="infomedal" style="display: none; margin: 5px; padding: 5px; border-radius: 10px; width: 270px; background: rgba(255, 255, 255, 0.3); color: black;"></div>`);
    const info = $('#infomedal');
    $.getJSON('https://porch.website/get?file=medals&type=json', function(data) {
      let medalsList = data.data;
      medals.click(function() {
        const picURL = $(this).attr('src');
        const pic = getNumber(picURL);
        if (pic === lastpic) {
          info.hide(200);
          lastpic = '';
        }
        else {
          if (info.css('display') === 'none') info.show(200);
          lastpic = pic;
          const medalInfo = medalsList[pic];
          if (medalInfo) {
            let status = medalInfo[1];
            let transfer = medalInfo[2];
            let getting = medalInfo[3];
            let whose = medalInfo[4];
            let about = `<br><b>${$(this).attr('alt')}</b>`;
            if (!(status || transfer || getting || whose === 'Сайтовая')) about += '<br><i>Нет информации</i>';
            else {
              about += '<span style="font-size: 0.9em">';
              if (status) {
                let color;
                if (status === 'выдаётся') color = 'green';
                else if (status === 'не выдаётся') color = '#ba0000';
                else color = 'gray';
                about += `<br>Статус: <b style="color: ${color}">${status}</b>`;
              }
              if (transfer === 'возможен') about += `<br>Перенос на другого персонажа <b style="color: green">возможен</b>`;
              else if (transfer === 'невозможен') about += `<br>Перенос на другого персонажа <b style="color: #ba0000">невозможен</b>`;
              about += '</span>';
              if (getting) about += `<br><span style="white-space:pre-wrap">${getting}</span>`;
              if (whose === 'Сайтовая') about += `<br><span style="font-size: 0.9em">Это сайтовая медаль.</span>`;
            }
            info.html(`Медаль № ${pic}${about}`);
          }
          else {
            info.html(`Медаль № ${pic}<br><b>${$(this).attr('alt')}</b><br><i>Нет информации</i>`);
          }
        }
      });
    });
  }
}

function changeChatPage() {
  addCSS(`.tabName, #confirm_text, .mess_tr[style^="background: rgb(255, 204, 153)"] { color: black; } .mess_tr[style^="background: rgb(255, 204, 153)"] a { color: #003; }`);
  addBBcode(1);
  const key = 'cwmod_saved_chat';
  const oldText = window.localStorage.getItem(key);
  if (oldText) $('#mess').html(oldText);
  $('#mess').on('input', function() {
    window.localStorage.setItem(key, $('#mess').html());
  });
  const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function() {
      if (!$('#mess').html()) window.localStorage.removeItem(key);
    });
  });
  observer.observe(document.querySelector('#mess'), {
    childList: true
  });
}

function changeCW3Page() {
  const menu = $('.small').first();
  //const isMale = /Мой кот/.test(menu.text());
  const target = globals.newPageMenu ? 'target="_blank"' : '';
  const menuButtons = {};
  let smenuAbout = globals.menuAbout
  let smenuIndex = globals.menuIndex
  let smenuTop = globals.menuTop
  let smenuChat = globals.menuChat
  let smenuLS = globals.menuLS
  let smenuLS0 = globals.menuLS0
  let smenuBlogs = globals.menuBlogs
  let smenuSniff = globals.menuSniff
  let smenuSett = globals.menuSett
  let smenuMobile = globals.menuMobile
  menuButtons[smenuAbout] = `<a ${target} href="/about">Об игре</a>`;
  //menuButtons[smenuIndex] = `<a ${target} href="/">${isMale ? 'Мой кот' : 'Моя кошка'}</a>`;
  menuButtons[smenuTop] = `<a ${target} href="/top">СИ</a>`;
  //menuButtons[smenuChat] = `<a ${target} href="/chat">Чат</a><span id="newchat"></span>`;
  //menuButtons[smenuLS] = `<a ${target} href="/ls">ЛС</a><span id="newls"></span>`;
  menuButtons[smenuLS0] = `<a ${target} href="/ls?id=0">Памятка</a>`;
  menuButtons[smenuBlogs] = `<a ${target} href="/blogs">Блоги</a>`;
  menuButtons[smenuSniff] = `<a ${target} href="/sniff">Лента</a>`;
  menuButtons[smenuSett] = `<a ${target} href="/settings#cwmod">Настройки</a>`;
  menuButtons[smenuMobile] = `<a href="/mobile">Сменить версию</a>`;
  if (globals.menuAbout) {
    $('.small').append('| <a href="/about">Об игре</a> ');
  }
  if (globals.menuTop) {
    $('.small').append('| <a href="/top">СИ</a> ');
  }
  if (globals.menuLS0) {
    $('.small').append('| <a href="/ls?id=0">Памятка</a> ');
  }
  if (globals.menuBlogs) {
    $('.small').append('| <a href="/blogs">Блоги</a> ');
  }
  if (globals.menuSniff) {
    $('.small').append('| <a href="/sniff">Лента</a> ');
  }
  if (globals.menuSett) {
    $('.small').append('| <a href="/settings#cwmod">Настройки</a> ');
  }
  if (globals.menuMobile) {
    $('.small').append('| <a href="/mobile">Сменить версию</a> ');
  }
  Object.keys(menuButtons).forEach(function(key) {
    if (globals.key) {
      menu.append(' | ' + menuButtons[key]);
    }
  });
  let css = '';
  if (globals.quietLouder) {
    css += `.vlm0, .vlm1, .vlm2, .vlm3, .vlm4 {font-size: 12px;}`;
  }
  if (globals.loudQuieter) {
    css += `.vlm6, .vlm7, .vlm8, .vlm9, .vlm10 {font-size: 14px;}`;
  }
  if (globals.putCatsDown) {
    css += `.d, .d div {background-position: left bottom;}`;
  }
  if (globals.fightPanelHeight) {
    const height = globals.fightPanelHeight;
    if (height !== 70) {
      css += `
#fightPanel { height: max-content; }
#fightLog { overflow-y: auto; min-height: 70px; height: unset !important; max-height: ${height}px; }
        `;
    }
  }
  if (globals.realism) {
    css += `.d {background-image: url(https://porch.website/cwmod/cat.png) !important;}`;
  }
  if (globals.cw3CageGrid) {
    css += `.cage {box-shadow: inset 1px 1px 1px rgba(0, 0, 0, 0.33), inset -1px -1px 1px rgba(255, 255, 255, 0.33);}`;
  }
  if (globals.deadNotTransperent) {
    css += `.cat > div {opacity: 1 !important;}`;
  }
  if (globals.cw3HideSky) {
    css += `#tr_sky {display: none;}`;
  }
  if (globals.alwaysDay) {
    css += `#cages_div {opacity: 1 !important;}`;
  }
  if (globals.noHistoryUnderline) {
    css += `#ist > a {text-decoration: none;}`;
  }
  if (globals.compact) {
    css += `
#app { width: 100%; height: 1000px; }
#main_table { width: 100%; max-width: unset; height: 100%; border-collapse: collapse; background: none !important; }
#main_table > tbody { display: grid; grid-row-gap: 5px; grid-template-columns: 1fr auto 1fr; }
#app > span.small { grid-area: links; position: fixed; z-index: 1; left: 5px; top: 5px; }
#tr_chat { grid-area: chat; }
#tr_actions { grid-area: actions; overflow: auto; background: none !important; }
#tr_tos { grid-area: tos; background: none !important; }
#tr_sky { display: none; }
#tr_field { grid-area: field; background: black; }
#tr_mouth { grid-area: mouth; overflow: auto; background: none !important; }
#tr_actions > td, #tr_mouth > td, #info_main > tbody > tr > td { background-color: #ffdead; }
#tr_info { grid-area: info; max-height: 1000px; overflow-x: hidden; overflow-y: auto; }
#info_main { background: none !important; }
#info_main > tbody > tr > td, #tr_mouth > td > *, #tr_actions > td > *, #tr_chat { padding: 5px; }
#block_mess { margin: 0; padding: 8px 0; }
.infos { width: 100%; max-width: max-content; }
#itemList { width: 400px; max-height: 75px; overflow-y: auto; }
#thdey > br { display: none; }
#chat_form { display: grid; grid-row-gap: 5px; margin: 10px 5px 5px 5px; }
.chat_text { width: unset !important; }
#chat_msg { width: auto !important; height: 350px; padding: 2px; }
#volume + b { display: block; font-size: 0.75em; }
#app > p:not(#error) { visibility: hidden; }
#black { visibility: visible; color: white; }
#black::before { content: 'ТБ: '; }
.small { padding: 0 5px; background-color: #ffdead; font-size: 15px; }
#history_block > div { visibility: hidden; }
#location { visibility: visible; position: fixed; right: 15px; top: 5px; z-index: 5; padding: 0 5px; font-weight: bold; font-size: 1.5em; background-color: #ffdead; }
h2 { font-size: 1.2em; }
`;
    const splitInfo = globals.compactSplitInfo;
    const sticky = globals.compactSplitInfoHeaders;
    if (isDesktop) {
      css += `
      #chat_form { grid-template-columns: auto auto; }
      #info_main > tbody > tr {
        display: grid;
        max-height: 1000px;
        grid-template-areas: 'parameter' 'history' 'family';
        grid-template-rows: ${splitInfo ? '252px 1fr 1fr' : 'auto auto auto'};
        grid-row-gap: 5px;
      }
      #family.infos, #history.infos, #parameter.infos {
        overflow: auto;
      }
      #family.infos { grid-area: family; }
      #history.infos { grid-area: history; }
      #parameter.infos { grid-area: parameter; }
    `;
    }
    else {
      css += `
      #chat_form { grid-template-columns: auto auto auto; }
      #info_main > tbody {
        display: grid;
        max-height: 1000px;
        grid-template-areas: 'parameter' 'history' 'family';
        grid-template-rows: ${splitInfo ? '252px 1fr 1fr' : 'auto auto auto'};
        grid-row-gap: 5px;
      }
      #info_main > tbody > tr:nth-child(1) {
        grid-area: parameter;
        overflow: auto;
      }
      #info_main > tbody > tr:nth-child(2) {
        grid-area: history;
        overflow: auto;
      }
      #info_main > tbody > tr:nth-child(3) {
        grid-area: family;
        overflow: auto;
      }
    `;
    }
    if (splitInfo) {
      css += `
      #info_main > tbody > tr {
        grid-template-rows: 252px 1fr 1fr;
      }
    `;
    }
    else {
      css += `
      #info_main > tbody {
        grid-template-rows: auto auto auto;
      }
    `;
    }
    const hideHeaders = (globals.compactHideHeaders);
    if (hideHeaders) {
      css += `
#info_main h2 { visibility: hidden; }
#parameters-alert { visibility: visible; }
`;
    }
    else if (splitInfo && sticky) {
      css += `#info_main h2 { position: sticky; }`;
    }
    const swap = (globals.compactSwapSides);
    const chatup = (globals.compactChatOnTop);
    if (swap && chatup) {
      css += `#main_table > tbody { grid-template-areas: 'info field tos' 'info field chat' 'info field actions' 'info field mouth'; grid-template-rows: 25px 425px 267.5px 267.5px; }`;
    }
    else if (swap && !chatup) {
      css += `#main_table > tbody { grid-template-areas: 'info field tos' 'info field actions' 'info field mouth' 'info field chat'; grid-template-rows: 25px 267.5px 267.5px 425px; }`;
    }
    else if (!swap && chatup) {
      css += `#main_table > tbody { grid-template-areas: 'tos field info' 'chat field info' 'actions field info' 'mouth field info'; grid-template-rows: 25px 425px 267.5px 267.5px; }`;
    }
    else {
      css += `#main_table > tbody { grid-template-areas: 'tos field info' 'actions field info' 'mouth field info' 'chat field info'; grid-template-rows: 25px 267.5px 267.5px 425px; }`;
    }
    if (globals.compactRadiusEdges) {
      css += `.small, #tos, #tr_chat, #tr_actions > td, #tr_mouth > td, #location, #tr_field, #parameter, #cages_div { border-radius: 15px; }`;
      if ($('#app').data('mobile') === 1) css += `#info_main > tbody > tr { border-radius: 15px; }`;
      else css += `#family, #history{ border-radius: 15px; }`;
    }
  }
  const styleTemplate = `
#error { background-color: var(--error-bg) !important; color: var(--error-color) !important; }
#main_table { background: var(--main-bg) }
#tr_field { background: black !important; }
hr { border: none; border-bottom: 1px solid var(--hr-color) !important; }
body { background-color: var(--body-bg) !important; color: var(--text-color) !important; }
a, a:hover { color: var(--a-color); }
#tr_chat, #tr_actions, #tr_mouth, #info_main { background: none !important; }
.small, #app > p:not(#error), #info_main > tbody > tr > td, #history_block > div, #tr_mouth > td, #tr_actions > td, #location, #black, #tr_chat { background-color: var(--table-bg) !important; color: var(--text-color) !important; border: none !important; }
.myname { background: var(--myname-bg) !important; color: var(--myname-color) !important; }
input, select { background-color: var(--input-bg) !important; color: var(--input-color) !important; border: 1px solid var(--input-border-color) !important; }
.ui-slider { background: var(--input-bg) !important; border: 1px solid var(--input-border-color) !important; }
.ui-slider .ui-slider-handle { background: var(--handle-bg) !important; border: 1px solid var(--input-border-color) !important; }
.hotkey { background: white !important; }
.move_name, #fightLog, #timer, .hotkey { color: #000 !important; }
`;
  var theme = 0
  if (globals.cwmodTheme === 0) {
    theme = "default"
  }
  else if (globals.cwmodTheme === 1) {
    theme = "dark_grey"
  }
  else if (globals.cwmodTheme === 2) {
    theme = "black_glass"
  }
  const themes = {
    'dark_grey': `:root { --table-bg: #222; --error-bg: #3c1e1e; --error-color: #ccc; --main-bg: #222; --hr-color: #282828; --body-bg: #191919; --text-color: #b2b2b2; --a-color: #b2b2b2; --myname-color: black; --myname-bg: #a73; --input-bg: #111; --handle-bg: #383838; --input-color: #aaa; --input-border-color: #282828; }`
    , 'black_glass': `:root { --table-bg: #000d; --error-bg: #3c1e1e; --error-color: #ccc; --main-bg: none; --hr-color: #000; --body-bg: #4d4e4f; --text-color: #b2b2b2; --a-color: #b2b2b2; --myname-color: black; --myname-bg: #a73; --input-bg: #111; --handle-bg: #333; --input-color: #ccc; --input-border-color: #000; }`
  };
  if (theme !== 'default') {
    css += themes[theme] + styleTemplate;
  }
  addCSS(css);
  if (globals.cw3Bkg !== 0) {
    var bgSize = 0;
    if (globals.cw3BkgSize === 0) {
      bgSize = "auto"
    }
    else if (globals.cw3BkgSize === 1) {
      bgSize = "cover"
    }
    var bgPos = 0;
    if (globals.cw3BkgPos === 0) {
      bgPos = "top left"
    }
    else if (globals.cw3BkgPos === 1) {
      bgPos = "top center"
    }
    else if (globals.cw3BkgPos === 2) {
      bgPos = "top right"
    }
    else if (globals.cw3BkgPos === 3) {
      bgPos = "center left"
    }
    else if (globals.cw3BkgPos === 4) {
      bgPos = "center"
    }
    else if (globals.cw3BkgPos === 5) {
      bgPos = "center right"
    }
    else if (globals.cw3BkgPos === 6) {
      bgPos = "bottom left"
    }
    else if (globals.cw3BkgPos === 7) {
      bgPos = "bottom center"
    }
    else if (globals.cw3BkgPos === 8) {
      bgPos = "bottom right"
    }
    addCSS(`body { background-size: ${bgSize}; background-position: ${bgPos}; }`);
    if (globals.cw3Bkg === 1) {
      body.css('background-image', $('#cages_div').css('background-image'));
      const cagesDivObserver = new MutationObserver(function(mutations) {
        mutations.forEach(function() {
          body.css('background-image', $('#cages_div').css('background-image'));
        });
      });
      cagesDivObserver.observe($('#cages_div')[0], {
        attributes: true
      });
      const pageObserver = new MutationObserver(function(mutations) {
        mutations.forEach(function() {
          if (body.text() === 'Вы открыли новую вкладку с Игровой, поэтому старая (эта) больше не работает.') {
            body.css('background-image', 'none');
            cagesDivObserver.disconnect();
            pageObserver.disconnect();
          }
        });
      });
      pageObserver.observe(document.body, {
        childList: true
      });
    }
    else {
      addCSS(`body { background-image: url(${globals.cw3BkgImg}); }`);
    }
  }
  if (globals.cw3SnowWeather) {
    const snowSVG = [
      `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
  <svg
 enable-background="new 0 0 100 100"
 id="Layer_1"
 version="1.1"
 viewBox="0 0 32 32"
 xml:space="preserve"
 sodipodi:docname="snowflake-1.svg"
 inkscape:version="1.3.2 (091e20e, 2023-11-25, custom)"
 width="32"
 height="32"
 xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape"
 xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd"
 xmlns="http://www.w3.org/2000/svg"
 xmlns:svg="http://www.w3.org/2000/svg"><defs
   id="defs9" /><sodipodi:namedview
   id="namedview9"
   pagecolor="#ffffff"
   bordercolor="#000000"
   borderopacity="0.25"
   inkscape:showpageshadow="2"
   inkscape:pageopacity="0.0"
   inkscape:pagecheckerboard="0"
   inkscape:deskcolor="#d1d1d1"
   inkscape:zoom="7.49"
   inkscape:cx="49.933244"
   inkscape:cy="28.638184"
   inkscape:window-width="1680"
   inkscape:window-height="987"
   inkscape:window-x="1672"
   inkscape:window-y="-8"
   inkscape:window-maximized="1"
   inkscape:current-layer="Layer_1" /><g
   id="g9"
   style="fill:#d8d7dc;fill-opacity:1;stroke:none;stroke-opacity:1"
   transform="matrix(0.27175242,0,0,0.27175242,2.412379,2.41243)"><path
     d="m 50,14 c 1.336,0 2.591,-0.521 3.536,-1.465 1.949,-1.949 1.949,-5.122 0,-7.071 -1.949,-1.949 -5.121,-1.948 -7.071,0 -1.949,1.949 -1.949,5.122 0,7.071 C 47.409,13.48 48.665,14 50,14 Z M 47.878,6.878 C 48.463,6.294 49.232,6.001 50,6.001 c 0.769,0 1.537,0.293 2.122,0.877 1.169,1.17 1.169,3.073 0,4.243 -1.134,1.133 -3.109,1.133 -4.243,0 -1.17,-1.17 -1.17,-3.073 -10e-4,-4.243 z"
     id="path1"
     style="fill:#d8d7dc;fill-opacity:1;stroke:none;stroke-opacity:1" /><path
     d="m 46.464,87.464 c -1.949,1.949 -1.949,5.122 0,7.071 0.975,0.975 2.255,1.462 3.536,1.462 1.281,0 2.561,-0.487 3.536,-1.462 1.949,-1.949 1.949,-5.122 0,-7.071 -1.95,-1.949 -5.122,-1.949 -7.072,0 z m 5.658,5.657 c -1.17,1.17 -3.073,1.17 -4.243,0 -1.169,-1.17 -1.169,-3.073 0,-4.243 1.17,-1.169 3.073,-1.168 4.243,0 1.169,1.17 1.169,3.073 0,4.243 z"
     id="path2"
     style="fill:#d8d7dc;fill-opacity:1;stroke:none;stroke-opacity:1" /><path
     d="m 94.536,46.464 c -1.949,-1.949 -5.121,-1.948 -7.071,0 -1.949,1.949 -1.949,5.122 0,7.071 C 88.409,54.48 89.665,55 91,55 c 1.336,0 2.591,-0.521 3.536,-1.465 1.949,-1.949 1.949,-5.122 0,-7.071 z m -1.414,5.657 c -1.134,1.133 -3.109,1.133 -4.243,0 -1.169,-1.17 -1.169,-3.073 0,-4.243 0.585,-0.584 1.354,-0.877 2.122,-0.877 0.768,0 1.536,0.292 2.121,0.877 1.169,1.17 1.169,3.073 0,4.243 z"
     id="path3"
     style="fill:#d8d7dc;fill-opacity:1;stroke:none;stroke-opacity:1" /><path
     d="m 85.207,42.53 c -0.391,-0.391 -1.023,-0.391 -1.414,0 L 77.322,49 h -8.395 l 9.972,-9.973 c 0.093,-0.092 0.166,-0.203 0.217,-0.326 0.101,-0.244 0.101,-0.52 0,-0.764 -0.101,-0.245 -0.296,-0.44 -0.541,-0.541 -0.122,-0.051 -0.252,-0.077 -0.382,-0.077 H 64.094 l 5.932,-5.933 h 9.151 c 0.552,0 1,-0.447 1,-1 0,-0.553 -0.448,-1 -1,-1 h -8.565 v -8.564 c 0,-0.553 -0.448,-1 -1,-1 -0.552,0 -1,0.447 -1,1 v 9.15 l -5.93,5.93 V 21.8 c 0,-0.13 -0.027,-0.26 -0.077,-0.382 -0.101,-0.245 -0.296,-0.44 -0.541,-0.541 -0.244,-0.101 -0.52,-0.101 -0.764,0 -0.123,0.051 -0.233,0.124 -0.326,0.217 L 51,31.069 v -8.391 l 6.471,-6.471 c 0.391,-0.391 0.391,-1.023 0,-1.414 -0.391,-0.391 -1.023,-0.391 -1.414,0 L 50,20.85 43.943,14.793 c -0.391,-0.391 -1.023,-0.391 -1.414,0 -0.391,0.391 -0.391,1.023 0,1.414 L 49,22.678 v 8.385 l -9.97,-9.969 c -0.092,-0.093 -0.203,-0.166 -0.326,-0.217 -0.244,-0.101 -0.52,-0.101 -0.764,0 -0.245,0.101 -0.44,0.296 -0.541,0.541 -0.051,0.122 -0.077,0.252 -0.077,0.382 v 14.108 l -5.935,-5.935 v -9.15 c 0,-0.553 -0.448,-1 -1,-1 -0.552,0 -1,0.447 -1,1 v 8.564 h -8.565 c -0.552,0 -1,0.447 -1,1 0,0.553 0.448,1 1,1 h 9.151 l 5.932,5.933 H 21.803 c -0.13,0 -0.26,0.026 -0.382,0.077 -0.245,0.101 -0.44,0.296 -0.541,0.541 -0.101,0.244 -0.101,0.52 0,0.764 0.051,0.123 0.124,0.233 0.217,0.326 L 31.069,49 h -8.391 l -6.471,-6.471 c -0.391,-0.391 -1.023,-0.391 -1.414,0 -0.391,0.391 -0.391,1.023 0,1.414 L 20.85,50 14.793,56.057 c -0.391,0.391 -0.391,1.023 0,1.414 0.195,0.195 0.451,0.293 0.707,0.293 0.256,0 0.512,-0.098 0.707,-0.293 L 22.678,51 h 8.391 l -9.972,9.972 c -0.093,0.092 -0.166,0.203 -0.217,0.326 -0.101,0.244 -0.101,0.52 0,0.764 0.101,0.245 0.296,0.44 0.541,0.541 0.122,0.051 0.252,0.077 0.382,0.077 h 14.103 l -5.933,5.933 h -9.151 c -0.552,0 -1,0.447 -1,1 0,0.553 0.448,1 1,1 h 8.565 v 8.565 c 0,0.553 0.448,1 1,1 0.552,0 1,-0.447 1,-1 v -9.152 l 5.935,-5.935 v 14.109 0 c 0,0.13 0.027,0.26 0.077,0.383 0.101,0.244 0.296,0.439 0.541,0.54 0.12,0.05 0.247,0.075 0.375,0.076 0.002,0 0.004,0.001 0.007,0.001 0,0 0,0 0,0 0.13,0 0.26,-0.027 0.383,-0.077 0.12,-0.05 0.229,-0.122 0.32,-0.213 0.001,-10e-4 0.003,-0.002 0.005,-0.003 L 49,68.929 v 8.394 l -6.471,6.471 c -0.391,0.391 -0.391,1.023 0,1.414 0.391,0.391 1.023,0.391 1.414,0 L 50,79.151 l 6.057,6.057 c 0.195,0.195 0.451,0.293 0.707,0.293 0.256,0 0.512,-0.098 0.707,-0.293 0.391,-0.391 0.391,-1.023 0,-1.414 L 51,77.323 v -8.4 l 9.975,9.984 c 10e-4,0.001 0.003,0.002 0.004,0.003 0.091,0.091 0.2,0.163 0.321,0.213 0.122,0.051 0.252,0.077 0.382,0.077 0.13,0 0.26,-0.027 0.382,-0.077 0.244,-0.101 0.439,-0.296 0.541,-0.54 0.051,-0.122 0.077,-0.252 0.077,-0.383 v 0 -14.103 l 5.93,5.93 v 9.151 c 0,0.553 0.448,1 1,1 0.552,0 1,-0.447 1,-1 v -8.565 h 8.565 c 0.552,0 1,-0.447 1,-1 0,-0.553 -0.448,-1 -1,-1 H 70.026 L 64.093,62.68 h 14.109 c 0.13,0 0.26,-0.027 0.382,-0.077 0.121,-0.05 0.229,-0.122 0.321,-0.213 0.001,-10e-4 0.003,-0.002 0.004,-0.003 0.007,-0.007 0.009,-0.016 0.016,-0.024 0.083,-0.088 0.153,-0.188 0.2,-0.301 0.05,-0.122 0.077,-0.251 0.077,-0.381 0,0 0,-10e-4 0,-10e-4 v 0 c 0,-0.13 -0.027,-0.26 -0.077,-0.383 -0.051,-0.123 -0.124,-0.233 -0.217,-0.325 L 68.928,51 h 8.394 l 6.471,6.471 c 0.195,0.195 0.451,0.293 0.707,0.293 0.256,0 0.512,-0.098 0.707,-0.293 0.391,-0.391 0.391,-1.023 0,-1.414 L 79.15,50 85.207,43.943 c 0.391,-0.39 0.391,-1.023 0,-1.413 z M 75.779,39.32 66.099,49 H 52.414 l 9.68,-9.681 H 75.779 Z M 60.683,24.214 V 37.903 L 51,47.586 V 33.897 Z m -21.36,0 L 49,33.891 V 47.586 L 39.323,37.908 Z M 24.217,39.32 H 37.906 L 47.586,49 H 33.897 Z m 0,21.36 9.68,-9.68 h 13.689 l -9.68,9.68 z M 39.323,75.784 V 62.091 L 49,52.414 v 13.684 z m 21.36,0 L 51,66.093 V 52.414 l 9.683,9.682 z M 75.787,60.68 H 62.094 L 52.414,51 h 13.685 z"
     id="path4"
     style="fill:#d8d7dc;fill-opacity:1;stroke:none;stroke-opacity:1" /><path
     d="m 5.464,46.464 c -1.949,1.949 -1.949,5.122 0,7.071 C 6.409,54.48 7.665,55 9,55 c 1.336,0 2.591,-0.521 3.536,-1.465 1.949,-1.949 1.949,-5.122 0,-7.071 -1.949,-1.949 -5.121,-1.949 -7.072,0 z m 5.658,5.657 c -1.134,1.133 -3.109,1.133 -4.243,0 -1.169,-1.17 -1.169,-3.073 0,-4.243 1.169,-1.168 3.072,-1.171 4.243,0 1.169,1.17 1.169,3.073 0,4.243 z"
     id="path5"
     style="fill:#d8d7dc;fill-opacity:1;stroke:none;stroke-opacity:1" /><path
     d="m 78.991,26.008 c 2.757,0 5,-2.243 5,-5 0,-2.757 -2.243,-5 -5,-5 -2.757,0 -5,2.243 -5,5 0,2.757 2.243,5 5,5 z m 0,-8 c 1.654,0 3,1.346 3,3 0,1.654 -1.346,3 -3,3 -1.654,0 -3,-1.346 -3,-3 0,-1.654 1.346,-3 3,-3 z"
     id="path6"
     style="fill:#d8d7dc;fill-opacity:1;stroke:none;stroke-opacity:1" /><path
     d="m 21.009,73.992 c -2.757,0 -5,2.243 -5,5 0,2.757 2.243,5 5,5 2.757,0 5,-2.243 5,-5 0,-2.757 -2.243,-5 -5,-5 z m 0,8 c -1.654,0 -3,-1.346 -3,-3 0,-1.654 1.346,-3 3,-3 1.654,0 3,1.346 3,3 0,1.654 -1.346,3 -3,3 z"
     id="path7"
     style="fill:#d8d7dc;fill-opacity:1;stroke:none;stroke-opacity:1" /><path
     d="m 78.991,73.992 c -2.757,0 -5,2.243 -5,5 0,2.757 2.243,5 5,5 2.757,0 5,-2.243 5,-5 0,-2.757 -2.243,-5 -5,-5 z m 0,8 c -1.654,0 -3,-1.346 -3,-3 0,-1.654 1.346,-3 3,-3 1.654,0 3,1.346 3,3 0,1.654 -1.345,3 -3,3 z"
     id="path8"
     style="fill:#d8d7dc;fill-opacity:1;stroke:none;stroke-opacity:1" /><path
     d="m 21.009,26.008 c 2.757,0 5,-2.243 5,-5 0,-2.757 -2.243,-5 -5,-5 -2.757,0 -5,2.243 -5,5 0,2.757 2.243,5 5,5 z m 0,-8 c 1.654,0 3,1.346 3,3 0,1.654 -1.346,3 -3,3 -1.654,0 -3,-1.346 -3,-3 0,-1.654 1.345,-3 3,-3 z"
     id="path9"
     style="fill:#d8d7dc;fill-opacity:1;stroke:none;stroke-opacity:1" /></g></svg>`
      , `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<svg
 enable-background="new 0 0 100 100"
 id="Layer_1"
 version="1.1"
 viewBox="0 0 32 32"
 xml:space="preserve"
 sodipodi:docname="snowflake-2.svg"
 inkscape:version="1.3.2 (091e20e, 2023-11-25, custom)"
 width="32"
 height="32"
 xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape"
 xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd"
 xmlns="http://www.w3.org/2000/svg"
 xmlns:svg="http://www.w3.org/2000/svg"><defs
   id="defs1" /><sodipodi:namedview
   id="namedview1"
   pagecolor="#ffffff"
   bordercolor="#000000"
   borderopacity="0.25"
   inkscape:showpageshadow="2"
   inkscape:pageopacity="0.0"
   inkscape:pagecheckerboard="0"
   inkscape:deskcolor="#d1d1d1"
   inkscape:zoom="6.25"
   inkscape:cx="50"
   inkscape:cy="50"
   inkscape:window-width="1680"
   inkscape:window-height="987"
   inkscape:window-x="1672"
   inkscape:window-y="-8"
   inkscape:window-maximized="1"
   inkscape:current-layer="Layer_1" /><path
   d="m 28.228027,15.728081 h -3.274419 l 2.081793,-2.081793 c 0.106319,-0.106319 0.106319,-0.27817 0,-0.38449 -0.106319,-0.106319 -0.278171,-0.106319 -0.38449,0 l -2.466282,2.466283 h -3.038123 l 2.711551,-2.711823 c 0.02529,-0.02502 0.04514,-0.0552 0.05901,-0.08864 0.02746,-0.06635 0.02746,-0.141397 0,-0.207744 -0.02746,-0.06662 -0.08049,-0.119644 -0.147107,-0.147107 -0.03317,-0.01387 -0.06852,-0.02094 -0.103872,-0.02094 h -3.83375 l 2.148412,-2.148412 h 3.486241 c 0.150098,0 0.271916,-0.121546 0.271916,-0.271916 0,-0.1503705 -0.121818,-0.2719175 -0.271916,-0.2719175 h -2.942408 l 2.319719,-2.319719 c 0.106319,-0.1063194 0.106319,-0.2781706 0,-0.3844899 -0.106319,-0.1063194 -0.278171,-0.1063194 -0.38449,0 L 22.139273,9.4759045 V 6.532137 c 0,-0.1503698 -0.121819,-0.2719164 -0.271916,-0.2719164 -0.150098,0 -0.271917,0.1215466 -0.271917,0.2719164 v 3.487601 l -2.147052,2.147053 V 8.3319521 c 0,-0.035349 -0.0073,-0.070698 -0.02094,-0.1038721 -0.02746,-0.066619 -0.08049,-0.1196432 -0.147107,-0.1471068 -0.06635,-0.027463 -0.141396,-0.027463 -0.207744,0 -0.03345,0.013868 -0.06336,0.033718 -0.08864,0.059006 L 16.271859,10.852346 V 7.8136793 l 2.465467,-2.4654666 c 0.106319,-0.1063193 0.106319,-0.2781705 0,-0.3844899 -0.106319,-0.1063193 -0.27817,-0.1063193 -0.38449,0 L 16.271859,7.0446996 V 3.771913 c 0,-0.1503698 -0.121818,-0.2719165 -0.271916,-0.2719165 -0.150098,0 -0.271916,0.1215467 -0.271916,0.2719165 V 7.0446996 L 13.64705,4.9637228 c -0.10632,-0.1063193 -0.278171,-0.1063193 -0.38449,0 -0.106319,0.1063194 -0.106319,0.2781706 0,0.3844899 l 2.465467,2.4654666 V 10.850715 L 13.017019,8.1399791 c -0.02502,-0.025288 -0.0552,-0.045138 -0.08864,-0.059006 -0.06635,-0.027463 -0.141397,-0.027463 -0.207745,0 -0.06662,0.027464 -0.119643,0.080487 -0.147106,0.1471068 -0.01387,0.033174 -0.02094,0.068523 -0.02094,0.1038721 V 12.16815 L 10.403902,10.019466 V 6.532137 c 0,-0.1503698 -0.121818,-0.2719164 -0.271916,-0.2719164 -0.150098,0 -0.271917,0.1215466 -0.271917,0.2719164 V 9.4759045 L 7.539534,7.1553696 c -0.1063193,-0.1063194 -0.2781705,-0.1063194 -0.3844898,0 -0.1063194,0.1063193 -0.1063194,0.2781705 0,0.3844899 L 9.474764,9.8595785 H 6.5326274 c -0.1500979,0 -0.2719165,0.121547 -0.2719165,0.2719175 0,0.15037 0.1218186,0.271916 0.2719165,0.271916 h 3.4859686 l 2.148412,2.148412 H 8.3324425 c -0.035349,0 -0.070698,0.0071 -0.1038721,0.02094 -0.06662,0.02746 -0.1196433,0.08049 -0.1471068,0.147107 -0.027464,0.06635 -0.027464,0.141396 0,0.207744 0.013868,0.03345 0.033718,0.06336 0.059006,0.08864 l 2.7118224,2.711823 H 7.8149854 l -2.4662823,-2.46628 c -0.1063194,-0.106319 -0.2781706,-0.106319 -0.3844899,0 -0.1063194,0.10632 -0.1063194,0.278171 0,0.38449 l 2.0817924,2.081793 H 3.7718595 c -0.1500979,0 -0.2719165,0.121545 -0.2719165,0.271916 0,0.150369 0.1218186,0.271916 0.2719165,0.271916 h 3.2725147 l -2.080161,2.07989 c -0.1063194,0.106318 -0.1063194,0.278169 0,0.384488 0.053024,0.05302 0.1226343,0.07967 0.1922449,0.07967 0.069611,0 0.1392212,-0.02665 0.192245,-0.07967 L 7.8133539,16.271912 H 10.85202 l -2.7115506,2.711551 c -0.025288,0.02502 -0.045138,0.0552 -0.059006,0.08865 -0.027464,0.06635 -0.027464,0.141398 0,0.207745 0.027463,0.06662 0.080487,0.119644 0.1471068,0.147106 0.033174,0.01387 0.068523,0.02094 0.1038721,0.02094 H 12.16728 l -2.147052,2.147053 H 6.5328993 c -0.1500979,0 -0.2719165,0.121547 -0.2719165,0.271916 0,0.15037 0.1218186,0.271917 0.2719165,0.271917 H 9.476395 l -2.3210789,2.321079 c -0.1063194,0.106319 -0.1063194,0.278171 0,0.38449 0.053024,0.05302 0.1226343,0.07967 0.1922449,0.07967 0.069611,0 0.1392212,-0.02665 0.192245,-0.07967 l 2.320535,-2.320535 v 2.942136 c 0,0.15037 0.121819,0.271917 0.271917,0.271917 0.150097,0 0.271916,-0.121547 0.271916,-0.271917 v -3.485969 l 2.148684,-2.148684 v 3.836741 0 c 0,0.03535 0.0073,0.0707 0.02094,0.104144 0.02746,0.06635 0.08049,0.119372 0.147106,0.146835 0.03263,0.0136 0.06716,0.02039 0.101969,0.02067 5.44e-4,0 0.0011,2.72e-4 0.0019,2.72e-4 0,0 0,0 0,0 0.03535,0 0.0707,-0.0073 0.104144,-0.02094 0.03263,-0.0136 0.06227,-0.03317 0.08701,-0.05792 2.72e-4,-2.72e-4 8.15e-4,-5.44e-4 0.0014,-8.16e-4 l 2.710736,-2.713182 v 3.037851 l -2.465467,2.465194 c -0.106319,0.10632 -0.106319,0.278171 0,0.38449 0.106319,0.106319 0.27817,0.106319 0.38449,0 l 2.080977,-2.080705 v 3.274146 c 0,0.15037 0.121818,0.271917 0.271916,0.271917 0.150098,0 0.271916,-0.121547 0.271916,-0.271917 v -3.274146 l 2.080977,2.080705 c 0.05302,0.05302 0.122635,0.07967 0.192245,0.07967 0.06961,0 0.139221,-0.02665 0.192245,-0.07967 0.106319,-0.106319 0.106319,-0.27817 0,-0.38449 l -2.465467,-2.465194 v -3.039483 l 2.712367,2.714814 c 2.72e-4,2.72e-4 8.16e-4,5.44e-4 0.0011,8.16e-4 0.02474,0.02474 0.05438,0.04432 0.08729,0.05792 0.03317,0.01387 0.06852,0.02094 0.103872,0.02094 0.03535,0 0.0707,-0.0073 0.103872,-0.02094 0.06635,-0.02746 0.119372,-0.08049 0.147107,-0.146835 0.01387,-0.03317 0.02094,-0.06852 0.02094,-0.104144 v 0 -3.834839 l 2.147052,2.147053 v 3.48597 c 0,0.150369 0.121819,0.271916 0.271917,0.271916 0.150097,0 0.271916,-0.121546 0.271916,-0.271916 v -2.942137 l 2.320535,2.320535 c 0.05302,0.05302 0.122634,0.07967 0.192245,0.07967 0.06961,0 0.139221,-0.02665 0.192245,-0.07967 0.106319,-0.106319 0.106319,-0.278171 0,-0.38449 l -2.321079,-2.321079 h 2.943768 c 0.150098,0 0.271916,-0.121547 0.271916,-0.271916 0,-0.15037 -0.121818,-0.271917 -0.271916,-0.271917 h -3.487601 l -2.147052,-2.147052 h 3.836197 c 0.03535,0 0.0707,-0.0073 0.103872,-0.02094 0.0329,-0.0136 0.06227,-0.03317 0.08729,-0.05792 2.72e-4,-2.72e-4 8.16e-4,-5.45e-4 0.0011,-8.16e-4 0.0019,-0.0019 0.0024,-0.0043 0.0044,-0.0065 0.02257,-0.02393 0.0416,-0.05112 0.05438,-0.08185 0.0136,-0.03317 0.02094,-0.06825 0.02094,-0.1036 0,0 0,-2.72e-4 0,-2.72e-4 v 0 c 0,-0.03535 -0.0073,-0.0707 -0.02094,-0.104144 -0.01387,-0.03345 -0.03372,-0.06336 -0.05901,-0.08837 l -2.713726,-2.711823 h 3.039482 l 2.464651,2.464379 c 0.05302,0.05302 0.122634,0.07967 0.192245,0.07967 0.06961,0 0.139221,-0.02665 0.192245,-0.07967 0.106319,-0.106319 0.106319,-0.27817 0,-0.384489 l -2.080161,-2.07989 h 3.272787 c 0.150097,0 0.271916,-0.121546 0.271916,-0.271916 0,-0.15037 -0.121819,-0.271916 -0.271916,-0.271916 z m -5.218349,-2.632152 -2.632424,2.632152 h -1.400098 c -0.05601,-0.620786 -0.301555,-1.187188 -0.680335,-1.640744 l 0.99168,-0.99168 h 3.721177 z m -6.99913,5.351043 c -1.674734,-0.06662 -2.439363,-1.309006 -2.44317,-2.438818 0,-0.0027 0.0016,-0.0052 0.0016,-0.0079 0,-0.003 -0.0016,-0.0054 -0.0016,-0.0084 0.0035,-1.129541 0.767349,-2.3722 2.429846,-2.439363 8.16e-4,-2.72e-4 0.0016,2.72e-4 0.0027,2.72e-4 0.0011,0 0.0022,-5.44e-4 0.0033,-5.44e-4 1.347618,0.0019 2.443985,1.098814 2.443985,2.447248 0,1.34925 -1.097998,2.447248 -2.436643,2.44752 z m 2.894007,-9.4586135 v 3.7222645 l -0.992767,0.992767 c -0.452741,-0.376877 -1.018599,-0.622961 -1.6402,-0.680607 v -1.401458 z m -5.807864,0 2.631336,2.6313365 v 1.411246 c -0.68523,0.0726 -1.233142,0.315423 -1.651349,0.661301 L 13.096691,12.712255 Z M 8.9888488,13.095928 h 3.7222642 l 0.981891,0.98189 c -0.391016,0.480478 -0.60719,1.068088 -0.657766,1.650533 H 11.621 Z m 2.719e-4,5.808136 2.6321513,-2.632152 h 1.41451 c 0.05085,0.58163 0.267293,1.168697 0.658853,1.648902 l -0.98325,0.98325 z m 4.1075703,4.107027 v -3.723352 l 0.98189,-0.98189 c 0.417936,0.344518 0.96476,0.587339 1.649446,0.6613 v 1.410431 z m 5.807864,0 -2.632696,-2.635143 v -1.399282 c 0.620514,-0.05629 1.186916,-0.301828 1.640473,-0.679791 l 0.992495,0.992495 v 3.721721 z m 4.107298,-4.107027 h -3.723352 l -0.991952,-0.991951 c 0.378236,-0.453285 0.624049,-1.019687 0.680607,-1.640201 h 1.40037 z"
   id="path1"
   style="fill:#d8d7dc;fill-opacity:1;stroke-width:0.271916" /></svg>`
      , `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<svg
 enable-background="new 0 0 100 100"
 id="Layer_1"
 version="1.1"
 viewBox="0 0 32 32"
 xml:space="preserve"
 sodipodi:docname="snowflake-3.svg"
 inkscape:version="1.3.2 (091e20e, 2023-11-25, custom)"
 width="32"
 height="32"
 xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape"
 xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd"
 xmlns="http://www.w3.org/2000/svg"
 xmlns:svg="http://www.w3.org/2000/svg"><defs
   id="defs9" /><sodipodi:namedview
   id="namedview9"
   pagecolor="#ffffff"
   bordercolor="#000000"
   borderopacity="0.25"
   inkscape:showpageshadow="2"
   inkscape:pageopacity="0.0"
   inkscape:pagecheckerboard="0"
   inkscape:deskcolor="#d1d1d1"
   inkscape:zoom="6.25"
   inkscape:cx="50"
   inkscape:cy="50"
   inkscape:window-width="1680"
   inkscape:window-height="987"
   inkscape:window-x="1672"
   inkscape:window-y="-8"
   inkscape:window-maximized="1"
   inkscape:current-layer="Layer_1" /><g
   id="g9"
   style="fill:#d8d7dc;fill-opacity:1"
   transform="matrix(0.27173913,0,0,0.27173913,2.4130435,2.4130435)"><path
     d="m 78.991,16.009 c -2.757,0 -5,2.243 -5,5 0,2.757 2.243,5 5,5 2.757,0 5,-2.243 5,-5 0,-2.757 -2.243,-5 -5,-5 z m 0,8 c -1.654,0 -3,-1.346 -3,-3 0,-1.654 1.346,-3 3,-3 1.654,0 3,1.346 3,3 0,1.654 -1.345,3 -3,3 z"
     id="path1"
     style="fill:#d8d7dc;fill-opacity:1" /><path
     d="m 50,14 c 2.757,0 5,-2.243 5,-5 0,-2.757 -2.243,-5 -5,-5 -2.757,0 -5,2.243 -5,5 0,2.757 2.243,5 5,5 z m 0,-8 c 1.654,0 3,1.346 3,3 0,1.654 -1.346,3 -3,3 -1.654,0 -3,-1.346 -3,-3 0,-1.654 1.346,-3 3,-3 z"
     id="path2"
     style="fill:#d8d7dc;fill-opacity:1" /><path
     d="m 21.008,73.991 c -2.757,0 -5,2.243 -5,5 0,2.757 2.243,5 5,5 2.757,0 5,-2.243 5,-5 0,-2.757 -2.243,-5 -5,-5 z m 0,8 c -1.654,0 -3,-1.346 -3,-3 0,-1.654 1.346,-3 3,-3 1.654,0 3,1.346 3,3 0,1.654 -1.346,3 -3,3 z"
     id="path3"
     style="fill:#d8d7dc;fill-opacity:1" /><path
     d="m 78.991,73.991 c -2.757,0 -5,2.243 -5,5 0,2.757 2.243,5 5,5 2.757,0 5,-2.243 5,-5 0,-2.757 -2.243,-5 -5,-5 z m 0,8 c -1.654,0 -3,-1.346 -3,-3 0,-1.654 1.346,-3 3,-3 1.654,0 3,1.346 3,3 0,1.654 -1.345,3 -3,3 z"
     id="path4"
     style="fill:#d8d7dc;fill-opacity:1" /><path
     d="m 80.178,69.613 c 0,-0.553 -0.447,-1 -1,-1 h -9.151 l -2.76,-2.76 V 57.147 L 73.414,51 h 6.172 l -5.056,5.057 c -0.391,0.391 -0.391,1.023 0,1.414 0.195,0.195 0.451,0.293 0.707,0.293 0.256,0 0.512,-0.098 0.707,-0.293 l 6.764,-6.764 c 0.083,-0.083 0.139,-0.181 0.187,-0.281 0.007,-0.014 0.019,-0.023 0.025,-0.038 0.105,-0.248 0.105,-0.528 0,-0.777 -0.008,-0.018 -0.023,-0.03 -0.032,-0.048 -0.047,-0.096 -0.1,-0.191 -0.18,-0.271 l -6.764,-6.764 c -0.391,-0.391 -1.023,-0.391 -1.414,0 -0.391,0.391 -0.391,1.023 0,1.414 L 79.586,49 h -6.172 l -6.147,-6.147 v -8.706 l 2.76,-2.76 h 9.151 c 0.553,0 1,-0.448 1,-1 0,-0.552 -0.447,-1 -1,-1 h -8.565 v -8.565 c 0,-0.552 -0.447,-1 -1,-1 -0.553,0 -1,0.448 -1,1 v 9.151 l -2.76,2.76 H 57.147 L 51,26.586 v -6.172 l 5.057,5.057 c 0.195,0.195 0.451,0.293 0.707,0.293 0.256,0 0.512,-0.098 0.707,-0.293 0.391,-0.391 0.391,-1.023 0,-1.414 l -6.764,-6.764 c -0.079,-0.079 -0.173,-0.131 -0.268,-0.178 -0.018,-0.009 -0.031,-0.026 -0.05,-0.033 -0.248,-0.105 -0.528,-0.105 -0.777,0 -0.018,0.007 -0.03,0.023 -0.047,0.031 -0.096,0.047 -0.192,0.1 -0.272,0.181 l -6.764,6.764 c -0.391,0.391 -0.391,1.023 0,1.414 0.391,0.391 1.023,0.391 1.414,0 L 49,20.414 v 6.172 l -6.147,6.147 h -8.705 l -2.761,-2.761 v -9.15 c 0,-0.552 -0.447,-1 -1,-1 -0.553,0 -1,0.448 -1,1 v 8.565 h -8.565 c -0.553,0 -1,0.448 -1,1 0,0.552 0.447,1 1,1 h 9.152 l 2.765,2.765 v 8.695 L 26.586,49 h -6.172 l 5.057,-5.057 c 0.391,-0.391 0.391,-1.023 0,-1.414 -0.391,-0.391 -1.023,-0.391 -1.414,0 l -6.764,6.764 c -0.051,0.051 -0.078,0.116 -0.116,0.174 -0.032,0.049 -0.074,0.091 -0.097,0.146 -0.104,0.247 -0.104,0.526 0,0.773 0.021,0.05 0.06,0.088 0.089,0.134 0.04,0.064 0.069,0.132 0.124,0.187 l 6.764,6.764 c 0.195,0.195 0.451,0.293 0.707,0.293 0.256,0 0.512,-0.098 0.707,-0.293 0.391,-0.391 0.391,-1.023 0,-1.414 L 20.414,51 h 6.171 l 6.152,6.152 v 8.695 l -2.765,2.765 H 20.82 c -0.553,0 -1,0.447 -1,1 0,0.553 0.447,1 1,1 h 8.565 v 8.565 c 0,0.553 0.447,1 1,1 0.553,0 1,-0.447 1,-1 v -9.15 l 2.766,-2.767 h 8.694 L 49,73.414 v 6.172 l -5.057,-5.057 c -0.391,-0.391 -1.023,-0.391 -1.414,0 -0.391,0.391 -0.391,1.023 0,1.414 l 6.764,6.764 c 0.078,0.078 0.17,0.128 0.264,0.175 0.02,0.01 0.034,0.028 0.055,0.037 C 49.736,82.971 49.867,83 50,83 c 0.133,0 0.264,-0.029 0.388,-0.081 0.022,-0.009 0.038,-0.028 0.059,-0.039 0.092,-0.047 0.183,-0.096 0.26,-0.173 l 6.764,-6.764 c 0.391,-0.391 0.391,-1.023 0,-1.414 -0.391,-0.391 -1.023,-0.391 -1.414,0 L 51,79.586 v -6.172 l 6.152,-6.153 h 8.694 l 2.766,2.766 v 9.151 c 0,0.553 0.447,1 1,1 0.553,0 1,-0.447 1,-1 v -8.565 h 8.565 c 0.553,0 1.001,-0.448 1.001,-1 z M 65.56,56.026 c -0.188,0.188 -0.293,0.441 -0.293,0.707 v 7.12 L 58.448,57.034 C 59.839,55.367 60.742,53.283 60.95,51 h 9.636 z M 50,59 c -4.963,0 -9,-4.038 -9,-9 0,-4.962 4.037,-9 9,-9 4.963,0 9,4.038 9,9 0,4.962 -4.037,9 -9,9 z M 65.56,43.974 70.586,49 h -9.637 c -0.207,-2.283 -1.111,-4.367 -2.502,-6.034 l 6.819,-6.819 v 7.12 c 10e-4,0.265 0.106,0.519 0.294,0.707 z M 56.025,34.44 c 0.188,0.188 0.441,0.293 0.707,0.293 h 7.12 l -6.819,6.818 C 55.366,40.16 53.282,39.257 50.999,39.05 v -9.636 z m -12.758,0.293 c 0.266,0 0.52,-0.105 0.707,-0.293 L 49,29.414 v 9.637 c -2.283,0.207 -4.367,1.111 -6.034,2.502 l -6.819,-6.819 h 7.12 z m -8.822,9.235 c 0.188,-0.188 0.293,-0.442 0.293,-0.707 v -7.109 l 6.814,6.814 C 40.161,44.633 39.258,46.717 39.051,49 h -9.637 z m 0,12.063 L 29.414,51 h 9.636 c 0.207,2.283 1.111,4.366 2.501,6.033 l -6.813,6.814 v -7.109 c 0,-0.265 -0.105,-0.519 -0.293,-0.707 z m 9.523,9.523 C 43.78,65.366 43.527,65.261 43.261,65.261 h -7.108 l 6.813,-6.813 c 1.668,1.391 3.751,2.295 6.034,2.502 v 9.637 z m 12.77,-0.293 c -0.266,0 -0.52,0.105 -0.707,0.293 L 51,70.586 V 60.95 c 2.283,-0.207 4.366,-1.111 6.034,-2.501 l 6.813,6.813 h -7.109 z"
     id="path5"
     style="fill:#d8d7dc;fill-opacity:1" /><path
     d="m 21.008,26.009 c 2.757,0 5,-2.243 5,-5 0,-2.757 -2.243,-5 -5,-5 -2.757,0 -5,2.243 -5,5 0,2.757 2.243,5 5,5 z m 0,-8 c 1.654,0 3,1.346 3,3 0,1.654 -1.346,3 -3,3 -1.654,0 -3,-1.346 -3,-3 0,-1.654 1.346,-3 3,-3 z"
     id="path6"
     style="fill:#d8d7dc;fill-opacity:1" /><path
     d="m 50,86 c -2.757,0 -5,2.243 -5,5 0,2.757 2.243,5 5,5 2.757,0 5,-2.243 5,-5 0,-2.757 -2.243,-5 -5,-5 z m 0,8 c -1.654,0 -3,-1.346 -3,-3 0,-1.654 1.346,-3 3,-3 1.654,0 3,1.346 3,3 0,1.654 -1.346,3 -3,3 z"
     id="path7"
     style="fill:#d8d7dc;fill-opacity:1" /><path
     d="m 91,45 c -2.757,0 -5,2.243 -5,5 0,2.757 2.243,5 5,5 2.757,0 5,-2.243 5,-5 0,-2.757 -2.243,-5 -5,-5 z m 0,8 c -1.654,0 -3,-1.346 -3,-3 0,-1.654 1.346,-3 3,-3 1.654,0 3,1.346 3,3 0,1.655 -1.346,3 -3,3 z"
     id="path8"
     style="fill:#d8d7dc;fill-opacity:1" /><path
     d="m 9,45 c -2.757,0 -5,2.243 -5,5 0,2.757 2.243,5 5,5 2.757,0 5,-2.243 5,-5 0,-2.757 -2.243,-5 -5,-5 z m 0,8 c -1.654,0 -3,-1.346 -3,-3 0,-1.654 1.346,-3 3,-3 1.654,0 3,1.346 3,3 0,1.655 -1.346,3 -3,3 z"
     id="path9"
     style="fill:#d8d7dc;fill-opacity:1" /></g></svg>`
    ];
    let isSnow = false;
    let sky = null;

    function snow() {
      console.log("Создаем снежинку");
      const randomSnowflake = snowSVG[Math.floor(Math.random() * snowSVG.length)];
      const snowflakeDiv = $('<div class="snowflake"></div>');
      snowflakeDiv.html(randomSnowflake);
      let randomX = Math.random() * window.innerWidth;
      let randomY = -20;
      let angle = Math.random() * (25 - 15) + 15;
      let angleRad = angle * Math.PI / 180;
      let animationDuration = 8 + Math.random() * 4;
      let rotationSpeed = Math.random() * 2;
      snowflakeDiv.css({
        position: 'absolute'
        , left: randomX + 'px'
        , top: randomY + 'px'
        , transform: `rotate(${Math.random() * 360}deg)`
        , width: '20px'
        , height: '20px'
        , backgroundSize: 'cover'
        , opacity: 1
      });
      snowflakeDiv.animate({
        top: window.innerHeight + 20
        , left: randomX + window.innerHeight * Math.tan(angleRad)
        , transform: `rotate(${rotationSpeed * 360 * animationDuration}deg)`
        , opacity: 0
      }, animationDuration * 1000, 'linear', function() {
        snowflakeDiv.fadeOut(1000, function() {
          snowflakeDiv.remove();
        });
      });
      $('body').append(snowflakeDiv);
    }

    function runSnow() {
      console.log("Запускаем runSnow");
      snow();
      setTimeout(runSnow, 250);
    }
    const skyObserver = new MutationObserver(function(mutations) {
      sky = $('#sky').css('background-image').match(/\d+/g)[1];
      console.log("sky:", sky);
      if (sky === '7' || sky === '8') {
        if (!isSnow) {
          console.log("Начинаем снегопад");
          isSnow = true;
          setTimeout(runSnow, 250);
        }
      }
      else {
        console.log("Снегопад прекращается");
        isSnow = false;
      }
    });
    const mainTableObserver = new MutationObserver(function(mutations) {
      mutations.forEach(function() {
        if (!$('#snow').length) {
          $('body').prepend('<div id="snow"></div>');
        }
        skyObserver.observe($('#sky')[0], {
          attributes: true
        });
        mainTableObserver.disconnect();
      });
    });
    mainTableObserver.observe($('#main_table > tbody')[0], {
      childList: true
    });
    let csssnow = `<style>
  @keyframes rot {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
  0% { filter: opacity(100%); }
  100% { filter: opacity(0%); } }

  .snowflake {
  animation: 20s linear 0s infinite rot;
  width: 100%; }
  </style>`
    $('head').append(csssnow);
  }
  const cagesObserver = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      const node = mutation.addedNodes[0];
      if (!node) return;
      if (node.nodeType !== Node.ELEMENT_NODE) return;
      if (isDesktop && globals.compact) {
        if (node.classList.contains('catWithArrow')) {
          let padding = 0;
          $('#cages').children('tbody').children('tr').last().children().each(function() {
            const tooltip = $(this).find('.cat_tooltip');
            if (tooltip.length && tooltip.height() > padding) {
              padding = tooltip.height();
            }
          });
          padding += 50;
          body.css('padding-bottom', padding + 'px')
        }
      }
      if (globals.putCatsDown && globals.putArrowsDown) {
        let arrow;
        if (node.classList.contains('catWithArrow')) {
          arrow = $(node).children('div').children('.arrow');
        }
        else if (mutation.target.classList.contains('catWithArrow')) {
          arrow = $(node).children('.arrow');
        }
        else return;
        if (!arrow.length) return;
        const oldTop = Number(getNumber(arrow.css('top')));
        const catHeight = Number(getNumber(arrow.children('table').css('width')));
        const newTop = oldTop + 150 - catHeight * 1.5;
        arrow.css('top', newTop + 'px');
      }
    });
  });
  $('.cage_items').each(function() {
    cagesObserver.observe(this, {
      childList: true
      , subtree: true
    });
  });
  if (globals.actionTitle || globals.actionEndAlert) {
    const changeTitle = globals.actionTitle;
    const blurOnly = globals.actionEndAlertBlurOnly;
    const audio = new Audio();
    audio.src = globals.actionEndAlertLink;
    audio.volume = globals.actionEndAlertVol;
    let isWindowActive = true;
    window.addEventListener('focus', function(event) {
      isWindowActive = true;
      if (blurOnly) {
        audio.pause();
        audio.currentTime = 0;
      }
    });
    window.addEventListener('blur', function(event) {
      isWindowActive = false;
    });
    const deysObserver = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        if (mutation.target.id === 'block_mess' && !$('#sek').length) {
          if (changeTitle) document.title = 'Игровая / CatWar';
        }
        else if (mutation.target.id === 'sek' && mutation.addedNodes.length) {
          const timeLeft = $('#sek').text();
          if (changeTitle) document.title = timeLeft;
          if (globals.actionEndAlert) {
            const alertTime = new RegExp('^' + globals.actionEndAlertTime + ' .?с');
            if (alertTime.test(timeLeft) && (!isWindowActive || !blurOnly || $('#cwmod-popup-wrap').css('display') === 'flex')) {
              audio.play();
            }
          }
        }
      });
    });
    deysObserver.observe($('#block_mess')[0], {
      childList: true
      , subtree: true
    });
  }
  const DiseasesLevels = {};
  DiseasesLevels.dirt = ['грязные лапы', 'грязевые пятна', 'клещи', 'блохи'];
  DiseasesLevels.wound = ['царапины', 'лёгкие раны', 'глубокие раны', 'смертельные раны'];
  DiseasesLevels.drown = ['cсадины', 'лёгкие порезы', 'глубокие царапины', 'смертельные травмы'];
  DiseasesLevels.trauma = ['ушибы', 'лёгкие переломы', 'сильные переломы', 'смертельные переломы'];
  let catInfos = [];
  body.on('mouseenter', '.cat', function() {
    const cat = $(this);
    const catEl = cat.find('.d');
    if (!catEl.length) return;
    if (globals.catTooltipInfo) {
      const html = cat.html();
      const link = cat.find('a').first();
      const catName = link.text();
      const catId = /\d+/.exec(link.attr('href'))[0];
      const sex = (/Его запах/.exec(html));
      const catElHtml = catEl.parent().html();
      let height = catEl.css('background-size');
      if (height === '101%') height += ' (надута)';
      const image = /composited\/([\da-f]{16})\.png/.exec(catElHtml)[1];
      let dirt = /dirt\/(\d)/.exec(catElHtml);
      let wound = /wound\/(\d)/.exec(catElHtml);
      let drown = /drown\/(\d)/.exec(catElHtml);
      let trauma = /trauma\/(\d)/.exec(catElHtml);
      wound = wound ? Number(wound[1]) : false;
      dirt = dirt ? Number(dirt[1]) : false;
      drown = drown ? Number(drown[1]) : false;
      trauma = trauma ? Number(trauma[1]) : false;
      const poisoning = (/poisoning/.exec(catElHtml));
      const disease = (/disease/.exec(catElHtml));
      const beddings = (/costume\/295\.png/.exec(catElHtml));
      let text = `<div style="background: bottom right / 45px no-repeat url(composited/${image}.png);">`;
      text += `<a href="/cat${catId}"><b>${catName}</b></a> (ID ${catId})<br><a target="_blank" href="/cw3/composited/${image}.png">Окрас</a>`;
      text += `<br>Рост: ${height}`;
      text += dirt ? `<br>Грязь ${dirt} степени (${DiseasesLevels.dirt[dirt - 1]})` : '';
      text += beddings ? `<br>Убирает подстилки` : '';
      text += (wound || drown || trauma || poisoning || disease) ? `<br>Болезни:` : `<br>Здоров` + (sex ? '' : 'а');
      text += wound ? `<br>— Раны ${wound} степени (${DiseasesLevels.wound[wound - 1]})` : '';
      text += drown ? `<br>— Травмы от утопления ${drown} степени (${DiseasesLevels.drown[drown - 1]})` : '';
      text += trauma ? `<br>— Переломы ${trauma} степени (${DiseasesLevels.trauma[trauma - 1]})` : '';
      text += poisoning ? `<br>— Отравление` : '';
      text += disease ? `<br>— Насморк` : '';
      text += `</div>`;
      catInfos[catId] = text;
      if (!cat.find('.show-more').length) cat.find('.online').before(`<a class="show-more" href="#" data-id="${catId}">Подробнее</a><br>`);
      else cat.find('.show-more').data('id', catId);
    }
    if (globals.shortInventory) {
      let things = {};
      let cats = [];
      let mouth = cat.find('.mouth:not(.new-mouth)').first();
      if (mouth.length) {
        let newMouth = mouth.siblings('.new-mouth');
        if (!newMouth.length) {
          mouth.after('<ol class="mouth new-mouth"></ol>');
          newMouth = mouth.siblings('.new-mouth');
        }
        else newMouth.show();
        let mouthThings = mouth.children('li');
        mouthThings.each(function() {
          const li = $(this);
          if (li.find('div').length) {
            cats.push(li.html());
          }
          else {
            let thingId = /\d+/.exec(li.children('img').attr('src'))[0];
            if (li.text() !== '') {
              things[thingId] = Number(li.text().slice(1));
            }
            else if (things[thingId]) {
              things[thingId]++;
            }
            else things[thingId] = 1;
          }
        });
        let newMouthHtml = '';
        Object.keys(things).forEach(function(key) {
          let len = things[key] > 1 ? `×${things[key]}` : '';
          newMouthHtml += `<li><img src="things/${key}.png">${len}</li>`;
        });
        cats.forEach(function(cat) {
          newMouthHtml += `<li>${cat}</li>`;
        });
        mouth.hide();
        newMouth.html(newMouthHtml);
      }
      else cat.find('.new-mouth').hide();
    }
  });
  if (globals.catTooltipInfo) {
    body.on('click', '.show-more', function(e) {
      e.preventDefault();
      showCwmodPopup('alert', catInfos[$(this).data('id')]);
    });
  }
  if (globals.paramInfo) {
    $('#parameter').children('h2').first().append(' <a id="parameters-alert" href="#" title="Параметры подробно">+</a>');
    $('#parameters-alert').click(function() {
      let params = ['Сонливость', 'Голод', 'Жажда', 'Нужда', 'Здоровье', 'Чистота'];
      let text = '<center><b>Параметры</b></center>';
      ['dream', 'hunger', 'thirst', 'need', 'health', 'clean'].forEach(function(param, i) {
        const isDream = (param === 'dream')
          , isHunger = (param === 'hunger')
          , isThirst = (param === 'thirst')
          , isNeed = (param === 'need')
          , isClean = (param === 'clean');
        text += `<br><b>${params[i]}</b><br>`;
        let red = parseInt($('#' + param).find("td").last()[0].style.width);
        if (Number.isNaN(red)) text += 'Ошибка, попробуйте снова';
        else if (red === 0) {
          if (isDream && $('.dey[data-id="1"]').length) text += `<span style="color: darkred">100 %</span><br>10 c сна`;
          else if (isThirst && $('.dey[data-id="5"]').length) text += `<span style="color: darkred">100 %</span><br>До 30 c питья`;
          else if (isNeed && $('.dey[data-id="4"]').length) text += `<span style="color: darkred">100 %</span><br>10 c дел в грязном месте`;
          else text += '100 %';
        }
        else if (red === 150) {
          text += '<span style="color: darkred">0 %</span>';
          if (isDream) text += `<br>${secToTime(150 * 20)} сна или более`;
          if (isThirst) text += `<br>${secToTime(150 * 60 - 30)} питья или более`;
          if (isNeed) text += `<br>${secToTime(150 * 30 - 10)} дел в грязном месте или более`;
        }
        else {
          const percent = isClean ? Math.floor((150 - red) / 1.5) : Math.round((150 - red) / 1.5 * 100) / 100;
          text += `<span style="color: darkred">${percent}%</span> (−${red}px)`;
          if (isDream) {
            const maxTime = red * 20 + 10;
            text += `<br>До ${secToTime(maxTime)} сна`;
          }
          else if (isHunger) {
            const time = Math.ceil((100 - percent) * 9 / 100) * 15;
            text += `<br>${secToTime(time)} поглощения пищи`;
          }
          else if (isThirst) {
            const maxTime = red * 60 + 30;
            text += `<br>До ${secToTime(maxTime)} питья`;
          }
          else if (isNeed) {
            const maxTime = red * 30 + 10;
            text += `<br>До ${secToTime(maxTime)} дел в грязном месте`;
          }
          else if (isClean && red <= 75) {
            text += `<br>Вылизываться ${secToTime((100 - percent) * 100)}`;
          }
        }
      });
      showCwmodPopup('alert', text);
    });
  }
}

function snow() {
  const id = Date.now()
    , flake = 'https://porch.website/cwmod/snow/' + Math.ceil(Math.random() * 20) + '.png'
    , pos_x = Math.ceil(Math.random() * 98)
    , end_x = pos_x + Math.floor(Math.random() * 31) - 15
    , deg = Math.ceil(Math.random() * 358)
    , width = Math.ceil(Math.random() * 45) + 5
    , img = `
<img id="snow_${id}" style="
  left: ${pos_x}%;
  top: -10%;
  position: fixed;
  pointer-events: none;
  z-index: 72000;
  transform: rotate(${deg}deg);
  max-width: ${width}px;
" src="${flake}">`
    , timefall = Math.ceil(Math.random() * 12000) + 5000;
  $("#snow").append(img);
  $(`#snow_${id}`).animate({
    top: '120%'
    , left: end_x + '%'
  }, timefall, function() {
    $(`#snow_${id}`).empty().remove();
  });
}

function changeFaePage() {
  if (globals.enableFaeNotes) {
    const observer = new MutationObserver(function(mutations) {
      mutations.forEach(function() {
        $('.cat_span').each(function() {
          const t = $(this);
          const catId = getNumber(t.children().first().attr('href'));
          const noteText = getNoteByCatId(catId);
          if (noteText) {
            t.append(` <span id="${catId}" class="note" style="font-size: 0.9em"></span>`);
            $('#' + catId).text(noteText);
          }
        });
      });
    });
    observer.observe(document.querySelector('#friendList'), {
      childList: true
    });
  }
  if (globals.enableCatNotes) {
    $(isDesktop ? '#branch' : '#site_table').append(`<b>Список заметок</b><br>`);
    let html = '';
    const notes = JSON.parse(window.localStorage.getItem('cwmod_notes') || '{}');
    Object.keys(notes).forEach(function(catId) {
      html += `<tr><td>${catId}</td><td id="note-${catId}"></td><td>${notes[catId]}</td></tr>`;;
    });
    if (html.length) {
      $(isDesktop ? '#branch' : '#site_table').append(`<table><thead><tr><td>ID</td><td>Имя</td><td>Заметка</td></tr></thead><tbody>${html}</tbody></table>`);
      Object.keys(notes).forEach(catId => setCatName(catId, '#note-' + catId));
    }
    else {
      $(isDesktop ? '#branch' : '#site_table').append(`<i>Нет заметок об игроках</i>`);
    }
  }
}

function changeIdeasPage() {
  addCSS(`.vote[style="color:#000"] { color: inherit !important; } .idea { color: black; } .idea a, .idea a:hover { color: #005 !important; }`);
}

function changeIndexPage() {
  let css = `
#act_name b { color: black; }
#info { color: black; background: rgba(255, 255, 255, 0.5); }
#clan_icon, #age_icon, #age2_icon, #act_icon { cursor: pointer; }
#cwmod-grats { width: fit-content; padding: 5px; background: rgba(255, 255, 255, 0.5); border-radius: 10px; }
    `;
  if (globals.hideEducation) {
    css += `#education, #education-show, #education-show + br {display: none !important}`;
  }
  addCSS(css);
  addBBcode();
  const catId = $('[src="img/icon_id.png"]').parent().siblings().children('a').children('b').text();
  activityCalc(catId);
  moonCalc();
  if (globals.indexSaveAlert) addSaveAlert();
}

function activityCalc(catId) {
  const actStages = [{
      name: 'пустое место'
      , fromZero: -5000
    }
    , {
      name: 'подлежащий удалению'
      , fromZero: -5000
    }
    , {
      name: 'покинувший игру'
      , fromZero: -2000
    }
    , {
      name: 'забывший про игру'
      , fromZero: -1000
    }
    , {
      name: 'забытый кот'
      , fromZero: -750
    }
    , {
      name: 'ужаснейшая'
      , fromZero: -500
    }
    , {
      name: 'ужасная'
      , fromZero: -300
    }
    , {
      name: 'ухудшающаяся'
      , fromZero: -150
    }
    , {
      name: 'отрицательная'
      , fromZero: -50
    }
    , {
      name: 'переходная'
      , fromZero: -5
    }
    , {
      name: 'положительная'
      , fromZero: 5
    }
    , {
      name: 'улучшающаяся'
      , fromZero: 50
    }
    , {
      name: 'замечательная'
      , fromZero: 150
    }
    , {
      name: 'переход 2 мин 15 с'
      , fromZero: 225
    }
    , {
      name: 'замечательнейшая'
      , fromZero: 300
    }
    , {
      name: 'переход 2 мин'
      , fromZero: 450
    }
    , {
      name: 'любимый кот'
      , fromZero: 500
    }
    , {
      name: 'переход 1 мин 45 с'
      , fromZero: 675
    }
    , {
      name: 'легенда сайта'
      , fromZero: 750
    }
    , {
      name: 'переход 1 мин 30 с'
      , fromZero: 900
    }
    , {
      name: 'ходячий миф'
      , fromZero: 1000
    }
    , {
      name: 'переход 1 мин 15 с'
      , fromZero: 1125
    }
    , {
      name: 'переход 1 мин'
      , fromZero: 1350
    }
    , {
      name: 'переход 45 c'
      , fromZero: 1575
    }
    , {
      name: 'император Игровой'
      , fromZero: 2000
    }
    , {
      name: 'частичка Игровой'
      , fromZero: 5000
    }
    , {
      name: 'хранитель Игровой'
      , fromZero: 20000
    }
    , {
      name: 'идеальная'
      , fromZero: 75000
    }
    , {
      name: 'сверхидеальная'
      , fromZero: 150000
    }
  ];
  const sets = JSON.parse(window.localStorage.getItem('cwmod_act') || '{}');
  if (!sets[catId]) {
    sets[catId] = {};
    if (window.localStorage.getItem('cwm_hours') !== null) {
      sets[catId].hours = Number(window.localStorage.getItem('cwm_hours'));
      window.localStorage.removeItem('cwm_hours');
    }
    else sets[catId].hours = 24;
    sets[catId].opened = true;
  }
  /// до 2.2
  if (sets[catId].actgoal) {
    actStages.forEach(function(stage, i) {
      if (i && Number(sets[catId].actgoal) === stage.fromZero) {
        sets[catId].goal = i;
        delete sets[catId].actgoal;
      }
    });
  }

  function updateHourWord() {
    const hours = sets[catId].hours;
    $('#hour-word').text(declOfNum(hours, ['час', 'часа', 'часов']));
  }

  function actLength(d) {
    const minus = sets[catId].minus || 0;
    if (d <= 14) return 150 - minus;
    else if (d >= 1575) return 45 - minus;
    else return Math.ceil(150 - d / 15) - minus;
  }

  function left(currentActivity, goal, hoursPerDay) {
    const secsPerDay = convertTime('h s', hoursPerDay);
    if (actLength(currentActivity) * 4 + 1 > secsPerDay) {
      return {
        actions: '∞'
        , time: '∞'
        , date: 'никогда'
      };
    }
    const actionsWithoutDecr = goal - currentActivity;
    let days = 0;
    let secsToday;
    while (currentActivity < goal) {
      secsToday = 0;
      while (secsToday < secsPerDay) {
        currentActivity++;
        secsToday += actLength(currentActivity);
        if (currentActivity >= goal) break;
      }
      if (currentActivity >= goal) break;
      days++;
      currentActivity -= 4.8;
    }
    const actionsDecr = Math.floor(days * 4.8 + convertTime('s h', secsToday) / 5);
    const time = secsPerDay * days + secsToday;
    const now = new Date();
    const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    const secsToTomorrow = convertTime('ms s', tomorrow - now);
    if (days === 0 && secsToday > secsToTomorrow) days++;
    const date = new Date(Date.now() + convertTime('d ms', days));
    return {
      actions: actionsWithoutDecr + actionsDecr
      , time: secToTime(time)
      , date: date.getDate() + ' ' + months[date.getMonth()] + ' ' + date.getFullYear()
    };
  }

  function updateToact() {
    if (progress.stage === actStages.length - 1) {
      $('#toact').hide();
      return;
    }
    const goal = Number($('#act-list').val());
    const result = left(progress.doneFromZero, actStages[goal].fromZero, sets[catId].hours);
    $('#toact > ul').html(`
<li>${result.actions} ${declOfNum(result.actions, ['переход', 'перехода', 'переходов'])} (${result.time})</li>
<li>будет достигнута ${result.date}</li>
`);
  }
  const act = $('#act_name b').text().split(' (');
  const progress = {};
  actStages.forEach(function(stage, i) {
    if (act[0] === stage.name) {
      progress.doneFromZero = stage.fromZero + Number(act[1].split('/')[0]);
    }
    if (
      (!actStages[i + 1] || actStages[i + 1].fromZero > progress.doneFromZero) &&
      actStages[i].fromZero <= progress.doneFromZero
    ) {
      progress.stage = i;
    }
  });
  const actInfoHTML = `
<details id="calc-act"${sets[catId].opened ? ' open' : ''}>
<summary id="open-calc"><b>Калькулятор активности</b></summary>
<p id="cwmod-grats" style="display:none"></p>
<div id="actlength"><b>Переход</b>: ${secToTime(actLength(progress.doneFromZero))}</div>
<div>Предметы во рту уменьшают мой переход <nobr>на
  <select id="minus">
    <option value="0">0 секунд</option>
    <option value="2">2 секунды</option>
    <option value="4">4 секунды</option>
    <option value="6">6 секунд</option>
  </select></nobr>
</div>
<div>Я качаю активность <input id="hours-per-day" type="number" step="0.25" min="0" max="24"
value="${sets[catId].hours}" style="width: 60px"> <span id="hour-word"></span> в сутки</div>
<div id="toact">
  <b>Цель: <select style="display: inline" id="act-list"></select></b>:
  <ul style="margin: 0.5em"></ul>
</div>
<div>Переход начнёт падать <span id="tofall"></span></div>
</details>
    `;
  $('#info').after(actInfoHTML);
  for (let i = progress.stage + 1; i < actStages.length; i++) {
    $('#act-list').append(`<option value="${i}">${actStages[i].name}</option>`);
  }
  if (sets[catId].goal > progress.stage || sets[catId].noGrats) {
    $(`#act-list > [value="${sets[catId].goal}"]`).prop('selected', true);
  }
  else if (sets[catId].goal) {
    $(`#cwmod-grats`).html(`
Цель <b>«${actStages[sets[catId].goal].name}»</b> достигнута!
<center><img src="/img/stickers/systempaw3/6.png"></center>
<input id="cwmod-grats-hooray" type="button" value="Скрыть">
<br><input id="cwmod-grats-never-show" type="checkbox"> Больше не поздравлять на этом персонаже
`).show();
    $('#cwmod-grats-hooray').click(function() {
      $(`#cwmod-grats`).hide(200);
      $(`#cwmod-grats`).hide(200);
      sets[catId].goal = Number($('#act-list').val());
      sets[catId].noGrats = $('#cwmod-grats-never-show').is(':checked');
      saveData('act', sets);
    });
  }
  if (sets[catId].minus) {
    $(`#minus > [value="${sets[catId].minus}"]`).prop('selected', true);
  }
  updateHourWord();
  updateToact();
  if (actLength(progress.doneFromZero) !== 45) {
    $('#tofall').parent().hide();
  }
  else {
    const timeFall = new Date(Date.now() + (progress.doneFromZero - 1575) * 5 * 3600000);
    $('#tofall').html(
      timeFall.getDate() + ' ' +
      months[timeFall.getMonth()] +
      ' ' + timeFall.getFullYear()
    );
  }
  $('#minus').change(function() {
    sets[catId].minus = $(this).val();
    saveData('act', sets);
    updateToact();
    $('#actlength').html(`<b>Переход</b>: ${secToTime(actLength(progress.doneFromZero))}`);
  });
  $('#act-list').change(function() {
    sets[catId].goal = Number($('#act-list').val());
    saveData('act', sets);
    updateToact();
  });
  $('#hours-per-day').on('input', function() {
    const hours = Number($('#hours-per-day').val());
    if (hours < 0 || hours > 24 || !Number.isInteger(hours * 1000)) {
      $('#hours-per-day').val(sets[catId].hours);
      return;
    }
    sets[catId].hours = hours;
    saveData('act', sets);
    updateHourWord();
    updateToact();
  });
  $('#open-calc').click(function() {
    sets[catId].opened = !$('#calc-act').is('[open]');
    saveData('act', sets);
  });
}

function changeKnsPage() {
  if (globals.knsAlert) addSaveAlert();
}

function changeLsPage() {
  addCSS(`
.msg_header { font-size: 1.2rem; text-align: center; }
#search, #saved { display: none; }
label { cursor: pointer; }
.msg_deleted { color: darkred; }
.messList { background-color: ${$('#messList').css('background-color')}; color: ${$('#messList').css('color')}; }
.messList a { color: #0000cd; }
    `);
  const enableSaving = globals.enableSavingLS;
  if (enableSaving) $('#links').append(` | <a href="ls?3" id="f3">Сохранённые (<span id="saved-number">?</span>)</a>`);
  $('#links').append(` | <a href="ls?search" id="s">Поиск</a>`);
  let html = `
<div id="search">
  <form class="usn" id="search-form">
    <p>
      Найти
      <label><input name="search-folder" type="radio" value="0"> входящие</label>
      <label><input name="search-folder" type="radio" value="1"> отправленные</label>
      <label><input name="search-folder" type="radio" value="2"> непрочитанные</label>
    </p>
`;
  if (enableSaving) html += `
    <p>
      <label><input name="search-type" id="search-all" type="checkbox"> во всех ЛС на этом персонаже</label>
      <label><input name="search-type" id="search-saved" type="checkbox"> в сохранённых ЛС</label>
    </p>
`;
  html += `
    <p>
      <input id="search-cat" type="text" placeholder="Имя или ID собеседника">
      <input id="search-text" type="text" placeholder="Текст">
      <input id="search-ok" type="button" value="ОК">
    </p>
  </form>
  <div id="search-list"></div>
</div>
`;
  if (enableSaving) html += '<div id="saved"><div id="saved-list"></div></div>';
  $(isDesktop ? '#branch' : '#site_table').append(html);
  addSearchFunc(enableSaving);
  if (enableSaving) {
    updateSavedLsList();
    $(window).on('storage', function(e) {
      if (e.originalEvent.key === 'cwmod_ls') updateSavedLsList();
    });
    if (isPage('ls?3')) showSavedLsList();
    if (isPage(/^https:\/\/catwar.su\/ls\?id=\d+/)) changeMessagePage();
    body.on('click', '.del-saved', function() {
      const lsId = $(this).data('id');
      const subject = $(this).parent().siblings().first().text();
      const catName = $(this).parent().siblings('.cat_name').text();
      if (confirm(`Удалить ЛС «${subject}» от игрока ${catName} из сохранённых?`)) {
        deleteSavedLs(lsId);
        $(this).parent().parent().remove();
      }
    });
  }
  if (isPage('ls?search')) showSearch();
  if (isPage('ls?new')) addBBcode();
  $('a').click(function(e) {
    if ($(this).attr('id') === 'f3') {
      if (e.ctrlKey) return;
      e.preventDefault();
      history.pushState(null, null, 'https://catwar.su/ls?3');
      showSavedLsList();
    }
    else if ($(this).attr('id') === 's') {
      if (e.ctrlKey) return;
      e.preventDefault();
      history.pushState(null, null, 'https://catwar.su/ls?search');
      showSearch();
    }
    else {
      hideSavedLsList();
      hideSearch();
    }
  });
  const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function() {
      if (enableSaving && isPage('ls?3')) {
        history.pushState(null, null, 'https://catwar.su/ls?3');
        showSavedLsList();
      }
      else if (isPage('ls?search')) {
        history.pushState(null, null, 'https://catwar.su/ls?search');
        showSearch();
      }
      else {
        if (enableSaving) hideSavedLsList();
        hideSearch();
      }
      if (isPage('ls?new')) addBBcode();
      if (enableSaving && isPage(/^https:\/\/catwar.su\/ls\?id=\d+/)) changeMessagePage();
    });
  });
  observer.observe($('#main')[0], {
    childList: true
  });
  body.on('click', '#preview', function() {
    if (isDesktop) {
      $('#preview_div').after(`
<table border="1" style="width: 90%; max-width: 500px;">
  <tbody>
    <tr><td id="preview-subject" colspan="2"></td></tr>
    <tr>
      <td valign="top">
        Отправитель: <span id="preview-sender"></span>
        <br>Сегодня в <span id="preview-date"></span>
        <br>Переписка: <u><big><b>+</b></big></u> …
      </td>
      <td id="preview-text"></td>
    </tr>
  </tbody>
</table>
      `);
    }
    else {
      $('#preview_div').after(`
<table border="1" style="width: 90%; max-width: 500px;">
  <tbody>
    <tr><td id="preview-subject"></td></tr>
    <tr>
      <td valign="top">
        Отправитель: <span id="preview-sender"></span>
        <br>Сегодня в <span id="preview-date"></span>
        <br>Переписка: <u><big><b>+</b></big></u> …
      </td>
    </tr>
    <tr><td id="preview-text"></td></tr>
  </tbody>
</table>
        `);
    }
    let subject = $('#subject').val().replaceAll('<', '&lt;');
    if (!subject) subject = '( = )';
    $('#preview-subject').html(subject);
    getCurrentUser(function(catId, catName) {
      $('#preview-sender').html(`<a href="cat${catId}">${catName}</a>`);
    });
    const currentDate = new Date();
    $('#preview-date').html(`${leadingZero(currentDate.getHours())}:${leadingZero(currentDate.getMinutes())}`);
    $('#preview-text').html($('#preview_div'));
  });
}

function addSearchFunc(enableSaving) {
  const lastSearch = globals.lsLastSearch;
  const lastFolder = lastSearch.folder;
  const lastType = enableSaving ? lastSearch.type : 1;
  $(`[name="search-folder"][value="${lastFolder}"]`).prop('checked', true);
  switch (lastType) {
    case 1:
      $('#search-all').prop('checked', true);
      break;
    case 2:
      $('#search-saved').prop('checked', true);
      break;
    case 3:
      $('[name="search-type"]').prop('checked', true);
      break;
    default:
      $('[name="search-type"]').prop('checked', false);
  }
  $('#search-ok').click(searchLs);
  $('[name="search-folder"]').change(function() {
    const folder = parseInt($('[name="search-folder"]:checked').val(), 10);
    lastSearch.folder = folder;
    setSettings(lsLastSearch, lastSearch);
  });
  $('[name="search-type"]').change(function() {
    const searchAll = $('#search-all').is(':checked');
    const searchSaved = $('#search-saved').is(':checked');
    if (searchAll && !searchSaved) lastSearch.type = 1;
    else if (!searchAll && searchSaved) lastSearch.type = 2;
    else if (searchAll && searchSaved) lastSearch.type = 3;
    else lastSearch.type = 0;
    setSettings(lsLastSearch, lastSearch);
  });
  $('#search-cat').keypress(function(e) {
    if (e.which == 13) {
      $('#search-text').focus();
      return false;
    }
  });
  $('#search-text').keypress(function(e) {
    if (e.which == 13) {
      searchLs();
      return false;
    }
  });
}

function showSearch() {
  $('.active').removeClass('active');
  $('#s').addClass('active');
  $('#main, #saved').hide();
  $('#search').show();
}

function hideSearch() {
  $('#main').show();
  $('#search').hide();
}

function showSavedLsList() {
  $('.active').removeClass('active');
  $('#f3').addClass('active');
  $('#main, #search').hide();
  $('#saved').show();
}

function hideSavedLsList() {
  $('#main').show();
  $('#saved').hide();
}

function changeMessagePage() {
  // if ($('#delete-saved-ls').length) return;
  // if ($('.bbcode').length) addBBcode();
  // ↑ у меня есть некоторые вопросы к себе
  const main = $('#main');
  const lsId = parseInt(window.location.href.split('=')[1], 10);
  const savedLs = getSavedLsById(lsId);
  const btnDelete = `<input id="delete-saved-ls" type="button" value="Удалить" style="float: right">`;
  const isLsOnSever = !(main.html() === 'ЛС не найдено.');
  if ($('#msg_subject').length && lsId) {
    const btnSave = `<input id="savels" type="button" value="Сохранить" style="float: right">`;
    const subjectTd = $('#msg_subject');
    subjectTd.html(`<span id="msg_subject">${subjectTd.html()}</span>${btnSave}`);
    subjectTd.removeAttr('id');
    $('#savels').click(saveLs);
    if (savedLs) {
      const td = $('#msg_table > tbody > tr:last-child > td');
      td.html(td.html() + `<i id="savedate">Сохранено ${savedLs.savedate}</i> ${btnDelete}`);
    }
  }
  else if (!isLsOnSever && savedLs) {
    insertSavedLs(main, lsId, savedLs, btnDelete);
  }
  body.on('click', '#delete-saved-ls', function() {
    if (isLsOnSever) {
      deleteSavedLs(lsId);
      $('#savedate').remove();
      $('#delete-saved-ls').remove();
    }
    else if (confirm('Удалить это ЛС из сохранённых?')) {
      deleteSavedLs(lsId);
      main.html('ЛС не найдено.');
    }
  });
  if ($('#msg_login').length) {
    let myId;
    if (savedLs) myId = Number(savedLs.myId);
    else myId = Number(main.data('id'));
    const catId = Number(getNumber($('#msg_login').attr('href')));
    const history = JSON.parse(window.localStorage.getItem('cwmod_ls_history') || '{}');
    if (!history[myId]) {
      history[myId] = {};
    }
    if (!history[myId][catId]) {
      history[myId][catId] = {};
    }
    $('#msg_info > .msg_open').each(function() {
      const id = $(this).data('id');
      const isMy = ($(this).text() === '-');
      history[myId][catId][id] = isMy;
    });
    saveData('ls_history', history);
  }
}

function insertSavedLs(main, lsId, ls, btnDelete) {
  const info = `
${ls.type ? 'Получатель' : 'Отправитель'}: <span id="msg_login" href="/cat${ls.catId}">${ls.catName}</span>
<br>${ls.date}
<br>Переписка: <span id="msg-history"></span>
`;
  if (isDesktop) {
    main.html(`
<table id="msg_table" border="1">
<tbody>
  <tr><td colspan="2">${escapeHTML(ls.subject)}</td></tr>
  <tr><td id="msg_info" valign="top">${info}</td><td>${ls.text}</td></tr>
  <tr><td colspan="2"><i>${ls.type ? 'Отправитель' : 'Получатель'}: ${ls.myName} [${ls.myId}]<br>Сохранено ${ls.savedate} ${btnDelete}</i></td></tr>
</tbody>
</table>
`);
  }
  else {
    main.html(`
<table id="msg_table" border="1">
<tbody>
  <tr><td>${escapeHTML(ls.subject)}</td></tr>
  <tr><td id="msg_info" valign="top">${info}</td></tr>
  <tr><td>${ls.text}</td></tr>
  <tr><td><i>${ls.type ? 'Отправитель' : 'Получатель'}: ${ls.myName} [${ls.myId}]<br>Сохранено ${ls.savedate} ${btnDelete}</i></td></tr>
</tbody>
</table>
`);
  }
  setCatName(ls.catId, `#msg_login`, ls.catName);
  const history = JSON.parse(window.localStorage.getItem('cwmod_ls_history'))[ls.myId][ls.catId];
  const historyArray = {};
  Object.keys(history).forEach(function(key) {
    const isMy = history[key];
    $('#msg-history').prepend(`<span class="msg_deleted">${isMy ? '-' : '+'}</span> `);
  });
  Object.keys(history).forEach(function(key) {
    const isMy = history[key];
    $.post('/ajax/mess_show', {
      id: key
    }, function(data) {
      const isSaved = getSavedLsById(key);
      if (isSaved || !data.fail) {
        let lsLink = `<a href="ls?id=${key}" class="msg_open" data-id="${key}">`
        if (Number(key) === lsId) lsLink += `<big><b>`
        lsLink += isMy ? '-' : '+';
        if (Number(key) === lsId) lsLink += `</b></big>`
        if (Number(key) === lsId) lsLink += `</b></big>`
        lsLink += `</a>`
        historyArray[key] = lsLink;
      }
      else {
        historyArray[key] = `<span class="msg_deleted">${isMy ? '-' : '+'}</span>`;
      }
      if (Object.keys(historyArray).length === Object.keys(history).length) {
        $('#msg-history').empty();
        Object.keys(historyArray).forEach(function(k) {
          $('#msg-history').prepend(historyArray[k] + ' ');
        });
      }
    }, 'json');
  });
}

function searchLs() {
  const folder = parseInt($('[name="search-folder"]:checked').val(), 10);
  const searchAll = $('#search-all').is(':checked');
  const searchSaved = $('#search-saved').is(':checked');
  if (!searchAll && searchSaved && folder === 2) {
    $('#search-list').html('<img src="/img/stickers/systempaw2/6.png">');
  }
  else {
    $('#search-list').html(`
<h2>Результаты поиска</h2>
<p>Найдено: <span id="search-number">0</span></p>
<table class="messList">
<tbody id="search-results">
  <tr><th>Тема</th><th>${folder === 1 ? 'Получатель' : 'Отправитель'}</th><th>Дата</th></tr>
</tbody>
</table>
`);
    const cat = $('#search-cat').val();
    let text = $('#search-text').val();
    if (text) {
      text = text.match(/['_\-а-яёa-z0-9$]+/gi);
      text = new RegExp(text.join('|'), 'gi');
    }
    if (searchAll || !searchSaved) searchAllLs(folder, cat, text);
    if (searchSaved || !searchAll) searchSavedLs(folder, cat, text);
  }
}

function searchAllLs(type, cat, text) {
  getCatIdByName(cat, function(catId) {
    $.post('/ajax/mess_folder', {
      folder: type
      , page: 1
      , del: 0
    }, function(data) {
      const column = (type ? 'poluch' : 'otpr');
      for (let i = 1; i <= data.page; i++) {
        $.post('/ajax/mess_folder', {
          folder: type
          , page: i
          , del: 0
        }, function(data) {
          for (let j = 0; j < data.msg.length; j++) {
            const msg = data.msg[j];
            const id = msg.id;
            const html = `
<tr class="${msg.new ? 'msg_read' : 'msg_notRead'}">
  <td><a href="ls?id=${msg.id}" class="msg_open" data-id="${msg.id}">${msg.subject}</a></td>
  <td><a href="cat${msg[column]}">${msg.login}</a></td>
  <td>${msg.time}</td>
</tr>
`;
            $.post('/ajax/mess_show', {
              id: id
            }, function(data) {
              if (cat) {
                if (catId !== msg[column] && cat !== msg[column] && cat.toLowerCase() !== msg.login.toLowerCase()) return;
              }
              if (text) {
                if (!data.msg.subject.match(text) && !data.msg.text.replace(/<[^>]+>/g, '').match(text)) return;
              }
              $('#search-results').append(html);
              $('#search-number').html($('#search-results').children().length - 1);
            }, 'json');
          }
        }, 'json');
      }
    }, 'json');
  });
}

function searchSavedLs(type, cat, text) {
  const savedLs = JSON.parse(window.localStorage.getItem('cwmod_ls'));
  if (savedLs) {
    getCatIdByName(cat, function(catId) {
      for (let key in savedLs) {
        const ls = savedLs[key];
        if (ls.type !== type) continue;
        if (cat) {
          if (
            catId !== ls.catId &&
            cat !== ls.catId &&
            cat.toLowerCase() !== ls.catName.toLowerCase()
          ) {
            continue;
          }
        }
        if (text) {
          if (
            !ls.subject.match(text) &&
            !ls.text.replace(/<[^>]+>/g, '').match(text)
          ) {
            continue;
          }
        }
        $.post('/ajax/mess_show', {
          id: key
        }, function(data) {
          if (data.fail) {
            const html = `
<tr class="msg_read">
  <td><a href="ls?id=${key}" class="msg_open" data-id="${key}">${escapeHTML(ls.subject)}</a></td>
  <td class="search-cat-name" data-id="${key}">${ls.catName}</td>
  <td>${ls.savedate}</td>
</tr>
`;
            $('#search-results').append(html);
            $('#search-number').html($('#search-results').children().length - 1);
            setCatName(ls.catId, `.search-cat-name[data-id="${key}"]`, ls.catName);
          }
        }, 'json');
      }
    });
  }
  else {
    $('#search-results').html('Нет сохранённых сообщений');
  }
}

function updateSavedLsList() {
  const savedLs = JSON.parse(window.localStorage.getItem('cwmod_ls'));
  if (savedLs) {
    $('#saved-list').html(`
<h2>Входящие</h2>
<table class="messList">
  <tbody id="inboxLsList">
    <tr><th>Тема</th><th>Отправитель</th><th>Дата сохранения</th><th>X</th></tr>
  </tbody>
</table>
<h2>Отправленные</h2>
<table class="messList">
  <tbody id="outboxLsList">
    <tr><th>Тема</th><th>Получатель</th><th>Дата сохранения</th><th>X</th></tr>
  </tbody>
</table>
`);
    const inbox = $('#inboxLsList');
    const outbox = $('#outboxLsList');
    for (let key in savedLs) {
      const ls = savedLs[key];
      const html = `
<tr class="msg_read">
  <td><a href="ls?id=${key}" class="msg_open" data-id="${key}">${escapeHTML(ls.subject)}</a></td>
  <td class="cat_name" data-id="${key}">${ls.catName}</td>
  <td>${ls.savedate}</td>
  <td><input type="button" value="X" class="del-saved" data-id="${key}"></td>
</tr>
`;
      if (ls.type) outbox.append(html);
      else inbox.append(html);
      setCatName(ls.catId, `.cat_name[data-id="${key}"]`, ls.catName);
    }
    $('#saved-number').text(Object.keys(savedLs).length);
  }
  else {
    $('#saved-number').text(0);
    $('#saved-list').html(`Сообщений нет.`);
  }
}

function saveLs() {
  try {
    const savedLs = JSON.parse(window.localStorage.getItem('cwmod_ls') || '{}');
    const main = $('#main');
    const lsId = parseInt(window.location.href.split('=')[1], 10);
    const lsInfo = $('#msg_info').html();
    const ls = {};
    ls.subject = $('#msg_subject').text();
    ls.text = $('#msg_table').find('.parsed').html();
    ls.date = findDate(lsInfo);
    ls.catId = parseInt(getNumber($('#msg_login').attr('href')), 10);
    ls.catName = $('#msg_login').html();
    ls.myId = main.data('id');
    ls.myName = main.data('login');
    ls.type = lsInfo.match(/Получатель/) ? 1 : 0;
    const now = new Date();
    const saveDate = {};
    saveDate.day = leadingZero(now.getDate());
    saveDate.month = leadingZero(now.getMonth() + 1);
    saveDate.year = now.getFullYear();
    saveDate.hour = leadingZero(now.getHours());
    saveDate.minute = leadingZero(now.getMinutes());
    saveDate.second = leadingZero(now.getSeconds());
    ls.savedate = `${saveDate.year}-${saveDate.month}-${saveDate.day} ${saveDate.hour}:${saveDate.minute}:${saveDate.second}`;
    savedLs[lsId] = ls;
    saveData('ls', savedLs);
    if ($('#savedate').length) $('#savedate').text(`Сохранено ${ls.savedate}`);
    else {
      const td = $('#msg_table > tbody > tr:last-child > td');
      td.append(`<i id="savedate">Сохранено ${ls.savedate}</i> <input id="delete-saved-ls" type="button" value="Удалить" data-id="${lsId}" style="float: right">`);
      $('#saved-number').text(Number($('#saved-number').text()) + 1);
    }
    updateSavedLsList();
  }
  catch (err) {
    window.console.error('Варомод:', err);
  }
}

function deleteSavedLs(lsId) {
  try {
    const savedLs = JSON.parse(window.localStorage.getItem('cwmod_ls'));
    if (!savedLs) return;
    delete savedLs[lsId];
    saveData('ls', savedLs);
  }
  catch (err) {
    window.console.error('Варомод:', err);
  }
}

function getSavedLsById(lsId) {
  try {
    const savedLs = JSON.parse(window.localStorage.getItem('cwmod_ls'));
    if (!savedLs) return;
    const ls = savedLs[lsId];
    return ls || false;
  }
  catch (err) {
    window.console.error('Варомод:', err);
  }
}
/*
  function changeTimePage() {
    const catTimeNow = timestampToCatTime(Date.now());
    $(isDesctop ? '#branch' : '#site_table').append(`
<div style="width: fit-content; margin: 0 auto">
  <p><b>Настоящее кошачье время</b></p>
  <p id="real-cat-time">${catTimeNow.day} ${months[catTimeNow.month]} ${catTimeNow.year} года, ${leadingZero(catTimeNow.hour)}:${leadingZero(catTimeNow.minute)}:${leadingZero(catTimeNow.second)}</p>
  <p><b>Калькулятор времени</b></p>
  <p>Кошачье время: <input type="number" id="cat-day" min="1" max=""> <input type="time" id="cat-time"></p>
  <p>Время двуногих: <input type="datetime-local" id="twoleg-time" min="${dateToString(catTimeStart)}" value="${dateToString(new Date)}" max="9999-31-12T23:59"></p>
</div>
`);
  }
*/
function changeSettingsPage() {
  let css = `
.copy { cursor: pointer; }
#cwmod-settings h2 { text-indent: 1.5em; }
#cwmod-settings h3 { margin: 1em 0 0.5em 1em; }
#cwmod-settings h4 { margin: 0; }
#cwmod-settings ul { margin: 0; padding: 0 0 0 30px; list-style-type: kannada; }
#cwmod-settings ul ul { padding: 0 0 0 10px; list-style-type: none; }
#cwmod-settings li { padding: 0.2em 0; }
.cwmod-settings[type="checkbox"] { margin-left: 0; cursor: pointer; }
.cwmod-data-result { margin-bottom: 1em; max-height: 300px; overflow-y: auto; white-space: pre-line;}
.cwmod-error { font-weight: bold; color: darkred; }
.cwmod-done { font-weight: bold; color: darkgreen; }

select#cwmodTheme, div#cwmod-settings input.cwmod-settings[type="text"]:not(input#cw3BkgImg), input.cwmod-data-export, input.cwmod-data-import {
border-radius: 3px !important;
margin: 5px 0px;
padding: 1px 5px; }

div#cwmod-settings input.cwmod-settings[type="number"] {
border-radius: 3px;
text-align: center;
margin: 2px;
height: 22px !important;
width: 55px !important; }

input.cwmod-data-merge {
border-radius: 3px;
margin: 2px;
height: 22px !important;
width: 50% !important; }

input#clear-ym-storage {
border-radius: 3px;
margin: 0px 10px;
height: 22px !important;
width: 90% !important; }

p#cwmodSaveButton {
margin: 0px 15px; }

select#cw3Bkg, input#cw3BkgImg, select#cw3BkgSize, select#cw3BkgPos {
border-radius: 3px !important;
margin: 3px 0px;
padding: 1px 5px;
width: 80% !important; }

div#cwmodMenuList, div#cwmodCustSet {
margin: 10px 0px 10px; }

div.setHead>p {
margin: 25px 0px;
font-weight: 600;
font-size: 16px;
margin-bottom: 5px; }

div.setHead {
border-bottom: 4px solid #0F0F0F45;
width: 25%;
height: 24px !important;
margin-bottom: 4px; }
`;
  addCSS(css);
  if (globals.hideMail) {
    const inputColor = $('input[name="mail"]').css('background-color');
    addCSS(`input[name="mail"]:not(:focus) { color: ${inputColor} !important; }`, hideMail);
  }
  const html = `<div id="cwmod-settings">
  <div id="cwmodTrSetHead"><div id="cwmodSetListHeader"><h2>Настройки Варомода v${VERSION}</h2></div></div>



<div id="cwmodTrOne">
<div id="cmSite">
  <div class="setHead" id="cwmodSiteHead"><p>Сайт</p></div>
  <div>
     <input class="cwmod-settings" id="indexSaveAlert" type="checkbox" ${globals.indexSaveAlert ? 'checked' : ''}>
     <label for="indexSaveAlert">Предупреждение при уходе со страницы</label>
  </div><div>
     <input class="cwmod-settings" id="hideEducation" type="checkbox" ${globals.hideEducation ? 'checked' : ''}>
     <label for="hideEducation">Скрывать обучение</label>
  </div><div>
     <input class="cwmod-settings" id="catAddFightLevel" type="checkbox" ${globals.catAddFightLevel ? 'checked' : ''}>
     <label for="catAddFightLevel">Уровень БУ цифрой</label>
  </div><div>
     <input class="cwmod-settings" id="enableCatNotes" type="checkbox" ${globals.enableCatNotes ? 'checked' : ''}>
     <label for="enableCatNotes">Возможность создавать заметки об игроках</label>
  </div><div>
     <input class="cwmod-settings" id="enableFaeNotes" type="checkbox" ${globals.enableFaeNotes ? 'checked' : ''}>
     <label for="enableFaeNotes">Показывать заметки</label>
  </div><div>
     <input class="cwmod-settings" id="enableSavingLS" type="checkbox" ${globals.enableSavingLS ? 'checked' : ''}>
     <label for="enableSavingLS">Возможность сохранять ЛС</label>
  </div><div>
     <input class="cwmod-settings" id="creationAlert" type="checkbox" ${globals.creationAlert ? 'checked' : ''}>
     <label for="creationAlert">Предупреждение при уходе со страницы создания нового блога или поста</label>
  </div><div>
     <input class="cwmod-settings" id="blogAvatars" type="checkbox" ${globals.blogAvatars ? 'checked' : ''}>
     <label for="blogAvatars">Аватарки в комментариях</label><br>
        <label for="blogAvatarsSize">Размер:</label>
        <input class="cwmod-settings" id="blogAvatarsSize" type="number" min="30" max="250" style="width: 45px" value="${globals.blogAvatarsSize}"> px<br>
        <input class="cwmod-settings" id="blogAvatarsNoCrop" type="checkbox" ${globals.blogAvatarsNoCrop ? 'checked' : ''}>
        <label for="blogAvatarsNoCrop">Не обрезать до квадрата</label><br>
        <input class="cwmod-settings" id="blogAvatarsBorder" type="checkbox" ${globals.blogAvatarsBorder ? 'checked' : ''}>
        <label for="blogAvatarsBorder">Рамки у аватарок</label>
  </div><div>
     <input class="cwmod-settings" id="blogCommentSmiles" type="checkbox" ${globals.blogCommentSmiles ? 'checked' : ''}>
     <label for="blogCommentSmiles">Смайлики в комментариях</label>
  </div><div>
     <label>Максимальная ширина картинок</label>
     <div>
        <label for="blogImgMaxWid">в блогах:</label>
        <input class="cwmod-settings" id="blogImgMaxWid" type="number" min="0" max="1000" style="width: 55px" value="${globals.blogImgMaxWid}"> px
  </div><div>
      <label for="sniffImgMaxWid">в ленте:</label>
      <input class="cwmod-settings" id="sniffImgMaxWid" type="number" min="0" max="1000" style="width: 55px" value="${globals.sniffImgMaxWid}"> px
  </div>
      <small>0 — значение по умолчанию (не уменьшать)</small>
  </div><div>
      <input class="cwmod-settings" id="blogAnswerButton" type="checkbox" ${globals.blogAnswerButton ? 'checked' : ''}>
      <label for="blogAnswerButton">Кнопка «Ответить на комментарий»</label>
  </div><div>
      <input class="cwmod-settings" id="blogCiteButton" type="checkbox" ${globals.blogCiteButton ? 'checked' : ''}>
      <label for="blogCiteButton">Кнопка «Цитировать комментарий»</label><br>
      <input class="cwmod-settings" id="blogCiteButtonHide" type="checkbox" ${globals.blogCiteButtonHide ? 'checked' : ''}>
      <label for="blogCiteButtonHide">Показывать только при выделении текста</label>
  </div><div>
      <input class="cwmod-settings" id="hideMail" type="checkbox" ${globals.hideMail ? 'checked' : ''}>
      <label for="hideMail">Спрятать адрес электронной почты</label>
  </div>
</div>
</div>

<div id="cwmodTrTwo">
<div id="cmObj">
  <div class="setHead" id="cwmodObjHead"><p>Окружающий мир</p></div>
  <div>
    <input class="cwmod-settings" id="cw3SnowWeather" type="checkbox" ${globals.cw3SnowWeather ? 'checked' : ''}>
    <label for="cw3SnowWeather">Снежинки на странице, когда идет снег</label>
  </div>
  <div>
    <input class="cwmod-settings" id="cw3HideSky" type="checkbox" ${globals.cw3HideSky ? 'checked' : ''}>
    <label for="cw3HideSky">Скрывать небо</label>
  </div>
</div>
<div id="cmLocation">
  <div class="setHead" id="cwmodLocationHead"><p>Локация</p></div>
  <div>
    <input class="cwmod-settings" id="cw3CageGrid" type="checkbox" ${globals.cw3CageGrid ? 'checked' : ''}>
    <label for="cw3CageGrid">Обозначить границы клеток</label>
  </div>
  <div>
    <input class="cwmod-settings" id="alwaysDay" type="checkbox" ${globals.alwaysDay ? 'checked' : ''}>
    <label for="alwaysDay">Убрать затемнение игрового поля</label>
  </div>
</div>
</div>

<div id="cwmodTrThree">
<div id="cmGame">
  <div class="setHead" id="cwmodGame"><p>Меню</p></div>
  <div>
    <input class="cwmod-settings" id="newPageMenu" type="checkbox" ${globals.newPageMenu ? 'checked' : ''}>
    <label for="newPageMenu">Открывать в новой вкладке</label>
  </div>
  <div id="cwmodMenuList"><div>
    <label>Добавить пункты:</label>
    </div><div>
      <input class="cwmod-settings" id="menuAbout" type="checkbox" ${globals.menuAbout ? 'checked' : ''}>
      <label for="menuAbout">Об игре</label>
  </div><div>
      <input class="cwmod-settings" id="menuTop" type="checkbox" ${globals.menuTop ? 'checked' : ''}>
      <label for="menuTop">Список игроков</label>
  </div><div>
      <input class="cwmod-settings" id="menuLS0" type="checkbox" ${globals.menuLS0 ? 'checked' : ''}>
      <label for="menuLS0">Памятка</label>
  </div><div>
      <input class="cwmod-settings" id="menuBlogs" type="checkbox" ${globals.menuBlogs ? 'checked' : ''}>
      <label for="menuBlogs">Блоги</label>
  </div><div>
      <input class="cwmod-settings" id="menuSniff" type="checkbox" ${globals.menuSniff ? 'checked' : ''}>
      <label for="menuSniff">Лента</label>
  </div><div>
      <input class="cwmod-settings" id="menuSett" type="checkbox" ${globals.menuSett ? 'checked' : ''}>
      <label for="menuSett">Настройки</label>
  </div><div>
      <input class="cwmod-settings" id="menuMobile" type="checkbox" ${globals.menuMobile ? 'checked' : ''}>
      <label for="menuMobile">Сменить версию</label>
  </div></div>
  <div>
      <input class="cwmod-settings" id="paramInfo" type="checkbox" ${globals.paramInfo ? 'checked' : ''}>
      <label for="paramInfo">Параметры подробно</label>
  </div>
</div>
</div>

<div id="cwmodTrFour">
<div id="cmChat">
  <div class="setHead" id="cwmodChat"><p>Чат</p></div>
  <div>
    <input class="cwmod-settings" id="quietLouder" type="checkbox" ${globals.quietLouder ? 'checked' : ''}>
    <label for="quietLouder">Увеличивать шрифт тихих звуков</label>
  </div>
  <div>
    <input class="cwmod-settings" id="loudQuieter" type="checkbox" ${globals.loudQuieter ? 'checked' : ''}>
    <label for="loudQuieter">Уменьшать шрифт громких звуков</label>
  </div>
</div>

<div id="cmKns">
  <div class="setHead" id="cwmodKns"><p>Конструктор окрасов</p></div>
  <div>
    <input class="cwmod-settings" id="knsAlert" type="checkbox" ${globals.knsAlert ? 'checked' : ''}>
    <label for="knsAlert">Предупреждение при уходе со страницы</label>
  </div>
</div>
</div>

<div id="cwmodTrFive">
<div id="cmStyle">
  <div class="setHead" id="cwmodStyle"><p>Оформление</p></div>
  <div>
    <select class="cwmod-settings" id="cwmodTheme">
      <option value="0">По умолчанию</option>
      <option value="1">Тёмно-серая</option>
      <option value="2">Полупрозрачная чёрная</option>
    </select>
    <br><small>Больше тем в <a href="https://porch.website/scripts#cwredesign">Вароредизайне</a>. Не используйте темы Вароредизайна и Варомода одновременно!</small>
  </div>
  <div id="cwmodCustSet">
    <input class="cwmod-settings" id="compact" type="checkbox" ${globals.compact ? 'checked' : ''}>
    <label for="compact">Компактная игровая
      ${(($(window).width() < 1500 || $(window).height() < 700) ? ' (не рекомендуется)' : '')}
    </label><br>
      <input class="cwmod-settings" id="compactSwapSides" type="checkbox" ${globals.compactSwapSides ? 'checked' : ''}>
      <label for="compactSwapSides">Поменять местами блоки (погода, действия, «во рту», чат справа)</label><br>
      <input class="cwmod-settings" id="compactChatOnTop" type="checkbox" ${globals.compactChatOnTop ? 'checked' : ''}>
      <label for="compactChatOnTop">Чат наверху</label><br>
      <input class="cwmod-settings" id="compactRadiusEdges" type="checkbox" ${globals.compactRadiusEdges ? 'checked' : ''}>
      <label for="compactRadiusEdges">Скруглить углы</label><br>
      <div>
      <input class="cwmod-settings" id="noHistoryUnderline" type="checkbox" ${globals.noHistoryUnderline ? 'checked' : ''}>
      <label for="noHistoryUnderline">Не подчёркивать ссылки на профили в истории</label>
      </div>
      <input class="cwmod-settings" id="compactSplitInfo" type="checkbox" ${globals.compactSplitInfo ? 'checked' : ''}>
      <label for="compactSplitInfo">Разделить параметры, историю и родственные связи</label>
  </div>

<table><tr><td><label for="cw3Bkg">Фон страницы:</label></td>
<td><select class="cwmod-settings" id="cw3Bkg"><option value="0">по умолчанию</option><option value="1">фон локации</option><option value="2">свой</option></select></td></tr>
<tr><td><label for="cw3BkgImg">Картинка:</label></td><td><input class="cwmod-settings" id="cw3BkgImg" type="text" value="${globals.cw3BkgImg}"></td></tr>
<tr><td><label for="cw3BkgSize">Размер:</label></td><td><select class="cwmod-settings" id="cw3BkgSize"><option value="0">автоматически</option><option value="1">по размеру страницы</option></select></td></tr>
<tr><td><label for="cw3BkgPos">Положение:</label></td><td><select class="cwmod-settings" id="cw3BkgPos"><option value="0">вверху слева</option><option value="1">вверху по центру</option><option value="2">вверху справа</option><option value="3">по центру слева</option><option value="4">по центру</option><option value="5">по центру справа</option><option value="6">внизу слева</option><option value="7">внизу по центру</option><option value="8">внизу справа</option></select></td></tr>
</table>

</div>
<div id="cmPlayers">
  <div class="setHead" id="cwmodPlayers"><p>Игроки</p></div>
  <div>
    <input class="cwmod-settings" id="putCatsDown" type="checkbox" ${globals.putCatsDown ? 'checked' : ''}>
    <label for="putCatsDown">Опустить котов вниз клеток</label>
  </div><div>
    <input class="cwmod-settings" id="putArrowsDown" type="checkbox" ${globals.putArrowsDown ? 'checked' : ''}>
    <label for="putArrowsDown">Опустить стрелки в боережиме</label>
  </div><div>
    <input class="cwmod-settings" id="deadNotTransperent" type="checkbox" ${globals.deadNotTransperent ? 'checked' : ''}>
    <label for="deadNotTransperent">Сделать мёртвых игроков непрозрачными</label>
  </div><div>
    <input class="cwmod-settings" id="catTooltipInfo" type="checkbox" ${globals.catTooltipInfo ? 'checked' : ''}>
    <label for="catTooltipInfo">Более подробная информация</label>
    <br><small>То, что можно увидеть в кодах: рост, ссылка на окрас, степени грязи и болезней</small>
  </div><div>
    <input class="cwmod-settings" id="shortInventory" type="checkbox" ${globals.shortInventory ? 'checked' : ''}>
    <label for="shortInventory">Сокращать инвентарь</label>
    <br><small>Вместо повторения предметов одного типа писать их количество</small>
  </div><div>
    <input class="cwmod-settings" id="realism" type="checkbox" ${globals.realism ? 'checked' : ''}>
    <label for="realism">Добавить реализма</label>
  </div>
</div>
</div>

<div id="cwmodTrSix">
<div id="cmImEx">
  <div class="setHead" id="cwmodImEx"><p>Импорт и экспорт данных</p></div>

  <details><summary>Как пользоваться</summary>
    <ol>
      <li>Скопируйте нужные данные в браузере, откуда вы их хотите перенести.</li>
      <li>Вставьте их в поле «Импорт» того же раздела в браузере, куда вы их хотите перенести.</li>
      <li>Нажмите на кнопку «Объединить» («Обновить» в случае настроек).</li>
    </ol>
  </details>

  <table><tr><td colspan="2"><h4>Заметки об игроках</h4></td></tr>
  <tr><td><p>Экспорт: </p></td><td><input class="cwmod-data-export" data-export="notes" type="text" readonly> <img class="copy" title="Скопировать" alt="Скопировать" data-copy="notes" src="cw3/symbole/copy.png"></td></tr>
  <tr><td><p>Импорт: </p></td><td><input class="cwmod-data-import" data-import="notes" type="text"></td></tr>
  <tr><td colspan="2"><input class="cwmod-data-merge" data-merge="notes" type="button" value="Объединить"></td></tr></table>
  <div class="cwmod-data-result" data-result="notes"></div>


  <table><tr><td colspan="2"><h4>Личные сообщения</h4></td></tr>
  <tr><td><p>Экспорт: </p></td><td><input class="cwmod-data-export" data-export="ls" type="text" readonly> <img class="copy" title="Скопировать" alt="Скопировать" data-copy="ls" src="cw3/symbole/copy.png"></td></tr>
  <tr><td><p>Импорт: </p></td><td><input class="cwmod-data-import" data-import="ls" type="text"></td></tr>
  <tr><td colspan="2"><input class="cwmod-data-merge" data-merge="ls" type="button" value="Объединить"></td></tr></table>
  <div class="cwmod-data-result" data-result="ls"></div>


  <table><tr><td colspan="2"><h4>Настройки</h4></td></tr>
  <tr><td><p>Экспорт: </p></td><td><input class="cwmod-data-export" data-export="settings" type="text" readonly> <img class="copy" title="Скопировать" alt="Скопировать" data-copy="settings" src="cw3/symbole/copy.png"></td></tr>
  <tr><td><p>Импорт: </p></td><td><input class="cwmod-data-import" data-import="settings" type="text"></td></tr>
  <tr><td colspan="2"><input class="cwmod-data-merge" data-merge="settings" type="button" value="Обновить"></td></tr></table>
  <div class="cwmod-data-result" data-result="settings"></div>

  <table><tr><td><input id="clear-ym-storage" type="button" value="Кнопка"></td><td><p id="cwmodSaveButton">Для тех, у кого ничего не сохраняется</p></td></tr></table>
  <div id="clear-ym-storage-result"></div>
</div>
</div>
</div>
`;
  $(isDesktop ? '#branch' : '#site_table').append(html);
  try {
    $('.cwmod-data-export').each(function() {
      const key = $(this).data('export');
      $(this).val(window.localStorage.getItem('cwmod_' + key))
    });
    $(window).on('storage', function(e) {
      if (e.originalEvent.key === 'cwmod_settings') {
        $('[data-export="notes"]').val(e.originalEvent.newValue);
      }
      if (e.originalEvent.key === 'cwmod_ls') {
        $('[data-export="ls"]').val(e.originalEvent.newValue);
      }
    });
  }
  catch (err) {
    window.console.error('Варомод:', err);
  }
  $('#about-split-info').click(function(e) {
    e.preventDefault();
    showCwmodPopup('alert', '<img src="https://porch.website/cwmod/settings.png">');
  });
  $('.cwmod-data-import').click(function() {
    $(this).select();
  });
  $('.cwmod-data-merge').click(function() {
    const key = $(this).data('merge');
    mergeData(key);
  });
  $('.copy').click(function() {
    const key = $(this).data('copy');
    $(`input[data-export="${key}"]`).select();
    document.execCommand('copy');
    alert('Скопировано!');
  });
  $(`[data-conf="${hideMail}"]`).change(function() {
    if ($(this).is(':checked')) {
      addCSS(`input[name="mail"]:not(:focus) { color: #333; }`, hideMail);
    }
    else removeCSS(hideMail);
  });
  $('#clear-ym-storage').click(function() {
    try {
      window.localStorage.setItem('storage-test', Math.pow(2, 1023).toString(2));
      window.localStorage.removeItem('storage-test');
      const ymSize = window.localStorage.getItem('_ym_alt_retryReqs').length;
      if (ymSize) {
        window.localStorage.removeItem('_ym_alt_retryReqs');
        $('#clear-ym-storage-result').html(`<p>Возможно, чистка ${ymSize} байт данных Яндекс.Метрики могла помочь.</p>`);
      }
    }
    catch (err) {}
  });
}
$('.cwmod-settings').on('change', function() {
  let key = this.id;
  let val = this.type === 'checkbox' ? this.checked : this.value;
  if (this.tagName === 'SELECT') {
    val = $(this).prop('selectedIndex');
  }
  setSettings(key, val);
  console.log(key, ': ', val, '.');
});
$('#div2').on('change', '.cwmod-settings', function() {
  let key = this.id;
  let val = this.type === 'checkbox' ? this.checked : this.value;
  if (this.tagName === 'SELECT') {
    val = $(this).prop('selectedIndex');
  }
  setSettings(key, val);
  console.log(key, ': ', val, '.');
});
$(document).ready(function() {
  $('#blogAvatarsSize').val(globals.blogAvatarsSize);
  $('#blogImgMaxWid').val(globals.blogImgMaxWid);
  $('#sniffImgMaxWid').val(globals.sniffImgMaxWid);
  $('#cwmodTheme').val(globals.cwmodTheme);
  $('#cw3Bkg').val(globals.cw3Bkg);
  $('#cw3BkgImg').val(globals.cw3BkgImg);
  $('#cw3BkgSize').val(globals.cw3BkgSize);
  $('#cw3BkgPos').val(globals.cw3BkgPos);
});

function mergeData(dataKey) {
  $(`[data-result]`).empty();
  let exp = $(`[data-export="${dataKey}"]`).val();
  let imp = $(`[data-import="${dataKey}"]`).val();
  if (!imp) {
    mergeDataError(dataKey, null, ['С чем объединять-то?', '<img src="/img/stickers/systempaw2/6.png">']);
    return;
  }
  try {
    if (exp) exp = JSON.parse(exp);
  }
  catch (err) {
    window.console.error(err);
    mergeDataError(dataKey, 'export', ['Ошибка парсинга JSON']);
    return;
  }
  try {
    imp = JSON.parse(imp);
  }
  catch (err) {
    window.console.error(err);
    mergeDataError(dataKey, 'import', ['Ошибка парсинга JSON']);
    return;
  }
  const validExp = mergeDataValidate(dataKey, exp);
  if (validExp.error) {
    mergeDataError(dataKey, 'export', validExp.text);
    return;
  }
  const validImp = mergeDataValidate(dataKey, imp);
  if (validImp.error) {
    mergeDataError(dataKey, 'import', validImp.text);
    return;
  }
  let text = [];
  const merged = Object.assign({}, exp, imp);
  Object.keys(merged).forEach(function(key) {
    if (dataKey === 'settings') {
      if (DEFAULTS[key] === undefined) {
        delete merged[key];
        return;
      }
    }
    if (exp[key] && imp[key]) {
      if (dataKey === 'ls') {
        if (exp[key].catName === imp[key].catName && exp[key].savedate > imp[key].savedate) {
          merged[key] = exp[key];
        }
      }
      else if (dataKey === 'notes') {
        if (exp[key] === imp[key]) return;
        else if (exp[key].indexOf(imp[key]) !== -1) {
          merged[key] = exp[key];
          text.push(`Заметки об игроке с ID ${key}: "${exp[key]}" и "${imp[key]}" — объединены`);
        }
        else if (imp[key].indexOf(exp[key]) === -1) {
          merged[key] = exp[key] + '\n' + imp[key];
          text.push(`Заметки об игроке с ID ${key}: "${exp[key]}" и "${imp[key]}" — объединены в "${merged[key]}"`);
        }
      }
    }
  });
  console.log(merged);
  saveData(dataKey, merged);
  $('[data-export="${dataKey}"]').val(JSON.stringify(merged));
  mergeDataDone(dataKey, text);
}

function mergeDataValidate(dataKey, data) {
  let error = false
    , text = [];
  Object.keys(data).forEach(function(k) {
    if (dataKey === 'notes') {
      if (!/^\d+$/.test(k)) {
        error = true;
        text.push(`Ключ _${k}_ не ID игрока`);
      }
      if (typeof data[k] !== 'string') {
        error = true;
        text.push(`Элемент _${k}_ не заметка`);
      }
    }
    else if (dataKey === 'ls') {
      if (!/^\d+$/.test(k)) {
        error = true;
        text.push(`Ключ _${k}_ не ID сообщения`);
      }
      if (typeof data[k] !== 'object') {
        error = true;
        text.push(`Элемент _${k}_ не сообщение`);
      }
      else {
        const lsKeys = ['subject', 'text', 'type', 'savedate', 'catId', 'catName', 'date', 'myId', 'myName'];
        const thisKeys = Object.keys(data[k]);
        if (thisKeys.length !== lsKeys.length) {
          error = true;
          text.push(`Элемент ${k} не сообщение`);
        }
        else {
          let keysError = false;
          lsKeys.forEach(function(key) {
            if (thisKeys.indexOf(key) === -1) {
              keysError = true;
            }
          });
          if (keysError) {
            error = true;
            text.push(`Элемент ${k} не сообщение`);
          }
        }
      }
    }
  });
  return {
    error: error
    , text: text
  }
}

function mergeDataError(dataKey, type, text = []) {
  let errorText = 'Ошибка: ';
  const errors = {
    'export': 'неправильный формат исходных данных (в порядке всё с ними было, зачем трогать???)'
    , 'import': 'неправильный формат входных данных'
  };
  errorText += errors[type] || 'Неизвестная ошибка';
  $(`[data-result="${dataKey}"]`).append(`<p class="cwmod-error">${errorText}</p>${text.join('<br>')}`);
}

function mergeDataDone(dataKey, text = []) {
  let resultText = 'Данные успешно объединены';
  if (dataKey === 'settings') resultText = 'Настройки успешно обновлены';
  $(`[data-result="${dataKey}"]`).append(`<p class="cwmod-done">${resultText}!</p>${text.join('<br>')}`);
}

function addCSS(css, key) {
  const styleId = key ? 'cwmod-style-' + key : 'cwmod-style';
  const style = $('#' + styleId);
  if (style.length) {
    style.append(css);
  }
  else {
    $('head').append(`<style id="${styleId}">${css}</style>`);
  }
}

function removeCSS(key) {
  $('#cwmod-style-' + key).remove();
}

function loadSettings() {
  const key = 'cwmod_settings';
  try {
    SETTINGS = JSON.parse(window.localStorage.getItem(key) || '{}');
    if (SETTINGS['cw3_location_bg'] != null) {
      if (SETTINGS['cw3_location_bg']) SETTINGS[cw3Bkg] = 'location';
      delete SETTINGS['cw3_location_bg'];
    }
    if (SETTINGS['cw3_location_bg_size'] != null) {
      if (SETTINGS['cw3_location_bg_size'] === 'cover') SETTINGS[CW3_BACKGROUND_SIZE] = 'cover';
      delete SETTINGS['cw3_location_bg_size'];
    }
  }
  catch (err) {
    alert(err);
    window.localStorage.removeItem(key);
    SETTINGS = {};
  }
}

function saveData(key, data) {
  try {
    window.localStorage.setItem('cwmod_' + key, JSON.stringify(data));
  }
  catch (err) {
    window.console.error('Варомод:', err);
  }
}

function addSaveAlert() {
  window.addEventListener('beforeunload', beforeunload);
  $('input[type=submit]').click(function() {
    window.removeEventListener('beforeunload', beforeunload);
  });
}

function beforeunload(event) {
  event.preventDefault();
  event.returnValue = '';
  return '';
}

function isPage(page, match) {
  if (page instanceof RegExp) return page.test(window.location.href);
  const re = new RegExp('catwar\.su/' + page.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&') + (match ? '(#.*)?$' : ''));
  return re.test(window.location.href);
}

function secToTime(sec) {
  if (!sec) return '0 c';
  const d = Math.floor(convertTime('s d', sec));
  sec -= convertTime('d s', d);
  const h = Math.floor(convertTime('s h', sec));
  sec -= convertTime('h s', h);
  const m = Math.floor(convertTime('s m', sec));
  sec -= convertTime('m s', m);
  const s = Math.round(sec);
  let result = [];
  if (d) result.push(`<nobr>${d} д</nobr>`);
  if (h) result.push(`<nobr>${h} ч</nobr>`);
  if (m) result.push(`<nobr>${m} мин</nobr>`);
  if (s) result.push(`<nobr>${s} с</nobr>`);
  return result.join(' ');
}

function leadingZero(num) {
  return num < 10 ? '0' + num.toString() : num;
}

function escapeHTML(str) {
  return str.replace('<', '$lt;').replace('>', '$gt;');
}

function decodeHTML(str) {
  const doc = new DOMParser().parseFromString(str, "text/html");
  return doc.documentElement.textContent;
}

function getNoteByCatId(catId) {
  try {
    const savedNotes = JSON.parse(window.localStorage.getItem('cwmod_notes') || '{}');
    const text = savedNotes[catId];
    return text || false;
  }
  catch (err) {
    window.console.error('Варомод:', err);
  }
}

function addBBcode(type) {
  const bb = $('.bbcode').parent();
  if (!bb.length) return;
  if ($('.bbcode[data-code="ol"]').length) return;
  if (type) {
    bb.append(`
<button class="bbcode" title="Перенос" data-code="br" data-parameter="0">br</button>
<button class="bbcode" title="Таблица" data-code="table">table</button>
<button class="bbcode" title="Строка таблицы" data-code="tr">tr</button>
<button class="bbcode" title="Ячейка таблицы" data-code="td">td</button>
<button class="bbcode" title="Нумерованный список" data-code="ol">ol</button>
<button class="bbcode" title="Ненумерованный список" data-code="ul">ul</button>
<button class="bbcode" title="Элемент списка" data-code="li">li</button>
`);
  }
  else {
    $('[data-code="block"]').after(`
<button class="bbcode" title="Раскрывающийся блок" data-code="overblock" data-parameter="1" data-text="Введите название раскрывающегося блока (то же, что и у заголовка, который раскрывает этот блок):">overblock</button>
`);
    bb.append(`
<button class="bbcode" title="Абзац" data-code="p">p</button>
<button class="bbcode" title="Перенос" data-code="br" data-parameter="0">br</button>
<button class="bbcode" title="Таблица" data-code="table">table</button>
<button class="bbcode" title="Строка таблицы" data-code="tr">tr</button>
<button class="bbcode" title="Ячейка таблицы" data-code="td">td</button>
<button class="bbcode" title="Нумерованный список" data-code="ol">ol</button>
<button class="bbcode" title="Ненумерованный список" data-code="ul">ul</button>
<button class="bbcode" title="Элемент списка" data-code="li">li</button>
`);
  }
}

function setAvatar(catId, selector) {
  $.get('/cat' + catId.toString()
    , function(data) {
      const temp = $('<div/>', {
        html: data
      });
      let avatar = temp.find('[src*=avatar]').attr('src');
      if (!avatar) avatar = '//e.catwar.su/avatar/0.jpg';
      try {
        window.sessionStorage.setItem('avatar' + catId, avatar);
      }
      catch (err) {}
      $(selector).css('background-image', `url(${avatar})`);
    }
  );
}

function setCatName(catId, selector, oldName) {
  $.post('/preview', {
    text: `[link${catId}]`
  }, function(data) {
    data = data.replace(/<\/?div( class="parsed")?>/, '');
    $(selector).html(data);
    if (oldName && $(selector).text() !== oldName) {
      $(selector).html(data + ' (' + oldName + ')');
    }
  });
}

function getCatIdByName(name, callback) {
  $.post('/ajax/top_cat', {
    name: name
  }, function(data) {
    const catId = parseInt(data, 10);
    callback(catId);
  });
}

function getCurrentUser(callback) {
  $.get('/'
    , function(data) {
      const temp = $('<div/>', {
        html: data
      });
      const catId = temp.find('a[href^="cat"]').first().text();
      const catName = temp.find('big').first().text();
      callback(catId, catName)
    }
  );
}

function dateToString(date) {
  if (typeof date === 'number') date = new Date(date);
  const dateString = date.toISOStringLocal();
  return dateString.slice(0, 16);
}

function declOfNum(n, titles) {
  n = Math.abs(n);
  if (isNaN(n)) return titles[2];
  if (!Number.isInteger(n)) return titles[1];
  n %= 100;
  if (n > 10 && n < 20) return titles[2];
  n %= 10;
  if (n === 1) return titles[0];
  if (n > 1 && n < 5) return titles[1];
  return titles[2];
}

function convertTime(units, val) {
  const allUnits = ['ms', 's', 'm', 'h', 'd'];
  units = units.split(' ');
  let valUnit = allUnits.indexOf(units[0]);
  const resultUnit = allUnits.indexOf(units[1]);
  const multipliers = [1000, 60, 60, 24];
  if (valUnit > resultUnit)
    while (valUnit !== resultUnit) {
      val *= multipliers[valUnit - 1];
      valUnit--;
    }
  else
    while (valUnit !== resultUnit) {
      val /= multipliers[valUnit];
      valUnit++;
    }
  return val;
}

function findDate(text) {
  return text.match(/(\d?\d )?[а-я]+ (\d{4} )?в \d?\d:\d\d/i)[0];
}

function catTimeToMs(y, m, d, h, min, s) {
  // отсчёт месяцев с 0, дней с 1
  const result = (((((((y * 12 + m) * 28 + --d) * 24 + h) * 60) + min) * 60) + s) * 1000 / 7;
  return Math.round(result);
}

function timestampToCatTime(timestamp) {
  const secInYear = 12 * 28 * 24 * 60 * 60;
  const secInMonth = 28 * 24 * 60 * 60;
  const ms = timestamp - catTimeStart;
  let time = Math.round(ms / 1000 * 7);
  const year = Math.floor(time / secInYear);
  time -= year * secInYear;
  const month = Math.floor(time / secInMonth);
  time -= month * secInMonth;
  const day = Math.floor(convertTime('s d', time));
  time -= convertTime('d s', day);
  const hour = Math.floor(convertTime('s h', time));
  time -= convertTime('h s', hour);
  const minute = Math.floor(convertTime('s m', time));
  time -= convertTime('m s', minute);
  const second = time;
  return {
    year: year
    , month: month
    , day: day + 1
    , hour: hour
    , minute: minute
    , second: second
  };
}

function getNumber(s) {
  return Number(s.match(/\d+/)[0]);
}

function bbencode(html) {
  html = html.replace(/<br>/g, '[br]');
  html = html.replace(/<(\/?)b>/gm, '[$1b]');
  html = html.replace(/<(\/?)i>/gm, '[$1i]');
  html = html.replace(/<(\/?)s>/gm, '[$1s]');
  html = html.replace(/<(\/?)u>/gm, '[$1u]');
  html = html.replace(/<\/?tbody>/gm, '');
  html = html.replace(/<(\/?)table>/gm, '[$1table=0]');
  html = html.replace(/<(\/?)table border="1">/gm, '[$1table]');
  html = html.replace(/<(\/?)tr>/gm, '[$1tr]');
  html = html.replace(/<td align="center" valign="top" style="height:25px">(.(?![/b]<\/td>)+)<\/td>/gm, '[td][center]$1[/center][/td]');
  html = html.replace(/<(\/?)td>/gm, '[$1td]');
  html = html.replace(/[td][i]Цитата:[/i](.(?![/td])+)[/td]/gm, '[td][size=10][i]Цитата:[/i]$1[/size][/td]');
  html = html.replace(/<a href="([^"]+)"( target="_blank")?>/gm, '[url=$1]');
  html = html.replace(/<\/a>/gm, '[/url]');
  html = html.replace(/<img src="([^"]+)"( alt="([^"]+)")?( style="max-width: 4000px;")?>/gm, '[img]$1[/img]');
  html = html.replace(/<iframe width="640" height="390" src="https:\/\/www\.youtube\.com\/embed\/([^"]+)" frameborder="0" allowfullscreen=""><\/iframe>/gm, '[header=$1]Видеозапись[/header][br][block=$1][video]$1[/video][/block]');
  html = html.replace(/<audio controls=""><source src="([^"]+)" type="audio\/mpeg"> Воспроизведение аудиофайлов не поддерживается вашим браузером.<\/audio>/gm, '[header=$1]Аудиозапись[/header][br][block=$1][audio]$1[/audio][/block]');
  html = html.replace(/<(\/?)li>/gm, '[$1li]');
  html = html.replace(/<(\/?)ol( style="display:inline-block")?>/gm, '[$1ol]');
  html = html.replace(/<(\/?)ul( style="display:inline-block")?>/gm, '[$1ul]');
  html = html.replace(/<[^>]+>/gm, '');
  html = decodeHTML(html);
  return html;
}
})(window, document, jQuery);
