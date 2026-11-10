enum ValidatorsMessage {
    min = 'Минимальное значение',
    max = 'Масимальное значение',
    required = 'Поле обязательно',
    email = 'email',
    minLength = 'Минимальное количество символов',
    maxLength = 'Масимальное количество символов',
    pattern = 'pattern',
  }
  type Validators =
    | `min:${number}`
    | `max:${number}`
    | `minLength:${number}`
    | `maxLength:${number}`
    | 'required'
    | 'email'
  
  type validator = { [key: string]: Validators[] }
  
  export function errorsValidation(values: object, fields: validator) {
    const errors = {}
  
    for (const fieldName in fields) {
      errors[fieldName] = []
      for (const validator of fields[fieldName]) {
        const [validatorName, validatorValue] = validator.split(':')
        const _validatorValue = validatorValue ? Number(validatorValue) : 0
        if (
          ('required' == validatorName && !values[fieldName]) ||
          ('maxLength' == validatorName && values[fieldName]?.length > _validatorValue) ||
          ('minLength' == validatorName && values[fieldName]?.length < _validatorValue) ||
          ('max' == validatorName && values[fieldName] > _validatorValue) ||
          ('min' == validatorName && values[fieldName] < _validatorValue)
        ) {
          errors[fieldName].push({
            message:
              ValidatorsMessage[validatorName] + (_validatorValue ? ' ' + _validatorValue : ''),
          })
        }
      }
    }
  
    return errors
  }