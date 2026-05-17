export enum RoleType {
  GUEST = 0,
  BASIC_VIP = 1,
  PREMIUM_VIP = 2,
  ADMIN = 9,
}

export const RoleNameMap: Record<number, string> = {
  [RoleType.GUEST]: '普通用户',
  [RoleType.BASIC_VIP]: '初级会员',
  [RoleType.PREMIUM_VIP]: '高级会员',
  [RoleType.ADMIN]: '管理员',
}

export enum Permission {
  DASHBOARD_VIEW = 'dashboard:view',
  PROXY_VIEW = 'proxy:view',
  PROXY_ADD = 'proxy:add',
  PROXY_EDIT = 'proxy:edit',
  PROXY_DELETE = 'proxy:delete',
  GROUP_VIEW = 'group:view',
  GROUP_ADD = 'group:add',
  GROUP_EDIT = 'group:edit',
  BILL_VIEW = 'bill:view',
  BILL_EXPORT = 'bill:export',
  VIP_ACTIVATE = 'vip:activate',
  VIP_RECHARGE = 'vip:recharge',
  USER_VIEW = 'user:view',
  USER_ADD = 'user:add',
  USER_EDIT = 'user:edit',
  USER_DELETE = 'user:delete',
  USER_MANAGE_ROLE = 'user:manageRole',
  VIP_CODE_VIEW = 'vipCode:view',
  VIP_CODE_ADD = 'vipCode:add',
  VIP_CODE_DELETE = 'vipCode:delete',
  DEVICE_VIEW = 'device:view',
  DEVICE_KICK = 'device:kick',
  TAOBAO_VIEW = 'taobao:view',
  TAOBAO_EDIT = 'taobao:edit',
}

export const RolePermissions: Record<number, Permission[]> = {
  [RoleType.GUEST]: [],
  [RoleType.BASIC_VIP]: [
    Permission.DASHBOARD_VIEW,
    Permission.PROXY_VIEW,
    Permission.PROXY_ADD,
    Permission.PROXY_EDIT,
    Permission.PROXY_DELETE,
    Permission.GROUP_VIEW,
    Permission.GROUP_ADD,
    Permission.GROUP_EDIT,
    Permission.BILL_VIEW,
    Permission.VIP_ACTIVATE,
    Permission.VIP_RECHARGE,
    Permission.DEVICE_VIEW,
    Permission.DEVICE_KICK,
  ],
  [RoleType.PREMIUM_VIP]: [
    Permission.DASHBOARD_VIEW,
    Permission.PROXY_VIEW,
    Permission.PROXY_ADD,
    Permission.PROXY_EDIT,
    Permission.PROXY_DELETE,
    Permission.GROUP_VIEW,
    Permission.GROUP_ADD,
    Permission.GROUP_EDIT,
    Permission.BILL_VIEW,
    Permission.BILL_EXPORT,
    Permission.VIP_ACTIVATE,
    Permission.VIP_RECHARGE,
    Permission.DEVICE_VIEW,
    Permission.DEVICE_KICK,
    Permission.TAOBAO_VIEW,
    Permission.TAOBAO_EDIT,
  ],
  [RoleType.ADMIN]: Object.values(Permission),
}

export function hasPermission(roleType: number, permission: Permission): boolean {
  const permissions = RolePermissions[roleType] || []
  return permissions.includes(permission)
}

export function hasAnyPermission(roleType: number, permissions: Permission[]): boolean {
  return permissions.some(p => hasPermission(roleType, p))
}

export function requireRole(minRole: number, userRole: number): boolean {
  return userRole >= minRole
}
