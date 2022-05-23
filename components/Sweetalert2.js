import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import localStorageService from '../lib/localStorage';

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

export const verifyUser = (callback) => {
  Swal.fire({
    title: 'Masukkan Kode ID Admin:',
    input: 'password',
    inputAttributes: {
      autocapitalize: 'off',
      autocomplete: 'new-password',
    },
    showCancelButton: true,
    confirmButtonText: 'Verifikasi',
    showLoaderOnConfirm: true,
    preConfirm: (id) => {
      const pengguna = localStorageService.get('pengguna', true);
      try {
        if (!pengguna) throw new Error('User tidak ada');
        if (pengguna) {
          if (id === pengguna.id && pengguna.username === 'aldi') {
            return pengguna;
          } else {
            throw new Error('Verifikasi gagal');
          }
        }
      } catch (error) {
        Swal.showValidationMessage(error);
      }
    },
    allowOutsideClick: () => !Swal.isLoading(),
  }).then((result) => {
    if (result.isConfirmed) {
      confirm(() => {
        callback();
      });
    }
  });
};
