import React from 'react';
import styled from 'styled-components';

const LoginContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(
    rgba(0, 0, 0, 0.88),
    rgba(0, 0, 0, 0.75)
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

const LoginCard = styled.div`
  background: rgba(0, 0, 0, 0.93);
  backdrop-filter: blur(30px);
  border-radius: 25px;
  padding: 3.5rem;
  max-width: 450px;
  width: 100%;
  box-shadow: 0 35px 70px rgba(0, 0, 0, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.18);
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

  &::after {
    content: '♪';
    position: absolute;
    top: 20px;
    right: 20px;
    font-size: 2rem;
    color: rgba(255, 107, 53, 0.3);
    animation: float 3s ease-in-out infinite;
  }

  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
  }
`;

const BackButton = styled.button`
  position: absolute;
  top: 2rem;
  left: 2rem;
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.25);
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
    box-shadow: 0 8px 25px rgba(255, 107, 53, 0.3);
  }
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 2.5rem;
`;

const Logo = styled.h1`
  font-size: 2.2rem;
  font-weight: bold;
  color: white;
  margin-bottom: 0.5rem;
  
  &::before {
    content: '♪';
    margin-right: 0.5rem;
    color: #ff6b35;
    animation: pulse 2s ease-in-out infinite;
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.7; }
  }
`;

const Subtitle = styled.p`
  color: rgba(255, 255, 255, 0.75);
  font-size: 1rem;
  margin-bottom: 0.5rem;
`;

const WelcomeText = styled.h2`
  color: #ff6b35;
  font-size: 1.9rem;
  font-weight: bold;
  margin-bottom: 2.5rem;
  position: relative;
  
  &::before {
    content: '♫';
    position: absolute;
    left: -35px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 1.6rem;
    opacity: 0.6;
    animation: rotate 4s linear infinite;
  }
  
  &::after {
    content: '♬';
    position: absolute;
    right: -30px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 1.3rem;
    opacity: 0.6;
    animation: bounce 2s ease-in-out infinite;
  }

  @keyframes rotate {
    0% { transform: translateY(-50%) rotate(0deg); }
    100% { transform: translateY(-50%) rotate(360deg); }
  }

  @keyframes bounce {
    0%, 100% { transform: translateY(-50%); }
    50% { transform: translateY(-70%); }
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.8rem;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
`;

const Label = styled.label`
  color: white;
  font-size: 0.95rem;
  font-weight: 500;
  letter-spacing: 0.5px;
`;

const Input = styled.input`
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.25);
  border-radius: 12px;
  padding: 1.2rem;
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
    background: rgba(255, 255, 255, 0.18);
    box-shadow: 0 0 0 3px rgba(255, 107, 53, 0.15);
    transform: translateY(-2px);
  }
`;

const ForgotPassword = styled.a`
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
  text-align: right;
  cursor: pointer;
  transition: color 0.3s ease;
  margin-top: -0.5rem;

  &:hover {
    color: #ff6b35;
  }
`;

const LoginButton = styled.button`
  background: linear-gradient(135deg, #ff6b35 0%, #ff8c42 50%, #ffab5a 100%);
  color: white;
  border: none;
  border-radius: 15px;
  padding: 1.2rem 2rem;
  font-size: 1.1rem;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 1.2px;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 1rem;
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
    transform: translateY(-3px);
    box-shadow: 0 20px 40px rgba(255, 107, 53, 0.4);
  }

  &:hover::before {
    left: 100%;
  }

  &:active {
    transform: translateY(-1px);
  }
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  margin: 1.5rem 0;
  
  &::before,
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: rgba(255, 255, 255, 0.2);
  }
  
  span {
    padding: 0 1rem;
    color: rgba(255, 255, 255, 0.6);
    font-size: 0.9rem;
  }
`;

const SocialLogin = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const SocialButton = styled.button`
  flex: 1;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  padding: 0.8rem;
  border-radius: 10px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.15);
    transform: translateY(-2px);
  }
`;

const FooterText = styled.p`
  text-align: center;
  color: rgba(255, 255, 255, 0.65);
  font-size: 0.9rem;
  margin-top: 2rem;
`;

const SignupLink = styled.span`
  color: #ff6b35;
  cursor: pointer;
  font-weight: 500;
  transition: color 0.3s ease;

  &:hover {
    color: #ff8c42;
    text-decoration: underline;
  }
`;

interface LoginPageProps {
  onBack?: () => void;
  onSignupClick?: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onBack, onSignupClick }) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Login form submitted');
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      window.history.back();
    }
  };

  const handleSignupClick = () => {
    if (onSignupClick) {
      onSignupClick();
    }
  };

  return (
    <LoginContainer>
      <BackButton onClick={handleBack}>
        ← Back to Signup
      </BackButton>
      
      <LoginCard>
        <Header>
          <Logo>SABRA MUSIC</Logo>
          <Subtitle>Elevate Your Musical Journey</Subtitle>
          <WelcomeText>Welcome Back, Musician!</WelcomeText>
        </Header>

        <Form onSubmit={handleSubmit}>
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
            <Label htmlFor="password">Password</Label>
            <Input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              required
            />
            <ForgotPassword href="#">Forgot Password?</ForgotPassword>
          </InputGroup>

          <LoginButton type="submit">
            Continue Your Journey
          </LoginButton>
        </Form>

        <Divider>
          <span>or continue with</span>
        </Divider>

        <SocialLogin>
          <SocialButton>Google</SocialButton>
          <SocialButton>Facebook</SocialButton>
        </SocialLogin>

        <FooterText>
          Don't have an account? <SignupLink onClick={handleSignupClick}>Sign up here</SignupLink>
        </FooterText>
      </LoginCard>
    </LoginContainer>
  );
};

export default LoginPage;
