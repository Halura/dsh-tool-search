import { describe, expect, it } from 'vitest'
import type { PromptAssembly } from '@deepseek-ai/dsh-system-prompt'
import { isPtcOnlyAssembly, PTC_TRANSPORT_TOOL, transportNamesIn } from '../src/ptc.ts'

function assembly(overrides: Partial<PromptAssembly> = {}): PromptAssembly {
  return {
    sections: [],
    contexts: [],
    tools: [],
    variables: {},
    ...overrides,
  }
}

const RUN_CODE_SCHEMA = { name: PTC_TRANSPORT_TOOL, description: 'execute a program', parameters: { type: 'object', properties: {} } }

describe('isPtcOnlyAssembly', () => {
  it('recognizes a scope whose collapse section carries the rule', () => {
    expect(isPtcOnlyAssembly(assembly({ sections: [{ name: 'tools:ptc-only', text: '`run_code` is the only tool you can call directly' }] }))).toBe(true)
  })

  it('treats an empty collapse section as native or both', () => {
    expect(isPtcOnlyAssembly(assembly({ sections: [{ name: 'tools:ptc-only', text: '' }] }))).toBe(false)
    expect(isPtcOnlyAssembly(assembly())).toBe(false)
  })
})

describe('transportNamesIn', () => {
  it('keeps the transport eager when the assembly declares it', () => {
    expect(transportNamesIn(assembly({ tools: [RUN_CODE_SCHEMA] }))).toEqual([PTC_TRANSPORT_TOOL])
  })

  it('adds nothing to a native surface', () => {
    expect(transportNamesIn(assembly({ tools: [{ name: 'read', description: 'read', parameters: { type: 'object', properties: {} } }] }))).toEqual([])
  })
})
