'use client';

import { useEffect, useRef, useState } from 'react';
import Matter from 'matter-js';

interface PhysicsPieceProps {
  body: Matter.Body;
  element: HTMLElement;
  containerRect: DOMRect;
}

const PhysicsPiece: React.FC<PhysicsPieceProps> = ({ body, element, containerRect }) => {
  const pieceRef = useRef<HTMLDivElement>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (!pieceRef.current || isInitialized) return;

    // Clone the original element's content
    const clone = element.cloneNode(true) as HTMLElement;
    
    // Clear any existing content and append the clone
    pieceRef.current.innerHTML = '';
    pieceRef.current.appendChild(clone);
    
    // Copy computed styles from original element
    const computedStyle = window.getComputedStyle(element);
    const cloneStyle = clone.style;
    
    // Copy important visual styles
    cloneStyle.fontSize = computedStyle.fontSize;
    cloneStyle.fontFamily = computedStyle.fontFamily;
    cloneStyle.fontWeight = computedStyle.fontWeight;
    cloneStyle.color = computedStyle.color;
    cloneStyle.backgroundColor = computedStyle.backgroundColor;
    cloneStyle.border = computedStyle.border;
    cloneStyle.borderRadius = computedStyle.borderRadius;
    cloneStyle.padding = computedStyle.padding;
    cloneStyle.margin = '0'; // Reset margin for absolute positioning
    cloneStyle.width = computedStyle.width;
    cloneStyle.height = computedStyle.height;
    cloneStyle.display = computedStyle.display;
    cloneStyle.alignItems = computedStyle.alignItems;
    cloneStyle.justifyContent = computedStyle.justifyContent;
    cloneStyle.textAlign = computedStyle.textAlign;
    cloneStyle.lineHeight = computedStyle.lineHeight;
    cloneStyle.boxShadow = computedStyle.boxShadow;
    
    setIsInitialized(true);
  }, [element, isInitialized]);

  const rect = element.getBoundingClientRect();
  const relativeX = rect.left - containerRect.left;
  const relativeY = rect.top - containerRect.top;

  return (
    <div
      ref={pieceRef}
      className="absolute pointer-events-auto cursor-grab active:cursor-grabbing"
      style={{
        left: body.position.x - rect.width / 2,
        top: body.position.y - rect.height / 2,
        width: rect.width,
        height: rect.height,
        transform: `rotate(${body.angle}rad)`,
        transformOrigin: 'center center',
        zIndex: 1000,
      }}
    />
  );
};

export default PhysicsPiece;
