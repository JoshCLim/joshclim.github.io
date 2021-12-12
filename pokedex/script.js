function pad(n, length) { //https://stackoverflow.com/questions/24503470/how-to-convert-number-to-3-digit-places
    var len = length - (''+n).length;
    return (len > 0 ? new Array(++len).join('0') : '') + n
}

const pokemonSource = document.getElementById("pokemon-container-template").innerHTML;
const pokemonTemplate = Handlebars.compile(pokemonSource);

const pokemonContainer = document.getElementById("pokemon-container");

const pokeNum = 10; // number of pokemon to display

const allPokemonData = ["All Pokemon Data Pulled from API as an array"];

function fetchData() { // fetch data from the pokemon API
    const apiURL = "https://pokeapi.co/api/v2/pokemon/";

    pokemonContainer.innerHTML = "";

    for (let i = 1; i <= pokeNum; i++) {
        
        let url = apiURL + i;

        fetch(url).then(function(res) {
            return res.json();
        }).then(function(data) {
            //console.log(data);

            allPokemonData[i] = data;

            let pokemonData = {
                id: i,
                name: data.name,
                pictureLink: data.sprites.front_default, //`https://assets.pokemon.com/assets/cms2/img/pokedex/detail/${pad(i, 3)}.png`, 
                types: data.types.map(q => q.type.name).join(", "),
                type: data.types.map(q => q.type.name)
            }
            //console.log(pokemonData); 

            let pokemonHTML = pokemonTemplate(pokemonData);
            pokemonContainer.innerHTML += pokemonHTML;

        })
    }
    
}
function addIndexEventListeners() {
    
    //console.log(pokeItems.length);
    const pokeItems = document.getElementsByClassName("poke-index");
    // add click event listener
    for (let p = 0; p < pokeItems.length; p++) {
        pokeItems[p].addEventListener("click", function() {
            /*console.log(pokeItems[p].getAttribute('data-id'));*/
        });
        
    }
 }


function addTypeCSS() {

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
})

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

