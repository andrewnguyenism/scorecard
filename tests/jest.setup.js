jest.mock('firebase/app', () => {
  return {
    analytics: jest.fn(),
    apps: [],
    initializeApp: jest.fn(),
  }
})
