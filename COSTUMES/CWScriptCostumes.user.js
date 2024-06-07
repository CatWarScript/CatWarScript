// ==UserScript==
// @name         CW Script Costumes
// @version      1.0
// @description  Дополнительный скрипт, добавляющий в Игровую CatWar костюмы, перекрывающие модельки игроков.
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

// Тиске сосиске и другим варовским кодерам которые это смотрят привет

// Использование скрипта:
// Пишем в файле в самом низу "costume1();"(для замены модельки) / "costume2();"(для наложения на модельку) и внутрь ...
// ... скобок через запятую в кавычках пишем по порядку ссылки на следующие вещи:
// 1. Окрас (Обычный)
// 2. Окрас (Спящий)
// 3. Окрас (Пьющий)
// 4. Костюм (Обычный)
// 5. Костюм (Спящий)
// 6. Костюм (Пьющий)
// Должно получиться примерно так:
// costume("ссыль1", "ссыль2", "ссыль3", "ссыль4", "ссыль5", "ссыль6");
// ATTENTION!!! Ссылки на окрас должны быть не полными (https://блабла). В ссылке на окрас мы вставляем только то, ...
// ... что начинается с "/cw3". Получиться в итоге должно в кавычках "/cw3/composited/наборцифробукв.png".
// Не забываем никаких знаков препинания и живём счастливо и дружно!

"use strict";
let cssHtml = `<style id="costumes">
:root {
--svgFile: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' width='50' height='50' viewBox='0 0 50000000 50000000'%3e%3cg style='display:inline'%3e%3cpath d='M5109352.8 964933.23c-2238544.4 0-4041546.1 1806797.67-4041546.1 4050054.77v39970025c0 2243258 1803001.7 4050053 4041546.1 4050053H44991568c2238544 0 4041546-1806795 4041546-4050053V5014988c0-2243257.1-1803002-4050054.77-4041546-4050054.77z' style='display:inline;fill:%23463e33;stroke:%23bd7e5c;stroke-width:1.96625e+06;stroke-dasharray:none;paint-order:fill markers stroke'/%3e%3c/g%3e%3cg style='display:inline'%3e%3cpath d='M32394531 17441406c-2046386 0-3697388 672730-4953125 2021485-1255734 1342108-1882812 3230366-1882812 5662109 0 2298860 623956 4112584 1873047 5441406 1249092 1322177 2843123 1982422 4783203 1982422 1568008 0 2860406-385534 3876953-1156250 1023193-777361 1754849-1962055 2193359-3556640l-2861328-908204c-245833 1069702-650094 1855208-1214844 2353516-564747 498308-1239432 746094-2023437 746094-1063055 0-1927385-391777-2591797-1175781-664410-784004-996094-2098250-996094-3945313 0-1740756 334806-2999983 1005860-3777344 677699-777360 1559587-1166015 2642578-1166015 784003 0 1447370 217737 1992187 656250 551462 438510 913191 1037494 1085938 1794922l2919922-697266c-332207-1169364-829732-2066861-1494141-2691406-1116210-1056413-2568206-1583985-4355469-1583985z' style='font-weight:700;font-size:3.46667e+07px;font-family:Arial;-inkscape-font-specification:&quot;Arial, Bold&quot;;display:inline;fill:%23c8c0be;stroke-width:588772;paint-order:fill markers stroke' transform='matrix(1.47843 0 0 1.47843 -11960722 -11960722)'/%3e%3cpath d='M17576172 17441406c-1122854 0-2083565 168963-2880859 507813-790648 338849-1398997 833253-1824219 1484375-418580 644479-626953 1339845-626953 2083984 0 1156075 446795 2135517 1343750 2939453 637834 571396 1748782 1053311 3330078 1445313 1229162 305628 2015836 517126 2361328 636719 504953 179391 857317 392839 1056641 638671 205965 239187 308593 531459 308593 876954 0 538171-241544 1010725-726562 1416015-478376 398647-1192470 597656-2142578 597656-896954 0-1613003-225935-2144532-677734-524885-451800-872176-1159650-1044921-2123047l-2871094 279297c192678 1634449 783464 2879238 1773437 3736328 989972 850446 2408797 1275391 4255860 1275391 1269022 0 2329242-175206 3179687-527344 850447-358783 1507571-903915 1972656-1634766 465089-730851 699219-1514403 699219-2351562 0-923530-197841-1697718-589844-2322266-385358-631189-922295-1125592-1613281-1484375-684342-365424-1744560-717790-3179687-1056640-1435127-338849-2338867-664289-2710938-976563-292341-245832-437500-541226-437500-886719 0-378713 154524-682302 466797-908203 485020-352136 1156580-527343 2013672-527343 830513 0 1451349 165841 1863281 498046 418582 325561 692123 864451 818360 1615235l2949218-130860c-46507-1342108-534667-2414812-1464843-3218750-923532-803936-2300993-1205078-4134766-1205078z' style='font-weight:700;font-size:3.46667e+07px;font-family:Arial;-inkscape-font-specification:&quot;Arial, Bold&quot;;display:inline;fill:%23c8c0be;stroke:none;stroke-width:588772;paint-order:fill markers stroke' transform='matrix(1.47843 0 0 1.47843 -11960722 -11960722)'/%3e%3c/g%3e%3c/svg%3e"); }
</style>`
$('head').append(cssHtml);

function costume1(okC, okS, okD, coC, coS, coD) {
let cssC = `
    div[style*="${okC}"] {
    background-image: url("${coC}") !important;
    background-size: 100% !important; }
    div[style*="${okS}"] {
    background-image: url("${coS}") !important;
    background-size: 100% !important; }
    div[style*="${okD}"] {
    background-image: url("${coD}") !important;
    background-size: 100% !important; }`
$('#costumes').append(cssC);};

function costume2(okC, okS, okD, coC, coS, coD) {
let cssC = `
    div[style*="${okC}"] {
    background-image: url("${coC}"), url("${okC}") !important;}
    div[style*="${okS}"] {
    background-image: url("${coS}"), url("${okS}") !important;}
    div[style*="${okD}"] {
    background-image: url("${coD}"), url("${okD}") !important;}`
$('#costumes').append(cssC);};

//Это тот-то челик
costume1("/cw3/composited/dae50e26ab33e0eb.png", "/cw3/composited/9125377ca3a9a6cb.png", "/cw3/composited/531fe90af93429e9.png", "https://catwar.su/cw3/cats/0/costume/141.png", "https://catwar.su/cw3/cats/0/costume/7129.png", "https://catwar.su/cw3/cats/0/costume/141.png")