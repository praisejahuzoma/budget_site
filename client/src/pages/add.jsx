import React, { useState, useEffect } from "react";
import "./style.css";
import "boxicons/css/boxicons.min.css";

const API_URL = "http://localhost:3000/items";

const Add = () => {
  const [marketList, setMarketList] = useState([]);
  const [item, setItem] = useState("");
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [productTotal, setProductTotal] = useState(0);
  const [currency, setCurrency] = useState("NGN");
  const [currencySymbol, setCurrencySymbol] = useState("₦");
  const [totalBudget, setTotalBudget] = useState(8000); // Initial total budget state

  useEffect(() => {
    fetchItems();
  }, []);

  useEffect(() => {
    const savedCurrency = localStorage.getItem("selectedCurrency");
    if (savedCurrency) {
      setCurrency(savedCurrency);
      setCurrencySymbol(getCurrencySymbol(savedCurrency));
    }
  }, []);

  useEffect(() => {
    if (quantity && price) {
      setProductTotal(quantity * price);
    } else {
      setProductTotal(0);
    }
  }, [quantity, price]);

  const fetchItems = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setMarketList(
        data.map((item) => ({
          ...item,
          amount: item.quantity * item.price,
        }))
      );
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

  const handleAddItem = async () => {
    if (!item || !quantity || !price) return;

    const newItem = {
      name: item,
      description,
      quantity: parseInt(quantity),
      price: parseFloat(price),
      amount: parseInt(quantity) * parseFloat(price),
    };

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newItem),
      });
      const data = await response.json();
      setMarketList([...marketList, { ...newItem, id: data.id }]);
      resetInputFields();
    } catch (error) {
      console.error("Error adding item:", error);
    }
  };

  const handleDeleteItem = async (id) => {
    try {
      await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });
      setMarketList(marketList.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  const resetInputFields = () => {
    setItem("");
    setDescription("");
    setQuantity("");
    setPrice("");
  };

  const calculateTotal = () => {
    return marketList.reduce((total, item) => total + item.amount, 0);
  };

  const getCurrencySymbol = (currencyCode) => {
    switch (currencyCode) {
      case "NGN":
        return "₦";
      case "USD":
        return "$";
      case "EUR":
        return "€";
      default:
        return "₦";
    }
  };

  const handleCurrencyChange = (e) => {
    const selectedCurrency = e.target.value;
    setCurrency(selectedCurrency);
    setCurrencySymbol(getCurrencySymbol(selectedCurrency));
    localStorage.setItem("selectedCurrency", selectedCurrency);
  };

  const handleBudgetChange = (e) => {
    setTotalBudget(e.target.value);
  };

  

  return (
    <div className="container">
      <h1>BudgetBuddy</h1>
      <h3>YOUR DIGITAL MARKET LIST</h3>

      <div className="details-container">
        <div className="headings">
          <h4>TotalBudget</h4>
          <h4>Expenses</h4>
          <h4>Balance</h4>
        </div>
        <div className="details">
          <input
            className="input"
            type="number"
            value={totalBudget}
            onChange={handleBudgetChange}
            style={{ marginRight: "10px" }}
          />
          <p id="expenses">{currencySymbol + calculateTotal().toFixed(2)}</p>
          <p>
            {" "}
            {currencySymbol}
            {totalBudget - calculateTotal()}
          </p>
        </div>
      </div>

      <div className="list-container">
        <div className="list-heading">
          <i
            className="bx bxs-cart bx-tada"
            id="cart_icon"
            style={{ color: "#512D38" }}
          ></i>
          <h4>Item</h4>
          <h4>Description</h4>
          <h4>Quantity</h4>
          <h4>Unit Price</h4>
          <h4>Amount</h4>
        </div>

        <ul className="list-items">
          {marketList.map((item) => (
            <li key={item.id} className="list-item">
              <i
                onClick={() => handleDeleteItem(item.id)}
                className="bx bx-message-square-x checkbox"
                style={{ color: "#B27092" }}
              ></i>
              <p>{item.name}</p>
              <p>{item.description}</p>
              <p>{item.quantity}</p>
              <p>
                {currencySymbol}
                {Number(item.price).toFixed(2)}
              </p>
              <p>
                {currencySymbol}
                {Number(item.amount).toFixed(2)}
              </p>
            </li>
          ))}
        </ul>

        <div className="currency-section">
          <h2 className="total">
            Total:{" "}
            <span>
              {currencySymbol}
              {calculateTotal().toFixed(2)}
            </span>
          </h2>
          <div className="currency-selector">
            <label htmlFor="currency-selector" className="currency_style">
              Select Currency:
            </label>
            <select
              id="currency-selector"
              className="currency"
              value={currency}
              onChange={handleCurrencyChange}
            >
              <option value="NGN">₦ Naira</option>
              <option value="USD">$ Dollar</option>
              <option value="EUR">€ Euro</option>
            </select>
          </div>
        </div>
      </div>

      <div className="list-input">
        <input
          className="item-input"
          type="text"
          placeholder="Enter Item"
          value={item}
          onChange={(e) => setItem(e.target.value)}
        />
        <input
          className="description-input"
          type="text"
          placeholder="Enter Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          className="qty-input"
          type="number"
          placeholder="Quantity"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
        />
        <input
          className="price-input"
          type="number"
          placeholder="Unit Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        <input
          className="amount-input"
          type="text"
          placeholder="Amount"
          value={productTotal > 0 ? productTotal.toFixed(2) : ""}
          readOnly
        />

        <button className="button" onClick={handleAddItem}>
          Add Item
        </button>
      </div>
    </div>
  );
};

export default Add;
