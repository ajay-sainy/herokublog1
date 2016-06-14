(function() {
  var app = angular.module('blogApp', ['ngRoute','infinite-scroll']);

  app.controller('ArticleListController', ['$scope', '$routeParams', '$http', '$log', function($scope, $routeParams, $http, $log) {
    var blog = this;
    var count = 14;
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
        //blog.posts = data;
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

    // blog.prev = function() {
    //   if (selectedPage > 0) {
    //     blog.loadData(--selectedPage);
    //   }
    // };

    blog.loadData(0);

  }]);

  app.controller('ArticleController', ['$scope', '$routeParams', '$http', function($scope, $routeParams, $http) {
    var article = this;
    var id = $routeParams.id;

    article.post = {};
    $http.get('/articles/' + id).success(function(data) {
      article.post = data;
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

      var emailvalidation = checkForEmailFormat(email);
      if (emailvalidation === false) {
        subscribe.error = "Invalid email entered !!!";
      }

      var lengthValidation = checkForNameAndEmailLength(name, email);
      if (lengthValidation === false) {
        subscribe.error = "Name and Email length should be less than 50";
      }

      if (true) {
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

    function checkForNameAndEmailLength(name, email) {
      validated = false;
      if (name.length < 50 && email.length < 50) {
        validated = true;
      }
    }

    function checkForEmailFormat(email) {
      var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (re.test(email)) {
        validated = true;
      } else {
        validated = false;
      }
      return validated;
      // return true;
    }



  }]);

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
      otherwise({
        redirectTo: '/articles'
      });
    }
  ]);

})();