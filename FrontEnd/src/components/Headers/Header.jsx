import { memo, useContext, useEffect, useRef, useState, forwardRef } from "react";
import { Link, useNavigate, useLocation, NavLink } from "react-router-dom";
import { Heart, Search, ShoppingBag, Sun, Moon } from 'lucide-react';

// Imports 
import { CheckImage } from "../../Utils/utils";
import { AuthContext } from "../../Contexts/Contexts";
import { useCart } from "../../Contexts/CartContext"
import CartSheet from "../CartSheet/CartSheet";
import Button from "../Button/Button";
import FavoritesSheet from "../FavoritesSheet/FavoritesSheet";
import { useDarkMode } from "../../Hooks/Theme"

// Import styles 
import styles from "./Header.module.css"

// Cache para las categorías (no usado)
let categoriesCache = null;
let lastFetchTime = 0;
const CACHE_DURATION = 60 * 60 * 1000; // 60 minutos en milisegundos

// Componente NavLink optimizado
const NavLinkItem = memo(({ item, setCatPro, isActive }) => {
  return (
    <Link
      to={item.href}
      className={`${styles.navLink} ${isActive ? styles.activeLink : ''}`}
      onClick={() => setCatPro && setCatPro(item.name)}
    >
      {item.name}
    </Link>
  );
});

// Componente ProfileMenu optimizado
const ProfileMenu = memo(forwardRef(({ isOpen, setIsOpen, imgDefault, handleLogout, styles }, ref) => {
  // Vars 
  const { user } = useContext(AuthContext)

  return (
    <aside className={styles.profileWrapper} ref={ref}>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-label="Menú de perfil"
      >
        <CheckImage
          src={user?.img}
          alt={`${user?.names || ""} ${user?.lastNames || ""}`}
          imgDefault={imgDefault}
          className={styles.profileImage}
        />
      </Button>
      {isOpen && (
        <div className={styles.profileMenu}>
          {user == null ? (
            <>
              <Link
                to="/login"
                className={styles.menuOption}
                onClick={() => setIsOpen(false)}
              >
                Iniciar sesión
              </Link>
              <Link
                to="/signup"
                className={styles.menuOption}
                onClick={() => setIsOpen(false)}
              >
                Registrarse
              </Link>
            </>
          ) : (
            <>
              <NavLink
                to="/user/profile"
                className={styles.menuOption}
                onClick={() => setIsOpen(false)}
              >
                Perfil
              </NavLink>
              <button
                onClick={handleLogout}
                className={styles.menuOption}
              >
                Cerrar sesión
              </button>
            </>
          )}
        </div>
      )}
    </aside>
  );
}));

