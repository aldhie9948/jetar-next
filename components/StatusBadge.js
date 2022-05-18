const StatusBadge = ({ status }) => {
  let classBadge = '';
  let textBadge = '';

  switch (status) {
    case 1:
      classBadge = 'badge-red';
      textBadge = 'masuk';
      break;
    case 2:
      classBadge = 'badge-blue';
      textBadge = 'pick up';
      break;
    case 3:
      classBadge = 'badge-green';
      textBadge = 'pengantaran';
      break;
    case 0:
      classBadge = 'badge-black';
      textBadge = 'selesai';
      break;

    default:
      break;
  }

  return (
    <div className={`sm:w-full w-24 text-xs rounded ${classBadge}`}>
      <div className='sm:px-5 px-0 py-1 text-center font-bold lowercase truncate-2'>
        {textBadge}
      </div>
    </div>
  );
};

export default StatusBadge;
