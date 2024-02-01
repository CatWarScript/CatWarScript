// ==UserScript==
// @name         CatWar Script v0.1
// @version      0.1
// @description  Новый код-скрипт для браузерной игры CatWar, разработчики которого направлены на больший контакт с аудиторией!
// @author       Krivodushie & Psiii
// @copyright    2024 Дурное Сновидение (https://catwar.su/cat1293224) & Заря (https://catwar.su/cat590698)
// @license      MIT; https://opensource.org/licenses/MIT
// @updateURL    ???
// @match        *://catwar.su/*
// @grant        GM_xmlhttpRequest
// @grant        GM.xmlHttpRequest
// @grant        GM_addStyle
// @require      https://code.jquery.com/jquery-3.4.1.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery-scrollTo/2.1.3/jquery.scrollTo.min.js
// @require      https://code.jquery.com/ui/1.12.1/jquery-ui.js
// ==/UserScript==

const csDefaults = {
   'textTemplates': true // Шаблоны в ЛС (и в будущем в других местах)
    ,'inGameClock': false // Часы в игровой
    ,'isClockMoscow': true // Московсике ли часы?
    ,'isDateShow': true // Показывать ли дату?
    ,'fieldHideButton': true // Кнопочка "Скрыть поле" в ПК-версии игры
    ,'phoneFightPanel': false // Переместить кнопочки боережима для телефонщиков
    ,'friendlyCatWar': false // Удалить кнопки захода в опасные БР
    ,'nightLagsWarning': true // Предупреждение о ночных лагах чтобы не лезли в воды и вообще аккуратнее были
    ,'dontReadenLS': false // Непрочитанные ЛС для себя
    ,'timerForLS': false // Таймер до удаления ЛС
    ,'hideWoundWarning': true // скрыть варн о ранах везде кроме Игровой
    ,'hideInGameBlocks': false // Скрывать в игровой при загрузке блоки:
    ,'isHideHistory': false // Скрывать ли историю?
    ,'isHideRelatives': false // Скрывать ли РС?
    ,'isHideParameters': false // Скрывать ли параметры/навыки?
    ,'customDefectDelay': false // Подробная настройка отображения дефектов в Игровой
    ,'cstmDfctWounds': '#4646ff' // Цвет ран по дефолту
    ,'cstmDfctBruise': '#46ffef' // Цвет ушибов от падения
    ,'cstmDfctFractures': '#68ff46' // Цвет переломов от утопленя
    ,'cstmDfctPoison': '#ff4646' // Цвет отравления
    ,'cstmDfctCough': '#eeff46' // Цвет кашля
    ,'cstmDfctDirt': '#9446ff' // Цвет грязи
    ,'cstmDfctPodstilki' : '#79553D'
    ,'cstmDfctOpacity': '0.25' // Прозрачность отображения дефектов
    ,'cstmDfctShowColors': false // Показывать ли цветные клетки при дефектах?
    ,'cstmDfctShowNum': true // Показывать ли цифры и иконки при дефектах?
    ,'cstmDfctShowHighDirt': false // Показывать ли 3-4 стадии грязи?
    ,'cstmDfctShowLowDirt': false // Показывать ли 1-2 стадии грязи?
    ,'cstmDfctShowDivers' : false // Показывать ныряющих
    ,'cstmDfctShowPodstilki' : false // Показывать podstilki
    ,'cstmDfctShow34WoundBetter': true // Показывать ли 3-4 стадии ран сильнее?
    ,'cstmDfctShowAllBetter': false // Показывать ли 3-4 стадии ВСЕГО сильнее?
    ,'customItemsDelay': false // Подробная настройка отображения предметов в Игровой
    ,'cstmItmHerbDelay': false // Травы
    ,'cstmItmHerbClr': '#2bff75' // Травы
    ,'cstmItmMossDelay': false // Мох
    ,'cstmItmMossClr': '#2bff75' // Мох
    ,'cstmItmWebDelay': false // Паутина
    ,'cstmItmWebClr': '#2bff75' // Паутина
    ,'cstmItmStickDelay': false // STICKS
    ,'cstmItmStickClr': '#2bff75' // STICKS
    ,'cstmItmDustDelay': false // Звёздная пыль
    ,'cstmItmDustClr': '#c096e2' // Звёздная пыль
    ,'cstmItmMusorDelay' : false // MUSOR
    ,'cstmItmMusorClr' : '#ff2b2b' // MUSOR
    ,'cstmItmOpacity': '0.25' // Прозрачность отображения ресурсов
  ,'scrollDownTime': false // Время при прокрутке страницы вниз для ПК-версии игры
  ,'rllyImportantButton': true // РЕАЛЬНО важная кнопка
  ,'boneCorrectTimer': false // Таймер ношения костоправов
};

const globals = {}; //Настройки
for (var key in csDefaults) {
  let settings = getSettings(key);
  if (settings === null) {
    globals[key] = csDefaults[key];
  }
  else {
    if (Array.isArray(csDefaults[key])) {
      globals[key] = JSON.parse(settings);
    }
    else if (typeof csDefaults[key] === 'number') {
      globals[key] = parseFloat(settings);
    }
    else {
      globals[key] = settings;
    }
  }
}

