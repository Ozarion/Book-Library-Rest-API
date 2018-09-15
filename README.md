## **Project** Book Library Management RESP API
------


### [A Simple Preview Application](https://personal-library-ozarion.glitch.me/)
* ADD YOUR MongoDB connection string to .env without quotes as db
    `example: DB=mongodb://admin:pass@1234.mlab.com:1234/yourdb`

#### API endpoints
* `POST` new book `/api/books` with title of the book
* `POST` a comment on specific book at `/api/books/:bookId`
* `GET` all books `/api/books`
* `GET` a book by it's id `/api/books/:bookId`
* `DELETE` all your books `/api/books`
* `DELETE` a specific book by giving it's id `/api/books/:id`

##### You can can above endpoints on the preview application for testing