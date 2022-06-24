const cekOngkir = (distance) => {
  distance = distance === 0 ? 1 : distance;
  const OngkirPrice = [
    { range: 1, value: 8000 },
    { range: 2, value: 9000 },
    { range: 3, value: 9000 },
    { range: 4, value: 10000 },
    { range: 5, value: 11000 },
    { range: 6, value: 13000 },
    { range: 7, value: 14000 },
    { range: 8, value: 15000 },
    { range: 9, value: 16000 },
    { range: 10, value: 18000 },
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

export default cekOngkir;
