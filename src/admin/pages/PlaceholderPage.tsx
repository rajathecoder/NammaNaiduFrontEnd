import React from 'react';

interface PlaceholderPageProps {
  title: string;
}

const PlaceholderPage: React.FC<PlaceholderPageProps> = ({ title }) => {
  return (
    <div className="p-10 text-center">
      <h1 className="text-gray-800 mb-4 text-2xl font-bold">{title}</h1>
      <p className="text-gray-500">This page is under development</p>
    </div>
  );
};

export default PlaceholderPage;


