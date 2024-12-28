import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function userAuthenticated() : boolean{
    const token = localStorage.getItem('token')

    return !!token;
}

export function AllowOnlyNotAuthenticated(WrappedComponent: any){
    return (props: any) => {
        
        const [canView, setCanView] = useState(false);
        const router = useRouter();

        useEffect(() => {
            const authenticated = userAuthenticated()

            if(authenticated){
                router.push('/')
                return;
            }

            setCanView(true);
        })

        return canView ? <WrappedComponent {...props} /> : null;
    }
}

export function AllowOnlyAuthenticated(WrappedComponent: any){
    return (props: any) => {
        
        const [canView, setCanView] = useState(false);
        const router = useRouter();

        useEffect(() => {
            const authenticated = userAuthenticated()
            if(authenticated){
                setCanView(true);
            }
            else {
                router.push('/login')
            }
        })

        return canView ? <WrappedComponent {...props} /> : null;
    }
}