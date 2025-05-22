import React from 'react';
export default function Footer() {
  return (
    <footer className="bg-gray-800 text-gray-300 py-8">
      <div className="container mx-auto flex flex-col md:flex-row justify-between">
        <div>
          <h3 className="font-bold mb-2">Hızlı Bağlantılar</h3>
          <ul>
            <li><a href="#features" className="hover:underline">Özellikler</a></li>
            <li><a href="#about" className="hover:underline">Hakkımızda</a></li>
            <li><a href="#contact" className="hover:underline">İletişim</a></li>
          </ul>
        </div>
        <div>
          <h3 className="font-bold mb-2">Yasal</h3>
          <ul>
            <li><a href="#" className="hover:underline">Gizlilik Politikası</a></li>
            <li><a href="#" className="hover:underline">Kullanım Şartları</a></li>
            <li><a href="#" className="hover:underline">KVKK</a></li>
          </ul>
        </div>
      </div>
      <div className="text-center text-sm mt-6">© 2024 Duygu Analizi. Tüm hakları saklıdır.</div>
    </footer>
  );
} 