'use client'
import Choices, { type Options as ChoiceOption } from 'choices.js'
import { type HTMLAttributes, type ReactElement, useEffect, useRef } from 'react'

export type ChoiceProps = HTMLAttributes<HTMLInputElement> &
  HTMLAttributes<HTMLSelectElement> & {
    multiple?: boolean
    className?: string
    options?: Partial<ChoiceOption>
    onChange?: (text: string) => void
  } & (
    | {
        allowInput?: false
        children: ReactElement[]
      }
    | { allowInput?: true }
  )

const ChoicesFormInput = ({ children, multiple, className, onChange, allowInput, options, ...props }: ChoiceProps) => {
  const choicesRef = useRef<HTMLInputElement & HTMLSelectElement>(null)

  useEffect(() => {
    if (choicesRef.current) {
      const choices = new Choices(choicesRef.current, {
        ...options,
        placeholder: true,
        allowHTML: true,
        shouldSort: false,
      })

      const handleChange = (e: Event) => {
        if (!(e.target instanceof HTMLSelectElement)) return
        if (onChange) {
          onChange(e.target.value)
        }
      }

      choices.passedElement.element.addEventListener('change', handleChange)

      return () => {
        choices.passedElement.element.removeEventListener('change', handleChange)
        choices.destroy() // Cleanup Choices.js instance to prevent memory leaks
      }
    }
  }, [onChange, options]) // ✅ Added 'onChange' and 'options' to dependency array

  return allowInput ? (
    <input ref={choicesRef} multiple={multiple} className={className} {...props} />
  ) : (
    <select ref={choicesRef} multiple={multiple} className={className} {...props}>
      {children}
    </select>
  )
}

export default ChoicesFormInput
