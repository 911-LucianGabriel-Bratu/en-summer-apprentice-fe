import { addLoader, removeLoader } from "./loader/loader";

// Navigate to a specific URL
function navigateTo(url) {
  history.pushState(null, null, url);
  renderContent(url);
}
// HTML templates
function getHomePageTemplate() {
  return `
   <div id="content" >
      <h1 class="mainHeader">Ticket Management</h1>
      <hr class="menuSeparator">
      <br>
      <div class="center-container">
        <input class="name-filter-input" placeholder="Filter by name"></input>
        <br>
        <button type="button" class="collapsible">Open filters menu</button>
        <div class="collapsible-content">
          <div class="columns-div">
            <div class="col-container">
              <div class="col">
                <p>Venues:</p>
                <div class="radioMenuVenues"></div>
              </div>
              <div class="col">
                <p>EventTypes:</p>
                <div class="radioMenuEventTypes"></div>
              </div>
            </div>
            <button class="clear-selection-button">Clear selection</button>
          </div>
        </div>
      </div>
      <div class="events flex items-center justify-center flex-wrap">
      </div>
    </div>
  `;
}

function getOrdersPageTemplate() {
  return `
    <div id="content">
      <h1 class="mainHeader">Purchased Tickets</h1>
      <hr class="menuSeparator">
      <div>
        <table class="ordersTable">
            <thead class="ordersThead">
                <tr>
                    <th scope="col" class="px-6 py-3">
                        Customer name
                    </th>
                    <th scope="col" class="px-6 py-3">
                        Ticket type
                    </th>
                    <th scope="col" class="px-6 py-3">
                        Ordered at
                    </th>
                    <th scope="col" class="px-6 py-3">
                        Number of tickets
                    </th>
                    <th scope="col" class="px-6 py-3">
                        Total price
                        <button class="sort_placeholder"><i class="fa-solid fa-sort"></i></button>
                        <button class="sort_asc"><i class="fas fa-sort-up"></i></button>
                        <button class="sort_desc"><i class="fas fa-sort-down"></i></button>
                    </th>
                    <th scope="col" class="px-6 py-3">
                        Actions
                    </th>
                </tr>
          </thead>
        </table>
      </div>
      <br>
    </div>
  `;
}

function clearOrdersTableBody(){
  let ordersTable = document.querySelector('.ordersTable');
  while(ordersTable.rows.length > 1){
    ordersTable.deleteRow(1);
  }
}

const debounce = (func, delay) => {
  let debounceTimer
  return function() {
      const context = this
      const args = arguments
          clearTimeout(debounceTimer)
              debounceTimer
          = setTimeout(() => func.apply(context, args), delay)
  }
}

function setupInitialOrdersSortingButtons(orders){
  const placeholder_button = document.querySelector(".sort_placeholder");
  const asc_button = document.querySelector(".sort_asc");
  const desc_button = document.querySelector(".sort_desc");

  placeholder_button.addEventListener("click", () => {
    placeholder_button.style.display = "none";
    asc_button.style.display = "inline-block";
    sort_asc(orders);
    clearOrdersTableBody();
    addOrders(orders);
  });

  asc_button.addEventListener("click", debounce(() => {
    asc_button.style.display = "none";
    desc_button.style.display = "inline-block";
    sort_desc(orders);
    clearOrdersTableBody();
    addOrders(orders);
  }, 500));

  desc_button.addEventListener("click", debounce(() => {
    desc_button.style.display = "none";
    asc_button.style.display = "inline-block";
    sort_asc(orders);
    clearOrdersTableBody();
    addOrders(orders);
  }, 500));
}

const sort_asc = (orders) => {
  orders.sort(function(a, b){return a.totalPrice - b.totalPrice});
}

const sort_desc = (orders) => {
  orders.sort(function(a, b){return b.totalPrice - a.totalPrice});
}

function liveSearch(events){
  const nameInput = document.querySelector('.name-filter-input');

  if(nameInput){
    const inputName = nameInput.value;
    if(inputName !== undefined){
      const filteredEvents = events.filter((event) => 
        event.eventName.toLowerCase().includes(inputName.toLowerCase())
      );
      addEvents(filteredEvents);
    }
  }
}

function setupFilterEvents(events) {
  const nameInput = document.querySelector('.name-filter-input');
  nameInput.addEventListener("keyup", debounce(() => {
    liveSearch(events);
  }, 250));
}

function setupNavigationEvents() {
  const navLinks = document.querySelectorAll('nav a');
  navLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      const href = link.getAttribute('href');
      navigateTo(href);
    });
  });
}

function setupMobileMenuEvent() {
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileMenu = document.getElementById('mobileMenu');

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });
  }
}

