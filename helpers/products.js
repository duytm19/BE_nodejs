module.exports.priceNewProducts = (products) => {
  products.forEach((item) => {
    item.priceNew = (
      (item.price * (100 - item.discountPercentage)) /
      100
    ).toFixed(0);
  });
  return products;
};

module.exports.priceNewProduct = (product) => {
  const priceNew = (
    (product.price * (100 - product.discountPercentage)) /
    100
  ).toFixed(0);
  return parseInt(priceNew);
};
