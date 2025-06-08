'use client';

import { useEffect, useRef } from 'react';
import Matter from 'matter-js';
import type { BodyDef } from '@/types';

interface PhysicsCanvasProps {
  pieces: BodyDef[];
  breakMode: boolean;
  onUpdate: (positions: Record<
    string,
    { x: number; y: number; angle: number }
  >) => void;
}

export default function PhysicsCanvas({
  pieces,
  breakMode,
  onUpdate,
}: PhysicsCanvasProps) {
  const sceneRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<Matter.Engine>();
  const bodiesRef = useRef<Record<string, Matter.Body>>({});
  const constraintsRef = useRef<Record<string, Matter.Constraint[]>>({});
  const mouseConstraintRef = useRef<Matter.MouseConstraint>();
  const originalPositionsRef = useRef<Record<string, { x: number; y: number }>>({});

  useEffect(() => {
    // 1) Setup engine & world
    const engine = Matter.Engine.create();
    engine.gravity.y = 1;
    engineRef.current = engine;

    // 2) Setup renderer (hidden canvas)
    const render = Matter.Render.create({
      element: sceneRef.current!,
      engine,
      options: {
        width: sceneRef.current!.clientWidth,
        height: sceneRef.current!.clientHeight,
        wireframes: false,
        background: 'transparent',
      },
    });
    Matter.Render.run(render);

    // 3) Create mouse constraint for dragging
    const mouseElement = document.createElement('div');
    mouseElement.style.position = 'fixed';
    mouseElement.style.top = '0';
    mouseElement.style.left = '0';
    mouseElement.style.width = '100vw';
    mouseElement.style.height = '100vh';
    mouseElement.style.pointerEvents = 'auto';
    mouseElement.style.zIndex = '1001';
    document.body.appendChild(mouseElement);

    const mouse = Matter.Mouse.create(mouseElement);
    const mouseConstraint = Matter.MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.8,
        render: { visible: false },
      },
    });
    mouseConstraintRef.current = mouseConstraint;
    Matter.World.add(engine.world, mouseConstraint);

    // 4) Create bodies & pins
    const world = engine.world;
    const newBodies: Record<string, Matter.Body> = {};

    // Add ground at bottom of screen
    const ground = Matter.Bodies.rectangle(
      window.innerWidth / 2,
      window.innerHeight + 30,
      window.innerWidth,
      60,
      { isStatic: true, render: { visible: false } }
    );
    Matter.World.add(world, ground);

    pieces.forEach((p) => {
      const centerX = p.x + p.w / 2;
      const centerY = p.y + p.h / 2;

      // Store original position for snap-back
      originalPositionsRef.current[p.id] = { x: centerX, y: centerY };

      // 4a) Dynamic rectangle
      const box = Matter.Bodies.rectangle(centerX, centerY, p.w, p.h, {
        restitution: 0.3,
        friction: 0.1,
        label: `box-${p.id}`,
        render: { visible: false },
      });

      // 4b) Multiple pins for stability - positioned at corners for better swing
      const topLeftPin = Matter.Constraint.create({
        bodyA: box,
        pointA: { x: -p.w/3, y: -p.h/3 },
        pointB: { x: centerX - p.w/3, y: centerY - p.h/3 },
        stiffness: 1,
        length: 0,
        render: { visible: false },
      });

      const topRightPin = Matter.Constraint.create({
        bodyA: box,
        pointA: { x: p.w/3, y: -p.h/3 },
        pointB: { x: centerX + p.w/3, y: centerY - p.h/3 },
        stiffness: 1,
        length: 0,
        render: { visible: false },
      });

      // Single bottom pin for dramatic swing
      const bottomPin = Matter.Constraint.create({
        bodyA: box,
        pointA: { x: 0, y: 0 },
        pointB: { x: centerX, y: centerY },
        stiffness: 1,
        length: 0,
        render: { visible: false },
      });

      newBodies[p.id] = box;
      constraintsRef.current[p.id] = [topLeftPin, topRightPin, bottomPin];
      Matter.World.add(world, [box, topLeftPin, topRightPin, bottomPin]);
    });

    bodiesRef.current = newBodies;

    // 5) Listen for mouse events to handle snap-back
    Matter.Events.on(mouseConstraint, 'enddrag', (event) => {
      const body = event.body;
      if (!body || !body.label.startsWith('box-')) return;
      
      const pieceId = body.label.replace('box-', '');
      const originalPos = originalPositionsRef.current[pieceId];
      
      if (!originalPos) return;
      
      // Check if close to original position (within 80px)
      const distance = Math.sqrt(
        Math.pow(body.position.x - originalPos.x, 2) +
        Math.pow(body.position.y - originalPos.y, 2)
      );
      
      if (distance < 80) {
        // Snap back to original position and recreate constraints
        Matter.Body.setPosition(body, originalPos);
        Matter.Body.setVelocity(body, { x: 0, y: 0 });
        Matter.Body.setAngularVelocity(body, 0);
        Matter.Body.setAngle(body, 0);
        
        // Recreate the constraints
        const piece = pieces.find(p => p.id === pieceId);
        if (piece) {
          const centerX = originalPos.x;
          const centerY = originalPos.y;
          
          const topLeftPin = Matter.Constraint.create({
            bodyA: body,
            pointA: { x: -piece.w/3, y: -piece.h/3 },
            pointB: { x: centerX - piece.w/3, y: centerY - piece.h/3 },
            stiffness: 1,
            length: 0,
            render: { visible: false },
          });

          const topRightPin = Matter.Constraint.create({
            bodyA: body,
            pointA: { x: piece.w/3, y: -piece.h/3 },
            pointB: { x: centerX + piece.w/3, y: centerY - piece.h/3 },
            stiffness: 1,
            length: 0,
            render: { visible: false },
          });

          const bottomPin = Matter.Constraint.create({
            bodyA: body,
            pointA: { x: 0, y: 0 },
            pointB: { x: centerX, y: centerY },
            stiffness: 1,
            length: 0,
            render: { visible: false },
          });

          constraintsRef.current[pieceId] = [topLeftPin, topRightPin, bottomPin];
          Matter.World.add(engine.world, [topLeftPin, topRightPin, bottomPin]);
        }
      }
    });

    // 6) Sync positions after each update
    Matter.Events.on(engine, 'afterUpdate', () => {
      const pos: Record<string, { x: number; y: number; angle: number }> = {};
      for (const [id, body] of Object.entries(bodiesRef.current)) {
        pos[id] = {
          x: body.position.x,
          y: body.position.y,
          angle: body.angle,
        };
      }
      onUpdate(pos);
    });

    // 7) Runner
    const runner = Matter.Runner.create();
    Matter.Runner.run(runner, engine);

    // 8) Cleanup on unmount
    return () => {
      Matter.Render.stop(render);
      Matter.World.clear(world, false);
      Matter.Engine.clear(engine);
      render.canvas.remove();
      render.textures = {};
      if (mouseElement.parentNode) {
        mouseElement.parentNode.removeChild(mouseElement);
      }
    };
  }, []);

  // 9) Break: remove 2 pins immediately, then last pin with force for dramatic swing
  useEffect(() => {
    if (!breakMode) return;
    const world = engineRef.current!.world;
    
    // For each piece, remove 2 pins immediately and the last one after a delay with force
    Object.entries(constraintsRef.current).forEach(([pieceId, constraints], pieceIndex) => {
      const body = bodiesRef.current[pieceId];
      
      // Remove first 2 pins immediately to let it hang by the last pin
      setTimeout(() => {
        Matter.World.remove(world, constraints[0]);
        Matter.World.remove(world, constraints[1]);
        
        // Remove the last pin after delay and apply force for swing
        setTimeout(() => {
          Matter.World.remove(world, constraints[2]);
          
          // Apply a stronger force at the corner for dramatic swing
          const forceX = (Math.random() - 0.5) * 0.1; // Much stronger force
          const forceY = -0.02; // Stronger upward force
          const forcePoint = { 
            x: body.position.x + (Math.random() - 0.5) * 100, 
            y: body.position.y - 50 
          }; // Apply force away from center for torque
          Matter.Body.applyForce(body, forcePoint, { x: forceX, y: forceY });
        }, 800);
      }, pieceIndex * 300); // Stagger pieces by 300ms
    });
  }, [breakMode]);

  return (
    <div
      ref={sceneRef}
      className="absolute inset-0 pointer-events-none"
    />
  );
}
