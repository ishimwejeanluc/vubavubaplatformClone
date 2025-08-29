const { Rider, DeliveryAssignment } = require('../models/association');
const { VEHICLE_TYPE } = require('../utils/Enums/vehicle-type');
const { DELIVERY_STATUS } = require('../utils/Enums/delivery-status');
const { OrderDeliveredEventPublisher} = require('../events/eventpublisher/index');
const orderDeliveredEventPublisher = new OrderDeliveredEventPublisher();

class RiderService {
    // Create a new rider
    async createRider(riderData) {
        try {
            const { user_id, vehicle_type } = riderData;

            // Validate required fields
            if (!user_id || !vehicle_type) {
                return { 
                    statusCode: 400, 
                    body: { 
                        success: false, 
                        message: "User ID and vehicle type are required" 
                    } 
                };
            }

            // Check if rider already exists
            const existingRider = await Rider.findOne({ where: { user_id } });
            if (existingRider) {
                return { 
                    statusCode: 400, 
                    body: { 
                        success: false, 
                        message: "Rider already exists for this user" 
                    } 
                };
            }

            // Validate vehicle type
            if (!Object.values(VEHICLE_TYPE).includes(vehicle_type)) {
                return { 
                    statusCode: 400, 
                    body: { 
                        success: false, 
                        message: "Invalid vehicle type" 
                    } 
                };
            }

            const rider = await Rider.create({
                user_id,
                vehicle_type,
                is_available: true
            });

            return {
                statusCode: 201,
                body: {
                    success: true,
                    message: "Rider created successfully",
                    data: rider
                }
            };
        } catch (error) {
            console.error('Error creating rider:', error);
            return { 
                statusCode: 500, 
                body: { 
                    success: false, 
                    message: "Internal server error" 
                } 
            };
        }
    }

    // Get rider by user ID
    async getRiderByUserId(userId) {
        try {
            const rider = await Rider.findOne({
                where: { user_id: userId },
                include: [{
                    model: DeliveryAssignment,
                    as: 'deliveryAssignments',
                    order: [['created_at', 'DESC']],
                    limit: 10
                }]
            });

            if (!rider) {
                return { 
                    statusCode: 404, 
                    body: { 
                        success: false, 
                        message: "Rider not found" 
                    } 
                };
            }

            return {
                statusCode: 200,
                body: {
                    success: true,
                    message: "Rider retrieved successfully",
                    data: rider
                }
            };
        } catch (error) {
            console.error('Error getting rider:', error);
            return { 
                statusCode: 500, 
                body: { 
                    success: false, 
                    message: "Internal server error" 
                } 
            };
        }
    }

    // Get rider by ID
    async getRiderById(riderId) {
        try {
            const rider = await Rider.findByPk(riderId, {
                include: [{
                    model: DeliveryAssignment,
                    as: 'deliveryAssignments',
                    order: [['created_at', 'DESC']],
                    limit: 10
                }]
            });

            if (!rider) {
                return { 
                    statusCode: 404, 
                    body: { 
                        success: false, 
                        message: "Rider not found" 
                    } 
                };
            }

            return {
                statusCode: 200,
                body: {
                    success: true,
                    message: "Rider retrieved successfully",
                    data: rider
                }
            };
        } catch (error) {
            console.error('Error getting rider:', error);
            return { 
                statusCode: 500, 
                body: { 
                    success: false, 
                    message: "Internal server error" 
                } 
            };
        }
    }

    // Update rider availability
    async updateAvailability(userId, isAvailable) {
        try {
            const rider = await Rider.findOne({ where: { user_id: userId } });
            if (!rider) {
                return { 
                    statusCode: 404, 
                    body: { 
                        success: false, 
                        message: "Rider not found" 
                    } 
                };
            }

            await rider.update({ is_available: isAvailable });

            return {
                statusCode: 200,
                body: {
                    success: true,
                    message: `Rider availability updated to ${isAvailable ? 'available' : 'unavailable'}`,
                    data: rider
                }
            };
        } catch (error) {
            console.error('Error updating rider availability:', error);
            return { 
                statusCode: 500, 
                body: { 
                    success: false, 
                    message: "Internal server error" 
                } 
            };
        }
    }

