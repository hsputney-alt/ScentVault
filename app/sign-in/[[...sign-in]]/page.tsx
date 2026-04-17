import { SignIn } from '@clerk/nextjs'
import Header from '../../components/Header'

export default function SignInPage() {
  return (
    <main style={{minHeight: '100vh', background: 'white'}}>
      <Header />
      <div style={{display: 'flex', justifyContent: 'center', paddingTop: '64px'}}>
        <SignIn />
      </div>
    </main>
  )
}