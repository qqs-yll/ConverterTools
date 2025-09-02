'use client';

import Providers from '@/components/Providers';
import MainLayout from '@/components/MainLayout';
import TimezoneConverter from '@/components/TimezoneConverter';

export default function TimezonePage() {
  return (
    <Providers>
      <MainLayout>
        <TimezoneConverter />
      </MainLayout>
    </Providers>
  );
}
