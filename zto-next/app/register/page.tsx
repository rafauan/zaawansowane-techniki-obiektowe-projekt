'use client';

import { AllowOnlyNotAuthenticated } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { FormEventHandler, useState } from "react";

 function RegisterComponent(){

    const router = useRouter()

    const [formData, setFormData] = useState<RegisterData>({
        firstName: "",
        lastName: "",
        email: "",
        password: ""
      });

      const [formErrors, setFormErrors] = useState<RegisterError>({
        firstNameError: "",
        lastNameError: "",
        emailError: "",
        passwordError: "",
        errorMessage: ""
      });

      const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const fieldName = e.target.name;
        const fieldValue = e.target.value;
    
        setFormData((prevState) => ({
          ...prevState,
          [fieldName]: fieldValue
        }));
      };

      const headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json',
    };

      const submitForm: FormEventHandler<HTMLFormElement> = async (e) =>{
        e.preventDefault()
        const result = await fetch('http://localhost:8000/api/auth/signup',{
            method: 'POST',
            body: JSON.stringify(formData),
            headers: headers
        })
        .then(async response => await response.json())
        .then(json => {
            if (json.token){
                localStorage.setItem("token",json.token);
                router.push("/posts")
            }
            else if (json.errors){
                let firstNameError = "";
                let lastNameError = "";
                let emailError = "";
                let passwordError = "";
                let errorMessage = "";
                if(json.errors.email && json.errors.email.length > 0){
                    emailError = json.errors.email[0];
                }
                if(json.errors.firstName && json.errors.firstName.length > 0){
                    firstNameError = json.errors.firstName[0];
                }
                if(json.errors.lastName && json.errors.lastName.length > 0){
                    lastNameError = json.errors.lastName[0];
                }
                if(json.errors.password && json.errors.password.length > 0){
                    passwordError = json.errors.password[0];
                }
                if(json.message){
                    errorMessage = json.message[0];
                }
                setFormErrors({
                    firstNameError: firstNameError,
                    lastNameError: lastNameError,
                    emailError: emailError,
                    passwordError: passwordError,
                    errorMessage: errorMessage
                })
            }
        })
    }


    return (
        <div>
             <form action="#" onSubmit={submitForm}>
                <div>
                    <label>FirstName</label>
                    <input type="text" name="firstName" onChange={handleInput} value={formData.firstName} />
                    {
                        formErrors.firstNameError ? (
                            <p>
                                {
                                    formErrors.firstNameError
                                }
                            </p>
                        ) : null
                    }
                </div>
                <div>
                    <label>LastName</label>
                    <input type="text" name="lastName" onChange={handleInput} value={formData.lastName} />
                    {
                        formErrors.lastNameError ? (
                            <p>
                                {
                                    formErrors.lastNameError
                                }
                            </p>
                        ) : null
                    }
                </div>
                <div>
                    <label>Email</label>
                    <input type="text" name="email" onChange={handleInput} value={formData.email} />
                    {
                        formErrors.emailError ? (
                            <p>
                                {
                                    formErrors.emailError
                                }
                            </p>
                        ) : null
                    }
                </div>
                <div>
                    <label>Password</label>
                    <input type="password" name="password" onChange={handleInput} value={formData.password} />
                    {
                        formErrors.passwordError ? (
                            <p>
                                {
                                    formErrors.passwordError
                                }
                            </p>
                        ) : null
                    }
                </div>
                <button type="submit">Register</button>
            </form>
        </div>
    )
}

export default function Register(){
    const GuardedComponent = AllowOnlyNotAuthenticated(RegisterComponent)

    return <GuardedComponent></GuardedComponent>

} 

interface RegisterData {
    firstName: string,
    lastName: string,
    email: string,
    password: string
}

interface RegisterResponse {
    message: string,
    token: string,
    user: {
        firstName: string,
        lastName: string,
        email: string,
    }
}

interface RegisterError {
    firstNameError: string,
    lastNameError: string,
    emailError: string,
    passwordError: string,
    errorMessage: string
}