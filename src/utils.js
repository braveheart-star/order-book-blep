export const getPercentage = (props) => {
  let fillPercentage =
    (props.maxCumulative ? props.cumulative / props.maxCumulative : 0) * 100;
  fillPercentage = Math.min(fillPercentage, 100); // Percentage can't be greater than 100%
  fillPercentage = Math.max(fillPercentage, 0); // Percentage can't be smaller than 0%
  return fillPercentage;
};
