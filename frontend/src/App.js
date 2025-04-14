import React from 'react';
// Убедись, что импортируешь Switch, а НЕ Routes
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { CartProvider } from './contexts/CartContext';
import CatalogPage from './components/CatalogPage';
import CartPage from './components/CartPage';
import PaymentPage from './components/PaymentPage';
import PaymentSuccessPage from './components/PaymentSuccessPage';
import './App.css'; // Подключаем стили

function App() {
  return (
    <CartProvider>
      <Router>
        {/* Используем Switch для react-router-dom v5 */}
        <Switch>
          <Route path="/" exact component={CatalogPage} />
          <Route path="/cart" component={CartPage} />
          <Route path="/payment" component={PaymentPage} />
          <Route path="/payment-success" component={PaymentSuccessPage} />
          {/* Можно добавить маршрут для 404 */}
          {/* <Route path="*"> <div>404 - Страница не найдена</div> </Route> */}
        </Switch>
      </Router>
    </CartProvider>
  );
}

export default App;