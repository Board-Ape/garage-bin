const showAllItems = (allItems) => {
  allItems.forEach(item => {
    $('.items-container').append(`
      <div class='item${item.id} item'>
        <h2 class='item-name'>${item.name}</h2>
      </div>`);
  });
  totalCount();
};

const getAllItems = () => {
  fetch('/api/v1/items')
    .then(response => response.json())
    .then(allItems => {
      showAllItems(allItems);
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
      clearInputs();
    })
    .catch(error => console.log(error));
};

const totalCount = () => {
  const count = $('.item').length;
  $('.count').text(count)
};

$(document).ready(getAllItems);
$('.submit-button').on('click', postItem);
