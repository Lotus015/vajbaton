Extend Tailwind’s color palette
Open (or create) tailwind.config.js.

Under theme.extend.colors, add neon pinks and purples. For example:

js
Copy
Edit
// tailwind.config.js
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Base background
        synth: {
          900: '#0b0b12', // almost-black
          800: '#1a1a25',
        },
        // Neon accents
        neon: {
          pink: '#ff3cac',
          purple: '#9d00ff',
          cyan:  '#00f0ff',
        },
      },
      boxShadow: {
        // Neon “glow” shadows
        'neon-pink': '0 0 8px #ff3cac, 0 0 20px #ff3cac, 0 0 30px #ff3cac',
        'neon-purple': '0 0 8px #9d00ff, 0 0 20px #9d00ff, 0 0 30px #9d00ff',
        'neon-cyan': '0 0 8px #00f0ff, 0 0 20px #00f0ff, 0 0 30px #00f0ff',
      },
      fontFamily: {
        // Optional: a “retro” sans serif
        synthwave: ['"Orbitron"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
Make sure you’ve imported a suitable synthwave-style font (e.g. Orbitron) in your app/layout.tsx or global CSS:

tsx
Copy
Edit
// app/layout.tsx (or wherever you include global <head>)
import './globals.css';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&display=swap"
        />
      </head>
      <body className="bg-synth-900 font-synthwave">
        {children}
      </body>
    </html>
  );
}
2. Create reusable “neon” utilities
Even with extended colors, it’s handy to have one or two “glow” classes:

In your global CSS (e.g. globals.css), add:

css
Copy
Edit
/* globals.css */
@layer utilities {
  .neon-text-pink {
    @apply text-neon-pink drop-shadow-[0_0_4px_#ff3cac] drop-shadow-[0_0_12px_#ff3cac];
  }
  .neon-text-purple {
    @apply text-neon-purple drop-shadow-[0_0_4px_#9d00ff] drop-shadow-[0_0_12px_#9d00ff];
  }
  .neon-border-pink {
    border: 2px solid #ff3cac;
    box-shadow: 0 0 8px #ff3cac, 0 0 20px #ff3cac;
  }
  .neon-border-purple {
    border: 2px solid #9d00ff;
    box-shadow: 0 0 8px #9d00ff, 0 0 20px #9d00ff;
  }
}
Now you can do things like <h1 className="neon-text-pink text-4xl">Level 1</h1> or <div className="neon-border-purple p-4 rounded-lg">…</div>.

3. Style Shadcn components in synthwave theme
Shadcn UI components use Tailwind under the hood. You can override their default “variants” by wrapping them or by passing className directly. Here are some examples:

A. Neon-glow Button
tsx
Copy
Edit
// components/NeonButton.tsx
'use client'
import { Button } from '@shadcn/ui';

export default function NeonButton({ children, color = 'pink', ...props }) {
  const base =
    'px-6 py-2 font-semibold rounded-lg text-white transition ease-in-out duration-200';
  const neonClasses =
    color === 'pink'
      ? 'bg-transparent hover:bg-neon-pink neon-border-pink'
      : 'bg-transparent hover:bg-neon-purple neon-border-purple';

  return (
    <Button
      className={`${base} ${neonClasses}`}
      {...props}
    >
      {children}
    </Button>
  );
}
This button starts transparent with a neon border. On hover, it fills with that neon shade.

You can adjust hover:bg-neon-pink/20 or add opacity if you want a tinted glow.

B. Neon-accent Card
tsx
Copy
Edit
// components/NeonCard.tsx
'use client'
import { Card, CardContent } from '@shadcn/ui';

export default function NeonCard({ children, accent = 'purple', ...props }) {
  const borderColor =
    accent === 'purple' ? 'neon-border-purple' : 'neon-border-pink';
  return (
    <Card
      className={`bg-synth-800 ${borderColor} backdrop-blur-sm`}
      {...props}
    >
      <CardContent className="text-white">{children}</CardContent>
    </Card>
  );
}
A dark (synth-800) card with a neon-glow border.

backdrop-blur-sm (optional) helps that card “pop” over a darker background.

4. Global “neon grid” or “scanline” background
For extra retro flair, you can layer a subtle grid or scanlines behind everything:

Create a small SVG or CSS pattern. For example, add this to globals.css:

css
Copy
Edit
/* Add scanlines */
body::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: 
    linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
  background-size: 100% 4px, 4px 100%;
  pointer-events: none;
  z-index: 50;
}

/* Optional: subtle grid lines */
.neon-grid-bg {
  background-image:
    radial-gradient(circle at 50% 50%, rgba(255, 60, 172, 0.04) 1px, transparent 2px);
  background-size: 30px 30px;
}
Then wrap your main container (in app/layout.tsx) with neon-grid-bg:

tsx
Copy
Edit
// app/layout.tsx
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>…</head>
      <body className="bg-synth-900 font-synthwave neon-grid-bg">
        {children}
      </body>
    </html>
  );
}
The ::before scanlines layer sits above everything with low opacity, giving that CRT vibe.

