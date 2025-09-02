'use client';

import Providers from '@/components/Providers';
import MainLayout from '@/components/MainLayout';
import CurrencyConverter from '@/components/CurrencyConverter';

export default function CurrencyPage() {
  return (
    <Providers>
      <MainLayout>
        <CurrencyConverter />
      </MainLayout>
    </Providers>
  );
}
