class Calculator {
  #currentYear = new Date().getFullYear();
  constructor(
    item_name,
    item_price,
    year_of_purchase,
    depreciation_percentage
  ) {
    this.item_name = item_name;
    this.item_price = item_price;
    this.year_of_purchase = year_of_purchase;
    this.depreciation_percentage = depreciation_percentage;
  }

  getItemName() {
    return this.item_name;
  }

  getItemPrice() {
    return this.item_price;
  }

  getYearOfPurchase() {
    return this.year_of_purchase;
  }

  getDepreciationPercentage() {
    return this.depreciation_percentage;
  }

  getItemCurrentWorth() {
    let period = this.#currentYear - this.year_of_purchase;
    return this.item_price - period * this.depreciation_percentage;
  }
}

const calculateWorth = document.querySelector(".get-form");
const body = document.querySelector("body");
const category = document.querySelector("#category");

let AddedItems = [];
//add items from localstorage if they exist
const existingData = JSON.parse(localStorage.getItem("Assets"));
if (existingData !== null) {
  existingData.forEach((data) => {
    AddedItems.push(data);
  });
}

if (calculateWorth) {
  calculateWorth.addEventListener("click", (e) => {
    // create item form and append to body
    const ItemForm = createNewElementWithInnerHTML(
      "div",
      "calc-container",
      displayItemForm()
    );
    body.appendChild(ItemForm);

    // update the local storage with values from the input form
    const add_item = document.querySelector("#add-item");
    const calculator_div = document.querySelector(".calculator");
    if (add_item) {
      add_item.addEventListener("click", (e) => {
        e.preventDefault();
        const name = inputCapturing("#input_name");
        //purchase_price
        const purchase_price = inputCapturing("#input_price");
        //purchase_year
        const pur_year = inputCapturing("#year");
        //depreciation
        const depreciation = inputCapturing("#input_description");
        const item = createNewElement("div", "item");
        //create Item description inner div
        const itemDescription = createNewElement("div", "item-description");
        //create calculator
        let calculator = new Calculator(
          name,
          purchase_price,
          pur_year,
          depreciation
        );
        //create and add item elements
        const itemName = createNewElementWithInnerHTML(
          "p",
          "item-name",
          `${calculator.getItemName()}`
        );
        const itemPurchasePrice = createNewElementWithInnerHTML(
          "p",
          "item-purchase-price",
          `Purchase Price: R${calculator.getItemPrice()}`
        );
        const itemCurrentWorth = createNewElementWithInnerHTML(
          "p",
          "item-current-worth",
          `Current Worth: R${calculator.getItemCurrentWorth()}`
        );
        //add or delete Items
        const addItem = createNewIcon(
          "a",
          '<i class="fa-solid fa-plus"></i>',
          "item-add"
        );
        const deleteItem = createNewIcon(
          "a",
          '<i class=" delete-item-icon fa-solid fa-xmark" ">',
          "item-del"
        );

        const instruction = createNewElementWithInnerHTML(
          "p",
          "instructions",
          `<span class="bold">+</span> - Add to assets ,<span class="bold">x</span> - Do not add to assets`
        );

        item.append(itemDescription, addItem, deleteItem);
        itemDescription.append(itemName, itemPurchasePrice, itemCurrentWorth);
        calculator_div.append(instruction, item);

        // Clear input fields
        clearInput("#input_name");
        clearInput("#input_price");
        clearInput("#year");
        clearInput("#input_description");
        add_item.disabled = true;
        add_item.style.cssText = `
                background-color: rgba(253, 120, 60, .6);
             `;
        //create add and delete functionalities
        addItem.addEventListener("click", (e) => {
          //   e.preventDefault();

          AddedItems.push({
            name: calculator.getItemName(),
            purchasePrice: calculator.getItemPrice(),
            currentWorth: calculator.getItemCurrentWorth(),
          });
          console.log(AddedItems);
          localStorage.setItem("Assets", JSON.stringify(AddedItems));
          item.style.display = "none";
          instruction.style.display = "none";
          add_item.disabled = false;
          add_item.style.cssText = `
            background-color: rgb(253, 120, 60);
          `;
        });

        deleteItem.addEventListener("click", (e) => {
          item.style.display = "none";
          instruction.style.display = "none";
          add_item.disabled = false;
          add_item.style.cssText = `
            background-color: rgb(253, 120, 60);
          `;
        });
      });
    }
  });
}

