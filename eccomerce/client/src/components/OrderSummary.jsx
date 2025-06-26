import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { clearCart } from "../store/slices/cartSlice";
import axios from "axios";
import "./OrderSummary.css";

const API_BASE_URL =
  import.meta.env.REACT_APP_ORDERS_API_URL || "http://localhost:3001/api";

const OrderSummary = () => {
  const dispatch = useDispatch();
  const { items: cartItems, totalAmount } = useSelector((state) => state.cart);

  const [customerInfo, setCustomerInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const { firstName, lastName, email, address } = customerInfo;

    if (
      !firstName.trim() ||
      !lastName.trim() ||
      !email.trim() ||
      !address.trim()
    ) {
      setSubmitError("יש למלא את כל השדות החובה");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setSubmitError("כתובת אימייל לא תקינה");
      return false;
    }

    if (cartItems.length === 0) {
      setSubmitError("העגלה ריקה");
      return false;
    }

    return true;
  };

  const handleSubmitOrder = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmitError("");

    try {
      const orderData = {
        customer: customerInfo,
        items: cartItems,
        totalAmount: totalAmount,
        orderDate: new Date().toISOString(),
      };

      const response = await axios.post(`${API_BASE_URL}/orders`, orderData);

      if (response.status === 201) {
        setSubmitSuccess(true);
        dispatch(clearCart());
        setCustomerInfo({
          firstName: "",
          lastName: "",
          email: "",
          address: "",
        });
      }
    } catch (error) {
      console.error("Error submitting order:", error);
      setSubmitError(error.response?.data?.message || "שגיאה בשליחת ההזמנה");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cartItems.length === 0 && !submitSuccess) {
    return (
      <div className="order-summary">
        <h2>סיכום הזמנה</h2>
        <p>העגלה ריקה. אנא חזור למסך הקניות להוספת מוצרים.</p>
      </div>
    );
  }

  if (submitSuccess) {
    return (
      <div className="order-summary">
        <div className="success-message">
          <h2>ההזמנה נשלחה בהצלחה!</h2>
          <p>תקבל אישור במייל בקרוב.</p>
          <button
            onClick={() => setSubmitSuccess(false)}
            className="continue-shopping-btn"
          >
            המשך קניות
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="order-summary">
      <h2>סיכום הזמנה</h2>

      <div className="order-items">
        <h3>פריטים בהזמנה:</h3>
        {cartItems.map((item) => (
          <div key={item.id} className="order-item">
            <div className="item-info">
              <span className="item-name">{item.name}</span>
              <span className="item-category">({item.categoryName})</span>
            </div>
            <div className="item-details">
              <span>כמות: {item.quantity}</span>
              <span>מחיר יחידה: ₪{item.price.toFixed(2)}</span>
              <span className="item-total">
                סה"כ: ₪{item.totalPrice.toFixed(2)}
              </span>
            </div>
          </div>
        ))}
        <div className="order-total">
          <strong>סה"כ להזמנה: ₪{totalAmount.toFixed(2)}</strong>
        </div>
      </div>

      <div className="customer-form">
        <h3>פרטי לקוח:</h3>

        <div className="form-row">
          <div className="form-group">
            <label>שם פרטי *</label>
            <input
              type="text"
              name="firstName"
              value={customerInfo.firstName}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label>שם משפחה *</label>
            <input
              type="text"
              name="lastName"
              value={customerInfo.lastName}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label>אימייל *</label>
          <input
            type="email"
            name="email"
            value={customerInfo.email}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label>כתובת מלאה *</label>
          <textarea
            name="address"
            value={customerInfo.address}
            onChange={handleInputChange}
            rows="3"
            required
          />
        </div>

        {submitError && <div className="error-message">{submitError}</div>}

        <button
          onClick={handleSubmitOrder}
          disabled={isSubmitting}
          className="submit-order-btn"
        >
          {isSubmitting ? "שולח..." : "אשר הזמנה"}
        </button>
      </div>
    </div>
  );
};

export default OrderSummary;
