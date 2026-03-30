import { render, screen } from '@testing-library/react';
import PostCard from '../components/PostCard';
import '@testing-library/jest-dom';

const mockPost = {
  _id: '1',
  type: 'offer',
  origin: 'Buenos Aires',
  destination: 'Mar del Plata',
  departureDate: new Date().toISOString(),
  capacity: 3,
  category: 'passenger',
  description: 'Viaje tranquilo',
  author: {
    name: 'Juan',
    profileImage: ''
  }
};

describe('PostCard Component', () => {
  it('renders origin and destination correctly', () => {
    render(<PostCard post={mockPost} />);
    expect(screen.getByText(/Buenos Aires/i)).toBeInTheDocument();
    expect(screen.getByText(/Mar del Plata/i)).toBeInTheDocument();
  });

  it('displays the correct category badge', () => {
    render(<PostCard post={mockPost} />);
    expect(screen.getByText(/Pasajero/i)).toBeInTheDocument();
  });
});
