export const inputRulesPlugin = {
  install: (Vue: any) => {
    Vue.prototype.$rules = {
      required: (v: string | number) => (!!v && (typeof v !== 'string' || !!v.trim())) || v === 0 || 'Required',
      maxLength: (length: number) => (v: string) =>
        (v && v.length <= length) || !v || `Maximum ${length} characters length`,
      minLength: (length: number) => (v: string) =>
        (v && v.length >= length) || !v || `Minium ${length} characters length`,
      max: (number: number) => (v: number) => v <= number || `Must be lower than or equal to ${number}`,
      min: (number: number) => (v: number) => v >= number || `Must be greater than or equal to ${number}`,
      email: (v: string) =>
        (v &&
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
            v.trim()
          )) ||
        !v ||
        'Invalid email address',
      url: (v: string) =>
        /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)[a-z0-9]+([-.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/.test(
          v
        ) ||
        !v ||
        'Invalid URL',
      alphabet: (v: string) =>
        !v ||
        /^[a-z ẮẰẲẴẶĂẤẦẨẪẬÂÁÀÃẢẠĐẾỀỂỄỆÊÉÈẺẼẸÍÌỈĨỊỐỒỔỖỘÔỚỜỞỠỢƠÓÒÕỎỌỨỪỬỮỰƯÚÙỦŨỤÝỲỶỸỴ]+$/gi.test(v.trim()) ||
        'Contain a-z only',
      normal: (v: string) =>
        !v ||
        /^[a-z0-9 ._ẮẰẲẴẶĂẤẦẨẪẬÂÁÀÃẢẠĐẾỀỂỄỆÊÉÈẺẼẸÍÌỈĨỊỐỒỔỖỘÔỚỜỞỠỢƠÓÒÕỎỌỨỪỬỮỰƯÚÙỦŨỤÝỲỶỸỴ]+$/gi.test(v.trim()) ||
        'Contains invalid character',
      equal: (target: string, msg: string) => (v: string) => !v || target === v || msg || `Must be equal to ${target}`,
      phone: (v: string) =>
        !v || (v.length >= 10 && /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s./0-9]*$/gi.test(v)) || 'Invalid phone number',
      nospace: (v: string) => !v || !/ /.test(v.trim()) || 'Space is not allowed',
      notEmpty: (v: string) => !Array.isArray(v) || !!v.length || 'Required'
    }
  }
}

export const rules = {
  required: (v: string | number) =>
    (!!v && (typeof v !== 'string' || !!v.trim())) || v === 0 || 'Trường này là bắt buộc',
  maxLength: (length: number) => (v: string) => (v && v.length <= length) || !v || `Tối đa ${length} kí tự`,
  minLength: (length: number) => (v: string) => (v && v.length >= length) || !v || `Tối thiểu ${length} kí tự`,
  max: (number: number) => (v: number) => v <= number || `Must be lower than or equal to ${number}`,
  min: (number: number) => (v: number) => v >= number || `Must be greater than or equal to ${number}`,
  email: (v: string) =>
    (v &&
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        v.trim()
      )) ||
    !v ||
    'Sai định dạng',
  url: (v: string) =>
    /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)[a-z0-9]+([-.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/.test(
      v
    ) ||
    !v ||
    'Invalid URL',
  alphabet: (v: string) =>
    !v ||
    /^[a-z ẮẰẲẴẶĂẤẦẨẪẬÂÁÀÃẢẠĐẾỀỂỄỆÊÉÈẺẼẸÍÌỈĨỊỐỒỔỖỘÔỚỜỞỠỢƠÓÒÕỎỌỨỪỬỮỰƯÚÙỦŨỤÝỲỶỸỴ]+$/gi.test(v.trim()) ||
    'Contain a-z only',
  normal: (v: string) =>
    !v ||
    /^[a-z0-9 ._ẮẰẲẴẶĂẤẦẨẪẬÂÁÀÃẢẠĐẾỀỂỄỆÊÉÈẺẼẸÍÌỈĨỊỐỒỔỖỘÔỚỜỞỠỢƠÓÒÕỎỌỨỪỬỮỰƯÚÙỦŨỤÝỲỶỸỴ]+$/gi.test(v.trim()) ||
    'Contains invalid character',
  equal: (target: string, msg: string) => (v: string) => !v || target === v || msg || `Must be equal to ${target}`,
  phone: (v: string) =>
    !v || (v.length >= 10 && /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s./0-9]*$/gi.test(v)) || 'Sai định dạng',
  nospace: (v: string) => !v || !/ /.test(v.trim()) || 'Space is not allowed',
  notEmpty: (v: string) => !Array.isArray(v) || !!v.length || 'Required'
}

export const appValidators = {
  unitName: (v: string) => rules.required(v) || rules.maxLength(250)(v),
  unitCode: (v: string) => rules.required(v) || rules.maxLength(20)(v),
  unitEmail: (v: string) => rules.required(v) || rules.email(v),
  unitPhone: (v: string) => !v || rules.phone(v)
}
