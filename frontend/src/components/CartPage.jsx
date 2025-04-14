import React from 'react';
import { useCart } from '../contexts/CartContext';
import { Link, useHistory } from 'react-router-dom';
import { Container, Row, Col, Button, Image, InputGroup, FormControl } from 'react-bootstrap';
import { FaPlus, FaMinus, FaTrash } from 'react-icons/fa'; // Иконки

const CartPage = () => {
  const {
    cart,
    removeFromCart,
    incrementQuantity,
    decrementQuantity,
    updateQuantity,
    totalCartPrice } = useCart();
  const history = useHistory(); // Для кнопки "Вернуться"

  const handleQuantityChange = (id, value) => {
    const numValue = parseInt(value, 10);
    if (!isNaN(numValue)) {
      updateQuantity(id, numValue);
    }
  };

  if (cart.length === 0) {
    return (
      <Container className="text-center mt-5">
        <h2>Ваша корзина пуста</h2>
        <p>У вас нет ни одного товара, вернитесь на страницу каталога.</p>
        <Link to="/">
          <Button variant="primary">Вернуться в каталог</Button>
        </Link>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <h1 className="mb-4">Оформление заказа</h1>

      {/* Заголовки таблицы */}
      <Row className="d-none d-md-flex mb-3 cart-header">
         <Col md={2}></Col> {/* Пустая колонка для изображения */}
         <Col md={4}><strong>Товар</strong></Col>
         <Col md={3} className="text-center"><strong>Количество</strong></Col>
         <Col md={2} className="text-end"><strong>Цена</strong></Col>
         <Col md={1}></Col> {/* Пустая колонка для удаления */}
      </Row>

      {/* Список товаров */}
      {cart.map(item => (
        <Row key={item.id} className="align-items-center mb-3 cart-item">
          <Col xs={3} md={2}>
            <Image src={item.image} alt={item.name} fluid rounded className="cart-item-image"/>
          </Col>
          <Col xs={9} md={4}>
            {item.name}
          </Col>
          <Col xs={8} md={3} className="mt-2 mt-md-0">
            <InputGroup className="quantity-control mx-auto">
              <Button variant="outline-secondary" onClick={() => decrementQuantity(item.id)}><FaMinus /></Button>
              <FormControl
                type="number"
                className="text-center quantity-input"
                value={item.quantity}
                onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                min="1"
                max={item.stock} // Устанавливаем максимальное значение
              />
              <Button variant="outline-secondary" onClick={() => incrementQuantity(item.id)} disabled={item.quantity >= item.stock}><FaPlus /></Button>
            </InputGroup>
             {item.quantity >= item.stock && <div className="text-danger text-center stock-limit-text">Макс.</div>}
          </Col>
          <Col xs={3} md={2} className="text-end mt-2 mt-md-0">
            <strong>{(item.price * item.quantity)} руб.</strong>
          </Col>
          <Col xs={1} md={1} className="text-end mt-2 mt-md-0">
            <Button variant="danger" size="sm" onClick={() => removeFromCart(item.id)}>
              <FaTrash />
            </Button>
          </Col>
        </Row>
      ))}

      <hr />

      {/* Итоговая сумма и кнопки */}
      <Row className="align-items-center mt-4">
        <Col md={6}>
          <Button variant="warning" onClick={() => history.push('/')} className="return-button">
            Вернуться
          </Button>
        </Col>
        <Col md={6} className="text-end">
          <h3 className="mb-3">Итоговая сумма: <span className="total-price">{totalCartPrice} руб.</span></h3>
          <Link to="/payment">
            <Button variant="success" size="lg" className="payment-button">
              Оплата
            </Button>
          </Link>
        </Col>
      </Row>
    </Container>
  );
};

export default CartPage;