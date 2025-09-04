import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { RenMascot } from '@/components/ai/ren-mascot';

describe('RenMascot', () => {
  it('renders the mascot with correct text', () => {
    render(<RenMascot />);
    
    // Check if the mascot is rendered
    const mascot = screen.getByText('REN');
    expect(mascot).toBeInTheDocument();
  });

  it('calls onChatOpen when clicked', () => {
    const mockOnChatOpen = jest.fn();
    render(<RenMascot onChatOpen={mockOnChatOpen} />);
    
    const mascot = screen.getByText('REN');
    fireEvent.click(mascot);
    
    expect(mockOnChatOpen).toHaveBeenCalledTimes(1);
  });

  it('renders with different sizes', () => {
    const { container: smContainer } = render(<RenMascot size="sm" />);
    const { container: mdContainer } = render(<RenMascot size="md" />);
    const { container: lgContainer } = render(<RenMascot size="lg" />);
    
    // All should render without errors
    expect(smContainer).toBeInTheDocument();
    expect(mdContainer).toBeInTheDocument();
    expect(lgContainer).toBeInTheDocument();
  });

  it('renders in different positions', () => {
    const { container: brContainer } = render(<RenMascot position="bottom-right" />);
    const { container: blContainer } = render(<RenMascot position="bottom-left" />);
    const { container: trContainer } = render(<RenMascot position="top-right" />);
    const { container: tlContainer } = render(<RenMascot position="top-left" />);
    
    // All should render without errors
    expect(brContainer).toBeInTheDocument();
    expect(blContainer).toBeInTheDocument();
    expect(trContainer).toBeInTheDocument();
    expect(tlContainer).toBeInTheDocument();
  });
});