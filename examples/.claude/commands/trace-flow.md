---
name: trace-flow
description: Trace code flow with business context from docs
arguments:
  - name: target
    description: Function name, endpoint, or file to trace from
    required: true
---

# Trace Flow: $ARGUMENTS.target

You are tracing code flow to understand how `$ARGUMENTS.target` works, with business context from documentation.

## Step 1: Find Entry Point

Locate `$ARGUMENTS.target` in the codebase:
- Search for function/method name
- Search for API endpoint
- Search for file path

Report:
```
ENTRY POINT FOUND:
→ [type] [name] ([file path]:[line number])
```

## Step 2: Map Call Chain

Trace all function calls from entry point:
- Follow function calls depth-first
- Note file and line number for each
- Stop at external libraries/APIs

Report as tree:
```
CALL CHAIN:
[entry point]
  → [function1]()         ([file]:[line])
    → [function2]()       ([file]:[line])
      → [function3]()     ([file]:[line])
    → [function4]()       ([file]:[line])
  → [function5]()         ([file]:[line])
```

## Step 3: Find Related Documentation

Search `./docs/` for features related to this flow:
1. Match function/endpoint names to feature folders
2. Search for keywords in spec.md files

For each related feature, extract relevant business rules from spec.md.

Report:
```
RELATED BUSINESS RULES:
From ./docs/[feature]/spec.md:
- [Rule 1]
- [Rule 2]
- [Rule 3]
```

## Step 4: Identify Data Flow

Track data through the call chain:
- What parameters are passed
- What is returned
- Where data is transformed

Report:
```
DATA FLOW:
Input: [describe input data]
  → [function1]: [transformation]
  → [function2]: [transformation]
Output: [describe output data]
```

## Step 5: Flag Potential Issues

Based on code and docs, identify:
- Places where code might not match documented rules
- Complex logic that could hide bugs
- Missing error handling
- Potential race conditions

Report:
```
POTENTIAL ISSUE AREAS:
- [function](): [concern]
- [function](): [concern]
```

## Step 6: Summary

Provide concise summary:
- What this flow does (1-2 sentences)
- Key business rules that apply
- Suggested areas to investigate (if debugging)
