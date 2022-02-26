export class NotFoundError extends Error {
  constructor() {
    super('The resource is not found.');
  }
}
