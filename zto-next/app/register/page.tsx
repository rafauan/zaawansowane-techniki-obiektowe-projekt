'use client';

import { FormEventHandler, useState } from "react";

export default function Register(){

    const [formData, setFormData] = useState<RegisterData>({
        firstName: "",
        lastName: "",
        email: "",
        password: ""
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
        console.log(formData);
        const result = await fetch('http://localhost:8000/api/auth/signup',{
            method: 'POST',
            body: JSON.stringify(formData),
            headers: headers
        })
        .then(async response => await response.json() as RegisterResponse)
        .then(json => {
            localStorage.setItem("token",json.token);
        })
    }


    return (
        <div>
             <form action="#" onSubmit={submitForm}>
                <div>
                    <label>FirstName</label>
                    <input type="text" name="firstName" onChange={handleInput} value={formData.firstName} />
                </div>
                <div>
                    <label>LastName</label>
                    <input type="text" name="lastName" onChange={handleInput} value={formData.lastName} />
                </div>
                <div>
                    <label>Email</label>
                    <input type="text" name="email" onChange={handleInput} value={formData.email} />
                </div>
                <div>
                    <label>Password</label>
                    <input type="password" name="password" onChange={handleInput} value={formData.password} />
                </div>
                <button type="submit">Register</button>
            </form>
        </div>
    )
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