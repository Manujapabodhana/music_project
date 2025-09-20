import React, { useState } from 'react';
import styled from 'styled-components';

const BookingContainer = styled.div`
  min-height: 100vh;
  background: 
    linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)),
    url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800"><defs><pattern id="guitar" x="0" y="0" width="200" height="200" patternUnits="userSpaceOnUse"><path d="M50,50 Q100,25 150,50 Q125,100 100,150 Q75,125 50,100 Z" fill="rgba(255,255,255,0.03)"/></pattern></defs><rect width="100%" height="100%" fill="url(%23guitar)"/></svg>');
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  overflow-x: hidden;
`;

const Header = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.9);
  backdrop-filter: blur(15px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 1000;
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

const NavLink = styled.button<{ active?: boolean }>`
  background: none;
  border: none;
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

const FormContainer = styled.div`
  max-width: 1000px;
  width: 100%;
  margin: 120px 20px 40px;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 40px;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
`;

const BookingForm = styled.form`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  color: #333;
  margin-bottom: 8px;
  font-weight: 500;
  font-size: 14px;
`;

const Input = styled.input`
  padding: 12px;
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.9);
  color: #333;
  font-size: 16px;

  &::placeholder {
    color: rgba(0, 0, 0, 0.5);
  }

  &:focus {
    outline: none;
    border-color: #007acc;
    box-shadow: 0 0 0 2px rgba(0, 122, 204, 0.2);
  }

  &[type="email"]::placeholder {
    color: rgba(0, 0, 0, 0.4);
  }
`;

const Select = styled.select`
  padding: 12px;
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.9);
  color: #333;
  font-size: 16px;

  option {
    background: #fff;
    color: #333;
  }

  &:focus {
    outline: none;
    border-color: #007acc;
    box-shadow: 0 0 0 2px rgba(0, 122, 204, 0.2);
  }
`;

const TextArea = styled.textarea`
  padding: 12px;
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.9);
  color: #333;
  font-size: 16px;
  min-height: 120px;
  resize: vertical;
  grid-column: 1 / -1;

  &::placeholder {
    color: rgba(0, 0, 0, 0.5);
  }

  &:focus {
    outline: none;
    border-color: #007acc;
    box-shadow: 0 0 0 2px rgba(0, 122, 204, 0.2);
  }
`;

const SubmitButton = styled.button`
  padding: 12px 24px;
  background: #fff;
  color: #333;
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 25px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  justify-self: start;

  &:hover {
    background: #f0f0f0;
    transform: translateY(-1px);
  }
`;

interface BookingFormPageProps {
  onBack?: () => void;
}

const BookingFormPage: React.FC<BookingFormPageProps> = ({ onBack }) => {
  const [formData, setFormData] = useState({
    eventName: '',
    eventId: '',
    email: '',
    time: '',
    fees: '',
    description: '',
    faculty: '',
    eventLocation: '',
    address1: '',
    address2: ''
  });

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      window.history.back();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Handle form submission here
  };

  return (
    <BookingContainer>
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

      <FormContainer>
        <BookingForm onSubmit={handleSubmit}>
          <FormGroup>
            <Label>Event Name</Label>
            <Input
              type="text"
              name="eventName"
              placeholder="Name"
              value={formData.eventName}
              onChange={handleInputChange}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label>Faculty</Label>
            <Input
              type="text"
              name="faculty"
              placeholder="Faculty"
              value={formData.faculty}
              onChange={handleInputChange}
            />
          </FormGroup>

          <FormGroup>
            <Label>Event ID</Label>
            <Input
              type="email"
              name="eventId"
              placeholder="Your email"
              value={formData.eventId}
              onChange={handleInputChange}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label>Event Location</Label>
            <Input
              type="text"
              name="eventLocation"
              placeholder="Location"
              value={formData.eventLocation}
              onChange={handleInputChange}
            />
          </FormGroup>

          <FormGroup>
            <Label>Email</Label>
            <Input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label>Address</Label>
            <Input
              type="text"
              name="address1"
              placeholder="Address 1"
              value={formData.address1}
              onChange={handleInputChange}
            />
          </FormGroup>

          <FormGroup>
            <Label>Time</Label>
            <Select
              name="time"
              value={formData.time}
              onChange={handleInputChange}
              required
            >
              <option value="">Available Time</option>
              <option value="9:00 AM">9:00 AM</option>
              <option value="10:00 AM">10:00 AM</option>
              <option value="11:00 AM">11:00 AM</option>
              <option value="12:00 PM">12:00 PM</option>
              <option value="1:00 PM">1:00 PM</option>
              <option value="2:00 PM">2:00 PM</option>
              <option value="3:00 PM">3:00 PM</option>
              <option value="4:00 PM">4:00 PM</option>
              <option value="5:00 PM">5:00 PM</option>
              <option value="6:00 PM">6:00 PM</option>
            </Select>
          </FormGroup>

          <FormGroup>
            <Input
              type="text"
              name="address2"
              placeholder="Address 2"
              value={formData.address2}
              onChange={handleInputChange}
            />
          </FormGroup>

          <FormGroup>
            <Label>Fees</Label>
            <Input
              type="text"
              name="fees"
              placeholder="Your fees"
              value={formData.fees}
              onChange={handleInputChange}
            />
          </FormGroup>

          <TextArea
            name="description"
            placeholder="Type Here"
            value={formData.description}
            onChange={handleInputChange}
          />

          <SubmitButton type="submit">
            Add doctor
          </SubmitButton>
        </BookingForm>
      </FormContainer>
    </BookingContainer>
  );
};

export default BookingFormPage;
