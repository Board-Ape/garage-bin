const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
const server = require('../server');

const environment = process.env.NODE_ENV || 'test';
const configuration = require('../knexfile')[environment];
const database = require('knex')(configuration);
chai.use(chaiHttp);

describe('Client Routes', () => {
  it('should return the homepage', () => {
    return chai.request(server)
      .get('/')
      .then(response => {
        response.should.have.status(200);
        response.should.be.html;
      })
      .catch(error => {
        throw error;
      });
  });
  it('should return a 404 for a route that does not exist', () => {
    return chai.request(server)
      .get('/unhappy')
      .then(response => {
        response.should.have.status(404);
      })
      .catch(error => {
        throw error;
      });
  });
});

describe('API Routes', () => {
  before((done) => {
    database.migrate.latest()
      .then( () => done())
      .catch(error => {
        throw error;
      });
  });

  beforeEach((done) => {
    database.seed.run()
      .then(() => done())
      .catch(error => {
        throw error;
      });
  });

  describe('GET /api/v1/items', () => {
    it('should get items from database', (done) => {
      chai.request(server)
        .get('/api/v1/items')
        .then(response => {
          response.should.have.status(200);
          response.should.be.json;
          response.body.should.be.a('array');
          response.body.length.should.equal(3);
          response.body[0].should.have.property('id');
          response.body[0].id.should.equal(1);
          response.body[0].should.have.property('name');
          response.body[0].name.should.equal('hockey pads');
          response.body[0].should.have.property('reason');
          response.body[0].reason.should.equal('fast all the way');
          response.body[0].should.have.property('cleanliness');
          response.body[0].cleanliness.should.equal('Rancid');
          done();
        })
        .catch(error => {
          throw error;
        });
    });

    it('should return a 404 for a route that does not exist', () => {
      return chai.request(server)
        .get('/api/v1/unhappy')
        .then(response => {
          response.should.have.status(404);
        })
        .catch(error => {
          throw error;
        });
    });
  });

  describe('POST /api/v1/items', () => {
    it('should post a new item to the database', () => {
      return chai.request(server)
        .post('/api/v1/items')
        .send({
          name: 'Magic Wand',
          reason: 'For Hogwarts',
          cleanliness: 'Sparkling'
        })
        .then(response => {
          response.should.have.status(201);
          response.should.be.json;
          response.body.should.be.a('array');
          response.body[0].should.have.property('id');
          response.body[0].id.should.equal(4);
          response.body[0].should.have.property('name');
          response.body[0].name.should.equal('Magic Wand');
          response.body[0].should.have.property('reason');
          response.body[0].reason.should.equal('For Hogwarts');
          response.body[0].should.have.property('cleanliness');
          response.body[0].cleanliness.should.equal('Sparkling');
        })
        .catch(error => {
          throw error;
        });
    });

    it('should return a 404 for a route that does not exist', () => {
      return chai.request(server)
        .post('/api/v1/items/unhappy')
        .then(response => {
          response.should.have.status(404);
        })
        .catch(error => {
          throw error;
        });
    });
  });

  describe('PATCH /api/v1/items/:id', () => {
    it('should patch an item in the database', () => {
      chai.request(server)
        .patch('/api/v1/items/1')
        .send({
          cleanliness: 'Sparkling'
        })
        .then(response => {
          response.should.have.status(204);
        })
        .catch(error => {
          throw error;
        });
    });

    it('should return status 422 if project does not exist', () => {
      chai.request(server)
        .patch('/api/v1/items/910')
        .send({
          cleanliness: 'Sparkling'
        })
        .then(response => {
          response.should.have.status(422);
        })
        .catch(error => {
          throw error;
        });
    });
  });

});
