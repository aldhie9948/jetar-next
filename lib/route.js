const route = ({ level }) => {
  console.log('level', level);
  switch (level) {
    case 0:
      return '/dashboard';
    case 1:
      return '/pwa/drivers';
    default:
      return '/logout';
  }
};

export default route;