function getSettings(key) { //Получить настройку
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

function setSettings(key, val) { // Задать настройку
  let setting = 'cs_n_' + key;
  window.localStorage.setItem(setting, String(val));
  globals[key] = val; // Записываем новое значение в globals
}

function removeSettings(key) { // Удалить настройку
  let setting = 'cs_n_' + key;
  window.localStorage.removeItem(setting);
}

function nightLagsWarning() {
  function showWarning() {
    let now = new Date();
    now.setHours(now.getUTCHours() + 3);
    let hours = now.getHours();
    let minutes = now.getMinutes();
    if ((hours === 2 && minutes >= 50) || (hours === 3) || (hours === 4 && minutes <= 10)) {
      if ($('#warning').length === 0) {
        let warningHtml = `<div id="warning" style="background: white; font-weight: bold; text-align: justify; padding: 2px 10px; position: fixed; z-index: 1;">
                          Настоятельно рекомендуем Вам покинуть локации для лазания и ныряния в промежутке с 03:00 до 04:00 по МСК. В случае продолжения нахождения на них не используйте горячие клавиши при перемещении между локациями, а также не нажимайте на переходы по несколько раз. Некоторый контент может находиться под данным уведомлением. <a id="hideWarning" href="#">Скрыть</a>
                          </div>`;
        $('body').prepend(warningHtml);
        $('#hideWarning').click(function() {
          $('#warning').remove();
        });
      }
    }
    else {
      $('#warning').remove();
    }
  }
  showWarning();
}

function appendToElementOrPrependFallback(primaryElement, secondaryElement, elementToAdd) {
  if ($(primaryElement).length) {
    $(primaryElement).append(elementToAdd);
  }
  else {
    $(secondaryElement).before(elementToAdd);
  }
}

function appendToElementOrFallback(primaryElement, secondaryElement, elementToAdd) {
  if ($(primaryElement).length) {
    $(primaryElement).append(elementToAdd);
  }
  else {
    $(secondaryElement).append(elementToAdd);
  }
}

const pageurl = window.location.href;
const isCW3 = (/^https:\/\/\w?\.?catwar.su\/cw3(?!(\/kns|\/jagd))/.test(pageurl));
const isSite = !(/^https:\/\/\w?\.?catwar.su\/cw3(\/kns|\/jagd)?.*/.test(pageurl));
const isDM = (/^https:\/\/\w?\.?catwar.su\/ls/.test(pageurl));
const isSett = (/^https:\/\/\w?\.?catwar.su\/settings/.test(pageurl));
const isMyCat = (/^https:\/\/\w?\.?catwar.su\/$/.test(pageurl));
const isAll = (/^https:\/\/\w?\.?catwar.su\/.*/.test(pageurl));
try {
  if (isCW3) cw3();
  if (isDM) dm();
  if (isSite) site();
  if (isSett) sett();
  if (isMyCat) myCat();
  if (isAll) all();
}
catch (error) {
  console.error("An error occurred: ", error);
}

function sett() {
  const html = `<div id="cwsSet"><i>(c) CWScript</i><b>Настройки</b><div id="cwsSetList"><div><input class="cs-set" id="textTemplates" type="checkbox"${globals.textTemplates?' checked':''}><label for="textTemplates">Отображать шаблоны для личных сообщений</label></div><hr>
                <div><input class="cs-set" id="inGameClock" type="checkbox"${globals.inGameClock?' checked':''}><label for="inGameClock">Включить часы</label></div>
                <div><input class="cs-set" id="showDate" type="checkbox"${globals.isDateShow?' checked':''}><label for="showDate">Показывать дату</label></div>
                <table><tr><td><div><input class="cs-set" id="deviceTime" type="radio" name="timeSource"${!globals.isClockMoscow?' checked':''}><label for="deviceTime">Время с устройства</label></div></td>
                <td><div><input class="cs-set" id="moscowTime" type="radio" name="timeSource"${globals.isClockMoscow?' checked':''}><label for="moscowTime">Московское время</label></div></td></tr></table><hr>
                <div><input class="cs-set" id="phoneFightPanel" type="checkbox"${globals.phoneFightPanel?' checked':''}><label for="phoneFightPanel">Переместить кнопочки окошка БР для телефонщиков</label></div><hr>
                <div><input class="cs-set" id="deleteDangerModes" type="checkbox"${globals.deleteDangerModes?' checked':''}><label for="deleteDangerModes">Убрать кнопки входа в опасные боережимы</label></div><hr>
                <div><input class="cs-set" id="nightLagsWarning" type="checkbox"${globals.nightLagsWarning?' checked':''}><label for="nightLagsWarning">Уведомление в период с 03:00 по 04:00 по МСК</label></div><hr>
                <div id="dontRdnLS"><input class="cs-set" id="dontReadenLS" type="checkbox"${globals.dontReadenLS?' checked':''}><label for="dontReadenLS">Функция “Непрочитанное ЛС” только для себя</label></div><hr>
                <div><input class="cs-set" id="timerForLS" type="checkbox"${globals.timerForLS?' checked':''}><label for="timerForLS">Таймер до удаления сообщений в ЛС</label></div><hr>
                <div><input class="cs-set" id="hideWoundWarning" type="checkbox"${globals.hideWoundWarning?' checked':''}><label for="hideWoundWarning">Убрать предупреждение "Вы ранены" со всех страниц сайта</label></div><hr>
                <div><input class="cs-set" id="customDefectDelay" type="checkbox"${globals.customDefectDelay?' checked':''}><label for="customDefectDelay">Выделение болезней циферкой/подсветкой в Игровой</label></div>
                <div><input class="cs-set" id="cstmDfctShowColors" type="checkbox"${globals.cstmDfctShowColors?' checked':''}><label for="cstmDfctShowColors">Подсвечивать клетку игрока с болезнями</label></div>
                <div><input class="cs-set" id="cstmDfctShowNum" type="checkbox"${globals.cstmDfctShowNum?' checked':''}><label for="cstmDfctShowNum">Показывать иконки и цифры болезней</label></div>
                <div><input class="cs-set" id="cstmDfctShowLowDirt" type="checkbox"${globals.cstmDfctShowLowDirt?' checked':''}><label for="cstmDfctShowLowDirt">Подсвечивать клетку игрока с 1-2 стадией грязи</label></div>
                <div><input class="cs-set" id="cstmDfctShowHighDirt" type="checkbox"${globals.cstmDfctShowHighDirt?' checked':''}><label for="cstmDfctShowHighDirt">Подсвечивать клетку игрока с 3-4 стадией грязи</label></div>
                <div><input class="cs-set" id="cstmDfctShow34WoundBetter" type="checkbox"${globals.cstmDfctShow34WoundBetter?' checked':''}><label for="cstmDfctShow34WoundBetter">Выделять сильнее 3-4 стадии ран</label></div>
                <div><input class="cs-set" id="cstmDfctShowAllBetter" type="checkbox"${globals.cstmDfctShowAllBetter?' checked':''}><label for="cstmDfctShowAllBetter">Выделять сильнее 3-4 стадии всех болезней</label></div><hr>
                <div><input class="cs-set" id="cstmDfctShowDivers" type="checkbox"${globals.cstmDfctShowDivers?' checked':''}><label for="cstmDfctShowDivers">Показывать ныряющих</label></div><hr>
                <div><input class="cs-set" id="cstmDfctShowPodstilki" type="checkbox"${globals.cstmDfctShowPodstilki?' checked':''}><label for="cstmDfctShowPodstilki">Показывать заподстиленных</label></div><hr>
                <div><input class="cs-set" id="customItemsDelay" type="checkbox"${globals.customItemsDelay?' checked':''}><label for="customItemsDelay">Подсвечивание клеток с полезными ресурсами в Игровой</label></div>
                <div><input class="cs-set" id="cstmItmHerbDelay" type="checkbox"${globals.cstmItmHerbDelay?' checked':''}><label for="cstmItmHerbDelay">Подсвечивать травы, мёд и целебные водоросли</label></div>
                <div><input class="cs-set" id="cstmItmMossDelay" type="checkbox"${globals.cstmItmMossDelay?' checked':''}><label for="cstmItmMossDelay">Подсвечивать мох (обычный, водяной, с желчью)</label></div>
                <div><input class="cs-set" id="cstmItmWebDelay" type="checkbox"${globals.cstmItmWebDelay?' checked':''}><label for="cstmItmWebDelay">Подсвечивать паутину</label></div>
                <div><input class="cs-set" id="cstmItmStickDelay" type="checkbox"${globals.cstmItmStickDelay?' checked':''}><label for="cstmItmStickDelay">Подсвечивать крепкие ветки, вьюнки, костоправы и плотные водоросли</label></div>
                <div><input class="cs-set" id="cstmItmDustDelay" type="checkbox"${globals.cstmItmDustDelay?' checked':''}><label for="cstmItmDustDelay">Подсвечивать звёздную пыль</label></div>
                <div><input class="cs-set" id="cstmItmMusorDelay" type="checkbox"${globals.cstmItmMusorDelay?' checked':''}><label for="cstmItmMusorDelay">Подсвечивать травящие предметы</label></div><hr>
                <div><input class="cs-set" id="reallyImportantButton" type="checkbox"${globals.reallyImportantButton?' checked':''}><label for="reallyImportantButton">Кнопка "Удалить вар"</label></div><hr>
                <div><input class="cs-set" id="boneCorrectTimer" type="checkbox"${globals.boneCorrectTimer?' checked':''}><label for="boneCorrectTimer">Напоминание снимать костоправ</label></div><br></div><br></div><br>`
  appendToElementOrFallback('#branch', 'a[href="del"]', html);
  let cssForSett = `<style>
                div#cwsSet>b {
                display: block;
                text-align: center;
                font-size: 23px;
                padding: 10px;
                margin-top: -23px;
                letter-spacing: 15px;
                text-transform: uppercase;
                border: 3px solid var(--brdrClr1);
                margin-bottom: 10px;
                background-color: var(--bckgClr1);
                color: var(--txtClr1); }

                div#cwsSet>i {
                display: block;
                text-align: right;
                padding-top: 5px;
                padding-right: 10px;
                font-size: 11px;
                color: var(--txtClr1); }

                div#cwsSet {
                background-color: var(--bckgClr2);
                border: 3px solid var(--brdrClr1);
                color: var(--txtClr2);
                font-family: Montserrat; }

                div#cwsSetList {
                max-height: 500px;
                overflow: auto;
                background-color: var(--bckgClr2);
                color: var(--txtClr2); }

                div#cwsSetList::-webkit-scrollbar {
                width: 13px;  }

                div#cwsSetList::-webkit-scrollbar-track {
                background: var(--scrlClr1) !important; }

                div#cwsSetList::-webkit-scrollbar-thumb {
                background: var(--scrlClr2) !important; }

                div#cwsSetList>hr {
                border: 0.5px solid var(--hrClr1);
                margin: 10px auto; }

                div#cwsSetList>table>tbody>tr>td>div {
                margin-top: 3px;
                margin-right: 30px; }

                table#dfctSet {
                margin-left: 4px; }

                table#dfctSet, table#dfctSet>tbody>tr, table#dfctSet>tbody>tr>td {
                border: 3px solid var(--hrClr1);
                font-weight: bold;
                font-size: 13px;
                text-align: center; }

                table#dfctSet>tbody>tr>td {
                padding: 10px; }

                table#dfctSet>tbody>tr.dfctName {
                background: var(--hrClr1) }

                div#dfctOpacity, div#itmOpacity {
                margin-left: 4px; }

                div#dfctOpacity>input, div#itmOpacity>input {
                margin-top: 8px;
                margin-bottom: 8px; }

                input#cstmDfctOpacity {
                border: 3px solid var(--hrClr1);
                width: 208px;
                margin-left: 0.3px; }

                input#cstmItmOpacity {
                border: 3px solid var(--hrClr1);
                width: 220px;
                margin-left: 0.3px; }

                button#resetDefectSettings, button#resetItemSettings {
                margin-left: 4px; }

                button#resetDefectSettings:hover, button#resetItemSettings:hover {
                border: 1px solid var(--brdrClr2); }
                </style>
                `
  $('head').append(cssForSett);
  $('.cs-set').on('change', function() {
    let key = this.id;
    let val = this.type === 'checkbox' ? this.checked : this.value;
    setSettings(key, val);
  });
  let settingsToResetDfct = [
    'customDefectDelay', 'cstmDfctWounds', 'cstmDfctBruise', 'cstmDfctFractures',
    'cstmDfctPoison', 'cstmDfctCough', 'cstmDfctDirt', 'cstmDfctOpacity',
    'cstmDfctShowColors', 'cstmDfctShowNum', 'cstmDfctShowHighDirt',
    'cstmDfctShowLowDirt', 'cstmDfctShow34WoundBetter', 'cstmDfctShowAllBetter'
  ];
  let settingsToResetItm = [
    'customItemsDelay', 'cstmItmHerbDelay', 'cstmItmHerbClr', 'cstmItmMossDelay',
    'cstmItmMossClr', 'cstmItmWebDelay', 'cstmItmWebClr', 'cstmItmStickDelay',
    'cstmItmStickClr', 'cstmItmDustDelay', 'cstmItmDustClr', 'cstmItmOpacity', 'cstmItmMusorDelay', 'cstmItmMusorClr'
  ];

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
  $('#resetDefectSettings').on('click', function() {
    resetSettings(settingsToResetDfct);
  });
  $('#resetItemSettings').on('click', function() {
    resetSettings(settingsToResetItm);
  });
  $(document).ready(function() {
    function toggleCustomDefectDelay() {
      $('#cstmDfctWounds, #cstmDfctBruise, #cstmDfctFractures, #cstmDfctPoison, #cstmDfctCough, #cstmDfctDirt, #cstmDfctOpacity, #cstmDfctShowColors, #cstmDfctShowNum, #cstmDfctShowHighDirt, #cstmDfctShowLowDirt, #cstmDfctShow34WoundBetter, #cstmDfctShowAllBetter').prop('disabled', !$('#customDefectDelay').is(':checked'));
    }
    $('#customDefectDelay').change(toggleCustomDefectDelay);
    toggleCustomDefectDelay();

    function toggleCustomItemsDelay() {
      $('#cstmItmHerbDelay, #cstmItmHerbClr, #cstmItmMossDelay, #cstmItmMossClr, #cstmItmWebDelay, #cstmItmWebClr, #cstmItmStickDelay, #cstmItmStickClr, #cstmItmDustDelay, #cstmItmDustClr, #cstmItmOpacity, #cstmItmMusorDelay, #cstmItmMusorClr').prop('disabled', !$('#customItemsDelay').is(':checked'));
    }
    $('#customItemsDelay').change(toggleCustomItemsDelay);
    toggleCustomItemsDelay();

    function toggleTimeBlock() {
      $('#deviceTime, #moscowTime, #showDate').prop('disabled', !$('#inGameClock').is(':checked'));
    }
    $('#inGameClock').change(toggleTimeBlock);
    toggleTimeBlock();
  });
}


function dm() {
  if (globals['dontReadenLS']) {
    function updateDontReadCounter() {
      let count = $('.dontReaden').length;
      localStorage.setItem('dontReadenCount', count);
      $('#dontReadCounter').text(count > 0 ? '(' + count + ')' : '');
    }

    function updateDontReadenMessages() {
      $('#messList tr').each(function() {
        if (!$(this).hasClass('msg_notRead') && !$(this).find('.dontReadButton').length) {
          $(this).append('<td><button class="dontReadButton">Н</button></td>');
          if (localStorage.getItem('message' + $(this).index())) {
            $(this).addClass('dontReaden');
          }
        }
      });
    }
    $(document).on('click', '.dontReadButton', function() {
      let row = $(this).closest('tr');
      if (row.hasClass('dontReaden')) {
        row.removeClass('dontReaden');
        localStorage.removeItem('message' + row.index());
      }
      else {
        row.addClass('dontReaden');
        localStorage.setItem('message' + row.index(), true);
      }
      updateDontReadCounter();
    });
    $(document).on('click', '.msg_open', function() {
      let row = $(this).closest('tr');
      if (row.hasClass('dontReaden')) {
        row.removeClass('dontReaden');
        localStorage.removeItem('message' + row.index());
        updateDontReadCounter();
      }
    });
    setInterval(updateDontReadenMessages, 1000);
    setInterval(updateDontReadCounter, 1000);
    let dontreadencss = `<style>.dontReaden {
    background-color: #bb8deb;}</style>`
    $('head').append(dontreadencss);
  }
  if (globals['timerForLS']) {
    let script = document.createElement('script');
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.1/moment.min.js";
    document.getElementsByTagName('head')[0].appendChild(script);

    function updateMessageStyles() {
      if (typeof moment !== "undefined") {
        let now = moment();
        $('#messList tr').each(function(index, element) {
          if (index === 0) return;
          if ($(element).attr('class') === 'msg_read') {
            return;
          }
          let dateText = $(element).find('td:nth-child(3)').text();
          let messageDate = moment(dateText, 'YYYY-MM-DD HH:mm:ss');
          let diffDays = now.diff(messageDate, 'days');
          if (diffDays > 6 && diffDays <= 14) {
            $(element).addClass('old-message');
            $(element).css('background-color', '#ff7777');
          }
        });
      }
      else {
        setTimeout(updateMessageStyles, 100);
      }
    }
    updateMessageStyles();
    setInterval(updateMessageStyles, 1000);
  }
  if (globals['textTemplates']) {
    function checkForForm() {
      let form = document.querySelector('#write_form');
      if (form && !form.classList.contains('templates-added')) {
        add_templates();
        form.classList.add('templates-added');
      }
    }
    checkForForm();
    let observer = new MutationObserver((mutationsList, observer) => {
      for (let mutation of mutationsList) {
        if (mutation.type === 'childList') {
          checkForForm();
        }
      }
    });
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    function add_templates() {
      if ((/^https:\/\/\w?\.?catwar.su\/ls\?new$/.test(window.location.href))) {
        $(document).ready(function() {
          setTimeout(function() {
            initScript();
          }, 70);
        });

        function initScript() {
          'use strict';
          console.log('Script loaded successfully');
          let templates = localStorage.getItem('templates') ? JSON.parse(localStorage.getItem('templates')) : [];

          function renderTemplates() {
            let list = $('.patternlist');
            list.empty();
            templates.forEach(function(template, index) {
              let templateText = '<div class="patternline"><a href="#" class="name" data-index="' + index + '">' + template.name + '</a> <a href="#" class="delete" data-index="' + index + '">[X]</a> <a href="#" class="edit" data-index="' + index + '">[✍]</a><hr><div>';
              list.append(templateText);
            });
            console.log('Templates rendered successfully');
          }
          let writeForm = $('form#write_form');
          if (writeForm.length === 0) {
            console.error('Write form not found');
            return;
          }
          console.log('Write form found');
          writeForm.find('.patternblock').remove();
          writeForm.prepend('<div class="patternblock"><i>(c) CWScript</i><b>Шаблоны</b><div class="patternlist"></div></div>');
          let patternBlock = writeForm.find('.patternblock');
          let createButton = $('<a href="#" id="createButton">Создать новый шаблон</a>').click(function(e) {
            e.preventDefault();
            console.log('Create button clicked');
            $(this).hide();
            let inputField = $('<input type="text" id="templateName" placeholder="Введите название шаблона"></input>');
            let okButton = $('<button id="templateBtnOK" class="templateBtns">OK</button>').click(function() {
              console.log('OK button clicked');
              let templateName = inputField.val();
              if (templateName) {
                let currentContent = $('#text').val();
                let newTemplate = {
                  name: templateName,
                  content: currentContent
                };
                templates.push(newTemplate);
                localStorage.setItem('templates', JSON.stringify(templates));
                renderTemplates();
                inputField.remove();
                okButton.remove();
                cancelButton.remove();
                createButton.show();
              }
            });
            let cancelButton = $('<button id="templateBtnUndo" class="templateBtns">Отмена</button>').click(function() {
              console.log('Cancel button clicked');
              inputField.remove();
              okButton.remove();
              cancelButton.remove();
              createButton.show();
            });
            $(this).after(inputField, okButton, '  ', cancelButton);
          });
          patternBlock.append(createButton);
          writeForm.off('click', '.delete').on('click', '.delete', function(e) {
            e.preventDefault();
            let templateIndex = $(this).data('index');
            let templateName = templates[templateIndex].name;
            if (confirm('Точно ли вы хотите удалить шаблон "' + templateName + '"?')) {
              templates.splice(templateIndex, 1);
              localStorage.setItem('templates', JSON.stringify(templates));
              renderTemplates();
            }
          });
          writeForm.off('click', '.edit').on('click', '.edit', function(e) {
            e.preventDefault();
            let templateIndex = $(this).data('index');
            let template = templates[templateIndex];
            if (template) {
              let templateContent = template.content;
              $('#text').val(templateContent);
              let saveButton = $('#templateBtnSaveChanges');
              if (saveButton.length === 0) {
                saveButton = $('<button id="templateBtnSaveChanges">Сохранить шаблон</button><br><br>');
                writeForm.append(saveButton);
              }
              saveButton.off('click').click(function(e) {
                e.preventDefault();
                console.log('Save changes button clicked');
                let editedContent = $('#text').val();
                templates[templateIndex].content = editedContent;
                localStorage.setItem('templates', JSON.stringify(templates));
                renderTemplates();
                $('#text').val('');
              });
            }
          });
          writeForm.on('click', '.name', function(e) {
            e.preventDefault();
            let templateIndex = $(this).data('index');
            let template = templates[templateIndex];
            if (template) {
              $('#text').val(template.content);
              $('#subject').val(template.name);
            }
          });
          renderTemplates();
        }
      }
    }
  }
  let css = `<style>
            button#templateBtnOK, button#templateBtnUndo, button#templateBtnSaveChanges {
            background-color: var(--bckgClr3);
            color: var(--txtClr3);
            border: 1px solid var(--brdrClr3);
            font-family: Verdana;
            font-size: .9em; }

            button#templateBtnOK:hover, button#templateBtnUndo:hover, button#templateBtnSaveChanges:hover {
            border: 1px solid var(--brdrClr2); }

            div.patternblock {
            border: 3px solid var(--brdrClr1);
            margin-bottom: 10px;
            background-color: var(--bckgClr1);
            color: var(--txtClr1);
            font-family: Montserrat; }

            div.patternlist {
            max-height: 140px;
            overflow: auto;
            background-color: var(--bckgClr2);
            color: var(--txtClr2); }

            div.patternlist::-webkit-scrollbar {
            width: 13px;  }

            div.patternlist::-webkit-scrollbar-track {
            background: var(--scrlClr1) !important; }

            div.patternlist::-webkit-scrollbar-thumb {
            background: var(--scrlClr2) !important; }

            div.patternline>hr {
            border: 0.5px solid var(--hrClr1);
            margin: 0;
            margin-top: 6px; }

            div.patternline:hover {
            background: var(--bckgClr4) !important;
            transition: 0.8s; }

            div.patternline {
            transition: 0.8s;
            padding-top: 6px;
            color: var(--txtClr2); }

            div.patternline>a {
            color: var(--txtClr2); }

            div.patternblock>b {
            border: 3px solid var(--brdrClr1);
            display: block;
            text-align: center;
            font-size: 23px;
            padding: 10px;
            margin-top: -23px;
            letter-spacing: 15px;
            text-transform: uppercase; }

            div.patternblock>i {
            display: block;
            text-align: right;
            padding-top: 5px;
            padding-right: 10px;
            font-size: 11px; }

            .patternline>a.name {
            display: block;
            max-width: 80px;
            padding-right: 80%;
            margin-left: 5px; }

            .patternline>a.delete {
            display: block;
            max-width: 80px;
            margin-top: -17px;
            margin-left: auto;
            margin-right: 0; }

            .patternline>a.edit {
            display: block;
            max-width: 50px;
            margin-top: -19px;
            margin-left: auto;
            margin-right: 0; }

            a#createButton {
            display: block;
            padding: 5px;
            color: var(--txtClr1); }

            button#templateBtnSaveChanges {
            margin-top: 1px; }

            input#templateName {
            width: 20% !important;
            margin: 4px auto; }

            button.templateBtns {
            overflow: auto; }

            button.templateBtns {
            margin-top: 4px; }

            button#templateBtnOK {
            margin-left: 10px;
            margin-right: 3px; }
            </style>`
  $('head').append(css);
}


function cw3() {
  if (globals['inGameClock']) {
    let clockHtml = `<div id="clockContainer">
            <div id="clock"></div>
            <div id="date"></div>
            </div>
            <style>
            div#clockContainer {
            font-family: Montserrat;
            background-color: var(--bckgClr1);
            border: 3px solid var(--brdrClr1);
            color: var(--txtClr1);
            padding: 5px 5px 5px 10px;
            font-weight: bold;
            font-size: 15px; }
            </style>`
    $('#tr_actions').after(clockHtml);
  }
  if (globals['customDefectDelay']) { // Включить отображение дефектов в игровой
    let cstmDfctStyle = `<style id='cstmDfctStyle'></style>`
    $('head').append(cstmDfctStyle);
    /* $(document).ready(function() {
       $('div.d').each(function() {
         var style = $(this).attr('style');
         if (style.includes('disease')) {
           $(this).addClass('disease');
         }
         if (style.includes('trauma')) {
           $(this).addClass('trauma');
         }
         if (style.includes('drown')) {
           $(this).addClass('drown');
         }
         if (style.includes('wound')) {
           $(this).addClass('wound');
         }
         if (style.includes('poisoning')) {
           $(this).addClass('poisoning');
         }
       });
     }); */
    if (globals['cstmDfctShowColors']) { // Включить подсветку клетки с больными
      let cstmDfctColors = `
            div[style*="/defects/disease/"] {background-color: rgba(238, 255, 70, 0.4) !important; padding-top: 16px !important;}
            div[style*="/defects/trauma/"] {background-color: rgba(70, 255, 254, 0.4) !important; padding-top: 16px !important;}
            div[style*="/defects/drown/"] {background-color: rgba(104, 255, 70, 0.4) !important; padding-top: 16px !important;}
            div[style*="/defects/wound/"] {background-color: rgba(70, 70, 255, 0.4) !important; padding-top: 16px !important;}
            div[style*="/defects/poisoning/"] {background-color: rgba(255, 70, 70, 0.4) !important; padding-top: 16px !important;}
            `
      $('#cstmDfctStyle').append(cstmDfctColors);
    }
    if (globals['cstmDfctShowNum']) { // Включить добавление иконок и цифр на клетках с больными
      let cstmDfctNum = `
            /* КАШЕЛЬ */
            #tr_field [style*='disease/1']{
            content: url(https://raw.githubusercontent.com/CatWarScript/CatWarScript/main/Болезни/Кашель%201.png) !important; }

            /* СКАЛЫ */
            #tr_field [style*='trauma/1'] {
            content: url(https://raw.githubusercontent.com/CatWarScript/CatWarScript/main/Болезни/Ушибы%201.png) !important; }

            #tr_field [style*='trauma/2'] {
            content: url(https://raw.githubusercontent.com/CatWarScript/CatWarScript/main/Болезни/Ушибы%202.png) !important; }

            #tr_field [style*='trauma/3'] {
            content: url(https://raw.githubusercontent.com/CatWarScript/CatWarScript/main/Болезни/Ушибы%203.png) !important; }

            #tr_field [style*='trauma/4'] {
            content: url(https://raw.githubusercontent.com/CatWarScript/CatWarScript/main/Болезни/Ушибы%204.png) !important; }

            /* ВОДЫ */
            #tr_field [style*='drown/1'] {
            content: url(https://raw.githubusercontent.com/CatWarScript/CatWarScript/main/Болезни/Переломы%201.png) !important; }

            #tr_field [style*='drown/2'] {
            content: url(https://raw.githubusercontent.com/CatWarScript/CatWarScript/main/Болезни/Переломы%202.png) !important; }

            #tr_field [style*='drown/3'] {
            content: url(https://raw.githubusercontent.com/CatWarScript/CatWarScript/main/Болезни/Переломы%203.png) !important; }

            #tr_field [style*='drown/4'] {
            content: url(https://raw.githubusercontent.com/CatWarScript/CatWarScript/main/Болезни/Переломы%204.png) !important; }

            /* РАНЫ */
            #tr_field [style*='wound/1'] {
            content: url(https://raw.githubusercontent.com/CatWarScript/CatWarScript/main/Болезни/Раны%201.png) !important; }

            #tr_field [style*='wound/2'] {
            content: url(https://raw.githubusercontent.com/CatWarScript/CatWarScript/main/Болезни/Раны%202.png) !important; }

            #tr_field [style*='wound/3'] {
            content: url(https://raw.githubusercontent.com/CatWarScript/CatWarScript/main/Болезни/Раны%203.png) !important; }

            #tr_field [style*='wound/4'] {
            content: url(https://raw.githubusercontent.com/CatWarScript/CatWarScript/main/Болезни/Раны%204.png) !important; }

            /* ОТРАВЛЕНИЕ */
            #tr_field [style*='poisoning/1'] {
            content: url(https://raw.githubusercontent.com/CatWarScript/CatWarScript/main/Болезни/Отравление%201.png) !important; }

            #tr_field [style*='poisoning/2'] {
            content: url(https://raw.githubusercontent.com/CatWarScript/CatWarScript/main/Болезни/Отравление%202.png) !important; }

            #tr_field [style*='poisoning/3'] {
            content: url(https://raw.githubusercontent.com/CatWarScript/CatWarScript/main/Болезни/Отравление%203.png) !important; }

            #tr_field [style*='poisoning/4'] {
            content: url(https://raw.githubusercontent.com/CatWarScript/CatWarScript/main/Болезни/Отравление%204.png) !important; }
            `
      $('#cstmDfctStyle').append(cstmDfctNum);
    }
    if (globals['cstmDfctShowHighDirt']) {
      if (globals['cstmDfctShowColors']) { // Показывать 3-4 стадии грязи подсветкой клеток
        let highDirtColors = `
            div[style*='dirt/base/1/3'], div[style*='dirt/base/2/3'], div[style*='/dirt/base/1/4.png'], div[style*='dirt/base/2/4'] {
            background-color: rgba(146, 70, 255, 0.4) !important;
            padding-top: 16px !important;}

            ol.mouth>li>div.e>div[style*='dirt/base/1/3'], ol.mouth>li>div.e>div[style*='dirt/base/2/3'], ol.mouth>li>div.e>div[style*='dirt/base/1/4'], ol.mouth>li>div.e>div[style*='dirt/base/2/4'] {
            background-color: rgba(146, 70, 255, 0.4) !important;
            padding-top: 16px !important;}
            `
        $('#cstmDfctStyle').append(highDirtColors);
      }
      if (globals['cstmDfctShowNum']) { // Подсветка 3-4 стадий грязи иконкой и цифрой
        let highDirtNum = `
            #tr_field [style*='/dirt/base/1/3.png'], #tr_field [style*='dirt/base/2/3'] {
            content: url(https://raw.githubusercontent.com/CatWarScript/CatWarScript/main/Болезни/Грязь%203.png) !important; }

            #tr_field [style*='/dirt/base/1/4.png'], #tr_field [style*='dirt/base/2/4'] {
            content: url(https://raw.githubusercontent.com/CatWarScript/CatWarScript/main/Болезни/Грязь%204.png) !important; }
            `
        $('#cstmDfctStyle').append(highDirtNum);
      }
    }
    if (globals['cstmDfctShowLowDirt']) {
      if (globals['cstmDfctShowColors']) { // Подсветка 1-2 стадий грязи подсветкой клеток
        let lowDirtColors = `
            div[style*='dirt/base/1/1'], div[style*='dirt/base/2/1'], div[style*='/dirt/base/1/2.png'], div[style*='dirt/base/2/2'] {
            background-color: rgba(146, 70, 255, 0.4) !important;
            padding-top: 16px !important;}

            ol.mouth>li>div.e>div[style*='dirt/base/1/1'], ol.mouth>li>div.e>div[style*='dirt/base/2/1'], ol.mouth>li>div.e>div[style*='dirt/base/1/2'], ol.mouth>li>div.e>div[style*='dirt/base/2/2'] {
            background-color: rgba(146, 70, 255, 0.4) !important;
            padding-top: 16px !important;}
            `
        $('#cstmDfctStyle').append(lowDirtColors);
      }
      if (globals['cstmDfctShowNum']) { // Подсветка 1-2 стадий грязи иконкой и цифрой
        let lowDirtNum = `
            #tr_field [style*='dirt/base/1/1'], #tr_field [style*='dirt/base/2/1'] {
            content: url(https://raw.githubusercontent.com/CatWarScript/CatWarScript/main/Болезни/Грязь%201.png) !important; }

            #tr_field [style*='/dirt/base/1/2.png'], #tr_field [style*='dirt/base/2/2'] {
            content: url(https://raw.githubusercontent.com/CatWarScript/CatWarScript/main/Болезни/Грязь%202.png) !important; }
            `
        $('#cstmDfctStyle').append(lowDirtNum);
      }
    }
    if (globals['cstmDfctShow34WoundBetter']) { // Лучшее отображение для раненых 3-4 стадии
      let wounds34 = `
            #tr_field [style*='wound/3'] {
            content: url(https://raw.githubusercontent.com/CatWarScript/CatWarScript/main/Болезни/Rany_3_33.png) !important; }

            #tr_field [style*='wound/4'] {
            content: url(https://raw.githubusercontent.com/CatWarScript/CatWarScript/main/Болезни/Rany_4_33__33__33.png) !important; }
            `
      $('#cstmDfctStyle').append(wounds34);
    }
    if (globals['cstmDfctShowAllBetter']) { // Лучшее отображение для всех болезней
      let cstmDfctAllBetter = `
            /* КАШЕЛЬ */
            #tr_field [style*='disease/1']{
            content: url(https://raw.githubusercontent.com/CatWarScript/CatWarScript/main/Болезни/Кашель%201.png) !important; }

            #tr_field [style*='trauma/3'] {
            content: url(https://raw.githubusercontent.com/CatWarScript/CatWarScript/main/Болезни/Ushiby_3_33.png) !important; }

            #tr_field [style*='trauma/4'] {
            content: url(https://raw.githubusercontent.com/CatWarScript/CatWarScript/main/Болезни/Ushiby_4_33__33__33.png) !important; }

            /* ВОДЫ */
            #tr_field [style*='drown/3'] {
            content: url(https://raw.githubusercontent.com/CatWarScript/CatWarScript/main/Болезни/Perelomy_3_33.png) !important; }

            #tr_field [style*='drown/4'] {
            content: url(https://raw.githubusercontent.com/CatWarScript/CatWarScript/main/Болезни/Perelomy_4_33__33__33.png) !important; }

            #tr_field [style*='poisoning/3'] {
            content: url(https://raw.githubusercontent.com/CatWarScript/CatWarScript/main/Болезни/Otravlenie_3_33.png) !important; }

            #tr_field [style*='poisoning/4'] {
            content: url(https://raw.githubusercontent.com/CatWarScript/CatWarScript/main/Болезни/Otravlenie_4_33__33) !important; }
            `
      $('#cstmDfctStyle').append(cstmDfctAllBetter);
    }
  }
  console.log(globals['cstmDfctShowDivers']);
  if (globals['cstmDfctShowDivers']) {
    let cstmDfctDivers = `<style id="dfctDivers">
            #tr_field [style*='/cw3/cats/0/costume/7.png'], [style*='/cw3/cats/-1/costume/7.png'] {
            content: url(https://i.ibb.co/dG6mhTj/image.png) !important;
            padding-top: 16px !important; }
            </style>`
    $('head').append(cstmDfctDivers);
    console.log('ааааа')
  }
  if (globals['cstmDfctShowPodstilki']) {
    let cstmDfctPodstilkiDelay = `<style id="dfctPodstilki">
            #tr_field [style*='/cw3/cats/0/costume/295.png'], [style*='/cw3/cats/-1/costume/295.png'], [style*='/cw3/cats/1/costume/295.png'] {
            background-color: ${globals['cstmDfctPodstilki']} !important;
            padding-top: 16px !important;
            opacity: 0.25;}
            </style>`
    $('head').append(cstmDfctPodstilkiDelay);
  }
  if (globals['customItemsDelay']) { // Подсветка трав и других полезных ресурсов в Игровой
    /*  function hexToRgb(hex) {
      let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      } : null;
    }
*/
    let cstmItmStyle = `<style id='cstmItmStyle'></style>`
    $('head').append(cstmItmStyle);
    /*    let rgbHerb = hexToRgb(globals['cstmItmHerbClr']);
        let rgbaHerb = `rgba(${rgbHerb.r}, ${rgbHerb.g}, ${rgbHerb.b}, ${globals['cstmItmOpacity']})`;*/
    if (globals['cstmItmHerbDelay']) { // Отображение трав
      let cstmItmHerbs = `
            .cage_items[style*='things/13.png'],
            .cage_items[style*='things/15.png'],
            .cage_items[style*='things/17.png'],
            .cage_items[style*='things/19.png'],
            .cage_items[style*='things/21.png'],
            .cage_items[style*='things/23.png'],
            .cage_items[style*='things/25.png'],
            .cage_items[style*='things/26.png'],
            .cage_items[style*='things/106.png'],
            .cage_items[style*='things/108.png'],
            .cage_items[style*='things/109.png'],
            .cage_items[style*='things/110.png'],
            .cage_items[style*='things/111.png'],
            .cage_items[style*='things/112.png'],
            .cage_items[style*='things/115.png'],
            .cage_items[style*='things/116.png'],
            .cage_items[style*='things/119.png'],
            .cage_items[style*='things/655.png'] {
                background-color: rgba (43, 255, 117, 0.25) !important;
            }
            `
      $('#cstmItmStyle').append(cstmItmHerbs);
      console.log('Цвет подсветки ТРАВ ' + globals['cstmItmHerbClr']);
    }
    if (globals['cstmItmMossDelay']) { // Отображение мха
      /*     let rgbMoss = hexToRgb(globals['cstmItmMossClr']);
           let rgbaMoss = `rgba(${rgbMoss.r}, ${rgbMoss.g}, ${rgbMoss.b}, ${globals['cstmItmOpacity']})`;*/
      let cstmItmMoss = `
            /* МОХ (обычный, водяной и желчный) */
            .cage_items[style*='things/75.png'], .cage_items[style*='things/78.png'], .cage_items[style*='things/95.png'] {
            background-color: rgba (43, 255, 117, 0.25) !important;}`
      $('#cstmItmStyle').append(cstmItmMoss);
      console.log('Цвет подсветки МХА ' + globals['cstmItmMossClr']);
    }
    if (globals['cstmItmWebDelay']) { // Отображение паутины
      /*  let rgbWeb = hexToRgb(globals['cstmItmWebClr']);
        let rgbaWeb = `rgba(${rgbWeb.r}, ${rgbWeb.g}, ${rgbWeb.b}, ${globals['cstmItmOpacity']})`; */
      let cstmItmWeb = `
            /* ПАУТИНА */
            .cage_items[style*='things/20.png'] {
            background-color: rgba (43, 255, 117, 0.25) !important;}
            `
      $('#cstmItmStyle').append(cstmItmWeb);
      console.log('Цвет подсветки ПАУТИНЫ ' + globals['cstmItmWebClr']);
    }
    /*    if (globals['cstmItmStickDelay']) { // Отображение STICKS.
          let rgbStick = hexToRgb(globals['cstmItmStickClr']);
          let rgbaStick = `rgba(${rgbStick.r}, ${rgbStick.g}, ${rgbStick.b}, ${globals['cstmItmOpacity']})`; */
    let cstmItmSticks = `
            /* ВЕТКИ, ВЬЮНКИ, КОСТОПРАВЫ, ПЛОТНЫЕ ВОДОРОСЛИ */
            .cage_items[style*='things/565.png'], .cage_items[style*='things/566.png'], .cage_items[style*='things/562.png'], .cage_items[style*='things/563.png'], .cage_items[style*='things/3993.png'] {
            background-color: rgba (43, 255, 117, 0.25) !important;}
            `
    $('#cstmItmStyle').append(cstmItmSticks);
    console.log('Цвет подсветки STICKS ' + globals['cstmItmStickClr']);
  }
  if (globals['cstmItmDustDelay']) { // Отображение Звёздной Пыли
    /*    let rgbDust = hexToRgb(globals['cstmItmDustClr']);
        let rgbaDust = `rgba(${rgbDust.r}, ${rgbDust.g}, ${rgbDust.b}, ${globals['cstmItmOpacity']})`;*/
    let cstmItmDust = `
            /* ПЫЛЬ */
            .cage_items[style*='things/94.png'], .cage_items[style*='things/385.png'], .cage_items[style*='things/386.png'], .cage_items[style*='things/387.png'], .cage_items[style*='things/388.png'], .cage_items[style*='things/389.png'], .cage_items[style*='things/390.png'], .cage_items[style*='things/391.png'], .cage_items[style*='things/392.png'] {
            background-color: rgba (192, 150, 226, 0.25) !important;}
            `
    console.log('Цвет подсветки ПЫЛИ ' + globals['cstmItmDustClr']);
  }
  if (globals['cstmItmMusorDelay']) {
    /*  let rgbMusor = hexToRgb(globals['cstmItmMusorClr']);
      let rgbaMusor = `rgba(${rgbMusor.r}, ${rgbMusor.g}, ${rgbMusor.b}, ${globals['cstmItmOpacity']})`; */
    let cstmItmMusor = `
            /* КОСТИ */
            .cage_items[style*='things/985.png'], .cage_items[style*='things/986.png'], .cage_items[style*='things/987.png'], .cage_items[style*='things/988.png'], .cage_items[style*='things/989.png'] {
            background-color: rgba (255, 43, 43, 0.25) !important;}

            /* ПАДАЛЬ, ГНИЛЬ */
            .cage_items[style*='things/44.png'], .cage_items[style*='things/180.png'] {
            background-color: rgba (255, 43, 43, 0.25) !important;}

            /* МОХ (испорченный) */
            .cage_items[style*='things/77.png'] {
            background-color: rgba (255, 43, 43, 0.25) !important;}

            /* МУСОР */
            .cage_items[style*='things/7801.png'], .cage_items[style*='things/7802.png'], .cage_items[style*='things/7803.png'], .cage_items[style*='things/7804.png'], .cage_items[style*='things/7805.png'], .cage_items[style*='things/7806.png'] {
            background-color: rgba (255, 43, 43, 0.25) !important;}
            `
  }
  if (globals['phoneFightPanel']) {
    let dangerModes = $('input[value="T+1"], input[value="T+2"], input[value="T+3"]').clone();
    $('#fightPanel').append(dangerModes);
    if ($('#fteams-wrap').length === 0) { // Проверка на наличие модифицированного БР
      // Если элемента нет, меняем стиль окна боережима
      $('#fightPanel').css('height', 'auto'); // или установите определенное значение вместо 'auto'
    }
    let fightPanelStyle = `
      <style id="fightPanelStyle">
        /*  [value="T+1"] {
        position: absolute;
        top: 180px;
        left: 0px; }

        [value="T+2"] {
        position: absolute;
        top: 180px;
        left: 70px; }

        [value="T+3"] {
        position: absolute;
        top: 180px;
        left: 140px; }

        .hotkey {
        margin-left: 15px;
        width: 40px;
        border-radius: 2px; }

        img#block {
        transform: scale(105%);
        position: relative;
        left: 5px;
        top: 1.8px; } */
      </style>
      `
    $('head').append(fightPanelStyle);
  }
  if (globals['deleteDangerModes']) {
    $('#fightPanel input[value="T+1"]').remove();
    $('#fightPanel input[value="T+2"]').remove();
    $('#fightPanel input[value="T+3"]').remove();
  }
}


function myCat() {
  if (globals['boneCorrectTimer']) {
    let boneCorrectDiv = `
      <div id="timer">
        <i>(c) CWScript</i><b>Костоправы</b><div id="timerMain">
        <input type="number" id="days" min="0" value='0' placeholder="Days" class="templateInputs">
        <label for="days">Введите дни</label><br>
        <input type="number" id="hours" min="0" value='0' max="23" placeholder="Hours" class="templateInputs">
        <label for="hours">Введите часы</label><br>
        <input type="number" id="minutes" min="0" value='0' max="59" placeholder="Minutes" class="templateInputs">
        <label for="minutes">Введите минуты</label><br></div>
        <div id="buttons"> <!-- новый div для кнопок -->
        <button id="start" class="boneCorrectBtns">Запустить таймер</button> <button id="reset" class="boneCorrectBtns">Отменить таймер</button>
        </div>
        <span id="message"></span>
      </div>`
    appendToElementOrPrependFallback('#pr', '#education-show', boneCorrectDiv);
    let cssBoneCorrect = `
    <style>
      div#timer>b {
      border: 3px solid var(--brdrClr1);
      display: block;
      text-align: center;
      font-size: 23px;
      padding: 10px;
      padding-top: 21px;
      padding-bottom: 16px;
      margin-top: -22px;
      letter-spacing: 15px;
      text-transform: uppercase; }

      div#timer {
      border: 3px solid var(--brdrClr1);
      margin: 5px 0;
      background-color: var(--bckgClr1);
      color: var(--txtClr1);
      font-family: Montserrat; }

      div#timer>i {
      display: block;
      text-align: right;
      padding-top: 5px;
      padding-right: 10px;
      font-size: 11px; }

      input.templateInputs {
      background-color: var(--bckgClr3);
      color: var(--txtClr3);
      border: 1px solid var(--brdrClr3);
      font-family: Verdana;
      font-size: .9em;
      width: 50px;
      margin-left: 10px;
      margin-bottom: 5px; }

      button.boneCorrectBtns {
      background-color: var(--bckgClr3);
      color: var(--txtClr3);
      border: 1px solid var(--brdrClr3);
      font-family: Verdana;
      font-size: .9em;
      width: 135px;
      margin: 0 1em;
      display: inline-block; }

      button.boneCorrectBtns:hover {
      border: 1px solid var(--brdrClr2); }

      div#timerMain {
      max-height: 140px;
      overflow: auto;
      background-color: var(--bckgClr2);
      color: var(--txtClr2);
      padding: 7px;
      padding-bottom: 1px; }

      div#buttons {
      border-top: 3px solid var(--brdrClr1);
      padding-top: 5px;
      padding-bottom: 5px;
      text-align: center; }

      span#message {
      display: block;
     text-align: center !important; }
    </style>`
    $('head').append(cssBoneCorrect);
  }
}


function all() {
  function addFont() {
    let link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css?family=Montserrat';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    let cssDlyaCWScripta = `
<style id="cssPalette">
html {
--scrlClr1: #776c5f;
--scrlClr2: #463E33;
--hrClr1: #463E3330;
--txtClr1: #C8C0BE;
--txtClr2: #181510;
--txtClr3: #fff;
--brdrClr1: #BD7E5C;
--brdrClr2: #ff0;
--brdrClr3: #000;
--bckgClr1: #463E33;
--bckgClr2: #918474;
--bckgClr3: #333;
--bckgClr4: #463E3350; }
</style>`
    $('head').append(cssDlyaCWScripta);
  };
  addFont();
  if (globals['dontReadenLS']) {
    function updateDontReadCounter() {
      let count = localStorage.getItem('dontReadenCount');
      if (count > 0) {
        if ($('#newls').length) {
          if ($('#dontReadCounter').length) {
            $('#dontReadCounter').text('(' + count + ')');
          }
          else {
            $('#newls').after('<span id="dontReadCounter">(' + count + ')</span>');
          }
        }
        else {
          $('#dontReadCounter').remove();
        }
      }
      else {
        $('#dontReadCounter').remove();
      }
    }
    setInterval(updateDontReadCounter, 1000);
    let cssDontReadLS = `
    <style>
    .dontReadButton:hover {
    border: 1px solid #ff0;}
    .dontReadButton {background-color: #333;
    color: #fff;
    border: 1px solid #000;
    font-family: Verdana;
    font-size: .9em;}
    #dontReadCounter {
    background-color: #fff;
    font-weight: 700;
    color: #000;}
    </style>
    `
    $('head').append(cssDontReadLS);
  }
  if (globals['inGameClock']) {
    $('.cs-set').on('change', function() {
      let key = this.id;
      let val = this.type === 'checkbox' ? this.checked : this.checked;
      setSettings(key, val);
      updateClock();
    });

    function updateClock() {
      if (globals['inGameClock']) {
        let now = new Date();
        if (globals['isClockMoscow']) {
          now.setHours(now.getUTCHours() + 3);
        }
        else {
          now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
        }
        let time = now.toISOString().substr(11, 8);
        $('#clock').text(time);
        if (globals['isDateShow']) {
          let date = now.toISOString().substr(0, 10);
          $('#date').text(date);
        }
        else {
          $('#date').text('');
        }
        setTimeout(updateClock, 1000);
      }
      else {
        $('#clock').text('');
        $('#date').text('');
      }
    }
    $(document).ready(function() {
      $('#inGameClock').prop('checked', globals['inGameClock']);
      $('#deviceTime').prop('checked', !globals['isClockMoscow']);
      $('#moscowTime').prop('checked', globals['isClockMoscow']);
      $('#showDate').prop('checked', globals['isDateShow']);
      $('#inGameClock').on('change', function() {
        setSettings('inGameClock', this.checked);
        updateClock();
      });
      $('input[name="timeSource"]').on('change', function() {
        setSettings('isClockMoscow', this.id === 'moscowTime');
        updateClock();
      });
      $('#showDate').on('change', function() {
        setSettings('isDateShow', this.checked);
        updateClock();
      });

      function updateClock() {
        if (globals['inGameClock']) {
          let now;
          if (globals['isClockMoscow']) {
            now = new Date(new Date().toLocaleString("en-US", {
              timeZone: "Europe/Moscow"
            }));
          }
          else {
            now = new Date();
          }
          let time = ('0' + now.getHours()).slice(-2) + ':' + ('0' + now.getMinutes()).slice(-2) + ':' + ('0' + now.getSeconds()).slice(-2);
          $('#clock').text(time);
          if (globals['isDateShow']) {
            let daysOfWeek = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];
            let monthsOfYear = ['Января', 'Февраля', 'Марта', 'Апреля', 'Мая', 'Июня', 'Июля', 'Августа', 'Сентября', 'Октября', 'Ноября', 'Декабря'];
            let date = daysOfWeek[now.getUTCDay()] + ', ' + now.getUTCDate() + ' ' + monthsOfYear[now.getUTCMonth()];
            $('#date').text(date);
          }
          else {
            $('#date').text('');
          }
          setTimeout(updateClock, 1000);
        }
        else {
          $('#clock').text('');
          $('#date').text('');
        }
      }
      updateClock();
    });
  }
  if (globals['boneCorrectTimer']) {
    let timerId;

    function updateTimerMessage() {
      let timerStart = localStorage.getItem('timerStart');
      let timerDuration = localStorage.getItem('timerDuration');
      if (timerStart && timerDuration) {
        let timeLeft = timerDuration - (Date.now() - timerStart);
        if (timeLeft > 0) {
          let secondsLeft = Math.floor(timeLeft / 1000);
          let minutesLeft = Math.floor(secondsLeft / 60);
          let hoursLeft = Math.floor(minutesLeft / 60);
          let daysLeft = Math.floor(hoursLeft / 24);
          secondsLeft %= 60;
          minutesLeft %= 60;
          hoursLeft %= 24;
          $('#message').text(`До окончания таймера осталось: ${daysLeft} дней, ${hoursLeft} часов, ${minutesLeft} минут, ${secondsLeft} секунд`);
        }
        else {
          $('#message').text('Таймер истёк, Вы можете снять костоправ!');
          localStorage.removeItem('timerStart');
          localStorage.removeItem('timerDuration');
        }
      }
      else {
        $('#message').text('');
      }
    }
    $('#start').click(function() {
      if (timerId) {
        clearTimeout(timerId);
      }
      let days = parseInt($('#days').val()) || 0;
      let hours = parseInt($('#hours').val()) || 0;
      let minutes = parseInt($('#minutes').val()) || 0;
      let time = ((days * 24 + hours) * 60 + minutes) * 60 * 1000;
      timerId = setTimeout(function() {
        alert('Таймер истёк, Вы можете снять костоправ!');
        localStorage.removeItem('timerStart');
        localStorage.removeItem('timerDuration');
        $('#message').text('Таймер истёк, Вы можете снять костоправ!');
      }, time);
      localStorage.setItem('timerStart', Date.now());
      localStorage.setItem('timerDuration', time);
      updateTimerMessage();
    });
    $('#reset').click(function() {
      clearTimeout(timerId);
      timerId = null;
      $('#days').val('');
      $('#hours').val('');
      $('#minutes').val('');
      localStorage.removeItem('timerStart');
      localStorage.removeItem('timerDuration');
      $('#message').text('');
    });
    setInterval(updateTimerMessage, 1000);
    let timerStart = localStorage.getItem('timerStart');
    let timerDuration = localStorage.getItem('timerDuration');
    if (timerStart && timerDuration) {
      let timeLeft = timerDuration - (Date.now() - timerStart);
      if (timeLeft > 0) {
        timerId = setTimeout(function() {
          alert('Таймер истёк, Вы можете снять костоправ!');
          localStorage.removeItem('timerStart');
          localStorage.removeItem('timerDuration');
          $('#message').text('Таймер истёк, Вы можете снять костоправ!');
        }, timeLeft);
      }
      else {
        alert('Таймер истёк, Вы можете снять костоправ!');
        localStorage.removeItem('timerStart');
        localStorage.removeItem('timerDuration');
      }
    }
    updateTimerMessage();
  }
  if (globals['hideWoundWarning']) {
    setTimeout(function() {
      $('#warningAboutWound').remove
    }, 1000);
  };
  if (globals['nightLagsWarning']) {
    nightLagsWarning();
  }
  let count = 0;
  let intervalId;
  let refreshCount = localStorage.getItem('refreshCount') || 0;
  if (refreshCount < 3) {
    if (localStorage.getItem('timerStarted')) {
      startTimer();
    }
    $('#deleteButton').click(function() {
      if (confirm('Вы уверены, что хотите удалить CatWar?')) {
        startTimer();
        localStorage.setItem('timerStarted', true);
      }
    });
    $(document).click(function() {
      count++;
      if (count >= 7200) {
        clearInterval(intervalId);
        localStorage.removeItem('timerStarted');
        alert('Удаление отменено');
      }
    });
  }
  else {
    localStorage.removeItem('refreshCount');
  }


  function startTimer() {
    let counter = 100;
    intervalId = setInterval(function() {
      if (counter === 0) {
        clearInterval(intervalId);
        $('body').fadeOut(1000, function() {
          $(this).remove();
          $('html').append('<div style="text-align: center; padding-top: 20%; font-size: 2em;">CatWar успешно удалён!</div>');
        });
      }
      else {
        $('#counter').text(counter--);
      }
    }, 1000);
  }
  window.onbeforeunload = function() {
    localStorage.setItem('refreshCount', ++refreshCount);
  };
}


function site() {
  if (globals['hideWoundWarning']) {
    $('#warningAboutWound').remove();
  };
}
