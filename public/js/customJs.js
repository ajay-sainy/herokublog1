(function() {
  var app = angular.module('blogApp', ['ngRoute', 'infinite-scroll', 'ngSanitize']);

  app.controller('ArticleListController', ['$scope', '$routeParams', '$http', '$log', '$sce', function($scope, $routeParams, $http, $log, $sce) {
    var blog = this;
    var count = 0;
    var pageSize = 3;
    var selectedPage = 0;
    blog.posts = [];

    blog.loadMore = function() {
      blog.next();
    };

    blog.loadData = function(selectedPage) {
      var pageQuery = pageSize + '/' + (selectedPage * pageSize);
      $log.debug('pageQuery ', pageQuery);
      var getURL = '/articles/' + pageQuery;
      $http.get(getURL).success(function(data) {
        angular.forEach(data, function(value, key) {
          blog.posts.push(value);
        });
        $log.debug('blog.posts ', blog.posts);
      });
    }

    blog.next = function() {
      if (count + pageSize > pageSize + ((selectedPage + 1) * pageSize)) {
        blog.loadData(++selectedPage);
      }
    };

    (function getCount() {
      $http.get('/articlesCount')
        .success(function(data) {
          console.log('articlesCount ', data);
          count = data.count;
        })
        .error(function(data, status) {
          console.log('Error', data);
        });;
    })();

    blog.loadData(0);

  }]);

  app.controller('ArticleController', ['$scope', '$routeParams', '$http', '$sce', function($scope, $routeParams, $http, $sce) {
    var article = this;
    var id = $routeParams.id;

    article.post = {};
    $http.get('/articles/' + id)
      .success(function(data) {
        article.post = data;
      })
      .error(function(data, status) {
        console.log('Error', data);
      });

  }]);

  app.controller('SubscribeController', ['$scope', '$http', function($scope, $http) {
    var subscribe = this;
    subscribe.isSubscribed = false
    var validated;
    subscribe.addSubscription = function() {
      var name = subscribe.name;
      var email = subscribe.email;

      subscribe.error = "";

      var emailvalidation = isEmailValid(email);
      if (emailvalidation === false) {
        subscribe.emailError = "Invalid email entered !!!";
        validated = false;
      }

      if(!isStringLengthValid(name,50)) {
        subscribe.nameError="Name length should be less than 50";
        validated = false;
      }
      if (!isStringLengthValid(email,50)) {
        subscribe.emailError = "Email length should be less than 50";
        validated = false;
      }

      if (validated) {
        var data = JSON.stringify({
          name: subscribe.name,
          email: subscribe.email
        });
        console.log('data ' + data);
        $http.post("/Subscribe", data)
          .success(function(data, status) {
            if (data.status !== 200) {
              subscribe.error = data.error;
            } else {
              subscribe.isSubscribed = true;
              subscribe.error = "";
            }
            console.log(data + ' ' + status);
          })
          .error(function(data, status) {
            subscribe.error = data;
          });
      }
    }

  }]);

  function isStringLengthValid(str,length) {    
    if (str.length > length) {
      return false;
    }
    return true;
  }

  function isEmailValid(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (re.test(email)) {
      return true;
    } 
    return false;    
  }

  app.controller('TagController', ['$scope', '$routeParams', '$http', function($scope, $routeParams, $http) {
    var tag = this;
    var tagName = $routeParams.tag;
    var getURL = '/tags';

    if (tagName) {
      getURL += '/' + tagName;
    }

    tag.posts = {};

    $http.get(getURL).success(function(data) {
      tag.posts = data;
    }).error(function(data, status) {
      console.log(data + " " + status);
    });

  }]);


  app.controller('CommentController', function() {
    this.comment = {};
    this.addComment = function(post) {
      this.comment.createdOn = Date.now();
      post.comments.push(this.comment);
      this.comment = {};
    };
  });

  app.controller('ContactController', ['$scope', '$routeParams', '$http', function($scope, $routeParams, $http) {
    var contact = this;

    contact.submitContactForm = function() {
      clearErrorMessage();

      if (isContactFormValid()) {
        var data = JSON.stringify({
          name: contact.name,
          email: contact.email,
          message: contact.message
        });
        console.log('ContactFormData ' + data);
        $http.post("/Contact", data)
          .success(function(data, status) {
            if (data.status !== 200) {
              contact.error = data.error;
            } else {
              contact.messageSent = true;
              contact.error = "";
              resetContactForm();
            }
          })
          .error(function(data, status) {
            contact.error = data;
          });
      }
    }

    function isContactFormValid() {
      if (contact.name == undefined || contact.name==false) {
        contact.nameError = 'Full Name is Required';        
      } else if (contact.email == undefined || contact.email==false) {
        contact.emailError = 'Email is Required';
      } else if (contact.message == undefined || contact.message==false) {
        contact.messageError = 'Message is Required';
      } else if(!isStringLengthValid(contact.name,50)) {
        contact.nameError="Name length should be less than 50";
      } else if (!isStringLengthValid(contact.email,50)) {
        contact.emailError = "Email length should be less than 50";
      } else if (!isStringLengthValid(contact.message,50)) {
        contact.messageError = "Message length should be less than 200";
      } else if (!isEmailValid(contact.email)) {
        contact.emailError = "Invalid email";
      } else {
        return true;  
      }
      return false;
    }

    function resetContactForm() {      
      clearErrorMessage();
      contact.name = '';
      contact.email = '';
      contact.message = '';
      $('#contactSubmittedModal').modal('show');
      contact.showSuccessMessage = true;
    }

    function clearErrorMessage() {
      contact.nameError = '';
      contact.emailError = '';
      contact.messageError = '';
    }
  }]);

  //Define Routing for app
  //Uri /article_list -> List all articles and Controller ArticleListController
  //Uri /ShowOrders -> in details article and Controller ArticleController
  app.config(['$routeProvider', '$locationProvider',
    function($routeProvider, $locationProvider) {
      //$locationProvider.html5Mode(true);
      $routeProvider.
      when('/articles', {
        templateUrl: 'templates/article_list.html',
        controller: 'ArticleListController',
        controllerAs: 'blog'
      }).
      when('/article/:id', {
        templateUrl: 'templates/article.html',
        controller: 'ArticleController',
        controllerAs: 'article'
      }).
      when('/tags/:tag', {
        templateUrl: 'templates/article_list.html',
        controller: 'TagController',
        controllerAs: 'blog'
      }).
      when('/contact', {
        templateUrl: 'templates/contact.html',
        controller: 'ContactController',
        controllerAs: 'contact'
      }).
      otherwise({
        redirectTo: '/articles'
      });
    }
  ]);

})();