import dynamic from 'next/dynamic';

const ConfirmLandlordPage = dynamic(
  () => import('@/components/campaign/ConfirmLandlordPage'),
  { ssr: false }
);

export default function ConfirmLandlord() {
  return <ConfirmLandlordPage />;
}
