import { render } from '../test-utils'

import Changelog from '@/pages/changelog'

describe('Changelog page', () => {
  it('renders page', () => {
    const { asFragment } = render(<Changelog />, {})
    expect(asFragment()).toMatchSnapshot()
  })
})