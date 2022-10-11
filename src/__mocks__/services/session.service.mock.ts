const SessionServiceMock = {
  BASE_URL: 'https://some.url',
  getSession: jest.fn(),
  getAllSessions: jest.fn(),
  putSession: jest.fn()
}

export default SessionServiceMock;
