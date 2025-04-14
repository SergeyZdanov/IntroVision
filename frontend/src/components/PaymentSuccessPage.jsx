import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Container, Row, Col, Button } from 'react-bootstrap';

// Сортируем номиналы для отображения как в макете
const DISPLAY_COIN_ORDER = [1, 2, 5, 10];

const PaymentSuccessPage = () => {
  const location = useLocation();
  // Получаем данные о сдаче из состояния маршрута
  const { changeAmount = 0, changeBreakdown = {} } = location.state || {};

  // Убедимся, что все номиналы присутствуют в changeBreakdown
  DISPLAY_COIN_ORDER.forEach(coin => {
      if (!(coin in changeBreakdown)) {
          changeBreakdown[coin] = 0;
      }
  });

  return (
    <Container className="text-center mt-5 payment-success-page">
      <h1 className="mb-3">Спасибо за покупку!</h1>
      {changeAmount > 0 && (
        <h2 className="mb-4">Пожалуйста, возьмите вашу сдачу: <span className="text-success">{changeAmount} руб.</span></h2>
      )}
      {changeAmount <= 0 && (
          <h2 className="mb-4">Оплата прошла успешно.</h2> // Если сдачи нет
      )}

      {changeAmount > 0 && (
        <>
            <h3 className="mb-3">Ваши монеты:</h3>
            <Row className="justify-content-center mb-4">
              <Col md={6} lg={4}>
                {DISPLAY_COIN_ORDER.map(coin => (
                   <div key={coin} className="d-flex justify-content-center align-items-center mb-2 change-coin-row">
                      <span className="coin-circle me-3">{coin}</span>
                      <span>{changeBreakdown[coin] || 0} шт.</span>
                   </div>
                ))}
              </Col>
            </Row>
        </>
      )}


      <Link to="/">
        <Button variant="warning" size="lg" className="catalog-button">
          Каталог напитков
        </Button>
      </Link>
    </Container>
  );
};

export default PaymentSuccessPage;