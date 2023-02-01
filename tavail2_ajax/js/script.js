var titre;
var artiste;
var prix;
var info;
var peinture;
var typeChoice;


function Init() {
  titre = document.getElementById('titre');
  artiste = document.getElementById('artiste');
  prix = document.getElementById('prix');
  info = document.getElementById('info');
  peinture = document.getElementById('peinture');
  typeChoice = document.getElementById('typefichier');

  //Charger la peinture déjà choisi (code trouvé https://stackoverflow.com/questions/9618504/how-to-get-the-selected-radio-button-s-value)
  var code =  document.querySelector('input[name="peinture"]:checked').value;
  loadDoc(code)
  loadInfo(code)
}


async function ChargerInfo(el) {
  var code = el.value;

  loadDoc(code)
  loadInfo(code)
}


function getXML(xml, code) {
  var xmlDoc = xml.responseXML;
  for(let i = 0; i < xmlDoc.getElementsByTagName('collection')[0].childElementCount; i++){
    var x = xmlDoc.getElementsByTagName('code')[i];
    var y = x.childNodes[0];

    if(y.data === code){
      afficherDataXML(xmlDoc, i, titre)
      afficherDataXML(xmlDoc, i, artiste)
      afficherDataXML(xmlDoc, i, prix)

      var x2 = xmlDoc.getElementsByTagName("image")[i];
      var y2 = x2.childNodes[0];
      peinture.src = "./img/"+y2.data;
    }
  }
}

//Code inspiré de https://www.w3schools.com/xml/dom_nodes_get.asp
function afficherDataXML(xmlDoc, index, element){
  var x = xmlDoc.getElementsByTagName(element.id)[index];
  var y = x.childNodes[0];
  var node = document.createTextNode(y.data);
  element.appendChild(node);
}



function getJSON(xhr, code){
  var res = JSON.parse(xhr.responseText).peinture.find(peinture => peinture.code === code);


  var node = document.createTextNode(res.titre);
  titre.appendChild(node);
  var node = document.createTextNode(res.artiste);
  artiste.appendChild(node);
  var node = document.createTextNode(res.prix);
  prix.appendChild(node);

  peinture.src = "./img/"+res.image;
}

//Supprime le contenue d'un élément
const Empty = (e) => {
  while(e.firstChild){
    e.removeChild(e.firstChild);
  }
}


//Charge l'image, le titre, l'artiste et le prix de la peinture

function loadDoc(code) {
  var xhr = new XMLHttpRequest();

  xhr.onreadystatechange = function (){
    if(xhr.readyState == 4 && xhr.status == 200){
      
      Empty(titre)
      Empty(artiste)
      Empty(prix)
      Empty(info)

      if(typeChoice.value === "xml"){
        getXML(xhr, code);
        return;
      }
      getJSON(xhr, code)

    }
  }

  xhr.open("GET", "./ajax/peintures." + typeChoice.value, true);
  xhr.send();
}

//Charge l'info de la peinture

function loadInfo(code){
  var xhr = new XMLHttpRequest();

  xhr.onreadystatechange = function (){
    if(xhr.readyState == 4 && xhr.status == 200){

      var node = document.createTextNode(xhr.responseText);
      info.appendChild(node);
    }
  }
  
  xhr.open("GET", "./ajax/" + code + ".txt", true);
  xhr.send();
}

