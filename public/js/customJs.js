
(function() {
  var app = angular.module('blogApp',['ngRoute']);
  
  app.controller('ArticleListController', ['$scope', '$routeParams','$http',function($scope, $routeParams,$http) {
    var blog = this;
    var tagName = $routeParams.tag;

    var getURL = '/articles';
    if(tagName)  {
      getURL += '?_id='+tagName;
    }

    blog.posts = {};
    $http.get(getURL).success(function(data) {
      blog.posts = data;
    });
    
  }]);
  
  app.controller('ArticleController', ['$scope', '$routeParams','$http',function($scope, $routeParams,$http) {
    var article = this;
    var id = $routeParams.id;

    article.post = {};
    $http.get('/articles/'+id).success(function(data) {
      article.post = data;
    });   
               
  }]);

  app.controller('ArticleTagController', ['$scope', '$routeParams','$http',function($scope, $routeParams,$http) {
    var tag = this;
    var tagName = $routeParams.tag;

    tag.posts = {};
    $http.get('/article_tag/'+tagName).success(function(data) {
      tag.posts = data;
    });   
               
  }]);

  app.controller('CommentController', function() {
    this.comment = {};
    this.addComment = function(post){
      this.comment.createdOn = Date.now();
      post.comments.push(this.comment);
      this.comment ={};
    };
  });

  //Define Routing for app
  //Uri /article_list -> List all articles and Controller ArticleListController
  //Uri /ShowOrders -> in details article and Controller ArticleController
  app.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/articles', {
        templateUrl: 'templates/article_list.html',
        controller: 'ArticleListController',
        controllerAs:'blog'
      }).
      when('/article/:id', {
        templateUrl: 'templates/article.html',
        controller: 'ArticleController',
        controllerAs:'article'
      }).
      when('/article_tag/:tag', {
        templateUrl: 'templates/article_list.html',
        controller: 'ArticleTagController',
        controllerAs:'tag'
      }).
      otherwise({
        redirectTo: '/articles'
      });
  }]);
 
})();