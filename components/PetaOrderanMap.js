import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import arrayUniqueByKey from '../lib/arrayUniqueBykey';

const PetaOrderanMap = (props) => {
  const onGoingOrders = useSelector((s) =>
    s.order.filter((f) => f.status !== 0)
  );
  const [selectedPelanggan, setSelectedPelanggan] = useState('all');
  const [onGoingOrdersByPelanggan, setOnGoingOrdersByPelanggan] = useState([]);
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [pengirimMarker, setPengirimMarker] = useState(null);
  const mapRef = useRef();
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

  const pelanggans = onGoingOrders.map((f) => f.pengirim);
  const uniquePelanggans = arrayUniqueByKey(pelanggans, 'nama');

  const changePetaOrderan = (e) => {
    const value = e.target.value;
    setSelectedPelanggan(value);
  };

  const showPetaOrderan = () => {
    const orders = onGoingOrders.filter((f) =>
      selectedPelanggan === 'all' ? true : f.pengirim.id === selectedPelanggan
    );
    setOnGoingOrdersByPelanggan(orders);
  };

  const placeMarker = async (order, geocoded) => {
    const icon = `favicon-32x32.png`;
    const marker = new google.maps.Marker({
      position: geocoded.geometry.location,
      map,
      optimized: true,
      icon,
    });
    setMarkers((curr) => [...curr, marker]);
    const infoWindow = new google.maps.InfoWindow({
      maxWidth: 400,
      minWidth: 0,
    });
    marker.addListener('click', () => {
      const content = `
      <div class='capitalize'>
        <div class='grid grid-cols-5 mb-1'>
          <div class='col-span-1'>Pukul</div>
          <div class='col-span-4 font-bold'>${order.waktuOrder} WIB</div>
        </div>
        <div class='grid grid-cols-5 mb-1'>
          <div class='col-span-1'>Pengirim</div>
          <div class='col-span-4 font-bold'>${order.pengirim.nama}</div>
        </div>
        <div class='grid grid-cols-5 mb-1'>
          <div class='col-span-1'>Penerima</div>
          <div class='col-span-4 font-bold'>${order.penerima.nama}</div>
        </div>
        <div class='grid grid-cols-5 mb-1'>
          <div class='col-span-1'>Alamat</div>
          <div class='col-span-4'>${order.penerima.alamat}</div>
        </div>
      </div>
        `;
      infoWindow.close();
      infoWindow.setContent(content);
      infoWindow.open(marker.getMap(), marker);
    });
    map.setZoom(12);
  };

  const placeMarkerForPengirim = async (address) => {
    try {
      const geocoder = new google.maps.Geocoder();
      const geocoded = await geocoder.geocode({ address });
      pengirimMarker.setMap(map);
      pengirimMarker.setPosition(geocoded?.results[0].geometry.location);
      pengirimMarker.setLabel('P');
    } catch (error) {
      console.log('place marker for pengirim error', error);
    }
  };

  const mappingOrders = () => {
    const geocoder = new google.maps.Geocoder();

    markers.map((marker) => marker.setMap(null));
    setMarkers([]);
    for (let i = 0; i < onGoingOrdersByPelanggan.length; i++) {
      const order = onGoingOrdersByPelanggan[i];
      const recursiveGeocode = () => {
        geocoder.geocode(
          { address: order.penerima.alamat },
          (results, status) => {
            if (status === 'OK') {
              placeMarker(order, results[0]);
            } else if (status === 'OVER_QUERY_LIMIT') {
              setTimeout(() => {
                recursiveGeocode();
              }, 1000 * i);
            } else {
              alert(
                'Geocode was not successful for the following reason: ' + status
              );
            }
          }
        );
      };
      recursiveGeocode();
    }
  };

  useLayoutEffect(() => {
    setMap(new google.maps.Map(mapRef.current, config));
    setPengirimMarker(new google.maps.Marker());
    // eslint-disable-next-line
  }, []);

  useLayoutEffect(() => {
    if (onGoingOrdersByPelanggan.length > 0) {
      selectedPelanggan !== 'all' &&
        placeMarkerForPengirim(onGoingOrdersByPelanggan[0].pengirim.alamat);
      mappingOrders();
    }
    // eslint-disable-next-line
  }, [onGoingOrdersByPelanggan, map]);

  return (
    <div className='mx-5 mb-4 grid grid-cols-3 gap-2'>
      <div className='col-span-3 sm:col-span-1'>
        <span className='block font-bold'>Pilih Peta Orderan:</span>
        <select
          value={selectedPelanggan}
          onChange={changePetaOrderan}
          className='outline-none capitalize border p-1 bg-white w-full rounded shadow mb-2'
        >
          <option value='all'>Semua</option>
          {uniquePelanggans.map((f) => (
            <option value={f.id} key={f.id}>
              {f.nama}
            </option>
          ))}
        </select>
        <div className='flex justify-end'>
          <button
            onClick={showPetaOrderan}
            className='w-full sm:w-max bg-gradient-green py-1 sm:px-10 rounded text-sm hover:shadow-md font-light disabled:grayscale disabled:hover:shadow-none'
          >
            Cari
          </button>
        </div>
      </div>
      <div
        ref={mapRef}
        className='rounded-md sm:col-span-2 col-span-3 h-96 shadow w-full border-2 border-white'
      ></div>
    </div>
  );
};

export default PetaOrderanMap;
