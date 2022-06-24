import React, { useImperativeHandle, useState } from 'react';
import { Wrapper } from '@googlemaps/react-wrapper';
import PetaOrderanMap from '../components/PetaOrderanMap';

const PetaOrderan = React.forwardRef((props, ref) => {
  const [visible, setVisible] = useState(false);

  useImperativeHandle(ref, () => ({
    toggle: () => setVisible(!visible),
  }));

  return (
    <>
      {visible && (
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
      )}
    </>
  );
});

PetaOrderan.displayName = 'PetaOrderan';
export default PetaOrderan;
