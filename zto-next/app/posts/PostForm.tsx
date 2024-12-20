import Link from 'next/link';

interface PostFormProps {
	pageTitle: string;
	titleValue: string;
	contentValue: string;
	onChangeTitle: (text: string) => void;
	onChangeContent: (text: string) => void;
	handleSubmit: () => void;
}

const PostForm = ({
	pageTitle,
	titleValue,
	contentValue,
	onChangeTitle,
	onChangeContent,
	handleSubmit,
}: PostFormProps) => {
	return (
		<div className='w-1/2 mx-auto flex flex-col gap-8'>
			<Link href={'/posts'} className='text-blue-600'>
				Powrót do listy postów
			</Link>
			<div className='py-8 px-4 flex flex-col gap-12 shadow-md rounded'>
				<h1 className='text-3xl font-bold text-gray-950'>{pageTitle}</h1>

				<div className='flex flex-col gap-10 '>
					<div className='flex flex-col gap-4'>
						<label htmlFor='title'>Tytuł</label>
						<input
							name='title'
							placeholder='Wprowadź tytuł'
							className='border rounded p-2'
							value={titleValue}
							onChange={(e) => onChangeTitle(e.currentTarget.value)}
						/>
					</div>
					<div className='flex flex-col gap-4'>
						<label htmlFor='content'>Treść</label>
						<textarea
							name='content'
							placeholder='Wprowadź treść posta'
							className='border h-32 rounded p-2'
							value={contentValue}
							onChange={(e) => onChangeContent(e.currentTarget.value)}
						/>
					</div>
					<button
						onClick={handleSubmit}
						className='bg-blue-200 self-end	py-2 px-4 rounded'
					>
						Zapisz
					</button>
				</div>
			</div>
		</div>
	);
};

export default PostForm;
