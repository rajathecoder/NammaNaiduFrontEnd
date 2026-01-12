import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

const CMSPage: React.FC = () => {
  const { type } = useParams<{ type: string }>();
  const [content, setContent] = useState('');
  const [saving, setSaving] = useState(false);

  const cmsTypes: Record<string, { title: string; placeholder: string }> = {
    banners: { title: 'Manage Banners', placeholder: 'Upload and manage homepage slider images...' },
    'about-us': { title: 'About Us', placeholder: 'Enter about us content...' },
    'terms-conditions': { title: 'Terms & Conditions', placeholder: 'Enter terms and conditions...' },
    'privacy-policy': { title: 'Privacy Policy', placeholder: 'Enter privacy policy...' },
    faq: { title: 'FAQ', placeholder: 'Enter frequently asked questions...' },
    blog: { title: 'Blog Management', placeholder: 'Manage blog posts...' },
  };

  const config = cmsTypes[type || 'banners'] || cmsTypes.banners;

  const handleSave = async () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      alert('Content saved successfully!');
    }, 1000);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">{config.title}</h1>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 py-2 px-4 bg-[#14b8a6] text-white rounded-lg font-semibold cursor-pointer transition-colors duration-200 hover:bg-[#0d9488] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? 'Saving...' : '💾 Save'}
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        {type === 'banners' ? (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Upload New Banner</h2>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center cursor-pointer transition-colors duration-200 hover:border-[#14b8a6] hover:bg-[#14b8a6]/5">
                <div className="text-5xl mb-4">📷</div>
                <p className="text-gray-600 mb-2">Click to upload or drag and drop</p>
                <p className="text-sm text-gray-500">PNG, JPG, GIF up to 10MB</p>
                <input type="file" accept="image/*" multiple className="hidden" />
              </div>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Existing Banners</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow duration-200">
                    <div className="h-40 bg-gray-100 flex items-center justify-center text-4xl text-gray-400">
                      Banner {i}
                    </div>
                    <div className="p-4 flex gap-2">
                      <button className="flex-1 py-2 px-3 border border-gray-300 bg-white text-gray-700 rounded-lg text-sm font-medium cursor-pointer transition-colors duration-200 hover:bg-gray-50">
                        Edit
                      </button>
                      <button className="flex-1 py-2 px-3 border border-red-300 bg-white text-red-600 rounded-lg text-sm font-medium cursor-pointer transition-colors duration-200 hover:bg-red-50">
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div>
            <textarea
              className="w-full py-3 px-4 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#14b8a6] focus:border-transparent resize-none font-mono"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={config.placeholder}
              rows={20}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default CMSPage;
