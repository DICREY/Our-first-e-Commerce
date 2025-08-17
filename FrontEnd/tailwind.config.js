// Librarys 
import { Config } from "tailwindcss";

// Config
const Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",

    // Flowbite content
    
  ],
  plugins: [
    //Add Flowbite Plugin
    require("flowbite/plugin"),
  ],
};
export default Config;
