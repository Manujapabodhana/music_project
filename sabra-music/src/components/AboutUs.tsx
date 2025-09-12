import React from 'react';
import styled from 'styled-components';

const AboutContainer = styled.section`
  min-height: 100vh;
  background: linear-gradient(
    rgba(0, 0, 0, 0.8),
    rgba(0, 0, 0, 0.6)
  ), url('https://images.unsplash.com/photo-1501386761578-eac5c94b800a?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80');
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6rem 2rem;
  color: white;
  text-align: center;
`;

const AboutContent = styled.div`
  max-width: 800px;
  z-index: 2;
`;

const Title = styled.h2`
  font-size: 3rem;
  font-weight: bold;
  margin-bottom: 2rem;
  color: white;
`;

const Description = styled.p`
  font-size: 1.2rem;
  line-height: 1.8;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 1rem;
`;

const Subtitle = styled.p`
  font-size: 1.1rem;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.8);
`;

const AboutUs: React.FC = () => {
  return (
    <AboutContainer id="about">
      <AboutContent>
        <Title>About Us</Title>
        <Description>
          Seamless Flight Booking And Travel Planning At Your Fingertips—Effortless,
        </Description>
        <Subtitle>
          Affordable, And Stress-Free Journeys Await You!
        </Subtitle>
      </AboutContent>
    </AboutContainer>
  );
};

export default AboutUs;
