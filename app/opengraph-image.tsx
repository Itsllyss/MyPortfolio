import { ImageResponse } from 'next/og';

export const alt = 'Allyssa Bulo, AI Automation Specialist';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: '#000',
          color: '#F2F6F7',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '0 96px',
        }}
      >
        <div style={{ width: 120, height: 120, borderRadius: 60, border: '6px solid #2EE6FF', marginBottom: 48 }} />
        <div style={{ fontSize: 88, fontWeight: 700, letterSpacing: -3 }}>Hey, I’m Allyssa</div>
        <div style={{ fontSize: 40, color: '#8D989F', marginTop: 16 }}>AI Automation Specialist, Philippines</div>
        <div style={{ fontSize: 30, color: '#2EE6FF', marginTop: 40 }}>Ask my avatar about my projects</div>
      </div>
    ),
    size,
  );
}
