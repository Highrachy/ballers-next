import React from 'react';
import Home from 'pages/ball-vips';
import axios from 'axios';
import { API_ENDPOINT } from '@/utils/URL';
import SeoHead from '@/components/utils/SeoHead';

const Vendor = ({ result }) => {
  return (
    <>
      <SeoHead
        title="Sell Your Property with BALL | Fast, Secure and Vetted Buyers"
        description="List your property with BALL and connect instantly with verified buyers ready to close. Sell faster, avoid scams and enjoy secure transactions with full support."
        canonical="https://www.ballers.ng/sell-your-property"
        ogImage="https://www.ballers.ng/img/pages/ball-refer.png"
        keywords={[
          'sell your property',
          'sell house in Lagos',
          'sell land in Lagos',
          'property vendors Nigeria',
          'sell real estate fast Nigeria',
          'ball sellers portal',
          'verified property buyers Lagos',
        ]}
      />
      <Home hideSEO result={result} />;
    </>
  );
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
