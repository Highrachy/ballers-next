import React from 'react';
import Home from 'pages/ball-vips';
import axios from 'axios';
import { API_ENDPOINT } from '@/utils/URL';

const Vendor = ({ result }) => {
  return <Home result={result} />;
};

export default Vendor;

export async function getStaticProps() {
  const vendors = await axios.get(API_ENDPOINT.getAllVendors());

  return {
    props: {
      result: vendors?.data?.result?.slice(0, 8) || [],
    },
    revalidate: 10,
  };
}
