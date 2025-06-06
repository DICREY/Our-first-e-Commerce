import { CartProvider } from "./Contexts/CartContext"
import Header from "./components/Header/Header"
import HomePage from "./components/Pages/HomePage"
import "./styles/globals.css"

function App() {
  return (
    <CartProvider>
      <div className="App">
        <Header />
        <main>
          <HomePage />
        </main>
      </div>
    </CartProvider>
  )
}

export default App
