angular.module('omnibooks.profile', ['ui.bootstrap','ngFileUpload','xeditable'])
.run(function(editableOptions) {
  editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'
})
.controller('ProfileController', ['$scope', '$stateParams', '$modal', '$state', 'auth', 'fireBase', 'bookinfoAPI', 'productImg', 'Upload','$http',
  function($scope, $stateParams, $modal, $state, auth, fireBase, bookinfoAPI, productImg, Upload, $http) {
    var currentOrg = auth.getOrg();
    var currentUser = auth.getUser();
      $scope.upload = function (files) {
        if(files){
          console.log('up load file!!!')
        console.log(files);
        var file = files[0];
      }
    };

    $scope.enterBook = function(url, isbn, price, files) {
      $scope.upload(files);
      url = url||'http://books.sorodesign.com/wp-content/uploads/2010/01/book-cover-full-small.jpg'
      if (isbn && price) {
        $scope.error = false;
        if (isbn.charAt(3) === '-') {
          isbn = isbn.slice(0, 3) + isbn.slice(4)
          console.log(isbn)
        }
        var displayDetail = function(res) {
           // $scope.prices = res.data.data;
          title = res[0].title_long;
          author = res[0].author_data[0].name;

        fireBase.enterBook(currentOrg, currentUser.$id, title, url, author, isbn, price);
           
        };

        if (price.charAt(0) === '$') {
          price = price.slice(1);
          console.log(price)
        }

        bookinfoAPI.getInfo(isbn, displayDetail);

      } else {
        $scope.error = "*You must fill out all required fields";
      }
  };


    $scope.enterItem = function(itemImgUrl, itemName, itemDescription, itemPrice, isbn) {
      if (itemName && itemImgUrl && itemDescription) {
        $scope.error = false;

        if (itemPrice.charAt(0) === '$') {
          itemPrice = itemPrice.slice(1);
        }

        // If a book, send in ISBN to get the rest of the book info and then enter to db
        if(isbn){

          function enterBookItem (res) {
            var bookDetails = {
              title: res[0].title_long,
              author: res[0].author_data[0].name,
              isbn: isbn
            };

            fireBase.enterItem(currentOrg, currentUser.$id, itemImgUrl, itemName, itemDescription, itemPrice, bookDetails);
            console.log('successfully entered book item');
          };

          bookinfoAPI.getInfo(isbn, enterBookItem);
        } else {
        //Otherwise, just enter item into database without book info
          productImg.getInfo();
          bookDetails = {};
          fireBase.enterItem(currentOrg, currentUser.$id, itemImgUrl, itemName, itemDescription, itemPrice, bookDetails);
          console.log('successfully entered nonbook item');
        }


      } else{
        $scope.error = "*You must fill out all required fields";
      }
    };

    $scope.deleteBook = function(book) {
      console.log(book);
      fireBase.deleteBook($scope.org, $scope.username, book.$id);
    };

    $scope.username = auth.getUser().$id;
    $scope.org = auth.getOrg();
    $scope.noBooks = false;
    $scope.books = fireBase.getUserBookshelf($scope.org, $scope.username);
    $scope.items = fireBase.getUserItems($scope.org, $scope.username);


    if($scope.books.length === 0) {
      noBooks = true;
    }


  // modal methods
  $scope.animationsEnabled = true;
  $scope.modalShown = false;
  $scope.toggleUploadModal = function() {
    if(!$scope.error) {
      $scope.uploadModalShown = !$scope.uploadModalShown;
    }
  };
  $scope.toggleEditModal = function(book) {
    if(!$scope.error) {
      $scope.editModalShown = !$scope.editModalShown;
      $scope.bookEdit = book;
    }
  };
  $scope.toggleItemModal = function() {
    if(!$scope.error) {
      $scope.itemModalShown = !$scope.itemModalShown;
    }
  };

  $scope.updateBook = function() {
    var update = {
      title: $scope.bookEdit.title,
      author: $scope.bookEdit.author,
      img: $scope.bookEdit.img,
      isbn: $scope.bookEdit.isbn,
      askingPrice: $scope.bookEdit.askingPrice
    }
    fireBase.updateBook($scope.org, $scope.username, $scope.bookEdit.$id, update);
  }

  $scope.updateItem = function() {
    var update = {
      name: $scope.bookEdit.name,
      img: $scope.bookEdit.img,
      isbn: $scope.bookEdit.description,
      askingPrice: $scope.bookEdit.askingPrice
    }
    fireBase.updateItem($scope.org, $scope.username, $scope.bookEdit.$id, update);
  };

}])
.directive('modal', function() {
  return {
    templateUrl: "../html/bookUpload.html",
    restrict: 'E',
    scope: {
      show: '='
    },
    replace: true, // Replace with the template below
    transclude: true, // we want to insert custom content inside the directive
    link: function(scope, element, attrs) {
      scope.dialogStyle = {};
      if (attrs.width)
        scope.dialogStyle.width = attrs.width;
      if (attrs.height)
        scope.dialogStyle.height = attrs.height;
      scope.hideModal = function() {
        scope.show = false;
      };
    }
  };
})
.factory('bookinfoAPI', function($http) {
    var key = 'UTUJEB5A';
    var getInfo = function(isbn, callback) {
      return $http({
          method: 'GET',
          url: '/bookInfo',
          params: {
            'book_isbn': isbn
          }
        })
        .then(function(res) {
          callback(res.data.data);
        });
    };
    return {
      getInfo: getInfo
    };
})
.factory('productImg', function($http) {
    var getInfo = function(searchindex, keywords) {
      console.log()
      return $http({
          method: 'GET',
          url: '/productImg',//
          params: {
            'SearchIndex': "Electronics",
            'Keywords': "Apple MacBook Air MJVE2LL/A 13.3-Inch Laptop (128 GB) NEWEST VERSION"
          }
        })
        .then(function(res) {
          // callback(res.data.data);
          console.log('productInfo res',res)
          console.log('Title',     res.data.ItemSearchResponse.Items[0].Item[0].ItemAttributes[0].Title[0]);
          console.log('ListPrice', res.data.ItemSearchResponse.Items[0].Item[0].ItemAttributes[0].ListPrice[0].FormattedPrice[0]);
          console.log('UPC',       res.data.ItemSearchResponse.Items[0].Item[0].ItemAttributes[0].UPC[0]);
          console.log('URL',       res.data.ItemSearchResponse.Items[0].Item[0].ItemLinks[0].ItemLink[0].URL[0]);
          console.log('Img',       res.data.ItemSearchResponse.Items[0].Item[0].LargeImage[0].URL[0]);
        });
    };
    return {
      getInfo: getInfo
    };
})
