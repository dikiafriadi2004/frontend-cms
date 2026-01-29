'use client';

import GoogleAnalytics from './GoogleAnalytics';
import FacebookPixel from './FacebookPixel';
import Hotjar from './Hotjar';

const Analytics = () => {
  return (
    <>
      <GoogleAnalytics />
      <FacebookPixel />
      <Hotjar />
    </>
  );
};

export default Analytics;