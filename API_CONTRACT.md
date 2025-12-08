# API Contract Documentation

## Steam Web API Integration

Este documento detalha o contrato entre a aplicação e a Steam Web API, incluindo endpoints, parâmetros, respostas e tratamento de erros.

## Base URLs

- **Steam API**: `https://api.steampowered.com`
- **Steam Store API**: `https://store.steampowered.com`

## Proxy Vite (Desenvolvimento)

Em modo de desenvolvimento, as requests são proxied através do Vite para evitar CORS:

- `/api/steam/*` → `https://api.steampowered.com/*`
- `/api/steamstore/*` → `https://store.steampowered.com/*`

## Endpoints

### 1. GetAppList

Obtém lista completa de aplicações Steam.

**Endpoint**: `GET /ISteamApps/GetAppList/v2/`

**Parâmetros Query**:
| Nome | Tipo | Obrigatório | Descrição |
|------|------|-------------|-----------|
| key | string | Sim | Steam Web API Key |

**Request Example**:
```http
GET /api/steam/ISteamApps/GetAppList/v2/?key=YOUR_API_KEY
```

**Response Success (200)**:
```json
{
  "applist": {
    "apps": [
      {
        "appid": 10,
        "name": "Counter-Strike"
      },
      {
        "appid": 20,
        "name": "Team Fortress Classic"
      }
    ]
  }
}
```

**Response Schema**:
```typescript
interface GetAppListResponse {
  applist: {
    apps: Array<{
      appid: number;
      name: string;
    }>;
  };
}
```

**Tratamento de Erros**:
- 404: Retorna array vazio
- Timeout (>8s): Erro de timeout
- Network error: Erro de rede

---

### 2. AppDetails

Obtém detalhes de uma aplicação específica.

**Endpoint**: `GET /api/appdetails`

**Parâmetros Query**:
| Nome | Tipo | Obrigatório | Descrição |
|------|------|-------------|-----------|
| appids | number | Sim | ID da aplicação |
| l | string | Não | Idioma (default: english) |

**Request Example**:
```http
GET /api/steamstore/api/appdetails?appids=570&l=portuguese
```

**Response Success (200)**:
```json
{
  "570": {
    "success": true,
    "data": {
      "type": "game",
      "name": "Dota 2",
      "steam_appid": 570,
      "required_age": 0,
      "is_free": true,
      "short_description": "Every day, millions of players worldwide...",
      "detailed_description": "Dota 2 is a multiplayer online battle arena...",
      "header_image": "https://cdn.akamai.steamstatic.com/...",
      "website": "http://www.dota2.com/",
      "pc_requirements": {
        "minimum": "<strong>Minimum:</strong><br>...",
        "recommended": "<strong>Recommended:</strong><br>..."
      },
      "developers": ["Valve"],
      "publishers": ["Valve"],
      "price_overview": {
        "currency": "EUR",
        "initial": 1999,
        "final": 999,
        "discount_percent": 50,
        "initial_formatted": "19,99€",
        "final_formatted": "9,99€"
      },
      "platforms": {
        "windows": true,
        "mac": true,
        "linux": true
      },
      "metacritic": {
        "score": 90,
        "url": "https://www.metacritic.com/..."
      },
      "categories": [
        {
          "id": 1,
          "description": "Multi-player"
        }
      ],
      "genres": [
        {
          "id": "1",
          "description": "Action"
        }
      ],
      "release_date": {
        "coming_soon": false,
        "date": "9 Jul, 2013"
      }
    }
  }
}
```

**Response Schema**:
```typescript
interface AppDetailsResponse {
  [appId: string]: {
    success: boolean;
    data?: {
      type: string;
      name: string;
      steam_appid: number;
      required_age: number;
      is_free: boolean;
      short_description: string;
      detailed_description: string;
      about_the_game: string;
      header_image: string;
      website: string | null;
      pc_requirements: {
        minimum: string;
        recommended?: string;
      };
      developers?: string[];
      publishers?: string[];
      price_overview?: {
        currency: string;
        initial: number;        // Preço em centavos
        final: number;          // Preço em centavos
        discount_percent: number;
        initial_formatted: string;
        final_formatted: string;
      };
      platforms: {
        windows: boolean;
        mac: boolean;
        linux: boolean;
      };
      metacritic?: {
        score: number;
        url: string;
      };
      categories?: Array<{
        id: number;
        description: string;
      }>;
      genres?: Array<{
        id: string;
        description: string;
      }>;
      release_date: {
        coming_soon: boolean;
        date: string;
      };
    };
  };
}
```

**Campos Disponíveis**:
- ✅ type: Tipo de conteúdo (game, dlc, etc.)
- ✅ name: Nome da aplicação
- ✅ steam_appid: ID Steam
- ✅ is_free: Booleano indicando se é gratuito
- ✅ short_description: Descrição curta (HTML)
- ✅ header_image: URL da imagem principal
- ✅ release_date: Data de lançamento
- ⚠️ price_overview: Opcional, apenas para jogos pagos
- ⚠️ genres: Opcional, lista de géneros
- ⚠️ platforms: Plataformas suportadas
- ⚠️ developers: Opcional, lista de desenvolvedores
- ⚠️ publishers: Opcional, lista de editoras

