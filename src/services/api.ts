import { apiRoot } from './commercetoolsClient';

export const fetchProducts = async () => {
  const response = await apiRoot
    .products()
    .get({ queryArgs: { limit: 20 } })
    .execute();
  return response.body.results;
};
