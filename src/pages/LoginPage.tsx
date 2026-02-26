import { useCallback, useState } from 'react'
import { Form, Input, Checkbox } from 'antd'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { selectAuth } from '@/store/selectors/auth.selectors'
import {
  login as loginThunk,
  register as registerThunk,
  verifyOtp as verifyOtpThunk,
  resendOtp as resendOtpThunk,
} from '@/store/actions/auth.action'
import { useLoginRedirect } from '@/hooks/useLoginRedirect'
import { toastStore } from '@/store/toast.store'
import { SEO } from '@/components/SEO'
import { AuthLayout, AuthVisualPanel, AuthMobileIllustration, FormField, Button } from '@/components/ui'
import { PATHS } from '@/routes/paths'
import type { LoginInput, RegisterInput, VerifyOtpInput } from '@/@types/auth.type'
import { SITE_NAME } from '@/constants/seo'

type AuthTab = 'login' | 'register'

const inputClassName =
  'h-9 w-full min-h-[36px] text-sm rounded-lg border-slate-200 bg-slate-50/80 text-slate-900 placeholder:text-slate-400 [&_input]:w-full [&_input]:h-full [&_input]:text-sm [&_input]:bg-transparent [&_input]:text-slate-900 [&_input]:rounded-lg'

/**
 * Auth screen: form on left (light), visual panel on right.
 * Register first; success toast → OTP step; OTP success toast → redirect home.
 */
