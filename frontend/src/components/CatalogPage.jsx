import React, { useState, useEffect } from 'react';
import { useCart } from '../contexts/CartContext'; // Убедитесь, что путь к файлу контекста верный
import { Link } from 'react-router-dom';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import ProductCard from './ProductCard';

// --- Константы вынесены НАРУЖУ компонента ---
const allProducts = [
  { id: 1, name: 'Напиток газированный Coca-Cola', brand: 'Coca-Cola', price: 105, stock: 10, image: '/images/cola.png' },
  { id: 2, name: 'Напиток газированный Fanta', brand: 'Fanta', price: 98, stock: 5, image: '/images/fanta.png' },
  { id: 3, name: 'Напиток газированный Sprite', brand: 'Sprite', price: 83, stock: 8, image: '/images/sprite.png' },
  { id: 4, name: 'Напиток газированный Dr. Pepper Zero', brand: 'Dr. Pepper', price: 110, stock: 0, image: '/images/dr_pepper.png' },
  { id: 5, name: 'Напиток газированный Pepsi', brand: 'Pepsi', price: 95, stock: 12, image: '/images/pepsi.png' },
  { id: 6, name: 'Напиток газированный 7UP', brand: '7UP', price: 85, stock: 7, image: '/images/7up.png' },
  { id: 7, name: 'Напиток газированный Mirinda', brand: 'Mirinda', price: 92, stock: 3, image: '/images/mirinda.png' },
  { id: 8, name: 'Напиток газированный Mountain Dew', brand: 'Mountain Dew', price: 100, stock: 6, image: '/images/dew.png' },
];
const brands = ['Все бренды', ...new Set(allProducts.map(p => p.brand))];
const initialMinPrice = Math.min(...allProducts.map(p => p.price).filter(p => !isNaN(p)), 0);
const initialMaxPrice = Math.max(...allProducts.map(p => p.price).filter(p => !isNaN(p)), 1);
// ---------------------------------------------------

const CatalogPage = () => {
  const { totalCartItems } = useCart(); // Получаем ТОЛЬКО totalCartItems, т.к. остальное не используется напрямую
  const [selectedBrand, setSelectedBrand] = useState('Все бренды');
  const [maxPrice, setMaxPrice] = useState(initialMaxPrice);
  const [minProductPrice, setMinProductPrice] = useState(initialMinPrice);
  const [maxProductPrice, setMaxProductPrice] = useState(initialMaxPrice);
  const [filteredProducts, setFilteredProducts] = useState(allProducts); // Используем константу для инициализации

  // Лог для отладки (можно убрать позже)
  // console.log('[CatalogPage] Rendering. totalCartItems:', totalCartItems);

  // Эффект для фильтрации
  useEffect(() => {
    let productsFilteredByBrand = allProducts; // Используем константу
    if (selectedBrand !== 'Все бренды') {
      productsFilteredByBrand = allProducts.filter(product => product.brand === selectedBrand);
    }

    const pricesForCurrentBrand = productsFilteredByBrand.length > 0
                                ? productsFilteredByBrand.map(p => p.price)
                                : [initialMinPrice];
    const currentMin = Math.min(...pricesForCurrentBrand);
    const currentMax = Math.max(...pricesForCurrentBrand, 1);

    setMinProductPrice(currentMin);
    setMaxProductPrice(currentMax);

    let currentSliderValue = maxPrice;
     if (maxPrice > currentMax) {
        currentSliderValue = currentMax;
        setMaxPrice(currentMax);
     } else if (maxPrice < currentMin) {
         currentSliderValue = currentMin;
         setMaxPrice(currentMin);
     }

    const finalFilteredProducts = productsFilteredByBrand.filter(
      product => product.price >= currentMin && product.price <= currentSliderValue
    );

    setFilteredProducts(finalFilteredProducts);

  }, [selectedBrand, maxPrice]); // Зависимости верны

  // Обработчик смены бренда
   const handleBrandChange = (e) => {
    const newBrand = e.target.value;
    setSelectedBrand(newBrand);

    const tempFiltered = newBrand === 'Все бренды'
        ? allProducts // Используем константу
        : allProducts.filter(p => p.brand === newBrand); // Используем константу
    const newMin = tempFiltered.length > 0 ? Math.min(...tempFiltered.map(p => p.price)) : initialMinPrice;
    const newMax = tempFiltered.length > 0 ? Math.max(...tempFiltered.map(p => p.price), 1) : initialMaxPrice;

    setMinProductPrice(newMin);
    setMaxProductPrice(newMax);
    setMaxPrice(newMax);
  };

  return (
    <Container className="mt-4">
      <Row className="mb-4 align-items-center">
        <Col md={6}>
          <h1>Газированные напитки</h1>
        </Col>
        <Col md={6} className="d-flex justify-content-end align-items-center">
          {/* <Button variant="outline-secondary" className="me-3">Импорт</Button> */}
          <Link to="/cart">
            {/* Используем totalCartItems из useCart() */}
            <Button variant="success" disabled={(totalCartItems ?? 0) === 0} className="selected-button">
              Выбрано: {totalCartItems ?? 0}
            </Button>
          </Link>
        </Col>
      </Row>

      {/* Фильтры */}
      <Row className="mb-4 filter-row">
        <Col md={6}>
          <Form.Group>
            <Form.Label>Выберите бренд</Form.Label>
            <Form.Select
              value={selectedBrand}
              onChange={handleBrandChange}
            >
              {/* Используем константу brands */}
              {brands.map(brand => (
                <option key={brand} value={brand}>{brand}</option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
        <Col md={6}>
            <Form.Group>
              <Form.Label>Стоимость: от {minProductPrice} до {maxPrice} руб. (макс: {maxProductPrice} руб.)</Form.Label>
              <Form.Range
                min={minProductPrice}
                max={maxProductPrice}
                step="1"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                key={`${minProductPrice}-${maxProductPrice}`}
              />
            </Form.Group>
        </Col>
      </Row>

      {/* Каталог товаров */}
      <Row>
        {filteredProducts.length > 0 ? (
          filteredProducts.map(product => (
            <Col md={3} key={product.id} className="mb-4">
              <ProductCard product={product} />
            </Col>
          ))
        ) : (
          <Col><p>Нет товаров, соответствующих вашему выбору.</p></Col>
        )}
      </Row>
    </Container>
  );
};

export default CatalogPage;