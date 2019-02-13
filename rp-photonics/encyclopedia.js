function htmlname(keyword) {
  var s = keyword.replace(/[\s-]/g,'_').toLowerCase();
  s = s.replace(/&ndash;/g,'_');
  s = s.replace(/[Ää]/g, 'a').replace(/[Öö]/g, 'o').replace(/[Üü]/g, 'u');
  s = s.replace(/&eacute;/g,'e').replace(/&iacute;/g,'i');
  s = s.replace(/[,:\.]/g, '');
  s = s.replace(/(<sup>|<\/sup>)|<sub>|<\/sub>/g, '');
  return s +'.html';
  }
function goto_article(keyword) {
  var p = keyword.indexOf('->');
  if (p && (p > 0)) { keyword = keyword.substr(p + 3); }
  if (availableArticles_lc.indexOf(keyword) >= 0)
    window.location = htmlname(keyword)+"?s=ak";
  else
    $("#warning_dialog").dialog("open");
  }
function goto_article_click(event, ui) {
  var keyword = ui.item.value.toLowerCase();
  goto_article(keyword);
  }
availableArticles_lc = availableArticles.slice(0);
for (var j = 0; j < availableArticles.length; j++)
  { availableArticles_lc[j] = availableArticles[j].toLowerCase().replace('<sup>', '').replace('</sup>', ''); }
$(document).ready(function() {
  $("#articlekeyword").autocomplete({source:availableArticles,select:goto_article_click});
  $('#articlekeyword').keypress(function (e) { if (e.which == 13) goto_article($('#articlekeyword').val()) })
  $("#warning_dialog").dialog({ autoOpen:false, modal:true,
     buttons: { "Ok": function() { $(this).dialog("close"); }, } });
  });

