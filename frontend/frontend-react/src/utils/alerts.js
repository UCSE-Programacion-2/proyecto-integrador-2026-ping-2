import Swal from 'sweetalert2';

export const toast = (icon, title) =>
  Swal.fire({
    toast: true,
    position: 'top-end',
    icon,
    title,
    showConfirmButton: false,
    timer: 2000,
  });

export const alerta = (icon, title, text) => Swal.fire({ icon, title, text });

export const confirmar = (title, text, confirmButtonText) =>
  Swal.fire({
    icon: 'warning',
    title,
    text,
    showCancelButton: true,
    confirmButtonText,
    cancelButtonText: 'Cancelar',
    confirmButtonColor: '#dc3545',
  }).then(({ isConfirmed }) => isConfirmed);
