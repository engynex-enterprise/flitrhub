import type { ChatSession } from "./chat-context";

const MIN = 60 * 1000;
const HOUR = 60 * MIN;

function uid(): string {
  return Math.random().toString(36).slice(2, 10);
}

/** Returns deterministic-looking example chats relative to "now". */
export function buildExampleChats(): ChatSession[] {
  const now = Date.now();

  return [
    {
      peer: {
        id: "masajes-Bogotá-1",
        name: "Alejandra",
        imageUrl: "https://picsum.photos/seed/flitr-18/600/800",
        isOnline: true,
      },
      minimized: true,
      unread: 2,
      messages: [
        {
          id: uid(),
          from: "them",
          text: "¡Hola amor! 😘 Vi que entraste a mi perfil",
          at: now - 4 * HOUR,
        },
        {
          id: uid(),
          from: "me",
          text: "Sí, me interesa saber tu disponibilidad para hoy",
          at: now - 4 * HOUR + 8 * MIN,
        },
        {
          id: uid(),
          from: "them",
          text: "Estoy libre en la tarde y noche, ¿qué horario te queda mejor?",
          at: now - 3 * HOUR,
        },
        {
          id: uid(),
          from: "them",
          text: "¿Quieres que te mande fotos privadas? 💋",
          at: now - 12 * MIN,
        },
      ],
    },
    {
      peer: {
        id: "prepagos-Bogotá-7",
        name: "Valentina",
        imageUrl: "https://picsum.photos/seed/flitr-141/600/800",
        isOnline: true,
      },
      minimized: true,
      unread: 0,
      messages: [
        {
          id: uid(),
          from: "them",
          text: "¡Hola! Estoy disponible hoy",
          at: now - 26 * HOUR,
        },
        {
          id: uid(),
          from: "me",
          text: "Genial, ¿en qué zona estás?",
          at: now - 25 * HOUR,
        },
        {
          id: uid(),
          from: "them",
          text: "Zona Rosa, muy cerca del centro comercial",
          at: now - 25 * HOUR + 3 * MIN,
        },
        {
          id: uid(),
          from: "me",
          text: "Perfecto, te confirmo en un rato",
          at: now - 24 * HOUR,
        },
        {
          id: uid(),
          from: "them",
          text: "Aquí te espero 💕",
          at: now - 24 * HOUR + 1 * MIN,
        },
      ],
    },
    {
      peer: {
        id: "masajes-Bogotá-9",
        name: "Mariana",
        imageUrl: "https://picsum.photos/seed/flitr-122/600/800",
        isOnline: false,
      },
      minimized: true,
      unread: 0,
      messages: [
        {
          id: uid(),
          from: "them",
          text: "Buenas, soy Mariana 👋",
          at: now - 3 * 24 * HOUR,
        },
        {
          id: uid(),
          from: "me",
          text: "Hola Mariana, ¿qué tarifa manejas?",
          at: now - 3 * 24 * HOUR + 10 * MIN,
        },
        {
          id: uid(),
          from: "them",
          text: "Mi tarifa es $300k la hora, incluye masaje completo",
          at: now - 3 * 24 * HOUR + 15 * MIN,
        },
        {
          id: uid(),
          from: "me",
          text: "Te aviso cuando esté listo, gracias",
          at: now - 2 * 24 * HOUR,
        },
        {
          id: uid(),
          from: "them",
          text: "Quedo atenta 💕",
          at: now - 2 * 24 * HOUR + 2 * MIN,
        },
      ],
    },
    {
      peer: {
        id: "trans-Bogotá-2",
        name: "Sofía",
        imageUrl: "https://picsum.photos/seed/flitr-36/600/800",
        isOnline: true,
      },
      minimized: true,
      unread: 1,
      messages: [
        {
          id: uid(),
          from: "them",
          text: "Hola guapo, ¿cómo estás?",
          at: now - 8 * HOUR,
        },
        {
          id: uid(),
          from: "me",
          text: "Hola Sofía, todo bien. ¿Tienes disponibilidad mañana?",
          at: now - 7 * HOUR,
        },
        {
          id: uid(),
          from: "them",
          text: "Claro, mañana en la tarde estoy libre. ¿A qué hora?",
          at: now - 35 * MIN,
        },
      ],
    },
  ];
}
