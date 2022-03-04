import { RichText } from 'prismic-dom';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { useEffect, useState } from 'react';
import { FiCalendar, FiUser, FiClock } from 'react-icons/fi';
import { GetStaticPaths, GetStaticProps } from 'next';

import Header from '../../components/Header';

import { getPrismicClient } from '../../services/prismic';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

export default function Post({ post }: PostProps): JSX.Element {
  /*
  para calcular o tempo estimado de leitura, sugerimos utilizar o método reduce 
  para iterar o array content, o método PrismicDOM.RichText.asText para obter 
  todo o texto do body e utilizar o método split com uma regex para gerar um 
  array de palavras.
  */
  function acountWordsContent(acc: number, { heading, body }): number {
    const headingWords = heading.split(' ').length;
    const bodyWords = body.reduce((accBody: number, bodyElement) => {
      return accBody + bodyElement.text.split(' ').length;
    }, 0);
    return acc + headingWords + bodyWords;
  }
  const timeReading =
    post && (post.data.content.reduce(acountWordsContent, 0) / 150).toFixed(0);
  return (
    <>
      {post.data.content.body ? '' : <>Carregando...</>}
      {post ? (
        <>
          <Header />
          <img
            style={{
              width: '100%',
              height: '25rem',
              objectFit: 'cover',
            }}
            src={post.data.banner.url}
            alt="banner"
          />
          <div className={styles.content}>
            <div>
              <h1>{post.data.title}</h1>
              <div className={commonStyles.infos}>
                <span>
                  <FiCalendar size="1.25rem" />
                  <time>
                    {post?.first_publication_date
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
                <span>
                  <FiClock size="1.25rem" />
                  <span>{timeReading} min</span>
                </span>
              </div>
              <article className={styles.bodyContent}>
                {post.data.content.map(({ heading, body }, index) => {
                  const content = RichText.asHtml(body);
                  return (
                    <span key={`${heading}-${index}`}>
                      <h3 className={styles.heading}>{heading}</h3>
                      <div
                        // className={}
                        dangerouslySetInnerHTML={{ __html: content }}
                      />
                    </span>
                  );
                })}
              </article>
            </div>
          </div>
        </>
      ) : (
        <h1>Carregando...</h1>
      )}
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  //   const prismic = getPrismicClient();
  //   const posts = await prismic.query(TODO);
  return {
    paths: [
      {
        params: {
          slug: 'como-utilizar-hooks',
          // slug: 'maior-numero-de-ataques-ciberneticos-em-2021-ocorreu',
        },
      },
      {
        params: {
          slug: 'criando-um-app-cra-do-zero',
          // slug: 'maior-numero-de-ataques-ciberneticos-em-2021-ocorreu',
        },
      },
    ],
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async ({ params, ...rest }) => {
  const { slug } = params;
  const prismic = getPrismicClient();
  const response = await prismic.getByUID('posts', String(slug), {});
  const post = {
    data: {
      author: response?.data?.author,
      banner: {
        url: response?.data?.banner.url,
      },
      content: [...response?.data.content],
      subtitle: response?.data?.subtitle,
      title: response?.data?.title,
    },
    uid: response?.uid,
    first_publication_date: response?.first_publication_date,
  };

  return { props: { post }, redirect: 30 * 60 };
};
