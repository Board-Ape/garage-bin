exports.seed = function(knex, Promise) {

  return knex('items').del()
    .then(() => {
      return Promise.all([
        knex('items').insert([
          {
            id: 1,
            name: 'hockey pads',
            reason: 'fast all the way',
            cleanliness: 'Rancid'
          },
          {
            id: 2,
            name: 'kayak',
            reason: 'rapids hardcore',
            cleanliness: 'Dusty'
          },
          {
            id: 3,
            name: 'Subarau WRX',
            reason: 'low miles',
            cleanliness: 'Sparkling'
          }
        ])
          .catch(error => console.log(`There was a seeding error ${ error }`))
      ]);
    })
    .catch(error => console.log(`There was a seeding error ${ error }`));
};
