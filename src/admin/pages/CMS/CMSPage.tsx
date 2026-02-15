import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { apiClient } from '../../../services/apiClient';
import { API_ENDPOINTS } from '../../../config/api.config';

interface PageItem {
  id: number;
  slug: string;
  title: string;
  isPublished: boolean;
  updatedAt: string;
}

interface PageDetail {
  id: number;
  slug: string;
  title: string;
  content: string;
  metaDescription: string;
  isPublished: boolean;
  lastEditedBy: number | null;
  updatedAt: string;
}

const CMSPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  // ─── List view state ───
  const [pages, setPages] = useState<PageItem[]>([]);
  const [loadingList, setLoadingList] = useState(true);

  // ─── Editor view state ───
  const [page, setPage] = useState<PageDetail | null>(null);
  const [loadingPage, setLoadingPage] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [isPublished, setIsPublished] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  // ─── Fetch page list ───
  const fetchPages = useCallback(async () => {
    setLoadingList(true);
    try {
      const res = await apiClient.get(API_ENDPOINTS.ADMIN.CMS_PAGES);
      if (res.success) {
        setPages(res.data || []);
      }
    } catch (err) {
      console.error('Failed to fetch CMS pages:', err);
    } finally {
      setLoadingList(false);
    }
  }, []);

  // ─── Fetch single page ───
  const fetchPage = useCallback(async (s: string) => {
    setLoadingPage(true);
    try {
      const res = await apiClient.get(API_ENDPOINTS.ADMIN.CMS_PAGE(s));
      if (res.success && res.data) {
        const p = res.data;
        setPage(p);
        setTitle(p.title);
        setContent(p.content || '');
        setMetaDescription(p.metaDescription || '');
        setIsPublished(p.isPublished);
      }
    } catch (err) {
      console.error('Failed to fetch page:', err);
    } finally {
      setLoadingPage(false);
    }
  }, []);

  useEffect(() => {
    if (slug) {
      fetchPage(slug);
    } else {
      fetchPages();
    }
  }, [slug, fetchPage, fetchPages]);

  // ─── Save handler ───
  const handleSave = async () => {
    if (!slug) return;
    setSaving(true);
    setSaveMessage('');
    try {
      const res = await apiClient.put(API_ENDPOINTS.ADMIN.CMS_PAGE(slug), {
        title,
        content,
        metaDescription,
        isPublished,
      });
      if (res.success) {
        setSaveMessage('Saved successfully!');
        setTimeout(() => setSaveMessage(''), 3000);
      } else {
        setSaveMessage('Failed to save');
      }
    } catch (err) {
      setSaveMessage('Error saving page');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  // ─── List View ───
  if (!slug) {
    return (
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">CMS Pages</h1>
        </div>

        {loadingList ? (
          <div className="text-center py-12 text-gray-500">Loading pages...</div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-600 text-sm">Title</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-600 text-sm">Slug</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-600 text-sm">Status</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-600 text-sm">Last Updated</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-600 text-sm">Action</th>
                </tr>
              </thead>
              <tbody>
                {pages.map((p) => (
                  <tr key={p.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4 font-medium text-gray-800">{p.title}</td>
                    <td className="py-3 px-4 text-gray-500 text-sm font-mono">{p.slug}</td>
                    <td className="py-3 px-4 text-center">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        p.isPublished
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {p.isPublished ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-500">
                      {new Date(p.updatedAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => navigate(`/admin/cms/pages/${p.slug}`)}
                        className="py-1.5 px-4 bg-[#1a5c2e] text-white rounded-md text-sm font-medium hover:bg-[#2e7d32] transition-colors cursor-pointer"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
                {pages.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-gray-400">No pages found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Quick links */}
        <div className="mt-6 flex gap-3">
          <Link
            to="/admin/cms/success-stories"
            className="py-2 px-4 bg-[#ffd54f] text-[#1a5c2e] rounded-lg font-semibold hover:bg-[#ffca28] transition-colors"
          >
            Manage Success Stories
          </Link>
        </div>
      </div>
    );
  }

  // ─── Editor View ───
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/admin/cms')}
            className="py-2 px-3 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors cursor-pointer"
          >
            ← Back
          </button>
          <h1 className="text-2xl font-bold text-gray-800">
            {loadingPage ? 'Loading...' : `Edit: ${page?.title || slug}`}
          </h1>
        </div>
        <div className="flex items-center gap-3">
          {saveMessage && (
            <span className={`text-sm font-medium ${saveMessage.includes('success') ? 'text-green-600' : 'text-red-600'}`}>
              {saveMessage}
            </span>
          )}
          <button
            onClick={handleSave}
            disabled={saving}
            className="py-2 px-5 bg-[#1a5c2e] text-white rounded-lg font-semibold hover:bg-[#2e7d32] transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? 'Saving...' : '💾 Save'}
          </button>
        </div>
      </div>

      {loadingPage ? (
        <div className="text-center py-12 text-gray-500">Loading page content...</div>
      ) : (
        <div className="space-y-4">
          {/* Title */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Page Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full py-2.5 px-4 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a5c2e] focus:border-transparent"
              placeholder="Page title"
            />
          </div>

          {/* Meta Description */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Meta Description (SEO)</label>
            <input
              type="text"
              value={metaDescription}
              onChange={(e) => setMetaDescription(e.target.value)}
              className="w-full py-2.5 px-4 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a5c2e] focus:border-transparent"
              placeholder="Brief description for search engines"
              maxLength={500}
            />
            <p className="text-xs text-gray-400 mt-1">{metaDescription.length}/500 characters</p>
          </div>

          {/* Content Editor */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-semibold text-gray-700">Content (HTML)</label>
              <span className="text-xs text-gray-400">
                Supports HTML tags: &lt;h2&gt;, &lt;p&gt;, &lt;ul&gt;, &lt;ol&gt;, &lt;li&gt;, &lt;a&gt;, &lt;strong&gt;, etc.
              </span>
            </div>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full py-3 px-4 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a5c2e] focus:border-transparent resize-none font-mono"
              rows={20}
              placeholder="Enter HTML content..."
            />
          </div>

          {/* Publish Toggle */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 flex items-center justify-between">
            <div>
              <label className="text-sm font-semibold text-gray-700">Published</label>
              <p className="text-xs text-gray-400">When published, this page is visible to public visitors</p>
            </div>
            <button
              onClick={() => setIsPublished(!isPublished)}
              className={`relative w-12 h-6 rounded-full transition-colors cursor-pointer ${
                isPublished ? 'bg-[#1a5c2e]' : 'bg-gray-300'
              }`}
            >
              <span
                className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                  isPublished ? 'translate-x-6' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>

          {/* Preview */}
          {content && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
              <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                👁️ Live Preview
              </h3>
              <div
                className="prose max-w-none border border-gray-100 rounded-lg p-4 bg-gray-50"
                dangerouslySetInnerHTML={{ __html: content }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CMSPage;
