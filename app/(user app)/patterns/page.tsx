import React from 'react';
import PatternGallery from '../_components/ui/PatternGallery';

export default function Page() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-semibold mb-6">Patterns</h1>
      <PatternGallery />
    </div>
  );
}
