class CustomError extends Error {
  constructor(
    public code: number,
    message: string,
    public data?: any,
  ) {
    super(message);
    this.data = data;
  }
}

export default CustomError;
