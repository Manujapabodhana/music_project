import React from 'react';
import styled from 'styled-components';

const ScheduleContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(
    rgba(0, 0, 0, 0.85),
    rgba(0, 0, 0, 0.7)
  ), url('https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80');
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  color: white;
  text-align: center;
  position: relative;
`;

const Header = styled.header`
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
  cursor: pointer;
  
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

const NavLink = styled.a<{ active?: boolean }>`
  color: ${props => props.active ? '#ff6b35' : 'white'};
  text-transform: uppercase;
  font-size: 0.9rem;
  letter-spacing: 1px;
  padding: 0.5rem 0;
  position: relative;
  transition: color 0.3s ease;
  cursor: pointer;

  &:hover {
    color: #ff6b35;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: ${props => props.active ? '100%' : '0'};
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
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #ff6b35;
    color: white;
    transform: translateY(-2px);
  }
`;

const BackButton = styled.button`
  position: absolute;
  top: 100px;
  left: 2rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 25px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);

  &:hover {
    background: rgba(255, 107, 53, 0.8);
    border-color: #ff6b35;
    transform: translateY(-2px);
  }
`;

const ContentContainer = styled.div`
  max-width: 900px;
  width: 100%;
  z-index: 2;
  margin-top: 100px;
`;

const MainTitle = styled.h1`
  font-size: clamp(2.5rem, 6vw, 4rem);
  font-weight: bold;
  line-height: 1.3;
  margin-bottom: 2rem;
  color: white;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
`;

const Description = styled.p`
  font-size: 1.2rem;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 3rem;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
`;

const StartBookingButton = styled.button`
  background: white;
  color: black;
  padding: 1.2rem 3rem;
  border-radius: 35px;
  font-weight: bold;
  font-size: 1.1rem;
  text-transform: uppercase;
  letter-spacing: 2px;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.5s;
  }

  &:hover {
    background: #ff6b35;
    color: white;
    transform: translateY(-5px);
    box-shadow: 0 20px 40px rgba(255, 107, 53, 0.4);
  }

  &:hover::before {
    left: 100%;
  }

  &:active {
    transform: translateY(-2px);
  }
`;

const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-top: 4rem;
  margin-bottom: 2rem;
`;

const FeatureCard = styled.div`
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  padding: 2rem;
  text-align: center;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-10px);
    border-color: rgba(255, 107, 53, 0.5);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  }
`;

const FeatureIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
  color: #ff6b35;
`;

const FeatureTitle = styled.h3`
  font-size: 1.3rem;
  font-weight: bold;
  margin-bottom: 1rem;
  color: white;
`;

const FeatureDescription = styled.p`
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.5;
`;

interface SchedulePageProps {
  onBack?: () => void;
  onStartBooking?: () => void;
}

const SchedulePage: React.FC<SchedulePageProps> = ({ onBack, onStartBooking }) => {
  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      window.history.back();
    }
  };

  const handleStartBooking = () => {
    if (onStartBooking) {
      onStartBooking();
    } else {
      console.log('Start booking clicked');
    }
  };

  return (
    <ScheduleContainer>
      <Header>
        <Logo onClick={handleBack}>SABRA MUSIC</Logo>
        <Nav>
          <NavLink active>Schedule</NavLink>
          <NavLink>Up Coming</NavLink>
          <NavLink>History</NavLink>
          <NavLink>About</NavLink>
        </Nav>
        <AdminButton>Admin</AdminButton>
      </Header>

      <BackButton onClick={handleBack}>
        ← Back to Home
      </BackButton>

      <ContentContainer>
        <MainTitle>
          Easily Reserve Spaces For Your Events, Exhibitions, And Performances. Choose Your Preferred Date, Time, And Venue — And Secure Your Spot At The Art Center In Just A Few Clicks.
        </MainTitle>
        
        <Description>
          Book professional venues for your musical performances, art exhibitions, and creative events. 
          Our state-of-the-art facilities provide the perfect backdrop for your artistic vision.
        </Description>

        <StartBookingButton onClick={handleStartBooking}>
          Start Booking
        </StartBookingButton>

        <FeatureGrid>
          <FeatureCard>
            <FeatureIcon>🎵</FeatureIcon>
            <FeatureTitle>Music Performances</FeatureTitle>
            <FeatureDescription>
              Professional acoustics and sound systems for concerts, recitals, and live performances.
            </FeatureDescription>
          </FeatureCard>

          <FeatureCard>
            <FeatureIcon>🎨</FeatureIcon>
            <FeatureTitle>Art Exhibitions</FeatureTitle>
            <FeatureDescription>
              Gallery spaces with professional lighting and display systems for art exhibitions.
            </FeatureDescription>
          </FeatureCard>

          <FeatureCard>
            <FeatureIcon>📅</FeatureIcon>
            <FeatureTitle>Flexible Scheduling</FeatureTitle>
            <FeatureDescription>
              Choose your preferred dates and times with our easy-to-use booking system.
            </FeatureDescription>
          </FeatureCard>
        </FeatureGrid>
      </ContentContainer>
    </ScheduleContainer>
  );
};

export default SchedulePage;
