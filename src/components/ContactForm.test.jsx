import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import ContactForm from './ContactForm';

describe('ContactForm', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('renders the contact form with all fields', () => {
    render(<ContactForm />);
    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/mobile number/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/legal category/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/brief case facts/i)).toBeInTheDocument();
  });

  it('shows error when name is whitespace on submit', () => {
    render(<ContactForm />);
    const nameInput = screen.getByLabelText(/full name/i);
    const phoneInput = screen.getByLabelText(/mobile number/i);

    // Set name to whitespace (bypasses 'required' but fails trim check)
    fireEvent.change(nameInput, { target: { value: '   ' } });
    fireEvent.change(phoneInput, { target: { value: '9876543210' } });

    const form = document.querySelector('.actual-form');
    fireEvent.submit(form);

    expect(screen.getByText(/please enter your name/i)).toBeInTheDocument();
  });

  it('shows error for invalid phone number', () => {
    render(<ContactForm />);
    const nameInput = screen.getByLabelText(/full name/i);
    const phoneInput = screen.getByLabelText(/mobile number/i);

    fireEvent.change(nameInput, { target: { value: 'Test User' } });
    fireEvent.change(phoneInput, { target: { value: '12345' } });

    const form = document.querySelector('.actual-form');
    fireEvent.submit(form);

    expect(screen.getByText(/valid 10-digit Indian mobile number/i)).toBeInTheDocument();
  });

  it('shows error for phone starting with digit < 6', () => {
    render(<ContactForm />);
    const nameInput = screen.getByLabelText(/full name/i);
    const phoneInput = screen.getByLabelText(/mobile number/i);

    fireEvent.change(nameInput, { target: { value: 'Test User' } });
    fireEvent.change(phoneInput, { target: { value: '5123456789' } });

    const form = document.querySelector('.actual-form');
    fireEvent.submit(form);

    expect(screen.getByText(/valid 10-digit Indian mobile number/i)).toBeInTheDocument();
  });

  it('shows error when consent checkbox is not checked', () => {
    render(<ContactForm />);
    const nameInput = screen.getByLabelText(/full name/i);
    const phoneInput = screen.getByLabelText(/mobile number/i);

    fireEvent.change(nameInput, { target: { value: 'Test User' } });
    fireEvent.change(phoneInput, { target: { value: '9876543210' } });

    const form = document.querySelector('.actual-form');
    fireEvent.submit(form);

    expect(screen.getByText(/consent to the privacy disclaimer/i)).toBeInTheDocument();
  });

  it('submits successfully with valid data and consent', () => {
    render(<ContactForm />);
    const nameInput = screen.getByLabelText(/full name/i);
    const phoneInput = screen.getByLabelText(/mobile number/i);
    const consentCheckbox = screen.getByRole('checkbox');

    fireEvent.change(nameInput, { target: { value: 'Test User' } });
    fireEvent.change(phoneInput, { target: { value: '9876543210' } });
    fireEvent.click(consentCheckbox);

    const form = document.querySelector('.actual-form');
    fireEvent.submit(form);

    expect(screen.getByText(/thank you/i)).toBeInTheDocument();
  });

  it('saves inquiry to localStorage on successful submit', () => {
    render(<ContactForm />);
    const nameInput = screen.getByLabelText(/full name/i);
    const phoneInput = screen.getByLabelText(/mobile number/i);
    const consentCheckbox = screen.getByRole('checkbox');

    fireEvent.change(nameInput, { target: { value: 'Ravi Kumar' } });
    fireEvent.change(phoneInput, { target: { value: '8765432109' } });
    fireEvent.click(consentCheckbox);

    const form = document.querySelector('.actual-form');
    fireEvent.submit(form);

    const stored = JSON.parse(localStorage.getItem('advocate_inquiries'));
    expect(stored).toHaveLength(1);
    expect(stored[0].name).toBe('Ravi Kumar');
    expect(stored[0].phone).toBe('8765432109');
    expect(stored[0].status).toBe('unread');
  });

  it('dispatches inquiry_submitted event on successful submit', () => {
    render(<ContactForm />);
    const nameInput = screen.getByLabelText(/full name/i);
    const phoneInput = screen.getByLabelText(/mobile number/i);
    const consentCheckbox = screen.getByRole('checkbox');

    fireEvent.change(nameInput, { target: { value: 'Test User' } });
    fireEvent.change(phoneInput, { target: { value: '9876543210' } });
    fireEvent.click(consentCheckbox);

    const form = document.querySelector('.actual-form');
    fireEvent.submit(form);

    expect(window.dispatchEvent).toHaveBeenCalled();
  });

  it('accepts valid phone numbers starting with 6, 7, 8, 9', () => {
    const validPhones = ['6123456789', '7123456789', '8123456789', '9123456789'];

    validPhones.forEach((phone) => {
      localStorage.clear();
      const { unmount } = render(<ContactForm />);
      const nameInput = screen.getByLabelText(/full name/i);
      const phoneInput = screen.getByLabelText(/mobile number/i);
      const consentCheckbox = screen.getByRole('checkbox');

      fireEvent.change(nameInput, { target: { value: 'User' } });
      fireEvent.change(phoneInput, { target: { value: phone } });
      fireEvent.click(consentCheckbox);

      const form = document.querySelector('.actual-form');
      fireEvent.submit(form);

      expect(screen.getByText(/thank you/i)).toBeInTheDocument();
      unmount();
    });
  });
});
