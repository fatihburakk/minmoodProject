import React from 'react';
const items = [
  { icon: '🧠', title: 'Yapay Zeka Analizi', desc: 'Metin tabanlı çoklu duygu analizi ile duygularınızı anlayın' },
  { icon: '📈', title: 'Detaylı İstatistikler', desc: 'Duygu değişimlerinizi grafiklerle takip edin' },
  { icon: '📔', title: 'Duygu Günlüğü', desc: 'Günlük duygu takibi ve notlar tutun' },
  { icon: '🧘', title: 'Meditasyon Önerileri', desc: 'Duygularınıza özel meditasyon ve nefes egzersizleri' },
];
export default function Features() {
  return (
    <section id="features" className="py-16 bg-white">
      <div className="container mx-auto text-center mb-8">
        <h2 className="text-3xl font-bold">Özellikler</h2>
      </div>
      <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {items.map((item, idx) => (
          <div key={idx} className="bg-gray-50 p-6 rounded-lg shadow hover:shadow-lg transition">
            <div className="text-4xl mb-4">{item.icon}</div>
            <h3 className="font-semibold mb-2">{item.title}</h3>
            <p className="text-sm text-gray-600">{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
} 