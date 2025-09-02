'use client';

import Providers from '@/components/Providers';
import MainLayout from '@/components/MainLayout';
import LengthConverter from '@/components/LengthConverter';

export default function LengthPage() {
  return (
    <Providers>
      <MainLayout>
        <LengthConverter />
      </MainLayout>
    </Providers>
  );
}
