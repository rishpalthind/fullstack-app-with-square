import { render, screen, fireEvent } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import LocationSelector from '@/components/LocationSelector';
import { Location } from '@/types';

// Mock API service
jest.mock('@/services/api', () => ({
  ApiService: {
    getLocations: jest.fn(),
  },
}));

// Mock storage service
jest.mock('@/utils/storage', () => ({
  StorageService: {
    getSelectedLocationId: jest.fn(),
    setSelectedLocationId: jest.fn(),
  },
}));

const mockLocations: Location[] = [
  {
    id: '1',
    name: 'Downtown Location',
    address: '123 Main St, City, ST 12345',
    timezone: 'America/New_York',
    status: 'ACTIVE',
  },
  {
    id: '2',
    name: 'Mall Location',
    address: '456 Mall Blvd, City, ST 12345',
    timezone: 'America/New_York',
    status: 'ACTIVE',
  },
];

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

describe('LocationSelector', () => {
  const mockOnLocationChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state initially', () => {
    const { ApiService } = require('@/services/api');
    ApiService.getLocations.mockReturnValue(new Promise(() => {})); // Never resolves

    render(
      <LocationSelector
        selectedLocationId={null}
        onLocationChange={mockOnLocationChange}
      />,
      { wrapper: createWrapper() }
    );

    expect(screen.getByText('Loading locations...')).toBeInTheDocument();
  });

  it('renders locations when loaded', async () => {
    const { ApiService } = require('@/services/api');
    ApiService.getLocations.mockResolvedValue(mockLocations);

    render(
      <LocationSelector
        selectedLocationId={null}
        onLocationChange={mockOnLocationChange}
      />,
      { wrapper: createWrapper() }
    );

    await screen.findByDisplayValue('');
    expect(screen.getByDisplayValue('')).toBeInTheDocument();
  });

  it('calls onLocationChange when location is selected', async () => {
    const { ApiService } = require('@/services/api');
    ApiService.getLocations.mockResolvedValue(mockLocations);

    render(
      <LocationSelector
        selectedLocationId={null}
        onLocationChange={mockOnLocationChange}
      />,
      { wrapper: createWrapper() }
    );

    const select = await screen.findByRole('combobox');
    fireEvent.change(select, { target: { value: '1' } });

    expect(mockOnLocationChange).toHaveBeenCalledWith('1');
  });

  it('displays selected location details', async () => {
    const { ApiService } = require('@/services/api');
    ApiService.getLocations.mockResolvedValue(mockLocations);

    render(
      <LocationSelector
        selectedLocationId="1"
        onLocationChange={mockOnLocationChange}
      />,
      { wrapper: createWrapper() }
    );

    await screen.findByText('Downtown Location');
    expect(screen.getByText('Downtown Location')).toBeInTheDocument();
    expect(screen.getByText('123 Main St, City, ST 12345')).toBeInTheDocument();
  });
});