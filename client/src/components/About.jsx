import React from 'react';
export default function About() {
  return (
    <section id="about" className="py-16 bg-indigo-50">
      <div className="container mx-auto text-center">
        <h2 className="text-3xl font-bold mb-4">Hakkımızda</h2>
        <p className="max-w-2xl mx-auto text-gray-700 mb-6">
          Duygu Analizi, yapay zeka teknolojilerini kullanarak duygularınızı anlamanıza ve yönetmenize yardımcı olan bir platformdur.
        </p>
        <div className="flex justify-center space-x-8">
          <span className="flex items-center"><span className="mr-2 text-green-500">✔</span>Güvenli ve Özel</span>
          <span className="flex items-center"><span className="mr-2 text-green-500">✔</span>Kullanıcı Dostu</span>
          <span className="flex items-center"><span className="mr-2 text-green-500">✔</span>7/24 Erişim</span>
        </div>
      </div>
    </section>
  );
} 