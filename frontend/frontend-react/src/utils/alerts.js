import Swal from 'sweetalert2';

// Botones de las alertas con los estilos de la tienda en lugar del violeta por defecto
const Alerta = Swal.mixin({
  buttonsStyling: false,
  customClass: {
    popup: 'rounded-4',
    confirmButton: 'btn btn-warning fw-bold px-4',
    cancelButton: 'btn btn-outline-dark fw-semibold px-4 ms-2',
  },
});

export const toast = (icon, title) =>
  Swal.fire({
    toast: true,
    position: 'top-end',
    icon,
    title,
    showConfirmButton: false,
    timer: 2000,
  });

export const alerta = (icon, title, text) => Alerta.fire({ icon, title, text });

export const confirmar = (title, text, confirmButtonText) =>
  Alerta.fire({
    icon: 'warning',
    title,
    text,
    showCancelButton: true,
    confirmButtonText,
    cancelButtonText: 'Cancelar',
    customClass: {
      popup: 'rounded-4',
      confirmButton: 'btn btn-danger fw-bold px-4',
      cancelButton: 'btn btn-outline-dark fw-semibold px-4 ms-2',
    },
  }).then(({ isConfirmed }) => isConfirmed);
