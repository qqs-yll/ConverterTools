'use client';

import Providers from '@/components/Providers';
import MainLayout from '@/components/MainLayout';
import PngToJpgConverter from '@/components/PngToJpgConverter';

export default function PngToJpgPage() {
  return (
    <Providers>
      <MainLayout>
        <PngToJpgConverter />
      </MainLayout>
    </Providers>
  );
}
