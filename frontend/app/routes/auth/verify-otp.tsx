import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router"; // react-router v7
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { postData } from "@/lib/fetch-util";
import { useAuth } from "@/provider/auth-context";
import { Loader2 } from "lucide-react";

export default function VerifyOtp() {
    const [searchParams] = useSearchParams();
    const email = searchParams.get("email");
    const navigate = useNavigate();
    const { login } = useAuth(); // Assume login saves token/user to context/localstorage

    const [otp, setOtp] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [resendTimer, setResendTimer] = useState(0);

    useEffect(() => {
        if (!email) {
            navigate("/sign-in");
        }
    }, [email, navigate]);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (resendTimer > 0) {
            interval = setInterval(() => {
                setResendTimer((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [resendTimer]);

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const response = await postData<{ token: string; user: any; message: string }>("/auth/verify-otp", {
                email,
                otp,
            });

            // Assuming postData throws on error, or returns data.
            // If successful:
            localStorage.setItem("token", response.token);
            localStorage.setItem("user", JSON.stringify(response.user));
            // Force reload or use context method to update state
            window.location.href = "/dashboard";

        } catch (err: any) {
            setError(err.response?.data?.message || "Verification failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleResend = async () => {
        if (resendTimer > 0) return;
        setIsLoading(true);
        setError("");
        try {
            await postData("/auth/resend-otp", { email });
            setResendTimer(60); // 60 seconds cooldown
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to resend OTP.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-center">Verify your account</CardTitle>
                    <CardDescription className="text-center">
                        Enter the 6-digit code sent to {email}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleVerify} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="otp">One-Time Password</Label>
                            <Input
                                id="otp"
                                placeholder="123456"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                maxLength={6}
                                required
                                className="text-center text-lg tracking-widest"
                            />
                        </div>
                        {error && <p className="text-sm text-red-500">{error}</p>}
                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            Verify Account
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex flex-col space-y-2 text-center text-sm">
                    <div className="text-muted-foreground">
                        Didn't receive the code?{" "}
                        <button
                            onClick={handleResend}
                            disabled={resendTimer > 0 || isLoading}
                            className="text-primary hover:underline font-medium disabled:opacity-50"
                        >
                            {resendTimer > 0 ? `Resend in ${resendTimer}s` : "Resend OTP"}
                        </button>
                    </div>
                    <Link to="/sign-in" className="text-primary hover:underline">
                        Back to Sign In
                    </Link>
                </CardFooter>
            </Card>
        </div>
    );
}
