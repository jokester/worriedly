import classNames from 'classnames';

export const tailwindComponents = {
  appTitle: 'text-2xl inline-block px-4',
  button: 'bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-4',
  buttonDisabled: 'bg-blue-300 text-white font-bold py-2 px-4 rounded cursor-not-allowed ml-4',
  buttonBar: 'py-4 px-4 flex justify-end button-bar',
  formLine: 'flex justify-between items-baseline',
  formLabel: 'font-semibold',
  formInput: 'monospace',
  fileInput: 'block',
  errorMessage: 'text-red-600 text-sm',
  stepsContainer: `flex width-100 align-center justify-around font-mono py-2`,
  step: (step: number, selected: number) =>
    classNames(
      `inline-block`,
      0 && `border border-gray-600 border-solid p-2`,
      step === selected && 'font-bold',
      step > selected && 'text-gray-500',
    ),

  formContent: 'h-',
} as const;
