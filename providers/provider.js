'use client'
import { Provider } from "react-redux";
import store from "@/redux/store";
import { useGetHealthQuery } from "@/redux/features/health/healthApi";

function HealthProbe() {
  useGetHealthQuery();
  return null;
}

export function Providers({ children }) {
    return (
      <Provider store={store}>
        <HealthProbe />
        {children}
      </Provider>
    );
}
