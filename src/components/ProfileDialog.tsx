import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';
import type { Product } from './ProductCard';

interface ProfileDialogProps {
  isOpen: boolean;
  onClose: () => void;
  isSeller: boolean;
  userEmail: string;
  onAddProduct: (product: Omit<Product, 'id'>) => void;
}

export default function ProfileDialog({ isOpen, onClose, isSeller, userEmail, onAddProduct }: ProfileDialogProps) {
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productOldPrice, setProductOldPrice] = useState('');
  const [productImage, setProductImage] = useState('');
  const [productDescription, setProductDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newProduct = {
      name: productName,
      price: Number(productPrice),
      oldPrice: productOldPrice ? Number(productOldPrice) : undefined,
      image: productImage || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
      rating: 5.0,
      reviews: 0,
      seller: userEmail.split('@')[0],
      sellerRating: 5.0,
    };

    onAddProduct(newProduct);
    
    setProductName('');
    setProductPrice('');
    setProductOldPrice('');
    setProductImage('');
    setProductDescription('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Icon name="User" size={24} />
            Профиль
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">Email</p>
            <p className="font-medium">{userEmail}</p>
            <p className="text-sm text-muted-foreground mt-2">Тип аккаунта</p>
            <p className="font-medium">{isSeller ? 'Продавец' : 'Покупатель'}</p>
          </div>

          {isSeller && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-lg font-semibold">
                <Icon name="Plus" size={20} />
                Добавить товар
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="product-name">Название товара *</Label>
                  <Input
                    id="product-name"
                    placeholder="Введите название товара"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="product-price">Цена (₽) *</Label>
                    <Input
                      id="product-price"
                      type="number"
                      placeholder="1000"
                      value={productPrice}
                      onChange={(e) => setProductPrice(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="product-old-price">Старая цена (₽)</Label>
                    <Input
                      id="product-old-price"
                      type="number"
                      placeholder="1500"
                      value={productOldPrice}
                      onChange={(e) => setProductOldPrice(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="product-image">URL изображения</Label>
                  <Input
                    id="product-image"
                    type="url"
                    placeholder="https://example.com/image.jpg"
                    value={productImage}
                    onChange={(e) => setProductImage(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Оставьте пустым для изображения по умолчанию
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="product-description">Описание</Label>
                  <Textarea
                    id="product-description"
                    placeholder="Описание товара..."
                    value={productDescription}
                    onChange={(e) => setProductDescription(e.target.value)}
                    rows={4}
                  />
                </div>

                <Button type="submit" className="w-full">
                  <Icon name="Plus" size={16} className="mr-2" />
                  Добавить товар
                </Button>
              </form>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
