import PropTypes from 'prop-types';

export const UserShape = PropTypes.shape({
  id: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  first_name: PropTypes.string.isRequired,
  last_name: PropTypes.string.isRequired,
  role: PropTypes.string.isRequired
});
