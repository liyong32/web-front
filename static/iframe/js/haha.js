var queryId = window.location.search.slice(1);
var result = queryId.split('=');
var span = document.getElementById('query');

span.innerHTML = result[1];
