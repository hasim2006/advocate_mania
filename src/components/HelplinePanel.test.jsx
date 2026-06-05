import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import HelplinePanel from './HelplinePanel';

describe('HelplinePanel', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders the helpline floating button', () => {
    render(<HelplinePanel />);
    const openButton = screen.getByLabelText(/open legal helpline/i);
    expect(openButton).toBeInTheDocument();
  });

  it('opens the panel when floating button is clicked', () => {
    render(<HelplinePanel />);
    const openButton = screen.getByLabelText(/open legal helpline/i);
    fireEvent.click(openButton);
    expect(screen.getByText(/request callback/i)).toBeInTheDocument();
  });

  it('shows call and chat tabs when panel is open', () => {
    render(<HelplinePanel />);
    const openButton = screen.getByLabelText(/open legal helpline/i);
    fireEvent.click(openButton);
    expect(screen.getByRole('button', { name: /request callback/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /virtual assistant/i })).toBeInTheDocument();
  });

  it('submits callback form with valid name and phone', () => {
    render(<HelplinePanel />);
    const openButton = screen.getByLabelText(/open legal helpline/i);
    fireEvent.click(openButton);

    const nameInput = screen.getByPlaceholderText(/your name/i);
    const phoneInput = screen.getByPlaceholderText(/10-digit mobile/i);

    fireEvent.change(nameInput, { target: { value: 'Test User' } });
    fireEvent.change(phoneInput, { target: { value: '9876543210' } });

    const form = document.querySelector('.callback-form');
    fireEvent.submit(form);

    const stored = JSON.parse(localStorage.getItem('advocate_inquiries'));
    expect(stored).toHaveLength(1);
    expect(stored[0].name).toBe('Test User');
  });

  it('shows error when callback form submitted with empty name', () => {
    render(<HelplinePanel />);
    const openButton = screen.getByLabelText(/open legal helpline/i);
    fireEvent.click(openButton);

    const phoneInput = screen.getByPlaceholderText(/10-digit mobile/i);
    fireEvent.change(phoneInput, { target: { value: '9876543210' } });

    const form = document.querySelector('.callback-form');
    fireEvent.submit(form);

    expect(screen.getByText(/please fill in your name and phone/i)).toBeInTheDocument();
    const stored = localStorage.getItem('advocate_inquiries');
    expect(stored).toBeNull();
  });

  it('shows error for invalid phone in callback form', () => {
    render(<HelplinePanel />);
    const openButton = screen.getByLabelText(/open legal helpline/i);
    fireEvent.click(openButton);

    const nameInput = screen.getByPlaceholderText(/your name/i);
    const phoneInput = screen.getByPlaceholderText(/10-digit mobile/i);

    fireEvent.change(nameInput, { target: { value: 'Test User' } });
    fireEvent.change(phoneInput, { target: { value: '12345' } });

    const form = document.querySelector('.callback-form');
    fireEvent.submit(form);

    expect(screen.getByText(/valid 10-digit Indian mobile number/i)).toBeInTheDocument();
    const stored = localStorage.getItem('advocate_inquiries');
    expect(stored).toBeNull();
  });

  it('dispatches inquiry_submitted event on callback submit', () => {
    render(<HelplinePanel />);
    const openButton = screen.getByLabelText(/open legal helpline/i);
    fireEvent.click(openButton);

    const nameInput = screen.getByPlaceholderText(/your name/i);
    const phoneInput = screen.getByPlaceholderText(/10-digit mobile/i);

    fireEvent.change(nameInput, { target: { value: 'Event User' } });
    fireEvent.change(phoneInput, { target: { value: '8765432109' } });

    const form = document.querySelector('.callback-form');
    fireEvent.submit(form);

    expect(window.dispatchEvent).toHaveBeenCalled();
  });

  it('switches to chat tab and shows welcome message', () => {
    render(<HelplinePanel />);
    const openButton = screen.getByLabelText(/open legal helpline/i);
    fireEvent.click(openButton);

    const chatTab = screen.getByRole('button', { name: /virtual assistant/i });
    fireEvent.click(chatTab);

    expect(screen.getByText(/namaste/i)).toBeInTheDocument();
  });

  it('sends a message in the chatbot and receives a response', () => {
    render(<HelplinePanel />);
    const openButton = screen.getByLabelText(/open legal helpline/i);
    fireEvent.click(openButton);

    const chatTab = screen.getByRole('button', { name: /virtual assistant/i });
    fireEvent.click(chatTab);

    const chatInput = screen.getByPlaceholderText(/ask a legal query/i);
    fireEvent.change(chatInput, { target: { value: 'Tell me about bail' } });

    const sendBtn = screen.getByLabelText(/send message/i);
    fireEvent.click(sendBtn);

    expect(screen.getByText(/tell me about bail/i)).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(1500);
    });

    expect(screen.getByText(/criminal defense/i)).toBeInTheDocument();
  });

  it('chatbot responds to article queries', () => {
    render(<HelplinePanel />);
    const openButton = screen.getByLabelText(/open legal helpline/i);
    fireEvent.click(openButton);

    const chatTab = screen.getByRole('button', { name: /virtual assistant/i });
    fireEvent.click(chatTab);

    const chatInput = screen.getByPlaceholderText(/ask a legal query/i);
    fireEvent.change(chatInput, { target: { value: 'article 21' } });

    const sendBtn = screen.getByLabelText(/send message/i);
    fireEvent.click(sendBtn);

    act(() => {
      vi.advanceTimersByTime(1500);
    });

    expect(screen.getByText(/Protection of Life and Personal Liberty/i)).toBeInTheDocument();
  });

  it('closes the panel when button is clicked again', () => {
    render(<HelplinePanel />);
    const fabButton = screen.getByLabelText(/open legal helpline/i);
    fireEvent.click(fabButton);

    // Panel should be open now
    expect(screen.getByText(/request callback/i)).toBeInTheDocument();

    // Click again to close
    fireEvent.click(fabButton);

    // The panel should have the closed class (not visible)
    const panel = document.querySelector('.helpline-panel');
    expect(panel).not.toHaveClass('open');
  });
});
