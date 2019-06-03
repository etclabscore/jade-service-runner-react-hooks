import { useState } from "react";
import ServiceRunner from "@etclabscore/jade-service-runner-client";
import useInterval from "./useInterval";

const supportedServices = [
  {
    name: "multi-geth",
    version: "1.9.0",
    envs: ["kotti", "mainnet"],
  },
];

const serviceRunner = new ServiceRunner({
  transport: {
    host: "localhost",
    port: 8002,
    type: "http",
  },
});

const useServiceRunner = () => {
  const [runningServices, setRunningServices] = useState();
  const [installedServices, setInstalledServices] = useState();

  useInterval(() => {
    serviceRunner.listRunningServices().then(setRunningServices);
  }, 5000);
  useInterval(() => {
    serviceRunner.listInstalledServices().then(setInstalledServices);
  }, 5000);
  return [supportedServices, runningServices, installedServices, serviceRunner.installService, serviceRunner.startService]; //tslint:disable-line
};

export default useServiceRunner;
