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
    <div>
      <form action="#" onSubmit={submitForm}>
        <div>
          {formErrors.errorMessage ? <p>{formErrors.errorMessage}</p> : null}
        </div>
        <div>
          <label>Email</label>
          <input
            type="text"
            name="email"
            onChange={handleInput}
            value={formData.email}
          />
          {formErrors.emailError ? <p>{formErrors.emailError}</p> : null}
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            name="password"
            onChange={handleInput}
            value={formData.password}
          />
          {formErrors.passwordError ? <p>{formErrors.passwordError}</p> : null}
        </div>
        <button type="submit">Log In</button>
        <Link href="/register">Register</Link>
      </form>
    </div>
  );
}

export default function Login() {
  const GuardedComponent = AllowOnlyNotAuthenticated(LoginComponent);

  return <GuardedComponent></GuardedComponent>;
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
