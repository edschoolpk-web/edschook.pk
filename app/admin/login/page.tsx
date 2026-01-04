"use client";
import React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { signIn } from "next-auth/react";

import { toast } from "react-hot-toast";

export default function AdminLogin() {
  const router = useRouter();
  const [isPending, setIsPending] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        toast.error("Invalid credentials.");
        setIsPending(false);
      } else if (result?.ok) {
        toast.success("Welcome back!");
        router.push("/admin");
        router.refresh();
      } else {
        toast.error("Something went wrong.");
        setIsPending(false);
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("An unexpected error occurred.");
      setIsPending(false);
    }
  };

  return (
    <div className="login-container">
      <motion.div
        className="login-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="login-header">
          <div className="logo-container">
            <Image
              src="/webImages/logo.png"
              alt="EdSchool Logo"
              width={160}
              height={160}
              className="login-logo"
            />
          </div>
          <h1>Welcome Back</h1>
          <p>Please sign in to access the dashboard.</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">


          <div className="form-group">
            <label>Email Address</label>
            <div className="input-wrapper">
              <i className="fas fa-envelope input-icon"></i>
              <input
                name="email"
                type="email"
                placeholder="admin@edschool.pk"
                required
                className="form-input"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Password</label>
            <div className="input-wrapper">
              <i className="fas fa-lock input-icon"></i>
              <input
                name="password"
                type="password"
                placeholder="••••••••"
                required
                className="form-input"
              />
            </div>
          </div>

          <button type="submit" className="login-btn" disabled={isPending}>
            {isPending ? <span className="loader"></span> : "Sign In"}
          </button>
        </form>

        <div className="footer-links">
          <a href="/">Back to Website</a>
        </div>
      </motion.div>

      <style jsx>{`
        .login-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #F4F7FE;
          font-family: 'Inter', sans-serif;
          padding: 20px;
        }

        .login-card {
          background: white;
          padding: 50px;
          border-radius: 30px;
          width: 100%;
          max-width: 450px;
          box-shadow: 0 4px 50px rgba(0, 0, 0, 0.04);
        }

        .login-header { text-align: center; margin-bottom: 40px; }
        
        .logo-container {
            margin-bottom: 30px;
            display: flex; justify-content: center;
        }
        
        .login-logo {
            width: auto; height: 60px; object-fit: contain;
        }

        .login-header h1 { color: #2B3674; font-size: 28px; margin: 0 0 10px; font-weight: 700; }
        .login-header p { color: #A3AED0; font-size: 15px; margin: 0; }

        .form-group { margin-bottom: 24px; }

        .form-group label {
            display: block; margin-bottom: 10px;
            color: #2B3674; font-size: 14px; font-weight: 600;
        }

        .input-wrapper { position: relative; }

        .input-icon {
            position: absolute; left: 18px; top: 50%; transform: translateY(-50%);
            color: #A3AED0; font-size: 16px;
        }

        .form-input {
            width: 100%;
            padding: 16px 20px 16px 50px;
            border: 1px solid #E0E5F2;
            border-radius: 16px;
            color: #1B2559;
            font-size: 15px;
            background: white;
            transition: all 0.2s;
        }

        .form-input:focus {
            outline: none;
            border-color: #4318FF;
            box-shadow: 0 0 0 4px rgba(67, 24, 255, 0.05);
        }

        .login-btn {
          width: 100%;
          padding: 18px;
          background: linear-gradient(90deg, #4318FF 0%, #868CFF 100%);
          color: white;
          border: none;
          border-radius: 16px;
          font-weight: 600;
          font-size: 16px;
          cursor: pointer;
          transition: all 0.2s;
          margin-top: 10px;
        }
        .login-btn:hover { box-shadow: 0 10px 25px rgba(67, 24, 255, 0.3); transform: translateY(-2px); }
        .login-btn:disabled { opacity: 0.7; cursor: not-allowed; transform: none; }

        .loader {
            width: 20px; height: 20px; border: 2px solid white; border-bottom-color: transparent;
            border-radius: 50%; display: inline-block; animation: rot 1s linear infinite;
        }
        @keyframes rot { to { transform: rotate(360deg); } }

        .error-message {
            background: #FFE5E5; color: #E31A1A; padding: 14px;
            border-radius: 12px; margin-bottom: 24px; font-size: 14px;
            display: flex; align-items: center; gap: 10px;
        }
        
        .footer-links { text-align: center; margin-top: 30px; }
        .footer-links a { color: #A3AED0; font-size: 14px; text-decoration: none; transition: color 0.2s; }
        .footer-links a:hover { color: #4318FF; }
      `}</style>
    </div>
  );
}
