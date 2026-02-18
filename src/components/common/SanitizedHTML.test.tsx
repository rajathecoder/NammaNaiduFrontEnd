import { render, screen } from '@testing-library/react';
import { SanitizedHTML } from './SanitizedHTML';
import { describe, it, expect } from 'vitest';

describe('SanitizedHTML', () => {
  it('renders clean HTML correctly', () => {
    const html = '<p>Hello world</p>';
    render(<SanitizedHTML html={html} />);
    expect(screen.getByText('Hello world')).toBeInTheDocument();
  });

  it('removes script tags (XSS check)', () => {
    const html = '<p>Safe</p><script>alert("XSS")</script>';
    const { container } = render(<SanitizedHTML html={html} />);
    expect(screen.getByText('Safe')).toBeInTheDocument();
    // The script tag should be removed by DOMPurify
    expect(container.querySelector('script')).not.toBeInTheDocument();
  });

  it('allows class attributes', () => {
    // We configured DOMPurify to allow 'class' attribute
    const html = '<div class="test-class">Styled</div>';
    const { container } = render(<SanitizedHTML html={html} />);
    const div = container.querySelector('.test-class');
    expect(div).toBeInTheDocument();
    expect(div).toHaveClass('test-class');
  });

  it('allows target attributes on links', () => {
    // We configured DOMPurify to allow 'target' attribute
    const html = '<a href="https://example.com" target="_blank">Link</a>';
    const { container } = render(<SanitizedHTML html={html} />);
    const link = container.querySelector('a');
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('target', '_blank');
  });
});
