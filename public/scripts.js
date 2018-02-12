const showAllItems = (allSpaceItems) => {
  allSpaceItems.map(item => {
    $('.items-container').append(`
      <div id=${item.id} class='item${item.id} item ${item.cleanliness}'>
        <h2 class='item-name'>${item.name}</h2>
        <button class='details-button'>Details</button>
        <div class='item-details hidden'>
          <p>Reason: ${item.reason}</p>
          <h4>Cleanliness: </h4>
          <select class="detail-drop-down" name="">
            <option ${item.cleanliness === 'Sparkling' ? 'selected' : ''} value="Sparkling">Sparkling</option>
            <option ${item.cleanliness === 'Dusty' ? 'selected' : ''} value="Dusty">Dusty</option>
            <option ${item.cleanliness === 'Rancid' ? 'selected' : ''} value="Rancid">Rancid</option>
          </select>
        </div>
      </div>
    `);
  });
  totalCount();
};
let allSpaceItems;

const getAllItems = () => {
  fetch('/api/v1/items')
    .then(response => response.json())
    .then(items => {
      allSpaceItems = items;
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
      allSpaceItems.push(items[0]);
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
    showAllItems(sortItemsAscending(allSpaceItems));
  } else {
    $('.sort-button').text('Sort A-Z');
    $('.item').remove();
    showAllItems(sortItemsDescending(allSpaceItems));
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

const toggleDetails = (event) => {
  $(event.target).siblings('.item-details').toggleClass('hidden');
};

const openGarage = () => {
  $('.closed').addClass('roll-up');
  $('.open-button').remove();
};

const alterCleanliness = (event) => {
  const newCleanliness = JSON.stringify({
    cleanliness: event.target.value
  });
  const id = $(event.target).closest('.item').attr('id');

  fetch(`/api/v1/items/${id}`, {
    method: 'PATCH',
    body: newCleanliness,
    headers: {
      'Content-Type': 'application/json'
    }
  });
};

$(document).ready(getAllItems);
$('.submit-button').on('click', postItem);
$('.open-button').on('click', openGarage);
$('.sort-button').on('click', sortItems);
$('.items-container').on('click', '.details-button', (event) => toggleDetails(event));
$('.items-container').on('change', '.detail-drop-down', (event) => alterCleanliness(event));
