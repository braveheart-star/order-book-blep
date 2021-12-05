export const AskOrder = (props) => {
  return (
    <tr className="ask">
      <td></td>
      <td></td>
      <td>{props.price}</td>
      <td style={{ marginLeft: "10px" }}>
        {Number(props.quantity).toFixed(2)}
      </td>
      <td
        className="fill-ask"
        style={{ backgroundSize: props.percentage + "% 100%" }}
      >
        {props.cumulative}
      </td>
    </tr>
  );
};
