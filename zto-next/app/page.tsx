'use client'

import Image from 'next/image';
import styles from './page.module.css';
import { AllowOnlyAuthenticated} from '@/lib/auth';

function HomeComponent() {
	return <div className='text-lg'>Facebook</div>;
}

export default function Home(){
    const GuardedComponent = AllowOnlyAuthenticated(HomeComponent)

    return <GuardedComponent></GuardedComponent>

} 