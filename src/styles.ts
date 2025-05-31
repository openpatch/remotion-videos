import Informatik from "./logos/Informatik";
import Mathematik from "./logos/Mathematik";
import OpenPatch from "./logos/OpenPatch";

export type Style = {
  logo: any;
  name: string;
  poweredBy: boolean;
  primary: string;
  secondary: string;
};

export default {
  mathematik: {
    logo: Mathematik,
    name: "Mathematik",
    poweredBy: true,
    primary: "#87e2f6",
    secondary: "#0b7c93",
  } as Style,
  informatik: {
    logo: Informatik,
    name: "Informatik",
    poweredBy: true,
    primary: "#f8d9ad",
    secondary: "#f1b562",
  } as Style,
  openpatch: {
    logo: OpenPatch,
    name: "OpenPatch",
    poweredBy: false,
    primary: "#b5e3d8",
    secondary: "#007864",
  } as Style,
} as const;
