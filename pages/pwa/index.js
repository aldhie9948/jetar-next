import React from 'react';

const PwaRedirect = () => {
  React.useEffect(() => {
    router.push('/pwa/drivers');
    // eslint-disable-next-line
  }, []);

  return (
    <>
      <div className='fixed bg-black/20 inset-0'></div>
      <div className='flex z-[9999] absolute inset-0'>
        <div className='lds-facebook m-auto'>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    </>
  );
};

export default PwaRedirect;
