'use client';

import Image from 'next/image';
import styles from './page.module.css';
import { AllowOnlyAuthenticated } from '@/lib/auth';
import Link from 'next/link';

function HomeComponent() {
	return (
		<div className='h-full w-2/3 mx-auto mt-20 flex flex-col gap-2 items-center'>
			<p className='text-center font-semibold text-gray-700'>
				Witaj na naszej platformie! Dodaj pierwszy post lub przejrzyj, co
				udostępniają inni.
			</p>
			<Link href={'/posts'} className='text-blue-600 font-semibold'>
				Przeglądaj posty
			</Link>
		</div>
	);
}

export default function Home() {
	const GuardedComponent = AllowOnlyAuthenticated(HomeComponent);

	return <GuardedComponent></GuardedComponent>;
}
