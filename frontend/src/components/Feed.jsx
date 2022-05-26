import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { client } from '../client';
import { feedQuery, searchQuery } from '../utils/data';

import MasonryLayout from './MasonryLayout';
import Spinner from './Spinner';

const Feed = () => {
	const [laoding, setLaoding] = useState(false);
	const [pins, setPins] = useState(null);

	const { categoryId } = useParams();

	useEffect(() => {
		setLaoding(true);
		if (categoryId) {
			const query = searchQuery(categoryId);
			client.fetch(query).then((data) => {
				setPins(data);
				setLaoding(false);
			});
		} else {
			client.fetch(feedQuery).then((data) => {
				setPins(data);
				setLaoding(false);
			});
		}
	}, [categoryId]);

	if (laoding) return <Spinner message=" Updating your feed !! " />;

	if (!pins?.length) return <h2>No Pins...</h2>;

	return <div>{pins && <MasonryLayout pins={pins} />}</div>;
};

export default Feed;
