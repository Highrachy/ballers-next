import { Dropdown, Form } from 'react-bootstrap';
import PropTypes from 'prop-types';
import Button from './Button';
import React, { useState } from 'react';
import classNames from 'classnames';
import { COLOR_STYLE } from 'utils/constants';
import { BiCaretDown } from 'react-icons/bi';

// Custom Toggle component
const CustomToggle = React.forwardRef(function CustomToggle(
  { children, className, color, href, wide, onClick },
  ref
) {
  return (
    <Button
      className={className}
      color={color}
      href={href}
      wide={wide}
      onClick={onClick}
    >
      {children}
    </Button>
  );
});

CustomToggle.displayName = 'CustomToggle';

// DropdownButton component using Button component guidelines
const DropdownButton = ({
  children,
  className,
  color,
  wide,
  dropdownItems,
}) => {
  return (
    <Dropdown>
      <Dropdown.Toggle
        className={className}
        color={color}
        wide={wide}
        as={CustomToggle}
      >
        {children}
      </Dropdown.Toggle>

      <Dropdown.Menu>
        {dropdownItems.map((item, index) => (
          <Dropdown.Item
            key={index}
            eventKey={index}
            onClick={item?.onClick}
            href={item?.href}
          >
            {item.text}
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
};

DropdownButton.propTypes = {
  children: PropTypes.any,
  className: PropTypes.string,
  color: PropTypes.oneOf(COLOR_STYLE),
  loading: PropTypes.bool,
  loadingText: PropTypes.any,
  showLoadingText: PropTypes.bool,
  onClick: PropTypes.func,
  href: PropTypes.string,
  wide: PropTypes.bool,
  dropdownItems: PropTypes.arrayOf(
    PropTypes.shape({
      text: PropTypes.string.isRequired,
      href: PropTypes.string,
      onClick: PropTypes.func,
    })
  ),
};

DropdownButton.defaultProps = {
  children: 'Submit',
  className: null,
  color: COLOR_STYLE[2],
  loading: false,
  loadingText: null,
  showLoadingText: true,
  onClick: () => {},
  href: null,
  wide: false,
  dropdownItems: [],
};

export default DropdownButton;
