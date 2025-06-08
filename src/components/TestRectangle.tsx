'use client';

const TestRectangle = () => {
  return (
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
      <div
        className="w-32 h-16 bg-neon-pink border-2 border-neon-cyan rounded-lg flex items-center justify-center text-white font-bold"
        data-physics-piece="test-rect"
      >
        TEST
      </div>
    </div>
  );
};

export default TestRectangle;
