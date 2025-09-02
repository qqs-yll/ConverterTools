'use client';

import Providers from '@/components/Providers';
import MainLayout from '@/components/MainLayout';
import Home from '@/components/Home';

export default function HomePage() {
  return (
    <Providers>
      <MainLayout>
        <Home />
      </MainLayout>
    </Providers>
  );
}
