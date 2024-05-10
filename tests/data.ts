import flexsearch from 'flexsearch';
import type { SelectOption } from '../src/index';

const { Index } = flexsearch;

export const top100Films = [
  {
    name: 'The Shawshank Redemption (1994)',
    value: 'The Shawshank Redemption',
  },
  { name: 'The Godfather (1972)', value: 'The Godfather' },
  { name: 'The Godfather: Part II (1974)', value: 'The Godfather: Part II' },
  { name: 'The Dark Knight (2008)', value: 'The Dark Knight' },
  { name: '12 Angry Men (1957)', value: '12 Angry Men' },
  { name: "Schindler's List (1993)", value: "Schindler's List" },
  { name: 'Pulp Fiction (1994)', value: 'Pulp Fiction' },
  {
    name: 'The Lord of the Rings: The Return of the King (2003)',
    value: 'The Lord of the Rings: The Return of the King',
  },
  {
    name: 'The Good, the Bad and the Ugly (1966)',
    value: 'The Good, the Bad and the Ugly',
  },
  { name: 'Fight Club (1999)', value: 'Fight Club' },
  {
    name: 'The Lord of the Rings: The Fellowship of the Ring (2001)',
    value: 'The Lord of the Rings: The Fellowship of the Ring',
  },
  {
    name: 'Star Wars: Episode V - The Empire Strikes Back (1980)',
    value: 'Star Wars: Episode V - The Empire Strikes Back',
  },
  { name: 'Forrest Gump (1994)', value: 'Forrest Gump' },
  { name: 'Inception (2010)', value: 'Inception' },
  {
    name: 'The Lord of the Rings: The Two Towers (2002)',
    value: 'The Lord of the Rings: The Two Towers',
  },
  {
    name: "One Flew Over the Cuckoo's Nest (1975)",
    value: "One Flew Over the Cuckoo's Nest",
  },
  { name: 'Goodfellas (1990)', value: 'Goodfellas' },
  { name: 'The Matrix (1999)', value: 'The Matrix' },
  { name: 'Seven Samurai (1954)', value: 'Seven Samurai' },
  {
    name: 'Star Wars: Episode IV - A New Hope (1977)',
    value: 'Star Wars: Episode IV - A New Hope',
  },
  { name: 'City of God (2002)', value: 'City of God' },
  { name: 'Se7en (1995)', value: 'Se7en' },
  {
    name: 'The Silence of the Lambs (1991)',
    value: 'The Silence of the Lambs',
  },
  { name: "It's a Wonderful Life (1946)", value: "It's a Wonderful Life" },
  { name: 'Life Is Beautiful (1997)', value: 'Life Is Beautiful' },
  { name: 'The Usual Suspects (1995)', value: 'The Usual Suspects' },
  { name: 'Léon: The Professional (1994)', value: 'Léon: The Professional' },
  { name: 'Spirited Away (2001)', value: 'Spirited Away' },
  { name: 'Saving Private Ryan (1998)', value: 'Saving Private Ryan' },
  {
    name: 'Once Upon a Time in the West (1968)',
    value: 'Once Upon a Time in the West',
  },
  { name: 'American History X (1998)', value: 'American History X' },
  { name: 'Interstellar (2014)', value: 'Interstellar' },
  { name: 'Casablanca (1942)', value: 'Casablanca' },
  { name: 'City Lights (1931)', value: 'City Lights' },
  { name: 'Psycho (1960)', value: 'Psycho' },
  { name: 'The Green Mile (1999)', value: 'The Green Mile' },
  { name: 'The Intouchables (2011)', value: 'The Intouchables' },
  { name: 'Modern Times (1936)', value: 'Modern Times' },
  { name: 'Raiders of the Lost Ark (1981)', value: 'Raiders of the Lost Ark' },
  { name: 'Rear Window (1954)', value: 'Rear Window' },
  { name: 'The Pianist (2002)', value: 'The Pianist' },
  { name: 'The Departed (2006)', value: 'The Departed' },
  {
    name: 'Terminator 2: Judgment Day (1991)',
    value: 'Terminator 2: Judgment Day',
  },
  { name: 'Back to the Future (1985)', value: 'Back to the Future' },
  { name: 'Whiplash (2014)', value: 'Whiplash' },
  { name: 'Gladiator (2000)', value: 'Gladiator' },
  { name: 'Memento (2000)', value: 'Memento' },
  { name: 'The Prestige (2006)', value: 'The Prestige' },
  { name: 'The Lion King (1994)', value: 'The Lion King' },
  { name: 'Apocalypse Now (1979)', value: 'Apocalypse Now' },
  { name: 'Alien (1979)', value: 'Alien' },
  { name: 'Sunset Boulevard (1950)', value: 'Sunset Boulevard' },
  {
    name: 'Dr. Strangelove or: How I Learned to Stop Worrying and Love the Bomb (1964)',
    value:
      'Dr. Strangelove or: How I Learned to Stop Worrying and Love the Bomb ',
  },
  { name: 'The Great Dictator (1940)', value: 'The Great Dictator' },
  { name: 'Cinema Paradiso (1988)', value: 'Cinema Paradiso' },
  { name: 'The Lives of Others (2006)', value: 'The Lives of Others' },
  { name: 'Grave of the Fireflies (1988)', value: 'Grave of the Fireflies' },
  { name: 'Paths of Glory (1957)', value: 'Paths of Glory' },
  { name: 'Django Unchained (2012)', value: 'Django Unchained' },
  { name: 'The Shining (1980)', value: 'The Shining' },
  { name: 'WALL·E (2008)', value: 'WALL·E' },
  { name: 'American Beauty (1999)', value: 'American Beauty' },
  { name: 'The Dark Knight Rises (2012)', value: 'The Dark Knight Rises' },
  { name: 'Princess Mononoke (1997)', value: 'Princess Mononoke' },
  { name: 'Aliens (1986)', value: 'Aliens' },
  { name: 'Oldboy (2003)', value: 'Oldboy' },
  {
    name: 'Once Upon a Time in America (1984)',
    value: 'Once Upon a Time in America',
  },
  {
    name: 'Witness for the Prosecution (1957)',
    value: 'Witness for the Prosecution',
  },
  { name: 'Das Boot (1981)', value: 'Das Boot' },
  { name: 'Citizen Kane (1941)', value: 'Citizen Kane' },
  { name: 'North by Northwest (1959)', value: 'North by Northwest' },
  { name: 'Vertigo (1958)', value: 'Vertigo' },
  {
    name: 'Star Wars: Episode VI - Return of the Jedi (1983)',
    value: 'Star Wars: Episode VI - Return of the Jedi',
  },
  { name: 'Reservoir Dogs (1992)', value: 'Reservoir Dogs' },
  { name: 'Braveheart (1995)', value: 'Braveheart' },
  { name: 'M (1931)', value: 'M' },
  { name: 'Requiem for a Dream (2000)', value: 'Requiem for a Dream' },
  { name: 'Amélie (2001)', value: 'Amélie' },
  { name: 'A Clockwork Orange (1971)', value: 'A Clockwork Orange' },
  { name: 'Like Stars on Earth (2007)', value: 'Like Stars on Earth' },
  { name: 'Taxi Driver (1976)', value: 'Taxi Driver' },
  { name: 'Lawrence of Arabia (1962)', value: 'Lawrence of Arabia' },
  { name: 'Double Indemnity (1944)', value: 'Double Indemnity' },
  {
    name: 'Eternal Sunshine of the Spotless Mind (2004)',
    value: 'Eternal Sunshine of the Spotless Mind',
  },
  { name: 'Amadeus (1984)', value: 'Amadeus' },
  { name: 'To Kill a Mockingbird (1962)', value: 'To Kill a Mockingbird' },
  { name: 'Toy Story 3 (2010)', value: 'Toy Story 3' },
  { name: 'Logan (2017)', value: 'Logan' },
  { name: 'Full Metal Jacket (1987)', value: 'Full Metal Jacket' },
  { name: 'Dangal (2016)', value: 'Dangal' },
  { name: 'The Sting (1973)', value: 'The Sting' },
  { name: '2001: A Space Odyssey (1968)', value: '2001: A Space Odyssey' },
  { name: "Singin' in the Rain (1952)", value: "Singin' in the Rain" },
  { name: 'Toy Story (1995)', value: 'Toy Story' },
  { name: 'Bicycle Thieves (1948)', value: 'Bicycle Thieves' },
  { name: 'The Kid (1921)', value: 'The Kid' },
  { name: 'Inglourious Basterds (2009)', value: 'Inglourious Basterds' },
  { name: 'Snatch (2000)', value: 'Snatch' },
  { name: '3 Idiots (2009)', value: '3 Idiots' },
  {
    name: 'Monty Python and the Holy Grail (1975)',
    value: 'Monty Python and the Holy Grail',
  },
];

export const remoteData = () =>
  new Promise<SelectOption<string>[]>((resolve) => {
    setTimeout(() => {
      resolve(top100Films);
    }, 2000);
  });

const indexedFilms = new Index({
  charset: 'latin:advanced',
  tokenize: 'reverse',
  cache: true,
});

top100Films.forEach((f, i) => {
  indexedFilms.add(i, f.name);
});

export const filterLocalData = (input?: string) => {
  if (!input) return top100Films;
  const result = indexedFilms.search(input);
  return result.map((r) => top100Films[r as number]);
};

export function createRemoteData(lower = 200, upper = 1000, limit = 100) {
  return (input?: string) => {
    const result = filterLocalData(input).slice(0, limit);
    const randomCost = Math.random() * (upper - lower) + lower;
    return new Promise<SelectOption<string>[]>((resolve) => {
      setTimeout(() => {
        resolve(result);
      }, randomCost);
    });
  };
}

export const filterRemoteData = createRemoteData();
