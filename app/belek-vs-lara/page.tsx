import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Check, X, Plane, Palmtree, GlassWater, DollarSign, MapPin, ChefHat, ArrowRight } from 'lucide-react';

export const metadata = {
    title: 'Belek vs. Lara: Which Antalya Region Offers the Ultimate Luxury Experience?',
    description: 'A detailed comparison between Antalya\'s two giants: Belek and Lara. Discover which luxury destination suits your holiday style best.',
};

export default function BelekVsLaraPage() {
    return (
        <main className="min-h-screen bg-white text-gray-800 font-sans selection:bg-blue-100">
            {/* Hero Section - Split Screen */}
            <section className="relative h-[80vh] flex flex-col md:flex-row overflow-hidden">
                {/* Left Side - Belek (Nature) */}
                <div className="relative w-full md:w-1/2 h-1/2 md:h-full group">
                    <div className="absolute inset-0 bg-green-900/40 group-hover:bg-green-900/30 transition-all duration-500 z-10" />
                    <Image
                        src="https://images.unsplash.com/photo-1560616939-5561a3e88691?q=80&w=2070&auto=format&fit=crop"
                        alt="Belek Golf Course and Nature"
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        priority
                    />
                    <div className="absolute inset-0 z-20 flex flex-col justify-center items-center text-white p-8 text-center">
                        <h2 className="text-4xl md:text-6xl font-serif font-bold mb-4 tracking-tight">BELEK</h2>
                        <p className="text-lg md:text-xl font-light tracking-wide uppercase">The Nature Kingdom</p>
                    </div>
                </div>

                {/* Right Side - Lara (City) */}
                <div className="relative w-full md:w-1/2 h-1/2 md:h-full group">
                    <div className="absolute inset-0 bg-blue-900/40 group-hover:bg-blue-900/30 transition-all duration-500 z-10" />
                    <Image
                        src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=2070&auto=format&fit=crop"
                        alt="Lara Luxury Hotels and Pools"
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        priority
                    />
                    <div className="absolute inset-0 z-20 flex flex-col justify-center items-center text-white p-8 text-center">
                        <h2 className="text-4xl md:text-6xl font-serif font-bold mb-4 tracking-tight">LARA</h2>
                        <p className="text-lg md:text-xl font-light tracking-wide uppercase">The Vegas of Antalya</p>
                    </div>
                </div>

                {/* Center Badge */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 bg-white text-gray-900 px-6 py-3 rounded-full shadow-2xl font-bold tracking-widest text-sm md:text-base border border-gray-100">
                    VS
                </div>
            </section>

            {/* Intro Text */}
            <section className="max-w-4xl mx-auto px-6 py-16 md:py-24 text-center">
                <h1 className="text-3xl md:text-5xl font-bold mb-8 text-gray-900 leading-tight">
                    The Battle of the Titans: <br />
                    <span className="text-blue-600 font-serif italic">Where should you book your next escape?</span>
                </h1>
                <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
                    Choosing between Belek and Lara is the "sweetest" problem you'll ever have. Both offer world-class luxury, pristine Mediterranean waters, and impeccable Turkish hospitality. However, they cater to vastly different vibes. Are you seeking the serenity of pine forests and golf courses, or the vibrant energy of themed hotels and city proximity? Let's dive deep.
                </p>
            </section>

            {/* Comparison Matrix */}
            <section className="bg-gray-50 py-20 px-6">
                <div className="max-w-5xl mx-auto">
                    <h3 className="text-2xl font-bold text-center mb-12 uppercase tracking-widest text-gray-500">Comparison Matrix</h3>

                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                        <div className="grid grid-cols-3 bg-gray-900 text-white py-6 text-center font-bold text-sm md:text-lg tracking-wide">
                            <div className="flex items-center justify-center gap-2"><Palmtree size={18} /> Feature</div>
                            <div className="text-green-400">BELEK</div>
                            <div className="text-blue-400">LARA</div>
                        </div>

                        {/* Row 1 */}
                        <div className="grid grid-cols-3 py-6 border-b border-gray-100 hover:bg-gray-50 transition-colors">
                            <div className="px-6 flex items-center gap-3 font-medium text-gray-700">
                                <Plane className="text-gray-400" size={20} />
                                Distance to Airport
                            </div>
                            <div className="px-6 text-center text-gray-600">30-45 Minutes</div>
                            <div className="px-6 text-center font-bold text-blue-600 flex items-center justify-center gap-2">
                                15 Minutes <Check size={16} />
                            </div>
                        </div>

                        {/* Row 2 */}
                        <div className="grid grid-cols-3 py-6 border-b border-gray-100 hover:bg-gray-50 transition-colors">
                            <div className="px-6 flex items-center gap-3 font-medium text-gray-700">
                                <MapPin className="text-gray-400" size={20} />
                                Sandy Beaches
                            </div>
                            <div className="px-6 text-center text-gray-600">Coarse Sand & Pebble Mix</div>
                            <div className="px-6 text-center font-bold text-blue-600 flex items-center justify-center gap-2">
                                Fine Dark Sand <Check size={16} />
                            </div>
                        </div>

                        {/* Row 3 */}
                        <div className="grid grid-cols-3 py-6 border-b border-gray-100 hover:bg-gray-50 transition-colors">
                            <div className="px-6 flex items-center gap-3 font-medium text-gray-700">
                                <Palmtree className="text-gray-400" size={20} />
                                Nature & Golf
                            </div>
                            <div className="px-6 text-center font-bold text-green-600 flex items-center justify-center gap-2">
                                World Class (Pine Forests) <Check size={16} />
                            </div>
                            <div className="px-6 text-center text-gray-600">Urban / Hotel Row</div>
                        </div>

                        {/* Row 4 */}
                        <div className="grid grid-cols-3 py-6 border-b border-gray-100 hover:bg-gray-50 transition-colors">
                            <div className="px-6 flex items-center gap-3 font-medium text-gray-700">
                                <GlassWater className="text-gray-400" size={20} />
                                Nightlife & City Access
                            </div>
                            <div className="px-6 text-center text-gray-600">Resort Contained</div>
                            <div className="px-6 text-center font-bold text-blue-600 flex items-center justify-center gap-2">
                                High (Close to City) <Check size={16} />
                            </div>
                        </div>

                        {/* Row 5 */}
                        <div className="grid grid-cols-3 py-6 hover:bg-gray-50 transition-colors">
                            <div className="px-6 flex items-center gap-3 font-medium text-gray-700">
                                <DollarSign className="text-gray-400" size={20} />
                                Price Point
                            </div>
                            <div className="px-6 text-center font-bold text-gray-800">$$$$ (Premium)</div>
                            <div className="px-6 text-center text-gray-600">$$$ (High)</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Detailed Sections */}
            <div className="max-w-4xl mx-auto px-6 py-16 space-y-24">

                {/* BELEK SECTION */}
                <section className="space-y-6">
                    <div className="flex items-center gap-4 mb-6">
                        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-bold tracking-wider">NATURE & LUXURY</span>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Belek: The Golf & Nature Kingdom</h2>
                    </div>

                    <p className="text-lg text-gray-600 leading-relaxed">
                        Belek is not just a holiday destination; it is a brand of its own. Located about 40km east of Antalya, it was specifically designed for tourism. There are no "local" residential chaos here—only endless rows of stone pines (fıstık çamları), world-class golf courses, and massive, sprawling resorts.
                    </p>

                    <div className="bg-green-50 p-8 rounded-2xl border-l-4 border-green-600 my-8">
                        <h4 className="font-bold text-green-900 mb-2">Why Choose Belek?</h4>
                        <ul className="space-y-3 text-green-800">
                            <li className="flex items-start gap-2">
                                <Check size={20} className="mt-1 flex-shrink-0" />
                                <span><strong>Isolation & Privacy:</strong> Hotels are spread out over huge territories. You never feel cramped.</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <Check size={20} className="mt-1 flex-shrink-0" />
                                <span><strong>Golfing Paradise:</strong> Home to over 15 championship courses, including the Montgomerie (Maxx Royal) and Carya Golf Club.</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <Check size={20} className="mt-1 flex-shrink-0" />
                                <span><strong>Ultra-Luxury:</strong> This is where you find the heavy hitters like <em>Maxx Royal, Regnum Carya, Gloria Serenity, and Cullinan</em>.</span>
                            </li>
                        </ul>
                    </div>

                    <p className="text-lg text-gray-600 leading-relaxed">
                        If your idea of a holiday is entering a sanctuary where you don't step out for a week, being surrounded by green nature, and experiencing the absolute pinnacle of service, Belek is your winner.
                    </p>
                </section>

                {/* LARA SECTION */}
                <section className="space-y-6">
                    <div className="flex items-center gap-4 mb-6">
                        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-bold tracking-wider">ACTION & CITY</span>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Lara: The Vegas of Antalya</h2>
                    </div>

                    <p className="text-lg text-gray-600 leading-relaxed">
                        Lara (Kundu) is famous for its "Themed Hotels." Walking down the main strip feels like a mini Las Vegas. You have the Titanic (shaped like the ship), the Concorde (shaped like the plane), and the palaces of Delphin. It is significantly closer to the Antalya city center.
                    </p>

                    <div className="bg-blue-50 p-8 rounded-2xl border-l-4 border-blue-600 my-8">
                        <h4 className="font-bold text-blue-900 mb-2">Why Choose Lara?</h4>
                        <ul className="space-y-3 text-blue-800">
                            <li className="flex items-start gap-2">
                                <Check size={20} className="mt-1 flex-shrink-0" />
                                <span><strong>Short Transfer:</strong> You can be in the pool 20 minutes after landing. Ideal for families with small kids who hate travel.</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <Check size={20} className="mt-1 flex-shrink-0" />
                                <span><strong>City Access:</strong> Want to visit the Old Town (Kaleiçi) or go shopping at TerraCity? It's a 15-minute taxi ride.</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <Check size={20} className="mt-1 flex-shrink-0" />
                                <span><strong>Sandy Beaches:</strong> Lara's beaches are generally sandier and darker compared to Belek's pebble-mix coast.</span>
                            </li>
                        </ul>
                    </div>

                    <p className="text-lg text-gray-600 leading-relaxed">
                        Lara is perfect for those who want a high-end holiday but also want to feel connected to the real world. It's vibrant, energetic, and visually stunning with its architectural marvels.
                    </p>
                </section>

                {/* CHEF'S VERDICT */}
                <section className="relative bg-gray-900 text-white p-10 md:p-14 rounded-3xl overflow-hidden shadow-2xl">
                    <div className="absolute top-0 right-0 p-10 opacity-10">
                        <ChefHat size={200} />
                    </div>

                    <div className="relative z-10">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="bg-yellow-500 p-3 rounded-full text-gray-900">
                                <ChefHat size={32} />
                            </div>
                            <h3 className="text-2xl md:text-3xl font-serif font-bold text-yellow-500">The Chef's Verdict</h3>
                        </div>

                        <p className="text-lg md:text-xl leading-relaxed text-gray-300 mb-6 italic">
                            "As a chef who has tasted the offerings of both regions, the distinction is subtle but present. Belek plays in a different culinary league."
                        </p>

                        <div className="space-y-4 text-gray-300">
                            <p>
                                <strong>In Belek</strong>, the "High Class All Inclusive" concept is taken seriously. You are more likely to find imported spirits, dry-aged steaks, and genuine parmesan on the buffet. Resorts like <em>Maxx Royal</em> and <em>Regnum</em> often collaborate with Michelin-starred chefs for their a la carte menus. The budgets for raw materials are simply higher.
                            </p>
                            <p>
                                <strong>In Lara</strong>, the food is excellent, don't get me wrong. But due to the higher density of rooms and the "mass luxury" model, you might find the buffet slightly more repetitive. The a la carte restaurants are fantastic, but Belek offers that extra 10% of gastronomic refinement that foodies will notice.
                            </p>
                        </div>

                        <div className="mt-8 pt-8 border-t border-gray-800">
                            <span className="text-yellow-500 font-bold uppercase tracking-widest text-sm">Winner for Foodies:</span>
                            <span className="ml-3 text-2xl font-bold text-white">BELEK</span>
                        </div>
                    </div>
                </section>

                {/* CTA Buttons */}
                <section className="grid md:grid-cols-2 gap-6 pt-8">
                    <Link
                        href="/hotels/belek"
                        className="group flex flex-col items-center justify-center p-8 bg-green-50 border-2 border-green-100 rounded-2xl hover:bg-green-600 hover:border-green-600 transition-all duration-300"
                    >
                        <span className="text-green-800 font-bold text-xl mb-2 group-hover:text-white">Explore Belek Resorts</span>
                        <span className="text-green-600 text-sm group-hover:text-green-100 flex items-center gap-2">
                            See Top Rated Hotels <ArrowRight size={16} />
                        </span>
                    </Link>

                    <Link
                        href="/hotels/lara"
                        className="group flex flex-col items-center justify-center p-8 bg-blue-50 border-2 border-blue-100 rounded-2xl hover:bg-blue-600 hover:border-blue-600 transition-all duration-300"
                    >
                        <span className="text-blue-800 font-bold text-xl mb-2 group-hover:text-white">Explore Lara Resorts</span>
                        <span className="text-blue-600 text-sm group-hover:text-blue-100 flex items-center gap-2">
                            See Top Rated Hotels <ArrowRight size={16} />
                        </span>
                    </Link>
                </section>

            </div>
        </main>
    );
}
