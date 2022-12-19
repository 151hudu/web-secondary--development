const topology = new Topology('topology');

registerCommonDiagram();

function getQueryVariable(variable) {
  var query = window.location.search.substring(1);
  var vars = query.split('&');
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split('=');
    if (pair[0] == variable) {
      return pair[1];
    }
  }
  return false;
}

function fetch(url, cb) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  xhr.send();
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4 && xhr.status == 200) {
      cb && cb(xhr.responseText);
    }
  };
}

var id = getQueryVariable('id');
if (!id) {
  id = 'data';
}
fetch('/' + id + '.json', function(text) {
  var data = JSON.parse(text);
  data.locked = 1;
  topology.open(data);
});
