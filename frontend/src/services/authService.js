export function mockLogin(email, password) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true, user: { email, name: 'Apex User' } })
    }, 800)
  })
}

export function mockSignup(data) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true, user: { ...data } })
    }, 800)
  })
}

export function mockSendOTP(email) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true, otp: '123456' })
    }, 600)
  })
}

export function mockVerifyOTP(otp) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: otp === '123456' })
    }, 500)
  })
}
