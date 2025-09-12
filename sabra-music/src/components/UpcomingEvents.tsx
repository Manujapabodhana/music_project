import React from 'react';
import styled from 'styled-components';
import { FaChevronLeft, FaChevronRight, FaMapMarkerAlt } from 'react-icons/fa';

const EventsContainer = styled.section`
  padding: 6rem 2rem;
  background: #f5f5f5;
  color: #333;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 3rem;
`;

const Title = styled.h2`
  font-size: 2.5rem;
  font-weight: bold;
  color: #333;
`;

const NavigationButtons = styled.div`
  display: flex;
  gap: 1rem;
`;

const NavButton = styled.button`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: white;
  color: #333;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);

  &:hover {
    background: #ff6b35;
    color: white;
    transform: translateY(-2px);
  }
`;

const EventsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
`;

const EventCard = styled.div`
  background: white;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-10px);
  }
`;

const EventImage = styled.div<{ backgroundImage: string }>`
  height: 200px;
  background: url(${props => props.backgroundImage});
  background-size: cover;
  background-position: center;
`;

const EventContent = styled.div`
  padding: 1.5rem;
`;

const EventTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
  color: #333;
`;

const EventDetails = styled.div`
  display: flex;
  align-items: center;
  color: #666;
  font-size: 0.9rem;
  gap: 0.5rem;
`;

const events = [
  {
    id: 1,
    title: 'Ridmaya - 2026',
    location: 'Faculty of Management Studies',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80'
  },
  {
    id: 2,
    title: 'Raathriya Wee - 2026',
    location: 'Faculty of Applied Science',
    image: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80'
  },
  {
    id: 3,
    title: 'Raathriya Wee - 2026',
    location: 'Faculty of Applied Science',
    image: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80'
  }
];

const UpcomingEvents: React.FC = () => {
  return (
    <EventsContainer id="upcoming">
      <Container>
        <Header>
          <Title>Up Coming Event</Title>
          <NavigationButtons>
            <NavButton>
              {<FaChevronLeft /> as any}
            </NavButton>
            <NavButton>
              {<FaChevronRight /> as any}
            </NavButton>
          </NavigationButtons>
        </Header>
        
        <EventsGrid>
          {events.map((event) => (
            <EventCard key={event.id}>
              <EventImage backgroundImage={event.image} />
              <EventContent>
                <EventTitle>{event.title}</EventTitle>
                <EventDetails>
                  {<FaMapMarkerAlt /> as any}
                  {event.location}
                </EventDetails>
              </EventContent>
            </EventCard>
          ))}
        </EventsGrid>
      </Container>
    </EventsContainer>
  );
};

export default UpcomingEvents;
