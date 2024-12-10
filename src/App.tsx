import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import { Toaster } from "react-hot-toast";
import { Provider } from "react-redux";
import AppRouter from "./modules/common/components/AppRouter";
import Navbar from "./modules/common/components/navbar/Navbar";
import store from "./store";

const App = () => {
  return (
    <Provider store={store}>
      <AppRouter>
        <Navbar />
        <Toaster position="top-center" />
      </AppRouter>
    </Provider>
  );
};

export default App;
