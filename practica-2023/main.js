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
      <br>
    </div>
  `;
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
  const response = await fetch('http://localhost:80/api/event');
  const data = await response.json();
  return data;
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
      setCheckoutEvent(event);
      setSelectEvent(event);
    });
  }
}

function setCheckoutEvent(eventData){
  const checkoutButton = document.querySelector('#checkoutButton-' + eventData.eventID);
  checkoutButton.addEventListener("click", (event) => {
    var selectData = document.querySelector('.select-' + eventData.eventID).value;
    console.log(selectData);
    //TODO
  });
}

const setTicketCategories = (eventData) => {
  const selectTickets = document.querySelector(".select-" + eventData.eventID);
  eventData.ticketCategoryList.forEach(ticketCategory => {
    const option = document.createElement("option");
    option.value = eventData.eventID;
    option.text = ticketCategory.description;
    selectTickets.add(option);
  });
}

function setSelectEvent(eventData){
  const selectTickets = document.querySelector(".select-" + eventData.eventID);
  const checkoutButton = document.querySelector('#checkoutButton-' + eventData.eventID);
  selectTickets.addEventListener("click", (event) => {
    var selectedOption = selectTickets.value;

    if(selectTickets.options[selectedOption].text !== "---Select your option---"){
      checkoutButton.disabled = false;
    }
  });
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
              <p class="timestamp text-black-700 font-bold">${eventData.startDate}</p>
              <label>End Date: </label>
              <p class="timestamp text-black-700 font-bold">${eventData.endDate}</p>
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
  const quantityInput = document.querySelector('.input-' + eventID);
  const checkoutButton = document.querySelector('#checkoutButton-' + eventID);
  const selectTickets = document.querySelector('.select-' + eventID);

  increaseButton.addEventListener("click", (event) => {
    var value = parseInt(quantityInput.value);

    if(value === 0){
      checkoutButton.disabled = false;
    }

    var selectedOption = selectTickets.value;

    if(selectTickets.options[selectedOption].text === "---Select your option---"){
      checkoutButton.disabled = true;
    }

    value += 1;
    quantityInput.value = value;
  });

  decreaseButton.addEventListener("click", (event) => {
    var value = parseInt(quantityInput.value);
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

  fetchAllEvents().then((data) => {
    // Create the event card element
    addEvents(data);
  });
}

function renderOrdersPage(categories) {
  const mainContentDiv = document.querySelector('.main-content-component');
  mainContentDiv.innerHTML = getOrdersPageTemplate();
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
