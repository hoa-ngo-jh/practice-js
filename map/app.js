const currPositionBtn = document.querySelector('.nowBtn');
const search = document.querySelector('.searchTerm');
const searchBtn = document.querySelector('.fa-search');
const autocomplete = document.querySelector('.autocomplete');

let map, marker;
let timeout = null;

const myMapBox = () => {
  let currPosition;
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

  map.on('style.load', () => {
    map.on('click', e => {
      let coordinates = e.lngLat;
      renderInfoCard(coordinates);
    });
  });
}

const getSuccessPosition = (position) => {
  console.log(position.coords.longitude);
  console.log(position.coords.latitude);
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

currPositionBtn.addEventListener('click', () => {
  if (mapBoxx.getCurrPosition()) {
    console.log(mapBoxx.getCurrPosition());
    flyToLocation(mapBoxx.getCurrPosition(), 'poi');
  }
});

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
      `<div class="suggest" onclick="flyToLocation([${item.center}], '${item.place_type[0]}')">
        <span>${item.place_name}</span>
      </div>`
    ).join('');

    mapBoxx.setTopSearchPosition(data.features[0]);
    autocomplete.innerHTML = autocompleteData;
  }
};

const renderInfoCard = async (location) => {
  let url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${location.lng},${location.lat}.json?access_token=${mapboxgl.accessToken}`;
  const data = await fetchLocation(url);
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

const getLocation = async (location) => {
  let url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${location}.json?access_token=${mapboxgl.accessToken}`;
  const data = await fetchLocation(url);
  console.log(data);
  renderAutocompleteForm(data);
};

search.addEventListener('keyup', () => {
  clearTimeout(timeout);
  let location;
  timeout = setTimeout(() => {
    location = search.value;
    if (location === '') {
      autocomplete.classList.remove('show');
      return;
    }

    getLocation(location);
  }, 500);
});

searchBtn.addEventListener('click', () => {
  if (!search.value) return;

  let position = mapBoxx.getTopSearchPosition().center;
  let place_type = mapBoxx.getTopSearchPosition().place_type;
  flyToLocation(position, place_type);
});

window.onclick = (e) => {
  if (!e.target.matches('.searchTerm')) {
    autocomplete.classList.remove('show');
  } else {
    if (search.value) autocomplete.classList.add('show');
  }
};