import React from 'react';

export const BarcodeContext = React.createContext({
  format: 'barcode',
  setFormat: () => {},
});