The .neon-grid-bg on <body> puts a faint pink/purple grid.

5. Example: Synthwave-Styled HUD
tsx
Copy
Edit
// components/HUD.tsx 
'use client'
import { useEffect, useState } from 'react'
import useGameStore from '@/store/useGameStore'
import NeonButton from './NeonButton'

export default function HUD({ onBreak }) {
  const { time, broken } = useGameStore()
  const [displayTime, setDisplayTime] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setDisplayTime(time)
    }, 100)
    return () => clearInterval(interval)
  }, [time])

  return (
    <div className="absolute top-4 left-4 flex items-center space-x-4 z-50">
      <div className="text-neon-purple font-mono text-lg drop-shadow-neon-purple">
        {`Time: ${(displayTime / 1000).toFixed(2)}s`}
      </div>
      {!broken && (
        <NeonButton color="pink" onClick={onBreak}>
          Break All
        </NeonButton>
      )}
    </div>
  )
}
text-neon-purple gives a bright purple glow to the timer text.

We layer it over the dark synth-900 background so it really “pops.”

The NeonButton from above uses pink neon glows.

6. Putting It Into Your Level Pages
When you assemble your level pages (e.g. /app/levels/[levelId]/page.tsx), wrap everything in your black/pink/purple theme:

tsx
Copy
Edit
// app/levels/[levelId]/page.tsx
'use client'
import { useEffect, useState } from 'react'
import { levels } from '@/lib/levelConfigs'
import PhysicsCanvas from '@/components/PhysicsCanvas'
import HUD from '@/components/HUD'
import useGameStore from '@/store/useGameStore'

