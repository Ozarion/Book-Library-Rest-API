/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {

  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  */
  test('#example Test GET /api/books', function(done){
     chai.request(server)
      .get('/api/books')
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.isArray(res.body, 'response should be an array');
        assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
        assert.property(res.body[0], 'title', 'Books in array should contain title');
        assert.property(res.body[0], '_id', 'Books in array should contain _id');
        done();
      });
  });
  /*
  * ----[END of EXAMPLE TEST]----
  */

  suite('Routing tests', function() {

    suite('POST /api/books with title => create book object/expect book object', function() {
      
      test('Test POST /api/books with title', function(done) {
        const testBook = {"title" : 'testBook'};
        chai.request(server)
        .post('/api/books')
        .send(testBook)
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.property(res.body, '_id', 'returned object has an id');
          assert.property(res.body, 'title', 'returned object has a title');
          assert.equal(res.body.title, testBook.title,'returned object has correct title');
          done();
        });
      });
      
      test('Test POST /api/books with no title given', function(done) {
        const testBook = {"title" : ''};
        chai.request(server)
        .post('/api/books')
        .send(testBook)
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.text, 'no valid title provided', 'correctly handles no title given');
          done();
        });
      });
      
    });


    suite('GET /api/books => array of books', function(){
      
      test('Test GET /api/books',  function(done){
        chai.request(server)
        .get('/api/books')
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          for (const book of res.body) {
            assert.property(book, '_id','each book has an id');
            assert.property(book, 'title', 'each book has a title');
            assert.property(book, 'commentcount', 'each book has a comment count');
          }
          done();
        });
      });      
      
    });


    suite('GET /api/books/[id] => book object with [id]', function(){
      
      test('Test GET /api/books/[id] with id not in db',  function(done){
        const id = 'notAValidId';
        chai.request(server)
        .get('/api/books/' + id)
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.text, 'no book exists', 'correctly handles invalid id');
          done();
        });
      });
      
      test('Test GET /api/books/[id] with valid id in db',  function(done){
        // Post a book first and get that id then test for id
        const testBook = {"title" : "posted for testing get 'valid id'"};
        chai.request(server)
        .post('/api/books')
        .send(testBook)
        .end((err, res) => {
          const validId = res.body._id;
          chai.request(server)
          .get('/api/books/' + validId)
          .end((err, getResponse) => {
            assert.equal(getResponse.status, 200);
            assert.property(getResponse.body, '_id','each book has an id');
            assert.property(getResponse.body, 'title', 'each book has a title');
            assert.property(getResponse.body, 'comments', 'book has comments property');
            assert.isArray(getResponse.body.comments, 'comments property is an Array');
            assert.equal(getResponse.body._id, validId, 'ids match');
            done();
          });
        });
      });
      
    });


    suite('POST /api/books/[id] => add comment/expect book object with id', function(){
      
      test('Test POST /api/books/[id] with comment', function(done){
         // Post a book first and get that id then test for comment post on that id
        const testBook = {"title" : "posted for testing post a comment"};
        chai.request(server)
        .post('/api/books')
        .send(testBook)
        .end((err, res) => {
          const validId = res.body._id;
          const comment = {"comment" : "This comment is posted for testing (nothing personal)"};
          // Makes a post request with a comment update
          chai.request(server)
          .post('/api/books/' + validId)
          .send(comment)
          .end((err, postResponse) => {
            assert.equal(postResponse.status, 200);
            assert.property(postResponse.body, '_id','each book has an id');
            assert.property(postResponse.body, 'title', 'each book has a title');
            assert.property(postResponse.body, 'comments', 'book has comments property');
            assert.isArray(postResponse.body.comments, 'comments property is an Array');
            assert.equal(postResponse.body._id, validId, 'ids match');
            done();
          });
        });
      });
      
    });

  });

});
