import React, { useEffect, useImperativeHandle, useState, useRef } from 'react';
import { BiStoreAlt, BiBox } from 'react-icons/bi';
import { FaRoute } from 'react-icons/fa';
import SelectPelanggan from '../../components/dashboard/SelectPelanggan';
import { Wrapper, Status } from '@googlemaps/react-wrapper';
import styles from '../../styles/Dashboard.module.css';
import { localCurrency } from '../../lib/currency';
import cekOngkir from '../../lib/cekOngkir';

const render = (status) => {
  switch (status) {
    case Status.LOADING:
      return console.log(status);
    case Status.FAILURE:
      return console.log(status);
  }
};

const CekOngkirMapComponent = () => {
  const config = {
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
  const mapRef = useRef();
  const [map, setMap] = useState(null);
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [directionsService, setDirectionsService] = useState(null);
  const [polyline, setPolyline] = useState(null);
  const [originMarker, setOriginMarker] = useState(null);
  const [destinationMarker, setDestinationMarker] = useState(null);
  // handler saat menekan tombol cek ongkir di form
  // handler harus menyediakan origin, destination dan callback/fn
  // dengan argument ongkir & response dari direction maps api
  const cekOngkirHandler = () => {
    const listRoutes = document.getElementById('list-ongkir');
    const setDirectionPolylines = ({ route }) => {
      originMarker.setPosition(route.legs[0].start_location);
      destinationMarker.setPosition(route.legs[0].end_location);
      polyline.setPath(route.overview_path);
      map.fitBounds(route.bounds);
    };
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
        (response, status) => {
          if (status === 'OK') {
            const routes = response.routes;
            let contentString = ``;
            listRoutes.innerHTML = '';
            routes.forEach((route, i) => {
              const legs = route.legs[0];
              const distance = legs.distance;
              const ongkir = cekOngkir(distance.value);
              const content = `
                <div class='route bg-gradient-green py-2 px-3 mb-2 rounded cursor-pointer hover:shadow-md active:shadow-none duration-150'>
                  Rp. ${localCurrency(ongkir)} - ${Math.ceil(
                distance.value / 1000
              )} km
                </div>
              `;
              contentString += content;
              if (i === 0) {
                setDirectionPolylines({ route });
              }
            });
            listRoutes.innerHTML = contentString;
            document.querySelectorAll('.route').forEach((r, i) => {
              r.addEventListener('click', function (e) {
                const route = routes[i];
                setDirectionPolylines({ route });
              });
            });
          }
        }
      )
      .catch((e) => {
        alert('Directions request failed due to ' + e);
      });
  };

  // update state dengan pelanggan yang terpilih
  const onChangePelanggan = (pelanggan, setter) => {
    if (pelanggan) return setter(pelanggan.obj.alamat);
    return setter('');
  };

  const onBlurInput = (e, setter) => setter(e.target.value);

  const onChangeInput = (e, setter) => {
    setter(e.target.value);
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

  useEffect(() => {
    const mapsInstance = new google.maps.Map(mapRef.current, config);
    setMap(mapsInstance);
    setDirectionsService(new google.maps.DirectionsService());
    setPolyline(
      new google.maps.Polyline({
        strokeColor: '#4ade80', // you might want different colors per suggestion
        strokeOpacity: 1,
        strokeWeight: 5,
        map: mapsInstance,
      })
    );
    const configMarker = { icon: `favicon-32x32.png`, map: mapsInstance };
    setOriginMarker(new google.maps.Marker(configMarker));
    setDestinationMarker(new google.maps.Marker(configMarker));
    const targetsAutoCompletePlaces = [
      'alamat-penerima-cek-ongkir',
      'alamat-pengirim-cek-ongkir',
    ];
    targetsAutoCompletePlaces.forEach((target) => {
      setAutoCompletePlaces(target);
    });
    // eslint-disable-next-line
  }, []);

  return (
    <>
      <div className='grid sm:grid-cols-2 grid-cols-1 gap-2'>
        <div>
          <div className='flex gap-2 items-center mb-4'>
            <div className='text-center'>
              <BiStoreAlt className='text-[2.5rem] w-20 flex-shrink-0' />
              <small>Pengirim</small>
            </div>
            <div className='flex-grow'>
              <span className='font-black text-sm'>Titik Pengambilan</span>
              <SelectPelanggan
                className='mb-2'
                onChange={(pelanggan) =>
                  onChangePelanggan(pelanggan, setOrigin)
                }
              />
              <input
                type='text'
                placeholder='Masukkan alamat pengambilan...'
                className='outline-none w-full p-2 focus:shadow-lg'
                id='alamat-pengirim-cek-ongkir'
                value={origin}
                onChange={(e) => onChangeInput(e, setOrigin)}
                onBlur={(e) => onBlurInput(e, setOrigin)}
              />
            </div>
          </div>
          <div className='flex gap-2 items-center mb-4'>
            <div className='text-center'>
              <BiBox className='text-[2.5rem] w-20 flex-shrink-0' />
              <small>Penerima</small>
            </div>
            <div className='flex-grow'>
              <span className='font-black text-sm'>Titik Pengiriman</span>
              <SelectPelanggan
                className='mb-2'
                onChange={(pelanggan) =>
                  onChangePelanggan(pelanggan, setDestination)
                }
              />
              <input
                type='text'
                placeholder='Masukkan alamat pengambilan...'
                className='outline-none w-full p-2 focus:shadow-lg'
                id='alamat-penerima-cek-ongkir'
                value={destination}
                onChange={(e) => onChangeInput(e, setDestination)}
                onBlur={(e) => onBlurInput(e, setDestination)}
              />
            </div>
          </div>
          <div
            id='list-ongkir'
            className='grid grid-cols-3 gap-2 font-light text-xs'
          ></div>
          <button
            id='cek-ongkir-button'
            type='button'
            className={`${styles.btn} !w-full px-10 lowercase !font-light py-5 bg-gradient-green hover:!shadow-green-400/20 flex items-center gap-2 justify-center`}
            onClick={() => cekOngkirHandler()}
          >
            <FaRoute />
            <span className='block'>Cek Ongkir</span>
          </button>
        </div>
        <div
          ref={mapRef}
          className='rounded-md w-full sm:h-full h-64 shadow border-2 border-white'
        ></div>
      </div>
    </>
  );
};

const CekOngkir = () => {
  return (
    <>
      <div className='mb-4 mx-5 bg-transparent pb-10'>
        <strong className='header-form mb-4'>Cek Ongkir</strong>
        <Wrapper
          libraries={['places']}
          region='ID'
          language='id'
          apiKey={process.env.NEXT_PUBLIC_MAPS_API}
          render={render}
        >
          <CekOngkirMapComponent />
        </Wrapper>
      </div>
    </>
  );
};

export default CekOngkir;
