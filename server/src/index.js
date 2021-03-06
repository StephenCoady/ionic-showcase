const express = require('express')
const http = require('http')
const cors = require('cors')

const { ApolloVoyagerServer } = require('@aerogear/apollo-voyager-server')
const { KeycloakSecurityService } = require('@aerogear/apollo-voyager-keycloak')
const metrics = require('@aerogear/apollo-voyager-metrics')
const auditLogger = require('@aerogear/apollo-voyager-audit')

const config = require('./config/config')
const connect = require('./db')
const { typeDefs, resolvers } = require('./schema')

let keycloakService = null

// if a keycloak config is present we create
// a keycloak service which will be passed into
// ApolloVoyagerServer
if (config.keycloakConfig) {
  keycloakService = new KeycloakSecurityService(config.keycloakConfig)
}

async function start() {
  
  const app = express()
  const httpServer = http.createServer(app)

  app.use(cors())
  metrics.applyMetricsMiddlewares(app, { path: '/metrics' })
  
  if (keycloakService) {
    keycloakService.applyAuthMiddleware(app)
  }

  app.get('/health', (req, res) => res.sendStatus(200))

  // connect to db
  const dataSource = {
    client: await connect(config.db),
    type: 'knex'
  }

  const apolloConfig = {
    typeDefs,
    resolvers,
    playground: config.playgroundConfig,
    context: async ({ req }) => {
      // pass request + db ref into context for each resolver
      return {
        req: req,
        db: dataSource.client,
      }
    }
  }

  const voyagerConfig = {
    securityService: keycloakService,
    metrics,
    auditLogger
  }

  const apolloServer = ApolloVoyagerServer(apolloConfig, voyagerConfig)

  apolloServer.applyMiddleware({ app })
  apolloServer.installSubscriptionHandlers(httpServer)

  httpServer.listen({ port: config.port }, () => {
    console.log(`🚀  Server ready at http://localhost:${config.port}/graphql`)
  })
}

start()
