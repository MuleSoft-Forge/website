---
title: TypeSafe Connector Sources
description: Polling sources for decision drift, budget thresholds, and provider failovers.
---

# Sources

The connector provides three polling sources for its own governance signals. Business events should still enter through normal Mule sources such as HTTP, Salesforce, Anypoint MQ, or Scheduler.

All three sources require a connector configuration, connection, and Mule scheduling strategy. Their output attributes are null.

## On Drift Detected

Detects a change in no-match rate, mean confidence, or answer distribution. For Choice and Score answers, confidence is the provider value. For Noul answers (which have no confidence field), the recorder uses certainty `|noul − 0.5| × 2` (1 at a clear yes/no, 0 at 0.5) and buckets the distribution as `yes` / `no` / `uncertain`, so Noul-only question sets still drive drift.

| Parameter | Default | Description |
| --- | --- | --- |
| Question set ID | Empty | Limit monitoring to one question set. |
| Question ID | Empty | Limit distribution monitoring to one question. |
| Window size | `500` | Decisions in each comparison window. |
| Baseline | `FIRST_WINDOW` | Compare with the first or previous full window. |
| Max no-match rate increase | `0.10` | Allowed increase above baseline. |
| Max mean confidence drop | `0.10` | Allowed decrease below baseline (includes Noul certainty). |
| Max distribution shift | `0.10` | Jensen–Shannon divergence threshold from 0 to 1. |

Payload:

```json
{
  "metric": "MEAN_CONFIDENCE",
  "baseline": 0.84,
  "current": 0.69,
  "windowSize": 500,
  "questionSetId": "ticket-triage",
  "questionId": "team",
  "windowEnd": 1758996000000
}
```

`windowEnd` is epoch milliseconds (not an ISO-8601 string). At least `min(30, windowSize)` current samples are required. The source fires once per breach and re-arms after recovery.

```xml
<typesafe:on-drift-detected
    config-ref="TypeSafe_Config"
    questionSetId="ticket-triage"
    windowSize="500"
    maxMeanConfidenceDrop="0.10">
    <scheduling-strategy>
        <fixed-frequency frequency="60" timeUnit="SECONDS" />
    </scheduling-strategy>
</typesafe:on-drift-detected>
```

## On Budget Threshold

Fires when calls or input tokens reach a configured percentage of their rolling-window limit.

| Parameter | Default | Description |
| --- | --- | --- |
| Percent | `80` | Percentage at which to fire. |
| Metric | `CALLS` | `CALLS` or `INPUT_TOKENS`. |

Payload:

```json
{
  "metric": "CALLS",
  "used": 806,
  "limit": 1000,
  "percent": 81,
  "threshold": 80,
  "estimatedCostUsd": 0.18,
  "windowStart": 1758996000000
}
```

`windowStart` is the rolling window start as epoch milliseconds (not an ISO-8601 string). `estimatedCostUsd` is derived from configured price per million input tokens and token usage in the window; it may be a small decimal when only a few calls have run. Attributes are null.

The matching budget limit must be set on the global connector configuration.

```xml
<typesafe:on-budget-threshold
    config-ref="TypeSafe_Config"
    percent="80"
    metric="CALLS">
    <scheduling-strategy>
        <fixed-frequency frequency="60" timeUnit="SECONDS" />
    </scheduling-strategy>
</typesafe:on-budget-threshold>
```

## On Provider Failover

Emits each successful fallback after the primary route could not serve a request.

Payload:

```json
{
  "from": "typesafe",
  "to": "openrouter",
  "reason": "FAILOVER",
  "errorType": null,
  "timestamp": 1758996000000
}
```

`timestamp` is epoch milliseconds (not an ISO-8601 string). `errorType` is currently always null. Attributes are null.

The source polls stored failover events using a watermark. Events are recorded only after the fallback successfully answers a stats-enabled decision.

```xml
<typesafe:on-provider-failover config-ref="TypeSafe_Config">
    <scheduling-strategy>
        <fixed-frequency frequency="60" timeUnit="SECONDS" />
    </scheduling-strategy>
</typesafe:on-provider-failover>
```

## Privacy and persistence

Budget and drift stores retain counters and distributions—not state text. Budget and statistics stores are distributed and persistent so monitoring remains consistent across a Mule cluster.
