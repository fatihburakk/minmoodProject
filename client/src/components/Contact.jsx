import React from 'react';

export default function Contact() {
  return (
    <section id="contact" className="py-16 bg-white">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">İletişim</h2>
          <div className="w-24 h-1 bg-indigo-600 mx-auto"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 justify-items-center">
          <div className="flex items-center space-x-4 p-4 rounded-lg hover:bg-gray-50 transition duration-300">
            <span className="text-2xl">✉️</span>
            <a href="mailto:info@duyguanalizi.com" className="text-indigo-600 hover:text-indigo-800 transition duration-300">
              info@duyguanalizi.com
            </a>
          </div>

          <div className="flex items-center space-x-4 p-4 rounded-lg hover:bg-gray-50 transition duration-300">
            <span className="text-2xl">📞</span>
            <span className="text-gray-700">+90 555 123 4567</span>
          </div>

          <div className="flex items-center space-x-4 p-4 rounded-lg hover:bg-gray-50 transition duration-300">
            <span className="text-2xl">📍</span>
            <span className="text-gray-700">İstanbul, Türkiye</span>
          </div>

          <div className="flex items-center justify-center space-x-6 p-4">
            <a href="#" className="text-2xl hover:scale-110 transition duration-300">🔵</a>
            <a href="#" className="text-2xl hover:scale-110 transition duration-300">🔷</a>
            <a href="#" className="text-2xl hover:scale-110 transition duration-300">🟣</a>
            <a href="#" className="text-2xl hover:scale-110 transition duration-300">🔗</a>
          </div>
        </div>
      </div>
    </section>
  );
}