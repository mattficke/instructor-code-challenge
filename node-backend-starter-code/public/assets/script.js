document.querySelector("#movie-form").addEventListener("submit", function() {
  event.preventDefault();
  var searchTerm = (document.querySelector("#movie").value);
  getMovie(searchTerm);
});

function getMovie(searchTerm) {
  console.log(searchTerm)
  var url = "http://www.omdbapi.com/?s=" + searchTerm + "&r=json"
  var ajax = new XMLHttpRequest();
  ajax.open("GET",url,true);
  ajax.onload = function() {
    var response = ajax.responseText
    listMovies(response);
  }
  ajax.send();
}

function listMovies(response) {
  
}