export default function LevelPage({ params }) {
  const levelNum = parseInt(params.levelId, 10)
  const config = levels[levelNum]
  const [positions, setPositions] = useState({})
  const [snapped, setSnapped] = useState(new Set())
  const { time, startTimer, stopTimer, broken, setBroken } = useGameStore()

  useEffect(() => {
    startTimer()
    return () => stopTimer()
  }, [])

  const handleSnapped = (id) => {
    setSnapped((prev) => new Set(prev).add(id))
  }
  const allSnapped = config.every((c) => snapped.has(c.id))

  return (
    <div className="relative w-full h-screen bg-synth-900 overflow-hidden">
      {/* Example: a NeonCard as “level container” */}
      <div className="absolute inset-0 p-8">
        <div className="neon-border-purple rounded-xl p-6 bg-synth-800">
          <h2 className="text-2xl neon-text-pink mb-4">
            Level {levelNum}: Rebuild the Synth Card
          </h2>
          {/* … any instructions you want overlaid here … */}
        </div>
      </div>

      {/* Shadcn pieces, styled with neon classes */}
      {config.map((piece) => {
        const pos = positions[piece.id] || {
          x: piece.x + piece.w / 2,
          y: piece.y + piece.h / 2,
          angle: 0,
        }
        const isSnapped = snapped.has(piece.id)
        return (
          <div
            key={piece.id}
            id={piece.id}
            className={`
              absolute
              bg-synth-800
              ${isSnapped ? 'opacity-50' : ''}
              neon-border-pink
              rounded-md
            `}
            style={{
              width: piece.w,
              height: piece.h,
              transform: `translate(${pos.x - piece.w / 2}px, ${pos.y - piece.h / 2}px) rotate(${pos.angle}rad)`,
              transformOrigin: 'center',
              cursor: broken && !isSnapped ? 'grab' : 'default',
              pointerEvents: broken && !isSnapped ? 'auto' : 'none',
            }}
          >
            <div className="flex items-center justify-center h-full">
              <span className="neon-text-pink">{piece.id}</span>
            </div>
          </div>
        )
      })}

      {/* Physics layer sits over the pieces */}
      <PhysicsCanvas
        bodies={config}
        shouldBreak={broken}
        onBodiesUpdate={(p) => setPositions(p)}
        onPieceSnapped={handleSnapped}
      />

      {/* Neon HUD */}
      <HUD onBreak={() => setBroken(true)} />
      {/* Once done snapping: show a neon “Finish” button */}
      {allSnapped && (
        <button
          className="absolute bottom-8 right-8 px-8 py-3 bg-transparent neon-border-purple text-neon-purple rounded-lg drop-shadow-neon-purple hover:bg-neon-purple/20 transition"
          onClick={() => {
            stopTimer()
            // navigate to finish screen…
          }}
        >
          Finish Level
        </button>
      )}
    </div>
  )
}
Notice how every “piece” is on bg-synth-800 (a dark purple/gray), with a pink neon border.

The <HUD> sits in the top-left with neon-glow text and button.

The entire page is bg-synth-900.

7. Neon Animations (Bonus Flourish)
If you want a quick “flicker” effect on your neon text or border:

Add a small keyframes snippet in globals.css:

css
Copy
Edit
@keyframes neon-flicker {
  0%, 19%, 21%, 23%, 25%, 54%, 56%, 100% {
    text-shadow: 0 0 4px var(--tw-text-opacity), 0 0 20px var(--tw-text-opacity);
    opacity: 1;
  }
  20%, 24%, 55% {
    text-shadow: none;
    opacity: 0.7;
  }
}
.flicker {
  animation: neon-flicker 2s infinite ease-in-out;
}
Then simply add flicker to any neon text or border piece, e.g. <h1 className="neon-text-pink flicker">Level 1</h1>.

8. Summary
Tailwind Config

Extend with synth-900/800 for backgrounds and neon-pink, neon-purple, neon-cyan.

Add custom boxShadow keys like neon-pink, neon-purple for that glowing halo.

Global Utilities

In globals.css, define .neon-text-pink, .neon-border-purple, etc., using Tailwind’s @apply and custom drop-shadow or direct box-shadow.

Shadcn Overrides

Wrap Button, Card, or any Shadcn component with your own <NeonButton> and <NeonCard> that use those neon classes.

Page Layout

Set <body className="bg-synth-900 font-synthwave"> (plus optional .neon-grid-bg) so it’s always dark background with a subtle retro grid.

Place Shadcn pieces inside containers that use bg-synth-800 and neon borders/text.

Optional

Add a scanline overlay via body::before for that old-monitor feel.

Apply a small flicker animation to any neon text with a flicker class.

With these tweaks, every button, card, and text block will glow in pinks/purples on a jet-black canvas—exactly the synthwave-cyberpunk mood you’re after. Enjoy experimenting with neon gradients (e.g. bg-gradient-to-r from-neon-pink to-neon-purple) for headings or progress bars, and let the glow shine!