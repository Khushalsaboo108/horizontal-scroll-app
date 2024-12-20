import { useState } from 'react';

const HamburgerMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="dropdown-container">
      <button className="hamburger-btn" onClick={toggleMenu}>
        ☰
      </button>
      {isOpen && (
        <ul className="dropdown-menu">
          <li>
            <button className="dropdown-item" onClick={() => alert('Action clicked!')}>About us</button>
          </li>
          <li>
            <button className="dropdown-item" onClick={() => alert('Another action clicked!')}>Contact us</button>
          </li>
          {/* <li>
            <button className="dropdown-item" onClick={() => alert('Something else clicked!')}>Know more about</button>
          </li> */}
        </ul>
      )}
    </div>
  );
};

export default HamburgerMenu;
