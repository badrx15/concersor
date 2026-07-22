import { ImageResponse } from 'next/og';

export const contentType = 'image/png';
export const size = {
  width: 32,
  height: 32,
};

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#1e1b4b',
          borderRadius: 6,
        }}
      >
        <svg
          width={24}
          height={24}
          viewBox="0 0 24 24"
          fill="none"
          stroke="#a78bfa"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Arrows cycle icon representing conversion */}
          <path d="M17 2l4 4-4 4" />
          <path d="M3 12h18" />
          <path d="M7 22l-4-4 4-4" />
          <path d="M21 12v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
        </svg>
      </div>
    ),
    {
      ...size,
    }
  );
}
