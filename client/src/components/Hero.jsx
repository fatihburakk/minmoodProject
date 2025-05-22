import React from 'react';
import { Link } from 'react-router-dom';

export default function Hero() {
  return (
    <section className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white min-h-screen flex items-center">
      <div className="container mx-auto px-4 max-w-6xl py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-16">
          <div className="md:w-1/2 text-center md:text-left space-y-6">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight">
              Duygularınızı <br/>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-200 to-pink-200">
                Anlayın
              </span>
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-purple-100 leading-relaxed max-w-2xl mx-auto md:mx-0">
              Yapay zeka destekli günlük duygu analizi ile duygularınızı daha iyi anlayın ve yönetin.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start pt-4">
              <Link to="/register" 
                className="px-6 sm:px-8 py-3 sm:py-4 bg-white text-indigo-600 rounded-full font-semibold text-base sm:text-lg hover:bg-purple-100 transition-all transform hover:scale-105 shadow-lg">
                Hemen Başla
              </Link>
              <a href="#about" 
                className="px-6 sm:px-8 py-3 sm:py-4 border-2 border-white text-white rounded-full font-semibold text-base sm:text-lg hover:bg-white/10 transition-all">
                Daha Fazla
              </a>
            </div>
          </div>
          
          <div className="md:w-1/2 flex justify-center mt-8 md:mt-0">
            <img 
              src="/assets/duygu_analizii.jpg" 
              alt="Duygu Analizi" 
              className="w-[500px] h-[670px] max-w-md lg:max-w-lg rounded-2xl shadow-2xl transform hover:scale-105 transition-all duration-300 object-cover"            />
          </div>
        </div>
      </div>
    </section>
  );
}