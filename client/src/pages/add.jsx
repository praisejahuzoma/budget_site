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

  



export default Add;
