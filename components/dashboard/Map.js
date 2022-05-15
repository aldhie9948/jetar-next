import React, { useRef, useEffect, useImperativeHandle } from 'react';

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
          route: ({ origin, destination }) => {
            console.log(origin, destination);

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
                    console.log('response route: ', response);
                    const route = response.routes[0].legs[0];
                    directionsRenderer.setMap(map);
                    directionsRenderer.setDirections(response);
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
      useEffect(() => {
        main.exec();
        const targetPengirim = document.getElementById('alamatPengirim');
        const targetPenerima = document.getElementById('alamatPenerima');
        autoCompletePlaces(targetPengirim);
        autoCompletePlaces(targetPenerima);
        // eslint-disable-next-line
      });

      useImperativeHandle(ref, () => ({
        route: ({ origin, destination }) => {
          main.func.route({ origin, destination });
        },
      }));

      return (
        <div ref={mapRef} className='rounded-md shadow h-full' id='map'></div>
      );
    }
  )
);

MyMapComponent.displayName = 'Map Component';

export default MyMapComponent;
