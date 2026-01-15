import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard, { Product } from '@/components/ProductCard';
import Cart from '@/components/Cart';
import AuthDialog from '@/components/AuthDialog';
import ProfileDialog from '@/components/ProfileDialog';
import DeliveryDialog from '@/components/DeliveryDialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

const INITIAL_PRODUCTS: Product[] = [];

const CATEGORIES = [
  { name: 'Электроника', icon: 'Smartphone' as const, color: 'bg-blue-100 text-blue-600' },
  { name: 'Одежда', icon: 'ShirtIcon' as const, color: 'bg-purple-100 text-purple-600' },
  { name: 'Дом и сад', icon: 'Home' as const, color: 'bg-green-100 text-green-600' },
  { name: 'Детские товары', icon: 'Baby' as const, color: 'bg-pink-100 text-pink-600' },
  { name: 'Спорт', icon: 'Dumbbell' as const, color: 'bg-orange-100 text-orange-600' },
  { name: 'Красота', icon: 'Sparkles' as const, color: 'bg-red-100 text-red-600' },
];

interface CartItem extends Product {
  quantity: number;
}

export default function Index() {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isDeliveryOpen, setIsDeliveryOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSeller, setIsSeller] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [deliveryPoint, setDeliveryPoint] = useState('');

  const handleSearch = (query: string) => {
    if (!query.trim()) {
      setFilteredProducts(products);
      return;
    }
    const filtered = products.filter(p =>
      p.name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredProducts(filtered);
  };

  const handleAddToCart = (product: Product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    toast.success('Товар добавлен в корзину');
  };

  const handleRemoveFromCart = (id: number) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
    toast.info('Товар удален из корзины');
  };

  const handleUpdateQuantity = (id: number, quantity: number) => {
    setCartItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const handleAuth = (email: string, seller: boolean) => {
    setIsAuthenticated(true);
    setIsSeller(seller);
    setUserEmail(email);
    toast.success(`Добро пожаловать, ${email}!`);
  };

  const handleAddProduct = (newProduct: Omit<Product, 'id'>) => {
    const product: Product = {
      ...newProduct,
      id: products.length + 1,
    };
    setProducts(prev => [product, ...prev]);
    setFilteredProducts(prev => [product, ...prev]);
    toast.success('Товар успешно добавлен!');
  };

  const handleSelectDeliveryPoint = (city: string, address: string) => {
    setDeliveryPoint(address);
    toast.success(`Выбран пункт выдачи: ${address}`);
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      setIsCartOpen(false);
      setIsAuthOpen(true);
      toast.info('Войдите, чтобы оформить заказ');
      return;
    }
    if (!deliveryPoint) {
      setIsCartOpen(false);
      setIsDeliveryOpen(true);
      toast.info('Выберите пункт выдачи');
      return;
    }
    toast.success('Заказ успешно оформлен!');
    setCartItems([]);
    setIsCartOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header
        onAuthOpen={() => setIsAuthOpen(true)}
        cartItemsCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
        onCartOpen={() => setIsCartOpen(true)}
        onSearch={handleSearch}
        isAuthenticated={isAuthenticated}
        onProfileOpen={() => setIsProfileOpen(true)}
      />

      <main className="flex-1">
        <section className="bg-gradient-to-r from-primary to-accent text-white py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl">
              <h1 className="text-5xl font-bold mb-4">
                Добро пожаловать в DLPlus
              </h1>
              <p className="text-xl opacity-90 mb-8">
                Современный маркетплейс с широким ассортиментом товаров и выгодными ценами
              </p>
              <div className="flex gap-4">
                <Button size="lg" variant="secondary">
                  <Icon name="ShoppingBag" size={20} className="mr-2" />
                  Начать покупки
                </Button>
                {!isAuthenticated && (
                  <Button size="lg" variant="outline" className="bg-white/10 hover:bg-white/20 border-white text-white" onClick={() => setIsAuthOpen(true)}>
                    Стать продавцом
                  </Button>
                )}
              </div>
            </div>
          </div>
        </section>

        <section id="catalog" className="container mx-auto px-4 py-12">
          <h2 className="text-3xl font-bold mb-8">Категории</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {CATEGORIES.map((category) => (
              <Card
                key={category.name}
                className="p-6 text-center hover-scale cursor-pointer"
              >
                <div className={`w-16 h-16 rounded-full ${category.color} mx-auto mb-3 flex items-center justify-center`}>
                  <Icon name={category.icon} size={32} />
                </div>
                <h3 className="font-medium">{category.name}</h3>
              </Card>
            ))}
          </div>
        </section>

        <section className="container mx-auto px-4 py-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">Популярные товары</h2>
            <div className="text-sm text-muted-foreground">
              Найдено товаров: {filteredProducts.length}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        </section>

        <section id="delivery" className="bg-white py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8 text-center">Доставка</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="p-6 text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 text-primary mx-auto mb-4 flex items-center justify-center">
                  <Icon name="Package" size={32} />
                </div>
                <h3 className="font-semibold mb-2">Пункты выдачи</h3>
                <p className="text-sm text-muted-foreground">
                  Более 10 000 пунктов выдачи по всей России
                </p>
              </Card>
              <Card className="p-6 text-center">
                <div className="w-16 h-16 rounded-full bg-accent/10 text-accent mx-auto mb-4 flex items-center justify-center">
                  <Icon name="Truck" size={32} />
                </div>
                <h3 className="font-semibold mb-2">Доставка курьером</h3>
                <p className="text-sm text-muted-foreground">
                  Быстрая доставка до двери за 1-3 дня
                </p>
              </Card>
              <Card className="p-6 text-center">
                <div className="w-16 h-16 rounded-full bg-green-100 text-green-600 mx-auto mb-4 flex items-center justify-center">
                  <Icon name="MapPin" size={32} />
                </div>
                <h3 className="font-semibold mb-2">Отслеживание</h3>
                <p className="text-sm text-muted-foreground">
                  Следите за заказом онлайн в режиме реального времени
                </p>
              </Card>
            </div>
            <div className="text-center mt-8">
              <Button size="lg" onClick={() => setIsDeliveryOpen(true)}>
                <Icon name="MapPin" size={20} className="mr-2" />
                Выбрать пункт выдачи
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      <Cart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onRemove={handleRemoveFromCart}
        onUpdateQuantity={handleUpdateQuantity}
        onCheckout={handleCheckout}
      />

      <AuthDialog
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onAuth={handleAuth}
      />

      <ProfileDialog
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        isSeller={isSeller}
        userEmail={userEmail}
        onAddProduct={handleAddProduct}
      />

      <DeliveryDialog
        isOpen={isDeliveryOpen}
        onClose={() => setIsDeliveryOpen(false)}
        onSelectPoint={handleSelectDeliveryPoint}
      />
    </div>
  );
}