function populateRadioMenus(events) {
  const venueSet = new Set(events.map((event) => event.venue.location));
  const eventTypeSet = new Set(events.map((event) => event.eventType.eventTypeName));

  populateVenuesMenu(venueSet);
  populateEventTypesMenu(eventTypeSet);

}

const setupClearSelectionButton = (data) => {
  const clearSelectionButton = document.querySelector('.clear-selection-button');
  const radioButtonsSetVenues = document.querySelectorAll('input[name="venue"]');
  const radioButtonsSetEventTypes = document.querySelectorAll('input[name="eventType"]');
  
  clearSelectionButton.addEventListener("click", () => {
    radioButtonsSetVenues.forEach(
      ((radioButton) => {radioButton.checked = false;})
    );
    radioButtonsSetEventTypes.forEach(
      ((radioButton) => {radioButton.checked = false;})
    );
    addEvents(data);
  });
}

function populateVenuesMenu(venueSet){
  const venuesRadioMenuDiv = document.querySelector('.radioMenuVenues');
  venueSet.forEach((venue) => {
    venuesRadioMenuDiv.appendChild(createRadioButtonVenue(venue));
  })
}

function populateEventTypesMenu(eventTypeSet){
  const eventTypesRadioMenuDiv = document.querySelector('.radioMenuEventTypes')
  eventTypeSet.forEach((eventType) => {
    eventTypesRadioMenuDiv.appendChild(createRadioButtonEventType(eventType));
  });
}

function createRadioButtonVenue(venue){
    const contentMarkup =
    `
      <input class="radio-input-${venue}" type="radio" id="venue" name="venue">
      <label for="venue">${venue}</label><br>
    `;
    const newDiv = document.createElement("div");
    newDiv.innerHTML = contentMarkup;
    return newDiv;
}

function createRadioButtonEventType(eventType){
  const contentMarkup =
  `
    <input class="radio-input-${eventType}" type="radio" id="eventType" name="eventType">
    <label for="eventType">${eventType}</label><br>
  `;
  const newDiv = document.createElement("div");
  newDiv.innerHTML = contentMarkup;
  return newDiv;
}

function setupRadioButtonEvents(){
  const radioButtonsSetVenues = document.querySelectorAll('input[name="venue"]');
  const radioButtonsSetEventTypes = document.querySelectorAll('input[name="eventType"]');

  radioButtonsSetVenues.forEach(
    (radioButton) => {radioButton.addEventListener("change", () => {
      filterItems(radioButtonsSetVenues, radioButtonsSetEventTypes);
    });}
  );
  radioButtonsSetEventTypes.forEach(
    (radioButton) => {radioButton.addEventListener("change", () => {
      filterItems(radioButtonsSetVenues, radioButtonsSetEventTypes);
    });}
  );
}

function filterItems(radioButtonsSetVenues, radioButtonsSetEventTypes){
  const selectedRadioButtonVenuesValue = Array.from(radioButtonsSetVenues)
  .filter(radioButton => radioButton.checked);
  
  const selectedRadioButtonEventTypesValue = Array.from(radioButtonsSetEventTypes)
  .filter(radioButton => radioButton.checked);

  let venueRadioButtonClass = "";
  let eventTypeRadioButtonClass = "";

  if(selectedRadioButtonVenuesValue[0] !== undefined){
    venueRadioButtonClass = selectedRadioButtonVenuesValue[0].classList.value;
  }

  if(selectedRadioButtonEventTypesValue[0] !== undefined){
    eventTypeRadioButtonClass = selectedRadioButtonEventTypesValue[0].classList.value;
  }

  const location = venueRadioButtonClass.split('radio-input-')[1];
  const eventType = eventTypeRadioButtonClass.split('radio-input-')[1];
  fetchFilteredEvents(location, eventType).then((filteredEvents) => {
    addEvents(filteredEvents);
  });
}

async function fetchFilteredEvents(location, eventType){
  const response = await fetch(`http://localhost:80/api/event/dtos/location/${location}/eventType/${eventType}`);
  const data = await response.json();
  return data;
}

function setupCollapsible() {
  const coll = document.querySelector('.collapsible');
  coll.addEventListener("click", () => {
    coll.classList.toggle("active");
    let content = coll.nextElementSibling;
    if(content.style.display === "block"){
      content.style.display = "none";
    }
    else{
      content.style.display = "block";
    }
  });
}

function setupPopstateEvent() {
  window.addEventListener('popstate', () => {
    const currentUrl = window.location.pathname;
    renderContent(currentUrl);
  });
}

function setupInitialPage() {
  const initialUrl = window.location.pathname;
  renderContent(initialUrl);
}

async function fetchAllEvents(){
  const response = await fetch('http://localhost:80/api/event/dtos');
  const data = await response.json();
  return data;
}

async function fetchAllOrders(){
  const response = await fetch('http://localhost:80/api/orders/dtos/1')
  const data = await response.json();
  return data;
}

