import React, { useRef, useEffect, useState } from 'react';
import { useImperativeHandle } from 'react';
import cekOngkir from '../../lib/cekOngkir';
import { localCurrency } from '../../lib/currency';

const configMap = {
  center: { lat: -6.8703952, lng: 109.1256 },
  zoom: 14,
  disableDefaultUI: true,
  styles: [
    {
      featureType: 'administrative.land_parcel',
      elementType: 'labels',
      stylers: [
        {
          visibility: 'off',
        },
      ],
    },
    {
      featureType: 'poi',
      elementType: 'labels.text',
      stylers: [
        {
          visibility: 'off',
        },
      ],
    },
    {
      featureType: 'poi.business',
      stylers: [
        {
          visibility: 'off',
        },
      ],
    },
    {
      featureType: 'poi.park',
      elementType: 'labels.text',
      stylers: [
        {
          visibility: 'off',
        },
      ],
    },
    {
      featureType: 'road.local',
      elementType: 'labels',
      stylers: [
        {
          visibility: 'off',
        },
      ],
    },
  ],
};

const FormOrderMapComponent = React.forwardRef(
  ({ origin, destination, onClickList }, ref) => {
    const mapsRef = useRef();
    const [map, setMap] = useState(null);
    const [directionsService, setDirectionsService] = useState(null);
    const [polylines, setPolylines] = useState(null);
    const [originMarker, setOriginMarker] = useState(null);
    const [destinationMarker, setDestinationMarker] = useState(null);

    const setDirectionPolylines = ({ route }) => {
      originMarker.setPosition(route.legs[0].start_location);
      destinationMarker.setPosition(route.legs[0].end_location);
      polylines.setPath(route.overview_path);
      const ongkir = cekOngkir(route.legs[0].distance.value);
      onClickList && onClickList(ongkir);
      map.fitBounds(route.bounds);
    };

    const setAutoCompletePlaces = (target) => {
      const config = {
        types: [],
        componentRestrictions: { country: ['ID'] },
        fields: ['place_id', 'name', 'geometry', 'formatted_address'],
      };
      const el = document.getElementById(target);
      return new google.maps.places.Autocomplete(el, config);
    };

    const calculateDirection = () => {
      const listRoutes = document.getElementById('list-ongkir-form');
      directionsService
        .route(
          {
            origin: { query: origin },
            destination: { query: destination },
            travelMode: 'TWO_WHEELER',
            optimizeWaypoints: true,
            avoidTolls: true,
            unitSystem: google.maps.UnitSystem.IMPERIAL,
            provideRouteAlternatives: true,
          },
          (results, status) => {
            const routes = results.routes;
            let contentString = '';
            routes.forEach((route, index) => {
              const legs = route.legs[0];
              const distance = legs.distance;
              const ongkir = cekOngkir(distance.value);
              const content = `                      
              <button
                type='button'
                class='route-form my-2 py-2 rounded font-light w-full bg-gradient-green hover:shadow-md text-sm active:shadow-none duration-150'
              >
                Rp. ${localCurrency(ongkir)} - ${Math.ceil(
                distance.value / 1000
              )} km
              </button>`;
              contentString += content;
              if (index === 0) setDirectionPolylines({ route });
            });
            listRoutes.innerHTML = contentString;
            document.querySelectorAll('.route-form').forEach((r, i) => {
              r.addEventListener('click', function (e) {
                const route = routes[i];
                setDirectionPolylines({ route });
              });
            });
          }
        )
        .catch((e) => alert('Directions request failed due to ' + e));
    };

    useImperativeHandle(ref, () => ({
      calculate: () => calculateDirection(),
    }));

    useEffect(() => {
      const mapInstance = new google.maps.Map(mapsRef.current, configMap);
      setMap(mapInstance);
      setPolylines(
        new google.maps.Polyline({
          strokeColor: '#4ade80', // you might want different colors per suggestion
          strokeOpacity: 1,
          strokeWeight: 5,
          map: mapInstance,
        })
      );
      setDirectionsService(new google.maps.DirectionsService());
      const configMarker = { icon: `favicon-32x32.png`, map: mapInstance };
      setOriginMarker(new google.maps.Marker(configMarker));
      setDestinationMarker(new google.maps.Marker(configMarker));
      const targetsAutoCompletePlaces = ['alamatPengirim', 'alamatPenerima'];
      targetsAutoCompletePlaces.forEach((target) => {
        setAutoCompletePlaces(target);
      });
      // eslint-disable-next-line
    }, []);
    return (
      <>
        <div className='rounded-md shadow sm:h-full h-64' ref={mapsRef}></div>
      </>
    );
  }
);

FormOrderMapComponent.displayName = 'FormOrderMapComponent';

export default FormOrderMapComponent;
