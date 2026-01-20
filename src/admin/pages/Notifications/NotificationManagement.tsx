import React, { useState } from 'react';
import { getApiUrl, API_ENDPOINTS } from '../../../config/api.config';

const NotificationManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'push' | 'email' | 'templates' | 'scheduled'>('push');
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    target: 'all',
    scheduleDate: '',
    scheduleTime: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (activeTab === 'push') {
      await handleSendPushNotification();
    } else if (activeTab === 'email') {
      // Email functionality - to be implemented
      alert('Email functionality coming soon!');
    } else if (activeTab === 'scheduled') {
      // Scheduled messages - to be implemented
      alert('Scheduled messages functionality coming soon!');
    }
  };

  const handleSendPushNotification = async () => {
    if (!formData.title || !formData.message) {
      setSubmitMessage({ type: 'error', text: 'Please fill in all required fields' });
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage(null);

    try {
      const adminToken = localStorage.getItem('adminToken');
      if (!adminToken) {
        setSubmitMessage({ type: 'error', text: 'Admin authentication required' });
        setIsSubmitting(false);
        return;
      }

      const apiUrl = getApiUrl(API_ENDPOINTS.ADMIN.SEND_PUSH_NOTIFICATION);
      console.log('Sending notification to:', apiUrl);
      console.log('Payload:', {
        title: formData.title,
        message: formData.message,
        target: formData.target,
      });

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`,
        },
        body: JSON.stringify({
          title: formData.title,
          message: formData.message,
          target: formData.target,
        }),
      });

      console.log('Response status:', response.status, response.statusText);

      let data;
      try {
        data = await response.json();
        console.log('Response data:', data);
      } catch (parseError) {
        console.error('Failed to parse response:', parseError);
        const text = await response.text();
        console.error('Response text:', text);
        setSubmitMessage({
          type: 'error',
          text: `Server error: ${response.status} ${response.statusText}`,
        });
        setIsSubmitting(false);
        return;
      }

      if (response.ok && data.success) {
        setSubmitMessage({
          type: 'success',
          text: data.message || `Notification sent to ${data.data?.sentCount || 0} users successfully!`,
        });
        setFormData({ title: '', message: '', target: 'all', scheduleDate: '', scheduleTime: '' });
        
        // Clear success message after 5 seconds
        setTimeout(() => setSubmitMessage(null), 5000);
      } else {
        setSubmitMessage({
          type: 'error',
          text: data.message || `Failed to send notification (${response.status}). Please try again.`,
        });
      }
    } catch (error: any) {
      console.error('Error sending push notification:', error);
      setSubmitMessage({
        type: 'error',
        text: error.message || 'An error occurred while sending the notification. Please check console for details.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Notification Management</h1>
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        <button
          className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-all duration-200 ${
            activeTab === 'push'
              ? 'bg-[#14b8a6] text-white shadow-md'
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
          }`}
          onClick={() => setActiveTab('push')}
        >
          📱 Push Notification
        </button>
        <button
          className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-all duration-200 ${
            activeTab === 'email'
              ? 'bg-[#14b8a6] text-white shadow-md'
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
          }`}
          onClick={() => setActiveTab('email')}
        >
          📧 Send Email
        </button>
        <button
          className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-all duration-200 ${
            activeTab === 'templates'
              ? 'bg-[#14b8a6] text-white shadow-md'
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
          }`}
          onClick={() => setActiveTab('templates')}
        >
          📝 Templates
        </button>
        <button
          className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-all duration-200 ${
            activeTab === 'scheduled'
              ? 'bg-[#14b8a6] text-white shadow-md'
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
          }`}
          onClick={() => setActiveTab('scheduled')}
        >
          ⏰ Scheduled Messages
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        {activeTab === 'push' && (
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Send Push Notification</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  className="w-full py-2.5 px-4 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#14b8a6] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Message *</label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                  rows={4}
                  className="w-full py-2.5 px-4 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#14b8a6] focus:border-transparent resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Target Audience</label>
                <select
                  value={formData.target}
                  onChange={(e) => setFormData({ ...formData, target: e.target.value })}
                  className="w-full py-2.5 px-4 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#14b8a6] focus:border-transparent"
                >
                  <option value="all">All Users</option>
                  <option value="premium">Premium Users</option>
                  <option value="active">Active Users</option>
                </select>
              </div>
              {submitMessage && (
                <div
                  className={`p-4 rounded-lg ${
                    submitMessage.type === 'success'
                      ? 'bg-green-50 text-green-800 border border-green-200'
                      : 'bg-red-50 text-red-800 border border-red-200'
                  }`}
                >
                  {submitMessage.text}
                </div>
              )}
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 py-2.5 px-6 bg-[#14b8a6] text-white rounded-lg font-semibold cursor-pointer transition-colors duration-200 hover:bg-[#0d9488] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? '⏳ Sending...' : '📤 Send Notification'}
              </button>
            </form>
          </div>
        )}

        {activeTab === 'email' && (
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Send Email Notification</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Subject *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  className="w-full py-2.5 px-4 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#14b8a6] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Body *</label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                  rows={8}
                  className="w-full py-2.5 px-4 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#14b8a6] focus:border-transparent resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Target Audience</label>
                <select
                  value={formData.target}
                  onChange={(e) => setFormData({ ...formData, target: e.target.value })}
                  className="w-full py-2.5 px-4 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#14b8a6] focus:border-transparent"
                >
                  <option value="all">All Users</option>
                  <option value="premium">Premium Users</option>
                </select>
              </div>
              <button
                type="submit"
                className="flex items-center gap-2 py-2.5 px-6 bg-[#14b8a6] text-white rounded-lg font-semibold cursor-pointer transition-colors duration-200 hover:bg-[#0d9488]"
              >
                📧 Send Email
              </button>
            </form>
          </div>
        )}

        {activeTab === 'templates' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">Notification Templates</h2>
              <button className="flex items-center gap-2 py-2 px-4 bg-[#14b8a6] text-white rounded-lg font-semibold cursor-pointer transition-colors duration-200 hover:bg-[#0d9488]">
                + Add Template
              </button>
            </div>
            <div className="space-y-4">
              <div className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow duration-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Welcome Template</h3>
                <p className="text-gray-600 mb-4">Welcome to Namma Naidu! Start your journey...</p>
                <div className="flex gap-2">
                  <button className="px-4 py-2 border border-gray-300 bg-white text-gray-700 rounded-lg text-sm font-medium cursor-pointer transition-colors duration-200 hover:bg-gray-50">
                    Edit
                  </button>
                  <button className="px-4 py-2 bg-[#14b8a6] text-white rounded-lg text-sm font-semibold cursor-pointer transition-colors duration-200 hover:bg-[#0d9488]">
                    Use
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'scheduled' && (
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Scheduled Messages</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  className="w-full py-2.5 px-4 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#14b8a6] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Message *</label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                  rows={4}
                  className="w-full py-2.5 px-4 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#14b8a6] focus:border-transparent resize-none"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Schedule Date *</label>
                  <input
                    type="date"
                    value={formData.scheduleDate}
                    onChange={(e) => setFormData({ ...formData, scheduleDate: e.target.value })}
                    required
                    className="w-full py-2.5 px-4 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#14b8a6] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Schedule Time *</label>
                  <input
                    type="time"
                    value={formData.scheduleTime}
                    onChange={(e) => setFormData({ ...formData, scheduleTime: e.target.value })}
                    required
                    className="w-full py-2.5 px-4 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#14b8a6] focus:border-transparent"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="flex items-center gap-2 py-2.5 px-6 bg-[#14b8a6] text-white rounded-lg font-semibold cursor-pointer transition-colors duration-200 hover:bg-[#0d9488]"
              >
                ⏰ Schedule Message
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationManagement;
