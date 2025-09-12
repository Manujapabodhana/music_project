import React from 'react';
import styled from 'styled-components';
import Header from './components/Header';
import Hero from './components/Hero';
import UpcomingEvents from './components/UpcomingEvents';
import AboutUs from './components/AboutUs';
import Footer from './components/Footer';
import GlobalStyles from './styles/GlobalStyles';

const AppContainer = styled.div`
  min-height: 100vh;
  background: #0a0a0a;
  color: white;
`;

function App() {
  return (
    <AppContainer>
      <GlobalStyles />
      <Header />
      <Hero />
      <UpcomingEvents />
      <AboutUs />
      <Footer />
    </AppContainer>
  );
}

export default App;
