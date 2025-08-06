import React, { useState } from 'react';
import { motion } from 'framer-motion';

// SVG Icons
const SearchIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const ChevronDownIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);

const ChevronUpIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
  </svg>
);

const MessageIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
  </svg>
);

const PhoneIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
  </svg>
);

const EmailIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const ClockIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const HelpCenter = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [openFAQ, setOpenFAQ] = useState(null);
  const [activeTab, setActiveTab] = useState('faq');

  const faqs = [
    {
      category: 'Getting Started',
      questions: [
        {
          question: 'How do I create an account?',
          answer: 'Creating an account is simple! Click on the "Sign Up" button on the homepage, enter your email address, create a password, and verify your email. You can also sign up using your Google or Facebook account for faster registration.',
        },
        {
          question: 'How do I list an item for rent?',
          answer: 'To list an item, click the "+" button in the navigation bar or go to "Add Listing" in your profile. Upload clear photos of your item, add a detailed description, set your rental price, choose rental periods, and specify any rules or requirements. Once submitted, your listing will be reviewed and published within 24 hours.',
        },
        {
          question: 'What items can I rent out?',
          answer: 'You can rent almost anything! Popular categories include electronics, cameras, sports equipment, tools, party supplies, vehicles, and even spaces. Make sure your items are in good condition and comply with our terms of service.',
        },
      ],
    },
    {
      category: 'Payments & Pricing',
      questions: [
        {
          question: 'How do I get paid for rentals?',
          answer: 'Payments are processed through our secure system. When someone books your item, the payment is held in escrow. After the rental period ends and both parties confirm everything is satisfactory, the funds are released to your RenThing wallet. You can then withdraw to your bank account, GCash, or other supported payout methods.',
        },
        {
          question: 'What fees does RenThing charge?',
          answer: 'RenThing charges a 10% service fee on each transaction to cover payment processing, platform maintenance, and customer support. There are no listing fees or monthly charges.',
        },
        {
          question: 'How do I set competitive rental prices?',
          answer: 'Research similar items on the platform to understand market rates. Consider your item\'s value, condition, and rental duration. Start with competitive pricing to attract initial bookings, then adjust based on demand and seasonality.',
        },
      ],
    },
    {
      category: 'Safety & Security',
      questions: [
        {
          question: 'How does RenThing ensure safety?',
          answer: 'We verify all users through email and phone verification. Our rating system helps build trust within the community. We provide secure payment processing, and our customer support team is available 24/7. We also recommend meeting in safe, public locations for item exchanges.',
        },
        {
          question: 'What if my item gets damaged?',
          answer: 'We provide damage protection up to ₱50,000 for verified listings. Document your item\'s condition with photos before rental. If damage occurs, report it immediately through the app with photos and details. Our team will mediate and process claims according to our damage policy.',
        },
        {
          question: 'Can I require a security deposit?',
          answer: 'Yes! You can set a security deposit amount when creating your listing. This deposit is held by RenThing and returned after the rental if no issues occur. Deposits help protect against damage or late returns.',
        },
      ],
    },
    {
      category: 'Booking & Communication',
      questions: [
        {
          question: 'How do I book an item?',
          answer: 'Browse listings and use filters to find what you need. Check availability on the calendar, select your rental dates, review the terms, and proceed to checkout. You\'ll receive confirmation and can message the owner to coordinate pickup.',
        },
        {
          question: 'Can I cancel a booking?',
          answer: 'Yes, you can cancel bookings based on the owner\'s cancellation policy (Flexible, Moderate, or Strict). Check the cancellation terms on each listing. Refunds are processed according to the policy selected by the item owner.',
        },
        {
          question: 'How does messaging work?',
          answer: 'Our in-app messaging system keeps all communication secure. You can message owners before booking to ask questions, and renters can contact you after booking. We monitor messages to ensure safety and prevent spam.',
        },
      ],
    },
  ];

  const filteredFAQs = faqs.map(category => ({
    ...category,
    questions: category.questions.filter(q => 
      q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.answer.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.questions.length > 0);

  const contactMethods = [
    {
      icon: MessageIcon,
      title: 'Live Chat',
      description: 'Chat with our support team 24/7',
      action: 'Start Chat',
      available: true,
    },
    {
      icon: EmailIcon,
      title: 'Email Support',
      description: 'Get help via email within 24 hours',
      action: 'Send Email',
      available: true,
    },
    {
      icon: PhoneIcon,
      title: 'Phone Support',
      description: 'Call us at 1-800-REN-THING',
      action: 'Call Now',
      available: 'Mon-Fri 9AM-6PM',
    },
  ];

  const toggleFAQ = (categoryIndex, questionIndex) => {
    const key = `${categoryIndex}-${questionIndex}`;
    setOpenFAQ(openFAQ === key ? null : key);
  };

  return (
    <motion.div
      className="min-h-screen bg-glass"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="bg-glass shadow-sm sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Help Center</h1>
        </div>
      </div>

      {/* Search */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search for help..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex space-x-1 bg-glass p-1 rounded-lg">
          {[
            { id: 'faq', label: 'FAQ' },
            { id: 'contact', label: 'Contact Us' },
            { id: 'guides', label: 'Guides' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 px-4 py-2 rounded-md font-medium transition ${
                activeTab === tab.id
                  ? 'bg-glass text-teal-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {activeTab === 'faq' && (
          <div>
            {filteredFAQs.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No results found for "{searchQuery}"</p>
              </div>
            ) : (
              filteredFAQs.map((category, categoryIndex) => (
                <div key={category.category} className="mb-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">{category.category}</h3>
                  <div className="space-y-4">
                    {category.questions.map((faq, questionIndex) => {
                      const key = `${categoryIndex}-${questionIndex}`;
                      const isOpen = openFAQ === key;
                      
                      return (
                        <div key={questionIndex} className="bg-glass rounded-lg shadow-sm">
                          <button
                            onClick={() => toggleFAQ(categoryIndex, questionIndex)}
                            className="w-full p-4 text-left flex items-center justify-between hover:bg-glass transition"
                          >
                            <span className="font-medium text-gray-900 pr-4">{faq.question}</span>
                            {isOpen ? (
                              <ChevronUpIcon className="h-5 w-5 text-gray-400 flex-shrink-0" />
                            ) : (
                              <ChevronDownIcon className="h-5 w-5 text-gray-400 flex-shrink-0" />
                            )}
                          </button>
                          {isOpen && (
                            <div className="px-4 pb-4">
                              <p className="text-gray-600">{faq.answer}</p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'contact' && (
          <div>
            <div className="bg-glass rounded-lg shadow-sm p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Get in Touch</h3>
              <p className="text-gray-600 mb-6">
                Our support team is here to help. Choose your preferred method to contact us.
              </p>
              <div className="grid md:grid-cols-3 gap-4">
                {contactMethods.map((method, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-6 text-center">
                    <div className="bg-teal-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                      <method.icon className="h-6 w-6 text-teal-600" />
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">{method.title}</h4>
                    <p className="text-sm text-gray-600 mb-4">{method.description}</p>
                    <button className="w-full bg-teal-600 text-white py-2 px-4 rounded-lg hover:bg-teal-700 transition">
                      {method.action}
                    </button>
                    {method.available !== true && (
                      <p className="text-xs text-gray-500 mt-2">{method.available}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-glass rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Submit a Ticket</h3>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                  <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500">
                    <option>Select a topic</option>
                    <option>Account Issues</option>
                    <option>Payment Problems</option>
                    <option>Item Disputes</option>
                    <option>Technical Support</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    rows="4"
                    placeholder="Please describe your issue in detail..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Attachment (optional)</label>
                  <input
                    type="file"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
                <button type="submit" className="w-full bg-teal-600 text-white py-2 px-4 rounded-lg hover:bg-teal-700 transition">
                  Submit Ticket
                </button>
              </form>
            </div>
          </div>
        )}

        {activeTab === 'guides' && (
          <div>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                {
                  title: 'Getting Started Guide',
                  description: 'Everything you need to know about using RenThing',
                  duration: '5 min read',
                  icon: '🏠',
                },
                {
                  title: 'Listing Best Practices',
                  description: 'Tips for creating successful rental listings',
                  duration: '7 min read',
                  icon: '📸',
                },
                {
                  title: 'Safety Guidelines',
                  description: 'Stay safe while renting items',
                  duration: '4 min read',
                  icon: '🛡️',
                },
                {
                  title: 'Payment Guide',
                  description: 'Understanding payments and withdrawals',
                  duration: '6 min read',
                  icon: '💰',
                },
                {
                  title: 'Mobile App Guide',
                  description: 'Using RenThing on your mobile device',
                  duration: '3 min read',
                  icon: '📱',
                },
                {
                  title: 'Dispute Resolution',
                  description: 'How to handle rental disputes',
                  duration: '8 min read',
                  icon: '⚖️',
                },
              ].map((guide, index) => (
                <div key={index} className="bg-glass rounded-lg shadow-sm p-6 hover:shadow-md transition">
                  <div className="text-4xl mb-4">{guide.icon}</div>
                  <h3 className="font-semibold text-gray-900 mb-2">{guide.title}</h3>
                  <p className="text-gray-600 mb-4">{guide.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500 flex items-center">
                      <ClockIcon className="h-4 w-4 mr-1" />
                      {guide.duration}
                    </span>
                    <button className="text-teal-600 hover:text-teal-700 font-medium">
                      Read More
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default HelpCenter;