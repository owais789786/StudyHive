# Study Hive

## Project Overview

This project is a React + Express + MongoDB chat application with Socket.IO for real-time messaging. The current implementation has a functional baseline, but there are several architectural issues that make the app hard to maintain, extend, and secure.

---

## Current Architecture

- Frontend: React SPA using Vite, React Router, Tailwind, and Socket.IO client.
- Backend: Express server, MongoDB with Mongoose, JWT authentication, and Socket.IO server.
- Data model: Users, Chat, Message, Invitation, Room.
- Authentication: JWT stored in a cookie, validated via middleware.
- Real-time: Socket.IO events manage user rooms, friend invites, chat messages, and chat joins.

---

## Key Problems and Flaws

### 1. Mixed route and controller responsibilities

- `backend/src/routes/user.route.js` uses a single router for auth, rooms, friends, and chats.
- Controllers (`user.controller.js`, `room.controller.js`, `invitation.controller.js`) mix validation, business logic, and response formatting.
- Resource boundaries are unclear. Example: chat list belongs with chats, not `user.route.js`.

### 2. Poor separation of layers

- No service/repository layer: business logic lives inside controllers and socket events.
- Socket logic and HTTP API logic are not separated cleanly.
- Database logic is mixed with controller and socket logic.

### 3. Inconsistent data modeling

- `Chat` stores `participants` as an array of ObjectIds but `room.controller.js` transforms it into a single participant object for responses.
- `Message.chatId` is a string, while `Chat.chatId` is also a string. This is okay if deliberate, but it is brittle and inconsistent with MongoDB reference style.
- `invitation.modle.js` filename typo suggests general code hygiene issues.

### 4. Socket architecture issues

- Authentication is only handled in HTTP middleware; socket connection has no JWT auth middleware.
- `send_message` writes a message but emits the raw client payload instead of the saved message object.
- Event handlers are registered in components but not centralized. This makes cleanup and reconnection behavior fragile.
- `join_user_room` joins both a personal room and chat rooms, but there is no clear naming or namespace strategy.

### 5. Frontend state and socket handling

- `ChatRoom.jsx` creates one socket instance per mount, without a centralized context/provider.
- `SoloChat.jsx` and `Friends.jsx` each attach event listeners without a common socket lifecycle manager.
- `UserContext.jsx` uses a fixed timeout for loading state and can show errors incorrectly when the API fails.
- No shared API utility for HTTP requests, and fetch calls are spread around the app.
- UI state is combined with network logic in the same components.

### 6. Security and auth concerns

- JWT cookie is set without cookie options (`httpOnly`, `secure`, `sameSite`).
- No refresh token strategy.
- Logout uses token blacklist, which can work but adds complexity. If the cookie is not secured, the blacklist is not enough.
- `auth.middleware.js` returns 500 for invalid/missing token cases instead of using proper status codes for auth errors.

### 7. Inconsistency and maintainability issues

- Some files use `console.log` for errors and some use `winston`.
- The frontend imports `useActionState`, which is not a standard React hook and may cause confusion.
- `room.controller.js` logs `filteredChats` with `console.log`, which indicates debugging code left in production logic.
- There is no README or documentation describing expected folder layout, API contract, or socket event contract.

---

## Recommended Architecture

### Backend best-practices

1. Use a feature-based folder structure:
   - `routes/`
   - `controllers/`
   - `services/`
   - `models/`
   - `middlewares/`
   - `sockets/`
   - `utils/`

2. Separate concerns:
   - Route definitions only route requests.
   - Controllers validate request/response format.
   - Services contain business logic.
   - Repositories or model wrappers handle DB operations.

3. Use resource-specific routes:
   - `api/auth/*`
   - `api/users/*`
   - `api/chats/*`
   - `api/rooms/*`
   - `api/invitations/*`

4. Improve socket architecture:
   - Add Socket.IO auth middleware to verify JWT before connecting.
   - Use namespaced or grouped events (`chat:message`, `chat:join`, `invite:create`).
   - Centralize socket event registration in a `sockets/` module.
   - Emit saved/persisted objects, not raw payloads.

