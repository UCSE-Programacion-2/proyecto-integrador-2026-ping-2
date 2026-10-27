import PropTypes from 'prop-types';

export default function Message({ children, variant = 'muted' }) {
  return <p className={`text-${variant} text-center w-100 py-5`}>{children}</p>;
}

Message.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.string,
};
