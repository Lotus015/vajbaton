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
  onPieceSnapped?: (pieceId: string) => void;
  onStartDrag?: (pieceId: string) => void;
  onSpacebarSnap?: (pieceId: string) => void;
}

export default function PhysicsCanvas({
  pieces,
  breakMode,
  onUpdate,
  onPieceSnapped,
  onStartDrag,
  onSpacebarSnap,
}: PhysicsCanvasProps) {
  const sceneRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  const bodiesRef = useRef<Record<string, Matter.Body>>({});
  const constraintsRef = useRef<Record<string, Matter.Constraint[]>>({});
  const mouseConstraintRef = useRef<Matter.MouseConstraint | null>(null);
  const originalPositionsRef = useRef<Record<string, { x: number; y: number }>>({});
  
  // Anti-gravity state for Level 5
  const antiGravityBodiesRef = useRef<Record<string, Matter.Body>>({});
  const hasMovedRef = useRef<Record<string, boolean>>({});

  // Use refs to hold the latest callbacks to avoid stale closures
  const onPieceSnappedRef = useRef(onPieceSnapped);
  const onStartDragRef = useRef(onStartDrag);
  const onSpacebarSnapRef = useRef(onSpacebarSnap);

  // Keep refs updated with latest callbacks
  useEffect(() => {
    onPieceSnappedRef.current = onPieceSnapped;
    onStartDragRef.current = onStartDrag;
    onSpacebarSnapRef.current = onSpacebarSnap;
  }, [onPieceSnapped, onStartDrag, onSpacebarSnap]);

  useEffect(() => {
    console.log('🔄 PhysicsCanvas main effect triggered - pieces changed:', pieces.map(p => p.id));
    
    // Clear refs on level change to prevent old data interference
    bodiesRef.current = {};
    constraintsRef.current = {};
    originalPositionsRef.current = {};
    antiGravityBodiesRef.current = {};
    hasMovedRef.current = {};

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
    mouseElement.style.zIndex = '49'; // Lower than modal z-index (50);
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
    
    // Add top wall
    const topWall = Matter.Bodies.rectangle(
      window.innerWidth / 2,
      -30,
      window.innerWidth,
      60,
      { isStatic: true, render: { visible: false } }
    );
    
    // Add left and right walls
    const leftWall = Matter.Bodies.rectangle(
      -30,
      window.innerHeight / 2,
      60,
      window.innerHeight,
      { isStatic: true, render: { visible: false } }
    );
    
    const rightWall = Matter.Bodies.rectangle(
      window.innerWidth + 30,
      window.innerHeight / 2,
      60,
      window.innerHeight,
      { isStatic: true, render: { visible: false } }
    );
    
    Matter.World.add(world, [ground, topWall, leftWall, rightWall]);

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
    console.log('✅ Physics setup complete. Bodies:', Object.keys(bodiesRef.current), 'Constraints:', Object.keys(constraintsRef.current));

    // 5) Listen for mouse events to handle snap-back
    const snapPieceBack = (body: Matter.Body) => {
      if (!body || !body.label.startsWith('box-')) return false;
      
      const pieceId = body.label.replace('box-', '');
      const originalPos = originalPositionsRef.current[pieceId];
      
      if (!originalPos) return false;
      
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
        
        // Remove anti-gravity body if it exists
        if (antiGravityBodiesRef.current[pieceId]) {
          Matter.World.remove(engine.world, antiGravityBodiesRef.current[pieceId]);
          delete antiGravityBodiesRef.current[pieceId];
          hasMovedRef.current[pieceId] = false;
        }
        
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
          
          if (onPieceSnappedRef.current) {
            onPieceSnappedRef.current(pieceId);
          }
        }
        return true;
      }
      return false;
    };

    Matter.Events.on(mouseConstraint, 'enddrag', (event: any) => {
      snapPieceBack(event.body);
    });

    // Add startdrag event listener for tutorial and anti-gravity
    Matter.Events.on(mouseConstraint, 'startdrag', (event: any) => {
      const body = event.body;
      if (body && body.label.startsWith('box-') && onStartDragRef.current) {
        const pieceId = body.label.replace('box-', '');
        onStartDragRef.current(pieceId);
        
        // Level 5 anti-gravity: Create invisible repulsive body on first move
        if (!hasMovedRef.current[pieceId]) {
          hasMovedRef.current[pieceId] = true;
          const originalPos = originalPositionsRef.current[pieceId];
          
          if (originalPos) {
            // Create invisible static body at original position
            const antiGravityBody = Matter.Bodies.circle(
              originalPos.x,
              originalPos.y,
              40, // Radius of repulsion
              {
                isStatic: true,
                isSensor: true, // Won't collide but can detect proximity
                render: { visible: false },
                label: `antigrav-${pieceId}`
              }
            );
            
            antiGravityBodiesRef.current[pieceId] = antiGravityBody;
            Matter.World.add(engine.world, antiGravityBody);
          }
        }
      }
    });

    // Add spacebar listener for manual snap-back
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === 'Space') {
        event.preventDefault();
        const draggedBody = mouseConstraint.body;
        if (draggedBody && draggedBody.label.startsWith('box-')) {
          // Pin the piece at its current position
          const pieceId = draggedBody.label.replace('box-', '');
          const piece = pieces.find(p => p.id === pieceId);
          
          if (piece) {
            // Stop the body's movement
            Matter.Body.setVelocity(draggedBody, { x: 0, y: 0 });
            Matter.Body.setAngularVelocity(draggedBody, 0);
            
            // Create new constraints at current position
            const currentX = draggedBody.position.x;
            const currentY = draggedBody.position.y;
            
            const topLeftPin = Matter.Constraint.create({
              bodyA: draggedBody,
              pointA: { x: -piece.w/3, y: -piece.h/3 },
              pointB: { x: currentX - piece.w/3, y: currentY - piece.h/3 },
              stiffness: 1,
              length: 0,
              render: { visible: false },
            });

            const topRightPin = Matter.Constraint.create({
              bodyA: draggedBody,
              pointA: { x: piece.w/3, y: -piece.h/3 },
              pointB: { x: currentX + piece.w/3, y: currentY - piece.h/3 },
              stiffness: 1,
              length: 0,
              render: { visible: false },
            });

            const bottomPin = Matter.Constraint.create({
              bodyA: draggedBody,
              pointA: { x: 0, y: 0 },
              pointB: { x: currentX, y: currentY },
              stiffness: 1,
              length: 0,
              render: { visible: false },
            });

            constraintsRef.current[pieceId] = [topLeftPin, topRightPin, bottomPin];
            Matter.World.add(engine.world, [topLeftPin, topRightPin, bottomPin]);
            
            // Notify tutorial system with latest callback
            if (onSpacebarSnapRef.current) {
              onSpacebarSnapRef.current(pieceId);
            }
          }
        }
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);

    // 6) Sync positions and apply anti-gravity forces
    Matter.Events.on(engine, 'afterUpdate', () => {
      const pos: Record<string, { x: number; y: number; angle: number }> = {};
      for (const [id, body] of Object.entries(bodiesRef.current)) {
        if (body && body.position) { // Add defensive check
          pos[id] = {
            x: body.position.x,
            y: body.position.y,
            angle: body.angle,
          };
          
          // Apply anti-gravity force if anti-gravity body exists
          const antiGravityBody = antiGravityBodiesRef.current[id];
          if (antiGravityBody) {
            const distance = Math.sqrt(
              Math.pow(body.position.x - antiGravityBody.position.x, 2) +
              Math.pow(body.position.y - antiGravityBody.position.y, 2)
            );
            
            // Apply repulsive force when within range (stronger when closer)
            if (distance < 120 && distance > 0) {
              const forceStrength = 0.0008 * (120 - distance) / distance; // Stronger when closer
              const forceX = (body.position.x - antiGravityBody.position.x) * forceStrength;
              const forceY = (body.position.y - antiGravityBody.position.y) * forceStrength;
              
              Matter.Body.applyForce(body, body.position, { x: forceX, y: forceY });
            }
          }
        }
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
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [pieces]); // Added pieces to dependency array

  // 9) Break: remove 2 pins immediately, then last pin with force for dramatic swing
  useEffect(() => {
    if (!breakMode) return;
    
    const world = engineRef.current?.world;
    if (!world) return;
    
    // Define modal pieces that should break more gently
    const modalPieces = ['modal-backdrop', 'modal-container', 'modal-title', 'name-input', 'email-input', 'password-input', 'submit-btn', 'cancel-btn'];
    
    // Reverse the order to break bottom pieces first
    const entries = Object.entries(constraintsRef.current).reverse();
    
    // For each piece, remove 2 pins immediately and the last one after a delay with force
    entries.forEach(([pieceId, constraints], pieceIndex) => {
      const body = bodiesRef.current[pieceId];
      
      // Add defensive check for body existence
      if (!body || !constraints || constraints.length < 3) {
        return;
      }
      
      // Remove first 2 pins immediately to let it hang by the last pin
      setTimeout(() => {
        Matter.World.remove(world, constraints[0]);
        Matter.World.remove(world, constraints[1]);
        
        // Remove the last pin after delay and apply force for swing
        setTimeout(() => {
          Matter.World.remove(world, constraints[2]);
          
          // Apply much gentler force for modal pieces, normal force for others
          const isModalPiece = modalPieces.includes(pieceId);
          const forceMultiplier = isModalPiece ? 0 : 1; // No force for modal pieces
          
          const forceX = (Math.random() - 0.5) * 0.02 * forceMultiplier;
          const forceY = -0.005 * forceMultiplier;
          const forcePoint = { 
            x: body.position.x + (Math.random() - 0.5) * 30 * forceMultiplier, 
            y: body.position.y - 20 * forceMultiplier
          };
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
