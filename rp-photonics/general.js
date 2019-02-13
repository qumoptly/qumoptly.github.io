$(document).ready(function() {
  $("a[href^=http]").addClass('externallink');
  $("div.bannercontent a").addClass('banner');
  $("a.externallink").click(function(event) {
    ts = new Date().toJSON().substring(0, 16); // includes minute, not seconds
    var ahref = $(this).attr("href");
    frompage = location.href;
    frompage = frompage.replace("https://www.rp-photonics.com/", "");
    frompage = frompage.replace("http://rp_photonics.local/", "");
    p = frompage.indexOf('#');
    if (p >= 0) frompage = frompage.substr(0, p);
    var gto = ahref;
    if (gto.substr(0, 1) == "/") gto = gto.substr(1);
    if ($(this).hasClass("banner"))
      return false;  // already treated by other handler
    if($(this).hasClass('bg')) // XXX
      $.get("/log_bg.php",{goto:ahref,from:frompage,ts:ts});
    else
      $.get("/log_external.php",{goto:gto,from:frompage,ts:ts});
    if (ahref.substr(0, 1) != '/')
      $(this).target = "_blank";
    window.open(ahref);
    return false;
    });
  $("a.bg").click(function(event) {
    ts = new Date().toJSON().substring(0, 16); // includes minute, not seconds
    var ahref = $(this).attr("href");
    frompage = location.href;
    frompage = frompage.replace("https://www.rp-photonics.com/", "");
    frompage = frompage.replace("http://rp_photonics.local/", "");
    p = frompage.indexOf('#');
    if (p >= 0) frompage = frompage.substr(0, p);
    var gto = ahref;
    if (gto.substr(0, 1) == "/") gto = gto.substr(1);
    var supplier = $(this).attr("data-supplier");
    var keyword = $(this).attr("data-keyword");
    if (!keyword) keyword = '';
    if (supplier) {
      $.get("/log_supplier.php",{supplier:supplier,keyword:keyword,goto:gto,from:frompage,ts:ts});
      }
    });
  $("a.banner").click(function(event) {
    ts = new Date().toJSON().substring(0, 16); // includes minute, not seconds
    ahref = $(this).attr("href");
    if (ahref.substr(0, 1) != '/')
      $(this).target = "_blank";
    // Extract banner name:
    p = ahref.indexOf('?banner=');
    if (p < 0)
      p = ahref.indexOf('&banner=');
    if (p > 0) {
      banner = ahref.substr(p + 8);
      ahref = ahref.substr(0, p);
      }
    else
      banner = '';
    frompage = location.href;
    frompage = frompage.replace("https://www.rp-photonics.com/", "");
    frompage = frompage.replace("http://rp_photonics.local/", "");
    p = frompage.indexOf('#');
    if (p >= 0) frompage = frompage.substr(0, p);
    var gto = ahref;
    if (gto.substr(0, 1) == "/") gto = gto.substr(1);
    var supplier = $(this).attr("data-supplier");
    $.get("/log_banner.php",{supplier:supplier,goto:gto,from:frompage,banner:banner,ts:ts});
    window.open(ahref);
    return false;
    });
  $("span.more").css('display','none');
  $("span.more_d").css('display','none');
  a = $('<a href="" onclick="">More ...</a>');
  $("span.more").before(a.click(function() { $(this).next().css('display','inline'); $(this).remove(); return false; }));
  a = $('<a href="" onclick="">Mehr Details ...</a>');
  $("span.more_d").before(a.click(function() { $(this).next().css('display','inline'); $(this).remove(); return false; }));
  $("div.show_more").css('display','block');
  $("div.show_more").next().css('display','none');
  $("div.show_more").click(function(event) {
    $(this).css('display','none');
    $(this).next().css('display','block');
    });
  });

function toggle_element(el) {
  el.toggleClass('hidden');
  var expand_message = '(more ...)';
  var expand_str = ' <span style="font-size:80%">' + expand_message + '</span>';
  if (el.hasClass('hidden'))
    el.append(expand_str);
  else {
    var s = el.text();
    s = s.substr(0, s.length - expand_message.length);
    el.text(s);
    }
  el.parent().next('div').stop('true', 'true').slideToggle('fast');
  }

