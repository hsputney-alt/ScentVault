import { SignUp } from '@clerk/nextjs'
import Header from '../../components/Header'

export default function SignUpPage() {
  return (
    <main style={{minHeight: '100vh', background: 'white'}}>
      <Header />
      <div style={{display: 'flex', justifyContent: 'center', paddingTop: '64px'}}>
        <SignUp />
      </div>
    </main>
  )
}