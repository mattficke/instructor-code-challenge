// Get search term
document.querySelector("form.movie-form").addEventListener("submit", function() {
  event.preventDefault();
  var searchTerm = document.querySelector(".movie-name").value;
  var movieList = document.querySelector("ul.movie-list");
  var movieInfo = document.querySelector("div.movie-info");
  movieInfo.style.display = "none" //hide movie info
  movieList.style.display = "initial" //show movie list
  movieList.innerHTML = null;
  movieInfo.innerHTML = null;
  getMovie(searchTerm, "s");
});

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
  name.setAttribute("placeholder", "name")
  name.setAttribute("name", "name")
  var favText = document.createTextNode("Add to favorites");
  fav.setAttribute("href", "/");
  fav.setAttribute("class", "add-favorite")
  fav.appendChild(favText);
  fav.addEventListener("click", function(){ // show "add to favs" form on click
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

function addFavorite(movie) {
  var name = document.querySelector("input[name='name']").value
  if(name) {
    var url = "http://localhost:3000/favorites"
    var data = {

    }
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
