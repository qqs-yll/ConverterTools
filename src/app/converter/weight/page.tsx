'use client';

import Providers from '@/components/Providers';
import MainLayout from '@/components/MainLayout';
import WeightConverter from '@/components/WeightConverter';

export default function WeightPage() {
  return (
    <Providers>
      <MainLayout>
        <WeightConverter />
      </MainLayout>
    </Providers>
  );
}
