'use client';

import { TableRow } from '@/types';
import { useLanguage } from '@/context/LanguageContext';

interface Props {
  qualified: TableRow[];
  eliminated: TableRow[];
}

export default function ThirdPlaceTable({ qualified, eliminated }: Props) {
  const { language, tTeam } = useLanguage();
  const allTeams = [...qualified, ...eliminated];

  return (
    <div className="glass rounded-xl overflow-hidden shadow-2xl mb-12 border border-emerald-500/20">
      <div className="bg-gradient-to-r from-emerald-900/50 to-teal-900/50 px-6 py-5 border-b border-white/10">
        <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-200">
          {language === 'es' ? 'Mejores Terceros Lugares' : 'Best Third-Placed Teams'}
        </h2>
        <p className="text-slate-300 text-sm mt-1">
          {language === 'es' ? 'Los 8 mejores avanzan a Dieciseisavos' : 'Top 8 teams qualify for the Round of 32'}
        </p>
      </div>
      
      <div className="overflow-hidden">
        {/* Desktop Table */}
        <table className="hidden md:table w-full text-sm text-left">
          <thead className="text-xs uppercase bg-black/30 text-slate-300">
            <tr>
              <th scope="col" className="px-6 py-4">#</th>
              <th scope="col" className="px-6 py-4">Grp</th>
              <th scope="col" className="px-6 py-4">{language === 'es' ? 'Equipo' : 'Team'}</th>
              <th scope="col" className="px-6 py-4 text-center">Pts</th>
              <th scope="col" className="px-6 py-4 text-center">GD</th>
              <th scope="col" className="px-6 py-4 text-center">GF</th>
              <th scope="col" className="px-6 py-4 text-center">{language === 'es' ? 'Estado' : 'Status'}</th>
            </tr>
          </thead>
          <tbody>
            {allTeams.map((row, index) => {
              const isQualified = index < 8;
              return (
                <tr 
                  key={row.team.id} 
                  className={`border-b border-white/5 transition-colors hover:bg-white/10 ${
                    isQualified ? 'bg-emerald-500/5' : 'bg-red-500/5'
                  }`}
                >
                  <td className="px-6 py-4 font-semibold">{index + 1}</td>
                  <td className="px-6 py-4 font-mono text-slate-400">{row.groupName?.replace('GROUP_', '') || '-'}</td>
                  <td className="px-6 py-4 flex items-center gap-3">
                    <div className="w-8 h-8 relative rounded-full overflow-hidden bg-white flex-shrink-0 border border-white/10 shadow-sm flex items-center justify-center">
                      <img 
                        src={row.team.crest} 
                        alt={row.team.name}
                        className="object-contain w-full h-full p-1"
                      />
                    </div>
                    <span className="font-semibold text-base">{tTeam(row.team.name)}</span>
                  </td>
                  <td className="px-6 py-4 text-center font-bold text-emerald-400 text-lg">{row.points}</td>
                  <td className="px-6 py-4 text-center font-mono">{row.goalDifference > 0 ? `+${row.goalDifference}` : row.goalDifference}</td>
                  <td className="px-6 py-4 text-center font-mono">{row.goalsFor}</td>
                  <td className="px-6 py-4 text-center">
                    {isQualified ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                        {language === 'es' ? 'Clasificado' : 'Qualified'}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-red-500/20 text-red-300 border border-red-500/30">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>
                        {language === 'es' ? 'Eliminado' : 'Eliminated'}
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Mobile Cards List */}
        <div className="md:hidden flex flex-col p-4 gap-4 bg-black/10">
          {allTeams.map((row, index) => {
            const isQualified = index < 8;
            return (
              <div 
                key={row.team.id}
                className={`flex flex-col gap-3 p-4 rounded-xl border ${
                  isQualified ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-red-500/5 border-red-500/20'
                }`}
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <span className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold ${isQualified ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                      {index + 1}
                    </span>
                    <div className="w-8 h-8 relative rounded-full overflow-hidden bg-white flex-shrink-0 border border-white/10 shadow-sm flex items-center justify-center">
                      <img 
                        src={row.team.crest} 
                        alt={row.team.name}
                        className="object-contain w-full h-full p-1"
                      />
                    </div>
                    <span className="font-bold text-lg">{tTeam(row.team.name)}</span>
                  </div>
                  
                  {isQualified ? (
                    <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                      {language === 'es' ? 'Clasificado' : 'Qualified'}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-red-500/20 text-red-300 border border-red-500/30">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>
                      {language === 'es' ? 'Eliminado' : 'Eliminated'}
                    </span>
                  )}
                </div>
                
                <div className="grid grid-cols-4 gap-2 text-center bg-black/20 p-3 rounded-lg border border-white/5">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Grp</span>
                    <span className="font-mono mt-1 text-slate-200">{row.groupName?.replace('GROUP_', '') || '-'}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-emerald-400/80 font-bold uppercase">Pts</span>
                    <span className="font-black mt-1 text-emerald-400 text-lg leading-none">{row.points}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">GD</span>
                    <span className="font-mono mt-1 text-slate-200">{row.goalDifference > 0 ? `+${row.goalDifference}` : row.goalDifference}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">GF</span>
                    <span className="font-mono mt-1 text-slate-200">{row.goalsFor}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