//get access to assets
const assets = document.querySelector(".get-assets");
if (assets) {
  assets.addEventListener("click", () => {
    //create assets's outer container
    const assetsOuterContainer = createNewElement("div", "assets-container");
    const assetsInnerContainer = createNewElement("div", "assets");
    const itemList = createNewElement("ul", "items-list");
    const AssetsInLocalStorage =
      JSON.parse(localStorage.getItem("Assets")) || [];
    let totalWorth = 0;
    if (AssetsInLocalStorage.length !== 0) {
      AssetsInLocalStorage.forEach((item) => {
        const newItem = createNewElementWithInnerHTML(
          "li",
          "assets-li",
          ` <div class="asset">
              <p class="asset-name">${item.name}</p>
              <p class="asset-burrent-worth">${item.currentWorth}</p>
            </div>
            <a href="#" class="delete-item">
              <i class="fa-regular fa-trash-can " style="color: #050505"></i>
            </a>`
        );
        let itemPrice = item.currentWorth.toString();
        itemPrice = itemPrice.trim();
        totalWorth += parseInt(itemPrice, 10);
        itemList.append(newItem);
      });
    }

    const totalWorthDiv = createNewElementWithInnerHTML(
      "p",
      "total-worth",
      `Your Total Worth: <span class="total">R${totalWorth}.00</span> `
    );
    const cancelSign = createNewElementWithInnerHTML(
      "div",
      "cancel-assets-container",
      `<i class="fa-solid fa-xmark" style="color: #050505"></i>`
    );
    if (cancelSign) {
      cancelSign.addEventListener("click", (e) => {
        assetsOuterContainer.style.display = "none";
      });
    }
    assetsInnerContainer.append(cancelSign, totalWorthDiv, itemList);
    assetsOuterContainer.append(assetsInnerContainer);

    body.append(assetsOuterContainer);
  });
}

// get daily motivation
const todayMotivation = document.querySelector(".todays-motivation");
if (todayMotivation) {
  //fetch daily motivation from freecodecamp free api
  fetch("https://type.fit/api/quotes")
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      const randomIndex = getRandomNumber(1, data.length - 1);
      const innerElement = createNewElementWithInnerHTML(
        "p",
        "inner-element",
        `<div>
          <p>${data[randomIndex].text}</p>
          <p class="motivation-author">-${data[randomIndex].author}</p>
      </div>`
      );

      todayMotivation.append(innerElement);
    });
}

//utilities

function displayItemForm() {
  return `
    <div class="calculator">
        <a id="cancel" href="" id="cancel"><i class="fa-solid fa-xmark" style="color: #174c4f;"></i></a>
        <h1>Calculate Item's worth</h1>
        <form action="">
            <div class="itemName">
                <label for="item_name">Item Name: </label>
                <input required id="input_name" name="item_name" type="text" >
            </div>

            <div class="purchase_price">
                <label for="purchase_price">Purchase Price: </label>
                <input required id="input_price" name="purchase_price" type="text" >
            </div>

            <div class="year">
                <label for="year">Purchase Year: </label>
                <input required id="year" name="Depreciation" type="text" >
            </div>

            <div class="depreciation">
                <label for="Depreciation">Depreciation Rate: </label>
                <input required id="input_description" name="Depreciation" type="text" >
            </div>
            <button class="btn-secondary" id="add-item" type="submit">Calculate</button>

            
        </form>
    </div>`;
}

const inputCapturing = (itemID) => {
  return document.querySelector(itemID).value;
};

const clearInput = (itemID) => {
  if (document.querySelector(itemID).value !== "") {
    document.querySelector(itemID).value = "";
  }
};

const createNewElement = (element, className) => {
  const newElement = document.createElement(element);
  newElement.classList.add(className);
  return newElement;
};

const createNewIcon = (element, innerHTML, className) => {
  const addItem = document.createElement(element);
  addItem.innerHTML = innerHTML;
  addItem.classList.add(className);
  return addItem;
};

const createNewElementWithInnerHTML = (element, className, innerHTML) => {
  const newElement = document.createElement(element);
  newElement.classList.add(className);
  newElement.innerHTML = innerHTML;
  return newElement;
};

const getRandomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
