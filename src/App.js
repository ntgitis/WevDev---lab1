import './App.css';

import React, { useState } from "react";
import { Grid, Paper } from "@mui/material";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import TopBar from "./components/TopBar";
import UserDetail from "./components/UserDetail";
import UserList from "./components/UserList";
import UserPhotos from "./components/UserPhotos";

const App = (props) => {
  const [advancedFeature, setAdvancedFeature] = useState(false);
  const [topBarContext, setTopBarContext] = useState("Home");

  return (
      <Router>
        <div>
          <TopBar context={topBarContext} advancedFeature={advancedFeature} setAdvancedFeature={setAdvancedFeature} />
          <Grid container spacing={2} style={{ padding: '16px', marginTop: 0 }}>
            <Grid item xs={12} sm={3}>
              <Paper className="main-grid-item">
                <UserList />
              </Paper>
            </Grid>
            <Grid item xs={12} sm={9}>
              <Paper className="main-grid-item">
                <Routes>
                  <Route
                      path="/users/:userId"
                      element = {<UserDetail setTopBarContext={setTopBarContext} />}
                  />
                  <Route
                      path="/photos/:userId"
                      element = {<UserPhotos advancedFeature={advancedFeature} setTopBarContext={setTopBarContext} />}
                  />
                  <Route
                      path="/photos/:userId/:photoId"
                      element = {<UserPhotos advancedFeature={advancedFeature} setTopBarContext={setTopBarContext} />}
                  />
                  <Route path="/users" element={<UserList />} />
                </Routes>
              </Paper>
            </Grid>
          </Grid>
        </div>
      </Router>
  );
}

export default App;
