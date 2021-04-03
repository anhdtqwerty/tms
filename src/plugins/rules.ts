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
  password: (v: string) =>
    !v ||
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(v) ||
    'Phải có ít nhất 8 ký tự, gồm có: chữ hoa, chữ thường, số, ký tự đặc biệt',
  nospace: (v: string) => !v || !/ /.test(v.trim()) || 'Chứa khoảng cách',
  notEmpty: (v: string) => !Array.isArray(v) || !!v.length || 'Required'
}

export const appRules = {
  unitName: [rules.required, rules.maxLength(250)],
  unitCode: [rules.required, rules.maxLength(20), rules.nospace],
  unitEmail: [rules.required, rules.email],
  unitPhone: [rules.phone],
  unitAddress: [rules.maxLength(255)],
  unitDescription: [rules.maxLength(5000)],
  parentUnit: [rules.required],

  comradeName: [rules.required, rules.maxLength(100)],
  comradeCode: [rules.required, rules.maxLength(20), rules.nospace],
  comradeSex: [rules.required],
  comradeBod: [rules.required],
  comradeGroup: [rules.required],
  comradeTitle: [rules.maxLength(100)],
  comradeEmail: [rules.required, rules.email, rules.maxLength(100)],
  comradePhone: [rules.phone],
  comradeUnit: [rules.required],
  comradeUsername: [rules.required, rules.maxLength(20), rules.nospace],
  comradePassword: [rules.required, rules.maxLength(20), rules.password],

  //task
  taskCode: [rules.required, rules.maxLength(50)],
  taskTitle: [rules.maxLength(1000)],
  taskDescription: [rules.required, rules.maxLength(1000)],
  taskPriority: [rules.required],
  taskDeadlineType: [rules.required],
  taskExpiredDate: [rules.required],
  taskExtendDate: [rules.required],
  taskStartedDate: [rules.required],
  taskExplain: [rules.required, rules.maxLength(1000)],
  taskDocsInfo: [rules.maxLength(1000)],
  taskState: [rules.required],

  //role
  roleName: [rules.required, rules.maxLength(256)],
  roleDescription: [rules.maxLength(5000)]
}
