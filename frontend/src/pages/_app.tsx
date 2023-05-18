import { type AppType } from "next/app";
import store from "~/redux/store";
import { Provider } from "react-redux";

import { api } from "~/utils/api";

import "~/styles/globals.css";
import Navbar from "~/components/Navbar";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <Provider store={store}>
      <Navbar />
      <Component {...pageProps} />
    </Provider>
  );
};

export default api.withTRPC(MyApp);
