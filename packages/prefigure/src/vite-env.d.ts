declare const PREFIGURE_VERSION: string;

declare module "*?worker" {
    const WorkerFactory: {
        new (): Worker;
    };
    export default WorkerFactory;
}

declare module "*?worker&inline" {
    const WorkerFactory: {
        new (): Worker;
    };
    export default WorkerFactory;
}

declare module "*?raw" {
    const content: string;
    export default content;
}

declare global {
    var prefigure:
        | ((
              source: string,
              options?: {
                  mode?: "svg" | "tactile";
                  indexURL?: string;
              },
          ) => Promise<{ svg: string; annotationsXml: string }>)
        | undefined;
    var initPrefigure: ((indexURL?: string) => Promise<void>) | undefined;
}

export {};
