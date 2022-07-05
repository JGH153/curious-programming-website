interface ProbeReturn {
  width: number;
  height: number;
  length: number;
  type: string;
  mime: string;
  wUnits: any;
  hUnits: any;
  url: any;
  orientation: any;
  variants: any;
}

declare module "probe-image-size" {
  function probe(path: string): ProbeReturn;
  export = probe;
}
