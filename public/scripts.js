const showAllItems = (allItems) => {
  allItems.forEach(item => {
    $('.items-container').append(`
      <div class='item${item.id} item ${item.cleanliness}''>
        <h2 class='item-name'>${item.name}</h2>
      </div>`);
  });
  totalCount();
};
let allItems;

const getAllItems = () => {
  fetch('/api/v1/items')
    .then(response => response.json())
    .then(items => {
      allItems = items;
      showAllItems(items);
    });
};

const clearInputs = () => {
  $('.name-input').val('');
  $('.reason-input').val('');
};

const postItem = () => {
  const newItem = {
    name: $('.name-input').val(),
    reason: $('.reason-input').val(),
    cleanliness: $('.drop-down').val()
  };

  fetch('/api/v1/items', {
    method: 'POST',
    body: JSON.stringify(newItem),
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(response => response.json())
    .then(items => {
      showAllItems(items);
      allItems.push(items[0]);
      clearInputs();
    })
    .catch(error => console.log(error));
};

const sortItemsAscending = (items) => {
  return items.sort((itemA, itemB) => {
    const titleA = itemA.name.toLowerCase();
    const titleB = itemB.name.toLowerCase();
    if (titleA < titleB) {
      return -1;
    }
    if (titleA > titleB) {
      return 1;
    }
    return 0;
  });
};

const sortItemsDescending = (items) => {
  return items.sort((itemA, itemB) => {
    const titleA = itemA.name.toLowerCase();
    const titleB = itemB.name.toLowerCase();
    if (titleA < titleB) {
      return 1;
    }
    if (titleA > titleB) {
      return -1;
    }
    return 0;
  });
};

const sortItems = () => {
  const buttonText =  $('.sort-button').text();
  if (buttonText === 'Sort A-Z') {
    $('.sort-button').text('Sort Z-A');
    $('.item').remove();
    showAllItems(sortItemsAscending(allItems));
  } else {
    $('.sort-button').text('Sort A-Z');
    $('.item').remove();
    showAllItems(sortItemsDescending(allItems));
  }
};

const totalCount = () => {
  const itemTotal = $('.item').length;
  const sparklingTotal = $('.Sparkling').length;
  const dustyTotal = $('.Dusty').length;
  const rancidTotal = $('.Rancid').length;

  $('.count').text(itemTotal);
  $('.sparkling-count').text(sparklingTotal);
  $('.dusty-count').text(dustyTotal);
  $('.rancid-count').text(rancidTotal);
};

$(document).ready(getAllItems);
$('.submit-button').on('click', postItem);
$('.sort-button').on('click', sortItems);
