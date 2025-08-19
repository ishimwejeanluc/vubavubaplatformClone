const riderService = require('../services/rider-service');

class RiderController {
    // Create a new rider
    async createRider(req, res) {
        try {
            const riderData = req.body;
            const result = await riderService.createRider(riderData);
            res.status(result.statusCode).json(result.body);
        } catch (error) {
            console.error('Error in createRider:', error);
            res.status(500).json({ 
                success: false, 
                message: "Internal server error" 
            });
        }
    }

    // Get rider by user ID
    async getRiderByUserId(req, res) {
        try {
            const { userId } = req.params;
            const result = await riderService.getRiderByUserId(userId);
            res.status(result.statusCode).json(result.body);
        } catch (error) {
            console.error('Error in getRiderByUserId:', error);
            res.status(500).json({ 
                success: false, 
                message: "Internal server error" 
            });
        }
    }

    // Get rider by ID
    async getRiderById(req, res) {
        try {
            const { riderId } = req.params;
            const result = await riderService.getRiderById(riderId);
            res.status(result.statusCode).json(result.body);
        } catch (error) {
            console.error('Error in getRiderById:', error);
            res.status(500).json({ 
                success: false, 
                message: "Internal server error" 
            });
        }
    }

    // Update rider availability
    async updateAvailability(req, res) {
        try {
            const { userId } = req.params;
            const { is_available } = req.body;
            
            if (typeof is_available !== 'boolean') {
                return res.status(400).json({
                    success: false,
                    message: "is_available must be a boolean value"
                });
            }

            const result = await riderService.updateAvailability(userId, is_available);
            res.status(result.statusCode).json(result.body);
        } catch (error) {
            console.error('Error in updateAvailability:', error);
            res.status(500).json({ 
                success: false, 
                message: "Internal server error" 
            });
        }
    }

    // Get rider's delivery history
    async getDeliveryHistory(req, res) {
        try {
            const { userId } = req.params;
            const { limit = 20, offset = 0 } = req.query;
            
            const result = await riderService.getDeliveryHistory(
                userId, 
                parseInt(limit), 
                parseInt(offset)
            );
            
            res.status(result.statusCode).json(result.body);
        } catch (error) {
            console.error('Error in getDeliveryHistory:', error);
            res.status(500).json({ 
                success: false, 
                message: "Internal server error" 
            });
        }
    }

    // Get rider's current active delivery
    async getCurrentDelivery(req, res) {
        try {
            const { userId } = req.params;
            const result = await riderService.getCurrentDelivery(userId);
            res.status(result.statusCode).json(result.body);
        } catch (error) {
            console.error('Error in getCurrentDelivery:', error);
            res.status(500).json({ 
                success: false, 
                message: "Internal server error" 
            });
        }
    }

    // Update rider profile
    async updateRiderProfile(req, res) {
        try {
            const { userId } = req.params;
            const updateData = req.body;
            const result = await riderService.updateRiderProfile(userId, updateData);
            res.status(result.statusCode).json(result.body);
        } catch (error) {
            console.error('Error in updateRiderProfile:', error);
            res.status(500).json({ 
                success: false, 
                message: "Internal server error" 
            });
        }
    }
}

module.exports = new RiderController();