import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCategories,
  setSelectedCategory,
} from "../store/slices/categoriesSlice";
import { addItem } from "../store/slices/cartSlice";
import "./ProductList.css";

const ProductList = () => {
  const dispatch = useDispatch();
  const {
    list: categories,
    loading,
    error,
    selectedCategory,
  } = useSelector((state) => state.categories);
  const { items: cartItems } = useSelector((state) => state.cart);

  const [productName, setProductName] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState(0);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleAddToCart = () => {
    if (!selectedCategory || !productName.trim()) {
      alert("אנא בחר קטגוריה והכנס שם מוצר");
      return;
    }

    if (quantity <= 0 || price <= 0) {
      alert("כמות ומחיר חייבים להיות גדולים מ-0");
      return;
    }

    console.log("selectedCategory", selectedCategory);

    const newItem = {
      id: (Date.now() + Math.random()).toString(),
      name: productName.trim(),
      price: parseFloat(price),
      quantity: parseInt(quantity),
      categoryId: selectedCategory.id,
      categoryName: selectedCategory.name,
    };
    console.log(newItem);

    dispatch(addItem(newItem));

    // Reset form
    setProductName("");
    setQuantity(1);
    setPrice(0);
  };

  if (loading) return <div className="loading">טוען קטגוריות...</div>;
  if (error) return <div className="error">שגיאה: {error}</div>;

  return (
    <div className="product-list">
      <h2>רשימת קניות</h2>

      <div className="categories-section">
        <h3>בחר קטגוריה:</h3>
        <div className="categories-grid">
          {categories.map((category) => (
            <button
              key={category.id}
              className={`category-btn ${
                selectedCategory?.id === category.id ? "selected" : ""
              }`}
              onClick={() => dispatch(setSelectedCategory(category))}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {selectedCategory && (
        <div className="product-form">
          <h3>הוסף מוצר מקטגוריה: {selectedCategory.name}</h3>

          <div className="form-group">
            <label>שם המוצר:</label>
            <input
              type="text"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder="הכנס שם מוצר"
            />
          </div>

          <div className="form-group">
            <label>מחיר:</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              min="0"
              step="0.01"
              placeholder="0.00"
            />
          </div>

          <div className="form-group">
            <label>כמות:</label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              min="1"
            />
          </div>

          <button onClick={handleAddToCart} className="add-to-cart-btn">
            הוסף מוצר לסל
          </button>
        </div>
      )}

      {cartItems.length > 0 && (
        <div className="cart-preview">
          <h3>עגלת קניות ({cartItems.length} פריטים)</h3>
          <div className="cart-items">
            {cartItems.map((item) => (
              <div key={item.id} className="cart-item">
                <span>{item.name}</span>
                <span>כמות: {item.quantity}</span>
                <span>₪{item.totalPrice.toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="cart-total">
            <strong>
              סה"כ: ₪
              {cartItems
                .reduce((sum, item) => sum + item.totalPrice, 0)
                .toFixed(2)}
            </strong>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductList;
