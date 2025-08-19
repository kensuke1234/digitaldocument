// components/P5Frame.tsx
import React from 'react';

type Props = {
  src?: string;
  height?: number | string;
  title?: string;
};

export default function P5Frame({
  src = '/p5/index.html',
  height = 640,
  title = 'p5 sketch'
}: Props) {
  return (
    <iframe
      src={src}
      title={title}
      style={{ width: '100%', height, border: 0, borderRadius: 12 }}
      loading="lazy"
      allow="fullscreen"
    />
  );
}
