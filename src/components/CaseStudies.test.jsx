import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import CaseStudies from './CaseStudies';

describe('CaseStudies', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders the case flow section', () => {
    render(<CaseStudies />);
    expect(screen.getByText(/how litigation works in india/i)).toBeInTheDocument();
  });

  it('shows the first step as active by default', () => {
    render(<CaseStudies />);
    expect(screen.getByText(/1\. Filing & Admission/i)).toBeInTheDocument();
    expect(screen.getByText(/days 1–15/i)).toBeInTheDocument();
  });

  it('navigates to the next step when next button is clicked', () => {
    render(<CaseStudies />);
    const nextBtn = screen.getByRole('button', { name: /next/i });
    fireEvent.click(nextBtn);
    expect(screen.getByText(/2\. Summons & Notices/i)).toBeInTheDocument();
  });

  it('navigates to the previous step via step indicator', () => {
    render(<CaseStudies />);
    // Go to step 2
    const nextBtn = screen.getByRole('button', { name: /next/i });
    fireEvent.click(nextBtn);
    // Use step indicator to go back to step 1
    const step1 = screen.getByLabelText(/go to step 1/i);
    fireEvent.click(step1);
    expect(screen.getByText(/1\. Filing & Admission/i)).toBeInTheDocument();
  });

  it('navigates through all steps using step indicators', () => {
    render(<CaseStudies />);
    const step5 = screen.getByLabelText(/go to step 5/i);
    fireEvent.click(step5);
    expect(screen.getByText(/5\. Judgment & Execution/i)).toBeInTheDocument();
  });

  it('previous button is disabled on first step', () => {
    render(<CaseStudies />);
    const prevBtn = screen.getByRole('button', { name: /previous/i });
    expect(prevBtn).toBeDisabled();
  });

  it('next button is disabled on last step', () => {
    render(<CaseStudies />);
    const step5 = screen.getByLabelText(/go to step 5/i);
    fireEvent.click(step5);
    const nextBtn = screen.getByRole('button', { name: /next/i });
    expect(nextBtn).toBeDisabled();
  });

  it('starts autoplay when play button is clicked', () => {
    render(<CaseStudies />);
    const playBtn = screen.getByRole('button', { name: /auto play flow/i });
    fireEvent.click(playBtn);

    act(() => {
      vi.advanceTimersByTime(3000);
    });

    expect(screen.getByText(/2\. Summons & Notices/i)).toBeInTheDocument();
  });

  it('stops autoplay when stop button is clicked', () => {
    render(<CaseStudies />);
    const playBtn = screen.getByRole('button', { name: /auto play flow/i });
    fireEvent.click(playBtn);

    act(() => {
      vi.advanceTimersByTime(3000);
    });

    // Now we should see Stop Presentation
    const stopBtn = screen.getByRole('button', { name: /stop presentation/i });
    fireEvent.click(stopBtn);

    act(() => {
      vi.advanceTimersByTime(6000);
    });

    // Should still be on step 2 since autoplay was stopped
    expect(screen.getByText(/2\. Summons & Notices/i)).toBeInTheDocument();
  });

  it('renders fictional case study cards', () => {
    render(<CaseStudies />);
    expect(screen.getByText(/Successful Acquittal in Sessions Trial/i)).toBeInTheDocument();
    expect(screen.getByText(/Speedy Recovery in 138 NI Act Dispute/i)).toBeInTheDocument();
    expect(screen.getByText(/Partition Suit & Permanent Injunction Resolution/i)).toBeInTheDocument();
  });

  it('displays case outcome information', () => {
    render(<CaseStudies />);
    expect(screen.getByText(/Full Acquittal & Honor Restored/i)).toBeInTheDocument();
    expect(screen.getByText(/Full Settlement & ₹18L Recovery/i)).toBeInTheDocument();
    expect(screen.getByText(/Property Division Secured/i)).toBeInTheDocument();
  });

  it('clicking a step indicator directly navigates to that step', () => {
    render(<CaseStudies />);
    const step3 = screen.getByLabelText(/go to step 3/i);
    fireEvent.click(step3);
    expect(screen.getByText(/3\. Evidence & Examination/i)).toBeInTheDocument();
  });
});
