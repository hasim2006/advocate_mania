import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import Dashboard from './Dashboard';

/** Authenticate by entering the default PIN through the lock screen. */
function authenticate() {
  const pinInput = screen.getByPlaceholderText(/enter pin/i);
  fireEvent.change(pinInput, { target: { value: '1234' } });
  fireEvent.submit(pinInput.closest('form'));
}

describe('Dashboard', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    vi.clearAllMocks();
  });

  it('shows the auth gate before PIN entry', () => {
    render(<Dashboard />);
    expect(screen.getByText(/dashboard access/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/enter pin/i)).toBeInTheDocument();
  });

  it('rejects an incorrect PIN', () => {
    render(<Dashboard />);
    const pinInput = screen.getByPlaceholderText(/enter pin/i);
    fireEvent.change(pinInput, { target: { value: '0000' } });
    fireEvent.submit(pinInput.closest('form'));
    expect(screen.getByText(/incorrect pin/i)).toBeInTheDocument();
  });

  it('renders dashboard with metric cards after authentication', () => {
    render(<Dashboard />);
    authenticate();
    expect(screen.getByText(/website queries/i)).toBeInTheDocument();
    expect(screen.getByText(/active litigation cases/i)).toBeInTheDocument();
    expect(screen.getByText(/resolved settlements/i)).toBeInTheDocument();
    expect(screen.getByText(/upcoming hearings/i)).toBeInTheDocument();
  });

  it('loads default seed inquiries when localStorage is empty', () => {
    render(<Dashboard />);
    authenticate();
    expect(screen.getByText('Ravi Prakash Tiwari')).toBeInTheDocument();
    expect(screen.getByText('Priyanka Pandey')).toBeInTheDocument();
    expect(screen.getByText('Manoj Kumar Gupta')).toBeInTheDocument();
  });

  it('displays correct total inquiries count from seed data', () => {
    render(<Dashboard />);
    authenticate();
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('toggles inquiry status between unread and resolved', () => {
    render(<Dashboard />);
    authenticate();
    const markResolvedButtons = screen.getAllByRole('button', { name: /mark resolved/i });
    expect(markResolvedButtons.length).toBeGreaterThan(0);
    fireEvent.click(markResolvedButtons[0]);

    const stored = JSON.parse(localStorage.getItem('advocate_inquiries'));
    const ravi = stored.find(inq => inq.id === 'seed-1');
    expect(ravi.status).toBe('resolved');
  });

  it('deletes an inquiry', () => {
    render(<Dashboard />);
    authenticate();
    const deleteButtons = screen.getAllByLabelText(/delete inquiry/i);
    const initialCount = deleteButtons.length;
    fireEvent.click(deleteButtons[0]);

    const stored = JSON.parse(localStorage.getItem('advocate_inquiries'));
    expect(stored.length).toBe(initialCount - 1);
  });

  it('switches to calendar tab and shows hearing data', () => {
    render(<Dashboard />);
    authenticate();
    const calendarTab = screen.getByRole('button', { name: /hearing calendar/i });
    fireEvent.click(calendarTab);
    expect(screen.getByText(/State of U.P. vs. Ramesh Yadav/i)).toBeInTheDocument();
  });

  it('displays upcoming hearings in calendar tab', () => {
    render(<Dashboard />);
    authenticate();
    const calendarTab = screen.getByRole('button', { name: /hearing calendar/i });
    fireEvent.click(calendarTab);
    expect(screen.getByText(/State of U.P. vs. Ramesh Yadav/i)).toBeInTheDocument();
    expect(screen.getByText(/Karan Singh vs. Verma Traders/i)).toBeInTheDocument();
  });

  it('displays analytics data in analytics tab', () => {
    render(<Dashboard />);
    authenticate();
    const analyticsTab = screen.getByRole('button', { name: /case category analytics/i });
    fireEvent.click(analyticsTab);
    expect(screen.getByText(/Criminal Defense/)).toBeInTheDocument();
    expect(screen.getByText(/138 NI Act/)).toBeInTheDocument();
  });

  it('loads inquiries from localStorage if present', () => {
    const customInquiries = [
      {
        id: 'custom-1',
        name: 'Custom User',
        phone: '9999999999',
        email: 'custom@test.com',
        subject: 'Test Subject',
        message: 'Test message',
        date: '01 Jan 2026, 10:00 AM',
        status: 'unread'
      }
    ];
    localStorage.setItem('advocate_inquiries', JSON.stringify(customInquiries));
    render(<Dashboard />);
    authenticate();
    expect(screen.getByText('Custom User')).toBeInTheDocument();
  });

  it('updates metrics count after deleting an inquiry', () => {
    render(<Dashboard />);
    authenticate();
    const deleteButtons = screen.getAllByLabelText(/delete inquiry/i);
    fireEvent.click(deleteButtons[0]);

    const stored = JSON.parse(localStorage.getItem('advocate_inquiries'));
    expect(stored.length).toBe(2);
  });
});
