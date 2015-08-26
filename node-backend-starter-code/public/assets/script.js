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
    var text = ajax.responseText
    var response = JSON.parse(text);
    console.log(response)
    listMovies(response.Search);
  }
  ajax.send();
}

function listMovies(list) {
  for(var i=0; i<list.length; i++) {
    console.log(list[i])
    var node = document.createElement("LI")
    var textnode = document.createTextNode(list[i].Title)
    node.appendChild(textnode)
    document.querySelector("ul.movie-list").appendChild(node)
  }

}
