import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

export const toast = ({ title, icon = 'warning' }) => {
  const popup =
    icon === 'error' ? 'toast-red' : icon === 'success' ? 'toast-green' : '';

  const Toast = Swal.mixin({
    toast: true,
    customClass: {
      popup,
      title: 'toast-title',
    },
    position: 'top-end',
    showConfirmButton: false,
    timer: 1000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer);
      toast.addEventListener('mouseleave', Swal.resumeTimer);
    },
  });
  Toast.fire({
    icon,
    title,
  });
};

export const confirm = (callback) => {
  Swal.fire({
    title: 'Anda Yakin?',
    text: 'Data akan diproses lebih lanjut!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
  }).then((result) => {
    if (result.isConfirmed) {
      callback();
    }
  });
};
