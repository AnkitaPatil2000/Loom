# Security Spec for Loom

## Data Invariants
1. A task must belong to a user.
2. A user can only read and write their own data (tasks, thoughts, sessions, growth areas).
3. Timestamps like `createdAt` must be set by the server.
4. User profiles (`users/{userId}`) can only be managed by the owner.
5. `userId` in any document must match the authenticated `request.auth.uid`.

## The Dirty Dozen Payloads

1. **Identity Spoofing (Create)**: Attempting to create a task with `userId` of another user.
2. **Identity Spoofing (Update)**: Attempting to change `userId` of an existing thought.
3. **Ghost Field Injection**: Adding `isAdmin: true` to a user profile.
4. **Malicious ID Injection**: Using a 1MB string as a document ID.
5. **Unauthorized Read**: User A attempting to `get` a thought belonging to User B.
6. **Unauthorized List**: User A attempting to `list` tasks without a `where('userId', '==', UserA_UID)` filter.
7. **Temporal Fraud (Create)**: Setting `createdAt` to a date in the future instead of `request.time`.
8. **Temporal Fraud (Update)**: Changing `createdAt` after it has been set.
9. **State Shortcut**: Changing a task status from `pending` to `completed` while also changing the `userId`.
10. **Resource Exhaustion**: Sending a 1MB string in the `title` field.
11. **Orphaned Record**: Creating a task for a userId that does not have a corresponding user document (though in our case auth is the source of truth, we can still check the users collection if we want strictly).
12. **PII Leak**: Attempting to read another user's email via a list query.

## Test Runner (Draft)

```ts
// firestore.rules.test.ts (Pseudo-code)
// - Verify User A cannot read User B's thoughts.
// - Verify Task creation without userId matching request.auth.uid fails.
// - Verify Task creation with future createdAt fails.
// - Verify User profile update with isAdmin field fails.
```
