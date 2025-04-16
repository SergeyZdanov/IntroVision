import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { useCart } from '../contexts/CartContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    if (product.quantity > 0) {
      addToCart(product);
    }
  };

  return (
    <Card className="h-100 product-card">
      <Card.Img variant="top" src={product.imageUrl || '/placeholder.png'} alt={product.name} className="product-image" />
      <Card.Body className="d-flex flex-column">
        <Card.Title className="product-name">{product.name}</Card.Title>
        <Card.Text className="product-price mt-auto">
          {product.price} руб.
        </Card.Text>
        <Button
          variant={product.quantity === 0 ? 'secondary' : 'warning'}
          disabled={product.quantity === 0}
          onClick={handleAddToCart}
          className="w-100 select-button"
        >
          {product.quantity === 0 ? 'Закончился' : 'Выбрать'}
        </Button>
      </Card.Body>
    </Card>
  );
};

export default ProductCard;