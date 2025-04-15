import React, { useState, useEffect } from 'react';
import { useCart } from '../contexts/CartContext';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Form, Button, Spinner, Alert } from 'react-bootstrap'; // Добавили Spinner, Alert
import ProductCard from './ProductCard';
import axios from 'axios'; // Импортируем axios

// Базовый URL вашего API
const API_BASE_URL = 'http://localhost:5160'; // Используем порт из launchSettings

const CatalogPage = () => {
  const { totalCartItems } = useCart();
  const [products, setProducts] = useState([]); // Данные с API
  const [brandsList, setBrandsList] = useState(['Все бренды']); // Данные с API + 'Все бренды'

  // Состояния для фильтров и отображения
  const [selectedBrand, setSelectedBrand] = useState('Все бренды');
  const [maxPrice, setMaxPrice] = useState(1); // Инициализируем минимумом
  const [minProductPrice, setMinProductPrice] = useState(0);
  const [maxProductPrice, setMaxProductPrice] = useState(1);
  const [filteredProducts, setFilteredProducts] = useState([]);

  // Состояния для загрузки и ошибок
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- Загрузка данных с API при монтировании ---
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [productsResponse, brandsResponse] = await Promise.all([
          axios.get(`${API_BASE_URL}/api/products`),
          axios.get(`${API_BASE_URL}/api/brands`)
        ]);

        const fetchedProducts = productsResponse.data || [];
        const fetchedBrands = brandsResponse.data || [];

        setProducts(fetchedProducts);
        setBrandsList(['Все бренды', ...fetchedBrands.map(b => b.name)]); // Используем name из BrandDto

        if (fetchedProducts.length > 0) {
            const prices = fetchedProducts.map(p => p.price);
            const initialMin = Math.min(...prices);
            const initialMax = Math.max(...prices, 1);
            setMinProductPrice(initialMin);
            setMaxProductPrice(initialMax);
            setMaxPrice(initialMax); // Устанавливаем слайдер на максимум по умолчанию
            setFilteredProducts(fetchedProducts); // Показываем все продукты изначально
        } else {
             // Если продуктов нет, ставим дефолтные значения
             setMinProductPrice(0);
             setMaxProductPrice(1);
             setMaxPrice(1);
             setFilteredProducts([]);
        }

      } catch (err) {
        console.error("Ошибка загрузки данных:", err);
        setError("Не удалось загрузить данные. Попробуйте обновить страницу.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []); // Пустой массив зависимостей - выполнить один раз при монтировании

  // --- Эффект для фильтрации товаров ---
  useEffect(() => {
    // Не запускаем фильтрацию, пока исходные данные не загружены
    if (isLoading || products.length === 0) return;

    let productsFilteredByBrand = products;
    if (selectedBrand !== 'Все бренды') {
      productsFilteredByBrand = products.filter(product => product.brandName === selectedBrand); // Фильтруем по brandName из ProductDto
    }

    const pricesForCurrentBrand = productsFilteredByBrand.length > 0
                                ? productsFilteredByBrand.map(p => p.price)
                                : [0]; // Используем 0, если для бренда нет товаров
    const currentMin = Math.min(...pricesForCurrentBrand);
    const currentMax = Math.max(...pricesForCurrentBrand, 1);

    // Обновляем отображаемые мин/макс для слайдера
    setMinProductPrice(currentMin);
    setMaxProductPrice(currentMax);

    // Корректируем положение слайдера, если нужно
     let currentSliderValue = maxPrice;
     if (maxPrice > currentMax) {
        currentSliderValue = currentMax;
        setMaxPrice(currentMax); // Обновляем стейт слайдера (вызовет перезапуск этого useEffect)
        return; // Прерываем текущий запуск, т.к. setMaxPrice вызовет новый
     } else if (maxPrice < currentMin) {
         currentSliderValue = currentMin;
         setMaxPrice(currentMin); // Обновляем стейт слайдера
         return; // Прерываем текущий запуск
     }

    // Фильтруем финально по цене
    const finalFilteredProducts = productsFilteredByBrand.filter(
      product => product.price >= currentMin && product.price <= currentSliderValue
    );

    setFilteredProducts(finalFilteredProducts);

  }, [selectedBrand, maxPrice, products, isLoading]); // Зависим от фильтров и загруженных продуктов

  // --- Обработчик смены бренда ---
  const handleBrandChange = (e) => {
    const newBrand = e.target.value;
    setSelectedBrand(newBrand);

     // Сбрасываем ползунок цены на максимум для нового фильтра
    const tempFiltered = newBrand === 'Все бренды'
        ? products
        : products.filter(p => p.brandName === newBrand); // Используем brandName

    const newMin = tempFiltered.length > 0 ? Math.min(...tempFiltered.map(p => p.price)) : 0;
    const newMax = tempFiltered.length > 0 ? Math.max(...tempFiltered.map(p => p.price), 1) : 1;

    setMinProductPrice(newMin); // Обновляем диапазон
    setMaxProductPrice(newMax);
    setMaxPrice(newMax);      // Ставим ползунок на максимум
  };

  // --- Отображение компонента ---
  if (isLoading) {
    return <Container className="text-center mt-5"><Spinner animation="border" role="status"><span className="visually-hidden">Загрузка...</span></Spinner></Container>;
  }

  if (error) {
     return <Container className="mt-5"><Alert variant="danger">{error}</Alert></Container>;
  }

  return (
    <Container className="mt-4">
      <Row className="mb-4 align-items-center">
        <Col md={6}>
          <h1>Газированные напитки</h1>
        </Col>
        <Col md={6} className="d-flex justify-content-end align-items-center">
          <Link to="/cart">
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
              {brandsList.map(brand => (
                <option key={brand} value={brand}>{brand}</option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
        <Col md={6}>
            <Form.Group>
              <Form.Label>Стоимость: от {minProductPrice} до {maxPrice} руб. (макс: {maxProductPrice} руб.)</Form.Label>
              {/* Добавляем проверку, чтобы max был не меньше min */}
              <Form.Range
                min={minProductPrice}
                max={Math.max(minProductPrice, maxProductPrice)}
                step="1"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                key={`${minProductPrice}-${maxProductPrice}`}
                disabled={maxProductPrice <= minProductPrice} // Блокируем, если диапазон схлопнулся
              />
            </Form.Group>
        </Col>
      </Row>

      {/* Каталог товаров */}
      <Row>
        {filteredProducts.length > 0 ? (
          filteredProducts.map(product => (
            // В ProductCard передаем объект DTO, убедитесь, что ProductCard ожидает такие поля
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