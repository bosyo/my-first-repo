// Node modules
import React from 'react'
import { NativeRouter} from "react-router-native";
import Meteor from 'react-native-meteor';
// Files
import routeList from './routes'
import AuthRoute from './routes-wrapper/auth-route';
import Stack from 'react-router-native-stack';
import PublicRoute from './routes-wrapper/public-route'
const _RenderRoutes = (routes) => {
  return routes.map((route) => {
    const {component, path, isAuthenticated, ...rest} = route;
    if (isAuthenticated === true) {
      return <AuthRoute key={path} component={component} path={path} {...rest} isAuthenticated={true}/>
    } else {
      return <PublicRoute key={path}  component={component} path={path} {...rest} />
    }
  })
}

const Routes = () => (
  <NativeRouter>
    <Stack gestureEnabled={false}>
      {_RenderRoutes(routeList)}
    </Stack>
  </NativeRouter>
)



export default Routes
