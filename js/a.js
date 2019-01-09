var xmlHttp

function showHint(str)

{

            if (event.keyCode==13)

                   {

                            Send(str);

                   } 

}

function Send(str)

{

 if (str.length==0)

    {

    document.getElementById("txtHint").innerHTML="";

    return;

    }

          xmlHttp=GetXmlHttpObject()

                     if (xmlHttp==null)

                            {

                            alert ("您的浏览器不支持AJAX！");

                            return;

                            }

                     var url="http://www.tuling123.com/openapi/api?key=3593d8efeb5f471cb26bf12b236caebc";

                     url=url+"&info="+str;

                     url=url+"&userid=12345" ;

                     xmlHttp.onreadystatechange=stateChanged;

                     xmlHttp.open("GET",url,true);

                     xmlHttp.send(null);

                      document.getElementById("robot").value="";

}

function stateChanged()

{

if (xmlHttp.readyState==4)

{

var msg=eval('(' + xmlHttp.responseText + ')'); 

 

document.getElementById("txtHint").innerHTML=msg.text;

}

}

function GetXmlHttpObject()

{

  var xmlHttp=null;

  try

    {

    // Firefox, Opera 8.0+, Safari

    xmlHttp=new XMLHttpRequest();

    }

  catch(e)

    {

    // Internet Explorer

    try

      {

      xmlHttp=new ActiveXObject("Msxml2.XMLHTTP");

      }

    catch (e)

      {

      xmlHttp=new ActiveXObject("Microsoft.XMLHTTP");

      }

    }

return xmlHttp;

}
