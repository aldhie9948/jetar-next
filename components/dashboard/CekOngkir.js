import React, { useImperativeHandle, useState } from 'react';
const CekOngkir = React.forwardRef(({}, ref) => {
  const [visible, setVisible] = useState(false);
  useImperativeHandle(ref, () => ({
    toggle: () => setVisible(!visible),
  }));
  return (
    <>{visible && <div className='mb-4 h-20 w-full rounded bg-white'></div>}</>
  );
});

CekOngkir.displayName = 'Cek Ongkir';
export default CekOngkir;
