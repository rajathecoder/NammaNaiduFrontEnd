import React, { useState } from 'react';

const WebsiteSettings: React.FC = () => {
  const [settings, setSettings] = useState({
    logo: '',
    primaryColor: '#14b8a6',
    emailSmtp: { host: '', port: '', user: '', password: '' },
    paymentGateway: { provider: 'razorpay', key: '', secret: '' },
    smsGateway: { provider: 'twilio', apiKey: '', apiSecret: '' },
    contactInfo: { email: '', phone: '', address: '' },
  });

  const handleSave = () => {
    alert('Settings saved successfully!');
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Website Settings</h1>
        <button
          onClick={handleSave}
          className="flex items-center gap-2 py-2 px-4 bg-[#14b8a6] text-white rounded-lg font-semibold cursor-pointer transition-colors duration-200 hover:bg-[#0d9488]"
        >
          💾 Save Settings
        </button>
      </div>

      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Logo Upload</h2>
          <div className="flex items-center gap-6">
            <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center bg-gray-50">
              {settings.logo ? (
                <img src={settings.logo} alt="Logo" className="w-full h-full object-contain rounded-xl" />
              ) : (
                <span className="text-4xl text-gray-400">📷</span>
              )}
            </div>
            <div>
              <input type="file" accept="image/*" onChange={() => console.log('Upload logo')} className="hidden" id="logo-upload" />
              <label
                htmlFor="logo-upload"
                className="inline-block py-2.5 px-4 bg-[#14b8a6] text-white rounded-lg font-medium cursor-pointer transition-colors duration-200 hover:bg-[#0d9488]"
              >
                Upload Logo
              </label>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Primary Colors</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Primary Color</label>
            <div className="flex items-center gap-4">
              <input
                type="color"
                value={settings.primaryColor}
                onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                className="w-20 h-10 border border-gray-300 rounded-lg cursor-pointer"
              />
              <input
                type="text"
                value={settings.primaryColor}
                onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                className="flex-1 py-2 px-4 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#14b8a6] focus:border-transparent"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Email SMTP Settings</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">SMTP Host</label>
              <input
                type="text"
                value={settings.emailSmtp.host}
                onChange={(e) => setSettings({ ...settings, emailSmtp: { ...settings.emailSmtp, host: e.target.value } })}
                className="w-full py-2.5 px-4 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#14b8a6] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">SMTP Port</label>
              <input
                type="text"
                value={settings.emailSmtp.port}
                onChange={(e) => setSettings({ ...settings, emailSmtp: { ...settings.emailSmtp, port: e.target.value } })}
                className="w-full py-2.5 px-4 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#14b8a6] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">SMTP User</label>
              <input
                type="text"
                value={settings.emailSmtp.user}
                onChange={(e) => setSettings({ ...settings, emailSmtp: { ...settings.emailSmtp, user: e.target.value } })}
                className="w-full py-2.5 px-4 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#14b8a6] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">SMTP Password</label>
              <input
                type="password"
                value={settings.emailSmtp.password}
                onChange={(e) => setSettings({ ...settings, emailSmtp: { ...settings.emailSmtp, password: e.target.value } })}
                className="w-full py-2.5 px-4 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#14b8a6] focus:border-transparent"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Payment Gateway Settings</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Provider</label>
              <select
                value={settings.paymentGateway.provider}
                onChange={(e) => setSettings({ ...settings, paymentGateway: { ...settings.paymentGateway, provider: e.target.value } })}
                className="w-full py-2.5 px-4 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#14b8a6] focus:border-transparent"
              >
                <option value="razorpay">Razorpay</option>
                <option value="stripe">Stripe</option>
                <option value="paypal">PayPal</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">API Key</label>
              <input
                type="text"
                value={settings.paymentGateway.key}
                onChange={(e) => setSettings({ ...settings, paymentGateway: { ...settings.paymentGateway, key: e.target.value } })}
                className="w-full py-2.5 px-4 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#14b8a6] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">API Secret</label>
              <input
                type="password"
                value={settings.paymentGateway.secret}
                onChange={(e) => setSettings({ ...settings, paymentGateway: { ...settings.paymentGateway, secret: e.target.value } })}
                className="w-full py-2.5 px-4 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#14b8a6] focus:border-transparent"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">SMS Gateway Settings</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Provider</label>
              <select
                value={settings.smsGateway.provider}
                onChange={(e) => setSettings({ ...settings, smsGateway: { ...settings.smsGateway, provider: e.target.value } })}
                className="w-full py-2.5 px-4 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#14b8a6] focus:border-transparent"
              >
                <option value="twilio">Twilio</option>
                <option value="aws-sns">AWS SNS</option>
                <option value="msg91">MSG91</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">API Key</label>
              <input
                type="text"
                value={settings.smsGateway.apiKey}
                onChange={(e) => setSettings({ ...settings, smsGateway: { ...settings.smsGateway, apiKey: e.target.value } })}
                className="w-full py-2.5 px-4 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#14b8a6] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">API Secret</label>
              <input
                type="password"
                value={settings.smsGateway.apiSecret}
                onChange={(e) => setSettings({ ...settings, smsGateway: { ...settings.smsGateway, apiSecret: e.target.value } })}
                className="w-full py-2.5 px-4 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#14b8a6] focus:border-transparent"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Contact Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={settings.contactInfo.email}
                onChange={(e) => setSettings({ ...settings, contactInfo: { ...settings.contactInfo, email: e.target.value } })}
                className="w-full py-2.5 px-4 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#14b8a6] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
              <input
                type="tel"
                value={settings.contactInfo.phone}
                onChange={(e) => setSettings({ ...settings, contactInfo: { ...settings.contactInfo, phone: e.target.value } })}
                className="w-full py-2.5 px-4 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#14b8a6] focus:border-transparent"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
              <textarea
                value={settings.contactInfo.address}
                onChange={(e) => setSettings({ ...settings, contactInfo: { ...settings.contactInfo, address: e.target.value } })}
                rows={3}
                className="w-full py-2.5 px-4 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#14b8a6] focus:border-transparent resize-none"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WebsiteSettings;
