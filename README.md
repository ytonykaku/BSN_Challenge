
BSN_Challenge — Pokedex em Ionic + Angular

Este repositório contém o desafio técnico da BSN. O objetivo foi criar uma Pokedex, utilizando a PokeAPI, onde o usuário pudesse favoritar seus Pokémons preferidos e exibi-los em outra aba.
A aplicação deve ter caráter reativo, funcionando para dispositivos de tamanhos diferentes, incluindo smartphones.

## Arquitetura do Projeto

```
src/
└─ app/
   ├─ components/
   │  └─ pokemon-detail-modal/   # Modal para detalhes do Pokémon (Exclusivo para smartphones)
   ├─ models/                    # Interfaces e modelos
   ├─ services/                  # Serviços
   ├─ tab1/, tab2/               # Páginas principais (uma por aba), lazy loaded
   ├─ tabs/                      # Gerenciamento da navegação entre abas
   └─ app.module.ts              # Módulo raiz do app
````

**Principais pontos:**

  * Páginas e componentes reativos
  * Serviços injetáveis que centralizam a lógica (ex.: chamadas HTTP, favoritos, estado de UI)
  * Rotas lazy loaded para melhorar o desempenho
  * Uso de breakpoint para definir o tipo de dispositivo

## Padrões de Desenvolvimento

  * TypeScript com tipagem forte
  * Angular DI para injeção de dependências
  * Observables RxJS para chamadas HTTP e reatividade
  * SCSS com convenção BEM para manter o estilo organizado
  * Arquitetura limpa e separação clara de responsabilidades com auxílio de LINT.

## Recursos e Bibliotecas

| Recurso       | Uso                                        |
| :------------ | :----------------------------------------- |
| Angular       | Framework principal                        |
| Ionic Framework | UI nativo e CLI para execução              |
| Capacitor     | Builds Android/iOS                         |
| RxJS          | Fluxos reativos e Observables              |
| HttpClient    | Comunicação com PokeAPI                    |
| Ionicon       | Ícones vetoriais (ex.: heart)              |
| Angular Router | Navegação entre páginas                    |

## Instalação e Execução

### Pré-requisitos

  * Node.js (LTS) e npm
  * Ionic CLI global:

<!-- end list -->

```bash
npm install -g @ionic/cli
```

### Como rodar localmente


    ```bash
    git clone [https://github.com/ytonykaku/BSN_Challenge.git](https://github.com/ytonykaku/BSN_Challenge.git)
    cd BSN_Challenge
    npm install
    ionic serve
    ```

### Build para mobile

1.  Adicionar a plataforma:

    ```bash
    ionic capacitor add android
    ionic capacitor add ios
    npm run build
    ionic capacitor copy android
    ionic capacitor run android
    ```

## Demonstração

![Demonstração](https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExNmI4ODc3aXFoNHhoZGZna3E3bWprejBnYzU3MjB6MzM3MGhwbTZpcSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/mfxWB9QMg7dYXA9Ir0/giphy.gif)
