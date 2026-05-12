import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc,
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  serverTimestamp,
  onSnapshot
} from 'firebase/firestore';
import { db, auth } from '../lib/firebase';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// User Profile
export const getOrCreateUserProfile = async (user: any) => {
  const userDocRef = doc(db, 'users', user.uid);
  try {
    const userDoc = await getDoc(userDocRef);
    if (!userDoc.exists()) {
      const newUser = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        rhythmStreak: 0,
        totalFocusHours: 0,
        nurtureLevel: 42,
        growthEnergy: 124500,
        lastUpdated: serverTimestamp()
      };
      await setDoc(userDocRef, newUser);
      return newUser;
    }
    return userDoc.data();
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, `users/${user.uid}`);
  }
};

// Generic CRUD helpers
export const subscribeToCollection = (collectionName: string, callback: (data: any[]) => void) => {
  if (!auth.currentUser) return () => {};
  
  const q = query(
    collection(db, collectionName), 
    where('userId', '==', auth.currentUser.uid),
    orderBy('createdAt', 'desc')
  );

  return onSnapshot(q, (snapshot) => {
    const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(items);
  }, (error) => {
    handleFirestoreError(error, OperationType.LIST, collectionName);
  });
};

// Tasks
export const createTask = async (task: any) => {
  if (!auth.currentUser) return;
  const path = 'tasks';
  try {
    return await addDoc(collection(db, path), {
      ...task,
      userId: auth.currentUser.uid,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
};

export const updateTask = async (id: string, updates: any) => {
  const docRef = doc(db, 'tasks', id);
  try {
    await updateDoc(docRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `tasks/${id}`);
  }
};

export const deleteTask = async (id: string) => {
  const docRef = doc(db, 'tasks', id);
  try {
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `tasks/${id}`);
  }
};

// Thoughts
export const createThought = async (thought: any) => {
  if (!auth.currentUser) return;
  const path = 'thoughts';
  try {
    return await addDoc(collection(db, path), {
      ...thought,
      userId: auth.currentUser.uid,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
};

export const updateThought = async (id: string, updates: any) => {
  const docRef = doc(db, 'thoughts', id);
  try {
    await updateDoc(docRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `thoughts/${id}`);
  }
};

// Focus Sessions
export const logFocusSession = async (session: any) => {
  if (!auth.currentUser) return;
  const path = 'focus_sessions';
  try {
    return await addDoc(collection(db, path), {
      ...session,
      userId: auth.currentUser.uid,
      createdAt: serverTimestamp()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
};

// Growth Areas
export const syncGrowthArea = async (area: any) => {
  if (!auth.currentUser) return;
  const path = 'growth_areas';
  try {
    if (area.id) {
        const docRef = doc(db, path, area.id);
        await updateDoc(docRef, {
            ...area,
            updatedAt: serverTimestamp()
        });
    } else {
        await addDoc(collection(db, path), {
            ...area,
            userId: auth.currentUser.uid,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        });
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
};

// Reflections / Journal
export const logReflection = async (reflection: any) => {
  if (!auth.currentUser) return;
  const path = 'reflections';
  try {
    return await addDoc(collection(db, path), {
      ...reflection,
      userId: auth.currentUser.uid,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
};

// Sound Preferences
export const syncSoundPreferences = async (prefs: any) => {
  if (!auth.currentUser) return;
  const userDocRef = doc(db, 'users', auth.currentUser.uid);
  try {
    await updateDoc(userDocRef, {
      soundPreferences: prefs,
      lastUpdated: serverTimestamp()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `users/${auth.currentUser.uid}`);
  }
};
