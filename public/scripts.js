const showAllItems = (allItems) => {
  allItems.forEach(item => {
    $('.items-container').append(`
      <div> class='item${item.id} item'>
        <h2 class='item-name'>${item.name}</h2>
      </div>`);
  });
};

const getAllItems = () => {
  fetch('/api/v1/items')
    .then(response => response.json())
    .then(allItems => {
      showAllItems(allItems);
    });
};

$(document).ready(getAllItems);
