import JadeServiceRunner from "@etclabscore/jade-service-runner-client";
import * as React from "react";

function useService<T>(
  serviceRunner: JadeServiceRunner | undefined,
  serviceName: string,
  client: any,
  version: string,
  env: string,
): [T | undefined, React.Dispatch<any>] {
  const [service, setService] = React.useState<T>();
  const [url, setUrl] = React.useState();
  React.useEffect(() => {
    if (!serviceRunner) {
      return;
    }
    const runAsync = async () => {
      let defaultPort;
      if (!url) {
        const installed = await serviceRunner.installService(serviceName, version);
        if (!installed) {
          return;
        }
        const s = await serviceRunner.startService(serviceName, version, env);
        defaultPort = s.rpcPort;
      }
      let parsedUrl;
      try {
        parsedUrl = new URL(url || `http://localhost:${defaultPort}`);
      } catch (e) {
        return;
      }
      try {
        const protocol = parsedUrl.protocol.split(":")[0] as any;
        const fallbackPort = protocol === "http" ? 80 : 443;
        const port = parseInt(parsedUrl.port, 10);
        const c: T = new client({
          transport: {
            host: parsedUrl.hostname,
            port: port ? port : fallbackPort,
            type: protocol,
          },
        })
        setService(c);
      } catch (e) {
        return;
      }
    };
    runAsync();
  }, [serviceRunner, url, serviceName, client, version, env]);
  return [service, setUrl];
}

export default useService;
