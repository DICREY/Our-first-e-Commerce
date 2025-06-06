import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Header } from "@/components/header"
import { CartProvider } from "@/contexts/cart-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "FashionHub - Ropa Femenina de Calidad",
  description: "Descubre nuestra colección de ropa femenina. Elegancia, comodidad y estilo para la mujer moderna.",
  keywords: "ropa femenina, moda mujer, vestidos, blusas, pantalones, ofertas moda",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <CartProvider>
          <Header />
          <main>{children}</main>
        </CartProvider>
      </body>
    </html>
  )
}
