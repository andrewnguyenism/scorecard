import { render } from '../test-utils'

import { Header } from '@/components/Header'

describe('Header component', () => {
  it('renders without back button', () => {
    const { asFragment } = render(<Header />)
    expect(asFragment()).toMatchSnapshot()
  })
  it('renders with back button', () => {
    const { asFragment } = render(<Header />, {
      router: { asPath: '/new-game/dutch-blitz' },
    })
    expect(asFragment()).toMatchSnapshot()
  })
})
