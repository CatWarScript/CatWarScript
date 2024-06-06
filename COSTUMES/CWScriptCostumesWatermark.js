// ==UserScript==
// @name         CW Script Costumes Watermark
// @version      1.0
// @description  Дополнительный скрипт для дополнительного скрипта, который добавляет библиотеку костюмов
// @author       Krivodushie & Psiii
// @copyright    2024 Дурное Сновидение (https://catwar.su/cat1293224) & Заря (https://catwar.su/cat590698)
// @license      MIT; https://opensource.org/licenses/MIT
// @updateURL    1
// @downloadURL  2
// @match        *://catwar.su/*
// @grant        GM_xmlhttpRequest
// @grant        GM.xmlHttpRequest
// @grant        GM_addStyle
// @require      https://code.jquery.com/jquery-3.4.1.min.js
// ==/UserScript==

// Ъ

// Использование:
// Чтобы ватермарки работали корректно, нужно просто вставить актуальный список котокостюмов из непосредственно ...
// ... библиотеки. В коде ничего менять не нужно.

"use strict";
function costume1(okC, okS, okD, coC, coS, coD) {
let cssC = `
div[style*="${okC}"]::before, div[style*="${okS}"]::before, div[style*="${okD}"]::before {
content: var(--svgFile) !important;
position: absolute;
bottom: -27px;
left: -9px;
transform: scale(44%); }
`
$('#costumes').append(cssC);};

function costume2(okC, okS, okD, coC, coS, coD) {
let cssC = `
div[style*="${okC}"]::before, div[style*="${okS}"]::before, div[style*="${okD}"]::before {
content: var(--svgFile) !important;
position: absolute;
bottom: -27px;
left: -9px;
transform: scale(44%); }
`
$('#costumes').append(cssC);};

//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// ВСТАВЛЯТЬ ЧЕРЕЗ ОДНУ СТРОКУ ПОСЛЕ ЭТИХ КОММЕНТАРИЕВ
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

costume1("/cw3/composited/dae50e26ab33e0eb.png", "/cw3/composited/9125377ca3a9a6cb.png", "/cw3/composited/531fe90af93429e9.png", "https://catwar.su/cw3/cats/0/costume/141.png", "https://catwar.su/cw3/cats/0/costume/7129.png", "https://catwar.su/cw3/cats/0/costume/141.png")
