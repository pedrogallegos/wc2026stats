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
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
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
      </div>
    </div>
  );
}
