import { memo, useContext, useEffect, useRef, useState, forwardRef } from "react";
import { Link, useNavigate, useLocation, NavLink } from "react-router-dom";
import { Heart, Search, ShoppingBag } from 'lucide-react';

// Imports 
import { CheckImage, errorStatusHandler, showAlert } from "../../Utils/utils";
import { AuthContext } from "../../Contexts/Contexts";
import { useCart } from "../../Contexts/CartContext"
import CartSheet from "../CartSheet/CartSheet";
import Button from "../Button/Button";
import FavoritesSheet from "../FavoritesSheet/FavoritesSheet";
import { GetData } from "../../Utils/Requests"

// Import styles 
import styles from "./Header.module.css"

// Cache para las categorías
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
  const location = useLocation();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [navigation, setNavigation] = useState([{ name: "Inicio", href: "/" }]);
  const profileMenuRef = useRef();
  const navigate = useNavigate();

  const { getTotalItems } = useCart();
  const { logout, admin } = useContext(AuthContext);
  const [hasFetched, setHasFetched] = useState(false);

  const getProductCategories = async () => {
    // Verificar si ya tenemos datos en caché y si no han expirado
    const now = Date.now();
    if (categoriesCache && (now - lastFetchTime < CACHE_DURATION)) {
      setNavigation(categoriesCache);
      return;
    }

    try {
      const product = await GetData(`${URL}/products/categories`);
      if (product) {
        const catPro = [{ name: "Inicio", href: "/" }];
        product?.forEach(cat => {
          catPro.push({
            name: cat.nom_cat_pro,
            href: `/productos/${cat.slug?.toLowerCase()}`
          });
        });

        // Actualizar caché
        categoriesCache = catPro;
        lastFetchTime = now;

        setNavigation(catPro)
        setHasFetched(true)
      }
    } catch (err) {
      const message = errorStatusHandler(err)
      showAlert('Error', message, 'error')
    }
  }

  useEffect(() => {
    if (!hasFetched) {
      getProductCategories();
    }
  }, [URL, hasFetched]);

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
  };

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
          {navigation.map((item, index) => (
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