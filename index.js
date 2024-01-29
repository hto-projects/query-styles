const express = require('express');
const url = require('url');
const fs = require('fs');
require('ejs');

const hostname = '0.0.0.0';
const port = 8080;

let app = express();
app.set('view engine', 'ejs');

let pictureUrls = [
  "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Pomelo_fruit.jpg/1280px-Pomelo_fruit.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Mandelpart2.jpg/300px-Mandelpart2.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Common_clownfish.jpg/1280px-Common_clownfish.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/2/25/Wfm_stata_center.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/M104_ngc4594_sombrero_galaxy_hi-res.jpg/1920px-M104_ngc4594_sombrero_galaxy_hi-res.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/2/27/Emperor_penguins.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Panthera_tigris_altaica_13_-_Buffalo_Zoo.jpg/1280px-Panthera_tigris_altaica_13_-_Buffalo_Zoo.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/Stockholm_photochrom2.jpg/1280px-Stockholm_photochrom2.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/Mirounga_leonina.jpg/1920px-Mirounga_leonina.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Koala_and_joey.jpg/800px-Koala_and_joey.jpg"
];

let animals = [
  {
    name: "dog",
    urls: ["https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Chin_posing.jpg/1024px-Chin_posing.jpg", "https://upload.wikimedia.org/wikipedia/commons/d/d5/Retriever_in_water.jpg", "https://upload.wikimedia.org/wikipedia/commons/9/99/Brooks_Chase_Ranger_of_Jolly_Dogs_Jack_Russell.jpg"],
    info: "The dog (Canis familiaris or Canis lupus familiaris) is a domesticated descendant of the wolf. Also called the domestic dog, it is derived from the extinct Pleistocene wolf, and the modern wolf is the dog's nearest living relative.",
  },
  {
    name: "cat",
    urls: ["https://upload.wikimedia.org/wikipedia/commons/thumb/7/76/TapetumLucidum.JPG/1280px-TapetumLucidum.JPG", "https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/Orange_tabby_cat_sitting_on_fallen_leaves-Hisashi-01A.jpg/800px-Orange_tabby_cat_sitting_on_fallen_leaves-Hisashi-01A.jpg", "https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/Feral_cat_Virginia_crop.jpg/800px-Feral_cat_Virginia_crop.jpg", "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bb/Kittyply_edit1.jpg/1280px-Kittyply_edit1.jpg"],
    info: "The cat (Felis catus) is a domestic species of small carnivorous mammal. It is the only domesticated species in the family Felidae and is commonly referred to as the domestic cat or house cat to distinguish it from the wild members of the family.",
  },
  {
    name: "turtle",
    urls: ["https://upload.wikimedia.org/wikipedia/commons/2/21/Turtle_diversity.jpg", "https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/Green_Sea_Turtle_swimming.jpg/1280px-Green_Sea_Turtle_swimming.jpg", "https://upload.wikimedia.org/wikipedia/commons/9/93/Two_basking_cooter_turtles_%285861462496%29.jpg", "https://upload.wikimedia.org/wikipedia/commons/9/99/T.h._hermanni_con_speroni_5.JPG"],
    info: "Turtles are an order of reptiles known as Testudines, characterized by a special shell developed mainly from their ribs. Modern turtles are divided into two major groups, the Pleurodira (side necked turtles) and Cryptodira (hidden necked turtles), which differ in the way the head retracts.",
  },
  {
    name: "dolphin",
    urls: ["https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Tursiops_truncatus_01.jpg/1920px-Tursiops_truncatus_01.jpg", "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Common_dolphin_%28Delphinus_delphis%29_Sagres.jpg/1920px-Common_dolphin_%28Delphinus_delphis%29_Sagres.jpg", "https://upload.wikimedia.org/wikipedia/commons/3/30/Dolphintursiops.jpg", "https://upload.wikimedia.org/wikipedia/commons/b/b3/Dolphind.jpg"],
    info: "A dolphin is an aquatic mammal within the infraorder Cetacea. Dolphin species belong to the families Delphinidae (the oceanic dolphins), Platanistidae (the Indian river dolphins), Iniidae (the New World river dolphins), Pontoporiidae (the brackish dolphins), and the extinct Lipotidae (baiji or Chinese river dolphin). There are 40 extant species named as dolphins.",
  },
  {
    name: "lion",
    urls: ["https://upload.wikimedia.org/wikipedia/commons/7/73/Lion_waiting_in_Namibia.jpg", "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c6/Okonjima_Lioness.jpg/1024px-Okonjima_Lioness.jpg", "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Lion_%28Panthera_leo%29_male_6y.jpg/800px-Lion_%28Panthera_leo%29_male_6y.jpg", "https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/Asiatic_lion_01.jpg/1280px-Asiatic_lion_01.jpg"],
    info: "The lion (Panthera leo) is a large cat of the genus Panthera native to Africa and India. It has a muscular, broad-chested body; short, rounded head; round ears; and a hairy tuft at the end of its tail."
  },
  {
    name: "bear",
    urls: ["https://upload.wikimedia.org/wikipedia/commons/9/9e/Ours_brun_parcanimalierpyrenees_1.jpg", "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Polar_Bear_AdF.jpg/1280px-Polar_Bear_AdF.jpg", "https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/Black_bear_large.jpg/800px-Black_bear_large.jpg", "https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Giant_Panda_Tai_Shan.JPG/1280px-Giant_Panda_Tai_Shan.JPG"],
    info: "Bears are carnivoran mammals of the family Ursidae (/ʊrsɪdaɪ/ or /ʊrsɪdiː/). They are classified as caniforms, or doglike carnivorans."
  }
];

function findAnimal(animalName) {
  let filtered = animals.filter(a => a.name === animalName);
  if (filtered.length) {
    return filtered[0];
  } else {
    return {
      name: "N/A",
      urls: ["https://upload.wikimedia.org/wikipedia/commons/c/c6/Blastulation.png"],
      info: "No info available."
    };
  }
}

function pickRandom(list) {
  return list[Math.floor(Math.random()*list.length)];
}

function homePage(request, response) {
  let parsedUrl = url.parse(request.url, true);
  let data = {};
  
  data.textColor = parsedUrl.query.textColor || "white";
  data.backgroundColor = parsedUrl.query.backgroundColor || "black";
  data.font = parsedUrl.query.font || "cursive";
  data.textAlign = parsedUrl.query.textAlign || "center";
  data.message = parsedUrl.query.message || "This could say anything"
  
  let animal = findAnimal(parsedUrl.query.animal);
  data.animalImg = pickRandom(animal.urls);

  if (parsedUrl.query.json === "true") {
    response.send({
      "message": "you have unlocked the secret...",
      "randomPicture": pickRandom(pictureUrls),
      "currentAnimalInfo": animal.info,
      "allAvailableAnimals": animals.map(a => a.name)
    });
  } else {
    response.render('home', data);
  }
}

app.get('/', homePage);

function listenCallback() {
    console.log('Server running');
}

app.listen(port, hostname, listenCallback);
