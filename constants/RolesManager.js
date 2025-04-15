class RolesManager {
  static instance;

  constructor() {
    // Return existing instance if one exists
    if (RolesManager.instance) {
      return RolesManager.instance;
    }

    // Define roles
    this._roles = {
      administrator: "admin",
      user: "customer",
      delivery: "delivery",
      kitchen: "chef"
    };

    // Freeze roles to prevent modification
    Object.freeze(this._roles);

    // Set this as the singleton instance
    RolesManager.instance = this;
  }

  // Get a specific role by key
  getRole(roleKey) {
    return this._roles[roleKey];
  }

  // Check if a user has a specific role
  hasRole(userRole, roleKey) {
    return userRole === this._roles[roleKey];
  }
}

const rolesManagerInstance = new RolesManager();
export default rolesManagerInstance;
