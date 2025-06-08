// types.ts
export type BodyDef = {
  id: string;
  x: number; // top-left x
  y: number; // top-left y
  w: number; // width
  h: number; // height
};

export const pieces: BodyDef[] = [
  { id: 'header', x: 350, y: 200, w: 500, h: 100 },
  { id: 'button', x: 450, y: 350, w: 200, h: 80 },
];
