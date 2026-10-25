---
title: "[Decide] Locate"
description: Ask one TypeSafe Box question and return where a target sits in an image.
---

# [Decide] Locate

Asks one Box question: where in an image is the thing described by the instructions? Use it to crop, redact, or check placement. Box needs Jev 1.14 or later and a route that supports images.

## Inputs

| Parameter | Required | Description |
| --- | :---: | --- |
| State | Yes | JSON state. It must mention each image reference, for example `{ "photo": vars.photoRef }`. |
| Instructions | Yes | What to find, for example "the shipping label in `photo`". Box takes no criteria. |
| Images | Yes | Reference → PNG or JPEG binary, sent as multipart. See [Images](./index#images). |
| Request options | No | Model override, raw response, cache use, and trace step. |

Incoming message attributes are explicit null metadata and are not read.

## Output

The payload is a single Box answer. Edges are fractions of the image from `0` to `1`, measured from the top and from the left. `confidence` may be `null`. The connector adds `derived` geometry computed from the edges. Output attributes contain the shared decision metadata, and `questionSetId` and `questionSetVersion` are null.

Payload from TypeSafe (`jev-1.14.0`), locating a red rectangle in a 320 × 320 PNG:

```json
{
  "type": "box",
  "box": {
    "top": 0.29,
    "bottom": 0.69,
    "left": 0.24,
    "right": 0.75
  },
  "confidence": 0.78,
  "derived": {
    "width": 0.51,
    "height": 0.4,
    "centerX": 0.495,
    "centerY": 0.49,
    "area": 0.204
  }
}
```

Multiply by the image's pixel width and height to crop.

## HTTP call

`POST /{apiVersion}/systemone` as `multipart/form-data`, with the header `TypeSafe-Danger-Zone-Images: true`.

The connector builds one inline question named `result` of type `box`. The API version comes from the connection configuration and defaults to `v1`. OpenRouter, Vercel, and Cloudflare routes raise `TYPESAFE:UNSUPPORTED_BY_PROVIDER` without calling out.

See [TypeSafe Box](https://docs.typesafe.ai/primitives/box) and [TypeSafe images](https://docs.typesafe.ai/images).

## XML example

```xml
<typesafe:locate
    config-ref="TypeSafe_Config"
    instructions="the shipping label in `photo`"
    step="label">
    <typesafe:state>#[output application/json --- { photo: vars.photoRef }]</typesafe:state>
    <typesafe:images>#[{ (vars.photoRef): vars.photo }]</typesafe:images>
</typesafe:locate>
```

## Errors

- `TYPESAFE:INVALID_IMAGE`: the image is not PNG or JPEG, is outside the size or pixel limits, or is not referenced.
- `TYPESAFE:UNSUPPORTED_BY_PROVIDER`: the primary route cannot carry images.

## See also

- [Ask Yes/No](./ask-noul)
- [Evaluate](./evaluate)
- [Connection Get Capabilities](./connection-get-capabilities)
