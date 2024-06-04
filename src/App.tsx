import React, {useCallback, useState} from 'react';
import './App.css';
import {LocalRepo, LocalUser, extractLocalRepo, extractLocalUser} from './utils';

const BASE_URL_USER = 'https://api.github.com/users/';
const BASE_URL_REPO = 'https://api.github.com/repos/';

interface SearchProps {
  onSearch: (query: string) => void;
  searchType: 'repo' | 'user';
  setSearchType: React.Dispatch<React.SetStateAction<'repo' | 'user'>>;
}

const Search = ({onSearch, searchType, setSearchType}: SearchProps) => {
  const [query, setQuery] = useState('');

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form onSubmit={handleSearch}>
      <input
        type='text'
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder='Search...'
        required
      />
      <select
        onChange={e => setSearchType(e.target.value as 'repo' | 'user')}
        value={searchType}>
        <option value='repo'>Repositories</option>
        <option value='user'>Users</option>
      </select>
      <button type='submit'>Search</button>
    </form>
  );
};

type CardProps = {
  item: LocalUser | LocalRepo;
  type: 'repo' | 'user';
};

const Card = ({item, type}: CardProps) => {
  if (type === 'repo') {
    return (
      <div className='card'>
        <div className='field text'>
          <div className='label'>Name:</div>
          <div>{(item as LocalRepo).name}</div>
        </div>
        <div className='field number'>
          <div className='label'>Stars:</div>
          <div>{(item as LocalRepo).stars}</div>
        </div>
      </div>
    );
  }
  return (
    <div className='card'>
      <div className='field text'>
        <div className='label'>Username:</div>
        <div>{(item as LocalUser).name}</div>
      </div>
      <div className='field number'>
        <div className='label'>Public Repos:</div>
        <div>{(item as LocalUser).repo}</div>
      </div>
    </div>
  );
};

type ResultType = LocalUser | LocalRepo;

function App() {
  const [results, setResults] = useState<ResultType[]>([]);
  const [searchType, setSearchType] = useState<'repo' | 'user'>('repo');
  const [hasSearched, setHasSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = useCallback(
    async (query: string) => {
      setIsLoading(true);
      setError(null);
      try {
        let endpoint = '';
        if (searchType === 'repo') {
          endpoint = BASE_URL_REPO + query;
        } else {
          endpoint = BASE_URL_USER + query;
        }

        const response = await fetch(endpoint);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        let items: ResultType[] = [];
        if (searchType === 'repo') {
          if (data && !Array.isArray(data)) {
            items = [extractLocalRepo(data)];
          }
        } else {
          if (data && !Array.isArray(data)) {
            items = [extractLocalUser(data)];
          }
        }

        setResults(items);
        setHasSearched(true);
      } catch (error) {
        console.error('Error fetching data from GitHub API', error);
        setError('Error fetching data from GitHub API');
      } finally {
        setIsLoading(false);
      }
    },
    [searchType],
  );

  return (
    <main>
      <Search
        onSearch={handleSearch}
        searchType={searchType}
        setSearchType={setSearchType}
      />
      {isLoading && <p>Loading...</p>}
      {hasSearched && !isLoading && results.length === 0 && !error && (
        <p>No data found</p>
      )}
      {error && <p>{error}</p>}
      <div className='cards-container'>
        {results.map(item => (
          <Card key={item.id} item={item} type={searchType} />
        ))}
      </div>
    </main>
  );
}

export default App;