$(document).ready(function() {
  $('.togglediv').css("cursor", "pointer");
  $('.togglediv').css("display", "inline-block"); /* avoid problem with floats on the right */
  $('.togglediv').wrap('<div style="margin-top:15px"></div>').css('margin-top', '0'); /* required when using inline-block */
  $('.togglediv').click(function(){
    toggle_element($(this));
    });
  });

AdjustElements = function () {
  // banner:
  var y0 = $("#logohead").outerHeight() + 4;
  var bannerbox = $("#bannerbox");
  var bannerbox2 = $("#bannerbox2");
  var bb_height = parseInt(bannerbox.outerHeight());
  var y_end = Math.round(0.5 * ($(window).height() - bb_height));
  var f = Math.min(1, 0.001 * $(window).scrollTop());
  var y = Math.max(0, Math.round((1 - f) * y0 + f * y_end));
  mw = parseInt($('body').css("max-width"));
  var r = 15; if ($(window).width() > mw) r += 0.5 * ($(window).width() - mw);
  var nav = false;
  if ($("nav#con").length)
    nav = $("nav#con");
  else if ($("nav#soft").length)
    nav = $("nav#soft");
  if (nav) {
    var y0 = $("#logohead").position().top + $("#logohead").outerHeight() + 26;
    var nav_height = parseInt(nav.outerHeight());
    /* var y_end = Math.round(0.5 * ($(window).height() - nav_height)); */
    y_end = 40;
    var f = Math.min(1, 0.005 * $(window).scrollTop());
    var y = Math.max(y_end, Math.round((1 - f) * y0 + f * y_end));
    mw = parseInt($('body').css("max-width"));
    var l = 20; if ($(window).width() > mw) l += 0.5 * ($(window).width() - mw);
    nav.css({left:l, top:y});
    }
  if (bannerbox.length)
    bannerbox.css({right:r,top:y});
  if (bannerbox2.length) {
    var l = 15; if ($(window).width() > mw) l += 0.5 * ($(window).width() - mw);
    bb_height = parseInt(bannerbox2.outerHeight());
    y_end = Math.round(0.5 * ($(window).height() - bb_height));
    f = Math.min(1, 0.001 * $(window).scrollTop());
    y = Math.max(0, Math.round((1 - f) * y0 + f * y_end));
    bannerbox2.css({left:l,top:y});
    }
  if ($('#vlibbox').length) {
    y = $("#logohead").position().top;
    if ($("#logohead").width() >= 860) y += 140; else y += 110;
    $("#vlibbox").css({right:r,top:y});
    }
  var bl = $("main").width() + 80 - $(document).scrollLeft();
  /* $("#bannerbox").css({'left':bl, 'right':'auto'}); */
  if ($("nav#enc").length)
    $("input#articlekeyword").css({'width': ($("nav#env").width() - 4)});
  var kw = Math.round($("table#bgnavtable").width() - 135);
  ShapeAreaTable();
  if ($("table#topicstable").length) ShapeTopicsTable();
  if ($("table#software_overview").length) ShapeSoftwareOverviewTable();
  if ($("table#encnavtable").length) ShapeEncNavTable();
  if ($("nav#enc").length) ShapeEncLettertable();
  if ($("nav#bg").length) {
    ShapeBGmenu();
    if ($("#productletters").length) ShapeBGLetterTable();
    if ($("#supplierletters").length) ShapeBGSupplierLetterTable();
    }
  if ($("table#bg_overview").length) ShapeBGoverviewTable();
  if ($("table#sec_navigation").length) ShapeSectionTable();
}

$(window).on('load', AdjustElements);
$(window).scroll(AdjustElements);
$(window).resize(AdjustElements);

function ReArrangeTable(tableID, no_rows, no_cols) {
  var tab = $("table#" + tableID);
  var no_rows_old = $("#" + tableID + " > tbody > tr").length;
  var no_td = $("table#" + tableID + " > tbody > tr > td").length;
  var n = 0;
  var c = 0;
  var r = 0;
  if (no_rows != no_rows_old) {
    for (r = 1; r <= no_rows; r++) {
      tab.append("<tr></tr>");
      var new_tr = $("table#" + tableID + " > tbody > tr:last");
      for (c = 1; c <= no_cols; c++)
        if (n < no_td) {
          new_tr.append($("table#" + tableID + " > tbody > tr > td:first"));
          n++;
          }
      }
    for (r = 1; r <= no_rows_old; r++)
      $("table#" + tableID + " > tbody > tr:first").remove();
    }
  }

