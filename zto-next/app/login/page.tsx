"use client";

import { useRouter } from "next/navigation";
import { FormEventHandler, useState } from "react";
import Link from "next/link";
import { AllowOnlyNotAuthenticated } from "@/lib/auth";
import { API } from "@/api/API";
import { useAppStore } from "@/store/store";

function LoginComponent() {
  const router = useRouter();
  const setToken = useAppStore((state) => state.setToken);

  const [formData, setFormData] = useState<LoginData>({
    email: "",
    password: "",
  });

  const [formErrors, setFormErrors] = useState<LoginErrors>({
    emailError: "",
    passwordError: "",
    errorMessage: "",
  });

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fieldName = e.target.name;
    const fieldValue = e.target.value;

    setFormData((prevState) => ({
      ...prevState,
      [fieldName]: fieldValue,
    }));
  };

  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };

  const submitForm: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    try {
      const res = await API.POST.signIn(formData);
      if (res && res.token) {
        setToken(res.token);
        router.push("/posts");
        window.location.reload();
        return;
      }
    } catch (err: any) {
      console.log(err);
      if (err.errors) {
        let emailError = "";
        let passwordError = "";
        let errorMessage = "";
        if (err.errors.email && err.errors.email.length > 0) {
          emailError = err.errors.email[0];
        }
        if (err.errors.password && err.errors.password.length > 0) {
          passwordError = err.errors.password[0];
        }
        if (err.message) {
          errorMessage = err.message;
        }
        setFormErrors({
          emailError: emailError,
          passwordError: passwordError,
          errorMessage: errorMessage,
        });
      } else if (err.message) {
        console.log(err);
        setFormErrors({
          emailError: "",
          passwordError: "",
          errorMessage: err.message,
        });
      }
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="bg-white p-6 relative rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6">Login</h2>
        <form action="#" onSubmit={submitForm}>
          <div>
            {formErrors.errorMessage ? (
              <p className="text-red-500 text-sm">{formErrors.errorMessage}</p>
            ) : null}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input
              type="text"
              name="email"
              onChange={handleInput}
              value={formData.email}
              className="w-full px-3 py-2 border rounded"
            />
            {formErrors.emailError ? (
              <p className="text-red-500 text-sm">{formErrors.emailError}</p>
            ) : null}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Hasło</label>
            <input
              type="password"
              name="password"
              onChange={handleInput}
              value={formData.password}
              className="w-full px-3 py-2 border rounded"
            />
            {formErrors.passwordError ? (
              <p className="text-red-500 text-sm">{formErrors.passwordError}</p>
            ) : null}
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          >
            Zaloguj się
          </button>
          <div className="mt-4">
            <Link href="/register" className="text-blue-500 hover:underline">
              Rejestracja
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Login() {
  const GuardedComponent = AllowOnlyNotAuthenticated(LoginComponent);

  return <GuardedComponent />;
}

interface LoginData {
  email: string;
  password: string;
}

interface LoginErrors {
  emailError: string;
  passwordError: string;
  errorMessage: string;
}
