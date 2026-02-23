---
title: Geospatial Commands — Lettuce Redis Connector
description: Reference for geospatial Redis commands in the Mule Lettuce Redis Connector
---

# Geospatial Commands

Geospatial commands operate on Redis geospatial indexes — sorted sets where each member represents a location with longitude and latitude coordinates. Useful for location-based queries like "find nearby points" or "calculate distance between locations".

This page covers: **GEOADD**, **GEODIST**, **GEOPOS**, **GEOSEARCH**

---

## GEOADD

Add one or more geospatial items (longitude, latitude, name) to a geospatial index.

> 📘 **Redis Reference**: [GEOADD](https://redis.io/docs/latest/commands/geoadd/)

### XML Example

```xml
<lettuce-redis:geoadd doc:name="Add store locations"
    config-ref="Redis_Config"
    key="stores:locations"
    items="#[[
        {name: 'store-downtown', longitude: -122.4194, latitude: 37.7749},
        {name: 'store-airport', longitude: -122.3750, latitude: 37.6213},
        {name: 'store-suburbs', longitude: -122.0842, latitude: 37.3861}
    ]]"
    nx="false"
    xx="false"
    ch="false"/>
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `key` | String | Yes | — | The geospatial index key |
| `items` | List\<GeospatialItem\> | Yes | — | Locations to add. At least one required. Each item has: `name` (String), `longitude` (double), `latitude` (double). |
| `nx` | boolean | No | `false` | Only add new members (do not update existing) |
| `xx` | boolean | No | `false` | Only update existing members (do not add new) |
| `ch` | boolean | No | `false` | Change the return value to count **changed** members instead of **added** members |

**GeospatialItem structure**:
```dataweave
{
  name: "location-name",       // String
  longitude: -122.4194,         // double
  latitude: 37.7749             // double
}
```

### Output

**Type**: `Long`

The number of elements added to the index. When `ch=true`, returns the number of elements added or updated.

### Errors

| Error Type | Condition |
|------------|-----------|
| `REDIS:ARGUMENT` | No items provided, or invalid coordinates |
| `REDIS:COMMAND` | General command execution error |
| `REDIS:WRONG_TYPE` | Key exists but is not a sorted set (geospatial index) |

---

## GEOPOS

Get the longitude and latitude coordinates of one or more members in a geospatial index.

> 📘 **Redis Reference**: [GEOPOS](https://redis.io/docs/latest/commands/geopos/)

### XML Example

```xml
<lettuce-redis:geopos doc:name="Get store positions"
    config-ref="Redis_Config"
    key="stores:locations"
    members="#[['store-downtown', 'store-airport']]"/>

<!-- payload is a List<GeoLocation> -->
<foreach collection="#[payload]">
    <logger level="INFO"
        message="Location: lon=#[payload.longitude], lat=#[payload.latitude]"/>
</foreach>
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `key` | String | Yes | — | The geospatial index key |
| `members` | List\<String\> | Yes | — | Member names to look up. At least one required. Payload by default via `@Content`. |

### Output

**Type**: `List<GeoLocation>`

A list of locations, one for each input member. If a member does not exist, its entry in the list is `null`.

**GeoLocation structure**:
```dataweave
{
  longitude: -122.4194,   // double
  latitude: 37.7749        // double
}
```

### Errors

| Error Type | Condition |
|------------|-----------|
| `REDIS:ARGUMENT` | No members provided |
| `REDIS:COMMAND` | General command execution error |
| `REDIS:WRONG_TYPE` | Key exists but is not a geospatial index |

---

## GEODIST

Calculate the distance between two members in a geospatial index.

> 📘 **Redis Reference**: [GEODIST](https://redis.io/docs/latest/commands/geodist/)

### XML Example

```xml
<lettuce-redis:geodist doc:name="Calculate distance between stores"
    config-ref="Redis_Config"
    key="stores:locations"
    member1="store-downtown"
    member2="store-airport"
    unit="KM"/>

<!-- payload is now the distance in kilometers as a Double -->
<logger level="INFO" message="Distance: #[payload] km"/>
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `key` | String | Yes | — | The geospatial index key |
| `member1` | String | Yes | — | First member |
| `member2` | String | Yes | — | Second member |
| `unit` | DistanceUnit | No | `M` | Unit for the returned distance: `M` (meters), `KM` (kilometers), `FT` (feet), `MI` (miles) |

**DistanceUnit values**: `M`, `KM`, `FT`, `MI`

### Output

**Type**: `Double`

The distance between the two members in the specified unit.

### Errors

| Error Type | Condition |
|------------|-----------|
| `REDIS:COMMAND` | General command execution error |
| `REDIS:WRONG_TYPE` | Key exists but is not a geospatial index |

---

## GEOSEARCH

Search for members in a geospatial index within a specified area.

> 📘 **Redis Reference**: [GEOSEARCH](https://redis.io/docs/latest/commands/geosearch/)

GEOSEARCH is the most complex operation in the connector due to its many configuration options. It supports searching by radius or by box, from a member location or from explicit coordinates, with optional result options (coordinates, distance, geohash).

::: warning Static Configuration Required
The `searchCenter` and `searchBy` parameters are `@Expression(NOT_SUPPORTED)` — they **must** be configured statically in XML. DataWeave expressions cannot be used for these parameters.
:::

### XML Examples

**Search by radius from a member:**

```xml
<lettuce-redis:geosearch doc:name="Find stores near downtown"
    config-ref="Redis_Config"
    key="stores:locations"
    searchCenter="#[{fromMember: 'store-downtown'}]"
    searchBy="#[{byRadius: {radius: 10.0, unit: 'KM'}}]"
    sortOrder="ASC"
    count="5"
    countAny="false">
    <lettuce-redis:search-result-options
        withCoord="false"
        withDist="false"
        withHash="false"/>
</lettuce-redis:geosearch>

<!-- payload is a List<String> of member names -->
```

**Search by radius from coordinates:**

```xml
<lettuce-redis:geosearch doc:name="Find stores near coordinates"
    config-ref="Redis_Config"
    key="stores:locations"
    searchCenter="#[{fromLatLong: {latitude: 37.7749, longitude: -122.4194}}]"
    searchBy="#[{byRadius: {radius: 5.0, unit: 'MI'}}]"
    sortOrder="ASC">
    <lettuce-redis:search-result-options
        withCoord="true"
        withDist="true"
        withHash="false"/>
</lettuce-redis:geosearch>

<!-- payload is a List<Map> with detailed results -->
<foreach collection="#[payload]">
    <logger level="INFO"
        message="Store: #[payload.member], Distance: #[payload.distance] mi, Lat: #[payload.latitude], Lon: #[payload.longitude]"/>
</foreach>
```

**Search by box:**

```xml
<lettuce-redis:geosearch doc:name="Find stores in rectangular area"
    config-ref="Redis_Config"
    key="stores:locations"
    searchCenter="#[{fromLatLong: {latitude: 37.7749, longitude: -122.4194}}]"
    searchBy="#[{byBox: {width: 20.0, height: 15.0, unit: 'KM'}}]"
    sortOrder="NONE">
    <lettuce-redis:search-result-options
        withCoord="false"
        withDist="false"
        withHash="false"/>
</lettuce-redis:geosearch>
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `key` | String | Yes | — | The geospatial index key |
| `searchCenter` | GeoSearchCenter | Yes | — | Origin of the search. See structures below. |
| `searchBy` | GeoSearchBy | Yes | — | Search shape (radius or box). See structures below. |
| `sortOrder` | SortOrder | Yes | — | Sort results by distance: `NONE`, `ASC`, or `DESC` |
| `count` | Integer | No | — | Maximum number of results to return |
| `countAny` | boolean | No | `false` | If true, return any `count` results (not necessarily the closest) |
| `searchResultOptions` | GeoSearchResultOption | Yes | — | What to include in results: `withCoord`, `withDist`, `withHash` |

**GeoSearchCenter** (choose one):

| Type | Structure |
|------|-----------|
| `fromMember` | `{fromMember: "member-name"}` |
| `fromLatLong` | `{fromLatLong: {latitude: 37.7749, longitude: -122.4194}}` |

**GeoSearchBy** (choose one):

| Type | Structure |
|------|-----------|
| `byRadius` | `{byRadius: {radius: 10.0, unit: 'KM'}}` |
| `byBox` | `{byBox: {width: 20.0, height: 15.0, unit: 'KM'}}` |

**GeoSearchResultOption** (parameter group):

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `withCoord` | boolean | `false` | Include coordinates in results |
| `withDist` | boolean | `false` | Include distance from search center in results |
| `withHash` | boolean | `false` | Include geohash integer in results |

**SortOrder values**: `NONE`, `ASC`, `DESC`

**DistanceUnit values** (for radius and box): `M`, `KM`, `FT`, `MI`

### Output

**Type**: `List` (dynamic, resolved by metadata based on `searchResultOptions`)

**When no result options are enabled** (`withCoord=false`, `withDist=false`, `withHash=false`):
- **Type**: `List<String>` — Member names only

**When one or more result options are enabled**:
- **Type**: `List<Map>` — Each element is a map with the following fields:
  - `"member"` → String (always present) — The member name
  - `"latitude"` → Number (if `withCoord=true`) — Latitude coordinate
  - `"longitude"` → Number (if `withCoord=true`) — Longitude coordinate
  - `"distance"` → Number (if `withDist=true`) — Distance from search center
  - `"hash"` → Number (if `withHash=true`) — Geohash value

### Errors

| Error Type | Condition |
|------------|-----------|
| `REDIS:ARGUMENT` | Invalid search parameters |
| `REDIS:COMMAND` | General command execution error |
| `REDIS:WRONG_TYPE` | Key exists but is not a geospatial index |

### Complete Example: Nearby Store Finder

```xml
<flow name="find-nearby-stores">
    <http:listener config-ref="HTTP_Config" path="/stores/nearby"/>

    <!-- Input: lat, lon, radiusKm from query params -->
    <lettuce-redis:geosearch doc:name="Search nearby stores"
        config-ref="Redis_Config"
        key="stores:locations"
        searchCenter="#[{fromLatLong: {
            latitude: attributes.queryParams.lat,
            longitude: attributes.queryParams.lon
        }}]"
        searchBy="#[{byRadius: {
            radius: attributes.queryParams.radiusKm,
            unit: 'KM'
        }}]"
        sortOrder="ASC"
        count="10">
        <lettuce-redis:search-result-options
            withCoord="true"
            withDist="true"
            withHash="false"/>
    </lettuce-redis:geosearch>

    <!-- Transform results to JSON API response -->
    <ee:transform>
        <ee:message>
            <ee:set-payload><![CDATA[%dw 2.0
output application/json
---
{
    stores: payload map {
        id: $.member,
        distance_km: $.distance,
        coordinates: {
            lat: $.latitude,
            lon: $.longitude
        }
    }
}]]></ee:set-payload>
        </ee:message>
    </ee:transform>
</flow>
```
