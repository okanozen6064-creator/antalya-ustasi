import { Wrench, Zap, Droplets, Paintbrush as PaintBrush, Home, Hammer } from 'lucide-react'

interface Category {

  id: string

  name: string

  icon: React.ReactNode

}

const categories: Category[] = [

  {

    id: 'electrician',

    name: 'Elektrikçi',

    icon: <Zap className="w-8 h-8" />,

  },

  {

    id: 'plumber',

    name: 'Tesisatçı',

    icon: <Droplets className="w-8 h-8" />,

  },

  {

    id: 'carpenter',

    name: 'Marangoz',

    icon: <Hammer className="w-8 h-8" />,

  },

  {

    id: 'painter',

    name: 'Boyacı',

    icon: <PaintBrush className="w-8 h-8" />,

  },

  {

    id: 'handyman',

    name: 'Tesisatçı',

    icon: <Wrench className="w-8 h-8" />,

  },

  {

    id: 'renovations',

    name: 'Renovasyon',

    icon: <Home className="w-8 h-8" />,

  },

]

export function CategoryCards() {

  return (

    <section className="w-full bg-white dark:bg-slate-800 py-16 md:py-20">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Title */}

        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2 text-center text-balance">

          Popüler Kategoriler

        </h2>

        <p className="text-center text-slate-600 dark:text-slate-400 mb-12 text-balance">

          İhtiyacınız olan hizmetleri keşfedin

        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {categories.map((category) => (

            <div

              key={category.id}

              className="group bg-slate-50 dark:bg-slate-700 rounded-xl p-8 text-center hover:shadow-lg dark:hover:shadow-xl transition-shadow duration-300 cursor-pointer"

            >

              {/* Icon Container */}

              <div className="flex justify-center mb-4">

                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-300 group-hover:bg-blue-200 dark:group-hover:bg-blue-800 transition-colors duration-300">

                  {category.icon}

                </div>

              </div>

              {/* Category Name */}

              <h3 className="text-lg font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-300 transition-colors duration-300">

                {category.name}

              </h3>

            </div>

          ))}

        </div>

      </div>

    </section>

  )

}
