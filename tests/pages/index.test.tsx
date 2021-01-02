import { render } from '../test-utils'

import Home from '@/pages/index'

describe('Home page', () => {
  it('renders page without user', () => {
    const { asFragment } = render(<Home />, {})
    expect(asFragment()).toMatchSnapshot()
  })

  it('renders page with user', () => {
    jest.mock('@/context/UserContext', () => ({
      useUser: jest.fn(() => ({
        user: {
          uid: 'test-user-id',
        },
      })),
    }))
    const { asFragment } = render(<Home />, {})

    expect(asFragment()).toMatchSnapshot()
  })
})
