$(function(){$(document).foundation({"magellan-expedition":{active_class:'active',threshold:0,destination_threshold:60,throttle_delay:0,fixed_top:112,offset_by_height:false}});const populateCartIcon=(cartURL)=>{$.ajax({type:'GET',url:cartURL,contentType:"application/json",dataType:'jsonp',success:function(data){var item_count=data['item_count'];}});}
let euCountryCodeList=["AT","BE","BG","HR","CY","CZ","DK","ES","FI","FR","DE","GR","HU","IE","IT","LV","LI","LU","MT","NL","PL","PT","RO","SK","SI","ES","SE","UK"];let lightUserConsentVersion="1.0";let lightUserConsent=Cookies.getJSON('lightUserConsent')||{};if(lightUserConsent.version==lightUserConsentVersion){let country_code=lightUserConsent.userSelectedCountryCode||lightUserConsent.countryCode;localContentInit(country_code);triggerGtmEvents(lightUserConsent);}else{$.getJSON('https://api.ipstack.com/check?access_key=e347b299839239dff35123bec22b04bc').done(function(location){var d=new Date();var currentTime=d.toISOString();let inEuList=euCountryCodeList.indexOf(location.country_code)>-1;let list={googleAnalytics:false,googleAdwords:false,crazyEgg:false,facebookAdvertising:false,googleOptimize:false,hubspot:false}
lightUserConsent={version:lightUserConsentVersion,hasAgreed:false,country:location.country_name,countryCode:location.country_code,timestamp:currentTime,userSelectedCountryCode:null}
if(!inEuList){for(let key in list){list[key]=true;}
lightUserConsent.hasAgreed=true;}
lightUserConsent.list=list;Cookies.set('lightUserConsent',lightUserConsent,{expires:90,domain:".light.co"});localContentInit(location.country_code);if(inEuList){$('#gdpr-modal').css({'display':'block'});}else{triggerGtmEvents(lightUserConsent);}}).fail(function(){localContentInit('US');console.log('geo detection failed, loading US fallback');});}
function triggerGtmEvents(lightUserConsent){let lightUserConsentEventMap={googleAnalytics:"triggerGoogleAnalytics",googleAdwords:"triggerGoogleAdwords",crazyEgg:"triggerCrazyEgg",facebookAdvertising:"triggerFacebookAdvertising",googleOptimize:"triggerGoogleOptimize",hubspot:"triggerHubspot"}
for(let key in lightUserConsent.list){if(lightUserConsent.list[key]){let Obj={"event":lightUserConsentEventMap[key]}
dataLayer.push(Obj);}}}
$(".gdpr-consent-agree").click(function(){let cookie=Cookies.getJSON("lightUserConsent")
cookie.hasAgreed=true;for(let key in cookie.list){cookie.list[key]=true;}
Cookies.set("lightUserConsent",cookie,{expires:90,domain:".light.co"});triggerGtmEvents(cookie);$('#gdpr-modal').css({'display':'none'});});$.Scrollax();$('.nav-desktop #main-nav li:nth-child(6)').hover(function(){$('#blog-dropdown').animate({'opacity':'1','height':'125px'},400).css({'display':'block'});},function(){$('#blog-dropdown').animate({'opacity':'0','height':'0px'},400).css({'display':'none'});});$('#mobile-menu-btn').click(function(){$(this).toggleClass('open');$('.mobile-overlay').toggleClass('open');if($('.mobile-overlay').hasClass('open')){$('.mobile-overlay').animate({'left':'0px'});$('body').css({'overflow':'hidden'});}else if(!$('.mobile-overlay').hasClass('open')){$('.mobile-overlay').animate({'left':'-400px'});$('body').css({'overflow':'visible'});}
$('.mobile-overlay #main-nav li a.active').closest('li').addClass('parent-active');});$('.toggle-drop').click(function(e){e.preventDefault();$('#blog').toggleClass('drop-open');if($('#blog').hasClass('drop-open')){$('.mobile-overlay #main-nav #blog-dropdown').animate({'opacity':'1','height':'245px'},300);$('#blog .mobile-arrow').addClass('open');$('.nav-support').animate({'margin-top':'160px'},0);}else{$('.mobile-overlay #main-nav #blog-dropdown').animate({'opacity':'0','height':'0px'},300);$('#blog .mobile-arrow').removeClass('open');$('.nav-support').animate({'margin-top':'25px'},0);}});$(window).on('resize',function(e){if($(window).width()>1200){$('.mobile-overlay.open').removeClass('open').animate({'left':'-400px'});$('#mobile-menu-btn.open').removeClass('open');}});function quantity(){$('.quantity-line').css({'display':'block'});$('.l16-quantity-inc, .l16-quantity-dec').removeClass('sold-out');$(".l16-quantity-dec").click(function(){var val=$('.l16-quantity').val();if(val>1){$('.l16-quantity').val(parseInt(val)-1);}});$(".l16-quantity-inc").click(function(){var val=$('.l16-quantity').val();if(val<5){$('.l16-quantity').val(parseInt(val)+1);}});}
var UkShipStuff='<ul class="shipList"> <li>Price is inclusive of VAT</li> <li> 1-year warranty</li> <li> 90 day return period</li> <li> Ships in 1-2 weeks</li> </ul>';var soldOut=true;var UkStoreURL='https://uk.light.co/products/the-light-l16-camera-temp.json';function ukContent(){$('.uk-content').show();$('#ship-date').html(UkShipStuff);cookieBanner()
$('#main-nav #main-button.buy').text('Shop now');$('#main-button.buy, #main-nav #main-button.buy').attr("href","https://uk.light.co/cart/add?id=1295984721934&quantity=1 ");$('.l16-price').text('£1,850');$('.light-logo-quote').css({'display':'none'});$('.refurb').css({'display':'none'});$('.link-to-accessories').css({'display':'none'});$('#link-to-financing').css({'display':'none'});$('#region-button.region').addClass('uk-flag');$('#region-name').text("United Kingdom");console.log('load flag');};function euContent(countryCode){$('.eu-content').show();$('#main-nav #main-button.buy').text('Shop now');$('#main-button.buy, #main-nav #main-button.buy').attr("href","https://eu.light.co/cart/add?id=7906800389&quantity=1 ");$('#ship-date').html(UkShipStuff);cookieBanner()
$('.light-logo-quote').css({'display':'none'});$('.l16-price').text('€2,050');$('.refurb').css({'display':'none'});$('.link-to-accessories').css({'display':'none'});$('#link-to-financing').css({'display':'none'});countryNames={"AD":{"countryName":"Andorra","flag":"and-flag"},"AT":{"countryName":"Austria","flag":"at-flag"},"BE":{"countryName":"Belgium","flag":"be-flag"},"CY":{"countryName":"Cyprus","flag":"cy-flag"},"EE":{"countryName":"Estonia","flag":"ee-flag"},"FI":{"countryName":"Finland","flag":"fi-flag"},"FR":{"countryName":"France","flag":"fr-flag"},"DE":{"countryName":"Germany","flag":"de-flag"},"GR":{"countryName":"Greece","flag":"gr-flag"},"IS":{"countryName":"Iceland","flag":"is-flag"},"IE":{"countryName":"Ireland","flag":"ie-flag"},"IT":{"countryName":"Italy","flag":"it-flag"},"LI":{"countryName":"Liechtenstein","flag":"li-flag"},"LU":{"countryName":"Luxembourg","flag":"lu-flag"},"MT":{"countryName":"Malta","flag":"mt-flag"},"MC":{"countryName":"Monaco","flag":"mc-flag"},"ME":{"countryName":"Montenegro","flag":"me-flag"},"NL":{"countryName":"Netherlands","flag":"nl-flag"},"NO":{"countryName":"Norway","flag":"no-flag"},"PL":{"countryName":"Poland","flag":"pl-flag"},"PT":{"countryName":"Portugal","flag":"pt-flag"},"SM":{"countryName":"San Marino","flag":"sm-flag"},"SI":{"countryName":"Slovenia","flag":"si-flag"},"ES":{"countryName":"Spain","flag":"es-flag"},"CH":{"countryName":"Switzerland","flag":"ch-flag"},"SE":{"countryName":"Sweden","flag":"se-flag"}}
$('#region-button.region').addClass(countryNames[countryCode]['flag']);$('#region-name').text(countryNames[countryCode]['countryName']);let url='https://eu.light.co/cart/add?id=7906800389&quantity=1';let cancel=false;$("#main-button.buy").click(function(e){e.preventDefault();let seconds=4;$('#luzern-alert').css({'display':'block'});$("#redirect-time").text(seconds);$('.luzern-cancel-btn').click(function(){cancel=true;$('#luzern-alert').css({'display':'none'});});setInterval(function(){if(!cancel){seconds--;$("#redirect-time").text(seconds);if(seconds==0){window.location="https://eu.light.co/cart/add?id=7906800389&quantity=1";}}},1000);});};function intlContent(){$('#main-button.buy, #main-nav #main-button.buy, .nav-bar-buy-button').text('Sign up').attr("href"," http://light.us3.list-manage.com/subscribe?u=078a139c6b071ae422336f0b7&id=59d36cb666").attr("target","_blank");$('.camera-about').text('This compact camera captures the details of your scene at multiple focal lengths, then uses sophisticated algorithms to combine 10+ images into a single, high-resolution photo.').append('<p style="margin-top:20px;margin-bottom:0px">Sign up to get notified when we start selling in your country.</p>');$('.quantity-line').css({'display':'none !important'});$('#ship-date').css({'display':'none'});$('.light-logo-quote').css({'display':'none'});$('.l16-price').css({'display':'none'});$('.refurb').css({'display':'none'});$('.link-to-accessories').css({'display':'none'});$('#link-to-financing').css({'display':'none'});};var UsShipStuff='<ul class="shipList"> <li>Free shipping</li> <li><a href="financing" style="color:#00b1ed;font-weight:600;">Financing</a> as low as 0% APR available</li><li> 1-year warranty</li> <li> 90 day return period</li> <li> Ships in one business day</li> </ul>'
function usExp(){$('.us-content').show();$('.press-slider .light-logo-quote').css({'display':'none'});$('#region-button.region').addClass('us-flag');$('#region-name').text("United States");$('#main-nav #main-button.buy').text('Shop now');$('#main-nav #main-button.buy, #main-button.buy').attr("href","https://us.light.co/cart/add?id=23549565702&quantity=1 ");$('.l16-price').text('$1,950');$('#ship-date').html(UsShipStuff);var UsStoreURL='https://us.light.co/products/the-light-l16-camera-temp.json';}
var countryCode;if(Cookies.get('light-country')){countryCode=Cookies.get('light-country');}else{if(typeof geoplugin_countryCode!='undefined'){countryCode=geoplugin_countryCode();}}
if(typeof geoplugin_countryName!='undefined'){var country=geoplugin_countryName();}
$('.country-selector').click(function(e){e.preventDefault();var cc=$(this).attr('data-country-code');let lightUserConsent=Cookies.getJSON('lightUserConsent');lightUserConsent.userSelectedCountryCode=cc;console.log(lightUserConsent.userSelectedCountryCode);Cookies.set('lightUserConsent',lightUserConsent,{expires:90,domain:'.light.co'});location.reload();});function localContentInit(countryCode){var EU_country=["AD","AT","BE","CY","EE","FI","FR","DE","GR","IS","IE","IT","KO","LI","LU","MT","MC","ME","NL","NO","PL","PT","SM","CS","SI","ES","SE","CH"];var inEU=EU_country.indexOf(countryCode)>-1;var inUK=countryCode=='GB'||countryCode=='UK';var inUS=countryCode=='US';var other=countryCode=='CA'||countryCode=='AU'||countryCode=='UNK';var canada=countryCode=='CA';var australia=countryCode=='AU';var other=countryCode=='UNK';if(inUS){usExp();}else if(inEU){euContent(countryCode);}else if(inUK){ukContent();}else{intlContent();}
if(canada){$('#main-button.region').addClass('ca-flag ');}
if(australia){$('#main-button.region').addClass('au-flag ');}
if(other){$('#region-button.region').addClass('other-flag');$('#region-name').text('Not Listed');}}
function cookieBanner(){if(!localStorage.getItem('EU')){localStorage.setItem('EU','1');$('#cookie-banner').animate({"bottom":"0",'opacity':'1'},500);}
$('.close-banner').click(function(e){e.preventDefault();$('#cookie-banner').animate({"bottom":"-80px",'opacity':'0'},500);});}
$(window).scroll(function(){$('.scroll-fade-in').each(function(i){var element_bottom=$(this).position().top+$(this).outerHeight();var window_bottom=$(window).scrollTop()+$(window).height();window_bottom=window_bottom+0;if(window_bottom>element_bottom){$(this).delay((i++)*0).animate({'opacity':'1'},500);$(function(){$('').each(function(i){$(this).delay((i++)*500).fadeTo(500,1);});});$('').each(function(i){$(this).delay((i++)*100).fadeTo(500,1);});}});$('.fade-in-fast-scroll').each(function(i){var element_bottom=$(this).position().top+$(this).outerHeight();var window_bottom=$(window).scrollTop()+$(window).height();window_bottom=window_bottom+200;if(window_bottom>element_bottom){$(this).delay((i++)*0).animate({'opacity':'1'},500);}});});$('#home-heros .hero-text').animate({'opacity':'1'},500);$(function(){$('.fadeIn').each(function(i){$(this).delay((i++)*0).fadeTo(500,1);});});var $animation_elements=$('.animate, #parallax.captured');var $window=$(window);function check_if_in_view(){var window_height=$window.height();var window_top_position=$window.scrollTop();var window_bottom_position=(window_top_position+window_height);$.each($animation_elements,function(){var $element=$(this);var element_height=$element.outerHeight();var element_top_position=$element.offset().top;var element_bottom_position=(element_top_position+element_height);if((element_bottom_position>=window_top_position)&&(element_top_position<=window_bottom_position)){setTimeout(function(){$element.addClass('in-view');},200);$(function(){if($('#parallax.captured').hasClass('in-view')){function emailModal(){if(!localStorage.getItem('Email_Modal')){localStorage.setItem('Email_Modal','1');setTimeout(function(){$("#email_modal").fadeIn(200).css({display:"block"});},1000);}
$(".close.hairline").click(function(){$("#email_modal").fadeOut(300);});};emailModal();}
$('').each(function(i){$(this).delay((i++)*200).fadeTo(500,1);});if($('').hasClass('in-view')){$('').animate({'opacity':'1'},500);setTimeout(function(){$('').each(function(i){$(this).delay((i++)*200).animate({'opacity':'1'},300);});},300);}});}else{$element.removeClass('in-view');}});}
$window.on('scroll resize',check_if_in_view);$window.trigger('scroll');$('ul.tabs li').click(function(){var tab_id=$(this).attr('data-tab');$('ul.tabs li').removeClass('current');$('.tab-content').removeClass('current');$(this).addClass('current');$("#"+tab_id).addClass('current');});if((navigator.userAgent.match(/iPad/i))&&(navigator.userAgent.match(/iPad/i)!=null)){$('video').prop("controls",true);}
var country;if(typeof geoplugin_countryName!='undefined'){var country=geoplugin_countryName();}
var appendStr="&COUNTRY=";var mcURL="https://light.us3.list-manage.com/subscribe/post?u=078a139c6b071ae422336f0b7&amp;id=59d36cb666";var countryKey={"Antigua and Barbuda":"Antigua And Barbuda","Cocos (Keeling) Islands":"Cocos (Keeling)","Cote d'Ivoire":"Cote D'Ivoire","Congo, The Democratic Republic of the":"Democratic Republic of the Congo","Falkland Islands (Malvinas)":"Falkland Islands","Heard Island and McDonald Islands":"Heard and Mc Donald Islands","Iran, Islamic Republic of":"Iran","Jersey":"Jersey (Channel Islands)","Korea, Republic of":"South Korea","Libyan Arab Jamahiriya":"Libya","Macao":"Macau","Micronesia, Federated States of":"Micronesia","Moldova, Republic of":"Moldova","Palestinian Territory":"Palestine","Russian Federation":"Russia","Samoa":"Samoa (Independent)","Saint Helena":"St. Helena","Saint Pierre and Miquelon":"St. Pierre and Miquelon","Svalbard and Jan Mayen":"Svalbard and Jan Mayen Islands","Syrian Arab Republic":"Syria","Tanzania, United Republic of":"Tanzania","United States":"United States of America","United States Minor Outlying Islands":"USA Minor Outlying Islands","Holy See (Vatican City State)":"Vatican City State (Holy See)","Virgin Islands, British":"Virgin Islands (British)","Virgin Islands, U.S.":"Virgin Islands (U.S.)","Wallis and Futuna":"Wallis and Futuna Islands"};if(countryKey[country]!=undefined){country=countryKey[country];}else{country="United States of America";}
country=encodeURIComponent(country);mcURL=mcURL+appendStr+country;var footerSignUp=mcURL+"&SIGNUPloc=Footer";$('#footer #mc-form').ajaxChimp({url:footerSignUp});var homeSignUp=mcURL+"&SIGNUPLOC=Homepage"
$('#email-cta #mc-form').ajaxChimp({url:homeSignUp});var cameraSignUp=mcURL+"&SIGNUPLOC=CameraPage"
$('#camera-header #mc-form').ajaxChimp({url:cameraSignUp});var modalSignUp=mcURL+"&SIGNUPloc=EmailModal"
$('#modal-form').ajaxChimp({url:modalSignUp});var waldoSignUp=mcURL+"&SIGNUPloc=WaldoPage"
$('#spy-email #mc-form').ajaxChimp({url:waldoSignUp});var ukSignUp=mcURL+"&SIGNUPloc=UK"
$('.uk-form #mc-form').ajaxChimp({url:ukSignUp});var $mask="grid-gallery";var $targets=$('.'+$mask);$targets.each(function(i){$(this).attr('id',$mask+'_'+[i+1]);$targetid=$(this).attr("id");new CBPGridGallery(document.getElementById($targetid));});$(document).mouseup(function(e){if(e.target.id!=='video-modal ul li.current.show'){$('#video-modal .grid-gallery').removeClass('slideshow-open');$('#video-modal ul li').addClass('fade-out');$('#video-modal ul li').removeClass('show');$('#video-modal ul li').mouseup(function(e){e.stopPropagation();});player.api("pause");}});var iframe=document.getElementById('video');var player=$f(iframe);$("#videoClose").click(function(){player.api("pause");});$(document).keyup(function(e){if(e.keyCode==27){player.api("pause");}});$("#tabs, #guide-tabs").tabs();$(function(){$("#teamAccordion.execs").accordion({collapsible:true,active:'none',heightStyle:"content"});});var a=document.createElement('a');if(typeof a.download!="undefined"){}else{$('#hi-res .medium-4.columns, #main-button.download').append('<div class="download-message">Right-click and  \
    Save linked file to "Downloads"</div>');}
var isIE=false;if(navigator.userAgent.indexOf('MSIE')!==-1||navigator.appVersion.indexOf('Trident/')>0){isIE=true;$('.download-message').css({"display":"none"});}
if($(window).height()<520){$("#home-heros, #company #intro, #jobs #intro, #technology #intro").css({"max-height":"100%"});}
$("#gdpr-modal .close.hairline").click(function(){$("#gdpr-modal").fadeOut(300);});let language;$(".solutions-language-selector").change(function(){language=$(this).val();$(".language-pane").css({"display":"none"})
switch(language){case "english":$(".english-language").css({"display":"block"})
$('#english-selector').prop('selectedIndex',0);break;case "chinese":$(".chinese-language").css({"display":"block"});$('#chinese-selector').prop('selectedIndex',0);break;case "japanese":$(".japanese-language").css({"display":"block"});$('#japanese-selector').prop('selectedIndex',0);break;case "korean":$(".korean-language").css({"display":"block"});$('#korean-selector').prop('selectedIndex',0);break;}});});