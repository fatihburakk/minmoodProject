import React from 'react';
import mindmoodLogo from '../assets/minmood.png';
import Navbar from '../components/Navbar';

export default function About() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div 
        className="flex-grow relative py-12 px-4 sm:px-6 lg:px-8"
        style={{
          backgroundImage: `url(${mindmoodLogo})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          backgroundColor: 'rgba(255, 255, 255, 0.8)', // Hafif yarı saydam beyaz
        }}
      >

        <div className="max-w-4xl mx-auto relative z-10">
          {/* Logo ve Başlık */}
          <div className="text-center mb-12">
            
            <h1 className="text-4xl font-bold text-[#ffffff] mb-4">MindMood Hakkında</h1>
            <p className="text-lg text-[#ffffff]">Duygusal zeka ve farkındalık yolculuğunuzda yanınızdayız</p>
          </div>

          {/* Misyonumuz */}
          <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-8 mb-8 border-2 border-[#ee00ee]/20">
            <h2 className="text-2xl font-bold text-[#ee00ee] mb-4 text-center">Misyonumuz</h2>
            <p className="text-[#7c1fa0] leading-relaxed text-center">
              MindMood olarak amacımız, kullanıcılarımızın duygusal sağlığını desteklemek ve duygusal zekalarını geliştirmelerine yardımcı olmaktır. 
              Günlük hayatın stresinden uzaklaşarak, kendi duygularınızı daha iyi anlamanızı ve yönetmenizi sağlıyoruz.
            </p>
          </div>

          {/* Özelliklerimiz */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-8 border-2 border-[#ee00ee]/20">
              <h3 className="text-xl font-bold text-[#ee00ee] mb-4">Duygu Analizi</h3>
              <p className="text-[#7c1fa0]">
                Yapay zeka destekli duygu analizi teknolojimiz ile duygularınızı anlamanıza ve ifade etmenize yardımcı oluyoruz.
              </p>
            </div>
            <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-8 border-2 border-[#ee00ee]/20">
              <h3 className="text-xl font-bold text-[#ee00ee] mb-4">Dijital Günlük</h3>
              <p className="text-[#7c1fa0]">
                Güvenli ve özel dijital günlük tutma özelliği ile duygusal yolculuğunuzu kayıt altına alın.
              </p>
            </div>
            <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-8 border-2 border-[#ee00ee]/20">
              <h3 className="text-xl font-bold text-[#ee00ee] mb-4">Veri Analizi</h3>
              <p className="text-[#7c1fa0]">
                Duygusal durumunuzu zaman içinde analiz ederek, kişisel gelişiminizi takip edin.
              </p>
            </div>
            <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-8 border-2 border-[#ee00ee]/20">
              <h3 className="text-xl font-bold text-[#ee00ee] mb-4">Güvenlik</h3>
              <p className="text-[#7c1fa0]">
                En son güvenlik teknolojileri ile verileriniz güvende. Gizliliğiniz bizim için önemli.
              </p>
            </div>
          </div>

          {/* Değerlerimiz */}
          <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-8 mb-12 border-2 border-[#ee00ee]/20">
            <h2 className="text-2xl font-bold text-[#ee00ee] mb-6 text-center">Değerlerimiz</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-[#ee00ee]/10 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-[#ee00ee]/20">
                  <svg className="w-8 h-8 text-[#ee00ee]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <h4 className="font-bold text-[#ee00ee] mb-2">Yenilikçilik</h4>
                <p className="text-[#7c1fa0]">Sürekli gelişen teknolojiler ile en iyi hizmeti sunuyoruz</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-[#ee00ee]/10 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-[#ee00ee]/20">
                  <svg className="w-8 h-8 text-[#ee00ee]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h4 className="font-bold text-[#ee00ee] mb-2">Güvenilirlik</h4>
                <p className="text-[#7c1fa0]">Kullanıcılarımızın güveni bizim için en değerli varlığımız</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-[#ee00ee]/10 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-[#ee00ee]/20">
                  <svg className="w-8 h-8 text-[#ee00ee]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h4 className="font-bold text-[#ee00ee] mb-2">Empati</h4>
                <p className="text-[#7c1fa0]">Her kullanıcımızın ihtiyaçlarını anlıyor ve destekliyoruz</p>
              </div>
            </div>
          </div>

          {/* İletişim */}
          <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-8 text-center border-2 border-[#ee00ee]/20">
            <h2 className="text-2xl font-bold text-[#ee00ee] mb-4">Bizimle İletişime Geçin</h2>
            <p className="text-[#7c1fa0] mb-6">
              Sorularınız, önerileriniz veya geri bildirimleriniz için her zaman yanınızdayız.
            </p>
            <button className="bg-[#ee00ee] text-white font-bold py-3 px-8 rounded-lg hover:bg-[#7c1fa0] transition-colors">
              İletişime Geç
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 