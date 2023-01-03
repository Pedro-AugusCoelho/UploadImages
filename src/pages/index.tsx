import { Flex, Button, Box } from '@chakra-ui/react';
import { useMemo } from 'react';
import { useInfiniteQuery } from 'react-query';

import { Header } from '../components/Header';
import { CardList } from '../components/CardList';
import { api } from '../services/api';
import { Loading } from '../components/Loading';
import { Error } from '../components/Error';

export default function Home(): JSX.Element {
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type, no-return-await
  const fetchingData = async () => await api.get('/api/images');

  const {
    data,
    isLoading,
    isError,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery(
    'images',
    // TODO AXIOS REQUEST WITH PARAM
    fetchingData,
    // TODO GET AND RETURN NEXT PAGE PARAM
    {
      // eslint-disable-next-line no-return-assign
      getNextPageParam: pages =>
        pages.data.after
          ? (pages.data.pageParam = pages.data.after)
          : (pages.data.pageParam = null),
    }
  );

  const formattedData = useMemo(() => {
    // TODO FORMAT AND FLAT DATA ARRAY
    const flatDataArray = data?.pages
      .map(page => {
        return page.data.data.map(image => {
          return {
            title: image.title,
            description: image.description,
            url: image.url,
            id: image.id,
            ts: image.ts,
          };
        });
      })
      .flat();
    return flatDataArray;
  }, [data]);

  // TODO RENDER LOADING SCREEN
  if (isLoading) {
    return <Loading />;
  }
  // TODO RENDER ERROR SCREEN
  if (isError) {
    return <Loading />;
  }

  return (
    <>
      <Header />

      <Box maxW={1120} px={20} mx="auto" my={20}>
        <CardList cards={formattedData} />
        {hasNextPage && (
          <Button
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            colorScheme="orange"
          >
            {isFetchingNextPage
              ? 'Carregando...'
              : hasNextPage && 'Carregar mais'}
          </Button>
        )}
      </Box>
    </>
  );
}
