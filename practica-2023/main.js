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
      console.log(event);
      eventsDiv.appendChild(createEvent(event));
    });
  }
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
            </header>
          </div>
          <div class = "col">
            <footer>
              <button class="checkoutButton">Checkout</button>
            </footer>
          </div>
        </div>
      </div>
    `;
    const eventCard = document.createElement('div');
    eventCard.innerHTML = contentMarkup;
    return eventCard;
}

function renderHomePage() {
  const mainContentDiv = document.querySelector('.main-content-component');
  mainContentDiv.innerHTML = getHomePageTemplate();

  fetchAllEvents().then((data) => {
    console.log(data);
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
