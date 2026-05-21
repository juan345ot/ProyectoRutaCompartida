/**
 * Tests de SearchPostCard: datos del viaje y enlace al itinerario.
 */
import { render, screen } from '@testing-library/react';
import SearchPostCard from '../components/SearchPostCard';
import '@testing-library/jest-dom';

jest.mock('next/link', () => {
  function MockLink({ children, href }) {
    return <a href={href}>{children}</a>;
  }
  MockLink.displayName = 'MockLink';
  return MockLink;
});

jest.mock('next/image', () => {
  function MockImage(props) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img alt={props.alt} />;
  }
  MockImage.displayName = 'MockImage';
  return MockImage;
});

const mockPost = {
  _id: 'abc123',
  type: 'offer',
  status: 'active',
  origin: 'Rosario',
  destination: 'Córdoba',
  departureDate: new Date(Date.now() + 86400000).toISOString(),
  capacity: '2 lugares',
  category: 'passenger',
  seats: 2,
  description: 'Viaje cómodo',
  author: { name: 'María', profileImage: '' },
};

describe('SearchPostCard', () => {
  it('muestra origen y destino', () => {
    render(<SearchPostCard post={mockPost} />);
    expect(screen.getByText(/Rosario/i)).toBeInTheDocument();
    expect(screen.getByText(/Córdoba/i)).toBeInTheDocument();
  });

  it('enlaza al itinerario con Ver detalles', () => {
    render(<SearchPostCard post={mockPost} />);
    const link = screen.getByText(/ver detalles/i).closest('a');
    expect(link).toHaveAttribute('href', '/travel/abc123');
  });
});
