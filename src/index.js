/* eslint-disable global-require */
module.exports = {

  config: require('./config'),

  // ======================= CORE FILES =======================
  // lib/core/settings
  Settings: require('./lib/core/settings/Settings'),
  Gateway: require('./lib/core/settings/Gateway'),
  GatewayDriver: require('./lib/core/settings/GatewayDriver'),
  GatewayStorage: require('./lib/core/settings/GatewayStorage'),
  Schema: require('./lib/core/settings/schema/Schema'),
  SchemaFolder: require('./lib/core/settings/schema/SchemaFolder'),
  SchemaPiece: require('./lib/core/settings/schema/SchemaPiece'),

  // lib/core/structure/base
  AliasPiece: require('./lib/core/structures/base/AliasPiece'),
  AliasStore: require('./lib/core/structures/base/AliasStore'),
  Piece: require('./lib/core/structures/base/Piece'),
  Store: require('./lib/core/structures/base/Store'),

  // lib/core/structure
  Argument: require('./lib/core/structures/Argument'),
  ArgumentMulti: require('./lib/core/structures/ArgumentMulti'),
  ArgumentStore: require('./lib/core/structures/ArgumentStore'),
  Command: require('./lib/core/structures/Command'),
  CommandStore: require('./lib/core/structures/CommandStore'),
  Event: require('./lib/core/structures/Event'),
  EventStore: require('./lib/core/structures/EventStore'),
  Finalizer: require('./lib/core/structures/Finalizer'),
  FinalizerStore: require('./lib/core/structures/FinalizerStore'),
  Inhibitor: require('./lib/core/structures/Inhibitor'),
  InhibitorStore: require('./lib/core/structures/InhibitorStore'),
  Language: require('./lib/core/structures/Language'),
  LanguageStore: require('./lib/core/structures/LanguageStore'),
  Middleware: require('./lib/core/structures/Middleware'),
  Monitor: require('./lib/core/structures/Monitor'),
  MonitorStore: require('./lib/core/structures/MonitorStore'),
  Provider: require('./lib/core/structures/Provider'),
  ProviderStore: require('./lib/core/structures/ProviderStore'),
  Route: require('./lib/core/structures/Route'),
  RouteStore: require('./lib/core/structures/RouteStore'),
  Serializer: require('./lib/core/structures/Serializer'),
  SerializerStore: require('./lib/core/structures/SerializerStore'),
  Task: require('./lib/core/structures/Task'),
  TaskStore: require('./lib/core/structures/TaskStore'),


  // lib/core/util
  RateLimitManager: require('./lib/core/util/RateLimitManager'),
  constants: require('./lib/core/util/constants'),
  Moment: require('./lib/core/util/Moment'),
  coreutil: require('./lib/core/util/util'),


  // ==================== CLIENT USER FILES =======================
  // lib/structures
  SwiftClient: require('./lib/client/structures/SwiftClient'),
  ModLog: require('./lib/client/structures/ModLog'),
  ServerLog: require('./lib/client/structures/ServerLogs'),

  // lib/util
  Duration: require('./lib/client/util/Duration'),
  SwiftConsole: require('./lib/client/util/SwiftConsole'),
  util: require('./lib/client/util/util'),

  // ==================== DASHBOARD FILES =======================
  // lib/dashboard
  // SwiftDashboard: require('./lib/dashboard/Dashboard'),
  // dashboardUtil: require('./lib/dashboard/utils'),
};
