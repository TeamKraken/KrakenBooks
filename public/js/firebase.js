angular.module('omnibooks.database', ['firebase'])
.factory('fireBase', function($firebaseArray, $firebaseObject) {
    var myDataRef = new Firebase('https://shutorial.firebaseio.com/');

    var enterBook = function(org, username, title, img, author, isbn, price) {
      var bookDetails = {
        title: title,
        img: img,
        author: author,
        isbn: isbn,
        createdBy: username,
        askingPrice: price
      };

      // push book details in org books and user bookshelf nodes
      var newBookRef = myDataRef.child(org).child('books').push(bookDetails);
      var bookID = newBookRef.key();
      myDataRef.child(org).child('users').child(username).child('bookshelf').child(bookID).set(bookDetails);
    };

    var deleteBook = function(org, user, bookId) {
      myDataRef.child(org).child('users').child(user).child('bookshelf').child(bookId).remove();
      myDataRef.child(org).child('books').child(bookId).remove();
    };

    var updateBook = function(org, user, id, bookNode) {
      myDataRef.child(org).child('users').child(user).child('bookshelf').child(id).update(bookNode);
      myDataRef.child(org).child('books').child(id).update(bookNode);
    };

    //get all books in same org
    var getOrgBook = function(org){
      var ref = myDataRef.child(org).child('books');
      return $firebaseArray(ref);
    };

    //get one book from a user, return object
    var getUserBook = function(org, username, id, callback) {
      var ref = myDataRef.child(org).child('books').child(id);
      ref.on('value', function(dataSnapshot) {
        callback(dataSnapshot.val());
        ref.off();
      });
      return $firebaseObject(ref);
    };

    // returns array of all books belonging to a user
    var getUserBookshelf = function(org, username) {
      var ref = myDataRef.child(org).child('users').child(username).child('bookshelf');
      return $firebaseArray(ref);
    };

    //get user detail info, return object
    var getUserInfo = function(org, username) {
      return $firebaseObject(myDataRef.child(org).child('users').child(username));
    };

    //get user detail info, return object
    var getUserEmail = function(org, username, callback) {
      var ref = myDataRef.child(org).child('users').child(username).child('userDetail/email');
      ref.on('value', function(dataSnapshot) {
        callback(dataSnapshot.val());
        ref.off();
      });
      return $firebaseObject(ref);
    };

    //for signup
    var createUser = function(authInfo, success, failed) {
      myDataRef.createUser(authInfo, function(err, userData) {
        if (err) {
          failed('the email address is already registered.');
          return;
        }
        var users = myDataRef.child(authInfo.org).child('users');
        users.child(authInfo.name).set({
          userDetail: {
            email: authInfo.email
          }
        });
        // save to the userOrg
        var userOrg = myDataRef.child('userOrg');
        userOrg.child(authInfo.name).set(authInfo.org);
        // save to the allUsers
        var allUsers = myDataRef.child('allUsers');
        allUsers.child(userData.uid).set({
          name: authInfo.name,
          org: authInfo.org
        });
        //log in
        myDataRef.authWithPassword(authInfo, function (err) {
          if (err) {
            failed('incorrect password.');
            return;
          }
          // invoke the callback
          success(authInfo);
        });
      });
    };

    //return users list
    var getUserOrg = function() {
      return $firebaseObject(myDataRef.child('userOrg'));
    };

    //for login
    var authWithPassword = function(authInfo, success, failed) {
      myDataRef.authWithPassword(authInfo, function(err, userData) {
        if (err) {
          failed('incorrect password.');
          return;
        }
        success(authInfo);
      });
    };

    // auto login
    var autoLogin = function (callback) {
      var authData = myDataRef.getAuth();
      if(!authData){
        return;
      }
      // if the user is logged in, set the user data in auth service using callback
      var uid = authData.uid;
      var email = authData.password.email;
      var allUsers = $firebaseObject(myDataRef.child('allUsers'));
      allUsers.$loaded().then(function () {
        var user = allUsers[uid];
        if(!user){
          return;
        }
        var authInfo = {
          name: user.name,
          email: email,
          org: user.org
        };
        callback(authInfo);
      });
    };

    // log out
    var logOut = function () {
      myDataRef.unauth();
    };

    return {
      enterBook: enterBook,
      deleteBook: deleteBook,
      updateBook: updateBook,
      getOrgBook: getOrgBook,
      getUserBook: getUserBook,
      getUserBookshelf: getUserBookshelf,
      getUserInfo: getUserInfo,
      createUser: createUser,
      authWithPassword: authWithPassword,
      getUserOrg: getUserOrg,
      getUserEmail: getUserEmail,
      autoLogin: autoLogin,
      logOut: logOut
    };
  });
