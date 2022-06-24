import fs from 'fs';
const getStaticMap = ({ name, endpoint }) => {
  fetch(endpoint).then((res) => {
    res.body.pipe(
      fs.createWriteStream(
        `${process.cwd()}/public/assets/image/map-orderan/${name}.png`
      )
    );
  });
};

export const removeMaps = ({ name }) => {
  const path = `${process.cwd()}/public/assets/image/map-orderan/${name}.png`;
  try {
    fs.unlinkSync(path);
  } catch (error) {
    console.error(error);
  }
};

export const getLinkStaticMap = ({ origin, destination }) => {
  const base = 'https://maps.googleapis.com/maps/api/staticmap?';
  const query = {
    size: '400x200',
    scale: '2',
    maptype: 'roadmap',
    markers: `color:red|label:K|scale:4|${origin}`,
    sensor: false,
    key: process.env.NEXT_PUBLIC_MAPS_API,
  };
  const param = new URLSearchParams(query);
  const param2 = new URLSearchParams({
    markers: `color:green|label:T|scale:4|${destination}`,
  });

  return `${base}${param.toString()}&${param2.toString()}`;
};

export const directionLinkBuilder = (alamat) => {
  const base = 'https://www.google.com/maps/dir//';
  const urlEncoded = encodeURI(alamat);
  return base + urlEncoded;
};

export default getStaticMap;
