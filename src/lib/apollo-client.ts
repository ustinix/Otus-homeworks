import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client/core';
import { gql } from '@apollo/client/core';

const httpLink = new HttpLink({ uri: 'https://api.escuelajs.co/graphql/' });

export const apolloClient = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});

export { gql };
