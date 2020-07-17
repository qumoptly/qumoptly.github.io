$(function(){$(".livechat-div").click(function(){openlc();});$("a.startLivechat").click(function(){openlc();});});function TriggerChatInvite(group){if(group==undefined||group==null){if(window.location.pathname.indexOf("cart")!=-1||window.location.pathname.indexOf("checkout")!=-1){group=39;}
else{group=62;}}
if(typeof $("meta[name='EO.internal']").attr("content")=='undefined'&&are_cookies_enabled()){var engaged=$.cookie("chatEngaged");var is_engaged=LC_API.visitor_engaged();var is_maximized=LC_API.chat_window_maximized();if((jQuery.isEmptyObject(engaged)||engaged=="false"||engaged==undefined)&&is_engaged==false&&is_maximized==false){ShowInvite(group);}
else{console.log('No invite shown due to prior chat engagement.');}}
else{console.log('Chat invite requirements not met.');}}
function ShowInvite(group){$.ajax({url:"/Chat/IsGroupAvailable/?id="+group,type:"GET",contentType:"application/json; charset=utf-8",dataType:"json",success:function(status){if(status==true&&IsChatAvailable()){inviteGroup=group;$("#chatInvite").fadeIn();window.setTimeout(function(){if($('#chatInvite').is(":visible")){hideChatPushes("false");trackEvent("LiveChat Invite","Timed Out",inviteGroup);}},3e4);trackEvent("LiveChat Invite","Shown",inviteGroup);}
else{console.log('No invite shown due to chat group being offline.');}}})}
function acceptInvite(){openlc();trackEvent("LiveChat Invite","Accepted",inviteGroup);}
function declineInvite(){hideChatPushes('true');trackEvent('LiveChat Invite','Declined',inviteGroup);return false;}
function hideChatPushes(n){chatEngagedCookie(n);$("#chatInvite").hide();$("#chatOfflineMessage").slideUp();}
function are_cookies_enabled(){var n=navigator.cookieEnabled?!0:!1;return typeof navigator.cookieEnabled!="undefined"||n||(document.cookie="testcookie",n=document.cookie.indexOf("testcookie")!=-1?!0:!1),n}
function openlc(){hideChatPushes("true");$("iframe[id='chat-widget']").show();parent.LC_API.open_chat_window();}
function chatEngagedCookie(n){var expdate=new Date();expdate.setDate(expdate.getDate()+14);if(n=="false"){expdate.setTime(expdate.getDate()-1)}
Cookies.set("chatEngaged",n,{expires:expdate,path:"/"})}