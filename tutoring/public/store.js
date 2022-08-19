// bootstrap - enable tooltips
const tooltipTriggerList = document.querySelectorAll(
  '[data-bs-toggle="tooltip"]'
);
const tooltipList = [...tooltipTriggerList].map(
  (tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl)
);

//   -----   ITEMS INFO   -----   //
var SHOPPING_CART = [];

const DEFAULT_PRICE = 69.99;
const DEFAULT_IMG_URL =
  "https://upload.wikimedia.org/wikipedia/en/7/7d/Minions_characters.png";
//const DEFAULT_IMG_URL = "https://i.guim.co.uk/img/media/01107302540df8c357f073a511361b89af7d50c5/0_120_2914_1747/master/2914.jpg?width=465&quality=45&auto=format&fit=max&dpr=2&s=7b75c0aae9bdaa8741469c2f896150d7";
const DEFAULT_DESCRIPTION =
  "Lorem ipsum dolor sit amet consectetur adipisicing elit. Animi odit blanditiis nesciunt nihil suscipit praesentium modi delectus assumenda sit optio, officiis obcaecati facere voluptatem eveniet ullam dolor quas molestiae quam.";

const ASSIGNMENT = 1;
const NOTES = 0;

//   -----   HTML   -----   //
const REMOVE_FROM_CART_ICON =
  '<svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-cart-dash" viewBox="0 0 16 16"><path d="M6.5 7a.5.5 0 0 0 0 1h4a.5.5 0 0 0 0-1h-4z"/><path d="M.5 1a.5.5 0 0 0 0 1h1.11l.401 1.607 1.498 7.985A.5.5 0 0 0 4 12h1a2 2 0 1 0 0 4 2 2 0 0 0 0-4h7a2 2 0 1 0 0 4 2 2 0 0 0 0-4h1a.5.5 0 0 0 .491-.408l1.5-8A.5.5 0 0 0 14.5 3H2.89l-.405-1.621A.5.5 0 0 0 2 1H.5zm3.915 10L3.102 4h10.796l-1.313 7h-8.17zM6 14a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm7 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/></svg>';
const ADD_TO_CART_ICON =
  '<svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-cart-plus" viewBox="0 0 16 16"><path d="M9 5.5a.5.5 0 0 0-1 0V7H6.5a.5.5 0 0 0 0 1H8v1.5a.5.5 0 0 0 1 0V8h1.5a.5.5 0 0 0 0-1H9V5.5z"/><path d="M.5 1a.5.5 0 0 0 0 1h1.11l.401 1.607 1.498 7.985A.5.5 0 0 0 4 12h1a2 2 0 1 0 0 4 2 2 0 0 0 0-4h7a2 2 0 1 0 0 4 2 2 0 0 0 0-4h1a.5.5 0 0 0 .491-.408l1.5-8A.5.5 0 0 0 14.5 3H2.89l-.405-1.621A.5.5 0 0 0 2 1H.5zm3.915 10L3.102 4h10.796l-1.313 7h-8.17zM6 14a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm7 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/></svg>';

const EMPTY_CART_MESSAGE = '<p class="m-2">Your shopping cart is empty.</p>';

//   -----   UTILITY BUTTONS and ELEMENTS  -----   //
const addToCartButtons = document.getElementsByClassName("add_to_cart__button"); //console.log(addToCartButtons);

const CART_COUNTER = document.getElementById("cart__counter");
const buttonShoppingCart = document.getElementById("shopping__cart__button");
const cartTotalPrice = document.getElementById("cartTotalPrice");

//   -----   CONTAINERS  -----   //
const itemColumns = document.getElementsByClassName("item__columns"); //console.log(itemColumns);

const alertContainer = document.getElementById("alerts__container");

const shoppingCartItemsContainer = document.querySelector(
  "#shoppingCartModal .modal-body"
);

//   -----   HANDLEBARS TEMPLATES  -----   //
const itemSource = document.getElementById("item__template").innerHTML;
const itemTemplate = Handlebars.compile(itemSource);

const cartItemSource = document.getElementById("cart_item__template").innerHTML;
const cartItemTemplate = Handlebars.compile(cartItemSource);

//   -----   ITEMS   -----   //
/* structure: ITEMS is an array of objects, each with the following properties
    {
        name: " ",                              // name of item
        price: 69.99,                           // price of item
        tags: ['notes', 'chemistry', 'HL'],     // tags that describe item, for filter purposes
        image: DEFAULT_IMG_URL,                 // url of item image
        description: DEFAULT_DESCRIPTION,       // description of item
        type: NOTES,                            // NOTES or ASSIGNMENT
        grade: "24/24"                          // grade, as a string
    }
*/