// Componente principal Header
const Header = memo(({ URL = '', imgProductDefault = '', imgDefault = '', setCatPro = null }) => {
  // Vars 
  const { logout, admin, theme, changeTheme } = useContext(AuthContext)
  const { getTotalItems } = useCart()
  const navigate = useNavigate()
  const location = useLocation()
  const profileMenuRef = useRef()

  // Dynamic vars 
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false)
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)
  const [navigation] = useState([{ name: "Inicio", href: "/" }, { name: "Productos", href: "/productos/all" }])
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isDarkMode, toggleDarkMode] = useDarkMode()

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout(URL);
    navigate('/');
    setIsProfileMenuOpen(false);
  };

  // Función para verificar si la ruta está activa
  const isActive = (href) => {
    return location.pathname === href ||
      (href !== '/' && location.pathname.startsWith(href));
  }

  useEffect(() => {
    if (!isMenuOpen) return
    const handleClickOutside = (event) => {
      const nav = document.querySelector(`.${styles.mobileNavContent}`)
      if (nav && !nav.contains(event.target)) {
        setIsMenuOpen(false)
      }
    };
    document.addEventListener("click", handleClickOutside)
    return () => document.removeEventListener("click", handleClickOutside)
  }, [isMenuOpen])

  return (
    <>
      <header className={styles.header}>
        {/* Logo */}
        <Link to="/" className={styles.logo}>
          <div className={styles.logoIcon}>
            <span>F</span>
          </div>
          <span className={styles.logoText}>FashionHub</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className={styles.navigation}>
          {navigation?.map((item, index) => (
            <NavLinkItem
              key={`nav-${index}-${item.href}`} // Clave más única
              item={item}
              setCatPro={setCatPro}
              isActive={isActive(item.href)}
            />
          ))}
          {admin && (
            <Link
              to="/admin/home"
              className={`${styles.navLink} ${isActive('/admin/home') ? styles.activeLink : ''}`}
            >
              Administración
            </Link>
          )}
        </nav>

        {/* Actions */}
        <nav className={styles.actions}>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => {
              changeTheme()
              toggleDarkMode(!isDarkMode)
            }}
            aria-label="Cambiar tema"
          >
            {theme === 'DARK' ? <Sun style={{ color: 'var(--gray-700)' }} /> : <Moon style={{ color: 'var(--gray-700)' }} />}
          </Button>

          <Button variant="ghost" size="icon" className={styles.hidden}>
            <Search style={{ color: 'var(--gray-700)' }} />
          </Button>

          <Button variant="ghost" size="icon" onClick={() => setIsFavoritesOpen(true)}>
            <Heart style={{ color: 'var(--gray-700)' }} />
          </Button>

          <ProfileMenu
            ref={profileMenuRef}
            isOpen={isProfileMenuOpen}
            setIsOpen={setIsProfileMenuOpen}
            imgDefault={imgDefault}
            handleLogout={handleLogout}
            styles={styles}
          />

          <div className={styles.cartButton}>
            <Button variant="ghost" size="icon" onClick={() => setIsCartOpen(true)}>
              <ShoppingBag style={{ color: 'var(--gray-700)' }} />
              {getTotalItems() > 0 && <span className={styles.cartBadge}>{getTotalItems()}</span>}
            </Button>
          </div>

          <div className={styles.mobileMenu}>
            <button
              className={styles.mobileMenuButton}
              onClick={() => setIsMenuOpen(true)}
              aria-label="Abrir menú móvil"
            >
              ☰
            </button>
          </div>
        </nav>
      </header>

      {isMenuOpen && (
        <nav className={styles.mobileNav}>
          <div className={styles.mobileNavContent}>
            {navigation?.map((item, index) => (
              <NavLinkItem
                key={`mobile-nav-${index}-${item.href}`}
                item={item}
                setCatPro={setCatPro}
                isActive={isActive(item.href)}
              />
            ))}
            {admin && (
              <Link
                to="/admin/home"
                className={`${styles.navLink} ${isActive('/admin/home') ? styles.activeLink : ''}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Administración
              </Link>
            )}
            <div className={styles.mobileNavActions}>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => {
                  changeTheme()
                  toggleDarkMode(!isDarkMode)
                  setIsMenuOpen(false)
                }}
                aria-label="Cambiar tema"
              >
                {theme === 'DARK' ? <Sun style={{ color: 'var(--gray-700)' }} /> : <Moon style={{ color: 'var(--gray-700)' }} />}
              </Button>

              <ProfileMenu
                ref={profileMenuRef}
                isOpen={isProfileMenuOpen}
                setIsOpen={setIsProfileMenuOpen}
                imgDefault={imgDefault}
                handleLogout={handleLogout}
                styles={styles}
              />
              <Button variant="ghost" size="icon" onClick={() => {
                setIsFavoritesOpen(true)
                setIsMenuOpen(false)
              }}>
                <Heart style={{ color: 'var(--gray-700)' }} />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => {
                setIsCartOpen(true)
                setIsMenuOpen(false)
              }}>
                <ShoppingBag style={{ color: 'var(--gray-700)' }} />
                {getTotalItems() > 0 && <span className={styles.cartBadge}>{getTotalItems()}</span>}
              </Button>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className={styles.mobileNavClose}
              onClick={() => setIsMenuOpen(false)}
              aria-label="Cerrar menú móvil"
            >
              ✕
            </Button>
          </div>
        </nav>
      )}

      <CartSheet
        URL={URL}
        imgProductDefault={imgProductDefault}
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
      />
      <FavoritesSheet
        URL={URL}
        img={imgProductDefault}
        isOpen={isFavoritesOpen}
        onClose={() => setIsFavoritesOpen(false)}
      />
    </>
  );
});

export default Header;