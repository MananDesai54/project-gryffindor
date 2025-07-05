import { Types } from 'mongoose';

export class SystemUserConstant {
  static readonly SYSTEM_USER_ID = new Types.ObjectId(
    '600000000000000000000000',
  );
  static readonly SYSTEM_USER_EMAIL = 'system@gryffindor.com';
}
