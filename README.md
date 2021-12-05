# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## How to run project?

You have to install npm modules by run "npm install" .
after install, run "npm run start".

## Description

You can select currency from select list, and can see Order Book.

For convenient, display only 20 data from api data

## Thought processes

- first, using coinbase api, get all available currencies to make currency list.
  The list is sorted alphabetically.
  and set up websocket connection.

- when user select currency, message data is made to send websocket server, and make askOrders and bidOrders data.

- Displays price, cumulative, quantity.
  using maxCumulative value, set Background color.