    // Get rider's delivery history
    async getDeliveryHistory(userId, limit = 20, offset = 0) {
        try {
            const rider = await Rider.findOne({ where: { user_id: userId } });
            if (!rider) {
                return { 
                    statusCode: 404, 
                    body: { 
                        success: false, 
                        message: "Rider not found" 
                    } 
                };
            }

            const deliveries = await DeliveryAssignment.findAndCountAll({
                where: { rider_id: rider.id },
                order: [['created_at', 'DESC']],
                limit,
                offset
            });

            return {
                statusCode: 200,
                body: {
                    success: true,
                    message: "Delivery history retrieved successfully",
                    data: deliveries.rows,
                    pagination: {
                        totalCount: deliveries.count,
                        currentPage: Math.floor(offset / limit) + 1,
                        totalPages: Math.ceil(deliveries.count / limit),
                        limit: limit,
                        offset: offset
                    }
                }
            };
        } catch (error) {
            console.error('Error getting delivery history:', error);
            return { 
                statusCode: 500, 
                body: { 
                    success: false, 
                    message: "Internal server error" 
                } 
            };
        }
    }

    // Get rider's current active delivery
    async getCurrentDelivery(userId) {
        try {
            const rider = await Rider.findOne({ where: { user_id: userId } });
            if (!rider) {
                return { 
                    statusCode: 404, 
                    body: { 
                        success: false, 
                        message: "Rider not found" 
                    } 
                };
            }

            const activeDelivery = await DeliveryAssignment.findOne({
                where: { 
                    rider_id: rider.id,
                    delivery_status: [
                        DELIVERY_STATUS.ASSIGNED,
                        DELIVERY_STATUS.ACCEPTED
                    ]
                },
                order: [['created_at', 'DESC']]
            });

            if (!activeDelivery) {
                return { 
                    statusCode: 404, 
                    body: { 
                        success: false, 
                        message: "No active delivery found" 
                    } 
                };
            }

            return {
                statusCode: 200,
                body: {
                    success: true,
                    message: "Active delivery retrieved successfully",
                    data: activeDelivery
                }
            };
        } catch (error) {
            console.error('Error getting current delivery:', error);
            return { 
                statusCode: 500, 
                body: { 
                    success: false, 
                    message: "Internal server error" 
                } 
            };
        }
    }

    // Update rider profile
    async updateRiderProfile(userId, updateData) {
        try {
            const { vehicle_type } = updateData;
            
            const rider = await Rider.findOne({ where: { user_id: userId } });
            if (!rider) {
                return { 
                    statusCode: 404, 
                    body: { 
                        success: false, 
                        message: "Rider not found" 
                    } 
                };
            }

            const updates = {};
            if (vehicle_type && Object.values(VEHICLE_TYPE).includes(vehicle_type)) {
                updates.vehicle_type = vehicle_type;
            }
            updates.updated_at = new Date();

            await rider.update(updates);

            return {
                statusCode: 200,
                body: {
                    success: true,
                    message: "Rider profile updated successfully",
                    data: rider
                }
            };
        } catch (error) {
            console.error('Error updating rider profile:', error);
            return { 
                statusCode: 500, 
                body: { 
                    success: false, 
                    message: "Internal server error" 
                } 
            };
        }
    }

    async orderDelivered(orderId, assignmentId) {
        try {
            const assignment = await DeliveryAssignment.findOne({ where: { id: assignmentId } });
            if (!assignment) {
                return {
                    statusCode: 404,
                    body: {
                        success: false,
                        message: "Delivery assignment not found"
                    }
                };
            }

            await assignment.update({ delivery_status: DELIVERY_STATUS.DELIVERED });

            // Set rider availability to true
            const rider = await Rider.findByPk(assignment.rider_id);
            if (rider) {
                await rider.update({ is_available: true });
            }
            // Publish order.delivered event
            orderDeliveredEventPublisher.publish({
                assignmentId: assignment.id,
                riderId: rider.id,
                orderId: assignment.order_id
            });

            return {
                statusCode: 200,
                body: {
                    success: true,
                    message: "Delivery marked as delivered successfully and rider set to available",
                    data: assignment
                }
            };
        } catch (error) {
            console.error('Error marking delivery as delivered:', error);
            return {
                statusCode: 500,
                body: {
                    success: false,
                    message: "Internal server error"
                }
            };
        }
    }
    async processOrderReady(orderId) {
        try {
            // Logic to process the order when it's ready
            console.log(`Processing order ready event for orderId: ${orderId}`);
            // You can add your business logic here
        } catch (error) {
            console.error('Error processing order ready event:', error);
        }
    }
}

module.exports = new RiderService();