import * as coffee from 'coffee';

describe('create-outages CLI tool', () => {
  const path = 'dist/bin/index.js';

  it('should throw an error if the given date is not in ISO-8601 format', async () => {
    // Arrange
    const date = 'invalid-date';
    // stderr: "error: option '-d, --date-after <date>' argument 'invalid-date' is invalid. Date must be provided in ISO-8601 format.\n",
    const errorMessage = /error.*invalid.*iso-8601/i;

    // Act
    const { stdout, stderr, code } = await coffee
      .fork(path, ['-d', date])
      .end();

    // Assert
    expect(stdout).toBe('');
    expect(stderr).toMatch(errorMessage);
    expect(code).toBe(1);
  });

  it('should throw an error if the given site id does not exists', async () => {
    // Arrange
    const siteId = 'invalid-site-id';
    // stderr: 'Error: Request failed with status code 404\n'
    const errorMessage = /fail.*404/i;

    // Act
    const { stdout, stderr, code } = await coffee
      .fork(path, ['-s', siteId])
      .end();

    // Assert
    expect(stdout).toBe('');
    expect(stderr).toMatch(errorMessage);
    expect(code).toBe(1);
  });

  it('should throw an error if the given api key is invalid', async () => {
    // Arrange
    const apiKey = 'invalid-api-key';
    // stderr: 'Error: Request failed with status code 403\n'
    const errorMessage = /fail.*403/i;

    // Act
    const { stdout, stderr, code } = await coffee
      .fork(path, ['-a', apiKey])
      .end();

    // Assert
    expect(stdout).toBe('');
    expect(stderr).toMatch(errorMessage);
    expect(code).toBe(1);
  });

  it('should return success message with default parameters', async () => {
    // Arrange
    // 'Outages created successfully!'
    const successMessage = /success/i;

    // Act
    const { stdout, stderr, code } = await coffee.fork(path).end();

    // Assert
    expect(stdout).toMatch(successMessage);
    expect(stderr).toBe('');
    expect(code).toBe(0);
  });
});
