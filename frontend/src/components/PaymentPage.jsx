import React, { useState, useEffect } from 'react';
import { useCart } from '../contexts/CartContext';
import { useHistory } from 'react-router-dom'; // Используем useHistory для v5
import { Container, Row, Col, Button, InputGroup, FormControl, Alert, Spinner } from 'react-bootstrap'; // Добавили Alert, Spinner
import { FaPlus, FaMinus } from 'react-icons/fa';
import axios from 'axios'; // Импортируем axios

const API_BASE_URL = 'http://localhost:5160'; // URL вашего API
const COIN_DENOMINATIONS = [1, 2, 5, 10];

const PaymentPage = () => {
  // Получаем cart из контекста для отправки на бэкенд
  const { cart, totalCartPrice, clearCart } = useCart();
  const history = useHistory();

  const [coinsEntered, setCoinsEntered] = useState(
    COIN_DENOMINATIONS.reduce((acc, coin) => ({ ...acc, [coin]: 0 }), {})
  );
  const [totalEntered, setTotalEntered] = useState(0);
  const [canPay, setCanPay] = useState(false);

  // Состояния для обработки запроса
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState(null);

  useEffect(() => {
    const sum = COIN_DENOMINATIONS.reduce((acc, coin) => {
        const count = Number(coinsEntered[coin]) || 0;
        return acc + count * coin;
    } , 0);
    setTotalEntered(sum);
    setCanPay(sum >= totalCartPrice && totalCartPrice > 0); // Можно оплатить только если есть что оплачивать
  }, [coinsEntered, totalCartPrice]);

  const handleCoinChange = (coin, value) => {
    const numValue = parseInt(value, 10);
    if (!isNaN(numValue) && numValue >= 0) {
      setCoinsEntered(prev => ({ ...prev, [coin]: numValue }));
    } else if (value === '') {
        setCoinsEntered(prev => ({ ...prev, [coin]: 0 }));
    }
  };

  const incrementCoin = (coin) => {
     setCoinsEntered(prev => ({ ...prev, [coin]: (Number(prev[coin]) || 0) + 1 }));
  }

  const decrementCoin = (coin) => {
     setCoinsEntered(prev => ({ ...prev, [coin]: Math.max(0, (Number(prev[coin]) || 0) - 1) }));
  }

  const handlePayment = async () => {
    if (isProcessing || !canPay) return; // Не отправлять, если уже обрабатывается или нельзя оплатить

    setIsProcessing(true);
    setPaymentError(null);

    // Готовим данные для API
    const orderData = {
      items: cart.map(item => ({
        productId: item.id,
        quantity: item.quantity
      })),
      coinsPaid: coinsEntered // Передаем объект { номинал: количество }
    };

    try {
      const response = await axios.post(`${API_BASE_URL}/api/orders`, orderData);
      const result = response.data; // Ожидаем объект ProcessOrderResult

      if (result && result.success) {
        clearCart();
        // Передаем данные о сдаче на страницу успеха
        history.push('/payment-success', {
            changeAmount: result.changeAmount,
            changeBreakdown: result.changeCoins // Ожидаем словарь { номинал: количество }
        });
      } else {
        // Показываем ошибку от бэкенда
        setPaymentError(result?.errorMessage || "Произошла неизвестная ошибка при оплате.");
      }
    } catch (error) {
      console.error("Ошибка при отправке заказа:", error);
      // Пытаемся получить сообщение об ошибке от бэкенда, если есть
      const backendError = error.response?.data?.errorMessage || error.response?.data?.title || error.message;
      setPaymentError(`Ошибка связи с сервером: ${backendError || 'Попробуйте позже.'}`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Container className="mt-4 payment-page">
      <h1 className="mb-4">Оплата</h1>

      {paymentError && <Alert variant="danger">{paymentError}</Alert>}

      {/* Ввод монет ... (остается как было) */}
        <Row className="d-none d-md-flex mb-3 payment-header">
          <Col md={3}><strong>Номинал</strong></Col>
          <Col md={5} className="text-center"><strong>Количество</strong></Col>
          <Col md={4} className="text-end"><strong>Сумма</strong></Col>
        </Row>
        {COIN_DENOMINATIONS.map(coin => (
         <Row key={coin} className="align-items-center mb-3 coin-row">
           <Col xs={4} md={3}>
             <div className="coin-denomination">
               <span className="coin-circle">{coin}</span> {coin} рубль{coin === 1 ? '' : (coin < 5 ? 'я' : 'ей')}
             </div>
           </Col>
           <Col xs={8} md={5} className="mt-2 mt-md-0">
               <InputGroup className="quantity-control mx-auto">
                 <Button variant="outline-secondary" onClick={() => decrementCoin(coin)} disabled={isProcessing}><FaMinus /></Button>
                 <FormControl
                   type="number"
                   className="text-center quantity-input"
                   value={coinsEntered[coin]}
                   onChange={(e) => handleCoinChange(coin, e.target.value)}
                   min="0"
                   disabled={isProcessing}
                 />
                 <Button variant="outline-secondary" onClick={() => incrementCoin(coin)} disabled={isProcessing}><FaPlus /></Button>
               </InputGroup>
           </Col>
           <Col xs={12} md={4} className="text-end mt-2 mt-md-0 coin-subtotal">
               <strong>{(Number(coinsEntered[coin]) || 0) * coin} руб.</strong>
           </Col>
         </Row>
       ))}
       <hr />

      {/* Итоги и кнопки */}
      <Row className="align-items-center mt-4">
        <Col xs={12} md={6} className="payment-summary mb-3 mb-md-0">
          <h3>Итоговая сумма: <span className="total-price">{totalCartPrice} руб.</span></h3>
          <h3>Вы внесли:
            <span className={totalEntered >= totalCartPrice ? 'text-success' : 'text-danger'}>
              {' '}{totalEntered} руб.
            </span>
          </h3>
        </Col>
        <Col xs={12} md={6} className="d-flex justify-content-end align-items-center payment-buttons">
            <Button variant="warning" onClick={() => history.push('/cart')} className="return-button me-3" disabled={isProcessing}>
              Вернуться
            </Button>
            <Button
              variant="success"
              size="lg"
              onClick={handlePayment}
              disabled={!canPay || isProcessing}
              className="payment-button"
            >
              {isProcessing ? <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> : 'Оплатить'}
            </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default PaymentPage;