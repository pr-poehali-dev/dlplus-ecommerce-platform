import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import Icon from '@/components/ui/icon';

const RUSSIAN_CITIES = [
  'Москва', 'Санкт-Петербург', 'Новосибирск', 'Екатеринбург', 'Казань',
  'Нижний Новгород', 'Челябинск', 'Самара', 'Омск', 'Ростов-на-Дону',
  'Уфа', 'Красноярск', 'Воронеж', 'Пермь', 'Волгоград',
  'Краснодар', 'Саратов', 'Тюмень', 'Тольятти', 'Ижевск',
  'Барнаул', 'Ульяновск', 'Иркутск', 'Хабаровск', 'Ярославль',
  'Владивосток', 'Махачкала', 'Томск', 'Оренбург', 'Кемерово',
  'Новокузнецк', 'Рязань', 'Астрахань', 'Набережные Челны', 'Пенза',
  'Киров', 'Липецк', 'Чебоксары', 'Калининград', 'Тула',
  'Курск', 'Ставрополь', 'Сочи', 'Улан-Удэ', 'Тверь',
  'Магнитогорск', 'Иваново', 'Брянск', 'Белгород', 'Архангельск',
  'Елец',
];

interface DeliveryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPoint: (city: string, address: string) => void;
}

export default function DeliveryDialog({ isOpen, onClose, onSelectPoint }: DeliveryDialogProps) {
  const [selectedCity, setSelectedCity] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAddress, setSelectedAddress] = useState('');

  const filteredCities = RUSSIAN_CITIES.filter(city =>
    city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pickupPoints = selectedCity ? [
    `${selectedCity}, ул. Ленина, 10`,
    `${selectedCity}, ул. Гагарина, 25`,
    `${selectedCity}, ул. Советская, 5`,
    `${selectedCity}, пр-т Мира, 100`,
    `${selectedCity}, ул. Пушкина, 15`,
  ] : [];

  const handleConfirm = () => {
    if (selectedCity && selectedAddress) {
      onSelectPoint(selectedCity, selectedAddress);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Icon name="MapPin" size={24} />
            Выбор пункта выдачи
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Выберите город</Label>
            <Input
              placeholder="Поиск города..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <ScrollArea className="h-48 border rounded-lg p-2">
            <div className="space-y-1">
              {filteredCities.map((city) => (
                <button
                  key={city}
                  onClick={() => {
                    setSelectedCity(city);
                    setSelectedAddress('');
                  }}
                  className={`w-full text-left px-3 py-2 rounded hover:bg-muted transition-colors ${
                    selectedCity === city ? 'bg-primary text-primary-foreground' : ''
                  }`}
                >
                  {city}
                </button>
              ))}
            </div>
          </ScrollArea>

          {selectedCity && (
            <>
              <div className="space-y-2">
                <Label>Выберите пункт выдачи</Label>
              </div>

              <ScrollArea className="h-48 border rounded-lg p-2">
                <div className="space-y-2">
                  {pickupPoints.map((point) => (
                    <button
                      key={point}
                      onClick={() => setSelectedAddress(point)}
                      className={`w-full text-left px-3 py-3 rounded border hover:border-primary transition-colors ${
                        selectedAddress === point ? 'border-primary bg-primary/5' : ''
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        <Icon name="Package" size={16} className="mt-1 flex-shrink-0" />
                        <div>
                          <p className="font-medium text-sm">{point}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Ежедневно с 9:00 до 21:00
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </ScrollArea>
            </>
          )}

          <Button 
            onClick={handleConfirm}
            disabled={!selectedCity || !selectedAddress}
            className="w-full"
          >
            <Icon name="Check" size={16} className="mr-2" />
            Подтвердить выбор
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}