const addOrders = (orders) => {
  const ordersTable = document.querySelector('.ordersTable');
  if(orders.length){
    orders.forEach(order => {
      ordersTable.appendChild(createOrder(order));
      setupOrdersButtons(order);
      const submitButton = document.querySelector('#submitButton-' + order.orderID);
      const cancelButton = document.querySelector('#cancelButton-' + order.orderID);
      submitButton.style.visibility = 'hidden';
      cancelButton.style.visibility = 'hidden';
    });
  }
  setupInitialOrdersSortingButtons(orders);
}

const addEvents = (events) => {
  const eventsDiv = document.querySelector('.events');
  eventsDiv.innerHTML = 'No events';
  if(events.length){
    eventsDiv.innerHTML = '';
    events.forEach(event => {
      eventsDiv.appendChild(createEvent(event));
      setTicketCategories(event);
      setButtonEvents(event.eventID);
      setSelectEvent(event);
      setCheckoutEvent(event);
    });
  }
}

function setCheckoutEvent(eventData){
  const checkoutButton = document.querySelector('#checkoutButton-' + eventData.eventID);
  checkoutButton.addEventListener("click", (event) => {
    const selectTickets = document.querySelector('.select-' + eventData.eventID);
    let ticketCategoryDesc = "";

    const selectValue = selectTickets.value;
    let collection = selectTickets.options;
    for(let i of collection){
      if(i.value === selectValue){
        ticketCategoryDesc = i.text;
      }
    }

    const totalQuantity = document.querySelector('.input-' + eventData.eventID).value;

    fetch('http://localhost:80/api/orders', {
      method: "POST",
      body: JSON.stringify({
        eventID: +eventData.eventID,
        customerID: 1,
        ticketCategory: ticketCategoryDesc,
        numberOfTickets: +totalQuantity
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      }
    });
    toastr.success("Order placed successfully!");
  });
}

const setTicketCategories = (eventData) => {
  const selectTickets = document.querySelector(".select-" + eventData.eventID);
  eventData.ticketCategoryDTOS.forEach(ticketCategory => {
    const option = document.createElement("option");
    option.value = ticketCategory.ticketCategoryID;
    option.text = ticketCategory.description;
    selectTickets.add(option);
  });
}

function setSelectEvent(eventData){
  const selectTickets = document.querySelector(".select-" + eventData.eventID);

  selectTickets.addEventListener("click", (event) => {
    const checkoutButton = document.querySelector('#checkoutButton-' + eventData.eventID);
    const inputQuantity = document.querySelector(".input-" + eventData.eventID);

    const selectedOption = selectTickets.value;
    let collection = selectTickets.options;
    for(let i of collection){
      if(i.value === selectedOption){
        if(i.text !== "---Select your option---" && inputQuantity.value > 0){
          checkoutButton.disabled = false;
        }
      }
    }
  });
}

const setupOrdersButtons = (orderData) => {
  const editButton = document.querySelector('#editButton-' + orderData.orderID);
  const submitButton = document.querySelector('#submitButton-' + orderData.orderID);
  const cancelButton = document.querySelector('#cancelButton-' + orderData.orderID);
  const deleteButton = document.querySelector('#deleteButton-' + orderData.orderID);

  editButton.addEventListener("click", (event) => {
    editButton.style.visibility = 'hidden'
    submitButton.style.visibility = 'visible';
    cancelButton.style.visibility = 'visible';
  });

  cancelButton.addEventListener("click", (event) => {
    editButton.style.visibility = 'visible'
    submitButton.style.visibility = 'hidden';
    cancelButton.style.visibility = 'hidden';
  });

  deleteButton.addEventListener("click", (event) => {
    const id = orderData.orderID;
    cancelOrder(id);
  })
}

async function cancelOrder(orderID){
  const response = await fetch(`http://localhost:80/api/orders/${orderID}`, {
    method: "DELETE",
    headers: {
      "Content-type": "application/json; charset=UTF-8"
    }
  });
  toastr.success("Order successfully cancelled!");
  renderOrdersPage();
}

const createOrder = (orderData) => {
  const contentMarkup =
  `
    <td>${orderData.customerName}</td>
    <td>${orderData.ticketCategoryDescription}</td>
    <td>${new Date(orderData.orderedAt)}</td>
    <td>${orderData.numberOfTickets}</td>
    <td>${orderData.totalPrice}</td>
    <td>
      <button class="editButton" id="editButton-${orderData.orderID}"><i class="fa fa-pencil" aria-hidden="true"></i></button>
      <button class="submitButton" id="submitButton-${orderData.orderID}"><i class="fa-solid fa-check" style="color: #00ff11;"></i></button>
      <button class="cancelButton" id="cancelButton-${orderData.orderID}"><i class="fa-solid fa-x" style="color: #ff0000;"></i></button>
      <button class="deleteButton" id="deleteButton-${orderData.orderID}"><i class="fa-solid fa-trash-can" style="color: #de411b"></i></button>
    </td>
  `;

  const orderRow = document.createElement("tr");
  orderRow.innerHTML = contentMarkup;
  return orderRow;
}

const createEvent = (eventData) => {
  const contentMarkup = 
    `
      <div class = "col-container">
        <div class = "col">
          <img class = "eventImage" src="${eventData.imageURL}">
        </div>

        <div class = "col">
          <div class = "col">
            <header>
              <h2 class="event-title text-2xl font-bold">${eventData.eventName}</h2>
              <br>
              <p class="description text-gray-700">${eventData.eventDescription}</p>
              <label>Start Date: </label>
              <p class="timestamp text-black-700 font-bold">${new Date(eventData.startDate)}</p>
              <label>End Date: </label>
              <p class="timestamp text-black-700 font-bold">${new Date(eventData.endDate)}</p>
              <label>Choose one of the following ticket categories:</label>
              <select class="select-${eventData.eventID}">
                <option value="0" disabled selected>---Select your option---</option>
              </select>
              <br>
              <label>Select the quantity:</label>
              <div class="col-container">
                <div class="row">
                  <input class="input-${eventData.eventID}" value=0 type="number" size=4></input>
                </div>
                <div class="row">
                  <button class = "incrementButton" id="incrementButton-${eventData.eventID}">+</button>
                </div>
                <div class="row">
                  <button class = "decrementButton" id="decrementButton-${eventData.eventID}">-</button>
                </div>
              </div>
            </header>
          </div>
          <div class = "col">
            <footer>
              <button class = "checkoutButton" id="checkoutButton-${eventData.eventID}" disabled>Checkout</button>
            </footer>
          </div>
        </div>
      </div>
    `;
    const eventCard = document.createElement('div');
    eventCard.innerHTML = contentMarkup;
    return eventCard;
}

function setButtonEvents(eventID){
  const increaseButton = document.querySelector('#incrementButton-' + eventID);
  const decreaseButton = document.querySelector('#decrementButton-' + eventID);
  

  increaseButton.addEventListener("click", (event) => {
    const quantityInput = document.querySelector('.input-' + eventID);
    const checkoutButton = document.querySelector('#checkoutButton-' + eventID);
    const selectTickets = document.querySelector('.select-' + eventID);
    let value = parseInt(quantityInput.value);

    if(value === 0){
      checkoutButton.disabled = false;
    }

    const selectedOption = selectTickets.value;
    let collection = selectTickets.options;
    for(let i of collection){
      if(i.value === selectedOption){
        if(i.text !== "---Select your option---"){
          checkoutButton.disabled = false;
        }
        else{
          checkoutButton.disabled = true;
        }
      }
    }

    value += 1;
    quantityInput.value = value;
  });

  decreaseButton.addEventListener("click", (event) => {
    const quantityInput = document.querySelector('.input-' + eventID);
    const checkoutButton = document.querySelector('#checkoutButton-' + eventID);
    const selectTickets = document.querySelector('.select-' + eventID);
    let value = parseInt(quantityInput.value);
    if(value === 1){
      checkoutButton.disabled = true;
    }
    if(value > 0){
      value -= 1;
      quantityInput.value = value;
    }
  });
}

function renderHomePage() {
  const mainContentDiv = document.querySelector('.main-content-component');
  mainContentDiv.innerHTML = getHomePageTemplate();
  addLoader();
  fetchAllEvents().then((data) => {
    setTimeout(() => {
      removeLoader();
    }, 200);
    // Create the event card element
    addEvents(data);
    setupFilterEvents(data);
    setupCollapsible();
    populateRadioMenus(data);
    setupRadioButtonEvents();
    setupClearSelectionButton(data);
  })
  .catch(error => {
    console.log(error);
    toastr.error("Error!")
  })
  .finally(() => {
    toastr.info("Dasboard rendered.")
  });
}

function renderOrdersPage(categories) {
  const mainContentDiv = document.querySelector('.main-content-component');
  mainContentDiv.innerHTML = getOrdersPageTemplate();
  addLoader();
  fetchAllOrders().then((data) => {
    setTimeout(() => {
      removeLoader();
    }, 200);
    addOrders(data);
  })
  .catch(error => {
    console.log(error);
    toastr.error("Error!")
  })
  .finally(() => {
    toastr.info("Orders rendered.")
  });
}

// Render content based on URL
function renderContent(url) {
  const mainContentDiv = document.querySelector('.main-content-component');
  mainContentDiv.innerHTML = '';

  if (url === '/') {
    renderHomePage();
  } else if (url === '/orders') {
    renderOrdersPage()
  }
}

// Call the setup functions
setupNavigationEvents();
setupMobileMenuEvent();
setupPopstateEvent();
setupInitialPage();
