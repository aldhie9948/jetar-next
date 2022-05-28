import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import arrayUniqueByKey from '../lib/arrayUniqueBykey';

const PetaOrderanMap = (props) => {
  const onGoingOrders = useSelector((s) =>
    s.order.filter((f) => f.status !== 0)
  );
  const [selectedPelanggan, setSelectedPelanggan] = useState('');
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
    const orders = onGoingOrders.filter(
      (f) => f.pengirim.id === selectedPelanggan
    );
    setOnGoingOrdersByPelanggan(orders);
  };

  const geocodeAddress = async (address) => {
    const geocoder = new google.maps.Geocoder();
    try {
      const results = await geocoder.geocode({ address });
      return results;
    } catch (error) {
      console.log(error);
    }
  };

  const placeMarker = async (order) => {
    const geocoded = await geocodeAddress(order.penerima.alamat);
    const marker = new google.maps.Marker({
      position: geocoded?.results[0].geometry.location,
      map,
      optimized: true,
    });
    setMarkers((curr) => [...curr, marker]);
    const infoWindow = new google.maps.InfoWindow({
      maxWidth: 300,
      minWidth: 0,
    });
    marker.addListener('click', () => {
      const content = `
          <div class='font-black text-lg capitalize'>${order.penerima.nama}</div>
          <div class='font-black capitalize'>${order.penerima.alamat}</div>
        `;
      infoWindow.close();
      infoWindow.setContent(content);
      infoWindow.open(marker.getMap(), marker);
    });
    map.setZoom(12);
  };

  const placeMarkerForPengirim = async (address) => {
    const geocoded = await geocodeAddress(address);
    pengirimMarker.setMap(map);
    pengirimMarker.setPosition(geocoded?.results[0].geometry.location);
    pengirimMarker.setLabel('P');
  };

  useLayoutEffect(() => {
    setMap(new google.maps.Map(mapRef.current, config));
    setPengirimMarker(new google.maps.Marker());
  }, []);

  useLayoutEffect(() => {
    if (onGoingOrdersByPelanggan.length > 0) {
      placeMarkerForPengirim(onGoingOrdersByPelanggan[0].pengirim.alamat);
      for (let i = 0; i < onGoingOrdersByPelanggan.length; i++) {
        const element = onGoingOrdersByPelanggan[i];
        markers.map((marker) => marker.setMap(null));
        setMarkers([]);
        placeMarker(element);
      }
    }
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
          <option value='' selected hidden disabled>
            Pilih pelanggan..
          </option>
          {uniquePelanggans.map((f) => (
            <option value={f.id} key={f.id}>
              {f.nama}
            </option>
          ))}
        </select>
        <div className='flex justify-end'>
          <button
            disabled={selectedPelanggan === '' ? true : false}
            onClick={showPetaOrderan}
            className='w-full sm:w-max bg-gradient-green py-1 sm:px-10 rounded text-sm hover:shadow-md font-light disabled:grayscale disabled:hover:shadow-none'
          >
            Cari
          </button>
        </div>
      </div>
      <div
        ref={mapRef}
        className='rounded-md sm:col-span-2 col-span-3 h-96 shadow-lg w-full'
      ></div>
    </div>
  );
};

export default PetaOrderanMap;
