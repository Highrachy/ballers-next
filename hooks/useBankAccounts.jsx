import { useGetQuery } from './useQuery';
import { API_ENDPOINT } from 'utils/URL';

export const useBankAccounts = () => {
  const [bankQuery] = useGetQuery({
    axiosOptions: {
      params: { limit: 100 },
    },
    childrenKey: 'bankAccounts',
    key: 'bankAccounts',
    endpoint: API_ENDPOINT.getAllBankAccounts(),
  });

  return bankQuery.isLoading ? [] : bankQuery.data.result;
};
