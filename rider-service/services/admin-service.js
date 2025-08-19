const { Rider } = require('../models/association');
const { DeliveryAssignment } = require('../models/association');
const { DELIVERY_STATUS } = require('../utils/Enums/delivery-status');

class AdminService {
    // Get all available riders
    async getAvailableRiders() {
        try {
            const riders = await Rider.findAll({
                where: { is_available: true },
                attributes: ['id', 'user_id', 'vehicle_type', 'is_available'],
                order: [['created_at', 'DESC']]
            });
            
            if (riders.length === 0) {
                return { 
                    statusCode: 404, 
                    body: { 
                        success: false, 
                        message: "No available riders found" 
                    } 
                };
            }
            
            return { 
                statusCode: 200, 
                body: {
                    success: true, 
                    message: "Available riders retrieved successfully",
                    data: riders,
                    count: riders.length 
                }
            };
        } catch (error) {
            console.error('Error getting available riders:', error);
            return { 
                statusCode: 500, 
                body: { 
                    success: false, 
                    message: "Internal server error" 
                } 
            };
        }   
    }

    // Assign delivery to a rider
    async assignDelivery(assignmentData) {
        try {
            const { order_id, rider_id, assigned_by } = assignmentData;

            // Validate required fields
            if (!order_id || !rider_id || !assigned_by) {
                return { 
                    statusCode: 400, 
                    body: { 
                        success: false, 
                        message: "Order ID, Rider ID, and Assigned By are required" 
                    } 
                };
            }

            // Check if the rider exists and is available
            const rider = await Rider.findOne({ 
                where: { 
                    id: rider_id, 
                    is_available: true 
                } 
            });
            
            if (!rider) {
                return { 
                    statusCode: 404, 
                    body: { 
                        success: false, 
                        message: "Rider not found or not available" 
                    } 
                };
            }

            // Check if order is already assigned
            const existingAssignment = await DeliveryAssignment.findOne({
                where: { order_id }
            });

            if (existingAssignment) {
                return { 
                    statusCode: 400, 
                    body: { 
                        success: false, 
                        message: "Order is already assigned to a rider" 
                    } 
                };
            }

            // Create the delivery assignment
            const deliveryAssignment = await DeliveryAssignment.create({
                order_id,
                rider_id,
                delivery_status: DELIVERY_STATUS.ASSIGNED,
                assigned_by,
                assigned_at: new Date()
            });

            // Update rider availability
            await rider.update({ is_available: false });

            return { 
                statusCode: 201, 
                body: {
                    success: true, 
                    message: "Delivery assigned successfully",
                    data: deliveryAssignment 
                }
            };
        } catch (error) {
            console.error('Error assigning delivery:', error);
            return { 
                statusCode: 500, 
                body: { 
                    success: false, 
                    message: "Internal server error" 
                } 
            };
        }
    }

    // Get all delivery assignments
    async getAllDeliveryAssignments() {
        try {
            const assignments = await DeliveryAssignment.findAll({
                include: [{
                    model: Rider,
                    as: 'rider',
                    attributes: ['id', 'user_id', 'vehicle_type']
                }],
                order: [['created_at', 'DESC']]
            });

            return {
                statusCode: 200,
                body: {
                    success: true,
                    message: "Delivery assignments retrieved successfully",
                    data: assignments,
                    count: assignments.length
                }
            };
        } catch (error) {
            console.error('Error getting delivery assignments:', error);
            return { 
                statusCode: 500, 
                body: { 
                    success: false, 
                    message: "Internal server error" 
                } 
            };
        }
    }

    // Get delivery assignment by order ID
    async getDeliveryByOrderId(orderId) {
        try {
            const assignment = await DeliveryAssignment.findOne({
                where: { order_id: orderId },
                include: [{
                    model: Rider,
                    as: 'rider',
                    attributes: ['id', 'user_id', 'vehicle_type']
                }]
            });

            if (!assignment) {
                return { 
                    statusCode: 404, 
                    body: { 
                        success: false, 
                        message: "Delivery assignment not found" 
                    } 
                };
            }

            return {
                statusCode: 200,
                body: {
                    success: true,
                    message: "Delivery assignment retrieved successfully",
                    data: assignment
                }
            };
        } catch (error) {
            console.error('Error getting delivery assignment:', error);
            return { 
                statusCode: 500, 
                body: { 
                    success: false, 
                    message: "Internal server error" 
                } 
            };
        }
    }

    // Update delivery status
    async updateDeliveryStatus(assignmentId, statusData) {
        try {
            const { delivery_status } = statusData;

            const assignment = await DeliveryAssignment.findByPk(assignmentId);
            if (!assignment) {
                return { 
                    statusCode: 404, 
                    body: { 
                        success: false, 
                        message: "Delivery assignment not found" 
                    } 
                };
            }

            const updateData = { delivery_status };
            
            // Set timestamps based on status
            switch (delivery_status) {
                case DELIVERY_STATUS.ACCEPTED:
                    updateData.accepted_at = new Date();
                    break;
                case DELIVERY_STATUS.DELIVERED:
                    updateData.delivered_at = new Date();
                    // Make rider available again
                    await Rider.update({ is_available: true }, { where: { id: assignment.rider_id } });
                    break;
                case DELIVERY_STATUS.CANCELLED:
                    // Make rider available again
                    await Rider.update({ is_available: true }, { where: { id: assignment.rider_id } });
                    break;
            }

            await assignment.update(updateData);

            return {
                statusCode: 200,
                body: {
                    success: true,
                    message: "Delivery status updated successfully",
                    data: assignment
                }
            };
        } catch (error) {
            console.error('Error updating delivery status:', error);
            return { 
                statusCode: 500, 
                body: { 
                    success: false, 
                    message: "Internal server error" 
                } 
            };
        }
    }
}

module.exports = new AdminService();