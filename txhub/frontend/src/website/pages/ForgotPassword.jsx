import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, Lock, Key, ArrowRight, ArrowLeft, CheckCircle2, ShieldCheck, Eye, EyeOff } from "lucide-react";
import { toast } from "react-hot-toast";

/**
 * ForgotPassword Page
 * Handles three-step flow:
 * Step 1: Request reset (Verify email exists, get simulated OTP)
 * Step 2: Verify OTP
 * Step 3: Reset Password (New Password + Confirm Password)
 */
const ForgotPassword = () => {
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: Passwords, 4: Success
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [enteredOtp, setEnteredOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validateEmail = () => {
    if (!email.trim()) {
      setFieldErrors({ email: "Email is required" });
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setFieldErrors({ email: "Invalid email format" });
      return false;
    }
    setFieldErrors({});
    return true;
  };

  const validatePassword = () => {
    let errs = {};
    if (!newPassword) errs.newPassword = "Password is required";
    else if (newPassword.length < 6) errs.newPassword = "Minimum 6 characters required";

    if (!confirmPassword) errs.confirmPassword = "Please confirm password";
    else if (newPassword !== confirmPassword) errs.confirmPassword = "Passwords do not match";

    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleRequest = async (e) => {
    e.preventDefault();
    if (!validateEmail()) return;

    setLoading(true);
    setError("");

    try {
      const resp = await fetch("http://127.0.0.1:8000/api/forgot-password/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, action: "request" }),
      });

      const data = await resp.json();

      if (resp.ok) {
        setStep(2);
        toast.success("OTP sent to your email!");
        setMessage("OTP sent to your email");
      } else {
        toast.error(data.error || "Failed to send OTP");
        setError(data.error);
      }
    } catch {
      toast.error("Network error");
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (enteredOtp.length !== 6) {
      toast.error("Please enter a 6-digit OTP");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const resp = await fetch("http://127.0.0.1:8000/api/forgot-password/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          otp: enteredOtp,
          action: "verify",
        }),
      });

      const data = await resp.json();

      if (resp.ok) {
        setStep(3);
        toast.success("OTP Verified Successfully");
        setMessage("OTP verified");
      } else {
        toast.error(data.error || "Invalid OTP");
        setError(data.error);
      }
    } catch {
      toast.error("Network error");
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };
  const handleReset = async (e) => {
    e.preventDefault();

    if (!validatePassword()) return;

    setLoading(true);
    setError("");

    try {
      const resp = await fetch("http://127.0.0.1:8000/api/forgot-password/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          new_password: newPassword,
          action: "reset",
        }),
      });

      const data = await resp.json();

      if (resp.ok) {
        setStep(4);
        toast.success("Password reset successfully!");
        setMessage("Password updated successfully");
      } else {
        toast.error(data.error || "Reset failed");
        setError(data.error);
      }
    } catch {
      toast.error("Network error");
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-gray-50 px-4 overflow-hidden">

      {/* Background Decorative Blurs */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-400/20 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-sky-300/20 rounded-full blur-[120px]" />
      <div className="absolute inset-0 backdrop-blur-[8px] bg-white/30 z-0" />

      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white rounded-[2.5rem] p-10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] border border-gray-100/50 relative">

          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-50 rounded-3xl mb-6 shadow-inner">
              {step === 1 && <Mail className="w-10 h-10 text-blue-600" />}
              {step === 2 && <ShieldCheck className="w-10 h-10 text-blue-600" />}
              {step === 3 && <Key className="w-10 h-10 text-blue-600" />}
              {step === 4 && <CheckCircle2 className="w-10 h-10 text-emerald-500" />}
            </div>

            <h2 className="text-3xl font-black text-gray-900 tracking-tight">
              {step === 1 && "Forgot Password?"}
              {step === 2 && "Enter OTP"}
              {step === 3 && "New Password"}
              {step === 4 && "Success!"}
            </h2>
            <p className="text-sm font-medium text-gray-400 mt-2">
              {step === 1 && "Verify your account email"}
              {step === 2 && `Enter the 6-digit code sent to ${email}`}
              {step === 3 && "Secure your account with a new password"}
              {step === 4 && "Your password has been updated"}
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-sm font-bold animate-shake">
              {error}
            </div>
          )}

          {message && step !== 4 && (
            <div className="mb-6 p-4 bg-emerald-50 border border-emerald-100 rounded-2xl text-emerald-600 text-sm font-bold">
              {message}
            </div>
          )}

          {step === 1 && (
            <form onSubmit={handleRequest} className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setFieldErrors({});
                  }}
                  placeholder="Email Address"
                  className={`w-full pl-12 pr-4 py-4 rounded-2xl outline-none transition-all font-medium ${fieldErrors.email
                    ? 'bg-red-50 border border-red-200 text-red-900 placeholder:text-red-300'
                    : 'bg-gray-100/80 focus:ring-2 focus:ring-blue-500/20 focus:bg-white text-gray-700'
                    }`}
                />
              </div>
              {fieldErrors.email && <p className="text-red-500 text-[10px] font-bold ml-4 mt-1">{fieldErrors.email}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold flex justify-center items-center gap-2 hover:bg-blue-700 shadow-lg shadow-blue-500/20 transition-all active:scale-95 mt-4"
              >
                {loading ? (
                  <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Send OTP <ArrowRight size={20} />
                  </>
                )}
              </button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="relative">
                <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  maxLength="6"
                  value={enteredOtp}
                  onChange={(e) => setEnteredOtp(e.target.value)}
                  placeholder="6-digit OTP"
                  className="w-full pl-12 pr-4 py-4 bg-gray-100/80 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all font-bold text-center text-2xl tracking-[0.5em] text-gray-700"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold flex justify-center items-center gap-2 hover:bg-blue-700 shadow-lg shadow-blue-500/20 transition-all active:scale-95 mt-4"
              >
                Verify OTP <ArrowRight size={20} />
              </button>
            </form>
          )}

          {step === 3 && (
            <form onSubmit={handleReset} className="space-y-4">
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    setFieldErrors(prev => ({ ...prev, newPassword: "" }));
                  }}
                  placeholder="New Password"
                  className={`w-full pl-12 pr-12 py-4 rounded-2xl outline-none transition-all font-medium ${fieldErrors.newPassword
                    ? 'bg-red-50 border border-red-200 text-red-900'
                    : 'bg-gray-100/80 focus:ring-2 focus:ring-blue-500/20 focus:bg-white text-gray-700'
                    }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2 hover:bg-black/5 rounded-lg transition-all"
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff size={18} className="text-blue-600" />
                  ) : (
                    <Eye size={18} className="text-gray-400" />
                  )}
                </button>
              </div>
              {fieldErrors.newPassword && <p className="text-red-500 text-[10px] font-bold ml-4 mt-1">{fieldErrors.newPassword}</p>}
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setFieldErrors(prev => ({ ...prev, confirmPassword: "" }));
                  }}
                  placeholder="Confirm New Password"
                  className={`w-full pl-12 pr-12 py-4 rounded-2xl outline-none transition-all font-medium ${fieldErrors.confirmPassword
                    ? 'bg-red-50 border border-red-200 text-red-900'
                    : 'bg-gray-100/80 focus:ring-2 focus:ring-blue-500/20 focus:bg-white text-gray-700'
                    }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2 hover:bg-black/5 rounded-lg transition-all"
                  title={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} className="text-blue-600" />
                  ) : (
                    <Eye size={18} className="text-gray-400" />
                  )}
                </button>
              </div>
              {fieldErrors.confirmPassword && <p className="text-red-500 text-[10px] font-bold ml-4 mt-1">{fieldErrors.confirmPassword}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold flex justify-center items-center gap-2 hover:bg-blue-700 shadow-lg shadow-blue-500/20 transition-all active:scale-95 mt-4"
              >
                {loading ? (
                  <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Reset Password <ArrowRight size={20} />
                  </>
                )}
              </button>
            </form>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <Link
                to="/login"
                className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold flex justify-center items-center gap-2 hover:bg-blue-700 shadow-lg shadow-blue-500/20 transition-all active:scale-95"
              >
                Go to Login <ArrowRight size={20} />
              </Link>
            </div>
          )}

          <div className="mt-8 pt-8 border-t border-gray-100 text-center">
            {step > 1 && step < 4 ? (
              <button
                onClick={() => setStep(step - 1)}
                className="inline-flex items-center text-sm font-bold text-gray-500 hover:text-blue-600 transition-colors"
              >
                <ArrowLeft size={16} className="mr-2" /> Back
              </button>
            ) : (
              <Link
                to="/login"
                className="inline-flex items-center text-sm font-bold text-gray-500 hover:text-blue-600 transition-colors"
              >
                <ArrowLeft size={16} className="mr-2" /> Back to Login
              </Link>
            )}
          </div>

        </div>

        <p className="text-center mt-8 text-xs text-gray-400 font-medium uppercase tracking-widest">
          TX hub Secure Authentication
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;