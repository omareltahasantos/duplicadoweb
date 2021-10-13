import React from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import { theme, Fonts } from './theme';

import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';

import DashboardPage from './screen/Dashboard';
import HomePage from './screen/Home';
import LoginPage from './screen/Login';
import HoursPage from './screen/WorkHours';
import AddHoursPage from './screen/AddHours';
import AddStartTimePage from './screen/AddStartTime';
import ProjectPage from './screen/Projects';
import ProjectListPage from './screen/ProjectList';
import AddProjectPage from './screen/AddProject';
import UpdateProjectPage from './screen/UpdateProject';
import UserListPage from './screen/UserList';
import AddUserPage from './screen/AddUser';
import UpdateUserPage from './screen/UpdateUsers';
import HourListPage from './screen/HourList';
import StatsPage from './screen/Stats';
import InfoStatsPage from './screen/InfoStats';
import UserStatsPage from './screen/UserStats';

function App() {
  var admin = ['admin'];
  var tecnico = ['tecnico'];
  var both = ['admin', 'tecnico'];
  return (
    <ChakraProvider theme={theme}>
      <Fonts />
      <Router>
        <AuthProvider>
          <Switch>
            <Route path="/login" component={LoginPage} />

            {/* Authenticated */}
            <PrivateRoute exact path="/" roles={both} component={DashboardPage} />
            <PrivateRoute path="/home" roles={admin} component={HomePage} />
            <PrivateRoute path="/projects" roles={tecnico} component={ProjectPage} />
            <PrivateRoute path="/projectList" roles={admin} component={ProjectListPage} />
            <PrivateRoute path="/addProject" roles={admin} component={AddProjectPage} />
            <PrivateRoute
              path="/updateProject/:id"
              roles={admin}
              component={UpdateProjectPage}
            />
            <PrivateRoute
              path="/updateUser/:id"
              roles={admin}
              component={UpdateUserPage}
            />
            <PrivateRoute path="/users" roles={admin} component={UserListPage} />
            <PrivateRoute path="/addUser" roles={admin} component={AddUserPage} />
            <PrivateRoute path="/hours/:id/:name" roles={tecnico} component={HoursPage} />
            <PrivateRoute path="/hourList" roles={admin} component={HourListPage} />
            <PrivateRoute
              path="/addHours/:id/:name"
              roles={tecnico}
              component={AddHoursPage}
            />
            <PrivateRoute
              path="/workStart/:id/:name"
              roles={tecnico}
              component={AddStartTimePage}
            />
            <PrivateRoute path="/stats" roles={admin} component={StatsPage} />
            <PrivateRoute path="/infoStats/:id" roles={admin} component={InfoStatsPage} />
            <PrivateRoute path="/userStats/:id" roles={admin} component={UserStatsPage} />
            <Route path="*">
              <Redirect to="/" />
            </Route>
          </Switch>
        </AuthProvider>
      </Router>
    </ChakraProvider>
  );
}

export default App;
