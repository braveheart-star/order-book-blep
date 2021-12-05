// import getPercentage from "../utils";

export const BidOrder = (props) => {
  return (
    <tr className="ask">
      <td
        className="fill-bid"
        style={{ backgroundSize: props.percentage + "% 100%" }}
      >
        {props.cumulative}
      </td>
      <td>{props.quantity}</td>
      <td>{props.price}</td>
      <td></td>
      <td></td>
    </tr>
  );
};
