/* eslint-disable no-alert */


/**************
 *   SLICE 1
 **************/

function updateCoffeeView(coffeeQty) {
  const coffeeCount = document.getElementById('coffee_counter');
  coffeeCount.innerText = coffeeQty; 
}

function clickCoffee(data) {
  data.coffee += 1;
  updateCoffeeView(data.coffee);
  renderProducers(data);
}

/**************
 *   SLICE 2
 **************/

function unlockProducers(producers, coffeeCount) {
  producers.forEach(producer => {
    if (coffeeCount >= producer.price/2) {
    producer.unlocked = true;
    }
  });
}

function getUnlockedProducers(data) {
  return data.producers.filter(producer => {
    if (producer.unlocked === true) return producer;
  });
}

function makeDisplayNameFromId(id) {
  return id
  .replaceAll('_', ' ')
  .split(' ')
  .map(word => word[0].toUpperCase() + word.slice(1).toLowerCase())
  .join(' ');
}


// You shouldn't need to edit this function-- its tests should pass once you've written makeDisplayNameFromId
function makeProducerDiv(producer) {
  const containerDiv = document.createElement('div');
  containerDiv.className = 'producer';
  const displayName = makeDisplayNameFromId(producer.id);
  const currentCost = producer.price;
  const html = `
  <div class="producer-column">
    <div class="producer-title">${displayName}</div>
    <button type="button" id="buy_${producer.id}">Buy</button>
  </div>
  <div class="producer-column">
    <div>Quantity: ${producer.qty}</div>
    <div>Coffee/second: ${producer.cps}</div>
    <div>Cost: ${currentCost} coffee</div>
  </div>
  `;
  containerDiv.innerHTML = html;
  return containerDiv;
}

function deleteAllChildNodes(parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
  return parent;
}

function renderProducers(data) {
  let producerContainer = document.getElementById('producer_container');
  unlockProducers(data.producers, data.coffee);
  deleteAllChildNodes(producerContainer);
  getUnlockedProducers(data).forEach(producer => {
  producerContainer.appendChild(makeProducerDiv(producer))
  });
}

/**************
 *   SLICE 3
 **************/

function getProducerById(data, producerId) {
  for (let i = 0; i < data.producers.length; i++) {
    if (data.producers[i].id === producerId) return data.producers[i];
  }
}

function canAffordProducer(data, producerId) {
  for (let i = 0; i < data.producers.length; i++) {
    if (data.producers[i].id === producerId) {
      if (data.coffee >= data.producers[i].price) return true;
      else return false;
    }
  }
}

function updateCPSView(cps) {
  const cpsTotal = document.getElementById('cps');
  cpsTotal.innerText = cps;
}

function updatePrice(oldPrice) {
  let updatedPrice = Math.floor(oldPrice * 1.25);
  return updatedPrice;
}

function attemptToBuyProducer(data, producerId) {
  if (canAffordProducer(data, producerId)) {
    for (let i = 0; i < data.producers.length; i++) {
      if (data.producers[i].id === producerId) {
        let currentProducer = data.producers[i];
         currentProducer.qty++;
         data.coffee = data.coffee - currentProducer.price;
         currentProducer.price = updatePrice(currentProducer.price);
         data.totalCPS = data.totalCPS + currentProducer.cps;
       }
    }
    return true;
  }
  else return false; 
}

function buyButtonClick(event, data) {
  if (event.target.tagName === 'BUTTON') {
    let currentProducerId = event.target.id.slice(4);
    if (attemptToBuyProducer(data, currentProducerId)) {
      renderProducers(data);
      updateCoffeeView(data.coffee);
      updateCPSView(data.totalCPS);
    } else {
    window.alert('Not enough coffee!');
    }
  }
}

function tick(data) {
  data.coffee = data.coffee + data.totalCPS;
  updateCoffeeView(data.coffee);
  renderProducers(data);
}

/*************************
 *  Start your engines!
 *************************/

// You don't need to edit any of the code below
// But it is worth reading so you know what it does!

// So far we've just defined some functions; we haven't actually
// called any of them. Now it's time to get things moving.

// We'll begin with a check to see if we're in a web browser; if we're just running this code in node for purposes of testing, we don't want to 'start the engines'.

// How does this check work? Node gives us access to a global variable /// called `process`, but this variable is undefined in the browser. So,
// we can see if we're in node by checking to see if `process` exists.
if (typeof process === 'undefined') {
  // Get starting data from the window object
  // (This comes from data.js)
  const data = window.data;

  // Add an event listener to the giant coffee emoji
  const bigCoffee = document.getElementById('big_coffee');
  bigCoffee.addEventListener('click', () => clickCoffee(data));

  // Add an event listener to the container that holds all of the producers
  // Pass in the browser event and our data object to the event listener
  const producerContainer = document.getElementById('producer_container');
  producerContainer.addEventListener('click', event => {
    buyButtonClick(event, data);
  });

  // Call the tick function passing in the data object once per second
  setInterval(() => tick(data), 1000);
}
// Meanwhile, if we aren't in a browser and are instead in node
// we'll need to exports the code written here so we can import and
// Don't worry if it's not clear exactly what's going on here;
// We just need this to run the tests in Mocha.
else if (process) {
  module.exports = {
    updateCoffeeView,
    clickCoffee,
    unlockProducers,
    getUnlockedProducers,
    makeDisplayNameFromId,
    makeProducerDiv,
    deleteAllChildNodes,
    renderProducers,
    updateCPSView,
    getProducerById,
    canAffordProducer,
    updatePrice,
    attemptToBuyProducer,
    buyButtonClick,
    tick
  };
}

