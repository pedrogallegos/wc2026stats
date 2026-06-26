'use client';

import { GroupStanding } from '@/types';
import { useLanguage } from '@/context/LanguageContext';

interface Props {
  groupStanding: GroupStanding;
}

export default function StandingsTable({ groupStanding }: Props) {
  const { language, tTeam } = useLanguage();
  
  if (!groupStanding || !groupStanding.table || groupStanding.table.length === 0) return null;

  return (
    <div className="glass rounded-xl overflow-hidden shadow-lg mb-8 transition-transform hover:scale-[1.01] duration-300">
      <div className="bg-slate-800/80 px-4 py-3 border-b border-white/10">
        <h3 className="text-xl font-bold text-white tracking-wide">
          {language === 'es' ? groupStanding.group.replace('Group', 'Grupo') : groupStanding.group}
        </h3>
      </div>
      <div className="w-full">
        <table className="w-full text-xs sm:text-sm text-left table-fixed">
          <thead className="text-[10px] sm:text-xs uppercase bg-black/20 text-slate-300">
            <tr>
              <th scope="col" className="w-6 sm:w-8 px-1 sm:px-2 py-2 sm:py-3 text-center">#</th>
              <th scope="col" className="w-full px-1 sm:px-2 py-2 sm:py-3">{language === 'es' ? 'Equipo' : 'Team'}</th>
              <th scope="col" className="w-6 sm:w-8 px-1 sm:px-2 py-2 sm:py-3 text-center">P</th>
              <th scope="col" className="w-6 sm:w-8 px-1 sm:px-2 py-2 sm:py-3 text-center hidden min-[450px]:table-cell">W</th>
              <th scope="col" className="w-6 sm:w-8 px-1 sm:px-2 py-2 sm:py-3 text-center hidden min-[450px]:table-cell">D</th>
              <th scope="col" className="w-6 sm:w-8 px-1 sm:px-2 py-2 sm:py-3 text-center hidden min-[450px]:table-cell">L</th>
              <th scope="col" className="w-7 sm:w-10 px-1 sm:px-2 py-2 sm:py-3 text-center">GD</th>
              <th scope="col" className="w-7 sm:w-10 px-1 sm:px-2 py-2 sm:py-3 text-center font-bold text-sky-400">Pts</th>
            </tr>
          </thead>
          <tbody>
            {groupStanding.table.map((row, index) => (
              <tr 
                key={row.team.id} 
                className={`border-b border-white/5 transition-colors hover:bg-white/5 ${
                  index < 2 ? 'bg-emerald-500/10' : index === 2 ? 'bg-amber-500/10' : ''
                }`}
              >
                <td className="px-1 sm:px-3 py-2 sm:py-3 text-center font-semibold">{row.position}</td>
                <td className="px-1 sm:px-3 py-2 sm:py-3 flex items-center gap-1.5 sm:gap-3 overflow-hidden">
                  <div className="w-5 h-5 sm:w-6 sm:h-6 relative rounded-full overflow-hidden bg-slate-800 flex-shrink-0 flex items-center justify-center border border-white/10">
                    <img 
                      src={row.team.crest} 
                      alt={row.team.name}
                      className="object-contain w-full h-full bg-white"
                    />
                  </div>
                  <span className="font-medium truncate text-[11px] sm:text-sm">{tTeam(row.team.name)}</span>
                </td>
                <td className="px-1 sm:px-3 py-2 sm:py-3 text-center">{row.playedGames}</td>
                <td className="px-1 sm:px-3 py-2 sm:py-3 text-center hidden min-[450px]:table-cell">{row.won}</td>
                <td className="px-1 sm:px-3 py-2 sm:py-3 text-center hidden min-[450px]:table-cell">{row.draw}</td>
                <td className="px-1 sm:px-3 py-2 sm:py-3 text-center hidden min-[450px]:table-cell">{row.lost}</td>
                <td className="px-1 sm:px-3 py-2 sm:py-3 text-center font-mono">{row.goalDifference > 0 ? `+${row.goalDifference}` : row.goalDifference}</td>
                <td className="px-1 sm:px-3 py-2 sm:py-3 text-center font-bold text-sky-400">{row.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
