import React from 'react';
import { render, screen } from '@testing-library/react';
import Greeting from '@/components/greeting';

describe('Greeting', () => {
  it('renders a greeting with the provided name', () => {
    render(<Greeting name="World" />);

    const heading = screen.getByRole('heading', {
      name: /hello, world!/i,
    });

    expect(heading).toBeInTheDocument();
  });
});
