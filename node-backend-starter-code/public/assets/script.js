// Get search term
document.querySelector("form.movie-form").addEventListener("submit", function() {
  event.preventDefault();
  var searchTerm = document.querySelector(".movie-name").value;
  var movieList = document.querySelector("ul.movie-list");
  var movieInfo = document.querySelector("div.movie-info");
  var favList = document.querySelector("div.fav-list")
  movieInfo.style.display = "none" //hide movie info
  favList.style.display = "none"
  movieList.style.display = "initial" //show movie list
  favList.innerHTML = null;
  movieList.innerHTML = null;
  movieInfo.innerHTML = null;
  getMovie(searchTerm, "s");
});

document.querySelector("a.show-fav").addEventListener("click", function() {
  event.preventDefault();
  console.log("fav clicked")
  var favList = document.querySelector("div.fav-list")
  favList.innerHTML = null;
  getUserName()
})

// API call
function getMovie(movie, method) {
  var url = "http://www.omdbapi.com/?" + method + "=" + movie + "&r=json"
  var ajax = new XMLHttpRequest();
  ajax.open("GET",url,true);
  ajax.onload = function() {
    var text = ajax.responseText
    var response = JSON.parse(text);
    if (method == "s") {
      listMovies(response.Search);
    } else if (method == "i") {
      showMovie(response)
    } else {
      console.log("search method error")
    };
  }
  ajax.send();
}

// append movie titles to DOM
function listMovies(list) {
  for(var i=0; i<list.length; i++) {
    var node = document.createElement("LI")
    var link = document.createElement("A")
    var textnode = document.createTextNode(list[i].Title)
    link.setAttribute("href", "/")
    link.setAttribute("value", list[i].imdbID) // add ID attribute to each movie
    link.appendChild(textnode);
    link.addEventListener("click", function(){ // click triggers API call
      event.preventDefault();
      var id = this.getAttribute("value");
      getMovie(id, "i"); // API call
    })
    node.appendChild(link);
    document.querySelector("ul.movie-list").appendChild(node);
  }
}

// show detailed movie info
function showMovie(movie) {
  document.querySelector("ul.movie-list").style.display = "none"; // hide search results
  document.querySelector("div.movie-info").style.display = "initial"; // show info
  console.log(movie);

  var node = document.createElement("DIV"); //create content container

  var title = document.createElement("H2"); //add movie title
  var titleText = document.createTextNode(movie.Title);
  title.appendChild(titleText);
  node.appendChild(title);

  var fav = document.createElement("A"); // add favorites link
  var name = document.createElement("input")
  name.setAttribute("placeholder", " your name")
  name.setAttribute("name", "name")
  var favText = document.createTextNode("Add to favorites");
  fav.setAttribute("href", "/");
  fav.setAttribute("class", "add-favorite")
  fav.appendChild(favText);
  fav.addEventListener("click", function(){ // add to favs
    event.preventDefault();
    addFavorite(movie)
  })
  node.appendChild(name)
  node.appendChild(fav)

  var plot = document.createElement("P") // add plot
  var plotText = document.createTextNode(movie.Plot)
  plot.appendChild(plotText)
  node.appendChild(plot)

  document.querySelector("div.movie-info").appendChild(node) // append info to parent element
}

// add movie to favorites list
function addFavorite(movie) {
  var name = document.querySelector("input[name='name']").value
  if(name) {
    var url = "http://localhost:3000/favorites"
    var ajax = new XMLHttpRequest();
    ajax.open("POST", url, true);
    ajax.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    ajax.onload = function() {
      var text = ajax.responseText
      var response = JSON.parse(text);
    }
    ajax.send("name=" + name + "&oid=" + movie.imdbID);
  } else {
    alert("Name Required");
  }
}

// get user name
function getUserName() {
  console.log("show fav")
  var favList = document.querySelector("div.fav-list")
  favList.style.display = "intitial"
  var node = document.createElement("DIV")
  node.setAttribute("class", "fav-div")

  var name = document.createElement("input")
  name.setAttribute("placeholder", " your name")
  name.setAttribute("name", "name")

  var submit = document.createElement("INPUT")
  submit.setAttribute("type", "submit")
  submit.addEventListener("click", function() {
    event.preventDefault()
    var name = document.querySelector("input[name='name']").value
    if (name) {
      getFavorites(name)
    } else {
      alert("Name Required")
    }
  })

  node.appendChild(name)
  node.appendChild(submit)

  favList.appendChild(node)
}

// get user favorites
function getFavorites(name) {
  console.log(name)
  var url = "/favorites"
  var ajax = new XMLHttpRequest();
  ajax.open("GET",url,true);
  ajax.onload = function() {
    var text = ajax.responseText
    var response = JSON.parse(text);
    console.log(response)
    showFavorites(response)
  }
  ajax.send()
}

function showFavorites(response) {
  var favList = document.querySelector("div.fav-list")
  for (var i=0; i<response.length; i++)   {
    console.log(response[i]["oid"])
    var url = "http://www.omdbapi.com/?i=" + response[i]["oid"] + "&r=json"
    var ajax = new XMLHttpRequest();
    ajax.open("GET",url,true);
    ajax.onload = function() {
      var text = ajax.responseText
      console.log(text)
      var movie = JSON.parse(text);
      var link = document.createElement("A")
      link.setAttribute("href", "/")
      var textnode = document.createTextNode(movie.Title)
      link.appendChild(textnode);
      link.setAttribute("value", movie.imdbID)
      link.addEventListener("click", function(){ // click triggers API call
        event.preventDefault();
        var id = this.getAttribute("value");
        getMovie(id, "i"); // API call
      })
      favList.appendChild(link)
    }
    ajax.send()
  }
}
