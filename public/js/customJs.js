/*

Simple blog front end demo in order to learn AngularJS - You can add new posts, add comments, and like posts.

*/

(function(){
  var app = angular.module('blogApp',[]);
  
  app.controller('BlogController', ['$http', function($http){
    
    var blog = this;
    blog.title = "AngularJS Blog App";
    
    blog.posts = {};
    $http.get('/articles').success(function(data){
      blog.posts = data;
    });
  //  blog.posts = [{"_id":"5754176caa8c391100087289","title":"Stringsssssssss","conent":"mongoose.Schema.Types.Mixed","author":"Me","__v":0,"lastUpdateDate":"2016-06-05T12:13:32.314Z","creationDate":"2016-06-05T12:13:32.313Z","tags":["q","dd"]},{"_id":"575590580cdee911006b772d","title":"Lorem ipsum dolor sit amet","conent":"Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sint accusamus voluptatibus facilis, magni dolores beatae quos iusto doloremque at, eius incidunt omnis, suscipit ipsum dolore nostrum molestiae asperiores expedita voluptate!","author":"Ajay Sainy","__v":0,"lastUpdateDate":"2016-06-06T15:01:44.740Z","creationDate":"2016-06-06T15:01:44.739Z","tags":["Tag 1","TAG 2","TAG 3"]},{"_id":"5755907a0cdee911006b772e","title":"Blog Post Title 2","conent":"Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sint accusamus voluptatibus facilis, magni dolores beatae quos iusto doloremque at, eius incidunt omnis, suscipit ipsum dolore nostrum molestiae asperiores expedita voluptate!","author":"Ajay Sainy","__v":0,"lastUpdateDate":"2016-06-06T15:02:18.650Z","creationDate":"2016-06-06T15:02:18.650Z","tags":["News","Bolly","Sports"]}];
    blog.tab = 'blog';
    
    blog.selectTab = function(setTab){
      blog.tab = setTab;
      console.log(blog.tab)
    };
    
    blog.isSelected = function(checkTab){
      return blog.tab === checkTab;
    };
    
    blog.post = {};
    blog.addPost = function(){
      blog.post.createdOn = Date.now();
      blog.post.comments = [];
      blog.post.likes = 0;
      blog.posts.unshift(this.post);
      blog.tab = 0;
      blog.post ={};
    };   
    
  }]);
  
  app.controller('CommentController', function(){
    this.comment = {};
    this.addComment = function(post){
      this.comment.createdOn = Date.now();
      post.comments.push(this.comment);
      this.comment ={};
    };
  });
 
})();