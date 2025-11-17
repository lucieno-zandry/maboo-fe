export type GetUpdatedFormErrorsProps<T> = {
  formErrors: T | null,
  name: keyof T,
  validationErrors?: string[] | null
}


export default function getUpdatedFormErrors<T extends Record<string, string[]>>({
  formErrors,
  name,
  validationErrors
}: GetUpdatedFormErrorsProps<T>): T | null {
  const defaultFormErrors = {} as T;
  let newFormErrors: T;

  if (formErrors === null) {
    newFormErrors = { ...defaultFormErrors, [name]: validationErrors };
  } else {
    newFormErrors = { ...formErrors, [name]: validationErrors };
  }

  const newFormErrorsIsEmpty: boolean = Object.keys(newFormErrors).every((key) => !newFormErrors[key] || !newFormErrors[key].length);

  return newFormErrorsIsEmpty ? null : newFormErrors;
}

