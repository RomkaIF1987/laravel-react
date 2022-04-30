/**
 * Authorization Roles
 */

/**
 * Admin Roles
 */
const superAdmin = 1;
const proAdmin = 2;

const authRoles = {
  superadmin: [superAdmin],
  admin: [superAdmin, proAdmin],
  proAdmin: [proAdmin],
  onlyGuest: [],
};

/**
 * Admin Permissions
 */

const users = 1;
const locations = 2;
const branding = 3;
const logs = 4;

const authPermissions = {
  users: [users],
  locations: [locations],
  branding: [branding],
  logs: [logs],
};

export default { roles: authRoles, permissions: authPermissions, superAdmin, proAdmin };
