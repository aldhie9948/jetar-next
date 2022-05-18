import React, { useRef, useEffect, useImperativeHandle } from 'react';

const cekOngkir = (distance) => {
  distance = distance === 0 ? 1 : distance;
  const OngkirPrice = [
    { range: 1, value: 6000 },
    { range: 2, value: 7000 },
    { range: 3, value: 8000 },
    { range: 4, value: 9000 },
    { range: 5, value: 10000 },
    { range: 6, value: 11000 },
    { range: 7, value: 12000 },
    { range: 8, value: 13000 },
    { range: 9, value: 14000 },
    { range: 10, value: 15000 },
    { range: 11, value: 2000 },
  ];
  let ongkir = 0;
  OngkirPrice.forEach((m) => {
    const fixedDistance = Math.ceil(distance / 1000);
    if (fixedDistance >= m.range && fixedDistance <= 10) {
      ongkir = m.value;
    }
    if (fixedDistance > 10 && m.range > 10) {
      const longerDistance = fixedDistance - 10;
      ongkir = OngkirPrice[9].value + longerDistance * m.value;
    }
  });
  return ongkir;
};

const CekOngkirMap = React.memo(
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
                    callback && callback({ ongkir, response });
                    console.log(response);
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
        const targetPengirim = document.getElementById(
          'alamat-pengirim-cek-ongkir'
        );
        const targetPenerima = document.getElementById(
          'alamat-pengirim-cek-ongkir'
        );
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
          className='rounded-md border-2 border-white shadow-lg sm:h-full h-64'
          id='map'
        ></div>
      );
    }
  )
);

CekOngkirMap.displayName = 'Cek Ongkir Map Component';

export default CekOngkirMap;
