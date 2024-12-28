'use client'

import { useEffect, useState } from "react";
import { userAuthenticated } from "./auth";
import { useRouter } from "next/navigation";

export default function LogoutButton(){
        const[canView, setCanView] = useState(false);
        const router = useRouter();

        useEffect(() => {
            const authenticated = userAuthenticated()

            setCanView(authenticated);
        })

        const signout = () => {
            localStorage.removeItem("token");
            router.push("/login")
            window.location.reload();
        }

        return (
            canView ? (
                <button onClick={signout}>Logout</button>
            ): null
        )
}