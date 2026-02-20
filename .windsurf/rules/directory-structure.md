---
trigger: manual
---

# Directory Structure Rules

## Root Directory Structure

```
pokeBattles/
├── packages/                    # Separate npm packages
│   ├── backend/                 # NodeJS/Express REST API
│   │   ├── src/
│   │   ├── tests/               # Backend tests
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── README.md
│   ├── mcp-server/              # TypeScript MCP Server
│   │   ├── src/
│   │   ├── tests/               # MCP server tests
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── README.md
├── docs/                        # Project documentation
│   ├── api/                     # API documentation
│   ├── database/                # Database documentation
│   └── development/             # Development guides
├── scripts/                     # Build and deployment scripts
├── .github/                     # GitHub Actions workflows
├── package.json                 # Root package.json (workspace configuration)
├── tsconfig.json               # Root TypeScript configuration
├── .gitignore
├── README.md
└── LICENSE
```

## Package Structure Rules

### Backend Package (`packages/backend/`)
- **Controllers**: Handle HTTP requests and responses
- **Models**: Define database models and schemas
- **Services**: Implement business logic and game mechanics
- **Middleware**: Express middleware for authentication, logging, etc.
- **Routes**: Define API endpoints and route handlers
- **Database**: Database connection, configuration, and migrations
- **Utils**: Helper functions and utilities

### MCP Server Package (`packages/mcp-server/`)
- **Handlers**: MCP function implementations for game interactions
- **Services**: MCP-specific business logic and external integrations
- **Types**: TypeScript interfaces and types for MCP functions
- **Utils**: MCP-specific utility functions

### Shared Package (`packages/shared/`)
- **Types**: Common TypeScript interfaces used across packages
- **Constants**: Shared constants and enums
- **Utils**: Common utility functions used by multiple packages

## File Naming Conventions

- Use **PascalCase** for class files and TypeScript interfaces
- Use **camelCase** for function files and utilities
- Use **kebab-case** for configuration and documentation files
- Database migrations: `001_create_games_table.sql`, `002_create_captured_pokemon_table.sql`
- Test files: `*.test.ts` or `*.spec.ts`

## Import Rules

- Backend packages should import shared types from `@poke-battles/shared`
- MCP server should import shared types from `@poke-battles/shared`
- Avoid circular dependencies between packages
- Use absolute imports within packages when possible

## Development Rules

- Each package should have its own `package.json` with specific dependencies
- Root `package.json` should configure npm workspaces
- Shared code should live in the `shared` package
- Package-specific code should remain within its respective package
- All packages should use TypeScript with consistent configuration

