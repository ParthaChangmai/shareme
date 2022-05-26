import React, { useState, useEffect } from 'react';
import { AiOutlineLogout } from 'react-icons/ai';
import { useParams, useNavigate } from 'react-router-dom';
import { GoogleLogout } from 'react-google-login';

import {
	userCreatedPinsQuery,
	userSavedPinsQuery,
	userQuery,
} from '../utils/data';
import { client } from '../client';
import MasonryLayout from './MasonryLayout';
import Spinner from './Spinner';

const activeBtnStyles =
	'bg-red-500 text-white font-bold p-2 rounded-full w-20 outline-none';
const notActiveBtnStyles =
	'bg-primary mr-4 text-black font-bold p-2 rounded-full w-20 outline-none';

const UserProfile = () => {
	const [user, setUser] = useState(null);
	const [pins, setPins] = useState(null);
	const [text, setText] = useState('Created');
	const [activeBtn, setActiveBtn] = useState('Created');
	const navigate = useNavigate();
	const { userId } = useParams();

	const User =
		localStorage.getItem('user') !== 'undefined'
			? JSON.parse(localStorage.getItem('user'))
			: localStorage.clear();

	useEffect(() => {
		const query = userQuery(userId);
		client.fetch(query).then((data) => {
			setUser(data[0]);
		});
	}, [userId]);

	useEffect(() => {
		if (text === 'Created') {
			const CreatedPinsQuery = userCreatedPinsQuery(userId);

			client.fetch(CreatedPinsQuery).then((data) => {
				setPins(data);
			});
		} else {
			const savedPinsQuery = userSavedPinsQuery(userId);

			client.fetch(savedPinsQuery).then((data) => {
				setPins(data);
			});
		}
	}, [text, userId]);

	const logout = () => {
		localStorage.clear();

		navigate('/login');
	};

	if (!user) return <Spinner message="loading profile" />;

	return (
		<div className="relative pb-2 h-full justify-center items-center">
			<div className="flex flex-col pb-5">
				<div className="relative flex flex-col mb-7">
					<div className="flex flex-col justify-center items-center object-cover">
						<img
							className="w-full h-200 lg:h-300 shadow-lg object-cover"
							alt="banner"
							src="https://source.unsplash.com/1600x900/?nature,photography,technology"
						/>
						<img
							className="rounded-full w-20 h-20 -mt-10 shadow-xl object-cover "
							src={user.image}
							alt="user-pic"
						/>
						<h1 className="font-bold text-3xl text-center mt-3">
							{user.userName}
						</h1>
						<div className="absolute top-0 z-1 right-0 p-2">
							{userId === User.googleId && (
								<GoogleLogout
									clientId={process.env.REACT_APP_GOOGLE_API}
									render={(renderProps) => (
										<button
											type="button"
											onClick={renderProps.onClick}
											disabled={renderProps.disabled}
											className="bg-white rounded-full cursor-pointer p-2 outline-none shadow-md"
										>
											<AiOutlineLogout color="red" fontSize={21} />
										</button>
									)}
									onLogoutSuccess={logout}
									cookiePolicy="single_host_origin"
								/>
							)}
						</div>
					</div>

					<div className="text-center mb-7">
						<button
							type="button"
							onClick={(e) => {
								setText(e.target.textContent);
								setActiveBtn('Created');
							}}
							className={`${
								activeBtn === 'Created' ? activeBtnStyles : notActiveBtnStyles
							}`}
						>
							Created
						</button>
						<button
							type="button"
							onClick={(e) => {
								setText(e.target.textContent);
								setActiveBtn('saved');
							}}
							className={`${
								activeBtn === 'saved' ? activeBtnStyles : notActiveBtnStyles
							}`}
						>
							Saved
						</button>
					</div>

					{pins?.length ? (
						<div className="px-2">
							<MasonryLayout pins={pins} />
						</div>
					) : (
						<div className="flex justify-center font-bold items-center w-full mt-2 text-xl">
							No Pins Found
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default UserProfile;
