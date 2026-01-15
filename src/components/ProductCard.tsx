import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

export interface Product {
  id: number;
  name: string;
  price: number;
  oldPrice?: number;
  image: string;
  rating: number;
  reviews: number;
  seller: string;
  sellerRating: number;
}

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const discount = product.oldPrice 
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : 0;

  return (
    <Card className="overflow-hidden hover-scale cursor-pointer group">
      <div className="relative aspect-square bg-gray-100">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-full object-cover"
        />
        {discount > 0 && (
          <Badge className="absolute top-2 left-2 bg-accent">
            -{discount}%
          </Badge>
        )}
      </div>
      
      <div className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <div className="flex items-center gap-1 text-sm mb-1">
              <Icon name="Star" size={14} className="fill-yellow-400 text-yellow-400" />
              <span className="font-medium">{product.rating}</span>
              <span className="text-muted-foreground">({product.reviews})</span>
            </div>
            <h3 className="font-medium line-clamp-2 group-hover:text-primary transition-colors">
              {product.name}
            </h3>
          </div>
        </div>

        <div className="text-xs text-muted-foreground flex items-center gap-1">
          <Icon name="Store" size={12} />
          <span>{product.seller}</span>
          <Icon name="Star" size={12} className="fill-yellow-400 text-yellow-400 ml-1" />
          <span>{product.sellerRating}</span>
        </div>

        <div className="space-y-2">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold">
              {product.price.toLocaleString('ru-RU')} ₽
            </span>
            {product.oldPrice && (
              <span className="text-sm text-muted-foreground line-through">
                {product.oldPrice.toLocaleString('ru-RU')} ₽
              </span>
            )}
          </div>

          <Button 
            onClick={() => onAddToCart(product)}
            className="w-full"
            size="sm"
          >
            <Icon name="ShoppingCart" size={16} className="mr-2" />
            В корзину
          </Button>
        </div>
      </div>
    </Card>
  );
}
