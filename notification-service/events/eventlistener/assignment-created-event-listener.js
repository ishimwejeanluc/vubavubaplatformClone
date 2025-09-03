const EventListenerService = require('../../services/event-listener-service');

class AssignmentCreatedEventListener {
  static getHandler() {
    return {
      'rider.assigned': async (msg) => {
        console.log('[Notification] rider.assigned event received:', msg);
  await EventListenerService.handleAssignmentCreated(msg);
      }
    };
  }
}

module.exports = AssignmentCreatedEventListener;
