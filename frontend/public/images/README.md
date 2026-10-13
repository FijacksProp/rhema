# Church website image assets

The logo and event flyers were supplied by the project owner. All active editorial photographs now come from the owner-authorised `C:\Users\HP\Desktop\FIRST SUNDAY` folder. Originals were copied without alteration; Next.js supplies optimised variants at runtime. The three temporary stock photographs have been retired.

## FIRST SUNDAY photographs

| Website asset | Source filename |
| --- | --- |
| `church/hero.jpg` | `_DSC1674.jpg` |
| `church/worship.jpg` | `_DSC1712.jpg` |
| `church/praise.jpg` | `_DSC1621.jpg` |
| `church/gathering.jpg` | `_DSC1716.jpg` |
| `church/choir.jpg` | `_DSC1608.jpg` |
| `church/prayer.jpg` | `_DSC1705.jpg` |
| `church/community.jpg` | `_DSC1630.jpg` |
| `church/reflection.jpg` | `_DSC1683.jpg` |
| `church/teaching.jpg` | `_DSC1689.jpg` |
| `church/singer.jpg` | `_DSC1604.jpg` |
| `church/welcome.jpg` | `_DSC1626.jpg` |
| `church/celebration.jpg` | `_DSC1675.jpg` |

Descriptions identify the activity shown; names and leadership roles are not inferred from photographs. Image focal points are configured in `lib/imagery.ts` for responsive layouts.

## Other owner-supplied church photographs

- `church/intercessory.jpg`: `C:\Users\HP\Downloads\841804606_1124413573894716_5232439196943957516_n.jpg`. Used on the Intercessory department card and detail page.

## African Praise supplied flyers

The owner supplied three flyers in chat: registration/QR, host, and general programme. All confirm the event branding; the host and general flyers show Sunday 25 October 2026 at 8:00 AM. The registration flyer supplies https://forms.gle/aqqJcbjSpxWXpd7M7 .

All three originals were copied without alteration from `C:\Users\HP\Downloads\Telegram Desktop` after the owner supplied the folder:

- `african-praise-main.jpg`: `photo_2026-10-13_19-08-12.jpg`, 1280 × 720. Used for homepage, events, and news features.
- `african-praise-host.jpg`: `photo_2026-10-13_19-08-17.jpg`, 1280 × 721. Used in event details alongside the named host.
- `african-praise-registration.jpg`: `photo_2026-10-13_19-07-43.jpg`, 1280 × 721. Used in the registration section, with a clickable Google Forms link for visitors using a single device.

Each flyer retains its complete artwork and original aspect ratio. `EventPoster` selects the relevant flyer variant. Date, time, host, address, and registration URL are recorded in `lib/african-praise.ts`. The form link was checked read-only; no registration was submitted.

The Google Forms social-preview screenshot is not used as flyer artwork.
