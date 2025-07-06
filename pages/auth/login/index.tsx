import LoginForm from "@/components/Login/LoginForm"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import Loading from "@/components/Loading"
import { encryptPost, decryptPost } from "@/lib/apiClient"
import { importSPKI, jwtVerify, errors } from "jose"
import { useToast } from "@/hooks/use-toast"

export default function LoginPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { token } = router.query as { token?: string }
  const [verifying, setVerifying] = useState(false)

  useEffect(() => {
    const verify = async () => {
      if (!token) {
        toast({ description: "Missing token.", variant: "destructive" })
        return
      }
      setVerifying(true)
      try {
        const res = await encryptPost("/auth/validate-login-token", { token })
        if (!res.ok) throw new Error("validate")
        const data = await decryptPost<{ token: string }>(res)
        let serverRsaPub = localStorage.getItem("serverRsaPublicKey")
        if (!serverRsaPub) {
          const r = await encryptPost("/auth/public-key", {})
          const j = await decryptPost<{ public_key: string }>(r)
          serverRsaPub = j.public_key
          localStorage.setItem("serverRsaPublicKey", serverRsaPub)
        }
        let key = await importSPKI(serverRsaPub!, "RS256")
        let payload
        try {
          ;({ payload } = await jwtVerify(data.token, key))
        } catch (err) {
          if (err instanceof errors.JWSSignatureVerificationFailed) {
            const r = await encryptPost("/auth/public-key", {})
            const j = await decryptPost<{ public_key: string }>(r)
            serverRsaPub = j.public_key
            localStorage.setItem("serverRsaPublicKey", serverRsaPub)
            key = await importSPKI(serverRsaPub, "RS256")
            ;({ payload } = await jwtVerify(data.token, key))
          } else {
            throw err
          }
        }
        window.location.href = payload.next_step as string
      } catch (err) {
        console.error("verify login token failed:", err)
        toast({ description: "Invalid or expired login link.", variant: "destructive" })
      } finally {
        setVerifying(false)
      }
    }
    verify()
  }, [token, toast])

  if (token && verifying) return <Loading />

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <LoginForm />
      </div>
    </div>
  )
}
