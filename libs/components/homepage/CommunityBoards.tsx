import React, { useState } from 'react';
import Link from 'next/link';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Stack, Typography } from '@mui/material';
import CommunityCard from './CommunityCard';
import { BoardArticle } from '../../types/board-article/board-article';
import { GET_BOARD_ARTICLES, GET_PROPERTIES } from '../../../apollo/user/query';
import { useQuery } from '@apollo/client';
import { T } from '../../types/common';
import { BoardArticleCategory } from '../../enums/board-article.enum';

const CommunityBoards = () => {
	const device = useDeviceDetect();
	const [searchCommunity, setSearchCommunity] = useState({
		page: 1,
		sort: 'articleViews',
		direction: 'DESC',
	});
	const [newsArticles, setNewsArticles] = useState<BoardArticle[]>([]);
	const [freeArticles, setFreeArticles] = useState<BoardArticle[]>([]);

	/** APOLLO REQUESTS **/

	const 
			{
				loading: getPropertiesLoading, 
				data: getPropertiesData, 
				error: getPropertiesError, 
				refetch: getPropertiesRefetch,
		
			} 
			= useQuery(GET_BOARD_ARTICLES, {
				fetchPolicy: 'cache-and-network',
				variables: {
					input: {...searchCommunity,limit:6, search: {articleCategory: BoardArticleCategory.NEWS}},
				},
				notifyOnNetworkStatusChange: true,
				onCompleted: (data: T ) => {
					setNewsArticles(data?.getBoardArticles?.list);
				},
			});

	const 
			{
				loading: getFreeArticlesLoading, 
				data: getFreeArticlesData, 
				error: getFreeArticlesError, 
				refetch: getFreeArticlesRefetch,
		
			} 
			= useQuery(GET_BOARD_ARTICLES, {
				fetchPolicy: 'cache-and-network',
				variables: {
					input: {...searchCommunity,limit:6, search: {articleCategory: BoardArticleCategory.FREE}},
				},
				notifyOnNetworkStatusChange: true,
				onCompleted: (data: T ) => {
					setFreeArticles(data?.getBoardArticles?.list);
				},
			});

			
	if (device === 'mobile') {
		return <div>COMMUNITY BOARDS (MOBILE)</div>;
	} else {
		return (
			<Stack className={'community-board'}>
				<Stack className={'container'}>
					<Stack>
						<Typography variant={'h1'}>COMMUNITY BOARD HIGHLIGHTS</Typography>
					</Stack>
					<Stack className="community-main">
						<Stack className={'community-left'}>
							<Stack className={'content-top'}>
								<Link href={'/community?articleCategory=NEWS'}>
									<span>News</span>
								</Link>
								<img src="/img/icons/arrowBig.svg" alt="" />
							</Stack>
							<Stack className={'card-wrap'}>
								{newsArticles.map((article, index) => {
									return <CommunityCard vertical={true} article={article} index={index} key={article?._id} />;
								})}
							</Stack>
						</Stack>
						<Stack className={'community-right'}>
							<Stack className={'content-top'}>
								<Link href={'/community?articleCategory=FREE'}>
									<span>Free</span>
								</Link>
								<img src="/img/icons/arrowBig.svg" alt="" />
							</Stack>
							<Stack className={'card-wrap vertical'}>
								{freeArticles.map((article, index) => {
									return <CommunityCard vertical={false} article={article} index={index} key={article?._id} />;
								})}
							</Stack>
						</Stack>
					</Stack>
				</Stack>
			</Stack>
		);
	}
};

export default CommunityBoards;
function setPopularProperties(list: any) {
	throw new Error('Function not implemented.');
}

