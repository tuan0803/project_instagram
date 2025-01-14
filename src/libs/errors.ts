import { Error, ValidationErrorItem } from 'sequelize';

class CustomError extends Error {
  public path: string
  constructor (message: string, path?: string) {
    super(message);
    this.path = path;
  }
}

export const FailValidation = (errors: ValidationErrorItem[]) => {
  const messages: any = {};
  errors.forEach((error) => {
    const path = (error.original as CustomError)?.path || error.path;
    const message = (error.original as CustomError)?.message || error.message;
    messages[path] ||= [];
    messages[path].push(message);
  });
  return {
    errorCode: 120,
    messages,
  };
};

export const NoData = {
  errorCode: 8,
  message: 'No data available',
};

export const UnableToInactiveSupplier = {
  errorCode: 125,
  message: 'Supplier is currently unable to be inactive.',
};

export const InternalError = {
  errorCode: 131,
  message: 'Internal error',
};

export const BadAuthentication = {
  errorCode: 215,
  message: 'Bad authentication data',
};

export const InvalidOtp = {
  errorCode: 216,
  message: 'Invalid otp',
};

export const AccountIsNotVerified = {
  errorCode: 217,
  message: 'Your account must be verified in order to use this function.',
};

export const NotEnoughCoin = {
  errorCode: 220,
  message: 'Your accumulated coin is not enough.',

};

export const CategoryIsNotEmpty = {
  errorCode: 300,
  message: 'Can not delete Category.',
};

export const MissingImportFile = {
  errorCode: 301,
  message: 'Xlsx used for import is missing',
};

export const FileIsNotSupport = {
  errorCode: 305,
  message: 'The file is not in the required format',
};

export const InvalidVoucher = {
  errorCode: 350,
  message: 'Invalid voucher',
};

export const InvalidShippingAddress = {
  errorCode: 351,
  message: 'Invalid shipping address',
};

export const Forbidden = {
  errorCode: 418,
  message: 'Do not have permission',
};
