import { html as beautify } from 'js-beautify'

import createSubscription from '../createSubscription'

import createRenderer from '../../../../../fela/src/createRenderer'

beforeEach(() => {
  const head = document.head
  while (head.firstChild) {
    head.removeChild(head.firstChild)
  }
})

afterEach(() => {
  process.env.NODE_ENV = 'test'
})

describe('Subscribing to the DOM', () => {
  it('should render rules to a DOM node', () => {
    const renderer = createRenderer()

    const updateSubscription = createSubscription(renderer)
    renderer.subscribe(updateSubscription)

    renderer.renderRule(() => ({
      backgroundColor: 'red',
      color: 'blue',
      ':hover': {
        color: 'red',
      },
    }))

    expect(
      beautify(document.documentElement.outerHTML, {
        indent_size: 2,
      })
    ).toMatchSnapshot()
  })

  it('should render static styles to a DOM node', () => {
    const renderer = createRenderer()

    const updateSubscription = createSubscription(renderer)
    renderer.subscribe(updateSubscription)

    renderer.renderStatic(
      {
        backgroundColor: 'red',
        color: 'blue',
      },
      'body, html'
    )

    expect(
      beautify(document.documentElement.outerHTML, {
        indent_size: 2,
      })
    ).toMatchSnapshot()
  })

  it('should render keyframes to a DOM node', () => {
    const renderer = createRenderer()

    const updateSubscription = createSubscription(renderer)
    renderer.subscribe(updateSubscription)

    renderer.renderKeyframe(() => ({
      from: { color: 'red' },
      to: { color: 'blue' },
    }))

    expect(
      beautify(document.documentElement.outerHTML, {
        indent_size: 2,
      })
    ).toMatchSnapshot()
  })

  it('should render media rules and support rules to single DOM nodes', () => {
    const renderer = createRenderer()

    const updateSubscription = createSubscription(renderer)
    renderer.subscribe(updateSubscription)

    renderer.renderRule(() => ({
      color: 'blue',
      '@supports (display: flex)': {
        display: 'flex',
      },
      '@media (min-width: 300px)': {
        color: 'red',
        '@media (max-height: 500px)': {
          color: 'yellow',
          '@supports (display: grid)': {
            display: 'grid',
          },
        },
      },
    }))

    expect(
      beautify(document.documentElement.outerHTML, {
        indent_size: 2,
      })
    ).toMatchSnapshot()
  })

  it('should clear all DOM nodes', () => {
    const renderer = createRenderer()

    const updateSubscription = createSubscription(renderer)
    renderer.subscribe(updateSubscription)

    renderer.renderRule(() => ({
      color: 'blue',
      '@media (min-width: 300px)': {
        color: 'red',
        '@media (max-height: 500px)': {
          color: 'yellow',
        },
      },
    }))

    renderer.renderKeyframe(() => ({
      from: { color: 'red' },
      to: { color: 'blue' },
    }))

    renderer.clear()

    expect(
      beautify(document.documentElement.outerHTML, {
        indent_size: 2,
      })
    ).toMatchSnapshot()
  })

  it('should use insertRule', () => {
    const renderer = createRenderer()

    process.env.NODE_ENV = 'production'

    const updateSubscription = createSubscription(renderer)
    renderer.subscribe(updateSubscription)

    renderer.renderRule(() => ({
      color: 'blue',
      '@media (min-width: 300px)': {
        color: 'red',
        '@media (max-height: 500px)': {
          color: 'yellow',
        },
      },
    }))

    renderer.renderKeyframe(() => ({
      from: { color: 'red' },
      to: { color: 'blue' },
    }))

    const rules = {}

    document.querySelectorAll('[data-fela-type="RULE"]').forEach(node => {
      const sheet = node.sheet
      const media = node.getAttribute('media') || ''

      rules[media] = sheet.cssRules
    })

    expect([
      beautify(document.documentElement.outerHTML, {
        indent_size: 2,
      }),
      rules,
    ]).toMatchSnapshot()
  })
})