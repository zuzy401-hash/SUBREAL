
import React, { useState } from 'react';
import Navbar from './components/Navbar';
import AuctionCard from './components/AuctionCard';
import LiveAssistant from './components/LiveAssistant';
import { MANIFESTO_TEXT, MOCK_AUCTIONS, I18N, MOCK_CREATORS, APP_URL, COMMISSIONS, PRICING_TABLE, ACCEPTED_PAYMENTS } from './constants';
import { AuctionItem, UserLevel, Language, UserType, ProjectCategory, EscrowStatus } from './types';

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>('es');
  const [currentPage, setCurrentPage] = useState('home');
  const [userLevel, setUserLevel] = useState<UserLevel>(UserLevel.ERRANTE);
  const [userType, setUserType] = useState<UserType | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedItem, setSelectedItem] = useState<AuctionItem | null>(null);
  const [userName, setUserName] = useState('');
  const [showCategories, setShowCategories] = useState(false);
  
  // Escrow Mock State
  const [escrowStatus, setEscrowStatus] = useState<EscrowStatus>('pending_payment');

  const t = (key: string) => I18N[key]?.[lang] || key;

  // Added handleLogin function to fix the undefined error on line 160
  const handleLogin = () => {
    if (userName.trim() && userType) {
      setIsLoggedIn(true);
      setCurrentPage('home');
    }
  };

  const renderEscrowTracker = () => {
    const steps: { status: EscrowStatus; label: string }[] = [
      { status: 'pending_payment', label: lang === 'es' ? 'Pago Pendiente' : 'Payment Pending' },
      { status: 'funds_held', label: lang === 'es' ? 'Fondos en Escrow' : 'Funds in Escrow' },
      { status: 'item_shipped', label: lang === 'es' ? 'Enviado' : 'Shipped' },
      { status: 'item_delivered', label: lang === 'es' ? 'Entregado' : 'Delivered' },
      { status: 'released', label: lang === 'es' ? 'Fondos Liberados' : 'Funds Released' }
    ];

    const currentIdx = steps.findIndex(s => s.status === escrowStatus);

    return (
      <div className="w-full bg-black/40 border border-yellow-600/20 p-6 rounded-lg mb-8">
        <div className="flex items-center justify-between mb-4">
           <h4 className="text-[10px] uppercase tracking-[0.3em] font-bold text-yellow-500">{t('escrow_title')}</h4>
           <span className="text-[8px] text-gray-500 uppercase font-bold px-2 py-1 border border-white/10 rounded">ID: 9X22-DORA</span>
        </div>
        <div className="relative flex justify-between items-center px-2">
           <div className="absolute top-1/2 left-0 right-0 h-px bg-white/5 -z-0"></div>
           {steps.map((step, idx) => (
             <div key={step.status} className="relative z-10 flex flex-col items-center gap-2 group cursor-pointer" onClick={() => setEscrowStatus(step.status)}>
                <div className={`w-3 h-3 rounded-full border transition-all ${idx <= currentIdx ? 'bg-yellow-600 border-yellow-600 shadow-[0_0_10px_rgba(234,179,8,0.5)]' : 'bg-black border-white/20 group-hover:border-yellow-600/50'}`}></div>
                <span className={`text-[7px] uppercase tracking-tighter transition-all ${idx <= currentIdx ? 'text-white' : 'text-gray-600'}`}>{step.label}</span>
             </div>
           ))}
        </div>
        <p className="text-[9px] text-gray-500 italic mt-6 text-center">{t('escrow_desc')}</p>
      </div>
    );
  };

  const renderCategoriesMenu = () => (
    <div className={`fixed top-20 left-1/2 -translate-x-1/2 z-[60] w-full max-w-4xl bg-black/95 backdrop-blur-2xl border border-yellow-600/30 p-8 shadow-2xl transition-all duration-500 ${showCategories ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-10 pointer-events-none'}`}>
       <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          {Object.entries(PRICING_TABLE).map(([key, val]) => (
            <button 
              key={key} 
              onClick={() => { setShowCategories(false); setCurrentPage('subastas'); }}
              className="flex flex-col items-center gap-4 p-6 border border-white/5 hover:border-yellow-600/40 hover:bg-yellow-600/5 transition-all group"
            >
               <span className="text-3xl grayscale group-hover:grayscale-0 transition-all">{val.icon}</span>
               <div className="text-center">
                  <p className="text-[9px] uppercase font-bold tracking-widest text-gray-400 group-hover:text-yellow-500">{val.label[lang]}</p>
               </div>
            </button>
          ))}
       </div>
    </div>
  );

  const renderCreatorServices = () => (
    <div className="pt-32 pb-20 max-w-7xl mx-auto px-6">
       <div className="mb-16 text-center">
          <h2 className="text-5xl font-cinzel font-bold gold-gradient uppercase tracking-widest">Ecosistema Arquitecto</h2>
          <p className="text-gray-400 italic">Tus herramientas para materializar visiones y monetizar el vacío.</p>
       </div>
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { icon: '🏺', title: 'Subastar Proyecto', desc: 'Lanza tu idea o desarrollo al mercado curado de SUBREAL.', action: () => setCurrentPage('vender') },
            { icon: '🏷️', title: 'Venta Directa', desc: 'Publica activos listos para ser adquiridos sin esperas.', action: () => setCurrentPage('vender') },
            { icon: '📦', title: 'Paquetes de Tesoros', desc: 'Agrupa desarrollos menores en lotes de alto valor.', action: () => setCurrentPage('vender') },
            { icon: '🏛️', title: 'Perfil de Arquitecto', desc: 'Destaca en el muro y obtén insignias por tus logros.', action: () => setCurrentPage('arquitectos') },
            { icon: '🔒', title: 'Gestión Legal', desc: 'Contratos automáticos de cesión y renuncia de derechos.', action: () => setCurrentPage('mensajes') },
            { icon: '💵', title: 'Bóveda Escrow', desc: 'Controla tus pagos retenidos y liberaciones seguras.', action: () => setCurrentPage('mensajes') }
          ].map((serv, i) => (
            <div key={i} onClick={serv.action} className="bg-[#111] border border-white/5 p-10 cursor-pointer group hover:border-yellow-600/30 transition-all">
               <span className="text-4xl mb-6 block grayscale group-hover:grayscale-0 transition-all">{serv.icon}</span>
               <h3 className="text-xl font-cinzel font-bold mb-4 group-hover:text-yellow-500">{serv.title}</h3>
               <p className="text-gray-500 text-xs leading-relaxed italic">"{serv.desc}"</p>
            </div>
          ))}
       </div>
    </div>
  );

  const renderAuctioneerSubscription = () => (
    <div className="pt-32 pb-20 max-w-4xl mx-auto px-6">
       <div className="bg-[#111] border-2 border-yellow-600/30 p-12 text-center space-y-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-yellow-600 text-black px-8 py-2 text-[10px] font-bold uppercase tracking-widest rotate-45 translate-x-10 translate-y-6 shadow-2xl">
             {t('trial_offer')}
          </div>
          <h2 className="text-4xl font-cinzel font-bold gold-gradient uppercase tracking-widest">Programa de Subastadores</h2>
          <p className="text-gray-400 max-w-lg mx-auto italic">Obtén el privilegio de curar y listar objetos de terceros. Gana comisiones adicionales como intermediario del vacío.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8">
             <div className="bg-black/40 p-8 border border-white/10 text-left">
                <p className="text-[10px] uppercase font-bold text-yellow-600 mb-4">Privilegios</p>
                <ul className="text-[10px] text-gray-500 space-y-3 uppercase tracking-widest">
                   <li>• Curaduría de 10 objetos/mes</li>
                   <li>• Insignia de Subastador Real</li>
                   <li>• Panel de métricas avanzado</li>
                   <li>• Acceso a subastas secretas</li>
                </ul>
             </div>
             <div className="bg-black/40 p-8 border border-yellow-600/20 text-center flex flex-col justify-center">
                <p className="text-4xl font-bold font-cinzel text-white">${COMMISSIONS.AUCTIONEER_PROGRAM.monthly}<span className="text-xs text-gray-600">/mes</span></p>
                <p className="text-[8px] text-yellow-600 font-bold mt-2 uppercase tracking-[0.2em]">{t('trial_offer')}</p>
                <button className="mt-8 py-4 bg-yellow-600 text-black font-bold uppercase text-[10px] tracking-widest hover:scale-105 transition-all">
                   {t('subscription_btn')}
                </button>
             </div>
          </div>
       </div>
    </div>
  );

  const renderRegister = () => (
    <div className="pt-32 pb-20 flex items-center justify-center px-6 min-h-screen">
      <div className="bg-[#111] border border-yellow-600/20 p-12 max-w-2xl w-full shadow-2xl">
         <h2 className="text-4xl font-cinzel font-bold text-center mb-12 gold-gradient uppercase tracking-widest">Portal de Revelación</h2>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <button 
              onClick={() => setUserType('collector')}
              className={`p-8 border flex flex-col items-center gap-4 transition-all duration-500 ${userType === 'collector' ? 'border-yellow-500 bg-yellow-500/10' : 'border-white/10 hover:border-yellow-600/30'}`}
            >
               <div className="text-4xl">🏺</div>
               <p className="font-bold uppercase text-xs tracking-widest text-yellow-500">Coleccionista</p>
            </button>
            <button 
              onClick={() => setUserType('creator')}
              className={`p-8 border flex flex-col items-center gap-4 transition-all duration-500 ${userType === 'creator' ? 'border-yellow-500 bg-yellow-500/10' : 'border-white/10 hover:border-yellow-600/30'}`}
            >
               <div className="text-4xl">🛠️</div>
               <p className="font-bold uppercase text-xs tracking-widest text-yellow-500">Arquitecto</p>
            </button>
         </div>
         {userType && (
           <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <input 
                type="text" 
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Nombre Místico o Pseudónimo" 
                className="w-full bg-black border border-white/10 px-4 py-4 outline-none focus:border-yellow-500 text-sm font-cinzel tracking-widest" 
              />
              <button 
                onClick={handleLogin}
                className="w-full py-5 bg-yellow-600 text-black font-bold uppercase text-sm tracking-[0.4em] hover:bg-yellow-500 transition-all"
              >
                 Entrar al Vacío Dorado
              </button>
           </div>
         )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#050505] text-[#f5f5f5]">
      <Navbar 
        onNavigate={(p) => { 
          if(p === 'categories') setShowCategories(!showCategories); 
          else { setCurrentPage(p); setShowCategories(false); }
        }} 
        currentPage={currentPage} 
        lang={lang} 
        setLang={setLang} 
        isLoggedIn={isLoggedIn}
      />
      
      {renderCategoriesMenu()}

      <main className="animate-in fade-in duration-1000">
        {!isLoggedIn ? renderRegister() : (
          <>
            {currentPage === 'home' && (
              <div className="space-y-32">
                <section className="h-[95vh] flex flex-col items-center justify-center text-center px-4 relative overflow-hidden">
                  <div className="max-w-5xl z-10 space-y-12">
                    <h1 className="text-8xl md:text-[10rem] font-cinzel font-bold gold-gradient tracking-[0.4em] uppercase leading-none">{t('hero_title')}</h1>
                    <p className="text-xl md:text-2xl text-yellow-600/40 uppercase tracking-[0.8em] font-cinzel">{t('hero_subtitle')}</p>
                    <div className="flex flex-col md:flex-row gap-8 justify-center pt-8">
                       <button onClick={() => setCurrentPage('subastas')} className="px-16 py-6 bg-yellow-600 text-black font-bold uppercase text-xs tracking-[0.3em] hover:scale-105 transition-all glow-gold shadow-xl">Subastas</button>
                       <button onClick={() => setCurrentPage('creator_services')} className="px-16 py-6 border border-yellow-600 text-yellow-600 font-bold uppercase text-xs tracking-[0.3em] hover:bg-yellow-600/10 transition-all">Ecosistema Creador</button>
                    </div>
                  </div>
                </section>
                
                <section className="max-w-7xl mx-auto px-6 pb-32">
                   <div className="flex justify-between items-end mb-16 border-b border-white/5 pb-8">
                      <div>
                        <h2 className="text-4xl font-cinzel font-bold uppercase tracking-[0.2em]">{lang === 'es' ? 'Revelaciones' : 'Revelations'}</h2>
                      </div>
                      <button onClick={() => setShowCategories(true)} className="text-yellow-600 text-[10px] uppercase font-bold tracking-[0.2em] hover:underline">Filtrar por Categoría →</button>
                   </div>
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                      {MOCK_AUCTIONS.map(item => (
                        <AuctionCard key={item.id} item={item} onViewDetails={(i) => { setSelectedItem(i); setCurrentPage('detalle'); }} />
                      ))}
                   </div>
                </section>
              </div>
            )}
            {currentPage === 'creator_services' && renderCreatorServices()}
            {currentPage === 'subscription' && renderAuctioneerSubscription()}
            {currentPage === 'subastas' && (
              <div className="pt-40 px-6 max-w-7xl mx-auto pb-32">
                 <h2 className="text-5xl font-cinzel font-bold mb-20 gold-gradient uppercase tracking-widest text-center">Bóveda de Subastas</h2>
                 <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-10">
                    {MOCK_AUCTIONS.map(item => <AuctionCard key={item.id} item={item} onViewDetails={(i) => { setSelectedItem(i); setCurrentPage('detalle'); }} />)}
                 </div>
              </div>
            )}
            {currentPage === 'arquitectos' && (
               <div className="pt-40 px-6 max-w-7xl mx-auto pb-32">
                  <h2 className="text-5xl font-cinzel font-bold mb-20 gold-gradient uppercase tracking-widest text-center">{t('nav_creators')}</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                     {MOCK_CREATORS.map(c => (
                        <div key={c.id} className="bg-[#111] p-10 text-center border border-white/5">
                           <img src={c.photo} className="w-24 h-24 rounded-full mx-auto mb-6 grayscale" />
                           <h3 className="text-2xl font-cinzel font-bold mb-2">{c.name}</h3>
                           <p className="text-yellow-600 text-[8px] uppercase font-bold tracking-widest mb-6">{c.specialty}</p>
                           <div className="flex justify-center gap-2 mb-8">
                              {c.insignias.map(ins => <span key={ins} className="bg-white/5 px-2 py-1 text-[7px] uppercase tracking-tighter">🏆 {ins}</span>)}
                           </div>
                           <button onClick={() => setCurrentPage('mensajes')} className="w-full py-3 border border-white/20 text-[9px] uppercase font-bold">Enviar Mensaje</button>
                        </div>
                     ))}
                  </div>
               </div>
            )}
            {currentPage === 'mensajes' && (
               <div className="pt-40 px-6 max-w-5xl mx-auto pb-32">
                  <h2 className="text-4xl font-cinzel font-bold mb-10 gold-gradient uppercase tracking-widest">Centro de Negociación</h2>
                  {renderEscrowTracker()}
                  <div className="bg-[#111] h-[50vh] flex flex-col p-8 border border-white/5">
                     <div className="flex-1 overflow-y-auto space-y-4">
                        <div className="max-w-[80%] bg-white/5 p-4 rounded text-sm italic">"Los fondos para 'Reloj del Ser Errante' han sido asegurados en Escrow."</div>
                        <div className="max-w-[80%] ml-auto bg-yellow-600 text-black p-4 rounded text-sm font-bold">"Gracias. Procedo a la transferencia del diario y acceso al repositorio."</div>
                     </div>
                  </div>
               </div>
            )}
            {currentPage === 'vender' && (
               <div className="pt-40 px-6 max-w-4xl mx-auto pb-32">
                  <h2 className="text-5xl font-cinzel font-bold mb-10 gold-gradient uppercase tracking-widest text-center">Revelar Proyecto</h2>
                  <div className="bg-[#111] border border-white/5 p-12 space-y-10">
                     <div className="grid grid-cols-2 gap-8">
                        <div className="space-y-2">
                           <label className="text-[10px] uppercase font-bold text-gray-500">Categoría</label>
                           <select className="w-full bg-black border border-white/10 p-4 text-xs">
                              {Object.entries(PRICING_TABLE).map(([k, v]) => <option key={k} value={k}>{v.label[lang]}</option>)}
                           </select>
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] uppercase font-bold text-gray-500">Precio de Inicio</label>
                           <input type="number" className="w-full bg-black border border-white/10 p-4 text-xs" placeholder="$" />
                        </div>
                     </div>
                     <div className="p-8 border border-white/10 bg-black/40 space-y-4">
                        <h4 className="text-[10px] uppercase font-bold text-yellow-600">Servicios Incluidos</h4>
                        <div className="grid grid-cols-2 gap-4 text-[8px] uppercase tracking-widest text-gray-400">
                           <p>✓ Publicación en Muro</p>
                           <p>✓ Gestión de Derechos</p>
                           <p>✓ Protección Escrow</p>
                           <p>✓ Chat Privado Seguro</p>
                        </div>
                     </div>
                     <button className="w-full py-5 bg-yellow-600 text-black font-bold uppercase text-[10px] tracking-widest">Publicar Revelación</button>
                  </div>
               </div>
            )}
            {currentPage === 'perfil' && (
               <div className="pt-40 px-6 max-w-7xl mx-auto pb-32">
                  <div className="bg-[#111] p-16 text-center border border-white/5 shadow-2xl space-y-12">
                     <div className="relative inline-block">
                        <img src="https://i.pravatar.cc/150?u=me" className="w-40 h-40 rounded-full border-4 border-yellow-600 grayscale" />
                        <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-yellow-600 text-black px-6 py-1 text-[10px] font-bold uppercase tracking-widest">Nivel {userLevel}</span>
                     </div>
                     <h2 className="text-5xl font-cinzel font-bold gold-gradient">{userName}</h2>
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                        <div onClick={() => setCurrentPage('subscription')} className="p-10 bg-yellow-600/5 border border-yellow-600/20 cursor-pointer hover:bg-yellow-600/10 transition-all">
                           <p className="text-[10px] uppercase font-bold text-yellow-600 mb-4">Programa Subastador</p>
                           <p className="text-xl font-bold font-cinzel">Inscribirse</p>
                           <p className="text-[8px] text-gray-500 mt-2 uppercase">15 Días Gratis</p>
                        </div>
                        <div onClick={() => setCurrentPage('info')} className="p-10 bg-white/5 border border-white/10 cursor-pointer hover:bg-white/10 transition-all">
                           <p className="text-[10px] uppercase font-bold text-gray-400 mb-4">Membresía Coleccionista</p>
                           <p className="text-xl font-bold font-cinzel">Plan Actual: Errante</p>
                           <p className="text-[8px] text-yellow-600 mt-2 uppercase">Mejorar a Faro</p>
                        </div>
                        <div onClick={() => setCurrentPage('creator_services')} className="p-10 bg-white/5 border border-white/10 cursor-pointer hover:bg-white/10 transition-all">
                           <p className="text-[10px] uppercase font-bold text-gray-400 mb-4">Servicios Creador</p>
                           <p className="text-xl font-bold font-cinzel">Activos</p>
                           <p className="text-[8px] text-gray-500 mt-2 uppercase">Vender Ideas</p>
                        </div>
                     </div>
                  </div>
               </div>
            )}
            {currentPage === 'detalle' && selectedItem && (
               <div className="pt-40 pb-32 max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-24">
                  <div className="space-y-8">
                     <img src={selectedItem.imageUrl} className="w-full aspect-square object-cover border border-white/5 shadow-2xl" />
                     {selectedItem.demoUrl && <video src={selectedItem.demoUrl} controls className="w-full border border-white/10" />}
                  </div>
                  <div className="space-y-12">
                     <div className="space-y-4">
                        <span className="text-yellow-600 text-xs uppercase tracking-[0.4em] font-bold">#00{selectedItem.id} | {PRICING_TABLE[selectedItem.category].label[lang]}</span>
                        <h2 className="text-7xl font-cinzel font-bold uppercase gold-gradient">{selectedItem.title}</h2>
                     </div>
                     <div className="p-10 bg-[#111] border-l-4 border-yellow-600 italic text-gray-300 text-xl leading-relaxed">
                        "{selectedItem.diary}"
                     </div>
                     <div className="space-y-8">
                        <div className="flex justify-between items-end border-b border-white/5 pb-8">
                           <div>
                              <p className="text-[10px] uppercase text-gray-500 mb-2 font-bold">Puja Actual</p>
                              <p className="text-6xl font-cinzel">${selectedItem.currentBid}</p>
                           </div>
                           <div className="text-right">
                              <p className="text-[10px] uppercase text-gray-500 mb-2 font-bold">Puja Mínima Sugerida</p>
                              <p className="text-2xl font-cinzel text-yellow-600">${selectedItem.minBidSuggestion}</p>
                           </div>
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                           <button className="py-6 bg-yellow-600 text-black font-bold uppercase text-[10px] tracking-widest shadow-xl">Hacer Puja de Luz</button>
                           <button onClick={() => setCurrentPage('mensajes')} className="py-6 border border-white/20 text-white font-bold uppercase text-[10px] tracking-widest">Preguntar al Arquitecto</button>
                        </div>
                     </div>
                  </div>
               </div>
            )}
          </>
        )}
      </main>

      <LiveAssistant />

      <footer className="mt-40 pt-24 pb-12 border-t border-white/5 text-center bg-black/30 backdrop-blur-xl">
         <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-16 text-left mb-20">
            <div className="col-span-1 md:col-span-2">
               <h3 className="text-3xl font-cinzel gold-gradient font-bold mb-8 tracking-[0.4em]">SUBREAL</h3>
               <p className="text-gray-500 text-sm normal-case italic leading-relaxed max-w-sm">Ecosistema curado para el intercambio de visiones místicas y activos de alma. Protegido por Escrow Real.</p>
            </div>
            <div className="flex flex-col gap-4">
               <span className="text-yellow-600 text-[10px] uppercase font-bold tracking-[0.3em] mb-2">Comunidad</span>
               <button onClick={() => setCurrentPage('arquitectos')} className="text-[9px] uppercase tracking-widest text-gray-400 hover:text-white text-left transition-colors">Muro de Creadores</button>
               <button onClick={() => setCurrentPage('subscription')} className="text-[9px] uppercase tracking-widest text-gray-400 hover:text-white text-left transition-colors">Programa Subastador</button>
               <button onClick={() => setCurrentPage('perfil')} className="text-[9px] uppercase tracking-widest text-gray-400 hover:text-white text-left transition-colors">Niveles Errantes</button>
            </div>
            <div className="flex flex-col gap-4">
               <span className="text-yellow-600 text-[10px] uppercase font-bold tracking-[0.3em] mb-2">Legal</span>
               <button className="text-[9px] uppercase tracking-widest text-gray-400 hover:text-white text-left transition-colors">Términos de Cesión</button>
               <button className="text-[9px] uppercase tracking-widest text-gray-400 hover:text-white text-left transition-colors">Privacidad de Sombras</button>
               <button className="text-[9px] uppercase tracking-widest text-gray-400 hover:text-white text-left transition-colors">Garantía Escrow</button>
            </div>
         </div>
         <p className="text-[8px] uppercase tracking-[0.5em] text-gray-700 font-bold">© 2024 SUBREAL - Gilded Development Ecosystem | Revelation App</p>
      </footer>
    </div>
  );
};

export default App;
