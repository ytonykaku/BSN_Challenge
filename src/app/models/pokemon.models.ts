export interface PokemonListResponse {
  count: number;
  next: string;
  previous: string | null;
  results: { name: string; url: string }[];
}

export interface Pokemon {
  name: string;
  url: string;
  id: string;
  imageUrl: string;
}

export interface PokemonSpecies {
  flavor_text_entries: {
    flavor_text: string;
    language: { name: string };
  }[];
}

export interface PokemonDetails {
  id: number;
  name: string;
  height: number;
  weight: number;
  sprites: {
    other: {
      'official-artwork': {
        front_default: string;
      };
    };
  };
  types: {
    type: {
      name: string;
    };
  }[];
  abilities: {
    ability: {
      name: string;
    };
  }[];
  stats: {
    base_stat: number;
    stat: {
      name: string;
    };
  }[];
  description: string;
}
