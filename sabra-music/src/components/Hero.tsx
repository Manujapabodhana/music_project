import React from 'react';
import styled from 'styled-components';
import { FaTwitter, FaInstagram, FaFacebook, FaLinkedin } from 'react-icons/fa';

const HeroContainer = styled.section`
  min-height: 100vh;
  background: linear-gradient(
    rgba(0, 0, 0, 0.7),
    rgba(0, 0, 0, 0.5)
  ), url('https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80');
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  display: flex;
  align-items: center;
  padding: 0 2rem;
  position: relative;
`;

const HeroContent = styled.div`
  max-width: 600px;
  z-index: 2;
`;

const Subtitle = styled.p`
  color: #ff6b35;
  font-size: 1rem;
  text-transform: uppercase;
  letter-spacing: 2px;
  margin-bottom: 1rem;
  font-weight: 500;
`;

const Title = styled.h1`
  font-size: clamp(2.5rem, 8vw, 4.5rem);
  font-weight: bold;
  line-height: 1.2;
  margin-bottom: 2rem;
  color: white;
`;

const SignUpButton = styled.button`
  background: white;
  color: black;
  padding: 1rem 2rem;
  border-radius: 30px;
  font-weight: bold;
  font-size: 1rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  transition: all 0.3s ease;
  margin-bottom: 3rem;

  &:hover {
    background: #ff6b35;
    color: white;
    transform: translateY(-3px);
    box-shadow: 0 10px 30px rgba(255, 107, 53, 0.3);
  }
`;

const SocialContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const FollowText = styled.span`
  color: white;
  font-size: 1rem;
  margin-right: 1rem;
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 1rem;
`;

const SocialIcon = styled.a`
  width: 40px;
  height: 40px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  transition: all 0.3s ease;

  &:hover {
    border-color: #ff6b35;
    color: #ff6b35;
    transform: translateY(-2px);
  }
`;

const Hero: React.FC = () => {
  return (
    <HeroContainer>
      <HeroContent>
        <Subtitle>Elevate Your Musical Journey</Subtitle>
        <Title>
          Feel The Rhythm Of Your Soul!
        </Title>
        <SignUpButton>Sign Up</SignUpButton>
        <SocialContainer>
          <FollowText>Follow</FollowText>
          <SocialLinks>
            <SocialIcon href="#" aria-label="Twitter">
              {<FaTwitter /> as any}
            </SocialIcon>
            <SocialIcon href="#" aria-label="Instagram">
              {<FaInstagram /> as any}
            </SocialIcon>
            <SocialIcon href="#" aria-label="Facebook">
              {<FaFacebook /> as any}
            </SocialIcon>
            <SocialIcon href="#" aria-label="LinkedIn">
              {<FaLinkedin /> as any}
            </SocialIcon>
          </SocialLinks>
        </SocialContainer>
      </HeroContent>
    </HeroContainer>
  );
};

export default Hero;
