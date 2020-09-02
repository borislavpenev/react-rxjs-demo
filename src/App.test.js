import React from 'react';
import { render } from '@testing-library/react';
import App from './App';
import '@testing-library/jest-dom/extend-expect';

test('render 3 monitoring systems', () => {
  const { getByText } = render(<App />);

  const temperature = getByText(/Temperature/i);
  const airPressure = getByText(/Air Pressure/i);
  const humidity = getByText(/Humidity/i);

  expect(airPressure).toBeInTheDocument();
  expect(temperature).toBeInTheDocument();
  expect(humidity).toBeInTheDocument();
});