> [!WARNING]
> **Disclaimer.** This is an independent personal project by eroobeeroo. It is not affiliated with, endorsed by
> or supported by any vehicle manufacturer, equipment supplier or their partners.
>
> Everything in this repository is provided "as is", without warranty of any kind. Changing a vehicle's software,
> electronics or displays can cause malfunctions, distract the driver, void warranties, break local regulations
> and create safety risks. I am not liable for any damage, injury, loss or other consequence arising from the use
> or misuse of anything in this repository. **I do not recommend that anyone try this on their own vehicle**; if
> you do, you do so entirely at your own risk.

# Cluster Info

An app for the BMW iDrive 7 head unit (MGU): a small panel of up to three live values over the Waze map in the
instrument cluster or on the HUD, and turn signal arrows on the HUD. It works with
[Waze on cluster](https://github.com/eroobeeroo/idrive-apps), which puts the map there.

What it shows, its settings and how other apps can give it values are in
[apps/cluster_info/README.md](apps/cluster_info/README.md).

## Installing

Add this repository as a source in the [MGU Store](https://github.com/robertnisipeanu/mgu-store); the head unit
builds the app from it. It also needs:

- **[eroobeeroo/idrive7-apps](https://github.com/eroobeeroo/idrive7-apps) as a source too.** Cluster Info
  requires its GPU renderer (`idrive7-renderd`) and controller gate (`mgu-inputgate`), and the Store installs them
  from there. That repository also has **eDrive Live**, which provides the battery's power (the kW meter) and
  temperature.
- **[Waze on cluster](https://github.com/eroobeeroo/idrive-apps)** for the map the panel sits on.

Cluster Info is in eroobeeroo/idrive7-apps as well. Install it from only one of the two: if both are installed,
the Store adds the second beside the first as a separate app (`cluster_info2`).

## Repository layout

| Path | What |
|---|---|
| `apps/cluster_info/` | the app: `main.js` (its page), `overlay.js` (the panel over the map), `providers.js` (values from other apps), `indicators.js` (turn signals and day / night), `cluster_render_client.js` (the cluster renderer's protocol), `app.json` (manifest, signals and settings) |
| `kit/runtime/` | the app kit's runtime the build bundles into the app (canvas, fonts, gauges, themes, settings, the controller and renderer clients) |
| `kit/platform/`, `kit/localization/` | the package's permissions and the Chinese build's credit |
| `kit/tools/build.py` | builds the app package (with `pack_data.py`, `localize.py`, `make_icon.js`, `oapgen/`) |
| `kit/tools/test_*.js` | the tests |
| `mgu-repo.json` | tells the Store how to build the app and what it requires |

## Development

The tests need Node.js only (no SDK, renderer or car):

```sh
node kit/tools/test_runtime.js
node kit/tools/test_cluster_info_overlay.js
node kit/tools/test_cluster_info.js
```

`python3 kit/tools/build.py cluster_info` builds the package into `dist/`. It needs BMW's oap-sdk in `oap-sdk/`,
taken from your own head unit (see eroobeeroo/idrive7-apps, `kit/tools/extract_sdk.js`). The SDK and the built
packages, which contain it, are never committed. The Store builds on the head unit with the unit's own SDK.

## Origin and license

The app kit (`kit/`) is from [cauliflowermossgrape/idrive7-apps](https://github.com/cauliflowermossgrape/idrive7-apps)
through eroobeeroo/idrive7-apps, where Cluster Info was written. MIT licensed: see [LICENSE](LICENSE). The Chinese
translation's credit is in [NOTICE.zh-CN.md](NOTICE.zh-CN.md); the bundled Noto Sans SC glyphs are under the SIL Open
Font License 1.1 (`kit/runtime/fonts/OFL-NotoSansSC.txt`).
