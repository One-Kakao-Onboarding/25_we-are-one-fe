"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { authService } from "@/lib/services/auth.service"
import { GreenPathCard, GreenPathCardContent } from "@/components/ui/greenpath-card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Zap, Loader2 } from "lucide-react"
import { toast } from "sonner"

export default function LoginPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        username: "",
        password: "",
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const response = await authService.login(formData.username, formData.password)
            console.log('Login success', response);

            toast.success(`${response.user.name}님 환영합니다!`)

            // Redirect based on role
            if (response.user.role === "CONSULTANT") {
                router.push("/consultant/dashboard")
            } else {
                router.push("/employee/commute")
            }
        } catch (error: any) {
            console.error('Login error', error);
            toast.error(error.message || "로그인에 실패했습니다.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <main className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-md space-y-8">
                <div className="text-center space-y-2">

                    <div className="flex items-center justify-center gap-2 mt-4 mb-2">
                        <span className="text-3xl font-light tracking-tight text-white">Next</span>
                        <span className="text-3xl font-bold tracking-tight text-white">ZERO</span>
                        <span className="text-xs align-super text-white/70">™</span>
                    </div>
                    <p className="text-muted-foreground">서비스 이용을 위해 로그인해주세요</p>
                </div>

                <GreenPathCard className="bg-card/50 backdrop-blur-sm border-border/50">
                    <GreenPathCardContent className="p-6">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-muted-foreground">아이디</label>
                                <Input
                                    required
                                    placeholder="아이디를 입력하세요"
                                    value={formData.username}
                                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                    className="bg-secondary/50 border-white/10"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-muted-foreground">비밀번호</label>
                                <Input
                                    required
                                    type="password"
                                    placeholder="비밀번호를 입력하세요"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="bg-secondary/50 border-white/10"
                                />
                            </div>

                            <div className="pt-4">
                                <Button
                                    type="submit"
                                    className="w-full bg-employee-primary hover:bg-employee-primary-hover text-black font-semibold h-12 text-lg"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <Loader2 className="h-5 w-5 animate-spin" />
                                    ) : (
                                        "로그인"
                                    )}
                                </Button>
                            </div>
                        </form>

                        <div className="mt-6 text-center text-sm text-muted-foreground bg-secondary/30 p-4 rounded-lg">
                            <p className="font-semibold mb-2 text-foreground">테스트 계정</p>
                            <div className="grid grid-cols-2 gap-2 text-xs text-left px-2">
                                <div>
                                    <span className="text-indigo-400 font-bold">임직원</span><br />
                                    ID: employee1<br />PW: 1234
                                </div>
                                <div>
                                    <span className="text-purple-400 font-bold">컨설턴트</span><br />
                                    ID: consultant<br />PW: admin
                                </div>
                            </div>
                        </div>
                    </GreenPathCardContent>
                </GreenPathCard>
            </div>
        </main>
    )
}
