import React, { useRef, useLayoutEffect, useImperativeHandle } from 'react';
import cekOngkir from '../../lib/cekOngkir';

const MyMapComponent = React.memo(
  React.forwardRef(
    ({ center = { lat: -6.8703952, lng: 109.1256 }, zoom = 14 }, ref) => {
      const mapRef = useRef();
      const directionsService = new google.maps.DirectionsService();
      const directionsRenderer = new google.maps.DirectionsRenderer({
        draggable: false,
      });
      const main = {
        exec: () => {
          const map = new window.google.maps.Map(mapRef.current, {
            center,
            zoom,
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
          });
          directionsRenderer.setMap(map);
        },
        func: {
          route: ({ origin, destination, callback }) => {
            directionsService
              .route(
                {
                  origin: { query: origin },
                  destination: { query: destination },
                  travelMode: 'DRIVING',
                  drivingOptions: {
                    departureTime: new Date(/* now, or future date */),
                    trafficModel: 'bestguess',
                  },
                  optimizeWaypoints: true,
                  avoidHighways: true,
                  avoidTolls: true,
                },
                async (response, status) => {
                  if (status === 'OK') {
                    const route = response.routes[0].legs[0];
                    const distance = route.distance;
                    const ongkir = cekOngkir(distance.value);
                    directionsRenderer.setDirections(response);
                    callback && callback({ ongkir, response, distance });
                  } else {
                    window.alert('Directions request failed due to ' + status);
                  }
                }
              )
              .catch((e) => {
                alert('Could not display directions due to: ' + e);
              });
          },
        },
      };
      const autoCompletePlaces = (target) => {
        return new window.google.maps.places.Autocomplete(target, {
          types: [],
          componentRestrictions: { country: ['ID'] },
          fields: ['place_id', 'name', 'geometry', 'formatted_address'],
        });
      };
      useLayoutEffect(() => {
        main.exec();
        const targetPengirim = document.getElementById('alamatPengirim');
        const targetPenerima = document.getElementById('alamatPenerima');
        autoCompletePlaces(targetPengirim);
        autoCompletePlaces(targetPenerima);
        // eslint-disable-next-line
      });

      useImperativeHandle(ref, () => ({
        route: ({ origin, destination, callback }) => {
          main.func.route({ origin, destination, callback });
        },
      }));

      return (
        <div
          ref={mapRef}
          className='rounded-md shadow sm:h-full h-64'
          id='map'
        ></div>
      );
    }
  )
);

MyMapComponent.displayName = 'Map Component';

export default MyMapComponent;
