import React from 'react';
import { useRouter } from 'next/router';

const PwaRedirect = () => {
  const router = useRouter();

  React.useEffect(() => {
    router.push('/');
    // eslint-disable-next-line
  }, []);

  return <></>;
};

export default PwaRedirect;
