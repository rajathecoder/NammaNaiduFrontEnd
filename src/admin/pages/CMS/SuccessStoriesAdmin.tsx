import React, { useState, useEffect, useCallback } from 'react';
import { apiClient } from '../../../services/apiClient';
import { API_ENDPOINTS } from '../../../config/api.config';

interface Story {
  id: number;
  groomName: string;
  brideName: string;
  subcaste: string;
  marriedYear: number | null;
  story: string;
  photoUrl: string;
  rating: number;
  isPublished: boolean;
  displayOrder: number;
  createdAt: string;
}

const emptyForm = {
  groomName: '',
  brideName: '',
  subcaste: '',
  marriedYear: '',
  story: '',
  photoUrl: '',
  rating: '5',
  isPublished: true,
  displayOrder: '0',
};

const SuccessStoriesAdmin: React.FC = () => {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const fetchStories = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiClient.get(API_ENDPOINTS.ADMIN.SUCCESS_STORIES_ADMIN);
      if (res.success) {
        setStories(res.data || []);
      }
    } catch (err) {
      console.error('Failed to fetch stories:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStories();
  }, [fetchStories]);

  const handleEdit = (story: Story) => {
    setEditingId(story.id);
    setForm({
      groomName: story.groomName,
      brideName: story.brideName,
      subcaste: story.subcaste || '',
      marriedYear: story.marriedYear?.toString() || '',
      story: story.story,
      photoUrl: story.photoUrl || '',
      rating: story.rating.toString(),
      isPublished: story.isPublished,
      displayOrder: story.displayOrder.toString(),
    });
    setShowForm(true);
  };

  const handleNew = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
    setMessage('');
  };

  const handleSave = async () => {
    if (!form.groomName || !form.brideName || !form.story) {
      setMessage('Groom name, bride name, and story are required.');
      return;
    }

    setSaving(true);
    setMessage('');
    try {
      const payload = {
        groomName: form.groomName,
        brideName: form.brideName,
        subcaste: form.subcaste || null,
        marriedYear: form.marriedYear ? parseInt(form.marriedYear) : null,
        story: form.story,
        photoUrl: form.photoUrl || null,
        rating: parseInt(form.rating) || 5,
        isPublished: form.isPublished,
        displayOrder: parseInt(form.displayOrder) || 0,
      };

      let res;
      if (editingId) {
        res = await apiClient.put(API_ENDPOINTS.ADMIN.SUCCESS_STORY_BY_ID(editingId), payload);
      } else {
        res = await apiClient.post(API_ENDPOINTS.ADMIN.SUCCESS_STORIES_ADMIN, payload);
      }

      if (res.success) {
        setMessage(editingId ? 'Story updated!' : 'Story created!');
        fetchStories();
        setTimeout(() => {
          handleCancel();
        }, 1000);
      } else {
        setMessage(res.message || 'Failed to save');
      }
    } catch (err) {
      setMessage('Error saving story');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this story?')) return;
    try {
      const res = await apiClient.delete(API_ENDPOINTS.ADMIN.SUCCESS_STORY_BY_ID(id));
      if (res.success) {
        fetchStories();
      }
    } catch (err) {
      console.error('Failed to delete story:', err);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Success Stories</h1>
        <button
          onClick={handleNew}
          className="py-2 px-4 bg-[#1a5c2e] text-white rounded-lg font-semibold hover:bg-[#2e7d32] transition-colors cursor-pointer"
        >
          + Add Story
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">
            {editingId ? 'Edit Story' : 'Add New Story'}
          </h2>

          {message && (
            <div className={`mb-4 p-3 rounded-lg text-sm font-medium ${
              message.includes('!') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
            }`}>
              {message}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Groom Name *</label>
              <input
                type="text"
                value={form.groomName}
                onChange={(e) => setForm({ ...form, groomName: e.target.value })}
                className="w-full py-2 px-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a5c2e]"
                placeholder="Groom's name"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Bride Name *</label>
              <input
                type="text"
                value={form.brideName}
                onChange={(e) => setForm({ ...form, brideName: e.target.value })}
                className="w-full py-2 px-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a5c2e]"
                placeholder="Bride's name"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Subcaste</label>
              <input
                type="text"
                value={form.subcaste}
                onChange={(e) => setForm({ ...form, subcaste: e.target.value })}
                className="w-full py-2 px-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a5c2e]"
                placeholder="e.g. Kamma Naidu"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Married Year</label>
              <input
                type="number"
                value={form.marriedYear}
                onChange={(e) => setForm({ ...form, marriedYear: e.target.value })}
                className="w-full py-2 px-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a5c2e]"
                placeholder="e.g. 2025"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Photo URL</label>
              <input
                type="text"
                value={form.photoUrl}
                onChange={(e) => setForm({ ...form, photoUrl: e.target.value })}
                className="w-full py-2 px-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a5c2e]"
                placeholder="https://..."
              />
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-semibold text-gray-700 mb-1">Rating</label>
                <select
                  value={form.rating}
                  onChange={(e) => setForm({ ...form, rating: e.target.value })}
                  className="w-full py-2 px-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a5c2e]"
                >
                  {[1, 2, 3, 4, 5].map(r => (
                    <option key={r} value={r}>{r} Star{r > 1 ? 's' : ''}</option>
                  ))}
                </select>
              </div>
              <div className="flex-1">
                <label className="block text-sm font-semibold text-gray-700 mb-1">Display Order</label>
                <input
                  type="number"
                  value={form.displayOrder}
                  onChange={(e) => setForm({ ...form, displayOrder: e.target.value })}
                  className="w-full py-2 px-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a5c2e]"
                />
              </div>
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-semibold text-gray-700 mb-1">Story *</label>
            <textarea
              value={form.story}
              onChange={(e) => setForm({ ...form, story: e.target.value })}
              rows={5}
              className="w-full py-2 px-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a5c2e] resize-none"
              placeholder="Write the couple's story..."
            />
          </div>

          <div className="mt-4 flex items-center gap-3">
            <label className="text-sm font-semibold text-gray-700">Published</label>
            <button
              type="button"
              onClick={() => setForm({ ...form, isPublished: !form.isPublished })}
              className={`relative w-10 h-5 rounded-full transition-colors cursor-pointer ${
                form.isPublished ? 'bg-[#1a5c2e]' : 'bg-gray-300'
              }`}
            >
              <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                form.isPublished ? 'translate-x-5' : 'translate-x-0.5'
              }`} />
            </button>
          </div>

          <div className="mt-5 flex gap-3">
            <button
              onClick={handleSave}
              disabled={saving}
              className="py-2 px-5 bg-[#1a5c2e] text-white rounded-lg font-semibold hover:bg-[#2e7d32] transition-colors cursor-pointer disabled:opacity-50"
            >
              {saving ? 'Saving...' : editingId ? 'Update Story' : 'Create Story'}
            </button>
            <button
              onClick={handleCancel}
              className="py-2 px-5 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Stories Table */}
      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading stories...</div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-600 text-sm">Couple</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-600 text-sm">Subcaste</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-600 text-sm">Year</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-600 text-sm">Rating</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-600 text-sm">Status</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-600 text-sm">Order</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-600 text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {stories.map((s) => (
                <tr key={s.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-medium text-gray-800">{s.groomName} & {s.brideName}</div>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-500">{s.subcaste || '-'}</td>
                  <td className="py-3 px-4 text-center text-sm text-gray-500">{s.marriedYear || '-'}</td>
                  <td className="py-3 px-4 text-center text-yellow-500">{'★'.repeat(s.rating)}</td>
                  <td className="py-3 px-4 text-center">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      s.isPublished ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {s.isPublished ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center text-sm text-gray-500">{s.displayOrder}</td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex gap-2 justify-center">
                      <button
                        onClick={() => handleEdit(s)}
                        className="py-1 px-3 bg-blue-50 text-blue-700 rounded-md text-sm font-medium hover:bg-blue-100 transition-colors cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(s.id)}
                        className="py-1 px-3 bg-red-50 text-red-700 rounded-md text-sm font-medium hover:bg-red-100 transition-colors cursor-pointer"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {stories.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-gray-400">
                    No stories yet. Click "Add Story" to create one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SuccessStoriesAdmin;
