const route = ({ level }) => {
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
