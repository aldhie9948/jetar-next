import { apiStaticMaps } from '../utils/api';
import fs from 'fs';
const getStaticMap = ({ name, origin, destination, polyline = null }) => {
  const base = 'https://maps.googleapis.com/maps/api/staticmap?';
  const query = {
    size: '400x200',
    scale: '2',
    maptype: 'roadmap',
    markers: `color:red|label:K|scale:4|${origin}`,
    sensor: false,
    key: apiStaticMaps(),
  };
  if (polyline) query.path = `enc:${polyline}`;
  const param = new URLSearchParams(query);
  const param2 = new URLSearchParams({
    markers: `color:green|label:T|scale:4|${destination}`,
  });

  const endpoint = `${base}${param.toString()}&${param2.toString()}`;

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

export default getStaticMap;
