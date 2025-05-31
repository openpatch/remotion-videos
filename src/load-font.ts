import { continueRender, delayRender, staticFile } from "remotion";

export const TheBoldFont = `TheBoldFont`;
export const JosefinSans = `JosefinSans`;

let loaded = false;

export const loadFont = async (): Promise<void> => {
  if (loaded) {
    return Promise.resolve();
  }

  const waitForFont = delayRender();

  loaded = true;

  let font = new FontFace(
    JosefinSans,
    `url('${staticFile("JosefinSans.ttf")}') format('truetype')`,
  );

  await font.load();
  document.fonts.add(font);

  font = new FontFace(
    TheBoldFont,
    `url('${staticFile("theboldfont.ttf")}') format('truetype')`,
  );

  await font.load();
  document.fonts.add(font);

  continueRender(waitForFont);
};
