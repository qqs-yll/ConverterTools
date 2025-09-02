'use client';

import Providers from '@/components/Providers';
import MainLayout from '@/components/MainLayout';
import ImageToPdfConverter from '@/components/ImageToPdfConverter';

export default function ImageToPdfPage() {
  return (
    <Providers>
      <MainLayout>
        <ImageToPdfConverter />
      </MainLayout>
    </Providers>
  );
}
