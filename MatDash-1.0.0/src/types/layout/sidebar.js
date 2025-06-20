import PropTypes from "prop-types";

export const navItemProps = {
  item: PropTypes.shape({
    icon: PropTypes.string.isRequired,
    href: PropTypes.string,
    disabled: PropTypes.bool,
    title: PropTypes.string,
    subtitle: PropTypes.string,
    chip: PropTypes.string,
    chipColor: PropTypes.string,
    variant: PropTypes.string,
    external: PropTypes.bool,
    id: PropTypes.number.isRequired,
  }),
};

export const listItemType = {
  component: PropTypes.any.isRequired,
  href: PropTypes.string,
  target: PropTypes.any,
  to: PropTypes.any,
};