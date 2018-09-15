/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

const mongoose = require('mongoose');
const MONGODB_CONNECTION_STRING = process.env.DB;
const Schema = mongoose.Schema;

const bookSchema = new Schema({
  title : {type: String, required: true},
  comments : [String]
});

module.exports = function (app) {
  mongoose.connect(MONGODB_CONNECTION_STRING);
  const db = mongoose.connection;
  db.on('error', () => { console.log("Cannot Connect to Database") });
  db.once('open', () => {
    console.log("Successfully Connected to Database");
    
    // Book Model
    const Book = mongoose.model('Book', bookSchema);
    
    app.route('/api/books')
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      .get((req, res) => {
      Book.find()
      .exec((err, books) => {
        if (err) {
          return res.send("found nothing");
        }
        if (!books) {
          return res.json([]);
        }
        books = books.map(book => {
          return {"_id":book._id, "title": book.title, "commentcount": book.comments.length};
        });
        return res.json(books);
      });
    })
      //response will contain new book object including atleast _id and title
      .post((req, res) => {
      const title = (req.body.title) ? req.body.title : "";
      if (title === "") {
        return res.send("no valid title provided");
      }
      const newBook = new Book({"title" : title, "comments" : []});
      newBook.save()
      .then(savedBook => {
        return res.json({_id: savedBook._id, title: savedBook.title}); 
      })
      .catch(err => {
        return res.status(200).type('text').send('error occured');
      });
    })
      //if successful response will be 'complete delete successful'
      .delete((req, res) => {
      Book.remove({}, (err) => {
        if (err) {
          return res.send("cannot delete all documents");
        }
        return res.send("complete delete successful");
      });
    });
    
    app.route('/api/books/:id')
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      .get((req, res) => {
      const bookid = req.params.id;
      Book.findById(bookid)
      .exec((err, foundBook) => {
        if (err) {
          return res.send("no book exists");
        }
        return res.json({"_id": foundBook._id, "title": foundBook.title, "comments": foundBook.comments});
      });
    })
    
      .post(function(req, res){
      const bookid = req.params.id;
      const comment = req.body.comment;
      const query = {"$push": {"comments" : comment}};
      const options = {new: true};
      Book.findByIdAndUpdate(bookid, query, options)
      .exec((err, foundBook) => {
        if (err) {
          return res.send("no book exists");
        }
        return res.json({"_id": foundBook._id, "title": foundBook.title, "comments": foundBook.comments});
      });
    })
      //if successful response will be 'delete successful'
      .delete((req, res) => {
      const bookid = req.params.id;
      Book.findByIdAndRemove(bookid)
      .exec((err, deleted) => {
        if (err) {
          res.send("no book exists");
        }
        return res.send("delete successful");
      });
    });
    
    //404 Not Found Middleware
    app.use(function(req, res, next) {
      res.status(404)
        .type('text')
        .send('Not Found');
    });
    
  });
};