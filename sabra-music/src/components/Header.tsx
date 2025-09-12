import React from 'react';
import styled from 'styled-components';

const HeaderContainer = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: rgba(10, 10, 10, 0.95);
  backdrop-filter: blur(10px);
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 1000;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  font-size: 1.5rem;
  font-weight: bold;
  color: white;
  
  &::before {
    content: '♪';
    margin-right: 0.5rem;
    font-size: 2rem;
    color: #ff6b35;
  }
`;

const Nav = styled.nav`
  display: flex;
  gap: 2rem;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const NavLink = styled.a`
  color: white;
  text-transform: uppercase;
  font-size: 0.9rem;
  letter-spacing: 1px;
  padding: 0.5rem 0;
  position: relative;
  transition: color 0.3s ease;

  &:hover {
    color: #ff6b35;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 0;
    height: 2px;
    background: #ff6b35;
    transition: width 0.3s ease;
  }

  &:hover::after {
    width: 100%;
  }
`;

const AdminButton = styled.button`
  background: white;
  color: black;
  padding: 0.5rem 1.5rem;
  border-radius: 25px;
  font-weight: bold;
  text-transform: uppercase;
  font-size: 0.9rem;
  letter-spacing: 1px;
  transition: all 0.3s ease;

  &:hover {
    background: #ff6b35;
    color: white;
    transform: translateY(-2px);
  }
`;

const Header: React.FC = () => {
  return (
    <HeaderContainer>
      <Logo>SABRA MUSIC</Logo>
      <Nav>
        <NavLink href="#schedule">Schedule</NavLink>
        <NavLink href="#upcoming">Up Coming</NavLink>
        <NavLink href="#history">History</NavLink>
        <NavLink href="#about">About</NavLink>
      </Nav>
      <AdminButton>Admin</AdminButton>
    </HeaderContainer>
  );
};

export default Header;
