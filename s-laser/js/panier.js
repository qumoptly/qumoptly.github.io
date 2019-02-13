/* $Id: panier.js,v 1.25 2018/01/26 14:13:16 olivier Exp $ 

 * Code Javascript de gestion de mise au panier
 * 
 * Copyright 2012, Doyousoft. Tout droits reservés.
 * */

/* Objet panier
 *  gestion de la mise au panier direct ou en ajax
 */
var panier = {
    // 
    modeAjax : false,

    /* Fonction setMode
     * Bascule le panier de mode ajax a mode submit
     */
    setMode : function(mode) {
	panier.modeAjax = (mode == 1);
	
	if (!panier.modeAjax) {
	    //console.log("Panier oldschool");

	    panier.ajoutListe = function () { return true; };
	    panier.ajoutFiche = function () {
		// Test la presence d'un onsubmit et execute si present.
		if(document.formulaire.onsubmit &&
		   !document.formulaire.onsubmit())
		{
		    //console.log("Submit canceled");
		    return false;
		}
		//console.log("Submit");
		document.formulaire.submit(); return false;
	    };
	} else {
	    //console.log("Panier ajax");
	};
    },

    /* ***********************************************************************
     * Interfaces publiques panier
     * ***********************************************************************
     */

    /* Fonction ajoutPanierListe
     *  ajout au panier depuis listes
     */
    ajoutListe: function(url,event) {
	//console.log("ajout panier liste");

	//coordonnees de depart pour animation effet vers le panier
	panier.setStartPoint(event);
	
	// Renvoi true si erreur ajax: le navigateur activera le lien
	return !panier.submit("get",url);
    },

    /* Fonction ajoutFiche
     *  Ajout au panier depuis fiche produit
     */
    ajoutFiche : function(event) {
	//console.log("ajout panier fiche");
	if (panier.validationFiche(event)) {
	    //coordonnees de depart pour animation effet vers le panier
	    panier.setStartPoint(event);

	    if (!panier.submit('post','com_act.cfm')) {
		// Fallback: soumission com_act
		document.formulaire.submit();
	    }
	}
	return false; // N'active pas le lien
    },

    /* Fonction validationPanierFiche(event)
     *  Handler onSubmit pour la fiche produit
     */
    validationFiche: function() {
	//window.console && console.log("validation formulaire");
	// Delege le test de validitée des sousRefs a l'objet dedié
	if (typeof sousRefs === "object") {
	    if (!sousRefs.check())
		return false;
	}
	
	/* Test si l'article est personnalisable */		
	if(document.getElementById('personnalisation_article') != null){
	    var test2 = panier.recuperationChampPerso();
	    if(test2 == false){
	    	return false;
	    }
	}
		
	if(document.formulaire.qte){
	    if (isNaN(document.formulaire.qte.value)==true || document.formulaire.qte.value > 9999 || document.formulaire.qte.value <= 0){ 
		alert("La quantité doit être numérique non nulle et plus petite que 9999"); 
		document.formulaire.qte.focus();
		return false;
	    } else {
		document.formulaire.qte.value = parseInt(document.formulaire.qte.value);
	    }
	} else {
	    //document.formulaire.innerHTML = document.formulaire.innerHTML + '<input type="hidden" name="qte" value="1">';
	}
	
	return true;
    },



    /* ***********************************************************************
     * Fonctions Internes panier
     * ***********************************************************************
     */

    /* Fonction exit_onclick
     *  Handler onclick, qui cache le bloc mini panier lors d'un clic hors de sa zone 
     * */
    exit_onclick : function (e) {
	var e = e || window.event; 
	var target = e.target || e.srcElement; 
	var div = 0;

	while (target.parentNode) {
            target = target.parentNode;

            if (target.id == "BlocPreferenceMiniPanier") {
		//console.log("Click dans la zone");
		// Clic dans la zone du mini panier, on ne fait rien
		return;
            } else if (target.tagName.toLowerCase() == "html") {
		// On est remonté à la racine du DOM, donc on cache le bloc mini panier
		panier.exit();
		return;
            }
	}
    },

    //duree affichage bloc mini panier
    timer : function() {
	return setTimeout(panier.exit,4000);
    },

    
    divMessageBox : null,
/*
    miniImg : null,
    miniImgSrc : "images_produits/icone_ajout_panier.png",
    //variable pour recuperer coordonnees du clic (selection article)
    posEventX : 0,
    posEventY : 0,
    posPanierX : 0,
    posPanierY : 0,
*/
    creation : function() {
	var div;
	// crée un nouvel élément div
 	// et lui donne un peu de contenu
	div=document.createElement("div");
	div.id="BlocPreferenceMiniPanier";
	// si l'ecran est plus petit que 800 alors la popup fait la taille de l'ecran - 40px de marge
	if(document.body.clientWidth<800){
		var divWidth = document.body.clientWidth-40;	
	}else{var divWidth = '800';}
	div.style.width=divWidth+'px';
	div.style.height='auto';
	// (largeur ecran - largeur div) /2
	div.style.left=(document.body.clientWidth-divWidth)/2+'px';
	// All browsers, except IE9 and earlier
	if(window.pageYOffset !== undefined){div.style.top=(window.pageYOffset+100)+'px';}
	// IE9 and earlier
	else{div.style.top=(document.documentElement.scrollTop+100)+'px';}
	div.style.display='none';
	div.style.position='absolute';
	div.style.zIndex='100';
	div.innerHTML = '<div onclick="return panier.exit();" class="alertPwb" style="position:fixed;width:100%;height:100%;top:0;left:0;opacity:0.7;filter:alpha(opacity=70);background-color:#000;z-index:-1;"></div>';
	
	

	document.body.appendChild(div);
	
	
	panier.divMessageBox = div;
	
	
	
	/*
	div=document.createElement("div");
	 div.id="plus_1_miniPanier";
	div.style.display="none";
	div.style.position="absolue";
	var img=div.createElement("img");
	img.src=panier.miniImgSrc;
	img.height=20;
	img.width=20;

	panier.miniImg = div;
	 */
    },


    /* Helpers pour le mini panier */

    /* Fonction exit
     *  quitte le mini panier
     */
    exit: function() {
	panier.divMessageBox.parentNode.removeChild(panier.divMessageBox);
	//document.getElementById("BlocPreferenceMiniPanier").innerHTML = "";
	//document.getElementById("BlocPreferenceMiniPanier").style.display="none";
	    
	//console.log("Desactive le handler onclick");
	// Desactive le gestionnaire onclick personnalisé
	document.body.onclick = null;
	return false;
    },

    /* Fonction view
     *  change d'url
     */
    view: function (P_url) {
	panier.exit();
	// IE need a fully qualified url
	if (P_url.search(/^http/) < 0)
	    P_url = urlBase + P_url;
	window.location.href = P_url;
	return false;
    },

    	
    /* Fonction animer
     *  Gestion des effets de mise au panier
     */
    animer : function (){
    chargeBlocAjax("nbre_article_bloc.cfm?randomVar=" + Math.random(),"qte_mini_panier");
    },

    /* Fonction setStartPoint(event)
     *  prepare l'animation de mise au panier
     */
    setStartPoint : function(event) {
/*	panier.posEventX = event.clientX;
	panier.posEventY = event.clientY+document.documentElement.scrollTop;	
*/    },

    /* Fonction submit
     *  Ajout d'un element au panier
     */
    submit : function (method,Adresse){

	var params = "";
	var separateur ="";
	
	if (method == "post") {
	    //recuperer elements du formulaire com_act	
	    var form = document.forms["formulaire"];
		
	    for (var champ=0; champ < form.length; champ++) {
			//ventes croisees - ajout multiple au panier
			if (form.elements[champ].type == "checkbox") {
			    if (form.elements[champ].checked == true) {
				params += separateur+form.elements[champ].name+"="+form.elements[champ].value;
				separateur="&";
			    }
			} else {
			    params += separateur+form.elements[champ].name+"="+form.elements[champ].value;
			    separateur="&";
			}	
	    }
		
		// Force le mode mini panier
		params += separateur + "mini_panier_pref=1";
		
	    //encode pour afficher caracteres speciaux comme %
	    params = encodeURI(params);
	    //mettre charset pour ie (utilise dans executeAjaxQueryPOST du fichier ajax.js)
	    charset = "utf8";
		
	    if (!executeAjaxQueryPOST(Adresse,panier.submitResponse,params)) {
		return false;
	    }
	} else {
 	    //ventes croisees / gamme / recherches
	    // Force le mode mini panier
	    if (Adresse.search(/\?/) > 0)
		Adresse += "&mini_panier_pref=1";
	    else
		Adresse += "?mini_panier_pref=1";
	    //window.console && console.log("GET to "+Adresse);	    

 	    if (!executeAjaxQueryGET(Adresse,panier.submitResponse)) {
		return false;
	    }
	}
	return true;
    },

    /* Fonction submitResponse
     *  handler XmlHttpRequest, gere le retour de la fonction d'ajout au panier
     */
    submitResponse : function (xmlhttp){
	if (xmlhttp.readyState == 4){
	    if (xmlhttp.status == 200){
			
		panier.creation();

		//recuperer nom fichier com_act.css
		var FindComActCss = new RegExp("(http[s]?://.*com_act[0-9]+.css)");
		
		if(FindComActCss.exec(xmlhttp.responseText)){
			var chemin_css = FindComActCss.exec(xmlhttp.responseText)[0];
	    
			//ajouter style com_act.css dans le head sinon style non pris en compte sous ie (etonnant non)
			var headID = document.getElementsByTagName("head")[0];
			
			var cssNode = document.createElement('link');
			cssNode.type = 'text/css';
			cssNode.rel = 'stylesheet';
			cssNode.href = chemin_css;
			cssNode.media = 'screen';
			
			headID.appendChild(cssNode);
		}
			
		// Extrait le mini panier du com_act (supprime tout le contenu precedent)
		var FindContenuPanier = xmlhttp.responseText.indexOf('<div id="BlocPreferenceMiniPanier"');
		var contenu_panier = xmlhttp.responseText.slice(FindContenuPanier);
		panier.divMessageBox.innerHTML = contenu_panier;
		panier.divMessageBox.style.display = "block";

		// Active le gestionnaire onclick personnalisé pour cacher le mini panier:
		document.body.onclick = panier.exit_onclick;
		
		//effet image panier du select produit vers panier
		if(document.getElementById("divBloc_MiniPanier")){
		    //si page != comparateur.cfm car pas de bloc mini panier
		    if(document.getElementById("encart_mini_panier")){
			panier.animer();
		    }
		}
		evalueScripts('divBlocContenu_MiniPanier');
		//timer = Time();
	    } else {
		//console.log("Reponse "+xmlhttp.status+"("+xmlhttp.statusText+") lors de la mise au panier");
		panier.alerte("Mise au panier impossible", "Erreur lors de la mise au panier, il y a eu un probleme lors de l'operation","","","OK");
	    }
	}
    },
	
    /* Fonction recuperationChampPerso
     *  
     */
    recuperationChampPerso : function (){
	// Appel fonction externe de validation si definie
	var test;
	if (typeof verificationArticlePersonnalisable == "function") {
	    test = verificationArticlePersonnalisable();
	}else if(typeof verificationArticlePersonnalisable == "undefined"){
		test = true;
	}else{
	    test = false;
	}
	if (test == true) {
	    var div_perso = document.getElementById('personnalisation_article');
	    var listeChamps= "";
	    if (document.getElementById("champ_perso")) {
	    	var parent = document.getElementById("champ_perso").parentNode;
	    	parent.removeChild(document.getElementById("champ_perso"));
	    }
	    if (!document.getElementById("champ_perso")) {
			listeChamps = panier.recuperationChampModifies(div_perso);
			if (listeChamps == false) {
			    return false;
			}
			var field = document.createElement("input");
			field.type = "hidden";
			field.name = "champ_perso";
			field.id   = "champ_perso";
			field.value = listeChamps;
			div_perso.appendChild(field);
	    }
	    return true;
	} else {
	    return false;
	}
    },

    recuperationChampModifies : function (perso) {
    var ext_autorised = new Array("jpg","jpeg","gif","png","tif","txt");
	var listeChamps = "";
	var listInput = perso.querySelectorAll("input,select,textarea");
    //var listInput = perso.getElementsByTagName("input");
    //var listSelect = perso.getElementsByTagName("select");
    //var listTextarea = perso.getElementsByTagName("textarea");
    var liste = new Array();

    //liste.push(listInput,listSelect,listTextarea);
    liste.push(listInput);

    
	var prec="",el,i = 0, separator="";
	
	for(i=0;i<liste.length;i++){
	    for(j=0;j<liste[i].length;j++){
			if(liste[i][j].name != prec){
			    if(liste[i][j].type == "file" && liste[i][j].value != ""){
					/* Test que l'extention soit dans la liste */
					var filename = liste[i][j].value;
					filename = filename.split(".");
					var extension = filename[filename.length - 1];
					if( ext_autorised.indexOf(extension.toLowerCase()) > -1 ){
					    var ajout_champ = document.createElement("input");
					    ajout_champ.type = "hidden";
					    ajout_champ.name = "nom_fichier_" + liste[i][j].name;
					    ajout_champ.value = liste[i][j].value;
					    var parent = perso.parentNode;
					    parent.insertBefore(ajout_champ, perso);
					}else{
					   panier.alerte("Upload impossible", "L'upload de fichier de type '" + extension + "' est impossible","","","OK");
					   return false;
					}
					/* controle de la taille du fichier */
				    if(liste[i][j].files[0].size > 5242880){
						panier.alerte("Upload impossible", "L'upload de fichier est limité à 5 Mo.","","","OK");
						return false;
				    }
			    }
			    listeChamps = listeChamps+separator+liste[i][j].name;
			    prec = liste[i][j].name; 
			}
		separator = ",";
	    }
	}
	return listeChamps;
    },



    /* Fonction affiche_bloc_alerte
     *  Gestion d'un message d'alerte bloc alerte option ou sous ref quelque soit preferences.mini_panier - liste_produits (lien selectionner)
     * */
    alerte : function(titre_alerte,msg,option,url,ok){
	
	panier.creation();
	
	var content = '';
	content += '<div id="encadrement_titre_code_dev">';
	content += '<div id="titre_code_dev">'+ titre_alerte+'</div></div>';

	content += '<div id="encadrement_texte_defaut">';
	
	content += '<table border="0" cellpadding="2" cellspacing="0" width="100%">';
	content += '<tr><td align="center">';			
	content += '<span class="texte_gras_defaut">'+msg+'</span>';				
	content += '</td></tr>';							
	content += '<tr><td>';
	content += '<div style="padding-left:20px">';
	content += '<span class="texte_gras_defaut">'+option+'</span></div>';
	content += '</td></tr>';						
	content += '<tr><td align="center" style="padding-top:10px" >';	
	content += '<span><input type="button" value="';
	content += ok+'" id="habillage_bouton_defaut"  onclick="panier.';
	if (url != '') content += "view('"+url+"')";
	else content += "exit()";
	
	content += '"></span>';
    
	content += '</td></tr>';
	content += '</table>';
	content += '<br></div></div>';
	
	/*
	 document.getElementById("BlocPreferenceMiniPanier").style.width	= "300px";
	 document.getElementById("BlocPreferenceMiniPanier").style.height= "200px";
     
	 document.getElementById("BlocPreferenceMiniPanier").style.left	= (document.body.clientWidth-300)/2+'px';
	 document.getElementById("BlocPreferenceMiniPanier").style.top	= (200+document.documentElement.scrollTop)+'px';
	 
	 document.getElementById("BlocPreferenceMiniPanier").style.position= "absolute";
	 //document.getElementById("BlocPreferenceMiniPanier").style.zIndex= "100";
	 
	 document.getElementById("BlocPreferenceMiniPanier").innerHTML = content;
	 */
	
	panier.divMessageBox.innerHTML += content;
	panier.divMessageBox.style.display="block";
	
	
	//timer = Time();
	// Active le gestionnaire onclick personnalisé pour cacher le mini panier:
	//  apres un delai sinon le click ayant entrainé l'affichage est pris en compte.
	window.setTimeout(function() {document.body.onclick = panier.exit_onclick;}, 500);
    }
};

