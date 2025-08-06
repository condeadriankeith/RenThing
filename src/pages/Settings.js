import React, { useState } from 'react';

// SVG Icons
const BellIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
  </svg>
);

const LockIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);

const ShieldIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

const GlobeIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const QuestionIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const ChevronRightIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);

const Settings = () => {
  const [notifications, setNotifications] = useState({
    push: true,
    email: true,
    sms: false,
    marketing: false,
  });

  const [privacy, setPrivacy] = useState({
    profileVisible: true,
    showPhone: false,
    showEmail: false,
  });

  const settingsSections = [
    {
      title: 'Account',
      items: [
        { icon: BellIcon, label: 'Notifications', href: '#notifications' },
        { icon: LockIcon, label: 'Security', href: '#security' },
        { icon: ShieldIcon, label: 'Privacy', href: '#privacy' },
        { icon: GlobeIcon, label: 'Language', href: '#language' },
      ],
    },
    {
      title: 'Support',
      items: [
        { icon: QuestionIcon, label: 'Help Center', href: '#help' },
        { icon: ShieldIcon, label: 'Terms & Conditions', href: '#terms' },
        { icon: ShieldIcon, label: 'Privacy Policy', href: '#privacy-policy' },
      ],
    },
  ];

  const toggleNotification = (key) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const togglePrivacy = (key) => {
    setPrivacy(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="min-h-screen bg-glass">
      {/* Header */}
      <div className="bg-glass shadow-sm sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Profile Section */}
        <div className="bg-glass rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-r from-teal-600 to-teal-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xl font-bold">JD</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">John Doe</h3>
              <p className="text-gray-600">john.doe@email.com</p>
              <p className="text-sm text-teal-600">Verified Account</p>
            </div>
          </div>
        </div>

        {/* Notifications Section */}
        <div className="bg-glass rounded-lg shadow-sm mb-6">
          <div className="p-6 border-b">
            <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
          </div>
          <div className="divide-y">
            {[
              { key: 'push', label: 'Push Notifications', description: 'Receive notifications on your device' },
              { key: 'email', label: 'Email Notifications', description: 'Get updates via email' },
              { key: 'sms', label: 'SMS Notifications', description: 'Receive text messages for important updates' },
              { key: 'marketing', label: 'Marketing Communications', description: 'Receive promotional offers and updates' },
            ].map((item) => (
              <div key={item.key} className="p-4 flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">{item.label}</p>
                  <p className="text-sm text-gray-500">{item.description}</p>
                </div>
                <button
                  onClick={() => toggleNotification(item.key)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    notifications[item.key] ? 'bg-teal-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-glass transition-transform ${
                      notifications[item.key] ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Privacy Section */}
        <div className="bg-glass rounded-lg shadow-sm mb-6">
          <div className="p-6 border-b">
            <h3 className="text-lg font-semibold text-gray-900">Privacy</h3>
          </div>
          <div className="divide-y">
            {[
              { key: 'profileVisible', label: 'Public Profile', description: 'Allow others to view your profile' },
              { key: 'showPhone', label: 'Show Phone Number', description: 'Display your phone number to other users' },
              { key: 'showEmail', label: 'Show Email Address', description: 'Display your email address to other users' },
            ].map((item) => (
              <div key={item.key} className="p-4 flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">{item.label}</p>
                  <p className="text-sm text-gray-500">{item.description}</p>
                </div>
                <button
                  onClick={() => togglePrivacy(item.key)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    privacy[item.key] ? 'bg-teal-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-glass transition-transform ${
                      privacy[item.key] ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Settings Sections */}
        {settingsSections.map((section) => (
          <div key={section.title} className="bg-glass rounded-lg shadow-sm mb-6">
            <div className="p-6 border-b">
              <h3 className="text-lg font-semibold text-gray-900">{section.title}</h3>
            </div>
            <div className="divide-y">
              {section.items.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="p-4 flex items-center justify-between hover:bg-glass transition"
                >
                  <div className="flex items-center space-x-3">
                    <item.icon className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-900">{item.label}</span>
                  </div>
                  <ChevronRightIcon className="h-5 w-5 text-gray-400" />
                </a>
              ))}
            </div>
          </div>
        ))}

        {/* Language Section */}
        <div className="bg-glass rounded-lg shadow-sm mb-6">
          <div className="p-6 border-b">
            <h3 className="text-lg font-semibold text-gray-900">Language & Region</h3>
          </div>
          <div className="p-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
            <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500">
              <option>English</option>
              <option>Filipino</option>
              <option>Spanish</option>
            </select>
          </div>
        </div>

        {/* Account Actions */}
        <div className="bg-glass rounded-lg shadow-sm">
          <div className="divide-y">
            <button className="w-full p-4 text-left text-red-600 hover:bg-red-50 transition">
              Logout
            </button>
            <button className="w-full p-4 text-left text-red-600 hover:bg-red-50 transition">
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;