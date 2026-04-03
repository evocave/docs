import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Evocave Docs'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
    return new ImageResponse(
        <div
            style={{
                background: '#0f1415',
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                justifyContent: 'flex-end',
                padding: '80px',
                fontFamily: 'sans-serif'
            }}
        >
            {/* Grid pattern */}
            <div
                style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundImage:
                        'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
                    backgroundSize: '60px 60px'
                }}
            />

            {/* Badge */}
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    background: 'rgba(255,255,255,0.08)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    borderRadius: '100px',
                    padding: '6px 16px',
                    marginBottom: '24px'
                }}
            >
                <span
                    style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px' }}
                >
                    docs.evocave.com
                </span>
            </div>

            {/* Title */}
            <div
                style={{
                    fontSize: '64px',
                    fontWeight: 700,
                    color: '#ffffff',
                    lineHeight: 1.1,
                    marginBottom: '24px',
                    maxWidth: '900px'
                }}
            >
                Evocave Docs
            </div>

            {/* Description */}
            <div
                style={{
                    fontSize: '24px',
                    color: 'rgba(255,255,255,0.5)',
                    maxWidth: '700px',
                    lineHeight: 1.5
                }}
            >
                Official documentation — explore guides, references, and more.
            </div>
        </div>,
        { ...size }
    )
}