const ITEMS = [
  {
    index: -1,
    name: "Economics HL Notes",
    price: 69.99,
    tags: ["notes", "economics", "HL"],
    image: DEFAULT_IMG_URL,
    description: DEFAULT_DESCRIPTION,
    type: NOTES,
    grade: "24/24",
  },
  {
    index: -1,
    name: "Chemistry SL Notes",
    price: 69.99,
    tags: ["notes", "chemistry", "HL"],
    image: DEFAULT_IMG_URL,
    description: DEFAULT_DESCRIPTION,
    type: NOTES,
    grade: "24/24",
  },
  {
    index: -1,
    name: "Physics HL Notes",
    price: 69.99,
    tags: ["notes", "physics", "HL"],
    image: DEFAULT_IMG_URL,
    description: DEFAULT_DESCRIPTION,
    type: NOTES,
    grade: "24/24",
  },
  {
    index: -1,
    name: "Chemistry SL IA",
    price: 69.99,
    tags: ["IA", "chemistry", "HL"],
    image: DEFAULT_IMG_URL,
    description: DEFAULT_DESCRIPTION,
    type: ASSIGNMENT,
    grade: "24/24",
  },
  {
    index: -1,
    name: "Maths AA Notes",
    price: 99.99,
    tags: ["notes", "maths", "HL"],
    image: DEFAULT_IMG_URL,
    description: DEFAULT_DESCRIPTION,
    type: ASSIGNMENT,
    grade: "24/24",
  },
];

// add items to shopping container
const NUM_OF_ITEM_COLUMNS = 3;

let itemHTML;
function addItems() {
  for (let i = 0; i < NUM_OF_ITEM_COLUMNS; i++) {
    itemColumns[i].innerHTML = "";
  }

  for (let i = 0; i < ITEMS.length; i++) {
    ITEMS[i].index = i;
    ITEMS[i].price = parseFloat(ITEMS[i].price.toFixed(2));
    itemHTML = itemTemplate(ITEMS[i]);
    itemColumns[i % NUM_OF_ITEM_COLUMNS].innerHTML += itemHTML;
  }
}

// adds click event listener on add to cart button, and toggles add to cart
function addToCartEventListener() {
  for (let i = 0; i < ITEMS.length; i++) {
    addToCartButtons[i].addEventListener("click", function () {
      let itemIndex = parseInt(this.parentElement.parentElement.dataset.index);

      if (SHOPPING_CART.includes(itemIndex)) {
        //console.log("remove from cart clicked for", itemIndex);

        let index = SHOPPING_CART.indexOf(itemIndex);
        if (index > -1) {
          SHOPPING_CART.splice(index, 1); // 2nd parameter means remove one item only
        }
        //console.log(SHOPPING_CART);

        this.classList.remove("remove_from_cart__button");
        this.innerHTML = ADD_TO_CART_ICON;
        alert("Successfully removed from cart!", "secondary", alert_num); // alert success
        alert_num++;

        updateCartCounter();
      } else {
        //console.log("add to cart clicked for", itemIndex);
        SHOPPING_CART.push(itemIndex);
        //console.log(SHOPPING_CART);
        this.classList.add("remove_from_cart__button");
        this.innerHTML = REMOVE_FROM_CART_ICON;
        alert("Successfully added to cart!", "success", alert_num); // alert success
        alert_num++;

        updateCartCounter();
      }
    });
  }
}

// handle alerts
var alert_num = 0;
async function alert(message, type, alert_num) {
  const wrapper = document.createElement("div");
  wrapper.innerHTML = [
    `<div class="alert alert-${type} fade show alert-dismissible mx-0 mb-0 mt-3" role="alert" data-id="${alert_num}">`,
    `   <div>${message}</div>`,
    '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
    "</div>",
  ].join("");

  alertContainer.append(wrapper);

  window.setTimeout(function () {
    // fade out alert after 4 seconds
    document.querySelector('[data-id="' + alert_num + '"] button').click();
  }, 4000);
}

// updates cart counter
function updateCartCounter() {
  CART_COUNTER.innerText = SHOPPING_CART.length;
}

// shopping cart modal functionality
function loadShoppingCart() {
  // add event listener to shopping cart button

  buttonShoppingCart.addEventListener("click", function () {
    shoppingCartItemsContainer.innerHTML = "";
    cartTotalPrice.innerText = "0.00";

    if (SHOPPING_CART.length <= 0) {
      shoppingCartItemsContainer.innerHTML += EMPTY_CART_MESSAGE;
    } else {
      let totalPrice = 0;
      // add items
      for (let i = 0; i < SHOPPING_CART.length; i++) {
        totalPrice += ITEMS[SHOPPING_CART[i]].price;

        let cartItemHTML = cartItemTemplate(ITEMS[SHOPPING_CART[i]]);
        shoppingCartItemsContainer.innerHTML += cartItemHTML;
      }
      cartTotalPrice.innerText = totalPrice.toFixed(2);
    }
  });
}

function main() {
  addItems(); // add store items
  addToCartEventListener(); // add event listener for add_to_cart button
  loadShoppingCart(); // add event listener for opening the shopping cart
}

main();
