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

The default workspace is the ViralForge Commerce campaign editor with the Local
NLE as the primary editing surface. Sidebar navigation, TikTok-style social
preview, commerce assistant rails, filming guidance, props, and listing assets
stay on the main screen while the legacy top preview and shot strip are removed.

The Local NLE uses the real MP4 footage in `src/assets/video/` as the campaign
media pool, supports drag/drop and reorder, exposes trim, multitrack music,
timeline jump, and CTA controls, previews through Remotion Player, syncs the
TikTok preview from the same timeline clock, persists metadata locally, and
exports a downloadable 9:16 MP4 through Mediabunny.

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

1. Open the ViralForge campaign editor at `/editor` (`/` redirects there).
2. Use the Local NLE Remotion Timeline as the main editor surface.
3. Add campaign shots or imported media into the local timeline.
4. Reorder clips, select a clip, and trim source in/out.
5. Click timeline ruler ticks or enter an exact jump time to seek the editor playhead.
6. Add one or more music beds to the A1 audio lane, adjust selected-bed timing/volume, and edit the CTA overlay shared by preview and export.
7. Scrub or play the Remotion Timeline and watch the TikTok-style Social Preview stay synced to the same playhead.
8. Export a downloadable 9:16 MP4 through the Mediabunny orchestration layer.

The AI People workspace is directly available at `/ai-people`. The standalone
DaVinci-style local editor remains available at `/local-editor` or
`/?workspace=local-nle` for focused NLE regression testing.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Built With

- [React](https://react.dev/)
- [Vite](https://vite.dev/)
- [Remotion](https://www.remotion.dev/) / [@remotion/player](https://www.remotion.dev/docs/player)
- [Mediabunny](https://github.com/Vanilagy/mediabunny)
- [dnd-kit](https://dndkit.com/)
- [React Router](https://reactrouter.com/)
- [Vitest](https://vitest.dev/)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Getting Started

### Prerequisites

- Node.js (recommended: Node 20+)
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

- Use the Local NLE as the primary editor inside the ViralForge campaign workspace.
- Route directly to `/editor`, `/ai-people`, `/wizard`, or `/local-editor`.
- The bundled campaign uses two real MP4s from `src/assets/video/`, split into six 5-second shot cards with generated poster frames under `src/assets/video/posters/`.
- Import local video/audio files into the NLE media pool (metadata is probed with Mediabunny when possible).
- Drag campaign shots or uploaded clips into the local timeline; reorder with drag-and-drop.
- Click timeline ruler ticks or enter an exact jump time to seek the editor playhead.
- Add multiple bundled or imported audio files to the A1 music lane, select an audio clip on the lane, then edit its source start, track start, duration, and volume.
- Trim clip source in/out and edit the CTA overlay.
- Scrub or play the NLE timeline to drive the TikTok-style Social Preview.
- Export a 9:16 MP4 from the timeline without leaving the campaign workspace.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Limitations

- V1 is fully browser-local: no upload, no authentication, no server rendering.
- Uploaded file blobs are session-only. After a hard refresh, saved metadata remains, but uploads show `Reselect required`.
- Source clip audio is muted in v1 export; placed A1 music-bed clips are the supported audio track.
- Primary export target is 9:16 MP4; other aspect ratios are editable project settings.
- Real MP4 export depends on the browser supporting the required AVC/AAC encoding path exposed through Mediabunny.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Documentation

- [Local video editor PRD](docs/PRD.md)
- [AI Generate Studio legacy workflow](docs/AI_GENERATE_STUDIO.md)
- [UGC AI People legacy workflow](docs/UGC_AI_PEOPLE.md)
- [Filming review panel notes](docs/filming-review-panel.md)
- [Local NLE and TikTok preview sync](docs/local-nle-sync.md)
- [App routing](docs/routing.md)

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
