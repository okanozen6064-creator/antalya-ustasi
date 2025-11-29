import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Sun, Moon, MapPin, Star, Utensils, Wine, Home, Camera, ArrowRight, Heart } from 'lucide-react';

export const metadata = {
    title: 'The Kaş & Kalkan Collection | Bohemian Luxury & Infinity Villas',
    description: 'Discover the bohemian soul of Antalya. A curated guide to the best infinity pool villas in Kalkan and charming boutique hotels in Kaş.',
};

export default function KasKalkanPage() {
    return (
        <main className="min-h-screen bg-[#FFFBF7] text-gray-800 font-sans selection:bg-orange-200">

            {/* Hero Section - Bohemian Sunset Vibe */}
            <section className="relative h-[85vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-orange-900/30 to-purple-900/40 z-10" />
                <Image
                    src="https://images.unsplash.com/photo-1590523741831-ab7f851230f4?q=80&w=2070&auto=format&fit=crop"
                    alt="Kaş Sunset and Bougainvillea"
                    fill
                    className="object-cover"
                    priority
                />
                <div className="relative z-20 text-center text-white px-6 max-w-5xl mx-auto">
                    <span className="inline-block py-2 px-4 border border-white/60 rounded-full text-sm md:text-base font-light tracking-[0.2em] mb-6 backdrop-blur-sm uppercase">
                        The Bohemian Collection
                    </span>
                    <h1 className="text-5xl md:text-7xl font-serif font-medium mb-6 leading-tight">
                        Kaş & Kalkan
                    </h1>
                    <p className="text-xl md:text-2xl font-light text-orange-50 max-w-3xl mx-auto leading-relaxed">
                        Where the Mediterranean turns into turquoise glass, and luxury hides behind stone walls and cascading bougainvilleas.
                    </p>
                </div>

                {/* Scroll Indicator */}
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 animate-bounce text-white/80">
                    <ArrowRight className="rotate-90" size={32} />
                </div>
            </section>

            {/* Intro: The Vibe */}
            <section className="py-20 px-6 max-w-4xl mx-auto text-center">
                <div className="mb-8 flex justify-center">
                    <Sun className="text-orange-400" size={40} />
                </div>
                <h2 className="text-3xl md:text-4xl font-serif text-gray-900 mb-8">Not a Holiday, A State of Mind</h2>
                <p className="text-lg text-gray-600 leading-loose mb-6">
                    Forget the massive open buffets and the rush of water slides. <strong>Kaş and Kalkan</strong> offer a different rhythm. This is the land of "Slow Travel." It's about waking up in a stone villa perched on a cliff, watching the Greek island of Meis from your infinity pool, and dining in restaurants where the chef knows the fisherman by name.
                </p>
                <p className="text-lg text-gray-600 leading-loose">
                    Here, luxury isn't gold-plated; it's textured. It's the feel of raw linen, the scent of jasmine and wild thyme, and the taste of cold-pressed olive oil on warm village bread.
                </p>
            </section>

            {/* Kalkan Villas Section */}
            <section className="py-20 bg-orange-50/50">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-12">
                        <div>
                            <span className="text-orange-600 font-bold tracking-widest uppercase text-sm">The Villa Life</span>
                            <h2 className="text-3xl md:text-5xl font-serif text-gray-900 mt-2">Infinity Pools of Kalkan</h2>
                        </div>
                        <p className="text-gray-500 max-w-md mt-4 md:mt-0 text-right md:text-left">
                            Kalkan is architecturally unique in Turkey. Built on steep hills, almost every property guarantees an unobstructed sea view.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Villa 1 */}
                        <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group">
                            <div className="relative h-64 overflow-hidden">
                                <Image
                                    src="https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=2071&auto=format&fit=crop"
                                    alt="Villa Mahal Style"
                                    fill
                                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                                />
                                <div className="absolute top-4 right-4 bg-white/90 px-3 py-1 rounded-full text-xs font-bold text-gray-900">
                                    Kalamar Bay
                                </div>
                            </div>
                            <div className="p-8">
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Villa Azure Heights</h3>
                                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                                    A masterpiece of modern architecture. Features a 15-meter infinity pool that seems to spill directly into the Mediterranean. Sleeps 10, perfect for large families.
                                </p>
                                <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
                                    <span className="flex items-center gap-1"><Home size={14} /> 5 Bed</span>
                                    <span className="flex items-center gap-1"><Star size={14} className="text-orange-400" /> 4.98</span>
                                </div>
                                <button className="w-full py-3 bg-gray-900 text-white text-sm font-bold uppercase tracking-wider hover:bg-orange-600 transition-colors">
                                    Check Villa Availability
                                </button>
                            </div>
                        </div>

                        {/* Villa 2 */}
                        <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group">
                            <div className="relative h-64 overflow-hidden">
                                <Image
                                    src="https://images.unsplash.com/photo-1512918760513-95f6929c3d60?q=80&w=2076&auto=format&fit=crop"
                                    alt="Luxury Villa Terrace"
                                    fill
                                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                                />
                                <div className="absolute top-4 right-4 bg-white/90 px-3 py-1 rounded-full text-xs font-bold text-gray-900">
                                    Ortaalan
                                </div>
                            </div>
                            <div className="p-8">
                                <h3 className="text-xl font-bold text-gray-900 mb-2">The White House Villa</h3>
                                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                                    Minimalist luxury at its finest. White-washed walls, natural stone floors, and a rooftop jacuzzi bar for sunset cocktails. Walking distance to Kalkan center.
                                </p>
                                <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
                                    <span className="flex items-center gap-1"><Home size={14} /> 4 Bed</span>
                                    <span className="flex items-center gap-1"><Star size={14} className="text-orange-400" /> 4.95</span>
                                </div>
                                <button className="w-full py-3 bg-gray-900 text-white text-sm font-bold uppercase tracking-wider hover:bg-orange-600 transition-colors">
                                    Check Villa Availability
                                </button>
                            </div>
                        </div>

                        {/* Villa 3 */}
                        <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group">
                            <div className="relative h-64 overflow-hidden">
                                <Image
                                    src="https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?q=80&w=2070&auto=format&fit=crop"
                                    alt="Villa with Sea View"
                                    fill
                                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                                />
                                <div className="absolute top-4 right-4 bg-white/90 px-3 py-1 rounded-full text-xs font-bold text-gray-900">
                                    Kömürlük
                                </div>
                            </div>
                            <div className="p-8">
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Villa Serenity</h3>
                                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                                    Located in the prestigious Kömürlük area, offering the best sunset views in town. Private beach platform access and a secluded garden sanctuary.
                                </p>
                                <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
                                    <span className="flex items-center gap-1"><Home size={14} /> 3 Bed</span>
                                    <span className="flex items-center gap-1"><Star size={14} className="text-orange-400" /> 5.0</span>
                                </div>
                                <button className="w-full py-3 bg-gray-900 text-white text-sm font-bold uppercase tracking-wider hover:bg-orange-600 transition-colors">
                                    Check Villa Availability
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Kaş Boutique Hotels Section */}
            <section className="py-20">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-12">
                        <div>
                            <span className="text-pink-600 font-bold tracking-widest uppercase text-sm">Bohemian Chic</span>
                            <h2 className="text-3xl md:text-5xl font-serif text-gray-900 mt-2">Boutique Stays in Kaş</h2>
                        </div>
                        <p className="text-gray-500 max-w-md mt-4 md:mt-0 text-right md:text-left">
                            Kaş is best experienced in small, family-run hotels where the owner makes your coffee and the decor tells a story.
                        </p>
                    </div>

                    <div className="space-y-8">
                        {/* Hotel 1 */}
                        <div className="flex flex-col md:flex-row bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-xl transition-shadow">
                            <div className="md:w-2/5 relative h-64 md:h-auto">
                                <Image
                                    src="https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=2070&auto=format&fit=crop"
                                    alt="Boutique Hotel Room"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="p-8 md:w-3/5 flex flex-col justify-center">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-2xl font-serif text-gray-900">Lupia Suites</h3>
                                        <p className="text-pink-600 text-sm font-medium">Kaş Center (Old Town)</p>
                                    </div>
                                    <div className="bg-pink-50 text-pink-800 px-3 py-1 rounded-md text-xs font-bold">Adults Only</div>
                                </div>
                                <p className="text-gray-600 mb-6 leading-relaxed">
                                    Hidden within the bougainvillea-covered streets of the Old Town. Each room is uniquely designed with antique furniture and local art. The courtyard breakfast is legendary, featuring homemade jams and local cheeses.
                                </p>
                                <div className="flex items-center justify-between mt-auto">
                                    <span className="text-gray-400 text-sm">From $120 / night</span>
                                    <button className="px-6 py-2 border-2 border-gray-900 text-gray-900 font-bold hover:bg-gray-900 hover:text-white transition-colors rounded-lg">
                                        View Hotel
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Hotel 2 */}
                        <div className="flex flex-col md:flex-row bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-xl transition-shadow">
                            <div className="md:w-2/5 relative h-64 md:h-auto">
                                <Image
                                    src="https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop"
                                    alt="Hotel with Sea Deck"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="p-8 md:w-3/5 flex flex-col justify-center">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-2xl font-serif text-gray-900">Mandalina Luxury Suites</h3>
                                        <p className="text-pink-600 text-sm font-medium">Çukurbağ Peninsula</p>
                                    </div>
                                    <div className="bg-blue-50 text-blue-800 px-3 py-1 rounded-md text-xs font-bold">Sea Access</div>
                                </div>
                                <p className="text-gray-600 mb-6 leading-relaxed">
                                    Located on the peninsula, offering absolute silence and direct access to the sea via private platforms. The suites are spacious, modern, and all face the open Mediterranean. Perfect for honeymooners.
                                </p>
                                <div className="flex items-center justify-between mt-auto">
                                    <span className="text-gray-400 text-sm">From $180 / night</span>
                                    <button className="px-6 py-2 border-2 border-gray-900 text-gray-900 font-bold hover:bg-gray-900 hover:text-white transition-colors rounded-lg">
                                        View Hotel
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Gastronomy Section */}
            <section className="py-24 bg-[#2C2420] text-orange-50">
                <div className="max-w-5xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <Utensils className="mx-auto text-orange-400 mb-4" size={48} />
                        <h2 className="text-4xl md:text-6xl font-serif mb-6">Dining in Kaş</h2>
                        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                            Forget the international buffets. In Kaş, we eat <span className="text-orange-300 italic">Meze</span>, we drink <span className="text-orange-300 italic">Rakı</span>, and we talk until the sun comes up.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="space-y-8">
                            <div className="flex gap-6">
                                <div className="bg-orange-900/30 p-4 rounded-full h-fit">
                                    <Wine className="text-orange-400" size={24} />
                                </div>
                                <div>
                                    <h4 className="text-xl font-bold text-orange-100 mb-2">The "Meyhane" Culture</h4>
                                    <p className="text-gray-400 leading-relaxed">
                                        Kaş is famous for its Meyhanes (Turkish Taverns). It's not just about food; it's a ritual. You order small plates of meze—Grilled Octopus, Sea Samphire (Deniz Börülcesi), Atom (spicy yoghurt)—to share with the table.
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-6">
                                <div className="bg-orange-900/30 p-4 rounded-full h-fit">
                                    <Camera className="text-orange-400" size={24} />
                                </div>
                                <div>
                                    <h4 className="text-xl font-bold text-orange-100 mb-2">Sunset Dinners</h4>
                                    <p className="text-gray-400 leading-relaxed">
                                        The restaurants in Kaş are often small, family-owned, and set in charming courtyards or on rooftop terraces overlooking the harbor. Reservations are essential in high season.
                                    </p>
                                </div>
                            </div>

                            <div className="bg-orange-900/20 p-6 rounded-xl border border-orange-900/50 mt-8">
                                <h5 className="text-orange-300 font-serif text-lg mb-2">Chef's Recommendation:</h5>
                                <p className="text-gray-300 italic text-sm">
                                    "Don't leave without trying 'Paçanga Böreği' at a local meyhane and the 'Pumpkin Dessert with Tahini' (Kabak Tatlısı) for a sweet finish. The ingredients here are sun-kissed and bursting with flavor."
                                </p>
                            </div>
                        </div>

                        <div className="relative h-[500px] w-full rounded-2xl overflow-hidden shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-500">
                            <Image
                                src="https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=1974&auto=format&fit=crop"
                                alt="Turkish Meze Table"
                                fill
                                className="object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                            <div className="absolute bottom-8 left-8 text-white">
                                <p className="font-serif text-2xl">A table full of stories.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-20 text-center bg-white">
                <h2 className="text-3xl font-serif text-gray-900 mb-8">Ready for the Bohemian Dream?</h2>
                <div className="flex flex-col md:flex-row justify-center gap-4">
                    <button className="px-8 py-4 bg-orange-600 text-white font-bold rounded-full hover:bg-orange-700 transition-colors shadow-lg hover:shadow-orange-200">
                        Explore All Kalkan Villas
                    </button>
                    <button className="px-8 py-4 bg-white text-gray-900 border-2 border-gray-200 font-bold rounded-full hover:border-gray-900 transition-colors">
                        See Kaş Hotel Guide
                    </button>
                </div>
            </section>

        </main>
    );
}
