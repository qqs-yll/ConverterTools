'use client';

import Providers from '@/components/Providers';
import MainLayout from '@/components/MainLayout';
import Mp4ToMp3Converter from '@/components/Mp4ToMp3Converter';

export default function Mp4ToMp3Page() {
  return (
    <Providers>
      <MainLayout>
        <Mp4ToMp3Converter />
      </MainLayout>
    </Providers>
  );
}