function ShapeAreaTable() {
  var no_rows_wanted = 1;
  var no_cols_wanted = 2;
  if ($("#areatable").width() < 420) {
    no_rows_wanted = 2;
    no_cols_wanted = 1;
    }
  ReArrangeTable("areatable", no_rows_wanted, no_cols_wanted);
 }

function ShapeSectionTable() {
  var no_rows_wanted = 1;
  var no_cols_wanted = 4;
  if ($("main").width() < 500) {
    no_rows_wanted = 2;
    no_cols_wanted = 2;
    }
  ReArrangeTable("sec_navigation", no_rows_wanted, no_cols_wanted);
 }

function ShapeTopicsTable() {
  var no_rows_wanted = 2;
  var no_cols_wanted = 3;
  if ($("#main").width() < 450) {
    no_rows_wanted = 6;
    no_cols_wanted = 1;
    }
  else if ($("#main").width() < 650) {
    no_rows_wanted = 3;
    no_cols_wanted = 2;
    }
  ReArrangeTable("topicstable", no_rows_wanted, no_cols_wanted);
 }

function ShapeSoftwareOverviewTable() {
  var no_rows_wanted = 2;
  var no_cols_wanted = 2;
  if ($("#main").width() < 700) {
    no_rows_wanted = 4;
    no_cols_wanted = 1;
    }
  ReArrangeTable("software_overview", no_rows_wanted, no_cols_wanted);
 }

function ShapeEncNavTable() {
  var no_rows_wanted = 2;
  var no_cols_wanted = 4;
  if ($("nav#enc").width() < 520) {
    no_rows_wanted = 4;
    no_cols_wanted = 2;
    }
  ReArrangeTable("encnavtable", no_rows_wanted, no_cols_wanted);
 }

function ShapeEncLettertable() {
  var no_rows_wanted = 2;
  var no_cols_wanted = 13;
  if ($("nav#enc").width() < 400) {
    no_rows_wanted = 6;
    no_cols_wanted = 5;
    }
  else if ($("nav#enc").width() < 560) {
    no_rows_wanted = 4;
    no_cols_wanted = 7;
    }
  ReArrangeTable("letters", no_rows_wanted, no_cols_wanted);
 }

function ShapeBGmenu() {
  var no_rows_wanted = 3;
  var no_cols_wanted = 4;
  if ($("nav#bg").width() < 330) {
    no_rows_wanted = 6;
    no_cols_wanted = 2;
    }
  else if ($("nav#bg").width() < 430) {
    no_rows_wanted = 4;
    no_cols_wanted = 3;
    }
  ReArrangeTable("bgnavtable", no_rows_wanted, no_cols_wanted);
 }

function ShapeBGLetterTable() {
  var no_rows_wanted = 2;
  var no_cols_wanted = 13;
  if ($("nav#bg").width() < 400) {
    no_rows_wanted = 6;
    no_cols_wanted = 5;
    }
  else if ($("nav#bg").width() < 560) {
    no_rows_wanted = 4;
    no_cols_wanted = 7;
    }
  ReArrangeTable("productletters", no_rows_wanted, no_cols_wanted);
 }

function ShapeBGSupplierLetterTable() {
  var no_rows_wanted = 2;
  var no_cols_wanted = 13;
  if ($("nav#bg").width() < 400) {
    no_rows_wanted = 6;
    no_cols_wanted = 5;
    }
  else if ($("nav#bg").width() < 560) {
    no_rows_wanted = 4;
    no_cols_wanted = 7;
    }
  ReArrangeTable("supplierletters", no_rows_wanted, no_cols_wanted);
 }

function ShapeBGoverviewTable() {
  var no_rows_wanted = 1;
  var no_cols_wanted = 2;
  if ($("main").width() < 600) {
    no_rows_wanted = 2;
    no_cols_wanted = 1;
    }
  ReArrangeTable("bg_overview", no_rows_wanted, no_cols_wanted);
 }

$(document).ready(function() {
  // $("*").wrapAll('<div id="completepagecontent"></div>');
  // $('body').wrap('<div id="completepagecontent"></div>');
  // $('table#areatable').wrap('<div id="completepagecontent"></div>');
  });