export function LoginPage() {
  const dispatch = useAppDispatch()
  const { navigateAfterLogin } = useLoginRedirect(PATHS.HOME)
  const auth = useAppSelector(selectAuth)
  const { loading, error } = auth

  const [activeTab, setActiveTab] = useState<AuthTab>('login')
  const [registerEmailSent, setRegisterEmailSent] = useState<string | null>(null)

  const [loginForm] = Form.useForm<LoginInput>()
  const [registerForm] = Form.useForm<RegisterInput>()
  const [otpForm] = Form.useForm<VerifyOtpInput>()

  const handleLoginFinish = useCallback(
    (values: LoginInput & { remember?: boolean }) => {
      const { remember: _, ...loginPayload } = values
      dispatch(loginThunk(loginPayload))
        .unwrap()
        .then(() => navigateAfterLogin())
        .catch(() => {
          // Error toast already shown by axios interceptor
        })
    },
    [dispatch, navigateAfterLogin],
  )

  const handleRegisterFinish = useCallback(
    (values: RegisterInput) => {
      dispatch(registerThunk(values))
        .unwrap()
        .then((res) => {
          toastStore.getState().showSuccess(res.message ?? 'Verification code sent to your email.')
          setRegisterEmailSent(values.email)
        })
        .catch(() => {
          // Error toast already shown by axios interceptor
        })
    },
    [dispatch],
  )

  const handleVerifyOtpFinish = useCallback(
    (values: VerifyOtpInput) => {
      const email = registerEmailSent ?? values.email
      dispatch(verifyOtpThunk({ ...values, email }))
        .unwrap()
        .then(() => {
          toastStore.getState().showSuccess('Email verified. Welcome!')
          navigateAfterLogin()
        })
        .catch(() => {
          // Error toast already shown by axios interceptor
        })
    },
    [dispatch, registerEmailSent, navigateAfterLogin],
  )

  const handleResendOtp = useCallback(() => {
    if (!registerEmailSent) return
    dispatch(resendOtpThunk({ email: registerEmailSent }))
      .unwrap()
      .then((res) => toastStore.getState().showSuccess(res.message ?? 'Code sent again.'))
      .catch(() => {
        // Error toast already shown by axios interceptor
      })
  }, [dispatch, registerEmailSent])

  const handleTabChange = useCallback((key: string) => {
    setActiveTab(key as AuthTab)
    setRegisterEmailSent(null)
    registerForm.resetFields()
    otpForm.resetFields()
  }, [registerForm, otpForm])

  return (
    <>
      <SEO title="Login" description="Sign in or register on Live Bhoomi." canonical={PATHS.LOGIN} noIndex />
      <AuthLayout rightContent={<AuthVisualPanel />}>
        <div className="w-full max-w-md min-w-0 flex flex-col items-center [&_.ant-form]:w-full">
          {/* Mobile: house illustration at top */}
          <AuthMobileIllustration />

          {/* Logo — hidden on mobile when we have illustration, show on md+ */}
          <div className="hidden md:flex items-center gap-2 mb-3 lg:mb-4 justify-center shrink-0">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
              L
            </div>
            <span className="text-base font-semibold text-slate-800 truncate">{SITE_NAME}.</span>
          </div>

          {registerEmailSent ? (
            <>
              <h1 className="text-lg font-bold text-slate-900 mb-0.5">Verify your email</h1>
              <p className="text-slate-500 text-xs mb-2 break-words">
                We sent a code to {registerEmailSent}. Enter it below.
              </p>
              <Form
                form={otpForm}
                name="verify-otp"
                layout="vertical"
                requiredMark={false}
                onFinish={handleVerifyOtpFinish}
                initialValues={{ email: registerEmailSent }}
              >
                <FormField label="Email" name="email" hidden>
                  <Input type="hidden" />
                </FormField>
                <FormField
                  label="Verification code"
                  name="otp"
                  rules={[{ required: true, message: 'Enter the code from your email' }]}
                >
                  <Input
                    placeholder="000000"
                    autoComplete="one-time-code"
                    className={inputClassName}
                    maxLength={6}
                  />
                </FormField>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button
                    type="primary"
                    htmlType="submit"
                    block
                    loading={loading}
                    disabled={loading}
                    className="h-9 font-medium flex-1 rounded-lg text-sm"
                  >
                    {loading ? 'Verifying…' : 'Verify'}
                  </Button>
                  <Button
                    onClick={handleResendOtp}
                    disabled={loading}
                    className="h-9 rounded-lg text-sm"
                  >
                    Resend
                  </Button>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setRegisterEmailSent(null)
                    otpForm.resetFields()
                  }}
                  className="text-slate-500 text-sm mt-3 hover:text-slate-700"
                >
                  Use a different email
                </button>
              </Form>
            </>
          ) : (
            <>
              {/* Title */}
              <h1 className="text-lg font-bold text-slate-900 mb-0.5 mt-0 text-center w-full shrink-0">
                {activeTab === 'login' ? 'Welcome Back' : 'Create an Account'}
              </h1>
              <p className="text-slate-500 text-xs mb-5 text-center w-full shrink-0">
                {activeTab === 'login'
                  ? "Let's login to grab amazing deals."
                  : 'Join to find your perfect place.'}
              </p>

              {/* Login form — gap below heading, centered */}
              {activeTab === 'login' && (
                <>
                <div className="w-full">
                  <Form
                    form={loginForm}
                    name="login"
                    layout="vertical"
                    requiredMark={false}
                    onFinish={handleLoginFinish}
                    className="w-full"
                  >
                    <FormField
                      label="Email Address"
                      name="identifier"
                      rules={[{ required: true, message: 'Enter your email or phone' }]}
                    >
                      <Input
                        placeholder="abhishekpatel@gmail.com"
                        autoComplete="username"
                        className={inputClassName}
                      />
                    </FormField>
                    <FormField
                      label="Password"
                      name="password"
                      rules={[{ required: true, message: 'Enter your password' }]}
                    >
                      <Input.Password
                        placeholder="********"
                        autoComplete="current-password"
                        className={inputClassName}
                      />
                    </FormField>
                    <Form.Item name="remember" valuePropName="checked" noStyle>
                      <Checkbox className="text-slate-600 text-sm sr-only">Remember me</Checkbox>
                    </Form.Item>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <Form.Item className="mb-0 flex-1 min-w-0">
                        <Button
                          type="primary"
                          htmlType="submit"
                          block
                          loading={loading}
                          disabled={loading}
                          className="h-9 font-medium rounded-lg text-sm bg-indigo-700 hover:bg-indigo-800"
                        >
                          {loading ? 'Signing in…' : 'Login'}
                        </Button>
                      </Form.Item>
                      <a
                        href="#"
                        className="text-xs text-indigo-600 hover:text-indigo-700 whitespace-nowrap shrink-0"
                        onClick={(e) => e.preventDefault()}
                      >
                        Forgot Password
                      </a>
                    </div>
                    {error != null && (
                      <p className="text-red-500 text-sm mb-3" role="alert">
                        {error}
                      </p>
                    )}
                  </Form>
                </div>
                <div className="relative my-2">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200" />
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="bg-white px-2 text-slate-500">Or</span>
                  </div>
                </div>
                <div className="flex gap-2 w-full">
                  <Button
                    className="flex-1 h-9 rounded-lg border-slate-200 text-slate-700 hover:border-slate-300 hover:text-slate-800 min-w-0 font-medium text-sm"
                    icon={<span className="text-sm font-semibold text-[#4285F4]">G</span>}
                  >
                    <span className="truncate">Google</span>
                  </Button>
                  <Button
                    className="flex-1 h-9 rounded-lg border-slate-200 text-slate-700 hover:border-slate-300 hover:text-slate-800 min-w-0 font-medium text-sm"
                    icon={<span className="text-sm font-semibold">⌘</span>}
                  >
                    <span className="truncate">Apple</span>
                  </Button>
                </div>
                </>
              )}

              {/* Sign Up form — gap below heading, centered */}
              {activeTab === 'register' && (
                <div className="w-full">
                  <Form
                    form={registerForm}
                    name="register"
                    layout="vertical"
                    requiredMark={false}
                    onFinish={handleRegisterFinish}
                    className="w-full"
                  >
                  <FormField
                    label="Full Name"
                    name="name"
                    rules={[{ required: true, message: 'Enter your name' }]}
                  >
                    <Input
                      placeholder="Abhishek Patel"
                      autoComplete="name"
                      className={inputClassName}
                    />
                  </FormField>
                  <FormField
                    label="Email Address"
                    name="email"
                    rules={[
                      { required: true, message: 'Enter your email' },
                      { type: 'email', message: 'Enter a valid email' },
                    ]}
                  >
                    <Input
                      placeholder="abhishekpatel@gmail.com"
                      autoComplete="email"
                      type="email"
                      className={inputClassName}
                    />
                  </FormField>
                  <FormField
                    label="Phone Number"
                    name="phone"
                    rules={[{ required: true, message: 'Enter your phone number' }]}
                  >
                    <Input
                      placeholder="81 6082 8XXX"
                      autoComplete="tel"
                      className={inputClassName}
                    />
                  </FormField>
                  <FormField
                    label="Password"
                    name="password"
                    rules={[
                      { required: true, message: 'Create a password' },
                      { min: 6, message: 'At least 6 characters' },
                    ]}
                  >
                    <Input.Password
                      placeholder="********"
                      autoComplete="new-password"
                      className={inputClassName}
                    />
                  </FormField>
                  <Form.Item className="mb-0 mt-2">
                    <Button
                      type="primary"
                      htmlType="submit"
                      block
                      loading={loading}
                      disabled={loading}
                      className="h-9 font-medium rounded-lg text-sm bg-indigo-700 hover:bg-indigo-800"
                    >
                      {loading ? 'Sending code…' : 'Sign Up'}
                    </Button>
                  </Form.Item>
                </Form>
                </div>
              )}

              <p className="text-center text-slate-500 text-xs mt-2 px-1 shrink-0">
                {activeTab === 'login' ? (
                  <>
                    Don&apos;t have an account?{' '}
                    <button
                      type="button"
                      onClick={() => handleTabChange('register')}
                      className="text-indigo-600 font-medium hover:text-indigo-700 hover:underline"
                    >
                      Sign Up
                    </button>
                  </>
                ) : (
                  <>
                    Already have an account?{' '}
                    <button
                      type="button"
                      onClick={() => handleTabChange('login')}
                      className="text-indigo-600 font-medium hover:text-indigo-700 hover:underline"
                    >
                      Sign in
                    </button>
                  </>
                )}
              </p>
            </>
          )}
        </div>
      </AuthLayout>
    </>
  )
}
