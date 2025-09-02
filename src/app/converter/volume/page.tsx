'use client';

import Providers from '@/components/Providers';
import MainLayout from '@/components/MainLayout';
import VolumeConverter from '@/components/VolumeConverter';

export default function VolumePage() {
  return (
    <Providers>
      <MainLayout>
        <VolumeConverter />
      </MainLayout>
    </Providers>
  );
}
