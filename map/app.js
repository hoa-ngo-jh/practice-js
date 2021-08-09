(function() {
  const currPositionBtn = document.querySelector('.nowBtn');
  const search = document.querySelector('.searchTerm');
  const searchBtn = document.querySelector('.fa-search');
  const autocomplete = document.querySelector('.autocomplete');
  const features = [];
  const featureIds = [];

  let map, marker, draw;
  let timeout = null;

  const myMapBox = () => {
    let currPosition;
    let currNamePosition;
    let topSearchPosition;
    const place_type = {
      'country': 4,
      'region': 10,
      'postcode': 10,
      'district': 12,
      'place': 12,
      'locality': 17,
      'neighborhood': 17,
      'address': 17,
      'poi': 17
    };

    return {
      setCurrPosition(position) {
        currPosition = position;
      },

      getCurrPosition: function() {
        return currPosition;
      },

      setCurrNamePosition(name) {
        currNamePosition = name;
      },

      getCurrNamePosition: function() {
        return currNamePosition;
      },

      get_plage_type(type) {
        return place_type[type];
      },

      setTopSearchPosition(position) {
        topSearchPosition = position;
      },

      getTopSearchPosition() {
        return topSearchPosition;
      }
    }
  };

  const mapBoxx = myMapBox();

  function setupMap(center) {
    map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v11',
      center: center,
      zoom: 15
    });

    let nav = new mapboxgl.NavigationControl({ showCompass: false });
    map.addControl(nav, 'top-left');

    marker = new mapboxgl.Marker({
      color: "#2980b9",
      draggable: false
    })
    .setLngLat(center)
    .addTo(map);

    draw = new MapboxDraw({
      displayControlsDefault: false,
      controls: {
        line_string: true,
        trash: true
      },
      styles: [
        // Set the line style for the user-input coordinates
        {
          "id": "gl-draw-line",
          "type": "line",
          "filter": ["all", ["==", "$type", "LineString"],
            ["!=", "mode", "static"]
          ],
          "layout": {
            "line-cap": "round",
            "line-join": "round"
          },
          "paint": {
            "line-color": "#438EE4",
            "line-dasharray": [0.2, 2],
            "line-width": 4,
            "line-opacity": 0.7
          }
        },
        // Style the vertex point halos
        {
          "id": "gl-draw-polygon-and-line-vertex-halo-active",
          "type": "circle",
          "filter": ["all", ["==", "meta", "vertex"],
            ["==", "$type", "Point"],
            ["!=", "mode", "static"]
          ],
          "paint": {
            "circle-radius": 12,
            "circle-color": "#FFF"
          }
        },
        // Style the vertex points
        {
          "id": "gl-draw-polygon-and-line-vertex-active",
          "type": "circle",
          "filter": ["all", ["==", "meta", "vertex"],
            ["==", "$type", "Point"],
            ["!=", "mode", "static"]
          ],
          "paint": {
            "circle-radius": 8,
            "circle-color": "#438EE4",
          }
        },
      ]
    });
    map.addControl(draw, 'top-left');
    map.on('draw.create', updateRoute);
    map.on('draw.update', updateRoute);
    map.on('draw.delete', removeRoute);

    map.on('style.load', () => {
      map.on('click', e => {
        let coordinates = e.lngLat;
        renderInfoCard(coordinates);
      });
    });
  }

  const getSuccessPosition = (position) => {
    setupMap([position.coords.longitude, position.coords.latitude]);
    mapBoxx.setCurrPosition([position.coords.longitude, position.coords.latitude]);
  };

  const getErrorPosition = () => {
    setupMap([106.7875967, 10.848056]);
  };

  const initMap = () => {
    mapboxgl.accessToken = 'pk.eyJ1IjoiaXRpYWxhbmpoIiwiYSI6ImNrcmZxaTcyZjV5eXgydGwzYnljeDdnbDgifQ.MGcqac1k7Juwv2isrUCX3g';
    navigator.geolocation.getCurrentPosition(
      getSuccessPosition,
      getErrorPosition,
      {
        enableHighAccuracy: true
      });
  };
  initMap();

  const flyToLocation = (location, place_type) => {
    autocomplete.classList.remove('show');
    let zoom = mapBoxx.get_plage_type(place_type);
    marker.setLngLat(location).addTo(map);

    map.flyTo({
      center: [location[0], location[1]],
      essential: true,
      zoom
    });
  };

  const fly = (location, place_type, place_name) => {
    search.value = place_name;
    flyToLocation(location, place_type);
  };

  const backToCurrPosition = async () => {
    if (!mapBoxx.getCurrNamePosition()) {
      const coordinates = mapBoxx.getCurrPosition(); 
      const data = await getLocationByCoordinates(coordinates[0], coordinates[1]);
      mapBoxx.setCurrNamePosition(data.features[0].place_name);
    }

    if (mapBoxx.getCurrPosition()) {
      flyToLocation(mapBoxx.getCurrPosition(), 'poi');
      search.value = mapBoxx.getCurrNamePosition();
    }
  };

  const fetchLocation = async (url) => {
    try {
      let response = await fetch(url);
      if (!response.ok) return;
      let result = await response.json();
      return result;
    } catch (err) {
      return null;
    }
  }; 

  const renderAutocompleteForm = (data) => {
    autocomplete.classList.add('show');
    if (!data) {
      autocomplete.innerHTML = '<div class="suggest"><span>No matching address found.</span></div>';
    } else {
      const autocompleteData = data.features.map(item => 
        `<div class="suggest">
          <span class="sg" coordinates="${item.center}" type="${item.place_type[0]}">${item.place_name}</span>
        </div>`
      ).join('');

      mapBoxx.setTopSearchPosition(data.features[0]);
      autocomplete.innerHTML = autocompleteData;
    }
  };

  const renderInfoCard = async (location) => {
    const data = await getLocationByCoordinates(location.lng, location.lat);
    const html = `
      <h4>${data.features[0].text}</h4>
      ${data.features[0].properties.category ? `<p><span style="font-weight: bold">Category:</span> ${data.features[0].properties.category}</p>` : ''}
      ${data.features[0].properties.address ? `<p><span style="font-weight: bold">Address:</span> ${data.features[0].properties.address}</p>` : ''}
    `;

    new mapboxgl.Popup()
      .setLngLat(location)
      .setHTML(html)
      .addTo(map);
  };

  const getLocationByCoordinates = async (lng, lat) => {
    let url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${mapboxgl.accessToken}`;
    const data = await fetchLocation(url);
    return data;
  };

  const getLocation = async (location) => {
    let url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${location}.json?access_token=${mapboxgl.accessToken}`;
    const data = await fetchLocation(url);
    return data;
  };

  const onKeyupSearch = () => {
    clearTimeout(timeout);
    let location;
    timeout = setTimeout(async () => {
      location = search.value;
      if (location === '') {
        autocomplete.classList.remove('show');
        return;
      }

      const data = await getLocation(location);
      renderAutocompleteForm(data);
    }, 500);
  };

  const searchPosition = () => {
    if (!search.value) return;

    let position = mapBoxx.getTopSearchPosition().center;
    let place_type = mapBoxx.getTopSearchPosition().place_type;
    flyToLocation(position, place_type);
  };

  const updateRoute = async () => {
    const profile = "driving";
    const data = draw.getAll();
    featureIds.push(data.features[data.features.length - 1].id);
    const lastFeature = data.features.length - 1;
    const coords = data.features[lastFeature].geometry.coordinates;
    const newCoords = coords.join(';')
    const radius = [];

    coords.forEach(element => {
      radius.push(25);
    });

    await getMatch(newCoords, radius, profile);
  };

  const getMatch = async (coordinates, radius, profile) => {
    const radiuses = radius.join(';')
    let url = `https://api.mapbox.com/matching/v5/mapbox/${profile}/${coordinates}?geometries=geojson&radiuses=${radiuses}&steps=true&access_token=${mapboxgl.accessToken}`;

    const data = await fetchLocation(url);
    addRoute(data.matchings[0].geometry);
  };

  const addRoute = (coords) => {
    if (map.getSource('multiple-lines-layer')) {
      map.removeLayer('multiple-lines-layer');
      map.removeSource('multiple-lines-layer')
    }

    const feature = {
      'type': 'Feature',
      'properties': {},
      'geometry': coords 
    };
    features.push(feature);

    map.addLayer({
      'id': 'multiple-lines-layer',
      'type': 'line',
      'source': {
        'type': 'geojson',
        'data': {
          'type': 'FeatureCollection',
          'features': features
        }
      },
      'layout': {
        'line-join': 'round',
        'line-cap': 'round'
      },
      'paint': {
        'line-color': '#03AA46',
        'line-width': 8,
        'line-opacity': 0.8
      }
    });
  };

  const removeRoute = (e) => {
    const id = e.features[0].id;
    const index = featureIds.indexOf(id);
    featureIds.splice(index, 1);

    if (map.getSource('multiple-lines-layer')) {
      features.splice(index, 1);

      if (!features.length) {
        map.removeLayer('multiple-lines-layer');
        map.removeSource('multiple-lines-layer');
        return;
      }

      const dataSource =  {
        "type": "FeatureCollection",
        'features': features
      };

      map.getSource('multiple-lines-layer').setData(dataSource);
    } else {
      return;
    }
  };

  const handleSearchSuggestion = (e) => {
    const suggest = e.target;

    if (suggest.classList == 'sg') {
      const coordinates = [...suggest.getAttribute('coordinates').split(',')];
      const type = suggest.getAttribute('type');
      const place_name = suggest.innerHTML;

      fly(coordinates, type, place_name);
    }
  };

  window.onclick = (e) => {
    if (!e.target.matches('.searchTerm')) {
      autocomplete.classList.remove('show');
    } else {
      if (search.value) autocomplete.classList.add('show');
    }
  };

  document.addEventListener('click', handleSearchSuggestion);
  search.addEventListener('keyup', onKeyupSearch);
  searchBtn.addEventListener('click', searchPosition);
  currPositionBtn.addEventListener('click', backToCurrPosition);
})();