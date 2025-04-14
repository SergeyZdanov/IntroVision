import React, { useState, useEffect } from 'react';
import { useCart } from '../contexts/CartContext';
import { Link, useHistory } from 'react-router-dom';
import { Container, Row, Col, Button, InputGroup, FormControl } from 'react-bootstrap';
import { FaPlus, FaMinus } from 'react-icons/fa';

const COIN_DENOMINATIONS = [1, 2, 5, 10]; // Номиналы монет

const PaymentPage = () => {
  const { totalCartPrice, clearCart } = useCart();
  const history = useHistory();
  const [coinsEntered, setCoinsEntered] = useState(
      COIN_DENOMINATIONS.reduce((acc, coin) => ({ ...acc, [coin]: 0 }), {})
  ); // { 1: 0, 2: 0, 5: 0, 10: 0 }
  const [totalEntered, setTotalEntered] = useState(0);
  const [canPay, setCanPay] = useState(false);

  // Пересчет внесенной суммы при изменении количества монет
  useEffect(() => {
    const sum = COIN_DENOMINATIONS.reduce((acc, coin) => acc + coinsEntered[coin] * coin, 0);
    setTotalEntered(sum);
    setCanPay(sum >= totalCartPrice); // Кнопка "Оплатить" активна, если внесено достаточно
  }, [coinsEntered, totalCartPrice]);

  const handleCoinChange = (coin, value) => {
    const numValue = parseInt(value, 10);
    // Позволяем вводить 0, но не отрицательные числа
    if (!isNaN(numValue) && numValue >= 0) {
      setCoinsEntered(prev => ({ ...prev, [coin]: numValue }));
    } else if (value === '') { // Позволяем очищать поле
        setCoinsEntered(prev => ({ ...prev, [coin]: 0 }));
    }
  };

  const incrementCoin = (coin) => {
     setCoinsEntered(prev => ({ ...prev, [coin]: (prev[coin] || 0) + 1 }));
  }

  const decrementCoin = (coin) => {
     setCoinsEntered(prev => ({ ...prev, [coin]: Math.max(0, (prev[coin] || 0) - 1) }));
  }

  const handlePayment = () => {
    // --- ЗДЕСЬ ДОЛЖНА БЫТЬ ЛОГИКА БЭКЕНДА ---
    // 1. Отправить на бэкенд: totalCartPrice, coinsEntered (или totalEntered)
    // 2. Бэкенд проверяет, может ли выдать сдачу (totalEntered - totalCartPrice)
    // 3. Бэкенд обновляет количество монет в автомате и остатки товаров
    // 4. Бэкенд возвращает результат:
    //    - Успех: информация о сдаче (сумма, номиналы)
    //    - Ошибка: "Недостаточно средств" (хотя кнопка неактивна)
    //    - Ошибка: "Невозможно выдать сдачу"
    //    - Другая ошибка

    // --- Имитация успешной оплаты ---
    const changeAmount = totalEntered - totalCartPrice;
    console.log("Оплата произведена!");
    console.log("Сдача:", changeAmount);
    // Имитация данных для страницы успеха
    const changeBreakdown = calculateChangeBreakdown(changeAmount); // Нужна функция расчета сдачи

    clearCart(); // Очищаем корзину в контексте
    // Перенаправляем на страницу успеха с данными о сдаче
    history.push('/payment-success', { changeAmount, changeBreakdown });
    // --------------------------------

    // --- Имитация ошибки "Нет сдачи" ---
    // const cantGiveChange = true; // Получаем с бэкенда
    // if (cantGiveChange) {
    //   alert("Извините, в данный момент мы не можем продать вам товар по причине того, что автомат не может выдать вам нужную сдачу");
    //   return; // Остаемся на странице оплаты
    // }
    // ----------------------------------
  };

  // Примерная функция расчета сдачи (упрощенная, без учета наличия монет в автомате!)
  // Настоящая логика должна быть на бэкенде
  const calculateChangeBreakdown = (amount) => {
      let remaining = amount;
      const breakdown = {};
      const sortedCoins = [...COIN_DENOMINATIONS].sort((a, b) => b - a); // [10, 5, 2, 1]

      for (const coin of sortedCoins) {
          if (remaining >= coin) {
              const count = Math.floor(remaining / coin);
              breakdown[coin] = count;
              remaining -= count * coin;
          } else {
              breakdown[coin] = 0;
          }
      }
       // Добавляем 0 для монет, которые не использовались
       COIN_DENOMINATIONS.forEach(coin => {
           if (!(coin in breakdown)) {
               breakdown[coin] = 0;
           }
       });
      return breakdown; // { 10: X, 5: Y, 2: Z, 1: W }
  }


  return (
    <Container className="mt-4 payment-page">
      <h1 className="mb-4">Оплата</h1>

      {/* Заголовки */}
       <Row className="d-none d-md-flex mb-3 payment-header">
         <Col md={3}><strong>Номинал</strong></Col>
         <Col md={5} className="text-center"><strong>Количество</strong></Col>
         <Col md={4} className="text-end"><strong>Сумма</strong></Col>
      </Row>

      {/* Ввод монет */}
      {COIN_DENOMINATIONS.map(coin => (
        <Row key={coin} className="align-items-center mb-3 coin-row">
          <Col xs={4} md={3}>
            <div className="coin-denomination">
              <span className="coin-circle">{coin}</span> {coin} рубль{coin === 1 ? '' : (coin < 5 ? 'я' : 'ей')}
            </div>
          </Col>
          <Col xs={8} md={5} className="mt-2 mt-md-0">
             <InputGroup className="quantity-control mx-auto">
               <Button variant="outline-secondary" onClick={() => decrementCoin(coin)}><FaMinus /></Button>
               <FormControl
                 type="number"
                 className="text-center quantity-input"
                 value={coinsEntered[coin]}
                 onChange={(e) => handleCoinChange(coin, e.target.value)}
                 min="0"
               />
               <Button variant="outline-secondary" onClick={() => incrementCoin(coin)}><FaPlus /></Button>
             </InputGroup>
          </Col>
          <Col xs={12} md={4} className="text-end mt-2 mt-md-0 coin-subtotal">
             <strong>{coinsEntered[coin] * coin} руб.</strong>
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
           <Button variant="warning" onClick={() => history.push('/cart')} className="return-button me-3">
             Вернуться
           </Button>
           <Button
             variant="success"
             size="lg"
             onClick={handlePayment}
             disabled={!canPay}
             className="payment-button"
            >
             Оплатить
           </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default PaymentPage;