const { getDefaultConfig } = require('expo/metro-config')
const path = require('path')

const projectRoot = __dirname

const config = getDefaultConfig(projectRoot)

// Force Metro to ONLY look in mobile's node_modules — never walk up to root
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
]

// Intercept react and react-native imports and force them to mobile's copies
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === 'react' || moduleName.startsWith('react/')) {
    return {
      filePath: require.resolve(moduleName, {
        paths: [path.resolve(projectRoot, 'node_modules')],
      }),
      type: 'sourceFile',
    }
  }
  if (moduleName === 'react-native' || moduleName.startsWith('react-native/')) {
    return {
      filePath: require.resolve(moduleName, {
        paths: [path.resolve(projectRoot, 'node_modules')],
      }),
      type: 'sourceFile',
    }
  }
  return context.resolveRequest(context, moduleName, platform)
}

module.exports = config
