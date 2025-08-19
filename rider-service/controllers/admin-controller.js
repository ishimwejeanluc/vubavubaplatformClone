const adminService = require('../services/admin-service');

class AdminController {
    // Assign delivery to a rider
    async assignDeliveryToRider(req, res) {
        try {
            const assignmentData = req.body;
            const result = await adminService.assignDelivery(assignmentData);
            res.status(result.statusCode).json(result.body);
        } catch (error) {
            console.error('Error in assignDeliveryToRider:', error);
            res.status(500).json({ 
                success: false, 
                message: "Internal server error" 
            });
        }
    }

    // Get all available riders
    async getAvailableRiders(req, res) {
        try {
            const result = await adminService.getAvailableRiders();
            res.status(result.statusCode).json(result.body);
        } catch (error) {
            console.error('Error in getAvailableRiders:', error);
            res.status(500).json({ 
                success: false, 
                message: "Internal server error" 
            });
        }
    }

    // Get all delivery assignments
    async getAllDeliveryAssignments(req, res) {
        try {
            const result = await adminService.getAllDeliveryAssignments();
            res.status(result.statusCode).json(result.body);
        } catch (error) {
            console.error('Error in getAllDeliveryAssignments:', error);
            res.status(500).json({ 
                success: false, 
                message: "Internal server error" 
            });
        }
    }

    // Get delivery assignment by order ID
    async getDeliveryByOrderId(req, res) {
        try {
            const { orderId } = req.params;
            const result = await adminService.getDeliveryByOrderId(orderId);
            res.status(result.statusCode).json(result.body);
        } catch (error) {
            console.error('Error in getDeliveryByOrderId:', error);
            res.status(500).json({ 
                success: false, 
                message: "Internal server error" 
            });
        }
    }

    // Update delivery status
    async updateDeliveryStatus(req, res) {
        try {
            const { assignmentId } = req.params;
            const statusData = req.body;
            const result = await adminService.updateDeliveryStatus(assignmentId, statusData);
            res.status(result.statusCode).json(result.body);
        } catch (error) {
            console.error('Error in updateDeliveryStatus:', error);
            res.status(500).json({ 
                success: false, 
                message: "Internal server error" 
            });
        }
    }
}

module.exports = new AdminController();