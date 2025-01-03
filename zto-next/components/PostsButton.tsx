"use client"

import { useIsAuthenticated } from "@/hooks/useIsAuhtenticated";
import Link from "next/link";

export default function PostsButtonComponent(){
     const isAuthenticated = useIsAuthenticated();
     if (!isAuthenticated){
        return null;
     }
     return (
        <Link href={'/posts'}>
            <button className='h-10 px-3 bg-gray-100 text-gray-700 font-semibold rounded'>
                Posts
            </button>
        </Link>
     )
}