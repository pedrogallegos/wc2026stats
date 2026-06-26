'use client';

import React from 'react';
import PageHeader from '@/components/PageHeader';
import { useLanguage } from '@/context/LanguageContext';
import T from '@/components/T';

const venues = [
  { id: 'azteca', name: 'Estadio Azteca', city: 'Mexico City', country: 'Mexico', capacity: 83000, img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Vista_a%C3%A9rea_del_Estadio_Azteca_-_2026_-_02.jpg/960px-Vista_a%C3%A9rea_del_Estadio_Azteca_-_2026_-_02.jpg' },
  { id: 'metlife', name: 'MetLife Stadium', city: 'New York/New Jersey', country: 'USA', capacity: 82500, img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/Metlife_stadium_%28Aerial_view%29.jpg/960px-Metlife_stadium_%28Aerial_view%29.jpg' },
  { id: 'att', name: 'AT&T Stadium', city: 'Dallas', country: 'USA', capacity: 80000, img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/Arlington_June_2020_4_%28AT%26T_Stadium%29.jpg/960px-Arlington_June_2020_4_%28AT%26T_Stadium%29.jpg' },
  { id: 'arrowhead', name: 'Arrowhead Stadium', city: 'Kansas City', country: 'USA', capacity: 76400, img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Arrowhead_stadium_2008.jpg/960px-Arrowhead_stadium_2008.jpg' },
  { id: 'nrg', name: 'NRG Stadium', city: 'Houston', country: 'USA', capacity: 72200, img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Nrg_stadium.jpg/960px-Nrg_stadium.jpg' },
  { id: 'mercedes', name: 'Mercedes-Benz Stadium', city: 'Atlanta', country: 'USA', capacity: 71000, img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Mercedes_Benz_Stadium_time_lapse_capture_2017-08-13.jpg/960px-Mercedes_Benz_Stadium_time_lapse_capture_2017-08-13.jpg' },
  { id: 'sofi', name: 'SoFi Stadium', city: 'Los Angeles', country: 'USA', capacity: 70240, img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/SoFi_Stadium_2023.jpg/960px-SoFi_Stadium_2023.jpg' },
  { id: 'linc', name: 'Lincoln Financial Field', city: 'Philadelphia', country: 'USA', capacity: 69796, img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a1/Lincoln_Financial_Field_%28Aerial_view%29.jpg/960px-Lincoln_Financial_Field_%28Aerial_view%29.jpg' },
  { id: 'lumen', name: 'Lumen Field', city: 'Seattle', country: 'USA', capacity: 69000, img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/2026_FIFA_World_Cup_-_Belgium_v._Egypt_in_Seattle_-_04.jpg/960px-2026_FIFA_World_Cup_-_Belgium_v._Egypt_in_Seattle_-_04.jpg' },
  { id: 'levis', name: 'Levi\'s Stadium', city: 'San Francisco Bay Area', country: 'USA', capacity: 68500, img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Levi%27s_Stadium_in_February_2016_prior_to_Super_Bowl_50_%2824398261729%29.jpg/960px-Levi%27s_Stadium_in_February_2016_prior_to_Super_Bowl_50_%2824398261729%29.jpg' },
  { id: 'gillette', name: 'Gillette Stadium', city: 'Boston', country: 'USA', capacity: 65878, img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/db/Gillette_Stadium_%28Top_View%29.jpg/960px-Gillette_Stadium_%28Top_View%29.jpg' },
  { id: 'hardrock', name: 'Hard Rock Stadium', city: 'Miami', country: 'USA', capacity: 64767, img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/Hard_Rock_Stadium_for_Super_Bowl_LIV_%2849606710103%29.jpg/960px-Hard_Rock_Stadium_for_Super_Bowl_LIV_%2849606710103%29.jpg' },
  { id: 'bcplace', name: 'BC Place', city: 'Vancouver', country: 'Canada', capacity: 54500, img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/ff/BC_Place_2015_Women%27s_FIFA_World_Cup.jpg/960px-BC_Place_2015_Women%27s_FIFA_World_Cup.jpg' },
  { id: 'bmo', name: 'BMO Field', city: 'Toronto', country: 'Canada', capacity: 45000, img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Toronto_BMO_Field_in_2024.jpg/960px-Toronto_BMO_Field_in_2024.jpg' },
  { id: 'akron', name: 'Estadio Akron', city: 'Guadalajara', country: 'Mexico', capacity: 49850, img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Estadio_Akron_02-07-2022_cabecera_sur_lado_derecho_%283%29.jpg/960px-Estadio_Akron_02-07-2022_cabecera_sur_lado_derecho_%283%29.jpg' },
  { id: 'bbva', name: 'Estadio BBVA', city: 'Monterrey', country: 'Mexico', capacity: 53500, img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/Mexico_Guadalupe_Monterrey_Estadio_BBVA_Bancomer_fifa_world_cup_2026_6.JPG/960px-Mexico_Guadalupe_Monterrey_Estadio_BBVA_Bancomer_fifa_world_cup_2026_6.JPG' }
];

export default function VenuesPage() {
  const { tTeam, t } = useLanguage();

  return (
    <main className="p-4 md:p-8 lg:p-12 pb-24 max-w-[1600px] mx-auto w-full animate-in fade-in duration-500">
      <PageHeader titleKey="venues" descKey="venuesDesc" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {venues.map((venue) => (
          <div key={venue.id} className="glass rounded-xl overflow-hidden group hover:scale-[1.02] transition-transform duration-300 border border-white/10 hover:border-sky-500/50">
            <div className="h-48 overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent z-10" />
              <img 
                src={venue.img} 
                alt={venue.name} 
                onError={(e) => {
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&q=80&w=800'; // Generic stadium fallback
                }}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80"
              />
              <div className="absolute bottom-3 left-4 z-20 flex items-center gap-2">
                {venue.country === 'Mexico' && <span className="text-xl">🇲🇽</span>}
                {venue.country === 'USA' && <span className="text-xl">🇺🇸</span>}
                {venue.country === 'Canada' && <span className="text-xl">🇨🇦</span>}
                <span className="font-bold text-white drop-shadow-md">{tTeam(venue.country)}</span>
              </div>
            </div>
            <div className="p-5 bg-slate-900/80">
              <h3 className="text-xl font-bold text-sky-400 mb-1">{venue.name}</h3>
              <p className="text-slate-300 mb-3 flex items-center gap-1.5">
                <span className="text-slate-500">📍</span> {venue.city}
              </p>
              <div className="flex items-center justify-between border-t border-white/5 pt-3 mt-3">
                <span className="text-xs text-slate-500 uppercase font-semibold">{t('capacity')}</span>
                <span className="font-mono text-emerald-400 font-bold">{venue.capacity.toLocaleString()}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
