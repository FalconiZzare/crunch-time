class RolesManager {
  static instance;

  constructor() {
    // Return existing instance if one already exists
    if (RolesManager.instance) {
      return RolesManager.instance;
    }

    // Defining our pre-selected roles
    this._roles = {
      administrator: "admin",
      user: "customer",
      delivery: "delivery",
      kitchen: "chef"
    };

    // Freeze roles to prevent modification or accidental assignment
    Object.freeze(this._roles);

    // Set this as the singleton instance
    RolesManager.instance = this;
  }

  // Get a specific role value by key that matches with DB value
  getRole(roleKey) {
    return this._roles[roleKey];
  }

  // Check if a user has a specific role by supplying a value to check and a roleKey to compare to
  hasRole(userRole, roleKey) {
    return userRole === this._roles[roleKey];
  }
}

const rolesManagerInstance = new RolesManager();
export default rolesManagerInstance;
