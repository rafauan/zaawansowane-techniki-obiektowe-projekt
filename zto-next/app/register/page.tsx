"use client";

import { API } from "@/api/API";
import { AllowOnlyNotAuthenticated } from "@/lib/auth";
import { useAppStore } from "@/store/store";
import { useRouter } from "next/navigation";
import { FormEventHandler, useState } from "react";

function RegisterComponent() {
  const router = useRouter();
  const setToken = useAppStore((state) => state.setToken);

  const [formData, setFormData] = useState<RegisterData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const [formErrors, setFormErrors] = useState<RegisterError>({
    firstNameError: "",
    lastNameError: "",
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

  const submitForm: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    try {
      const res = await API.POST.signUp(formData);
      if (res && res.token) {
        setToken(res.token);
        router.push("/posts");
        window.location.reload();
        return;
      }
    } catch (err: any) {
      if (err.errors) {
        let firstNameError = "";
        let lastNameError = "";
        let emailError = "";
        let passwordError = "";
        let errorMessage = "";
        if (err.errors.email && err.errors.email.length > 0) {
          emailError = err.errors.email[0];
        }
        if (err.errors.firstName && err.errors.firstName.length > 0) {
          firstNameError = err.errors.firstName[0];
        }
        if (err.errors.lastName && err.errors.lastName.length > 0) {
          lastNameError = err.errors.lastName[0];
        }
        if (err.errors.password && err.errors.password.length > 0) {
          passwordError = err.errors.password[0];
        }
        if (err.message) {
          errorMessage = err.message[0];
        }
        setFormErrors({
          firstNameError: firstNameError,
          lastNameError: lastNameError,
          emailError: emailError,
          passwordError: passwordError,
          errorMessage: errorMessage,
        });
      }
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6">Rejestracja</h2>
        <form action="#" onSubmit={submitForm}>
          <div className="mb-4">
            <label className="block text-gray-700">Imię</label>
            <input
              type="text"
              name="firstName"
              onChange={handleInput}
              value={formData.firstName}
              className="w-full px-3 py-2 border rounded"
            />
            {formErrors.firstNameError ? (
              <p className="text-red-500 text-sm">{formErrors.firstNameError}</p>
            ) : null}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Nazwisko</label>
            <input
              type="text"
              name="lastName"
              onChange={handleInput}
              value={formData.lastName}
              className="w-full px-3 py-2 border rounded"
            />
            {formErrors.lastNameError ? (
              <p className="text-red-500 text-sm">{formErrors.lastNameError}</p>
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
            Rejestracja
          </button>
        </form>
      </div>
    </div>
  );
}

export default function Register() {
  const GuardedComponent = AllowOnlyNotAuthenticated(RegisterComponent);

  return <GuardedComponent />;
}

interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

interface RegisterResponse {
  message: string;
  token: string;
  user: {
    firstName: string;
    lastName: string;
    email: string;
  };
}

interface RegisterError {
  firstNameError: string;
  lastNameError: string;
  emailError: string;
  passwordError: string;
  errorMessage: string;
}
