import { supabase } from '@/lib/supabaseClient';
import { notFound } from 'next/navigation';
import Level1Newsletter from '@/components/levels/Level1';
import Level2FeatureSection from '@/components/levels/Level2';
import Level3NavbarHeroFooter from '@/components/levels/Level3';
import Level4FormModal from '@/components/levels/Level4';

interface ViewPageProps {
  params: Promise<{ id: string }>;
}

async function getLayout(id: string) {
  const { data, error } = await supabase
    .from('layouts')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) {
    return null;
  }

  return data;
}

export default async function ViewPage({ params }: ViewPageProps) {
  const { id } = await params;
  const layout = await getLayout(id);

  if (!layout) {
    notFound();
  }

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const centiseconds = Math.floor((ms % 1000) / 10);
    return `${seconds}.${centiseconds.toString().padStart(2, '0')}s`;
  };

  const renderLevel = () => {
    switch (layout.level_id) {
      case 1:
        return <Level1Newsletter positions={layout.positions} />;
      case 2:
        return <Level2FeatureSection positions={layout.positions} />;
      case 3:
        return <Level3NavbarHeroFooter positions={layout.positions} />;
      case 4:
        return <Level4FormModal positions={layout.positions} />;
      default:
        return (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-neon-cyan text-2xl">Level {layout.level_id}</div>
          </div>
        );
    }
  };

  return (
    <div className="relative w-screen h-screen bg-synth-950 cyber-grid scanlines overflow-hidden">
      {/* Header with level info */}
      <div className="fixed top-4 left-4 right-4 z-50 flex justify-between items-start">
        <div className="glass border-neon-cyan/30 shadow-2xl rounded-lg p-4">
          <h1 className="text-2xl font-bold gradient-text mb-2">
            {layout.level_name}
          </h1>
          <div className="text-neon-cyan text-sm">
            Completed in {formatTime(layout.completion_time)}
          </div>
          <div className="text-muted-foreground text-xs mt-1">
            Created {new Date(layout.created_at).toLocaleDateString()}
          </div>
        </div>
        
        <div className="glass border-neon-purple/30 shadow-2xl rounded-lg p-4">
          <div className="text-neon-purple text-sm font-semibold mb-2">
            🎮 Play Yourself
          </div>
          <a 
            href="/"
            className="text-neon-cyan hover:text-neon-pink transition-colors text-sm underline"
          >
            Try the game →
          </a>
        </div>
      </div>

      {/* Render the completed level */}
      {renderLevel()}
    </div>
  );
}
