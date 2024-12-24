"use client";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/16/solid";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Button, Image, Input } from "@nextui-org/react";
import { useAuth } from "@/app/_context/AuthContext";

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const {login} = useAuth();

  const toggleVisibility = () => setShowPassword(!showPassword);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      setEmailError("Email is required");
      return false;
    }else if(!emailRegex.test(email))
    {
      setEmailError("Invalid email format");
      return false;
    }

    if (!password) {
      setPasswordError("Password is required");
      return false;
    }

    setLoading(true);

    try {
      const res = await login(email, password);

      res ? toast("👋 Welcome back " + email) : toast.error("Invalid credentials!");
    } catch (error) {
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full flex flex-col items-center p-6 space-y-4 h-screen">
      <Image
        src="/assets/ZIC-logo.svg"
        alt="Logo"
        className="my-12 rounded-none w-[64px]"
      />
      <h1 className="text-dark-bg dark:text-light-bg font-semibold text-[28px] md:text-[32px] self-start mb-4">
        Log in
      </h1>

      <Input
        isClearable
        size="lg"
        type="email"
        label="Email"
        variant="bordered"
        isInvalid={emailError.length}
        errorMessage={emailError}
        color={emailError.length && "danger"}
        placeholder="Enter your email"
        className="w-full"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          setEmailError("");
        }}
        onClear={() => setEmail("")}
        required
      />

      <Input
        label="Password"
        placeholder="Enter your password"
        size="lg"
        variant="bordered"
        isInvalid={passwordError.length}
        errorMessage={passwordError}
        color={passwordError.length && "danger"}
        endContent={
          <button
            className="focus:outline-none "
            type="button"
            onClick={toggleVisibility}
            aria-label="toggle password visibility"
          >
            {showPassword ? (
              <EyeSlashIcon className=" w-6 h-6 text-gray-500 pointer-events-none" />
            ) : (
              <EyeIcon className=" w-6 h-6 text-gray-500 pointer-events-none" />
            )}
          </button>
        }
        type={showPassword ? "text" : "password"}
        className="w-full"
        value={password}
        onChange={(e) => {
          setPassword(e.target.value);
          setPasswordError("");
        }}
      />

      <Button
        type="submit"
        color="primary"
        size="lg"
        onClick={handleLogin}
        isLoading={loading}
        className="w-full flex-shrink-0"
      >
        Log In
      </Button>

      <button className="hover:underline text-sm text-dark-bg dark:text-light-bg">
        Forgot password?
      </button>

      <div className="w-full">
        <Button
          size="lg"
          color="primary"
          variant="bordered"
          onClick={() => {router.push('/register');}}
          className="mt-14 w-full"
        >
          Create new account
        </Button>
      </div>
    </div>
  );
};

export default LoginForm;
