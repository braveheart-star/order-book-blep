import React, { useState, useEffect, useRef } from "react";
import OrderBook from "./Components/OrderBook";
import "./App.css";

export default function App() {
  const [currencies, setCurrencies] = useState([]);
  const [pair, setPair] = useState("");
  const ws = useRef(null);
  const [askOrders, setAskOrders] = useState([]);
  console.log("askOrders: ", askOrders);
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

    ws.current.onmessage = (e) => {
      let data = JSON.parse(e.data);
      if (data.type === "snapshot") {
        let askOrders = data.asks.slice(0, 20).map((ask) => ({
          price: parseFloat(ask[0]),
          quantity: parseFloat(ask[1]),
        }));
        setAskOrders(askOrders);

        let bidOrders = data.bids.slice(0, 20).map((bid) => ({
          price: parseFloat(bid[0]),
          quantity: parseFloat(bid[1]),
        }));
        setBidOrders(bidOrders);
      } else if (data.type === "l2update") {
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
      <OrderBook askOrders={askOrders} bidOrders={bidOrders} />
    </div>
  );
}
