import { ImageResponse } from 'next/og'
import { createClient } from '@/lib/supabase/server'

export const runtime = 'edge'

export const alt = 'Antalya Ustası Profil Kartı'
export const size = {
    width: 1200,
    height: 630,
}

export const contentType = 'image/png'

export default async function Image({ params }: { params: { slug: string } }) {
    const supabase = await createClient()

    // Usta bilgilerini çek
    const { data: profile } = await supabase
        .from('profiles')
        .select('first_name, last_name, business_name, rating, review_count, profile_image_url')
        .eq('slug', params.slug)
        .single()

    // Varsayılan değerler
    const fullName = profile ? `${profile.first_name} ${profile.last_name}` : 'Usta Profili'
    const businessName = profile?.business_name
    const rating = profile?.rating || 0
    const reviewCount = profile?.review_count || 0
    const profileImage = profile?.profile_image_url

    return new ImageResponse(
        (
            <div
                style={{
                    background: 'linear-gradient(to bottom right, #4f46e5, #0ea5e9)',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'sans-serif',
                    color: 'white',
                    position: 'relative',
                }}
            >
                {/* Arka plan deseni (opsiyonel) */}
                <div
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundImage: 'radial-gradient(circle at 25px 25px, rgba(255, 255, 255, 0.1) 2%, transparent 0%), radial-gradient(circle at 75px 75px, rgba(255, 255, 255, 0.1) 2%, transparent 0%)',
                        backgroundSize: '100px 100px',
                    }}
                />

                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '40px',
                        padding: '60px',
                        background: 'rgba(255, 255, 255, 0.1)',
                        backdropFilter: 'blur(10px)',
                        borderRadius: '30px',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
                        maxWidth: '90%',
                    }}
                >
                    {/* Avatar */}
                    <div
                        style={{
                            width: '200px',
                            height: '200px',
                            borderRadius: '50%',
                            overflow: 'hidden',
                            border: '8px solid rgba(255, 255, 255, 0.3)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: '#e0e7ff',
                        }}
                    >
                        {profileImage ? (
                            <img
                                src={profileImage}
                                alt={fullName}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                        ) : (
                            <div style={{ fontSize: '80px', color: '#4f46e5' }}>
                                {profile?.first_name?.[0] || 'A'}
                            </div>
                        )}
                    </div>

                    {/* Bilgiler */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {businessName && (
                            <div style={{ fontSize: '32px', color: '#e0e7ff', fontWeight: 'bold', opacity: 0.9 }}>
                                {businessName}
                            </div>
                        )}

                        <div style={{ fontSize: '64px', fontWeight: 'bold', lineHeight: 1.1 }}>
                            {fullName}
                        </div>

                        {/* Yıldızlar */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginTop: '10px' }}>
                            <div style={{ display: 'flex', gap: '5px' }}>
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <svg
                                        key={star}
                                        width="40"
                                        height="40"
                                        viewBox="0 0 24 24"
                                        fill={star <= Math.round(rating) ? '#fbbf24' : 'rgba(255,255,255,0.3)'}
                                        stroke="none"
                                    >
                                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                    </svg>
                                ))}
                            </div>
                            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#fbbf24' }}>
                                {rating.toFixed(1)}
                            </div>
                            <div style={{ fontSize: '24px', color: 'rgba(255,255,255,0.8)' }}>
                                ({reviewCount} Yorum)
                            </div>
                        </div>
                    </div>
                </div>

                {/* Logo Alt Köşe */}
                <div
                    style={{
                        position: 'absolute',
                        bottom: '40px',
                        right: '40px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                    }}
                >
                    <div
                        style={{
                            fontSize: '24px',
                            fontWeight: 'bold',
                            color: 'white',
                            background: 'rgba(0,0,0,0.2)',
                            padding: '10px 20px',
                            borderRadius: '50px',
                        }}
                    >
                        Antalya Ustası
                    </div>
                </div>
            </div>
        ),
        {
            ...size,
        }
    )
}
