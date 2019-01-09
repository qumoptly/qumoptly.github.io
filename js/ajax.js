/* $Id: ajax.js,v 1.27 2017/01/09 14:53:48 amartin Exp $
 *  Factorisation du Code JS/Ajax pour le front
 */
var charset="";

/* Creation d'un object de type XMLHttpRequest selon le type de navigateur
 */
function creationObjetXHR() {
    var xhr;

    try {
	return new XMLHttpRequest();
    } catch(ex) {
	var progIDs = ['Microsoft.XMLHTTP', 'Msxml2.DOMDocument.6.0', 'Msxml2.DOMDocument.3.0'];

	for (var i = 0; i < progIDs.length; i++) {
	    try {
		var xmlDOM = new ActiveXObject(progIDs[i]);
		return xmlDOM;
		
	    }
	    catch (ex) {}
	}
    }
    return null;
}

function executeAjaxQueryGET(url, responsefunc) {
    var xmlhttp = creationObjetXHR();

    if (xmlhttp) {
	if (responsefunc)
	    xmlhttp.onreadystatechange = function() {responsefunc(xmlhttp);};
	xmlhttp.open("GET", url,true);
	xmlhttp.setRequestHeader("X-Requested-With", "XMLHttpRequest");
	xmlhttp.send(null);
	return true;
    } else {
	return false;
    }
}

function executeAjaxQueryPOST(url, responsefunc, params) {
    var xmlhttp = creationObjetXHR();

    if (xmlhttp) {
	if (responsefunc)
	    xmlhttp.onreadystatechange = function() {responsefunc(xmlhttp);};
	xmlhttp.open("POST", url,true);
	
        if(charset !=""){
     	    xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset="+charset);
        }else{
            xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        }
	
	xmlhttp.setRequestHeader("X-Requested-With", "XMLHttpRequest");
	xmlhttp.setRequestHeader("Content-length", params.length);
	xmlhttp.setRequestHeader("Connection", "close");

	xmlhttp.send(params);
	return true;
    } else {
	return false;
    }
}

/* Remplacement d'un bloc html par le contenu d'une requete Ajax:
 */
function chargeBlocAjax(url, id) {

    var trait_response = function(xhr) {
	if (xhr.readyState == 4) {
	    if (xhr.status == 200) {
	    	var reponse=xhr.responseText;
	    	document.getElementById(id).innerHTML=reponse;
	    } else {
	    	document.getElementById(id).innerHTML="<b>Chargement bloc Ajax Impossible: </b>"+xhr.statusText;
	    }
	    evalueScripts(id);
	}
    };

    if (executeAjaxQueryGET(url, trait_response)) {
	return true;
    } else {
	document.getElementById(id).innerHTML="<b>Chargement bloc Ajax Impossible: </b> Votre navigateur n'est pas compatible, veuillez le mettre a jour";
	return false;
    }
}

/* Redirection via une URL obtenue par une requete Ajax:
 */
function redirigeViaAjax(url) {

    var trait_response = function(xhr) {
	if (xhr.readyState == 4 && xhr.status == 200) {
	    var url_value= xhr.responseText;
	    url_value = (url_value.replace("\r", ""));
	    url_value = (url_value.replace("\n", ""));
	    // meme chose en regexp ?: url_value = url_value.replace(/^\s*/im,"");
	    window.location.href = url_value;
	}
    };

    if (executeAjaxQueryGET(url, trait_response)) {
	return true;
    } else {
	return false;
    }
}

function html_entity_decode(str) {
    var ta=document.createElement("textarea");
    ta.innerHTML=str.replace(/</g,"&lt;").replace(/>/g,"&gt;");
    return ta.value;
}

/* permet validation formulaire par saisie "entree" */
function submitForm(form){
	if (document.createEvent) // Firefox etc.
	{
		var ev = document.createEvent("HTMLEvents");
		ev.initEvent("submit", false, true);
		if(form.dispatchEvent(ev)){
			//form.dispatchEvent(ev);
			//soumettre formulaire bouton ou image
			form.submit();
		}
	}
	else if(document.createEventObject)   // IE
	{
		var ev = document.createEventObject();
		if(form.fireEvent("onsubmit",ev)){
			//soumettre formulaire bouton ou image
			form.submit();
			//content.form.fireEvent("onsubmit",ev);
		}
	} 
}



