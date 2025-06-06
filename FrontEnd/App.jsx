import { CartProvider } from "./context/CartContext"
import Header from "./components/Header/Header"
import HomePage from "./pages/HomePage"
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
