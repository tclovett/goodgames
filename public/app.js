
function generateFeed(){
  
  $(".post").remove();
  $.ajax({  // get the feed table
    url: 'http://localhost:8000/api/feed',
    method: 'GET',
    dataType: 'json',
    success: function(response) { 
      for (i in response) { // repeat for every row on the feed table
        const feed = document.getElementById('feed'); // get feed div
        const post = document.createElement('div') // create new post
        post.classList.add('post'); // set class name
        post.id = (response[i].postid); //set id to be the same as the post id
        post.innerHTML = `<p class='user'>${response[i].username}</p> <p class='body'> ${response[i].post} </p> <p class='game'>${response[i].game}</p>`; // create username, post body, and game
        let edit = document.createElement("button"); // create edit button
        let destroy = document.createElement("button"); // create destroy button
        edit.classList.add("editButton");  // set edit class
        edit.id = (response[i].postid);
        edit.innerHTML = "Edit";  // create text for edit button
        destroy.classList.add("deleteButton"); // set delete class
        destroy.id = (response[i].postid);
        destroy.innerHTML = "Delete";  // create text for delete button
        post.insertBefore(destroy,post.children[0]); // insert delete button
        post.insertBefore(edit, post.children[0]);  // insert edit button
        feed.appendChild(post);  // add the entire new post to the feed
      }
      $(".editButton").click(function(){ // click function for the edit button
        let parent = this.parentNode;
        let changeID = this.id; // get id of post to change
        let postText = prompt("Edit Post"); // prompt post change
        let check = confirm("Are you sure?");
        if (check) {
          fetch('http://localhost:8000/api/feed/' + changeID, { // access feed at the row that has the id
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({post: postText})  // post is changed
        })
        parent.children[3].innerHTML = postText;
        }
      })
      $(".deleteButton").click(function(){ // click function for the edit button
        let parent = this.parentNode;
        let changeID = this.id; // get id of post to change
        fetch('http://localhost:8000/api/feed/' + changeID, { // access feed at the row that has the id
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          },
        })
        parent.remove();
      })
      
      $(".post").mouseover(function(){ // mouse over to show the edit and delete buttons
        let loginCheck = document.getElementById("login");
        let username = loginCheck.innerHTML;
        console.log(username);
        if (this.children[2].innerHTML == username){
          this.children[0].style.display = "initial";
          this.children[1].style.display = "initial";
        }
      });
      $(".post").mouseout(function(){  // mouseout to hide the edit and delete buttons
        this.children[0].style.display = "none";
        this.children[1].style.display = "none";
      });
      $("#login").click(function(){
        let username = prompt("Insert Username");
        $.ajax({ // get the users table
          url: 'http://localhost:8000/api/users',
          method: 'GET',
          dataType: 'json',
          success: function(responseUser) {
            
            let user = false;
            for (i in responseUser) {
              if (responseUser[i].username === username){
                user = true;
                var userID = responseUser[i].userid;         
              }
            }
            if (user === true){
              let login = document.getElementById("login");
              login.innerHTML = username;
              let checkGame = document.getElementById("gameButton");
              if (!checkGame) {
                let gameSelect = $("<button id='gameButton'>Game</button>");
                $(".navButtons").append(gameSelect);
                $("#gameButton").on("click", function(e){
                  $.ajax({ // get the games table
                    url: 'http://localhost:8000/api/games',
                    method: 'GET',
                    dataType: 'json',
                    success: function(responseGame) {
                      const game = prompt("Which game are we posting about?");
                      let isGame = false;
                      for (i in responseGame) {
                        if (responseGame[i].game === game){
                          isGame = true;
                          var gamesID = responseGame[i].gamesid;
                        }
                      }
                      if (isGame === true) {
                        gameSelect[0].innerHTML = game;
                        let postID = Math.floor(Math.random() * (1000000 - 1 + 1)) + 1;
                        let postBox = $("<textarea id='toPost'>What's on your mind?</textarea>");
                        $(".title").append(postBox);
                        $("#toPost").on("keydown", function(e){
                        $("#toPost").val('');
                        $("#toPost").off();
                        })
                        $(document).on("keypress", function(e){ // User Tweet
                          if (e.which == 13){
                          let postText = $("#toPost").val()
                          $("textarea").val('');
                          fetch('http://localhost:8000/api/feed', {
                            method: 'POST',
                            headers: {
                              'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({ post: postText, userid: userID, gamesid: gamesID, postid: postID})
                          })
                          const feed = document.getElementById('feed'); // get feed div
                          const post = document.createElement('div') // create new post
                          post.classList.add('post'); // set class name
                          post.id = (postID); //set id to be the same as the post id
                          post.innerHTML = `<p class='user'>${username}</p> <p class='body'> ${postText} </p> <p class='game'>${game}</p>`; // create username, post body, and game
                          let edit = document.createElement("button"); // create edit button
                          let destroy = document.createElement("button"); // create destroy button
                          edit.classList.add("editButton");  // set edit class
                          edit.id = postID;
                          edit.innerHTML = "Edit";  // create text for edit button
                          destroy.classList.add("deleteButton"); // set delete class
                          destroy.id = postID;
                          destroy.innerHTML = "Delete";  // create text for delete button
                          post.insertBefore(destroy, post.children[0]); // insert delete button
                          post.insertBefore(edit, post.children[0]);  // insert edit button
                          feed.insertBefore(post, feed.children[0]);  // add the entire new post to the feed
                          $(".editButton").click(function(){ // click function for the edit button
                            let parent = this.parentNode;
                            let changeID = this.id; // get id of post to change
                            let postText = prompt("Edit Post"); // prompt post change
                            let check = confirm("Are you sure?");
                            if (check) {
                              fetch('http://localhost:8000/api/feed/' + changeID, { // access feed at the row that has the id
                              method: 'PATCH',
                              headers: {
                                'Content-Type': 'application/json'
                              },
                              body: JSON.stringify({post: postText})  // post is changed
                            })
                            parent.children[3].innerHTML = postText;
                            }
                          })
                          $(".deleteButton").click(function(){ // click function for the edit button
                            let parent = this.parentNode;
                            let changeID = this.id; // get id of post to change
                            fetch('http://localhost:8000/api/feed/' + changeID, { // access feed at the row that has the id
                              method: 'DELETE',
                              headers: {
                                'Content-Type': 'application/json'
                              },
                            })
                            parent.remove();
                          })
                          $(".post").mouseover(function(){ // mouse over to show the edit and delete buttons
                            let loginCheck = document.getElementById("login");
                            let username = loginCheck.innerHTML;
                            console.log(username);
                            if (this.children[2].innerHTML == username){
                              this.children[0].style.display = "initial";
                              this.children[1].style.display = "initial";
                            }
                          });
                          $(".post").mouseout(function(){  // mouseout to hide the edit and delete buttons
                            this.children[0].style.display = "none";
                            this.children[1].style.display = "none";
                          });
                        }
                        })
                      }
                    },
                    error: function(xhr, status, error) {
                      console.log(error);
                    }
                  });
                })
              }
              
            }
            else {
              alert("Invalid Username");
            }
          } 
        })
      })
    },
    error: function(xhr, status, error) {
      console.log(error);
    }
  });
}


window.addEventListener('load', function() {
  generateFeed();
  $("#home").on("click", function(){
    location.reload();
  })
})

