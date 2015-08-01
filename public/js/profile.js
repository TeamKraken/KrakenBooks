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

    $scope.enterItem = function(itemImgUrl, itemName, itemDescription, itemPrice, isbn) {
      if (itemName && itemDescription) {
        $scope.error = false;

        if (itemPrice.charAt(0) === '$') {
          itemPrice = itemPrice.slice(1);
        }

        // If a book, send in ISBN to get the rest of the book info and then enter to db
        var bookDetails;
        var awsDetails;

          function enterBookItem (res) {
            bookDetails = {
              title: res[0].title_long,
              author: res[0].author_data[0].name,
              isbn: isbn
            };

            fireBase.enterItem(currentOrg, currentUser.$id, itemImgUrl, itemName, itemDescription, itemPrice, bookDetails, awsDetails);
            console.log('successfully entered book item');
          };

        //Otherwise, just enter item into database without book info
          function enterAnyItem (res) {
            awsDetails = res;

            if (!itemImgUrl){
              itemImgUrl = res.Img;
            }

            if(isbn){
              bookinfoAPI.getInfo(isbn, enterBookItem);
            }else{
              bookDetails = {};
              fireBase.enterItem(currentOrg, currentUser.$id, itemImgUrl, itemName, itemDescription, itemPrice, bookDetails, awsDetails);
              console.log('successfully entered book item'); 
            }

          };

          productImg.getInfo(itemName, enterAnyItem);


      } else{
        $scope.error = "*You must fill out all required fields";
      }
    };

    $scope.deleteBook = function(book) {
      console.log('deleteBook book :', book);
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
  $scope.toggleDeleteModal = function(book) {
    if(!$scope.error) {
      $scope.deleteModalShown = !$scope.deleteModalShown;
      $scope.bookDelete = book;
    }
  };
  $scope.toggleItemModal = function() {
    if(!$scope.error) {
      $scope.itemModalShown = !$scope.itemModalShown;
    }
  };

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
    var getInfo = function(itemName, callback) { // todo
      // console.log()
      return $http({
          method: 'GET',
          url: '/productImg',
          params: {
            'SearchIndex': "All",
            'Keywords': itemName // todo
          }
        })
        .then(function(res) {
          // callback(res.data.data);
          console.log('productInfo res',res)
          console.log('Title',     res.data.ItemSearchResponse.Items[0].Item[0].ItemAttributes[0].Title[0]);
          console.log('ListPrice', res.data.ItemSearchResponse.Items[0].Item[0].ItemAttributes[0].ListPrice[0].FormattedPrice[0]);
          // console.log('UPC',       res.data.ItemSearchResponse.Items[0].Item[0].ItemAttributes[0].UPC[0]);
          console.log('URL',       res.data.ItemSearchResponse.Items[0].Item[0].ItemLinks[0].ItemLink[0].URL[0]);
          console.log('Img',       res.data.ItemSearchResponse.Items[0].Item[0].LargeImage[0].URL[0]);

          var retdata = {
            Title:     res.data.ItemSearchResponse.Items[0].Item[0].ItemAttributes[0].Title[0],
            ListPrice: res.data.ItemSearchResponse.Items[0].Item[0].ItemAttributes[0].ListPrice[0].FormattedPrice[0],
            // UPC:       res.data.ItemSearchResponse.Items[0].Item[0].ItemAttributes[0].UPC[0]),
            URL:       res.data.ItemSearchResponse.Items[0].Item[0].ItemLinks[0].ItemLink[0].URL[0],
            Img:       res.data.ItemSearchResponse.Items[0].Item[0].LargeImage[0].URL[0]
          } ;
          callback(retdata);
        });
    };
    return {
      getInfo: getInfo
    };
})
