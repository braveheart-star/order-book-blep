import React, { useState, useEffect, useRef } from "react";
import OrderBook from "./Components/OrderBook";
import "./App.css";

export default function App() {
  const [currencies, setCurrencies] = useState([]);
  const [pair, setPair] = useState("");
  const ws = useRef(null);
  const [askOrders, setAskOrders] = useState([]);
  const [bidOrders, setBidOrders] = useState([]);
  let first = useRef(false);
  const url = "https://api.pro.coinbase.com";

  useEffect(() => {
    ws.current = new WebSocket("wss://ws-feed.exchange.coinbase.com");

    let pairs = [];

    const apiCall = async () => {
      await fetch(url + "/products")
        .then((res) => res.json())
        .then((data) => (pairs = data));

      let filtered = pairs.filter((pair) => {
        if (pair.quote_currency === "USD") {
          return pair;
        }
      });

      filtered = filtered.sort((a, b) => {
        if (a.base_currency < b.base_currency) {
          return -1;
        }
        if (a.base_currency > b.base_currency) {
          return 1;
        }
        return 0;
      });

      setCurrencies(filtered);

      first.current = true;
    };

    apiCall();
  }, []);

  useEffect(() => {
    if (!first.current) {
      return;
    }

    let msg = {
      type: "subscribe",
      product_ids: [pair],
      channels: ["level2"],
    };

    let jsonMsg = JSON.stringify(msg);
    ws.current.send(jsonMsg);
    let resAskOrders = [];
    let resBidOrders = [];
    ws.current.onmessage = (e) => {
      let data = JSON.parse(e.data);
      if (data.type === "snapshot") {
        resAskOrders = data.asks.slice(0, 20).map((ask) => ({
          price: parseFloat(ask[0]),
          quantity: parseFloat(ask[1]),
        }));
        resBidOrders = data.bids.slice(0, 20).map((bid) => ({
          price: parseFloat(bid[0]),
          quantity: parseFloat(bid[1]),
        }));
        setAskOrders([...resAskOrders]);

        setBidOrders([...resBidOrders]);
      } else if (data.type === "l2update") {
        if (data.changes[0][0] === "sell") {
          resAskOrders.pop();
          resAskOrders.push({
            price: parseFloat(data.changes[0][1]),
            quantity: parseFloat(data.changes[0][2]),
          });
          setAskOrders([...resAskOrders]);
        } else if (data.changes[0][0] === "buy") {
          resBidOrders.pop();
          resBidOrders.push({
            price: parseFloat(data.changes[0][1]),
            quantity: parseFloat(data.changes[0][2]),
          });
          setBidOrders([...resBidOrders]);
        }
      }
    };
  }, [pair]);

  const handleSelect = (e) => {
    let unsubMsg = {
      type: "unsubscribe",
      product_ids: [pair],
      channels: ["level2"],
    };
    let unsub = JSON.stringify(unsubMsg);

    ws.current.send(unsub);

    setPair(e.target.value);
  };
  return (
    <div className="App">
      <h1>Order Book</h1>
      <p>Select Currency</p>
      {
        <select name="currency" value={pair} onChange={handleSelect}>
          {currencies.map((cur, idx) => {
            return (
              <option key={idx} value={cur.id}>
                {cur.display_name}
              </option>
            );
          })}
        </select>
      }
      <div style={{ marginTop: "20px" }}>
        <h3>Chat analysis</h3>
        <OrderBook askOrders={askOrders} bidOrders={bidOrders} />
      </div>
    </div>
  );
}
