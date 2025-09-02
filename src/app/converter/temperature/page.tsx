'use client';

import Providers from '@/components/Providers';
import MainLayout from '@/components/MainLayout';
import TemperatureConverter from '@/components/TemperatureConverter';

export default function TemperaturePage() {
  return (
    <Providers>
      <MainLayout>
        <TemperatureConverter />
      </MainLayout>
    </Providers>
  );
}
