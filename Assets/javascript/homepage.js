$(document).ready(function(){LoadMyAccountBlock();$('#btn_bar').hide();$(window).scroll(function(){if($(window).scrollTop()>74){$('#btn_bar').show();$('#btn_bar').addClass('button-fixed');$('#eo-icon').addClass('eo-iconn');$('#search-form-homepage').addClass('searchtop');$('.searchbutton2').addClass('icontop');}
if($(window).scrollTop()<75){$('#btn_bar').hide();}})});var $animation_elements=$('.animation-element');var $window=$(window);function check_if_in_view(){var window_height=$window.height();var window_top_position=$window.scrollTop();var window_bottom_position=(window_top_position+window_height);$.each($animation_elements,function(){var $element=$(this);var element_height=$element.outerHeight();var element_top_position=$element.offset().top;var element_bottom_position=(element_top_position+element_height);if((element_bottom_position>=window_top_position)&&(element_top_position<=window_bottom_position)){$element.addClass('in-view');}else{$element.removeClass('in-view');}});}
$window.on('scroll resize',check_if_in_view);$window.trigger('scroll');$(function(){$(".hidden").hide()
$(".hidden:first").show()
$("#universityList a:first").addClass("boldLaser")
$(".txts>div:first").show()
$(document).on("click",".doSwitch",function(){if(!$(this).hasClass("boldLaser")){var id=$(this).attr("id")
var currentIndex=id.substring(0,5)
$("#universityList a").removeClass("boldLaser")
$(this).addClass("boldLaser")
$(".hidden-txt").hide()
$("#hiddenArea_"+id).show()}})});var catsLoaded={'602':false,'1000':false,'1012':false,'604':false,'625':false,'754':false,'606':false,'605':false};function GetProducts(catCode){if(catCode==0){$('.homepageProducts').hide();$('#featuredProducts').show();check_if_in_view()}
else if(catsLoaded[catCode]==false){$.ajax({url:'/StartPage/_CategoryList/?id='+catCode,type:"GET",contentType:"application/json; charset=utf-8",dataType:"html",success:function(html){$('#categoryContainer-'+catCode).html(html);$('.homepageProducts').hide();$('#categoryContainer-'+catCode).parent().show()
catsLoaded[catCode]=true;$('.lazy').lazy();}});}
else{$('.homepageProducts').hide();check_if_in_view()
$('#categoryContainer-'+catCode).parent().show()}};