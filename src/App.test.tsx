import React from 'react';
import { render, screen } from '@testing-library/react';
import Analytics from "./App";

test('renders learn react link', () => {
  // @ts-ignore
  render(<Analytics context={{}} />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
