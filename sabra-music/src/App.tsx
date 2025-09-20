import React, { useState } from 'react';
import styled from 'styled-components';
import Header from './components/Header';
import Hero from './components/Hero';
import UpcomingEvents from './components/UpcomingEvents';
import AboutUs from './components/AboutUs';
import Footer from './components/Footer';
import SignupPage from './components/SignupPage';
import LoginPage from './components/LoginPage';
import SchedulePage from './components/SchedulePage';
import BookingFormPage from './components/BookingFormPage';
import GlobalStyles from './styles/GlobalStyles';

const AppContainer = styled.div`
  min-height: 100vh;
  background: #0a0a0a;
  color: white;
`;

function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'signup' | 'login' | 'schedule' | 'booking'>('home');

  const goToSignup = () => {
    setCurrentPage('signup');
  };

  const goToLogin = () => {
    setCurrentPage('login');
  };

  const goToSchedule = () => {
    setCurrentPage('schedule');
  };

  const goToBooking = () => {
    setCurrentPage('booking');
  };

  const goToHome = () => {
    setCurrentPage('home');
  };

  if (currentPage === 'booking') {
    return (
      <AppContainer>
        <GlobalStyles />
        <BookingFormPage onBack={goToSchedule} />
      </AppContainer>
    );
  }

  if (currentPage === 'schedule') {
    return (
      <AppContainer>
        <GlobalStyles />
        <SchedulePage onBack={goToHome} onStartBooking={goToBooking} />
      </AppContainer>
    );
  }

  if (currentPage === 'login') {
    return (
      <AppContainer>
        <GlobalStyles />
        <LoginPage onBack={goToSignup} onSignupClick={goToSignup} />
      </AppContainer>
    );
  }

  if (currentPage === 'signup') {
    return (
      <AppContainer>
        <GlobalStyles />
        <SignupPage onBack={goToHome} onLoginClick={goToLogin} />
      </AppContainer>
    );
  }

  return (
    <AppContainer>
      <GlobalStyles />
      <Header onScheduleClick={goToSchedule} />
      <Hero onSignupClick={goToSignup} />
      <UpcomingEvents />
      <AboutUs />
      <Footer />
    </AppContainer>
  );
}

export default App;
