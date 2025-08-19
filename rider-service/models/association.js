const Rider = require('./rider');
const DeliveryAssignment = require('./delivery-assignment');

// Define associations
Rider.hasMany(DeliveryAssignment, {
  foreignKey: 'rider_id',
  as: 'deliveryAssignments'
});

DeliveryAssignment.belongsTo(Rider, {
  foreignKey: 'rider_id',
  as: 'rider'
});

module.exports = {
  Rider,
  DeliveryAssignment
};
