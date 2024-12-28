'use client'

import { useRouter } from "next/navigation";
import { FormEventHandler, useState } from "react";
import Link from 'next/link'
import { AllowOnlyNotAuthenticated } from "@/lib/auth";

function LoginComponent(){

    const router = useRouter()

    const [formData, setFormData] = useState<LoginData>({
        email: "",
        password: ""
    });

    const [formErrors, setFormErrors] = useState<LoginErrors> ({
        emailError: "",
        passwordError: "",
        errorMessage: ""
    });

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>)  => {
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
        const result = await fetch('http://localhost:8000/api/auth/signin',{
            method: 'POST',
            body: JSON.stringify(formData),
            headers: headers
        })
        .then(async response => await response.json())
        .then(json => {
            if (json.token){
                localStorage.setItem("token",json.token);
                router.push("/posts")
                window.location.reload();
            }
            else if (json.errors){
                let emailError = "";
                let passwordError = "";
                let errorMessage = "";
                if(json.errors.email && json.errors.email.length > 0){
                    emailError = json.errors.email[0];
                }
                if(json.errors.password && json.errors.password.length > 0){
                    passwordError = json.errors.password[0];
                }
                if(json.message){
                    errorMessage = json.message;
                }
                setFormErrors({
                    emailError: emailError,
                    passwordError: passwordError,
                    errorMessage: errorMessage
                })
            }
            else if (json.message){
                console.log(json)
                setFormErrors({
                    emailError: "",
                    passwordError: "",
                    errorMessage: json.message
                })
            }
        })
    }

    return (
        <div>
            <form action="#" onSubmit={submitForm}>
                <div>
                {
                    formErrors.errorMessage ? (
                        <p>
                            {
                                formErrors.errorMessage
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
                <button type="submit">Log In</button>
                <Link href="/register">Register</Link>
            </form>
        </div>
    )
}

export default function Login(){
    const GuardedComponent = AllowOnlyNotAuthenticated(LoginComponent)

    return <GuardedComponent></GuardedComponent>

} 

interface LoginData {
    email: string,
    password: string
}

interface LoginErrors {
    emailError: string,
    passwordError: string,
    errorMessage: string
}