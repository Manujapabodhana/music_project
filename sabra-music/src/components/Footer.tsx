import React from 'react';
import styled from 'styled-components';

const FooterContainer = styled.footer`
  background: #0a0a0a;
  color: white;
  text-align: center;
  padding: 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`;

const FooterText = styled.p`
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
`;

const Footer: React.FC = () => {
  return (
    <FooterContainer>
      <FooterText>
        2025 | Sabra Music | All Rights Reserved
      </FooterText>
    </FooterContainer>
  );
};

export default Footer;