5. Improve models:
   - Use proper references for chat/message relationships.
   - Add indexes on frequently queried fields (`chatId`, `participants`, `sender`).
   - Keep schema fields consistent with usage.

6. Improve error handling:
   - Add error-handling middleware.
   - Return standardized API error responses.
   - Log errors with context.

### Frontend best-practices

1. Create a centralized socket provider:
   - `SocketContext` to manage one socket instance.
   - A custom hook like `useSocket()`.

2. Create an API client:
   - `src/api/axios.js` with base URL, credentials, and interceptors.
   - Feature APIs: `auth.api.js`, `chat.api.js`, `room.api.js`, `invite.api.js`.

3. Use custom hooks for feature state:
   - `useChats()`
   - `useMessages(chatId)`
   - `useInvites()`
   - `useAuth()`

4. Keep UI and data separate:
   - Presentational components only receive props.
   - Container components handle side effects and API/socket interaction.

5. Improve auth flow:
   - Use `httpOnly` tokens where possible.
   - Persist user state in a safe context provider.
   - Handle auth loading / failure states cleanly.

6. Use a shared data model for chat state:
   - Keep chat list, selected chat, and messages in one place.
   - Avoid duplicated state between `SoloChat`, `Friends`, and `ChatRoom`.

---

## Immediate Improvements

- Rename files and fix typos: `invitation.modle.js` → `invitation.model.js`.
- Split `user.route.js` into smaller route files.
- Add `io.use()` JWT validation for sockets in `server.js`.
- In `eventHandler.socket.js`, emit the saved `Message` object after `.create()` and `.populate('sender')`.
- Create `SocketProvider` and move frontend socket creation there.
- Create a shared HTTP client using Axios or `fetch` wrapper.
- Improve error responses in `auth.middleware.js` to use 401/403 where appropriate.
- Remove debug `console.log()` from production controller code.

---

## Suggested Project Structure

### Backend

```
backend/
  src/
    config/
      db.js
      env.js
    controllers/
      auth.controller.js
      chat.controller.js
      invitation.controller.js
      room.controller.js
      user.controller.js
    services/
      auth.service.js
      chat.service.js
      invitation.service.js
      room.service.js
      user.service.js
    routes/
      auth.route.js
      chat.route.js
      invitation.route.js
      room.route.js
      user.route.js
    middlewares/
      auth.middleware.js
      socketAuth.middleware.js
      validation.middleware.js
      errorHandler.middleware.js
    sockets/
      chat.socket.js
      invite.socket.js
      index.js
    models/
      user.model.js
      chat.model.js
      message.model.js
      invitation.model.js
      room.model.js
      blackListed.model.js
    utils/
      logger.js
      apiError.js
  server.js
```

### Frontend

```
frontend/src/
  api/
    axios.js
    auth.api.js
    chat.api.js
    invite.api.js
    room.api.js
  components/
    Chat/
      SoloChat.jsx
      ChatMessage.jsx
      Rooms.jsx
      Friends.jsx
      CreateRoom.jsx
    Common/
      Button.jsx
      Input.jsx
  context/
    AuthContext.jsx
    SocketContext.jsx
  hooks/
    useAuth.js
    useChat.js
    useSocket.js
    useInvites.js
  pages/
    ChatRoom.jsx
    Dashboard.jsx
    Login.jsx
    Signup.jsx
    Loading.jsx
  routes/
    ProtectedRoutes.jsx
    PublicRoutes.jsx
  utils/
    toast.jsx
```

---

## Long-term Improvements

- Add unit tests for controllers and services.
- Add integration tests for auth and socket flows.
- Add validation schemas for API payloads and socket payloads.
- Add monitoring/logging for runtime errors.
- Add pagination for chat messages.
- Add better error experiences in the UI.
- Consider using `shortid` or UUID for `chatId` if user-based string IDs cause collisions.

---

## Final Recommendation

This project will scale much better if you move from "few large mixed files" to a layered, resource-based design. Start by splitting backend routes and socket logic, then centralize frontend state and socket management. That will make each feature easier to maintain, test, and extend.
