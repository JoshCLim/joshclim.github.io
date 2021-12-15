function pad(n, length) { //https://stackoverflow.com/questions/24503470/how-to-convert-number-to-3-digit-places
    var len = length - (''+n).length;
    return (len > 0 ? new Array(++len).join('0') : '') + n
}

const pokemonSource = document.getElementById("pokemon-container-template").innerHTML;
const pokemonTemplate = Handlebars.compile(pokemonSource);

const pokemonContainer = document.getElementById("pokemon-container");

const pokeNum = 20; // number of pokemon to display

const allPokemonData = ["All Pokemon Data Pulled from API as an array"];

function fetchData() { // fetch data from the pokemon API
    const apiURL = "https://pokeapi.co/api/v2/pokemon/";

    pokemonContainer.innerHTML = "";

    for (let i = 1; i <= pokeNum; i++) {
        
        let url = apiURL + i;

        fetch(url).then(function(res) {
            return res.json();
        }).then(function(data) {
            console.log(data);

            allPokemonData[i] = data;

            let pokemonData = {
                id: i,
                name: data.name,
                pictureLink: data.sprites.other["official-artwork"].front_default, //.sprites.front_default, //`https://assets.pokemon.com/assets/cms2/img/pokedex/detail/${pad(i, 3)}.png`, 
                types: data.types.map(q => q.type.name).join(", "),
                type: data.types.map(q => q.type.name)
            }
            //console.log(pokemonData); 

            let pokemonHTML = pokemonTemplate(pokemonData);
            pokemonContainer.innerHTML += pokemonHTML;

        })
    }
    
}


const mainCoverElement = document.getElementById("main-cover");

function addIndexEventListeners() {

    const detailContainer = document.getElementById("pokemon-detail-container");
    const detailName = document.getElementById("pokemon-detail-name");
    const detailId = document.getElementById("pokemon-detail-id");
    const detailTypes = document.getElementById("pokemon-detail-types");
    const detailImg = document.getElementById("pokemon-detail-img");
    const detailCaption = document.getElementById("pokemon-detail-caption");

    
    //console.log(pokeItems.length);
    const pokeItems = document.getElementsByClassName("poke-index");

    // add click event listener
    for (let p = 0; p < pokeItems.length; p++) {
        pokeItems[p].addEventListener("click", function() {
            let pokemonId = pokeItems[p].getAttribute('data-id')
            //console.log(pokemonId);

            let pokemonIdData = allPokemonData[pokemonId];

            let pokemonDisplayData = {
                id: pokemonId,
                name: pokemonIdData.name,
                pictureLink: pokemonIdData.sprites.front_default, //`https://assets.pokemon.com/assets/cms2/img/pokedex/detail/${pad(i, 3)}.png`, 
                types: pokemonIdData.types.map(q => q.type.name).join(", "),
                type: pokemonIdData.types.map(q => q.type.name),
                backPic: pokemonIdData.sprites.back_default,
                officialPic: pokemonIdData.sprites.other["official-artwork"].front_default,
                pics: [
                    pokemonIdData.sprites.other["official-artwork"].front_default, 
                    pokemonIdData.sprites.front_default, 
                    pokemonIdData.sprites.back_default
                ],
                captions: [
                    "official artwork",
                    "front",
                    "back"
                ],
                move: pokemonIdData.moves.map(q => q.move),
                moves: pokemonIdData.moves.map(q => q.move).join(", "),
                stats: {
                    hp: pokemonIdData.stats[0].base_stat,
                    attack: pokemonIdData.stats[1].base_stat,
                    defense: pokemonIdData.stats[2].base_stat,
                    speed: pokemonIdData.stats[5].base_stat
                }
            }
            //console.log(pokemonDisplayData);

            //detailContainer.innerText = "";
            detailName.innerText = pokemonDisplayData.name;
            detailId.innerText = pokemonDisplayData.id;
            detailTypes.innerText = pokemonDisplayData.types;
            detailImg.src = pokemonDisplayData.pics[0];
            detailCaption.innerText = pokemonDisplayData.captions[0];

            mainCoverElement.style.display = "block";
            mainCoverElement.style.opacity = 1;
            
        });
        
    }
 }

document.getElementById("pokemon-detail-close").addEventListener("click", function(e) {
    e.preventDefault();

    mainCoverElement.style.opacity = 0;
    mainCoverElement.style.display = "none";
})

function addTypeCSS() { // adds css styles for type icons

    //const stylesheet = window.document.styleSheets[0]; // to add CSS styles later

    const stylesheet1 = document.createElement("style");
    //stylesheet1.type = "text/css";
    

    const pokemonTypes = [ // array of pokemon types and colours for their icons
        {type: "bug", colour: "#92BC2C"},
        {type: "dark", colour: "#595761"},
        {type: "dragon", colour: "#0C69C8"},
        {type: "electric", colour: "#F2D94E"},
        {type: "fairy", colour: "#EE90E6"},
        {type: "fighting", colour: "#D3425F"},
        {type: "fire", colour: "#FBA54C"},
        {type: "flying", colour: "#A1BBEC"},
        {type: "ghost", colour: "#5F6DBC"},
        {type: "grass", colour: "#5FBD58"},
        {type: "ground", colour: "#DA7C4D"},
        {type: "ice", colour: "#75D0C1"},
        {type: "normal", colour: "#A0A29F"},
        {type: "poison", colour: "#B763CF"},
        {type: "psychic", colour: "#FA8581"},
        {type: "rock", colour: "#C9BB8A"},
        {type: "steel", colour: "#5695A3"},
        {type: "water", colour: "#539DDF"}
    ]

    for (let p = 0; p < pokemonTypes.length; p++) { // adds css for pokemon type icons, changing bg colour and box shadow
        let currentType = pokemonTypes[p].type;
        let currentColour = pokemonTypes[p].colour;

        let currentRule = 
        `.types-icon-${currentType} { 
            background-color: ${currentColour} !important; 
            box-shadow: 0 0 5px ${currentColour} !important; 
        }`;

        //stylesheet.insertRule(currentRule, stylesheet.cssRules.length);
        stylesheet1.innerText += currentRule;
    }

    document.head.appendChild(stylesheet1);
}



const header = document.getElementsByTagName('header')[0]; // get header element
const headerOffset = header.offsetTop + header.offsetHeight;

const scrollingHeader = document.getElementById('scrolling-header'); // get scrolling-header element

let scrolling = false;
window.addEventListener("scroll", function() {
    scrolling = true;
});

var manageScrollingHeader = setInterval( function() { // every 300ms, check for header management
    if (scrolling == true) {
        scrolling = false;

        // check if we have scrolled past the header
        if (window.scrollY > headerOffset) { // we have scrolled past the header
            scrollingHeader.style.top = "0";
        } else { // we can still see the header
            scrollingHeader.style.top = "-1070px";
        }
    }
}, 100)


//const main = new Promise(fetchData).then(addIndexEventListeners)
fetchData(); // calls fetchData

addTypeCSS();

const checkForLoadInterval = setInterval(function(){
    if (document.getElementsByClassName("poke-index").length == pokeNum) {
        clearInterval(checkForLoadInterval);
        addIndexEventListeners();
    }
}, 1000);

