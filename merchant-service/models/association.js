
const Merchant = require('./merchant');
const MenuItem = require('./menu-item');


MenuItem.belongsTo(Merchant, {
  foreignKey: 'merchant_id',
  as: 'merchant'
});

Merchant.hasMany(MenuItem, {
  foreignKey: 'merchant_id',
  as: 'menuItems',
  onDelete: 'CASCADE'
});

module.exports = { Merchant, MenuItem };
