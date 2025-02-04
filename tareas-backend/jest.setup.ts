// jest.setup.ts
jest.spyOn(console, 'error').mockImplementation(() => {});
