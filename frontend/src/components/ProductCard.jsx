import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { useCart } from '../contexts/CartContext';

const ProductCard = ({ product }) => {
  const { addToCart, cart } = useCart();
  const isInCart = cart.some(item => item.id === product.id); // Проверяем, есть ли товар уже в корзине (для возможной стилизации)

  const handleAddToCart = () => {
    if (product.stock > 0) {
      addToCart(product);
    }
  };

  return (
    <Card className="h-100 product-card">
      <Card.Img variant="top" src={product.image} alt={product.name} className="product-image" />
      <Card.Body className="d-flex flex-column">
        <Card.Title className="product-name">{product.name}</Card.Title>
        <Card.Text className="product-price mt-auto">
          {product.price} руб.
        </Card.Text>
        <Button
          variant={product.stock === 0 ? 'secondary' : 'warning'} // Используем warning (желтый) как в макете
          disabled={product.stock === 0}
          onClick={handleAddToCart}
          className="w-100 select-button"
        >
          {product.stock === 0 ? 'Закончился' : 'Выбрать'}
          {/* Можно добавить "(Выбрано)" если isInCart === true, если нужно */}
        </Button>
      </Card.Body>
    </Card>
  );
};

export default ProductCard;