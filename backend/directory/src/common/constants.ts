export enum PermissionScopeEnum {
  System = 'system',
  Tenant = 'tenant',
  ServiceProvider = 'serviceProvider',
  Client = 'client',
}
export enum StatusEnum {
  Active = 'active',
  Inactive = 'inactive',
}

export enum GenderEnum {
  Male = 'male',
  Female = 'female',
  Other = 'other',
  None = 'none',
  Unknown = 'unknown',
}

export const jwtConstants = {
  secret: 'VQKNKl2yYYJTfVsFNd^s4vmUG4%1uR^Ja5YsFME#Bn^PXu4W&p(ZQ5#gKxUUKbRz',
  expiry: '1d',
};

export const EncryptionAlgorithm = 'aes-256-cbc';
export const EncryptionKey = 'wFlLPDHrXDapBtkwZGSKLnhCyj0hxq0a';
export const EncryptionIVLength = 16;
export const HashSalt = 'SFD3YsV4GZZY5IWxPMhon8PRqIVo8gyc';
export const HashSaltRounds = 12;
