import Icon from '@/components/ui/icon';

export default function Footer() {
  return (
    <footer id="contacts" className="bg-gray-900 text-white mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              DLPlus
            </h3>
            <p className="text-gray-400 text-sm">
              Современный маркетплейс с широким ассортиментом товаров
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Покупателям</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Как сделать заказ</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Оплата</a></li>
              <li><a href="#delivery" className="hover:text-white transition-colors">Доставка</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Возврат товара</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Продавцам</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Как продавать</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Условия работы</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Тарифы</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Контакты</h4>
            <div className="space-y-3 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <Icon name="Phone" size={16} />
                <span>8 (800) 555-35-35</span>
              </div>
              <div className="flex items-center gap-2">
                <Icon name="Mail" size={16} />
                <span>support@dlplus.ru</span>
              </div>
              <div className="flex gap-3 mt-4">
                <a href="#" className="hover:text-primary transition-colors">
                  <Icon name="Send" size={20} />
                </a>
                <a href="#" className="hover:text-primary transition-colors">
                  <Icon name="MessageCircle" size={20} />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>© 2026 DLPlus. Все права защищены.</p>
        </div>
      </div>
    </footer>
  );
}
