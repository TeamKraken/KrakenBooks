var mongoose = require('mongoose');
var debug = require('debug')('db');

var db = mongoose.connect('mongodb://admin:admin@ds037272.mongolab.com:37272/mavdb1');

// Start connection and confirm with log
mongoose.connection.on("open", function(){
  console.log("Connected to MongoDB")
})

var Schema = mongoose.Schema;

// User
var userSchema = new Schema({
   name: String,
   email: String,
   username: {
       type: String,
       trim: true,
       unique: true
   },
   password: String,
   provider: String,
   providerId: String,
   providerData: {},
});

// Book
var bookSchema = new Schema({
  title:  { type: 'String', required: true },
  author: { type: 'String', required: true },
  img:   String,
  isbn: { type: 'String', required: true },
  // createdBy: { ref: 'username'}, NEED TO FIGURE OUT RELATIONSHIP REFERENCE
  askingPrice: { type: 'Number', required: true }
});

var otherSchema = new Schema({
  itemName: { type: 'String', required: true },
  descroption: { type: 'String', required: true },
  askingPrice: { type: 'Number', required: true },
})

// School
var schoolSchema = new Schema({
  name: String,
  location: String,
})

// Models for each collection
var Book = mongoose.model('book', bookSchema);
var User = mongoose.model('user', userSchema);
var School = mongoose.model('school', schoolSchema);
var Other = mongoose.model('other', otherSchema);

// Test data
var bookinfo = {
  title: "Jim",
  author: "Jim's Friend Bob",
  img: 'this is all kinds of cool stuff',
  isbn: '1238jdj8d',
  askingPrice: 32
}

// Functions go here
module.exports = {
  find: function(){
    Book.find({}, function(err, book){
      if (err) { console.log("Error:", err) } else {
      console.log("Books:", book);
      }
    })
  },
  add: function(item){
    var book1 = new Book(bookinfo).save;
    book1.save(function(err, data){
      if(err){ console.log("Error:", err) } else {
        console.log("Success: ", data)
      }
    })
  }
};
