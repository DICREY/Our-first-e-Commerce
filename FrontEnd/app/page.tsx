"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { HeroSection } from "@/components/hero-section"
import { ProductCard } from "@/components/product-card"
import { products, categories } from "@/lib/products"
import { ArrowRight, Heart, Shield, Truck } from "lucide-react"

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState("Todos")

  const filteredProducts =
    selectedCategory === "Todos" ? products : products.filter((product) => product.category === selectedCategory)

  const featuredProducts = products.filter((product) => product.featured)
  const saleProducts = products.filter((product) => product.onSale)

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Hero Section */}
      <HeroSection />

      {/* Features */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto">
                <Truck className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-neutral-800">Envío Gratis</h3>
              <p className="text-neutral-600">En compras mayores a $75. Recibe tu pedido en 2-3 días hábiles.</p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-success-100 rounded-full flex items-center justify-center mx-auto">
                <Shield className="w-8 h-8 text-success-600" />
              </div>
              <h3 className="text-xl font-semibold text-neutral-800">Compra Segura</h3>
              <p className="text-neutral-600">Tus datos están protegidos con encriptación de nivel bancario.</p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center mx-auto">
                <Heart className="w-8 h-8 text-accent-600" />
              </div>
              <h3 className="text-xl font-semibold text-neutral-800">Satisfacción Garantizada</h3>
              <p className="text-neutral-600">30 días para devoluciones. Tu satisfacción es nuestra prioridad.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-neutral-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="bg-accent-100 text-accent-700 mb-4">Productos Destacados</Badge>
            <h2 className="text-3xl lg:text-4xl font-bold text-neutral-800 mb-4">Lo Más Popular</h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              Descubre los productos favoritos de nuestras clientas. Piezas seleccionadas por su calidad y estilo.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="text-center">
            <Button variant="outline" size="lg" className="border-primary-200 text-primary-700 hover:bg-primary-50">
              Ver Todos los Productos
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Sale Section */}
      {saleProducts.length > 0 && (
        <section className="py-16 bg-gradient-to-r from-warning-50 to-accent-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <Badge className="bg-warning-500 text-white mb-4">Ofertas Especiales</Badge>
              <h2 className="text-3xl lg:text-4xl font-bold text-neutral-800 mb-4">Hasta 50% de Descuento</h2>
              <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
                Aprovecha nuestras ofertas por tiempo limitado. ¡Los mejores precios del año!
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {saleProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Categories */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-neutral-800 mb-4">Explora por Categoría</h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              Encuentra exactamente lo que buscas navegando por nuestras categorías cuidadosamente organizadas.
            </p>
          </div>

          <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
            <TabsList className="grid w-full grid-cols-4 lg:grid-cols-7 mb-8 bg-neutral-100">
              {categories.map((category) => (
                <TabsTrigger
                  key={category}
                  value={category}
                  className="data-[state=active]:bg-primary-500 data-[state=active]:text-white"
                >
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>

            {categories.map((category) => (
              <TabsContent key={category} value={category}>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {(category === "Todos" ? products : products.filter((p) => p.category === category))
                    .slice(0, 8)
                    .map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-gradient-to-br from-primary-500 to-accent-500">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto text-white space-y-6">
            <h2 className="text-3xl lg:text-4xl font-bold">Mantente al Día con las Últimas Tendencias</h2>
            <p className="text-lg opacity-90">
              Suscríbete a nuestro newsletter y recibe un 15% de descuento en tu primera compra, además de acceso
              exclusivo a ofertas y nuevos productos.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Tu email"
                className="flex-1 px-4 py-3 rounded-lg text-neutral-800 placeholder-neutral-500"
              />
              <Button className="bg-white text-primary-600 hover:bg-neutral-100 px-8 py-3">Suscribirse</Button>
            </div>

            <p className="text-sm opacity-75">
              Al suscribirte, aceptas recibir emails promocionales. Puedes darte de baja en cualquier momento.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
