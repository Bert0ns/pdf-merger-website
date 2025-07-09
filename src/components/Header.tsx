'use client';

import React from 'react';
import { Merge } from 'lucide-react';

export const Header = () => {
  return (
    <div className="text-center mb-12">
      <div className="flex items-center justify-center mb-6">
        <div className="bg-blue-600 rounded-full p-3 mr-4">
          <Merge className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-slate-800">PDF Merger</h1>
      </div>
      <p className="text-slate-600 text-lg max-w-2xl mx-auto">
        Upload up to 50 PDF files, arrange them in your desired order, and merge them into a single document.
      </p>
    </div>
  );
};