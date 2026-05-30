<a id="readme-top"></a>

# ViralForge PixVerse Campaign Editor

[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]

<!-- PROJECT LOGO / HERO -->
<div align="center">
  <a href="https://github.com/Ducksss/viralforge-pixverse-editor">
    <img src="dist/assets/project-thumb-C2pLYfbq.png" alt="ViralForge thumbnail" width="180" />
  </a>

  <p align="center">
    A browser-local React + Vite campaign editor for commerce sellers.
    <br />
    <a href="docs/PRD.md"><strong>Read the PRD »</strong></a>
    <br />
    <br />
    <a href="#getting-started">Run locally</a>
    ·
    <a href="https://github.com/Ducksss/viralforge-pixverse-editor/issues">Report Bug</a>
    ·
    <a href="https://github.com/Ducksss/viralforge-pixverse-editor/issues">Request Feature</a>
  </p>
</div>

The default workspace is the ViralForge Commerce campaign editor: sidebar navigation, PixVerse campaign preview, social preview, shot strip, commerce assistant rails, product hotspots, frame feedback, props, and listing assets stay on the main screen.

The local NLE is spliced into that existing editor page as a compact Remotion Timeline bay. It uses the real MP4 footage in `src/assets/video/` as the campaign media pool, supports drag/drop and reorder, exposes trim/music/CTA controls, previews through Remotion Player, persists metadata locally, and exports a downloadable 9:16 MP4 through Mediabunny.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Table of Contents

- [About The Project](#about-the-project)
- [Built With](#built-with)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Usage](#usage)
- [Limitations](#limitations)
- [Documentation](#documentation)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)
- [Acknowledgments](#acknowledgments)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## About The Project

![ViralForge editor screenshot](dist/assets/viralforge-main-frame-WLtf7GxS.png)

Core editor flow:

1. Open the default ViralForge campaign workspace at `/`.
2. Keep using the existing preview, social preview, shot strip, right-rail assistant, hotspots, frame feedback, props, and listing panels.
3. Scrub the 30-second assembled source cut built from `src/assets/video/video-1.mp4` and `src/assets/video/video-2.mp4`.
4. Use the embedded Remotion Timeline bay to drag campaign shots or imported media into the local timeline.
5. Reorder clips, select a clip, and trim source in/out.
6. Select a music bed, adjust volume, and edit the CTA overlay shared by preview and export.
7. Preview the local social cut through Remotion Player.
8. Export a downloadable 9:16 MP4 through the Mediabunny orchestration layer.

The standalone DaVinci-style local editor remains available at `/local-editor` or `/?workspace=local-nle` for focused NLE regression testing.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Built With

- [React](https://react.dev/)
- [Vite](https://vite.dev/)
- [Remotion](https://www.remotion.dev/) / [@remotion/player](https://www.remotion.dev/docs/player)
- [Mediabunny](https://github.com/Vanilagy/mediabunny)
- [dnd-kit](https://dndkit.com/)
- [Vitest](https://vitest.dev/)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Getting Started

### Prerequisites

- Node.js (recommended: Node 18+)
- npm

### Installation

```sh
npm install
```

Then start the dev server:

```sh
npm run dev
```

Open `http://127.0.0.1:5173/`.

To validate:

```sh
npm test
npm run build
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Usage

- Use the old ViralForge campaign editor as the primary UI.
- The bundled campaign uses two real MP4s from `src/assets/video/`, split into six 5-second shot cards with generated poster frames under `src/assets/video/posters/`.
- Import local video/audio files into the embedded NLE media pool (metadata is probed with Mediabunny when possible).
- Drag campaign shots or uploaded clips into the local timeline; reorder with drag-and-drop.
- Trim clip source in/out, select a music bed, adjust volume, and edit the CTA overlay.
- Export a 9:16 MP4 from the embedded timeline without leaving the campaign workspace.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Limitations

- V1 is fully browser-local: no upload, no authentication, no server rendering.
- Uploaded file blobs are session-only. After a hard refresh, saved metadata remains, but uploads show `Reselect required`.
- Source clip audio is muted in v1 export; the selected music bed is the supported audio track.
- Primary export target is 9:16 MP4; other aspect ratios are editable project settings.
- Real MP4 export depends on the browser supporting the required AVC/AAC encoding path exposed through Mediabunny.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Documentation

- [Local video editor PRD](docs/PRD.md)
- [AI Generate Studio legacy workflow](docs/AI_GENERATE_STUDIO.md)
- [UGC AI People legacy workflow](docs/UGC_AI_PEOPLE.md)
- [Filming review panel notes](docs/filming-review-panel.md)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Roadmap

See [open issues](https://github.com/Ducksss/viralforge-pixverse-editor/issues) for proposed features (and known issues).

If you want a north-star for scope and follow-ups, start with the [PRD](docs/PRD.md) and the risks/follow-ups section.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also open an issue with the tag "enhancement".

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## License

This project is licensed under the **MIT License** (as declared in `package.json`).

> Tip: consider adding a `LICENSE` file to the repo for maximum clarity.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Contact

Project Link: https://github.com/Ducksss/viralforge-pixverse-editor

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Acknowledgments

- [Best-README-Template](https://github.com/othneildrew/Best-README-Template)
- [Shields.io](https://shields.io/)
- [Remotion](https://www.remotion.dev/)
- [Mediabunny](https://github.com/Vanilagy/mediabunny)
- [dnd-kit](https://dndkit.com/)
- [Vite](https://vite.dev/)

[contributors-shield]: https://img.shields.io/github/contributors/Ducksss/viralforge-pixverse-editor.svg?style=for-the-badge
[contributors-url]: https://github.com/Ducksss/viralforge-pixverse-editor/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/Ducksss/viralforge-pixverse-editor.svg?style=for-the-badge
[forks-url]: https://github.com/Ducksss/viralforge-pixverse-editor/network/members
[stars-shield]: https://img.shields.io/github/stars/Ducksss/viralforge-pixverse-editor.svg?style=for-the-badge
[stars-url]: https://github.com/Ducksss/viralforge-pixverse-editor/stargazers
[issues-shield]: https://img.shields.io/github/issues/Ducksss/viralforge-pixverse-editor.svg?style=for-the-badge
[issues-url]: https://github.com/Ducksss/viralforge-pixverse-editor/issues
[license-shield]: https://img.shields.io/github/license/Ducksss/viralforge-pixverse-editor.svg?style=for-the-badge
[license-url]: https://github.com/Ducksss/viralforge-pixverse-editor/blob/main/package.json
