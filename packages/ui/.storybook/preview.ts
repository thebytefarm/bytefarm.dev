import type { Preview } from "@storybook/react-vite";
import "../src/styles/globals.css";
import "../src/toons/scene.css";
import "./preview.css";

const preview: Preview = {
  parameters: {
    layout: "fullscreen",
    backgrounds: {
      default: "sky",
      values: [
        { name: "sky", value: "#66c0ff" },
        { name: "white", value: "#ffffff" },
        { name: "dark", value: "#1a1a2e" },
        { name: "grass", value: "#6dd33b" },
      ],
    },
    controls: {
      matchers: { color: /(background|color)$/i, date: /Date$/i },
    },
  },
};

export default preview;