**Tratamento de Erros**:
- success: false - Aplicação não encontrada ou indisponível
- 404: Retorna null
- Timeout (>8s): Erro de timeout

---

### 3. GetNumberOfCurrentPlayers

Obtém contagem atual de jogadores.

**Endpoint**: `GET /ISteamUserStats/GetNumberOfCurrentPlayers/v1/`

**Parâmetros Query**:
| Nome | Tipo | Obrigatório | Descrição |
|------|------|-------------|-----------|
| key | string | Sim | Steam Web API Key |
| appid | number | Sim | ID da aplicação |

**Request Example**:
```http
GET /api/steam/ISteamUserStats/GetNumberOfCurrentPlayers/v1/?key=YOUR_API_KEY&appid=570
```

**Response Success (200)**:
```json
{
  "response": {
    "player_count": 123456,
    "result": 1
  }
}
```

**Response Schema**:
```typescript
interface GetNumberOfCurrentPlayersResponse {
  response: {
    player_count: number;
    result: number;  // 1 = success
  };
}
```

**Tratamento de Erros**:
- result: 42 - Aplicação não encontrada
- 404: Retorna null
- Timeout (>8s): Erro de timeout

---

## Robustez da Implementação

### 1. AbortController
```typescript
const controller = new AbortController();
const response = await fetch(url, { signal: controller.signal });

// Cancelar request anterior
controller.abort();
```

### 2. Timeout
```typescript
const timeoutId = setTimeout(() => controller.abort(), 8000);
// Limpar timeout após sucesso
clearTimeout(timeoutId);
```

### 3. Verificação de Response
```typescript
if (!response.ok) {
  if (response.status === 404) {
    // Tratar como vazio
    return { data: [] };
  }
  throw new Error(`HTTP error! status: ${response.status}`);
}
```

### 4. Normalização de Payload
```typescript
const normalizeResponse = <T>(data: any): T[] => {
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.data)) return data.data;
  if (data && data.applist && Array.isArray(data.applist.apps)) {
    return data.applist.apps;
  }
  return [];
};
```

## Client-Side Processing

### Pesquisa
```typescript
// Filtragem client-side por nome
const searchGames = (games: SteamGame[], query: string): SteamGame[] => {
  if (!query || query.trim() === '') return games;
  const lowerQuery = query.toLowerCase().trim();
  return games.filter(game => 
    game.name.toLowerCase().includes(lowerQuery)
  );
};
```

### Ordenação
```typescript
// Parâmetros de ordenação
interface SortOptions {
  field: 'name' | 'appid' | 'release_date';
  order: 'asc' | 'desc';
}

// Ordenação client-side
games.sort((a, b) => {
  let comparison = 0;
  switch (sort.field) {
    case 'name':
      comparison = a.name.localeCompare(b.name, 'pt-PT');
      break;
    case 'appid':
      comparison = a.appid - b.appid;
      break;
  }
  return sort.order === 'asc' ? comparison : -comparison;
});
```

### Paginação
```typescript
// Parâmetros de paginação
interface PaginationOptions {
  page: number;    // Começa em 1
  limit: number;   // Itens por página (1-100)
}

// Calcular slice
const start = (pagination.page - 1) * pagination.limit;
const end = start + pagination.limit;
const paginatedGames = games.slice(start, end);
```

### Filtragem
```typescript
// Opções de filtro
interface FilterOptions {
  genre?: string;                           // Genre name
  isFree?: boolean;                         // Free-to-play
  platform?: 'windows' | 'mac' | 'linux';  // Platform support
}
```

## Rate Limits

A Steam API tem rate limits não documentados oficialmente. Recomendações:
- Não fazer mais de 200 requests por 5 minutos
- Implementar backoff exponencial em caso de rate limit
- Cachear responses quando possível
- Usar batch requests quando disponível

## Campos Extraídos e Formatados na UI

### String com Fallback
- Nome do jogo
- Descrição
- Desenvolvedor
- Editora

### Number (pt-PT)
- ID da aplicação: `formatNumber(appid)`
- Contagem de jogadores: `formatNumber(playerCount)`
- Pontuação Metacritic: `formatNumber(score)`

### Date/Time (Intl.DateTimeFormat)
- Data de lançamento: `formatDate(release_date.date)`

### Boolean (Badges)
- Gratuito: `formatBoolean(is_free, 'Sim', 'Não')`
- Plataformas: Ícones 🪟 🍎 🐧

### Moeda (EUR)
- Preço: `formatCurrency(price_overview.final)`
- Desconto: Mostrar preço original com strikethrough

### Image com Fallback
- Header image com alt text
- SVG placeholder se imagem falhar

---

**Última atualização**: 2025-12-08
