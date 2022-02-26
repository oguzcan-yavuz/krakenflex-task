import { greeter } from '../../src/main';

describe('main', () => {
  describe('greeter()', () => {
    it('greets a user with `Hello, {name}` message', () => {
      // Arrange
      const name = 'Osman';

      // Act
      const greet = greeter(name);

      // Assert
      expect(greet).toBe(`Hello, ${name}`);
    });
  });
});
