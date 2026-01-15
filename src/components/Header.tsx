import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface HeaderProps {
  onAuthOpen: () => void;
  cartItemsCount: number;
  onCartOpen: () => void;
  onSearch: (query: string) => void;
  isAuthenticated: boolean;
  onProfileOpen: () => void;
}

export default function Header({ onAuthOpen, cartItemsCount, onCartOpen, onSearch, isAuthenticated, onProfileOpen }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 gap-4">
          <div className="flex items-center gap-2">
            <div className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              DLPlus
            </div>
          </div>

          <form onSubmit={handleSearch} className="flex-1 max-w-2xl">
            <div className="relative">
              <Input
                type="search"
                placeholder="Поиск товаров..."
                className="w-full pr-10"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  onSearch(e.target.value);
                }}
              />
              <Button
                type="submit"
                size="icon"
                variant="ghost"
                className="absolute right-0 top-0 h-full"
              >
                <Icon name="Search" size={20} />
              </Button>
            </div>
          </form>

          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <Button variant="ghost" onClick={onProfileOpen}>
                <Icon name="User" size={20} className="mr-2" />
                Профиль
              </Button>
            ) : (
              <Button variant="ghost" onClick={onAuthOpen}>
                <Icon name="LogIn" size={20} className="mr-2" />
                Войти
              </Button>
            )}
            
            <Button variant="ghost" className="relative" onClick={onCartOpen}>
              <Icon name="ShoppingCart" size={20} />
              {cartItemsCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                  {cartItemsCount}
                </Badge>
              )}
            </Button>
          </div>
        </div>

        <nav className="flex items-center gap-6 h-12 text-sm">
          <a href="#" className="hover:text-primary transition-colors font-medium">Главная</a>
          <a href="#catalog" className="hover:text-primary transition-colors">Каталог</a>
          <a href="#delivery" className="hover:text-primary transition-colors">Доставка</a>
          <a href="#contacts" className="hover:text-primary transition-colors">Контакты</a>
        </nav>
      </div>
    </header>
  );
}
