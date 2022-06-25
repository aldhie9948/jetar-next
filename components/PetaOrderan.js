import React from 'react';
import { Wrapper } from '@googlemaps/react-wrapper';
import PetaOrderanMap from '../components/PetaOrderanMap';

const PetaOrderan = (props) => {
  return (
    <>
      <div>
        <Wrapper
          libraries={['places']}
          region='ID'
          language='id'
          apiKey={process.env.NEXT_PUBLIC_MAPS_API}
        >
          <PetaOrderanMap />
        </Wrapper>
      </div>
    </>
  );
};

export default PetaOrderan;
