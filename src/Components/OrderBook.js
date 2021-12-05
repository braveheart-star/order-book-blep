import React, { Component } from "react";
import { AskOrder } from "./AskOrder";
import { BidOrder } from "./BidOrder";
const OrderBook = (props) => {
  const sumQuantities = (orders) => {
    return orders.reduce((total, order) => total + order.quantity, 0);
  };

  let totalAsks = sumQuantities(props.askOrders);
  let totalBids = sumQuantities(props.bidOrders);
  let maxCumulative = Math.max(totalAsks, totalBids);

  const renderOrders = (RenderComponent, orders) => {
    let cumulative = 0;
    return orders.map((order, index) => {
      order.cumulative = cumulative += order.quantity;
      order.maxCumulative = maxCumulative;
      order.percentage = getPercentage(cumulative);
      console.log("order: ", order);
      return <RenderComponent key={index} {...order} />;
    });
  };

  const getPercentage = (cumulative) => {
    let fillPercentage = (maxCumulative ? cumulative / maxCumulative : 0) * 100;
    fillPercentage = Math.min(fillPercentage, 100); // Percentage can't be greater than 100%
    fillPercentage = Math.max(fillPercentage, 0); // Percentage can't be smaller than 0%
    return fillPercentage;
  };

  return (
    <div className="OrderBook">
      <table>
        <thead>
          <tr>
            <th>Buy cumulative</th>
            <th>Buy quantity</th>
            <th></th>
            <th>Sell quantity</th>
            <th>Sell cumulative</th>
          </tr>
        </thead>
        <tbody>{renderOrders(AskOrder, props.askOrders).reverse()}</tbody>
        <tbody>{renderOrders(BidOrder, props.bidOrders)}</tbody>
      </table>
    </div>
  );
};

export default OrderBook;