/* Remplacement d'un bloc html par le contenu d'une requete Ajax avec transformation XSL : */
function chargeBlocAjaxWithTransformXSL(urlApi, urlXsl, id, functionCallBack, params) {

	if(typeof String.prototype.trim !== 'function') {
		String.prototype.trim = function() {
			return this.replace(/^\s+|\s+$/g, ''); 
		}
	}

	/* fonction recupere le xml et le transforme avec la structure xsl */
    var trait_response = function(xhr) {
		if (xhr.readyState == 4) {
		    if (xhr.status == 200) {
	    		var mon_xml = xhr.responseText;
				mon_xml = mon_xml.trim();
			
			        try{
                                // creation objet xml
                                var xml=new ActiveXObject("Msxml2.FreeThreadedDOMDocument");
                                xml.async = false;
                                xml.loadXML(mon_xml);

                                // chargement objet xsl
                                var xsl = new ActiveXObject("Msxml2.XSLTemplate");
                                var xsldoc = new ActiveXObject("Msxml2.FreeThreadedDOMDocument");
                                var xslproc;
                                xsldoc.async = false;
                                xsldoc.load(urlXsl);
                                xsl.stylesheet = xsldoc;

                                xslproc = xsl.createProcessor();
                                xslproc.input = xml;

                                // gestion des parametres
                                for(var i in params){
                                    xslproc.addParameter(i,params[i]);
                                }
                                xslproc.transform();


								// transformation
                                var target = document.getElementById(id);
                                target.innerHTML = xslproc.output;

                                
                    }
                    catch(e){
                    // creation objet xml
					var parser=new DOMParser();
					var xml=parser.parseFromString(mon_xml,'text/xml');
					
					// chargement objet xsl
					var xhttp=new XMLHttpRequest();
					xhttp.open("GET",urlXsl,false);
					xhttp.send("");
					xsl = xhttp.responseXML;
					
					// transformation
					var fragment;
					var xsltProcessor = new XSLTProcessor();
					xsltProcessor.importStylesheet(xsl);
					
                    for(var i in params){
                       xsltProcessor.setParameter(null, i,params[i]);

                    }
                    
                    fragment = xsltProcessor.transformToFragment(xml, document);
					var target = document.getElementById(id);
					target.appendChild(fragment);
                                
                    }
	                if(functionCallBack){
	                    eval(functionCallBack);
	                }
	                evalueScripts(id);
                }
			else{
				if(xhr.status != 0){
                	alert("Il y a eu un probleme lors de la connexion:\n"+xhr.statusText);
                }
			}
                      //evalue tout les script dun coup evalueScripts(id);
		    //probleme car get livraison appele 2 fois
		    //evalueScripts(id);
		}
    };

    if (executeAjaxQueryGET(urlApi, trait_response)) {
		return true;
    } else {
		document.getElementById(id).innerHTML="<b>Chargement bloc Ajax Impossible: </b> Votre navigateur n'est pas compatible, veuillez le mettre a jour";
		return false;
    }
}

function evalueScripts(targetId) {
	
	if(document.getElementById(targetId)){
		var mesScripts = document.getElementById(targetId).getElementsByTagName("script");
		for (var i=0; i<mesScripts.length; i++) {
			if(mesScripts[i].getAttribute("src")){
	                        
				var headID = document.getElementsByTagName("head")[0];
				
				var jsNode = document.createElement('script');
				jsNode.type = 'text/javascript';
				jsNode.src = mesScripts[i].getAttribute("src");
					
				headID.appendChild(jsNode);
			}
			else{
				if (mesScripts[i].firstChild != null){
					eval(mesScripts[i].firstChild.nodeValue);
				}else{
					eval(mesScripts[i].innerHTML);
				}
			}
		}
	}
} 
	
function getHtmlOutput(){
     try{
            var zones = document.querySelectorAll('#ContentCheckoutPanier,#ContentCheckoutSas,#ContentCheckoutLivraison,#contentPointRelais,#ContentCheckoutPaiement,#creation_compte');
            for (var i = 0; i < zones.length; i++)
                {
                var encodedOpen = zones[i].innerHTML.replace(/&lt;/g,"<");
                var encoded = encodedOpen.replace(/&gt;/g,">");
                var encoded2 = encoded.replace(/&amp;/g,"&");

                if (navigator.appVersion.match(/Chrome|Safari/)){
                    // workaround pour le bug de chrome qui double les <br> des xsl
                    encoded2 = encoded2.replace(/<br><br>/g,"<br>");
                }

                zones[i].innerHTML = encoded2;

            }
    }catch(e){}
}
