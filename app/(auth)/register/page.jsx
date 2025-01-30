"use client";

import { EyeIcon, EyeSlashIcon } from "@heroicons/react/16/solid";
import { Button, Image, Input } from "@heroui/react";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useAuth } from "@/app/_context/AuthContext";

const RegisterForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { register } = useAuth();

  const toggleVisibility = () => setShowPassword(!showPassword);

  const [fullname, setFullname] = useState("");
  const [fullnameError, setFullnameError] = useState("");

  const [username, setUsername] = useState("");
  const [usernameError, setUsernameError] = useState("");

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!username) {
      setUsernameError("Username is required");
      return;
    }

    if (!fullname) {
      setFullnameError("Full Name is required");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      setEmailError("Email is required");
      return;
    } else if (!emailRegex.test(email)) {
      setEmailError("Invalid email format");
      return;
    }

    if (!password) {
      setPasswordError("Password is required");
      return;
    }

    setLoading(true);

    try {
      await register(fullname, username, email, password);
      toast("👋 Welcome " + username);
    } catch (error) {
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="max-w-md w-full flex flex-col items-center p-6 space-y-4 min-h-[100vh]">
      <Image
        src="/assets/ZIC-logo.svg"
        alt="Logo"
        className="my-12 rounded-none w-[64px]"
      />
      <h1 className="text-dark-bg dark:text-light-bg font-semibold text-[28px] md:text-[32px] self-start mb-4">
        Create account
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
        //placeholder="Enter your email"
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
        //placeholder="Create a strong password"
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

      <Input
        isClearable
        size="lg"
        type="text"
        label="Full Name"
        variant="bordered"
        isInvalid={fullnameError.length}
        errorMessage={fullnameError}
        color={fullnameError.length && "danger"}
        className="w-full"
        value={fullname}
        onChange={(e) => {
          setFullname(e.target.value);
          setFullnameError("");
        }}
        onClear={() => setFullname("")}
        required
      />

      <Input
        isClearable
        size="lg"
        type="text"
        label="Username"
        variant="bordered"
        isInvalid={usernameError.length}
        errorMessage={usernameError}
        color={usernameError.length && "danger"}
        className="w-full"
        value={username}
        onChange={(e) => {
          setUsername(e.target.value);
          setUsernameError("");
        }}
        onClear={() => setUsername("")}
        required
      />

      <Button
        type="submit"
        color="primary"
        size="lg"
        onPress={handleRegister}
        isLoading={loading}
        className="w-full flex-shrink-0"
      >
        Sign In
      </Button>

      <div className="text-sm dark:text-light-bg text-dark-bg">
        Already have an account?
        <button
          onClick={() => router.push("/login")}
          className="ml-2 text-primary hover:text-dark-bg dark:hover:text-light-bg font-semibold"
        >
          Log in
        </button>
      </div>
    </div>
  );
};

export default RegisterForm;
