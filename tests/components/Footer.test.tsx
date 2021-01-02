import { render } from '../test-utils'

import { Footer } from '@/components/Footer'

describe('Footer component', () => {
  it('renders component', () => {
    const { asFragment } = render(<Footer />)
    expect(asFragment()).toMatchSnapshot()
  })
})
