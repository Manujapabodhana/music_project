import React from 'react';
import styled from 'styled-components';

const SignupContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(
    rgba(0, 0, 0, 0.85),
    rgba(0, 0, 0, 0.7)
  ), url('https://images.unsplash.com/photo-1524650359799-842906ca1c06?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80');
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  color: white;
  position: relative;
`;

const SignupCard = styled.div`
  background: rgba(0, 0, 0, 0.92);
  backdrop-filter: blur(25px);
  border-radius: 25px;
  padding: 3rem;
  max-width: 500px;
  width: 100%;
  box-shadow: 0 30px 60px rgba(0, 0, 0, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.15);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, #ff6b35, #ff8c42, #ffab5a);
  }
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const BackButton = styled.button`
  position: absolute;
  top: 2rem;
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

const Logo = styled.h1`
  font-size: 2rem;
  font-weight: bold;
  color: white;
  margin-bottom: 0.5rem;
  
  &::before {
    content: '♪';
    margin-right: 0.5rem;
    color: #ff6b35;
  }
`;

const Subtitle = styled.p`
  color: rgba(255, 255, 255, 0.7);
  font-size: 1rem;
  margin-bottom: 0.5rem;
`;

const WelcomeText = styled.h2`
  color: #ff6b35;
  font-size: 1.8rem;
  font-weight: bold;
  margin-bottom: 2rem;
  position: relative;
  
  &::before {
    content: '♫';
    position: absolute;
    left: -30px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 1.5rem;
    opacity: 0.6;
  }
  
  &::after {
    content: '♪';
    position: absolute;
    right: -25px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 1.2rem;
    opacity: 0.6;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  color: white;
  font-size: 0.9rem;
  font-weight: 500;
`;

const Input = styled.input`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  padding: 1rem;
  font-size: 1rem;
  color: white;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;

  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }

  &:focus {
    outline: none;
    border-color: #ff6b35;
    background: rgba(255, 255, 255, 0.15);
    box-shadow: 0 0 0 3px rgba(255, 107, 53, 0.1);
  }
`;

const SubmitButton = styled.button`
  background: linear-gradient(135deg, #ff6b35 0%, #ff8c42 100%);
  color: white;
  border: none;
  border-radius: 15px;
  padding: 1rem 2rem;
  font-size: 1rem;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 1px;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 1rem;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 15px 35px rgba(255, 107, 53, 0.4);
  }

  &:active {
    transform: translateY(-1px);
  }
`;

const FooterText = styled.p`
  text-align: center;
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.9rem;
  margin-top: 2rem;
`;

const LoginLink = styled.span`
  color: #ff6b35;
  cursor: pointer;
  font-weight: 500;
  transition: color 0.3s ease;

  &:hover {
    color: #ff8c42;
  }
`;

interface SignupPageProps {
  onBack?: () => void;
  onLoginClick?: () => void;
}

const SignupPage: React.FC<SignupPageProps> = ({ onBack, onLoginClick }) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted');
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      window.history.back();
    }
  };

  const handleLoginClick = () => {
    if (onLoginClick) {
      onLoginClick();
    }
  };

  return (
    <SignupContainer>
      <BackButton onClick={handleBack}>
        ← Back to Home
      </BackButton>
      
      <SignupCard>
        <Header>
          <Logo>SABRA MUSIC</Logo>
          <Subtitle>Elevate Your Musical Journey</Subtitle>
          <WelcomeText>Join Our Musical Community</WelcomeText>
        </Header>

        <Form onSubmit={handleSubmit}>
          <InputGroup>
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              type="text"
              id="fullName"
              name="fullName"
              placeholder="Enter your full name"
              required
            />
          </InputGroup>

          <InputGroup>
            <Label htmlFor="email">Email Address</Label>
            <Input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email address"
              required
            />
          </InputGroup>

          <InputGroup>
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              type="tel"
              id="phone"
              name="phone"
              placeholder="Enter your phone number"
              required
            />
          </InputGroup>

          <InputGroup>
            <Label htmlFor="password">Password</Label>
            <Input
              type="password"
              id="password"
              name="password"
              placeholder="Create a strong password"
              required
            />
          </InputGroup>

          <InputGroup>
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              placeholder="Confirm your password"
              required
            />
          </InputGroup>

          <SubmitButton type="submit">
            Start Your Musical Journey
          </SubmitButton>
        </Form>

        <FooterText>
          Already have an account? <LoginLink onClick={handleLoginClick}>Login here</LoginLink>
        </FooterText>
      </SignupCard>
    </SignupContainer>
  );
};

export default SignupPage;
