import Link from 'next/link';
import { format } from 'date-fns';
import { GetStaticProps } from 'next';
import Prismic from '@prismicio/client';
import ptBR from 'date-fns/locale/pt-BR';
import { useEffect, useState } from 'react';
import { FiCalendar, FiUser } from 'react-icons/fi';

import Header from '../components/Header';
import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

const getMorePosts = async ({
  nextPage,
  setNextPage,
  setPosts,
}): Promise<void> => {
  if (!nextPage) {
    return;
  }
  const myHeaders = new Headers();
  const responseNewPosts = await fetch(nextPage, {
    method: 'GET',
    headers: myHeaders,
    mode: 'cors',
    cache: 'default',
  }).then(promisse => {
    if (promisse.ok) {
      return promisse.json();
    }
    return { results: {} };
  });
  const newPosts = responseNewPosts.results.map((post: any) => {
    return {
      uid: post.uid,
      first_publication_date: post.first_publication_date,
      data: {
        title: post.data.title,
        subtitle: post.data.subtitle,
        author: post.data.author,
      },
    };
  });
  setNextPage(responseNewPosts.next_page);
  setPosts(newPosts);
};

export default function Home(postsPagination: PostPagination): JSX.Element {
  const [posts, setPosts] = useState<PostPagination>({
    ...postsPagination,
    results: postsPagination?.results?.map(post => ({
      ...post,
      first_publication_date: format(
        new Date(post.first_publication_date),
        'dd MMM yyyy',
        {
          locale: ptBR,
        }
      ),
    })),
  });

  async function loadMorePosts(): Promise<void> {
    const response = await fetch(`${posts.next_page}`).then(data =>
      data.json()
    );

    const postsResponseResults = response.results.map(post => ({
      ...post,
      first_publication_date: format(
        new Date(post.first_publication_date),
        'dd MMM yyyy',
        {
          locale: ptBR,
        }
      ),
    }));

    const newPosts = {
      ...posts,
      next_page: response.next_page,
      results: [...posts.results, ...postsResponseResults],
    };

    setPosts(newPosts);
  }
  return (
    <div className={styles.container}>
      <Header />
      <div className={styles.content}>
        {posts.results?.map(post => (
          <Link href={`/post/${post.uid}`} key={post.uid}>
            <a>
              <h2>{post.data?.title}</h2>
              <p>{post?.data.subtitle}</p>
              <div className={commonStyles.infos}>
                <span>
                  <FiCalendar size="1.25rem" />
                  <time>
                    {post.first_publication_date
                      ? format(
                          new Date(post.first_publication_date),
                          'dd MMM yyyy',
                          {
                            locale: ptBR,
                          }
                        )
                      : ''}
                  </time>
                </span>
                <span>
                  <FiUser size="1.25rem" />
                  <span>{post.data.author}</span>
                </span>
              </div>
            </a>
          </Link>
        ))}
        {posts?.next_page ? (
          <div
            tabIndex={0}
            role="button"
            className={styles.loadPosts}
            onClick={() => loadMorePosts()}
            onKeyPress={() => loadMorePosts()}
          >
            Carregar mais posts
          </div>
        ) : (
          <span />
        )}
      </div>
    </div>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();
  const postsResponse = await prismic.query(
    [Prismic.predicates.at('document.type', 'posts')],
    {
      fetch: ['posts.title', 'posts.subtitle', 'posts.author'],
      pageSize: 1,
    }
  );
  const { next_page } = postsResponse;
  const posts = postsResponse.results.map((post: any) => {
    return {
      uid: post.uid,
      first_publication_date: post.first_publication_date,
      data: {
        title: post.data.title,
        subtitle: post.data.subtitle,
        author: post.data.author,
      },
    };
  });
  return {
    props: { next_page, results: posts },
  };
};
