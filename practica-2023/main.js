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

function renderHomePage() {
  const mainContentDiv = document.querySelector('.main-content-component');
  mainContentDiv.innerHTML = getHomePageTemplate();
  // Sample hardcoded event data
  const eventData = {
    id: 1,
    description: 'Sample event description.',
    img: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
    name: 'Sample Event',
    timestamp: '11.08.2023',
    ticketCategories: [
      { id: 1, description: 'General Admission' },
      { id: 2, description: 'VIP' },
    ],
  };
  // Create the event card element
  const eventCard = document.createElement('div');
  eventCard.classList.add('event-card'); 

  const contentMarkup = `
    <div class = "col-container">
      <div class = "col">
        <img class = "eventImage" src="${eventData.img}">
      </div>

      <div class = "col">
        <div class = "col">
          <header>
            <h2 class="event-title text-2xl font-bold">${eventData.name}</h2>
            <br>
            <p class="description text-gray-700">${eventData.description}</p>
            <label>Start Date: </label>
            <p class="timestamp text-black-700 font-bold">${eventData.timestamp}</p>
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

  eventCard.innerHTML = contentMarkup;
  const eventsContainer = document.querySelector('.events');
  // Append the event card to the events container
  eventsContainer.appendChild(eventCard);
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
