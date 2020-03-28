//URL to custom endpoint to fetch Access token.
var url = 'https://adtokens.azurewebsites.net/api/HttpTrigger1?code=dv9Xz4tZQthdufbocOV9RLaaUhQoegXQJSeQQckm6DZyG/1ymppSoQ==';

//Initialize a map instance.
var map = new atlas.Map('map', {
  center: [134.386786, -25.749261],
  zoom: 3.5,
  view: "Auto",
  //Add your Azure Maps subscription client ID to the map SDK. Get an Azure Maps client ID at https://azure.com/maps
  authOptions: {
    authType: 'subscriptionKey',
    subscriptionKey: '7UpC0Ckn1HpCK-SJgGCXZSMqAVC47SQLtGWzhiaPUmo',
    getToken: function (resolve, reject, map) {
      fetch(url).then(function (response) {
        return response.text();
      }).then(function (token) {
        resolve(token);
      });
    }
  }
});

var name_var;
var contact_var;

//Wait until the map resources are ready.
map.events.add('ready', function () {
  console.info("map_Ready");
  //Create a data source and add it to the map.
  var datasource = new atlas.source.DataSource();
  map.sources.add(datasource);
  map.controls.add(new atlas.control.ZoomControl(), {
    position: 'bottom-right'
  });
  map.controls.add(new atlas.control.PitchControl(), {
    position: 'bottom-right'
  });
  map.controls.add(new atlas.control.CompassControl(), {
    position: 'bottom-right'
  });
  map.controls.add(new atlas.control.StyleControl(), {
    position: 'bottom-right'
  });

  //Load a data set of points, in this case earthquake data from the USGS.
  datasource.importDataFromUrl('getLocations/');

  /* Gets co-ordinates of clicked location*/
  map.events.add('click', function (e) {
    /* Update the position of the point feature to where the user clicked on the map. */
    var point = new atlas.Shape(new atlas.data.Point());
    point.setCoordinates(e.position);

    //var data = JSON.parse(txt);  //parse the JSON
    var feature = {        //add the employee
      name: name_var,
      contact: contact_var,
      geometry: { type: "Point", coordinates: point.getCoordinates() }
    };



    var xhr = new XMLHttpRequest();
    xhr.open("POST", "addFire/", true);
    xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');

    // send the collected data as JSON
    xhr.send(JSON.stringify(feature));

    xhr.onloadend = function () {
      console.info("FIRE ADDED");
      // location.reload();
    };


  });

  document.getElementById("undo_button").addEventListener("click", function () {
    try {
      dataSource.remove(0);
    }
    catch (err) {
      window.alert("No points placed on map");
    }
  });

  //Create a heatmap and add it to the map.
  map.layers.add(new atlas.layer.HeatMapLayer(datasource, null, {
    radius: 15,
    opacity: 0.8
  }), 'labels');
});